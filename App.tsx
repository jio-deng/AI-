
import React, { useState, useRef, useEffect } from 'react';
import { Send, Trophy, XCircle, ChevronLeft, Briefcase, Gavel, Car, ShieldAlert, Loader2, UserCircle2, Play, ArrowLeft } from 'lucide-react';
import MessageList from './components/MessageList';
import StatusPanel from './components/StatusPanel';
import { generateTurn } from './services/geminiService';
import { SCENARIOS } from './constants';
import { Scenario, Message, GameStatus, Persona } from './types';

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

// Helper to get static classes based on theme color to avoid dynamic Tailwind interpolation issues
const getThemeStyles = (color: string) => {
  const styles: Record<string, { text: string, ringHover: string, iconOpacity: string }> = {
    blue: { 
      text: 'text-blue-400', 
      ringHover: 'group-hover:ring-blue-500/50',
      iconOpacity: 'text-blue-400'
    },
    yellow: { 
      text: 'text-yellow-400', 
      ringHover: 'group-hover:ring-yellow-500/50',
      iconOpacity: 'text-yellow-400'
    },
    slate: { 
      text: 'text-slate-400', 
      ringHover: 'group-hover:ring-slate-500/50',
      iconOpacity: 'text-slate-400'
    },
    red: { 
      text: 'text-red-400', 
      ringHover: 'group-hover:ring-red-500/50',
      iconOpacity: 'text-red-400'
    }
  };
  return styles[color] || styles.blue;
};

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Step 1: Select Scenario
  const selectScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setStatus(GameStatus.PERSONA_SELECT);
  };

  // Step 2: Start Game with Persona
  const startGame = (persona: Persona) => {
    if (!activeScenario) return;
    setActivePersona(persona);
    setCurrentScore(activeScenario.baseScore);
    setMessages([
      {
        id: 'init',
        role: 'ai',
        content: persona.initialMessage,
        mood: 'Neutral'
      }
    ]);
    setStatus(GameStatus.PLAYING);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeScenario || !activePersona || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    // Call AI Service
    const newHistory = [...messages, userMsg];
    const result = await generateTurn(activeScenario, activePersona, newHistory, currentScore);

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
      if (newScore >= activeScenario.winningScore) {
        setStatus(GameStatus.WON);
      } else {
        setStatus(GameStatus.LOST);
      }
    }
    
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetToMenu = () => {
    setStatus(GameStatus.MENU);
    setActiveScenario(null);
    setActivePersona(null);
  };
  
  const quitGame = () => {
    // Return to Persona Select screen
    setStatus(GameStatus.PERSONA_SELECT);
    setMessages([]);
    setCurrentScore(0);
    setActivePersona(null);
  };

  // --- RENDER: MENU ---
  if (status === GameStatus.MENU) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="max-w-5xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
              AI 谈判竞技场
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              选择一个场景，挑战性格各异的 AI 对手。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENARIOS.map((scenario) => {
              const styles = getThemeStyles(scenario.themeColor);
              return (
                <button
                  key={scenario.id}
                  onClick={() => selectScenario(scenario)}
                  className="group relative flex flex-col items-start p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-2xl transition-all duration-300 text-left shadow-lg hover:shadow-indigo-500/10 overflow-hidden"
                >
                  {/* Hover border effect */}
                  <div className={`absolute inset-0 border-2 border-transparent ${styles.ringHover} rounded-2xl transition-colors pointer-events-none`}></div>

                  <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${styles.iconOpacity}`}>
                    {getIcon(scenario.iconName, 120)}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className={`p-2.5 rounded-lg bg-slate-900 ${styles.text} ring-1 ring-slate-700 transition-all`}>
                      {getIcon(scenario.iconName, 24)}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-900 text-slate-300`}>
                      {scenario.difficulty === 'Easy' ? '简单' : scenario.difficulty === 'Medium' ? '中等' : scenario.difficulty === 'Hard' ? '困难' : '极难'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors relative z-10">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4 relative z-10">
                    {scenario.description}
                  </p>

                  <div className="mt-auto w-full flex items-center justify-between text-xs font-medium text-slate-500 pt-4 border-t border-slate-700/50 relative z-10">
                    <span>{scenario.personas.length} 位对手</span>
                    <span>{scenario.turnLimit} 回合</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: PERSONA SELECT ---
  if (status === GameStatus.PERSONA_SELECT && activeScenario) {
    const styles = getThemeStyles(activeScenario.themeColor);
    
    return (
       <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex flex-col items-center justify-center">
         <div className="max-w-4xl w-full space-y-6">
           <button 
             onClick={resetToMenu}
             className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
           >
             <ArrowLeft size={20} /> 返回场景选择
           </button>

           <div className="text-center mb-8">
             <div className={`inline-block p-3 rounded-xl bg-slate-800/50 ${styles.text} mb-4`}>
               {getIcon(activeScenario.iconName, 48)}
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">选择你的对手</h2>
             <p className="text-slate-400">在 <span className="text-indigo-400 font-medium">{activeScenario.title}</span> 场景中，你想挑战谁？</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {activeScenario.personas.map((persona) => (
               <div 
                 key={persona.id}
                 className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col hover:border-indigo-500/50 transition-all shadow-lg"
               >
                 <div className="w-14 h-14 bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-400 mb-4 mx-auto">
                   <UserCircle2 size={32} />
                 </div>
                 <h3 className="text-lg font-bold text-white text-center mb-2">{persona.name}</h3>
                 <p className="text-xs text-slate-400 text-center mb-6 flex-1 leading-relaxed">
                   {persona.description}
                 </p>
                 <button
                   onClick={() => startGame(persona)}
                   className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                 >
                   <Play size={16} /> 开始挑战
                 </button>
               </div>
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
      {activeScenario && activePersona && (
        <StatusPanel 
          scenario={activeScenario} 
          currentScore={currentScore}
          turnsUsed={messages.filter(m => m.role === 'user').length}
          onBack={quitGame}
        />
      )}

      {/* Chat Area */}
      {activeScenario && activePersona && (
        <MessageList 
          messages={messages} 
          userRole={activeScenario.userRole}
          aiRole={activePersona.name}
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
      {(status === GameStatus.WON || status === GameStatus.LOST) && activeScenario && activePersona && (
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
                ? `你成功说服了 ${activePersona.name}!` 
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
              onClick={quitGame}
              className="w-full bg-white text-slate-900 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} /> 返回角色选择
            </button>
            <button 
              onClick={resetToMenu}
              className="w-full mt-3 text-slate-400 font-medium py-2 rounded-xl hover:text-white transition-colors"
            >
               返回主菜单
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
