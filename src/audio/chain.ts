import * as Tone from "tone";

export const limiter = new Tone.Limiter(-2).toDestination();

export const reverb = new Tone.Reverb({ decay: 20, wet: 0 }).connect(limiter);

export const compressor = new Tone.Compressor(-20, 2).connect(reverb);

export const toggleReverb = (enabled: boolean) => {
    if (enabled) {
        reverb.wet.rampTo(1, 0.5);
    } else {
        reverb.wet.setValueAtTime(0, Tone.now());
    }
};