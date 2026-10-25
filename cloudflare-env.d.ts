declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    VIARA_ADMIN_EMAIL?: string;
    VIARA_ADMIN_PASSWORD?: string;
    VIARA_ADMIN_KEY?: string;
    VIARA_SESSION_SECRET?: string;
    BUCKET?: R2Bucket;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL?: string;
    SALES_WEBHOOK_URL?: string;
    ANALYTICS_WEBHOOK_URL?: string;
    NEXT_PUBLIC_ANALYTICS_ENDPOINT?: string;
  }
}
