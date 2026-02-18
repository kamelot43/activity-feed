const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const { expressMiddleware } = require('@as-integrations/express5');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

const posts = [
  {
    id: '1',
    text: 'Первый пост!',
    author: 'user1',
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    text: 'Изучаю Node.js',
    author: 'user2',
    likes: 3,
    likedBy: ['user3', 'user4', 'user5'],
    createdAt: new Date().toISOString()
  }
];

// GraphQL схема
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
  }

  type Post {
    id: ID!
    text: String!
    author: String!
    likes: Int!
    likedBy: [String]!
    createdAt: String!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    addPost(text: String!, author: String!): Post!
    likePost(id: ID!): Post!
  }
`;

const resolvers = {
  Query: {
    posts: () => posts,
    post: (parent, args) => posts.find(p => p.id === args.id)
  },
  Mutation: {
    addPost: (parent, args) => {
      const newPost = {
        id: String(posts.length + 1),
        text: args.text,
        author: args.author,
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString()
      };
      posts.push(newPost);

      // Сохраняем Socket.IO уведомление (пока закомментируем)
      // io.emit('new-post', newPost);

      return newPost;
    },
    likePost: (parent, args) => {
      const post = posts.find(p => p.id === args.id);

      if(!post) {
        throw new Error('Пост не найден')
      }

      post.likes += 1;
      post.likedBy.push('graphql-user');

      // Сохраняем Socket.IO уведомление (пока закомментируем)
      // io.emit('post-updated', post);

      return post;
    }
  }
}

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

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`✅ User connected (id: ${socket.id})`);

  socket.on('disconnect', (reason) => {
    console.log(`❌ User disconnected (id: ${socket.id}, reason: ${reason})`);
  });
});

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
    likedBy: [],
    createdAt: new Date()
  };

  posts.push(newPost);

  io.emit('new-post', newPost);
  console.log(`📢 Уведомление о новом посте отправлено всем (id: ${newPost.id})`);

  res.status(201).json(newPost);
})

app.put('/posts/:id/like', (req, res) => {
  const post = posts.find(post => post.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Пост не найден'});
  }

  const userId = req.headers['x-user-id'] || req.body.userId || 'anonymous';
  const userLiked = post.likedBy.includes(userId);

  if (userLiked) {
    post.likedBy = post.likedBy.filter(id => id !== userId);
    post.likes -= 1;
  } else {
    post.likedBy.push(userId);
    post.likes += 1;
  }

  io.emit('post-updated', post);

  res.json({
    ...post,
    userLiked: !userLiked
  });
});


const PORT = 4000;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true })
  ]
});

async function startApolloServer() {
  await apolloServer.start();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(apolloServer)
  );

  app.use((req, res) => {
    res.status(404).json({
      error: 'Маршрут не найден',
      path: req.url,
      method: req.method
    });
  });

  console.log('🚀 GraphQL сервер готов на http://localhost:4000/graphql');
}

startApolloServer();

server.listen(PORT, () => {
  console.log(`🚀 HTTP сервер запущен на http://localhost:${PORT}`);
  console.log(`🔌 WebSocket сервер (Socket.IO) запущен и слушает тот же порт`);
});


