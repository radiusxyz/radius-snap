import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';

import {
  encryptMessage,
  fetchEncryptionProvingKey,
  fetchEncryptionZkpParam,
  fetchTimeLockPuzzleProvingKey,
  fetchTimeLockPuzzleZkpParam,
  generateEncryptionProof,
  generateSymmetricKey,
  generateTimeLockPuzzle,
  generateTimeLockPuzzleParam,
  generateTimeLockPuzzleProof,
} from './pvde';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable camelcase */
// pvde.js

function uint8ArrayToBase64(uint8Array) {
  let binaryString = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binaryString); // btoa encodes the string to Base64
}

function base64ToUint8Array(base64String) {
  const binaryString = atob(base64String); // atob decodes the Base64 string
  const len = binaryString.length;
  const uint8Array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array;
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    // Expose a "greeting" JSON-RPC method to dapps.
    case 'generateTimeLockPuzzleParam': {
      return generateTimeLockPuzzleParam();
    }
    case 'generateTimeLockPuzzle': {
      console.log('hello world');
      return generateTimeLockPuzzle(request.params);
    }
    case 'fetchTimeLockPuzzleZkpParam': {
      const result = await fetchTimeLockPuzzleZkpParam();
      const b64 = uint8ArrayToBase64(result);

      return b64;
    }
    case 'fetchTimeLockPuzzleProvingKey': {
      const result = await fetchTimeLockPuzzleProvingKey();
      const b64 = uint8ArrayToBase64(result);
      return b64;
    }
    case 'generateTimeLockPuzzleProof': {
      const {
        timeLockPuzzleZkpParamB64,
        timeLockPuzzleProvingKeyB64,
        timeLockPuzzlePublicInput,
        timeLockPuzzlePrivateInput,
        timeLockPuzzleParam,
      } = request.params;

      const timeLockPuzzleZkpParam = base64ToUint8Array(
        timeLockPuzzleZkpParamB64,
      );
      const timeLockPuzzleProvingKey = base64ToUint8Array(
        timeLockPuzzleProvingKeyB64,
      );
      const result = await generateTimeLockPuzzleProof(
        timeLockPuzzleZkpParam,
        timeLockPuzzleProvingKey,
        timeLockPuzzlePublicInput,
        timeLockPuzzlePrivateInput,
        timeLockPuzzleParam,
      );

      const b64 = uint8ArrayToBase64(result);
      return b64;
    }
    case 'generateSymmetricKey': {
      const { k } = request.params;
      const result = await generateSymmetricKey(k);
      return result;
    }
    case 'encryptMessage': {
      const { message, encryptionKey } = request.params;

      const result = await encryptMessage(message, encryptionKey);
      return result;
    }

    case 'fetchEncryptionZkpParam': {
      const result = await fetchEncryptionZkpParam();
      const b64 = uint8ArrayToBase64(result);
      return b64;
    }
    case 'fetchEncryptionProvingKey': {
      const result = await fetchEncryptionProvingKey();
      const b64 = uint8ArrayToBase64(result);
      return b64;
    }
    case 'generateEncryptionProof': {
      console.log(request.params);

      const {
        encryptionZkpParamB64,
        encryptionProvingKeyB64,
        encryptionPublicInput,
        encryptionPrivateInput,
      } = request.params;
      const encryptionZkpParam = base64ToUint8Array(encryptionZkpParamB64);
      const encryptionProvingKey = base64ToUint8Array(encryptionProvingKeyB64);
      const result = await generateEncryptionProof(
        encryptionZkpParam,
        encryptionProvingKey,
        encryptionPublicInput,
        encryptionPrivateInput,
      );

      const b64 = uint8ArrayToBase64(result);
      return b64;
    }
    default: {
      throw new Error('Method not found.');
    }
  }
};
