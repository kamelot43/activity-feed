import styled from 'styled-components';
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_POST } from '../graphql/queries';
import { useLogs } from '../context/LogContext';

const FormContainer = styled.div`
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #a0aec0;
    box-shadow: 0 0 0 3px rgba(160,174,192,0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #a0aec0;
    box-shadow: 0 0 0 3px rgba(160,174,192,0.1);
  }
`;

const SubmitButton = styled.button`
  background: white;
  color: #2c3e50;
  border: 1px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover:not(:disabled) {
    border-color: #cbd5e0;
    background: #f7fafc;
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
      <h2>Новый пост</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            type="text"
            placeholder="ваше имя"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <TextArea
            placeholder="что у вас нового?"
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