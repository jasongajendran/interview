import { QuestionItem } from '../types';

export const uiFrontendQuestions: QuestionItem[] = [
  {
    id: 'ui-01',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'Web Security (CSRF)',
    title: 'Cross-Site Request Forgery (CSRF): Attack Mechanics, SameSite Cookies & Spring Security 6 SPA Defense',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Deep dive into Cross-Site Request Forgery (CSRF) attack execution, browser cookie behavior, Synchronizer Token Pattern, SameSite cookie attributes (Strict, Lax, None), and Spring Security 6 SPA integration.',
    coreConcepts: [
      'CSRF Attack Mechanics: An attacker tricks an authenticated user\'s browser into executing an unauthorized HTTP state-changing request (POST, PUT, DELETE) against a target site where the user currently holds an active session cookie.',
      'Root Cause: Browsers automatically attach ambient credentials (session cookies, HTTP Basic Auth) to cross-origin requests originating from third-party HTML forms, `<img src="...">`, or JavaScript requests.',
      'Synchronizer Token Pattern: Server generates an unpredictable, cryptographically strong token tied to the user session. The client must include this token in a custom header (e.g. `X-XSRF-TOKEN`) or form field. Third-party sites cannot read this token due to the Same-Origin Policy (SOP).',
      'SameSite Cookie Attribute: `SameSite=Strict` (cookie never sent in cross-site requests, even clicking links), `SameSite=Lax` (cookie sent on top-level safe GET navigations, blocked on cross-site POST/PUT), `SameSite=None; Secure` (cookie sent on all cross-site requests, requires HTTPS).',
      'Stateless Bearer JWT vs Cookie Auth: APIs authenticating solely via `Authorization: Bearer <JWT>` stored in non-cookie storage are immune to CSRF because browsers do NOT automatically attach custom headers to cross-site requests. CSRF protection is only necessary when authentication relies on ambient browser cookies.'
    ],
    detailedExplanation: [
      'Step-by-Step CSRF Attack Scenario: 1) Alice logs into `https://bank.com` and receives a session cookie `JSESSIONID=xyz123`. 2) Without logging out, Alice visits `https://malicious-attacker.com`. 3) Attacker page has `<form action="https://bank.com/api/transfer" method="POST"><input name="amount" value="5000"/><input name="recipient" value="attacker"/></form><script>document.forms[0].submit()</script>`. 4) Alice\'s browser submits the POST to `bank.com` and automatically attaches `JSESSIONID=xyz123`. 5) `bank.com` processes the transfer as authentic!',
      'Spring Security 6 SPA Integration: For modern Single Page Applications (React, Angular, Vue), Spring Security 6 provides `CookieCsrfTokenRepository.withHttpOnlyFalse()` and `SpaCsrfTokenRequestHandler`. This writes the CSRF token into a readable `XSRF-TOKEN` cookie, which the SPA reads and attaches to subsequent state-changing requests as the `X-XSRF-TOKEN` HTTP header.'
    ],
    codeExamples: [
      {
        title: 'Spring Security 6 Modern SPA CSRF Configuration & Token Handler',
        language: 'java',
        code: `@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) // Allows SPA to read XSRF-TOKEN cookie
                .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler()) // Handles both plain tokens and Breach-resistant tokens
            )
            .addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class) // Ensures cookie is sent on first GET
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**", "/index.html", "/").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}

/**
 * Filter that forces resolution of the CSRF token so Spring writes the XSRF-TOKEN cookie
 */
final class CsrfCookieFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            // Invoking getToken() ensures the token is rendered and written to the response cookie
            csrfToken.getToken();
        }
        filterChain.doFilter(request, response);
    }
}

/**
 * SPA CSRF Handler compatible with Angular, React Axios, and BREACH defense
 */
final class SpaCsrfTokenRequestHandler extends CsrfTokenRequestAttributeHandler {
    private final CsrfTokenRequestHandler delegate = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
        this.delegate.handle(request, response, csrfToken);
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
        String headerValue = request.getHeader(csrfToken.getHeaderName());
        return (StringUtils.hasText(headerValue)) ? headerValue : this.delegate.resolveCsrfTokenValue(request, csrfToken);
    }
}`
      },
      {
        title: 'React Axios Interceptor for Automatic CSRF Header Attachment',
        language: 'javascript',
        code: `// Axios configuration automatically reads 'XSRF-TOKEN' cookie and sends 'X-XSRF-TOKEN' header
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api.company.com',
    withCredentials: true, // Crucial: Send cookies across origins
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Explicit helper if using custom Fetch API instead of Axios
function getCsrfTokenFromCookie() {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export async function transferFunds(amount, recipient) {
    return apiClient.post('/api/transfer', { amount, recipient });
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the core vulnerability of CSRF: browsers automatically attach session cookies to cross-origin requests.',
        'Explains the Synchronizer Token Pattern and why attackers cannot steal the token due to SOP.',
        'Explains SameSite cookie attributes (Strict, Lax, None; Secure).',
        'Differentiates cookie-based sessions (needs CSRF protection) from stateless Authorization: Bearer JWTs (immune to CSRF).',
        'Demonstrates Spring Security 6 `CookieCsrfTokenRepository.withHttpOnlyFalse()` configuration.'
      ],
      juniorOrMidRedFlags: [
        'Believes HTTPS encrypts away CSRF attacks.',
        'Disables CSRF in Spring Security for a web app that uses session cookies.',
        'Confuses CSRF (forging unauthorized actions) with XSS (executing malicious scripts).'
      ],
      seniorDifferentiators: [
        'Explains BREACH attack mitigation using `XorCsrfTokenRequestAttributeHandler` in Spring Security 6.',
        'Explains Double Submit Cookie pattern and potential subdomain cookie tampering attacks.'
      ],
      followUpQuestions: [
        'Why does `SameSite=Lax` allow cookies on top-level GET navigation links, and can GET requests ever be vulnerable to CSRF?',
        'How does the Backend-For-Frontend (BFF) pattern handle CSRF protection?'
      ]
    },
    tags: ['Security', 'CSRF', 'Spring Security', 'SameSite', 'Cookies', 'Web Security']
  },

  {
    id: 'ui-04',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'Web Security (CORS)',
    title: 'Cross-Origin Resource Sharing (CORS): Same-Origin Policy, Preflight OPTIONS & Spring Boot Security Config',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Deep dive into Same-Origin Policy (SOP), CORS mechanics, Simple vs Preflighted HTTP requests, CORS headers breakdown, and robust Spring Security 6 CORS configuration.',
    coreConcepts: [
      'Same-Origin Policy (SOP): Browser security baseline that restricts scripts running on Origin A (e.g. `http://app.com:80`) from reading responses from Origin B (e.g. `https://api.com:443`). Same origin requires identical Scheme (protocol), Host (domain), and Port.',
      'CORS is NOT Server Security: CORS is a browser-enforced relaxation mechanism that instructs the browser whether frontend JavaScript is permitted to read an API response. CORS provides ZERO protection against backend requests from curl, Postman, or mobile native apps.',
      'Simple Requests: Requests using GET, HEAD, or POST with standard content types (`application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`) and standard headers. The browser sends the request immediately with an `Origin` header.',
      'Preflighted Requests (OPTIONS): Triggered when requests use custom headers (e.g. `Authorization`, `X-Tenant-ID`), HTTP methods other than GET/POST/HEAD (e.g. PUT, DELETE, PATCH), or `Content-Type: application/json`. The browser sends an `OPTIONS` probe before the actual request.',
      'CORS Headers: `Origin`, `Access-Control-Request-Method`, `Access-Control-Request-Headers`, `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials`, `Access-Control-Max-Age`, `Access-Control-Expose-Headers`.'
    ],
    detailedExplanation: [
      'The Preflight Flow: 1) Browser detects `Content-Type: application/json` or `Authorization` header. 2) Browser dispatches an HTTP `OPTIONS` request with `Origin: https://frontend.com`, `Access-Control-Request-Method: POST`, `Access-Control-Request-Headers: authorization,content-type`. 3) Server responds with HTTP 200/204 and headers `Access-Control-Allow-Origin: https://frontend.com`, `Access-Control-Allow-Methods: GET,POST,PUT,DELETE`, `Access-Control-Allow-Headers: *`, `Access-Control-Max-Age: 3600`. 4) Browser verifies server approval and only then sends the actual POST request.',
      'The "Wildcard + Credentials" Fatal Pitfall: If `Access-Control-Allow-Credentials` is set to `true` (to allow cookies or authorization credentials), `Access-Control-Allow-Origin` MUST NOT be `*` (wildcard). Browsers will reject the response immediately. The server must explicitly reflect the requesting origin.',
      'Spring Security Filter Ordering: The CORS filter must execute before Spring Security\'s authentication filters. If an unauthenticated `OPTIONS` preflight request hits an authentication filter first, Spring Security will reject it with HTTP 401/403, and the browser will report a misleading CORS error in the DevTools console.'
    ],
    codeExamples: [
      {
        title: 'Spring Security 6 Production CORS Configuration Source Bean',
        language: 'java',
        code: `@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Enable CORS and attach CorsConfigurationSource
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Explicitly permit preflight OPTIONS
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Explicit allowed origins (NEVER use "*" when allowCredentials = true)
        config.setAllowedOrigins(List.of(
            "https://app.mycompany.com",
            "https://staging.mycompany.com",
            "http://localhost:3000" // Dev frontend
        ));
        
        // Allowed HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // Allowed request headers
        config.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Headers exposed to JavaScript (e.g. for pagination or rate limits)
        config.setExposedHeaders(List.of(
            "X-Total-Count",
            "X-RateLimit-Remaining",
            "Content-Disposition"
        ));
        
        // Allow cookies / authorization credentials across origins
        config.setAllowCredentials(true);
        
        // Cache preflight OPTIONS response for 1 hour (3600 seconds)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}`
      },
      {
        title: 'Controller-Level @CrossOrigin Annotation in Spring Boot',
        language: 'java',
        code: `@RestController
@RequestMapping("/api/reports")
@CrossOrigin(
    origins = {"https://analytics.mycompany.com"},
    methods = {RequestMethod.GET, RequestMethod.POST},
    allowedHeaders = {"Authorization", "Content-Type"},
    exposedHeaders = {"Content-Disposition"},
    maxAge = 1800,
    allowCredentials = "true"
)
public class ReportController {

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadReport() {
        // Business logic...
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=\"annual_report.pdf\"")
            .body(new byte[0]);
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Defines Same-Origin Policy (Protocol, Host, Port must match) and clarifies that CORS relaxes SOP.',
        'Explains that CORS is browser-enforced and does NOT protect backend APIs from non-browser clients (curl, Postman).',
        'Explains Simple vs Preflighted (`OPTIONS`) requests and lists the triggers for preflight.',
        'Explains the rule: `Access-Control-Allow-Origin: *` cannot be combined with `allowCredentials: true`.',
        'Explains `Access-Control-Expose-Headers` for headers custom frontend JS wants to read.',
        'Shows Spring Security 6 `CorsConfigurationSource` setup and filter ordering.'
      ],
      juniorOrMidRedFlags: [
        'Thinks CORS prevents unauthorized users from calling the API via scripts or Postman.',
        'Attempts to fix CORS errors by placing `Access-Control-Allow-Origin: *` on everything, including credentialed endpoints.',
        'Does not understand why the browser sends an `OPTIONS` request before a POST/PUT.'
      ],
      seniorDifferentiators: [
        'Explains why preflight requests fail with 401/403 if CORS filters are placed after authentication filters.',
        'Explains `Access-Control-Max-Age` caching to avoid expensive preflight OPTIONS latency on every API invocation.'
      ],
      followUpQuestions: [
        'If an API returns a 500 Internal Server Error, will the browser display the 500 error or a CORS error if CORS headers are missing from error responses?',
        'How does a Reverse Proxy / API Gateway (e.g. NGINX or Spring Cloud Gateway) handle CORS centralized stripping and injection?'
      ]
    },
    tags: ['Security', 'CORS', 'Spring Security', 'SOP', 'Preflight', 'Web Security']
  },

  {
    id: 'ui-05',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'Web Security (XSS)',
    title: 'Cross-Site Scripting (XSS) Deep Dive: Stored, Reflected, DOM-Based XSS & Content Security Policy (CSP)',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Comprehensive analysis of Cross-Site Scripting (XSS) categories, JavaScript sinks and sources, Content Security Policy (CSP Level 3), output encoding, and OWASP HTML Sanitization in Spring Boot.',
    coreConcepts: [
      'Cross-Site Scripting (XSS): Code injection vulnerability where an attacker injects malicious JavaScript into a trusted web application. The payload executes within the victim\'s browser context with full access to the DOM, session storage, and un-flagged cookies.',
      'Stored (Persistent) XSS: Malicious payload is permanently saved in the database (e.g. user forum comment, profile bio) and served to every user who views the page.',
      'Reflected (Non-Persistent) XSS: Malicious script is reflected off the web server in an immediate HTTP response (e.g. unescaped search parameter in `https://site.com/search?q=<script>...`).',
      'DOM-Based XSS: Vulnerability occurs entirely client-side when client JavaScript consumes an untrusted source (`location.search`, `document.referrer`, `window.name`) and passes it into an unsafe sink (`element.innerHTML`, `document.write()`, `eval()`, `location.href="javascript:..."`).',
      'Content Security Policy (CSP): HTTP response header that restricts where scripts, styles, images, and fonts can load from, and restricts inline script execution via nonces or hashes.',
      'HttpOnly Cookie Flag: Blocks JavaScript `document.cookie` from reading authentication cookies, mitigating session hijacking during an XSS attack.'
    ],
    detailedExplanation: [
      'XSS Impact: Credential theft (exfiltrating `document.cookie` or `localStorage`), keylogging sensitive form inputs, defacing web pages, deploying phishing overlays, or performing unauthorized actions as the user (similar to CSRF, but without CSRF token limitations since the script runs in-origin).',
      'Context-Aware Encoding: Escaping `<` to `&lt;` is sufficient for HTML body context, but INSUFFICIENT for HTML attributes (`<input value="..."/>`), JavaScript contexts (`var id = "...";`), or URL parameters (`href="..."`). OWASP Java Encoder provides distinct encoding methods for each context.',
      'HTML Sanitization vs Encoding: When users must submit rich text (formatted HTML from a WYSIWYG editor), you cannot simply encode. You must sanitize the HTML using a strict allowlist library (e.g. Jsoup or OWASP Java HTML Sanitizer) that strips `<script>`, `onerror=`, `onload=`, `javascript:` URLs, and dangerous tags.'
    ],
    codeExamples: [
      {
        title: 'Spring Security 6 Content Security Policy (CSP) with Nonces',
        language: 'java',
        code: `@Configuration
@EnableWebSecurity
public class CspSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    // Strict CSP Level 3 policy
                    .policyDirectives(
                        "default-src 'self'; " +
                        "script-src 'self' 'strict-dynamic' https://apis.google.com; " +
                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                        "font-src 'self' https://fonts.gstatic.com; " +
                        "img-src 'self' data: https://images.company.com; " +
                        "object-src 'none'; " +
                        "base-uri 'self'; " +
                        "frame-ancestors 'none'; " + // Clickjacking protection (replaces X-Frame-Options)
                        "form-action 'self';"
                    )
                )
                .frameOptions(frame -> frame.deny())
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000) // 1 year HSTS
                )
            );

        return http.build();
    }
}`
      },
      {
        title: 'OWASP HTML Sanitizer & Jsoup Input Sanitization in Spring Boot',
        language: 'java',
        code: `@Service
public class RichContentService {

    // Jsoup Safelist allowing safe rich-text formatting only
    private static final Safelist SAFE_HTML_POLICY = Safelist.relaxed()
            .removeTags("script", "object", "embed", "iframe", "style", "form", "input")
            .removeProtocols("a", "href", "javascript", "data")
            .addProtocols("a", "href", "http", "https", "mailto");

    public String sanitizeUserHtml(String untrustedHtml) {
        if (untrustedHtml == null) return null;
        
        // Strips any malicious <script>, onclick attributes, or javascript: pseudo-protocols
        String cleanHtml = Jsoup.clean(untrustedHtml, SAFE_HTML_POLICY);
        return cleanHtml;
    }

    public String encodeForContexts(String untrustedInput) {
        // OWASP Java Encoder for different injection contexts
        String htmlBodySafe = Encode.forHtml(untrustedInput);
        String htmlAttrSafe = Encode.forHtmlAttribute(untrustedInput);
        String jsStringSafe = Encode.forJavaScript(untrustedInput);
        String uriParamSafe = Encode.forUriComponent(untrustedInput);
        
        return htmlBodySafe;
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates Stored XSS, Reflected XSS, and DOM-Based XSS with attack vectors.',
        'Explains why `HttpOnly` cookie flag is crucial for mitigating session hijacking via XSS.',
        'Explains Content Security Policy (CSP) directives and how nonces work.',
        'Explains why contextual encoding is required (HTML vs Attribute vs JavaScript context).',
        'Demonstrates HTML Sanitization with Jsoup / OWASP Sanitizer for rich text.'
      ],
      juniorOrMidRedFlags: [
        'Believes regex string replacement of `<script>` tags is a safe defense against XSS (bypassed by `<img src=x onerror=alert(1)>`).',
        'Confuses XSS with SQL Injection or CSRF.',
        'Uses `dangerouslySetInnerHTML` in React with raw user input without sanitization.'
      ],
      seniorDifferentiators: [
        'Explains DOM-based XSS sinks (`element.innerHTML`, `eval()`, `document.write()`) and sources (`window.location`, `document.referrer`).',
        'Discusses Trusted Types API (W3C standard) in modern browsers to prevent DOM XSS.'
      ],
      followUpQuestions: [
        'Why does React provide built-in XSS protection for `{userInput}`, and when can an XSS vulnerability still occur in React?',
        'What is the difference between CSP `report-only` mode and active enforcement?'
      ]
    },
    tags: ['Security', 'XSS', 'CSP', 'Content Security Policy', 'Sanitization', 'Web Security']
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
  },
  {
    id: 'ui-angular-01',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'Angular',
    title: 'Angular Architecture & Lifecycle Hooks',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Understanding Angular modules (NgModules), components, services, dependency injection, and component lifecycle hooks (e.g., ngOnInit, ngOnDestroy).',
    coreConcepts: [
      'Angular uses a component-based architecture backed by a powerful Dependency Injection (DI) system.',
      'Lifecycle hooks allow tapping into key moments of a component: creation, rendering, data-binding changes, and destruction.',
      'RxJS Observables are heavily used for async operations (HTTP, EventEmitters) and must be unsubscribed (often in ngOnDestroy or via AsyncPipe) to prevent memory leaks.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the difference between ngOnInit (after data-bound properties are initialized) and constructor (class instantiation).',
        'Describes how the Hierarchical Dependency Injection works.',
        'Mentions the async pipe as a best practice for managing Observable subscriptions.'
      ],
      juniorOrMidRedFlags: [
        'Confuses Angular (2+) with AngularJS (1.x).',
        'Fails to mention memory leaks caused by not unsubscribing from Observables.'
      ],
      seniorDifferentiators: [
        'Discusses Change Detection strategies (Default vs OnPush) for performance optimization.',
        'Explains standalone components introduced in modern Angular.'
      ],
      followUpQuestions: [
        'How does ChangeDetectionStrategy.OnPush improve Angular application performance?'
      ]
    },
    tags: ['Angular', 'TypeScript', 'RxJS', 'Lifecycle Hooks', 'Dependency Injection']
  },
  {
    id: 'ui-jquery-01',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'jQuery',
    title: 'jQuery vs Modern Frameworks',
    seniority: 'Junior (1-3 YOE)',
    difficulty: 'Easy',
    summary: 'Understanding the historical context of jQuery, direct DOM manipulation, and why modern SPAs moved to declarative frameworks (React, Angular).',
    coreConcepts: [
      'jQuery normalizes cross-browser incompatibilities and simplifies direct DOM traversal and manipulation.',
      'Modern frameworks (React, Angular, Vue) use Declarative UI and Virtual/Incremental DOM paradigms, making jQuery largely obsolete for new projects.',
      'Mixing direct DOM manipulation (jQuery) inside a declarative framework (like React) often leads to state inconsistencies and bugs.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Identifies jQuery as an imperative library for DOM manipulation.',
        'Explains that modern JS (ES6+) and standard APIs (fetch, querySelector) have replaced most of jQuery\'s utility.',
        'Understands the danger of mixing jQuery plugins with React/Angular components.'
      ],
      juniorOrMidRedFlags: [
        'Recommends using jQuery for new enterprise single-page applications.',
        'Cannot explain the difference between imperative DOM updates and declarative state-driven UIs.'
      ],
      seniorDifferentiators: [
        'Explains how to safely wrap a legacy jQuery plugin inside a React useEffect or Angular component lifecycle hook if absolutely necessary.'
      ],
      followUpQuestions: [
        'Why might a company still have jQuery in their enterprise stack today?'
      ]
    },
    tags: ['jQuery', 'DOM', 'JavaScript', 'Frontend Architecture']
  },
  {
    id: 'ui-json-01',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'JSON',
    title: 'JSON Syntax, Serialization & Security',
    seniority: 'Junior (1-3 YOE)',
    difficulty: 'Easy',
    summary: 'Core understanding of JSON (JavaScript Object Notation), parsing, stringification, and common pitfalls like trailing commas or cyclic references.',
    coreConcepts: [
      'JSON requires double quotes for strings and property names (single quotes are invalid).',
      'JSON does not support functions, undefined, or comments natively.',
      'JSON.stringify() fails with a TypeError when encountering circular object references.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the difference between a JavaScript object literal and a JSON string.',
        'Knows about JSON.parse() and JSON.stringify().',
        'Identifies limitations (no Date types, no comments, strictly double quotes).'
      ],
      juniorOrMidRedFlags: [
        'Believes JSON supports comments or trailing commas natively.',
        'Confuses JSON with XML or YAML.'
      ],
      seniorDifferentiators: [
        'Explains JSON hijacking or how large numbers (e.g. 64-bit IDs from Twitter) can lose precision in JavaScript (requiring BigInt or string representation).',
        'Discusses the reviver and replacer functions in JSON.parse and JSON.stringify.'
      ],
      followUpQuestions: [
        'How do you handle parsing a JSON payload containing an ID like 9007199254740993 which exceeds Number.MAX_SAFE_INTEGER?'
      ]
    },
    tags: ['JSON', 'Serialization', 'JavaScript', 'Data Formats']
  },
  {
    id: 'ui-a11y-01',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'Accessibility (A11y)',
    title: 'Web Accessibility: WCAG AA/AAA Standards & ARIA',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Medium',
    summary: 'Evaluating knowledge of WCAG (Web Content Accessibility Guidelines) AA/AAA standards, semantic HTML, ARIA attributes, and testing tools.',
    coreConcepts: [
      'WCAG AA is the standard legal target for most enterprise and public applications; AAA is the highest and strictest level.',
      'Semantic HTML (e.g., <button>, <nav>, <main>) natively provides accessibility benefits that <div> and <span> lack.',
      'ARIA (Accessible Rich Internet Applications) attributes (e.g., aria-hidden, aria-live, aria-label) supplement HTML to communicate dynamic states to screen readers.',
      'Color contrast ratio minimums (e.g., 4.5:1 for normal text under AA) and keyboard navigability are crucial.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Defines what WCAG is and the difference between AA and AAA compliance.',
        'Explains the first rule of ARIA: "No ARIA is better than bad ARIA" (use semantic HTML first).',
        'Mentions testing tools like axe-core, Lighthouse, or VoiceOver/NVDA screen readers.'
      ],
      juniorOrMidRedFlags: [
        'Treats accessibility as an afterthought or only about adding alt text to images.',
        'Uses onClick on a <div> without tabindex or keyboard event handlers.'
      ],
      seniorDifferentiators: [
        'Explains how to handle focus trapping in modal dialogs to prevent screen readers from reading background content.',
        'Discusses aria-live regions for dynamic single-page application route changes or toast notifications.'
      ],
      followUpQuestions: [
        'How would you make a custom-built dropdown component fully accessible to a keyboard and screen reader user?'
      ]
    },
    tags: ['Accessibility', 'A11y', 'WCAG', 'ARIA', 'Semantic HTML']
  },
  {
    id: 'ui-dos-01',
    category: 'ui-frontend',
    categoryName: 'UI Technologies & Web Security',
    topic: 'Web Security (DoS)',
    title: 'Denial of Service (DoS & DDoS) Concepts and Mitigation',
    seniority: 'Senior (7+ YOE)',
    difficulty: 'Hard',
    summary: 'Understanding Denial of Service (DoS) and Distributed Denial of Service (DDoS) attacks at the application layer, and how to defend against them.',
    coreConcepts: [
      'DoS attempts to overwhelm a system\'s resources (CPU, Memory, Network bandwidth, Database connections) making it unavailable to legitimate users.',
      'DDoS utilizes a distributed botnet to launch the attack from thousands of IPs.',
      'Application Layer (Layer 7) DDoS attacks target specific expensive API endpoints (e.g., complex search queries, PDF generation, or login brute-forcing).'
    ],
    rubric: {
      idealAnswerPoints: [
        'Distinguishes between network/transport layer DDoS (SYN floods, UDP reflection) and application layer (Layer 7) HTTP floods.',
        'Provides examples of mitigation: Rate Limiting, WAF (Web Application Firewall), CAPTCHAs, and CDN caching (Cloudflare).',
        'Gives an example of an application-layer DoS (e.g., repeatedly requesting a slow database search or uploading massive files to exhaust disk/memory).'
      ],
      juniorOrMidRedFlags: [
        'Confuses DoS with data breach vulnerabilities like SQL Injection or XSS.',
        'Believes a simple application-level IF statement can stop a massive volumetric DDoS attack.'
      ],
      seniorDifferentiators: [
        'Discusses asymmetric resource consumption (a small HTTP request that takes the backend 5 seconds and 1GB of RAM to process).',
        'Mentions exponential backoff, circuit breakers, and autoscaling as architectural defenses.'
      ],
      followUpQuestions: [
        'How would you implement rate limiting on a public login endpoint to prevent brute-force DoS without locking out an entire corporate office sharing a single NAT IP?'
      ]
    },
    tags: ['Security', 'DoS', 'DDoS', 'Rate Limiting', 'WAF']
  }
];
