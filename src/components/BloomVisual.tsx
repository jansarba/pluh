import { useEffect, useState, useRef } from "react";
import type { Bloom } from "../types";
import { DotVisual } from "./DotVisual";
import styles from "./BloomVisual.module.css";

interface Props {
  data: Bloom;
  onFadeComplete: (id: number) => void;
}

const createGradientFromColor = (rgbaColor: string) => {
  const endColor = rgbaColor.replace(', 1)', ', 0.9)'); 
  return `radial-gradient(circle at center, ${rgbaColor} 0%, ${endColor} 100%)`;
}

export const BloomVisual = ({ data, onFadeComplete }: Props) => {
  const [dots, setDots] = useState(data.dots);
  const [rhythm, setRhythm] = useState<number[]>([]);
  const initialPlayCompleteRef = useRef(false);
  const rhythmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // after initial play completes, generate rhythm and start loop
  useEffect(() => {
    const generateRhythm = () => {
      const patternLength = 8 + Math.floor(Math.random() * 9); // 8-16 beats
      const numHits = Math.ceil(data.dots.length * 0.5) + Math.floor(Math.random() * data.dots.length); // 50-150% of dot count
      const beats: number[] = [];
      
      for (let i = 0; i < numHits; i++) {
        const beat = Math.floor(Math.random() * patternLength);
        if (!beats.includes(beat)) {
          beats.push(beat);
        }
      }
      
      return beats.sort((a, b) => a - b);
    };

    // initial play
    data.dots.forEach((_, index) => {
      setTimeout(() => {
        setDots(prevDots => 
          prevDots.map((d, i) => 
            i === index ? { ...d, isPlaying: true } : d
          )
        );
      }, index * 100);
    });

    // start repeating
    const initialDuration = data.dots.length * 100 + 500; // 500ms buffer
    const setupRhythmTimer = setTimeout(() => {
      const generatedRhythm = generateRhythm();
      setRhythm(generatedRhythm);
      initialPlayCompleteRef.current = true;
    }, initialDuration);

    return () => {
      clearTimeout(setupRhythmTimer);
    };
  }, [data.dots]);

  // loop
  useEffect(() => {
    if (!initialPlayCompleteRef.current || rhythm.length === 0 || data.isFadingOut) {
      return;
    }

    const beatDuration = 300; // milliseconds per beat
    const patternLength = Math.max(...rhythm) + 1;
    let currentBeat = 0;

    const playBeat = () => {
      if (rhythm.includes(currentBeat)) {
        // pick dots
        const dotIndicesToPlay = [Math.floor(Math.random() * dots.length)];
        
        // Sometimes play multiple dots together
        if (Math.random() < 0.3 && dots.length > 1) {
          const secondDot = Math.floor(Math.random() * dots.length);
          if (secondDot !== dotIndicesToPlay[0]) {
            dotIndicesToPlay.push(secondDot);
          }
        }

        setDots(prevDots => 
          prevDots.map((d, i) => ({
            ...d,
            isPlaying: dotIndicesToPlay.includes(i) ? !d.isPlaying : d.isPlaying
          }))
        );
      }

      currentBeat = (currentBeat + 1) % patternLength;
    };

    rhythmIntervalRef.current = setInterval(playBeat, beatDuration);

    return () => {
      if (rhythmIntervalRef.current) {
        clearInterval(rhythmIntervalRef.current);
      }
    };
  }, [rhythm, dots.length, data.isFadingOut]);
  
  const handleAnimationEnd = () => {
    if (data.isFadingOut) {
      onFadeComplete(data.id);
    }
  };

  return (
    <div
      className={`${styles.bloomContainer} ${data.isFadingOut ? styles.fadingOut : ''}`}
      onAnimationEnd={handleAnimationEnd}
      style={{
        left: data.x,
        top: data.y,
        width: data.visualSize,
        height: data.visualSize,
      }}
    >
      {/* This div is the only part that can be clicked */}
      <div 
        data-bloom-id={data.id}
        className={styles.clickTarget}
      />
      
      <div
        className={styles.inkBlob}
        style={{
          borderRadius: data.blobShape,
          background: createGradientFromColor(data.color),
        }}
      />

      {dots.map((dot) => (
        <DotVisual key={dot.id} dot={dot} />
      ))}
    </div>
  );
};