/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CategoryView } from './components/CategoryView';
import { ScenariosView } from './components/ScenariosView';
import { DiagnosticsView } from './components/DiagnosticsView';
import { VisualsView } from './components/VisualsView';
import { SearchModal } from './components/SearchModal';
import { CategoryId } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'scenarios' | 'diagnostics' | 'visuals'>('home');
  const [currentCategory, setCurrentCategory] = useState<CategoryId | undefined>('java-core');
  const [targetQuestionId, setTargetQuestionId] = useState<string | undefined>();
  const [targetScenarioId, setTargetScenarioId] = useState<string | undefined>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Bookmark persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('java_prep_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('java_prep_bookmarks', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const handleNavigate = (
    view: 'home' | 'category' | 'scenarios' | 'diagnostics' | 'visuals',
    categoryId?: CategoryId,
    questionId?: string,
    scenarioId?: string
  ) => {
    setCurrentView(view);
    if (categoryId) setCurrentCategory(categoryId);
    setTargetQuestionId(questionId);
    setTargetScenarioId(scenarioId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut listener for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Sidebar & Mobile Header */}
      <Navigation 
        currentView={currentView}
        currentCategory={currentCategory}
        onNavigate={handleNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenSearch={() => setIsSearchOpen(true)}
        bookmarkedIds={bookmarkedIds}
      />
      
      {/* Main Study Canvas */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden min-h-[calc(100vh-60px)] md:min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentView}-${currentCategory || ''}-${targetQuestionId || ''}-${targetScenarioId || ''}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {currentView === 'home' && (
              <Dashboard 
                onNavigate={handleNavigate as any}
                onOpenSearch={() => setIsSearchOpen(true)}
                bookmarkedIds={bookmarkedIds}
              />
            )}
            
            {currentView === 'category' && currentCategory && (
              <CategoryView 
                categoryId={currentCategory}
                onNavigateCategory={(catId) => handleNavigate('category', catId)}
                targetQuestionId={targetQuestionId}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            )}
            
            {currentView === 'scenarios' && (
              <ScenariosView targetScenarioId={targetScenarioId} />
            )}
            
            {currentView === 'diagnostics' && (
              <DiagnosticsView />
            )}
            
            {currentView === 'visuals' && (
              <VisualsView />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectQuestion={(catId, qId) => handleNavigate('category', catId, qId)}
        onSelectScenario={(scId) => handleNavigate('scenarios', undefined, undefined, scId)}
        onSelectDiagnostic={() => handleNavigate('diagnostics')}
        onSelectVisual={() => handleNavigate('visuals')}
      />
    </div>
  );
}
