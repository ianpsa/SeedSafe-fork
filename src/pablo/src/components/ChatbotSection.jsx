import React, { useState, useRef } from 'react';
import { MessageSquare, GraduationCap, Handshake, HelpCircle, Send } from 'lucide-react';

const ChatMessage = ({ content, sender, isTyping }) => {
  if (isTyping) {
    return (
      <div className="bg-green-600 border-l-4 border-amber-500 rounded-md p-3 max-w-[80%] self-start flex gap-1 items-center">
        {[0, 0.2, 0.4].map(delay => (
          <span
            key={delay}
            className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    );
  }

  const classes = sender === 'bot'
    ? 'bg-green-600 border-l-4 border-amber-500 self-start text-green-50'
    : 'bg-amber-500 text-white self-end';
  return <div className={`${classes} rounded-md p-3 max-w-[80%] shadow-sm`}>{content}</div>;
};

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { content: 'Olá! Eu sou o AgroBot, assistente da SafeSeed. Como posso ajudar?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    // Adicionar mensagem do usuário
    setMessages(m => [...m, { content: text, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    // Simular resposta do bot após breve pausa
    setTimeout(() => {
      let reply = "Obrigado por sua mensagem. Neste momento, o AgroBot está em manutenção, mas logo teremos respostas automatizadas sobre tokenização de colheitas, sustentabilidade e agricultura. Um de nossos especialistas entrará em contato em breve.";
      
      // Adicionar resposta do bot
      setIsTyping(false);
      setMessages(m => [...m, { content: reply, sender: 'bot' }]);
      
      // Rolar para o final da conversa
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="bg-green-700 rounded-lg shadow-xl overflow-hidden h-[420px] border border-green-600 flex flex-col">
      <div className="bg-green-600 text-white p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white">
          <MessageSquare className="h-5 w-5" />
        </div>
        <h4 className="font-bold text-green-50">AgroBot</h4>
      </div>
      <div className="flex-grow p-3 overflow-y-auto flex flex-col gap-3 bg-green-800">
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
        {isTyping && <ChatMessage isTyping={true} sender="bot" />}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex p-2 border-t border-green-600 bg-green-700">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Digite sua pergunta..."
          className="flex-grow p-3 border border-green-600 bg-green-800 text-green-50 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-green-300"
        />
        <button type="submit" className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors">
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

const ChatbotSection = () => (
  <section className="py-12 bg-green-700">
    <div className="max-w-screen-xl mx-auto px-4 flex flex-wrap gap-12 items-center">
      <div className="flex-1 min-w-[300px]">
        <h2 className="text-3xl font-bold mb-4 text-green-50">
          Dúvidas? <span className="text-amber-400">Nosso assistente virtual pode ajudar</span>
        </h2>
        <p className="mb-6 text-green-100">
          Conheça o AgroBot, nosso chatbot educacional que irá guiá-lo pelo mundo do blockchain, tokens e agricultura sustentável.
        </p>
        <ul className="mb-6 space-y-3">
          <li className="flex items-center gap-2 text-green-100">
            <GraduationCap className="h-5 w-5 text-amber-400" /> Aprenda sobre Web3 e tokenização
          </li>
          <li className="flex items-center gap-2 text-green-100">
            <Handshake className="h-5 w-5 text-amber-400" /> Suporte para iniciantes
          </li>
          <li className="flex items-center gap-2 text-green-100">
            <HelpCircle className="h-5 w-5 text-amber-400" /> Obtenha respostas sobre o processo
          </li>
        </ul>
        <button className="py-3 px-6 rounded-md font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all">
          Converse com o AgroBot
        </button>
      </div>
      <div className="flex-1 min-w-[350px]">
        <ChatWindow />
      </div>
    </div>
  </section>
);

export default ChatbotSection;