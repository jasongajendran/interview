import { QuestionItem } from '../types';

export const javaCoreQuestions: QuestionItem[] = [
  {
    id: 'java-01',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Collections & Immutability',
    title: 'List.of() vs Arrays.asList() vs Collections.unmodifiableList()',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Differences in mutability, null tolerance, underlying array reference backing, and memory footprint between modern Java 9+ List.of() and legacy factory methods.',
    coreConcepts: [
      'Arrays.asList() returns a mutable view backed by the original array (supports set(), forbids add()/remove())',
      'List.of() returns a truly immutable list implementation (disallows nulls, throws UnsupportedOperationException on set()/add()/remove())',
      'Arrays.asList() mutations write through to the underlying backing array; List.of() has no backing array reference leak'
    ],
    detailedExplanation: [
      'Arrays.asList() creates an instance of java.util.Arrays$ArrayList, which is a fixed-size wrapper around the passed array. Mutating an element via list.set(index, val) modifies the original array.',
      'List.of() (introduced in Java 9) returns specialized compact immutable types (e.g., List12, ListN) that do not allow null elements and prevent any structural or elemental mutation.',
      'Collections.unmodifiableList(originalList) is merely an unmodifiable wrapper view; if the original underlying list is modified elsewhere, the view will reflect those changes.'
    ],
    codeExamples: [
      {
        title: 'Comparison of Mutability and Null Rejection',
        language: 'java',
        code: `import java.util.*;

public class ListComparisonDemo {
    public static void main(String[] args) {
        // 1. Arrays.asList() - Fixed size, mutable elements, backed by array
        String[] arr = {"Alpha", "Beta"};
        List<String> asList = Arrays.asList(arr);
        asList.set(0, "Omega"); // Modifies underlying array!
        System.out.println("asList: " + asList);
        System.out.println("Original array: " + Arrays.toString(arr));

        // 2. List.of() - Truly immutable, rejects nulls
        List<String> listOf = List.of("Alpha", "Beta");
        try {
            listOf.set(0, "Omega");
        } catch (UnsupportedOperationException e) {
            System.out.println("List.of() set() failed: " + e.getClass().getSimpleName());
        }

        // 3. Null handling differences
        List<String> asListWithNull = Arrays.asList("Alpha", null);
        System.out.println("asList with null: " + asListWithNull);

        try {
            List<String> listWithNull = List.of("Alpha", null);
        } catch (NullPointerException e) {
            System.out.println("List.of() rejected null: " + e.getClass().getSimpleName());
        }
    }
}`,
        output: `asList: [Omega, Beta]
Original array: [Omega, Beta]
List.of() set() failed: UnsupportedOperationException
asList with null: [Alpha, null]
List.of() rejected null: NullPointerException`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that Arrays.asList() returns a fixed-size list backed by the array where set() is allowed and affects the original array.',
        'Mentions that List.of() returns a truly immutable collection (Java 9+) and strictly disallows nulls (throws NPE on creation).',
        'Distinguishes Collections.unmodifiableList(list) as a wrapper view that can still be mutated if someone holds a reference to the source list.'
      ],
      juniorOrMidRedFlags: [
        'Claims Arrays.asList() is completely immutable.',
        'Does not know that List.of() throws NullPointerException when given null.',
        'Unaware of the array backing reference mutation in Arrays.asList().'
      ],
      seniorDifferentiators: [
        'Mentions memory optimization in List.of() (e.g. List12 stores elements directly as fields to avoid array overhead).',
        'Explains defensive copying when constructing immutable collections from untrusted callers.'
      ],
      followUpQuestions: [
        'How does List.copyOf(collection) behave if passed an already immutable List.of() collection?',
        'Why does List.of() randomize iteration order or disallow null elements by design?'
      ]
    },
    tags: ['Java 9', 'Collections', 'Immutability', 'Null Safety']
  },
  {
    id: 'java-02',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Multithreading & Concurrency',
    title: 'HashMap vs ConcurrentHashMap Internals (Java 8+)',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Deep dive into bucket storage, treeification (Red-Black Trees), CAS operations, synchronized bin-locking in Java 8+, resizing mechanisms, and null semantics.',
    coreConcepts: [
      'HashMap is not thread-safe; concurrent put operations can trigger race conditions, corrupted tree structures, or lost updates.',
      'ConcurrentHashMap in Java 8 replaced legacy Segment locks with CAS (Compare-And-Swap) for empty buckets and synchronized locks on individual bucket head nodes.',
      'Treeification: Both HashMap and ConcurrentHashMap convert collision LinkedLists to Red-Black Trees when bucket count >= 8 (TREEIFY_THRESHOLD) and table capacity >= 64 (MIN_TREEIFY_CAPACITY).'
    ],
    detailedExplanation: [
      'In Java 7, ConcurrentHashMap used a fixed array of Segment objects (ReentrantLocks). In Java 8+, it uses a Node<K,V>[] table. If a bucket is empty, it inserts the node lock-free using Unsafe.compareAndSwapObject(). If the bucket is occupied, it synchronizes ONLY on the first node of that bucket.',
      'HashMap permits one null key (stored at index 0) and multiple null values. ConcurrentHashMap strictly forbids null keys and values to prevent ambiguity in concurrent containsKey() checks (distinguishing missing key vs key mapped to null).',
      'ConcurrentHashMap size() uses a LongAdder-like CounterCell striped counter pattern to avoid cache-line bouncing and lock contention across CPU cores.'
    ],
    codeExamples: [
      {
        title: 'ConcurrentHashMap Atomic Compute & Striped Counters',
        language: 'java',
        code: `import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class ConcurrentMapDeepDive {
    public static void main(String[] args) throws InterruptedException {
        ConcurrentHashMap<String, AtomicInteger> wordFrequencies = new ConcurrentHashMap<>();
        
        ExecutorService executor = Executors.newFixedThreadPool(8);
        for (int i = 0; i < 1000; i++) {
            executor.submit(() -> {
                // Thread-safe atomic counter initialization and increment
                wordFrequencies.computeIfAbsent("architect", key -> new AtomicInteger(0))
                               .incrementAndGet();
            });
        }
        
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
        
        System.out.println("Final count for 'architect': " + wordFrequencies.get("architect").get());
        System.out.println("ConcurrentHashMap size: " + wordFrequencies.size());
        
        // Null rejection test
        try {
            wordFrequencies.put(null, new AtomicInteger(1));
        } catch (NullPointerException e) {
            System.out.println("ConcurrentHashMap rejected null key: " + e.getClass().getSimpleName());
        }
    }
}`,
        output: `Final count for 'architect': 1000
ConcurrentHashMap size: 1
ConcurrentHashMap rejected null key: NullPointerException`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Details the Java 8 evolution from Segment array to Node[] with CAS on empty bin and synchronized on head node.',
        'Explains why null keys/values are rejected in ConcurrentHashMap (ambiguity in multi-threaded get/containsKey).',
        'Explains treeification threshold (8) and min capacity (64) to protect against hash collision attacks.',
        'Explains how size() is calculated without a global lock using CounterCells.'
      ],
      juniorOrMidRedFlags: [
        'Believes ConcurrentHashMap synchronizes the whole map or still uses Java 7 Segment locks.',
        'Does not know why null keys/values are banned.',
        'Cannot explain what happens during hash collision.'
      ],
      seniorDifferentiators: [
        'Explains ConcurrentHashMap multi-threaded table resizing (transfer helper threads using ForwardingNode with hash = -1).',
        'Demonstrates proper usage of compute(), computeIfAbsent(), and merge() instead of separate get() and put() calls.'
      ],
      followUpQuestions: [
        'What is a ForwardingNode in ConcurrentHashMap and how do other threads participate in resizing?',
        'How does get() achieve lock-free reading in ConcurrentHashMap?'
      ]
    },
    tags: ['Concurrency', 'ConcurrentHashMap', 'Java Internals', 'Lock-Free']
  },
  {
    id: 'java-03',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Stream API & ForkJoinPool',
    title: 'Stream vs Parallel Stream & ForkJoinPool Internals',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'When to use parallel streams, shared ForkJoinPool.commonPool() thread starvation risks, custom ForkJoinPool isolation, and benchmark trade-offs.',
    coreConcepts: [
      'Parallel streams partition the source Spliterator across threads in ForkJoinPool.commonPool() using a work-stealing algorithm.',
      'Blocking operations (DB queries, HTTP calls, Thread.sleep) inside default parallel streams starve the entire JVM commonPool.',
      'Small datasets, un-splittable sources (e.g. LinkedList or iterate()), or boxing overhead often make parallel streams slower than sequential streams.'
    ],
    detailedExplanation: [
      'By default, parallel streams execute on ForkJoinPool.commonPool(), whose parallelism level defaults to Runtime.getRuntime().availableProcessors() - 1.',
      'If one worker thread blocks on I/O, other CPU-bound tasks or parallel streams in the same JVM process get delayed due to thread exhaustion.',
      'To isolate heavy workloads, you can submit the stream task to a dedicated custom ForkJoinPool instance using customPool.submit(() -> stream.parallel()...).'
    ],
    codeExamples: [
      {
        title: 'Running Parallel Stream in a Custom Isolated ForkJoinPool',
        language: 'java',
        code: `import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

public class ParallelStreamArchitecture {
    public static void main(String[] args) throws Exception {
        List<Integer> dataset = IntStream.rangeClosed(1, 10).boxed().collect(Collectors.toList());

        // 1. Default commonPool execution
        System.out.println("--- Common Pool Execution ---");
        dataset.parallelStream().forEach(n -> {
            System.out.println("Number: " + n + " | Thread: " + Thread.currentThread().getName());
        });

        // 2. Custom isolated ForkJoinPool to protect common pool from starvation
        System.out.println("\\n--- Custom ForkJoinPool (Parallelism 3) ---");
        ForkJoinPool customPool = new ForkJoinPool(3);
        try {
            customPool.submit(() -> {
                dataset.parallelStream().forEach(n -> {
                    System.out.println("Isolated Task: " + n + " | Thread: " + Thread.currentThread().getName());
                });
            }).get();
        } finally {
            customPool.shutdown();
        }
    }
}`,
        output: `--- Common Pool Execution ---
Number: 7 | Thread: main
Number: 2 | Thread: ForkJoinPool.commonPool-worker-1
Number: 9 | Thread: ForkJoinPool.commonPool-worker-2
...
--- Custom ForkJoinPool (Parallelism 3) ---
Isolated Task: 6 | Thread: ForkJoinPool-1-worker-1
Isolated Task: 8 | Thread: ForkJoinPool-1-worker-2
Isolated Task: 2 | Thread: ForkJoinPool-1-worker-3`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Warns that parallel streams use the shared ForkJoinPool.commonPool() and must NEVER be used for blocking I/O.',
        'Explains how work-stealing works in ForkJoinPool (deques with LIFO for owner thread and FIFO stealing by idle threads).',
        'Knows which data structures split efficiently (ArrayList, Array with index arithmetic) vs poorly (LinkedList, Stream.iterate()).'
      ],
      juniorOrMidRedFlags: [
        'Believes parallel streams always make everything faster.',
        'Uses parallel streams for database calls or REST clients.',
        'Unaware that commonPool is shared across the entire application runtime.'
      ],
      seniorDifferentiators: [
        'Can calculate N*Q rule (N = element count, Q = cost per element; parallel is beneficial only when N*Q > 10,000).',
        'Mentions stateful operations (sorted, distinct, limit) creating intermediate synchronization barriers in parallel streams.'
      ],
      followUpQuestions: [
        'How does Spliterator.characteristics() (e.g. SIZED, SUBSIZED, ORDERED) affect parallel stream splitting?',
        'How do Java 21 Virtual Threads change the need for parallel streams versus structured concurrency?'
      ]
    },
    tags: ['Parallel Streams', 'ForkJoinPool', 'Work Stealing', 'Performance']
  },
  {
    id: 'java-04',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Stream API',
    title: 'findFirst() vs findAny() in Sequential and Parallel Streams',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Encounter order guarantees, non-deterministic performance optimizations in parallel processing, and short-circuiting semantics.',
    coreConcepts: [
      'findFirst() strictly honors the encounter order of the stream pipeline.',
      'findAny() is free to select any matching element, offering significant performance gains in parallel streams.',
      'Both return Optional<T> and act as short-circuiting terminal operations.'
    ],
    detailedExplanation: [
      'In a sequential stream, findFirst() and findAny() will almost always return the identical first matching element.',
      'In a parallel stream, findFirst() forces the engine to coordinate threads and wait for the earliest partition in encounter order, whereas findAny() returns immediately as soon as any worker thread finds a match.'
    ],
    codeExamples: [
      {
        title: 'findFirst vs findAny in Parallel Streams',
        language: 'java',
        code: `import java.util.*;
import java.util.stream.IntStream;

public class FindComparison {
    public static void main(String[] args) {
        List<String> items = Arrays.asList("apple", "banana", "cherry", "date", "elderberry");

        // Sequential: Both return first match
        String firstSeq = items.stream().filter(s -> s.length() > 4).findFirst().orElse("none");
        String anySeq = items.stream().filter(s -> s.length() > 4).findAny().orElse("none");
        System.out.println("Sequential findFirst: " + firstSeq);
        System.out.println("Sequential findAny:   " + anySeq);

        // Parallel: findAny returns non-deterministic first available thread result
        System.out.println("\\n--- Parallel findAny over 10 runs ---");
        for (int i = 0; i < 5; i++) {
            String anyPar = items.parallelStream()
                                 .filter(s -> s.length() > 4)
                                 .findAny()
                                 .orElse("none");
            System.out.println("Run " + (i + 1) + ": " + anyPar);
        }
    }
}`,
        output: `Sequential findFirst: apple
Sequential findAny:   apple

--- Parallel findAny over 10 runs ---
Run 1: cherry
Run 2: apple
Run 3: elderberry
Run 4: banana
Run 5: cherry`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'States that findFirst() guarantees encounter order while findAny() does not.',
        'Explains why findAny() has much lower synchronization cost in parallel streams.',
        'Mentions both are short-circuiting terminal operations returning Optional<T>.'
      ],
      juniorOrMidRedFlags: [
        'Believes findAny() returns a random item randomly picked by Math.random().',
        'Does not know why findFirst() is slower in parallel pipelines.'
      ],
      seniorDifferentiators: [
        'Explains interaction with unordered streams (stream().unordered().findAny()).'
      ],
      followUpQuestions: [
        'What happens when findFirst() is executed on an unordered collection like HashSet?'
      ]
    },
    tags: ['Streams', 'findFirst', 'findAny', 'Short-Circuiting']
  },
  {
    id: 'java-05',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Stream API',
    title: 'Stream peek() Method: Proper Debugging vs Anti-Pattern Mutation',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Why peek() exists solely for non-intrusive debug logging and why mutating state inside peek() violates functional stream principles.',
    coreConcepts: [
      'peek() is an intermediate operation designed strictly to support debugging by observing stream elements as they flow past.',
      'Java compiler and Stream optimizations (e.g. count() optimization in Java 9+) may elide peek() operations entirely if the terminal operation does not evaluate pipeline elements.',
      'Mutating external shared state inside peek() introduces concurrency bugs and side-effect anti-patterns.'
    ],
    detailedExplanation: [
      'The JavaDoc explicitly states: "This method exists mainly to support debugging, where you want to see the elements as they pass a certain point in a pipeline".',
      'In Java 9+, Stream.of("a", "b", "c").peek(System.out::println).count() does not print anything because the count() implementation inspects the sized Spliterator directly without traversing elements.'
    ],
    codeExamples: [
      {
        title: 'Stream peek() Optimization and Logging',
        language: 'java',
        code: `import java.util.*;
import java.util.stream.*;

public class PeekDemo {
    public static void main(String[] args) {
        System.out.println("--- Normal Pipeline with peek ---");
        List<String> result = Stream.of("one", "two", "three", "four")
            .filter(e -> e.length() > 3)
            .peek(e -> System.out.println("Filtered value: " + e))
            .map(String::toUpperCase)
            .peek(e -> System.out.println("Mapped value: " + e))
            .collect(Collectors.toList());
        System.out.println("Collected: " + result);

        System.out.println("\\n--- Java 9+ count() elision test ---");
        long count = Stream.of("a", "b", "c")
            .peek(e -> System.out.println("Peeking at: " + e))
            .count(); // Elements never processed because stream is SIZED!
        System.out.println("Count result: " + count);
    }
}`,
        output: `--- Normal Pipeline with peek ---
Filtered value: three
Mapped value: THREE
Filtered value: four
Mapped value: FOUR
Collected: [THREE, FOUR]

--- Java 9+ count() elision test ---
Count result: 3`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'States that peek() is intended solely for action-less debug logging.',
        'Explains that peek() might not be called if stream optimization can determine the result without evaluation (e.g. count() on SIZED stream).',
        'Strongly condemns mutating object state inside peek().'
      ],
      juniorOrMidRedFlags: [
        'Uses peek() as a replacement for map() or forEach() to perform business logic or updates.'
      ],
      seniorDifferentiators: [
        'Knows about Java 9+ stream execution optimizations that skip pipeline stages.'
      ],
      followUpQuestions: [
        'How does lazy evaluation in streams affect when peek() executes?'
      ]
    },
    tags: ['Streams', 'peek', 'Debugging', 'Anti-Patterns']
  },
  {
    id: 'java-06',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Functional Programming & Optional',
    title: 'Optional Pitfalls, Anti-Patterns & orElse() vs orElseGet()',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Eager vs lazy fallback evaluation, avoiding get() without verification, Optional serialization issues, and method parameter anti-patterns.',
    coreConcepts: [
      'orElse(value) evaluates the fallback argument eagerly every time, even if the Optional already contains a value.',
      'orElseGet(Supplier) evaluates lazily only when the Optional is empty.',
      'Optional is not Serializable and was designed primarily as a return type to avoid null, never as method parameters, bean fields, or collection values.'
    ],
    detailedExplanation: [
      'Passing an expensive computation or DB call to orElse(expensiveCall()) executes the call on every request regardless of presence. orElseGet(() -> expensiveCall()) executes only if empty.',
      'Calling optional.get() without isPresent() is functionally equivalent to raw null dereferencing and throws NoSuchElementException.',
      'Using Optional<T> as a method argument forces callers to wrap values unnecessarily (e.g. method(Optional.of(val))) and leads to code clutter.'
    ],
    codeExamples: [
      {
        title: 'orElse vs orElseGet Execution Proof',
        language: 'java',
        code: `import java.util.Optional;

public class OptionalPerformanceDemo {
    public static String computeFallback() {
        System.out.println(">> [EXPENSIVE DB/API CALL] computeFallback() EXECUTED!");
        return "Default Config";
    }

    public static void main(String[] args) {
        Optional<String> presentOptional = Optional.of("Custom Cached Config");

        System.out.println("1. Testing orElse():");
        String res1 = presentOptional.orElse(computeFallback()); // Eager!
        System.out.println("Result: " + res1);

        System.out.println("\\n2. Testing orElseGet():");
        String res2 = presentOptional.orElseGet(() -> computeFallback()); // Lazy!
        System.out.println("Result: " + res2);

        System.out.println("\\n3. Testing empty Optional with orElseGet():");
        Optional<String> emptyOptional = Optional.empty();
        String res3 = emptyOptional.orElseGet(() -> computeFallback());
        System.out.println("Result: " + res3);
    }
}`,
        output: `1. Testing orElse():
>> [EXPENSIVE DB/API CALL] computeFallback() EXECUTED!
Result: Custom Cached Config

2. Testing orElseGet():
Result: Custom Cached Config

3. Testing empty Optional with orElseGet():
>> [EXPENSIVE DB/API CALL] computeFallback() EXECUTED!
Result: Default Config`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates eager parameter evaluation of orElse() vs lazy supplier evaluation in orElseGet().',
        'Lists key Optional anti-patterns: optional.get() without check, Optional as field/parameter, Optional<List<T>>.',
        'Explains orElseThrow() usage in Spring Boot service layers.'
      ],
      juniorOrMidRedFlags: [
        'Uses orElse() for expensive database or remote service calls.',
        'Declares class fields as Optional<String> in JPA entities.'
      ],
      seniorDifferentiators: [
        'Mentions why Optional does not implement Serializable (breaks Jackson/Hibernate serialization if used as entity field).'
      ],
      followUpQuestions: [
        'How do you handle Optional in Jackson serialization/deserialization for REST APIs?'
      ]
    },
    tags: ['Optional', 'Functional Programming', 'Performance', 'Best Practices']
  },
  {
    id: 'java-07',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Data Structures & Hashing',
    title: 'HashSet Internals & Collision Resolution Mechanics',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'How HashSet delegates to HashMap with PRESENT dummy object, hash code distribution, bucket indexing, and equals/hashCode contract enforcement.',
    coreConcepts: [
      'HashSet is internally backed by a private transient HashMap<E, Object>.',
      'The element is stored as the Key, and a shared dummy object private static final Object PRESENT = new Object() is stored as the Value.',
      'Hash collisions are placed in the same bucket via LinkedList, transforming to a Red-Black Tree when chain length >= 8.'
    ],
    detailedExplanation: [
      'When set.add(e) is called, it returns map.put(e, PRESENT) == null. If the key already existed, put() returns the previous value (PRESENT) so add() returns false.',
      'Bucket index is computed as (n - 1) & hash(key), where n is power-of-two table capacity and hash() applies a 16-bit XOR spread function (h ^ (h >>> 16)) to reduce collisions.'
    ],
    codeExamples: [
      {
        title: 'Proving HashSet Backing and Broken HashCode Behavior',
        language: 'java',
        code: `import java.util.*;

class UserAccount {
    private final int id;
    private final String username;

    public UserAccount(int id, String username) {
        this.id = id;
        this.username = username;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserAccount)) return false;
        UserAccount that = (UserAccount) o;
        return id == that.id && Objects.equals(username, that.username);
    }

    // BROKEN: Forgetting to override hashCode() causes duplicates in HashSet!
    @Override
    public int hashCode() {
        return Objects.hash(id, username); // Proper implementation
    }

    @Override
    public String toString() {
        return "UserAccount(" + id + ", '" + username + "')";
    }
}

public class HashSetInternalsDemo {
    public static void main(String[] args) {
        Set<UserAccount> accounts = new HashSet<>();
        UserAccount u1 = new UserAccount(101, "alex");
        UserAccount u2 = new UserAccount(101, "alex");

        accounts.add(u1);
        boolean addedDuplicate = accounts.add(u2);

        System.out.println("u1.equals(u2): " + u1.equals(u2));
        System.out.println("Was duplicate added: " + addedDuplicate);
        System.out.println("HashSet size: " + accounts.size());
        System.out.println("HashSet contents: " + accounts);
    }
}`,
        output: `u1.equals(u2): true
Was duplicate added: false
HashSet size: 1
HashSet contents: [UserAccount(101, 'alex')]`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that HashSet is a wrapper around HashMap with a constant dummy Object PRESENT.',
        'Explains bucket index calculation ((capacity - 1) & hash) and hash XOR bit-shifting.',
        'Explains what happens when equals() is overridden without hashCode() (leads to duplicate entries across different buckets).'
      ],
      juniorOrMidRedFlags: [
        'Believes HashSet uses a custom separate array or binary search tree independently of HashMap.',
        'Cannot explain why violating hashCode() contract breaks HashSet.contains().'
      ],
      seniorDifferentiators: [
        'Explains Java 8 treeification threshold (8) and un-treeification threshold (6) during bucket shrink.'
      ],
      followUpQuestions: [
        'What is the difference between HashSet, LinkedHashSet (insertion-order doubly linked list), and TreeSet (NavigableSet via TreeMap)?'
      ]
    },
    tags: ['HashSet', 'HashMap', 'Hashing', 'Data Structures']
  },
  {
    id: 'java-08',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Object Oriented & Memory',
    title: 'equals() vs == & The HashCode Contract',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Reference identity vs semantic value equality, String pool caching, and mathematical rules of the hashCode-equals contract.',
    coreConcepts: [
      '== compares memory addresses (reference identity) for objects, and primitive bit values for primitives.',
      'equals() evaluates logical semantic equality as defined by the class implementation.',
      'Contract: If o1.equals(o2) is true, o1.hashCode() MUST equal o2.hashCode(). If hashCodes are equal, objects are NOT required to be equal (collision).'
    ],
    detailedExplanation: [
      'String literals are interned in the JVM String Constant Pool in the native Heap. new String("val") forces heap allocation bypassing the pool unless intern() is called.',
      'If two equal objects return different hash codes, hash-based collections (HashMap, HashSet) will place them into different buckets, causing get() and contains() lookups to fail silently.'
    ],
    codeExamples: [
      {
        title: 'String Pool Reference Equality vs Value Equality',
        language: 'java',
        code: `public class EqualityDemo {
    public static void main(String[] args) {
        String s1 = "Java";
        String s2 = "Java";
        String s3 = new String("Java");
        String s4 = s3.intern(); // Fetch from String Constant Pool

        System.out.println("s1 == s2: " + (s1 == s2));         // true (same pooled reference)
        System.out.println("s1 == s3: " + (s1 == s3));         // false (s3 is on heap)
        System.out.println("s1.equals(s3): " + s1.equals(s3)); // true (same character content)
        System.out.println("s1 == s4: " + (s1 == s4));         // true (interned reference)

        // Integer caching between -128 and 127
        Integer a = 127;
        Integer b = 127;
        Integer c = 128;
        Integer d = 128;
        System.out.println("127 == 127 (Cached): " + (a == b)); // true
        System.out.println("128 == 128 (Heap):   " + (c == d)); // false
    }
}`,
        output: `s1 == s2: true
s1 == s3: false
s1.equals(s3): true
s1 == s4: true
127 == 127 (Cached): true
128 == 128 (Heap):   false`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates identity comparison (==) from semantic equality (equals()).',
        'States the 3 rules of equals/hashCode contract: Reflexive, Symmetric, Transitive, Consistent.',
        'Mentions IntegerCache (-128 to 127) and String Pool mechanics.'
      ],
      juniorOrMidRedFlags: [
        'Believes == checks values for wrapper classes like Integer.',
        'Does not know why hashCode() must be overridden when equals() is overridden.'
      ],
      seniorDifferentiators: [
        'Explains potential performance implications of generating hashCode (caching hash in immutable classes like String).'
      ],
      followUpQuestions: [
        'How should equals() be written to properly handle inheritance and instanceof vs getClass() checks?'
      ]
    },
    tags: ['Core Java', 'equals', 'hashCode', 'String Pool', 'Memory']
  },
  {
    id: 'java-09',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Sorting & Interfaces',
    title: 'Comparable vs Comparator & Multi-Field Fluent Sorting in Java 8+',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Natural sorting with Comparable<T> vs external flexible sorting with Comparator<T>, lambda comparator chaining, and null-safe sorting.',
    coreConcepts: [
      'Comparable<T> defines natural ordering via int compareTo(T o) inside the domain class itself.',
      'Comparator<T> defines multiple custom external ordering strategies via int compare(T o1, T o2).',
      'Java 8 added fluent combinators: Comparator.comparing(), thenComparing(), reversed(), nullsFirst(), and nullsLast().'
    ],
    detailedExplanation: [
      'Use Comparable when an entity has a single intuitive default ordering (e.g. Date, String, ID).',
      'Use Comparator when you need multiple dynamic sorting dimensions (e.g. sort by department ASC, then salary DESC, then lastName ASC with nulls last).'
    ],
    codeExamples: [
      {
        title: 'Modern Java 8+ Comparator Chaining',
        language: 'java',
        code: `import java.util.*;

class Employee {
    String dept;
    String name;
    Double salary;

    public Employee(String dept, String name, Double salary) {
        this.dept = dept;
        this.name = name;
        this.salary = salary;
    }

    public String getDept() { return dept; }
    public String getName() { return name; }
    public Double getSalary() { return salary; }

    @Override
    public String toString() {
        return String.format("[%s | %s | $%.0f]", dept, name, salary);
    }
}

public class ComparatorDemo {
    public static void main(String[] args) {
        List<Employee> staff = Arrays.asList(
            new Employee("Engineering", "Bob", 120000.0),
            new Employee("Engineering", "Alice", 140000.0),
            new Employee("Engineering", "Charlie", 120000.0),
            new Employee("Finance", "Dana", 110000.0)
        );

        // Sort by Department ASC -> Salary DESC -> Name ASC
        Comparator<Employee> multiSorter = Comparator
            .comparing(Employee::getDept)
            .thenComparing(Comparator.comparing(Employee::getSalary).reversed())
            .thenComparing(Employee::getName);

        staff.sort(multiSorter);
        staff.forEach(System.out::println);
    }
}`,
        output: `[Engineering | Alice | $140000]
[Engineering | Bob | $120000]
[Engineering | Charlie | $120000]
[Finance | Dana | $110000]`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Contrasts internal natural ordering (Comparable.compareTo) with external strategy sorting (Comparator.compare).',
        'Demonstrates Java 8 fluent chaining with Comparator.comparing().thenComparing().reversed().',
        'Knows how to handle null values using Comparator.nullsFirst() or nullsLast().'
      ],
      juniorOrMidRedFlags: [
        'Writes manual nested ternary operators or subtraction (a.val - b.val which overflows with int/double).'
      ],
      seniorDifferentiators: [
        'Warns against integer subtraction (o1.id - o2.id) due to integer overflow bugs; advocates Integer.compare(o1.id, o2.id).'
      ],
      followUpQuestions: [
        'Why does `(a, b) -> a.getId() - b.getId()` fail for Integer.MIN_VALUE?'
      ]
    },
    tags: ['Comparable', 'Comparator', 'Java 8', 'Sorting']
  },
  {
    id: 'java-10',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Strings & Memory Optimization',
    title: 'String vs StringBuilder vs StringBuffer & Compact Strings (Java 9+)',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Immutability trade-offs, synchronized method overhead in StringBuffer, thread-safety, and Java 9 Compact Strings byte[] memory compression.',
    coreConcepts: [
      'String is immutable and thread-safe; every modification creates a new String object.',
      'StringBuilder is mutable and unsynchronized, designed for fast single-threaded string concatenation.',
      'StringBuffer is mutable and synchronized, safe for multi-threaded string building but carries lock overhead.',
      'Java 9 Compact Strings replaced char[] (2 bytes per char) with byte[] + coder byte (LATIN1 = 1 byte, UTF16 = 2 bytes) reducing String heap consumption by ~45%.'
    ],
    detailedExplanation: [
      'In single-threaded execution, StringBuilder is orders of magnitude faster than String concatenation in loops because it appends to an internal expandable buffer.',
      'Modern Java compilers optimize simple String a + b + c concatenations using invokedynamic and StringConcatFactory (Java 9+) rather than naive chained StringBuilder instances.'
    ],
    codeExamples: [
      {
        title: 'Benchmark Comparison: String Concatenation vs StringBuilder',
        language: 'java',
        code: `public class StringPerfBenchmark {
    public static void main(String[] args) {
        int iterations = 20_000;

        // 1. Inefficient String concatenation
        long start = System.currentTimeMillis();
        String str = "";
        for (int i = 0; i < iterations; i++) {
            str += "x";
        }
        long durationString = System.currentTimeMillis() - start;

        // 2. Efficient StringBuilder
        start = System.currentTimeMillis();
        StringBuilder sb = new StringBuilder(iterations);
        for (int i = 0; i < iterations; i++) {
            sb.append("x");
        }
        String result = sb.toString();
        long durationSb = System.currentTimeMillis() - start;

        System.out.println("String loop (+) took: " + durationString + " ms (Created 20K heap objects)");
        System.out.println("StringBuilder took:   " + durationSb + " ms (Reused single buffer)");
    }
}`,
        output: `String loop (+) took: 312 ms (Created 20K heap objects)
StringBuilder took:   1 ms (Reused single buffer)`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates String (immutable), StringBuilder (mutable, unsynchronized), and StringBuffer (mutable, synchronized).',
        'Explains why loop concatenation with += is an anti-pattern (creates O(N^2) allocations).',
        'Mentions Java 9 Compact Strings (byte[] + coder byte) for heap footprint reduction.'
      ],
      juniorOrMidRedFlags: [
        'Recommends StringBuffer for single-threaded string building.',
        'Unaware of String immutability.'
      ],
      seniorDifferentiators: [
        'Explains invokedynamic StringConcatFactory in Java 9+.'
      ],
      followUpQuestions: [
        'What is the default initial capacity of StringBuilder (16 chars) and how does it resize?'
      ]
    },
    tags: ['String', 'StringBuilder', 'StringBuffer', 'Memory']
  },
  {
    id: 'java-11',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Object Oriented & Design Patterns',
    title: 'Designing Truly Immutable Objects & Java 14+ Records',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Hard',
    summary: 'Guidelines for creating thread-safe immutable classes, deep defensive copying, reference leak prevention, and modern record classes.',
    coreConcepts: [
      'Class must be marked final (prevent subclassing).',
      'All fields must be private and final.',
      'No setters or state-modifying mutator methods.',
      'Defensive copying in constructors for all mutable parameters (Date, List, Map, arrays).',
      'Defensive copying or unmodifiable wrapper in all getter accessors.',
      'Java 14+ Records provide canonical immutable data carriers with automatic final fields, constructor, equals, hashCode, and toString.'
    ],
    detailedExplanation: [
      'Simply marking a List field final does NOT make the object immutable because callers can still invoke list.add() or list.clear().',
      'Defensive copying must be done before validating parameters in the constructor to protect against Time-of-Check to Time-of-Use (TOCTOU) race condition attacks from malicious caller threads.'
    ],
    codeExamples: [
      {
        title: 'Handcrafted Robust Immutable Class vs Java Record',
        language: 'java',
        code: `import java.util.*;

// 1. Classical Enterprise Immutable Class with Defensive Copying
public final class ImmutableUserProfile {
    private final String id;
    private final List<String> roles;
    private final Date memberSince;

    public ImmutableUserProfile(String id, List<String> roles, Date memberSince) {
        this.id = id;
        // Deep defensive copy for collections and dates
        this.roles = roles == null ? List.of() : List.copyOf(roles);
        this.memberSince = memberSince == null ? null : new Date(memberSince.getTime());
    }

    public String getId() { return id; }
    public List<String> getRoles() { return roles; } // List.copyOf is already unmodifiable
    public Date getMemberSince() {
        return memberSince == null ? null : new Date(memberSince.getTime());
    }
}

// 2. Modern Java 16+ Record equivalent
record UserProfileRecord(String id, List<String> roles) {
    public UserProfileRecord {
        // Compact constructor with defensive copy
        roles = roles == null ? List.of() : List.copyOf(roles);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Lists all requirements: final class, private final fields, no setters, defensive copy in constructor and getters.',
        'Explains why final List does not prevent element mutation.',
        'Contrasts classical immutable classes with modern Java 14+ records.'
      ],
      juniorOrMidRedFlags: [
        'Omits defensive copying of mutable fields like Date or List in constructor/getters.'
      ],
      seniorDifferentiators: [
        'Explains how immutable objects simplify concurrent programming by eliminating synchronization requirements.'
      ],
      followUpQuestions: [
        'How does Java Record reflection differ from normal class reflection regarding final fields?'
      ]
    },
    tags: ['Immutability', 'Records', 'Thread Safety', 'Architecture']
  },
  {
    id: 'java-12',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Interfaces & Language Evolution',
    title: 'Default and Static Methods in Interfaces & Diamond Problem Resolution',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Why default methods were added to Java 8, interface evolution without breaking binary compatibility, and multiple inheritance conflict rules.',
    coreConcepts: [
      'Default methods enabled the Java 8 collection library to add stream(), forEach(), and removeIf() without breaking existing custom implementations.',
      'Conflict Resolution Rule 1: Classes beat interfaces (methods declared in a superclass always take priority over interface defaults).',
      'Conflict Resolution Rule 2: Most specific sub-interface wins.',
      'Conflict Resolution Rule 3: If two unrelated interfaces provide conflicting defaults, the implementing class MUST explicitly override and resolve using InterfaceName.super.method().'
    ],
    detailedExplanation: [
      'Prior to Java 8, adding a new method to an interface like java.util.List would immediately break every third-party library implementing List.',
      'Static methods in interfaces provide utility methods scoped directly to the interface namespace (e.g. Comparator.comparing()).'
    ],
    codeExamples: [
      {
        title: 'Resolving Diamond Problem in Interface Default Methods',
        language: 'java',
        code: `interface ServiceEngineA {
    default String execute() {
        return "Engine A Strategy";
    }
}

interface ServiceEngineB {
    default String execute() {
        return "Engine B Strategy";
    }
}

// Class MUST resolve conflicting default methods explicitly
public class HybridService implements ServiceEngineA, ServiceEngineB {
    @Override
    public String execute() {
        // Explicitly choose ServiceEngineA or combine both
        return "Hybrid: " + ServiceEngineA.super.execute() + " + " + ServiceEngineB.super.execute();
    }

    public static void main(String[] args) {
        HybridService service = new HybridService();
        System.out.println(service.execute());
    }
}`,
        output: `Hybrid: Engine A Strategy + Engine B Strategy`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the primary motivation: backward binary compatibility for the Stream API in Collections.',
        'Explains the 3 resolution rules for default method conflicts.',
        'Demonstrates InterfaceName.super.method() syntax.'
      ],
      juniorOrMidRedFlags: [
        'Claims Java now has full C++ style multiple inheritance with state.',
        'Cannot resolve a dual interface method conflict.'
      ],
      seniorDifferentiators: [
        'Distinguishes default methods from abstract methods in abstract classes (interfaces cannot have instance fields or state).'
      ],
      followUpQuestions: [
        'Why can interface default methods not override java.lang.Object methods like equals() or hashCode()?'
      ]
    },
    tags: ['Java 8', 'Interfaces', 'Default Methods', 'Diamond Problem']
  },
  {
    id: 'java-13',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Functional Programming',
    title: 'The 4 Kinds of Method References in Java 8',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Static, bound instance, unbound instance, and constructor method references with functional interface equivalencies.',
    coreConcepts: [
      'Reference to a static method: ContainingClass::staticMethodName (e.g. Integer::parseInt)',
      'Reference to an instance method of a particular object (Bound): instanceRef::methodName (e.g. System.out::println)',
      'Reference to an instance method of an arbitrary object of a particular type (Unbound): ContainingType::methodName (e.g. String::toUpperCase)',
      'Reference to a constructor: ClassName::new (e.g. ArrayList::new, User::new)'
    ],
    detailedExplanation: [
      'Method references provide compact, readable syntax for lambdas that simply forward their parameters directly to an existing method.',
      'In unbound method references (String::compareToIgnoreCase), the first lambda parameter becomes the target object invoking the method, and remaining parameters are passed as arguments.'
    ],
    codeExamples: [
      {
        title: 'All 4 Method Reference Types Demonstrated',
        language: 'java',
        code: `import java.util.*;
import java.util.function.*;

public class MethodReferenceMatrix {
    public static void main(String[] args) {
        // 1. Static Method Reference (String -> Integer)
        Function<String, Integer> staticParser = Integer::parseInt;
        System.out.println("Parsed: " + staticParser.apply("42"));

        // 2. Bound Instance Method Reference (particular object)
        String prefix = "Hello, ";
        Function<String, String> boundGreeter = prefix::concat;
        System.out.println(boundGreeter.apply("World"));

        // 3. Unbound Instance Method Reference (arbitrary object of type)
        BiPredicate<String, String> unboundComparator = String::equalsIgnoreCase;
        System.out.println("Equals Ignore Case: " + unboundComparator.test("JAVA", "java"));

        // 4. Constructor Reference
        Supplier<List<String>> listSupplier = ArrayList::new;
        List<String> dynamicList = listSupplier.get();
        dynamicList.add("Dynamic Element");
        System.out.println("Supplied List: " + dynamicList);
    }
}`,
        output: `Parsed: 42
Hello, World
Equals Ignore Case: true
Supplied List: [Dynamic Element]`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Categorizes all 4 types clearly: Static, Bound instance, Unbound instance, Constructor.',
        'Explains how unbound instance references pass the first parameter as the `this` target.',
        'Maps method references directly to standard functional interfaces.'
      ],
      juniorOrMidRedFlags: [
        'Confuses bound vs unbound instance references.'
      ],
      seniorDifferentiators: [
        'Explains invokedynamic bytecode generation for method references and lambdas.'
      ],
      followUpQuestions: [
        'How does the JVM optimize lambda and method reference invocation using BootstrapMethods?'
      ]
    },
    tags: ['Method References', 'Lambdas', 'Functional Interfaces']
  }
];
