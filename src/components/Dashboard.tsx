import { CATEGORIES_META } from '../data';
import { CategoryId } from '../types';
import { BookOpen, AlertTriangle, Terminal, Code2, Boxes, ShieldCheck, Database, CheckCircle2, GitBranch, Layers, Server, Layout } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: 'home' | 'category' | 'scenarios' | 'diagnostics', categoryId?: CategoryId) => void;
}

const ICONS: Record<string, any> = {
  Code2, Boxes, ShieldCheck, Database, CheckCircle2, GitBranch, Layers, Server, Layout, Terminal, AlertTriangle
};

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Java Mastery Hub</h1>
        <p className="text-slate-600 max-w-3xl leading-relaxed">
          Comprehensive interview preparation for Senior and Architect level Java developers. 
          Focusing on core internals, modern Spring Boot, microservices architecture, and production forensics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES_META.map((cat) => {
          const Icon = ICONS[cat.iconName] || BookOpen;
          return (
            <button
              key={cat.id}
              onClick={() => onNavigate('category', cat.id)}
              className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                  {cat.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.name}</h3>
              <p className="text-sm text-slate-500 flex-grow">{cat.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-200">
        <button
          onClick={() => onNavigate('scenarios')}
          className="text-left bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Production Outages</h3>
          </div>
          <p className="text-sm text-slate-600 ml-16">
            Real-world incident forensics. Learn how to debug P1 thread starvation, memory leaks, and database deadlocks.
          </p>
        </button>

        <button
          onClick={() => onNavigate('diagnostics')}
          className="text-left bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-slate-200 text-slate-700 rounded-lg group-hover:bg-slate-700 group-hover:text-white transition-colors">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Diagnostic Tools</h3>
          </div>
          <p className="text-sm text-slate-600 ml-16">
            Master the JVM CLI tools (jcmd, jstack) and JVM tuning flags necessary for troubleshooting enterprise systems.
          </p>
        </button>
        
        <button
          onClick={() => onNavigate('visuals' as any)}
          className="text-left bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 hover:shadow-md transition-all group md:col-span-2"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Visual Concepts</h3>
          </div>
          <p className="text-sm text-slate-600 ml-16">
            Pictorial representations of complex Java architectures, JVM internals, thread models, and data structures.
          </p>
        </button>
      </div>
    </div>
  );
}
