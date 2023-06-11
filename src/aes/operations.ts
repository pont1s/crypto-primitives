import { subtle } from 'uncrypto';
import { type Message } from './../types';
import {
  normalizeUtf16ToBuffer,
  normalizeBase64ToBuffer,
  randomBuffer,
  joinBuffers,
  arrayBufferToBase64,
  arrayBufferToString,
} from './../utils';
import {
  CTR_LEN_DEFAULT,
  SYMMETRIC_ALG_DEFAULT,
} from './constants';
import {
  importKey,
} from './keys';
import {
  SymmetricAlg,
  type SymmetricAlgorithmsKeyOptions,
} from './types';

export const encryptBytes = async (
  msg: Message,
  key: CryptoKey | string,
  opts?: Partial<SymmetricAlgorithmsKeyOptions>,
): Promise<ArrayBuffer> => {
  const data = normalizeUtf16ToBuffer(msg);
  const importedKey = typeof key === 'string' ? await importKey(key, opts) : key;
  const alg = opts?.alg ?? SYMMETRIC_ALG_DEFAULT;
  const iv = opts?.iv ?? randomBuffer(16);
  const cipherBuf = await subtle.encrypt(
    {
      name: alg,
      iv: alg === SymmetricAlg.AES_CTR ? undefined : iv,
      counter: alg === SymmetricAlg.AES_CTR ? new Uint8Array(iv) : undefined,
      length: alg === SymmetricAlg.AES_CTR ? CTR_LEN_DEFAULT : undefined,
    },
    importedKey,
    data,
  );
  return joinBuffers(iv, cipherBuf);
};

export const decryptBytes = async (
  msg: Message,
  key: CryptoKey | string,
  opts?: Partial<SymmetricAlgorithmsKeyOptions>,
): Promise<ArrayBuffer> => {
  const cipherText = normalizeBase64ToBuffer(msg);
  const importedKey = typeof key === 'string' ? await importKey(key, opts) : key;
  const alg = opts?.alg || SYMMETRIC_ALG_DEFAULT;
  const iv = cipherText.slice(0, 16);
  const cipherBytes = cipherText.slice(16);
  return subtle.decrypt(
    {
      name: alg,
      iv: alg === SymmetricAlg.AES_CTR ? undefined : iv,
      counter: alg === SymmetricAlg.AES_CTR ? new Uint8Array(iv) : undefined,
      length: alg === SymmetricAlg.AES_CTR ? CTR_LEN_DEFAULT : undefined,
    },
    importedKey,
    cipherBytes,
  );
};

const encrypt = async (
  msg: Message,
  key: CryptoKey | string,
  opts?: Partial<SymmetricAlgorithmsKeyOptions>,
): Promise<string> => {
  const cipherText = await encryptBytes(msg, key, opts);
  return arrayBufferToBase64(cipherText);
};

const decrypt = async (
  msg: Message,
  key: CryptoKey | string,
  opts?: Partial<SymmetricAlgorithmsKeyOptions>,
): Promise<string> => {
  const msgBytes = await decryptBytes(msg, key, opts);
  return arrayBufferToString(msgBytes, 16);
};

export const exportKey = async (key: CryptoKey): Promise<string> => {
  const raw = await subtle.exportKey('raw', key);
  return arrayBufferToBase64(raw);
};

export {
  encrypt as encryptAes,
  decrypt as decryptAes,
};
