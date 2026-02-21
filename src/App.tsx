import { useState } from "react";
import { BloomVisual } from "./components/BloomVisual";
import { Knob } from "./components/Knob";
import { Visualizer } from "./components/Visualizer";
import { useBlooms } from "./hooks/useBlooms";
import { startAudio, toggleReverb, toggleDelay, setDelayFeedback, applyDelayTime, setPitch, setWaveform, enableBass, startRecording, stopRecording, isRecordingSupported } from "./audio";
import "./App.css";

type Waveform = "triangle" | "sine" | "square";

function App() {
  const { blooms, createBloom, dismissBloom, removeBloom } = useBlooms();
  const [audioStarted, setAudioStarted] = useState(false);
  const [reverbOn, setReverbOn] = useState(false);
  const [delayOn, setDelayOn] = useState(true);
  const [bassOn, setBassOn] = useState(false);
  const [recordState, setRecordState] = useState<'idle' | 'choosing' | 'recording'>('idle');
  const [feedback, setFeedback] = useState(0.4);
  const [delayTime, setDelayTime] = useState(300);
  const [pitch, setPitchState] = useState(4);
  const [waveform, setWaveformState] = useState<Waveform>("sine");

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

  const handleBassToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !bassOn;
    setBassOn(next);
    enableBass(next);
  };

  const handleRecordToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRecordingSupported()) return;
    if (recordState === 'recording') {
      stopRecording();
      setRecordState('idle');
    } else {
      setRecordState('choosing');
    }
  };

  const handleRecordChoice = (e: React.MouseEvent, wet: boolean) => {
    e.stopPropagation();
    startRecording(wet);
    setRecordState('recording');
  };

  const handleFeedbackChange = (val: number) => {
    setFeedback(val);
    setDelayFeedback(val);
  };

  const handleDelayTimeChange = (val: number) => {
    setDelayTime(val);
    applyDelayTime(val);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setPitchState(val);
    setPitch(val);
  };

  const handleWaveformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Waveform;
    setWaveformState(val);
    setWaveform(val);
  };

  const stopProp = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div className="canvas-container" onClick={handleScreenClick}>

      <div className="master-controls" onClick={stopProp}>

        <div className="rec-group">
          {isRecordingSupported() ? (
            recordState === 'choosing' ? (
              <>
                <button className="ctrl-btn" onClick={e => handleRecordChoice(e, false)}>dry</button>
                <button className="ctrl-btn" onClick={e => handleRecordChoice(e, true)}>wet</button>
              </>
            ) : (
              <button
                className={`ctrl-btn ${recordState === 'recording' ? 'ctrl-btn--recording' : ''}`}
                onClick={handleRecordToggle}
              >
                {recordState === 'recording' ? 'stop' : 'rec'}
              </button>
            )
          ) : (
            <span className="ctrl-label ctrl-unsupported" title="Recording not supported on this browser">rec ✕</span>
          )}
        </div>

        <select
          className="ctrl-select"
          value={waveform}
          onChange={handleWaveformChange}
          onClick={stopProp}
          onTouchStart={stopProp}
        >
          <option value="triangle">triangle</option>
          <option value="sine">sine</option>
          <option value="square">square</option>
        </select>

        <div className="ctrl-group">
          <span className="ctrl-label">pitch</span>
          <input
            type="range"
            className="ctrl-slider"
            min={-12}
            max={12}
            step={1}
            value={pitch}
            onChange={handlePitchChange}
            onClick={stopProp}
            onTouchStart={stopProp}
          />
        </div>

        <button
          className={`ctrl-btn ${bassOn ? 'ctrl-btn--on' : ''}`}
          onClick={handleBassToggle}
        >
          bass
        </button>

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

      <Visualizer
        audioStarted={audioStarted}
        recordState={recordState}
      />
    </div>
  );
}

export default App;