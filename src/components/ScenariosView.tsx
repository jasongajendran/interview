import { useState } from 'react';
import { productionScenarios } from '../data';
import { AlertTriangle, ChevronDown, ChevronUp, Terminal, Code2, AlertCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HighlightText } from './HighlightText';

export function ScenariosView() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full mb-3 flex items-center gap-2 w-max">
          <AlertTriangle className="w-3 h-3" /> P1/P2 Incidents
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Production Outage Scenarios</h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Test candidate's ability to debug real-world production fires. These scenarios are designed to evaluate deep understanding of JVM, networking, and database locks.
        </p>
      </div>

      <div className="space-y-4">
        {productionScenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button 
              onClick={() => setExpandedId(expandedId === scenario.id ? null : scenario.id)}
              className="w-full text-left p-5 flex items-start justify-between gap-4 bg-white"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scenario.severity.includes('P1') ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                    {scenario.severity}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{scenario.affectedComponent}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">{scenario.title}</h2>
                {!expandedId || expandedId !== scenario.id ? (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Symptoms (Preview)</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li className="text-sm text-slate-600 line-clamp-1">{scenario.symptoms[0]}</li>
                    </ul>
                  </div>
                ) : null}
              </div>
              <div className="p-2 bg-slate-50 rounded-full text-slate-400 shrink-0 mt-2">
                {expandedId === scenario.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            <AnimatePresence>
              {expandedId === scenario.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100"
                >
                  <div className="p-5 space-y-8 bg-slate-50/50">
                    
                    {/* Symptoms */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" /> Incident Symptoms
                      </h3>
                      <ul className="space-y-2 bg-red-50/50 border border-red-100 rounded-lg p-4">
                        {scenario.symptoms.map((symptom, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="text-red-500 font-bold mt-0.5">•</span>
                            <span><HighlightText text={symptom} /></span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Diagnostic Steps */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-700" /> Diagnostic Steps
                      </h3>
                      <div className="space-y-4">
                        {scenario.diagnosticSteps.map((step, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 border-b border-slate-200 flex items-center gap-2">
                              <span className="bg-slate-200 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">{step.step}</span>
                              {step.description}
                            </div>
                            <div className="p-4 bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto">
                              <div className="text-blue-400 mb-2">$ {step.command}</div>
                              <pre className="text-slate-400">{step.expectedLogOutput}</pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Root Cause & Remediation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Root Cause</h3>
                        <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200 h-full">
                          <HighlightText text={scenario.rootCauseAnalysis} />
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Immediate Remediation</h3>
                        <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-green-200 h-full">
                          <HighlightText text={scenario.immediateRemediation} />
                        </p>
                      </div>
                    </div>

                    {/* Long Term Fix */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-purple-600" /> Architecture Fix
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <HighlightText text={scenario.longTermArchitectureFix} />
                      </p>
                    </div>

                    {/* Interviewer Questions */}
                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">Interviewer Key Questions</h3>
                      <ul className="list-decimal pl-4 space-y-2">
                        {scenario.interviewerKeyQuestions.map((q, i) => (
                          <li key={i} className="text-sm text-slate-700 font-medium"><HighlightText text={q} /></li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
