import { QuestionItem } from '../types';

export const legacyWebQuestions: QuestionItem[] = [
  {
    id: 'legacy-02',
    category: 'legacy-web',
    categoryName: 'JSF & FreeMarker (FTL)',
    topic: 'JSP',
    title: 'JSP (JavaServer Pages) Basics & JSTL',
    seniority: 'Mid-Level (4-6 YOE)',
    difficulty: 'Easy',
    summary: 'Understanding the lifecycle of JSP and the use of JSTL/EL to avoid scriptlets.',
    coreConcepts: [
      'JSP is a server-side technology that gets compiled into a Java Servlet on the first request.',
      'Scriptlets (`<% java code %>`) are highly discouraged because they mix business logic with presentation.',
      'JSTL (JSP Standard Tag Library) and EL (Expression Language, `${user.name}`) should be used for rendering logic.'
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains that a JSP is ultimately just a Servlet.',
        'Mentions the separation of concerns (MVC) and why scriptlets are bad.',
        'Knows about JSTL tags like `<c:forEach>` and `<c:if>`.'
      ],
      juniorOrMidRedFlags: [
        'Recommends using JSP for a brand new application in 2024.'
      ],
      seniorDifferentiators: [
        'Explains the performance cost of the first JSP compilation and how to precompile JSPs.'
      ],
      followUpQuestions: [
        'What are the 9 implicit objects in a JSP?'
      ]
    },
    tags: ['JSP', 'JSTL', 'Servlets']
  },

  {
    id: 'jsf-01',
    category: 'legacy-web',
    categoryName: 'JSF & FreeMarker (FTL)',
    topic: 'JSF Lifecycle & Troubleshooting',
    title: 'The 6 Phases of the JSF Lifecycle & Phase-by-Phase Debugging',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Detailed mechanics of Restore View, Apply Request Values, Process Validations, Update Model Values, Invoke Application, and Render Response, and what happens when validations fail.',
    coreConcepts: [
      '1. Restore View: Builds or restores the UI component tree (UIViewRoot) from session/token.',
      '2. Apply Request Values: Iterates over components; decodes incoming HTTP request parameters to local submitted values.',
      '3. Process Validations: Runs custom & standard validators and converters. If any validation fails (facesContext.isValidationFailed()), JSF immediately jumps directly to Phase 6 (Render Response), skipping phases 4 and 5.',
      '4. Update Model Values: Copies validated values from UI components into backing bean properties.',
      '5. Invoke Application: Executes action listeners and business action methods (e.g. submitForm()).',
      '6. Render Response: Encodes the component tree into HTML / XML / AJAX response.'
    ],
    detailedExplanation: [
      'A classic bug in JSF is an action method in Phase 5 not being called. The root cause is almost always a silent validation failure or conversion error in Phase 3 causing immediate jump to Phase 6.',
      'Immediate Attribute: Setting immediate="true" on a command button forces action execution in Phase 2 (Apply Request Values), bypassing validations in Phase 3 (useful for Cancel buttons).'
    ],
    codeExamples: [
      {
        title: 'PhaseListener for Debugging JSF Request Lifecycle',
        language: 'java',
        code: `import javax.faces.event.*;

public class LifecycleDebugListener implements PhaseListener {

    @Override
    public void beforePhase(PhaseEvent event) {
        System.out.println(">> [START PHASE " + event.getPhaseId().getOrdinal() + "]: " + event.getPhaseId());
    }

    @Override
    public void afterPhase(PhaseEvent event) {
        System.out.println("<< [END PHASE " + event.getPhaseId().getOrdinal() + "]: " + event.getPhaseId());
        if (event.getPhaseId() == PhaseId.PROCESS_VALIDATIONS) {
            if (event.getFacesContext().isValidationFailed()) {
                System.err.println("!! Validation Failed in Phase 3! Skipping to Phase 6 (Render Response).");
            }
        }
    }

    @Override
    public PhaseId getPhaseId() {
        return PhaseId.ANY_PHASE;
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Names all 6 phases in exact chronological sequence.',
        'Explains the short-circuit jump from Phase 3 to Phase 6 upon validation/conversion failure.',
        'Explains the purpose of the immediate="true" attribute on buttons and input fields.',
        'Explains PhaseListener debugging technique.'
      ],
      juniorOrMidRedFlags: [
        'Cannot name the phases.',
        'Does not know why backing bean properties were not updated when an action failed to trigger.'
      ],
      seniorDifferentiators: [
        'Explains Partial State Saving (PSS) in JSF 2.x and how state is preserved in client vs server.'
      ],
      followUpQuestions: [
        'How does `<f:ajax execute="@this" render="panel"/>` alter which components participate in phases 2-5?'
      ]
    },
    tags: ['JSF', 'JSF Lifecycle', 'PhaseListener', 'Troubleshooting']
  },
  {
    id: 'jsf-02',
    category: 'legacy-web',
    categoryName: 'JSF & FreeMarker (FTL)',
    topic: 'JSF Scopes & CDI',
    title: 'JSF Scopes: RequestScoped vs ViewScoped vs SessionScoped & ManagedBean vs CDI @Named',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Scope lifecycle boundaries, ViewScoped memory semantics for AJAX, and migrating deprecated javax.faces.bean.ManagedBean to Jakarta CDI (@Named).',
    coreConcepts: [
      '@RequestScoped: Lives for a single HTTP request-response cycle.',
      '@ViewScoped: Lives as long as the user remains on the same JSF view/page across multiple AJAX postbacks. Destroyed when navigating to a different view.',
      '@SessionScoped: Lives across all requests for a given HTTP session; must implement java.io.Serializable.',
      '@ApplicationScoped: Single instance shared across all users and sessions.',
      '@ManagedBean (javax.faces.bean) is deprecated since JSF 2.3; modern JSF uses CDI @Named from jakarta.enterprise.context.'
    ],
    detailedExplanation: [
      '@ViewScoped is ideal for rich AJAX forms (data tables, sorting, pagination) because bean state is preserved without polluting the broader HTTP Session.',
      'CDI ViewScoped requires import org.apache.myfaces.cdi.view.ViewScoped or jakarta.faces.view.ViewScoped, NOT the legacy JSF annotation.'
    ],
    codeExamples: [
      {
        title: 'Modern CDI @Named Backing Bean with ViewScope',
        language: 'java',
        code: `import jakarta.enterprise.context.RequestScoped;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Named;
import java.io.Serializable;
import java.util.*;

@Named("accountManager")
@ViewScoped // Preserved across AJAX postbacks on the same page
public class AccountManagerBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private String searchKeyword;
    private List<String> results = new ArrayList<>();

    public void performAjaxSearch() {
        System.out.println("Searching for: " + searchKeyword);
        results = List.of("Account #1001", "Account #1002", "Account #1003");
    }

    // Getters and Setters
    public String getSearchKeyword() { return searchKeyword; }
    public void setSearchKeyword(String searchKeyword) { this.searchKeyword = searchKeyword; }
    public List<String> getResults() { return results; }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains the specific lifecycle of @ViewScoped (persists across AJAX postbacks on same view).',
        'Explains why @ManagedBean is deprecated and advocates CDI @Named.',
        'Explains why SessionScoped and ViewScoped beans must implement Serializable.'
      ],
      juniorOrMidRedFlags: [
        'Puts everything in @SessionScoped causing memory bloat and concurrency issues.',
        'Mixes JSF @ManagedBean with CDI @Inject.'
      ],
      seniorDifferentiators: [
        'Explains ConversationScoped (CDI) with begin() and end() boundaries for multi-page wizard flows.'
      ],
      followUpQuestions: [
        'What causes a ViewScoped bean to be prematurely garbage-collected or recreated?'
      ]
    },
    tags: ['JSF', 'CDI', 'Scopes', 'ViewScoped', 'PrimeFaces']
  },
  {
    id: 'jsf-03',
    category: 'legacy-web',
    categoryName: 'JSF & FreeMarker (FTL)',
    topic: 'PrimeFaces & AJAX Processing',
    title: 'PrimeFaces AJAX Architecture: process vs update (execute vs render)',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Controlling JSF lifecycle phases for partial requests: process (which inputs are decoded/validated) vs update (which HTML elements are re-rendered).',
    coreConcepts: [
      'process (standard JSF execute): Defines which components are processed through Lifecycle Phases 2-5 (Apply Values -> Validate -> Update Model).',
      'update (standard JSF render): Defines which components in the DOM are refreshed with new HTML during Phase 6 (Render Response).',
      'Keywords: @this (only current component), @form (entire enclosing form), @none, @all.'
    ],
    detailedExplanation: [
      'If you only want to submit a single input field on change, use <p:ajax event="change" process="@this" update="errorMsg targetPanel" />. This avoids triggering validation errors on unrelated inputs in the same form.',
      'Partial view updates prevent full page flickers and reduce network payload size by transmitting only XML fragments containing updated HTML.'
    ],
    codeExamples: [
      {
        title: 'PrimeFaces AJAX Partial Processing in XHTML',
        language: 'xml',
        code: `<h:form id="customerForm">
    <!-- Input 1: Country selector with dependent state dropdown -->
    <p:outputLabel for="country" value="Country:" />
    <p:selectOneMenu id="country" value="#{locationBean.selectedCountry}">
        <f:selectItems value="#{locationBean.countries}" />
        <!-- Partial process @this country, update only the state dropdown -->
        <p:ajax event="change" 
                process="@this" 
                update="statePanel" 
                listener="#{locationBean.onCountryChange}" />
    </p:selectOneMenu>

    <!-- Dependent State Panel -->
    <h:panelGroup id="statePanel">
        <p:outputLabel for="state" value="State/Province:" />
        <p:selectOneMenu id="state" value="#{locationBean.selectedState}">
            <f:selectItems value="#{locationBean.availableStates}" />
        </p:selectOneMenu>
    </h:panelGroup>

    <!-- Submit entire form -->
    <p:commandButton value="Save" 
                     action="#{locationBean.save}" 
                     process="@form" 
                     update="@form" />
</h:form>`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates process (backend lifecycle processing) from update (frontend DOM rerendering).',
        'Explains how process="@this" prevents validation errors on other empty form fields.',
        'Explains standard JSF equivalents: execute and render.'
      ],
      juniorOrMidRedFlags: [
        'Cannot distinguish between process and update.',
        'Always uses update="@all" causing full UI re-renders.'
      ],
      seniorDifferentiators: [
        'Explains PrimeFaces RequestContext / PrimeFaces.current().ajax().update() programmatic AJAX updates from Java beans.'
      ],
      followUpQuestions: [
        'How do you update a component located outside the current form using PrimeFaces search expressions?'
      ]
    },
    tags: ['PrimeFaces', 'AJAX', 'JSF', 'process', 'update']
  },
  {
    id: 'jsf-04',
    category: 'legacy-web',
    categoryName: 'JSF & FreeMarker (FTL)',
    topic: 'JSF Exceptions & State Management',
    title: 'ViewExpiredException: Root Causes, Prevention & Graceful Handling',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Session timeouts, client-side state loss, back-button caching, and implementing custom ExceptionHandlerWrapper for user-friendly redirects.',
    coreConcepts: [
      'ViewExpiredException occurs when a user submits a stateful POST request for a view whose server-side state token has expired or been evicted from HTTP session.',
      'Causes: HTTP session timeout, browser back-button after logout, cluster without sticky sessions, server restart.',
      'Mitigation: Configure reasonable session timeout, use Stateless Views (transient="true" in JSF 2.2+), use GET navigation with <h:link>, implement custom ExceptionHandlerWrapper.'
    ],
    detailedExplanation: [
      'By default, JSF stores the component tree in the server session. When the session expires, JSF cannot find the view state and throws ViewExpiredException during Phase 1 (Restore View).',
      'In web.xml, configure javax.faces.STATE_SAVING_METHOD to client (stores encrypted state in hidden input) or configure an error-page handler.'
    ],
    codeExamples: [
      {
        title: 'Custom ExceptionHandler for ViewExpiredException in JSF',
        language: 'java',
        code: `import javax.faces.FacesException;
import javax.faces.application.ViewExpiredException;
import javax.faces.context.*;
import javax.faces.event.*;
import java.io.IOException;
import java.util.Iterator;

public class ViewExpiredExceptionHandler extends ExceptionHandlerWrapper {
    private final ExceptionHandler wrapped;

    public ViewExpiredExceptionHandler(ExceptionHandler wrapped) {
        this.wrapped = wrapped;
    }

    @Override
    public ExceptionHandler getWrapped() { return wrapped; }

    @Override
    public void handle() throws FacesException {
        Iterator<ExceptionQueuedEvent> events = getUnhandledExceptionQueuedEvents().iterator();
        while (events.hasNext()) {
            ExceptionQueuedEvent event = events.next();
            ExceptionQueuedEventContext context = (ExceptionQueuedEventContext) event.getSource();
            Throwable t = context.getException();

            if (t instanceof ViewExpiredException) {
                FacesContext fc = FacesContext.getCurrentInstance();
                try {
                    // Redirect to login or session timeout landing page
                    fc.getExternalContext().redirect(fc.getExternalContext().getRequestContextPath() + "/session-expired.xhtml");
                    fc.responseComplete();
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    events.remove(); // Mark handled
                }
            }
        }
        wrapped.handle();
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains why ViewExpiredException happens during Restore View phase after session expiration.',
        'Explains server vs client state saving trade-offs.',
        'Provides practical solution: Custom ExceptionHandlerFactory / ExceptionHandlerWrapper redirecting to timeout page.'
      ],
      juniorOrMidRedFlags: [
        'Thinks ViewExpiredException is a simple null pointer bug in code.',
        'Unaware of session state mechanics.'
      ],
      seniorDifferentiators: [
        'Mentions JSF 2.2 Stateless Views (`<f:view transient="true">`) for static or stateless landing pages.'
      ],
      followUpQuestions: [
        'How do you configure clustered session replication to prevent ViewExpiredException in load-balanced environments?'
      ]
    },
    tags: ['JSF', 'ViewExpiredException', 'Exception Handling', 'Session Management']
  },
  {
    id: 'ftl-01',
    category: 'legacy-web',
    categoryName: 'JSF & FreeMarker (FTL)',
    topic: 'FreeMarker (FTL) Architecture',
    title: 'FreeMarker Macros vs Functions vs Custom Directives & Template Inheritance',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Hard',
    summary: 'Building reusable UI components and dynamic email templates using FreeMarker <#macro>, <#function>, <#nested>, and custom Java TemplateDirectiveModel.',
    coreConcepts: [
      '<#macro name param1 param2=default>: Reusable block that outputs formatted markup/text; invoked with <@name param1=val />.',
      '<#function name param>: Pure computation that calculates and returns a value using <#return value>; invoked as an expression (e.g. \${calc(x)}).',
      '<#nested>: Placeholder inside a macro where the caller body content is injected (similar to component children / transclusion).',
      'TemplateDirectiveModel: Java interface to create custom Java-powered tags with access to the FreeMarker Environment and output Writer.'
    ],
    detailedExplanation: [
      'Macros are designed for rendering output (HTML/email snippets). Functions are designed for mathematical or string calculations without directly writing to the output stream.',
      'Template inheritance in FTL is implemented using a base layout macro (e.g. <@layout.mainLayout title="Dashboard"> ... </@layout.mainLayout>).'
    ],
    codeExamples: [
      {
        title: 'FreeMarker Macro with <#nested> and Default Parameters',
        language: 'freemarker',
        code: `<!-- macros/ui_components.ftl -->
<#macro alertBox type="info" dismissible=true>
    <div class="alert alert-\${type} <#if dismissible>alert-dismissible</#if>">
        <#if dismissible>
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </#if>
        <strong><#if type == "danger">Error!<#else>Notice:</#if></strong>
        <!-- Injects caller body content -->
        <#nested>
    </div>
</#macro>

<!-- Usage in Page Template -->
<#import "macros/ui_components.ftl" as ui>

<@ui.alertBox type="danger" dismissible=true>
    Your payment of \${amount?string.currency} failed to process. Please update your billing info.
</@ui.alertBox>`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Differentiates <#macro> (markup output) from <#function> (returns computational value).',
        'Explains <#nested> tag for body injection / layout templates.',
        'Explains <#import> (namespaced) vs <#include> (inlines content into current namespace).',
        'Explains Java TemplateDirectiveModel for high-performance custom directives.'
      ],
      juniorOrMidRedFlags: [
        'Uses <#include> everywhere causing global variable namespace pollution instead of <#import as ns>.',
        'Confuses macros with functions.'
      ],
      seniorDifferentiators: [
        'Explains null handling operators (!, ??, ?has_content) and template caching settings in production.'
      ],
      followUpQuestions: [
        'How do you prevent XSS attacks when rendering untrusted user variables in FreeMarker templates?'
      ]
    },
    tags: ['FreeMarker', 'FTL', 'Macros', 'Functions', 'Template Inheritance']
  },
  {
    id: 'ftl-02',
    category: 'legacy-web',
    categoryName: 'JSF & FreeMarker (FTL)',
    topic: 'FreeMarker Null Handling & Email Templates',
    title: 'FreeMarker Null Safety (!, ??, ?has_content) & Dynamic HTML Email Generation',
    seniority: 'Senior (10-12 YOE)',
    difficulty: 'Medium',
    summary: 'Defensive null handling operators, preventing TemplateModelException, and generating responsive HTML transaction receipts.',
    coreConcepts: [
      '\${variable!"default_val"}: Default value operator; outputs fallback if variable is missing or null.',
      '<#if variable??>: Existence operator; returns true if variable exists and is not null.',
      '<#if text?has_content>: Returns true if variable exists, is not null, and is not an empty string or empty collection.',
      'TemplateModelException occurs at runtime if a missing variable is referenced without null operators.'
    ],
    detailedExplanation: [
      'In production, FreeMarker throws an error and halts rendering if a null property like ${order.shippingAddress.zipCode} is encountered. Use (${order.shippingAddress.zipCode})!"N/A" to protect the entire object navigation chain.',
      'For transactional email generation, Java code configures Configuration, loads the template, merges with a data map, and produces the HTML string for JavaMailSender.'
    ],
    codeExamples: [
      {
        title: 'Java FreeMarker Email Generator with Null Safety',
        language: 'java',
        code: `import freemarker.template.*;
import java.io.StringWriter;
import java.util.*;

public class EmailTemplateService {
    private final Configuration freemarkerConfig;

    public EmailTemplateService() {
        freemarkerConfig = new Configuration(Configuration.VERSION_2_3_32);
        freemarkerConfig.setClassForTemplateLoading(this.getClass(), "/email-templates");
        freemarkerConfig.setDefaultEncoding("UTF-8");
        freemarkerConfig.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
    }

    public String generateOrderReceiptHtml(Map<String, Object> model) throws Exception {
        Template template = freemarkerConfig.getTemplate("order_receipt.ftl");
        try (StringWriter writer = new StringWriter()) {
            template.process(model, writer);
            return writer.toString();
        }
    }
}`
      }
    ],
    rubric: {
      idealAnswerPoints: [
        'Explains !, ??, and ?has_content with clear examples.',
        'Explains chaining parentheses for nested nulls: (user.address.street)!"None".',
        'Explains FreeMarker Java Configuration and Template processing lifecycle.'
      ],
      juniorOrMidRedFlags: [
        'Leaves raw unguarded variables ${user.name} in email templates leading to production NPE crashes.',
        'Does not know how to format dates or numbers in FTL (?string.currency, ?date).'
      ],
      seniorDifferentiators: [
        'Mentions FreeMarker strict syntax and TemplateExceptionHandler configurations.'
      ],
      followUpQuestions: [
        'How do you configure FreeMarker template caching in production vs development environments?'
      ]
    },
    tags: ['FreeMarker', 'Null Safety', 'Email Templates', 'JavaMail']
  }
];
