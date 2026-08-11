import { useState } from 'react';
import { CATEGORIES_META, allQuestions, productionScenarios, diagnosticTools } from '../data';
import { CategoryId } from '../types';
import { 
  BookOpen, 
  AlertTriangle, 
  Terminal, 
  Code2, 
  Boxes, 
  ShieldCheck, 
  Database, 
  CheckCircle2, 
  GitBranch, 
  Layers, 
  Server, 
  Layout, 
  Cloud,
  Puzzle,
  Search,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';
import { HighlightText } from './HighlightText';

interface DashboardProps {
  onNavigate: (view: 'home' | 'category' | 'scenarios' | 'diagnostics' | 'visuals', categoryId?: CategoryId) => void;
  onOpenSearch?: () => void;
  bookmarkedIds?: string[];
}

const ICONS: Record<string, any> = {
  Code2, Boxes, ShieldCheck, Database, CheckCircle2, GitBranch, Layers, Server, Layout, Terminal, AlertTriangle, Cloud, Puzzle
};

export function Dashboard({ onNavigate, onOpenSearch, bookmarkedIds = [] }: DashboardProps) {
  const getCategoryQuestionCount = (catId: CategoryId) => {
    return allQuestions.filter(q => q.category === catId).length;
  };

  const coreCategories = CATEGORIES_META.filter(c => 
    ['java-core', 'java-17', 'design-patterns', 'spring-boot', 'microservices-security'].includes(c.id)
  );

  const dataCloudCategories = CATEGORIES_META.filter(c => 
    ['sql-database', 'aws-cloud'].includes(c.id)
  );

  const enterpriseCategories = CATEGORIES_META.filter(c => 
    ['testing-frameworks', 'devops-cicd', 'legacy-web', 'jboss-wildfly', 'ui-frontend'].includes(c.id)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Senior &amp; Architect Interview Master Guide
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Java, Spring &amp; Cloud <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">
              Architecture Reference
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 font-normal">
            A comprehensive reference designed for <strong className="text-white">Senior (10-12 YOE)</strong> and <strong className="text-white">Lead/Architect (13-15+ YOE)</strong> roles. Covering JVM internal forensics, Spring 6 / Boot 3.x, RabbitMQ resiliency, OAuth2/PKCE flows, and production P1 incident debugging.
          </p>

          {/* Quick Action Search Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-3 px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02]"
            >
              <Search className="w-4 h-4 text-indigo-600" />
              <span>Search All Questions &amp; Topics (⌘K)</span>
            </button>

            <button
              onClick={() => onNavigate('visuals')}
              className="flex items-center gap-2 px-4 py-3 bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 rounded-xl font-semibold text-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Explore Visual Concept Maps</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-2xl font-extrabold text-white">{allQuestions.length}</div>
            <div className="text-xs text-slate-400 font-medium">Architecture Questions</div>
          </div>
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-2xl font-extrabold text-rose-400">{productionScenarios.length}</div>
            <div className="text-xs text-slate-400 font-medium">P1/P2 Incident Forensics</div>
          </div>
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-2xl font-extrabold text-amber-400">{diagnosticTools.length}</div>
            <div className="text-xs text-slate-400 font-medium">JVM Diagnostics &amp; Flags</div>
          </div>
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-2xl font-extrabold text-sky-400">18</div>
            <div className="text-xs text-slate-400 font-medium">Visual Architecture Blueprints</div>
          </div>
        </div>
      </div>

      {/* Featured Incident & Diagnostic Practice Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" /> Production Labs &amp; Concept Blueprints
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Visual Concepts */}
          <button
            onClick={() => onNavigate('visuals')}
            className="text-left bg-white border border-slate-200/90 rounded-2xl p-6 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-2xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  18 Visual Diagrams
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Visual Concept Maps
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear structural schematics of Kafka commit logs &amp; rebalances, RabbitMQ DLX retries, JVM Metaspace, Spring AOP proxies, Sagas, and OAuth 2.0 PKCE.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>View Diagrams</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          {/* Outage Scenarios */}
          <button
            onClick={() => onNavigate('scenarios')}
            className="text-left bg-white border border-slate-200/90 rounded-2xl p-6 hover:border-rose-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors shadow-2xs">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full">
                  P1 / P2 Scenarios
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                Production Outages
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-world forensic scenarios. Master how to diagnose database connection exhaustion, Thread starvation, and Metaspace classloader leaks.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
              <span>Debug Incidents</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          {/* Diagnostic Tools */}
          <button
            onClick={() => onNavigate('diagnostics')}
            className="text-left bg-white border border-slate-200/90 rounded-2xl p-6 hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-2xs">
                  <Terminal className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                  CLI &amp; Flags
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                Diagnostic Tools
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                CLI commands (jcmd, jstack, jmap) and production JVM tuning flags for garbage collection, heap analysis, and thread dump inspection.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>Open Tooling</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>
      </div>

      {/* Section 1: Core Platform Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" /> Core Java &amp; Framework Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Collections, JVM memory, Spring Boot 3.x internals, and Microservice security</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {coreCategories.map((cat) => {
            const Icon = ICONS[cat.iconName] || BookOpen;
            const count = getCategoryQuestionCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('category', cat.id)}
                className="text-left bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-mono">
                      {count} Qs
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                  <span>{cat.badge}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Data & Cloud */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-600" /> Data &amp; Cloud Infrastructure
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">PostgreSQL, JPA &amp; Hibernate caching, and AWS Serverless &amp; VPC architectures</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataCloudCategories.map((cat) => {
            const Icon = ICONS[cat.iconName] || BookOpen;
            const count = getCategoryQuestionCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('category', cat.id)}
                className="text-left bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-cyan-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-xl group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded-full font-mono">
                      {count} Qs
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-cyan-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-cyan-700">
                  <span>{cat.badge}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Enterprise, Web & DevOps */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" /> Enterprise, Testing &amp; DevOps
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">JUnit 5, Mockito, Maven multi-module BOMs, JSF / FreeMarker, JBoss, and Web Security</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enterpriseCategories.map((cat) => {
            const Icon = ICONS[cat.iconName] || BookOpen;
            const count = getCategoryQuestionCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('category', cat.id)}
                className="text-left bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-mono">
                      {count} Qs
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                  <span>{cat.badge}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
