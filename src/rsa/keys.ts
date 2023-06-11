import { subtle } from 'uncrypto';
import {
  checkValidKeyUse,
} from './../errors';
import {
  HASH_ALG_DEFAULT,
} from './../constants';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  publicExponent,
  stripPrivateKeyHeader,
  stripPublicKeyHeader,
} from './../utils';
import {
  type ValueOf,
  type HashAlg,
} from './../types';
import { RSA_ENCRYPTION_ALG, RSA_SIGN_ALG } from './constants';
import { KeyUse, type RsaKeyLength } from './types';

export const makeKeypair = async (
  size: ValueOf<typeof RsaKeyLength>,
  hashAlg: ValueOf<typeof HashAlg> = HASH_ALG_DEFAULT,
  use: ValueOf<typeof KeyUse>,
): Promise<CryptoKeyPair> => {
  checkValidKeyUse(use);
  const alg = use === KeyUse.Encryption ? RSA_ENCRYPTION_ALG : RSA_SIGN_ALG;
  const uses: KeyUsage[] = use === KeyUse.Encryption ? ['encrypt', 'decrypt'] : ['sign', 'verify'];
  return subtle.generateKey(
    {
      name: alg,
      modulusLength: size,
      publicExponent: publicExponent(),
      hash: { name: hashAlg },
    },
    true,
    uses,
  );
};

export const importPublicKey = async (
  base64Key: string,
  hashAlg: ValueOf<typeof HashAlg>,
  use: ValueOf<typeof KeyUse>,
): Promise<CryptoKey> => {
  checkValidKeyUse(use);
  const alg = use === KeyUse.Encryption ? RSA_ENCRYPTION_ALG : RSA_SIGN_ALG;
  const uses: KeyUsage[] = use === KeyUse.Encryption ? ['encrypt'] : ['verify'];
  const buf = base64ToArrayBuffer(stripPublicKeyHeader(base64Key));
  return subtle.importKey(
    'spki',
    buf,
    { name: alg, hash: { name: hashAlg } },
    true,
    uses,
  );
};

export const importPrivateKey = async (
  base64Key: string,
  hashAlg: ValueOf<typeof HashAlg>,
  use: ValueOf<typeof KeyUse>,
): Promise<CryptoKey> => {
  checkValidKeyUse(use);
  const alg = use === KeyUse.Encryption ? RSA_ENCRYPTION_ALG : RSA_SIGN_ALG;
  const uses: KeyUsage[] = use === KeyUse.Encryption ? ['decrypt'] : ['sign'];
  const buf = base64ToArrayBuffer(stripPrivateKeyHeader(base64Key));
  return subtle.importKey(
    'pkcs8',
    buf,
    { name: alg, hash: { name: hashAlg } },
    true,
    uses,
  );
};
