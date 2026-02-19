import { useState } from "react";
import { BloomVisual } from "./components/BloomVisual";
import type { Bloom, Dot } from "./types";
import "./App.css";

const BLOB_COLORS = [
  'rgba(5, 41, 158, 1)',   // international-klein-blue
  'rgba(94, 74, 227, 1)',  // majorelle-blue
  'rgba(148, 123, 211, 1)',// soft-periwinkle
  'rgba(242, 108, 167, 1)' // rose-kiss
];

const MAX_BLOOMS = 8;

function App() {
  const [blooms, setBlooms] = useState<Bloom[]>([]);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY);
    
    const clickedBloomElements = elementsUnderCursor.filter(
      el => el.hasAttribute('data-bloom-id')
    );
    
    const clickedBloomIds = clickedBloomElements.map(el => 
      Number(el.getAttribute('data-bloom-id'))
    );

    if (clickedBloomIds.length > 0) {

      setBlooms(prevBlooms =>
        prevBlooms.map(b =>
          clickedBloomIds.includes(b.id) ? { ...b, isFadingOut: true } : b
        )
      );
    } else {
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
      const newDots: Dot[] = [];
      for (let i = 0; i < dotCount; i++) {
        newDots.push({
          id: `${bloomId}-${i}`,
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
        });
      }

      const r = () => 25 + Math.floor(Math.random() * 50);
      const v1 = r(), v2 = r(), v3 = r(), v4 = r();
      const blobShape = `${v1}% ${100 - v1}% ${v2}% ${100 - v2}% / ${v3}% ${v4}% ${100 - v4}% ${100 - v3}%`;
      const randomColor = BLOB_COLORS[Math.floor(Math.random() * BLOB_COLORS.length)];
      
      const newBloom: Bloom = {
        id: bloomId,
        x: e.clientX,
        y: e.clientY,
        visualSize: 140 + Math.random() * 100,
        blobShape: blobShape,
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
    }
  };

  const handleFadeComplete = (id: number) => {
    setBlooms(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="canvas-container" onClick={handleScreenClick}>
      {blooms.map((bloom) => (
        <BloomVisual 
          key={bloom.id} 
          data={bloom} 
          onFadeComplete={handleFadeComplete} 
        />
      ))}
    </div>
  );
}

export default App;