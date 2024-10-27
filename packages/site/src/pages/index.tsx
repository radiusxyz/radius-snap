// @ts-nocheck
import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import styled from 'styled-components';

import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  Card,
  RadiusCard,
  PvdeButton,
  Input,
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

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelBalance = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Index = () => {
  const [messageSkde, setMessageSkde] = useState('');
  const [cipherTextSkde, setCipherTextSkde] = useState('');
  const [decryptionKeySkde, setDecryptionKeySkde] = useState('');
  const [encryptionKeySkde, setEncryptionKeySkde] = useState('');
  const [skdeParams, setSkdeParams] = useState<any>();

  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(0);

  const handleAmount = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    changeEvent.preventDefault();
    setAmount(changeEvent.target.value);
  };
  const handleTo = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    changeEvent.preventDefault();
    setTo(changeEvent.target.value);
  };

  const handleInputMessageSkdeField = (
    changeEvent: ChangeEvent<HTMLInputElement>,
  ) => {
    changeEvent.preventDefault();
    setMessageSkde(changeEvent.target.value);
  };

  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const handleClick = async (func: string, params?: any) => {
    return await invokeSnap({ method: func, params });
  };

  const createClickHandler = (func: string, params?: any) => async () => {
    if (func === 'fetchSkdeParams') {
      console.log('Fetching SKDE Params');
      const response = await handleClick(func, params);
      console.log('SKDE Params are ready', response);
      setSkdeParams(response);
    }
    if (func === 'fetchEncryptionKeySkde') {
      console.log('Fetching Encryption Key for SKDE');
      const response = await handleClick(func, params);
      console.log('Encryption Key is ready', response);
      setEncryptionKeySkde(response);
    }
    if (func === 'encryptMessageSkde') {
      console.log('Encrypting Message using SKDE');
      const response = await handleClick(func, {
        skdeParams,
        messageSkde,
        encryptionKeySkde,
      });
      console.log('Cipher Text is ready', response);
      setCipherTextSkde(response);
    }
    if (func === 'fetchDecryptionKeySkde') {
      console.log('Fetching Decryption Key for SKDE');
      const response = await handleClick(func, params);
      console.log('Decryption Key is ready', response);
      setDecryptionKeySkde(response);
    }
    if (func === 'decryptCipherSkde') {
      console.log('Decrypting Cipher using SKDE');
      const response = await handleClick(func, {
        skdeParams,
        cipherTextSkde,
        decryptionKeySkde,
      });
      console.log('Decrypted Message is ready', response);
    }

    if (func === 'send') {
      console.log('Sending Transaction');
      await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [],
      });

      await window.ethereum.request({
        method: 'personal_sign',
        params: [
          '0x43d7215ebe96c09a5adac69fc76dea5647286b501954ea273e417cf65e6c80e1db4891826375a7de02467a3e01caf125f64c851a8e9ee9467fd6f7e83523b2115bed8e79d527a85e28a36807d79b85fc551b5c15c1ead2e43456c31f565219203db2aed86cb3601b33ec3b410836d4be7718c6148dc9ac82ecc0a04c5edecd8914',
          '0xd612e58915c883393a644e6ec1ff05e06c16bcbc',
        ],
      });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>Radius Snap</Span>
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
      <>
        <CardContainer>
          <RadiusCard
            content={{
              title: 'Fetch SKDE Params',
              description:
                'Fetch SKDE params from a secure rpc endpoint to be used for encryption.',
              message: messageSkde,
              button: (
                <PvdeButton
                  onClick={createClickHandler('fetchSkdeParams')}
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
          <RadiusCard
            content={{
              title: 'Fetch SKDE encryption key',
              description:
                'Fetch SKDE encryption key from a secure rpc endpoint to be used for encryption.',
              button: (
                <PvdeButton
                  onClick={createClickHandler('fetchEncryptionKeySkde')}
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
          <RadiusCard
            content={{
              title: 'Encrypt Message',
              description:
                'Encrypt the raw transaction using the generated symmetric key.',
              message: messageSkde,
              button: (
                <PvdeButton
                  onClick={createClickHandler('encryptMessageSkde')}
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
            inputHandler={handleInputMessageSkdeField}
            input
          />
        </CardContainer>
        <CardContainer>
          <RadiusCard
            content={{
              title: 'Fetch SKDE decrytion key',
              description:
                'Fetch SKDE decryption key from a secure rpc endpoint to be used for decryption.',
              button: (
                <PvdeButton
                  onClick={createClickHandler('fetchDecryptionKeySkde')}
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
          <RadiusCard
            content={{
              title: 'Decrypt Ciphertext',
              description:
                'Decrypt the ciphertext using SKDE params and decryption key',
              button: (
                <PvdeButton
                  onClick={createClickHandler('decryptCipherSkde')}
                  disabled={!installedSnap}
                >
                  Decrypt
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
          <RadiusCard
            content={{
              title: 'Transact',
              description: 'Request a transaction to be sent to the network.',
              button: (
                <PvdeButton
                  onClick={createClickHandler('send')}
                  disabled={!installedSnap}
                >
                  Send
                </PvdeButton>
              ),
            }}
            disabled={!installedSnap}
            fullWidth={
              isMetaMaskReady &&
              Boolean(installedSnap) &&
              !shouldDisplayReconnectButton(installedSnap)
            }
          >
            <Inputs>
              <InputContainer>
                <LabelBalance>
                  <span> To</span>
                </LabelBalance>
                <Input value={to} onChange={handleTo} />
              </InputContainer>
              <InputContainer>
                <LabelBalance>
                  <span> Amount</span> <span>Balance: 0</span>
                </LabelBalance>
                <Input value={amount} onChange={handleAmount} />
              </InputContainer>
            </Inputs>
          </RadiusCard>
        </CardContainer>
      </>
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
