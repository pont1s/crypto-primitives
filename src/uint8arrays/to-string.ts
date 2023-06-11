import bases, { type SupportedEncodings } from './utils';

export function toString(array: Uint8Array, encoding: SupportedEncodings = 'utf8'): string {
  const base = bases[encoding];

  if (base == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }

  if ((encoding === 'utf8' || encoding === 'utf-8') && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString('utf8');
  }

  // strip multibase prefix
  return base.encoder.encode(array).substring(1);
}
