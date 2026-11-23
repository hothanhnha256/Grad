"use client";

import { useSyncExternalStore } from "react";

/* Everything here is synthesized with Web Audio — no audio files to load.
   The AudioContext must be created/resumed inside a user gesture (iOS). */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Cartoon "pop" for opening the envelope. */
export function playPop() {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(900, t);
  osc.frequency.exponentialRampToValueAtTime(170, t + 0.14);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.6, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.2);
}

/* ---------------- music box ---------------- */

// An original little music-box waltz (MIDI note numbers, 0 = rest), 3 beats per bar.
const MELODY = [
  76, 79, 84, 83, 81, 79, 77, 81, 86, 84, 83, 81, 79, 76, 72, 76, 79, 84, 83, 79, 74, 79, 83, 86,
  84, 0, 79, 81, 79, 76, 77, 76, 74, 72, 74, 76, 77, 81, 79, 77, 76, 74, 72, 0, 72, 72, 0, 0,
];
const BASS = [48, 53, 48, 55, 48, 53, 55, 48]; // one note per bar
const BEAT = 0.34;

const midiHz = (m: number) => 440 * 2 ** ((m - 69) / 12);

function chime(ac: AudioContext, out: AudioNode, hz: number, t: number, vol: number, len = 1.4) {
  for (const [mult, amp] of [
    [1, 1],
    [3, 0.18],
    [5.4, 0.06],
  ] as const) {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.value = hz * mult;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol * amp, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len / mult);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + len);
  }
}

let master: GainNode | null = null;
let timer: number | null = null;
let step = 0;
let nextAt = 0;
let playing = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function schedule() {
  const ac = ctx;
  if (!ac || !master) return;
  while (nextAt < ac.currentTime + 0.25) {
    const note = MELODY[step % MELODY.length];
    if (note) chime(ac, master, midiHz(note), nextAt, 0.22);
    if (step % 3 === 0) chime(ac, master, midiHz(BASS[Math.floor(step / 3) % BASS.length]), nextAt, 0.12, 2.2);
    step++;
    nextAt += BEAT;
  }
}

export function playMusic() {
  const ac = getCtx();
  if (!ac || playing) return;
  if (!master) {
    master = ac.createGain();
    master.connect(ac.destination);
  }
  master.gain.cancelScheduledValues(ac.currentTime);
  master.gain.setValueAtTime(0.0001, ac.currentTime);
  master.gain.exponentialRampToValueAtTime(0.8, ac.currentTime + 0.6);
  nextAt = ac.currentTime + 0.1;
  timer = window.setInterval(schedule, 80);
  playing = true;
  emit();
}

export function stopMusic() {
  if (!playing) return;
  if (timer !== null) window.clearInterval(timer);
  timer = null;
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15);
  }
  playing = false;
  emit();
}

export const toggleMusic = () => (playing ? stopMusic() : playMusic());

export function useMusicPlaying(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => playing,
    () => false,
  );
}
