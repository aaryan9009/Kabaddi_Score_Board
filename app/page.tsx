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
    <div className="h-screen w-full bg-slate-900 flex flex-col items-center p-2 border-4 border-yellow-400 overflow-hidden">
      
      {/* 1. Team Scores Section (Now at the top) */}
      <div className="w-full max-w-md grid grid-cols-2 gap-2 mt-2">
        {/* Team 1 */}
        <div className="flex flex-col items-center bg-slate-800/60 p-2 rounded-lg border border-slate-700">
          <div className="text-7xl font-bold text-yellow-400 leading-none mb-2">{team1Score}</div>
          <div className="flex gap-1 w-full">
            <Button onClick={() => setTeam1Score(team1Score + 1)} className="flex-1 h-12 text-2xl font-bold bg-yellow-500 text-slate-900 rounded-md">+</Button>
            <Button onClick={() => setTeam1Score(Math.max(0, team1Score - 1))} className="flex-1 h-12 text-2xl font-bold bg-slate-700 text-white rounded-md">-</Button>
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center bg-slate-800/60 p-2 rounded-lg border border-slate-700">
          <div className="text-7xl font-bold text-yellow-400 leading-none mb-2">{team2Score}</div>
          <div className="flex gap-1 w-full">
            <Button onClick={() => setTeam2Score(team2Score + 1)} className="flex-1 h-12 text-2xl font-bold bg-yellow-500 text-slate-900 rounded-md">+</Button>
            <Button onClick={() => setTeam2Score(Math.max(0, team2Score - 1))} className="flex-1 h-12 text-2xl font-bold bg-slate-700 text-white rounded-md">-</Button>
          </div>
        </div>
      </div>

      {/* 2. Utility Buttons (Reset/Switch) - Right below scores */}
      <div className="flex gap-2 w-full max-w-md mt-2">
        <Button onClick={handleReset} variant="outline" className="flex-1 h-9 border-orange-500 text-orange-500 text-[10px] font-bold uppercase">Reset Scores</Button>
        <Button onClick={handleSwitch} variant="outline" className="flex-1 h-9 border-purple-500 text-purple-500 text-[10px] font-bold uppercase">Switch Sides</Button>
      </div>

      {/* 3. Timer Section (Pushed to bottom) */}
      <div className="flex flex-col items-center justify-end flex-1 w-full pb-4">
        {/* Timer Controls */}
        <div className="flex gap-2 mb-2">
          <Button onClick={handleStart} className="h-12 px-8 text-xl font-black bg-green-600 text-white rounded-lg shadow-lg">START</Button>
          <Button onClick={handleStop} className="h-12 px-8 text-xl font-black bg-red-600 text-white rounded-lg shadow-lg">STOP</Button>
        </div>

        {/* The Big Counter */}
        <div className="text-[10rem] leading-[0.8] font-bold text-yellow-300 drop-shadow-xl font-mono">
          {String(time).padStart(2, '0')}
        </div>

        {/* Small Buzzer Text */}
        <div className="h-4">
          {time <= 10 && time > 0 && (
            <div className="text-xs text-yellow-300 font-bold animate-pulse uppercase">Buzzer Active</div>
          )}
        </div>
      </div>
    </div>
  );
}
