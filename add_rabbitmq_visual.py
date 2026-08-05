import re

with open('src/components/VisualsView.tsx', 'r') as f:
    content = f.read()

new_section = """
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
                       <div className="text-[9px] text-blue-600 mt-1">Sends ACK -> Msg Deleted</div>
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
"""

content = content.replace("{/* Kafka Architecture */}", new_section + "\n        {/* Kafka Architecture */}")

with open('src/components/VisualsView.tsx', 'w') as f:
    f.write(content)

