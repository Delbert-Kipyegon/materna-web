import Layout from '../../components/Layout';
import ChatInterface from '../../../components/ChatInterface';

const ChatPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 lg:py-16">
        <h1 className="text-3xl lg:text-5xl font-bold text-primary-900 mb-6 text-center">
          Chat with Materna AI
        </h1>
        <ChatInterface />
      </div>
    </Layout>
  );
};

export default ChatPage;
