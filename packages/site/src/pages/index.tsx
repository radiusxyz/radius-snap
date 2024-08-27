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
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const handleSendHelloClick = async () => {
    const response = await invokeSnap({ method: 'greeting' });
    console.log(response);
  };

  const [message, setMessage] = useState('');
  const handleInputMessageField = (
    changeEvent: ChangeEvent<HTMLInputElement>,
  ) => {
    changeEvent.preventDefault();
    setMessage(changeEvent.target.value);
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
                onClick={handleSendHelloClick}
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
                onClick={handleSendHelloClick}
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
                onClick={handleSendHelloClick}
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
                onClick={handleSendHelloClick}
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
                onClick={handleSendHelloClick}
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
                onClick={handleSendHelloClick}
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
                onClick={handleSendHelloClick}
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
            title: 'Generate Encryption Proof',
            description: 'Prove the validity of encryption.',
            button: (
              <PvdeButton
                onClick={handleSendHelloClick}
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
