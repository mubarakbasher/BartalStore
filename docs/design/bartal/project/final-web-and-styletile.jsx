// final-web-and-styletile.jsx — Web (Journal, Brand page) + Design System tile

// ═══════════════════════════════════════════════════════════════
// WEB · JOURNAL (BARTAL EDIT)
// ═══════════════════════════════════════════════════════════════
function WebJournal({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;

  const featured = {
    title_ar: 'كيف تختار العود المناسب لمزاجك',
    title_en: 'How to choose the right oud for your mood',
    excerpt_ar: 'دليل عملي من خبير عطور سوداني — من العود الهندي الترابي إلى العود الكمبودي الزهري، اعرف الفرق قبل أن تشتري.',
    excerpt_en: 'A practical guide from a Sudanese perfumer — from earthy Indian agarwood to floral Cambodian oud, know the difference before you buy.',
    cat_ar: 'دليل', cat_en: 'Guide', read: '8 min', date: '12 Apr 2026', author: 'Khalid Idris', hue: 'amber',
  };

  const posts = [
    { title_ar: 'سحر الورد الطائفي في صناعة العطور السودانية',
      title_en: 'The magic of Taif rose in Sudanese perfumery',
      excerpt_ar: 'تاريخ الورد الطائفي وكيف وصل إلى أسواق الخرطوم.',
      excerpt_en: 'The history of Taif rose and how it found its way to Khartoum markets.',
      cat_ar: 'حكاية', cat_en: 'Story', read: '6 min', date: '08 Apr 2026', author: 'Sara Al-Bashir', hue: 'rose' },
    { title_ar: 'أفضل ٥ سماعات لاسلكية في ٢٠٢٦',
      title_en: 'The 5 best wireless headphones for 2026',
      excerpt_ar: 'مراجعة شاملة لأفضل السماعات المتاحة في السودان هذا العام.',
      excerpt_en: 'A complete review of the best headphones available in Sudan this year.',
      cat_ar: 'مراجعة', cat_en: 'Review', read: '12 min', date: '02 Apr 2026', author: 'Tarek Mahmoud', hue: 'navy' },
    { title_ar: 'دليل العناية ببخور العود',
      title_en: 'A guide to caring for your bakhoor',
      excerpt_ar: 'كيف تحافظ على بخورك طازجاً لأشهر طويلة.',
      excerpt_en: 'How to keep your bakhoor fresh for months.',
      cat_ar: 'نصائح', cat_en: 'Tips', read: '4 min', date: '28 Mar 2026', author: 'Khalid Idris', hue: 'warm' },
    { title_ar: 'وراء الكواليس: كيف نتحقق من إيصالات التحويل',
      title_en: 'Behind the scenes: how we verify bank transfer receipts',
      excerpt_ar: 'نظرة على عملية مراجعة الإيصالات في برتال — لماذا تستغرق ٣٠ دقيقة وكيف نحمي عملاءنا.',
      excerpt_en: 'A look inside our receipt review process — why it takes 30 min and how we protect customers.',
      cat_ar: 'برتال', cat_en: 'Inside Bartal', read: '5 min', date: '22 Mar 2026', author: 'Bartal Team', hue: 'green' },
    { title_ar: 'لماذا الواتساب مهم لتجارة الإلكترونية السودانية',
      title_en: 'Why WhatsApp matters for Sudanese e-commerce',
      excerpt_ar: 'كيف أصبح الواتساب البنية التحتية الأساسية للتجارة عبر الإنترنت في السودان.',
      excerpt_en: 'How WhatsApp became core infrastructure for online commerce in Sudan.',
      cat_ar: 'مقال', cat_en: 'Op-ed', read: '7 min', date: '18 Mar 2026', author: 'Layla Hassan', hue: 'amber' },
    { title_ar: 'هدايا العيد — أفضل ١٠ اختيارات',
      title_en: 'Eid gifting — top 10 picks',
      excerpt_ar: 'من عطور للأمهات إلى ساعات للآباء، قائمتنا لعيد ٢٠٢٦.',
      excerpt_en: 'From perfumes for mothers to watches for fathers — our list for Eid 2026.',
      cat_ar: 'مختارات', cat_en: 'Curated', read: '5 min', date: '14 Mar 2026', author: 'Bartal Edit', hue: 'rose' },
  ];

  return (
    <WebStaticShell
      lang={lang} dark={dark}
      eyebrow={isAr ? 'مجلة برتال' : 'The Bartal edit'}
      title={isAr ? 'حكايات، أدلة ومراجعات من قلب السوق السوداني.' : 'Stories, guides, and reviews from the heart of the Sudanese market.'}
      subtitle={isAr
        ? 'كتّاب محليون يشاركونك ما يستحق أن تعرفه قبل أن تشتري — عطور، إلكترونيات، حياة عصرية في الخرطوم.'
        : 'Local writers share what\u2019s worth knowing before you buy — perfume, electronics, modern life in Khartoum.'}
    >
      {/* Featured post */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, marginBottom: 56,
        alignItems: 'stretch',
      }}>
        <div style={{ borderRadius: 18, overflow: 'hidden', position: 'relative', minHeight: 360 }}>
          <ProductPlaceholder label={featured.title_en} hue={featured.hue}/>
          <div style={{
            position: 'absolute', bottom: 16, insetInlineStart: 16,
            padding: '6px 12px', background: BARTAL.amber, color: '#fff',
            borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
            fontFamily: isAr ? "'Cairo'" : "'Poppins'",
          }}>
            {isAr ? `★ ${featured.cat_ar}` : `★ ${featured.cat_en}`}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 11, color: muted, letterSpacing: 2, textTransform: 'uppercase',
                         fontWeight: 600, marginBottom: 12 }}>
            {isAr ? `${featured.cat_ar} · ${featured.read} قراءة` : `${featured.cat_en} · ${featured.read} read`}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: text, lineHeight: 1.2, marginBottom: 14,
                         letterSpacing: isAr ? 0 : -0.8 }}>
            {isAr ? featured.title_ar : featured.title_en}
          </div>
          <div style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 20 }}>
            {isAr ? featured.excerpt_ar : featured.excerpt_en}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, background: BARTAL.amber + '30',
              color: BARTAL.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 12,
            }}>KI</div>
            <div style={{ fontSize: 13 }}>
              <div style={{ color: text, fontWeight: 600 }}>{featured.author}</div>
              <div style={{ color: muted, fontSize: 11 }}>{featured.date}</div>
            </div>
            <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 6,
                          color: BARTAL.amber, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {isAr ? 'اقرأ المقال' : 'Read article'}
              <span style={{ transform: isAr ? 'rotate(180deg)' : 'none' }}>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap',
        paddingBottom: 16, borderBottom: `1px solid ${line}`,
      }}>
        {[
          { ar: 'كل المقالات', en: 'All articles', on: true, count: 47 },
          { ar: 'أدلة', en: 'Guides', count: 12 },
          { ar: 'مراجعات', en: 'Reviews', count: 18 },
          { ar: 'حكايات', en: 'Stories', count: 9 },
          { ar: 'مختارات', en: 'Curated', count: 5 },
          { ar: 'داخل برتال', en: 'Inside Bartal', count: 3 },
        ].map((c, i) => (
          <div key={i} style={{
            padding: '8px 16px', borderRadius: 100,
            background: c.on ? BARTAL.navy : 'transparent',
            color: c.on ? '#fff' : text,
            border: `1px solid ${c.on ? BARTAL.navy : line}`,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: isAr ? "'Cairo'" : "'Poppins'",
          }}>
            {isAr ? c.ar : c.en} <span style={{ opacity: 0.6, marginInlineStart: 4 }}>{c.count}</span>
          </div>
        ))}
      </div>

      {/* Post grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginBottom: 48 }}>
        {posts.map((p, i) => (
          <div key={i} style={{ cursor: 'pointer' }}>
            <div style={{ height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: 14, position: 'relative' }}>
              <ProductPlaceholder label={p.title_en} hue={p.hue}/>
              <div style={{
                position: 'absolute', top: 12, insetInlineStart: 12,
                padding: '4px 10px', background: surface, color: text,
                borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                fontFamily: isAr ? "'Cairo'" : "'Poppins'",
              }}>
                {isAr ? p.cat_ar : p.cat_en}
              </div>
            </div>
            <div style={{ fontSize: 11, color: muted, marginBottom: 6 }}>
              {p.date} · {isAr ? `${p.read} قراءة` : `${p.read} read`}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: text, lineHeight: 1.3, marginBottom: 8,
                          textWrap: 'balance', letterSpacing: isAr ? 0 : -0.3 }}>
              {isAr ? p.title_ar : p.title_en}
            </div>
            <div style={{ fontSize: 13, color: muted, lineHeight: 1.55, marginBottom: 10 }}>
              {isAr ? p.excerpt_ar : p.excerpt_en}
            </div>
            <div style={{ fontSize: 12, color: muted }}>{isAr ? 'بواسطة' : 'by'} {p.author}</div>
          </div>
        ))}
      </div>

      {/* Newsletter strip */}
      <div style={{
        background: BARTAL.navyInk, color: '#fff', borderRadius: 16, padding: '32px 36px',
        display: 'flex', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
          <MotifBg color={BARTAL.amberSoft} opacity={0.6} style={{ width: '100%', height: '100%' }}>
            <div style={{ width: '100%', height: '100%' }}/>
          </MotifBg>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ fontSize: 11, color: BARTAL.amberSoft, letterSpacing: 2, textTransform: 'uppercase',
                         fontWeight: 700, marginBottom: 8 }}>
            {isAr ? 'النشرة الأسبوعية' : 'Weekly digest'}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, letterSpacing: isAr ? 0 : -0.5 }}>
            {isAr ? 'مختاراتنا كل أسبوع في بريدك.' : 'Our picks, in your inbox every week.'}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            {isAr ? 'مجاناً · ألغ الاشتراك متى شئت' : 'Free · unsubscribe anytime'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          <input
            placeholder={isAr ? 'بريدك الإلكتروني' : 'your@email.com'}
            style={{
              padding: '12px 16px', borderRadius: 8, border: 'none', fontSize: 13,
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              fontFamily: 'inherit', outline: 'none', minWidth: 240,
            }}
          />
          <button style={{
            background: BARTAL.amber, color: '#fff', border: 'none',
            padding: '12px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>{isAr ? 'اشترك' : 'Subscribe'}</button>
        </div>
      </div>
    </WebStaticShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB · BRAND PAGE (single seller showcase)
// ═══════════════════════════════════════════════════════════════
function WebBrandPage({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;

  const brand = {
    name_ar: 'أجمل', name_en: 'Ajmal',
    tagline_ar: 'فن العطور منذ ١٩٥١', tagline_en: 'The art of perfumery since 1951',
    country_ar: 'مدينة سحار، عُمان', country_en: 'Sohar, Oman',
    products: 24, followers: '4,128', rating: 4.8,
  };

  const products = CATALOG.filter(p => p.cat === 'fragrance').slice(0, 3).concat(CATALOG.slice(0, 3));

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      {/* nav */}
      <div style={{
        padding: '14px 40px', background: surface, borderBottom: `1px solid ${line}`,
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <LogoMark color={BARTAL.amber} accent={BARTAL.navyInk} size={26}/>
        <div style={{ fontSize: 17, fontWeight: 700, color: text }}>{isAr ? 'برتال' : 'bartal'}</div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: muted, marginInlineStart: 24 }}>
          <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          <span style={{ transform: isAr ? 'rotate(180deg)' : 'none' }}>›</span>
          <span>{isAr ? 'الماركات' : 'Brands'}</span>
          <span style={{ transform: isAr ? 'rotate(180deg)' : 'none' }}>›</span>
          <span style={{ color: text, fontWeight: 600 }}>{isAr ? brand.name_ar : brand.name_en}</span>
        </div>
      </div>

      {/* Hero band */}
      <div style={{ background: BARTAL.navyInk, color: '#fff', padding: '40px 40px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
          <MotifBg color={BARTAL.amberSoft} opacity={0.6} style={{ width: '100%', height: '100%' }}>
            <div style={{ width: '100%', height: '100%' }}/>
          </MotifBg>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative',
                       display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, alignItems: 'center' }}>
          <div style={{
            width: 120, height: 120, borderRadius: 16, background: '#fff', color: BARTAL.navyInk,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 42, fontWeight: 700, letterSpacing: -1,
          }}>
            {isAr ? 'أ' : 'A'}
          </div>
          <div>
            <div style={{ fontSize: 11, color: BARTAL.amberSoft, letterSpacing: 2, textTransform: 'uppercase',
                           fontWeight: 700, marginBottom: 8 }}>
              {isAr ? 'ماركة موثّقة' : 'Verified brand'} · ★ {brand.rating}
            </div>
            <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1, marginBottom: 8,
                           letterSpacing: isAr ? 0 : -1.5 }}>
              {isAr ? brand.name_ar : brand.name_en}
            </div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
              {isAr ? brand.tagline_ar : brand.tagline_en}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 14 }}>
              <span>📍 {isAr ? brand.country_ar : brand.country_en}</span>
              <span>· {brand.products} {isAr ? 'منتج' : 'products'}</span>
              <span>· {brand.followers} {isAr ? 'متابع' : 'followers'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{
              background: BARTAL.amber, color: '#fff', border: 'none',
              padding: '12px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
            }}>{isAr ? '+ تابع الماركة' : '+ Follow brand'}</button>
            <button style={{
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '11px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer',
            }}>{isAr ? 'شارك' : 'Share'}</button>
          </div>
        </div>
      </div>

      {/* About strip */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '36px 40px',
        display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 36,
      }}>
        <div>
          <div style={{ fontSize: 11, color: BARTAL.amber, letterSpacing: 2, textTransform: 'uppercase',
                         fontWeight: 700, marginBottom: 10 }}>
            {isAr ? 'عن الماركة' : 'About the brand'}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: text, lineHeight: 1.3, marginBottom: 14,
                         letterSpacing: isAr ? 0 : -0.5 }}>
            {isAr
              ? 'سبعون عاماً من صناعة العطور العربية الأصيلة.'
              : 'Seventy years of authentic Arabian perfumery.'}
          </div>
          <div style={{ fontSize: 15, color: muted, lineHeight: 1.7 }}>
            {isAr
              ? 'تأسست أجمل في عام ١٩٥١ كأول مصنع عطور متكامل في الخليج. نشتري العود من مزارعنا في كمبوديا والهند، ونقطّر بأنفسنا في صحار. كل عطر يحمل توقيع عائلة الجابر منذ ثلاثة أجيال.'
              : 'Ajmal was founded in 1951 as the Gulf\u2019s first integrated perfume house. We source agarwood from our own plantations in Cambodia and India, and distill it ourselves in Sohar. Every fragrance carries the signature of the Al-Jaber family, three generations strong.'}
          </div>
        </div>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 11, color: muted, letterSpacing: 1, textTransform: 'uppercase',
                         fontWeight: 700, marginBottom: 14 }}>
            {isAr ? 'بائع موثّق منذ' : 'Trusted seller since'}
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: BARTAL.amber, marginBottom: 14, fontFamily: "'JetBrains Mono'" }}>2024</div>
          <div style={{ height: 1, background: line, marginBottom: 14 }}/>
          {[
            { lbl_ar: 'إيصالات مُتحقَّقة',  lbl_en: 'Receipts cleared', v: '99.4%' },
            { lbl_ar: 'تسليم في الموعد',  lbl_en: 'On-time delivery',  v: '97.1%' },
            { lbl_ar: 'متوسط التقييم',     lbl_en: 'Avg. rating',       v: '4.8 / 5' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13 }}>
              <span style={{ color: muted }}>{isAr ? s.lbl_ar : s.lbl_en}</span>
              <span style={{ color: text, fontWeight: 700 }}>{s.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom: `1px solid ${line}`, background: surface,
        padding: '0 40px', display: 'flex', gap: 28, fontSize: 14,
      }}>
        {[
          { ar: 'المنتجات (24)', en: 'Products (24)', on: true },
          { ar: 'التقييمات (412)', en: 'Reviews (412)' },
          { ar: 'حكاية الماركة', en: 'Brand story' },
          { ar: 'الأسئلة الشائعة', en: 'FAQ' },
        ].map((t, i) => (
          <div key={i} style={{
            padding: '16px 0', cursor: 'pointer',
            color: t.on ? text : muted, fontWeight: t.on ? 700 : 500,
            borderBottom: t.on ? `2px solid ${BARTAL.amber}` : '2px solid transparent',
          }}>{isAr ? t.ar : t.en}</div>
        ))}
      </div>

      {/* product grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: muted, flex: 1 }}>
            {isAr ? 'عرض ١-٦ من ٢٤ منتج' : 'Showing 1–6 of 24 products'}
          </div>
          <div style={{ fontSize: 12, color: text, fontWeight: 600,
                         padding: '6px 12px', border: `1px solid ${line}`, borderRadius: 8 }}>
            {isAr ? 'الأكثر مبيعاً' : 'Best sellers'} ▼
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {products.map(p => (
            <div key={p.id} style={{
              background: surface, borderRadius: 14, border: `1px solid ${line}`, overflow: 'hidden',
            }}>
              <div style={{ height: 200, position: 'relative' }}>
                <ProductPlaceholder label={p.name_en} hue={p.hue}/>
                {p.compare && (
                  <div style={{
                    position: 'absolute', top: 12, insetInlineStart: 12,
                    padding: '4px 10px', background: BARTAL.danger, color: '#fff',
                    fontSize: 11, fontWeight: 700, borderRadius: 4,
                  }}>−{Math.round((1 - p.price / p.compare) * 100)}%</div>
                )}
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: muted, letterSpacing: 0.5,
                               textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
                  {p.brand} · ★ {p.rating}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: text, lineHeight: 1.4, marginBottom: 8,
                               minHeight: 38, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <PriceTag amount={p.price} lang={lang} size={14} color={BARTAL.amber} compare={p.compare}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLE TILE · DESIGN-SYSTEM SUMMARY
// ═══════════════════════════════════════════════════════════════
function StyleTile({ dark }) {
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;

  const tokenCard = {
    background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 20,
  };
  const sectionTitle = {
    fontSize: 10, color: BARTAL.amber, letterSpacing: 2, textTransform: 'uppercase',
    fontWeight: 700, marginBottom: 14, fontFamily: "'Poppins'",
  };

  const palette = [
    { name: 'Navy',       hex: BARTAL.navy,      role: 'Primary'   },
    { name: 'Navy Deep',  hex: BARTAL.navyDeep,  role: 'Pressed'   },
    { name: 'Navy Ink',   hex: BARTAL.navyInk,   role: 'Type · dark bg' },
    { name: 'Amber',      hex: BARTAL.amber,     role: 'Accent'    },
    { name: 'Amber Soft', hex: BARTAL.amberSoft, role: 'Highlight' },
    { name: 'Amber Tint', hex: BARTAL.amberTint, role: 'Wash'      },
    { name: 'Sand',       hex: BARTAL.sand,      role: 'App bg'    },
    { name: 'Paper',      hex: BARTAL.paper,     role: 'Card bg'   },
    { name: 'Line',       hex: BARTAL.line,      role: 'Hairline'  },
  ];

  const status = [
    { name: 'Success', hex: BARTAL.success },
    { name: 'Danger',  hex: BARTAL.danger  },
    { name: 'Info',    hex: BARTAL.info    },
  ];

  return (
    <div style={{
      padding: '30px 24px 80px', background: bg, minHeight: '100%',
      fontFamily: "'Poppins'", color: text,
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto 28px' }}>
        <div style={{ fontSize: 11, color: BARTAL.amber, letterSpacing: 2, textTransform: 'uppercase',
                       fontWeight: 700, marginBottom: 8 }}>
          Bartal · design system at a glance
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: text, lineHeight: 1.15, marginBottom: 10, letterSpacing: -0.5 }}>
          The brand tokens, type system, and component grammar behind every screen.
        </div>
        <div style={{ fontSize: 14, color: muted, maxWidth: 720, lineHeight: 1.6 }}>
          Navy + amber on warm sand. Cairo for Arabic, Poppins for Latin, JetBrains Mono for numerics.
          Geometric 8-fold star motifs from Sudanese architectural tradition. Everything below is what
          the mobile, web, and admin surfaces are built from.
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* LOGO + MOTIF */}
        <div style={{ ...tokenCard, padding: 0, overflow: 'hidden', position: 'relative', minHeight: 280 }}>
          <div style={{ position: 'absolute', inset: 0, background: BARTAL.navyInk }}/>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.22 }}>
            <MotifBg color={BARTAL.amberSoft} opacity={0.6} style={{ width: '100%', height: '100%' }}>
              <div style={{ width: '100%', height: '100%' }}/>
            </MotifBg>
          </div>
          <div style={{ position: 'relative', padding: 28, color: '#fff', height: '100%',
                         display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 10, color: BARTAL.amberSoft, letterSpacing: 2, textTransform: 'uppercase',
                             fontWeight: 700, marginBottom: 14 }}>Logo lockup</div>
              <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
                <BartalLogo color="#fff" accent={BARTAL.amber} size={44} lang="ar"/>
                <BartalLogo color="#fff" accent={BARTAL.amber} size={44} lang="en"/>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
              <div>
                <div style={{ fontSize: 10, color: BARTAL.amberSoft, letterSpacing: 2,
                               textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Mark</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <LogoMark color="#fff" accent={BARTAL.amber} size={48}/>
                  <LogoMark color="#fff" accent={BARTAL.amber} size={32}/>
                  <LogoMark color="#fff" accent={BARTAL.amber} size={20}/>
                </div>
              </div>
              <div style={{ flex: 1 }}/>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', maxWidth: 220, lineHeight: 1.55 }}>
                <em style={{ color: BARTAL.amberSoft, fontStyle: 'normal', fontWeight: 700 }}>برتال (bartal)</em> — Arabic for <em>portal</em>.
                The 8-pointed star is rendered as a doorway with an amber sun at the centre.
              </div>
            </div>
          </div>
        </div>

        {/* TYPE */}
        <div style={tokenCard}>
          <div style={sectionTitle}>Typography</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: muted, marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
              Cairo · Arabic
            </div>
            <div style={{ fontFamily: "'Cairo'", fontSize: 32, fontWeight: 700, color: text, lineHeight: 1.1 }}>
              بوابتك للتسوق
            </div>
            <div style={{ fontFamily: "'Cairo'", fontSize: 14, color: muted, marginTop: 2 }}>
              نص توضيحي بحجم متوسط
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: muted, marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
              Poppins · Latin
            </div>
            <div style={{ fontFamily: "'Poppins'", fontSize: 32, fontWeight: 700, color: text, lineHeight: 1.1, letterSpacing: -0.7 }}>
              Your gateway
            </div>
            <div style={{ fontFamily: "'Poppins'", fontSize: 14, color: muted, marginTop: 2 }}>
              Medium body copy at 14px
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: muted, marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
              JetBrains Mono · Numerics
            </div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 22, fontWeight: 700, color: BARTAL.amber }}>
              185,000 SDG
            </div>
          </div>
        </div>

        {/* PALETTE — brand */}
        <div style={tokenCard}>
          <div style={sectionTitle}>Palette · brand</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {palette.map(c => {
              const dark2 = ['Navy', 'Navy Deep', 'Navy Ink'].includes(c.name);
              return (
                <div key={c.name} style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${line}` }}>
                  <div style={{ height: 56, background: c.hex }}/>
                  <div style={{ padding: '8px 10px', background: surface }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: text }}>{c.name}</div>
                    <div style={{ fontSize: 9, color: muted, fontFamily: "'JetBrains Mono'", marginTop: 1 }}>{c.hex.toUpperCase()}</div>
                    <div style={{ fontSize: 9, color: muted, marginTop: 1 }}>{c.role}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PALETTE — status + dark */}
        <div style={tokenCard}>
          <div style={sectionTitle}>Status · Dark mode</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {status.map(c => (
              <div key={c.name} style={{ flex: 1, borderRadius: 10, overflow: 'hidden', border: `1px solid ${line}` }}>
                <div style={{ height: 40, background: c.hex }}/>
                <div style={{ padding: '6px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: text }}>{c.name}</div>
                  <div style={{ fontSize: 9, color: muted, fontFamily: "'JetBrains Mono'" }}>{c.hex.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9, color: muted, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Dark surface stack</div>
          <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden' }}>
            {['d_bg','d_surface','d_raised','d_line'].map(k => (
              <div key={k} style={{ flex: 1, background: BARTAL[k], padding: '10px 8px',
                                     fontSize: 9, color: '#fff', fontFamily: "'JetBrains Mono'" }}>
                {BARTAL[k].toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div style={tokenCard}>
          <div style={sectionTitle}>Buttons</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <button style={{ background: BARTAL.navy, color: '#fff', border: 'none', padding: '11px 22px',
                              borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>Primary</button>
            <button style={{ background: BARTAL.amber, color: '#fff', border: 'none', padding: '11px 22px',
                              borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>Accent</button>
            <button style={{ background: 'transparent', color: BARTAL.navy, border: `1.5px solid ${BARTAL.navy}`,
                              padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>Secondary</button>
            <button style={{ background: 'transparent', color: muted, border: 'none', padding: '11px 18px',
                              fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Ghost</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { lbl: 'Bank transfer', bg: BARTAL.amberTint, fg: BARTAL.amber },
              { lbl: 'COD',           bg: BARTAL.amber + '20', fg: BARTAL.amber },
              { lbl: 'Verified',      bg: BARTAL.success + '15', fg: BARTAL.success },
              { lbl: 'Rejected',      bg: BARTAL.danger + '15', fg: BARTAL.danger },
              { lbl: 'Pending',       bg: BARTAL.info + '15', fg: BARTAL.info },
            ].map((b, i) => (
              <span key={i} style={{
                padding: '4px 10px', borderRadius: 100, background: b.bg, color: b.fg,
                fontSize: 11, fontWeight: 700, fontFamily: "'Poppins'",
              }}>{b.lbl}</span>
            ))}
          </div>
        </div>

        {/* PRICE & NUMERALS */}
        <div style={tokenCard}>
          <div style={sectionTitle}>Price tag · numerals</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 9, color: muted, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Latin</div>
              <PriceTag amount={185000} lang="en" size={20} color={BARTAL.amber} compare={220000}/>
            </div>
            <div>
              <div style={{ fontSize: 9, color: muted, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Eastern Arabic</div>
              <PriceTag amount={185000} lang="ar" numerals="arabic" size={20} color={BARTAL.amber} compare={220000}/>
            </div>
            <div>
              <div style={{ fontSize: 9, color: muted, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Small</div>
              <PriceTag amount={42000} lang="en" size={13}/>
            </div>
            <div>
              <div style={{ fontSize: 9, color: muted, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Plain</div>
              <PriceTag amount={620000} lang="en" size={16} strong={false}/>
            </div>
          </div>
        </div>

        {/* PLACEHOLDER PALETTES */}
        <div style={tokenCard}>
          <div style={sectionTitle}>Product imagery · placeholder hues</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {['warm','amber','rose','navy','green','night'].map(h => (
              <div key={h} style={{ aspectRatio: '1.2 / 1', borderRadius: 10, overflow: 'hidden' }}>
                <ProductPlaceholder label={h} hue={h}/>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: muted, marginTop: 12, lineHeight: 1.55 }}>
            Subtly-striped boxes hint at product category before real photography lands.
            Hue maps to product: <strong style={{ color: text }}>amber</strong> for fragrance,
            <strong style={{ color: text }}> navy</strong> for electronics,
            <strong style={{ color: text }}> rose</strong> for women's, etc.
          </div>
        </div>

        {/* MOTIF + RADII */}
        <div style={tokenCard}>
          <div style={sectionTitle}>Motif · radii · spacing</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
            <div style={{ width: 80, height: 80, background: BARTAL.navy, borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
                <MotifBg color={BARTAL.amberSoft} opacity={0.6} style={{ width: '100%', height: '100%' }}>
                  <div style={{ width: '100%', height: '100%' }}/>
                </MotifBg>
              </div>
            </div>
            <div style={{ fontSize: 11, color: muted, lineHeight: 1.55, flex: 1 }}>
              <strong style={{ color: text }}>8-pointed star</strong> from traditional Sudanese geometry —
              used as low-opacity background on hero, receipts, brand strips. Never as a foreground glyph.
            </div>
          </div>
          <div style={{ fontSize: 9, color: muted, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Radius scale</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {[
              { r: 6, lbl: 'xs' }, { r: 8, lbl: 'sm' }, { r: 10, lbl: 'md' },
              { r: 12, lbl: 'lg' }, { r: 14, lbl: 'xl' }, { r: 999, lbl: 'pill' },
            ].map(s => (
              <div key={s.lbl} style={{ flex: 1 }}>
                <div style={{ height: 40, background: BARTAL.amberTint, borderRadius: s.r,
                              border: `1px solid ${BARTAL.amber}40` }}/>
                <div style={{ fontSize: 9, color: muted, marginTop: 4, textAlign: 'center', fontFamily: "'JetBrains Mono'" }}>
                  {s.lbl} · {s.r === 999 ? '999' : s.r}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: surface map */}
      <div style={{ maxWidth: 1240, margin: '24px auto 0', ...tokenCard }}>
        <div style={sectionTitle}>Surface map</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, fontSize: 12, color: text }}>
          {[
            { lbl: 'Mobile', sub: 'AR + EN · light + dark · 3 variations · iOS + Android', count: '42 screens' },
            { lbl: 'Web', sub: 'Next.js 14 · [locale]/ segment · SSR · next-intl', count: '34 pages' },
            { lbl: 'Admin', sub: 'React + Vite · EN-only · operations team', count: '24 pages' },
            { lbl: 'Brand', sub: 'Logo, wordmark, motifs, photography placeholder', count: 'this tile' },
          ].map(s => (
            <div key={s.lbl} style={{ padding: 14, background: bg, borderRadius: 10, border: `1px solid ${line}` }}>
              <div style={{ fontSize: 11, color: BARTAL.amber, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                {s.lbl}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: text, fontFamily: "'JetBrains Mono'", marginBottom: 6 }}>{s.count}</div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  WebJournal, WebBrandPage, StyleTile,
});
