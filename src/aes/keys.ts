import { subtle } from 'uncrypto';
import {
  base64ToArrayBuffer,
} from './../utils';
import {
  ECC_SHARED_ALG, ECDH_CURVE_DEFAULT,
  SYMMETRIC_ALG_DEFAULT,
  SYMMETRIC_ALG_LENGTH_DEFAULT,
} from './constants';
import {
  EccCurves,
  type SymmetricAlgorithmsKeyOptions,
} from './types';

export const getEncryptSharedSymmetricKey = async (publicKey: CryptoKey,
  privateKey: CryptoKey,
  symmetricAlgorithmsKeyOptions?: Partial<SymmetricAlgorithmsKeyOptions>): Promise<CryptoKey> => {
  return subtle.deriveKey(
    {
      name: ECC_SHARED_ALG,
      public: publicKey,
    },
    privateKey,
    {
      name: symmetricAlgorithmsKeyOptions?.alg ?? SYMMETRIC_ALG_DEFAULT,
      length: symmetricAlgorithmsKeyOptions?.length ?? SYMMETRIC_ALG_LENGTH_DEFAULT,
    },
    false,
    ['encrypt', 'decrypt'],
  );
};

export const getEncryptSymmetricKey = async (
  symmetricAlgorithmsKeyOptions?: Partial<SymmetricAlgorithmsKeyOptions>,
): Promise<CryptoKey> => {
  return subtle.generateKey(
    {
      name: symmetricAlgorithmsKeyOptions?.alg ?? SYMMETRIC_ALG_DEFAULT,
      length: symmetricAlgorithmsKeyOptions?.length ?? SYMMETRIC_ALG_LENGTH_DEFAULT,
    },
    true,
    ['encrypt', 'decrypt'],
  );
};

export const getDeriveKeyPair = async (curveName?: keyof typeof EccCurves): Promise<CryptoKeyPair> => {
  return subtle.generateKey(
    {
      name: curveName ?? ECC_SHARED_ALG,
      namedCurve: ECDH_CURVE_DEFAULT,
    },
    true,
    ['deriveKey'],
  );
};

export async function importKey(
  base64key: string,
  opts?: Partial<SymmetricAlgorithmsKeyOptions>,
): Promise<CryptoKey> {
  const buffer = base64ToArrayBuffer(base64key);
  return subtle.importKey(
    'raw',
    buffer,
    {
      name: opts?.alg || SYMMETRIC_ALG_DEFAULT,
      length: opts?.length || SYMMETRIC_ALG_LENGTH_DEFAULT,
    },
    true,
    ['encrypt', 'decrypt'],
  );
}
