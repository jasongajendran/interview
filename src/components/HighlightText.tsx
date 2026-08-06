import React from 'react';

// Categorized domain keywords for clear visual color coding
const HAZARDS_TERMS = [
  'deadlock', 'memory leak', 'thread starvation', 'oom', 'outofmemoryerror', 'race condition',
  'split-brain', 'dirty read', 'phantom read', 'non-repeatable read', 'poison pill', 'p1',
  'viewexpiredexception', 'nullpointerexception', 'concurrentmodificationexception',
  'anti-pattern', 'bottleneck', 'cascading failure', 'single-point-of-failure', 'data corruption'
];

const ARCHITECTURE_TERMS = [
  'transactional outbox', 'saga pattern', 'two-phase commit', '2pc', 'idempotent', 'idempotency',
  'circuit breaker', 'change data capture', 'cdc', 'cqrs', 'event sourcing', 'orchestration',
  'choreography', 'eventual consistency', 'compensating transaction', 'stateless', 'stateful',
  'dirty checking', 'first-level cache', 'second-level cache', 'b-tree index', 'window function',
  'n+1 problem', 'optimistic locking', 'pessimistic locking'
];

const SECURITY_TERMS = [
  'oauth2', 'oauth 2.0', 'openid connect', 'oidc', 'pkce', 'authorization code', 'client credentials',
  'jwt', 'json web token', 'jwks', 'csrf', 'xss', 'cors', 'content security policy', 'csp',
  'httponly', 'samesite', 'saml', 'rbac', 'bearer token', 'bearer', 'code_verifier', 'code_challenge'
];

const JVM_TERMS = [
  'metaspace', 'heap memory', 'young generation', 'old generation', 'eden space', 'survivor space',
  'garbage collection', 'g1gc', 'zgc', 'parallel gc', 'cms', 'thread dump', 'heap dump',
  'pc register', 'thread stack', 'off-heap', 'directbytebuffer', 'jit compiler', 'jvm'
];

const CONCURRENCY_TERMS = [
  'completablefuture', 'reentrantlock', 'concurrenthashmap', 'forkjoinpool', 'virtual thread',
  'virtual threads', 'threadlocal', 'atomicinteger', 'copyonwritearraylist', 'countdownlatch',
  'cyclicbarrier', 'semaphore', 'thread pool', 'connection pool', 'synchronized', 'volatile',
  'hikaricp', 'blockingqueue'
];

const METRICS_TERMS = [
  'throughput', 'latency', 'p99', 'p95', 'qps', 'failover', 'load balancer', 'alb', 'nlb',
  'route 53', 's3', 'dynamodb', 'fargate', 'lambda', 'actuator', 'micrometer', 'prometheus'
];

const ALL_CATEGORIES = [
  { terms: HAZARDS_TERMS, className: 'bg-rose-100 text-rose-900 border-rose-300 font-semibold' },
  { terms: ARCHITECTURE_TERMS, className: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold' },
  { terms: SECURITY_TERMS, className: 'bg-purple-100 text-purple-900 border-purple-300 font-semibold' },
  { terms: JVM_TERMS, className: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold' },
  { terms: CONCURRENCY_TERMS, className: 'bg-sky-100 text-sky-900 border-sky-300 font-mono text-[12px] font-semibold' },
  { terms: METRICS_TERMS, className: 'bg-cyan-100 text-cyan-900 border-cyan-300 font-semibold' }
];

const FLAT_TERMS = ALL_CATEGORIES.flatMap(c => c.terms);
const TERM_REGEX_STR = FLAT_TERMS.map(t => t.replace(/[-\s]/g, '[-\\s]')).join('|');
const DOMAIN_REGEX = new RegExp(`\\b((?:${TERM_REGEX_STR})s?)\\b`, 'gi');

const STRUCTURAL_REGEX = /(@[a-zA-Z0-9_]+|\b(?:[A-Z]+[0-9]+|[0-9]+[A-Z]+|[A-Z]{2,})s?\b|\b[A-Z][a-z]+[A-Z][a-zA-Z0-9]*\b|\b[a-z]+[A-Z][a-zA-Z0-9]*\b)/g;
const STRUCTURAL_EXACT_REGEX = /^(@[a-zA-Z0-9_]+|(?:[A-Z]+[0-9]+|[0-9]+[A-Z]+|[A-Z]{2,})s?|[A-Z][a-z]+[A-Z][a-zA-Z0-9]*|[a-z]+[A-Z][a-zA-Z0-9]*)$/;

interface HighlightTextProps {
  text?: string;
  searchQuery?: string;
}

export function HighlightText({ text, searchQuery }: HighlightTextProps) {
  if (!text) return null;

  // Split by inline markdown code (`code`)
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <span className="leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={index}
              className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded text-[12px] font-mono font-bold shadow-2xs border border-slate-300 mx-0.5"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        // Check for prefix labels like "Trade-off:", "Senior Tip:", "Why:", etc.
        if (index === 0) {
          const prefixMatch = part.match(/^([^:]{2,50}):(.*)/);
          if (prefixMatch) {
            return (
              <React.Fragment key={index}>
                <span className="font-bold text-slate-900 bg-amber-100/80 text-amber-950 px-1.5 py-0.5 rounded border border-amber-200 shadow-2xs mr-1 text-[13px]">
                  {prefixMatch[1]}:
                </span>
                <HighlightTerms text={prefixMatch[2]} searchQuery={searchQuery} />
              </React.Fragment>
            );
          }
        }

        return <HighlightTerms key={index} text={part} searchQuery={searchQuery} />;
      })}
    </span>
  );
}

function HighlightTerms({ text, searchQuery }: { text: string; searchQuery?: string }) {
  if (searchQuery && searchQuery.trim().length > 1) {
    const escapedQuery = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(`(${escapedQuery})`, 'gi');
    const searchParts = text.split(searchRegex);

    return (
      <>
        {searchParts.map((subPart, j) => {
          if (subPart.toLowerCase() === searchQuery.trim().toLowerCase()) {
            return (
              <mark key={j} className="bg-yellow-300 text-slate-950 font-bold px-1 rounded shadow-xs border border-yellow-400">
                {subPart}
              </mark>
            );
          }
          return <HighlightDomainTerms key={j} text={subPart} />;
        })}
      </>
    );
  }

  return <HighlightDomainTerms text={text} />;
}

function HighlightDomainTerms({ text }: { text: string }) {
  const parts = text.split(DOMAIN_REGEX);

  return (
    <>
      {parts.map((part, i) => {
        const lower = part.toLowerCase().replace(/s$/, '').replace(/[-\s]/g, ' ');
        const matchedCategory = ALL_CATEGORIES.find(c =>
          c.terms.some(t => t.toLowerCase() === lower || t.toLowerCase() === part.toLowerCase())
        );

        if (matchedCategory) {
          return (
            <span
              key={i}
              className={`inline-block px-1.5 py-0.2 rounded border shadow-2xs mx-0.5 text-[12.5px] ${matchedCategory.className}`}
            >
              {part}
            </span>
          );
        }
        return <HighlightStructural key={i} text={part} />;
      })}
    </>
  );
}

function HighlightStructural({ text }: { text: string }) {
  const parts = text.split(STRUCTURAL_REGEX);

  return (
    <>
      {parts.map((word, i) => {
        if (STRUCTURAL_EXACT_REGEX.test(word)) {
          if (/^(IS|OR|IF|TO|IT|ON|AS|IN|OF|AT|BY|UP|DO|NO|SO|AN|BE|HE|WE|ME|MY|US|UK|THE|FOR|AND|BUT|NOT|ALL|ANY|NEW|SET|GET)$/.test(word)) {
            return <span key={i}>{word}</span>;
          }

          if (word.startsWith('@')) {
            return (
              <span
                key={i}
                className="font-mono text-[12px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 mx-0.5 shadow-2xs"
              >
                {word}
              </span>
            );
          }

          return (
            <span
              key={i}
              className="font-semibold text-slate-900 bg-slate-100/90 px-1 rounded shadow-2xs border border-slate-200 mx-0.5 text-[13px]"
            >
              {word}
            </span>
          );
        }
        return <span key={i}>{word}</span>;
      })}
    </>
  );
}
