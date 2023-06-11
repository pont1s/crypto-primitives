import { asUint8Array } from './as-uint8array';
import bases, { type SupportedEncodings } from './utils';

export function fromString(string: string, encoding: SupportedEncodings = 'utf8'): Uint8Array {
  const base = bases[encoding];

  if (base == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }

  if ((encoding === 'utf8' || encoding === 'utf-8') && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return asUint8Array(globalThis.Buffer.from(string, 'utf-8'));
  }

  // add multibase prefix
  return base.decoder
    .decode(`${base.prefix}${string}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
}

export type { SupportedEncodings };
