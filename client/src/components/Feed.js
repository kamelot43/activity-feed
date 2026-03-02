import styled from 'styled-components';
import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '../graphql/queries';
import Post from './Post';
import { USER_ID } from '../config';
import { useLogs } from '../context/LogContext';
import { useSocketEvents } from '../hooks/useSocketEvents';

const PostsContainer = styled.div`
  flex: 2;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #a0aec0;
  font-size: 0.95rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #edf2f7;
  
  &::after {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: 10px;
    border: 2px solid #a0aec0;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    vertical-align: middle;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
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
      refetch();
      addLog(`📝 новый пост от @${newPost.author}`);
    },
    'post-updated': (updatedPost) => {
      console.log('❤️ Пост обновлен, перезапрашиваем...', updatedPost);
      refetch();
      addLog(`❤️ лайк обновлен (пост ${updatedPost.id})`);
    }
  }, [refetch]);

  if (loading && !data) return <LoadingState>Загрузка...</LoadingState>;
  if (error) return <LoadingState>Ошибка: {error.message}</LoadingState>;

  const posts = data?.posts || [];
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <PostsContainer>
      <h2>Лента</h2>
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
    </PostsContainer>
  );
}

export default Feed;