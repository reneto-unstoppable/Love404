'use client';

import { useEffect, useState } from 'react';
import * as Tone from 'tone';

const ConfettiPiece = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute w-2 h-4" style={style}></div>
);

export function MatchFailClient() {
  const [confetti, setConfetti] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    // Play sad trombone sound
    const playSound = async () => {
      await Tone.start();
      const synth = new Tone.Synth().toDestination();
      const now = Tone.now();
      synth.triggerAttackRelease("F4", "8n", now);
      synth.triggerAttackRelease("E4", "8n", now + 0.2);
      synth.triggerAttackRelease("D4", "8n", now + 0.4);
      synth.triggerAttackRelease("C#4", "2n", now + 0.6);
    };

    playSound().catch(console.error);

    // Create sad, gray confetti
    const newConfetti: React.CSSProperties[] = Array.from({ length: 100 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${-20 - Math.random() * 100}%`,
      backgroundColor: `hsl(0, 0%, ${Math.random() * 40 + 40}%)`, // shades of gray
      transform: `rotate(${Math.random() * 360}deg)`,
      animation: `fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s forwards`,
    }));
    setConfetti(newConfetti);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes fall {
        to {
          transform: translateY(120vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
        document.head.removeChild(styleSheet);
    };

  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {confetti.map((style, index) => (
        <ConfettiPiece key={index} style={style} />
      ))}
    </div>
  );
}
