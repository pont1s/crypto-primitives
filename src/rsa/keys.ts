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
} from './../utils';
import {
  type ValueOf,
  type HashAlg,
} from './../types';
import { KeyUse, RSA_EXCHANGE_ALG, RSA_WRITE_ALG, type RsaKeyLength } from './types';

export const makeKeypair = async (
  size: ValueOf<typeof RsaKeyLength>,
  hashAlg: ValueOf<typeof HashAlg> = HASH_ALG_DEFAULT,
  use: ValueOf<typeof KeyUse>,
): Promise<CryptoKeyPair> => {
  checkValidKeyUse(use);
  const alg = use === KeyUse.Exchange ? RSA_EXCHANGE_ALG : RSA_WRITE_ALG;
  const uses: KeyUsage[] = use === KeyUse.Exchange ? ['encrypt', 'decrypt'] : ['sign', 'verify'];
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

export const convertBinaryToPem = (binaryData: ArrayBuffer, label: string) => {
  const base64Cert = arrayBufferToBase64(binaryData);
  return `-----BEGIN ${label}-----\n${base64Cert}\n-----END ${label}-----`;
};

export const exportPublicKey = async (key: CryptoKey) => {
  const keyPem = await window.crypto.subtle.exportKey('spki', key);
  return convertBinaryToPem(keyPem, 'PUBLIC KEY');
};

export const exportPrivateKey = async (key: CryptoKey) => {
  const keyPem = await window.crypto.subtle.exportKey('pkcs8', key);
  return convertBinaryToPem(keyPem, 'PRIVATE KEY');
};

const stripPublicKeyHeader = (base64Key: string): string => {
  return base64Key
    .replace('-----BEGIN PUBLIC KEY-----\n', '')
    .replace('\n-----END PUBLIC KEY-----', '');
};

const stripPrivateKeyHeader = (base64Key: string): string => {
  return base64Key
    .replace('-----BEGIN PRIVATE KEY-----\n', '')
    .replace('\n-----END PRIVATE KEY-----', '');
};

export const importPublicKey = async (
  base64Key: string,
  hashAlg: ValueOf<typeof HashAlg>,
  use: ValueOf<typeof KeyUse>,
): Promise<CryptoKey> => {
  checkValidKeyUse(use);
  const alg = use === KeyUse.Exchange ? RSA_EXCHANGE_ALG : RSA_WRITE_ALG;
  const uses: KeyUsage[] = use === KeyUse.Exchange ? ['encrypt'] : ['verify'];
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
  const alg = use === KeyUse.Exchange ? RSA_EXCHANGE_ALG : RSA_WRITE_ALG;
  const uses: KeyUsage[] = use === KeyUse.Exchange ? ['decrypt'] : ['sign'];
  const buf = base64ToArrayBuffer(stripPrivateKeyHeader(base64Key));
  return subtle.importKey(
    'pkcs8',
    buf,
    { name: alg, hash: { name: hashAlg } },
    true,
    uses,
  );
};
