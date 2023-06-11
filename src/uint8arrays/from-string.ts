const universalAtob = (base64Encoded: string) => {
  if (typeof window !== 'undefined') {
    return window.atob(base64Encoded);
  } else {
    return Buffer.from(base64Encoded, 'base64').toString();
  }
};

export function fromBase64ToBuffer(base64Encoded: string): Uint8Array {
  const binaryString = universalAtob(base64Encoded);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}
