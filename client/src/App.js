import styled from 'styled-components';
import { SocketProvider } from './context/SocketContext';
import Feed from './components/Feed';
import Logs from './components/Logs';
import AddPostForm from './components/AddPostForm';
import { LogProvider } from './context/LogContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 0;
  margin-bottom: 40px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  h1 {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 30px;
    font-weight: 600;
    font-size: 1.8rem;
    color: #1a202c;
    letter-spacing: -0.5px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
`;

const LeftColumn = styled.div`
  min-width: 0; /* предотвращает переполнение */
`;

function App() {
  return (
    <LogProvider>
      <SocketProvider>
        <AppContainer>
          <Header>
            <h1>Activity Feed</h1>
          </Header>
          
          <Container>
            <LeftColumn>
              <AddPostForm />
              <Feed />
            </LeftColumn>
            <Logs />
          </Container>
        </AppContainer>
      </SocketProvider>
    </LogProvider>
  );
}

export default App;