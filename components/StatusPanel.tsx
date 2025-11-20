import React from 'react';
import { Scenario } from '../types';
import { Hourglass } from 'lucide-react';

interface StatusPanelProps {
  scenario: Scenario;
  currentScore: number;
  turnsUsed: number;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ scenario, currentScore, turnsUsed }) => {
  const turnsLeft = scenario.turnLimit - turnsUsed;
  
  // Color gradient for score
  let scoreColor = "text-red-500";
  let barColor = "bg-red-500";
  
  if (currentScore >= scenario.winningScore) {
    scoreColor = "text-emerald-400";
    barColor = "bg-emerald-400";
  } else if (currentScore > scenario.winningScore * 0.6) {
    scoreColor = "text-yellow-400";
    barColor = "bg-yellow-400";
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-10 shadow-xl">
      
      {/* Scenario Info */}
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-white truncate max-w-[200px]">{scenario.title}</h2>
        <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
              ${scenario.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : 
                scenario.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 
                'bg-red-900 text-red-300'}`}>
              {scenario.difficulty === 'Easy' ? '简单' : scenario.difficulty === 'Medium' ? '中等' : scenario.difficulty === 'Hard' ? '困难' : '极难'}
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="flex items-center gap-6">
        
        {/* Turn Counter */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-slate-400 text-xs uppercase font-bold tracking-wide mb-1">
            <Hourglass size={12} /> 剩余回合
          </div>
          <div className={`text-xl font-mono font-bold ${turnsLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {turnsLeft}
          </div>
        </div>

        {/* Persuasion Meter */}
        <div className="flex flex-col w-32 md:w-48">
          <div className="flex justify-between text-xs mb-1 text-slate-400 font-medium">
             <span>说服力</span>
             <span className={scoreColor}>{currentScore}/100</span>
          </div>
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
             {/* Progress Bar */}
             <div 
               className={`h-full transition-all duration-500 ease-out ${barColor}`} 
               style={{ width: `${Math.min(100, Math.max(0, currentScore))}%` }}
             />
             
             {/* Goal Marker Line */}
             <div 
               className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] z-10"
               style={{ left: `${scenario.winningScore}%` }}
             />
          </div>
          <div className="flex justify-end">
             <span className="text-[10px] text-slate-500 mt-0.5">目标: {scenario.winningScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;