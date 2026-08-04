export interface DiagnosticTool {
  name: string;
  category: 'CLI' | 'IDE' | 'Profiler' | 'JVM Options';
  purpose: string;
  syntaxOrCommand: string;
  sampleOutput?: string;
  keyUseCases: string[];
  interviewerTips: string;
}

export const diagnosticTools: DiagnosticTool[] = [
  {
    name: 'jcmd (JVM Control Diagnostic Tool)',
    category: 'CLI',
    purpose: 'All-in-one CLI command to query JVM health, capture thread/heap dumps, trigger GC, and view Metaspace & Native Memory Tracking (NMT).',
    syntaxOrCommand: `# View all available commands for a JVM process
jcmd <PID> help

# 1. Capture Thread Dump
jcmd <PID> Thread.print > /tmp/thread_dump.txt

# 2. Capture Heap Dump (hprof)
jcmd <PID> GC.heap_dump /tmp/heap_dump.hprof

# 3. Inspect Metaspace and ClassLoader stats
jcmd <PID> VM.classloader_stats

# 4. View Native Memory Tracking (requires -XX:NativeMemoryTracking=summary)
jcmd <PID> VM.native_memory baseline
jcmd <PID> VM.native_memory detail.diff`,
    sampleOutput: `7182 com.enterprise.AppLauncher:
Native Memory Tracking:
Total: reserved=3482MB, committed=1240MB
- Java Heap (reserved=2048MB, committed=800MB)
- Class (reserved=1080MB, committed=120MB)
- Thread (reserved=120MB, committed=120MB, #120 threads)
- Code (reserved=240MB, committed=65MB)
- GC (reserved=160MB, committed=160MB)`,
    keyUseCases: [
      'Preferred modern replacement for deprecated jstack and jmap utilities.',
      'Tracking off-heap/native memory leaks (DirectByteBuffer, Netty buffers, JNI).',
      'Non-intrusive runtime diagnostics without attaching heavy agents.'
    ],
    interviewerTips: 'Senior candidates should mention jcmd over older jmap/jstack tools and understand how Native Memory Tracking (NMT) differentiates Java heap leaks from native memory leaks.'
  },
  {
    name: 'jstack & Thread Dump Analysis',
    category: 'CLI',
    purpose: 'Inspect thread states (RUNNABLE, BLOCKED, WAITING, TIMED_WAITING) and detect Java monitor deadlocks.',
    syntaxOrCommand: `jstack -l <PID> > thread_dump.txt

# Count thread states
grep "java.lang.Thread.State" thread_dump.txt | sort | uniq -c`,
    sampleOutput: `Found one Java-level deadlock:
=============================
"Thread-1":
  waiting to lock monitor 0x00007f (object 0x00000007, a com.service.ResourceB),
  which is held by "Thread-2"
"Thread-2":
  waiting to lock monitor 0x00008a (object 0x00000006, a com.service.ResourceA),
  which is held by "Thread-1"`,
    keyUseCases: [
      'Diagnosing CPU spikes (find highest CPU LWP thread id using "top -H -p <pid>", convert to hex, match "nid=0x..." in jstack).',
      'Pinpointing lock contention and deadlocks.',
      'Identifying thread pool exhaustion (e.g. 200 Tomcat threads stuck on HikariCP borrow).'
    ],
    interviewerTips: 'Test if the candidate knows how to map a Linux high-CPU thread ID (LWP from top -H) in decimal to the hexadecimal "nid" in jstack.'
  },
  {
    name: 'JVM Garbage Collection Tuning Flags (Java 17/21)',
    category: 'JVM Options',
    purpose: 'Standard production JVM flags for throughput, low pause times, and unified GC logging.',
    syntaxOrCommand: `# Modern G1GC Enterprise Configuration (Java 17+)
java -Xms4g -Xmx4g \\
  -XX:+UseG1GC \\
  -XX:MaxGCPauseMillis=200 \\
  -XX:InitiatingHeapOccupancyPercent=45 \\
  -XX:G1ReservePercent=15 \\
  -XX:+HeapDumpOnOutOfMemoryError \\
  -XX:HeapDumpPath=/var/log/dumps/oom.hprof \\
  -Xlog:gc*,gc+phases=debug:file=/var/log/app/gc.log:time,uptime,pid:filecount=5,filesize=100M \\
  -jar app.jar`,
    sampleOutput: `[2026-08-04T12:00:01.123+0000][0.450s][info][gc,start    ] GC(0) Pause Young (Normal) (G1 Evacuation Pause)
[2026-08-04T12:00:01.145+0000][0.472s][info][gc          ] GC(0) Pause Young (Normal) 24M->8M(256M) 22.451ms
[2026-08-04T12:00:01.145+0000][0.472s][info][gc,cpu      ] GC(0) User=0.08s Sys=0.01s Real=0.02s`,
    keyUseCases: [
      'G1GC pause-time goal tuning (-XX:MaxGCPauseMillis).',
      'Capturing automatic heap dump on JVM crash (-XX:+HeapDumpOnOutOfMemoryError).',
      'Unified JVM Logging syntax (-Xlog:gc* replacing deprecated -XX:+PrintGCDetails).'
    ],
    interviewerTips: 'Senior candidates should know -Xlog syntax (introduced in Java 9 unified logging) and why setting -Xms equal to -Xmx prevents heap resizing overhead during steady state.'
  },
  {
    name: 'IntelliJ IDEA vs Eclipse Developer Productivity',
    category: 'IDE',
    purpose: 'Key architecture differences, compiler models, and advanced debugging workflows.',
    syntaxOrCommand: `// IntelliJ IDEA Power Shortcuts:
// Search Everywhere: Double Shift
// Find Usages: Alt + F7 / Option + F7
// Conditional Breakpoint: Right-click breakpoint -> enter boolean expression
// Evaluate Expression: Alt + F8 / Option + F8
// Stream Debugger: Trace Java Streams step-by-step
// Structural Search & Replace (SSR): Find AST patterns across repo

// Eclipse Key Distinctions:
// ECJ (Eclipse Compiler for Java): Compiles incrementally on save and runs code with compile errors in unrelated methods.
// JDT (Java Development Tools) workspace model.`,
    keyUseCases: [
      'Stream Trace debugging in IntelliJ.',
      'Remote debugging JVM via JDWP agent: -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005',
      'Memory and thread profilers built into IntelliJ Ultimate (Async-profiler integration).'
    ],
    interviewerTips: 'Ask candidate about their debugging methodology: how do they debug a remote production issue (JDWP agent, conditional breakpoints, stream tracing, async profiler).'
  }
];
