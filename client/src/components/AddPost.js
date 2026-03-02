import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_POST, GET_POSTS } from '../graphql/queries';

function AddPost() {
  const [author, setAuthor] = useState('user');
  const [text, setText] = useState('');

  const [addPost, { loading }] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => {
      setText('');
      alert('Пост добавлен!');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author || !text) return;

    try {
      await addPost({ variables: { text, author } });
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-post">
      <h2>Новый пост</h2>
      
      <div className="form-group">
        <input
          type="text"
          placeholder="Автор"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="Текст поста"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Публикация...' : 'Опубликовать'}
      </button>
    </form>
  );
}

export default AddPost;