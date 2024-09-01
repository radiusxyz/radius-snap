import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import styled from 'styled-components';

import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  Card,
  PvdeCard,
  PvdeButton,
} from '../components';
import { defaultSnapOrigin } from '../config';
import {
  useMetaMask,
  useInvokeSnap,
  useMetaMaskContext,
  useRequestSnap,
} from '../hooks';
import { isLocalSnap, shouldDisplayReconnectButton } from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  height: 100%;
  margin-top: 1rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [timeLockPuzzleParam, setTimeLockPuzzleParam] = useState<any>();
  const [timeLockPuzzlePrivateInput, setTimeLockPuzzlePrivateInput] =
    useState<any>();
  const [timeLockPuzzlePublicInput, setTimeLockPuzzlePublicInput] =
    useState<any>();

  const [timeLockPuzzleZkpParamB64, setTimeLockPuzzleZkpParamB64] =
    useState<any>();
  const [timeLockPuzzleZkpParam, setTimeLockPuzzleZkpParam] = useState<any>();
  const [timeLockPuzzleProvingKey, setTimeLockPuzzleProvingKey] =
    useState<any>();
  const [timeLockPuzzleProvingKeyB64, setTimeLockPuzzleProvingKeyB64] =
    useState<any>();
  const [timeLockPuzzleProof, setTimeLockPuzzleProof] = useState<any>();
  const [encryptionKey, setEncryptionKey] = useState<any>();
  const [cipherText, setCipherText] = useState<any>();
  const [encryptionZkpParam, setEncryptionZkpParam] = useState<any>();
  const [encryptionZkpParamB64, setEncryptionZkpParamB64] = useState<any>();
  const [encryptionProvingKey, setEncryptionProvingKey] = useState<any>();
  const [encryptionProvingKeyB64, setEncryptionProvingKeyB64] = useState<any>();

  const [message, setMessage] = useState('');
  const handleInputMessageField = (
    changeEvent: ChangeEvent<HTMLInputElement>,
  ) => {
    changeEvent.preventDefault();
    setMessage(changeEvent.target.value);
  };

  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  function base64ToUint8Array(base64String) {
    const binaryString = atob(base64String); // atob decodes the Base64 string
    const len = binaryString.length;
    const uint8Array = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array;
  }

  const handleClick = async (func: string, params?: any) => {
    return await invokeSnap({ method: func, params });
  };

  const createClickHandler = (func: string, params?: any) => async () => {
    if (func === 'generateTimeLockPuzzleParam') {
      console.log('Generating Params for Time-Lock Puzzle');
      const response = await handleClick(func, params);
      console.log('Time-Lock Puzzle Params are ready', response);
      setTimeLockPuzzleParam(response);
    }
    if (func === 'generateTimeLockPuzzle') {
      if (!timeLockPuzzleParam) {
        console.log(
          'Time-Lock Puzzle Params are not generated yet! Please generate them first.',
        );
        return;
      }
      console.log('Generating Time-Lock Puzzle');
      const response = await handleClick(func, params);
      console.log('Time-Lock Puzzle is ready', response);
      setTimeLockPuzzlePrivateInput(response[0]);
      setTimeLockPuzzlePublicInput(response[1]);
    }
    if (func === 'fetchTimeLockPuzzleZkpParam') {
      console.log('Fetching ZKP Param for Time-Lock Puzzle');
      const response = await handleClick(func, params);
      const result = base64ToUint8Array(response);
      console.log('ZKP Param for Time-Lock Puzzle is ready', result);
      setTimeLockPuzzleZkpParam(result);
      setTimeLockPuzzleZkpParamB64(response);
    }
    if (func === 'fetchTimeLockPuzzleProvingKey') {
      console.log('Fetching Proving Key for Time-Lock Puzzle');
      const response = await handleClick(func, params);
      const result = base64ToUint8Array(response);
      console.log('Proving Key for Time-Lock Puzzle is ready', result);
      setTimeLockPuzzleProvingKey(result);
      setTimeLockPuzzleProvingKeyB64(response);
    }
    if (func === 'generateTimeLockPuzzleProof') {
      if (
        !timeLockPuzzleZkpParam ||
        !timeLockPuzzleProvingKey ||
        !timeLockPuzzlePublicInput ||
        !timeLockPuzzlePrivateInput ||
        !timeLockPuzzleParam
      ) {
        console.log(
          'Cannot generate Time-Lock Puzzle Proof! Please make sure all the required params are generated.',
        );
        return;
      }
      console.log('Proving Time-Lock Puzzle');
      const response = await handleClick(func, {
        timeLockPuzzleZkpParamB64,
        timeLockPuzzleProvingKeyB64,
        timeLockPuzzlePublicInput,
        timeLockPuzzlePrivateInput,
        timeLockPuzzleParam,
      });
      const result = base64ToUint8Array(response);
      console.log(' Time-Lock Puzzle Proof is ready', result);
      setTimeLockPuzzleProof(result);
    }
    if (func === 'generateSymmetricKey') {
      if (!timeLockPuzzlePrivateInput) {
        console.log(
          'Cannot generate Symmetric Key! Please make sure the Time-Lock Puzzle is generated.',
        );
        return;
      }
      console.log('Generating Symmetric Key');
      const response = await handleClick(func, timeLockPuzzlePrivateInput);
      console.log('Symmetric Key is ready', response);
      setEncryptionKey(response);
    }
    if (func === 'encryptMessage') {
      if (!encryptionKey) {
        console.log(
          'Cannot encrypt message! Please make sure the Symmetric Key is generated.',
        );
        return;
      }

      console.log('Encrypting Message');
      const response = await handleClick(func, { message, encryptionKey });
      console.log('Cipher Text is ready', response);
      setCipherText(response);
    }
    if (func === 'fetchEncryptionZkpParam') {
      console.log('Fetching ZKP Param for Encryption');
      const response = await handleClick(func, params);
      const result = base64ToUint8Array(response);
      console.log('ZKP Param for Encryption is ready', result);
      setEncryptionZkpParam(result);
      setEncryptionZkpParamB64(response);
    }
    if (func === 'fetchEncryptionProvingKey') {
      console.log('Fetching Proving Key for Encryption');
      const response = await handleClick(func, params);
      const result = base64ToUint8Array(response);
      console.log('Proving Key for Encryption is ready', result);
      setEncryptionProvingKey(result);
      setEncryptionProvingKeyB64(response);
    }
    if (func === 'generateEncryptionProof') {
      if (
        !encryptionZkpParam ||
        !encryptionProvingKey ||
        !cipherText ||
        !encryptionKey
      ) {
        console.log(
          'Cannot generate Encryption Proof! Please make sure all the required params are generated.',
        );
        return;
      }
      const encryptionPublicInput = {
        encryptedData: cipherText,
        kHashValue: timeLockPuzzlePublicInput.kHashValue,
      };
      const encryptionPrivateInput = {
        data: message,
        k: timeLockPuzzlePrivateInput.k,
      };

      console.log('Proving Encryption');
      const response = await handleClick(func, {
        encryptionZkpParamB64,
        encryptionProvingKeyB64,
        encryptionPublicInput,
        encryptionPrivateInput,
      });
      const result = base64ToUint8Array(response);
      console.log('Encryption Proof is ready', result);
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>PVDE-snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.tsx</code>
      </Subtitle>
      <CardContainer>
        {error && (
          <ErrorMessage>
            <b>An error happened:</b> {error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
          />
        )}
        {!installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the PVDE snap.',
              button: (
                <ConnectButton
                  onClick={requestSnap}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={requestSnap}
                  disabled={!installedSnap}
                />
              ),
            }}
            disabled={!installedSnap}
          />
        )}
      </CardContainer>
      <CardContainer>
        <PvdeCard
          content={{
            title: 'Generate Time-Lock Puzzle Params',
            description:
              'Generate params that are required for making a time-lock puzzle.',
            button: (
              <PvdeButton
                onClick={createClickHandler('generateTimeLockPuzzleParam')}
                disabled={!installedSnap}
              >
                Generate
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
        <PvdeCard
          content={{
            title: 'Generate Time-Lock Puzzle',
            description: 'Using the params, generate the time-lock puzzle.',
            button: (
              <PvdeButton
                onClick={createClickHandler(
                  'generateTimeLockPuzzle',
                  timeLockPuzzleParam,
                )}
                disabled={!installedSnap}
              >
                Generate
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
        <PvdeCard
          content={{
            title: 'Fetch Time-Lock Puzzle ZKP Param',
            description:
              'Fetch ZKP params from a server in order to use it for generating a zk-proof.',
            button: (
              <PvdeButton
                onClick={createClickHandler('fetchTimeLockPuzzleZkpParam')}
                disabled={!installedSnap}
              >
                Fetch
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
        <PvdeCard
          content={{
            title: 'Fetch Time-Lock Puzzle Proving Key',
            description:
              'Fetch ZKP proving key from a server in order to use it for generating a zk-proof.',
            button: (
              <PvdeButton
                onClick={createClickHandler('fetchTimeLockPuzzleProvingKey')}
                disabled={!installedSnap}
              >
                Fetch
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
        <PvdeCard
          content={{
            title: 'Generate Time-Lock Puzzle Proof',
            description: 'Prove time-lock puzzle.',
            button: (
              <PvdeButton
                onClick={createClickHandler('generateTimeLockPuzzleProof')}
                disabled={!installedSnap}
              >
                Prove
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
      </CardContainer>
      <CardContainer>
        <PvdeCard
          content={{
            title: 'Generate Symmetric Key',
            description:
              'Generate symmetric key needed for encrypting a raw transaction.',
            button: (
              <PvdeButton
                onClick={createClickHandler('generateSymmetricKey')}
                disabled={!installedSnap}
              >
                Generate
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
        <PvdeCard
          content={{
            title: 'Encrypt Message',
            description:
              'Encrypt the raw transaction using the generated symmetric key.',
            message,
            button: (
              <PvdeButton
                onClick={createClickHandler('encryptMessage')}
                disabled={!installedSnap}
              >
                Encrypt
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
          inputHandler={handleInputMessageField}
          input
        />
        <PvdeCard
          content={{
            title: 'Fetch Encryption ZKP param',
            description:
              'Fetch ZKP params from a server in order to use it for generating a zk-proof.',
            button: (
              <PvdeButton
                onClick={createClickHandler('fetchEncryptionZkpParam')}
                disabled={!installedSnap}
              >
                Fetch
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
        <PvdeCard
          content={{
            title: 'Fetch Encryption Proving Key',
            description:
              'Fetch ZKP proving key from a server in order to use it for generating a zk-proof of encryption.',
            button: (
              <PvdeButton
                onClick={createClickHandler('fetchEncryptionProvingKey')}
                disabled={!installedSnap}
              >
                Fetch
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
        <PvdeCard
          content={{
            title: 'Generate Encryption Proof',
            description: 'Prove the validity of encryption.',
            button: (
              <PvdeButton
                onClick={createClickHandler('generateEncryptionProof')}
                disabled={!installedSnap}
              >
                Prove
              </PvdeButton>
            ),
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        />
      </CardContainer>
      <CardContainer>
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
