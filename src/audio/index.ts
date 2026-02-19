import * as Tone from "tone";
import { compressor } from "./chain";

export { limiter, compressor, reverb, toggleReverb } from "./chain";
export { generateBloomNotes, getRandomPentatonicNote, C_PENTATONIC } from "./notes";

export const synth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" } }).connect(compressor);

export const startAudio = async () => {
  await Tone.start();
};