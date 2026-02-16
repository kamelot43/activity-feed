const express = require('express');
const app = express();

app.use(express.json());

const posts = [
  {
    id: '1',
    text: 'Первый пост!',
    author: 'user1',
    likes: 0,
    createdAt: new Date()
  },
  {
    id: '2',
    text: 'Изучаю Node.js',
    author: 'user2',
    likes: 3,
    createdAt: new Date()
  }
];

const validatePost = (req, res, next) => {
  const {text, author} = req.body;

  const errors = [];

  if (!text) errors.push('Поле "text" обязательно');
  if (!author) errors.push('Поле "author" обязательно');


  if (text) {
    if (text.length > 200) {
      errors.push(`Текст слишком длинный. Максимум 200 символов, сейчас ${text.length}`)
    }

    if(text.trim().length === 0) {
      errors.push('Текст не может состоять из одних пробелов');
    }
  }

  if(errors.length > 0) {
    return res.status(400).json({
      error: 'Ошибка валидации',
      details: errors
    })
  }

  next();
}

app.get('/posts', (req, res) => {
  res.json(posts);
})

app.get('/posts/:id', (req, res) => {
  const post = posts.find(post => post.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Пост не найден'})
  }

  res.json(post);
})

app.post('/posts', validatePost, (req, res) => {
  const { text, author} = req.body;

  const newPost = {
    id: String(posts.length + 1),
    text,
    author,
    likes: 0,
    createdAt: new Date()
  };

  posts.push(newPost);
  res.status(201).json(newPost);
})

app.put('/posts/:id/like', (req, res) => {
  const post = posts.find(post => post.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Пост не найден'});
  }

  post.likes += 1;
  res.json(post);
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})


