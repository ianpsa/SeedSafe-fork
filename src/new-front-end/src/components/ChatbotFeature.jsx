import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const GEMINI_CONTEXT = `
A complete, transparent and scalable Web3 solution for tokenization of future harvests, carbon credit issuance, and decentralized financing for small producers built on the NERO Chain with Account Abstraction and Paymaster support that offers a 100% gasless experience for the end user oriented towards social, economic, and environmental impact. The platform allows producers to create their Smart Account without technical knowledge or gas payment to register future harvests defining type, quantity, delivery date, and price, notifying the auditor who validates sustainable practices and simultaneously authorizes the issuance of an ERC-1155 token for the harvest and an ERC-20 token for carbon credits. Next, the producer lists the harvest on the marketplace and receives funds for each sale, while the auditor logs in with AUDITOR_ROLE to analyze practices, call authorizeHarvest, and release token minting. The investor accesses gasless via Smart Account, buys harvest tokens in the marketplace, receives a ComboNFT with harvest and carbon metadata, and monitors the status of total, partial, or total failure delivery with automatic reimbursement via guarantee fund or debt NFT issuance. The management team defines the global fee in the CustomPaymaster to keep the Paymaster funded, manages onboarding with educational chatbot and Web2-like UX, and ensures fee transparency. The system includes smart contracts such as FutureHarvestToken.sol (ERC-1155), TCO2Token.sol (ERC-20), CarbonVerifier.sol, Marketplace.sol, GuaranteeFund.sol, ComboNFT.sol (ERC-721), Reputation.sol, and CustomPaymaster.sol, plus Smart Accounts, custom Paymaster, front-end in React with Tailwind and Vite, integration via Ethers.js, and metadata storage in IPFS and nft.storage. This integrated flow on the NERO Chain ensures complete traceability and ESG impact, covering scenarios of total, partial, total loss delivery, or rewards for sustainable practices, making the solution modular, scalable, and socially conscious with gasless experience for mass adoption.
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

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { content: 'Hello! I am AgroBot, SeedSafe\'s assistant. How can I help?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  const keywords = {
    token: ['token', 'harvest', 'future', 'erc-1155', 'erc1155', 'tokenization'],
    carbon: ['carbon', 'tco2', 'tco₂', 'credit', 'environmental', 'green'],
    wallet: ['wallet', 'smart account', 'connect'],
    invest: ['invest', 'buy', 'acquire', 'support'],
    gasless: ['gas', 'fee', 'free', 'no fee', 'gasless']
  };

  // Improved scroll behavior
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
      const lower = text.toLowerCase();
      let reply = null;

      // if no keyword, call Gemini
      if (!reply) {
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
      }

      // add bot response
      setIsTyping(false);
      setMessages(m => [...m, { content: reply, sender: 'bot' }]);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[500px] border border-gray-200 flex flex-col">
      <div className="bg-green-700 text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700">
          <span className="text-xl font-bold">A</span>
        </div>
        <h4 className="font-bold text-lg">AgroBot</h4>
      </div>
      <div 
        ref={messagesContainerRef}
        className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 text-green-700"
      >
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
        {isTyping && <ChatMessage isTyping={true} sender="bot" />}
      </div>
      <form onSubmit={handleSendMessage} className="flex p-3 border-t border-gray-200">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type your question..."
          className="flex-grow p-3 border border-gray-200 rounded-2xl mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          type="submit" 
          className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </div>
  );
};

const ChatbotFeature = () => (
  <section className="py-12 px-8 bg-green-700 rounded-2xl">
    <div className="max-w-6xl mx-auto flex flex-wrap gap-12 items-center">
      <div className="flex-1 min-w-[300px]">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Questions? Our virtual assistant can help
        </h2>
        <p className="mb-6 text-green-50">
          Meet AgroBot, our educational chatbot that will guide you through the world of blockchain, tokens, and sustainable agriculture.
        </p>
        <ul className="mb-6 text-green-50">
          <li className="mb-2 flex items-center gap-2">
            <span className="bg-amber-400 text-green-700 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </span>
            Learn about Web3 and tokenization
          </li>
          <li className="mb-2 flex items-center gap-2">
            <span className="bg-amber-400 text-green-700 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </span>
            Support for onboarding
          </li>
          <li className="mb-2 flex items-center gap-2">
            <span className="bg-amber-400 text-green-700 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </span>
            Get answers about the process
          </li>
        </ul>
        
      </div>
      <div className="flex-1 min-w-[350px]">
        <ChatWindow />
      </div>
    </div>
  </section>
);

export default ChatbotFeature;