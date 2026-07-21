import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string; products?: any[] }[]>([
    {
      role: 'ai',
      content: "Hi! I'm AroundLaze AI — tell me what tech you need and I'll find the perfect match."
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    
    // Simulate AI response based on keywords
    setTimeout(() => {
      let response = "I can definitely help with that. What's your budget looking like?";
      let products: Array<{ name: string; price: string; pros: string; cons: string }> | undefined;
      
      const lowerInput = userMessage.toLowerCase();
      if (lowerInput.includes('keyboard')) {
        response = "For keyboards, it depends if you want mechanical for gaming or something quieter for productivity. Here are my top picks:";
        products = [
          { name: "Logitech MX Keys S", price: "$100-$160", pros: "Quiet, great battery", cons: "Not for serious gaming" },
          { name: "Keychron K8 Pro", price: "$80-$130", pros: "Customizable, mechanical", cons: "A bit bulky" }
        ];
      } else if (lowerInput.includes('mouse') || lowerInput.includes('mice')) {
        response = "A good mouse changes everything. These are the best right now:";
        products = [
          { name: "Logitech G Pro X Superlight 2", price: "$140-$180", pros: "Ultra-light, flawless sensor", cons: "Expensive" }
        ];
      } else if (lowerInput.includes('budget') || lowerInput.includes('cheap')) {
        response = "Budget doesn't have to mean bad quality. I'd recommend checking out options that prioritize value over flashy features.";
      } else if (lowerInput.includes('gaming')) {
        response = "Gaming gear needs low latency and reliability. What specific component are you looking to upgrade?";
      }

      setMessages(prev => [...prev, { role: 'ai', content: response, products }]);
    }, 1000);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-[0_0_20px_rgba(79,140,255,0.5)] z-50 overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div 
          className="absolute inset-0 border-2 border-white/30 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <MessageSquare size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[70vh] bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">AroundLaze AI</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                      <Bot size={14} />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-white/5 border border-white/10 rounded-tl-sm text-foreground'
                  }`}>
                    <p>{msg.content}</p>
                    
                    {msg.products && (
                      <div className="mt-3 space-y-2">
                        {msg.products.map((p, idx) => (
                          <div key={idx} className="bg-black/40 border border-white/10 rounded p-2 text-xs">
                            <div className="font-bold text-primary">{p.name}</div>
                            <div className="text-muted-foreground">{p.price}</div>
                            <div className="mt-1 flex flex-col gap-0.5">
                              <span className="text-green-400">✓ {p.pros}</span>
                              <span className="text-red-400">✗ {p.cons}</span>
                            </div>
                            <a href="/products" className="inline-block mt-2 text-primary hover:underline">View Deal →</a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-white mt-1">
                      <User size={14} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 bg-black/20">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-primary/50 focus-within:bg-white/10 transition-colors"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for a recommendation..."
                  className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="text-primary hover:text-primary/80 disabled:opacity-50 disabled:hover:text-primary transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
