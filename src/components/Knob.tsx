import { useRef } from "react";
import styles from "./Knob.module.css";

interface Props {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export const Knob = ({ label, min, max, value, onChange }: Props) => {
  const dragStartY = useRef<number | null>(null);
  const dragStartValue = useRef<number>(value);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    dragStartY.current = e.clientY;
    dragStartValue.current = value;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragStartY.current === null) return;
      const delta = (dragStartY.current - e.clientY) / 100;
      const next = Math.min(max, Math.max(min, dragStartValue.current + delta * (max - min)));
      onChange(next);
    };

    const handleMouseUp = () => {
      dragStartY.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className={styles.knobWrap}>
      <div
        className={styles.knob}
        onMouseDown={handleMouseDown}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <span className={styles.knobLabel}>{label}</span>
    </div>
  );
};