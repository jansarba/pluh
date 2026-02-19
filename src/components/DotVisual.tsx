import { useEffect, useRef } from "react";
import type { Dot } from "../types";
import { synth, notifyDotFired } from "../audio";
import styles from "./BloomVisual.module.css";

interface DotVisualProps {
  dot: Dot;
}

export const DotVisual = ({ dot }: DotVisualProps) => {
  const flashRef = useRef<HTMLDivElement>(null);
  const playedNote = dot.noteOverride ?? dot.note;

  useEffect(() => {
    if (dot.isPlaying && flashRef.current) {
      synth.triggerAttackRelease(playedNote, "16n", undefined, 0.1);
      notifyDotFired(playedNote);

      // trigger reflow to restart animation
      flashRef.current.style.animation = 'none';
      void flashRef.current.offsetHeight; // force
      flashRef.current.style.animation = '';
    }
  }, [dot.isPlaying, playedNote]);

  return (
    <div
      className={styles.dotContainer}
      style={{ 
        "--dx": `${dot.x}px`, 
        "--dy": `${dot.y}px`
      } as React.CSSProperties}
    >
      {dot.isPlaying && (
        <div ref={flashRef} className={styles.dotFlash} />
      )}
      <div className={styles.dot} />
    </div>
  );
};