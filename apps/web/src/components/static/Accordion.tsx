'use client';
import { useId, useState } from 'react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  emptyText?: string;
}

/**
 * Single-open accordion. Click an item to expand; clicking the open one closes it.
 * `aria-expanded` + `aria-controls` for assistive tech.
 */
export function Accordion({ items, defaultOpenId, emptyText }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const baseId = useId();

  if (items.length === 0) {
    return (
      <div className="bg-white border border-line rounded-bartal p-5 text-small text-ink-mute">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="bg-white border border-line rounded-bartal overflow-hidden">
      {items.map((item, i) => {
        const isOpen = item.id === openId;
        const isLast = i === items.length - 1;
        const panelId = `${baseId}-${item.id}`;
        return (
          <div key={item.id} className={isLast ? '' : 'border-b border-line'}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-start hover:bg-sand/50 transition-colors"
            >
              <span className="text-body font-semibold text-ink min-w-0">
                {item.question}
              </span>
              <span
                aria-hidden
                className={`text-ink-mute shrink-0 transition-transform ${
                  isOpen ? 'rotate-45' : ''
                }`}
                style={{ fontSize: 22, lineHeight: 1 }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                className="px-5 pb-4 text-small text-ink-mute leading-relaxed max-w-[640px]"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
