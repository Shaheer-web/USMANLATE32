import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { EmailDispatchAlert } from '../types';

interface GmailAlertModalProps {
  alert: EmailDispatchAlert | null;
  onClose: () => void;
}

export const GmailAlertModal: React.FC<GmailAlertModalProps> = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-rose-500 overflow-hidden"
          role="alertdialog"
        >
          {/* Top simulated email header banner */}
          <div className="bg-gradient-to-r from-rose-900 via-red-800 to-amber-900 text-white p-4 sm:p-5 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-rose-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                <Mail className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500 text-white">
                    4-Times Late Trigger
                  </span>
                  <span className="text-xs text-rose-200">{alert.timestamp}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-white mt-0.5">
                  Automated Gmail Dispatch Simulation
                </h3>
              </div>
            </div>
          </div>

          {/* Primary Prompt requirement banner */}
          <div className="bg-rose-50 border-b border-rose-200 px-5 py-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 animate-bounce" />
            <p className="text-sm font-semibold text-rose-900">
              Warning log routed to Gmail administration.
            </p>
          </div>

          {/* Simulated Email Envelope & Details */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">From:</span>
                <span className="text-slate-800 font-semibold">upss-gate-system@campus32.usmanschool.edu.pk</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">To:</span>
                <span className="text-slate-800 font-semibold">{alert.recipient}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Subject:</span>
                <span className="text-rose-700 font-bold">
                  [DISCIPLINE ALERT] 4th Late Incident Record &bull; {alert.studentName.toUpperCase()} (Class {alert.classNum}-{alert.section})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dispatched Successfully
                </span>
              </div>
            </div>

            {/* Email Message Content */}
            <div className="bg-white border border-emerald-900/15 rounded-xl p-4 text-xs text-slate-700 space-y-3">
              <p className="font-medium text-emerald-950">
                Assalamu Alaikum wa Rahmatullah,
              </p>
              <p>
                This automated log confirms that student <strong className="text-emerald-950 font-bold uppercase underline">{alert.studentName}</strong> of <strong className="text-emerald-900">Class {alert.classNum}, Section {alert.section}</strong> has recorded their <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 font-bold rounded">4th late arrival</span> at Usman Public School System (Campus 32).
              </p>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Next Administrative Protocol:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px]">
                  <li>Formal telephone notification to parent/guardian.</li>
                  <li>Campus Head Disciplinary review scheduled before 8:30 AM tomorrow.</li>
                  <li>Review of student punctuality pledge under UPSS ethical code.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-semibold text-xs tracking-wide shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Acknowledge Log Notice</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
