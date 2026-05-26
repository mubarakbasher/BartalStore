interface StaticSectionProps {
  id: string;
  title: string;
  body: string | string[];
}

/**
 * Numbered prose section anchored by `id` so the TOC can jump to it.
 * `body` accepts a string or an array of paragraphs.
 *
 * Mirrors docs/design/bartal/project/system-kit.jsx::WebPrivacy section rows.
 */
export function StaticSection({ id, title, body }: StaticSectionProps) {
  const paragraphs = Array.isArray(body) ? body : [body];
  return (
    <section id={id} className="scroll-mt-32">
      <h2
        className="text-ink font-bold mb-2.5"
        style={{ fontSize: 18, lineHeight: 1.3 }}
      >
        {title}
      </h2>
      <div className="space-y-3 max-w-[680px]">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-ink-mute leading-relaxed"
            style={{ fontSize: 14, lineHeight: 1.75 }}
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
