import { Home, AlertTriangle, Terminal, BookOpen, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES_META } from '../data';
import { CategoryId } from '../types';

interface NavigationProps {
  currentView: 'home' | 'category' | 'scenarios' | 'diagnostics';
  currentCategory?: CategoryId;
  onNavigate: (view: 'home' | 'category' | 'scenarios' | 'diagnostics', categoryId?: CategoryId) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export function Navigation({
  currentView,
  currentCategory,
  onNavigate,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'scenarios', label: 'Production Incidents', icon: AlertTriangle },
    { id: 'diagnostics', label: 'Diagnostic Tools', icon: Terminal },
  ];

  const handleNav = (view: any, catId?: any) => {
    onNavigate(view, catId);
    setIsMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">Java Mastery</h1>
          <p className="text-xs text-slate-400">Interview Prep</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-2">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                  currentView === item.id && !currentCategory
                    ? 'bg-blue-600/10 text-blue-400 font-medium'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 mt-6">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Categories</p>
          <div className="space-y-1">
            {CATEGORIES_META.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleNav('category', cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm text-left ${
                  currentView === 'category' && currentCategory === cat.id
                    ? 'bg-blue-600/10 text-blue-400 font-medium'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span className="truncate">{cat.shortName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        {navContent}
      </div>

      {/* Mobile Header & Menu */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-1.5 rounded-md text-white">
                <BookOpen className="w-4 h-4" />
             </div>
             <span className="text-white font-bold">Java Mastery</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-300 hover:text-white p-1"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-10 pt-[60px]"
            >
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="relative h-full w-64 bg-slate-900 shadow-xl">
                {navContent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
