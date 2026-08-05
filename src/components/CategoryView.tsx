import { useState } from 'react';
import { CATEGORIES_META, allQuestions } from '../data';
import { CategoryId, QuestionItem } from '../types';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Code2, AlertTriangle, ShieldAlert, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

import { HighlightText } from './HighlightText';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CategoryViewProps {
  categoryId: CategoryId;
}

export function CategoryView({ categoryId }: CategoryViewProps) {
  const categoryMeta = CATEGORIES_META.find(c => c.id === categoryId);
  const questions = allQuestions.filter(q => q.category === categoryId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!categoryMeta) return <div>Category not found</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
          {categoryMeta.badge}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">{categoryMeta.name}</h1>
        <p className="text-slate-600 text-lg leading-relaxed">{categoryMeta.description}</p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard 
            key={q.id} 
            question={q} 
            isExpanded={expandedId === q.id}
            onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
          />
        ))}
        {questions.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No questions available for this category yet.
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionCard({ question, isExpanded, onToggle }: { question: QuestionItem, isExpanded: boolean, onToggle: () => void }) {
  const diffColors = {
    'Mid-Level': 'bg-green-100 text-green-800',
    'Senior': 'bg-blue-100 text-blue-800',
    'Hard': 'bg-orange-100 text-orange-800',
    'Architect-Level': 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start justify-between gap-4 bg-white"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{question.topic}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diffColors[question.difficulty as keyof typeof diffColors] || 'bg-slate-100 text-slate-700'}`}>
              {question.difficulty}
            </span>
            <span className="text-xs text-slate-400">{question.seniority}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 leading-snug">{question.title}</h2>
          {!isExpanded && (
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{question.summary}</p>
          )}
        </div>
        <div className="p-2 bg-slate-50 rounded-full text-slate-400 shrink-0 mt-2">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <div className="p-5 space-y-8 bg-slate-50/50">
              
              {/* Core Concepts */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" /> Core Concepts
                </h3>
                <ul className="space-y-2">
                  {question.coreConcepts.map((concept, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><HighlightText text={concept} /></span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed Explanation */}
              {question.detailedExplanation && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Deep Dive
                  </h3>
                  <div className="space-y-3">
                    {question.detailedExplanation.map((para, i) => (
                      <p key={i} className="text-sm text-slate-700 leading-relaxed"><HighlightText text={para} /></p>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Examples */}
              {question.codeExamples && question.codeExamples.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-600" /> Code Implementation
                  </h3>
                  <div className="space-y-4">
                    {question.codeExamples.map((ex, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-slate-200">
                        {ex.title && <div className="bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 border-b border-slate-200">{ex.title}</div>}
                        <SyntaxHighlighter
                          language={ex.language || 'java'}
                          style={oneDark}
                          customStyle={{ margin: 0, padding: '1rem', fontSize: '0.875rem' }}
                        >
                          {ex.code}
                        </SyntaxHighlighter>
                        {ex.output && (
                          <div className="bg-slate-800 text-green-400 p-3 text-xs font-mono border-t border-slate-700">
                            {ex.output}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rubric */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Interviewer Rubric</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Ideal Answer Elements</h4>
                    <ul className="space-y-1.5">
                      {question.rubric.idealAnswerPoints.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span><HighlightText text={pt} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Red Flags (Junior/Mid)</h4>
                    <ul className="space-y-1.5">
                      {question.rubric.juniorOrMidRedFlags.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                          <span className="text-red-500 mt-0.5">✕</span>
                          <span><HighlightText text={pt} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {question.rubric.seniorDifferentiators && question.rubric.seniorDifferentiators.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Senior Differentiators</h4>
                    <ul className="space-y-1.5">
                      {question.rubric.seniorDifferentiators.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                          <span className="text-purple-500 mt-0.5">★</span>
                          <span><HighlightText text={pt} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {question.rubric.followUpQuestions && question.rubric.followUpQuestions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">Follow-up Questions</h4>
                    <ul className="list-decimal pl-4 space-y-1">
                      {question.rubric.followUpQuestions.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-600"><HighlightText text={pt} /></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Ensure lucide icon BookOpen is imported correctly in the above code.
