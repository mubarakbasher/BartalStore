import type { Dictionary } from '@/lib/i18n/dictionary';

interface LandmarkNoticeProps {
  dict: Dictionary;
}

export function LandmarkNotice({ dict }: LandmarkNoticeProps) {
  return (
    <div className="bg-amber-tint border border-amber/30 rounded-bartal p-3.5">
      <div className="text-small font-bold text-ink mb-1">
        {dict.web.checkout.address.landmarkTitle}
      </div>
      <div className="text-micro text-ink-mute leading-relaxed normal-case tracking-normal">
        {dict.web.checkout.address.landmarkBody}
      </div>
    </div>
  );
}
