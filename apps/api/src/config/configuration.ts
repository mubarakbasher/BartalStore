export interface AppConfig {
  port: number;
  host: string;
  /** Externally-reachable API origin incl. /api (e.g. http://VPS_IP:8081/api). Used to build
   *  reachable URLs for locally-served (stub) images. Empty → falls back to localhost in dev. */
  publicUrl: string;
  nodeEnv: 'development' | 'test' | 'production';
  corsOrigins: string[];
  database: { url: string };
  redis: { url: string };
  jwt: {
    accessSecret: string;
    accessTtl: string;
    refreshSecret: string;
    refreshTtl: string;
    bcryptRounds: number;
  };
  otp: { ttlSeconds: number; maxPerWindow: number; windowSeconds: number };
  sms: { username: string; apiKey: string; senderId: string };
  fcm: { serviceAccountPath: string };
  r2: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketPublic: string;
    bucketReceipts: string;
    publicUrlBase: string;
  };
  store: {
    nameAr: string;
    nameEn: string;
    bankNameAr: string;
    bankNameEn: string;
    bankAccountName: string;
    bankAccountNumber: string;
    whatsappSupport: string;
  };
}

const num = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export default (): AppConfig => ({
  port: num(process.env.API_PORT, 3001),
  host: process.env.API_HOST ?? '0.0.0.0',
  publicUrl: process.env.API_PUBLIC_URL ?? '',
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  database: { url: process.env.DATABASE_URL ?? '' },
  redis: { url: process.env.REDIS_URL ?? 'redis://localhost:6379' },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-me',
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-me',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '30d',
    bcryptRounds: num(process.env.BCRYPT_ROUNDS, 12),
  },
  otp: {
    ttlSeconds: num(process.env.OTP_TTL_SECONDS, 600),
    maxPerWindow: num(process.env.OTP_MAX_PER_WINDOW, 5),
    windowSeconds: num(process.env.OTP_WINDOW_SECONDS, 900),
  },
  sms: {
    username: process.env.AT_USERNAME ?? 'sandbox',
    apiKey: process.env.AT_API_KEY ?? '',
    senderId: process.env.AT_SENDER_ID ?? 'BARTAL',
  },
  fcm: { serviceAccountPath: process.env.FCM_SERVICE_ACCOUNT_PATH ?? '' },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID ?? '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    bucketPublic: process.env.R2_BUCKET_PUBLIC ?? 'bartal-public',
    bucketReceipts: process.env.R2_BUCKET_RECEIPTS ?? 'bartal-receipts',
    publicUrlBase: process.env.R2_PUBLIC_URL_BASE ?? '',
  },
  store: {
    nameAr: process.env.STORE_NAME_AR ?? 'بَرتال',
    nameEn: process.env.STORE_NAME_EN ?? 'Bartal',
    bankNameAr: process.env.STORE_BANK_NAME_AR ?? '',
    bankNameEn: process.env.STORE_BANK_NAME_EN ?? '',
    bankAccountName: process.env.STORE_BANK_ACCOUNT_NAME ?? '',
    bankAccountNumber: process.env.STORE_BANK_ACCOUNT_NUMBER ?? '',
    whatsappSupport: process.env.WHATSAPP_SUPPORT_NUMBER ?? '',
  },
});
