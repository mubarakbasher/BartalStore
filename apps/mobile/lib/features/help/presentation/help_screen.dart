import 'package:flutter/material.dart';

import '../../../core/utils/money.dart';
import '../../../core/utils/whatsapp.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/screen_header.dart';

/// Help / FAQ — port of mobile-extras.jsx::HelpFaqScreen. Decorative search,
/// a WhatsApp support banner (`wa.me`), a static topic grid, and an expandable
/// FAQ accordion.
class HelpFaqScreen extends StatefulWidget {
  const HelpFaqScreen({super.key});

  @override
  State<HelpFaqScreen> createState() => _HelpFaqScreenState();
}

class _HelpFaqScreenState extends State<HelpFaqScreen> {
  final Set<int> _open = {0};

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    String d(int v) => localizedDigits('$v', arabic: isAr);

    final topics = [
      (l10n.helpTopicOrders, 8),
      (l10n.helpTopicPayment, 6),
      (l10n.helpTopicReturns, 4),
      (l10n.helpTopicAccount, 5),
    ];
    final faqs = [
      (l10n.helpQ1, l10n.helpA1),
      (l10n.helpQ2, l10n.helpA2),
      (l10n.helpQ3, l10n.helpA3),
      (l10n.helpQ4, l10n.helpA4),
    ];

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.helpTitle),
          Expanded(
            child: ListView(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 24),
              children: [
                // Decorative search.
                Container(
                  height: 44,
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: bartal.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: bartal.line),
                  ),
                  child: Row(
                    children: [
                      BartalIcon(BartalIcons.search, color: bartal.textMute, size: 16),
                      const SizedBox(width: 10),
                      Text(l10n.helpSearchHint, style: TextStyle(color: bartal.textMute, fontSize: 15)),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // WhatsApp banner.
                Material(
                  color: const Color(0xFF25D366),
                  borderRadius: BorderRadius.circular(14),
                  child: InkWell(
                    onTap: () => launchWhatsApp(),
                    borderRadius: BorderRadius.circular(14),
                    child: Padding(
                      padding: const EdgeInsetsDirectional.symmetric(horizontal: 16, vertical: 14),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                            alignment: Alignment.center,
                            child: const Text('W',
                                style: TextStyle(
                                    color: Color(0xFF25D366), fontWeight: FontWeight.w800, fontSize: 18)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(l10n.helpWhatsappTitle,
                                    style: const TextStyle(
                                        color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14)),
                                const SizedBox(height: 2),
                                Text(l10n.helpWhatsappSub,
                                    style: TextStyle(
                                        color: Colors.white.withValues(alpha: 0.9), fontSize: 13)),
                              ],
                            ),
                          ),
                          BartalIcon(BartalIcons.arrow, color: Colors.white, size: 16),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(l10n.helpBrowseTopics, style: context.bartalType.micro),
                const SizedBox(height: 8),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  childAspectRatio: 2.6,
                  children: [
                    for (final t in topics)
                      Container(
                        padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 12),
                        decoration: BoxDecoration(
                          color: bartal.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: bartal.line),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(t.$1,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700)),
                            const SizedBox(height: 4),
                            Text(l10n.helpTopicArticles(d(t.$2)), style: context.bartalType.micro),
                          ],
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(l10n.helpMostAsked, style: context.bartalType.micro),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    color: bartal.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: bartal.line),
                  ),
                  child: Column(
                    children: [
                      for (var i = 0; i < faqs.length; i++)
                        _FaqRow(
                          question: faqs[i].$1,
                          answer: faqs[i].$2,
                          open: _open.contains(i),
                          last: i == faqs.length - 1,
                          onTap: () => setState(() => _open.contains(i) ? _open.remove(i) : _open.add(i)),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FaqRow extends StatelessWidget {
  const _FaqRow({
    required this.question,
    required this.answer,
    required this.open,
    required this.last,
    required this.onTap,
  });

  final String question;
  final String answer;
  final bool open;
  final bool last;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsetsDirectional.all(14),
        decoration: BoxDecoration(
          border: last ? null : Border(bottom: BorderSide(color: bartal.line)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(question,
                      style: context.bartalType.body.copyWith(fontWeight: FontWeight.w600)),
                ),
                const SizedBox(width: 10),
                Text(open ? '−' : '+',
                    style: TextStyle(fontSize: 18, color: bartal.textMute, fontWeight: FontWeight.w600)),
              ],
            ),
            if (open) ...[
              const SizedBox(height: 8),
              Text(answer, style: context.bartalType.small.copyWith(height: 1.6)),
            ],
          ],
        ),
      ),
    );
  }
}
