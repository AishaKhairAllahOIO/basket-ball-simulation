export class AudioManager {
  constructor() {
    this.ctx = null;
    this.gain = null;
    this.muted = false;
  }

  async playBackground(url, { volume = 0.3, fadeIn = 2 } = {}) {
    if (this.ctx) return; 

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    try {
      const res = await fetch(url);
      const buffer = await this.ctx.decodeAudioData(await res.arrayBuffer());

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + fadeIn);

      source.connect(this.gain).connect(this.ctx.destination);
      source.start();
    } catch (err) {
      console.warn("تعذر تشغيل صوت الخلفية:", err);
    }
  }

  toggleMute() {
    if (!this.gain) return;
    this.muted = !this.muted;
    this.gain.gain.value = this.muted ? 0 : 0.3;
    return this.muted;
  }
}