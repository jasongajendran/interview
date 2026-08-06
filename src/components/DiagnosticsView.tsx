import { useState } from 'react';
import { diagnosticTools } from '../data';
import { 
  Terminal, 
  Lightbulb, 
  Code2, 
  Copy, 
  Check, 
  Search, 
  Cpu, 
  Layers, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { HighlightText } from './HighlightText';

export function DiagnosticsView() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCmd(code);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const categories = ['all', ...Array.from(new Set(diagnosticTools.map(t => t.category)))];

  const filteredTools = diagnosticTools.filter(tool => {
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(term) ||
      tool.purpose.toLowerCase().includes(term) ||
      tool.syntaxOrCommand.toLowerCase().includes(term) ||
      tool.keyUseCases.some(u => u.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -z-10" />

        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200 shadow-2xs flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-700" />
            JVM Forensics &amp; CLI Toolkit
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
            {diagnosticTools.length} Tools &amp; Flag Guides
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight mb-3">
          Diagnostic Tools, CLI &amp; Production JVM Flags
        </h1>

        <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
          Quick-reference cheat sheet for debugging live Java applications, reading thread and heap dumps, inspecting native memory with NMT, and configuring high-throughput GC flags.
        </p>

        {/* Toolbar & Filter */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. 'jstack', 'jcmd', 'G1GC', 'Metaspace')..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all border ${
                  selectedCategory === cat
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-6">
        {filteredTools.map((tool, idx) => (
          <article 
            key={idx} 
            className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-sm transition-all"
          >
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider border border-amber-200">
                  {tool.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight font-mono">{tool.name}</h2>
              <div className="text-[14.5px] text-slate-600 mt-1.5 leading-relaxed">
                <HighlightText text={tool.purpose} searchQuery={searchQuery} />
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 md:p-6 space-y-6 bg-slate-50/60">
              
              {/* Syntax & Output Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Syntax Command */}
                <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-sm flex flex-col justify-between">
                  <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-sky-400" /> Syntax / Command
                    </span>
                    <button
                      onClick={(e) => handleCopy(tool.syntaxOrCommand, e)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[10.5px] font-medium border border-slate-700"
                    >
                      {copiedCmd === tool.syntaxOrCommand ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-sky-300 text-xs font-mono whitespace-pre-wrap leading-relaxed flex-1 overflow-x-auto">
                    <code>{tool.syntaxOrCommand}</code>
                  </pre>
                </div>

                {/* Sample Output */}
                {tool.sampleOutput && (
                  <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-400 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-amber-400" /> Sample Console Output
                      </span>
                    </div>
                    <pre className="p-4 text-emerald-400/90 text-[11px] font-mono whitespace-pre-wrap leading-relaxed flex-1 overflow-x-auto max-h-[220px]">
                      <code>{tool.sampleOutput}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Key Use Cases */}
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2.5">
                  Key Production Use Cases
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {tool.keyUseCases.map((useCase, i) => (
                    <li 
                      key={i} 
                      className="text-[13.5px] text-slate-800 flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs leading-relaxed"
                    >
                      <span className="text-indigo-500 font-bold mt-0.5">•</span>
                      <span><HighlightText text={useCase} searchQuery={searchQuery} /></span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interviewer Tip */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 md:p-5 rounded-xl border border-amber-200 shadow-2xs flex items-start gap-3.5">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider mb-1">
                    Senior Interviewer Pro-Tip &amp; Forensic Nuance
                  </h4>
                  <div className="text-[13.5px] text-amber-950 leading-relaxed font-medium">
                    <HighlightText text={tool.interviewerTips} searchQuery={searchQuery} />
                  </div>
                </div>
              </div>

            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
