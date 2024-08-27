import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';

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
      return `Gylman: ${origin}`;
    }
    case 'generateTimeLockPuzzle': {
      return `Gylman: ${origin}`;
    }
    case 'fetchTimeLockPuzzleZkpParam': {
      return `Gylman: ${origin}`;
    }
    case 'fetchTimeLockPuzzleProvingKey': {
      return `Gylman: ${origin}`;
    }
    case 'generateTimeLockPuzzleProof': {
      return `Gylman: ${origin}`;
    }
    case 'generateSymmetricKey': {
      return `Gylman: ${origin}`;
    }
    case 'encryptMessage': {
      return `Gylman: ${origin}`;
    }

    case 'fetchEncryptionZkpParam': {
      return `Gylman: ${origin}`;
    }
    case 'fetchEncryptionProvingKey': {
      return `Gylman: ${origin}`;
    }
    case 'generateEncryptionProof': {
      return `Gylman: ${origin}`;
    }
    default: {
      throw new Error('Method not found.');
    }
  }
};
