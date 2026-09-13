import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquareHeart, 
  Send, 
  ThumbsUp, 
  Sparkles, 
  Heart, 
  CheckCircle, 
  Filter, 
  Clock,
  User,
  GraduationCap
} from 'lucide-react';
import { Suggestion } from '../types';

interface SuggestionsBoardProps {
  suggestions: Suggestion[];
  onAddSuggestion: (suggestion: Omit<Suggestion, 'id' | 'createdAt' | 'upvotes'>) => void;
  onUpvoteSuggestion: (id: string) => void;
}

export const SuggestionsBoard: React.FC<SuggestionsBoardProps> = ({
  suggestions,
  onAddSuggestion,
  onUpvoteSuggestion,
}) => {
  const [studentName, setStudentName] = useState('');
  const [classSection, setClassSection] = useState('');
  const [category, setCategory] = useState<Suggestion['category']>('Punctuality');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories: Suggestion['category'][] = [
    'Punctuality',
    'Morning Assembly',
    'Campus Life',
    'Ethics & Discipline',
    'General',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onAddSuggestion({
      studentName: studentName.trim() || 'Anonymous Student',
      classSection: classSection.trim() || 'Campus 32 Student',
      category: category,
      message: message.trim(),
    });

    setMessage('');
    setStudentName('');
    setClassSection('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  const filteredSuggestions = suggestions.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border-b-4 border-amber-500">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-950" />
                Open Student Forum
              </span>
              <span className="text-xs text-emerald-200">Public &bull; No Password Required</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-white">
              Student Suggestions & Voice Board
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
              Every student of Usman Public School System (Campus 32) is encouraged to share positive recommendations, punctuality tips, or campus improvement ideas.
            </p>
          </div>

          <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-xl p-3.5 text-center min-w-[140px]">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold block">
              Total Thoughts
            </span>
            <span className="text-2xl font-bold text-amber-300 font-serif">
              {suggestions.length}
            </span>
            <span className="text-[11px] text-emerald-200 block">Shared Freely</span>
          </div>
        </div>
      </div>

      {/* Suggestion Submission Form Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-emerald-950 font-serif">
              Share Your Thoughts or Advice
            </h3>
            <p className="text-xs text-slate-500">
              Open to all students &bull; Submissions post instantly to the grid below
            </p>
          </div>
        </div>

        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>JazakAllah Khair! Your suggestion has been posted to the board.</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Student Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Your Name / Alias <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Maryam or Anonymous"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 text-xs md:text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Class & Section */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Class / Section <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={classSection}
                  onChange={(e) => setClassSection(e.target.value)}
                  placeholder="e.g. Class 9-A"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 text-xs md:text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Suggestion['category'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 text-xs md:text-sm focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
              Suggestion Message / Feedback <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your suggestions, tips for morning punctuality, ideas for morning assembly, or questions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs md:text-sm focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400 order-2 sm:order-1">
              All comments are treated with Islamic decorum, mutual respect, and constructive encouragement.
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>Post Suggestion</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Category Bar with horizontal scrolling on mobile */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-1 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filter by Category:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({suggestions.length})
          </button>
          {categories.map((cat) => {
            const count = suggestions.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Readable Card Grids Containing Submitted Thoughts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredSuggestions.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md border border-slate-200/80 hover:border-emerald-300 transition flex flex-col justify-between group"
            >
              <div>
                {/* Category & Date Header */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      item.category === 'Punctuality'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : item.category === 'Morning Assembly'
                        ? 'bg-teal-100 text-teal-900 border border-teal-200'
                        : item.category === 'Campus Life'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    {item.createdAt}
                  </span>
                </div>

                {/* Message Body */}
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "{item.message}"
                </p>
              </div>

              {/* Card Footer: Author & Upvote */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-emerald-950 capitalize">
                    {item.studentName}
                  </p>
                  {item.classSection && (
                    <p className="text-[11px] text-slate-400">
                      {item.classSection}
                    </p>
                  )}
                </div>

                {/* Upvote Button */}
                <button
                  onClick={() => onUpvoteSuggestion(item.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition cursor-pointer group-hover:border-emerald-300"
                  title="Encourage this idea"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.upvotes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
