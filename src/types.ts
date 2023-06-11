export type Message = ArrayBuffer | string | Uint8Array;

export const CharSize = {
  B8: 8,
  B16: 16,
} as const;

export const HashAlg = {
  SHA1: 'SHA-1',
  SHA256: 'SHA-256',
  SHA384: 'SHA-384',
  SHA512: 'SHA-512',
} as const;

export type ValueOf<T> = T[keyof T];
