import { diagnosticTools } from '../data';
import { Terminal, Lightbulb, Code2 } from 'lucide-react';
import { HighlightText } from './HighlightText';

export function DiagnosticsView() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-slate-800 text-slate-100 text-xs font-semibold rounded-full mb-3 flex items-center gap-2 w-max">
          <Terminal className="w-3 h-3" /> Tooling & Diagnostics
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Diagnostic Tools & JVM Flags</h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Cheat sheet for debugging Java applications, reading thread dumps, and configuring GC flags in production.
        </p>
      </div>

      <div className="space-y-6">
        {diagnosticTools.map((tool, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {tool.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{tool.name}</h2>
                <p className="text-sm text-slate-600 mt-1"><HighlightText text={tool.purpose} /></p>
              </div>
            </div>

            <div className="p-5 space-y-6 bg-slate-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-600" /> Syntax / Command
                  </h3>
                  <pre className="bg-slate-900 text-blue-300 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed h-[200px]">
                    <code>{tool.syntaxOrCommand}</code>
                  </pre>
                </div>
                
                {tool.sampleOutput && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-slate-600" /> Sample Output
                    </h3>
                    <pre className="bg-slate-800 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed h-[200px]">
                      <code>{tool.sampleOutput}</code>
                    </pre>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Key Use Cases</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tool.keyUseCases.map((useCase, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><HighlightText text={useCase} /></span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900 mb-1">Interviewer Tip</h4>
                  <p className="text-sm text-blue-800 leading-relaxed"><HighlightText text={tool.interviewerTips} /></p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
