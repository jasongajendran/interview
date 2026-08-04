import { QuestionItem } from '../types';

export const uiFrontendQuestions: QuestionItem[] = [
  {
    id: 'ui-01',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'Web Security (XSS & CSRF)',
    title: 'Cross-Site Scripting (XSS) vs Cross-Site Request Forgery (CSRF) & Enterprise Defenses',
    seniority: 'Lead / Architect (13-15+ YOE)',
    difficulty: 'Architect-Level',
    summary: 'Distinguishing Stored/Reflected/DOM XSS from CSRF, SameSite cookie attributes, Content Security Policy (CSP), Anti-CSRF Synchronizer Tokens, and JWT implications.',
    coreConcepts: [
      'XSS (Cross-Site Scripting): Attacker injects malicious JavaScript into a trusted web application. The script executes in the victim browser with access to DOM, session storage, and un-protected cookies.',
      'CSRF (Cross-Site Request Forgery): Attacker tricks an authenticated user into executing unwanted actions on a web app where they are currently authenticated via automatic browser cookie transmission.',
      'Defense for XSS: Contextual output encoding (HTML, JS, URL), Content Security Policy (CSP headers), HttpOnly cookies (prevents document.cookie access).',
      'Defense for CSRF: SameSite=Strict/Lax cookie attribute, Synchronizer Token Pattern (CSRF token header), Double-Submit Cookie pattern.'
    ],
    detailedExplanation: [
      'XSS steals credentials or manipulates the page directly in the victim session. CSRF exploits the browser default behavior of attaching session cookies to cross-origin requests.',
      'In pure stateless REST APIs authenticated via Authorization: Bearer <JWT> stored in memory or non-cookie storage, CSRF is impossible because browsers never attach custom HTTP headers automatically to third-party image/form requests.'
    ],
    codeExamples: [
      {
        title: 'Spring Security 6 CSP Header and SameSite Cookie Configuration',
        language: 'java',
        code: `// Content Security Policy (CSP) against XSS
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp
        .policyDirectives("default-src 'self'; script-src 'self' https://trustedscripts.com; object-src 'none';")
    )
);

// Secure Cookie with SameSite=Strict against CSRF
ResponseCookie cookie = ResponseCookie.from("SESSIONID", sessionId)
    .httpOnly(true)       // Blocks JavaScript XSS access
    .secure(true)         // Only transmitted over HTTPS
    .sameSite("Strict")   // Prevents browser from sending in third-party contexts
    .path("/")
    .maxAge(Duration.ofHours(2))
    .build();`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates XSS (arbitrary JS execution in victim context) from CSRF (unauthorized action forged via victim session cookies).',
        'Explains HttpOnly flag for mitigating cookie theft via XSS.',
        'Explains SameSite=Lax/Strict and CSRF tokens for mitigating CSRF.',
        'Explains why stateless Bearer token APIs do not require CSRF protection.'
      ],
      juniorOrMidRedFlags: [
        'Confuses XSS with CSRF.',
        'Believes HTTPS protects against XSS or CSRF.'
      ],
      seniorDifferentiators: [
        'Explains DOM-based XSS vs Server-side Reflected XSS.',
        'Explains Subresource Integrity (SRI) for third-party CDN scripts.'
      ],
      followUpQuestions: [
        'What is the security risk of storing JWT tokens in browser localStorage vs HttpOnly cookies?'
      ]
    },
    tags: ['Security', 'XSS', 'CSRF', 'SameSite', 'CSP', 'Cookies']
  },
  {
    id: 'ui-02',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'JavaScript Internals',
    title: 'JavaScript Closures, Event Delegation & The Browser Event Loop',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Lexical scoping, memory retention in closures, event bubbling and capturing, dynamic event delegation for thousands of list elements, and microtasks vs macrotasks.',
    coreConcepts: [
      'Closure: A function bundled together with references to its surrounding state (lexical environment), retaining access to outer variables even after the outer function has returned.',
      'Event Bubbling: An event triggered on a child node propagates upward through ancestors (target -> parent -> document -> window).',
      'Event Delegation: Attaching a single event listener to a parent container to manage events from dynamically added child elements using e.target and closest().',
      'Event Loop: Synchronous call stack -> Microtask queue (Promises, MutationObserver, queueMicrotask) -> Macrotask queue (setTimeout, setInterval, I/O).'
    ],
    detailedExplanation: [
      'Event delegation avoids attaching thousands of event listeners to individual table rows or list items, reducing browser memory usage and garbage collection overhead.',
      'In the Event Loop, the microtask queue is completely drained after every call stack execution before the next macrotask is picked up.'
    ],
    codeExamples: [
      {
        title: 'Event Delegation on Dynamic DOM List',
        language: 'javascript',
        code: `// Single listener on parent container handles unlimited dynamic child items
const userTable = document.getElementById('userTableBody');

userTable.addEventListener('click', function(event) {
    // Find closest button with action attribute
    const actionBtn = event.target.closest('button[data-action]');
    if (!actionBtn) return;

    const row = actionBtn.closest('tr');
    const userId = row.getAttribute('data-user-id');
    const action = actionBtn.getAttribute('data-action');

    if (action === 'delete') {
        console.log('Deleting user ID:', userId);
        row.remove();
    } else if (action === 'edit') {
        console.log('Editing user ID:', userId);
    }
});`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains closures and lexical scope retention.',
        'Explains event bubbling and event delegation with e.target.closest().',
        'Explains Microtasks (Promise.then) vs Macrotasks (setTimeout) execution priority in the browser event loop.'
      ],
      juniorOrMidRedFlags: [
        'Attaches click listeners in a loop to every single dynamic table cell.',
        'Cannot explain the order of execution between Promise.then and setTimeout.'
      ],
      seniorDifferentiators: [
        'Explains potential memory leaks in JavaScript closures when large DOM references are unintentionally captured.'
      ],
      followUpQuestions: [
        'What will be the output order of: console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4)?'
      ]
    },
    tags: ['JavaScript', 'Closures', 'Event Delegation', 'Event Loop', 'DOM']
  },
  {
    id: 'ui-03',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'CSS Layouts & Responsive Design',
    title: 'CSS Flexbox vs CSS Grid: Architectural Decision Matrix',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'One-dimensional content-first layouts (Flexbox) vs two-dimensional layout-first grids (CSS Grid), responsive cards, and layout shift prevention.',
    coreConcepts: [
      'CSS Flexbox: One-dimensional layout model (row OR column). Ideal for distributing space and aligning items along a single axis (navbars, button groups, centering).',
      'CSS Grid: Two-dimensional layout model (rows AND columns simultaneously). Ideal for page layouts, dashboard bento grids, and complex card systems.',
      'Auto-fit vs Auto-fill: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) creates fully responsive grid cards without media queries.'
    ],
    detailedExplanation: [
      'Use Flexbox when you care about the content sizing of individual items. Use CSS Grid when you want strict, deterministic alignment of elements across both vertical and horizontal tracks.',
      'Subgrid (CSS Grid Level 2) allows nested child elements to align directly with the parent grid tracks (e.g. aligning card footers across cards of varying text height).'
    ],
    codeExamples: [
      {
        title: 'Modern Responsive CSS Grid Layout',
        language: 'javascript',
        code: `/* Responsive Dashboard Card Grid without Media Queries */
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    align-items: stretch;
}

/* Flexbox Header with Spacing Alignment */
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates 1D (Flexbox) from 2D (Grid).',
        'Demonstrates repeat(auto-fit, minmax(...)) for responsive grid generation.',
        'Explains CSS box-sizing: border-box and Core Web Vitals (CLS - Cumulative Layout Shift).'
      ],
      juniorOrMidRedFlags: [
        'Uses float: left or HTML tables for page layouts.',
        'Does not know how to center a div in modern CSS.'
      ],
      seniorDifferentiators: [
        'Explains CSS Subgrid for multi-card button alignment.'
      ],
      followUpQuestions: [
        'How does specifying width and height on <img> tags prevent Cumulative Layout Shift (CLS)?'
      ]
    },
    tags: ['CSS', 'Flexbox', 'CSS Grid', 'Responsive Design', 'Web Vitals']
  }
];
