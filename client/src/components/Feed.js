import styled from 'styled-components';
import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '../graphql/queries';
import Post from './Post';
import { USER_ID } from '../config';
import { useLogs } from '../context/LogContext';
import { useSocketEvents } from '../hooks/useSocketEvents';
import {sounds} from '../utils/sound';

const FeedContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
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

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #718096;
  font-size: 0.95rem;
  background: #f8fafc;
  border-radius: 12px;
`;

const EmptyState = styled(LoadingState)`
  /* те же стили */
`;

function Feed() {
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    notifyOnNetworkStatusChange: false,
    fetchPolicy: 'cache-first',
  });
  const { addLog } = useLogs();

  useSocketEvents({
    'new-post': (newPost) => {
      console.log('📢 Новый пост, перезапрашиваем...', newPost);
      sounds.playNewPost();
      refetch();
      addLog(`📝 новый пост от @${newPost.author}`);
    },
    'post-updated': (updatedPost) => {
      console.log('❤️ Пост обновлен, перезапрашиваем...', updatedPost);
      sounds.playLike();
      refetch();
      addLog(`❤️ лайк обновлен (пост ${updatedPost.id})`);
    }
  }, [refetch]);

  if (loading && !data) return (
    <FeedContainer>
      <Title>Лента</Title>
      <LoadingState>Загрузка...</LoadingState>
    </FeedContainer>
  );
  
  if (error) return (
    <FeedContainer>
      <Title>Лента</Title>
      <LoadingState>Ошибка: {error.message}</LoadingState>
    </FeedContainer>
  );

  const posts = data?.posts || [];
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <FeedContainer>
      <Title>Лента</Title>
      {sortedPosts.map(post => (
        <Post 
          key={post.id} 
          post={post} 
          userId={USER_ID}
        />
      ))}
      {sortedPosts.length === 0 && (
        <EmptyState>Пока нет постов</EmptyState>
      )}
    </FeedContainer>
  );
}

export default Feed;