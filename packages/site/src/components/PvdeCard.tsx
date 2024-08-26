import { useEffect, type ChangeEvent, type ReactNode } from 'react';
import styled from 'styled-components';

type PvdeCardProps = {
  content: {
    title?: string;
    description: ReactNode;
    button?: ReactNode;
    message?: string;
  };
  disabled?: boolean;
  fullWidth?: boolean;
  input?: boolean;
  inputHandler?: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
};

const PvdeCardWrapper = styled.div<{
  fullWidth?: boolean | undefined;
  disabled?: boolean | undefined;
}>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '250px')};
  background-color: ${({ theme }) => theme.colors.card?.default};
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  padding: 2.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.default};
  filter: opacity(${({ disabled }) => (disabled ? '.4' : '1')});
  align-self: stretch;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const Description = styled.div`
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
`;

const Input = styled.input`
  padding: 5px 10px;
`;

export const PvdeCard = ({
  content,
  disabled = false,
  fullWidth,
  input,
  inputHandler,
}: PvdeCardProps) => {
  const { title, description, button, message } = content;

  useEffect(() => {
    console.log(message);
  }, [message]);
  return (
    <PvdeCardWrapper fullWidth={fullWidth} disabled={disabled}>
      {title && <Title>{title}</Title>}
      <Description>{description}</Description>
      {input && <Input value={message} onChange={inputHandler} />}
      {button}
    </PvdeCardWrapper>
  );
};
