import type { AdminLocale } from '../state/prefs-store';

const en: AdminDictionary = {
  app: { name: 'Bartal Admin' },
  nav: {
    dashboard: 'Dashboard',
    orders: 'Orders',
    customers: 'Customers',
    zones: 'Zones',
    settings: 'Settings',
    products: 'Products',
    categories: 'Categories',
    reviews: 'Reviews',
    marketing: 'Marketing',
    staff: 'Staff',
    analytics: 'Analytics',
    inventoryLog: 'Inventory log',
    abandonedCarts: 'Abandoned carts',
    refunds: 'Refunds',
    shippingLabels: 'Shipping labels',
    templates: 'Templates',
    promos: 'Promos',
    banners: 'Banners',
    comingSoon: 'Soon',
    logout: 'Log out',
  },
  topbar: {
    locale: 'Language',
    theme: 'Theme',
  },
  login: {
    title: 'Sign in to Bartal Admin',
    subtitle: 'Use your admin phone and password.',
    phone: 'Phone number',
    password: 'Password',
    submit: 'Sign in',
    submitting: 'Signing in…',
    notAdmin: 'This account is not an admin.',
    invalidPhone: 'Enter a valid Sudanese phone (+249 followed by 9 digits).',
    shortPassword: 'Password must be at least 8 characters.',
  },
  dashboard: {
    revenueToday: 'Revenue today',
    ordersToday: 'Orders today',
    pendingPayments: 'Pending receipts',
    lowStock: 'Low stock items',
    revenueChart: 'Revenue · last 14 days',
    statusChart: 'Orders by status',
    recentOrders: 'Recent orders',
    topProducts: 'Top sellers · last 30 days',
    emptyOrders: 'No orders yet.',
    emptyTop: 'No sales recorded yet.',
    viewAll: 'View all',
    sdg: 'SDG',
  },
  orders: {
    title: 'Orders',
    tabs: {
      all: 'All',
      needsReview: 'Needs review',
      pending: 'Pending',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
    searchPlaceholder: 'Search by order #, customer name or phone…',
    zoneAll: 'All zones',
    columns: {
      orderNumber: 'Order #',
      customer: 'Customer',
      placed: 'Placed',
      total: 'Total',
      payment: 'Payment',
      status: 'Status',
      actions: '',
    },
    empty: 'No orders match these filters.',
    view: 'View',
    paymentMethods: {
      BANK_TRANSFER: 'Bank',
      CASH_ON_DELIVERY: 'COD',
    },
  },
  orderDetail: {
    statusTimeline: 'Status timeline',
    items: 'Items',
    customer: 'Customer',
    shippingAddress: 'Delivery address',
    paymentBlock: 'Payment',
    receiptNotUploaded: 'Receipt not uploaded yet.',
    receiptUploaded: 'Receipt uploaded',
    viewReceipt: 'View receipt',
    actions: {
      heading: 'Take action',
      confirmPayment: 'Confirm payment',
      rejectPayment: 'Reject payment',
      startProcessing: 'Start processing',
      markShipped: 'Mark shipped',
      markDelivered: 'Mark delivered',
      cancelOrder: 'Cancel order',
      noActions: 'No actions available for this state.',
      reasonLabel: 'Reason (required, ≥ 3 chars)',
      noteLabel: 'Note (optional)',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    internalNotes: 'Internal notes',
    internalNotesEmpty: 'No internal notes yet.',
  },
  receiptViewer: {
    title: 'Receipt review',
    closeLabel: 'Close',
    bank: 'Bank',
    account: 'Account #',
    amount: 'Amount',
    reference: 'Reference',
    matchChecker: 'Match checker',
    matchInstruction: 'Tick each field that matches the bank statement before approving.',
    approve: 'Approve',
    reject: 'Reject',
    fetchError: 'Could not load the receipt image.',
    noReceipt: 'No receipt uploaded.',
  },
  customers: {
    title: 'Customers',
    searchPlaceholder: 'Search by name or phone…',
    columns: {
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      orders: 'Orders',
      lastOrder: 'Last order',
      actions: '',
    },
    empty: 'No customers found.',
    notVerified: 'Unverified',
    verified: 'Verified',
    view: 'View',
    backToList: '← Back to customers',
    totalSpent: 'Total spent',
    memberSince: 'Member since',
    addresses: 'Addresses',
    noAddresses: 'No saved addresses.',
    recentOrders: 'Recent orders',
    noOrders: 'No orders yet.',
  },
  zones: {
    title: 'Delivery zones',
    columns: {
      zone: 'Zone',
      fee: 'Fee (SDG)',
      freeAbove: 'Free above (SDG)',
      etaMin: 'Min days',
      etaMax: 'Max days',
      actions: '',
    },
    save: 'Save',
    saving: 'Saving…',
    saved: 'Zone updated',
    error: 'Could not save zone',
  },
  settings: {
    title: 'Settings',
    tabs: {
      general: 'General',
      banking: 'Banking',
      checkout: 'Checkout',
      tax: 'Tax',
      locales: 'Locales',
      team: 'Team',
      legal: 'Legal',
      integrations: 'Integrations',
    },
    comingSoon: 'Coming soon',
    save: 'Save changes',
    saving: 'Saving…',
    savedToast: 'Settings saved',
    general: {
      storeNameAr: 'Store name (Arabic)',
      storeNameEn: 'Store name (English)',
      supportPhone: 'Support phone',
      supportEmail: 'Support email',
      whatsappNumber: 'WhatsApp number',
      businessAddress: 'Business address',
    },
    banking: {
      heading: 'Receiving bank accounts',
      readOnly: 'Read-only this slice — editing lands in the next admin pass.',
    },
  },
  shell: {
    loggedInAs: 'Logged in as',
    notFound: 'Page not found',
    notFoundBody: 'The page you were looking for does not exist.',
    backToDashboard: 'Back to dashboard',
  },
  common: {
    loading: 'Loading…',
    retry: 'Retry',
    error: 'Something went wrong.',
    none: '—',
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
  },
  products: {
    title: 'Products',
    newProduct: '+ New product',
    searchPlaceholder: 'Search by name, slug or SKU…',
    categoryAll: 'All categories',
    tabs: {
      all: 'All',
      active: 'Active',
      inactive: 'Drafts',
      out_of_stock: 'Out of stock',
      featured: 'Featured',
    },
    columns: {
      product: 'Product',
      category: 'Category',
      price: 'Price',
      stock: 'Stock',
      status: 'Status',
      actions: '',
    },
    empty: 'No products match these filters.',
    edit: 'Edit',
    statusActive: 'Active',
    statusInactive: 'Draft',
    statusOos: 'Out of stock',
    featured: 'Featured',
  },
  productForm: {
    createTitle: 'New product',
    editTitle: 'Edit product',
    backToList: '← Back to products',
    sections: {
      details: 'Details',
      media: 'Media',
      pricing: 'Pricing',
      organization: 'Organization',
      status: 'Status',
    },
    fields: {
      nameAr: 'Name (Arabic)',
      nameEn: 'Name (English)',
      slug: 'Slug',
      slugHint: 'Auto-generated from English name. Must be unique.',
      sku: 'SKU (optional)',
      descriptionAr: 'Description (Arabic)',
      descriptionEn: 'Description (English)',
      price: 'Price (SDG)',
      comparePrice: 'Compare price (optional)',
      weightGrams: 'Weight (g)',
      category: 'Category',
      isActive: 'Active',
      isFeatured: 'Featured',
    },
    save: 'Save changes',
    saving: 'Saving…',
    create: 'Create product',
    creating: 'Creating…',
    softDelete: 'Soft-delete product',
    softDeleted: 'Product deactivated',
    softDeleteConfirm: 'Deactivate this product? Customers will no longer see it.',
    activate: 'Activate product',
    activated: 'Product activated',
    saved: 'Saved',
    media: {
      heading: 'Images',
      empty: 'No images yet. Add the first one once the product is saved.',
      add: '+ Add image',
      uploading: 'Uploading…',
      sortOrder: 'Order',
      setPrimary: 'Set primary',
      isPrimary: 'Primary',
      delete: 'Delete',
      deleteConfirm: 'Delete this image?',
      needsSave: 'Save the product before uploading images.',
    },
    validation: {
      required: 'Required.',
      shortName: 'Name is too short.',
      priceNonNegative: 'Price must be 0 or greater.',
      stockNonNegative: 'Stock must be 0 or greater.',
    },
  },
  categories: {
    title: 'Categories',
    newCategory: '+ New category',
    sectionTree: 'Tree',
    sectionEdit: 'Edit category',
    sectionCreate: 'New category',
    productCount: '{count} products',
    live: 'Live',
    hidden: 'Hidden',
    selectToEdit: 'Select a category to edit it.',
    fields: {
      nameAr: 'Name (Arabic)',
      nameEn: 'Name (English)',
      slug: 'Slug',
      parent: 'Parent category',
      noParent: '(top level)',
      sortOrder: 'Sort order',
      isActive: 'Active',
    },
    save: 'Save changes',
    create: 'Create category',
    saving: 'Saving…',
    saved: 'Category saved',
  },
  reviews: {
    title: 'Reviews',
    kpi: {
      pending: 'Pending review',
      pendingSub: '{n} awaiting first response',
      flagged: 'Auto-flagged',
      flaggedSub: 'spam / abuse / off-topic',
      avgRating: 'Avg rating · 30d',
      avgRatingSub: 'across approved reviews',
      verified: 'Verified buyers',
      verifiedSub: 'last 30 days',
      avgResponse: 'Avg response',
      avgResponseSub: 'target: under 24h',
    },
    tabs: {
      pending: 'Pending',
      flagged: 'Flagged',
      approved: 'Approved',
      rejected: 'Rejected',
    },
    listEmpty: 'Nothing to moderate here.',
    flaggedPill: 'FLAGGED',
    verifiedPill: '✓ Verified buyer',
    guestPill: 'Guest',
    autoFlagBanner: 'Auto-flagged · {reason} · review carefully before approving.',
    internalContext: 'Internal context',
    ratingLabel: 'Rating',
    productLabel: 'Product',
    customerLabel: 'Customer',
    customerPhone: 'Phone',
    submittedAt: 'Submitted',
    approveBtn: '✓ Approve & publish',
    rejectBtn: '✕ Reject',
    rejectHeading: 'Reject with reason',
    rejectReasons: {
      offTopic: 'Off-topic',
      spam: 'Promotional / spam',
      personalInfo: 'Personal info shared',
      abusive: 'Abusive language',
      lowQuality: 'Low quality / no detail',
      fake: 'Suspected fake',
      duplicate: 'Duplicate review',
    },
    rejectConfirm: 'Reject review',
    cancel: 'Cancel',
    approvedToast: 'Review approved',
    rejectedToast: 'Review rejected',
    resetToast: 'Moved back to pending',
    resolvedApproved: 'This review has been approved.',
    resolvedRejected: 'This review has been rejected.',
    moveBackToPending: 'Move back to pending',
    selectReviewHint: 'Select a review on the left to start moderating.',
  },
  staff: {
    title: 'Staff & audit log',
    subtitle: '{n} active team members · all admin actions tracked',
    inviteBtn: '+ Invite member',
    inviteComingSoon: 'Invite flow ships in a later admin pass.',
    teamHeading: 'Team members',
    auditHeading: 'Recent activity',
    online: 'Active now',
    lastSeen: 'Last login',
    neverLoggedIn: 'Never logged in',
    emptyStaff: 'No active admins yet.',
    emptyAudit: 'No activity yet.',
    roles: {
      ADMIN: 'Admin',
      CUSTOMER: 'Customer',
    },
  },
};

export interface AdminDictionary {
  app: { name: string };
  nav: {
    dashboard: string;
    orders: string;
    customers: string;
    zones: string;
    settings: string;
    products: string;
    categories: string;
    reviews: string;
    marketing: string;
    staff: string;
    analytics: string;
    inventoryLog: string;
    abandonedCarts: string;
    refunds: string;
    shippingLabels: string;
    templates: string;
    promos: string;
    banners: string;
    comingSoon: string;
    logout: string;
  };
  topbar: { locale: string; theme: string };
  login: {
    title: string;
    subtitle: string;
    phone: string;
    password: string;
    submit: string;
    submitting: string;
    notAdmin: string;
    invalidPhone: string;
    shortPassword: string;
  };
  dashboard: {
    revenueToday: string;
    ordersToday: string;
    pendingPayments: string;
    lowStock: string;
    revenueChart: string;
    statusChart: string;
    recentOrders: string;
    topProducts: string;
    emptyOrders: string;
    emptyTop: string;
    viewAll: string;
    sdg: string;
  };
  orders: {
    title: string;
    tabs: {
      all: string;
      needsReview: string;
      pending: string;
      confirmed: string;
      shipped: string;
      delivered: string;
      cancelled: string;
    };
    searchPlaceholder: string;
    zoneAll: string;
    columns: {
      orderNumber: string;
      customer: string;
      placed: string;
      total: string;
      payment: string;
      status: string;
      actions: string;
    };
    empty: string;
    view: string;
    paymentMethods: { BANK_TRANSFER: string; CASH_ON_DELIVERY: string };
  };
  orderDetail: {
    statusTimeline: string;
    items: string;
    customer: string;
    shippingAddress: string;
    paymentBlock: string;
    receiptNotUploaded: string;
    receiptUploaded: string;
    viewReceipt: string;
    actions: {
      heading: string;
      confirmPayment: string;
      rejectPayment: string;
      startProcessing: string;
      markShipped: string;
      markDelivered: string;
      cancelOrder: string;
      noActions: string;
      reasonLabel: string;
      noteLabel: string;
      cancel: string;
      confirm: string;
    };
    internalNotes: string;
    internalNotesEmpty: string;
  };
  receiptViewer: {
    title: string;
    closeLabel: string;
    bank: string;
    account: string;
    amount: string;
    reference: string;
    matchChecker: string;
    matchInstruction: string;
    approve: string;
    reject: string;
    fetchError: string;
    noReceipt: string;
  };
  customers: {
    title: string;
    searchPlaceholder: string;
    columns: {
      name: string;
      phone: string;
      email: string;
      orders: string;
      lastOrder: string;
      actions: string;
    };
    empty: string;
    notVerified: string;
    verified: string;
    view: string;
    backToList: string;
    totalSpent: string;
    memberSince: string;
    addresses: string;
    noAddresses: string;
    recentOrders: string;
    noOrders: string;
  };
  zones: {
    title: string;
    columns: {
      zone: string;
      fee: string;
      freeAbove: string;
      etaMin: string;
      etaMax: string;
      actions: string;
    };
    save: string;
    saving: string;
    saved: string;
    error: string;
  };
  settings: {
    title: string;
    tabs: {
      general: string;
      banking: string;
      checkout: string;
      tax: string;
      locales: string;
      team: string;
      legal: string;
      integrations: string;
    };
    comingSoon: string;
    save: string;
    saving: string;
    savedToast: string;
    general: {
      storeNameAr: string;
      storeNameEn: string;
      supportPhone: string;
      supportEmail: string;
      whatsappNumber: string;
      businessAddress: string;
    };
    banking: { heading: string; readOnly: string };
  };
  shell: {
    loggedInAs: string;
    notFound: string;
    notFoundBody: string;
    backToDashboard: string;
  };
  common: {
    loading: string;
    retry: string;
    error: string;
    none: string;
    yes: string;
    no: string;
    cancel: string;
  };
  products: {
    title: string;
    newProduct: string;
    searchPlaceholder: string;
    categoryAll: string;
    tabs: {
      all: string;
      active: string;
      inactive: string;
      out_of_stock: string;
      featured: string;
    };
    columns: {
      product: string;
      category: string;
      price: string;
      stock: string;
      status: string;
      actions: string;
    };
    empty: string;
    edit: string;
    statusActive: string;
    statusInactive: string;
    statusOos: string;
    featured: string;
  };
  productForm: {
    createTitle: string;
    editTitle: string;
    backToList: string;
    sections: {
      details: string;
      media: string;
      pricing: string;
      organization: string;
      status: string;
    };
    fields: {
      nameAr: string;
      nameEn: string;
      slug: string;
      slugHint: string;
      sku: string;
      descriptionAr: string;
      descriptionEn: string;
      price: string;
      comparePrice: string;
      weightGrams: string;
      category: string;
      isActive: string;
      isFeatured: string;
    };
    save: string;
    saving: string;
    create: string;
    creating: string;
    softDelete: string;
    softDeleted: string;
    softDeleteConfirm: string;
    activate: string;
    activated: string;
    saved: string;
    media: {
      heading: string;
      empty: string;
      add: string;
      uploading: string;
      sortOrder: string;
      setPrimary: string;
      isPrimary: string;
      delete: string;
      deleteConfirm: string;
      needsSave: string;
    };
    validation: {
      required: string;
      shortName: string;
      priceNonNegative: string;
      stockNonNegative: string;
    };
  };
  categories: {
    title: string;
    newCategory: string;
    sectionTree: string;
    sectionEdit: string;
    sectionCreate: string;
    productCount: string;
    live: string;
    hidden: string;
    selectToEdit: string;
    fields: {
      nameAr: string;
      nameEn: string;
      slug: string;
      parent: string;
      noParent: string;
      sortOrder: string;
      isActive: string;
    };
    save: string;
    create: string;
    saving: string;
    saved: string;
  };
  reviews: {
    title: string;
    kpi: {
      pending: string;
      pendingSub: string;
      flagged: string;
      flaggedSub: string;
      avgRating: string;
      avgRatingSub: string;
      verified: string;
      verifiedSub: string;
      avgResponse: string;
      avgResponseSub: string;
    };
    tabs: {
      pending: string;
      flagged: string;
      approved: string;
      rejected: string;
    };
    listEmpty: string;
    flaggedPill: string;
    verifiedPill: string;
    guestPill: string;
    autoFlagBanner: string;
    internalContext: string;
    ratingLabel: string;
    productLabel: string;
    customerLabel: string;
    customerPhone: string;
    submittedAt: string;
    approveBtn: string;
    rejectBtn: string;
    rejectHeading: string;
    rejectReasons: {
      offTopic: string;
      spam: string;
      personalInfo: string;
      abusive: string;
      lowQuality: string;
      fake: string;
      duplicate: string;
    };
    rejectConfirm: string;
    cancel: string;
    approvedToast: string;
    rejectedToast: string;
    resetToast: string;
    resolvedApproved: string;
    resolvedRejected: string;
    moveBackToPending: string;
    selectReviewHint: string;
  };
  staff: {
    title: string;
    subtitle: string;
    inviteBtn: string;
    inviteComingSoon: string;
    teamHeading: string;
    auditHeading: string;
    online: string;
    lastSeen: string;
    neverLoggedIn: string;
    emptyStaff: string;
    emptyAudit: string;
    roles: {
      ADMIN: string;
      CUSTOMER: string;
    };
  };
}

const ar: AdminDictionary = {
  app: { name: 'إدارة برتال' },
  nav: {
    dashboard: 'لوحة التحكم',
    orders: 'الطلبات',
    customers: 'العملاء',
    zones: 'مناطق التوصيل',
    settings: 'الإعدادات',
    products: 'المنتجات',
    categories: 'الفئات',
    reviews: 'التقييمات',
    marketing: 'التسويق',
    staff: 'الموظفون',
    analytics: 'التحليلات',
    inventoryLog: 'سجل المخزون',
    abandonedCarts: 'سلات متروكة',
    refunds: 'المرتجعات',
    shippingLabels: 'بطاقات الشحن',
    templates: 'قوالب الرسائل',
    promos: 'رموز الخصم',
    banners: 'البانرات',
    comingSoon: 'قريباً',
    logout: 'تسجيل الخروج',
  },
  topbar: {
    locale: 'اللغة',
    theme: 'المظهر',
  },
  login: {
    title: 'تسجيل الدخول إلى إدارة برتال',
    subtitle: 'استخدم رقم هاتفك وكلمة المرور كمسؤول.',
    phone: 'رقم الهاتف',
    password: 'كلمة المرور',
    submit: 'دخول',
    submitting: 'جارٍ تسجيل الدخول…',
    notAdmin: 'هذا الحساب ليس مسؤولاً.',
    invalidPhone: 'أدخل رقم هاتف سوداني صالح (+249 يتبعه ٩ أرقام).',
    shortPassword: 'يجب ألا تقل كلمة المرور عن ٨ أحرف.',
  },
  dashboard: {
    revenueToday: 'إيرادات اليوم',
    ordersToday: 'طلبات اليوم',
    pendingPayments: 'إيصالات قيد المراجعة',
    lowStock: 'منتجات منخفضة المخزون',
    revenueChart: 'الإيرادات · آخر ١٤ يوماً',
    statusChart: 'الطلبات حسب الحالة',
    recentOrders: 'الطلبات الأخيرة',
    topProducts: 'الأكثر مبيعاً · آخر ٣٠ يوماً',
    emptyOrders: 'لا توجد طلبات بعد.',
    emptyTop: 'لا توجد مبيعات مسجلة.',
    viewAll: 'عرض الكل',
    sdg: 'ج.س',
  },
  orders: {
    title: 'الطلبات',
    tabs: {
      all: 'الكل',
      needsReview: 'تحتاج مراجعة',
      pending: 'قيد الانتظار',
      confirmed: 'مؤكدة',
      shipped: 'قيد الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغاة',
    },
    searchPlaceholder: 'ابحث برقم الطلب أو اسم/هاتف العميل…',
    zoneAll: 'كل المناطق',
    columns: {
      orderNumber: 'رقم الطلب',
      customer: 'العميل',
      placed: 'تاريخ الإنشاء',
      total: 'الإجمالي',
      payment: 'الدفع',
      status: 'الحالة',
      actions: '',
    },
    empty: 'لا توجد طلبات تطابق التصفية.',
    view: 'عرض',
    paymentMethods: {
      BANK_TRANSFER: 'بنكي',
      CASH_ON_DELIVERY: 'عند الاستلام',
    },
  },
  orderDetail: {
    statusTimeline: 'مسار الحالة',
    items: 'العناصر',
    customer: 'العميل',
    shippingAddress: 'عنوان التوصيل',
    paymentBlock: 'الدفع',
    receiptNotUploaded: 'لم يُرفع إيصال بعد.',
    receiptUploaded: 'تم رفع الإيصال',
    viewReceipt: 'عرض الإيصال',
    actions: {
      heading: 'الإجراءات',
      confirmPayment: 'تأكيد الدفع',
      rejectPayment: 'رفض الدفع',
      startProcessing: 'بدء التحضير',
      markShipped: 'تم الشحن',
      markDelivered: 'تم التسليم',
      cancelOrder: 'إلغاء الطلب',
      noActions: 'لا توجد إجراءات متاحة في هذه الحالة.',
      reasonLabel: 'السبب (مطلوب، ٣ أحرف على الأقل)',
      noteLabel: 'ملاحظة (اختياري)',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
    },
    internalNotes: 'ملاحظات داخلية',
    internalNotesEmpty: 'لا توجد ملاحظات داخلية.',
  },
  receiptViewer: {
    title: 'مراجعة الإيصال',
    closeLabel: 'إغلاق',
    bank: 'البنك',
    account: 'رقم الحساب',
    amount: 'المبلغ',
    reference: 'المرجع',
    matchChecker: 'تطابق الإيصال',
    matchInstruction: 'علّم كل حقل مطابق لكشف البنك قبل الموافقة.',
    approve: 'اعتماد',
    reject: 'رفض',
    fetchError: 'تعذّر تحميل صورة الإيصال.',
    noReceipt: 'لم يُرفع إيصال.',
  },
  customers: {
    title: 'العملاء',
    searchPlaceholder: 'ابحث بالاسم أو الهاتف…',
    columns: {
      name: 'الاسم',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      orders: 'الطلبات',
      lastOrder: 'آخر طلب',
      actions: '',
    },
    empty: 'لم يُعثر على عملاء.',
    notVerified: 'غير موثّق',
    verified: 'موثّق',
    view: 'عرض',
    backToList: '← العودة للعملاء',
    totalSpent: 'الإنفاق الإجمالي',
    memberSince: 'عضو منذ',
    addresses: 'العناوين',
    noAddresses: 'لا توجد عناوين محفوظة.',
    recentOrders: 'آخر الطلبات',
    noOrders: 'لا توجد طلبات بعد.',
  },
  zones: {
    title: 'مناطق التوصيل',
    columns: {
      zone: 'المنطقة',
      fee: 'الرسوم (ج.س)',
      freeAbove: 'مجاناً فوق (ج.س)',
      etaMin: 'الحد الأدنى للأيام',
      etaMax: 'الحد الأقصى للأيام',
      actions: '',
    },
    save: 'حفظ',
    saving: 'جارٍ الحفظ…',
    saved: 'تم تحديث المنطقة',
    error: 'تعذّر حفظ المنطقة',
  },
  settings: {
    title: 'الإعدادات',
    tabs: {
      general: 'عام',
      banking: 'البنوك',
      checkout: 'الدفع',
      tax: 'الضرائب',
      locales: 'اللغات',
      team: 'الفريق',
      legal: 'القانوني',
      integrations: 'التكاملات',
    },
    comingSoon: 'قريباً',
    save: 'حفظ التغييرات',
    saving: 'جارٍ الحفظ…',
    savedToast: 'تم حفظ الإعدادات',
    general: {
      storeNameAr: 'اسم المتجر (عربي)',
      storeNameEn: 'اسم المتجر (إنجليزي)',
      supportPhone: 'هاتف الدعم',
      supportEmail: 'بريد الدعم',
      whatsappNumber: 'رقم الواتساب',
      businessAddress: 'العنوان التجاري',
    },
    banking: {
      heading: 'الحسابات البنكية المستلمة',
      readOnly: 'للقراءة فقط في هذه الدفعة — التعديل يأتي في الإصدار القادم.',
    },
  },
  shell: {
    loggedInAs: 'مسجل الدخول كـ',
    notFound: 'الصفحة غير موجودة',
    notFoundBody: 'الصفحة التي تبحث عنها غير موجودة.',
    backToDashboard: 'العودة للوحة التحكم',
  },
  common: {
    loading: 'جارٍ التحميل…',
    retry: 'إعادة المحاولة',
    error: 'حدث خطأ ما.',
    none: '—',
    yes: 'نعم',
    no: 'لا',
    cancel: 'إلغاء',
  },
  products: {
    title: 'المنتجات',
    newProduct: '+ منتج جديد',
    searchPlaceholder: 'ابحث بالاسم، الرابط، أو SKU…',
    categoryAll: 'كل الفئات',
    tabs: {
      all: 'الكل',
      active: 'منشورة',
      inactive: 'مسودات',
      out_of_stock: 'نفذت',
      featured: 'مميزة',
    },
    columns: {
      product: 'المنتج',
      category: 'الفئة',
      price: 'السعر',
      stock: 'المخزون',
      status: 'الحالة',
      actions: '',
    },
    empty: 'لا توجد منتجات تطابق التصفية.',
    edit: 'تعديل',
    statusActive: 'منشور',
    statusInactive: 'مسودة',
    statusOos: 'نفذ',
    featured: 'مميز',
  },
  productForm: {
    createTitle: 'منتج جديد',
    editTitle: 'تعديل المنتج',
    backToList: '← العودة للمنتجات',
    sections: {
      details: 'التفاصيل',
      media: 'الصور',
      pricing: 'السعر',
      organization: 'التصنيف',
      status: 'الحالة',
    },
    fields: {
      nameAr: 'الاسم (عربي)',
      nameEn: 'الاسم (إنجليزي)',
      slug: 'الرابط',
      slugHint: 'يُنشأ تلقائياً من الاسم الإنجليزي. يجب أن يكون فريداً.',
      sku: 'الرمز SKU (اختياري)',
      descriptionAr: 'الوصف (عربي)',
      descriptionEn: 'الوصف (إنجليزي)',
      price: 'السعر (ج.س)',
      comparePrice: 'سعر المقارنة (اختياري)',
      weightGrams: 'الوزن (جرام)',
      category: 'الفئة',
      isActive: 'منشور',
      isFeatured: 'مميز',
    },
    save: 'حفظ التغييرات',
    saving: 'جارٍ الحفظ…',
    create: 'إنشاء المنتج',
    creating: 'جارٍ الإنشاء…',
    softDelete: 'تعطيل المنتج',
    softDeleted: 'تم تعطيل المنتج',
    softDeleteConfirm: 'تعطيل هذا المنتج؟ لن يراه العملاء بعد ذلك.',
    activate: 'تفعيل المنتج',
    activated: 'تم تفعيل المنتج',
    saved: 'تم الحفظ',
    media: {
      heading: 'الصور',
      empty: 'لا توجد صور بعد. أضف أول صورة بعد حفظ المنتج.',
      add: '+ إضافة صورة',
      uploading: 'جارٍ الرفع…',
      sortOrder: 'الترتيب',
      setPrimary: 'تعيين كرئيسية',
      isPrimary: 'رئيسية',
      delete: 'حذف',
      deleteConfirm: 'حذف هذه الصورة؟',
      needsSave: 'احفظ المنتج قبل رفع الصور.',
    },
    validation: {
      required: 'مطلوب.',
      shortName: 'الاسم قصير جداً.',
      priceNonNegative: 'يجب أن يكون السعر صفراً أو أكثر.',
      stockNonNegative: 'يجب أن يكون المخزون صفراً أو أكثر.',
    },
  },
  categories: {
    title: 'الفئات',
    newCategory: '+ فئة جديدة',
    sectionTree: 'الشجرة',
    sectionEdit: 'تعديل الفئة',
    sectionCreate: 'فئة جديدة',
    productCount: '{count} منتج',
    live: 'منشورة',
    hidden: 'مخفية',
    selectToEdit: 'اختر فئة لتعديلها.',
    fields: {
      nameAr: 'الاسم (عربي)',
      nameEn: 'الاسم (إنجليزي)',
      slug: 'الرابط',
      parent: 'الفئة الأم',
      noParent: '(المستوى الأعلى)',
      sortOrder: 'الترتيب',
      isActive: 'منشورة',
    },
    save: 'حفظ التغييرات',
    create: 'إنشاء الفئة',
    saving: 'جارٍ الحفظ…',
    saved: 'تم حفظ الفئة',
  },
  reviews: {
    title: 'التقييمات',
    kpi: {
      pending: 'بانتظار المراجعة',
      pendingSub: '{n} بانتظار أول رد',
      flagged: 'مُعلَّمة تلقائياً',
      flaggedSub: 'سبام / إساءة / غير ذي صلة',
      avgRating: 'متوسط التقييم · ٣٠ يوماً',
      avgRatingSub: 'بين التقييمات المعتمدة',
      verified: 'مشترون موثّقون',
      verifiedSub: 'آخر ٣٠ يوماً',
      avgResponse: 'متوسط الاستجابة',
      avgResponseSub: 'الهدف: أقل من ٢٤ ساعة',
    },
    tabs: {
      pending: 'بانتظار المراجعة',
      flagged: 'مُعلَّمة',
      approved: 'معتمدة',
      rejected: 'مرفوضة',
    },
    listEmpty: 'لا يوجد ما يحتاج إلى مراجعة هنا.',
    flaggedPill: 'مُعلَّم',
    verifiedPill: '✓ مشترٍ موثّق',
    guestPill: 'زائر',
    autoFlagBanner: 'تم تعليمها تلقائياً · {reason} · راجعها بعناية قبل الاعتماد.',
    internalContext: 'السياق الداخلي',
    ratingLabel: 'التقييم',
    productLabel: 'المنتج',
    customerLabel: 'العميل',
    customerPhone: 'الهاتف',
    submittedAt: 'تاريخ الإرسال',
    approveBtn: '✓ اعتماد ونشر',
    rejectBtn: '✕ رفض',
    rejectHeading: 'الرفض مع سبب',
    rejectReasons: {
      offTopic: 'خارج الموضوع',
      spam: 'ترويجي / سبام',
      personalInfo: 'يحتوي بيانات شخصية',
      abusive: 'لغة مسيئة',
      lowQuality: 'محتوى ضعيف / بدون تفاصيل',
      fake: 'مشتبه بأنه مزوَّر',
      duplicate: 'تقييم مكرر',
    },
    rejectConfirm: 'رفض التقييم',
    cancel: 'إلغاء',
    approvedToast: 'تم اعتماد التقييم',
    rejectedToast: 'تم رفض التقييم',
    resetToast: 'تمت إعادته إلى قائمة الانتظار',
    resolvedApproved: 'تم اعتماد هذا التقييم.',
    resolvedRejected: 'تم رفض هذا التقييم.',
    moveBackToPending: 'إعادة إلى قائمة الانتظار',
    selectReviewHint: 'اختر تقييماً من اليسار لبدء المراجعة.',
  },
  staff: {
    title: 'الموظفون وسجل النشاط',
    subtitle: '{n} موظفون نشطون · جميع العمليات الإدارية مسجَّلة',
    inviteBtn: '+ دعوة عضو',
    inviteComingSoon: 'تدفق الدعوة سيُضاف لاحقاً.',
    teamHeading: 'فريق العمل',
    auditHeading: 'النشاط الأخير',
    online: 'نشط الآن',
    lastSeen: 'آخر دخول',
    neverLoggedIn: 'لم يسجِّل دخوله بعد',
    emptyStaff: 'لا يوجد مسؤولون نشطون.',
    emptyAudit: 'لا يوجد نشاط بعد.',
    roles: {
      ADMIN: 'مسؤول',
      CUSTOMER: 'عميل',
    },
  },
};

const dictionaries: Record<AdminLocale, AdminDictionary> = { en, ar };

export function getDictionary(locale: AdminLocale): AdminDictionary {
  return dictionaries[locale];
}
