# Radius Snap - Secure Account and Transaction Management

This project provides a MetaMask Snap that facilitates secure cryptographic operations for account management and transaction signing using SKDE encryption. It includes both a backend for cryptographic processing and a front-end interface for user interaction with MetaMask Flask.

## Table of Contents

- [Installation](#installation)
- [Front-End Interface](#front-end-interface)
  - [Components](#components)
  - [Actions](#actions)
- [Snap Backend API](#snap-backend-api)
  - [Methods](#methods)
- [Dependencies](#dependencies)
- [Examples](#examples)
- [Contributing](#contributing)
- [Getting Help](#getting-help)

---

## Installation

To use this Snap, clone the repository and install the necessary packages:

```bash
git clone https://github.com/radiusxyz/radius-snap.git
cd radius-snap
yarn install && yarn start
```

To enable Snap functionality, use MetaMask Flask (a developer version of MetaMask that supports Snaps).

## Architecture

![image](https://github.com/user-attachments/assets/111c96a3-c377-4f0d-8366-bf40f604a1b0)


## Front-End Interface

The front-end provides an interactive interface for managing accounts and sending transactions securely through MetaMask Flask.

### Components

1. **Container**: Wraps the main layout with responsive margins.
2. **Card Components**:
   - **RadiusCard**: Displays actions like Load Account, Generate Key, Import Key, and Send Transaction.
   - **CardContainer**: Arranges RadiusCards in a responsive grid layout.
3. **Interactive Elements**:
   - **PvdeButton**: Custom button for invoking Snap methods.
   - **Input**: Custom input fields for account details and transaction amounts.
4. **Error and Notice Displays**:
   - **ErrorMessage**: Displays errors encountered with MetaMask.
   - **Notice**: Provides information on Snap configuration files.

### Actions

Core actions available in this interface:

1. **Load Account**:
   - Loads an existing account from MetaMask’s state storage.
   - Button: "Load from local storage."

2. **Generate Private Key**:
   - Creates and stores a new private key in MetaMask.
   - Button: "Generate new one."

3. **Import Private Key**:
   - Imports an existing private key.
   - Button: "Import."

4. **Send Transaction**:
   - Signs and encrypts transaction data for secure transmission.
   - Fields: Recipient address (`to`), amount, and data (preset as `0x`).
   - Button: "Send."

---

## Snap Backend API

The backend Snap functions are managed through a JSON-RPC handler to support account operations and encrypted transaction processing.

### Methods

1. **Account Management**:
   - **`load`**: Retrieves a stored account.
   - **`generate`**: Generates a new private key and account.
   - **`import`**: Imports an account with a given private key.

2. **Transaction Preparation and Encryption**:
   - **`send`**: Prepares, signs, and encrypts a transaction using SKDE encryption before sending it to an external server.
     - **Transaction Preparation**: Configured for the Holesky Ethereum test chain.
     - **Encryption**: SKDE parameters and dynamic keys are fetched from an external server.

### Example Usage

#### Account Loading (`load` function)
Loads a persisted account if available:

```javascript
case 'load': {
  const persistedData = await snap.request({
    method: 'snap_manageState', params: { operation: 'get' }
  });
  if (!persistedData || !persistedData.account) return null;
  account = persistedData.account;
  return account.address;
}
```

#### Generating a Private Key (`generate` function)
Creates a new private key and associates it with an account:

```javascript
case 'generate': {
  const privateKey = generatePrivateKey();
  account = privateKeyToAccount(privateKey);
  await snap.request({
    method: 'snap_manageState', params: { operation: 'update', newState: { account } }
  });
  return account.address;
}
```

#### Sending Encrypted Transaction (`send` function)
Prepares, signs, and encrypts transaction data for transmission.

```javascript
case 'send': {
  const walletClient = createWalletClient({ chain: holesky, transport: http() });
  const myRequest = await walletClient.prepareTransactionRequest({
    account, to: request.params.to, value: parseUnits(request.params.amount, 18)
  });
  const serializedTransaction = await walletClient.signTransaction(myRequest);
  
  const skdeParams = await fetchSKDEParams();
  const encryptionKeySkde = await fetchEncryptionKey();
  const encryptedData = await encryptMessageSkde(skdeParams, JSON.stringify(parsedTransaction), encryptionKeySkde);
  
  const encrypted_transaction = buildEncryptedTransaction(encryptedData, parsedTransaction, account);
  await sendEncryptedTransaction(encrypted_transaction);
  return { result: 'success' };
}
```

---

## Dependencies

This project uses the following libraries:

- **MetaMask Snaps SDK**: Enables Snap functionality in MetaMask.
- **Viem**: Provides cryptographic and Ethereum utility functions.
- **Axios**: Manages HTTP requests for SKDE parameter retrieval.

### External API Endpoints
Ensure the following endpoints are accessible:

- **`get_skde_params`**: Fetches SKDE encryption parameters.
- **`get_encryption_key`**: Fetches the encryption key for SKDE.

---

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for discussion.

## Getting Help

If you need help or have questions, please contact the development team.

--- 

## Cloning

This repository contains GitHub Actions that you may find useful, see
`.github/workflows` and [Releasing & Publishing](https://github.com/MetaMask/template-snap-monorepo/edit/main/README.md#releasing--publishing)
below for more information.

If you clone or create this repository outside the MetaMask GitHub organization,
you probably want to run `./scripts/cleanup.sh` to remove some files that will
not work properly outside the MetaMask GitHub organization.

If you don't wish to use any of the existing GitHub actions in this repository,
simply delete the `.github/workflows` directory.

## Contributing

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and
fix any automatically fixable issues.

### Using NPM packages with scripts

Scripts are disabled by default for security reasons. If you need to use NPM
packages with scripts, you can run `yarn allow-scripts auto`, and enable the
script in the `lavamoat.allowScripts` section of `package.json`.

See the documentation for [@lavamoat/allow-scripts](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts)
for more information.
