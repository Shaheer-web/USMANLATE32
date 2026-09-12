import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  UserCheck, 
  Clock, 
  ArrowUpDown, 
  PlusCircle, 
  Lock,
  MailCheck,
  Building2,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { StudentEntry } from '../types';

interface PublicDashboardProps {
  students: StudentEntry[];
  onOpenManagement: () => void;
  onSelectWarningTab: () => void;
  isAdminUnlocked: boolean;
}

export const PublicDashboard: React.FC<PublicDashboardProps> = ({
  students,
  onOpenManagement,
  onSelectWarningTab,
  isAdminUnlocked,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'warning' | 'normal'>('all');

  // Strict sorting requirement:
  // "Students with a late count of 3 or more must automatically float to the absolute top of the table."
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const aIsWarning = a.lateCount >= 3 ? 1 : 0;
      const bIsWarning = b.lateCount >= 3 ? 1 : 0;

      // 1. Primary rule: 3 or more lates float to the absolute top
      if (aIsWarning !== bIsWarning) {
        return bIsWarning - aIsWarning;
      }

      // 2. Secondary rule: Highest late count first
      if (b.lateCount !== a.lateCount) {
        return b.lateCount - a.lateCount;
      }

      // 3. Tertiary rule: Most recent date first
      return new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime();
    });
  }, [students]);

  // Apply search and filter
  const filteredStudents = useMemo(() => {
    return sortedStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `class ${student.classNum}`.includes(searchTerm.toLowerCase()) ||
        student.section.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass =
        selectedClass === 'all' || student.classNum.toString() === selectedClass;

      const matchesFilter =
        selectedFilter === 'all'
          ? true
          : selectedFilter === 'warning'
          ? student.lateCount >= 3
          : student.lateCount < 3;

      return matchesSearch && matchesClass && matchesFilter;
    });
  }, [sortedStudents, searchTerm, selectedClass, selectedFilter]);

  // Summary Metrics
  const totalLateTally = students.reduce((sum, s) => sum + s.lateCount, 0);
  const warningListCount = students.filter((s) => s.lateCount === 3).length;
  const criticalListCount = students.filter((s) => s.lateCount >= 4).length;

  return (
    <div className="space-y-6">
      {/* Welcome & System Introduction Banner */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              Public Ledger
            </span>
            <span className="text-xs text-slate-500">Live Campus Attendance & Gate Log</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-emerald-950">
            Morning Late Attendance Ledger &bull; Campus 32
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Punctuality is a core virtue of Islamic conduct at Usman Public School System. Late records are transparently logged to foster accountability, discipline, and regular morning assembly attendance.
          </p>
        </div>

        <button
          onClick={onOpenManagement}
          className="px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          {isAdminUnlocked ? (
            <>
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Add Student Late Entry</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Admin: Add Entry</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Students */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Students Logged</div>
            <div className="text-xl font-bold text-emerald-950 font-serif">{students.length}</div>
          </div>
        </div>

        {/* Total Late Incidents */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Late Incidents</div>
            <div className="text-xl font-bold text-teal-950 font-serif">{totalLateTally}</div>
          </div>
        </div>

        {/* 3-Times Warning Watchlist */}
        <div 
          onClick={onSelectWarningTab}
          className="bg-amber-50/70 hover:bg-amber-100/70 transition rounded-xl p-4 shadow-xs border border-amber-300 flex items-center gap-3 cursor-pointer group"
          title="Click to view dedicated 3-Times Warning Registry"
        >
          <div className="w-11 h-11 rounded-lg bg-amber-200/70 border border-amber-300 flex items-center justify-center text-amber-900 group-hover:scale-105 transition">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <span>3-Times Warning</span>
              <span className="text-[10px] underline text-amber-900 font-normal">View Tab &rarr;</span>
            </div>
            <div className="text-xl font-bold text-amber-950 font-serif">{warningListCount} Students</div>
          </div>
        </div>

        {/* 4+ Incidents Gmail Dispatched */}
        <div className="bg-rose-50/70 rounded-xl p-4 shadow-xs border border-rose-200 flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
            <MailCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">4+ Gmail Escalations</div>
            <div className="text-xl font-bold text-rose-950 font-serif">{criticalListCount} Students</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name (lowercase) or class section..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs md:text-sm focus:border-emerald-600 focus:outline-none bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-medium focus:border-emerald-600 focus:outline-none cursor-pointer"
          >
            <option value="all">All Classes (6-10)</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>

          {/* Status Filter */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('warning')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                selectedFilter === 'warning'
                  ? 'bg-amber-500 text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-700" />
              <span>Warnings (3+)</span>
            </button>
            <button
              onClick={() => setSelectedFilter('normal')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                selectedFilter === 'normal'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Normal (1-2)
            </button>
          </div>
        </div>
      </div>

      {/* Public Late List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-900/10 overflow-hidden">
        {/* Table Top Header with Sort Notice */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-amber-400" />
            <span className="text-xs md:text-sm font-semibold text-amber-200">
              Automatic Sorting Applied: Students with 3 or more lates automatically float to the top
            </span>
          </div>
          <span className="text-xs text-emerald-300 font-mono">
            Displaying {filteredStudents.length} entries
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 font-bold text-emerald-950">#</th>
                <th className="py-3.5 px-4 font-bold text-emerald-950">Student Full Name</th>
                <th className="py-3.5 px-4 font-bold text-emerald-950">Class & Section</th>
                <th className="py-3.5 px-4 font-bold text-emerald-950 text-center">Late Count</th>
                <th className="py-3.5 px-4 font-bold text-emerald-950">Latest Incident Date</th>
                <th className="py-3.5 px-4 font-bold text-emerald-950">Disciplinary Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 font-serif">
                        {students.length === 0 ? 'No Late Student Records' : 'No Matching Student Records'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {students.length === 0
                          ? 'Zero late entries logged for Campus 32. Authorized staff can record morning late entries via the Management Panel.'
                          : 'Try changing the search filter or class category above.'}
                      </p>
                      {students.length === 0 && (
                        <button
                          onClick={onOpenManagement}
                          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-semibold text-xs transition cursor-pointer shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                          <span>Open Management Panel</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const isThreeOrMore = student.lateCount >= 3;
                  const isFourOrMore = student.lateCount >= 4;

                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        isFourOrMore
                          ? 'bg-rose-50/50 hover:bg-rose-50'
                          : isThreeOrMore
                          ? 'bg-amber-50/40 hover:bg-amber-50/80'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Row Index */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold text-xs">
                        {idx + 1}
                      </td>

                      {/* Student Name with Visual Alert Anchor for 3+ lates */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {/* Visual Alert Anchor: Distinct warning symbol / flashing red warning light */}
                          {isThreeOrMore ? (
                            <div className="relative flex items-center justify-center flex-shrink-0">
                              {/* Pulsing red ping indicator light */}
                              <span className="absolute inline-flex h-4 w-4 rounded-full bg-rose-400 opacity-75 animate-ping"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600 ring-2 ring-white shadow-xs"></span>
                            </div>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 font-mono tracking-wide text-sm">
                                {student.name}
                              </span>
                              {isThreeOrMore && (
                                <AlertTriangle
                                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                                    isFourOrMore ? 'text-rose-600 animate-bounce' : 'text-amber-600'
                                  }`}
                                  title={
                                    isFourOrMore
                                      ? 'Critical 4+ Late Alert: Log dispatched to Gmail'
                                      : '3-Times Late Flagged'
                                  }
                                />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {student.id.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class & Section */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/70 font-semibold text-xs font-mono">
                          Class {student.classNum} &bull; Sec {student.section}
                        </span>
                      </td>

                      {/* Late Count Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-3 py-1 rounded-full font-bold font-mono text-xs shadow-xs ${
                              isFourOrMore
                                ? 'bg-rose-600 text-white ring-2 ring-rose-300 animate-pulse'
                                : isThreeOrMore
                                ? 'bg-amber-500 text-emerald-950 ring-2 ring-amber-300'
                                : student.lateCount === 2
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {student.lateCount} Late{student.lateCount > 1 ? 's' : ''}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {student.datesHistory.length} logged
                          </span>
                        </div>
                      </td>

                      {/* Latest Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-mono text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.lastDate}</span>
                        </div>
                      </td>

                      {/* Disciplinary Status */}
                      <td className="py-3.5 px-4">
                        {isFourOrMore ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-300">
                            <MailCheck className="w-3 h-3 text-rose-600" />
                            <span>Routed to Gmail Admin</span>
                          </span>
                        ) : isThreeOrMore ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            <span>Warning Registry Flagged</span>
                          </span>
                        ) : student.lateCount === 2 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-yellow-50 text-yellow-800 text-[11px] font-medium border border-yellow-200">
                            <span>2nd Notice / Caution</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
                            <span>1st Warning / Active</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Public Notice Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Flashing red indicators denote students with 3 or more late counts automatically floated to top.</span>
          </div>
          <span className="text-[11px] text-emerald-900 font-semibold font-serif">
            Usman Public School System &bull; Campus 32 Discipline Code
          </span>
        </div>
      </div>
    </div>
  );
};
