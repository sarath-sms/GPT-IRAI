import styled from 'styled-components';
import { useState } from 'react';
import BackButton from '../components/BackButton';

const Wrapper = styled.main`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(8)};
  text-align: center;
`;

const TextArea = styled.textarea`
  width: 100%;
  max-width: 400px;
  height: 120px;
  margin-top: ${({ theme }) => theme.spacing(8)};
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
`;

const Button = styled.button`
  margin-top: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export default function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setFeedback('');
  };

  return (
    <Wrapper>
      <BackButton />
      <h1>💬 Feedback</h1>
      {!submitted ? (
        <>
          <p>We value your feedback! Please share your thoughts below:</p>
          <TextArea
            placeholder="Type your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </>
      ) : (
        <p>✅ Thanks for your feedback!</p>
      )}
    </Wrapper>
  );
}
