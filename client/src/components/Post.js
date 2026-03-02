import styled from 'styled-components';
import { useMutation } from '@apollo/client/react';
import { LIKE_POST, GET_POSTS } from '../graphql/queries';
import { useLogs } from '../context/LogContext';

const PostCard = styled.div`
  background: white;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 12px;
  border: 1px solid #edf2f7;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);

  &:hover {
    border-color: #cbd5e0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }
`;

const Author = styled.div`
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.95rem;
`;

const Text = styled.div`
  color: #34495e;
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 1rem;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Likes = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #718096;
  font-size: 0.9rem;

  .heart {
    font-size: 1.1rem;
    transition: transform 0.2s ease;
    color: ${props => props.$liked ? '#e53e3e' : '#718096'};
    transform: ${props => props.$liked ? 'scale(1.1)' : 'scale(1)'};
  }
`;

const LikeButton = styled.button`
  background: none;
  border: 1px solid ${props => props.$liked ? '#fed7d7' : '#e2e8f0'};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: ${props => props.$liked ? '#e53e3e' : '#4a5568'};
  background: ${props => props.$liked ? '#fff5f5' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    border-color: #cbd5e0;
    background: ${props => props.$liked ? '#fed7d7' : '#f7fafc'};
  }
`;

function Post({ post, userId }) {
  const userLiked = post.likedBy?.includes(userId) || false;
  const { addLog } = useLogs();
  const date = new Date(post.createdAt);
  const timeString = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const [likePost] = useMutation(LIKE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    onError: (error) => {
      addLog(`❌ ошибка лайка: ${error.message}`);
    }
  });

  const handleLike = async () => {
    await likePost({ variables: { 
      id: post.id,
      userId: userId
    } });
    addLog('👍 действие с лайком выполнено');
  };

  return (
    <PostCard>
      <Author>@{post.author} · {timeString}</Author>
      <Text>{post.text}</Text>
      <Footer>
        <Likes $liked={userLiked}>
          <span className="heart">{userLiked ? '❤️' : '🤍'}</span>
          {post.likes || 0}
        </Likes>
        <LikeButton 
          $liked={userLiked}
          onClick={handleLike}
        >
          {userLiked ? 'убрать лайк' : 'лайк'}
        </LikeButton>
      </Footer>
    </PostCard>
  );
}

export default Post;