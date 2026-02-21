import { getContext } from "tone";
import { limiter } from "./chain";

// webaudio api is a bit awkward so we use a singleton analyser node that we connect to the limiter

let analyser: AnalyserNode | null = null;


export function getOrCreateAnalyser(): AnalyserNode {
  if (analyser) return analyser;

  const rawCtx = getContext().rawContext as AudioContext;
  analyser = rawCtx.createAnalyser();
  analyser.fftSize = 32768;
  analyser.smoothingTimeConstant = 0;

  // limiter connects to both destination and analyser I think this is fine
  limiter.connect(analyser);

  return analyser;
}

export function getAudioSampleRate(): number {
  return (getContext().rawContext as AudioContext).sampleRate;
}
