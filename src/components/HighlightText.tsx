import React from 'react';

const DOMAIN_TERMS = [
  'transactional outbox', 'two-phase commit', 'optimistic locking', 'pessimistic locking',
  'deadlock', 'memory leak', 'thread starvation', 'concurrency', 'bottleneck',
  'asynchronous', 'synchronous', 'orchestration', 'choreography', 'idempotent', 'idempotency',
  'stateless', 'stateful', 'latency', 'throughput', 'garbage collection', 'metaspace',
  'heap', 'thread pool', 'connection pool', 'failover', 'circuit breaker',
  'single-point-of-failure', 'eventual consistency', 'compensating transaction',
  'change data capture', 'authorization code', 'client credentials', 'machine-to-machine',
  'anti-pattern', 'thread dump', 'heap dump', 'memory tracking', 'oauth2', 'oauth', 
  'openid connect', 'json web token'
];

const TERM_REGEX_STR = DOMAIN_TERMS.map(t => t.replace(/[-\s]/g, '[-\\s]')).join('|');
const DOMAIN_REGEX = new RegExp(`\\b((?:${TERM_REGEX_STR})s?)\\b`, 'gi');
const DOMAIN_EXACT_REGEX = new RegExp(`^((?:${TERM_REGEX_STR})s?)$`, 'i');

const STRUCTURAL_REGEX = /(@[a-zA-Z0-9_]+|\b(?:[A-Z]+[0-9]+|[0-9]+[A-Z]+|[A-Z]{2,})s?\b|\b[A-Z][a-z]+[A-Z][a-zA-Z0-9]*\b|\b[a-z]+[A-Z][a-zA-Z0-9]*\b)/g;
const STRUCTURAL_EXACT_REGEX = /^(@[a-zA-Z0-9_]+|(?:[A-Z]+[0-9]+|[0-9]+[A-Z]+|[A-Z]{2,})s?|[A-Z][a-z]+[A-Z][a-zA-Z0-9]*|[a-z]+[A-Z][a-zA-Z0-9]*)$/;

export function HighlightText({ text }: { text: string }) {
  if (!text) return null;

  const parts = text.split(/(`[^`]+`)/g);
  
  return (
    <span className="leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={index} className="bg-slate-100 text-pink-700 px-1.5 py-0.5 rounded text-xs font-mono font-bold shadow-sm border border-slate-200 mx-0.5">
              {part.slice(1, -1)}
            </code>
          );
        }

        if (index === 0) {
          const prefixMatch = part.match(/^([^:]{2,60}):(.*)/);
          if (prefixMatch) {
            return (
              <React.Fragment key={index}>
                <strong className="text-slate-900 font-bold bg-amber-100/50 px-1 rounded">{prefixMatch[1]}:</strong>
                <HighlightTerms text={prefixMatch[2]} />
              </React.Fragment>
            );
          }
        }
        
        return <HighlightTerms key={index} text={part} />;
      })}
    </span>
  );
}

function HighlightTerms({ text }: { text: string }) {
  const parts = text.split(DOMAIN_REGEX);
  
  return (
    <>
      {parts.map((part, i) => {
        if (DOMAIN_EXACT_REGEX.test(part)) {
           return (
             <span key={i} className="font-semibold text-indigo-700 bg-indigo-50/80 px-1 rounded border border-indigo-100/50 mx-0.5 shadow-sm">
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
          if (/^(IS|OR|IF|TO|IT|ON|AS|IN|OF|AT|BY|UP|DO|NO|SO|AN|BE|HE|WE|ME|MY|US|UK)$/.test(word)) {
            return <span key={i}>{word}</span>;
          }
          return (
            <span key={i} className="font-semibold text-slate-800 bg-slate-100/80 px-1 rounded shadow-sm border border-slate-200/50 mx-0.5">
              {word}
            </span>
          );
        }
        return <span key={i}>{word}</span>;
      })}
    </>
  );
}
