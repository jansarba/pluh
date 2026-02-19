import * as Tone from "tone";

export const limiter = new Tone.Limiter(-2).toDestination();
export const compressor = new Tone.Compressor(-20, 2).connect(limiter);

// To add master effects later:
// 1. Create the effect node here
// 2. Insert it between masterCompressor and masterLimiter
// e.g.:
//   export const masterReverb = new Tone.Reverb(2).connect(masterLimiter);
//   masterCompressor.connect(masterReverb);