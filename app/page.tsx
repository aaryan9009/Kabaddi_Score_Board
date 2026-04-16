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

  const handleStart = () => {
    setTime(30);
    setIsRunning(true);
  };

  const handleStop = () => setIsRunning(false);
  const handleReset = () => { setTeam1Score(0); setTeam2Score(0); };
  const handleSwitch = () => {
    const t1 = team1Score;
    setTeam1Score(team2Score);
    setTeam2Score(t1);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-between p-2 md:p-6 border-4 border-yellow-400 overflow-hidden">
      
      {/* 1. Timer Section (Top) */}
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="text-[10rem] leading-none sm:text-[14rem] md:text-[18rem] font-bold text-yellow-300 drop-shadow-2xl font-mono">
          {String(time).padStart(2, '0')}
        </div>
        
        {/* Buzzer Indicator */}
        <div className="h-6 mb-2">
          {time <= 10 && time > 0 && (
            <div className="text-lg md:text-2xl text-yellow-300 font-bold animate-pulse">
              ⚠️ BUZZER ACTIVE
            </div>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex gap-3">
          <Button
            onClick={handleStart}
            className="px-10 py-7 text-2xl font-black bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            START
          </Button>
          <Button
            onClick={handleStop}
            className="px-10 py-7 text-2xl font-black bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            STOP
          </Button>
        </div>
      </div>

      {/* 2. Scores Section (Middle - Reduced Gaps) */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-2 md:gap-8 my-4">
        {/* Team 1 Card */}
        <div className="flex flex-col items-center bg-slate-800/40 p-3 rounded-xl border border-slate-700">
          <div className="text-7xl sm:text-8xl md:text-9xl font-bold text-yellow-400 leading-tight">
            {team1Score}
          </div>
          <div className="flex gap-2 w-full mt-1">
            <Button
              onClick={() => setTeam1Score(team1Score + 1)}
              className="flex-1 h-14 text-3xl font-bold bg-yellow-500 text-slate-900 rounded-lg"
            >
              +
            </Button>
            <Button
              onClick={() => setTeam1Score(Math.max(0, team1Score - 1))}
              className="flex-1 h-14 text-3xl font-bold bg-slate-700 text-white rounded-lg"
            >
              -
            </Button>
          </div>
        </div>

        {/* Team 2 Card */}
        <div className="flex flex-col items-center bg-slate-800/40 p-3 rounded-xl border border-slate-700">
          <div className="text-7xl sm:text-8xl md:text-9xl font-bold text-yellow-400 leading-tight">
            {team2Score}
          </div>
          <div className="flex gap-2 w-full mt-1">
            <Button
              onClick={() => setTeam2Score(team2Score + 1)}
              className="flex-1 h-14 text-3xl font-bold bg-yellow-500 text-slate-900 rounded-lg"
            >
              +
            </Button>
            <Button
              onClick={() => setTeam2Score(Math.max(0, team2Score - 1))}
              className="flex-1 h-14 text-3xl font-bold bg-slate-700 text-white rounded-lg"
            >
              -
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Global Actions (Bottom) */}
      <div className="flex gap-3 w-full max-w-md pb-2">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 h-12 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold uppercase text-xs"
        >
          Reset Scores
        </Button>
        <Button
          onClick={handleSwitch}
          variant="outline"
          className="flex-1 h-12 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-bold uppercase text-xs"
        >
          Switch Sides
        </Button>
      </div>
    </div>
  );
}
