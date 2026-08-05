import { QuestionItem } from '../types';

export const javaCoreQuestions: QuestionItem[] = [
  {
    id: 'java-new-3',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Collections',
    title: 'Fail-Fast vs Fail-Safe Iterators',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'The difference between fail-fast (ConcurrentModificationException) and fail-safe iterators in Java collections.',
    coreConcepts: [
      'Fail-fast iterators (e.g. ArrayList, HashMap) operate directly on the collection. If the collection is structurally modified while iterating (other than by the iterator\'s own remove method), they throw ConcurrentModificationException.',
      'Fail-safe iterators (e.g. CopyOnWriteArrayList, ConcurrentHashMap) operate on a clone of the collection or use weak consistency, meaning they won\'t throw an exception if the collection is modified.',
      'Fail-fast uses a `modCount` variable to track structural modifications.'
    ],
    detailedExplanation: [
      'A common interview question involves removing an element from a List while iterating. Using a standard `for-each` loop to remove an element will trigger a ConcurrentModificationException because it uses a fail-fast iterator under the hood.',
      'To safely remove elements during iteration on standard collections, you must use the `Iterator.remove()` method, not `List.remove()`.'
    ],
    codeExamples: [
      {
        title: 'Proper Removal during Iteration',
        language: 'java',
        code: `public class IteratorDemo {
    public void removeElements() {
        List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
        
        // Anti-pattern: Throws ConcurrentModificationException
        // for (String s : list) { 
        //    if (s.equals("B")) list.remove(s); 
        // }

        // Correct way (Pre-Java 8)
        Iterator<String> it = list.iterator();
        while (it.hasNext()) {
            if (it.next().equals("B")) {
                it.remove(); 
            }
        }

        // Modern Java 8+ way
        list.removeIf(s -> s.equals("B"));
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that fail-fast iterators use `modCount` to detect modifications.',
        'Identifies that ConcurrentHashMap and CopyOnWriteArrayList are fail-safe.',
        'Mentions `Collection.removeIf()` as the modern way to remove elements.'
      ],
      juniorOrMidRedFlags: [
        'Confuses fail-safe with thread-safety.',
        'Thinks `for-each` loops are immune to ConcurrentModificationException.'
      ],
      seniorDifferentiators: [
        'Explains how ConcurrentHashMap uses weakly consistent iterators (not a full clone, but reflects state at creation time).'
      ],
      followUpQuestions: [
        'Why doesn\'t ConcurrentHashMap throw ConcurrentModificationException?'
      ]
    },
    tags: ['Collections', 'Iterators', 'Core API']
  },
  {
    id: 'java-new-4',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Core API',
    title: 'Comparable vs Comparator',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'When and how to use Comparable (natural ordering) versus Comparator (custom ordering) in Java.',
    coreConcepts: [
      'Comparable is an interface implemented by the class itself (e.g. `String implements Comparable<String>`). It defines the "natural ordering" of the object via the `compareTo` method.',
      'Comparator is an external interface used to define custom, multiple sorting strategies via the `compare` method.',
      'In Java 8, Comparator got many default and static methods (like `comparing`, `thenComparing`) making it very easy to chain sort conditions.'
    ],
    detailedExplanation: [
      'If you have a `User` class, its natural ordering might be by ID. You would implement `Comparable<User>` on the class.',
      'However, if you want to sort a list of Users by age, then by name, you would use an external `Comparator<User>`.',
      'Java 8 makes this highly functional, allowing `Comparator.comparing(User::getAge).thenComparing(User::getName)`.'
    ],
    codeExamples: [
      {
        title: 'Java 8 Comparator Chaining',
        language: 'java',
        code: `import java.util.*;

public class SortDemo {
    public void sortUsers(List<User> users) {
        // Natural ordering (Requires User to implement Comparable)
        Collections.sort(users);

        // Custom ordering using Java 8 Comparators
        users.sort(
            Comparator.comparing(User::getAge)
                      .reversed() // Oldest first
                      .thenComparing(User::getLastName)
        );
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Distinguishes between internal (Comparable) and external (Comparator) sorting logic.',
        'Mentions Java 8 functional capabilities like `Comparator.comparing`.',
        'Understands the return values of compareTo (-1, 0, 1).'
      ],
      juniorOrMidRedFlags: [
        'Confuses the method names (`compare` vs `compareTo`).',
        'Struggles to explain how to sort the same object by two different fields.'
      ],
      seniorDifferentiators: [
        'Explains performance implications of complex Comparators in large lists.',
        'Mentions `comparingInt` to avoid autoboxing overhead.'
      ],
      followUpQuestions: [
        'What is the contract between `compareTo()` and `equals()`?'
      ]
    },
    tags: ['Collections', 'Sorting', 'Java 8']
  },
  {
    id: 'java-new-1',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Core API',
    title: 'Optional Best Practices and Anti-Patterns',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding the intended use of Optional as a return type and recognizing common Optional anti-patterns.',
    coreConcepts: [
      'Optional is intended to represent the possible absence of a return value, forcing the caller to explicitly handle the null case.',
      'Optional should NOT be used as a parameter type, class field, or collection element.',
      'Calling Optional.get() without Optional.isPresent() defeats the purpose of Optional and can throw NoSuchElementException.'
    ],
    detailedExplanation: [
      'Introduced in Java 8, Optional was designed primarily to solve the problem of methods returning null and callers forgetting to check for it.',
      'Anti-Pattern 1: Using Optional as a parameter. It forces the caller to write `method(Optional.of("value"))` or `method(Optional.empty())`, making the API clunky. Use method overloading instead.',
      'Anti-Pattern 2: Using Optional as a field. Optional is not Serializable, which breaks serialization of enclosing objects.',
      'Anti-Pattern 3: Nested Optionals or Optionals in Collections (e.g. `List<Optional<String>>`). A missing value in a collection should simply not be in the collection, or handled separately.'
    ],
    codeExamples: [
      {
        title: 'Proper Usage vs Anti-Patterns',
        language: 'java',
        code: `public class OptionalDemo {
    // GOOD: Returning Optional
    public Optional<User> findUser(String id) {
        // ... DB lookup
        return Optional.ofNullable(user);
    }

    // BAD: Optional as a parameter
    public void updateUser(Optional<User> user) { ... }

    public void demo() {
        // BAD: Defeats the purpose
        Optional<User> opt = findUser("123");
        System.out.println(opt.get().getName()); // Might throw exception

        // GOOD: Functional style
        findUser("123")
            .map(User::getName)
            .ifPresent(System.out::println);
            
        // GOOD: Default values
        User user = findUser("123").orElseGet(() -> createGuestUser());
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'States that Optional is primarily a return type.',
        'Explains why it should not be used as a field (Not Serializable, memory overhead) or parameter.',
        'Mentions functional methods like map, flatMap, and orElseGet.'
      ],
      juniorOrMidRedFlags: [
        'Routinely calls `.get()` without `.isPresent()`.',
        'Uses `if (opt.isPresent()) opt.get()` instead of functional mapping methods.'
      ],
      seniorDifferentiators: [
        'Explains the difference between orElse (always evaluated) and orElseGet (lazily evaluated via Supplier).'
      ],
      followUpQuestions: [
        'When would you use flatMap() instead of map() on an Optional?'
      ]
    },
    tags: ['Optional', 'Java 8', 'Best Practices']
  },
  {
    id: 'java-new-2',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Collections',
    title: 'ArrayList vs LinkedList',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'The internal data structures, time complexities, and modern CPU cache implications of List implementations.',
    coreConcepts: [
      'ArrayList uses a dynamic resizing array. Random access is O(1). Insertions at the end are O(1) amortized, but insertions in the middle are O(N) due to array shifting.',
      'LinkedList uses a doubly-linked list. Access is O(N). Insertions in the middle are O(1) if you already have the Node reference, but O(N) to find the location.',
      'Modern CPU architectures highly favor ArrayList due to spatial locality (cache friendliness). LinkedList nodes are scattered in memory causing cache misses.'
    ],
    detailedExplanation: [
      'Historically, LinkedList was taught as the best choice for frequent middle insertions. However, on modern CPUs, ArrayList almost always outperforms LinkedList, even for middle insertions, unless the list is massive.',
      'This is because moving contiguous blocks of memory in an array (using System.arraycopy) is highly optimized and leverages the L1/L2 CPU cache, whereas traversing a LinkedList causes constant cache misses.'
    ],
    codeExamples: [
      {
        title: 'Collection Initialization',
        language: 'java',
        code: `public class ListDemo {
    public void demo() {
        // If you know the capacity, specify it to avoid resizing overhead
        List<String> arrList = new ArrayList<>(1000);
        
        // LinkedList has huge memory overhead (prev/next pointers + object header per element)
        List<String> linkedList = new LinkedList<>();
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Understands the Big O time complexities for both structures.',
        'States that ArrayList should be the default choice for almost all use cases.',
        'Explains the CPU cache / spatial locality advantage of ArrayList.'
      ],
      juniorOrMidRedFlags: [
        'Claims LinkedList is always faster for inserting/deleting elements.',
        'Fails to mention memory overhead of LinkedList node objects.'
      ],
      seniorDifferentiators: [
        'Explains how System.arraycopy optimizes array shifting.',
        'Mentions the Garbage Collection impact of LinkedList (creating/destroying thousands of small Node objects).'
      ],
      followUpQuestions: [
        'When resizing, how much does an ArrayList grow by default in Java?'
      ]
    },
    tags: ['Collections', 'ArrayList', 'LinkedList', 'Performance']
  },
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
  },
  {
    id: 'java-14',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Exception Handling',
    title: 'Checked vs Unchecked Exceptions & Anti-Patterns',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'The difference between Checked (compile-time) and Unchecked (runtime) exceptions, and modern best practices.',
    coreConcepts: [
      'Checked Exceptions (extend Exception) must be declared in the method signature or caught. They represent recoverable conditions (e.g. FileNotFoundException).',
      'Unchecked Exceptions (extend RuntimeException) do not need to be declared. They represent programming errors or unrecoverable states (e.g. NullPointerException).',
      'Modern frameworks (like Spring) wrap most checked exceptions into unchecked ones because checked exceptions break functional pipelines (lambdas).'
    ],
    detailedExplanation: [
      'Historically, Java encouraged Checked Exceptions to force developers to handle errors. However, this often led to empty catch blocks or throws Exception clutter.',
      'In modern Java, especially with the Stream API, checked exceptions are cumbersome because standard functional interfaces (like Function or Consumer) do not throw checked exceptions.'
    ],
    codeExamples: [
      {
        title: 'Exception Hierarchy and Wrapping',
        language: 'java',
        code: `import java.io.*;

public class ExceptionDemo {
    // 1. Checked Exception: Must be declared
    public void readFile() throws IOException {
        FileReader reader = new FileReader("test.txt");
        reader.close();
    }

    // 2. Unchecked Exception: No declaration needed
    public void validate(String input) {
        if (input == null) {
            throw new IllegalArgumentException("Input cannot be null");
        }
    }

    // 3. Wrapping checked into unchecked for Streams
    public void modernWrap() {
        try {
            readFile();
        } catch (IOException e) {
            // Translating to a RuntimeException (Anti-pattern fix)
            throw new UncheckedIOException(e);
        }
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Clearly defines Checked (compile-time forced handling) vs Unchecked (RuntimeException).',
        'Explains why modern Java (Spring, Hibernate, Streams) prefers RuntimeExceptions.',
        'Demonstrates wrapping a Checked Exception into a RuntimeException.'
      ],
      juniorOrMidRedFlags: [
        'Catching an exception and doing nothing (swallowing it).',
        'Catching Exception or Throwable globally instead of specific exceptions.'
      ],
      seniorDifferentiators: [
        'Explains how checked exceptions conflict with the Open-Closed Principle (changing a low-level method signature forces changes all the way up the call stack).'
      ],
      followUpQuestions: [
        'How do you handle checked exceptions inside a Java 8 Stream `.map()` operation?'
      ]
    },
    tags: ['Exceptions', 'Error Handling', 'Best Practices']
  },
  {
    id: 'java-15',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Resource Management',
    title: 'Try-With-Resources and the AutoCloseable Interface (Java 7/9)',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Ensuring resource safety without memory leaks, handling suppressed exceptions, and implementing AutoCloseable.',
    coreConcepts: [
      'Try-with-resources (introduced in Java 7) guarantees that resources are closed automatically at the end of the statement.',
      'To be used in a try-with-resources block, an object must implement java.lang.AutoCloseable or java.io.Closeable.',
      'It properly handles "Suppressed Exceptions" where an exception in the try block masks an exception during the close() method.'
    ],
    detailedExplanation: [
      'Before Java 7, resources (JDBC Connections, File streams) had to be closed in a finally block. This was verbose and prone to error, especially when close() itself could throw an exception.',
      'Java 9 enhanced this by allowing effectively final variables to be used directly in the try-with-resources statement.'
    ],
    codeExamples: [
      {
        title: 'Legacy finally block vs Try-With-Resources',
        language: 'java',
        code: `import java.sql.*;

public class ResourceDemo {
    // OLD WAY (Java 6) - Verbose and prone to masking exceptions
    public void oldWay(String url) throws SQLException {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url);
            // Execute query
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    // Log error
                }
            }
        }
    }

    // NEW WAY (Java 7+) - Clean and handles suppressed exceptions
    public void newWay(String url) throws SQLException {
        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement ps = conn.prepareStatement("SELECT 1")) {
            
            ResultSet rs = ps.executeQuery();
            // Process ResultSet
            
        } // Both ps and conn are automatically closed here in reverse order!
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the syntax and purpose of try-with-resources.',
        'Mentions the AutoCloseable interface requirement.',
        'Explains that resources are closed in reverse order of declaration.'
      ],
      juniorOrMidRedFlags: [
        'Still writes explicit finally blocks to close standard I/O streams in modern Java.',
        'Unaware of what interface allows a class to be used in try-with-resources.'
      ],
      seniorDifferentiators: [
        'Explains Suppressed Exceptions (when both the try block and the close() method throw, the close exception is added to the main exception\'s suppressed list).'
      ],
      followUpQuestions: [
        'Can a try-with-resources block also have catch and finally blocks? When do they execute?'
      ]
    },
    tags: ['Try-With-Resources', 'AutoCloseable', 'Memory Leaks']
  },
  {
    id: 'java-16',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Generics',
    title: 'Generics, Type Erasure, and Wildcards (? extends T)',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding how Generics work at compile time, the concept of Type Erasure, and PECS (Producer Extends, Consumer Super).',
    coreConcepts: [
      'Generics provide compile-time type safety. A List<String> is verified by the compiler to only contain Strings.',
      'Type Erasure: At runtime, the JVM does not know about generic types. List<String> simply becomes List (raw type) containing Objects.',
      'PECS Rule: "Producer Extends, Consumer Super". Use `? extends T` if you only read from the collection. Use `? super T` if you only write to it.'
    ],
    detailedExplanation: [
      'Type Erasure was introduced in Java 5 for backward compatibility with older bytecode. Because of erasure, you cannot do things like `new T()` or `if (obj instanceof List<String>)` at runtime.',
      'Wildcards provide flexibility for APIs. For example, `List<Dog>` is NOT a subclass of `List<Animal>`, even though `Dog` extends `Animal`. To write a method that accepts a list of any animals, you must use `List<? extends Animal>`.',
      'However, you cannot add a new Dog to a `List<? extends Animal>` because the compiler doesn\'t know what specific type of Animal list was passed (it could be a `List<Cat>`).'
    ],
    codeExamples: [
      {
        title: 'Generics and the PECS Principle',
        language: 'java',
        code: `class Animal {}
class Dog extends Animal {}
class Cat extends Animal {}

public class GenericsDemo {

    // PRODUCER EXTENDS: We only READ from this list
    public void printAnimals(List<? extends Animal> animals) {
        for (Animal a : animals) {
            System.out.println(a);
        }
        // animals.add(new Dog()); // COMPILER ERROR! Might be a List<Cat>
    }

    // CONSUMER SUPER: We only WRITE to this list
    public void addDogs(List<? super Dog> dogs) {
        dogs.add(new Dog());
        dogs.add(new Dog());
        
        // Animal a = dogs.get(0); // COMPILER ERROR! Returns Object, not guaranteed to be Animal
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that generics are a compile-time feature and are erased at runtime.',
        'Mentions the inability to use instanceof or instantiate type parameters due to erasure.',
        'Explains the difference between ? extends T and ? super T.',
        'References the PECS rule (Producer Extends, Consumer Super).'
      ],
      juniorOrMidRedFlags: [
        'Believes List<Dog> is a subclass of List<Animal>.',
        'Thinks generic type information is fully available at runtime (like in C#).',
        'Struggles to explain why you cannot add items to a `? extends T` collection.'
      ],
      seniorDifferentiators: [
        'Discusses how Spring and Jackson bypass type erasure limitations using ParameterizedTypeReference or TypeReference (which capture generic information in an anonymous subclass).',
        'Explains bridge methods generated by the compiler to maintain polymorphism with type erasure.'
      ],
      followUpQuestions: [
        'If generic types are erased at runtime, how does Jackson (JSON library) deserialize a generic `List<User>` accurately without turning them into `LinkedHashMap`s?',
        'What is a bridge method in Java?'
      ]
    },
    tags: ['Generics', 'Type Erasure', 'PECS', 'Core Java']
  },
  {
    id: 'java-17',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Core API',
    title: 'The Contract Between equals() and hashCode()',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding why and how to override equals and hashCode correctly, and what happens if you break the contract.',
    coreConcepts: [
      'If two objects are equal according to the equals(Object) method, they must have the same hashCode().',
      'If two objects have the same hashCode(), they are not necessarily equal (this is a hash collision).',
      'Breaking this contract causes objects to be lost or unretrievable when placed in hash-based collections like HashMap or HashSet.'
    ],
    detailedExplanation: [
      'When you insert an object as a key into a HashMap, it calculates the hashCode to find the correct bucket. Once in the bucket, it uses equals() to find the exact match.',
      'If you override equals() to make two logical instances "equal", but forget to override hashCode(), the two instances will hash to different buckets. The Map will not be able to find the key.'
    ],
    codeExamples: [
      {
        title: 'Correctly overriding equals and hashCode',
        language: 'java',
        code: `import java.util.Objects;

public class User {
    private String email;

    public User(String email) {
        this.email = email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // Reference check
        if (o == null || getClass() != o.getClass()) return false; // Type check
        User user = (User) o;
        return Objects.equals(email, user.email); // Value check
    }

    @Override
    public int hashCode() {
        return Objects.hash(email); // Must use same fields as equals
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'States the rule: Equal objects MUST have equal hash codes.',
        'Explains the impact on HashMaps and HashSets (objects become unfindable).',
        'Knows that hash collisions are allowed and handled (usually by a linked list or tree in the bucket).'
      ],
      juniorOrMidRedFlags: [
        'Thinks equal hash codes mean the objects are equal.',
        'Fails to mention hash-based collections when explaining why the contract exists.'
      ],
      seniorDifferentiators: [
        'Explains how immutable objects make the best Map keys because their hashCode can be cached and won\'t change after insertion.',
        'Mentions the performance implications of poorly distributed hash functions (O(1) degrades to O(log N) or O(N)).'
      ],
      followUpQuestions: [
        'What happens if you mutate a field that is used in the hashCode calculation after the object has been added as a key to a HashMap?',
        'Can you return a constant value like `1` for hashCode()? Is it legal?'
      ]
    },
    tags: ['Core API', 'Collections', 'HashMap', 'equals', 'hashCode']
  },
  {
    id: 'java-18',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Core API',
    title: 'String Immutability and the String Pool',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'How Strings are stored in memory, the purpose of the String Pool, and why Strings are immutable.',
    coreConcepts: [
      'Strings in Java are immutable. Once created, their value cannot be changed. Operations like concatenation return a new String object.',
      'The String Pool is a special area in the JVM Heap that caches literal String values to save memory.',
      'Using the `==` operator on Strings compares memory references, whereas `.equals()` compares the actual character content.'
    ],
    detailedExplanation: [
      'Because Strings are so common, Java optimizes memory by keeping a single copy of each literal string in the String Pool.',
      'When you create a String using double quotes (e.g. `String s = "hello";`), Java checks the pool first. If you use `new String("hello")`, it creates a new object on the heap, bypassing the pool initially.',
      'Immutability makes Strings inherently thread-safe, secure for caching, and ideal for use as HashMap keys.'
    ],
    codeExamples: [
      {
        title: 'String Pool vs Heap References',
        language: 'java',
        code: `public class StringDemo {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "hello";
        String s3 = new String("hello");
        
        System.out.println(s1 == s2);      // true: Both point to the same String Pool instance
        System.out.println(s1 == s3);      // false: s3 is a new object on the regular heap
        System.out.println(s1.equals(s3)); // true: Their content is the same
        
        // intern() method
        String s4 = s3.intern();
        System.out.println(s1 == s4);      // true: intern() gets the pool reference
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that Immutability means the internal char array cannot be modified.',
        'Mentions the String Pool as a memory-saving mechanism for literals.',
        'Clearly distinguishes between `==` (reference check) and `.equals()` (value check).'
      ],
      juniorOrMidRedFlags: [
        'Uses `==` to compare String values in code.',
        'Does not know what the String Pool is or how literal creation differs from `new String()`.',
        'Uses String concatenation inside loops instead of StringBuilder.'
      ],
      seniorDifferentiators: [
        'Explains that since Java 9, Strings use a byte array with a coder flag (Compact Strings) instead of a char array, saving memory for Latin-1 strings.',
        'Explains how String immutability is essential for classloading and security (so a string cannot be modified after security checks pass).'
      ],
      followUpQuestions: [
        'Why should you use a `StringBuilder` or `StringBuffer` when doing heavy string concatenation in a loop?',
        'Where was the String Pool located prior to Java 7, and why was it moved?'
      ]
    },
    tags: ['String', 'Immutability', 'Memory', 'Core API']
  },
  {
    id: 'java-19',
    category: 'java-core',
    categoryName: 'Java 8+ & Core Internals',
    topic: 'Concurrency',
    title: 'CompletableFuture (Java 8)',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Writing non-blocking asynchronous code using CompletableFuture instead of blocking Threads or raw Futures.',
    coreConcepts: [
      'CompletableFuture implements both Future and CompletionStage, providing a huge API for composing, combining, and executing asynchronous steps.',
      'Unlike the old `java.util.concurrent.Future`, you don\'t need to call the blocking `.get()` method to wait for results. Instead, you attach callbacks like `.thenApply()` or `.thenAccept()`.',
      'It supports robust exception handling through `.exceptionally()` or `.handle()`.'
    ],
    detailedExplanation: [
      'CompletableFuture allows you to build asynchronous pipelines. When the first step finishes, it automatically triggers the next step without blocking a thread waiting in the middle.',
      'Methods ending with `Async` (like `thenApplyAsync`) execute the callback in a different thread, usually pulled from the common ForkJoinPool, or a custom Executor if provided.'
    ],
    codeExamples: [
      {
        title: 'Asynchronous pipelines with CompletableFuture',
        language: 'java',
        code: `import java.util.concurrent.CompletableFuture;

public class AsyncDemo {
    public void fetchAndProcess() {
        // Start async task
        CompletableFuture.supplyAsync(() -> fetchUserData())
            // Chain a transformation (runs when fetchUserData completes)
            .thenApply(user -> enrichUserData(user))
            // Consume the result
            .thenAccept(enriched -> System.out.println("Result: " + enriched))
            // Handle any exceptions in the chain
            .exceptionally(ex -> {
                System.err.println("Failed: " + ex.getMessage());
                return null;
            });
            
        System.out.println("Pipeline created, running asynchronously...");
    }

    private String fetchUserData() { return "User123"; }
    private String enrichUserData(String user) { return user + "_Enriched"; }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Identifies CompletableFuture as the modern way to handle async callbacks in Java.',
        'Contrasts it with the older, blocking `Future.get()`.',
        'Shows familiarity with basic methods like supplyAsync, thenApply, and exceptionally.'
      ],
      juniorOrMidRedFlags: [
        'Only knows how to create a Thread or implement Runnable.',
        'Creates a CompletableFuture but immediately calls `.get()`, blocking the main thread and defeating the purpose.'
      ],
      seniorDifferentiators: [
        'Understands the difference between `thenApply` (synchronous on the completing thread) and `thenApplyAsync` (offloads to a thread pool).',
        'Can explain how to combine multiple futures using `CompletableFuture.allOf()` or `anyOf()`.'
      ],
      followUpQuestions: [
        'What thread pool does CompletableFuture use by default if you don\'t provide an Executor?',
        'How does `thenCompose()` differ from `thenApply()`?'
      ]
    },
    tags: ['Java 8', 'CompletableFuture', 'Concurrency', 'Async']
  }
];
