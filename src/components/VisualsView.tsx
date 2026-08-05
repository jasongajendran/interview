import { motion } from 'motion/react';
import { Layers, Activity, Server, Cpu, ShieldCheck, Database, Cloud, Zap, Boxes } from 'lucide-react';

export function VisualsView() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full mb-3 flex items-center gap-2 w-max">
          <Layers className="w-3 h-3" /> Architecture & Internals
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Java Visual Concepts</h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Pictorial representation of complex Java architecture, JVM internals, and concurrency models.
        </p>
      </div>

      <div className="space-y-12">
        {/* JVM Memory Model */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-600" /> JVM Memory Model (Java 8+)
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Heap Area */}
              <div className="flex-1 bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h3 className="font-bold text-amber-900 mb-3 text-center">Heap Memory (Shared)</h3>
                
                <div className="space-y-3">
                  <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                    <h4 className="text-sm font-bold text-green-800 text-center mb-2">Young Generation</h4>
                    <div className="flex gap-2 text-xs">
                      <div className="flex-1 bg-white p-2 rounded text-center shadow-sm border border-green-200 text-green-700 font-medium">Eden Space<br/><span className="text-[10px] text-slate-500">New Objects</span></div>
                      <div className="flex-1 bg-white p-2 rounded text-center shadow-sm border border-green-200 text-green-700 font-medium">Survivor 0 (S0)</div>
                      <div className="flex-1 bg-white p-2 rounded text-center shadow-sm border border-green-200 text-green-700 font-medium">Survivor 1 (S1)</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-bold text-blue-800 mb-1">Old Generation (Tenured)</h4>
                    <p className="text-xs text-blue-600">Long-lived objects promoted from Survivor spaces.</p>
                  </div>
                </div>
              </div>

              {/* Non-Heap Areas */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 h-full">
                  <h3 className="font-bold text-purple-900 mb-2 text-center">Metaspace (Native Memory)</h3>
                  <div className="bg-white rounded-lg p-3 text-xs text-purple-700 text-center border border-purple-100 shadow-sm">
                    Class Definitions, Static Variables, Method Code, Constant Pool
                    <div className="mt-2 text-[10px] text-purple-500 italic">Replaced PermGen in Java 8. Grows dynamically in native OS memory.</div>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-xl p-4 border border-slate-300 h-full">
                  <h3 className="font-bold text-slate-700 mb-2 text-center">Thread Area (Per Thread)</h3>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white rounded-lg p-2 text-xs text-slate-600 text-center border border-slate-200 shadow-sm">
                      <div className="font-bold mb-1">Thread Stack</div>
                      Local variables, method frames
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-2 text-xs text-slate-600 text-center border border-slate-200 shadow-sm">
                      <div className="font-bold mb-1">PC Register</div>
                      Current instruction address
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Thread Lifecycle */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" /> Thread Lifecycle states
          </h2>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <div className="min-w-[700px] relative h-[250px] flex items-center justify-between">
              
              {/* Lines / Arrows */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                  </marker>
                </defs>
                <line x1="80" y1="125" x2="180" y2="125" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="280" y1="125" x2="480" y2="125" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
                
                {/* Runnable to Waiting */}
                <path d="M 230 160 Q 230 220 330 220" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
                {/* Waiting to Runnable */}
                <path d="M 430 220 Q 530 220 530 160" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
                
                {/* Runnable to Blocked */}
                <path d="M 230 90 Q 230 30 330 30" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
                {/* Blocked to Runnable */}
                <path d="M 430 30 Q 530 30 530 90" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
              </svg>

              <div className="z-10 w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-slate-300 font-bold text-slate-600 shadow-md">NEW</div>
              <div className="z-10 w-24 h-24 bg-emerald-100 rounded-full flex flex-col items-center justify-center border-4 border-emerald-400 font-bold text-emerald-700 shadow-md text-sm text-center">
                RUNNABLE
                <span className="text-[9px] font-normal mt-1">(Ready / Running)</span>
              </div>
              <div className="z-10 flex flex-col justify-between h-full py-4">
                <div className="w-24 h-24 bg-red-100 rounded-full flex flex-col items-center justify-center border-4 border-red-400 font-bold text-red-700 shadow-md text-sm text-center">
                  BLOCKED
                  <span className="text-[9px] font-normal mt-1">Waiting for lock</span>
                </div>
                <div className="w-24 h-24 bg-amber-100 rounded-full flex flex-col items-center justify-center border-4 border-amber-400 font-bold text-amber-700 shadow-md text-sm text-center">
                  WAITING /<br/>TIMED_WAITING
                </div>
              </div>
              <div className="z-10 w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-900 font-bold text-slate-100 shadow-md text-sm">TERMINATED</div>

            </div>
          </div>
        </section>

        {/* HashMap Internals */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" /> HashMap Internal Structure (Java 8+)
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-4">
              In Java 8, when hash collisions occur in a specific bucket, the linked list is transformed into a Balanced Tree (Red-Black Tree) after a certain threshold (TREEIFY_THRESHOLD = 8) to improve worst-case search performance from O(N) to O(log N).
            </p>
            
            <div className="flex items-start gap-4 overflow-x-auto pb-4">
              {/* Array / Buckets */}
              <div className="flex flex-col gap-1 w-24 shrink-0">
                <div className="bg-slate-800 text-white text-center py-1 text-xs font-bold rounded-t">Buckets</div>
                {[0, 1, 2, 3, 4, 5].map(idx => (
                  <div key={idx} className="h-12 bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-mono text-slate-400 relative">
                    [{idx}]
                    {idx === 1 && <div className="absolute right-0 w-4 border-b-2 border-blue-400 translate-x-full"></div>}
                    {idx === 4 && <div className="absolute right-0 w-4 border-b-2 border-purple-400 translate-x-full"></div>}
                  </div>
                ))}
              </div>

              {/* Linked List Example */}
              <div className="mt-8 flex items-center">
                <div className="bg-blue-50 border border-blue-200 p-2 rounded shadow-sm w-24 text-center">
                  <div className="text-xs font-bold text-blue-800">Node</div>
                  <div className="text-[10px] text-blue-600">Key: "A"<br/>Val: 1</div>
                </div>
                <div className="w-8 border-b-2 border-dashed border-blue-300 relative"><div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-blue-300 rotate-45"></div></div>
                <div className="bg-blue-50 border border-blue-200 p-2 rounded shadow-sm w-24 text-center">
                  <div className="text-xs font-bold text-blue-800">Node</div>
                  <div className="text-[10px] text-blue-600">Key: "B"<br/>Val: 2</div>
                </div>
                <div className="ml-4 text-xs text-slate-400 italic">Standard Linked List</div>
              </div>

              {/* Red-Black Tree Example */}
              <div className="mt-[168px] -ml-[312px] flex flex-col items-center">
                <div className="bg-purple-50 border border-purple-300 p-2 rounded-full shadow-sm w-16 h-16 flex flex-col items-center justify-center z-10">
                  <div className="text-[10px] font-bold text-purple-800">Root</div>
                </div>
                <div className="flex gap-8 -mt-2">
                  <div className="w-8 border-t-2 border-l-2 border-purple-300 h-6 rounded-tl-lg mt-2"></div>
                  <div className="w-8 border-t-2 border-r-2 border-purple-300 h-6 rounded-tr-lg mt-2"></div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-red-50 border border-red-300 p-1 rounded-full shadow-sm w-12 h-12 flex flex-col items-center justify-center">
                    <div className="text-[9px] font-bold text-red-800">Node</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-300 p-1 rounded-full shadow-sm w-12 h-12 flex flex-col items-center justify-center">
                    <div className="text-[9px] font-bold text-purple-800">Node</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-purple-600 font-bold bg-purple-100 px-2 py-1 rounded">Red-Black Tree (O(log N))</div>
              </div>

            </div>
          </div>
        </section>

        {/* Java 21 Virtual Threads */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-6 h-6 text-teal-600" /> Virtual Threads (Java 21 / Project Loom)
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              Virtual threads are lightweight threads managed by the JVM rather than the OS. When a virtual thread encounters a blocking I/O operation, it is unmounted from the Carrier Thread (OS thread), allowing the OS thread to execute other virtual threads.
            </p>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              {/* Virtual Threads pool */}
              <div className="flex flex-col gap-2">
                <div className="text-center font-bold text-slate-700 text-sm mb-2">Millions of Virtual Threads<br/><span className="font-normal text-xs text-slate-500">(JVM Heap space, tiny footprint)</span></div>
                <div className="grid grid-cols-4 gap-2 p-4 bg-teal-50 border border-teal-200 rounded-xl w-64">
                  {[...Array(12)].map((_, i) => (
                     <div key={i} className={`h-8 rounded flex items-center justify-center text-[10px] font-bold shadow-sm relative ${i === 2 || i === 5 ? 'bg-orange-100 text-orange-700 border border-orange-300' : i === 0 || i === 7 ? 'bg-teal-500 text-white' : 'bg-white text-teal-600 border border-teal-200'}`}>
                      VT-{i+1}
                      {i === 2 && <span className="absolute -top-6 bg-slate-800 text-white px-1 py-0.5 rounded text-[8px] whitespace-nowrap">Blocked (I/O)</span>}
                    </div>
                  ))}
                  <div className="col-span-4 text-center text-teal-600 font-bold tracking-widest leading-none">...</div>
                </div>
              </div>

              {/* M:N Mapping */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full mb-2">M:N Mapping</div>
                <div className="flex gap-2">
                  <div className="w-8 border-b-2 border-dashed border-slate-300 transform -rotate-45 translate-y-4"></div>
                  <div className="w-8 border-b-2 border-dashed border-slate-300"></div>
                  <div className="w-8 border-b-2 border-dashed border-slate-300 transform rotate-45 translate-y-4"></div>
                </div>
              </div>

              {/* OS Threads (Carrier) */}
              <div className="flex flex-col gap-2">
                <div className="text-center font-bold text-slate-700 text-sm mb-2">Carrier Threads (OS Threads)<br/><span className="font-normal text-xs text-slate-500">(Limited CPU Cores, e.g., ForkJoinPool)</span></div>
                <div className="flex gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl w-64 justify-center">
                  <div className="w-20 h-24 bg-white border-2 border-slate-300 rounded-lg shadow-sm flex flex-col">
                    <div className="bg-slate-200 text-center text-xs font-bold py-1">OS-1</div>
                    <div className="flex-1 flex items-center justify-center p-2">
                      <div className="w-full h-8 bg-teal-500 text-white rounded flex items-center justify-center text-xs font-bold shadow-sm animate-pulse">
                        VT-1 (Running)
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-20 h-24 bg-white border-2 border-slate-300 rounded-lg shadow-sm flex flex-col">
                    <div className="bg-slate-200 text-center text-xs font-bold py-1">OS-2</div>
                    <div className="flex-1 flex items-center justify-center p-2">
                      <div className="w-full h-8 bg-teal-500 text-white rounded flex items-center justify-center text-xs font-bold shadow-sm">
                        VT-8 (Running)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* G1 Garbage Collector (G1GC) */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Server className="w-6 h-6 text-pink-600" /> G1 Garbage Collector (G1GC) Regional Memory
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              Unlike older parallel collectors that split the heap into contiguous Eden, Survivor, and Old spaces, G1GC divides the heap into thousands of equal-sized regions (1MB-32MB). This allows G1GC to avoid full heap compactions and target regions with the most garbage first.
            </p>
            
            <div className="grid grid-cols-8 gap-1 p-4 bg-slate-100 rounded-xl border border-slate-200 max-w-2xl mx-auto">
              {[...Array(32)].map((_, i) => {
                let type = 'free'; // default
                let bgClass = 'bg-white border-slate-200';
                let label = '';
                
                // Randomly assign regions for visualization
                if ([2, 7, 12, 17, 22].includes(i)) { type = 'eden'; bgClass = 'bg-green-100 border-green-300 text-green-700'; label = 'E'; }
                else if ([5, 15, 27].includes(i)) { type = 'survivor'; bgClass = 'bg-lime-100 border-lime-300 text-lime-800'; label = 'S'; }
                else if ([1, 4, 8, 14, 19, 21, 26, 30].includes(i)) { type = 'old'; bgClass = 'bg-blue-100 border-blue-300 text-blue-700'; label = 'O'; }
                else if ([10, 11].includes(i)) { type = 'humongous'; bgClass = 'bg-purple-100 border-purple-400 text-purple-800'; label = 'H'; }
                
                return (
                  <div key={i} className={`aspect-square rounded border flex items-center justify-center font-bold text-sm shadow-sm ${bgClass}`}>
                    {label}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-6">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div><span className="text-xs text-slate-600 font-bold">Eden (E)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-lime-100 border border-lime-300"></div><span className="text-xs text-slate-600 font-bold">Survivor (S)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div><span className="text-xs text-slate-600 font-bold">Old (O)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-purple-100 border border-purple-400"></div><span className="text-xs text-slate-600 font-bold">Humongous (H)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white border border-slate-200"></div><span className="text-xs text-slate-600 font-bold">Free</span></div>
            </div>
            <div className="text-center text-xs text-slate-500 mt-4 italic">
              Humongous regions (H) are contiguous regions used for objects larger than 50% of a single region size.
            </div>
          </div>
        </section>

        {/* ZGC (Z Garbage Collector) */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Server className="w-6 h-6 text-fuchsia-600" /> Z Garbage Collector (ZGC) - Low Latency
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              ZGC is a scalable, low-latency garbage collector designed to have pause times less than 1ms (even on terabyte-sized heaps). It achieves this by doing all expensive work concurrently using colored pointers and load barriers.
            </p>
            
            <div className="flex flex-col md:flex-row items-center gap-12 justify-center">
              {/* Colored Pointers */}
              <div className="flex flex-col gap-3 max-w-sm">
                <div className="text-center font-bold text-slate-700">Colored Pointers (64-bit)</div>
                <div className="flex border border-slate-300 rounded overflow-hidden shadow-sm">
                  <div className="w-12 bg-slate-100 border-r border-slate-300 flex items-center justify-center text-[10px] py-2">0-41</div>
                  <div className="flex-1 bg-white text-center text-xs py-2 font-mono">Object Address (42 bits)</div>
                  <div className="w-8 bg-fuchsia-100 border-l border-slate-300 flex flex-col items-center justify-center text-[8px] leading-tight font-bold text-fuchsia-800">
                    <div>M0</div>
                    <div>M1</div>
                    <div>R</div>
                    <div>F</div>
                  </div>
                  <div className="w-12 bg-slate-100 border-l border-slate-300 flex items-center justify-center text-[10px]">46-63</div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="text-fuchsia-700">Marked0 / Marked1:</strong> Tracks live objects across GC cycles.</li>
                    <li><strong className="text-fuchsia-700">Remapped:</strong> Indicates the object has been moved.</li>
                    <li><strong className="text-fuchsia-700">Finalizable:</strong> Only reachable via finalizer.</li>
                  </ul>
                </div>
              </div>

              {/* Load Barrier */}
              <div className="flex flex-col gap-3">
                <div className="text-center font-bold text-slate-700">Concurrent Relocation (Load Barrier)</div>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl relative">
                  <div className="flex justify-between items-center w-64 mb-8 relative z-10">
                    <div className="bg-white border-2 border-red-300 p-2 text-xs font-bold rounded shadow-sm">App Thread<br/>(Reads Object)</div>
                    <div className="bg-white border-2 border-fuchsia-300 p-2 text-xs font-bold rounded shadow-sm">ZGC Thread<br/>(Moving Object)</div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="w-full border-t-2 border-dashed border-slate-300"></div>
                  </div>

                  <div className="flex justify-between items-center relative z-10">
                    <div className="bg-slate-200 p-2 rounded text-[10px] text-center opacity-50">Old Address<br/>(0x123)</div>
                    
                    <div className="bg-fuchsia-100 border border-fuchsia-300 px-3 py-1 rounded-full text-[10px] font-bold text-fuchsia-800 absolute left-1/2 -translate-x-1/2 -translate-y-8 shadow-sm">
                      Load Barrier intercepts read!
                    </div>

                    <div className="bg-green-100 border border-green-300 p-2 rounded text-[10px] text-center shadow-sm">New Address<br/>(0x456)</div>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 mt-4 leading-relaxed text-center">
                    When the app thread tries to read an object that ZGC is concurrently moving, the <strong>Load Barrier</strong> kicks in. It notices the "Remapped" bit is wrong, heals the pointer to the new address, and returns the correct object. No stop-the-world needed!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Java 21 Scoped Values vs ThreadLocal */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" /> Scoped Values vs ThreadLocal (Java 21+)
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              With Virtual Threads, using <code>ThreadLocal</code> becomes problematic because millions of virtual threads mean millions of ThreadLocal maps, causing massive memory overhead and mutation risks. <strong>Scoped Values</strong> (JEP 446) are designed as a modern, immutable, and highly efficient replacement.
            </p>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* ThreadLocal (The Old Way) */}
              <div className="flex-1 bg-red-50 p-4 border border-red-200 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-200 text-red-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">Legacy</div>
                <h3 className="font-bold text-red-900 mb-4 text-center">ThreadLocal</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white p-2 rounded shadow-sm border border-red-100">
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-white text-xs font-bold">T1</div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-600 mb-1">ThreadLocalMap</div>
                      <div className="flex gap-2">
                        <div className="bg-red-100 text-red-800 text-[10px] px-2 py-1 rounded border border-red-200 flex-1">USER_ID: "A"</div>
                        <div className="bg-red-100 text-red-800 text-[10px] px-2 py-1 rounded border border-red-200 flex-1">TX_ID: "123"</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white p-2 rounded shadow-sm border border-red-100 opacity-80">
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-white text-xs font-bold">T2</div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-600 mb-1">ThreadLocalMap (Deep Copy for Child)</div>
                      <div className="flex gap-2">
                        <div className="bg-red-100 text-red-800 text-[10px] px-2 py-1 rounded border border-red-200 flex-1">USER_ID: "A"</div>
                        <div className="bg-red-100 text-red-800 text-[10px] px-2 py-1 rounded border border-red-200 flex-1">TX_ID: "123"</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ul className="text-[10px] text-red-700 mt-4 space-y-1 list-disc pl-4">
                  <li><strong>Mutable:</strong> Any code can call <code>.set()</code> and change the value.</li>
                  <li><strong>Memory Leak Risk:</strong> Must call <code>.remove()</code> explicitly.</li>
                  <li><strong>Inheritance Overhead:</strong> Spawning a child thread copies the entire map.</li>
                </ul>
              </div>

              {/* Scoped Values (The New Way) */}
              <div className="flex-1 bg-indigo-50 p-4 border border-indigo-200 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-200 text-indigo-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">Java 21+</div>
                <h3 className="font-bold text-indigo-900 mb-4 text-center">Scoped Values</h3>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-full shadow-md font-mono font-bold z-10 relative">
                    ScopedValue.where(USER_ID, "A")
                  </div>
                  
                  <div className="w-0.5 h-6 bg-indigo-300"></div>
                  
                  <div className="w-full bg-white border border-indigo-200 rounded-lg p-3 shadow-sm relative z-0 text-center">
                    <div className="text-xs font-bold text-indigo-800 mb-2">Lexical Scope (run/call)</div>
                    <div className="flex justify-center gap-4">
                      <div className="bg-indigo-100 text-indigo-800 text-[10px] px-3 py-1 rounded border border-indigo-200">
                        Task 1 (reads USER_ID)
                      </div>
                      <div className="bg-indigo-100 text-indigo-800 text-[10px] px-3 py-1 rounded border border-indigo-200">
                        Task 2 (reads USER_ID)
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-0.5 h-6 bg-indigo-300"></div>
                  
                  <div className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">
                    Scope Ends (Value automatically discarded)
                  </div>
                </div>
                
                <ul className="text-[10px] text-indigo-800 mt-4 space-y-1 list-disc pl-4">
                  <li><strong>Immutable:</strong> Values cannot be changed once bound.</li>
                  <li><strong>No Leaks:</strong> Bound only for the duration of the <code>run()</code> block.</li>
                  <li><strong>O(1) Sharing:</strong> Millions of virtual threads can safely read the same bound value without copying.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>


        {/* Spring Security Architecture */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" /> Spring Security Architecture
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              Spring Security intercepts incoming requests using a chain of Servlet Filters (<code>FilterChainProxy</code>). The authentication process is delegated to the <code>AuthenticationManager</code>, which uses one or more <code>AuthenticationProvider</code>s.
            </p>
            
            <div className="flex flex-col items-center max-w-3xl mx-auto">
              <div className="flex items-center gap-4 w-full">
                <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl flex-1 text-center font-bold text-slate-700 shadow-sm">
                  Client Request
                </div>
                <div className="h-0.5 w-8 bg-slate-300 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-y-4 border-y-transparent border-l-4 border-l-slate-400"></div>
                </div>
                
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex-[2] relative">
                  <div className="text-xs font-bold text-emerald-800 absolute -top-3 left-4 bg-emerald-100 px-2 py-0.5 rounded shadow-sm">DelegatingFilterProxy</div>
                  <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-lg text-center font-bold text-emerald-800 shadow-sm mb-2">
                    FilterChainProxy
                  </div>
                  <div className="flex justify-center gap-2">
                    <div className="bg-white border border-emerald-200 text-[10px] px-2 py-1 rounded">SecurityContextPersistence</div>
                    <div className="bg-white border border-emerald-200 text-[10px] px-2 py-1 rounded">UsernamePasswordAuth</div>
                    <div className="bg-white border border-emerald-200 text-[10px] px-2 py-1 rounded">FilterSecurityInterceptor</div>
                  </div>
                </div>
              </div>
              
              <div className="w-0.5 h-8 bg-slate-300 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-400"></div>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 w-full relative">
                 <div className="text-xs font-bold text-blue-800 absolute -top-3 left-4 bg-blue-100 px-2 py-0.5 rounded shadow-sm">AuthenticationManager</div>
                 <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="bg-blue-100 border border-blue-300 p-3 rounded-lg flex-1 text-center shadow-sm">
                      <div className="font-bold text-blue-900 text-sm">ProviderManager</div>
                      <div className="text-[10px] text-blue-700 mt-1">Iterates through providers</div>
                    </div>
                    <div className="h-8 w-0.5 md:h-0.5 md:w-8 bg-slate-300 relative">
                      <div className="absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-1/2 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 md:border-y-4 md:border-y-transparent md:border-l-4 md:border-l-slate-400 border-x-4 border-x-transparent border-t-4 border-t-slate-400 md:border-t-0 md:border-x-0"></div>
                    </div>
                    <div className="bg-blue-100 border border-blue-300 p-3 rounded-lg flex-1 text-center shadow-sm">
                      <div className="font-bold text-blue-900 text-sm">AuthenticationProvider</div>
                      <div className="text-[10px] text-blue-700 mt-1">DaoAuthenticationProvider</div>
                    </div>
                 </div>
                 
                 <div className="flex justify-end mt-4 pr-16">
                    <div className="h-8 w-0.5 bg-slate-300 relative">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-400"></div>
                    </div>
                 </div>
                 
                 <div className="flex justify-end">
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg w-48 text-center shadow-sm">
                      <div className="font-bold text-orange-900 text-sm">UserDetailsService</div>
                      <div className="text-[10px] text-orange-700 mt-1">Loads user by username</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hibernate Object States */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-600" /> Hibernate Object States
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              Understanding the lifecycle states of a JPA Entity (Transient, Persistent, Detached, Removed) is crucial to avoiding bugs and `LazyInitializationException`s.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-col items-center justify-center relative min-h-[300px]">
                 
                 <div className="bg-white border-2 border-slate-300 rounded-full w-24 h-24 flex items-center justify-center font-bold text-slate-600 absolute top-4 left-1/2 -translate-x-1/2 shadow-sm z-10">
                   Transient
                 </div>
                 
                 <div className="bg-green-100 border-2 border-green-400 rounded-full w-28 h-28 flex flex-col items-center justify-center font-bold text-green-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md z-10">
                   <span>Persistent</span>
                   <span className="text-[9px] font-normal text-green-700">(Managed)</span>
                 </div>
                 
                 <div className="bg-orange-100 border-2 border-orange-300 rounded-full w-24 h-24 flex items-center justify-center font-bold text-orange-800 absolute bottom-4 left-4 shadow-sm z-10">
                   Detached
                 </div>
                 
                 <div className="bg-red-100 border-2 border-red-300 rounded-full w-24 h-24 flex items-center justify-center font-bold text-red-800 absolute bottom-4 right-4 shadow-sm z-10">
                   Removed
                 </div>
                 
                 {/* Arrows simulated with absolute positioned lines/text */}
                 <div className="absolute top-[80px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="bg-white px-1 text-[10px] text-slate-500 font-mono z-20">persist()</span>
                    <div className="h-8 w-px bg-slate-400"></div>
                 </div>
                 
                 <div className="absolute bottom-[90px] left-[110px] flex flex-col items-center rotate-45 origin-bottom-left">
                    <span className="bg-white px-1 text-[10px] text-slate-500 font-mono z-20">close() / clear()</span>
                    <div className="h-10 w-px bg-slate-400"></div>
                 </div>
                 
                 <div className="absolute bottom-[90px] left-[130px] flex flex-col items-center rotate-45 origin-bottom-left">
                    <div className="h-10 w-px bg-slate-400 border-dashed"></div>
                    <span className="bg-white px-1 text-[10px] text-slate-500 font-mono z-20">merge()</span>
                 </div>
                 
                 <div className="absolute bottom-[90px] right-[110px] flex flex-col items-center -rotate-45 origin-bottom-right">
                    <span className="bg-white px-1 text-[10px] text-slate-500 font-mono z-20">remove()</span>
                    <div className="h-10 w-px bg-slate-400"></div>
                 </div>
              </div>
              
              <div className="space-y-3 flex flex-col justify-center">
                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-300"></div> Transient</h4>
                  <p className="text-[11px] text-slate-600 mt-1">Newly instantiated using <code>new</code>. Not associated with an EntityManager and has no DB representation.</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg shadow-sm">
                  <h4 className="font-bold text-green-900 text-sm flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div> Persistent (Managed)</h4>
                  <p className="text-[11px] text-green-800 mt-1">Associated with a persistence context. Changes are tracked by Hibernate (Dirty Checking) and saved on flush.</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg shadow-sm">
                  <h4 className="font-bold text-orange-900 text-sm flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-300"></div> Detached</h4>
                  <p className="text-[11px] text-orange-800 mt-1">Was persistent, but the EntityManager was closed or cleared. Changes are no longer tracked. Needs <code>merge()</code> to be reattached.</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg shadow-sm">
                  <h4 className="font-bold text-red-900 text-sm flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-300"></div> Removed</h4>
                  <p className="text-[11px] text-red-800 mt-1">Scheduled for deletion from the database upon the next flush/commit.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        {/* RabbitMQ Architecture */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-fuchsia-600" /> RabbitMQ Architecture (AMQP)
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              RabbitMQ is a smart message broker. Producers publish to an <strong>Exchange</strong>, which routes messages to <strong>Queues</strong> based on bindings and routing keys. Messages are deleted from the queue once consumed (ACK'd).
            </p>
            
            <div className="flex flex-col items-center max-w-4xl mx-auto">
              {/* Producer */}
              <div className="bg-slate-100 border-2 border-slate-300 p-3 rounded-xl shadow-sm z-10 w-48 text-center">
                 <div className="font-bold text-slate-700">Producer</div>
                 <div className="text-[10px] text-slate-500 mt-1">Routing Key: "order.eu"</div>
              </div>
              
              <div className="h-8 w-1 bg-slate-300 relative">
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-400"></div>
              </div>
              
              {/* Exchange */}
              <div className="bg-fuchsia-50 border-2 border-fuchsia-300 rounded-full w-48 h-24 flex flex-col items-center justify-center shadow-md z-10 relative">
                 <div className="font-bold text-fuchsia-800">Topic Exchange</div>
                 <div className="text-[10px] text-fuchsia-600">"orders.exchange"</div>
              </div>
              
              {/* Bindings */}
              <div className="flex w-full max-w-lg justify-between relative mt-8 mb-4">
                 
                 {/* Left Binding */}
                 <div className="flex flex-col items-center flex-1 relative">
                    <svg className="absolute bottom-full left-1/2 w-full h-16 pointer-events-none" style={{ transform: 'translateX(-50%)' }} preserveAspectRatio="none">
                      <path d="M 50% 0 C 50% 50%, 10% 50%, 10% 100%" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4"/>
                      <polygon points="10%,100% 8%,90% 12%,90%" fill="#94a3b8" />
                    </svg>
                    <div className="bg-white border border-fuchsia-200 text-fuchsia-700 text-[10px] px-2 py-1 rounded-full absolute -top-8 left-[10%] -translate-x-1/2 shadow-sm font-mono font-bold">
                       Binding: "order.eu"
                    </div>
                 </div>
                 
                 {/* Right Binding */}
                 <div className="flex flex-col items-center flex-1 relative">
                    <svg className="absolute bottom-full right-1/2 w-full h-16 pointer-events-none" style={{ transform: 'translateX(50%)' }} preserveAspectRatio="none">
                      <path d="M 50% 0 C 50% 50%, 90% 50%, 90% 100%" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4"/>
                      <polygon points="90%,100% 88%,90% 92%,90%" fill="#94a3b8" />
                    </svg>
                    <div className="bg-white border border-fuchsia-200 text-fuchsia-700 text-[10px] px-2 py-1 rounded-full absolute -top-8 right-[10%] translate-x-1/2 shadow-sm font-mono font-bold">
                       Binding: "order.us"
                    </div>
                 </div>
                 
              </div>
              
              {/* Queues & Consumers */}
              <div className="flex w-full max-w-lg justify-between">
                 <div className="flex flex-col items-center gap-4">
                    <div className="bg-white border-2 border-orange-300 p-2 rounded w-32 flex flex-col items-center shadow-sm relative">
                       <div className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 w-full text-center border-b border-orange-200">Queue (EU)</div>
                       <div className="flex gap-1 p-2">
                          <div className="w-4 h-4 bg-orange-200 rounded-sm"></div>
                          <div className="w-4 h-4 bg-orange-200 rounded-sm"></div>
                          <div className="w-4 h-4 bg-slate-100 rounded-sm border border-slate-200 border-dashed"></div>
                       </div>
                    </div>
                    <div className="h-4 w-1 bg-slate-300 relative">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-400"></div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-2 rounded text-center w-32 shadow-sm">
                       <div className="text-xs font-bold text-blue-800">EU Consumer</div>
                       <div className="text-[9px] text-blue-600 mt-1">Sends ACK &gt; Msg Deleted</div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col items-center gap-4">
                    <div className="bg-white border-2 border-orange-300 p-2 rounded w-32 flex flex-col items-center shadow-sm opacity-60">
                       <div className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 w-full text-center border-b border-orange-200">Queue (US)</div>
                       <div className="flex gap-1 p-2">
                          <div className="w-4 h-4 bg-slate-100 rounded-sm border border-slate-200 border-dashed"></div>
                          <div className="w-4 h-4 bg-slate-100 rounded-sm border border-slate-200 border-dashed"></div>
                       </div>
                       <div className="absolute -top-3 -right-3 bg-slate-600 text-white text-[8px] font-bold px-1 rounded">Empty</div>
                    </div>
                    <div className="h-4 w-1 bg-slate-300 relative opacity-60">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-400"></div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-2 rounded text-center w-32 shadow-sm opacity-60">
                       <div className="text-xs font-bold text-blue-800">US Consumer</div>
                       <div className="text-[9px] text-blue-600 mt-1">Waiting...</div>
                    </div>
                 </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Kafka Architecture */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-6 h-6 text-orange-600" /> Apache Kafka Event Streaming
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              Unlike RabbitMQ (which deletes messages once consumed), Kafka stores events in an append-only log partitioned across brokers. Multiple consumer groups can read the same events independently by tracking their own offsets.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 items-stretch max-w-4xl mx-auto">
              {/* Producers */}
              <div className="flex flex-col justify-center gap-4">
                <div className="bg-white border-2 border-slate-300 p-3 rounded-xl text-center shadow-sm">
                  <div className="font-bold text-slate-700 text-sm">Producer A</div>
                  <div className="text-[10px] text-slate-500 mt-1">Key: "user-123"</div>
                </div>
                <div className="bg-white border-2 border-slate-300 p-3 rounded-xl text-center shadow-sm">
                  <div className="font-bold text-slate-700 text-sm">Producer B</div>
                  <div className="text-[10px] text-slate-500 mt-1">Key: "user-456"</div>
                </div>
              </div>
              
              <div className="flex-1 bg-orange-50 border-2 border-orange-200 rounded-xl p-4 relative shadow-sm">
                 <div className="text-xs font-bold text-orange-800 absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-100 px-3 py-1 rounded shadow-sm">Kafka Topic: "orders"</div>
                 
                 <div className="space-y-4 mt-2">
                   <div className="bg-white border border-orange-300 p-2 rounded flex items-center">
                     <div className="bg-orange-200 text-orange-800 font-bold text-[10px] px-2 py-4 rounded-l h-full">Partition 0</div>
                     <div className="flex-1 flex gap-1 px-2 overflow-hidden">
                       <div className="w-8 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-[10px] text-blue-800">1</div>
                       <div className="w-8 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-[10px] text-blue-800">2</div>
                       <div className="w-8 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center text-[10px] text-blue-800">3</div>
                       <div className="w-8 h-8 bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 border-dashed"></div>
                     </div>
                   </div>
                   
                   <div className="bg-white border border-orange-300 p-2 rounded flex items-center">
                     <div className="bg-orange-200 text-orange-800 font-bold text-[10px] px-2 py-4 rounded-l h-full">Partition 1</div>
                     <div className="flex-1 flex gap-1 px-2 overflow-hidden">
                       <div className="w-8 h-8 bg-green-100 border border-green-300 flex items-center justify-center text-[10px] text-green-800">1</div>
                       <div className="w-8 h-8 bg-green-100 border border-green-300 flex items-center justify-center text-[10px] text-green-800">2</div>
                       <div className="w-8 h-8 bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 border-dashed"></div>
                     </div>
                   </div>
                 </div>
              </div>
              
              {/* Consumers */}
              <div className="flex flex-col justify-center gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-xl shadow-sm relative">
                  <div className="text-[10px] font-bold text-blue-800 absolute -top-2 left-2 bg-white px-1">Consumer Grp A</div>
                  <div className="mt-2 text-center text-sm font-bold text-blue-900">Inventory Service</div>
                  <div className="text-[10px] text-blue-700 text-center mt-1">Offset: P0(3), P1(2)</div>
                </div>
                <div className="bg-green-50 border-2 border-green-200 p-3 rounded-xl shadow-sm relative">
                  <div className="text-[10px] font-bold text-green-800 absolute -top-2 left-2 bg-white px-1">Consumer Grp B</div>
                  <div className="mt-2 text-center text-sm font-bold text-green-900">Shipping Service</div>
                  <div className="text-[10px] text-green-700 text-center mt-1">Offset: P0(1), P1(1)</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
               <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full border border-slate-200">Messages are persisted</span>
               <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full border border-slate-200">Consumers track offsets</span>
               <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full border border-slate-200">Keys guarantee partition order</span>
            </div>
          </div>
        </section>

        {/* AWS Architecture */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Cloud className="w-6 h-6 text-sky-600" /> AWS Cloud Architecture
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              A standard serverless/managed AWS architecture for a modern web application, demonstrating compute, storage, and networking layers.
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative max-w-4xl mx-auto">
              
              {/* Client -> Route53 -> CloudFront */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="bg-white border border-slate-300 p-3 rounded shadow-sm text-center">
                  <div className="text-xs font-bold text-slate-700">Client Client</div>
                </div>
                <div className="text-slate-400 font-mono text-[10px]">HTTPS</div>
                <div className="bg-sky-50 border border-sky-300 p-3 rounded shadow-sm text-center">
                  <div className="text-sm font-bold text-sky-800">Route 53</div>
                  <div className="text-[10px] text-sky-600">DNS Resolution</div>
                </div>
                <div className="text-slate-400 font-mono text-[10px]">-&gt;</div>
                <div className="bg-sky-50 border border-sky-300 p-3 rounded shadow-sm text-center">
                  <div className="text-sm font-bold text-sky-800">CloudFront</div>
                  <div className="text-[10px] text-sky-600">CDN & Edge Cache</div>
                </div>
              </div>
              
              {/* Compute Layer */}
              <div className="border border-dashed border-sky-300 rounded-lg p-4 bg-white relative mb-8">
                <div className="absolute -top-3 left-4 bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded">Compute Layer (VPC)</div>
                <div className="grid grid-cols-2 gap-8 pt-2">
                  
                  {/* Serverless Track */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-orange-50 border border-orange-300 p-3 rounded shadow-sm text-center w-full">
                      <div className="text-sm font-bold text-orange-800">API Gateway</div>
                      <div className="text-[10px] text-orange-600">REST / Auth</div>
                    </div>
                    <div className="text-slate-400 font-mono text-[10px]">triggers</div>
                    <div className="bg-orange-50 border border-orange-300 p-3 rounded shadow-sm text-center w-full">
                      <div className="text-sm font-bold text-orange-800 flex justify-center items-center gap-1"><Zap className="w-4 h-4"/> Lambda</div>
                      <div className="text-[10px] text-orange-600">Serverless Function</div>
                    </div>
                  </div>
                  
                  {/* Container Track */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-fuchsia-50 border border-fuchsia-300 p-3 rounded shadow-sm text-center w-full">
                      <div className="text-sm font-bold text-fuchsia-800">ALB</div>
                      <div className="text-[10px] text-fuchsia-600">App Load Balancer (L7)</div>
                    </div>
                    <div className="text-slate-400 font-mono text-[10px]">routes to</div>
                    <div className="bg-fuchsia-50 border border-fuchsia-300 p-3 rounded shadow-sm text-center w-full">
                      <div className="text-sm font-bold text-fuchsia-800 flex justify-center items-center gap-1"><Boxes className="w-4 h-4"/> ECS / Fargate</div>
                      <div className="text-[10px] text-fuchsia-600">Serverless Containers</div>
                    </div>
                  </div>
                  
                </div>
              </div>
              
              {/* Storage Layer */}
              <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-white relative">
                <div className="absolute -top-3 left-4 bg-slate-200 text-slate-800 text-xs font-bold px-2 py-0.5 rounded">Storage & Data</div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="bg-blue-50 border border-blue-300 p-3 rounded shadow-sm text-center">
                    <div className="text-sm font-bold text-blue-800">DynamoDB</div>
                    <div className="text-[10px] text-blue-600">NoSQL Key-Value</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-300 p-3 rounded shadow-sm text-center">
                    <div className="text-sm font-bold text-blue-800">RDS / Aurora</div>
                    <div className="text-[10px] text-blue-600">Managed Relational</div>
                  </div>
                  <div className="bg-green-50 border border-green-300 p-3 rounded shadow-sm text-center">
                    <div className="text-sm font-bold text-green-800">S3</div>
                    <div className="text-[10px] text-green-600">Object Storage (Assets)</div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>


        {/* CI/CD Pipeline */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-rose-600" /> CI/CD Pipeline (Git to Production)
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <p className="text-sm text-slate-600 mb-6 min-w-[600px]">
              A standard continuous integration and continuous deployment pipeline using Git, Jenkins, Docker, and AWS (or any container orchestrator).
            </p>
            
            <div className="flex items-center min-w-[800px] pb-4">
               {/* 1. Code */}
               <div className="flex flex-col items-center">
                 <div className="bg-slate-100 border-2 border-slate-300 w-16 h-16 rounded-full flex items-center justify-center font-bold text-slate-700 shadow-sm z-10 relative">
                   Git
                 </div>
                 <div className="text-[10px] text-slate-500 font-bold mt-2 text-center">Developer<br/>Push</div>
               </div>
               
               <div className="flex-1 h-1 bg-slate-300 relative mx-1">
                 <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white border border-slate-300 text-[9px] px-1 text-slate-500 rounded-sm shadow-sm">Webhook</div>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 border-y-4 border-y-transparent border-l-4 border-l-slate-400"></div>
               </div>
               
               {/* 2. Build & Test */}
               <div className="flex flex-col items-center relative z-10">
                 <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 w-48 shadow-sm">
                   <div className="font-bold text-rose-800 text-sm text-center mb-2">Jenkins / CI</div>
                   <div className="flex flex-col gap-1">
                     <div className="bg-white border border-rose-200 text-[10px] px-2 py-1 flex items-center justify-between"><span className="text-slate-600">mvn clean test</span><span className="text-green-500 font-bold">✓</span></div>
                     <div className="bg-white border border-rose-200 text-[10px] px-2 py-1 flex items-center justify-between"><span className="text-slate-600">SonarQube</span><span className="text-green-500 font-bold">✓</span></div>
                   </div>
                 </div>
                 <div className="text-[10px] text-rose-600 font-bold mt-2 text-center">Continuous Integration</div>
               </div>
               
               <div className="flex-1 h-1 bg-slate-300 relative mx-1">
                 <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white border border-slate-300 text-[9px] px-1 text-slate-500 rounded-sm shadow-sm">Docker Build</div>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 border-y-4 border-y-transparent border-l-4 border-l-slate-400"></div>
               </div>
               
               {/* 3. Registry */}
               <div className="flex flex-col items-center z-10">
                 <div className="bg-sky-50 border-2 border-sky-300 rounded-xl p-3 w-32 text-center shadow-sm">
                   <div className="font-bold text-sky-800 text-sm">Docker Registry</div>
                   <div className="text-[10px] bg-white border border-sky-200 mt-2 px-1 py-1 text-slate-600 break-all">myapp:v1.2.3</div>
                 </div>
                 <div className="text-[10px] text-sky-600 font-bold mt-2 text-center">Artifact Storage<br/>(ECR, Harbor)</div>
               </div>
               
               <div className="flex-1 h-1 bg-slate-300 relative mx-1">
                 <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white border border-slate-300 text-[9px] px-1 text-slate-500 rounded-sm shadow-sm">Deploy</div>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 border-y-4 border-y-transparent border-l-4 border-l-slate-400"></div>
               </div>
               
               {/* 4. Production */}
               <div className="flex flex-col items-center z-10">
                 <div className="bg-fuchsia-50 border-2 border-fuchsia-300 rounded-xl p-3 w-40 text-center shadow-sm">
                   <div className="font-bold text-fuchsia-800 text-sm">Production App</div>
                   <div className="flex gap-2 justify-center mt-2">
                     <div className="bg-fuchsia-100 border border-fuchsia-300 w-6 h-6 rounded flex items-center justify-center text-[10px] text-fuchsia-700">Pod</div>
                     <div className="bg-fuchsia-100 border border-fuchsia-300 w-6 h-6 rounded flex items-center justify-center text-[10px] text-fuchsia-700">Pod</div>
                     <div className="bg-fuchsia-100 border border-fuchsia-300 w-6 h-6 rounded flex items-center justify-center text-[10px] text-fuchsia-700">Pod</div>
                   </div>
                 </div>
                 <div className="text-[10px] text-fuchsia-600 font-bold mt-2 text-center">Continuous Deployment<br/>(K8s / ECS)</div>
               </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
