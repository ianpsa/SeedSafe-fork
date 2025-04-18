import React, { useState, useRef, useEffect } from 'react';

const ChatMessage = ({ content, sender, isTyping }) => {
  if (isTyping) {
    return (
      <div className="bg-white border-l-4 border-green-700 rounded-md p-3 max-w-[80%] self-start flex gap-1 items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
      </div>
    );
  }
  
  return (
    <div className={`${
      sender === 'bot' 
        ? 'bg-white border-l-4 border-green-700 self-start' 
        : 'bg-green-600 text-white self-end'
    } rounded-md p-3 max-w-[80%] shadow-sm`}>
      {content}
    </div>
  );
};

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { content: "Olá! Sou o AgroBot, assistente da SeedSafe. Como posso ajudar você hoje?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Bot responses dictionary
  const botResponses = {
    default: "Desculpe, ainda não tenho uma resposta para isso. Pode reformular sua pergunta ou perguntar sobre tokens de safra, créditos de carbono, wallets ou investimentos?",
    greeting: "Olá! Sou o AgroBot, assistente da SeedSafe. Como posso ajudar você hoje?",
    token: "Os tokens de safra futura são ativos digitais (ERC-1155) que representam uma parte da produção agrícola que ainda será colhida. Por exemplo, você pode comprar tokens que representam 10kg de café que serão entregues após a colheita!",
    carbon: "Os tokens de crédito de carbono (TCO₂) representam uma tonelada de CO₂ que deixou de ser emitida ou foi sequestrada da atmosfera. Produtores rurais que adotam práticas sustentáveis podem gerar esses créditos e vendê-los como renda extra.",
    wallet: "Uma wallet (carteira digital) é onde você guarda seus ativos digitais como tokens e NFTs. Na SeedSafe, oferecemos uma Smart Account que não exige conhecimento técnico e funciona sem taxas de gás graças à tecnologia Account Abstraction.",
    invest: "Para investir, você precisa conectar sua wallet, explorar as safras disponíveis no marketplace e escolher qual deseja apoiar. Você receberá tokens ERC-1155 que representam sua participação na colheita futura.",
    gasless: "Nossa plataforma é totalmente sem taxas (gasless) graças à tecnologia de Account Abstraction e Paymaster da NERO Chain. Isso permite que produtores rurais utilizem a plataforma sem precisar ter criptomoedas previamente."
  };
  
  // Keywords mapping
  const keywords = {
    token: ["token", "safra", "futura", "erc-1155", "erc1155", "tokenização"],
    carbon: ["carbon", "carbono", "tco2", "tco₂", "crédito", "ambiental", "verde"],
    wallet: ["wallet", "carteira", "conta", "smart account", "conectar"],
    invest: ["invest", "investir", "comprar", "adquirir", "apoiar"],
    gasless: ["gas", "taxa", "tarifa", "custo", "gratuito", "sem taxa", "gasless"]
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (inputValue.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, { content: inputValue, sender: 'user' }]);
    setInputValue('');
    
    // Show bot typing indicator
    setIsTyping(true);
    
    // Determine response based on keywords
    setTimeout(() => {
      const userMessage = inputValue.toLowerCase();
      let response = botResponses.default;
      
      // Check for greetings
      if (userMessage.includes('olá') || 
          userMessage.includes('oi') || 
          userMessage.includes('bom dia') || 
          userMessage.includes('boa tarde') || 
          userMessage.includes('boa noite')) {
        response = botResponses.greeting;
      } 
      // Check for keywords
      else {
        for (const [key, values] of Object.entries(keywords)) {
          if (values.some(word => userMessage.includes(word))) {
            response = botResponses[key];
            break;
          }
        }
      }
      
      // Hide typing indicator and add bot response
      setIsTyping(false);
      setMessages(prev => [...prev, { content: response, sender: 'bot' }]);
    }, 1500);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden h-[500px] border border-gray-200 flex flex-col">
      <div className="bg-green-700 text-white p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700">
          <i className="fas fa-robot"></i>
        </div>
        <h4 className="font-bold">AgroBot</h4>
      </div>
      
      <div className="flex-grow p-3 overflow-y-auto flex flex-col gap-3 bg-gray-50">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            content={message.content} 
            sender={message.sender} 
          />
        ))}
        {isTyping && <ChatMessage isTyping={true} sender="bot" />}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="flex p-2 border-t border-gray-200">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite sua pergunta..."
          className="flex-grow p-3 border border-gray-200 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          type="submit"
          className="w-10 h-10 rounded-full bg-green-700 text-white border-none flex items-center justify-center"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

const ChatbotFeature = () => {
  return (
    <section className="py-12 px-8 bg-white">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-12 items-center">
        <div className="flex-1 min-w-[300px]">
          <h2 className="text-3xl font-bold mb-4">
            Dúvidas? <span className="text-green-700">Nosso assistente virtual pode ajudar</span>
          </h2>
          <p className="mb-6">
            Conheça o AgroBot, nosso chatbot educacional que vai te guiar pelo mundo da blockchain, tokens e agricultura sustentável.
          </p>
          <ul className="mb-6">
            <li className="mb-2 flex items-center gap-2">
              <i className="fas fa-graduation-cap text-green-700"></i>
              Aprenda sobre Web3 e tokenização
            </li>
            <li className="mb-2 flex items-center gap-2">
              <i className="fas fa-hands-helping text-green-700"></i>
              Suporte para onboarding
            </li>
            <li className="mb-2 flex items-center gap-2">
              <i className="fas fa-question-circle text-green-700"></i>
              Tire dúvidas sobre o processo
            </li>
          </ul>
          <button className="py-3 px-6 rounded-md font-semibold bg-amber-600 text-white hover:bg-amber-700 hover:-translate-y-0.5 transition-all">
            Conversar com AgroBot
          </button>
        </div>
        
        <div className="flex-1 min-w-[350px]">
          <ChatWindow />
        </div>
      </div>
    </section>
  );
};

export default ChatbotFeature;