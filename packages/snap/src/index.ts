/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-for-of */
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
import {
  decryptCipher as decryptCipherSkde,
  encryptMessage as encryptMessageSkde,
} from './skde';

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
    case 'fetchSkdeParams': {
      return {
        n: '109108784166676529682340577929498188950239585527883687884827626040722072371127456712391033422811328348170518576414206624244823392702116014678887602655605057984874271545556188865755301275371611259397284800785551682318694176857633188036311000733221068448165870969366710007572931433736793827320953175136545355129',
        g: '4',
        t: 4,
        h: '4294967296',
        max_sequencer_number: '2',
      };
    }
    case 'fetchEncryptionKeySkde': {
      return {
        pk: '27897411317866240410600830526788165981341969904039758194675272671868652866892274441298243014317800177611419642993059565060538386730472765976439751299066279239018615809165217144853299923809516494049479159549907327351509242281465077907977695359158281231729142725042643997952251325328973964444619144348848423785',
      };
    }

    case 'encryptMessageSkde': {
      console.log(request.params);

      const { skdeParams, messageSkde, encryptionKeySkde } = request.params;

      const result = await encryptMessageSkde(
        skdeParams,
        messageSkde,
        encryptionKeySkde,
      );

      return result;
    }

    case 'fetchDecryptionKeySkde': {
      return {
        sk: '38833048300325516141445839739644018404110477961707775037115236576780421892476578378034582536195146817009345764092161668346878367282186498795101059094681709712929905024483143171658282800283336368593335787557451643648363431385562973837024404466434120134771798848006526362428133799287842185760112952945802615179',
      };
    }

    case 'decryptCipherSkde': {
      console.log(request.params);

      const { skdeParams, cipherTextSkde, decryptionKeySkde } = request.params;

      const result = await decryptCipherSkde(
        skdeParams,
        cipherTextSkde,
        decryptionKeySkde,
      );

      return result;
    }
    default: {
      throw new Error('Method not found.');
    }
  }
};
