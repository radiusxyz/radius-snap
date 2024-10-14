/* eslint-disable require-atomic-updates */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable camelcase */
// pvde.js

import init, {
  generate_time_lock_puzzle_param,
  generate_time_lock_puzzle,
  prove_time_lock_puzzle,
  verify_time_lock_puzzle_proof,
  generate_symmetric_key,
  encrypt,
  solve_time_lock_puzzle,
  decrypt,
  prove_encryption,
  verify_encryption_proof,
} from '../build/delay_encryption/pvde/pvde';

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
          path: './build/delay_encryption/pvde/pvde_bg.wasm',
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

function uint8ArrayToHex(uint8Array: Iterable<unknown> | ArrayLike<unknown>) {
  return Array.from(uint8Array, (byte: any) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export async function readStream(res: any) {
  const bytes = await res.arrayBuffer();
  const uint8bytes = new Uint8Array(bytes);
  return uint8bytes;
}

export async function fetchTimeLockPuzzleZkpParam() {
  return await fetch(
    'https://raw.githubusercontent.com/radiusxyz/pvde.js/main/public/data/time_lock_puzzle_zkp_param.data',
    {
      method: 'GET',
    },
  ).then(async (res) => readStream(res));
}

export async function fetchTimeLockPuzzleProvingKey() {
  return await fetch(
    'https://raw.githubusercontent.com/radiusxyz/pvde.js/main/public/data/time_lock_puzzle_zkp_proving_key.data',
    {
      method: 'GET',
    },
  ).then(async (res) => readStream(res));
}

export async function fetchTimeLockPuzzleVerifyingKey() {
  return await fetch(
    'https://raw.githubusercontent.com/radiusxyz/pvde.js/main/public/data/time_lock_puzzle_zkp_verifying_key.data',
    {
      method: 'GET',
    },
  ).then(async (res) => readStream(res));
}

export async function generateTimeLockPuzzleParam() {
  await ensureInitialized();
  const { y_two: yTwo, ...rest } = await generate_time_lock_puzzle_param(2048);

  return {
    ...rest,
    yTwo,
  };
}

export async function generateTimeLockPuzzle(timeLockPuzzleParam: any) {
  await ensureInitialized();

  const { yTwo, ...rest } = timeLockPuzzleParam;
  const snakeCaseTimeLockPuzzleParam = { y_two: yTwo, ...rest };
  const inputs = await generate_time_lock_puzzle(snakeCaseTimeLockPuzzleParam);
  const { k_hash_value: kHashValue, k_two: kTwo, ...restInputs } = inputs[1];

  return [
    inputs[0],
    {
      kHashValue,
      kTwo,
      ...restInputs,
    },
  ];
}

export async function generateTimeLockPuzzleProof(
  timeLockPuzzleZkpParam: any,
  timeLockPuzzleZkpProvingKey: any,
  timeLockPuzzlePublicInput: any,
  timeLockPuzzleSecretInput: any,
  timeLockPuzzleParam: any,
) {
  await ensureInitialized();
  const { kHashValue, kTwo, ...restTimeLockPuzzlePublicInput } =
    timeLockPuzzlePublicInput;

  const snakeCaseTimeLockPuzzlePublicInput = {
    k_hash_value: kHashValue,
    k_two: kTwo,
    ...restTimeLockPuzzlePublicInput,
  };

  const { yTwo, ...restTimeLockPuzzleParam } = timeLockPuzzleParam;
  const snakeCaseTimeLockPuzleParam = {
    y_two: yTwo,
    ...restTimeLockPuzzleParam,
  };

  return await prove_time_lock_puzzle(
    timeLockPuzzleZkpParam,
    timeLockPuzzleZkpProvingKey,
    snakeCaseTimeLockPuzzlePublicInput,
    timeLockPuzzleSecretInput, // time-lock puzzle secret input
    snakeCaseTimeLockPuzleParam,
  );
}

export async function verifyTimeLockPuzzleProof(
  timeLockPuzzleZkpParam: any,
  timeLockPuzzleZkpVerifyingKey: any,
  timeLockPuzzlePublicInput: any,
  timeLockPuzzleParam: any,
  timeLockPuzzleProof: any,
) {
  await ensureInitialized();
  const { kHashValue, kTwo, ...restTimeLockPuzzlePublicInput } =
    timeLockPuzzlePublicInput;

  const snakeCaseTimeLockPuzzlePublicInput = {
    k_hash_value: kHashValue,
    k_two: kTwo,
    ...restTimeLockPuzzlePublicInput,
  };

  const { yTwo, ...restTimeLockPuzzleParam } = timeLockPuzzleParam;
  const snakeCaseTimeLockPuzzleParam = {
    y_two: yTwo,
    ...restTimeLockPuzzleParam,
  };
  return verify_time_lock_puzzle_proof(
    timeLockPuzzleZkpParam,
    timeLockPuzzleZkpVerifyingKey,
    snakeCaseTimeLockPuzzlePublicInput,
    snakeCaseTimeLockPuzzleParam,
    timeLockPuzzleProof,
  );
}

export async function fetchEncryptionZkpParam() {
  return await fetch(
    'https://raw.githubusercontent.com/radiusxyz/pvde.js/main/public/data/encryption_zkp_param.data',
    {
      method: 'GET',
    },
  ).then(async (res) => readStream(res));
}

export async function fetchEncryptionProvingKey() {
  return await fetch(
    'https://raw.githubusercontent.com/radiusxyz/pvde.js/main/public/data/encryption_zkp_proving_key.data',
    {
      method: 'GET',
    },
  ).then(async (res) => readStream(res));
}

export async function fetchEncryptionVerifyingKey() {
  return await fetch(
    'https://raw.githubusercontent.com/radiusxyz/pvde.js/main/public/data/encryption_zkp_verifying_key.data',
    {
      method: 'GET',
    },
  ).then(async (res) => readStream(res));
}

export async function encryptMessage(message: any, encryptionKey: any) {
  await ensureInitialized();
  return encrypt(message, encryptionKey);
}

export async function generateEncryptionProof(
  encryptionZkpParam: any,
  encryptionProvingKey: any,
  encryptionPublicInput: any,
  encryptionSecretInput: any,
) {
  await ensureInitialized();
  const { encryptedData, kHashValue } = encryptionPublicInput;

  const snakeCaseEncryptionPublicInput = {
    encrypted_data: encryptedData,
    k_hash_value: kHashValue,
  };

  return prove_encryption(
    encryptionZkpParam,
    encryptionProvingKey,
    snakeCaseEncryptionPublicInput,
    encryptionSecretInput,
  );
}

export async function verifyEncryptionProof(
  encryptionZkpParam: any,
  encryptionVerifyingKey: any,
  encryptionPublicInput: any,
  encryptionProof: any,
) {
  await ensureInitialized();

  const { encryptedData, kHashValue } = encryptionPublicInput;
  const snakeCaseEncryptionPublicInput = {
    encrypted_data: encryptedData,
    k_hash_value: kHashValue,
  };

  return verify_encryption_proof(
    encryptionZkpParam,
    encryptionVerifyingKey,
    snakeCaseEncryptionPublicInput,
    encryptionProof,
  );
}

export async function solveTimeLockPuzzle(
  timeLockPuzzlePublicInput: any,
  timeLockPuzzleParam: any,
) {
  await ensureInitialized();

  const k = await solve_time_lock_puzzle(
    timeLockPuzzlePublicInput.o,
    timeLockPuzzleParam.t,
    timeLockPuzzleParam.n,
  );
  return k;
}

export async function generateSymmetricKey(k: any) {
  await ensureInitialized();
  return await generate_symmetric_key(k);
}

export async function decryptCipher(cipher: any, symmetricKey: any) {
  await ensureInitialized();
  return decrypt(cipher, symmetricKey);
}
