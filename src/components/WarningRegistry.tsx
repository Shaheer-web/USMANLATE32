import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  CheckCheck, 
  AlertTriangle, 
  Trash2, 
  CheckCircle, 
  Sparkles, 
  Info,
  Calendar,
  UserCheck
} from 'lucide-react';
import { StudentEntry } from '../types';

interface WarningRegistryProps {
  students: StudentEntry[];
  onCheckAndDeleteStudent: (id: string, name: string) => void;
  onNavigateToManagement: () => void;
}

export const WarningRegistry: React.FC<WarningRegistryProps> = ({
  students,
  onCheckAndDeleteStudent,
  onNavigateToManagement,
}) => {
  // STRICT RULE: This tab must display ONLY students who have exactly a 3-time late status record.
  const threeLateStudents = students.filter((s) => s.lateCount === 3);
  
  // Distinct handling count for high alerts (4+)
  const fourOrMoreStudents = students.filter((s) => s.lateCount >= 4);

  const [checkedAnimationId, setCheckedAnimationId] = useState<string | null>(null);

  const handleCheckedClick = (id: string, name: string) => {
    setCheckedAnimationId(id);
    setTimeout(() => {
      onCheckAndDeleteStudent(id, name);
      setCheckedAnimationId(null);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-emerald-950 text-white rounded-2xl p-6 shadow-md border-b-4 border-amber-500">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-900" />
                Critical 3-Times Late Tier
              </span>
              <span className="text-xs text-amber-200">Campus Disciplinary Rule #1</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-white">
              Official Warning Registry &bull; 3-Times Late Only
            </h2>
            <p className="text-xs md:text-sm text-amber-100/80 max-w-2xl mt-1 leading-relaxed">
              This dedicated registry filters and isolates students who have accumulated exactly three late arrivals. In accordance with UPSS policy, their parents are contacted for counseling. Once resolved, clicking <strong>"Checked"</strong> permanently clears the record.
            </p>
          </div>

          <div className="bg-amber-950/80 border border-amber-500/50 rounded-xl p-3.5 text-center min-w-[150px]">
            <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold block">
              Active 3-Late Cases
            </span>
            <span className="text-2xl font-black text-amber-400 font-serif">
              {threeLateStudents.length}
            </span>
            <span className="text-[11px] text-amber-200 block">Pending Review</span>
          </div>
        </div>
      </div>

      {/* Protocol Explanation Notice */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <p className="font-bold">
            Administrative "Checked" Auto-Deletion Workflow:
          </p>
          <p className="text-slate-700 leading-relaxed">
            Clicking the <strong className="text-emerald-900">"Checked"</strong> action button triggers an instant, seamless deletion of that student’s record from the system database, signifying that administrative counseling has taken place.
          </p>
        </div>
      </div>

      {/* Distinct Notice for 4+ Alerts if any exist */}
      {fourOrMoreStudents.length > 0 && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <div>
              <span className="font-bold text-rose-950">
                High-Tier Alerts ({fourOrMoreStudents.length} students with 4+ lates):
              </span>{' '}
              <span className="text-rose-800">
                These severe cases are automatically routed to Gmail Administration and handled directly by the Principal’s office.
              </span>
            </div>
          </div>
          <button
            onClick={onNavigateToManagement}
            className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition cursor-pointer flex-shrink-0"
          >
            Review in Management
          </button>
        </div>
      )}

      {/* 3-Times Late Student Cards / Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-900/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-800">
              Students with Exactly 3 Late Counts ({threeLateStudents.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Direct Action: "Checked" permanently removes record
          </span>
        </div>

        {threeLateStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <UserCheck className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-base text-emerald-950 font-serif">
              Alhamdulillah, No Active 3-Time Late Records!
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              All students are currently below the critical 3-late threshold, or recent flagged cases have been successfully reviewed and marked as Checked.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <AnimatePresence>
              {threeLateStudents.map((student) => {
                const isBeingDeleted = checkedAnimationId === student.id;

                return (
                  <motion.div
                    key={student.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      isBeingDeleted
                        ? { opacity: 0, scale: 0.95, x: 20 }
                        : { opacity: 1, y: 0 }
                    }
                    exit={{ opacity: 0, scale: 0.9, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isBeingDeleted ? 'bg-emerald-50' : 'hover:bg-amber-50/40'
                    }`}
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 font-mono font-bold flex items-center justify-center flex-shrink-0">
                        3x
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-slate-900 font-mono">
                            {student.name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-bold">
                            Warning Level 3
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="font-medium text-emerald-900 font-mono">
                            Class {student.classNum}-{student.section}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Latest: {student.lastDate}
                          </span>
                          <span>&bull;</span>
                          <span className="text-[11px] text-slate-400">
                            Recorded dates: {student.datesHistory.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action button: Checked (auto-deletes record) */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleCheckedClick(student.id, student.name)}
                        disabled={isBeingDeleted}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-600/50"
                        title="Mark as Checked & seamlessly delete this student's late record"
                      >
                        <CheckCheck className="w-4 h-4 text-emerald-300" />
                        <span>Checked (Delete Record)</span>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Note: Records with 1-2 lates remain on the Dashboard. High-tier (4+) records are preserved for Principal inspection.
          </span>
        </div>
      </div>
    </div>
  );
};
