import * as Tone from "tone";

export const C_PENTATONIC = ["C4", "D4", "E4", "G4", "A4"];

export const getRandomPentatonicNote = () => {
  return C_PENTATONIC[
    Math.floor(Math.random() * C_PENTATONIC.length)
  ];
};

const shiftOctave = (note: string, shift: number): string => {
  const noteName = note.slice(0, -1);
  const octave = parseInt(note.slice(-1));
  return `${noteName}${octave + shift}`;
};

export const generateBloomNotes = (count: number): string[] => {
  const notes: string[] = [];
  let allowF = false;
  let allowB = false;
  
  // bloom can sometimes have chromatic F or B as a little treat
  const chromaticRoll = Math.random();
  if (chromaticRoll < 0.125) {
    allowF = true;
  } else if (chromaticRoll < 0.25) {
    allowB = true;
  }
  
  for (let i = 0; i < count; i++) {
    let note: string;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      const useChromaticRoll = Math.random();
      const useChromaticThreshold = allowF || allowB ? 0.2 : 0; // 1/5 chance = 1/4 of pentatonic probability
      
      if (useChromaticRoll < useChromaticThreshold) {
        // use chromatic note (F or B depending on what's allowed)
        note = allowF ? "F4" : "B4";
      } else {
        note = getRandomPentatonicNote();
      }
      
      // octave shifts
      if (i === 0) {
        // lowest note: 20 % chance to go octave down
        if (Math.random() < 0.2) {
          note = shiftOctave(note, -1);
        }
      } else {
        // other notes: 10 % chance to go octave up
        if (Math.random() < 0.1) {
          note = shiftOctave(note, 1);
        }
      }
      
      attempts++;
      if (attempts >= maxAttempts) break;
      
    } while (
      notes.length > 0 && 
      notes.includes(note) && 
      note !== notes[0] // Allow repeating the lowest note
    );
    
    notes.push(note);
  }
  
  return notes;
};

export const limiter = new Tone.Limiter(-2).toDestination(); 

export const compressor = new Tone.Compressor(-20, 2).connect(limiter);

export const synth = new Tone.PolySynth(Tone.Synth, {oscillator: {type: "triangle"}}).connect(compressor);

export const startAudio = async () => {
  await Tone.start();
};
