export const RsaKeyLength = {
  B1024: 1024,
  B2048: 2048,
  B4096: 4096,
} as const;

export const KeyUse = {
  Encryption: 'encryption',
  Sign: 'sign',
} as const;
