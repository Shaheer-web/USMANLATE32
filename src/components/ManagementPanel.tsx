import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Plus, 
  Minus, 
  Calendar, 
  Lock, 
  ShieldAlert, 
  Sparkles,
  Search,
  Filter,
  Mail
} from 'lucide-react';
import { StudentEntry } from '../types';

interface ManagementPanelProps {
  students: StudentEntry[];
  onAddOrMergeStudent: (entry: {
    name: string;
    classNum: number;
    section: string;
    date: string;
  }) => { merged: boolean; newCount: number; student: StudentEntry };
  onUpdateLateCount: (id: string, delta: number) => void;
  onDeleteStudent: (id: string) => void;
  onResetSeedData: () => void;
  onLockAdmin: () => void;
  onNotifyTeacher?: (student: StudentEntry) => void;
}

export const ManagementPanel: React.FC<ManagementPanelProps> = ({
  students,
  onAddOrMergeStudent,
  onUpdateLateCount,
  onDeleteStudent,
  onResetSeedData,
  onLockAdmin,
  onNotifyTeacher,
}) => {
  // Form fields
  const [name, setName] = useState('');
  const [classNum, setClassNum] = useState<string>('9');
  const [section, setSection] = useState('A');
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Validation warnings & feedback
  const [nameError, setNameError] = useState('');
  const [sectionError, setSectionError] = useState('');
  const [classError, setClassError] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'merge' | 'error';
    text: string;
  } | null>(null);

  // Search & filter inside management panel table
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time validation for Student Name: strictly lowercase letters and spaces [a-z ]
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Check if user attempted to type uppercase or non-alphabetic/symbols
    const hasDisallowed = /[^a-z ]/.test(rawVal);
    
    if (hasDisallowed) {
      setNameError('Blocked invalid characters. Only lowercase letters (a-z) and spaces are allowed.');
    } else {
      setNameError('');
    }

    // Strictly enforce: keep only lowercase and spaces
    const sanitized = rawVal.toLowerCase().replace(/[^a-z ]/g, '');
    setName(sanitized);
  };

  // Real-time validation for Section: single uppercase character ^[A-Z]{1}$
  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const sanitized = rawVal.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
    
    if (rawVal && !/^[A-Z]$/i.test(rawVal)) {
      setSectionError('Section must be a single uppercase letter (A-Z).');
    } else {
      setSectionError('');
    }

    setSection(sanitized);
  };

  // Real-time validation for Class: only numbers
  const handleClassChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setClassNum(val);
    if (!val) {
      setClassError('Class is required and must be a number.');
    } else {
      setClassError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Student name is required.');
      return;
    }

    if (!/^[a-z ]+$/.test(trimmedName)) {
      setNameError('Student name must strictly contain only lowercase letters and spaces.');
      return;
    }

    const numClass = parseInt(classNum, 10);
    if (isNaN(numClass) || numClass < 1 || numClass > 12) {
      setClassError('Please enter a valid class number (e.g. 6 to 10 for Campus 32).');
      return;
    }

    if (!/^[A-Z]{1}$/.test(section)) {
      setSectionError('Section must be exactly 1 uppercase letter (e.g., A, B, C).');
      return;
    }

    if (!date) {
      setNotification({ type: 'error', text: 'Please select a valid numerical date.' });
      return;
    }

    // Execute add/merge
    const result = onAddOrMergeStudent({
      name: trimmedName,
      classNum: numClass,
      section: section,
      date: date,
    });

    if (result.merged) {
      setNotification({
        type: 'merge',
        text: `Duplicate matched for "${trimmedName}". Existing record updated: Late count incremented to ${result.newCount}.`,
      });
    } else {
      setNotification({
        type: 'success',
        text: `New late entry added for student "${trimmedName}" (Count: 1).`,
      });
    }

    // Reset name field, retain date & class/sec for quick continuous entry
    setName('');
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `class ${s.classNum}`.includes(searchQuery.toLowerCase()) ||
      s.section.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner with Admin Controls */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-5 shadow-lg border border-emerald-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider">
              Authorized Session
            </span>
            <span className="text-xs text-emerald-300">Administrator Authenticated</span>
          </div>
          <h2 className="text-xl font-bold font-serif mt-1 text-white">
            Administrative Management Panel
          </h2>
          <p className="text-xs text-emerald-200">
            Record morning late entries with real-time duplicate merging and automated warning triggers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {students.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all student late records? This cannot be undone.')) {
                  onResetSeedData();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-rose-900/80 text-emerald-200 hover:text-white text-xs font-semibold border border-emerald-700/60 hover:border-rose-500/60 transition flex items-center gap-1.5 cursor-pointer"
              title="Clear all recorded entries"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear All Records</span>
            </button>
          )}
          <button
            onClick={onLockAdmin}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            title="Lock administrative panel"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Admin Panel</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
            notification.type === 'merge'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {notification.type === 'merge' ? (
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
          ) : notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <div>
            <p className="font-semibold">
              {notification.type === 'merge' ? 'Smart Duplicate Merged & Incremented' : 'Action Completed'}
            </p>
            <p className="text-xs opacity-90">{notification.text}</p>
          </div>
        </motion.div>
      )}

      {/* Grid: Form on Left/Top, Quick Summary on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ADD ENTRY FORM */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500"></div>

          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-emerald-950 font-serif">Add Student Late Entry</h3>
              <p className="text-xs text-slate-500">Strict validation rules applied per school system standard</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Student Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  regex: [a-z ]+ only
                </span>
              </div>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. fatima zahra (lowercase only)"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  nameError 
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40 text-slate-800' 
                    : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100 bg-slate-50/50'
                }`}
                required
              />
              {nameError ? (
                <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{nameError}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  Uppercase characters and symbols are automatically filtered in real time.
                </p>
              )}
            </div>

            {/* Row: Class & Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* Field: Class (Numbers only) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Class <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                    Numbers only
                  </span>
                </div>
                <select
                  value={classNum}
                  onChange={handleClassChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none cursor-pointer"
                >
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
                {classError && <p className="text-xs text-rose-600 mt-1">{classError}</p>}
              </div>

              {/* Field: Section (Single uppercase character) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Section <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                    ^[A-Z]&#123;1&#125;$
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={1}
                  value={section}
                  onChange={handleSectionChange}
                  placeholder="A"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm uppercase text-center font-bold font-mono transition focus:outline-none focus:ring-2 ${
                    sectionError
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40 text-slate-800'
                      : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100 bg-slate-50/50'
                  }`}
                  required
                />
                {sectionError && <p className="text-xs text-rose-600 mt-1">{sectionError}</p>}
              </div>
            </div>

            {/* Field: Date (Dedicated numerical date format selector) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Late Incident Date <span className="text-rose-500">*</span></span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  YYYY-MM-DD
                </span>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none cursor-pointer"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Numerical date format stored for incident audit trails.
              </p>
            </div>

            {/* Explanatory Duplicate Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1">
              <div className="font-semibold flex items-center gap-1 text-emerald-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Smart Duplicate Merging Active</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Entering an existing student’s name automatically increments their late count (<code className="bg-emerald-100 px-1 rounded text-emerald-900 font-mono">count + 1</code>) without duplicating rows. Hitting 4+ automatically triggers the administrative dispatch simulation.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>Submit Student Late Record</span>
            </button>
          </form>
        </div>

        {/* ADMIN REGISTRY DIRECTORY TABLE & CONTROLS */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/10 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-emerald-950 font-serif">Quick Incident Adjustments</h3>
              <p className="text-xs text-slate-500">Live directory of all registered records ({students.length})</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
                Total: {students.reduce((acc, s) => acc + s.lateCount, 0)} lates
              </span>
            </div>
          </div>

          {/* Quick Filter */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or class..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-emerald-600 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Student list */}
          <div className="flex-1 overflow-y-auto max-h-[460px] space-y-2 pr-1">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-14 px-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                <UserPlus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  {students.length === 0 ? 'No late student records logged yet' : 'No matching student records found'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {students.length === 0
                    ? 'Use the "Record Morning Late Arrival" form on the left to add your first student.'
                    : 'Clear your search query to see all students.'}
                </p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isWarning = student.lateCount >= 3;
                return (
                  <div
                    key={student.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      student.lateCount >= 4
                        ? 'bg-rose-50/60 border-rose-200'
                        : isWarning
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 font-mono truncate">
                          {student.name}
                        </span>
                        {isWarning && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                              student.lateCount >= 4
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-500 text-emerald-950'
                            }`}
                          >
                            {student.lateCount >= 4 ? '4+ Alert' : '3-Times Alert'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>Class {student.classNum}-{student.section}</span>
                        <span>&bull;</span>
                        <span>Latest: {student.lastDate}</span>
                      </div>
                    </div>

                    {/* Counter Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isWarning && onNotifyTeacher && (
                        <button
                          type="button"
                          onClick={() => onNotifyTeacher(student)}
                          className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 transition cursor-pointer"
                          title={`Send Gmail notification to teacher for ${student.name}`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
                        <button
                          onClick={() => onUpdateLateCount(student.id, -1)}
                          disabled={student.lateCount <= 1}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
                          title="Decrease late count"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold font-mono text-emerald-950 bg-slate-50 min-w-[28px] text-center">
                          {student.lateCount}
                        </span>
                        <button
                          onClick={() => onUpdateLateCount(student.id, 1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          title="Increment late count"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteStudent(student.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete student record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
