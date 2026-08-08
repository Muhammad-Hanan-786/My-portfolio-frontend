// Procedural cute sound library using Web Audio API.
// No network, no assets, instant playback. Safe to call from any handler.

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.14, slideTo?: number) {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo != null) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export type SoundName =
  | "hover"
  | "click"
  | "pop"
  | "nav"
  | "success"
  | "error"
  | "boing"
  | "giggle"
  | "type";

export function playSound(name: SoundName) {
  switch (name) {
    case "hover":
      tone(880, 0.08, "sine", 0.06, 1200);
      break;
    case "click":
      tone(520, 0.09, "triangle", 0.14, 720);
      setTimeout(() => tone(720, 0.08, "sine", 0.1), 40);
      break;
    case "pop":
      tone(300, 0.06, "square", 0.1, 900);
      break;
    case "nav":
      tone(440, 0.09, "triangle", 0.12);
      setTimeout(() => tone(660, 0.09, "triangle", 0.12), 60);
      setTimeout(() => tone(880, 0.12, "sine", 0.12), 120);
      break;
    case "success":
      tone(523, 0.12, "sine", 0.14);
      setTimeout(() => tone(659, 0.12, "sine", 0.14), 90);
      setTimeout(() => tone(784, 0.18, "sine", 0.14), 180);
      setTimeout(() => tone(1046, 0.22, "sine", 0.14), 270);
      break;
    case "error":
      tone(300, 0.14, "sawtooth", 0.1, 180);
      setTimeout(() => tone(220, 0.2, "sawtooth", 0.1, 130), 130);
      break;
    case "boing":
      tone(200, 0.35, "triangle", 0.16, 900);
      break;
    case "giggle":
      [780, 940, 820, 1000, 880].forEach((f, i) =>
        setTimeout(() => tone(f, 0.07, "sine", 0.09), i * 65)
      );
      break;
    case "type":
      // Typing sound removed
      break;

  }
}

export function setMuted(v: boolean) {
  muted = v;
}
export function isMuted() {
  return muted;
}
