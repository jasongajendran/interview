import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, AlertTriangle, Terminal, BookOpen, Layers, Code2, CheckCircle2 } from 'lucide-react';
import { allQuestions, productionScenarios, diagnosticTools, CATEGORIES_META } from '../data';
import { CategoryId } from '../types';
import { HighlightText } from './HighlightText';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (categoryId: CategoryId, questionId: string) => void;
  onSelectScenario: (scenarioId: string) => void;
  onSelectDiagnostic: (toolName: string) => void;
  onSelectVisual: () => void;
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectQuestion,
  onSelectScenario,
  onSelectDiagnostic,
  onSelectVisual
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return { questions: [], scenarios: [], diagnostics: [] };
    const q = query.toLowerCase().trim();

    const matchedQuestions = allQuestions.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.coreConcepts.some(c => c.toLowerCase().includes(q)) ||
        item.tags.some(t => t.toLowerCase().includes(q)) ||
        (item.codeExamples && item.codeExamples.some(ex => ex.code.toLowerCase().includes(q) || ex.title.toLowerCase().includes(q)))
      );
    }).slice(0, 10);

    const matchedScenarios = productionScenarios.filter(sc => {
      return (
        sc.title.toLowerCase().includes(q) ||
        sc.affectedComponent.toLowerCase().includes(q) ||
        sc.symptoms.some(s => s.toLowerCase().includes(q)) ||
        sc.rootCauseAnalysis.toLowerCase().includes(q)
      );
    }).slice(0, 5);

    const matchedDiagnostics = diagnosticTools.filter(t => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q) ||
        t.syntaxOrCommand.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }).slice(0, 5);

    return {
      questions: matchedQuestions,
      scenarios: matchedScenarios,
      diagnostics: matchedDiagnostics
    };
  }, [query]);

  if (!isOpen) return null;

  const totalMatches =
    searchResults.questions.length +
    searchResults.scenarios.length +
    searchResults.diagnostics.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search topics, questions, JVM flags, SAGA, PKCE, Outages... (e.g. '@Transactional', 'deadlock', 'Kafka')"
            className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono font-semibold text-slate-500 bg-white border border-slate-300 rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Search Results / Suggestions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!query.trim() ? (
            <div className="py-8 text-center">
              <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Instant Architecture & Core Search</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                Type keywords like <span className="font-mono text-indigo-600 font-semibold">@Transactional</span>, <span className="font-mono text-indigo-600 font-semibold">Metaspace</span>, <span className="font-mono text-indigo-600 font-semibold">PKCE</span>, <span className="font-mono text-indigo-600 font-semibold">jstack</span>, or <span className="font-mono text-indigo-600 font-semibold">Deadlock</span> to jump directly to deep questions.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {['Transactional Outbox', 'PKCE Auth Flow', 'N+1 Problem', 'G1GC Tuning', 'Thread Starvation', 'Metaspace Leak'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium rounded-lg transition-colors border border-slate-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalMatches === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-base font-semibold text-slate-700">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm text-slate-500 mt-1">Try broader terms like &ldquo;memory&rdquo;, &ldquo;database&rdquo;, or &ldquo;spring&rdquo;</p>
            </div>
          ) : (
            <>
              {/* Interview Questions */}
              {searchResults.questions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Interview Questions ({searchResults.questions.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {searchResults.questions.map(q => (
                      <button
                        key={q.id}
                        onClick={() => {
                          onSelectQuestion(q.category, q.id);
                          onClose();
                        }}
                        className="w-full text-left p-3.5 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group flex items-start justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                              {q.categoryName || q.category}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              {q.topic}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded">
                              {q.difficulty}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">
                            {q.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                            {q.summary}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-2 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Production Outages */}
              {searchResults.scenarios.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Production Outages ({searchResults.scenarios.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {searchResults.scenarios.map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => {
                          onSelectScenario(sc.id);
                          onClose();
                        }}
                        className="w-full text-left p-3.5 bg-rose-50/40 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all group flex items-start justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-200 text-rose-900 rounded">
                              {sc.severity}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              {sc.affectedComponent}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-900">
                            {sc.title}
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-rose-400 group-hover:text-rose-600 shrink-0 mt-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnostic Tools */}
              {searchResults.diagnostics.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-slate-700" />
                      Diagnostic Tools ({searchResults.diagnostics.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {searchResults.diagnostics.map(tool => (
                      <button
                        key={tool.name}
                        onClick={() => {
                          onSelectDiagnostic(tool.name);
                          onClose();
                        }}
                        className="w-full text-left p-3 bg-slate-100/70 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-all group flex items-start justify-between gap-3 font-mono text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{tool.name}</span>
                          <span className="ml-2 text-slate-500 font-sans">({tool.category})</span>
                          <p className="text-slate-600 font-sans mt-0.5">{tool.purpose}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-4">
          <span>Navigate with click or search query</span>
          <span className="font-medium">ESC to close</span>
        </div>
      </div>
    </div>
  );
}
