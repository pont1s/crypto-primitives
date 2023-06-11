import { ValueOf } from './../types';

export const EccCurves = {
  P256: 'P-256',
  P384: 'P-384',
  P521: 'P-521',
} as const;

export const SymmetricAlg = {
  AES_CTR: 'AES-CTR',
  AES_CBC: 'AES-CBC',
  AES_GCM: 'AES-GCM',
} as const;

export const SymmetricAlgKeyLength = {
  B128: 128,
  B192: 192,
  B256: 256,
} as const;

export type SymmetricAlgorithmsKeyOptions = {
  alg: ValueOf<typeof SymmetricAlg>,
  length: ValueOf<typeof SymmetricAlgKeyLength>,
  iv: ArrayBuffer,
}
