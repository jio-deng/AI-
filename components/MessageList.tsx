import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { User, Bot, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  userRole: string;
  aiRole: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, userRole, aiRole }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={msg.id}
            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isUser ? 'bg-emerald-600' : 'bg-indigo-600'
              }`}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div className={`relative p-4 rounded-2xl shadow-md ${
                isUser 
                  ? 'bg-emerald-900/40 border border-emerald-700/50 text-emerald-50 rounded-br-none' 
                  : 'bg-slate-800/80 border border-slate-700 text-slate-100 rounded-bl-none'
              }`}>
                
                {/* Role Label */}
                <div className={`text-xs font-bold mb-1 opacity-70 ${isUser ? 'text-emerald-300' : 'text-indigo-300'}`}>
                  {isUser ? userRole : aiRole}
                </div>

                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* Score Indicator for AI messages */}
                {!isUser && msg.scoreDelta !== undefined && (
                   <div className={`absolute -top-3 -right-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border ${
                     msg.scoreDelta > 0 
                      ? 'bg-green-900 text-green-300 border-green-700' 
                      : msg.scoreDelta < 0 
                        ? 'bg-red-900 text-red-300 border-red-700'
                        : 'bg-gray-700 text-gray-300 border-gray-600'
                   }`}>
                     {msg.scoreDelta > 0 ? <TrendingUp size={12}/> : msg.scoreDelta < 0 ? <TrendingDown size={12}/> : <Minus size={12}/>}
                     {msg.scoreDelta > 0 ? '+' : ''}{msg.scoreDelta}
                   </div>
                )}
                
                {/* Mood Indicator */}
                {!isUser && msg.mood && (
                  <div className="mt-2 text-xs italic text-indigo-400 flex items-center gap-1">
                     Status: <span className="opacity-90">{msg.mood}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
