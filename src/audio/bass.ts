import * as Tone from "tone";
import { limiter } from "./chain";
import { shiftOctave, getRandomPentatonicNote } from "./notes";

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const DOT_THRESHOLD = 16;
const BASS_DURATION = 18;
const MIN_OCTAVE = 2;

const noteToSemitone = (note: string): number => {
  const octave = parseInt(note.slice(-1));
  const name = note.slice(0, -1);
  return octave * 12 + NOTE_NAMES.indexOf(name);
};

const lowestNote = (notes: string[]): string =>
  notes.reduce((a, b) => noteToSemitone(a) <= noteToSemitone(b) ? a : b);

const clampOctave = (note: string, min: number): string => {
  const name = note.slice(0, -1);
  const octave = parseInt(note.slice(-1));
  return `${name}${Math.max(min, octave)}`;
};

export const bassSynth = new Tone.Synth({
  oscillator: { type: "triangle" },
  envelope: { attack: 0.05, decay: 18.0, sustain: 0, release: 0.1 },
}).connect(limiter);

let enabled = false;
let dotCount = 0;
let recentNotes: string[] = [];
const bassHistory: string[] = [];

export const enableBass = (on: boolean) => {
  enabled = on;
  if (on) {
    bassSynth.triggerAttackRelease("C2", BASS_DURATION, undefined, 0.1);
    dotCount = 0;
    recentNotes = [];
  }
};

export const notifyDotFired = (note: string) => {
  if (!enabled) return;
  recentNotes.push(note);
  dotCount++;
  if (dotCount >= DOT_THRESHOLD) {
    let bassNote = clampOctave(shiftOctave(lowestNote(recentNotes), -2), MIN_OCTAVE);

    // if last 3 bass notes were the same, pick a random pentatonic instead
    if (
      bassHistory.length >= 3 &&
      bassHistory.slice(-3).every(n => n === bassHistory[bassHistory.length - 1])
    ) {
      bassNote = clampOctave(shiftOctave(getRandomPentatonicNote(), -2), MIN_OCTAVE);
    }

    bassHistory.push(bassNote);
    bassSynth.triggerAttackRelease(bassNote, BASS_DURATION, undefined, 0.1);
    dotCount = 0;
    recentNotes = [];
  }
};

export const setBassWaveform = (type: "triangle" | "sine" | "square") => {
  bassSynth.set({ oscillator: { type } });
  bassSynth.volume.value = type === "square" ? -6 : 0;
};

export const setBassDetune = (semitones: number) => {
  bassSynth.set({ detune: semitones * 100 });
};