import { useState } from "react";
import { BloomVisual } from "./components/BloomVisual";
import { Knob } from "./components/Knob";
import { useBlooms } from "./hooks/useBlooms";
import { startAudio, toggleReverb, toggleDelay, setDelayFeedback, setDelayTime as applyDelayTime } from "./audio";
import "./App.css";

function App() {
  const { blooms, createBloom, dismissBloom, removeBloom } = useBlooms();
  const [audioStarted, setAudioStarted] = useState(false);
  const [reverbOn, setReverbOn] = useState(false);
  const [delayOn, setDelayOn] = useState(false);
  const [feedback, setFeedback] = useState(0.4);
  const [delayTime, setDelayTime] = useState(300);

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

  const handleReverbToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !reverbOn;
    setReverbOn(next);
    toggleReverb(next);
  };

  const handleDelayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !delayOn;
    setDelayOn(next);
    toggleDelay(next);
  };

  const handleFeedbackChange = (val: number) => {
    setFeedback(val);
    setDelayFeedback(val);
  };

  const handleDelayTimeChange = (val: number) => {
    setDelayTime(val);
    applyDelayTime(val);
  };

  return (
    <div className="canvas-container" onClick={handleScreenClick}>
      <div className="master-controls" onClick={e => e.stopPropagation()}>
        <div className="ctrl-group">
          <button
            className={`ctrl-btn ${delayOn ? 'ctrl-btn--on' : ''}`}
            onClick={handleDelayToggle}
          >
            delay
          </button>
          <div className="ctrl-knobs">
            <Knob label="fdbk" min={0} max={1} value={feedback} onChange={handleFeedbackChange} />
            <Knob label="time" min={1} max={1000} value={delayTime} onChange={handleDelayTimeChange} />
          </div>
        </div>

        <button
          className={`ctrl-btn ${reverbOn ? 'ctrl-btn--on' : ''}`}
          onClick={handleReverbToggle}
        >
          reverb
        </button>
      </div>

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