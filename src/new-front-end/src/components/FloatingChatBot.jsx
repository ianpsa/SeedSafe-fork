import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactDOM from 'react-dom';

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const GEMINI_CONTEXT = `
A complete, transparent and scalable Web3 solution for tokenization of future harvests...
`;

const ChatMessage = ({ content, sender, isTyping }) => {
  if (isTyping) {
    return (
      <div className="bg-white border-l-4 border-green-700 rounded-md p-3 max-w-[80%] self-start flex gap-1 items-center">
        {[0, 0.2, 0.4].map(delay => (
          <span
            key={delay}
            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    );
  }

  const classes = sender === 'bot'
    ? 'bg-white border-l-4 border-green-700 self-start'
    : 'bg-green-600 text-white self-end';
  return <div className={`${classes} rounded-md p-3 max-w-[80%] shadow-sm`}>{content}</div>;
};

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { content: 'Hello! I am AgroBot, SeedSafe\'s assistant. How can I help?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [portalContainer, setPortalContainer] = useState(null);

  // Criar um elemento DOM separado para o portal
  useEffect(() => {
    // Verificar se o elemento já existe para evitar duplicação
    let container = document.getElementById('chatbot-portal-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'chatbot-portal-container';
      
      // Estilo inline forçado do container para fixar na tela
      container.style.cssText = `
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 9999 !important;
        width: auto !important;
        height: auto !important;
        pointer-events: auto !important;
      `;
      
      document.body.appendChild(container);
    }
    
    setPortalContainer(container);
    
    // Limpar o elemento quando o componente for desmontado
    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Handle click outside to close chat
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    
    // Scroll only the chat container, not the whole page
    const container = messagesContainerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    // Add user message
    setMessages(m => [...m, { content: text, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    // Pause briefly to show typing
    setTimeout(async () => {
      let reply = null;

      // Call Gemini
      try {
        const res = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `${GEMINI_CONTEXT}, don't use any markdown elements, just plain text, Answer only about the SeedSafe platform that I presented here: ${text}`
        });
        reply = res.text;
      } catch (err) {
        console.error('Gemini error', err);
        reply = 'Sorry, an error occurred. Please try again in a moment.';
      }

      // add bot response
      setIsTyping(false);
      setMessages(m => [...m, { content: reply, sender: 'bot' }]);
    }, 800);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Função específica para fechar o chat
  const closeChat = (e) => {
    // Importante: parar a propagação do evento
    e.stopPropagation();
    setIsOpen(false);
  };

  // Conteúdo do chatbot
  const chatbotContent = (
    <>
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className="bg-white rounded-2xl shadow-xl overflow-hidden w-80 md:w-96 h-96 mb-4 border border-gray-200 flex flex-col absolute bottom-16 right-0"
          style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}
        >
          <div className="bg-green-700 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-700">
                <span className="text-base font-bold">A</span>
              </div>
              <h4 className="font-bold">AgroBot</h4>
            </div>
            <button 
              onClick={closeChat}
              className="text-white hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div 
            ref={messagesContainerRef}
            className="flex-grow p-3 overflow-y-auto flex flex-col gap-3 text-green-700"
          >
            {messages.map((msg, i) => (
              <ChatMessage key={i} {...msg} />
            ))}
            {isTyping && <ChatMessage isTyping={true} sender="bot" />}
          </div>
          <form onSubmit={handleSendMessage} className="flex p-2 border-t border-gray-200">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="flex-grow p-2 border border-gray-200 rounded-xl mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button 
              type="submit" 
              className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating chat button - Modificado para usar stopPropagation */}
      <button
        onClick={toggleChat}
        className="bg-green-700 hover:bg-green-800 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none relative"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  );

  // Renderizar usando ReactDOM Portal para anexar o chatbot diretamente ao body
  return portalContainer ? ReactDOM.createPortal(chatbotContent, portalContainer) : null;
};

export default FloatingChatbot;