import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { AdmDialog } from '@/components/primitives/AdmDialog';
import { AdmButton } from '@/components/primitives/AdmButton';
import { PriceTag } from '@/components/primitives/PriceTag';
import { useReceiptSignedUrl } from '@/lib/api/queries';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';

interface ReceiptViewerDialogProps {
  open: boolean;
  onClose: () => void;
  receiptKey: string | null;
  orderNumber: string;
  amount: number;
  onApprove: () => void;
  onReject: () => void;
  approving?: boolean;
  rejecting?: boolean;
}

const MATCH_FIELDS = ['bank', 'account', 'amount', 'reference'] as const;
type MatchKey = (typeof MATCH_FIELDS)[number];

export function ReceiptViewerDialog({
  open,
  onClose,
  receiptKey,
  orderNumber,
  amount,
  onApprove,
  onReject,
  approving,
  rejecting,
}: ReceiptViewerDialogProps) {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  const [matches, setMatches] = useState<Record<MatchKey, boolean>>({
    bank: false,
    account: false,
    amount: false,
    reference: false,
  });
  const { data: signed, isLoading, error } = useReceiptSignedUrl(open ? receiptKey : null);
  const allMatched = MATCH_FIELDS.every((k) => matches[k]);

  return (
    <AdmDialog
      open={open}
      onClose={onClose}
      title={dict.receiptViewer.title}
      size="xl"
      closeLabel={dict.receiptViewer.closeLabel}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-0 min-h-[480px]">
        <div className="bg-navy-ink relative overflow-hidden">
          {!receiptKey ? (
            <div className="absolute inset-0 flex items-center justify-center text-sand/80 text-small">
              {dict.receiptViewer.noReceipt}
            </div>
          ) : isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center text-sand/80 text-small">
              {dict.common.loading}
            </div>
          ) : error || !signed ? (
            <div className="absolute inset-0 flex items-center justify-center text-danger text-small">
              {dict.receiptViewer.fetchError}
            </div>
          ) : (
            <TransformWrapper minScale={0.5} maxScale={6} centerOnInit>
              <TransformComponent
                wrapperClass="!w-full !h-full min-h-[480px]"
                contentClass="!w-full !h-full flex items-center justify-center"
              >
                <img
                  src={signed.url}
                  alt={`Receipt for ${orderNumber}`}
                  className="max-w-full max-h-[600px] object-contain"
                />
              </TransformComponent>
            </TransformWrapper>
          )}
        </div>
        <div className="p-5 flex flex-col gap-4 bg-white dark:bg-d-surface">
          <div>
            <div className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute">
              {dict.orderDetail.paymentBlock}
            </div>
            <div className="font-mono text-h2 font-bold text-navy dark:text-d-text mt-1">
              {orderNumber}
            </div>
            <div className="mt-1 text-h3 text-amber font-mono">
              <PriceTag amount={amount} locale={locale} size={20} />
            </div>
          </div>

          <div>
            <div className="text-small font-semibold text-ink dark:text-d-text mb-2">
              {dict.receiptViewer.matchChecker}
            </div>
            <div className="text-micro text-ink-mute dark:text-d-textMute mb-2">
              {dict.receiptViewer.matchInstruction}
            </div>
            <ul className="space-y-2">
              {MATCH_FIELDS.map((key) => (
                <li key={key} className="flex items-center justify-between gap-2">
                  <span className="text-small text-ink dark:text-d-text">
                    {dict.receiptViewer[key]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMatches((m) => ({ ...m, [key]: !m[key] }))}
                    className={`w-8 h-5 rounded-full transition-colors relative ${
                      matches[key] ? 'bg-ok' : 'bg-line dark:bg-d-line'
                    }`}
                    aria-pressed={matches[key]}
                    aria-label={dict.receiptViewer[key]}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        matches[key] ? 'start-3.5' : 'start-0.5'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <AdmButton
              variant="primary"
              fullWidth
              onClick={onApprove}
              disabled={!allMatched || approving || rejecting || !receiptKey}
            >
              {approving ? dict.common.loading : dict.receiptViewer.approve}
            </AdmButton>
            <AdmButton
              variant="danger"
              fullWidth
              onClick={onReject}
              disabled={approving || rejecting || !receiptKey}
            >
              {rejecting ? dict.common.loading : dict.receiptViewer.reject}
            </AdmButton>
          </div>
        </div>
      </div>
    </AdmDialog>
  );
}
