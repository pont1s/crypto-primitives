const universalBtoa = (binary: string) => {
  if (typeof window !== 'undefined') {
    return window.btoa(binary);
  } else {
    return Buffer.from(binary, 'binary').toString('base64');
  }
};

export const fromStringToBase64 = (arrayBuffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return universalBtoa(binary);
};
