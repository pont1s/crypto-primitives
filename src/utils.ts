import { getRandomValues } from 'uncrypto';
import {
  fromStringToBase64,
  fromBase64ToBuffer,
} from './uint8arrays';
import {
  CharSize,
  type ValueOf,
  type Message,
} from './types';
import { InvalidMaxValue } from './errors';

export const arrayBufferToString = (buffer: ArrayBuffer, charSize: ValueOf<typeof CharSize>): string => {
  const arr = charSize === 8 ? new Uint8Array(buffer) : new Uint16Array(buffer);
  return Array.from(arr)
    .map((b) => String.fromCharCode(b))
    .join('');
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  return fromStringToBase64(new Uint8Array(buffer));
};

export const base64ToArrayBuffer = (str: string): ArrayBuffer => {
  return fromBase64ToBuffer(str).buffer;
};

export const stringToArrayBuffer = (str: string, charSize: ValueOf<typeof CharSize>): ArrayBuffer => {
  const view = charSize === 8 ? new Uint8Array(str.length) : new Uint16Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i += 1) {
    view[i] = str.charCodeAt(i);
  }
  return view.buffer;
};

export const publicExponent = (): Uint8Array => (new Uint8Array([0x01, 0x00, 0x01]));

export function randomBuffer(length: number, { max }: { max: number } = { max: 255 }): ArrayBuffer {
  if (max < 1 || max > 255) {
    throw InvalidMaxValue;
  }

  const arr = new Uint8Array(length);

  if (max === 255) {
    getRandomValues(arr);
    return arr.buffer;
  }

  let index = 0;
  const interval = max + 1;
  const divisibleMax = Math.floor(256 / interval) * interval;
  const tmp = new Uint8Array(1);

  while (index < arr.length) {
    getRandomValues(tmp);
    if (tmp[0] < divisibleMax) {
      arr[index] = tmp[0] % interval;
      index += 1;
    }
  }

  return arr.buffer;
}

export const joinBuffers = (arrayBufferA: ArrayBuffer, arrayBufferB: ArrayBuffer): ArrayBuffer => {
  const view1 = new Uint8Array(arrayBufferA);
  const view2 = new Uint8Array(arrayBufferB);
  const joined = new Uint8Array(view1.length + view2.length);
  joined.set(view1);
  joined.set(view2, view1.length);
  return joined.buffer;
};

export const normalizeToBuffer = (msg: Message, strConv: (str: string) => ArrayBuffer): ArrayBuffer => {
  if (typeof msg === 'string') {
    return strConv(msg);
  } if (typeof msg === 'object' && msg.byteLength !== undefined) {
    const temp = new Uint8Array(msg);
    return temp.buffer;
  }
  throw new Error('Improper value. Must be a string, ArrayBuffer, Uint8Array');
};

export const normalizeUtf8ToBuffer = (
  msg: Message,
): ArrayBuffer => normalizeToBuffer(msg, (str) => stringToArrayBuffer(str, CharSize.B8));

export const normalizeUtf16ToBuffer = (
  msg: Message,
): ArrayBuffer => normalizeToBuffer(msg, (str) => stringToArrayBuffer(str, CharSize.B16));

export const normalizeBase64ToBuffer = (msg: Message): ArrayBuffer => normalizeToBuffer(msg, base64ToArrayBuffer);

export const normalizeUnicodeToBuffer = (msg: Message, charSize: ValueOf<typeof CharSize>) => {
  switch (charSize) {
    case 8: return normalizeUtf8ToBuffer(msg);
    default: return normalizeUtf16ToBuffer(msg);
  }
};
