import { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Code2,
  ArrowRight,
  Database,
  Lock,
  Boxes,
  FileCode,
  Shield
} from 'lucide-react';

export function SpringVisuals() {
  const [activeTab, setActiveTab] = useState<'lifecycle' | 'aop' | 'transactional' | 'security'>('lifecycle');
  const [expandedSection, setExpandedSection] = useState<string | null>('aop-pitfall');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-10">
      {/* 1. Spring Bean Lifecycle & Bootstrap Sequence */}
      <section id="spring-lifecycle" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Spring Bean Lifecycle &amp; ApplicationContext Bootstrap</h2>
                  <p className="text-xs text-slate-500 mt-0.5">End-to-end 10-Phase sequence from Reflection Instantiation to Dynamic AOP Proxy Creation</p>
                </div>
              </div>
            </div>
            <span className="text-xs font-mono bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold self-start md:self-auto">
              IoC Container Internals
            </span>
          </div>

          <div className="p-6">
            {/* Visual Sequence Grid */}
            <div className="space-y-3">
              {[
                {
                  step: '01',
                  phase: 'Instantiation',
                  desc: 'JVM Reflection invokes constructor (or CGLIB class subclassing).',
                  color: 'bg-slate-100 border-slate-300 text-slate-800',
                  badge: 'Constructor'
                },
                {
                  step: '02',
                  phase: 'Populate Properties',
                  desc: 'Spring injects dependencies via @Autowired, setters, and field injection.',
                  color: 'bg-blue-50 border-blue-200 text-blue-900',
                  badge: 'Dependency Injection'
                },
                {
                  step: '03',
                  phase: 'Aware Callbacks',
                  desc: 'Invokes BeanNameAware, BeanFactoryAware, and ApplicationContextAware hooks.',
                  color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
                  badge: '*Aware Interfaces'
                },
                {
                  step: '04',
                  phase: 'BeanPostProcessor (Before Init)',
                  desc: 'Executes postProcessBeforeInitialization(). Handles @PostConstruct and @ConfigurationProperties.',
                  color: 'bg-amber-50 border-amber-300 text-amber-900',
                  badge: '@PostConstruct'
                },
                {
                  step: '05',
                  phase: 'Initialization',
                  desc: 'Executes InitializingBean.afterPropertiesSet() followed by custom init-method.',
                  color: 'bg-cyan-50 border-cyan-300 text-cyan-900',
                  badge: 'afterPropertiesSet()'
                },
                {
                  step: '06',
                  phase: 'BeanPostProcessor (After Init) & PROXY WRAPPING',
                  desc: 'CRITICAL: postProcessAfterInitialization() wraps target bean in JDK Dynamic Proxy or CGLIB Subclass for @Transactional, @Async, @Cacheable, and @CircuitBreaker!',
                  color: 'bg-rose-50 border-rose-300 text-rose-950 font-semibold ring-1 ring-rose-400',
                  badge: 'AOP Proxy Created Here ⚡'
                },
                {
                  step: '07',
                  phase: 'Ready in IoC Singleton Pool',
                  desc: 'Bean is fully initialized and stored in DefaultSingletonBeanRegistry ready for injection into other beans.',
                  color: 'bg-emerald-50 border-emerald-300 text-emerald-950',
                  badge: 'Active & In-Service'
                },
                {
                  step: '08',
                  phase: 'Destruction Sequence',
                  desc: 'On context shutdown: @PreDestroy &rarr; DisposableBean.destroy() &rarr; custom destroy-method.',
                  color: 'bg-slate-100 border-slate-300 text-slate-800',
                  badge: '@PreDestroy'
                }
              ].map((item, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${item.color}`}>
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="font-mono font-bold text-sm opacity-60">{item.step}</span>
                    <div>
                      <div className="font-bold text-sm">{item.phase}</div>
                      <div className="text-slate-600 text-[11px] mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto font-mono text-[10px] bg-white/90 px-2.5 py-1 rounded-full shadow-xs border whitespace-nowrap font-bold">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Spring AOP Proxies & The Self-Invocation Trap */}
      <section id="spring-aop" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Spring AOP: Dynamic Proxies &amp; The Self-Invocation Trap</h2>
                  <p className="text-xs text-slate-500 mt-0.5">JDK Dynamic Proxy vs CGLIB &amp; Why <code>this.method()</code> Silently Bypasses Transactions</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSection('aop-pitfall')}
              className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1 self-start md:self-auto bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {expandedSection === 'aop-pitfall' ? <>Hide 3 Fixes <ChevronUp className="w-3.5 h-3.5" /></> : <>Show 3 Fixes <ChevronDown className="w-3.5 h-3.5" /></>}
            </button>
          </div>

          <div className="p-6">
            {/* Diagram */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-6">
              <div className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                AOP Interceptor Chain Pipeline
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
                {/* Caller */}
                <div className="bg-white border-2 border-slate-300 p-3 rounded-xl text-center w-full lg:w-36 shadow-xs">
                  <div className="font-bold text-slate-800">Client / Controller</div>
                  <div className="text-[10px] text-slate-500 mt-1">invokes service.order()</div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 lg:rotate-0" />

                {/* Proxy Box */}
                <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-xl flex-1 shadow-sm w-full">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-rose-950 text-xs">Spring AOP Proxy (CGLIB / Dynamic Proxy)</span>
                    <span className="text-[10px] font-mono bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold">Generated at Runtime</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded border border-rose-200 text-center">
                      <div className="font-bold text-rose-900 text-[11px]">SecurityInterceptor</div>
                      <div className="text-[9px] text-slate-500">@PreAuthorize check</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-rose-200 text-center">
                      <div className="font-bold text-rose-900 text-[11px]">TransactionInterceptor</div>
                      <div className="text-[9px] text-slate-500">conn.setAutoCommit(false)</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-rose-200 text-center">
                      <div className="font-bold text-rose-900 text-[11px]">CircuitBreakerInterceptor</div>
                      <div className="text-[9px] text-slate-500">Resilience4j track</div>
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 lg:rotate-0" />

                {/* Target Instance */}
                <div className="bg-emerald-50 border-2 border-emerald-300 p-3 rounded-xl text-center w-full lg:w-44 shadow-xs">
                  <div className="font-bold text-emerald-950">Target Real Bean</div>
                  <div className="text-[10px] text-emerald-800 mt-1">OrderServiceImpl.class</div>
                </div>
              </div>
            </div>

            {/* The Self-Invocation Trap Visual Warning */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-950 mb-6">
              <div className="flex items-center gap-2 font-bold text-amber-900 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                The Silent Failure: Calling <code>this.updateStatus()</code> from within the same class!
              </div>
              <p className="leading-relaxed">
                When <code>methodA()</code> calls <code>this.methodB()</code>, the invocation happens on the <strong>raw target object reference (<code>this</code>)</strong>, completely bypassing the Spring Proxy! Therefore, annotations on <code>methodB()</code> like <code>@Transactional(propagation = REQUIRES_NEW)</code>, <code>@Async</code>, or <code>@Cacheable</code> are <strong>NEVER EXECUTED</strong>.
              </p>
            </div>

            {/* Senior Solutions Accordion */}
            {expandedSection === 'aop-pitfall' && (
              <div className="pt-4 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-3">3 Senior Architectural Solutions for Self-Invocation:</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Solution 1 */}
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px]">
                    <div className="text-emerald-400 font-bold mb-1">1. Refactor to Separate Service (Recommended)</div>
                    <p className="text-slate-400 text-[10px] mb-2">Extract the transactional method into a distinct collaborating bean.</p>
                    <pre className="text-emerald-300 text-[10px]">
{`@Service
public class OrderService {
  private final PaymentService paySvc;
  public void checkout() {
    paySvc.processPayment(); // Goes through proxy!
  }
}`}
                    </pre>
                  </div>

                  {/* Solution 2 */}
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px]">
                    <div className="text-sky-400 font-bold mb-1">2. Self-Injection via @Lazy</div>
                    <p className="text-slate-400 text-[10px] mb-2">Inject the proxy into the bean itself.</p>
                    <pre className="text-sky-300 text-[10px]">
{`@Service
public class OrderService {
  @Autowired @Lazy
  private OrderService self;

  public void checkout() {
    self.processPayment(); // Routes via proxy!
  }
}`}
                    </pre>
                  </div>

                  {/* Solution 3 */}
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px]">
                    <div className="text-amber-400 font-bold mb-1">3. AopContext.currentProxy()</div>
                    <p className="text-slate-400 text-[10px] mb-2">Requires <code>@EnableAspectJAutoProxy(exposeProxy = true)</code>.</p>
                    <pre className="text-amber-300 text-[10px]">
{`public void checkout() {
  ((OrderService) AopContext
    .currentProxy())
    .processPayment();
}`}
                    </pre>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 3. Spring @Transactional Propagation Under the Hood */}
      <section id="spring-transactional" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Spring @Transactional &amp; Propagation Mechanics</h2>
                  <p className="text-xs text-slate-500 mt-0.5">ThreadLocal Connection Binding (TransactionSynchronizationManager) &amp; Isolation</p>
                </div>
              </div>
            </div>
            <span className="text-xs font-mono bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full font-bold self-start md:self-auto">
              ACID Orchestration
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-6">
              
              <div className="bg-slate-50 border border-slate-300 p-3.5 rounded-xl">
                <div className="font-bold text-indigo-950 mb-1">REQUIRED (Default)</div>
                <p className="text-slate-600 text-[11px]">Joins existing transaction if present; creates a new one if none exists.</p>
                <div className="mt-2 text-[10px] text-indigo-700 font-mono">1 Shared Transaction Context</div>
              </div>

              <div className="bg-indigo-50 border border-indigo-300 p-3.5 rounded-xl">
                <div className="font-bold text-indigo-950 mb-1">REQUIRES_NEW</div>
                <p className="text-indigo-900 text-[11px]">Suspends outer transaction and starts an independent new transaction (e.g. Audit Logs).</p>
                <div className="mt-2 text-[10px] text-indigo-700 font-mono">2 DB Connections Bound</div>
              </div>

              <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl">
                <div className="font-bold text-amber-950 mb-1">NESTED</div>
                <p className="text-amber-900 text-[11px]">Executes inside a nested transaction using JDBC Savepoints. Rolls back only the sub-operation on error.</p>
                <div className="mt-2 text-[10px] text-amber-800 font-mono">JDBC Savepoint rollback</div>
              </div>

              <div className="bg-rose-50 border border-rose-300 p-3.5 rounded-xl">
                <div className="font-bold text-rose-950 mb-1">MANDATORY / NEVER</div>
                <p className="text-rose-900 text-[11px]">MANDATORY throws exception if no transaction exists. NEVER throws exception if transaction is active.</p>
                <div className="mt-2 text-[10px] text-rose-800 font-mono">Enforces strict boundary</div>
              </div>

            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl text-xs space-y-2">
              <div className="text-amber-400 font-bold font-mono">Senior Rollback Rule:</div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                By default, Spring rolls back transactions <strong>ONLY for unchecked exceptions (<code>RuntimeException</code> &amp; <code>Error</code>)</strong>. Checked exceptions (<code>Exception</code>, <code>IOException</code>) will NOT trigger rollback unless explicitly configured:
              </p>
              <code className="text-emerald-400 font-mono text-[11px] block bg-slate-800 p-2 rounded">
                @Transactional(rollbackFor = Exception.class)
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Spring Security Filter Chain Flow */}
      <section id="spring-security" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Spring Security Filter Chain Flow</h2>
                  <p className="text-xs text-slate-500 mt-0.5">DelegatingFilterProxy &rarr; FilterChainProxy &rarr; SecurityFilterChain &rarr; AuthorizationFilter</p>
                </div>
              </div>
            </div>
            <span className="text-xs font-mono bg-sky-100 text-sky-900 px-3 py-1 rounded-full font-bold self-start md:self-auto">
              Servlet to Spring Bridge
            </span>
          </div>

          <div className="p-6">
            <div className="space-y-2 text-xs">
              {[
                { name: '1. DelegatingFilterProxy', desc: 'Standard Servlet Filter bridging Tomcat/Jetty into Spring ApplicationContext.' },
                { name: '2. FilterChainProxy', desc: 'Spring Bean managing multiple SecurityFilterChains based on request URL matching.' },
                { name: '3. SecurityContextHolderFilter', desc: 'Populates SecurityContext from HttpSession or establishes fresh SecurityContext.' },
                { name: '4. CorsFilter & CsrfFilter', desc: 'Validates Origin headers (CORS) and verifies X-XSRF-TOKEN for stateful POST/PUT requests.' },
                { name: '5. BearerTokenAuthenticationFilter', desc: 'Extracts Authorization: Bearer <JWT>, verifies signature via Nimbus, builds JwtAuthenticationToken.' },
                { name: '6. ExceptionTranslationFilter', desc: 'Catches AccessDeniedException (403 Forbidden) and AuthenticationException (401 Unauthorized).' },
                { name: '7. AuthorizationFilter', desc: 'Evaluates URL security rules (e.g. hasAuthority("SCOPE_write")) before delegating to DispatcherServlet.' }
              ].map((filter, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-slate-800 font-mono">{filter.name}</span>
                  <span className="text-slate-600 text-[11px] max-w-md text-right">{filter.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
