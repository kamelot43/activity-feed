import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      text
      author
      likes
      likedBy
      createdAt
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($text: String!, $author: String!) {
    addPost(text: $text, author: $author) {
      id
      text
      author
      likes
      createdAt
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($id: ID!, $userId: String!) {
    likePost(id: $id, userId: $userId ) {
      id
      likes
      likedBy
    }
  }
`;