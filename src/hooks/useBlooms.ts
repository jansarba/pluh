import { useState } from "react";
import type { Bloom, Dot } from "../types";
import { generateBloomNotes } from "../audio";
import { BLOB_COLORS, MAX_BLOOMS } from "../constants";

export function useBlooms() {
  const [blooms, setBlooms] = useState<Bloom[]>([]);

  const createBloom = (x: number, y: number) => {
    const rand = Math.random();
    let dotCount: number;
    if (rand < 0.66) {
      dotCount = 3;
    } else if (rand < 0.90) {
      dotCount = 2;
    } else {
      dotCount = 4;
    }

    const bloomId = Date.now();
    const bloomNotes = generateBloomNotes(dotCount);
    const newDots: Dot[] = [];
    for (let i = 0; i < dotCount; i++) {
      newDots.push({
        id: `${bloomId}-${i}`,
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        note: bloomNotes[i],
        isPlaying: false,
      });
    }

    const r = () => 25 + Math.floor(Math.random() * 50);
    const v1 = r(), v2 = r(), v3 = r(), v4 = r();
    const blobShape = `${v1}% ${100 - v1}% ${v2}% ${100 - v2}% / ${v3}% ${v4}% ${100 - v4}% ${100 - v3}%`;
    const randomColor = BLOB_COLORS[Math.floor(Math.random() * BLOB_COLORS.length)];

    const newBloom: Bloom = {
      id: bloomId,
      x,
      y,
      visualSize: 140 + Math.random() * 100,
      blobShape,
      color: randomColor,
      dots: newDots,
    };

    setBlooms(prevBlooms => {
      const updatedBlooms = [...prevBlooms, newBloom];
      const activeBlooms = updatedBlooms.filter(b => !b.isFadingOut);

      if (activeBlooms.length > MAX_BLOOMS) {
        const oldestBloomId = activeBlooms[0].id;
        return updatedBlooms.map(b =>
          b.id === oldestBloomId ? { ...b, isFadingOut: true } : b
        );
      }

      return updatedBlooms;
    });
  };

  const dismissBloom = (id: number) => {
    setBlooms(prevBlooms =>
      prevBlooms.map(b => (b.id === id ? { ...b, isFadingOut: true } : b))
    );
  };

  const removeBloom = (id: number) => {
    setBlooms(prev => prev.filter(b => b.id !== id));
  };

  return { blooms, createBloom, dismissBloom, removeBloom };
}