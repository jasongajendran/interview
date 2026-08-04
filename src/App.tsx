/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CategoryView } from './components/CategoryView';
import { ScenariosView } from './components/ScenariosView';
import { DiagnosticsView } from './components/DiagnosticsView';
import { CategoryId } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'scenarios' | 'diagnostics'>('home');
  const [currentCategory, setCurrentCategory] = useState<CategoryId | undefined>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (view: 'home' | 'category' | 'scenarios' | 'diagnostics', categoryId?: CategoryId) => {
    setCurrentView(view);
    setCurrentCategory(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      <Navigation 
        currentView={currentView}
        currentCategory={currentCategory}
        onNavigate={handleNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-h-[calc(100vh-60px)] md:min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentView}-${currentCategory || ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {currentView === 'home' && <Dashboard onNavigate={handleNavigate} />}
            {currentView === 'category' && currentCategory && <CategoryView categoryId={currentCategory} />}
            {currentView === 'scenarios' && <ScenariosView />}
            {currentView === 'diagnostics' && <DiagnosticsView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

