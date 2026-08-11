import { useState } from 'react';
import {
  Puzzle,
  Box,
  Share2,
  RefreshCw,
  GitMerge,
  Factory,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Code2
} from 'lucide-react';

export function DesignPatternsVisuals() {
  const [expandedSection, setExpandedSection] = useState<string | null>('strategy-pattern');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-10">
      {/* 1. Strategy Pattern */}
      <section id="strategy-pattern" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <GitMerge className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Strategy Pattern & Open/Closed Principle</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Eliminating large if-else blocks via runtime polymorphism</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSection('strategy-pattern')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start md:self-auto bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {expandedSection === 'strategy-pattern' ? <>Hide <ChevronUp className="w-3.5 h-3.5" /></> : <>Expand <ChevronDown className="w-3.5 h-3.5" /></>}
            </button>
          </div>

          {expandedSection === 'strategy-pattern' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Before: Procedural Code */}
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-rose-800 font-bold mb-4 text-sm">
                    <AlertTriangle className="w-4 h-4" /> The Anti-Pattern: Fat Conditionals
                  </div>
                  <pre className="bg-white/80 p-3 rounded-lg border border-rose-100 text-[10px] font-mono text-slate-700 overflow-x-auto">
                    {`public class PaymentProcessor {
    public void pay(String type, int amount) {
        if ("CREDIT".equals(type)) {
            // 50 lines of Stripe API logic
        } else if ("PAYPAL".equals(type)) {
            // 40 lines of PayPal logic
        } else if ("CRYPTO".equals(type)) {
            // 60 lines of Crypto logic
        }
        // Violation of Open/Closed Principle!
    }
}`}
                  </pre>
                  <p className="mt-3 text-xs text-rose-700 leading-relaxed">
                    Adding a new payment type requires modifying the existing class, increasing the risk of breaking existing logic.
                  </p>
                </div>

                {/* After: Strategy Pattern */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-4 text-sm">
                    <Puzzle className="w-4 h-4" /> The Solution: Strategy Interface
                  </div>
                  <pre className="bg-white/80 p-3 rounded-lg border border-emerald-100 text-[10px] font-mono text-slate-700 overflow-x-auto">
                    {`public interface PaymentStrategy {
    void pay(int amount);
}

// Concrete Implementations
public class StripeStrategy implements PaymentStrategy { ... }
public class PayPalStrategy implements PaymentStrategy { ... }

// Context Class
public class PaymentProcessor {
    // Injected dynamically (e.g., via Spring Map<String, Strategy>)
    private PaymentStrategy strategy;
    
    public void process(int amount) {
        strategy.pay(amount); // Polymorphism!
    }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Observer Pattern */}
      <section id="observer-pattern" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Observer Pattern (Publish/Subscribe)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Event-driven decoupling and the Lapsed Listener Problem</p>
              </div>
            </div>
          </div>
          <div className="p-6">
             <div className="flex flex-col md:flex-row items-center gap-6">
               <div className="w-full md:w-1/3 bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm text-center">
                 <div className="mx-auto w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-2 border-2 border-sky-200">
                    <RefreshCw className="w-6 h-6" />
                 </div>
                 <h4 className="font-bold text-slate-800 text-sm">Subject (Publisher)</h4>
                 <p className="text-[10px] text-slate-500 mt-1">Maintains a List&lt;Observer&gt;.</p>
                 <p className="text-[10px] text-slate-500">Loops through list calling update().</p>
               </div>
               
               <div className="hidden md:flex flex-1 items-center justify-center relative">
                  <div className="w-full h-0.5 bg-slate-300 relative">
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-400 rotate-45 transform origin-center"></div>
                  </div>
                  <div className="absolute bg-white px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    notifyObservers()
                  </div>
               </div>

               <div className="w-full md:w-1/3 flex flex-col gap-3">
                 <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 shadow-sm flex items-center gap-3">
                    <Box className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">Observer A (Email Service)</h4>
                      <p className="text-[10px] text-slate-600">implements update(Event)</p>
                    </div>
                 </div>
                 <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 shadow-sm flex items-center gap-3">
                    <Box className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">Observer B (Audit Log)</h4>
                      <p className="text-[10px] text-slate-600">implements update(Event)</p>
                    </div>
                 </div>
               </div>
             </div>
             
             <div className="mt-6 bg-slate-900 rounded-xl p-4 text-slate-300">
                <h4 className="text-xs font-mono text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Lapsed Listener Memory Leak
                </h4>
                <p className="text-xs leading-relaxed">
                  If an Observer is no longer needed (e.g., a UI component is closed) but it forgets to deregister itself from the Subject's list, the Subject maintains a strong reference to it. This prevents the Garbage Collector from freeing the Observer, causing a memory leak. <strong>Solution:</strong> Use <code>WeakReference&lt;Observer&gt;</code> in the Subject's list, or rely on modern frameworks that manage lifecycles.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Singleton vs Enum */}
      <section id="singleton-pattern" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-fuchsia-100 text-fuchsia-700 rounded-xl">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Singleton Pattern & The Enum Solution</h2>
                <p className="text-xs text-slate-500 mt-0.5">Double-checked locking vs Enum instantiation</p>
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-3">
               <h3 className="text-sm font-bold text-slate-800">Double-Checked Locking</h3>
               <pre className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-700">
{`public class DB {
    private static volatile DB inst;
    private DB() {}
    
    public static DB get() {
        if (inst == null) {
            synchronized (DB.class) {
                if (inst == null) {
                    inst = new DB();
                }
            }
        }
        return inst;
    }
}`}
               </pre>
               <p className="text-xs text-slate-600">
                 Requires <code>volatile</code> to prevent instruction reordering (partially constructed objects). Vulnerable to Reflection attacks.
               </p>
             </div>
             
             <div className="space-y-3">
               <h3 className="text-sm font-bold text-slate-800">Joshua Bloch's Enum Singleton</h3>
               <pre className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-700">
{`public enum DB {
    INSTANCE;
    
    private Connection conn;
    
    // Enum constructor is always private
    DB() {
        conn = createConnection();
    }
    
    public void query() { ... }
}`}
               </pre>
               <p className="text-xs text-slate-600">
                 Inherently thread-safe (JVM handles enum initialization). 100% immune to Reflection (JVM throws Exception) and Serialization attacks.
               </p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
