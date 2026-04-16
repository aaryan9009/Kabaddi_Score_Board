'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function KabaddiTimer() {
  const [time, setTime] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBuzzer = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev - 1;
          if (newTime <= 10 && newTime > 0) playBuzzer();
          if (newTime === 0) setIsRunning(false);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleStart = () => { setTime(30); setIsRunning(true); };
  const handleStop = () => setIsRunning(false);
  const handleReset = () => { setTeam1Score(0); setTeam2Score(0); };
  const handleSwitch = () => {
    const t1 = team1Score;
    setTeam1Score(team2Score);
    setTeam2Score(t1);
  };

  return (
    <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4 border-4 border-yellow-400 overflow-hidden">
      
      {/* 1. Scores Section */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3">
        {/* Team 1 */}
        <div className="flex flex-col items-center bg-slate-800/60 p-2 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-9xl font-bold text-yellow-400 leading-none mb-2">{team1Score}</div>
          <div className="flex gap-1 w-full">
            <Button onClick={() => setTeam1Score(team1Score + 1)} className="flex-1 h-8 text-3xl font-bold bg-yellow-500 text-slate-900 rounded-lg">+</Button>
            <Button onClick={() => setTeam1Score(Math.max(0, team1Score - 1))} className="flex-1 h-8 text-3xl font-bold bg-slate-700 text-white rounded-lg">-</Button>
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center bg-slate-800/60 p-2 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-9xl font-bold text-yellow-400 leading-none mb-2">{team2Score}</div>
          <div className="flex gap-1 w-full">
            <Button onClick={() => setTeam2Score(team2Score + 1)} className="flex-1 h-8 text-3xl font-bold bg-yellow-500 text-slate-900 rounded-lg">+</Button>
            <Button onClick={() => setTeam2Score(Math.max(0, team2Score - 1))} className="flex-1 h-8 text-3xl font-bold bg-slate-700 text-white rounded-lg">-</Button>
          </div>
        </div>
      </div>

      {/* 2. Unified Utility Buttons (Same Colors) */}
      <div className="flex gap-2 w-full max-w-md mt-3">
        <Button onClick={handleReset} className="flex-1 h-8 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold uppercase rounded-lg border border-slate-500">
          Reset Scores
        </Button>
        <Button onClick={handleSwitch} className="flex-1 h-8 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold uppercase rounded-lg border border-slate-500">
          Switch Sides
        </Button>
      </div>

      {/* 3. Timer Section (Counter above Start/Stop) */}
      <div className="flex flex-col items-center mt-6 w-full">
        {/* The Big Counter */}
        <div className="text-[11rem] leading-[0.75] font-bold text-yellow-300 drop-shadow-2xl font-mono mb-6">
          {String(time).padStart(2, '0')}
        </div>

        {/* Timer Controls */}
        <div className="flex gap-4">
          <Button onClick={handleStart} className="h-10 px-8 text-2xl font-black bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-xl active:scale-95 transition-transform">
            START
          </Button>
          <Button onClick={handleStop} className="h-10 px-8 text-2xl font-black bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-xl active:scale-95 transition-transform">
            STOP
          </Button>
        </div>

        {/* Buzzer Active indicator */}
        <div className="h-6 mt-2">
          {time <= 10 && time > 0 && (
            <div className="text-sm text-yellow-300 font-bold animate-pulse tracking-widest uppercase">
              Buzzer Active
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
