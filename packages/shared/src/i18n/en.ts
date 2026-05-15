/**
 * English (LTR) shared strings. Categories per PRD §14.3.
 * Treat this file as the schema — `ar.ts` must match key-for-key.
 */
export const en: Translations = {
  common: {
    app_name: 'Bartal',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    retry: 'Retry',
    loading: 'Loading…',
    search: 'Search',
    optional: 'Optional',
    required: 'Required',
  },
  navigation: {
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    cart: 'Cart',
    orders: 'My Orders',
    profile: 'Profile',
    settings: 'Settings',
  },
  auth: {
    login: 'Log in',
    logout: 'Log out',
    register: 'Sign up',
    phone: 'Phone number',
    phone_placeholder: '+249 XXX XXX XXX',
    password: 'Password',
    confirm_password: 'Confirm password',
    name: 'Full name',
    email: 'Email (optional)',
    otp_title: 'Enter the code',
    otp_subtitle: 'We sent a 6-digit code to {phone}',
    otp_resend: 'Resend code',
    otp_resend_in: 'You can resend in {seconds}s',
    forgot_password: 'Forgot password?',
    reset_password: 'Reset password',
    remember_me: 'Remember me',
  },
  products: {
    add_to_cart: 'Add to cart',
    in_stock: 'In stock',
    out_of_stock: 'Out of stock',
    low_stock: 'Only {count} left',
    reviews: 'Reviews',
    related: 'You may also like',
    share: 'Share',
    share_whatsapp: 'Share on WhatsApp',
    no_results: 'No products match your search.',
  },
  cart: {
    title: 'Your cart',
    empty: 'Your cart is empty.',
    subtotal: 'Subtotal',
    delivery_fee: 'Delivery fee',
    discount: 'Discount',
    total: 'Total',
    place_order: 'Place order',
    continue_shopping: 'Continue shopping',
  },
  checkout: {
    title: 'Checkout',
    step_address: 'Delivery address',
    step_payment: 'Payment',
    step_confirm: 'Review & confirm',
    landmark_label: 'Nearest landmark',
    landmark_help: 'A nearby mosque, school, market, or recognizable building.',
    delivery_phone: 'Delivery phone (for the courier)',
    notes_label: 'Order notes (optional)',
    notes_placeholder: 'e.g. Please call before arriving.',
  },
  payment: {
    bank_transfer: 'Bank transfer',
    cash_on_delivery: 'Cash on delivery',
    bank_details_title: 'Bank account details',
    bank_name: 'Bank',
    account_name: 'Account name',
    account_number: 'Account number',
    upload_receipt: 'Upload payment receipt',
    receipt_pending: 'Receipt submitted — verification within 24 hours.',
    receipt_confirmed: 'Payment confirmed. Thank you!',
    receipt_rejected: 'Receipt rejected: {reason}. Please re-upload a clearer photo.',
  },
  orders: {
    order_number: 'Order #{number}',
    status_pending: 'Pending',
    status_awaiting_payment: 'Awaiting payment',
    status_receipt_uploaded: 'Receipt under review',
    status_payment_confirmed: 'Payment confirmed',
    status_payment_rejected: 'Payment rejected',
    status_processing: 'Processing',
    status_shipped: 'Shipped',
    status_delivered: 'Delivered',
    status_cancelled: 'Cancelled',
    status_refunded: 'Refunded',
    cancel_order: 'Cancel order',
    track: 'Track order',
    contact_support_whatsapp: 'Contact support on WhatsApp',
    leave_review: 'Leave a review',
  },
  errors: {
    network: 'No internet connection. Please try again.',
    generic: 'Something went wrong. Please try again.',
    unauthorized: 'Please log in to continue.',
    not_found: 'Not found.',
    validation: 'Please check the highlighted fields.',
    rate_limited: 'Too many attempts. Please wait a moment.',
  },
  sms: {
    otp: 'Bartal: Your verification code is {code}. It expires in {minutes} minutes.',
    order_confirmed: 'Bartal: Order {number} confirmed. Track at bartal.sd/o/{number}.',
    order_shipped: 'Bartal: Order {number} is on the way. ETA {days} days.',
    order_delivered: 'Bartal: Order {number} delivered. Thank you!',
    payment_rejected: 'Bartal: Receipt for {number} could not be verified ({reason}). Please re-upload.',
  },
};

export interface Translations {
  common: {
    app_name: string;
    yes: string;
    no: string;
    ok: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    retry: string;
    loading: string;
    search: string;
    optional: string;
    required: string;
  };
  navigation: {
    home: string;
    products: string;
    categories: string;
    cart: string;
    orders: string;
    profile: string;
    settings: string;
  };
  auth: {
    login: string;
    logout: string;
    register: string;
    phone: string;
    phone_placeholder: string;
    password: string;
    confirm_password: string;
    name: string;
    email: string;
    otp_title: string;
    otp_subtitle: string;
    otp_resend: string;
    otp_resend_in: string;
    forgot_password: string;
    reset_password: string;
    remember_me: string;
  };
  products: {
    add_to_cart: string;
    in_stock: string;
    out_of_stock: string;
    low_stock: string;
    reviews: string;
    related: string;
    share: string;
    share_whatsapp: string;
    no_results: string;
  };
  cart: {
    title: string;
    empty: string;
    subtotal: string;
    delivery_fee: string;
    discount: string;
    total: string;
    place_order: string;
    continue_shopping: string;
  };
  checkout: {
    title: string;
    step_address: string;
    step_payment: string;
    step_confirm: string;
    landmark_label: string;
    landmark_help: string;
    delivery_phone: string;
    notes_label: string;
    notes_placeholder: string;
  };
  payment: {
    bank_transfer: string;
    cash_on_delivery: string;
    bank_details_title: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    upload_receipt: string;
    receipt_pending: string;
    receipt_confirmed: string;
    receipt_rejected: string;
  };
  orders: {
    order_number: string;
    status_pending: string;
    status_awaiting_payment: string;
    status_receipt_uploaded: string;
    status_payment_confirmed: string;
    status_payment_rejected: string;
    status_processing: string;
    status_shipped: string;
    status_delivered: string;
    status_cancelled: string;
    status_refunded: string;
    cancel_order: string;
    track: string;
    contact_support_whatsapp: string;
    leave_review: string;
  };
  errors: {
    network: string;
    generic: string;
    unauthorized: string;
    not_found: string;
    validation: string;
    rate_limited: string;
  };
  sms: {
    otp: string;
    order_confirmed: string;
    order_shipped: string;
    order_delivered: string;
    payment_rejected: string;
  };
}
