'use client';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import { CameraIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';

interface ReceiptDropzoneProps {
  dict: Dictionary;
}

interface PickedFile {
  name: string;
  sizeBytes: number;
}

const MAX_BYTES = 10 * 1024 * 1024;

export function ReceiptDropzone({ dict }: ReceiptDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<PickedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const r = dict.web.checkout.thankYou.receipt;

  const accept = (raw: File | undefined | null) => {
    if (!raw) return;
    if (raw.size > MAX_BYTES) {
      setError(r.tooLarge);
      return;
    }
    setError(null);
    setFile({ name: raw.name, sizeBytes: raw.size });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => accept(e.target.files?.[0]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    accept(e.dataTransfer.files?.[0]);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging) setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const openPicker = () => inputRef.current?.click();

  const reset = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const kb = file ? Math.max(1, Math.round(file.sizeBytes / 1024)) : 0;

  return (
    <div className="bg-white border border-line rounded-bartal-lg p-5">
      <div className="text-micro text-amber font-semibold normal-case tracking-normal mb-1">
        {r.stepLabel}
      </div>
      <h2 className="text-h2 font-bold text-ink mb-3">{r.title}</h2>

      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`rounded-bartal p-7 text-center cursor-pointer transition-colors ${
          dragging
            ? 'bg-amber-tint border-2 border-dashed border-amber'
            : 'bg-sand border-2 border-dashed border-line hover:border-amber/50'
        }`}
        style={dragging ? { borderStyle: 'dashed' } : undefined}
      >
        {file ? (
          <div className="space-y-2">
            <div className="text-small font-bold text-ink truncate" dir="ltr">
              {file.name}
            </div>
            <div className="text-micro text-ink-mute font-mono normal-case tracking-normal">
              {tt(r.sizeUnit, { kb })}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="text-micro font-semibold text-amber hover:underline normal-case tracking-normal"
            >
              {r.change}
            </button>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-amber-tint mx-auto mb-2.5 flex items-center justify-center">
              <CameraIcon size={26} color={BARTAL.amber} />
            </div>
            <div className="text-small font-bold text-ink mb-1">{r.dropHere}</div>
            <div className="text-micro text-ink-mute normal-case tracking-normal">
              {r.formats}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
              className="mt-3.5 inline-flex items-center justify-center bg-amber text-white font-bold rounded-bartal px-5 py-2.5 text-small hover:bg-amber-hover"
            >
              {r.chooseFile}
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="mt-2.5 text-micro text-danger font-semibold normal-case tracking-normal">
          {error}
        </div>
      )}

      <p className="text-small text-ink-mute mt-3 text-center leading-relaxed">
        {r.laterHint}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}
