import React, { useState, useRef, useEffect } from 'react';
import { Send, Trophy, XCircle, ChevronLeft, Briefcase, Gavel, Car, ShieldAlert, Loader2 } from 'lucide-react';
import MessageList from './components/MessageList';
import StatusPanel from './components/StatusPanel';
import { generateTurn } from './services/geminiService';
import { SCENARIOS } from './constants';
import { Scenario, Message, GameStatus } from './types';

// Icon mapping helper
const getIcon = (name: string, size: number = 24) => {
  switch (name) {
    case 'Briefcase': return <Briefcase size={size} />;
    case 'Car': return <Car size={size} />;
    case 'Gavel': return <Gavel size={size} />;
    case 'ShieldAlert': return <ShieldAlert size={size} />;
    default: return <Briefcase size={size} />;
  }
};

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Start a specific scenario
  const startGame = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setCurrentScore(scenario.baseScore);
    setMessages([
      {
        id: 'init',
        role: 'ai',
        content: scenario.initialMessage,
        mood: 'Neutral'
      }
    ]);
    setStatus(GameStatus.PLAYING);
    // Focus input after a short delay to allow render
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeScenario || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    // Call AI Service
    // We pass the new message history to the AI
    const newHistory = [...messages, userMsg];
    const result = await generateTurn(activeScenario, newHistory, currentScore);

    // Update Score
    const newScore = Math.min(100, Math.max(0, currentScore + (result.scoreDelta || 0)));
    setCurrentScore(newScore);

    // Add AI Response
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: result.text,
      mood: result.aiMood,
      scoreDelta: result.scoreDelta
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsProcessing(false);

    // Check Game Over Conditions
    if (result.isWin || newScore >= activeScenario.winningScore) {
      setStatus(GameStatus.WON);
    } else if (result.isGameOver || (newHistory.filter(m => m.role === 'user').length >= activeScenario.turnLimit)) {
      // Double check if score was enough at the very end
      if (newScore >= activeScenario.winningScore) {
        setStatus(GameStatus.WON);
      } else {
        setStatus(GameStatus.LOST);
      }
    }
    
    // Re-focus input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- RENDER: MENU ---
  if (status === GameStatus.MENU) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
              AI 谈判竞技场
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              测试你与高级 AI 谈判的说服技巧。选择你的场景，在博弈中争取胜利。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => startGame(scenario)}
                className="group relative flex flex-col items-start p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 text-left shadow-lg hover:shadow-indigo-500/10 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-${scenario.themeColor}-400`}>
                  {getIcon(scenario.iconName, 120)}
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-lg bg-slate-900 text-${scenario.themeColor}-400 ring-1 ring-slate-700 group-hover:ring-${scenario.themeColor}-500/50 transition-all`}>
                    {getIcon(scenario.iconName, 24)}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-900 text-slate-300`}>
                    {scenario.difficulty === 'Easy' ? '简单' : scenario.difficulty === 'Medium' ? '中等' : scenario.difficulty === 'Hard' ? '困难' : '极难'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {scenario.description}
                </p>

                <div className="mt-auto w-full flex items-center justify-between text-xs font-medium text-slate-500 pt-4 border-t border-slate-700/50">
                  <span>目标: {scenario.winningScore} 分</span>
                  <span>{scenario.turnLimit} 回合</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: GAME & RESULTS ---
  return (
    <div className="fixed inset-0 flex flex-col bg-[#0f172a]">
      {/* Status HUD */}
      {activeScenario && (
        <StatusPanel 
          scenario={activeScenario} 
          currentScore={currentScore}
          turnsUsed={messages.filter(m => m.role === 'user').length}
        />
      )}

      {/* Chat Area */}
      {activeScenario && (
        <MessageList 
          messages={messages} 
          userRole={activeScenario.userRole}
          aiRole={activeScenario.aiRole}
        />
      )}

      {/* Input Area (Hidden if Game Over) */}
      {(status === GameStatus.PLAYING) && (
        <div className="bg-slate-900 p-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto relative flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="在此输入你的论点..."
              disabled={isProcessing}
              className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50"
              autoComplete="off"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            </button>
          </div>
        </div>
      )}

      {/* Result Overlay */}
      {(status === GameStatus.WON || status === GameStatus.LOST) && activeScenario && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
            
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              status === GameStatus.WON ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'
            }`}>
              {status === GameStatus.WON ? <Trophy size={40} /> : <XCircle size={40} />}
            </div>

            <h2 className="text-3xl font-black text-white mb-2">
              {status === GameStatus.WON ? '谈判成功！' : '谈判失败'}
            </h2>
            
            <p className="text-slate-400 mb-8">
              {status === GameStatus.WON 
                ? `你成功说服了 ${activeScenario.aiRole}!` 
                : `你未能在规定时间内达到 ${activeScenario.winningScore} 分的目标。`}
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm mb-8 bg-slate-900/50 py-4 rounded-xl">
               <div className="flex flex-col">
                 <span className="text-slate-500 uppercase text-[10px] font-bold">最终得分</span>
                 <span className={`text-xl font-bold ${status === GameStatus.WON ? 'text-emerald-400' : 'text-red-400'}`}>
                   {currentScore}
                 </span>
               </div>
               <div className="w-px h-8 bg-slate-700"></div>
               <div className="flex flex-col">
                 <span className="text-slate-500 uppercase text-[10px] font-bold">目标</span>
                 <span className="text-xl font-bold text-slate-300">{activeScenario.winningScore}</span>
               </div>
            </div>

            <button 
              onClick={() => setStatus(GameStatus.MENU)}
              className="w-full bg-white text-slate-900 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} /> 返回主菜单
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;