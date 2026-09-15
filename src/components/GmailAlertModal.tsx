import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3, 
  Send,
  User,
  GraduationCap
} from 'lucide-react';
import { EmailDispatchAlert } from '../types';

interface GmailAlertModalProps {
  alert: EmailDispatchAlert | null;
  onClose: () => void;
  defaultTeacherEmail?: string;
  onUpdateTeacherEmail?: (email: string) => void;
}

export const GmailAlertModal: React.FC<GmailAlertModalProps> = ({ 
  alert, 
  onClose,
  defaultTeacherEmail = '',
  onUpdateTeacherEmail,
}) => {
  const [copied, setCopied] = useState(false);
  const [customEmail, setCustomEmail] = useState(defaultTeacherEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!alert) return null;

  const targetEmail = customEmail.trim() || alert.recipient || 'ayeshakhan2907@yahoo.com';
  const isThresholdThree = alert.lateCount === 3;

  const emailSubject = alert.mailSubject || (
    isThresholdThree
      ? `[3-TIMES LATE WARNING] Urgent Student Notice: ${alert.studentName.toUpperCase()} (Class ${alert.classNum}-${alert.section})`
      : `[DISCIPLINE ESCALATION] ${alert.lateCount}th Late Incident: ${alert.studentName.toUpperCase()} (Class ${alert.classNum}-${alert.section})`
  );

  const emailBody = alert.mailBody || `Assalamu Alaikum wa Rahmatullah,

Respected Teacher / Class Incharge,

This is an automated punctuality notification regarding student ${alert.studentName.toUpperCase()} from Class ${alert.classNum}, Section ${alert.section}.

DETAILS OF RECORD:
- Student Name: ${alert.studentName.toUpperCase()}
- Class & Section: Class ${alert.classNum} - ${alert.section}
- Total Late Arrivals Recorded: ${alert.lateCount} Times
- Log Timestamp: ${alert.timestamp}
- Institution: Usman Public School System (Campus 32 - Girls Section)

ACTION REQUIRED:
As per the UPSS disciplinary policy, accumulating 3 late arrivals requires urgent counseling with parents/guardians. Please verify student attendance record in the Campus Punctuality Ledger.

JazakAllahu Khair,
UPSS Campus 32 Administration & Gate Punctuality Portal`;

  const mailtoLink = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  
  // Direct Web Yahoo Mail compose URL (matches ayeshakhan2907@yahoo.com)
  const webYahooLink = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(targetEmail)}&subj=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  // Direct Web Gmail compose URL
  const webGmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyEmailDetails = () => {
    const textToCopy = `To: ${targetEmail}\nSubject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateTeacherEmail) {
      onUpdateTeacherEmail(customEmail.trim());
    }
    setIsEditingEmail(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border-2 border-amber-500 overflow-hidden my-auto max-h-[90vh] flex flex-col"
          role="alertdialog"
        >
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-amber-900 text-white p-4 sm:p-5 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-emerald-950">
                    {alert.lateCount}-Times Late Alert
                  </span>
                  <span className="text-xs text-emerald-200">{alert.timestamp}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-white mt-0.5 leading-snug">
                  Teacher Gmail Notification Dispatch
                </h3>
              </div>
            </div>
          </div>

          {/* Prompt / Status banner */}
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                3rd late detected for <strong className="uppercase font-bold text-amber-950">{alert.studentName}</strong>. Ready to notify Teacher.
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px] shrink-0 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-Generated
            </span>
          </div>

          {/* Scrollable Email Envelope & Details */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Teacher Email Configuration Row */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  Teacher / Class Incharge Gmail:
                </span>
                {!isEditingEmail && (
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(true)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    Change Email
                  </button>
                )}
              </div>

              {isEditingEmail ? (
                <form onSubmit={handleSaveEmail} className="flex items-center gap-2 mt-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="teacher@gmail.com or teacher@usmanschool.edu.pk"
                    required
                    className="flex-1 px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(false)}
                    className="px-2.5 py-1.5 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between font-mono bg-white px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span className="text-emerald-900 font-medium truncate">{targetEmail}</span>
                  {savedSuccess && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded ml-2">
                      Saved!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Email Envelope Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5 gap-2">
                <span className="text-slate-500 shrink-0">Recipient:</span>
                <span className="text-slate-800 font-semibold truncate text-right">{targetEmail}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 gap-2">
                <span className="text-slate-500 shrink-0">Subject:</span>
                <span className="text-amber-800 font-bold truncate text-right" title={emailSubject}>
                  {emailSubject}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 shrink-0">Student:</span>
                <span className="text-emerald-800 font-bold uppercase">
                  {alert.studentName} (Class {alert.classNum}-{alert.section}) &bull; {alert.lateCount} Late
                </span>
              </div>
            </div>

            {/* Delivery Guarantee Info Box */}
            <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3 text-xs text-purple-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">100% Email Delivery Guarantee:</span>
                <p className="text-[11px] text-purple-800/90 leading-relaxed mt-0.5">
                  Neeche <strong>"Yahoo Mail"</strong> ya <strong>"Gmail"</strong> par click karne se compose window foran open ho jayegi jisme recipient <strong>{targetEmail}</strong>, subject aur complete school details pehle se typed hain. Send dabanay par notice 100% teacher ke inbox me pohanch jayega.
                </p>
              </div>
            </div>

            {/* Email Message Preview */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 text-slate-500 font-sans">
                <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-700">
                  Prepared Email Message Content
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmailDetails}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="whitespace-pre-wrap font-sans text-slate-800 bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed text-[11px] max-h-36 overflow-y-auto">
                {emailBody}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span className="truncate">Recipient: <strong className="text-slate-800">{targetEmail}</strong></span>
            </div>

            <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
              {/* Primary Direct Yahoo Mail compose (Targeting teacher's yahoo email) */}
              <a
                href={webYahooLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                title="Open in Yahoo Mail Web (Direct to ayeshakhan2907@yahoo.com)"
              >
                <Mail className="w-4 h-4 text-purple-200" />
                <span>Yahoo Mail</span>
                <ExternalLink className="w-3 h-3 text-purple-200" />
              </a>

              {/* Primary Direct 1-Click Open in Gmail Web */}
              <a
                href={webGmailLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                title="Open directly in Gmail Web"
              >
                <Mail className="w-4 h-4 text-red-100" />
                <span>Gmail</span>
                <ExternalLink className="w-3 h-3 text-red-200" />
              </a>

              {/* Secondary Mail Client fallback */}
              <a
                href={mailtoLink}
                className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                title="Open default email app"
              >
                <Send className="w-3.5 h-3.5 text-emerald-300" />
                <span>Mail App</span>
              </a>

              {/* Done / Close */}
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
