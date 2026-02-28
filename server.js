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

      // ✅ Включаем Socket.IO уведомления
      io.emit('new-post', newPost);

      return newPost;
    },
    likePost: (parent, args) => {
      const post = posts.find(p => p.id === args.id);

      if (!post) {
        throw new Error('Пост не найден');
      }

      // В GraphQL пока просто увеличиваем лайк (без проверки userId)
      post.likes += 1;
      post.likedBy.push('graphql-user');

      // ✅ Включаем Socket.IO уведомления
      io.emit('post-updated', post);

      return post;
    }
  }
};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`✅ User connected (id: ${socket.id})`);

  socket.on('disconnect', (reason) => {
    console.log(`❌ User disconnected (id: ${socket.id}, reason: ${reason})`);
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

  // 404 обработчик (только для несуществующих маршрутов)
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