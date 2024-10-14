/* eslint-disable require-atomic-updates */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable camelcase */
// skde.js

import init, {
  encrypt,
  decrypt,
} from '../build/delay_encryption/skde/skde_wasm';

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);

  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    try {
      const contents = await snap.request({
        method: 'snap_getFile',
        params: {
          path: './build/delay_encryption/skde/skde_wasm_bg.wasm',
          encoding: 'base64',
        },
      });

      const buffer = base64ToArrayBuffer(contents);
      const wasmModule = await init(buffer);

      await init(wasmModule);

      initialized = true;
    } catch (error) {
      console.log('stompesi error', error);
    }
  }
}

async function encryptMessage(
  skdeParams: any,
  message: any,
  encryptionKey: any,
) {
  await ensureInitialized();
  return encrypt(skdeParams, message, encryptionKey);
}

async function decryptCipher(skdeParams: any, cipherText: any, secretKey: any) {
  await ensureInitialized();
  return decrypt(skdeParams, cipherText, secretKey);
}

export { encryptMessage, decryptCipher };
