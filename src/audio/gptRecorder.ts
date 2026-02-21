import * as Tone from "tone";
import { limiter, compressor1 } from "./chain";

let mediaRecorder: MediaRecorder | null = null;
let chunks: BlobPart[] = [];
let destNode: MediaStreamAudioDestinationNode | null = null;
let currentWet = false;

export const isRecordingSupported = () => typeof MediaRecorder !== "undefined";

export const startRecording = (wet: boolean) => {
  currentWet = wet;
  const ctx = Tone.getContext().rawContext as AudioContext;
  destNode = ctx.createMediaStreamDestination();

  const sourceNode = wet ? limiter : compressor1;
  sourceNode.connect(destNode as unknown as Tone.ToneAudioNode);

  chunks = [];
  mediaRecorder = new MediaRecorder(destNode.stream);
  mediaRecorder.ondataavailable = e => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    const mimeType = mediaRecorder?.mimeType ?? "audio/webm";
    const ext = mimeType.includes("mp4") ? "mp4" : "webm";
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bloom-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    if (destNode) {
      const sourceNode = currentWet ? limiter : compressor1;
      sourceNode.disconnect(destNode as unknown as Tone.ToneAudioNode);
      destNode = null;
    }
  };

  mediaRecorder.start();
};

export const stopRecording = () => {
  mediaRecorder?.stop();
  mediaRecorder = null;
};