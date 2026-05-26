interface SummaryBoxProps {
  eyebrow: string;
  body: string;
}

/**
 * Amber-tint "in plain language" callout used at the top of Privacy / ToS.
 * Mirrors docs/design/bartal/project/system-kit.jsx::WebPrivacy summary box.
 */
export function SummaryBox({ eyebrow, body }: SummaryBoxProps) {
  return (
    <div className="bg-amber-tint border border-amber/30 rounded-bartal p-5 flex items-start gap-4">
      <div
        aria-hidden
        className="w-9 h-9 rounded-full bg-amber text-white font-bold flex items-center justify-center shrink-0"
        style={{ fontSize: 18 }}
      >
        i
      </div>
      <div className="min-w-0">
        <div className="text-small font-bold text-navy-ink mb-1">{eyebrow}</div>
        <p className="text-small text-navy-ink leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
