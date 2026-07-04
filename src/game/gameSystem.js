import * as THREE from "three";
import { physicsConfig } from "../physics/config/physicsConfig.js";
import { basketballDimensions } from "../physics/constants/studyConstants.js";

const GAME_DURATION_SECONDS = 60;

const state = {
  score: 0,
  misses: 0,
  timeRemaining: GAME_DURATION_SECONDS,
  gameActive: false,
  gameFinished: false,
  timerInterval: null,
  overlay: null,
  endOverlay: null,
  startOverlay: null,
  scoreEl: null,
  missesEl: null,
  timerEl: null,
  resultEl: null,
  restartButton: null,
  startButton: null,
  settingsButton: null,
  audioToggleButton: null,
  onStart: null,
  onRestart: null,
  listener: null,
  audio: {},
  audioReady: false,
  shotActive: false,
  shotResolved: false,
};

function ensureDom() {
  if (state.overlay) return;

  state.startOverlay = document.getElementById("start-overlay");
  state.endOverlay = document.getElementById("end-overlay");
  state.scoreEl = document.getElementById("score-value");
  state.missesEl = document.getElementById("misses-value");
  state.timerEl = document.getElementById("timer-value");
  state.resultEl = document.getElementById("result-text");
  state.startButton = document.getElementById("start-button");
  state.settingsButton = document.getElementById("settings-button");
  state.restartButton = document.getElementById("restart-button");
  state.audioToggleButton = document.getElementById("audio-toggle-button");
}

function updateScoreboard() {
  ensureDom();
  if (state.scoreEl) state.scoreEl.textContent = String(state.score);
  if (state.missesEl) state.missesEl.textContent = String(state.misses);
  if (state.timerEl) state.timerEl.textContent = formatTime(state.timeRemaining);
  if (state.audioToggleButton) {
    state.audioToggleButton.textContent = state.muted ? "🔈 Audio Off" : "🔊 Audio On";
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function createWavDataUrl(frequency, durationSeconds, volume = 0.35) {
  const sampleRate = 22050;
  const length = Math.floor(sampleRate * durationSeconds);
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);

  const writeString = (offset, value) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, length * 2, true);

  for (let i = 0; i < length; i += 1) {
    const t = i / sampleRate;
    const envelope = Math.max(0, 1 - t / durationSeconds);
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * volume;
    view.setInt16(44 + i * 2, sample * 0x7fff, true);
  }

  let binary = "";
  const bytes = new Uint8Array(buffer);
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return `data:audio/wav;base64,${btoa(binary)}`;
}

function loadSound(key, frequency, durationSeconds, volume) {
  const sound = new THREE.Audio(state.listener);
  const loader = new THREE.AudioLoader();
  const url = createWavDataUrl(frequency, durationSeconds, volume);

  loader.load(url, (buffer) => {
    sound.setBuffer(buffer);
    sound.setVolume(volume);
    state.audio[key] = sound;
    state.audioReady = true;
  });

  state.audio[key] = sound;
}

export function initUI({ onStart, onRestart } = {}) {
  ensureDom();
  state.onStart = onStart;
  state.onRestart = onRestart;

  if (state.audioToggleButton) {
    state.audioToggleButton.addEventListener("click", () => {
      state.muted = !state.muted;
      updateScoreboard();
    });
  }

  if (state.startButton) {
    state.startButton.addEventListener("click", () => {
      state.startOverlay?.classList.add("is-hidden");
      state.onStart?.();
      startGame();
    });
  }

  if (state.restartButton) {
    state.restartButton.addEventListener("click", () => {
      state.endOverlay?.classList.add("is-hidden");
      state.onRestart?.();
      startGame();
    });
  }

  if (state.settingsButton) {
    state.settingsButton.addEventListener("click", () => {
      const panel = document.querySelector(".physics-panel");
      if (panel) {
        panel.classList.toggle("is-open");
      }
    });
  }

  updateScoreboard();
}

export function initAudio(camera) {
  if (!camera) return;

  state.listener = new THREE.AudioListener();
  camera.add(state.listener);

  loadSound("bounce", 420, 0.12, 0.28);
  loadSound("rim", 640, 0.16, 0.34);
  loadSound("swish", 980, 0.2, 0.24);
  loadSound("board", 260, 0.14, 0.22);
  loadSound("start", 780, 0.18, 0.3);
}

export function startGame() {
  state.score = 0;
  state.misses = 0;
  state.muted = false;
  state.timeRemaining = GAME_DURATION_SECONDS;
  state.gameActive = true;
  state.gameFinished = false;
  state.shotActive = true;
  state.shotResolved = false;
  state.timerPaused = false;
  updateScoreboard();

  state.startOverlay?.classList.add("is-hidden");
  state.endOverlay?.classList.add("is-hidden");

  clearInterval(state.timerInterval);
  state.timerInterval = window.setInterval(() => {
    updateTimer(1);
  }, 1000);

  playStartSound();
}

export function pauseTimer() {
  state.timerPaused = true;
}

export function resumeTimer() {
  state.timerPaused = false;
}

export function updateTimer(delta = 1) {
  if (!state.gameActive || state.timerPaused) return;

  state.timeRemaining = Math.max(0, state.timeRemaining - delta);
  updateScoreboard();

  if (state.timeRemaining <= 0) {
    endGame();
  }
}

export function detectScore(ball) {
  if (!state.gameActive || !state.shotActive || state.shotResolved) return false;

  const rim = basketballDimensions.hoop.position;
  const rimHeight = physicsConfig.hoop.height;
  const rimRadius = physicsConfig.hoop.rimRadius;

  const dx = ball.position.x - rim.x;
  const dz = ball.position.z - rim.z;
  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
  const safeRadius = Math.max(0.08, rimRadius - ball.radius);
  const isNearRimPlane = ball.position.y <= rimHeight + 0.02 && ball.position.y >= rimHeight - 0.24;
  const isMovingDown = ball.velocity.y < 0;
  const isInsideTarget = horizontalDistance <= safeRadius + 0.02;

  if (isNearRimPlane && isMovingDown && isInsideTarget) {
    state.score += 1;
    state.shotResolved = true;
    state.shotActive = false;
    updateScoreboard();
    playSwishSound();
    return true;
  }

  return false;
}

export function detectMiss(ball) {
  if (!state.gameActive || !state.shotActive || state.shotResolved) return false;

  const rim = basketballDimensions.hoop.position;
  const rimHeight = physicsConfig.hoop.height;
  const rimRadius = physicsConfig.hoop.rimRadius;
  const dx = ball.position.x - rim.x;
  const dz = ball.position.z - rim.z;
  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

  const hitGround = ball.position.y <= ball.radius + 0.01;
  const passedRimPlane = ball.position.y <= rimHeight - 0.15 && ball.velocity.y < 0;
  const missedRim = passedRimPlane && horizontalDistance > rimRadius + 0.08;

  if (hitGround || missedRim) {
    state.misses += 1;
    state.shotResolved = true;
    state.shotActive = false;
    updateScoreboard();
    return true;
  }

  return false;
}

function playSound(key) {
  if (state.muted || !state.audioReady) return;
  const sound = state.audio[key];
  if (sound && !sound.isPlaying) {
    sound.play();
  }
}

export function playBounceSound() {
  playSound("bounce");
}

export function playRimSound() {
  playSound("rim");
}

export function playSwishSound() {
  playSound("swish");
}

export function playBackboardSound() {
  playSound("board");
}

function playStartSound() {
  playSound("start");
}

export function endGame() {
  if (!state.gameActive) return;

  state.gameActive = false;
  state.gameFinished = true;
  clearInterval(state.timerInterval);

  const resultMessage = state.score > state.misses ? "YOU WIN" : "YOU LOSE";
  if (state.resultEl) {
    state.resultEl.textContent = `${resultMessage}\nScore ${state.score} · Misses ${state.misses}`;
  }

  state.endOverlay?.classList.remove("is-hidden");
}

export function getGameState() {
  return {
    score: state.score,
    misses: state.misses,
    timeRemaining: state.timeRemaining,
    gameActive: state.gameActive,
    gameFinished: state.gameFinished,
  };
}

export function resetShotState() {
  state.shotActive = true;
  state.shotResolved = false;
}

export function toggleAudio() {
  state.muted = !state.muted;
  updateScoreboard();
}
