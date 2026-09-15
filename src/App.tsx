import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  StudentEntry, 
  Suggestion, 
  NavigationTab, 
  EmailDispatchAlert 
} from './types';
import { INITIAL_STUDENTS, INITIAL_SUGGESTIONS } from './data/initialData';
import { Header } from './components/Header';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { GmailAlertModal } from './components/GmailAlertModal';
import { PublicDashboard } from './components/PublicDashboard';
import { ManagementPanel } from './components/ManagementPanel';
import { WarningRegistry } from './components/WarningRegistry';
import { SuggestionsBoard } from './components/SuggestionsBoard';
import { AboutJourney } from './components/AboutJourney';
import { WelcomeAnimation } from './components/WelcomeAnimation';
import { ShieldCheck, Heart, Lock, Unlock } from 'lucide-react';
import { fetchRemoteData, saveSuggestionsToRemote, saveStudentsToRemote } from './utils/api';

const STORAGE_KEYS = {
  STUDENTS: 'upss_c32_students_v2',
  SUGGESTIONS: 'upss_c32_suggestions_v1',
  TEACHER_EMAIL: 'upss_c32_teacher_email_v1',
};

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Welcome animation intro splash
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  // Security / Password modal state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [pendingTabAfterAuth, setPendingTabAfterAuth] = useState<NavigationTab | null>(null);

  // Teacher email address configuration (saved locally)
  const [teacherEmail, setTeacherEmail] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEACHER_EMAIL);
    if (saved && saved !== 'teacher@usmanschool.edu.pk') {
      return saved;
    }
    return 'ayeshakhan2907@yahoo.com';
  });

  // 3-times & 4-times email dispatch alert
  const [emailAlert, setEmailAlert] = useState<EmailDispatchAlert | null>(null);

  // Global persistent state for students: STRICTLY NO PRE-ADDED STUDENTS
  const [students, setStudents] = useState<StudentEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Strictly exclude any pre-added dummy mock students
          const userOnly = parsed.filter(
            (s) =>
              s &&
              s.id &&
              !['upss-1', 'upss-2', 'upss-3', 'upss-4', 'upss-5'].includes(s.id) &&
              !['ayesha tariq', 'fatima zahra', 'zainab bilal', 'maryam ahmed', 'hafsa noor'].includes(
                s.name?.trim().toLowerCase()
              )
          );
          return userOnly;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved students:', e);
    }
    return [];
  });

  // Global persistent state for suggestions (saved locally in browser storage)
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved suggestions:', e);
    }
    return INITIAL_SUGGESTIONS;
  });

  // Background synchronization without overwriting local user submissions
  useEffect(() => {
    let isMounted = true;

    const loadRemote = async () => {
      const remote = await fetchRemoteData();
      if (!isMounted) return;

      if (remote.suggestions && Array.isArray(remote.suggestions) && remote.suggestions.length > 0) {
        setSuggestions((currentLocal) => {
          // Preserve all current local suggestions; only append new ones from server
          const localIds = new Set(currentLocal.map((s) => s.id));
          const newFromRemote = remote.suggestions!.filter((s) => !localIds.has(s.id));
          if (newFromRemote.length > 0) {
            const merged = [...currentLocal, ...newFromRemote];
            try {
              localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(merged));
            } catch {}
            return merged;
          }
          return currentLocal;
        });
      }
      if (remote.students && Array.isArray(remote.students) && remote.students.length > 0) {
        setStudents((currentLocal) => {
          if (currentLocal.length > 0) return currentLocal;
          return remote.students!;
        });
      }
    };

    // Load on open
    loadRemote();

    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SUGGESTIONS && e.newValue) {
        try {
          setSuggestions(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === STORAGE_KEYS.STUDENTS && e.newValue) {
        try {
          setStudents(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === STORAGE_KEYS.TEACHER_EMAIL && e.newValue) {
        setTeacherEmail(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sync students to localStorage & Remote API
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage:', e);
    }
    saveStudentsToRemote(students);
  }, [students]);

  // Sync suggestions to localStorage & Remote API
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(suggestions));
    } catch (e) {
      console.error('Failed to save suggestions to localStorage:', e);
    }
    saveSuggestionsToRemote(suggestions);
  }, [suggestions]);

  // Handle Admin Authorization Request
  const handleRequestAdmin = (destinationTab: NavigationTab = 'management') => {
    if (isAdminUnlocked) {
      setActiveTab(destinationTab);
    } else {
      setPendingTabAfterAuth(destinationTab);
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAdminUnlocked(true);
    if (pendingTabAfterAuth) {
      setActiveTab(pendingTabAfterAuth);
      setPendingTabAfterAuth(null);
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    if (activeTab === 'management') {
      setActiveTab('dashboard');
    }
  };

  // Save teacher email
  const handleUpdateTeacherEmail = (email: string) => {
    setTeacherEmail(email);
    localStorage.setItem(STORAGE_KEYS.TEACHER_EMAIL, email);
  };

  // Check and trigger Teacher Gmail Alert when student hits 3 (or more) lates
  const triggerGmailAlertIfApplicable = (student: StudentEntry) => {
    if (student.lateCount >= 3) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toISOString().split('T')[0];
      
      const recipient = teacherEmail || 'ayeshakhan2907@yahoo.com';
      const isCritical = student.lateCount >= 4;

      setEmailAlert({
        id: `alert-${Date.now()}`,
        studentName: student.name,
        classNum: student.classNum,
        section: student.section,
        lateCount: student.lateCount,
        timestamp: `${dateStr} ${timeStr}`,
        recipient: recipient,
        teacherEmail: recipient,
        mailSubject: isCritical
          ? `[DISCIPLINE ESCALATION] ${student.lateCount}th Late Record &bull; ${student.name.toUpperCase()} (Class ${student.classNum}-${student.section})`
          : `[3-TIMES LATE WARNING] Teacher Punctuality Notice &bull; ${student.name.toUpperCase()} (Class ${student.classNum}-${student.section})`,
        mailBody: `Assalamu Alaikum wa Rahmatullah,

Respected Teacher / Class Incharge,

This is an automated alert confirming that student ${student.name.toUpperCase()} of Class ${student.classNum}, Section ${student.section} has reached ${student.lateCount} late arrivals at Usman Public School System (Campus 32).

STUDENT LEDGER DETAILS:
- Student Name: ${student.name.toUpperCase()}
- Class & Section: Class ${student.classNum}-${student.section}
- Total Late Incidents: ${student.lateCount}
- Latest Incident Date: ${dateStr} at ${timeStr}
- Status: Warning Registry (Campus 32 Disciplinary Rule #1)

NEXT PROTOCOL:
1. Review student's attendance punctuality ledger.
2. Direct telephonic counseling with parents/guardians.
3. Once completed, mark student as "Checked" in the Warning Registry.

Campus 32 Punctuality & Gate Administration Portal`,
      });
    }
  };

  // Smart Duplicate Merging & Addition Logic
  const handleAddOrMergeStudent = (entry: {
    name: string;
    classNum: number;
    section: string;
    date: string;
  }) => {
    const normalizedName = entry.name.trim().toLowerCase();
    const existingIndex = students.findIndex(
      (s) => s.name.trim().toLowerCase() === normalizedName
    );

    let updatedList = [...students];
    let isMerged = false;
    let finalStudent: StudentEntry;

    if (existingIndex >= 0) {
      // Duplicate found: Increment existing late count quantity and update date
      const existing = students[existingIndex];
      const newCount = existing.lateCount + 1;
      const newHistory = [...existing.datesHistory];
      if (!newHistory.includes(entry.date)) {
        newHistory.push(entry.date);
      }

      finalStudent = {
        ...existing,
        lateCount: newCount,
        classNum: entry.classNum, // update to latest class if modified
        section: entry.section,
        lastDate: entry.date,
        datesHistory: newHistory,
      };

      updatedList[existingIndex] = finalStudent;
      isMerged = true;
    } else {
      // New student record
      finalStudent = {
        id: `upss-std-${Date.now()}`,
        name: normalizedName,
        classNum: entry.classNum,
        section: entry.section,
        lateCount: 1,
        lastDate: entry.date,
        datesHistory: [entry.date],
      };
      updatedList.push(finalStudent);
    }

    setStudents(updatedList);

    // If student count hits 4 or more, trigger Gmail dispatch notice
    triggerGmailAlertIfApplicable(finalStudent);

    return {
      merged: isMerged,
      newCount: finalStudent.lateCount,
      student: finalStudent,
    };
  };

  // Update late count manually from admin panel (+1 or -1)
  const handleUpdateLateCount = (id: string, delta: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newCount = Math.max(1, s.lateCount + delta);
          const updated = { ...s, lateCount: newCount };
          if (delta > 0 && newCount >= 4) {
            triggerGmailAlertIfApplicable(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Delete student manually from admin panel
  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Warning Registry "Checked" Auto-Deletion Workflow
  const handleCheckAndDeleteStudent = (id: string, _name: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Reset demo seed data
  const handleResetSeedData = () => {
    setStudents(INITIAL_STUDENTS);
    setSuggestions(INITIAL_SUGGESTIONS);
  };

  // Suggestion actions (strictly stored locally)
  const handleAddSuggestion = (newSug: Omit<Suggestion, 'id' | 'createdAt' | 'upvotes'>) => {
    const today = new Date().toISOString().split('T')[0];
    const suggestionItem: Suggestion = {
      ...newSug,
      id: `sug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: today,
      upvotes: 1,
    };
    setSuggestions((prev) => {
      const updated = [suggestionItem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save suggestion to localStorage:', e);
      }
      return updated;
    });
  };

  const handleUpvoteSuggestion = (id: string) => {
    setSuggestions((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s));
      try {
        localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteSuggestion = (id: string) => {
    setSuggestions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
  }, []);

  const warningCount = students.filter((s) => s.lateCount === 3).length;

  return (
    <div className="min-h-screen bg-[#f7f9f7] text-[#1a2e22] flex flex-col font-sans relative">
      {/* Starting Welcome Animation Splash */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeAnimation onComplete={handleWelcomeComplete} />
        )}
      </AnimatePresence>

      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminUnlocked={isAdminUnlocked}
        onLockAdmin={handleLockAdmin}
        onRequestAdmin={() => handleRequestAdmin('management')}
        warningCount={warningCount}
        totalLateCount={students.length}
      />

      {/* Main Content Area: Spacious, open, comfortable layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PublicDashboard
                students={students}
                onOpenManagement={() => handleRequestAdmin('management')}
                onSelectWarningTab={() => setActiveTab('warning')}
                isAdminUnlocked={isAdminUnlocked}
              />
            </motion.div>
          )}

          {activeTab === 'management' && (
            <motion.div
              key="management"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ManagementPanel
                students={students}
                onAddOrMergeStudent={handleAddOrMergeStudent}
                onUpdateLateCount={handleUpdateLateCount}
                onDeleteStudent={handleDeleteStudent}
                onResetSeedData={handleResetSeedData}
                onLockAdmin={handleLockAdmin}
                onNotifyTeacher={triggerGmailAlertIfApplicable}
              />
            </motion.div>
          )}

          {activeTab === 'warning' && (
            <motion.div
              key="warning"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <WarningRegistry
                students={students}
                onCheckAndDeleteStudent={handleCheckAndDeleteStudent}
                onNavigateToManagement={() => handleRequestAdmin('management')}
                onNotifyTeacher={triggerGmailAlertIfApplicable}
                teacherEmail={teacherEmail}
              />
            </motion.div>
          )}

          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SuggestionsBoard
                suggestions={suggestions}
                onAddSuggestion={handleAddSuggestion}
                onUpvoteSuggestion={handleUpvoteSuggestion}
                onDeleteSuggestion={handleDeleteSuggestion}
                isAdminUnlocked={isAdminUnlocked}
              />
            </motion.div>
          )}

          {activeTab === 'journey' && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AboutJourney />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Side Management Quick-Dock Tab (Prominently at the side) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 hidden sm:block">
        <button
          id="side-management-dock"
          onClick={() => handleRequestAdmin('management')}
          className={`group flex items-center shadow-2xl transition-all duration-300 rounded-l-2xl border-l-2 border-t-2 border-b-2 cursor-pointer ${
            activeTab === 'management'
              ? 'bg-amber-400 text-emerald-950 border-amber-500 py-4 pl-3.5 pr-2.5 ring-4 ring-amber-400/30'
              : isAdminUnlocked
              ? 'bg-emerald-900 hover:bg-emerald-850 text-amber-200 border-amber-500/50 py-3.5 pl-3 pr-2 hover:pl-4'
              : 'bg-emerald-950 hover:bg-emerald-900 text-amber-300 border-amber-500/40 py-3.5 pl-3 pr-2 hover:pl-4'
          }`}
          title={isAdminUnlocked ? 'Open Management Panel (Active)' : 'Open Management Panel (Admin Authentication)'}
        >
          <div className="flex flex-col items-center gap-1.5">
            {isAdminUnlocked ? (
              <Unlock className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[11px] font-bold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180 select-none py-1">
              Management
            </span>
            {activeTab === 'management' ? (
              <span className="w-2 h-2 rounded-full bg-emerald-950"></span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60"></span>
            )}
          </div>
        </button>
      </div>

      {/* Global Modals */}
      <AdminPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingTabAfterAuth(null);
        }}
        onSuccess={handlePasswordSuccess}
      />

      <GmailAlertModal
        alert={emailAlert}
        onClose={() => setEmailAlert(null)}
        defaultTeacherEmail={teacherEmail}
        onUpdateTeacherEmail={handleUpdateTeacherEmail}
      />

      {/* School Footer */}
      <footer className="bg-emerald-950 text-emerald-200/90 border-t-2 border-amber-500 py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
              32
            </div>
            <div>
              <p className="font-bold text-white font-serif text-sm">
                Usman Public School System (Campus 32)
              </p>
              <p className="text-emerald-300 text-[11px]">
                Nazimabad No. 4, Karachi &bull; Tel: 021-37445245 &bull; Girls Only (Class VI - X)
              </p>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-emerald-300/80 space-y-1">
            <p>Late Student Management & Punctuality Discipline Platform</p>
            <p className="text-amber-300 font-medium">
              "Taqwa &bull; Seerat e Tayyaba &bull; Enjoining Good & Forbidding Evil"
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
