import type { Bloom } from "../types";
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
      {/* This new div is the only part that can be clicked */}
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

      {data.dots.map((dot, index) => (
        <div
          key={index}
          className={styles.dot}
          style={{ "--dx": `${dot.x}px`, "--dy": `${dot.y}px` } as React.CSSProperties}
        />
      ))}
    </div>
  );
};