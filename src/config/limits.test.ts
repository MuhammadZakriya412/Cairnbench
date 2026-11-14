import { describe, expect, it } from 'vitest';
import {
  API_TOKEN_DEFAULT_EXPIRY_DAYS,
  AUDIT_LOG_RETENTION_DAYS,
  IV_BYTES,
  MAX_ITEM_BYTES,
  MAX_MCP_CALLS_PER_DAY,
  MAX_ORG_BYTES,
  MAX_PROXY_CALLS_PER_DAY,
  MAX_USERS,
  MAX_USER_BYTES,
  MAX_VERSIONS_PER_ITEM,
  ORG_INVITE_EXPIRY_DAYS,
  PBKDF2_ITERATIONS,
  QUOTA_BLOCK_RATIO,
  QUOTA_WARN_RATIO,
  SALT_BYTES,
  SOFT_DELETE_RETENTION_DAYS,
} from './limits';

describe('limits (01 §2 L10 and 02 §6–§7)', () => {
  it('exports the exact L10 vault limits', () => {
    expect(MAX_ITEM_BYTES).toBe(512 * 1024);
    expect(MAX_USER_BYTES).toBe(20 * 1024 * 1024);
    expect(MAX_ORG_BYTES).toBe(100 * 1024 * 1024);
    expect(MAX_VERSIONS_PER_ITEM).toBe(20);
  });

  it('exports the 02 §6–§7 security, quota, and retention limits', () => {
    expect(SOFT_DELETE_RETENTION_DAYS).toBe(30);
    expect(AUDIT_LOG_RETENTION_DAYS).toBe(365);
    expect(MAX_PROXY_CALLS_PER_DAY).toBe(100);
    expect(MAX_MCP_CALLS_PER_DAY).toBe(1_000);
    expect(MAX_USERS).toBe(100);
    expect(QUOTA_WARN_RATIO).toBe(0.8);
    expect(QUOTA_BLOCK_RATIO).toBe(0.95);
    expect(PBKDF2_ITERATIONS).toBe(600_000);
    expect(SALT_BYTES).toBe(16);
    expect(IV_BYTES).toBe(12);
    expect(ORG_INVITE_EXPIRY_DAYS).toBe(7);
    expect(API_TOKEN_DEFAULT_EXPIRY_DAYS).toBe(90);
  });
});
