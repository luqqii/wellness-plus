import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../services/api';

const MOCK_MESSAGES = [];

/**
 * useChat — AI chat state management
 */
export function useChat() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentSentiment, setCurrentSentiment] = useState('Neutral');
  const [hasStarted, setHasStarted] = useState(false);
  const fetchedRef = useRef(false);



  useEffect(() => {
    async function loadInitiation() {
      if (fetchedRef.current || messages.length > 0) return;
      fetchedRef.current = true;
      setIsTyping(true);

      try {
        const res = await api.get('/coach/insight');
        const insight = res.data?.data?.insight || res.data?.insight;
        if (insight) {
          setMessages([{
            id: 'init_' + Date.now(),
            role: 'ai',
            content: insight,
            timestamp: new Date()
          }]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsTyping(false);
        setHasStarted(true);
      }
    }
    loadInitiation();
    // eslint-disable-next-line
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(p => [...p, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send the entire context history for AI to understand conversation
      const history = [...messages, userMsg];
      
      const res = await api.post('/coach/chat', {
        message: text,
        contextHistory: history,
      });

      const aiMsg = res.data?.data || res.data;
      if (aiMsg) {
        if (aiMsg.sentiment) {
          setCurrentSentiment(aiMsg.sentiment.charAt(0).toUpperCase() + aiMsg.sentiment.slice(1));
        }
        setMessages(p => [...p, { ...aiMsg, id: Date.now() + 1 }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(p => [...p, {
        id: Date.now() + 1,
        role: 'ai',
        content: "I'm having trouble connecting to my servers right now. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages(MOCK_MESSAGES);
  }, []);

  return {
    messages: hasStarted ? messages : [],
    isTyping,
    inputValue,
    setInputValue,
    currentSentiment,
    sendMessage,
    clearChat,
    hasStarted
  };
}

export default useChat;
