import { useState } from 'react';
import { 
  Home, 
  AlertTriangle, 
  Terminal, 
  BookOpen, 
  Menu, 
  X, 
  Search, 
  Code2, 
  Layers, 
  Boxes, 
  ShieldCheck, 
  Database, 
  CheckCircle2, 
  GitBranch, 
  Server, 
  Layout, 
  Cloud,
  ChevronRight,
  Sparkles,
  BookmarkCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES_META, allQuestions, productionScenarios, diagnosticTools } from '../data';
import { CategoryId } from '../types';

interface NavigationProps {
  currentView: 'home' | 'category' | 'scenarios' | 'diagnostics' | 'visuals';
  currentCategory?: CategoryId;
  onNavigate: (view: 'home' | 'category' | 'scenarios' | 'diagnostics' | 'visuals', categoryId?: CategoryId) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onOpenSearch: () => void;
  bookmarkedIds?: string[];
}

const CATEGORY_ICONS: Record<string, any> = {
  Code2, Layers, Boxes, ShieldCheck, Database, CheckCircle2, GitBranch, Server, Layout, Cloud
};

export function Navigation({
  currentView,
  currentCategory,
  onNavigate,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onOpenSearch,
  bookmarkedIds = []
}: NavigationProps) {

  const handleNav = (view: any, catId?: any) => {
    onNavigate(view, catId);
    setIsMobileMenuOpen(false);
  };

  // Group categories logically
  const coreCategories = CATEGORIES_META.filter(c => 
    ['java-core', 'java-17', 'spring-boot', 'microservices-security'].includes(c.id)
  );

  const dataCloudCategories = CATEGORIES_META.filter(c => 
    ['sql-database', 'aws-cloud'].includes(c.id)
  );

  const enterpriseCategories = CATEGORIES_META.filter(c => 
    ['testing-frameworks', 'devops-cicd', 'legacy-web', 'jboss-wildfly', 'ui-frontend'].includes(c.id)
  );

  const getCategoryQuestionCount = (catId: CategoryId) => {
    return allQuestions.filter(q => q.category === catId).length;
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-72 border-r border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <button 
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-base tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
              Java Architect
            </h1>
            <p className="text-[11px] font-medium text-slate-400">Mastery &amp; Interview Hub</p>
          </div>
        </button>
      </div>

      {/* Quick Search Bar Trigger */}
      <div className="p-3 border-b border-slate-800/60">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
            <span>Search concepts...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-900 text-slate-400 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 text-xs">
        
        {/* Core Hub */}
        <div>
          <div className="px-2 mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Practice Hub</span>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left font-medium ${
                currentView === 'home'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-indigo-400" />
                <span className="text-[13px]">Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('visuals')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left font-medium ${
                currentView === 'visuals'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span className="text-[13px]">Visual Concept Maps</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                6 Diagrams
              </span>
            </button>

            <button
              onClick={() => handleNav('scenarios')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left font-medium ${
                currentView === 'scenarios'
                  ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-[13px]">Production Incidents</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {productionScenarios.length} P1/P2
              </span>
            </button>

            <button
              onClick={() => handleNav('diagnostics')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left font-medium ${
                currentView === 'diagnostics'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="text-[13px]">Diagnostic Tools &amp; CLI</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {diagnosticTools.length}
              </span>
            </button>
          </div>
        </div>

        {/* Section 1: Core Platform */}
        <div>
          <div className="px-2 mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Core &amp; Frameworks</span>
          </div>
          <div className="space-y-1">
            {coreCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.iconName] || BookOpen;
              const count = getCategoryQuestionCount(cat.id);
              const isActive = currentView === 'category' && currentCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleNav('category', cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                    <span className="truncate text-[12.5px]">{cat.shortName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Data & Cloud */}
        <div>
          <div className="px-2 mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data &amp; Cloud</span>
          </div>
          <div className="space-y-1">
            {dataCloudCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.iconName] || BookOpen;
              const count = getCategoryQuestionCount(cat.id);
              const isActive = currentView === 'category' && currentCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleNav('category', cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                    <span className="truncate text-[12.5px]">{cat.shortName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Enterprise, Web & DevOps */}
        <div>
          <div className="px-2 mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enterprise &amp; Testing</span>
          </div>
          <div className="space-y-1">
            {enterpriseCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.iconName] || BookOpen;
              const count = getCategoryQuestionCount(cat.id);
              const isActive = currentView === 'category' && currentCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleNav('category', cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <span className="truncate text-[12.5px]">{cat.shortName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{bookmarkedIds.length} Saved Items</span>
        </div>
        <span className="text-slate-500 font-mono">50+ Scenarios</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 text-left"
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-white font-bold text-sm">Java Architect</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden flex"
          >
            <div 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-72 h-full shadow-2xl"
            >
              {navContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
