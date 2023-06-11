import { ValueOf } from './types';
import { KeyUse } from './rsa';

export const KeyDoesNotExist = new Error('Key does not exist. Make sure you properly instantiated the keystore.');
export const NotKeyPair = new Error('Retrieved a symmetric key when an ' +
  'asymmetric keypair was expected. Please use a different key name.');
export const NotKey = new Error('Retrieved an asymmetric keypair when ' +
  'an symmetric key was expected. Please use a different key name.');
export const ECCNotEnabled = new Error('ECC is not enabled for this browser. Please use RSA instead.');
export const UnsupportedCrypto = new Error('Cryptosystem not supported. Please use ECC or RSA');
export const InvalidKeyUse = new Error("Invalid key use. Please use 'exchange' or 'write");
export const InvalidMaxValue = new Error('Max must be less than 256 and greater than 0');

function checkValid<T>(toCheck: T, opts: T[], error: Error): void {
  const match = opts.some((opt) => opt === toCheck);
  if (!match) {
    throw error;
  }
}

export function checkIsKeyPair(keypair: CryptoKeyPair): CryptoKeyPair {
  if (!keypair) {
    throw KeyDoesNotExist;
  } else if (keypair.privateKey === undefined) {
    throw NotKeyPair;
  }
  return keypair;
}

export function checkIsKey(key: unknown): CryptoKey {
  if (!key) {
    throw KeyDoesNotExist;
  } else if ((key as CryptoKeyPair).privateKey !== undefined || (key as CryptoKey).algorithm === undefined) {
    throw NotKey;
  }
  return key as CryptoKey;
}

export function checkValidKeyUse(use: ValueOf<typeof KeyUse>): void {
  checkValid(use, [KeyUse.Encryption, KeyUse.Sign], InvalidKeyUse);
}
