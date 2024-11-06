// @ts-nocheck
import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import styled from 'styled-components';

import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  Card,
  CustomButton,
} from '../components';
import { CustomCard, Input } from '../components/radius/CustomCard';
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

const Alert = styled.div`
  position: absolute;
  width: auto;
  top: 100px;
  height: 45px;
  display: flex;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  border-radius: 0.4rem;
  padding: 10px 20px;

  background-color: ${(props) =>
    props.status === 'success' ? '#6f4cff' : 'red'};
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
  gap: ${(props) => props.gap || '0'};
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const LabelBalance = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Index = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [alert, setAlert] = useState('neutral');
  const [balance, setBalance] = useState(0);
  const handleAmount = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    changeEvent.preventDefault();
    let inputValue = event.target.value;

    inputValue = inputValue.replace(/[^0-9.]/g, '');

    const parts = inputValue.split('.');
    if (parts.length > 2) {
      inputValue = parts[0] + '.' + parts.slice(1).join('');
    }

    setAmount(inputValue);
  };
  const handleFrom = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    changeEvent.preventDefault();
    setFrom(changeEvent.target.value);
  };
  const handleTo = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    changeEvent.preventDefault();
    setTo(changeEvent.target.value);
  };

  const handlePrivateKey = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    changeEvent.preventDefault();
    setPrivateKey(changeEvent.target.value);
  };

  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  useEffect(() => {
    if (!isMetaMaskReady || !Boolean(installedSnap)) {
      return;
    }
    const loadAccount = async () => {
      try {
        const response = await handleClick('load');
        console.log("Response from 'load' function", response);
        setFrom(response);
        if (response) {
          setAlert('loaded');
        } else {
          setAlert('failedToLoad');
        }
      } catch (error) {
        console.error('Error loading an account from storage', error);
      }
    };
    loadAccount();
  }, [isMetaMaskReady, installedSnap]);

  // useEffect(() => {
  //   if (!isMetaMaskReady || !Boolean(installedSnap)) {
  //     return;
  //   }
  //   const requestPermissions = async () => {
  //     await window.ethereum.request({
  //       method: 'wallet_requestPermissions',
  //       params: [
  //         {
  //           eth_accounts: {},
  //         },
  //       ],
  //     });
  //   };
  //   requestPermissions();
  // }, [isMetaMaskReady, installedSnap]);

  // useEffect(() => {
  //   if (!isMetaMaskReady) {
  //     return;
  //   }
  //   const getBalance = async () => {
  //     if (!from) {
  //       return;
  //     }
  //     const response = await window.ethereum.request({
  //       method: 'eth_getBalance',
  //       params: [from, 'latest'],
  //     });
  //     console.log('this is the response', response);
  //     if (response) {
  //       let weiValue = BigInt(response); // Convert hex to BigInt
  //       let ethValue = Number(weiValue) / 1e18;
  //       setBalance(ethValue);
  //     } // Divide by 10^18 to convert Wei to Ether
  //   };
  //   getBalance();
  // }, [installedSnap, from, isMetaMaskReady]);

  const handleClick = async (func: string, params?: any) => {
    return await invokeSnap({ method: func, params });
  };

  const createClickHandler = (func: string, params?: any) => async () => {
    if (func === 'load') {
      console.log('Sending Transaction');
      try {
        const response = await handleClick(func, params);
        console.log("Response from 'load' function", response);
      } catch (error) {
        console.error('Error loading an account from storage', error);
      }
    }
    if (func === 'generate') {
      console.log('Sending Transaction');
      try {
        const response = await handleClick(func, params);
        setFrom(response);
        setAlert('generated');
        console.log("Response from 'generate' function", response);
      } catch (error) {
        console.error('Error generating an account', error);
      }
    }
    if (func === 'import') {
      console.log('Sending Transaction');
      try {
        const response = await handleClick(func, params);
        setFrom(response);
        setAlert('imported');
        console.log("Response from 'import' function", response);
      } catch (error) {
        console.error('Error importing an account', error);
      }
    }
    if (func === 'send') {
      console.log('Sending Transaction');
      try {
        console.log('account', from);
        const response = await handleClick(func, params);
        console.log("Response from 'send' function", response);
      } catch (error) {
        console.error('Error sending transaction', error);
      }
    }
  };

  return (
    <Container>
      {alert === 'loaded' && (
        <Alert status={'success'}>Loaded account from the local storage</Alert>
      )}
      {alert === 'failedToLoad' && (
        <Alert status={'fail'}>There is no account in the local storage</Alert>
      )}
      {alert === 'generated' && (
        <Alert status={'success'}>
          Generated a new account and saved it to the local storage
        </Alert>
      )}
      {alert === 'imported' && (
        <Alert status={'success'}>
          Imported an account and saved it to the local storage
        </Alert>
      )}
      {alert === 'failedToImport' && (
        <Alert status={'fail'}>
          Failed to import an account from the private key
        </Alert>
      )}

      <Heading>
        Welcome to <Span>Radius Snap</Span>
      </Heading>

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
        <CustomCard
          content={{
            title: from ? 'Transact' : 'Setup Account',
            description:
              from && 'Request a transaction to be sent to the network.',
          }}
          disabled={!installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(installedSnap) &&
            !shouldDisplayReconnectButton(installedSnap)
          }
        >
          {from ? (
            <Inputs>
              <InputContainer>
                <LabelBalance>
                  <span>From</span>
                </LabelBalance>
                <Input
                  value={from}
                  readOnly
                  onChange={handleFrom}
                  placeholder="Account address"
                />
              </InputContainer>
              <InputContainer>
                <LabelBalance>
                  <span> To</span>
                </LabelBalance>
                <Input
                  value={to}
                  onChange={handleTo}
                  placeholder="Enter recipient address"
                />
              </InputContainer>
              <InputContainer>
                <LabelBalance>
                  <span> Amount</span>
                  {/* <span>Balance: {balance.toFixed(6)} ETH</span> */}
                </LabelBalance>
                <Input
                  type="text"
                  value={amount}
                  onChange={handleAmount}
                  placeholder="Enter a number"
                />
              </InputContainer>
              <InputContainer>
                <LabelBalance>
                  <span> Data</span>
                </LabelBalance>
                <Input type="text" placeholder="0x" readOnly />
              </InputContainer>
              <InputContainer>
                <CustomButton
                  marginTop="40px"
                  onClick={createClickHandler('send', { to, amount })}
                  disabled={!installedSnap}
                >
                  Send
                </CustomButton>
              </InputContainer>
            </Inputs>
          ) : (
            <Inputs gap="70px">
              <InputContainer>
                <CustomButton
                  onClick={createClickHandler('generate')}
                  disabled={!installedSnap}
                >
                  Generate a new account{' '}
                </CustomButton>
              </InputContainer>

              <InputContainer>
                <Input
                  type="text"
                  value={privateKey}
                  onChange={handlePrivateKey}
                  placeholder="Enter your private key"
                />

                <CustomButton
                  onClick={createClickHandler('import', { privateKey })}
                  disabled={!installedSnap}
                >
                  Or import from your private key{' '}
                </CustomButton>
              </InputContainer>
            </Inputs>
          )}
        </CustomCard>
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
