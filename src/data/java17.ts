import { QuestionItem } from '../types';

export const java17Questions: QuestionItem[] = [
  {
    id: 'j17-new-1',
    category: 'java-17',
    categoryName: 'Java 8 to 17 Features',
    topic: 'Language Features',
    title: 'Local Variable Type Inference (var)',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'Understanding when and how to use the var keyword introduced in Java 10.',
    coreConcepts: [
      'The var keyword allows local variable type inference, reducing verbosity without sacrificing static typing.',
      'It can only be used for local variables inside methods, not for instance variables, method parameters, or return types.',
      'The compiler infers the exact type at compile time based on the right-hand side of the assignment.'
    ],
    detailedExplanation: [
      'Introduced in Java 10, var is syntactic sugar. The byte code produced is identical to explicit typing.',
      'You cannot use var without an initializer (e.g. `var name;` is illegal).',
      'It is highly recommended when the type is obvious from the right-hand side (e.g. `var list = new ArrayList<String>();`), but frowned upon if it reduces readability (e.g. `var result = process();` where the return type is unclear).'
    ],
    codeExamples: [
      {
        title: 'Using var correctly',
        language: 'java',
        code: `public class VarDemo {
    // var is ILLEGAL here:
    // var instanceField = "Hello";

    public void demo() {
        // Obvious type
        var map = new HashMap<String, List<Integer>>();
        
        // Inside loops
        for (var entry : map.entrySet()) {
            System.out.println(entry.getKey());
        }
        
        // Illegal: Cannot use without initializer or with null
        // var x; 
        // var y = null; 
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'States that var is resolved at compile-time (Java is still statically typed).',
        'Knows that it is restricted to local variables.',
        'Mentions readability concerns as a reason not to overuse it.'
      ],
      juniorOrMidRedFlags: [
        'Thinks var makes Java dynamically typed like JavaScript.',
        'Believes var can be used for class fields.'
      ],
      seniorDifferentiators: [
        'Explains how var interacts with non-denotable types (e.g. anonymous classes).'
      ],
      followUpQuestions: [
        'Can you use var in a lambda expression parameter?'
      ]
    },
    tags: ['Java 10', 'var', 'Type Inference']
  },
  {
    id: 'j17-new-2',
    category: 'java-17',
    categoryName: 'Java 8 to 17 Features',
    topic: 'Language Features',
    title: 'Text Blocks (Java 15)',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'Using Text Blocks to write multi-line strings easily without messy concatenation and escaping.',
    coreConcepts: [
      'Text blocks use triple quotes (`\"\"\"`) to declare multi-line string literals.',
      'They automatically strip incidental indentation (leading whitespace common to all lines in the block).',
      'They avoid the need for escaping quotes and newlines.'
    ],
    detailedExplanation: [
      'Before Java 15, writing JSON, HTML, or SQL queries inside Java code required endless String concatenation and `\\n` escapes.',
      'Text blocks make code much cleaner. The compiler looks at the indentation of the closing `\"\"\"` and the content to determine how much leading whitespace to strip.'
    ],
    codeExamples: [
      {
        title: 'Text Blocks vs Legacy Strings',
        language: 'java',
        code: `// The old way
String jsonLegacy = "{\\n" +
                    "  \\"name\\": \\"John\\",\\n" +
                    "  \\"age\\": 30\\n" +
                    "}";

// The new way (Java 15+)
String jsonBlock = """
                   {
                     "name": "John",
                     "age": 30
                   }
                   """;`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Mentions the triple quote syntax.',
        'Explains that it automatically handles incidental indentation.',
        'Notes its usefulness for JSON, SQL, and HTML.'
      ],
      juniorOrMidRedFlags: [
        'Unaware of the feature and relies on string concatenation for large queries.'
      ],
      seniorDifferentiators: [
        'Understands how to use `\\` at the end of a line to prevent a newline character from being inserted, and `\\s` to preserve trailing whitespace.'
      ],
      followUpQuestions: [
        'How does the compiler decide which leading spaces are incidental vs intentional?'
      ]
    },
    tags: ['Java 15', 'Text Blocks', 'Strings']
  },
  {
    id: 'j17-new-3',
    category: 'java-17',
    categoryName: 'Java 8 to 17 Features',
    topic: 'Language Features',
    title: 'Switch Expressions (Java 14)',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'How modern switch expressions differ from legacy switch statements (arrow syntax, yield, exhaustiveness).',
    coreConcepts: [
      'Switch can now be used as an expression (returning a value) rather than just a statement.',
      'Uses arrow syntax (`->`) which avoids fall-through (no need for `break`).',
      'The `yield` keyword is used to return a value from a block within a switch expression.',
      'Switch expressions must be exhaustive (cover all possible values or have a default).'
    ],
    detailedExplanation: [
      'Traditional switch statements are notoriously error-prone due to fall-through (forgetting a break statement).',
      'Switch expressions solve this by executing only the matched case. Because they evaluate to a value, the compiler enforces exhaustiveness, which is incredibly powerful when switching over an Enum.'
    ],
    codeExamples: [
      {
        title: 'Switch Expressions',
        language: 'java',
        code: `public class SwitchDemo {
    enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }

    public int getWorkingHours(Day day) {
        // Switch as an expression returning a value
        return switch (day) {
            case MON, TUE, WED, THU, FRI -> 8;
            case SAT, SUN -> {
                System.out.println("It\\'s the weekend!");
                yield 0; // Using yield to return from a block
            }
            // No default needed because all Enum values are covered
        };
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the arrow `->` syntax and lack of fall-through.',
        'Explains that it evaluates to a value (expression).',
        'Explains the `yield` keyword for blocks.'
      ],
      juniorOrMidRedFlags: [
        'Confuses `yield` with the Thread.yield() concurrency method.',
        'Thinks `return` is used inside the switch block instead of `yield`.'
      ],
      seniorDifferentiators: [
        'Explains how exhaustiveness checking interacts with Sealed Classes to eliminate the need for default clauses in modern Java.'
      ],
      followUpQuestions: [
        'If you add a new value to the Enum, what happens when you compile the switch expression?'
      ]
    },
    tags: ['Java 14', 'Switch', 'Control Flow']
  },
  {
    id: 'j17-01',
    category: 'java-17',
    categoryName: 'Java 8 to 17 Features',
    topic: 'Records & Pattern Matching',
    title: 'Java 14/16 Records and Java 17 Pattern Matching for switch/instanceof',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding the semantics of Java Records as transparent data carriers, and the evolution of instanceof and switch statements to support pattern matching.',
    coreConcepts: [
      'Records are final classes implicitly extending java.lang.Record. They provide immutable data carriers with auto-generated equals(), hashCode(), and toString().',
      'Records do not support inheritance (cannot extend other classes) but can implement interfaces.',
      'Pattern Matching for instanceof (Java 16) eliminates explicit casting after type checking.',
      'Pattern Matching for switch (Preview in 17, standard later) allows switching over types, not just constants, replacing long if-else chains.'
    ],
    detailedExplanation: [
      'Prior to Java 14, creating simple data carrier classes (like DTOs) required boilerplate constructors, getters, equals, and hashCode. Records simplify this drastically.',
      'A Record\'s components are implicitly final. If you need a mutable DTO, a Record is the wrong choice.',
      'Java 16 introduced pattern matching for `instanceof`, which binds the matched object to a new implicitly typed variable, scoped to the true-block of the if statement.',
      'These features combined pave the way for more functional-style programming in Java (e.g., algebraic data types and exhaustive switch expressions with sealed classes).'
    ],
    codeExamples: [
      {
        title: 'Records and Pattern Matching',
        language: 'java',
        code: `public interface Shape {}
public record Circle(double radius) implements Shape {}
public record Rectangle(double length, double width) implements Shape {}

public class GeometryUtils {
    // Java 16 Pattern Matching for instanceof
    public static void printArea(Shape shape) {
        if (shape instanceof Circle c) {
            System.out.println("Circle area: " + (Math.PI * c.radius() * c.radius()));
        } else if (shape instanceof Rectangle r) {
            System.out.println("Rectangle area: " + (r.length() * r.width()));
        }
    }
    
    // Java 17+ Switch Expression (Preview in 17)
    public static double getArea(Shape shape) {
        return switch(shape) {
            case Circle c -> Math.PI * c.radius() * c.radius();
            case Rectangle r -> r.length() * r.width();
            default -> 0.0;
        };
    }
}`,
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains Records as immutable transparent carriers replacing boilerplate.',
        'Mentions that Records cannot extend classes, only implement interfaces.',
        'Understands Pattern Matching for instanceof and how it scopes the bound variable.',
        'Can articulate how switch expressions differ from traditional switch statements (yield vs break, exhaustive checks).'
      ],
      juniorOrMidRedFlags: [
        'Believes Records can be mutated or can extend other classes.',
        'Thinks Pattern Matching is just syntactic sugar without understanding its connection to algebraic data types.'
      ],
      seniorDifferentiators: [
        'Connects Records, Pattern Matching, and Sealed Classes as the foundation for Data-Oriented Programming in Java.',
        'Explains the performance implications (e.g. invokedynamic usage for Record equals/hashCode).'
      ],
      followUpQuestions: [
        'How do you validate arguments in a Record\'s constructor without repeating the component names?',
        'What happens if you add a standard `public Rectangle(...)` constructor inside a Record instead of a compact constructor?'
      ]
    },
    tags: ['Java 14', 'Java 16', 'Java 17', 'Records', 'Pattern Matching']
  },
  {
    id: 'j17-02',
    category: 'java-17',
    categoryName: 'Java 8 to 17 Features',
    topic: 'Sealed Classes',
    title: 'Sealed Classes (Java 15/17) and Exhaustiveness',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Hard',
    summary: 'Restricting class hierarchies with Sealed Classes and using them to guarantee exhaustive pattern matching in modern Java.',
    coreConcepts: [
      'Sealed classes restrict which other classes may extend or implement them using the `permits` clause.',
      'Permitted subclasses must specify exactly one of these modifiers: `final`, `sealed`, or `non-sealed`.',
      'They provide domain modeling precision and enable compiler-enforced exhaustiveness in pattern matching `switch` expressions.'
    ],
    detailedExplanation: [
      'Historically, Java developers used package-private constructors to restrict who could extend a class. Sealed classes formalize this constraint at the language and JVM level.',
      'By pairing Sealed Classes with Records and Switch Expressions, Java achieves Algebraic Data Types (Sum types = Sealed Classes, Product types = Records).',
      'When using a switch expression over a sealed type, the compiler knows all possible subclasses. If you cover all permitted subclasses, you do not need a `default` branch.'
    ],
    codeExamples: [
      {
        title: 'Sealed Interface and Pattern Matching',
        language: 'java',
        code: `public sealed interface PaymentMethod permits CreditCard, PayPal, Crypto {}

// Subclasses must declare sealed, non-sealed, or final
public record CreditCard(String cardNumber) implements PaymentMethod {} // records are implicitly final
public final class PayPal implements PaymentMethod { 
    public String email; 
}
public non-sealed class Crypto implements PaymentMethod { 
    public String walletId; 
} // Can be extended by anyone!

public class PaymentProcessor {
    public void process(PaymentMethod pm) {
        // Compiler guarantees exhaustiveness. No default case needed!
        switch (pm) {
            case CreditCard cc -> System.out.println("Processing card");
            case PayPal pp -> System.out.println("Processing paypal");
            case Crypto c -> System.out.println("Processing crypto");
        }
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the syntax (`sealed`, `permits`, `final`, `non-sealed`).',
        'Describes the primary motivation: domain modeling and exhaustiveness in switch expressions.',
        'Understands that subclasses must be in the same module (or same package in unnamed modules).'
      ],
      juniorOrMidRedFlags: [
        'Confuses `sealed` with `final`.',
        'Fails to understand the requirement for subclasses to explicitly define their sealing state (`final`, `sealed`, `non-sealed`).'
      ],
      seniorDifferentiators: [
        'Discusses Algebraic Data Types and how Java is adopting functional programming concepts.',
        'Explains how adding a new permitted subclass breaks compilation of exhaustive switch statements, which is a desirable fail-fast behavior.'
      ],
      followUpQuestions: [
        'Why would you ever use `non-sealed` on a subclass?',
        'How does the JVM enforce sealed classes at runtime?'
      ]
    },
    tags: ['Java 15', 'Java 17', 'Sealed Classes', 'Architecture']
  },
  {
    id: 'j17-03',
    category: 'java-17',
    categoryName: 'Java 8 to 17 Features',
    topic: 'Text Blocks & String enhancements',
    title: 'Text Blocks (Java 15) and String Methods',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Using multi-line Text Blocks to embed JSON/SQL in Java, and new String utility methods.',
    coreConcepts: [
      'Text blocks (Java 15) use \\"\\"\\" to allow multi-line strings without concatenation or explicit newline escapes.',
      'Incidental whitespace is automatically stripped based on the position of the closing delimiter or the leftmost non-whitespace character.',
      'New String methods in Java 11-15: isBlank(), lines(), strip(), repeat(), formatted().'
    ],
    detailedExplanation: [
      'Prior to Java 15, embedding JSON or SQL queries in Java required ugly string concatenation and escaping double quotes.',
      'Text blocks simplify this and improve readability. The compiler calculates the common whitespace prefix and removes it.',
      'You can use `\\s` to explicitly preserve trailing spaces, and `\\` at the end of a line to suppress the newline.'
    ],
    codeExamples: [
      {
        title: 'Text Blocks vs Old String Concatenation',
        language: 'java',
        code: `// Old way
String jsonOld = "{\\n" +
                 "  \\"name\\": \\"John\\",\\n" +
                 "  \\"age\\": 30\\n" +
                 "}";

// Java 15 Text Block
String jsonNew = """
    {
      "name": "John",
      "age": 30
    }
    """;
    
// String formatting using new formatted() method (Java 15)
String query = """
    SELECT * FROM users
    WHERE status = '%s'
    """.formatted("ACTIVE");`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the triple quote syntax and how it removes the need for escaping quotes.',
        'Understands incidental whitespace stripping mechanism.',
        'Knows about new String methods like formatted(), strip(), and isBlank().'
      ],
      juniorOrMidRedFlags: [
        'Thinks Text Blocks are a new runtime type (they are just Strings).',
        'Doesn\'t understand how to control indentation using the closing delimiter position.'
      ],
      seniorDifferentiators: [
        'Mentions the use of `\\` to suppress newlines for very long single-line strings formatted nicely in code.',
        'Explains difference between strip() (Unicode aware) and trim() (legacy ASCII only).'
      ],
      followUpQuestions: [
        'If the closing `"""` is placed on the same line as the last text character, how does it affect indentation stripping?',
        'What is the difference between String.isBlank() and String.isEmpty()?'
      ]
    },
    tags: ['Java 15', 'Text Blocks', 'Strings']
  },
  {
    id: 'j17-04',
    category: 'java-17',
    categoryName: 'Java 8 to 17 Features',
    topic: 'Low-Latency Garbage Collectors',
    title: 'ZGC (Z Garbage Collector) and Shenandoah (Java 11/15)',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Understanding the shift towards scalable low-latency garbage collectors designed for large heaps with sub-millisecond pause times.',
    coreConcepts: [
      'ZGC (Java 11/15) and Shenandoah are concurrent garbage collectors designed to keep pause times under 1ms (or 10ms for older versions) regardless of heap size (up to 16TB).',
      'They achieve this by doing expensive work like compaction concurrently with application threads, using colored pointers and load barriers.',
      'G1GC remains the default in Java 17 for throughput/balance, while ZGC/Shenandoah are specialized for ultra-low latency requirements.'
    ],
    detailedExplanation: [
      'Traditional G1GC or Parallel GC pause the application (Stop-The-World) during compaction/evacuation, scaling linearly with the number of live objects.',
      'ZGC uses "Colored Pointers" (storing metadata in the pointer bits) and "Load Barriers" (injecting a small snippet of code when reading a reference) to fix up pointers to relocated objects on the fly.',
      'This means the application thread helps with the GC work as it encounters un-updated references, allowing the main GC threads to run concurrently without stopping the world.'
    ],
    codeExamples: [
      {
        title: 'Enabling ZGC in Production (Java 17)',
        language: 'bash',
        code: `# Enable Z Garbage Collector
java -XX:+UseZGC \\
     -Xmx32G \\
     -Xlog:gc* \\
     -jar trading-engine.jar`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Identifies ZGC and Shenandoah as concurrent, low-latency collectors.',
        'Mentions colored pointers and load barriers as the key mechanism for concurrent compaction.',
        'Understands the trade-off: ZGC sacrifices some raw throughput to guarantee low latency.'
      ],
      juniorOrMidRedFlags: [
        'Confuses ZGC with G1GC.',
        'Thinks GC pause times in ZGC depend on heap size.'
      ],
      seniorDifferentiators: [
        'Explains how load barriers impact application performance (a small overhead on every reference read).',
        'Can articulate when to choose ZGC (e.g. trading platforms, large caches) vs G1GC (batch processing).'
      ],
      followUpQuestions: [
        'How does ZGC handle pointer coloring given 64-bit architecture limits?',
        'What is a "Load Barrier" in the context of garbage collection?'
      ]
    },
    tags: ['Java 11', 'Java 15', 'ZGC', 'Garbage Collection', 'Low Latency']
  },
  {
    id: 'j17-05',
    category: 'java-17',
    categoryName: 'Java 8 to 17 Features',
    topic: 'Local-Variable Type Inference',
    title: 'The \'var\' Keyword (Java 10)',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Proper usage and limitations of the \'var\' keyword for local variable type inference introduced in Java 10.',
    coreConcepts: [
      '\'var\' allows the compiler to infer the type of a local variable from its initializer.',
      'It is NOT dynamic typing; the variable is still strongly and statically typed at compile time.',
      '\'var\' can only be used for local variables with initializers, enhanced for-loop indexes, and traditional for-loop declarations.'
    ],
    detailedExplanation: [
      'Java 10 introduced `var` to reduce verbosity when declaring local variables, especially with generic types or long class names (e.g., `Map<String, List<User>>`).',
      '`var` cannot be used for fields, method parameters, or return types because those are part of the public API and their types must be explicitly stated.',
      'Code readability should guide the use of `var`. If the initializer doesn\'t clearly indicate the type (e.g., `var x = getThing();`), explicit typing is preferred.'
    ],
    codeExamples: [
      {
        title: 'Proper vs Improper usage of var',
        language: 'java',
        code: `// GOOD usage
var users = new ArrayList<User>(); 
var stream = list.stream();
for (var entry : map.entrySet()) { ... }

// BAD usage (hard to read)
var result = processData(); // What type is this?

// COMPILER ERRORS
// var x;                  // Error: needs initializer
// var y = null;           // Error: type cannot be inferred
// public var name;        // Error: not allowed for fields
// public void do(var a)   // Error: not allowed for parameters`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Understands that var is statically typed, not dynamic.',
        'Knows where var can and cannot be used (local variables only).',
        'Discusses the readability trade-off and best practices.'
      ],
      juniorOrMidRedFlags: [
        'Believes var introduces dynamic typing (like JavaScript).',
        'Thinks var can be used for class fields.'
      ],
      seniorDifferentiators: [
        'Mentions the concept of "non-denotable types" (e.g., using var with anonymous classes to access newly defined methods).',
        'Explains that var is a reserved type name, not a keyword, allowing backward compatibility for variables named var.'
      ],
      followUpQuestions: [
        'What happens if you assign an anonymous class to a var? Can you call methods defined only in that anonymous class?',
        'Why did the Java language designers decide not to allow var for fields or method return types?'
      ]
    },
    tags: ['Java 10', 'var', 'Type Inference']
  }
];
