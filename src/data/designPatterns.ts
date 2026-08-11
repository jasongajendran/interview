import { QuestionItem } from '../types';

export const designPatternsQuestions: QuestionItem[] = [
  {
    id: 'dp-singleton-01',
    category: 'design-patterns',
    categoryName: 'Design Patterns',
    topic: 'Creational Patterns',
    title: 'Singleton Pattern: Implementation & Pitfalls',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding the Singleton pattern, its implementation using double-checked locking, and why enums are the preferred way in Java.',
    coreConcepts: [
      'Singleton ensures that a class has only one instance and provides a global point of access to it.',
      'Analogy: The President of a country. There can only be one active President at any given time, regardless of who requests an audience.',
      'Java Enums provide an implicit guarantee against multiple instantiation, even in the face of serialization and reflection attacks.'
    ],
    codeExamples: [
      {
        title: 'Thread-Safe Singleton (Double-Checked Locking)',
        language: 'java',
        code: `public class DatabaseConnection {
    // volatile ensures changes are visible across threads immediately
    private static volatile DatabaseConnection instance;
    
    private DatabaseConnection() {
        // private constructor to prevent instantiation
    }
    
    public static DatabaseConnection getInstance() {
        if (instance == null) { // First check (no locking)
            synchronized (DatabaseConnection.class) {
                if (instance == null) { // Second check (with locking)
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
}`
      },
      {
        title: 'Enum Singleton (Joshua Bloch\'s preferred approach)',
        language: 'java',
        code: `public enum ConfigurationManager {
    INSTANCE;
    
    private Properties config;
    
    private ConfigurationManager() {
        config = new Properties();
        // load properties...
    }
    
    public String getProperty(String key) {
        return config.getProperty(key);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the private constructor and static getInstance method.',
        'Mentions the thread-safety issue with lazy initialization and how double-checked locking solves it.',
        'Explains why `volatile` is necessary in double-checked locking (preventing partially constructed objects due to instruction reordering).',
        'Recommends using Enum for a robust, serialization-safe Singleton.'
      ],
      juniorOrMidRedFlags: [
        'Writes a non-thread-safe lazy initialization.',
        'Thinks Spring Beans are strictly JVM-level singletons (they are ApplicationContext-level singletons).'
      ],
      seniorDifferentiators: [
        'Discusses the anti-pattern nature of Singletons (tight coupling, hard to unit test).',
        'Explains how ClassLoaders can break singletons if multiple class loaders load the same class.'
      ],
      followUpQuestions: [
        {
          question: 'How does Reflection break a standard Singleton, and how does Enum prevent this?',
          answer: 'Reflection can access private constructors using setAccessible(true), allowing a second instance to be created. Enums are safe because the JVM internally prevents reflection from instantiating enum types (throws IllegalArgumentException).'
        }
      ]
    },
    tags: ['Design Patterns', 'Singleton', 'Creational', 'Concurrency']
  },
  {
    id: 'dp-strategy-01',
    category: 'design-patterns',
    categoryName: 'Design Patterns',
    topic: 'Behavioral Patterns',
    title: 'Strategy Pattern: Eliminating Large If-Else Blocks',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'Using the Strategy Pattern to encapsulate family of algorithms and make them interchangeable at runtime.',
    coreConcepts: [
      'Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.',
      'Analogy: Traveling to the airport. You can choose a strategy (algorithm) like driving, taking a taxi, or using the train. The destination is the same, but the execution method changes dynamically based on cost or time constraints.',
      'It adheres strictly to the Open/Closed Principle (OCP): new strategies can be added without modifying the context class.'
    ],
    codeExamples: [
      {
        title: 'Strategy Pattern in E-Commerce Checkout',
        language: 'java',
        code: `// The Strategy Interface
public interface PaymentStrategy {
    void pay(int amount);
}

// Concrete Strategies
public class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) { System.out.println("Paid " + amount + " using Credit Card"); }
}

public class PayPalPayment implements PaymentStrategy {
    public void pay(int amount) { System.out.println("Paid " + amount + " using PayPal"); }
}

// The Context
public class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    
    // Set strategy at runtime
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Identifies that Strategy replaces large switch/if-else statements.',
        'Explains how it promotes composition over inheritance.',
        'Mentions that in Java 8+, Strategy can often be implemented simply using lambdas and standard Functional Interfaces.'
      ],
      juniorOrMidRedFlags: [
        'Confuses Strategy with State pattern (Strategy represents how to do something, State represents what something is).',
        'Implements strategies with hardcoded conditionals inside the context.'
      ],
      seniorDifferentiators: [
        'Shows how to implement a Strategy factory or registry (e.g., using a Map<String, Strategy>) in Spring Boot to dynamically select strategies based on user input.'
      ],
      followUpQuestions: [
        {
          question: 'How would you auto-wire all available strategies into a Map using Spring Boot?',
          answer: 'Spring Boot can automatically inject a Map<String, PaymentStrategy>. The map keys will be the Spring bean names (e.g., "creditCardPayment", "payPalPayment") and the values will be the strategy instances.'
        }
      ]
    },
    tags: ['Design Patterns', 'Strategy', 'Behavioral', 'OOP', 'Clean Code']
  },
  {
    id: 'dp-observer-01',
    category: 'design-patterns',
    categoryName: 'Design Patterns',
    topic: 'Behavioral Patterns',
    title: 'Observer Pattern: Event-Driven Architectures',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding the Observer pattern, publish-subscribe mechanics, and its modern equivalents in reactive programming.',
    coreConcepts: [
      'Observer defines a one-to-many dependency so that when one object changes state, all its dependents are notified and updated automatically.',
      'Analogy: A newspaper subscription. The publisher (Subject) sends new editions to all subscribers (Observers). If a subscriber cancels, they stop receiving updates, but the publisher continues operating normally.',
      'In modern Java, this is heavily used in UI frameworks, Spring ApplicationEvents, and Reactive Streams (Flux/Observable).'
    ],
    codeExamples: [
      {
        title: 'Classic Observer Implementation',
        language: 'java',
        code: `public interface Observer {
    void update(String message);
}

public class TopicSubject {
    private List<Observer> observers = new ArrayList<>();
    private String state;
    
    public void attach(Observer o) { observers.add(o); }
    public void detach(Observer o) { observers.remove(o); }
    
    public void setState(String state) {
        this.state = state;
        notifyObservers();
    }
    
    private void notifyObservers() {
        for (Observer o : observers) {
            o.update(state); // Synchronous notification
        }
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the decoupling of the subject (publisher) and the observers (subscribers).',
        'Understands that standard Observer pattern implementations are synchronous, meaning a slow observer blocks the subject.',
        'Provides real-world examples like UI click listeners or Spring @EventListener.'
      ],
      juniorOrMidRedFlags: [
        'Tightly couples the Subject to specific concrete Observer classes instead of interfaces.',
        'Forgets to manage the list of observers (e.g., not allowing detachment, leading to memory leaks).'
      ],
      seniorDifferentiators: [
        'Explains the "Lapsed Listener Problem" (memory leaks caused by un-removed observers) and how WeakReferences can solve it.',
        'Contrasts Observer with the Pub/Sub pattern (where an event broker/bus sits between publishers and subscribers, like Kafka or RabbitMQ).'
      ],
      followUpQuestions: [
        {
          question: 'What happens if one Observer throws an exception during `update()` in a standard synchronous implementation?',
          answer: 'The exception bubbles up to the Subject, halting the notification loop. Subsequent observers in the list will not receive the update unless the Subject wraps each notification in a try-catch block.'
        }
      ]
    },
    tags: ['Design Patterns', 'Observer', 'Behavioral', 'Events', 'Pub/Sub']
  },
  {
    id: 'dp-factory-01',
    category: 'design-patterns',
    categoryName: 'Design Patterns',
    topic: 'Creational Patterns',
    title: 'Factory Method vs Abstract Factory',
    seniority: 'Junior (1-3 YOE)',
    difficulty: 'Easy',
    summary: 'Distinguishing between the Factory Method and Abstract Factory patterns for object creation encapsulation.',
    coreConcepts: [
      'Factory Method relies on inheritance: a base class defines a method for creating an object, but subclasses decide which class to instantiate.',
      'Abstract Factory relies on composition: it provides an interface for creating families of related or dependent objects without specifying their concrete classes.',
      'Analogy: Factory Method is a single restaurant kitchen making Pizzas (subclasses decide what kind of pizza). Abstract Factory is a furniture manufacturer that produces matching families of chairs, tables, and sofas (Modern vs Victorian styles).'
    ],
    rubric: {
      idealAnswerPoints: [
        'Clearly defines both patterns and when to use each.',
        'Explains that Factories hide complex instantiation logic and promote coding to an interface.',
        'Mentions that Spring\'s BeanFactory is an implementation of the Factory pattern.'
      ],
      juniorOrMidRedFlags: [
        'Cannot explain the difference between the two.',
        'Over-engineers simple object creation where a simple \`new\` keyword would suffice.'
      ],
      seniorDifferentiators: [
        'Discusses how Dependency Injection (IoC containers) has largely replaced the need for custom Abstract Factories in enterprise applications.'
      ],
      followUpQuestions: [
        {
          question: 'How does a Factory differ from the Builder pattern?',
          answer: 'Factory is typically used when you need to create an entire object in one step (often focusing on polymorphism and which subclass to create). Builder is used to construct a complex object step-by-step, allowing for different representations.'
        }
      ]
    },
    tags: ['Design Patterns', 'Factory', 'Abstract Factory', 'Creational']
  },
  {
    id: 'dp-decorator-01',
    category: 'design-patterns',
    categoryName: 'Design Patterns',
    topic: 'Structural Patterns',
    title: 'Decorator Pattern: Dynamic Object Extension',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Using the Decorator pattern to dynamically add responsibilities to objects without modifying their classes (composition over inheritance).',
    coreConcepts: [
      'Decorator attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.',
      'Analogy: Wearing clothes. You are a person (component). You put on a sweater (decorator) to stay warm, and a raincoat (another decorator) over it to stay dry. The base person is unchanged, but their behavior/properties are augmented.',
      'Java I/O is a classic example: \`new BufferedReader(new InputStreamReader(new FileInputStream("data.txt")))\`.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that Decorator uses composition to wrap the original object while implementing the same interface.',
        'Recognizes the Java I/O streams as the canonical example.',
        'Points out that it avoids class explosion (e.g., instead of creating DarkRoastWithMilkAndMocha, you compose them).'
      ],
      juniorOrMidRedFlags: [
        'Suggests using multiple inheritance (which Java doesn\'t support) or deep inheritance trees instead.',
        'Confuses Decorator with Proxy (Proxy controls access to the object, Decorator adds behavior).'
      ],
      seniorDifferentiators: [
        'Contrasts Decorator with Aspect-Oriented Programming (AOP), noting that AOP (like Spring @Transactional) often uses dynamic proxies which act like decorators at runtime.'
      ],
      followUpQuestions: [
        {
          question: 'What is the difference between the Decorator pattern and the Proxy pattern?',
          answer: 'Both wrap an object. However, a Decorator adds new behavior or responsibilities to the object, whereas a Proxy controls access to the object (e.g., lazy loading, access control, or remote network access).'
        }
      ]
    },
    tags: ['Design Patterns', 'Decorator', 'Structural', 'Composition']
  }
];
