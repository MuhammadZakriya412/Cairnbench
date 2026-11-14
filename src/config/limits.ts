export const MAX_ITEM_BYTES = 512 * 1024;
export const MAX_USER_BYTES = 20 * 1024 * 1024;
export const MAX_ORG_BYTES = 100 * 1024 * 1024;
export const MAX_VERSIONS_PER_ITEM = 20;

export const SOFT_DELETE_RETENTION_DAYS = 30;
export const AUDIT_LOG_RETENTION_DAYS = 365;
export const MAX_PROXY_CALLS_PER_DAY = 100;
export const MAX_MCP_CALLS_PER_DAY = 1_000;
export const MAX_USERS = 100;

export const QUOTA_WARN_RATIO = 0.8;
export const QUOTA_BLOCK_RATIO = 0.95;

export const PBKDF2_ITERATIONS = 600_000;
export const SALT_BYTES = 16;
export const IV_BYTES = 12;

export const ORG_INVITE_EXPIRY_DAYS = 7;
export const API_TOKEN_DEFAULT_EXPIRY_DAYS = 90;
