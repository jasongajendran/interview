import { useState } from 'react';
import {
  Layers,
  Activity,
  Boxes,
  Database,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Cpu,
  Clock,
  Radio,
  Share2,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCode,
  ShieldAlert
} from 'lucide-react';

export function MessagingVisuals() {
  const [kafkaMode, setKafkaMode] = useState<'partitions' | 'idempotence' | 'rebalance'>('partitions');
  const [rabbitExchange, setRabbitExchange] = useState<'direct' | 'topic' | 'fanout' | 'dlx'>('topic');
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'kafka' | 'rabbitmq'>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>('kafka-zero-copy');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-10">
      {/* 1. Apache Kafka Distributed Architecture & Commit Log */}
      <section id="kafka-architecture" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-100 text-orange-700 rounded-xl">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Apache Kafka: Distributed Commit Log &amp; Partition Internals</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Partition Leaders, ISR Replication, HW vs LEO, Zero-Copy OS Transfer &amp; Cooperative Rebalance</p>
                </div>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-200 p-1 rounded-xl">
              <button
                onClick={() => setKafkaMode('partitions')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  kafkaMode === 'partitions' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Partitions &amp; ISR
              </button>
              <button
                onClick={() => setKafkaMode('idempotence')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  kafkaMode === 'idempotence' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Producer ACKs &amp; EOS
              </button>
              <button
                onClick={() => setKafkaMode('rebalance')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  kafkaMode === 'rebalance' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Consumer Rebalance
              </button>
            </div>
          </div>

          <div className="p-6">
            {kafkaMode === 'partitions' && (
              <div className="space-y-6">
                <p className="text-sm text-slate-600">
                  A Kafka <strong>Topic</strong> is partitioned into distributed append-only immutable commit logs on disk. Each partition has exactly one <strong>Leader Broker</strong> handling all writes/reads, and multiple <strong>Follower Replicas</strong> keeping in sync via the <strong>In-Sync Replicas (ISR)</strong> pool.
                </p>

                {/* Kafka Partition & Cluster Diagram */}
                <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 border border-slate-800">
                  <div className="text-xs font-mono text-orange-400 font-bold mb-4 flex items-center justify-between">
                    <span>TOPIC: &quot;orders.payment.events&quot; (3 Partitions, Replication Factor = 3)</span>
                    <span className="text-[10px] bg-orange-950 text-orange-300 border border-orange-800 px-2 py-0.5 rounded">KRaft Quorum Active</span>
                  </div>

                  {/* Partition Visuals */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    
                    {/* Partition 0 */}
                    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-xs">Partition 0</span>
                        <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">Leader: Broker-101</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mb-3 font-mono">ISR: [101 (Leader), 102, 103]</div>

                      {/* Log Offsets Strip */}
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex items-center gap-1 text-[10px] font-mono overflow-x-auto pb-1">
                          <div className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-center min-w-[36px]">0</div>
                          <div className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-center min-w-[36px]">1</div>
                          <div className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-center min-w-[36px]">2</div>
                          <div className="bg-emerald-900/60 border border-emerald-500 text-emerald-200 px-2 py-1 rounded text-center min-w-[36px] font-bold">
                            3
                          </div>
                          <div className="bg-amber-900/60 border border-amber-500 text-amber-200 px-2 py-1 rounded text-center min-w-[36px] font-bold">
                            4*
                          </div>
                        </div>

                        {/* HW vs LEO Markers */}
                        <div className="grid grid-cols-2 gap-2 text-[9px] font-mono pt-1 border-t border-slate-800">
                          <div className="text-emerald-400">
                            <span className="font-bold">HW (High Watermark) = 3:</span> Safe for Consumers to read (Committed to all ISRs)
                          </div>
                          <div className="text-amber-400">
                            <span className="font-bold">LEO (Log End Offset) = 5:</span> Next write position on Leader
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Partition 1 */}
                    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-xs">Partition 1</span>
                        <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">Leader: Broker-102</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mb-3 font-mono">ISR: [102 (Leader), 101, 103]</div>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex items-center gap-1 text-[10px] font-mono overflow-x-auto pb-1">
                          <div className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-center min-w-[36px]">0</div>
                          <div className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-center min-w-[36px]">1</div>
                          <div className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-center min-w-[36px]">2</div>
                          <div className="bg-emerald-900/60 border border-emerald-500 text-emerald-200 px-2 py-1 rounded text-center min-w-[36px] font-bold">
                            3
                          </div>
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                          HW = 3 | LEO = 4 (All replicas in sync)
                        </div>
                      </div>
                    </div>

                    {/* Partition 2 */}
                    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-xs">Partition 2</span>
                        <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">Leader: Broker-103</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mb-3 font-mono">ISR: [103 (Leader), 101] <span className="text-rose-400">(102 lagging)</span></div>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex items-center gap-1 text-[10px] font-mono overflow-x-auto pb-1">
                          <div className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-center min-w-[36px]">0</div>
                          <div className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-center min-w-[36px]">1</div>
                          <div className="bg-emerald-900/60 border border-emerald-500 text-emerald-200 px-2 py-1 rounded text-center min-w-[36px] font-bold">
                            2
                          </div>
                        </div>
                        <div className="text-[9px] font-mono text-rose-300 pt-1 border-t border-slate-800">
                          <code>replica.lag.time.max.ms</code> exceeded &rarr; 102 dropped from ISR pool
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Zero-Copy OS Explanation Toggle */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <button
                    onClick={() => toggleSection('kafka-zero-copy')}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-900 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      Why Kafka Achieves Millions of Msg/Sec: OS Page Cache &amp; Zero-Copy Transfer (`sendfile`)
                    </span>
                    {expandedSection === 'kafka-zero-copy' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {expandedSection === 'kafka-zero-copy' && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-2.5">
                      <p>
                        Traditional message brokers copy data 4 times between kernel space and user space (Disk &rarr; OS Buffer &rarr; JVM App Buffer &rarr; Socket Buffer &rarr; NIC Buffer).
                      </p>
                      <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px]">
                        <div className="text-emerald-400 font-bold mb-1">Kafka Linux Zero-Copy Pipeline:</div>
                        <div>Disk &rarr; OS Page Cache (Kernel) &rarr; <span className="text-orange-400 font-bold">sendfile() System Call</span> &rarr; NIC DMA Buffer (Network)</div>
                        <div className="text-slate-400 text-[10px] mt-1">// Bypasses JVM Heap entirely — Zero GC overhead, Zero CPU memory copies!</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {kafkaMode === 'idempotence' && (
              <div className="space-y-6">
                <p className="text-sm text-slate-600">
                  Achieving <strong>Exactly-Once Semantics (EOS)</strong> in Kafka requires configuring both the Producer (Idempotence + ACKs) and Consumer (Transaction Isolation + Offset Commit).
                </p>

                {/* Producer ACKs Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* acks=0 */}
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs">
                    <div className="font-bold text-rose-950 mb-1 flex items-center justify-between">
                      <span>acks = 0</span>
                      <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-mono">Fire &amp; Forget</span>
                    </div>
                    <p className="text-rose-900 mb-2">Producer sends records without waiting for broker acknowledgment.</p>
                    <div className="text-[10px] text-rose-800 bg-white p-2 rounded border border-rose-200">
                      <strong>Risk:</strong> High message loss if broker drops connection. Max throughput, zero durability.
                    </div>
                  </div>

                  {/* acks=1 */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs">
                    <div className="font-bold text-amber-950 mb-1 flex items-center justify-between">
                      <span>acks = 1</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono">Leader Only</span>
                    </div>
                    <p className="text-amber-900 mb-2">Producer waits until the Partition Leader writes to local log.</p>
                    <div className="text-[10px] text-amber-800 bg-white p-2 rounded border border-amber-200">
                      <strong>Risk:</strong> If Leader crashes before followers replicate, message is permanently lost.
                    </div>
                  </div>

                  {/* acks=all */}
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-xs ring-1 ring-emerald-400">
                    <div className="font-bold text-emerald-950 mb-1 flex items-center justify-between">
                      <span>acks = all / -1</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono">Full ISR Quorum</span>
                    </div>
                    <p className="text-emerald-900 mb-2">Leader writes and waits for all In-Sync Replicas (<code>min.insync.replicas=2</code>).</p>
                    <div className="text-[10px] text-emerald-800 bg-white p-2 rounded border border-emerald-200">
                      <strong>Standard:</strong> Combined with <code>enable.idempotence=true</code> for zero data loss and no duplicates.
                    </div>
                  </div>

                </div>

                {/* Idempotent Producer Mechanics */}
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px]">
                  <div className="text-orange-400 font-bold mb-2">How Idempotent Producer Eliminates Retried Duplicates:</div>
                  <div className="space-y-1.5 text-slate-300 text-[10px]">
                    <div>1. Producer assigns unique <span className="text-sky-300">Producer ID (PID)</span> + monotonically increasing <span className="text-sky-300">Sequence Number</span> per partition.</div>
                    <div>2. Broker tracks the highest committed Sequence Number per PID in memory and commit log.</div>
                    <div>3. If a network timeout causes the producer to retry sending Record #42, the Broker detects <code className="text-amber-300">incoming Seq(42) &le; lastCommitted Seq(42)</code> and acknowledges it without appending a duplicate!</div>
                  </div>
                </div>
              </div>
            )}

            {kafkaMode === 'rebalance' && (
              <div className="space-y-6">
                <p className="text-sm text-slate-600">
                  When consumer instances join or leave a <strong>Consumer Group</strong>, partition assignments rebalance. Spring Kafka supports both legacy Eager and modern <strong>Cooperative Sticky</strong> rebalancing.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs">
                    <div className="font-bold text-rose-950 mb-1">1. Eager Rebalance (Legacy / Disruptive)</div>
                    <p className="text-rose-900 text-[11px] mb-2">
                      Forces <strong>all</strong> consumers in the group to revoke all assigned partitions simultaneously (&quot;Stop-the-World&quot; pause), causing message processing to stall until all partitions are reassigned.
                    </p>
                    <span className="text-[10px] font-mono text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200 inline-block">
                      RangeAssignor / RoundRobinAssignor
                    </span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs">
                    <div className="font-bold text-emerald-950 mb-1">2. Cooperative Sticky Rebalance (Kafka 2.4+)</div>
                    <p className="text-emerald-900 text-[11px] mb-2">
                      Incremental 2-phase protocol: Consumers keep processing unaffected partitions without pausing. Only the specific partitions migrating to another broker/consumer are revoked.
                    </p>
                    <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 inline-block">
                      CooperativeStickyAssignor (Recommended)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. RabbitMQ AMQP 0-9-1 Architecture, Exchanges & DLX Retries */}
      <section id="rabbitmq-architecture" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">RabbitMQ (AMQP 0-9-1) Architecture &amp; DLX Resiliency</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Exchanges (Direct, Topic, Fanout), Binding Keys, Prefetch QoS &amp; Exponential DLX Retry Topology</p>
                </div>
              </div>
            </div>

            {/* Exchange Tabs */}
            <div className="flex bg-slate-200 p-1 rounded-xl">
              <button
                onClick={() => setRabbitExchange('topic')}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  rabbitExchange === 'topic' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Topic Exchange
              </button>
              <button
                onClick={() => setRabbitExchange('direct')}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  rabbitExchange === 'direct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Direct
              </button>
              <button
                onClick={() => setRabbitExchange('fanout')}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  rabbitExchange === 'fanout' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fanout
              </button>
              <button
                onClick={() => setRabbitExchange('dlx')}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  rabbitExchange === 'dlx' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                DLX Retry Topology
              </button>
            </div>
          </div>

          <div className="p-6">
            {rabbitExchange === 'topic' && (
              <div className="space-y-6">
                <p className="text-sm text-slate-600">
                  A <strong>Topic Exchange</strong> routes messages to queues based on wildcard matching between the <strong>Routing Key</strong> and the <strong>Binding Pattern</strong>:
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs ml-1 font-bold text-slate-800">*</span> (matches exactly 1 word) and{' '}
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs font-bold text-slate-800">#</span> (matches 0 or more words).
                </p>

                {/* Topic Routing Interactive Blueprint */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    
                    {/* Producer */}
                    <div className="bg-white border-2 border-indigo-300 p-3 rounded-xl text-center w-full md:w-44 shadow-xs">
                      <div className="font-bold text-indigo-900">Producer</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">Routing Key:</div>
                      <div className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1">
                        &quot;eu.orders.created&quot;
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-400 rotate-90 md:rotate-0" />

                    {/* Topic Exchange */}
                    <div className="bg-emerald-600 text-white p-4 rounded-xl text-center shadow-md w-full md:w-48">
                      <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-200 font-bold">AMQP Exchange</div>
                      <div className="font-bold text-sm">amq.topic</div>
                      <div className="text-[9px] text-emerald-100 mt-1">Type: Topic</div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-400 rotate-90 md:rotate-0" />

                    {/* Queues */}
                    <div className="space-y-3 w-full md:w-64">
                      
                      {/* Queue 1 Match */}
                      <div className="bg-emerald-50 border-2 border-emerald-400 p-2.5 rounded-xl shadow-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-950">EU Billing Queue</span>
                          <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">MATCH</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 mt-1">Binding: <code>eu.*.created</code></div>
                      </div>

                      {/* Queue 2 Match */}
                      <div className="bg-emerald-50 border-2 border-emerald-400 p-2.5 rounded-xl shadow-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-950">Global Audit Queue</span>
                          <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">MATCH</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 mt-1">Binding: <code>#.orders.#</code></div>
                      </div>

                      {/* Queue 3 No Match */}
                      <div className="bg-slate-100 border border-slate-300 p-2.5 rounded-xl opacity-60">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-600">US Shipping Queue</span>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">NO MATCH</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">Binding: <code>us.*.#</code></div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            )}

            {rabbitExchange === 'direct' && (
              <div className="space-y-4 text-xs text-slate-600">
                <p className="text-sm">
                  In a <strong>Direct Exchange</strong>, a message goes to the queues whose <code>binding key</code> <strong>exactly matches</strong> the <code>routing key</code> of the message.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="bg-white border border-slate-300 p-3 rounded-lg text-center w-full md:w-1/3">
                    <div className="font-bold text-slate-800">Routing Key: &quot;error&quot;</div>
                    <div className="text-[10px] text-slate-500 mt-1">&rarr; Matches Error Log Queue</div>
                  </div>
                  <div className="bg-white border border-slate-300 p-3 rounded-lg text-center w-full md:w-1/3">
                    <div className="font-bold text-slate-800">Routing Key: &quot;info&quot;</div>
                    <div className="text-[10px] text-slate-500 mt-1">&rarr; Matches General Log Queue</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-lg text-center w-full md:w-1/3">
                    <div className="font-bold text-emerald-900">Default Exchange</div>
                    <div className="text-[10px] text-emerald-700 mt-1">Directly targets queue named same as key</div>
                  </div>
                </div>
              </div>
            )}

            {rabbitExchange === 'fanout' && (
              <div className="space-y-4 text-xs text-slate-600">
                <p className="text-sm">
                  A <strong>Fanout Exchange</strong> completely ignores routing keys and blindly broadcasts the message to <strong>every single queue</strong> bound to it. Ideal for publish/subscribe broadcast scenarios.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="font-mono font-bold text-indigo-700 mb-2">amq.fanout &rarr; Broadcasts to [SMS Queue, Email Queue, Push Notification Queue]</div>
                  <p className="text-[11px] text-slate-500">Zero routing overhead, maximum message distribution speed.</p>
                </div>
              </div>
            )}

            {rabbitExchange === 'dlx' && (
              <div className="space-y-6">
                <p className="text-sm text-slate-600">
                  Production Resiliency Pattern: <strong>Dead Letter Exchange (DLX) + Exponential Retry Delay Queues</strong>. Avoids blocking primary queues while preventing message poisoning.
                </p>

                {/* DLX Sequence Flow */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
                    
                    {/* Step 1: Main Queue */}
                    <div className="bg-white border-2 border-emerald-300 p-3 rounded-xl shadow-xs w-full lg:w-48 text-center">
                      <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1">1. Primary Queue</div>
                      <div className="font-bold text-slate-900 text-xs">orders.incoming</div>
                      <div className="text-[9px] text-slate-500 mt-1">Consumer processes msg</div>
                      <div className="text-[9px] text-rose-600 font-bold mt-1">NACK (requeue=false)</div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 lg:rotate-0" />

                    {/* Step 2: Retry Wait Queue with TTL */}
                    <div className="bg-amber-50 border-2 border-amber-400 p-3 rounded-xl shadow-xs w-full lg:w-56 text-center">
                      <div className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full inline-block mb-1">2. Retry Queue (TTL)</div>
                      <div className="font-bold text-amber-950 text-xs">orders.retry.5s</div>
                      <div className="text-[9px] text-amber-800 mt-1"><code>x-message-ttl: 5000ms</code></div>
                      <div className="text-[9px] text-amber-900 font-mono mt-1">x-dead-letter-exchange &rarr; primary</div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 lg:rotate-0" />

                    {/* Step 3: DLQ (Parking Lot) */}
                    <div className="bg-rose-50 border-2 border-rose-400 p-3 rounded-xl shadow-xs w-full lg:w-48 text-center">
                      <div className="text-[10px] font-bold text-rose-900 bg-rose-200 px-2 py-0.5 rounded-full inline-block mb-1">3. Parking DLQ</div>
                      <div className="font-bold text-rose-950 text-xs">orders.dlq</div>
                      <div className="text-[9px] text-rose-800 mt-1">Max Retries (e.g. 3) Exceeded</div>
                      <div className="text-[9px] text-rose-900 font-bold mt-1">Alerts PagerDuty / Ops</div>
                    </div>

                  </div>
                </div>

                {/* Spring AMQP Configuration Code */}
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px]">
                  <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4" /> Spring Boot RabbitMQ Configuration (Prefetch + DLX)
                  </div>
                  <pre className="text-slate-300 overflow-x-auto">
{`@Bean
public Queue primaryQueue() {
    return QueueBuilder.durable("orders.incoming")
        .withArgument("x-dead-letter-exchange", "orders.dlx.exchange")
        .withArgument("x-dead-letter-routing-key", "orders.retry")
        .build();
}

// Prefetch configuration to prevent memory saturation:
@Bean
public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory cf) {
    var factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(cf);
    factory.setPrefetchCount(20); // Crucial for fair dispatch and avoiding Erlang OOM
    factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
    return factory;
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Kafka vs RabbitMQ: Senior Architect Comparison Matrix */}
      <section id="kafka-vs-rabbitmq" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Kafka vs. RabbitMQ: Architectural Decision Matrix</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Distributed Commit Log (Pull) vs. Smart Broker / Dumb Consumer (Push)</p>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex bg-slate-200 p-1 rounded-xl">
              <button
                onClick={() => setMatrixFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  matrixFilter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Dimensions
              </button>
              <button
                onClick={() => setMatrixFilter('kafka')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  matrixFilter === 'kafka' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                When to Choose Kafka
              </button>
              <button
                onClick={() => setMatrixFilter('rabbitmq')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  matrixFilter === 'rabbitmq' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                When to Choose RabbitMQ
              </button>
            </div>
          </div>

          <div className="p-6">
            {matrixFilter === 'all' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                      <th className="p-3 font-bold">Architectural Dimension</th>
                      <th className="p-3 font-bold text-orange-950 bg-orange-50/80">Apache Kafka</th>
                      <th className="p-3 font-bold text-emerald-950 bg-emerald-50/80">RabbitMQ (AMQP)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Core Paradigm</td>
                      <td className="p-3 bg-orange-50/30 text-slate-700"><strong>Distributed Append-Only Commit Log</strong> (Dumb Broker, Smart Consumer tracking offset)</td>
                      <td className="p-3 bg-emerald-50/30 text-slate-700"><strong>Smart Broker / Dumb Consumer</strong> (Broker tracks message state, delivery, ACKs)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Message Consumption</td>
                      <td className="p-3 bg-orange-50/30 text-slate-700"><strong>PULL model</strong> (Consumer polls batches at its own rate, built-in backpressure)</td>
                      <td className="p-3 bg-emerald-50/30 text-slate-700"><strong>PUSH model</strong> (Broker pushes to consumers via AMQP channels; regulated via <code>prefetchCount</code>)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Message Retention &amp; Replay</td>
                      <td className="p-3 bg-orange-50/30 text-slate-700"><strong>Persistent on Disk</strong> (Configurable retention: 7 days, 1 year, or infinite; Replayable anytime by rewinding offset)</td>
                      <td className="p-3 bg-emerald-50/30 text-slate-700"><strong>Transient &amp; Ephemeral</strong> (Message is deleted immediately once ACKed by consumer)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Throughput &amp; Latency</td>
                      <td className="p-3 bg-orange-50/30 text-slate-700"><strong>Massive Throughput</strong> (1M+ msg/sec) via batching, page cache &amp; zero-copy; Latency: ~5-15ms</td>
                      <td className="p-3 bg-emerald-50/30 text-slate-700"><strong>Ultra-Low Latency</strong> (&lt; 1ms sub-millisecond per message); Moderate Throughput (50k-100k msg/sec)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Ordering Guarantee</td>
                      <td className="p-3 bg-orange-50/30 text-slate-700"><strong>Strict Ordering within a Partition</strong> (Deterministic partition hashing via record key)</td>
                      <td className="p-3 bg-emerald-50/30 text-slate-700"><strong>FIFO per Queue</strong> (Can be disrupted if multiple concurrent consumers or NACK requeues occur)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Routing Complexity</td>
                      <td className="p-3 bg-orange-50/30 text-slate-700">Simple topic-based routing (Complex routing requires Kafka Streams / Flink)</td>
                      <td className="p-3 bg-emerald-50/30 text-slate-700"><strong>Extremely Rich</strong> (Direct, Topic, Fanout, Headers exchanges, Dead Letter bindings)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {matrixFilter === 'kafka' && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-xs text-orange-950 space-y-3">
                <div className="font-bold text-sm text-orange-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-orange-700" /> When Senior Architects Choose Kafka:
                </div>
                <ul className="list-disc pl-5 space-y-2 text-[11px] text-orange-900 leading-relaxed">
                  <li><strong>Event Sourcing &amp; Audit Logs:</strong> Immutable append-only log allows full state reconstruction and past event replay.</li>
                  <li><strong>High-Throughput Analytics &amp; Telemetry:</strong> Ingesting millions of sensor, clickstream, or payment transactions per second.</li>
                  <li><strong>Change Data Capture (CDC):</strong> Streaming database transaction logs (Debezium + Kafka) to data lakes / search indices.</li>
                  <li><strong>Stream Processing:</strong> Native integration with Kafka Streams, Apache Flink, and Spark Streaming for real-time windowing.</li>
                </ul>
              </div>
            )}

            {matrixFilter === 'rabbitmq' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-xs text-emerald-950 space-y-3">
                <div className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-emerald-700" /> When Senior Architects Choose RabbitMQ:
                </div>
                <ul className="list-disc pl-5 space-y-2 text-[11px] text-emerald-900 leading-relaxed">
                  <li><strong>Complex Enterprise Routing:</strong> Dynamic topic wildcard routing and header-based content filtering.</li>
                  <li><strong>Discrete Task / Job Queues:</strong> Worker threads pulling individual CPU-heavy background tasks with granular per-message manual ACKs.</li>
                  <li><strong>Priority Queuing &amp; Delayed Messages:</strong> Native support for high-priority emergency processing and delayed execution.</li>
                  <li><strong>Sub-Millisecond Low Latency:</strong> Real-time messaging, chat backends, and low-latency microservice RPC workflows.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
