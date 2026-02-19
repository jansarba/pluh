import { useState } from "react";
import { BloomVisual } from "./components/BloomVisual";
import { useBlooms } from "./hooks/useBlooms";
import { startAudio } from "./audio";
import "./App.css";

function App() {
  const { blooms, createBloom, dismissBloom, removeBloom } = useBlooms();
  const [audioStarted, setAudioStarted] = useState(false);

  const handleScreenClick = async (e: React.MouseEvent<HTMLDivElement>) => {

    if (!audioStarted) {
      await startAudio();
      setAudioStarted(true);
    }

    const elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY);

    const clickedBloomIds = elementsUnderCursor
      .filter(el => el.hasAttribute('data-bloom-id'))
      .map(el => Number(el.getAttribute('data-bloom-id')));

    if (clickedBloomIds.length > 0) {
      clickedBloomIds.forEach(dismissBloom);
    } else {
      createBloom(e.clientX, e.clientY);
    }
  };

  return (
    <div className="canvas-container" onClick={handleScreenClick}>
      {blooms.map((bloom) => (
        <BloomVisual
          key={bloom.id}
          data={bloom}
          onFadeComplete={removeBloom}
        />
      ))}
    </div>
  );
}

export default App;