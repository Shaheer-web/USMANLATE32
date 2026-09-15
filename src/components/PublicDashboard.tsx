import React, { useState, useMemo } from 'react';
import { 
  StudentEntry 
} from '../types';
import { 
  Search, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  MailCheck, 
  ShieldAlert, 
  Calendar, 
  PlusCircle, 
  ArrowUpDown,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Building2
} from 'lucide-react';

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

  // Filter and sort students: 3+ lates float to the top automatically
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch =
          student.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          student.id.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          `${student.classNum}-${student.section}`.toLowerCase().includes(searchTerm.toLowerCase().trim());

        const matchesClass =
          selectedClass === 'all' || student.classNum.toString() === selectedClass;

        const matchesStatus =
          selectedFilter === 'all'
            ? true
            : selectedFilter === 'warning'
            ? student.lateCount >= 3
            : student.lateCount < 3;

        return matchesSearch && matchesClass && matchesStatus;
      })
      .sort((a, b) => {
        // Priority 1: High alert count (3+) on top
        if (a.lateCount >= 3 && b.lateCount < 3) return -1;
        if (b.lateCount >= 3 && a.lateCount < 3) return 1;

        // Priority 2: Highest late count descending
        if (b.lateCount !== a.lateCount) {
          return b.lateCount - a.lateCount;
        }

        // Priority 3: Alphabetical by student name
        return a.name.localeCompare(b.name);
      });
  }, [students, searchTerm, selectedClass, selectedFilter]);

  // Overall metric calculations
  const totalLateTally = students.reduce((acc, curr) => acc + curr.lateCount, 0);
  const warningListCount = students.filter((s) => s.lateCount >= 3).length;
  const criticalListCount = students.filter((s) => s.lateCount >= 4).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner: Spacious, clean, airy */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs tracking-wide">
              Usman C-32
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">Daily Assembly & Gate Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-emerald-950">
            Morning Late Attendance Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Transparent punctuality records fostering Islamic discipline and morning assembly punctuality.
          </p>
        </div>

        <button
          onClick={onOpenManagement}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 active:scale-98"
        >
          {isAdminUnlocked ? (
            <>
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Add Student Entry</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Admin: Record Late Entry</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Stats Bar: Roomy cards with generous padding */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Total Registered Students */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/90 flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Students</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif leading-tight mt-0.5">{students.length}</div>
          </div>
        </div>

        {/* Total Late Incidents */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/90 flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Total Lates</div>
            <div className="text-xl sm:text-2xl font-bold text-teal-950 font-serif leading-tight mt-0.5">{totalLateTally}</div>
          </div>
        </div>

        {/* 3-Times Warning Tier */}
        <div 
          onClick={onSelectWarningTab}
          className="bg-amber-50/80 hover:bg-amber-100/80 transition rounded-2xl p-4 sm:p-5 shadow-xs border border-amber-300 flex items-center gap-3.5 cursor-pointer group"
          title="Click to view dedicated 3-Times Warning Registry"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-200/70 border border-amber-300 flex items-center justify-center text-amber-900 group-hover:scale-105 transition shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider truncate">3-Late Alerts</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-950 font-serif leading-tight mt-0.5">{warningListCount}</div>
          </div>
        </div>

        {/* 4+ Incidents Gmail Dispatched */}
        <div className="bg-rose-50/80 rounded-2xl p-4 sm:p-5 shadow-xs border border-rose-200 flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
            <MailCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-rose-800 uppercase tracking-wider truncate">4+ Escalated</div>
            <div className="text-xl sm:text-2xl font-bold text-rose-950 font-serif leading-tight mt-0.5">{criticalListCount}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar: Spacious, comfortable */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, or class..."
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-600 focus:outline-none bg-slate-50/60 focus:bg-white transition"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Class Selector */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs sm:text-sm font-semibold focus:border-emerald-600 focus:outline-none cursor-pointer"
          >
            <option value="all">All Classes (6-10)</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>

          {/* Status Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('warning')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'warning'
                  ? 'bg-amber-500 text-emerald-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Warnings (3+)</span>
            </button>
            <button
              onClick={() => setSelectedFilter('normal')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition cursor-pointer ${
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

      {/* Public Late List Table & Mobile Card View */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-900/10 overflow-hidden">
        {/* Table Top Header with Sort Notice */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-amber-200">
              Automatic Sorting Applied: 3+ lates float to the top
            </span>
          </div>
          <span className="text-xs text-emerald-300 font-mono">
            Displaying {filteredStudents.length} entries
          </span>
        </div>

        {/* Mobile Friendly Card View: Airy, open cards with comfortable spacing */}
        <div className="md:hidden p-3.5 sm:p-5 bg-slate-50/50 space-y-3.5">
          {filteredStudents.length === 0 ? (
            <div className="py-14 px-4 text-center bg-white rounded-2xl border border-slate-200/80">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800 font-serif">
                {students.length === 0 ? 'No Late Student Records' : 'No Matching Records'}
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
                {students.length === 0
                  ? 'Zero late entries logged for Campus 32.'
                  : 'Try adjusting the search filter or class category above.'}
              </p>
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isThreeOrMore = student.lateCount >= 3;
              const isFourOrMore = student.lateCount >= 4;

              return (
                <div
                  key={student.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-shadow shadow-xs space-y-3.5 ${
                    isFourOrMore
                      ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-200'
                      : isThreeOrMore
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isThreeOrMore ? (
                        <div className="relative flex items-center justify-center shrink-0">
                          <span className="absolute inline-flex h-4 w-4 rounded-full bg-rose-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600 ring-2 ring-white"></span>
                        </div>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 font-mono text-base truncate">
                            {student.name}
                          </span>
                          {isThreeOrMore && (
                            <AlertTriangle
                              className={`w-4 h-4 shrink-0 ${
                                isFourOrMore ? 'text-rose-600' : 'text-amber-600'
                              }`}
                            />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                          ID: {student.id.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Badge */}
                    <span
                      className={`px-3 py-1 rounded-full font-bold font-mono text-xs shrink-0 ${
                        isFourOrMore
                          ? 'bg-rose-600 text-white shadow-xs'
                          : isThreeOrMore
                          ? 'bg-amber-500 text-emerald-950 shadow-xs'
                          : student.lateCount === 2
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {student.lateCount} Late{student.lateCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-semibold font-mono text-xs">
                      Class {student.classNum} &bull; Sec {student.section}
                    </span>

                    <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.lastDate}</span>
                    </div>
                  </div>

                  <div className="pt-0.5 flex items-center justify-between">
                    {isFourOrMore ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
                        <MailCheck className="w-3.5 h-3.5 text-rose-600" />
                        <span>Routed to Gmail Admin</span>
                      </span>
                    ) : isThreeOrMore ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Warning Registry Flagged</span>
                      </span>
                    ) : student.lateCount === 2 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-800 text-xs font-medium border border-yellow-200">
                        <span>2nd Notice / Caution</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                        <span>1st Warning / Active</span>
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400 font-mono">
                      Campus 32
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Data Table (hidden on mobile, visible on md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-4 px-5 font-bold text-emerald-950">#</th>
                <th className="py-4 px-5 font-bold text-emerald-950">Student Full Name</th>
                <th className="py-4 px-5 font-bold text-emerald-950">Class & Section</th>
                <th className="py-4 px-5 font-bold text-emerald-950 text-center">Late Count</th>
                <th className="py-4 px-5 font-bold text-emerald-950">Latest Incident Date</th>
                <th className="py-4 px-5 font-bold text-emerald-950">Administrative Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-800 font-serif">
                        {students.length === 0 ? 'No Late Student Records' : 'No Matching Records'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {students.length === 0
                          ? 'Zero late entries logged for Campus 32.'
                          : 'Try clearing or changing your search criteria.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const isThreeOrMore = student.lateCount >= 3;
                  const isFourOrMore = student.lateCount >= 4;

                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        isFourOrMore
                          ? 'bg-rose-50/50 hover:bg-rose-50'
                          : isThreeOrMore
                          ? 'bg-amber-50/40 hover:bg-amber-50/70'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Rank Index */}
                      <td className="py-4 px-5 font-mono text-slate-400 text-xs">
                        {index + 1}
                      </td>

                      {/* Student Full Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          {isThreeOrMore ? (
                            <div className="relative flex items-center justify-center flex-shrink-0">
                              <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-rose-400 opacity-75 animate-ping"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 ring-2 ring-white"></span>
                            </div>
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 font-mono flex items-center gap-1.5 text-sm">
                              <span>{student.name}</span>
                              {isThreeOrMore && (
                                <AlertTriangle
                                  className={`w-3.5 h-3.5 ${
                                    isFourOrMore ? 'text-rose-600' : 'text-amber-600'
                                  }`}
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
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 font-semibold font-mono text-xs">
                          Class {student.classNum} &bull; Sec {student.section}
                        </span>
                      </td>

                      {/* Late Count Badge */}
                      <td className="py-4 px-5 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[32px] px-3 py-1 rounded-full font-bold font-mono text-xs ${
                            isFourOrMore
                              ? 'bg-rose-600 text-white shadow-xs'
                              : isThreeOrMore
                              ? 'bg-amber-500 text-emerald-950 shadow-xs'
                              : student.lateCount === 2
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {student.lateCount}
                        </span>
                      </td>

                      {/* Date of latest record */}
                      <td className="py-4 px-5 text-slate-600 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.lastDate}</span>
                        </div>
                      </td>

                      {/* Administrative Status */}
                      <td className="py-4 px-5">
                        {isFourOrMore ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
                            <MailCheck className="w-3.5 h-3.5 text-rose-600" />
                            <span>Routed to Gmail Admin</span>
                          </span>
                        ) : isThreeOrMore ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                            <span>Warning Registry Flagged</span>
                          </span>
                        ) : student.lateCount === 2 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-800 text-xs font-medium border border-yellow-200">
                            <span>2nd Notice / Caution</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
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
      </div>
    </div>
  );
};
