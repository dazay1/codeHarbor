import React, { useState } from 'react';
import { 
  Trophy, 
  User, 
  Settings, 
  MapPin, 
  Heart, 
  Zap, 
  Flame, 
  X, 
  Check, 
  Shield, 
  Star, 
  Award, 
  RefreshCw,
} from 'lucide-react';
import background from '../assets/background.jpg'
// High quality bazaar background image
export default function About() {
  const [activeTab, setActiveTab] = useState('path'); // 'path', 'exercise', 'rankings', 'settings'
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(1250);
  const [streak, setStreak] = useState(5);
  
  // Exercise state
  const [editorTab, setEditorTab] = useState('editor'); // 'editor' or 'view'
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [exerciseStatus, setExerciseStatus] = useState('idle'); // 'idle', 'success', 'error'

  const options = [
    { id: 'opt1', text: 'display: block;' },
    { id: 'opt2', text: 'text-align: center;' },
    { id: 'opt3', text: 'justify-content: center;' },
    { id: 'opt4', text: 'margin: auto;' }
  ];

  const handleChipClick = (optionText) => {
    if (!slot1) {
      setSlot1(optionText);
    } else if (!slot2 && slot1 !== optionText) {
      setSlot2(optionText);
    }
  };

  const handleClearSlot = (slotNum) => {
    if (slotNum === 1) setSlot1(null);
    if (slotNum === 2) setSlot2(null);
    setExerciseStatus('idle');
  };

  const handleCheck = () => {
    if (slot1 === 'justify-content: center;' || slot2 === 'justify-content: center;') {
      setExerciseStatus('success');
      setXp(prev => prev + 200);
    } else {
      setExerciseStatus('error');
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleContinue = () => {
    setExerciseStatus('idle');
    setSlot1(null);
    setSlot2(null);
    setActiveTab('rankings');
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-2 sm:p-6 font-sans select-none overflow-hidden bg-slate-950">
      
      {/* Background Image Layer with subtle ambient overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url(${background}), linear-gradient(to bottom, #2b1a0d, #120904)` }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* Screen Mode Navigation Selector Bar */}
      <div className="relative z-30 mb-4 bg-amber-950/80 backdrop-blur-md border border-amber-500/40 rounded-full px-4 py-2 shadow-2xl flex items-center space-x-2 text-xs text-amber-100">
        <span className="font-black text-amber-400 mr-2 hidden sm:inline">VIEW SCREEN:</span>
        <button 
          onClick={() => setActiveTab('path')}
          className={`px-3 py-1.5 rounded-full font-extrabold transition-all ${
            activeTab === 'path' ? 'bg-[#74b638] text-white shadow-lg scale-105' : 'hover:bg-white/10 text-amber-200'
          }`}
        >
          1. Path Map
        </button>
        <button 
          onClick={() => setActiveTab('exercise')}
          className={`px-3 py-1.5 rounded-full font-extrabold transition-all ${
            activeTab === 'exercise' ? 'bg-[#74b638] text-white shadow-lg scale-105' : 'hover:bg-white/10 text-amber-200'
          }`}
        >
          2. Code Exercise
        </button>
        <button 
          onClick={() => setActiveTab('rankings')}
          className={`px-3 py-1.5 rounded-full font-extrabold transition-all ${
            activeTab === 'rankings' ? 'bg-[#74b638] text-white shadow-lg scale-105' : 'hover:bg-white/10 text-amber-200'
          }`}
        >
          3. Leaderboard
        </button>
      </div>

      {/* Mobile Device Frame Mockup */}
      <div className="relative z-20 w-full max-w-[390px] h-[780px] bg-[#faedd9]/95 backdrop-blur-md rounded-[48px] border-[8px] border-[#382618] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden my-auto">
        
        {/* Device Top Bar Notch */}
        <div className="h-7 bg-[#f7eedc] px-6 flex items-center justify-between text-xs text-amber-950 font-bold z-50 pt-1 border-b border-amber-900/10">
          <span>9:41</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-amber-900/60 rounded-sm p-[1px] flex items-center">
              <div className="w-full h-full bg-amber-900/80 rounded-[0.5px]"></div>
            </div>
          </div>
        </div>

        {/* Dynamic Screen View Content */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          {activeTab === 'path' && (
            <PathScreen onNodeClick={() => setActiveTab('exercise')} />
          )}

          {activeTab === 'exercise' && (
            <ExerciseScreen 
              hearts={hearts}
              xp={xp}
              streak={streak}
              editorTab={editorTab}
              setEditorTab={setEditorTab}
              slot1={slot1}
              slot2={slot2}
              options={options}
              exerciseStatus={exerciseStatus}
              handleChipClick={handleChipClick}
              handleClearSlot={handleClearSlot}
              handleCheck={handleCheck}
              handleContinue={handleContinue}
            />
          )}

          {(activeTab === 'rankings' || activeTab === 'profile') && (
            <LeaderboardScreen 
              xp={xp}
              onClose={() => setActiveTab('path')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen 
              hearts={hearts}
              xp={xp}
              streak={streak}
              onReset={() => {
                setXp(1250);
                setHearts(5);
                setStreak(5);
                setSlot1(null);
                setSlot2(null);
                setExerciseStatus('idle');
              }}
            />
          )}
        </div>

        {/* Bottom App Navigation Bar */}
        <div className="bg-[#fcf8f0] border-t-2 border-[#e6d8be] px-3 py-2 flex items-center justify-around z-40 shadow-lg">
          <button 
            onClick={() => setActiveTab('path')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl transition-all ${
              activeTab === 'path' 
                ? 'bg-[#e2f0d9] border-2 border-[#68a042] text-[#2c5314] font-black shadow-sm scale-105' 
                : 'text-amber-900/70 hover:bg-amber-100/50'
            }`}
          >
            <MapPin className={`w-5 h-5 ${activeTab === 'path' ? 'text-[#488022] fill-[#74b638]' : 'text-amber-800'}`} />
            <span className="text-[11px] font-bold mt-0.5">Path</span>
          </button>

          <button 
            onClick={() => setActiveTab('rankings')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl transition-all ${
              activeTab === 'rankings' 
                ? 'bg-[#e2f0d9] border-2 border-[#68a042] text-[#2c5314] font-black shadow-sm scale-105' 
                : 'text-amber-900/70 hover:bg-amber-100/50'
            }`}
          >
            <Trophy className={`w-5 h-5 ${activeTab === 'rankings' ? 'text-amber-500 fill-amber-400' : 'text-amber-800'}`} />
            <span className="text-[11px] font-bold mt-0.5">Rankings</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl transition-all ${
              activeTab === 'profile' 
                ? 'bg-[#e2f0d9] border-2 border-[#68a042] text-[#2c5314] font-black shadow-sm scale-105' 
                : 'text-amber-900/70 hover:bg-amber-100/50'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-[#488022]' : 'text-amber-800'}`} />
            <span className="text-[11px] font-bold mt-0.5">Profile</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl transition-all ${
              activeTab === 'settings' 
                ? 'bg-[#e2f0d9] border-2 border-[#68a042] text-[#2c5314] font-black shadow-sm scale-105' 
                : 'text-amber-900/70 hover:bg-amber-100/50'
            }`}
          >
            <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-[#488022]' : 'text-amber-800'}`} />
            <span className="text-[11px] font-bold mt-0.5">Settings</span>
          </button>
        </div>

        {/* Device Bottom Home Bar */}
        <div className="h-3 bg-[#fcf8f0] flex items-center justify-center pb-1">
          <div className="w-28 h-1 bg-amber-950/30 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}

function PathScreen({ onNodeClick }) {
  return (
    <div className="relative min-h-full bg-[#faedd9]/90 overflow-hidden flex flex-col items-center pb-10">
      {/* Background visual texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#b89762_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Top Section Banner */}
      <div className="w-full relative pt-3 px-4 flex flex-col items-center z-10">
        <div className="bg-[#f1e0c5] border-2 border-[#cbb189] rounded-3xl px-8 py-1.5 shadow-md relative flex flex-col items-center">
          <h1 className="text-2xl font-black text-[#3a2e1d] tracking-wider uppercase">Path</h1>
        </div>

        <div className="mt-3 bg-[#e8dbbf] border-2 border-[#bc9f75] rounded-xl px-5 py-1 shadow-inner text-center">
          <span className="text-[10px] font-extrabold text-[#5c4932] tracking-widest block uppercase">SECTION 1:</span>
          <span className="text-xs font-black text-[#2e2112] tracking-wide uppercase">BAZAAR FOUNDATIONS</span>
        </div>
      </div>

      {/* Interactive Path Map Graphic */}
      <div className="relative w-full max-w-[340px] h-[580px] mt-2">
        {/* Curved Path Vector Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 580" fill="none">
          <path d="M 210 70 Q 270 120 200 180 T 110 290 T 210 400 T 120 510" stroke="#c8aa7a" strokeWidth="34" strokeLinecap="round" fill="none" />
          <path d="M 210 70 Q 270 120 200 180 T 110 290 T 210 400 T 120 510" stroke="#f2dbb8" strokeWidth="24" strokeLinecap="round" fill="none" />
          <path d="M 210 70 Q 270 120 200 180 T 110 290 T 210 400 T 120 510" stroke="#c09f6b" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round" fill="none" />
        </svg>

        {/* Blue Dragon Mascot */}
        <div className="absolute top-[40px] left-[15px] w-20 h-24 z-20 animate-bounce [animation-duration:2.5s]">
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
            <path d="M30,80 Q20,60 30,40 Q50,10 70,30 Q90,50 80,80 Q70,100 40,95 Z" fill="#3b95d6" />
            <circle cx="65" cy="40" r="10" fill="white" />
            <circle cx="68" cy="40" r="4.5" fill="#0f172a" />
            <polygon points="40,25 48,15 50,30" fill="#2563eb" />
            <ellipse cx="50" cy="70" rx="14" ry="18" fill="#a8e2f0" />
          </svg>
        </div>

        {/* Level 1 - Shield */}
        <button onClick={onNodeClick} className="absolute top-[45px] left-[180px] z-30 group focus:outline-none transition-transform active:scale-95">
          <div className="w-16 h-16 rounded-full bg-[#52a42b] border-4 border-[#326918] shadow-[0_6px_0_#275313] flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-[#68be36] border-2 border-[#8be256] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white fill-white drop-shadow" />
            </div>
          </div>
          <span className="absolute -inset-1 rounded-full border-2 border-[#74cc38] animate-ping opacity-75 pointer-events-none"></span>
        </button>

        {/* Level 2 - Shield */}
        <button onClick={onNodeClick} className="absolute top-[140px] left-[165px] z-30 focus:outline-none transition-transform active:scale-95">
          <div className="w-14 h-14 rounded-full bg-[#52a42b] border-4 border-[#326918] shadow-[0_5px_0_#275313] flex items-center justify-center">
            <Shield className="w-6 h-6 text-white fill-white drop-shadow" />
          </div>
        </button>

        {/* Level 3 - Gold Coin */}
        <button onClick={onNodeClick} className="absolute top-[195px] left-[90px] z-30 focus:outline-none transition-transform active:scale-95">
          <div className="w-14 h-14 rounded-full bg-[#f3b21b] border-4 border-[#b47a06] shadow-[0_5px_0_#8c5e03] flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-900 fill-amber-800" />
          </div>
        </button>

        {/* Level 4 - XP Coin */}
        <button onClick={onNodeClick} className="absolute top-[260px] left-[145px] z-30 focus:outline-none transition-transform active:scale-95">
          <div className="w-14 h-14 rounded-full bg-[#f3b21b] border-4 border-[#b47a06] shadow-[0_5px_0_#8c5e03] flex items-center justify-center">
            <span className="text-amber-900 font-black text-xs">XP</span>
          </div>
        </button>

        {/* Level 5 - Purple Star */}
        <button onClick={onNodeClick} className="absolute top-[315px] left-[205px] z-30 focus:outline-none transition-transform active:scale-95">
          <div className="w-14 h-14 rounded-2xl rotate-12 bg-[#9352e9] border-4 border-[#5b27a3] shadow-[0_5px_0_#431a7c] flex items-center justify-center">
            <Star className="w-6 h-6 text-white fill-white drop-shadow" />
          </div>
        </button>

        {/* Level 6 - Shield */}
        <button onClick={onNodeClick} className="absolute top-[395px] left-[105px] z-30 focus:outline-none transition-transform active:scale-95">
          <div className="w-14 h-14 rounded-full bg-[#52a42b] border-4 border-[#326918] shadow-[0_5px_0_#275313] flex items-center justify-center">
            <Shield className="w-6 h-6 text-white fill-white drop-shadow" />
          </div>
        </button>

        {/* Level 7 - Star Badge */}
        <button onClick={onNodeClick} className="absolute top-[470px] left-[140px] z-30 focus:outline-none transition-transform active:scale-95">
          <div className="w-14 h-14 rounded-2xl -rotate-6 bg-[#9352e9] border-4 border-[#5b27a3] shadow-[0_5px_0_#431a7c] flex items-center justify-center">
            <Star className="w-6 h-6 text-white fill-white drop-shadow" />
          </div>
        </button>
      </div>
    </div>
  );
}

function ExerciseScreen({
  hearts,
  xp,
  streak,
  editorTab,
  setEditorTab,
  slot1,
  slot2,
  options,
  exerciseStatus,
  handleChipClick,
  handleClearSlot,
  handleCheck,
  handleContinue
}) {
  return (
    <div className="relative min-h-full bg-[#faedd9]/90 flex flex-col justify-between p-4 pb-4 overflow-x-hidden">
      
      {/* Exercise Header Statistics */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center space-x-1">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500 drop-shadow-sm" />
          <span className="text-base font-black text-rose-600">{hearts}</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#f5e4c3] px-3 py-1 rounded-full border border-[#d2b88a] shadow-sm">
          <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center font-black text-[10px] text-amber-950">
            XP
          </div>
          <span className="text-xs font-black text-amber-950">{xp} XP</span>
        </div>

        <div className="flex items-center space-x-1">
          <Flame className="w-6 h-6 text-orange-500 fill-orange-500 drop-shadow-sm" />
          <span className="text-base font-black text-orange-600">{streak}</span>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="my-1">
        <div className="relative w-full h-3 bg-[#e2ceab] rounded-full overflow-hidden border border-[#c5a87b] p-[1px]">
          <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full w-[80%]"></div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[11px] font-extrabold text-amber-950/80">Progressive daily target 421 XP</span>
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        </div>
      </div>

      {/* Exercise Question Prompt */}
      <div className="my-1">
        <h2 className="text-sm font-black text-[#2d2113]">
          Complete the CSS rule to center the div.
        </h2>
      </div>

      {/* CSS Code Editor Card */}
      <div className="bg-[#f2e7d3] border-2 border-[#d0b892] rounded-2xl p-2.5 shadow-md my-1">
        {/* Editor vs View Tab Control */}
        <div className="flex space-x-2 mb-2">
          <button 
            onClick={() => setEditorTab('editor')}
            className={`px-4 py-1 rounded-lg text-xs font-black transition-all ${
              editorTab === 'editor' 
                ? 'bg-[#fbf6ec] text-[#2d2113] border border-[#c4ab83] shadow-sm' 
                : 'text-amber-800'
            }`}
          >
            Editor
          </button>
          <button 
            onClick={() => setEditorTab('view')}
            className={`px-4 py-1 rounded-lg text-xs font-black transition-all ${
              editorTab === 'view' 
                ? 'bg-[#fbf6ec] text-[#2d2113] border border-[#c4ab83] shadow-sm' 
                : 'text-amber-800'
            }`}
          >
            View
          </button>
        </div>

        {editorTab === 'editor' ? (
          <div className="bg-[#fbf6ec] border border-[#d2bc99] rounded-xl p-3 font-mono text-xs text-[#2c2419] min-h-[160px] flex flex-col justify-center shadow-inner">
            <div className="text-amber-900/60">&lt;style&gt;</div>
            <div className="pl-3">
              <div>div &#123;</div>
              <div className="pl-4 text-emerald-800 font-bold">display: flex;</div>
              
              {/* Fillable Slot 1 */}
              <div className="pl-4 my-1 flex items-center">
                {slot1 ? (
                  <button onClick={() => handleClearSlot(1)} className="bg-[#e2ceab] border border-[#b89c6f] px-2 py-0.5 rounded text-xs font-bold text-amber-950 flex items-center space-x-1 shadow-sm">
                    <span>[{slot1}]</span>
                    <X className="w-3 h-3 text-amber-900" />
                  </button>
                ) : (
                  <div className="bg-[#e8dcc6] border border-dashed border-[#b39972] w-32 h-6 rounded flex items-center justify-center text-amber-800/60 text-[11px]">
                    [ gap:10px; ]
                  </div>
                )}
              </div>

              {/* Fillable Slot 2 */}
              <div className="pl-4 my-1 flex items-center">
                {slot2 ? (
                  <button onClick={() => handleClearSlot(2)} className="bg-[#e2ceab] border border-[#b89c6f] px-2 py-0.5 rounded text-xs font-bold text-amber-950 flex items-center space-x-1 shadow-sm">
                    <span>[{slot2}]</span>
                    <X className="w-3 h-3 text-amber-900" />
                  </button>
                ) : (
                  <div className="bg-[#e8dcc6] border border-dashed border-[#b39972] w-[150px] h-6 rounded flex items-center justify-center text-amber-800/60 text-[11px]">
                    [ justify-content:center; ]
                  </div>
                )}
              </div>

              <div className="pl-4 text-emerald-800 font-bold">align-items: center;</div>
              <div>&#125;</div>
            </div>
            <div className="text-amber-900/60">&lt;/style&gt;</div>
          </div>
        ) : (
          <div className="bg-[#fbf6ec] border border-[#d2bc99] rounded-xl p-4 min-h-[160px] flex items-center justify-center">
            <div className="w-full h-28 border border-dashed border-amber-300 rounded-xl flex items-center justify-center bg-amber-50/50">
              <div className={`p-3 bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-md transition-all ${
                slot1 === 'justify-content: center;' || slot2 === 'justify-content: center;' ? 'scale-110 bg-emerald-600' : ''
              }`}>
                Centered Div Box
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selectable Code Options */}
      <div className="grid grid-cols-2 gap-2 my-2">
        {options.map((opt) => {
          const isUsed = slot1 === opt.text || slot2 === opt.text;
          return (
            <button
              key={opt.id}
              disabled={isUsed}
              onClick={() => handleChipClick(opt.text)}
              className={`p-2 rounded-xl border-2 font-mono text-xs font-bold text-left transition-all ${
                isUsed 
                  ? 'bg-amber-100/40 border-amber-200 text-amber-800/30 border-dashed cursor-not-allowed' 
                  : 'bg-[#fbf6ec] border-[#d8c3a3] text-[#2d2113] active:scale-95 shadow-sm'
              }`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Action Footer Button */}
      <div className="mt-auto">
        {exerciseStatus === 'success' ? (
          <div className="bg-[#d4edda] border-2 border-[#28a745] rounded-2xl p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-base font-black text-emerald-800">Good Job!</span>
              </div>
            </div>
            <button 
              onClick={handleContinue}
              className="w-full bg-[#52be2e] border-b-4 border-[#35871a] active:border-b-0 text-white font-black py-2.5 rounded-xl uppercase shadow"
            >
              CONTINUE
            </button>
          </div>
        ) : (
          <button 
            onClick={handleCheck}
            disabled={!slot1 && !slot2}
            className={`w-full text-sm font-black py-3 rounded-2xl border-b-4 uppercase transition-all shadow ${
              slot1 || slot2
                ? 'bg-[#52be2e] border-[#35871a] text-white active:translate-y-0.5'
                : 'bg-[#ddcfb7] border-[#bdad93] text-amber-800/40 cursor-not-allowed'
            }`}
          >
            CHECK
          </button>
        )}
      </div>

    </div>
  );
}

function LeaderboardScreen({ xp, onClose }) {
  const leaderboardData = [
    { rank: 1, name: 'Alex J.', xp: 2450, badge: '⚡', isUser: false, avatar: '👨‍🦱' },
    { rank: 2, name: 'Sara S.', xp: 2100, badge: '🔥', isUser: false, avatar: '👩' },
    { rank: 3, name: 'You', xp: xp, badge: '🚀', isUser: true, avatar: '🧑‍💻' },
    { rank: 4, name: 'David L.', xp: 980, badge: '💻', isUser: false, avatar: '🤖' },
  ];

  return (
    <div className="relative min-h-full bg-[#faedd9]/90 flex flex-col p-4 overflow-y-auto">
      
      {/* Top Banner Mascot Header */}
      <div className="relative w-full h-28 bg-[#e6d3b3] rounded-3xl border-2 border-[#cbb189] p-3 shadow-sm flex flex-col justify-between mb-3">
        <div className="flex justify-between items-center z-10">
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-amber-950 font-bold shadow-sm">
            <X className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 bg-amber-100 flex items-center justify-center text-base">
            👨‍🎓
          </div>
        </div>

        {/* Fennec Fox Mascot SVG Graphic */}
        <div className="absolute right-3 bottom-0 z-10 w-20 h-20 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <polygon points="25,50 10,10 40,35" fill="#e2a863" stroke="#b07a3c" strokeWidth="2" />
            <polygon points="75,50 90,10 60,35" fill="#e2a863" stroke="#b07a3c" strokeWidth="2" />
            <ellipse cx="50" cy="55" rx="22" ry="18" fill="#f5c796" />
            <circle cx="42" cy="52" r="3.5" fill="#2d1b0e" />
            <circle cx="58" cy="52" r="3.5" fill="#2d1b0e" />
          </svg>
        </div>

        <div className="z-10">
          <div className="text-[10px] font-black text-amber-950/70 uppercase">Bazaar League</div>
          <div className="text-base font-black text-[#3a2e1d]">Leaderboard</div>
        </div>
      </div>

      {/* Weekly Progress 3D Chart Box */}
      <div className="bg-[#f2e7d3] border-2 border-[#d0b892] rounded-2xl p-3 shadow-sm mb-3">
        <h3 className="text-xs font-black text-[#2d2113] mb-1">Weekly Progress</h3>
        
        <div className="flex justify-between items-center mb-2 text-xs">
          <div>
            <div className="font-extrabold text-teal-700">Bronto</div>
            <div className="font-extrabold text-emerald-800">You</div>
          </div>
          <div className="text-right font-black">
            <div className="text-teal-700">4024 XP</div>
            <div className="text-emerald-600">2026 XP</div>
          </div>
        </div>

        {/* 3D Bar Comparison */}
        <div className="h-28 bg-[#fbf6ec] border border-[#d2bc99] rounded-xl p-2 flex items-end justify-center space-x-8 relative">
          <div className="flex flex-col items-center z-10">
            <div className="relative w-10 h-16 bg-teal-500 rounded-t-sm border-t border-l border-teal-300 shadow">
              <div className="absolute -top-1.5 left-0 right-0 h-1.5 bg-teal-300 transform -skew-x-12 rounded-t-sm"></div>
              <div className="absolute top-0 -right-1.5 bottom-0 w-1.5 bg-teal-700 transform skew-y-12 rounded-r-sm"></div>
            </div>
            <span className="text-[11px] font-black text-amber-950 mt-1">Bronto</span>
          </div>

          <div className="flex flex-col items-center z-10">
            <div className="relative w-10 h-10 bg-emerald-500 rounded-t-sm border-t border-l border-emerald-300 shadow">
              <div className="absolute -top-1.5 left-0 right-0 h-1.5 bg-emerald-300 transform -skew-x-12 rounded-t-sm"></div>
              <div className="absolute top-0 -right-1.5 bottom-0 w-1.5 bg-emerald-700 transform skew-y-12 rounded-r-sm"></div>
            </div>
            <span className="text-[11px] font-black text-amber-950 mt-1">You</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Player List */}
      <div className="bg-[#f2e7d3] border-2 border-[#d0b892] rounded-2xl p-3 shadow-sm">
        <h3 className="text-xs font-black text-[#2d2113] mb-2">Rankings</h3>
        <div className="space-y-1.5">
          {leaderboardData.map((item) => (
            <div 
              key={item.rank}
              className={`flex items-center justify-between p-2 rounded-xl border-2 text-xs transition-all ${
                item.isUser 
                  ? 'bg-[#fef3c7] border-[#f59e0b] font-black shadow-sm scale-[1.02]' 
                  : 'bg-[#fbf6ec] border-[#e2d0b3]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="font-black text-amber-950 w-3">{item.rank}.</span>
                <span className="text-base">{item.avatar}</span>
                <span className="font-extrabold text-[#3a2e1d]">{item.name}</span>
              </div>
              <div className="flex items-center space-x-1 font-black text-amber-950">
                <span>{item.xp} XP</span>
                <span>{item.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function SettingsScreen({ hearts, xp, streak, onReset }) {
  return (
    <div className="p-4 min-h-full bg-[#faedd9]/90 flex flex-col justify-between">
      <div className="bg-[#f2e7d3] border-2 border-[#d0b892] rounded-2xl p-4 shadow-sm">
        <h2 className="text-base font-black text-[#2d2113] mb-3">Settings</h2>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-2.5 bg-[#fbf6ec] rounded-xl border border-[#d2bc99]">
            <span className="font-extrabold text-amber-950">Hearts Remaining</span>
            <span className="font-black text-rose-600">{hearts}</span>
          </div>
          <div className="flex justify-between p-2.5 bg-[#fbf6ec] rounded-xl border border-[#d2bc99]">
            <span className="font-extrabold text-amber-950">XP Score</span>
            <span className="font-black text-amber-600">{xp}</span>
          </div>
          <div className="flex justify-between p-2.5 bg-[#fbf6ec] rounded-xl border border-[#d2bc99]">
            <span className="font-extrabold text-amber-950">Daily Streak</span>
            <span className="font-black text-orange-600">{streak} Days</span>
          </div>
        </div>
      </div>

      <button onClick={onReset} className="w-full bg-rose-500 text-white font-black py-3 rounded-2xl border-b-4 border-rose-700 active:translate-y-0.5 flex items-center justify-center space-x-2 shadow">
        <RefreshCw className="w-4 h-4" />
        <span>RESET DEMO PROGRESS</span>
      </button>
    </div>
  );
}