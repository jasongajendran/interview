import re

with open('src/components/VisualsView.tsx', 'r') as f:
    content = f.read()

new_section = """
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
"""

content = content.replace("      </div>\n    </div>\n  );\n}", new_section + "\n      </div>\n    </div>\n  );\n}")

with open('src/components/VisualsView.tsx', 'w') as f:
    f.write(content)

