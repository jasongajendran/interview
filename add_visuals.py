import re

with open('src/components/VisualsView.tsx', 'r') as f:
    content = f.read()

new_sections = """
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
"""

content = content.replace("      </div>\n    </div>\n  );\n}", new_sections + "\n      </div>\n    </div>\n  );\n}")

with open('src/components/VisualsView.tsx', 'w') as f:
    f.write(content)

