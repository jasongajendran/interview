import { useState } from 'react';
import {
  Rocket,
  GitCommit,
  Layers,
  TerminalSquare,
  ShieldCheck,
  Package,
  ServerCog,
  RefreshCw,
  GitMerge,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';

export function CiCdVisuals() {
  const [expandedSection, setExpandedSection] = useState<string | null>('jenkins-gocd');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-10">
      {/* 1. Jenkins vs GoCD */}
      <section id="jenkins-gocd" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">CI/CD Pipelines: Jenkins vs GoCD</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Declarative Pipelines vs Value Stream Maps (VSM)</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSection('jenkins-gocd')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start md:self-auto bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {expandedSection === 'jenkins-gocd' ? <>Hide <ChevronUp className="w-3.5 h-3.5" /></> : <>Expand <ChevronDown className="w-3.5 h-3.5" /></>}
            </button>
          </div>

          {expandedSection === 'jenkins-gocd' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Jenkins */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-indigo-800 font-bold mb-4 text-sm">
                    <TerminalSquare className="w-4 h-4" /> Jenkins Declarative Pipeline
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-white p-3 border border-slate-200 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">1</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">agent &#123; kubernetes &#123; ... &#125; &#125;</div>
                        <div className="text-[10px] text-slate-500">Spawns ephemeral build pods</div>
                      </div>
                    </div>
                    <div className="flex justify-center"><ChevronDown className="w-4 h-4 text-slate-400" /></div>
                    <div className="bg-white p-3 border border-slate-200 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">2</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">stage('Build & Test')</div>
                        <div className="text-[10px] text-slate-500">mvn clean verify</div>
                      </div>
                    </div>
                    <div className="flex justify-center"><ChevronDown className="w-4 h-4 text-slate-400" /></div>
                    <div className="bg-white p-3 border border-slate-200 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">3</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">stage('SonarQube Quality Gate')</div>
                        <div className="text-[10px] text-slate-500">Halts pipeline if code quality is poor</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GoCD */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-4 text-sm">
                    <GitMerge className="w-4 h-4" /> GoCD Value Stream Map (VSM)
                  </div>
                  
                  <div className="text-xs text-emerald-900 mb-4">
                    GoCD treats pipelines as first-class citizens. Pipelines can trigger other pipelines, creating a complex dependency graph (Fan-in / Fan-out).
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4 items-center">
                       <div className="bg-white p-2 border border-emerald-200 rounded-lg flex-1 text-center text-[10px] font-bold text-slate-700">Pipeline A (Core Lib)</div>
                       <div className="bg-white p-2 border border-emerald-200 rounded-lg flex-1 text-center text-[10px] font-bold text-slate-700">Pipeline B (Auth Lib)</div>
                    </div>
                    <div className="flex justify-center gap-10">
                       <ChevronDown className="w-4 h-4 text-emerald-400 rotate-[-30deg]" />
                       <ChevronDown className="w-4 h-4 text-emerald-400 rotate-[30deg]" />
                    </div>
                    <div className="bg-white p-3 border border-emerald-300 rounded-lg text-center shadow-sm relative">
                       <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">Fan-In</div>
                       <div className="text-xs font-bold text-emerald-900">Pipeline C (Microservice)</div>
                       <div className="text-[10px] text-slate-500 mt-1">Only triggers when BOTH A & B successfully build from the SAME upstream commit.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Ansible Architecture */}
      <section id="ansible-architecture" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <ServerCog className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ansible Agentless Architecture & Idempotency</h2>
                <p className="text-xs text-slate-500 mt-0.5">Configuration Management over SSH</p>
              </div>
            </div>
          </div>
          <div className="p-6">
             <div className="flex flex-col lg:flex-row gap-8 items-center">
               <div className="bg-slate-900 rounded-xl p-5 text-slate-300 w-full lg:w-1/3 shadow-md border border-slate-700">
                  <h4 className="text-emerald-400 font-bold text-sm mb-3 flex items-center gap-2">
                    <TerminalSquare className="w-4 h-4" /> Control Node
                  </h4>
                  <ul className="text-xs space-y-2 font-mono">
                    <li><span className="text-sky-400">Inventory:</span> /etc/ansible/hosts</li>
                    <li><span className="text-rose-400">Playbook:</span> deploy.yml</li>
                    <li><span className="text-amber-400">Roles:</span> reusable tasks</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-slate-700 text-[10px] text-slate-400">
                    No custom daemons required. Uses standard SSH (Linux) or WinRM (Windows).
                  </div>
               </div>

               <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">SSH Push</div>
                  <div className="flex items-center gap-0 text-indigo-300">
                    <div className="w-16 h-0.5 bg-indigo-300"></div>
                    <ArrowRight className="w-5 h-5 -ml-1" />
                  </div>
               </div>

               <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center">
                     <ServerCog className="w-8 h-8 text-slate-600 mb-2" />
                     <div className="font-bold text-sm text-slate-800">Target Node 1</div>
                     <div className="text-[10px] text-slate-500 mt-1">Python executes modules</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center">
                     <ServerCog className="w-8 h-8 text-slate-600 mb-2" />
                     <div className="font-bold text-sm text-slate-800">Target Node 2</div>
                     <div className="text-[10px] text-slate-500 mt-1">Python executes modules</div>
                  </div>
               </div>
             </div>

             <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-amber-600" /> The Golden Rule: Idempotency
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed mb-3">
                  An Ansible module should only apply a change if the current state differs from the desired state. Running the same playbook 1 time or 100 times should result in the exact same system state, without side effects.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white p-3 rounded border border-amber-200">
                      <div className="text-[10px] font-bold text-rose-600 uppercase mb-1">BAD: Non-Idempotent</div>
                      <code className="text-[10px] text-slate-600 font-mono">
                        - name: Install nginx<br/>
                        &nbsp;&nbsp;shell: apt-get install nginx
                      </code>
                   </div>
                   <div className="bg-white p-3 rounded border border-amber-200">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">GOOD: Idempotent</div>
                      <code className="text-[10px] text-slate-600 font-mono">
                        - name: Install nginx<br/>
                        &nbsp;&nbsp;apt: name=nginx state=present
                      </code>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ArrowRight was missing in import, adding a custom component or re-import it
function ArrowRight(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}
