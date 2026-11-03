import { Fragment } from 'react';

interface RevealTextProps {
  text: string;
  className?: string;
  /** Extra classes for each word (e.g. the gold foil). */
  wordClassName?: string;
}

/**
 * Splits text into masked words for a staggered rise. Splitting happens in React (not by
 * mutating the DOM like SplitText), so it is safe with re-renders and keeps Devanagari
 * conjuncts intact — we only ever split on spaces.
 */
export function RevealText({ text, className, wordClassName }: RevealTextProps) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="reveal-mask">
            <span className="reveal-item" data-reveal-item>
              {/* Effects like the gold foil live on an untransformed inner span —
                  Safari can drop background-clip:text on transformed layers. */}
              {wordClassName ? <span className={wordClassName}>{word}</span> : word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
