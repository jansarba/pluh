// by the book fft
export function fft(input: Float32Array): Float32Array {
  const N = input.length;
  const logN = Math.log2(N) | 0;
  const re = new Float32Array(N);
  const im = new Float32Array(N);

  // permute input bit reverse 
  for (let i = 0; i < N; i++) {
    re[bitReverse(i, logN)] = input[i];
  }

  // butterfly
  for (let s = 1; s <= logN; s++) {
    const m = 1 << s;
    const half = m >> 1;
    const angle = (-2 * Math.PI) / m;
    const wRe = Math.cos(angle);
    const wIm = Math.sin(angle);

    for (let k = 0; k < N; k += m) {
      let tRe = 1;
      let tIm = 0;

      for (let j = 0; j < half; j++) {
        const e = k + j;
        const o = e + half;

        const vRe = re[o] * tRe - im[o] * tIm;
        const vIm = re[o] * tIm + im[o] * tRe;

        re[o] = re[e] - vRe;
        im[o] = im[e] - vIm;
        re[e] += vRe;
        im[e] += vIm;

        const tmp = tRe * wRe - tIm * wIm;
        tIm = tRe * wIm + tIm * wRe;
        tRe = tmp;
      }
    }
  }

  //magnitute spectrum
  const bins = (N >> 1) + 1;
  const mag = new Float32Array(bins);
  const scale = 2 / N;
  for (let i = 0; i < bins; i++) {
    mag[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]) * scale;
  }
  return mag;
}

function bitReverse(x: number, bits: number): number {
  let r = 0;
  for (let i = 0; i < bits; i++) {
    r = (r << 1) | (x & 1);
    x >>= 1;
  }
  return r;
}

// inplace Hann window just in case
export function hannWindow(data: Float32Array): Float32Array {
  const N = data.length;
  const k = (2 * Math.PI) / (N - 1);
  for (let i = 0; i < N; i++) {
    data[i] *= 0.5 * (1 - Math.cos(k * i));
  }
  return data;
}
