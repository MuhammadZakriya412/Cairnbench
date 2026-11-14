export const ERROR_CODES = [
  'E-PACK-ZIP-LIMIT',
  'E-PACK-TOO-LARGE',
  'E-PACK-READ',
  'E-PACK-WORKER-TIMEOUT',
  'E-HTML-TOO-LARGE',
  'E-HTML-PARSE',
  'E-RUN-UNRESOLVED',
  'E-LOG-READ',
  'E-LOG-TOO-LARGE',
  'E-LOG-REGEX',
  'E-TPL-CYCLE',
  'E-TPL-SYNTAX',
  'E-VAULT-ITEM-TOO-LARGE',
  'E-VAULT-QUOTA',
  'E-VAULT-VERSION-CONFLICT',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export class AppError extends Error {
  public readonly code: ErrorCode;

  constructor(code: ErrorCode, developerMessage: string, options?: ErrorOptions) {
    super(developerMessage, options);
    this.name = 'AppError';
    this.code = code;
  }
}
