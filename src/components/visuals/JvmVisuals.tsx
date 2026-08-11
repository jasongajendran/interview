import { useState } from 'react';
import {
  Server,
  Activity,
  Cpu,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export function JvmVisuals() {
  const [activeGcTab, setActiveGcTab] = useState<'g1' | 'zgc'>('g1');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-10">
      {/* 1. JVM Memory Model & Generations Layout */}
      <section id="jvm-memory" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">JVM Runtime Memory Architecture (Java 8 - 21+)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Heap (Shared), Non-Heap Native Memory (Metaspace, Code Cache) &amp; Per-Thread Stack Frames</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSection('jvm-memory')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start md:self-auto bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {expandedSection === 'jvm-memory' ? <>Hide Deep Dive <ChevronUp className="w-3.5 h-3.5" /></> : <>Senior Deep Dive <ChevronDown className="w-3.5 h-3.5" /></>}
            </button>
          </div>

          <div className="p-6">
            {/* Visual Diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Heap Area (8 cols) */}
              <div className="lg:col-span-7 bg-amber-50/60 rounded-2xl p-5 border border-amber-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <h3 className="font-bold text-amber-950 text-sm">Heap Memory (Shared across all threads)</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 font-semibold">-Xms / -Xmx</span>
                </div>

                <div className="space-y-3 flex-1">
                  {/* Young Gen */}
                  <div className="bg-emerald-50/90 border border-emerald-300 rounded-xl p-3.5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Young Generation (Minor GC)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">-XX:NewRatio=2</span>
                    </div>

                    <div className="grid grid-cols-12 gap-2 text-xs">
                      {/* Eden */}
                      <div className="col-span-6 bg-white p-2.5 rounded-lg text-center shadow-xs border border-emerald-200">
                        <div className="font-bold text-emerald-900 text-xs">Eden Space (80%)</div>
                        <p className="text-[10px] text-slate-500 mt-0.5">All <code>new</code> allocations first land here via TLABs</p>
                      </div>
                      {/* S0 */}
                      <div className="col-span-3 bg-white p-2.5 rounded-lg text-center shadow-xs border border-emerald-200">
                        <div className="font-bold text-emerald-900 text-xs">S0 (From)</div>
                        <p className="text-[10px] text-slate-500 mt-0.5">Age tracking</p>
                      </div>
                      {/* S1 */}
                      <div className="col-span-3 bg-white p-2.5 rounded-lg text-center shadow-xs border border-emerald-200">
                        <div className="font-bold text-emerald-900 text-xs">S1 (To)</div>
                        <p className="text-[10px] text-slate-500 mt-0.5">Copy survivor</p>
                      </div>
                    </div>
                  </div>

                  {/* Old Gen */}
                  <div className="bg-sky-50 border border-sky-300 rounded-xl p-4 text-center">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span> Old Generation / Tenured (Major / Full GC)
                      </span>
                      <span className="text-[10px] font-mono text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded">-XX:MaxTenuringThreshold=15</span>
                    </div>
                    <p className="text-xs text-sky-900 leading-relaxed text-left">
                      Stores long-lived objects that survived multiple Minor GCs or large objects directly allocated past threshold.
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-white/80 rounded-lg p-2 text-[11px] text-amber-900 border border-amber-200 flex items-center justify-between">
                  <span><strong>Object Promotion:</strong> Eden &rarr; S0 &harr; S1 (Copying Collector) &rarr; Old Gen</span>
                  <span className="text-[10px] text-slate-500 font-mono">Card Table / RemSet tracked</span>
                </div>
              </div>

              {/* Non-Heap & Thread Stacks (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {/* Metaspace */}
                <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                      <h4 className="font-bold text-purple-950 text-xs">Metaspace (Native OS Memory)</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded">Java 8+</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-purple-100 text-[11px] text-purple-900 space-y-1">
                    <div>&bull; <strong>Klass Metadata &amp; Method Bytecode</strong></div>
                    <div>&bull; <strong>Runtime Constant Pool &amp; Static Fields</strong></div>
                    <div className="text-[10px] text-slate-500 font-mono">-XX:MaxMetaspaceSize=512m</div>
                  </div>
                </div>

                {/* Thread Stacks */}
                <div className="bg-slate-100/90 rounded-2xl p-4 border border-slate-300 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                      <h4 className="font-bold text-slate-900 text-xs">Thread Stacks (Per Thread)</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">-Xss1m</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white rounded-lg p-2 border border-slate-200 text-slate-700">
                      <div className="font-bold text-slate-900 text-xs">Stack Frame</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Local variables, operand stack, frame data</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-slate-200 text-slate-700">
                      <div className="font-bold text-slate-900 text-xs">PC &amp; Native Stack</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Instruction counter &amp; JNI C/C++ frames</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Senior Deep Dive Accordion */}
            {expandedSection === 'jvm-memory' && (
              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" /> TLABs (Thread-Local Allocation Buffers)
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    To eliminate lock contention when hundreds of threads instantiate objects simultaneously in Eden, each thread is assigned a private TLAB. Allocation inside a TLAB is a simple bump-the-pointer pointer increment without synchronization locks.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Metaspace OOM vs Heap OOM
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    <code>java.lang.OutOfMemoryError: Metaspace</code> is triggered by aggressive classloading leakage (e.g. CGLIB proxies, unchecked dynamic Groovy scripts, unclosed classloaders in application redeployments), NOT ordinary heap object creation.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Senior Tuning Formula
                  </div>
                  <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                    -XX:+UseG1GC<br/>
                    -Xms4g -Xmx4g<br/>
                    -XX:MetaspaceSize=256m<br/>
                    -XX:MaxMetaspaceSize=512m<br/>
                    -XX:+AlwaysPreTouch
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Modern Garbage Collection: G1GC vs ZGC */}
      <section id="garbage-collectors" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Modern GC Architecture: G1 GC vs ZGC</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Region-based memory partitioning, Colored Pointers &amp; Sub-Millisecond Pause Times</p>
                </div>
              </div>
            </div>
            {/* Toggle Tabs */}
            <div className="flex bg-slate-200 p-1 rounded-xl">
              <button
                onClick={() => setActiveGcTab('g1')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeGcTab === 'g1' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                G1 GC (Default Java 9+)
              </button>
              <button
                onClick={() => setActiveGcTab('zgc')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeGcTab === 'zgc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Generational ZGC (Java 21+)
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeGcTab === 'g1' ? (
              <div>
                <p className="text-sm text-slate-600 mb-5">
                  <strong>Garbage-First (G1 GC)</strong> divides the entire heap into ~2,048 equal-sized contiguous regions (1MB to 32MB). Regions are dynamically assigned as <strong>Eden (E)</strong>, <strong>Survivor (S)</strong>, <strong>Old (O)</strong>, or <strong>Humongous (H)</strong>. It prioritizes collecting regions with the most reclaimable garbage first.
                </p>

                {/* G1 Region Grid Mockup */}
                <div className="bg-slate-900 rounded-2xl p-5 text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-emerald-400 font-bold">G1 2048-Region Dynamic Matrix</span>
                    <div className="flex gap-3 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Eden (E)</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> Survivor (S)</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-sky-500 rounded"></span> Old (O)</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-500 rounded"></span> Humongous (H)</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-700 rounded"></span> Free</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1.5">
                    {/* Simulated 32 Region Tiles */}
                    {['E','E','S','O','O','Free','E','H','H','O','Free','E','S','O','Free','E',
                      'O','O','Free','E','E','S','O','Free','H','H','O','Free','E','O','S','Free'].map((type, idx) => {
                      const colors: Record<string, string> = {
                        E: 'bg-emerald-500 text-white font-bold',
                        S: 'bg-amber-500 text-slate-900 font-bold',
                        O: 'bg-sky-500 text-white font-bold',
                        H: 'bg-rose-500 text-white font-bold',
                        Free: 'bg-slate-800 text-slate-500'
                      };
                      return (
                        <div key={idx} className={`h-8 rounded flex items-center justify-center text-[10px] font-mono ${colors[type] || 'bg-slate-800'}`}>
                          {type === 'Free' ? '' : type}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
                    <span>* Humongous regions hold single objects exceeding 50% of G1 region size.</span>
                    <span className="font-mono text-emerald-400">-XX:MaxGCPauseMillis=200</span>
                  </div>
                </div>

                {/* G1 Lifecycle Phases */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-900 mb-1">1. Initial Mark (STW)</div>
                    <p className="text-slate-600 text-[11px]">Brief pause to mark survivor objects directly reachable from GC roots.</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-900 mb-1">2. Concurrent Mark</div>
                    <p className="text-slate-600 text-[11px]">Marks live objects across the heap concurrently with application threads.</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-900 mb-1">3. Remark (STW)</div>
                    <p className="text-slate-600 text-[11px]">Completes marking and empties completely dead regions (SATB algorithm).</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-900 mb-1">4. Copy / Evacuate (STW)</div>
                    <p className="text-slate-600 text-[11px]">Evacuates live objects from high-garbage regions into empty survivor/old regions.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-600 mb-5">
                  <strong>ZGC (Z Garbage Collector)</strong> is a scalable low-latency collector targeting max pause times <strong>&lt; 1 millisecond</strong> regardless of heap size (from 16MB to 16TB). In Java 21, Generational ZGC separates young and old objects to dramatically lower CPU overhead.
                </p>

                {/* ZGC Colored Pointers Diagram */}
                <div className="bg-slate-900 rounded-2xl p-5 text-white mb-6">
                  <div className="text-xs font-mono text-cyan-400 font-bold mb-3">64-Bit Colored Pointer Architecture</div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 font-mono text-xs overflow-x-auto">
                    <div className="flex items-center gap-1 min-w-[500px]">
                      <div className="bg-slate-700 px-3 py-2 rounded text-slate-400 text-center">
                        <div className="text-[10px]">16 bits</div>
                        Unused
                      </div>
                      <div className="bg-purple-600 px-2 py-2 rounded text-white text-center font-bold">
                        <div className="text-[10px]">1 bit</div>
                        Finalizable
                      </div>
                      <div className="bg-amber-500 px-2 py-2 rounded text-slate-900 text-center font-bold">
                        <div className="text-[10px]">1 bit</div>
                        Remapped
                      </div>
                      <div className="bg-emerald-500 px-2 py-2 rounded text-slate-900 text-center font-bold">
                        <div className="text-[10px]">1 bit</div>
                        Marked1
                      </div>
                      <div className="bg-cyan-500 px-2 py-2 rounded text-slate-900 text-center font-bold">
                        <div className="text-[10px]">1 bit</div>
                        Marked0
                      </div>
                      <div className="flex-1 bg-blue-600 px-4 py-2 rounded text-white text-center font-bold">
                        <div className="text-[10px]">44 bits</div>
                        Object Virtual Address (Up to 16 TB Heap)
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-300 leading-relaxed">
                    <strong>Load Barrier Magic:</strong> When an application thread reads an object reference via CPU instructions, the JIT-injected load barrier inspects the color bits. If the object is currently being relocated by ZGC, the load barrier self-heals the pointer on the fly without stopping other threads!
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-cyan-50 border border-cyan-200 p-3 rounded-xl">
                    <div className="font-bold text-cyan-950 mb-1">Ultra-Low Latency</div>
                    <p className="text-cyan-800 text-[11px]">Pauses never exceed 1ms even with 100GB+ heaps. Ideal for financial trading and low-latency APIs.</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <div className="font-bold text-emerald-950 mb-1">Generational in Java 21</div>
                    <p className="text-emerald-800 text-[11px]">Collects young objects frequently, reducing CPU overhead by up to 40% vs legacy Single-Gen ZGC.</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-900 mb-1">JVM Flag Configuration</div>
                    <p className="text-slate-600 font-mono text-[10px] mt-1">-XX:+UseZGC<br/>-XX:+ZGenerational</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Java 21 Virtual Threads (Project Loom) vs Platform Threads */}
      <section id="virtual-threads" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Java 21+ Virtual Threads vs OS Platform Threads</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Carrier ForkJoinPool, Continuation Unmounting on Blocking I/O &amp; Thread Pinning Pitfalls</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSection('virtual-threads')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 self-start md:self-auto bg-sky-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {expandedSection === 'virtual-threads' ? <>Hide Deep Dive <ChevronUp className="w-3.5 h-3.5" /></> : <>Senior Deep Dive <ChevronDown className="w-3.5 h-3.5" /></>}
            </button>
          </div>

          <div className="p-6">
            {/* Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-6">
              
              {/* Legacy 1:1 Platform Model */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-sm">Traditional Platform Threads (1:1 Model)</h3>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">1 Thread = 1 OS Kernel Thread</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    Heavyweight (~1MB stack pre-allocated in native memory). Maximum ~2,000 to 5,000 threads per JVM before hitting OS thread limits or crashing with <code>OutOfMemoryError: unable to create new native thread</code>.
                  </p>

                  <div className="space-y-2">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-300 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-700">Thread-1 (HTTP Request)</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">BLOCKED on SQL Query</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-300 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-700">Thread-2 (HTTP Request)</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">BLOCKED on Socket I/O</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                  ⚠️ When blocked on I/O, the underlying OS kernel thread is locked idle, wasting CPU &amp; RAM.
                </div>
              </div>

              {/* Virtual Thread M:N Model */}
              <div className="bg-sky-50/60 border-2 border-sky-300 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sky-950 text-sm">Virtual Threads (M:N User-Space Model)</h3>
                    <span className="text-[10px] font-bold bg-sky-200 text-sky-900 px-2 py-0.5 rounded">1 Million+ Virtual Threads</span>
                  </div>
                  <p className="text-xs text-sky-900 mb-4 leading-relaxed">
                    Ultra-lightweight (~few hundred bytes initial footprint). Managed entirely by the JVM in user space, mounted on a tiny pool of <strong>Carrier Threads</strong> (sized to CPU cores).
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-sky-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-sky-900 font-semibold">
                      <span>Carrier Thread #1 (OS Thread)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">100% CPU Active</span>
                    </div>
                    <div className="bg-sky-50 p-2 rounded-lg border border-sky-100 text-[11px] text-sky-800">
                      <strong>Continuation Yield:</strong> When VirtualThread-42 hits blocking socket read, JVM unmounts its call stack to heap memory. Carrier Thread immediately picks up VirtualThread-43!
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sky-200 text-[11px] text-sky-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> High-throughput synchronous coding style without reactive complexity.
                </div>
              </div>

            </div>

            {/* Senior Deep Dive: Code & Pinning Pitfalls */}
            {expandedSection === 'virtual-threads' && (
              <div className="pt-6 border-t border-slate-200 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Code Example */}
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px]">
                    <div className="text-slate-400 mb-2 flex items-center justify-between">
                      <span>Spring Boot 3.2+ Virtual Threads</span>
                      <span className="text-emerald-400 font-bold">application.yaml</span>
                    </div>
                    <pre className="text-emerald-300">
{`spring:
  threads:
    virtual:
      enabled: true # Enables Virtual Threads for Tomcat & @Async

# Or programmatic executor:
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> fetchHttpOrder(i));
    });
}`}
                    </pre>
                  </div>

                  {/* Senior Thread Pinning Pitfall */}
                  <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-950">
                    <div className="font-bold text-sm flex items-center gap-1.5 text-amber-900 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Senior Interview Trap: Thread Pinning!
                    </div>
                    <p className="leading-relaxed mb-2 text-xs">
                      A virtual thread becomes <strong>pinned</strong> to its carrier thread and CANNOT unmount during blocking I/O if:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-900">
                      <li>Executing inside a <code>synchronized (lock) &#123; ... &#125;</code> block or method.</li>
                      <li>Calling a JNI native method or foreign function.</li>
                    </ul>
                    <div className="mt-3 bg-white p-2 rounded border border-amber-200 font-mono text-[10px] text-slate-700">
                      <strong>Fix:</strong> Replace <code>synchronized</code> with <code>ReentrantLock</code>. Detect pinning using: <code>-Djdk.tracePinnedThreads=full</code>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Java Memory Model (JMM), Cache Coherence & Lock Escalation */}
      <section id="jmm-locks" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Java Memory Model (JMM) &amp; Synchronized Lock Escalation</h2>
                <p className="text-xs text-slate-500 mt-0.5">CPU Caching (L1/L2/L3), Volatile Barriers (MESI) &amp; HotSpot Mark Word Evolution</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            
            {/* Part A: Lock Escalation Pipeline */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                HotSpot <code>synchronized</code> Lock Escalation Pipeline (Object Mark Word)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* State 1 */}
                <div className="bg-slate-50 border border-slate-300 p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800">1. Unlocked</span>
                      <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded">001</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Standard object in heap. Mark Word stores HashCode, GC age (4 bits), and state flags.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] text-slate-500 border-t pt-2">No thread has acquired lock</div>
                </div>

                {/* State 2 */}
                <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-950">2. Biased Lock</span>
                      <span className="text-[10px] font-mono bg-amber-200 px-1.5 py-0.5 rounded">101</span>
                    </div>
                    <p className="text-[11px] text-amber-900">
                      Assumes single thread accesses lock. Records acquiring Thread ID in Mark Word. Zero CAS overhead on re-entry.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] text-amber-700 border-t border-amber-200 pt-2 font-mono">Deprecated in JDK 15+</div>
                </div>

                {/* State 3 */}
                <div className="bg-sky-50 border border-sky-300 p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sky-950">3. Lightweight (Thin)</span>
                      <span className="text-[10px] font-mono bg-sky-200 px-1.5 py-0.5 rounded">000</span>
                    </div>
                    <p className="text-[11px] text-sky-900">
                      Lock contention occurs without long stalls. Thread creates Displaced Mark Word on stack and executes CAS spinlock.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] text-sky-700 border-t border-sky-200 pt-2">Adaptive Spinning (CAS)</div>
                </div>

                {/* State 4 */}
                <div className="bg-rose-50 border border-rose-300 p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-rose-950">4. Heavyweight (Fat)</span>
                      <span className="text-[10px] font-mono bg-rose-200 px-1.5 py-0.5 rounded">010</span>
                    </div>
                    <p className="text-[11px] text-rose-900">
                      High contention or long lock-hold time. Mark Word points to OS-level <code>ObjectMonitor</code>. Blocked threads go into OS kernel wait queue.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] text-rose-700 border-t border-rose-200 pt-2 font-bold">Causes OS Context Switch</div>
                </div>
              </div>
            </div>

            {/* Part B: Volatile & Memory Barriers */}
            <div className="bg-slate-900 text-white rounded-2xl p-5">
              <h4 className="text-xs font-mono text-amber-400 font-bold mb-3">Volatile Happens-Before &amp; Hardware Memory Barriers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 text-slate-300">
                  <p className="leading-relaxed">
                    <code>volatile</code> guarantees <strong>Visibility</strong> (flushing CPU store buffer to main RAM via MESI cache-coherency bus snooping) and <strong>Instruction Ordering</strong> (preventing compiler / CPU out-of-order execution).
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ⚠️ <code>volatile</code> does NOT guarantee compound atomicity (e.g. <code>count++</code> requires <code>AtomicInteger</code> or locks).
                  </p>
                </div>

                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 font-mono text-[11px] text-slate-300 space-y-1.5">
                  <div className="text-emerald-400 font-bold">// Volatile Write:</div>
                  <div>StoreStore Barrier &rarr; <span className="text-amber-300">volatile write</span> &rarr; StoreLoad Barrier</div>
                  <div className="text-cyan-400 font-bold pt-2">// Volatile Read:</div>
                  <div><span className="text-amber-300">volatile read</span> &rarr; LoadLoad Barrier + LoadStore Barrier</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
