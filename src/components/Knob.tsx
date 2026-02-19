import { useEffect, useRef } from "react";
import styles from "./Knob.module.css";

interface Props {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export const Knob = ({ label, min, max, value, onChange }: Props) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartValue = useRef<number>(value);

  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const applyDrag = (startY: number, currentY: number) => {
    const delta = (startY - currentY) / 100;
    const next = Math.min(max, Math.max(min, dragStartValue.current + delta * (max - min)));
    onChangeRef.current(next);
  };

  // mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    dragStartY.current = e.clientY;
    dragStartValue.current = valueRef.current;

    const onMouseMove = (e: MouseEvent) => {
      if (dragStartY.current === null) return;
      applyDrag(dragStartY.current, e.clientY);
    };
    const onMouseUp = () => {
      dragStartY.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // touch — attached via useEffect so can pass { passive: false }
  useEffect(() => {
    const el = knobRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      dragStartY.current = e.touches[0].clientY;
      dragStartValue.current = valueRef.current;

      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (dragStartY.current === null) return;
        applyDrag(dragStartY.current, e.touches[0].clientY);
      };
      const onTouchEnd = () => {
        dragStartY.current = null;
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
      };
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    return () => el.removeEventListener('touchstart', onTouchStart);
  }, []);

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className={styles.knobWrap}>
      <div
        ref={knobRef}
        className={styles.knob}
        onMouseDown={handleMouseDown}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <span className={styles.knobLabel}>{label}</span>
    </div>
  );
};