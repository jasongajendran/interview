import { useState } from 'react';
import { productionScenarios } from '../data';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Code2, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  Wrench,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HighlightText } from './HighlightText';

interface ScenariosViewProps {
  targetScenarioId?: string;
}

export function ScenariosView({ targetScenarioId }: ScenariosViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(targetScenarioId || null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (cmd: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredScenarios = productionScenarios.filter(sc => {
    if (filterSeverity !== 'all' && !sc.severity.includes(filterSeverity)) return false;
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    return (
      sc.title.toLowerCase().includes(term) ||
      sc.affectedComponent.toLowerCase().includes(term) ||
      sc.symptoms.some(s => s.toLowerCase().includes(term)) ||
      sc.rootCauseAnalysis.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-4xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="bg-white border border-rose-200/80 rounded-2xl p-6 md:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10" />

        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full border border-rose-200 shadow-2xs flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            P1 / P2 Critical Incident Labs
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
            {productionScenarios.length} Outage Scenarios
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">
          Production Outage &amp; Forensic Scenarios
        </h1>

        <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
          Evaluate candidates on real-world production incident response. Practice diagnosing thread starvation, HikariCP connection leaks, OutOfMemoryError heap crashes, and database lock deadlocks.
        </p>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search outages by keyword (e.g. 'HikariCP', 'Deadlock', 'Metaspace')..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterSeverity(filterSeverity === 'P1' ? 'all' : 'P1')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                filterSeverity === 'P1'
                  ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              P1 Only
            </button>
            <button
              onClick={() => setFilterSeverity(filterSeverity === 'P2' ? 'all' : 'P2')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                filterSeverity === 'P2'
                  ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              P2 Only
            </button>
          </div>
        </div>
      </div>

      {/* Scenario List */}
      <div className="space-y-5">
        {filteredScenarios.map((scenario) => {
          const isExpanded = expandedId === scenario.id;

          return (
            <article 
              key={scenario.id} 
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                isExpanded 
                  ? 'border-rose-300 shadow-md ring-1 ring-rose-500/10' 
                  : 'border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Trigger */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : scenario.id)}
                className="w-full text-left p-5 md:p-6 flex items-start justify-between gap-4 cursor-pointer select-none bg-white hover:bg-slate-50/70 transition-colors"
                role="button"
                tabIndex={0}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      scenario.severity.includes('P1') 
                        ? 'bg-rose-100 text-rose-900 border-rose-300' 
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {scenario.severity}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {scenario.affectedComponent}
                    </span>
                  </div>

                  <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug tracking-tight">
                    {scenario.title}
                  </h2>

                  {!isExpanded && (
                    <div className="mt-3 bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-xs text-slate-700">
                      <span className="font-bold text-rose-800 mr-1.5">Key Symptom:</span>
                      <HighlightText text={scenario.symptoms[0]} searchQuery={searchQuery} />
                    </div>
                  )}
                </div>

                <div className="p-2 bg-slate-100 rounded-xl text-slate-500 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Incident Content */}
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
                      
                      {/* Symptoms Card */}
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600" /> 
                          Reported Incident Symptoms &amp; Telemetry
                        </h3>
                        <ul className="space-y-2.5 bg-rose-50/60 border border-rose-200 rounded-xl p-4 md:p-5 shadow-2xs">
                          {scenario.symptoms.map((symptom, i) => (
                            <li key={i} className="text-[14px] text-slate-800 leading-relaxed flex items-start gap-2.5">
                              <span className="text-rose-600 font-bold mt-0.5">•</span>
                              <div className="flex-1">
                                <HighlightText text={symptom} searchQuery={searchQuery} />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Forensic Diagnostic Steps & Commands */}
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-slate-800" /> 
                          Diagnostic Procedure &amp; CLI Commands
                        </h3>
                        <div className="space-y-4">
                          {scenario.diagnosticSteps.map((step, i) => (
                            <div key={i} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-sm">
                              {/* Step Header */}
                              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 font-semibold text-slate-200">
                                  <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold">
                                    {step.step}
                                  </span>
                                  <span>{step.description}</span>
                                </div>

                                <button
                                  onClick={(e) => handleCopy(step.command, e)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium border border-slate-700"
                                >
                                  {copiedCmd === step.command ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Command</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Terminal Command */}
                              <div className="p-4 font-mono text-xs text-sky-300 bg-slate-900 border-b border-slate-800/80">
                                <span className="text-slate-500 select-none mr-2">$</span>
                                {step.command}
                              </div>

                              {/* Expected Output */}
                              {step.expectedLogOutput && (
                                <div className="p-4 bg-slate-950/80 text-slate-300 font-mono text-[11.5px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Expected Log / Thread Dump Signature:</div>
                                  <pre className="text-amber-300/90">{step.expectedLogOutput}</pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Root Cause & Immediate Remediation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Root Cause */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-rose-600" /> Root Cause Analysis
                            </h3>
                            <p className="text-[14px] text-slate-700 leading-relaxed">
                              <HighlightText text={scenario.rootCauseAnalysis} searchQuery={searchQuery} />
                            </p>
                          </div>
                        </div>

                        {/* Immediate Remediation */}
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                              <Wrench className="w-4 h-4 text-emerald-600" /> Immediate Production Remediation
                            </h3>
                            <p className="text-[14px] text-slate-800 leading-relaxed font-medium">
                              <HighlightText text={scenario.immediateRemediation} searchQuery={searchQuery} />
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Long-Term Architecture Fix */}
                      <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-5 shadow-2xs">
                        <h3 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-purple-600" /> 
                          Long-term Architecture &amp; System Hardening Fix
                        </h3>
                        <p className="text-[14px] text-slate-800 leading-relaxed">
                          <HighlightText text={scenario.longTermArchitectureFix} searchQuery={searchQuery} />
                        </p>
                      </div>

                      {/* Interviewer Key Drill-down Questions */}
                      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs">
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3.5 border-b border-slate-100 pb-2.5">
                          Candidate Evaluation: Interview Drill-down Questions
                        </h3>
                        <ul className="space-y-2.5">
                          {scenario.interviewerKeyQuestions.map((q, i) => (
                            <li key={i} className="text-[13.5px] text-slate-800 leading-relaxed flex items-start gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                              <span className="font-bold text-rose-600 font-mono">{i + 1}.</span>
                              <span className="font-medium"><HighlightText text={q} searchQuery={searchQuery} /></span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </div>
  );
}
