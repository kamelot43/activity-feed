import styled from 'styled-components';
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_POST } from '../graphql/queries';
import { useLogs } from '../context/LogContext';

const FormContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #edf2f7;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
  letter-spacing: -0.3px;
`;

const FormGroup = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #4299e1;
    background: white;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4299e1;
    background: white;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #4299e1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #3182ce;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;


function AddPostForm({ onPostAdded }) {
  const [author, setAuthor] = useState('user');
  const [text, setText] = useState('');
  const { addLog } = useLogs();
  const [addPost, { loading }] = useMutation(ADD_POST, {
    onCompleted: () => {
      setText('');
      addLog('✅ пост опубликован');
      if (onPostAdded) onPostAdded();
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author || !text) {
      addLog('⚠️ заполните все поля');
      return;
    }
    await addPost({ variables: { text, author } });
  };

  return (
    <FormContainer>
     <Title>Новый пост</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            name="author"
            type="text"
            placeholder="ваше имя"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <TextArea
            name="text"
            placeholder="Что у вас нового?"
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Публикация...' : 'Опубликовать'}
          </SubmitButton>
        </FormGroup>
      </form>
    </FormContainer>
  );
}

export default AddPostForm;