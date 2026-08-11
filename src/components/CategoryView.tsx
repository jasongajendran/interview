import { useState, useMemo } from 'react';
import { CATEGORIES_META, allQuestions } from '../data';
import { CategoryId, QuestionItem } from '../types';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Code2, 
  AlertTriangle, 
  ShieldAlert, 
  BookOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles,
  Layers,
  HelpCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HighlightText } from './HighlightText';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CategoryViewProps {
  categoryId: CategoryId;
  onNavigateCategory?: (catId: CategoryId) => void;
  targetQuestionId?: string;
  bookmarkedIds?: string[];
  onToggleBookmark?: (questionId: string) => void;
}

export function CategoryView({ 
  categoryId, 
  onNavigateCategory,
  targetQuestionId,
  bookmarkedIds = [],
  onToggleBookmark 
}: CategoryViewProps) {
  const categoryMeta = CATEGORIES_META.find(c => c.id === categoryId);
  const rawQuestions = useMemo(() => allQuestions.filter(q => q.category === categoryId), [categoryId]);

  const [expandedId, setExpandedId] = useState<string | null>(targetQuestionId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState(false);

  // Find prev/next categories for quick navigation
  const currentIndex = CATEGORIES_META.findIndex(c => c.id === categoryId);
  const prevCategory = currentIndex > 0 ? CATEGORIES_META[currentIndex - 1] : null;
  const nextCategory = currentIndex < CATEGORIES_META.length - 1 ? CATEGORIES_META[currentIndex + 1] : null;

  const filteredQuestions = useMemo(() => {
    return rawQuestions.filter(q => {
      if (filterBookmarkedOnly && !bookmarkedIds.includes(q.id)) {
        return false;
      }
      if (selectedDifficulty !== 'all') {
        if (selectedDifficulty === 'Senior' && !q.difficulty.includes('Senior') && !q.seniority.includes('Senior')) return false;
        if (selectedDifficulty === 'Architect' && !q.difficulty.includes('Architect') && !q.seniority.includes('Architect')) return false;
      }
      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term) ||
        q.summary.toLowerCase().includes(term) ||
        q.coreConcepts.some(c => c.toLowerCase().includes(term)) ||
        q.tags.some(t => t.toLowerCase().includes(term))
      );
    });
  }, [rawQuestions, searchQuery, selectedDifficulty, filterBookmarkedOnly, bookmarkedIds]);

  const toggleExpandAll = () => {
    if (expandedId === 'ALL') {
      setExpandedId(null);
    } else {
      setExpandedId('ALL');
    }
  };

  if (!categoryMeta) return <div className="p-8 text-center text-slate-600">Category not found</div>;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Breadcrumb & Next/Prev Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
          <span>Categories</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate">{categoryMeta.name}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {prevCategory && onNavigateCategory && (
            <button
              onClick={() => onNavigateCategory(prevCategory.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
              title={`Go to ${prevCategory.name}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{prevCategory.shortName}</span>
            </button>
          )}

          {nextCategory && onNavigateCategory && (
            <button
              onClick={() => onNavigateCategory(nextCategory.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
              title={`Go to ${nextCategory.name}`}
            >
              <span className="hidden sm:inline">{nextCategory.shortName}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Hero Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full border border-indigo-200 shadow-2xs">
            {categoryMeta.badge}
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
            {rawQuestions.length} Questions &amp; Deep Dives
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">
          {categoryMeta.name}
        </h1>

        <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
          {categoryMeta.description}
        </p>

        {/* Category Controls / Filters */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search inside category */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter topics or questions in this module..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedDifficulty(selectedDifficulty === 'all' ? 'Senior' : 'all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                selectedDifficulty === 'Senior'
                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Senior Only
            </button>

            <button
              onClick={() => setSelectedDifficulty(selectedDifficulty === 'Architect' ? 'all' : 'Architect')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                selectedDifficulty === 'Architect'
                  ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Architect
            </button>

            {bookmarkedIds.length > 0 && (
              <button
                onClick={() => setFilterBookmarkedOnly(!filterBookmarkedOnly)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
                  filterBookmarkedOnly
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-3 h-3" />
                <span>Saved</span>
              </button>
            )}

            <button
              onClick={toggleExpandAll}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
            >
              {expandedId === 'ALL' ? (
                <>
                  <Minimize2 className="w-3 h-3" /> Collapse All
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" /> Expand All
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-5">
        {filteredQuestions.map((q, index) => {
          const isItemExpanded = expandedId === 'ALL' || expandedId === q.id;
          const isBookmarked = bookmarkedIds.includes(q.id);

          return (
            <QuestionCard
              key={q.id}
              question={q}
              index={index + 1}
              isExpanded={isItemExpanded}
              isBookmarked={isBookmarked}
              searchQuery={searchQuery}
              onToggle={() => {
                if (expandedId === 'ALL') {
                  setExpandedId(q.id);
                } else {
                  setExpandedId(expandedId === q.id ? null : q.id);
                }
              }}
              onToggleBookmark={() => onToggleBookmark && onToggleBookmark(q.id)}
            />
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-700">No questions matched your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search query or difficulty filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
                setFilterBookmarkedOnly(false);
              }}
              className="mt-4 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: QuestionItem;
  index: number;
  isExpanded: boolean;
  isBookmarked: boolean;
  searchQuery?: string;
  onToggle: () => void;
  onToggleBookmark: () => void;
}

function QuestionCard({
  question,
  index,
  isExpanded,
  isBookmarked,
  searchQuery,
  onToggle,
  onToggleBookmark
}: QuestionCardProps) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(idx);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Architect-Level':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Hard':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Senior':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <article
      id={`question-${question.id}`}
      className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
        isExpanded
          ? 'border-indigo-300 shadow-md ring-1 ring-indigo-500/10'
          : 'border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Card Header Accordion Trigger */}
      <div 
        onClick={onToggle}
        className="w-full text-left p-5 md:p-6 flex items-start justify-between gap-4 cursor-pointer select-none bg-white hover:bg-slate-50/70 transition-colors"
        role="button"
        tabIndex={0}
      >
        <div className="flex-1">
          {/* Badges & Meta */}
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80 font-mono">
              Q{index}
            </span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              {question.topic}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
              {question.seniority}
            </span>
          </div>

          {/* Question Title */}
          <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug tracking-tight">
            {question.title}
          </h2>

          {/* Collapsed Summary */}
          {!isExpanded && (
            <div className="text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
              <HighlightText text={question.summary} searchQuery={searchQuery} />
            </div>
          )}

          {/* Key tags preview in collapsed view */}
          {!isExpanded && question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {question.tags.slice(0, 4).map((tag, tIdx) => (
                <span key={tIdx} className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <div className="p-2 bg-slate-100 rounded-xl text-slate-500 shrink-0">
            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Content View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-slate-200 bg-slate-50/70"
          >
            <div className="p-5 md:p-8 space-y-8">
              
              {/* Executive Summary Takeaway Box */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/80 rounded-xl p-4 md:p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-2 text-indigo-900 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Key Takeaway at a Glance
                </div>
                <p className="text-[14.5px] leading-relaxed text-indigo-950 font-medium">
                  <HighlightText text={question.summary} searchQuery={searchQuery} />
                </p>
              </div>

              {/* Core Concepts */}
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 
                  Core Architecture &amp; Mechanism
                </h3>
                <ul className="space-y-2.5 bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-2xs">
                  {question.coreConcepts.map((concept, i) => (
                    <li key={i} className="text-[14.5px] text-slate-800 leading-relaxed flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <div className="flex-1">
                        <HighlightText text={concept} searchQuery={searchQuery} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed Explanation / Deep Dive */}
              {question.detailedExplanation && question.detailedExplanation.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" /> 
                    Deep Dive &amp; Engineering Nuance
                  </h3>
                  <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
                    {question.detailedExplanation.map((para, i) => (
                      <p key={i} className="text-[14.5px] text-slate-700 leading-[1.8]">
                        <HighlightText text={para} searchQuery={searchQuery} />
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Implementation */}
              {question.codeExamples && question.codeExamples.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-600" /> 
                    Production Code Implementation &amp; Execution Output
                  </h3>
                  <div className="space-y-4">
                    {question.codeExamples.map((ex, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-900">
                        {/* Code Header Bar */}
                        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                              {ex.language || 'java'}
                            </span>
                            <span className="font-semibold text-slate-200">
                              {ex.title || 'Implementation'}
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleCopyCode(ex.code, i, e)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium border border-slate-700"
                          >
                            {copiedCodeIndex === i ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Syntax Highlighter */}
                        <div className="font-mono text-[13px] leading-relaxed">
                          <SyntaxHighlighter
                            language={ex.language || 'java'}
                            style={oneDark}
                            customStyle={{
                              margin: 0,
                              padding: '1.25rem',
                              background: '#090d16',
                              fontSize: '13px'
                            }}
                          >
                            {ex.code}
                          </SyntaxHighlighter>
                        </div>

                        {/* Runtime Output Terminal Box */}
                        {ex.output && (
                          <div className="bg-slate-950 p-4 border-t border-slate-800">
                            <div className="text-[11px] font-mono font-bold text-slate-400 mb-1.5 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                              Runtime / Log Output:
                            </div>
                            <pre className="text-emerald-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                              {ex.output}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comprehensive Interviewer Rubric */}
              <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                    Senior &amp; Architect Evaluation Rubric
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">Grading Matrix</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Ideal Answers */}
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="text-xs font-extrabold text-emerald-900 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 
                      Ideal Answer Elements (What strong answers cover)
                    </h4>
                    <ul className="space-y-2">
                      {question.rubric.idealAnswerPoints.map((pt, i) => (
                        <li key={i} className="text-[13.5px] text-slate-800 leading-relaxed flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                          <span><HighlightText text={pt} searchQuery={searchQuery} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Junior / Mid Red Flags */}
                  <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4">
                    <h4 className="text-xs font-extrabold text-rose-900 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> 
                      Red Flags &amp; Common Antipatterns
                    </h4>
                    <ul className="space-y-2">
                      {question.rubric.juniorOrMidRedFlags.map((pt, i) => (
                        <li key={i} className="text-[13.5px] text-slate-800 leading-relaxed flex items-start gap-2">
                          <span className="text-rose-600 font-bold mt-0.5">✕</span>
                          <span><HighlightText text={pt} searchQuery={searchQuery} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
                
                {/* Senior Differentiators */}
                {question.rubric.seniorDifferentiators && question.rubric.seniorDifferentiators.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-100 bg-purple-50/50 border border-purple-200 rounded-xl p-4">
                    <h4 className="text-xs font-extrabold text-purple-900 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" /> 
                      Senior &amp; Principal Differentiators (Top 5% answers)
                    </h4>
                    <ul className="space-y-2">
                      {question.rubric.seniorDifferentiators.map((pt, i) => (
                        <li key={i} className="text-[13.5px] text-slate-800 leading-relaxed flex items-start gap-2">
                          <span className="text-purple-600 font-bold mt-0.5">★</span>
                          <span><HighlightText text={pt} searchQuery={searchQuery} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Follow Up Questions */}
                {question.rubric.followUpQuestions && question.rubric.followUpQuestions.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
                      Interviewer Follow-up Drill-downs
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.rubric.followUpQuestions.map((pt, i) => {
                        const qText = typeof pt === 'string' ? pt : pt.question;
                        const aText = typeof pt === 'string' ? null : pt.answer;
                        return (
                          <li key={i} className="text-xs text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200 flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-indigo-600 font-mono shrink-0">{i + 1}.</span>
                              <span className="font-medium text-slate-800"><HighlightText text={qText} searchQuery={searchQuery} /></span>
                            </div>
                            {aText && (
                              <div className="pl-6 text-slate-600 italic border-l-2 border-indigo-200 ml-1.5 py-0.5">
                                <HighlightText text={aText} searchQuery={searchQuery} />
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
