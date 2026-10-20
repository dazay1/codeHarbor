// src/components/Navbar.jsx
import React from 'react';
import { Flame, Zap, Heart, Trophy, User, Compass, Terminal } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, stats, tracks, selectedTrack, setSelectedTrack }) {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-indigo-500/20 px-4 py-3 shadow-lg shadow-indigo-500/5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Logo & Track Selector */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5 font-black text-2xl tracking-tight cursor-pointer">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl text-white shadow-md shadow-indigo-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
              IT-Lingo
            </span>
          </div>

          <div className="flex gap-1.5 bg-slate-800/90 p-1.5 rounded-xl border border-indigo-500/20">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  selectedTrack === track.id
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bright Gamification Stats Bar */}
        <div className="flex items-center gap-2.5 text-xs font-black">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-400/30 rounded-xl text-amber-300 shadow-sm">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{stats.streak} Days</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-xl text-emerald-300 shadow-sm">
            <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
            <span>{stats.xp} XP</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 border border-rose-400/30 rounded-xl text-rose-300 shadow-sm">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            <span>{stats.hearts}</span>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-indigo-500/20">
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'learn'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" /> Path
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" /> Ranks
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'profile'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Profile
          </button>
        </div>

      </div>
    </nav>
  );
}