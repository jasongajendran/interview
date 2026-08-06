import { useState } from 'react';
import {
  Activity,
  Layers,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Database,
  Cloud,
  Zap,
  Boxes,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function MicroservicesVisuals() {
  const [sagaType, setSagaType] = useState<'choreography' | 'orchestration'>('orchestration');
  const [circuitState, setCircuitState] = useState<'closed' | 'open' | 'half-open'>('closed');
  const [expandedSection, setExpandedSection] = useState<string | null>('outbox-pattern');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-10">
      {/* 1. Distributed Saga Pattern: Choreography vs Orchestration */}
      <section id="saga-pattern" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Distributed Saga Pattern: Choreography vs Orchestration</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Handling Multi-Service Distributed Transactions without 2PC (Two-Phase Commit)</p>
                </div>
              </div>
            </div>
            {/* Toggle Saga Type */}
            <div className="flex bg-slate-200 p-1 rounded-xl">
              <button
                onClick={() => setSagaType('orchestration')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  sagaType === 'orchestration' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Orchestration (Central Coordinator)
              </button>
              <button
                onClick={() => setSagaType('choreography')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  sagaType === 'choreography' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Choreography (Event-Driven)
              </button>
            </div>
          </div>

          <div className="p-6">
            {sagaType === 'orchestration' ? (
              <div>
                <p className="text-sm text-slate-600 mb-6">
                  In <strong>Saga Orchestration</strong>, a central <strong>Saga Orchestrator (State Machine)</strong> sends explicit command messages to participant microservices and waits for responses. On failure, the orchestrator issues inverse <strong>Compensating Commands</strong> in reverse order.
                </p>

                {/* Orchestration Visual Flow */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative max-w-4xl mx-auto mb-6">
                  <div className="flex flex-col items-center gap-6">
                    
                    {/* Orchestrator Center */}
                    <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-md text-center max-w-md w-full border-2 border-indigo-700">
                      <div className="text-xs font-mono font-bold text-indigo-200 uppercase tracking-wider">State Machine Orchestrator</div>
                      <div className="font-bold text-sm mt-0.5">OrderSagaManager.class</div>
                      <div className="text-[10px] text-indigo-100 mt-1">Coordinates: Order &rarr; Payment &rarr; Inventory &rarr; Delivery</div>
                    </div>

                    {/* Participant Services */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                      
                      {/* Step 1 */}
                      <div className="bg-white border-2 border-emerald-300 p-3.5 rounded-xl shadow-xs text-center">
                        <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">Step 1: Success</div>
                        <div className="font-bold text-slate-800 text-xs">Payment Service</div>
                        <div className="text-[10px] text-slate-500 mt-1">Execute: <code>ChargeCard()</code></div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Paid $150
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-white border-2 border-rose-300 p-3.5 rounded-xl shadow-xs text-center">
                        <div className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full inline-block mb-1">Step 2: Out of Stock!</div>
                        <div className="font-bold text-slate-800 text-xs">Inventory Service</div>
                        <div className="text-[10px] text-slate-500 mt-1">Execute: <code>ReserveStock()</code></div>
                        <div className="text-[10px] text-rose-600 font-bold mt-1.5 flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Stock Insufficient
                        </div>
                      </div>

                      {/* Step 3 (Compensation) */}
                      <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-xl shadow-xs text-center">
                        <div className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-1">Compensation Triggered</div>
                        <div className="font-bold text-amber-950 text-xs">Payment Service</div>
                        <div className="text-[10px] text-amber-800 mt-1">Rollback: <code>RefundCard()</code></div>
                        <div className="text-[10px] text-amber-700 font-bold mt-1.5 flex items-center justify-center gap-1">
                          <RefreshCw className="w-3 h-3" /> Refund Issued
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-950">
                    <div className="font-bold mb-1">Advantages:</div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-emerald-900">
                      <li>Centralized state tracking and easy auditing/observability.</li>
                      <li>Simpler to manage complex workflows with 4+ participating microservices.</li>
                      <li>Easy to implement timeouts and compensation retries.</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-950">
                    <div className="font-bold mb-1">Trade-offs:</div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-900">
                      <li>Risk of concentrating too much business logic in the orchestrator.</li>
                      <li>Requires resilient orchestrator infrastructure (e.g. Temporal, Camunda, AWS Step Functions).</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-600 mb-6">
                  In <strong>Saga Choreography</strong>, there is no central controller. Microservices communicate asynchronously by publishing and subscribing to domain events over Kafka or RabbitMQ. Each service listens for events and decides whether to execute local transactions or emit compensating events.
                </p>

                {/* Choreography Event Ring Flow */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                    
                    <div className="bg-white border-2 border-indigo-300 p-3 rounded-xl text-center shadow-xs flex-1 w-full">
                      <div className="font-bold text-indigo-900">1. Order Service</div>
                      <div className="text-[10px] text-indigo-700 mt-1">Publishes <code>OrderCreated</code></div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0" />

                    <div className="bg-white border-2 border-emerald-300 p-3 rounded-xl text-center shadow-xs flex-1 w-full">
                      <div className="font-bold text-emerald-900">2. Payment Service</div>
                      <div className="text-[10px] text-emerald-700 mt-1">Publishes <code>PaymentCompleted</code></div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0" />

                    <div className="bg-white border-2 border-rose-300 p-3 rounded-xl text-center shadow-xs flex-1 w-full">
                      <div className="font-bold text-rose-900">3. Inventory Service</div>
                      <div className="text-[10px] text-rose-700 mt-1">Stock fails &rarr; Publishes <code>InventoryFailed</code></div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0" />

                    <div className="bg-amber-50 border-2 border-amber-300 p-3 rounded-xl text-center shadow-xs flex-1 w-full">
                      <div className="font-bold text-amber-900">4. Payment Refund</div>
                      <div className="text-[10px] text-amber-700 mt-1">Consumes <code>InventoryFailed</code> &amp; refunds</div>
                    </div>

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-950">
                    <div className="font-bold mb-1">When to Use Choreography:</div>
                    <p className="text-[11px] text-emerald-900">Simple workflows (2-4 services), high throughput requirement, where loose coupling and pure event-driven autonomy are prioritized.</p>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-rose-950">
                    <div className="font-bold mb-1">Senior Warning:</div>
                    <p className="text-[11px] text-rose-900">Risk of &quot;Event Spaghetti&quot; as the number of microservices grows, making it difficult to trace workflow execution paths across distributed logs.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Transactional Outbox Pattern & CDC */}
      <section id="outbox-pattern" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Transactional Outbox Pattern &amp; CDC (Change Data Capture)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Solving the Dual-Write Problem with Guaranteed At-Least-Once Delivery via Debezium &amp; Kafka</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSection('outbox-pattern')}
              className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1 self-start md:self-auto bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {expandedSection === 'outbox-pattern' ? <>Hide Dual-Write Breakdown <ChevronUp className="w-3.5 h-3.5" /></> : <>Show Dual-Write Breakdown <ChevronDown className="w-3.5 h-3.5" /></>}
            </button>
          </div>

          <div className="p-6">
            {/* Diagram */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-4xl mx-auto mb-6">
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
                
                {/* 1. App Service */}
                <div className="bg-white border-2 border-indigo-300 p-3 rounded-xl text-center w-full lg:w-40 shadow-xs">
                  <div className="font-bold text-indigo-950">Order Service</div>
                  <div className="text-[10px] text-slate-500 mt-1">Receives HTTP POST /orders</div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 lg:rotate-0" />

                {/* 2. Single DB ACID Transaction */}
                <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-xl shadow-xs flex-1 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-emerald-950 text-xs">PostgreSQL Database (ACID Boundary)</span>
                    <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">1 Single Local Transaction</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2 rounded border border-emerald-200">
                      <div className="font-bold text-emerald-900 text-[11px]">orders Table</div>
                      <div className="text-[9px] text-slate-500">Insert order data</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-emerald-200">
                      <div className="font-bold text-emerald-900 text-[11px]">outbox_events Table</div>
                      <div className="text-[9px] text-slate-500">Insert payload JSON</div>
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 lg:rotate-0" />

                {/* 3. CDC Engine (Debezium) */}
                <div className="bg-amber-50 border-2 border-amber-400 p-3 rounded-xl text-center w-full lg:w-40 shadow-xs">
                  <div className="font-bold text-amber-950">Debezium CDC</div>
                  <div className="text-[10px] text-amber-800 mt-1">Tails DB WAL / Binlog stream</div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 lg:rotate-0" />

                {/* 4. Kafka Topic */}
                <div className="bg-orange-50 border-2 border-orange-400 p-3 rounded-xl text-center w-full lg:w-36 shadow-xs">
                  <div className="font-bold text-orange-950">Kafka Topic</div>
                  <div className="text-[10px] text-orange-800 mt-1">orders.events</div>
                </div>

              </div>

            </div>

            {/* Senior Breakdown */}
            {expandedSection === 'outbox-pattern' && (
              <div className="pt-4 border-t border-slate-200 space-y-3 text-xs">
                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-rose-950">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> The Dual-Write Antipattern:
                  </div>
                  <p className="leading-relaxed text-[11px] text-rose-900">
                    Attempting to save to DB (<code>orderRepo.save()</code>) and then immediately call <code>kafkaTemplate.send()</code> in Java code is fundamentally flawed. If Kafka crashes right after the DB commit, or if the DB transaction fails after sending to Kafka, your distributed system enters a permanently inconsistent state.
                  </p>
                </div>
                <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-[11px]">
                  <div className="text-emerald-400 font-bold mb-1">// Outbox Table Schema Example:</div>
                  <pre className="text-slate-300">
{`CREATE TABLE outbox_events (
  id UUID PRIMARY KEY,
  aggregate_type VARCHAR(255) NOT NULL,
  aggregate_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Resilience4j Circuit Breaker State Machine */}
      <section id="circuit-breaker" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Resilience4j Circuit Breaker State Machine</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Closed &rarr; Open &rarr; Half-Open Lifecycle with Sliding Window Failure Rate Calculation</p>
                </div>
              </div>
            </div>
            {/* Interactive State Toggle */}
            <div className="flex bg-slate-200 p-1 rounded-xl">
              <button
                onClick={() => setCircuitState('closed')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  circuitState === 'closed' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CLOSED (Normal)
              </button>
              <button
                onClick={() => setCircuitState('open')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  circuitState === 'open' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                OPEN (Tripped)
              </button>
              <button
                onClick={() => setCircuitState('half-open')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  circuitState === 'half-open' ? 'bg-amber-500 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HALF-OPEN (Probe)
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-6">
              
              {/* CLOSED */}
              <div className={`p-4 rounded-2xl border-2 transition-all ${
                circuitState === 'closed' ? 'bg-emerald-50 border-emerald-400 shadow-md scale-102 ring-2 ring-emerald-300' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-950 text-sm">CLOSED</span>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">Calls Allowed</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  All requests pass through to downstream service. Sliding window (Count-based or Time-based) monitors failure rate and slow call rate.
                </p>
                <div className="text-[10px] text-emerald-800 bg-white p-2 rounded border border-emerald-200 font-mono">
                  failureRate &gt; 50% &rarr; Trips to OPEN
                </div>
              </div>

              {/* OPEN */}
              <div className={`p-4 rounded-2xl border-2 transition-all ${
                circuitState === 'open' ? 'bg-rose-50 border-rose-400 shadow-md scale-102 ring-2 ring-rose-300' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-rose-950 text-sm">OPEN</span>
                  <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">Calls Blocked (Fail-Fast)</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Throws <code>CallNotPermittedException</code> immediately without calling downstream service. Fallback method is invoked.
                </p>
                <div className="text-[10px] text-rose-800 bg-white p-2 rounded border border-rose-200 font-mono">
                  Wait duration in OPEN (e.g. 10s) expires &rarr; Moves to HALF-OPEN
                </div>
              </div>

              {/* HALF-OPEN */}
              <div className={`p-4 rounded-2xl border-2 transition-all ${
                circuitState === 'half-open' ? 'bg-amber-50 border-amber-400 shadow-md scale-102 ring-2 ring-amber-300' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-950 text-sm">HALF-OPEN</span>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Trial Probing</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Allows a configured number of probe requests (e.g. 5 calls) to test if the downstream service has recovered.
                </p>
                <div className="text-[10px] text-amber-800 bg-white p-2 rounded border border-amber-200 font-mono">
                  Probes succeed &rarr; CLOSED<br/>
                  Probes fail &rarr; OPEN
                </div>
              </div>

            </div>

            {/* Resilience4j Config Snippet */}
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-[11px]">
              <div className="text-emerald-400 font-bold mb-1">application.yaml (Resilience4j Configuration)</div>
              <pre className="text-slate-300">
{`resilience4j.circuitbreaker:
  instances:
    paymentService:
      slidingWindowType: COUNT_BASED
      slidingWindowSize: 100
      minimumNumberOfCalls: 20
      failureRateThreshold: 50.0
      waitDurationInOpenState: 10000ms
      permittedNumberOfCallsInHalfOpenState: 10
      automaticTransitionFromOpenToHalfOpenEnabled: true`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
