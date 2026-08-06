import { useState, useMemo } from 'react';
import {
  Layers,
  Server,
  Activity,
  Cpu,
  ShieldCheck,
  Database,
  Cloud,
  Zap,
  Boxes,
  KeyRound,
  Shield,
  RefreshCw,
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  Radio
} from 'lucide-react';
import { JvmVisuals } from './visuals/JvmVisuals';
import { SpringVisuals } from './visuals/SpringVisuals';
import { MessagingVisuals } from './visuals/MessagingVisuals';
import { MicroservicesVisuals } from './visuals/MicroservicesVisuals';
import { SecurityCloudVisuals } from './visuals/SecurityCloudVisuals';

type CategoryFilter = 'all' | 'jvm' | 'spring' | 'messaging' | 'microservices' | 'security-cloud';

export function VisualsView() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Architecture Diagrams', icon: Layers, count: 18 },
    { id: 'jvm', label: 'JVM & Concurrency', icon: Cpu, count: 4 },
    { id: 'spring', label: 'Spring Boot Internals', icon: Boxes, count: 4 },
    { id: 'messaging', label: 'Kafka & RabbitMQ', icon: Radio, count: 3 },
    { id: 'microservices', label: 'Microservices & Sagas', icon: Activity, count: 3 },
    { id: 'security-cloud', label: 'Security & Cloud DevOps', icon: Shield, count: 4 },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Senior &amp; Staff Engineer Visual Blueprints
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Java, Spring, Kafka &amp; Cloud Visual Architecture
        </h1>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
          Visual concepts, sequence diagrams, and memory models designed for Java Senior Developers, Tech Leads, and Architects. Explore JVM internals, Kafka partition commit logs, RabbitMQ DLX topologies, Spring AOP proxies, Distributed Sagas, and OAuth2 PKCE.
        </p>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as CategoryFilter)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200'
                    : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-12">
        {/* JVM & Concurrency Section */}
        {(activeCategory === 'all' || activeCategory === 'jvm') && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg w-max mb-4">
              <Cpu className="w-4 h-4" /> JVM Internals, Garbage Collection &amp; Concurrency (4 Blueprints)
            </div>
            <JvmVisuals />
          </div>
        )}

        {/* Spring Framework & Boot Section */}
        {(activeCategory === 'all' || activeCategory === 'spring') && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg w-max mb-4">
              <Boxes className="w-4 h-4" /> Spring Boot Core, Dynamic Proxies &amp; Filter Chains (4 Blueprints)
            </div>
            <SpringVisuals />
          </div>
        )}

        {/* Messaging & Streaming: Kafka & RabbitMQ Section */}
        {(activeCategory === 'all' || activeCategory === 'messaging') && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg w-max mb-4">
              <Radio className="w-4 h-4 text-orange-600" /> Messaging &amp; Streaming: Kafka &amp; RabbitMQ Architecture (3 Blueprints)
            </div>
            <MessagingVisuals />
          </div>
        )}

        {/* Microservices & Distributed Systems Section */}
        {(activeCategory === 'all' || activeCategory === 'microservices') && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-fuchsia-800 bg-fuchsia-50 border border-fuchsia-100 px-3 py-1.5 rounded-lg w-max mb-4">
              <Activity className="w-4 h-4" /> Distributed Systems, Sagas, Outbox CDC &amp; Resiliency (3 Blueprints)
            </div>
            <MicroservicesVisuals />
          </div>
        )}

        {/* Security & Cloud DevOps Section */}
        {(activeCategory === 'all' || activeCategory === 'security-cloud') && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-800 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-lg w-max mb-4">
              <Shield className="w-4 h-4" /> Identity, Web Security, AWS Cloud &amp; GitOps CI/CD (4 Blueprints)
            </div>
            <SecurityCloudVisuals />
          </div>
        )}
      </div>
    </div>
  );
}
