import { arrayBufferToBase64 } from './utils';
import { subtle } from 'uncrypto';

const convertBinaryToPem = (binaryData: ArrayBuffer, label: string) => {
  const base64Cert = arrayBufferToBase64(binaryData);
  return `-----BEGIN ${label}-----\n${base64Cert}\n-----END ${label}-----`;
};

export const exportPublicKey = async (key: CryptoKey) => {
  const keyPem = await subtle.exportKey('spki', key);
  return convertBinaryToPem(keyPem, 'PUBLIC KEY');
};

export const exportPrivateKey = async (key: CryptoKey) => {
  const keyPem = await subtle.exportKey('pkcs8', key);
  return convertBinaryToPem(keyPem, 'PRIVATE KEY');
};
