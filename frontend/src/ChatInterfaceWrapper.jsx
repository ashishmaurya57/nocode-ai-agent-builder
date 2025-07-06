import { useParams } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';

const ChatInterfaceWrapper = () => {
  const { id } = useParams();
  return <ChatInterface agentId={id} />;
};

export default ChatInterfaceWrapper;
