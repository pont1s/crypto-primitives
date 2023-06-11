import { subtle } from 'uncrypto';
import {
  normalizeBase64ToBuffer,
  arrayBufferToBase64,
  normalizeUnicodeToBuffer,
} from './../utils';
import {
  CHAR_SIZE_DEFAULT,
  SALT_LENGTH,
  HASH_ALG_DEFAULT,
} from './../constants';
import {
  type HashAlg,
  type CharSize,
  type Message,
  type ValueOf,
} from './../types';
import { importPublicKey } from './keys';
import { RSA_ENCRYPTION_ALG, RSA_SIGN_ALG } from './constants';
import { KeyUse } from './types';

export const sign = async (
  msg: Message,
  privateKey: CryptoKey,
  charSize: ValueOf<typeof CharSize> = CHAR_SIZE_DEFAULT,
): Promise<ArrayBuffer> => {
  return subtle.sign(
    { name: RSA_SIGN_ALG, saltLength: SALT_LENGTH },
    privateKey,
    normalizeUnicodeToBuffer(msg, charSize),
  );
};

export const verify = async (
  msg: Message,
  signature: Message,
  publicKey: string | CryptoKey,
  charSize: ValueOf<typeof CharSize> = CHAR_SIZE_DEFAULT,
  hashAlg: ValueOf<typeof HashAlg> = HASH_ALG_DEFAULT,
): Promise<boolean> => {
  return subtle.verify(
    { name: RSA_SIGN_ALG, saltLength: SALT_LENGTH },
    typeof publicKey === 'string'
      ? await importPublicKey(publicKey, hashAlg, KeyUse.Sign)
      : publicKey,
    normalizeBase64ToBuffer(signature),
    normalizeUnicodeToBuffer(msg, charSize),
  );
};

const encrypt = async (
  msg: Message,
  publicKey: string | CryptoKey,
  charSize: ValueOf<typeof CharSize> = CHAR_SIZE_DEFAULT,
  hashAlg: ValueOf<typeof HashAlg> = HASH_ALG_DEFAULT,
): Promise<ArrayBuffer> => {
  return subtle.encrypt(
    { name: RSA_ENCRYPTION_ALG },
    typeof publicKey === 'string'
      ? await importPublicKey(publicKey, hashAlg, KeyUse.Encryption)
      : publicKey,
    normalizeUnicodeToBuffer(msg, charSize),
  );
};

const decrypt = async (
  msg: Message,
  privateKey: CryptoKey,
): Promise<ArrayBuffer> => {
  const normalized = normalizeBase64ToBuffer(msg);
  return subtle.decrypt(
    { name: RSA_ENCRYPTION_ALG },
    privateKey,
    normalized,
  );
};

export const getPublicKey = async (keypair: CryptoKeyPair): Promise<string> => {
  const spki = await subtle.exportKey('spki', keypair.publicKey as CryptoKey);
  return arrayBufferToBase64(spki);
};

export {
  decrypt as decryptRsa,
  encrypt as encryptRsa,
};
