import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquareHeart, 
  Send, 
  ThumbsUp, 
  Sparkles, 
  CheckCircle, 
  Filter, 
  Clock,
  User,
  GraduationCap,
  Search,
  Trash2,
  Database
} from 'lucide-react';
import { Suggestion } from '../types';

interface SuggestionsBoardProps {
  suggestions: Suggestion[];
  onAddSuggestion: (suggestion: Omit<Suggestion, 'id' | 'createdAt' | 'upvotes'>) => void;
  onUpvoteSuggestion: (id: string) => void;
  onDeleteSuggestion?: (id: string) => void;
  isAdminUnlocked?: boolean;
}

export const SuggestionsBoard: React.FC<SuggestionsBoardProps> = ({
  suggestions,
  onAddSuggestion,
  onUpvoteSuggestion,
  onDeleteSuggestion,
  isAdminUnlocked = false,
}) => {
  const [studentName, setStudentName] = useState('');
  const [classSection, setClassSection] = useState('');
  const [category, setCategory] = useState<Suggestion['category']>('Punctuality');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      s.studentName.toLowerCase().includes(query) ||
      s.message.toLowerCase().includes(query) ||
      (s.classSection && s.classSection.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border-b-4 border-amber-500">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-950" />
                Public Student Forum
              </span>
              <span className="text-xs text-emerald-200 flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-300" />
                Saved Locally in Browser Storage
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-white">
              Student Suggestions & Voice Board
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/90 max-w-2xl mt-1 leading-relaxed">
              Sab students ke messages yahan sab ko publicly dikhte hain. Punctuality tips, assembly ideas, ya campus guidance share karein!
            </p>
          </div>

          <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-xl p-3.5 text-center min-w-[140px]">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold block">
              Total Thoughts
            </span>
            <span className="text-2xl font-bold text-amber-300 font-serif">
              {suggestions.length}
            </span>
            <span className="text-[11px] text-emerald-200 block">Visible to All</span>
          </div>
        </div>
      </div>

      {/* Suggestion Submission Form Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/10 relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-emerald-950 font-serif">
                Share Your Suggestion / Apni Ray Dein
              </h3>
              <p className="text-xs text-slate-500">
                Message submit hote hi foran neeche sab ko dikhayi dega aur local store me save hoga.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            Local Storage Active
          </span>
        </div>

        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>JazakAllah Khair! Aapka message save ho chuka hai aur neeche board par live dikh raha hai.</span>
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Suggestion Message / Feedback <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {message.length}/500 chars
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your suggestion, punctuality recommendation, or feedback here..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs md:text-sm focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400 order-2 sm:order-1">
              All suggestions are stored locally in the browser and appear instantly in the live feed.
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages by name, keyword..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
              filterCategory === 'all'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({suggestions.length})
          </button>
          {categories.map((cat) => {
            const count = suggestions.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
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
      {filteredSuggestions.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
          <MessageSquareHeart className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-semibold text-sm text-slate-700">Koi message nahi mila</p>
          <p className="text-xs text-slate-400">Upar form me naya suggestion post karein taake sab ko yahan dikh sake.</p>
        </div>
      ) : (
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
                className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md border border-slate-200/80 hover:border-emerald-300 transition flex flex-col justify-between group relative"
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

                  {/* Action buttons: Upvote & optional delete */}
                  <div className="flex items-center gap-2">
                    {onDeleteSuggestion && (isAdminUnlocked || item.id.startsWith('sug-')) && (
                      <button
                        onClick={() => onDeleteSuggestion(item.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer opacity-70 group-hover:opacity-100"
                        title="Delete suggestion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onUpvoteSuggestion(item.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition cursor-pointer group-hover:border-emerald-300"
                      title="Support this suggestion"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.upvotes}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
