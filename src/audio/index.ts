import * as Tone from "tone";
import { compressor1 } from "./chain";
import { setBassDetune, setBassWaveform } from "./bass";

export { limiter, compressor1, reverb, toggleReverb, delay, toggleDelay, setDelayFeedback, setDelayTime as applyDelayTime } from "./chain";
export { generateBloomNotes, getRandomPentatonicNote, C_PENTATONIC, shiftOctave, noteToSemitone, lowestNote } from "./notes";
export { enableBass, notifyDotFired } from "./bass";
export { startRecording, stopRecording, isRecordingSupported } from "./gptRecorder";

export const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "sine" },
  detune: 400,
}).connect(compressor1);

export const setPitch = (semitones: number) => {
  synth.set({ detune: semitones * 100 });
  setBassDetune(semitones);
};

export const setWaveform = (type: "triangle" | "sine" | "square") => {
  synth.set({ oscillator: { type } });
  setBassWaveform(type);
  synth.volume.value = type === "square" ? -6 : 0;
};

export const startAudio = async () => {
  await Tone.start();
};