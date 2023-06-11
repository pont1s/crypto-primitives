export const RsaKeyLength = {
  B1024: 1024,
  B2048: 2048,
  B4096: 4096,
} as const;

export const KeyUse = {
  Exchange: 'exchange',
  Write: 'write',
} as const;

export const RSA_EXCHANGE_ALG = 'RSA-OAEP';
export const RSA_WRITE_ALG = 'RSASSA-PKCS1-v1_5';
