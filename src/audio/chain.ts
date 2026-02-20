import * as Tone from "tone";

export const limiter = new Tone.Limiter(-3).toDestination();

export const reverb = new Tone.Reverb({ decay: 20, wet: 0 }).connect(limiter);

export const delay = new Tone.FeedbackDelay({ delayTime: 0.3, feedback: 0.5, wet: 1 }).connect(reverb);

export const compressor = new Tone.Compressor(-20, 3).connect(delay);

export const toggleReverb = (enabled: boolean) => {
    if (enabled) {
        reverb.wet.rampTo(1, 0.5);
    } else {
        reverb.wet.setValueAtTime(0, Tone.now());
    }
};

export const toggleDelay = (enabled: boolean) => {
    if (enabled) {
        delay.wet.rampTo(1, 0.5);
    } else {
        delay.wet.setValueAtTime(0, Tone.now());
    }
};

export const setDelayFeedback = (value: number) => {
  delay.feedback.value = value;
};

export const setDelayTime = (ms: number) => {
  delay.delayTime.value = ms / 1000;
};