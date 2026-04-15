// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { Button } from '@/components/ui/button';

// export default function KabaddiTimer() {
//   const [time, setTime] = useState(30);
//   const [isRunning, setIsRunning] = useState(false);
//   const [team1Score, setTeam1Score] = useState(0);
//   const [team2Score, setTeam2Score] = useState(0);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const oscillatorRef = useRef<OscillatorNode | null>(null);

//   // Buzzer sound effect
//   const playBuzzer = () => {
//     if (!audioContextRef.current) {
//       audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
//     }

//     const audioContext = audioContextRef.current;
//     const now = audioContext.currentTime;

//     // Create oscillator for buzzer sound
//     const oscillator = audioContext.createOscillator();
//     const gainNode = audioContext.createGain();

//     oscillator.connect(gainNode);
//     gainNode.connect(audioContext.destination);

//     oscillator.frequency.value = 800;
//     oscillator.type = 'square';

//     gainNode.gain.setValueAtTime(0.3, now);
//     gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

//     oscillator.start(now);
//     oscillator.stop(now + 0.2);
//   };

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isRunning && time > 0) {
//       interval = setInterval(() => {
//         setTime((prev) => {
//           const newTime = prev - 1;

//           // Play buzzer from 10 to 1 seconds
//           if (newTime <= 10 && newTime > 0) {
//             playBuzzer();
//           }

//           if (newTime === 0) {
//             setIsRunning(false);
//           }

//           return newTime;
//         });
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [isRunning, time]);

//   const handleStart = () => {
//     setTime(30);
//     setIsRunning(true);
//   };

//   const handleStop = () => {
//     setIsRunning(false);
//   };

//   const handleReset = () => {
//     setTeam1Score(0);
//     setTeam2Score(0);
//   };

//   const handleSwitch = () => {
//     const temp = team1Score;
//     setTeam1Score(team2Score);
//     setTeam2Score(temp);
//   };

//   return (
//     <div className="w-screen h-screen bg-slate-900 flex flex-col items-center justify-center gap-2 border-8 border-yellow-400">
//       {/* Timer Display */}
//       <div className="text-9xl md:text-9xl font-bold text-yellow-300 drop-shadow-2xl font-mono">
//         {String(time).padStart(2, '0')}
//       </div>

//       {/* Start Stop Buttons */}
//       <div className="flex gap-4">
//         <Button
//           onClick={handleStart}
//           className="px-6 py-3 text-lg font-bold bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-xl"
//         >
//           START
//         </Button>
//         <Button
//           onClick={handleStop}
//           className="px-6 py-3 text-lg font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-xl"
//         >
//           STOP
//         </Button>
//       </div>

//       {/* Buzzer indicator */}
//       {time <= 10 && time > 0 && (
//         <div className="text-xl text-yellow-300 font-bold animate-pulse">
//           BUZZER ACTIVE
//         </div>
//       )}

//       {/* Teams Score Section */}
//       <div className="flex gap-16">
//         {/* Team 1 */}
//         <div className="flex flex-col items-center">
//           <div className="text-9xl font-bold text-yellow-300">{team1Score}</div>
//           <div className="flex gap-1 mt-2">
//             <Button
//               onClick={() => setTeam1Score(team1Score + 1)}
//               className="px-3 py-1 text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded"
//             >
//               +
//             </Button>
//             <Button
//               onClick={() => setTeam1Score(Math.max(0, team1Score - 1))}
//               className="px-3 py-1 text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded"
//             >
//               -
//             </Button>
//           </div>
//         </div>

//         {/* Team 2 */}
//         <div className="flex flex-col items-center">
//           <div className="text-9xl font-bold text-yellow-300">{team2Score}</div>
//           <div className="flex gap-1 mt-2">
//             <Button
//               onClick={() => setTeam2Score(team2Score + 1)}
//               className="px-3 py-1 text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded"
//             >
//               +
//             </Button>
//             <Button
//               onClick={() => setTeam2Score(Math.max(0, team2Score - 1))}
//               className="px-3 py-1 text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded"
//             >
//               -
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Reset and Switch Buttons */}
//       <div className="flex gap-4 mt-8">
//         <Button
//           onClick={handleReset}
//           className="px-6 py-2 text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
//         >
//           RESET
//         </Button>
//         <Button
//           onClick={handleSwitch}
//           className="px-6 py-2 text-sm font-bold bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
//         >
//           SWITCH
//         </Button>
//       </div>
//     </div>
//   );
// }


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
    setTeam1Score(team2Score);
    setTeam2Score(team1Score);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-between p-4 md:p-8 border-4 md:border-8 border-yellow-400 overflow-x-hidden">
      
      {/* Timer Section */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="text-8xl sm:text-[12rem] md:text-[15rem] font-bold text-yellow-300 drop-shadow-2xl font-mono leading-none">
          {String(time).padStart(2, '0')}
        </div>
        
        {/* Buzzer indicator - Fixed height to prevent layout shift */}
        <div className="h-8 flex items-center">
          {time <= 10 && time > 0 && (
            <div className="text-lg md:text-2xl text-yellow-300 font-bold animate-pulse">
              BUZZER ACTIVE
            </div>
          )}
        </div>

        {/* Primary Controls */}
        <div className="flex gap-4 mt-4">
          <Button
            onClick={handleStart}
            className="px-8 py-6 text-xl md:text-2xl font-black bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-2xl active:scale-95 transition-transform"
          >
            START
          </Button>
          <Button
            onClick={handleStop}
            className="px-8 py-6 text-xl md:text-2xl font-black bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-2xl active:scale-95 transition-transform"
          >
            STOP
          </Button>
        </div>
      </div>

      {/* Scores Section */}
      <div className="w-full max-w-4xl grid grid-cols-2 gap-4 md:gap-16 my-8">
        {/* Team 1 */}
        <div className="flex flex-col items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
          <span className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest"></span>
          <div className="text-7xl sm:text-8xl md:text-9xl font-bold text-yellow-300">{team1Score}</div>
          <div className="flex gap-2 mt-2 w-full">
            <Button
              onClick={() => setTeam1Score(team1Score + 1)}
              className="flex-1 h-12 text-2xl font-bold bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg"
            >
              +
            </Button>
            <Button
              onClick={() => setTeam1Score(Math.max(0, team1Score - 1))}
              className="flex-1 h-12 text-2xl font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              -
            </Button>
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
          <span className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest"></span>
          <div className="text-7xl sm:text-8xl md:text-9xl font-bold text-yellow-300">{team2Score}</div>
          <div className="flex gap-2 mt-2 w-full">
            <Button
              onClick={() => setTeam2Score(team2Score + 1)}
              className="flex-1 h-12 text-2xl font-bold bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg"
            >
              +
            </Button>
            <Button
              onClick={() => setTeam2Score(Math.max(0, team2Score - 1))}
              className="flex-1 h-12 text-2xl font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              -
            </Button>
          </div>
        </div>
      </div>

      {/* Utility Footer */}
      <div className="flex gap-4 w-full max-w-md pb-4">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold"
        >
          RESET SCORES
        </Button>
        <Button
          onClick={handleSwitch}
          variant="outline"
          className="flex-1 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-bold"
        >
          SWITCH SIDES
        </Button>
      </div>
    </div>
  );
}