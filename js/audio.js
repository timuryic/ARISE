/**
 * ARISE - Audio Module (Web Audio API)
 */

const SoundManager = {
    ctx: null,
    muted: false,

    init() {
        if (this.ctx) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        } catch (e) {
            console.error('Web Audio API not supported');
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    },

    play(type) {
        if (this.muted || !this.ctx) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        switch (type) {
            case 'click': this.generateClick(); break;
            case 'complete': this.generateComplete(); break;
            case 'undo': this.generateUndo(); break;
            case 'error': this.generateError(); break;
            case 'levelup': this.generateLevelUp(); break;
            case 'rankup': this.generateRankUp(); break;
        }
    },

    generateClick() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    },

    generateComplete() {
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99];

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            const start = now + (i * 0.05);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    },

    generateUndo() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },

    generateError() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    },

    generateLevelUp() {
        const now = this.ctx.currentTime;

        const oscBass = this.ctx.createOscillator();
        const gainBass = this.ctx.createGain();
        oscBass.connect(gainBass);
        gainBass.connect(this.ctx.destination);
        oscBass.type = 'square';
        oscBass.frequency.setValueAtTime(100, now);
        oscBass.frequency.exponentialRampToValueAtTime(50, now + 1.0);
        gainBass.gain.setValueAtTime(0.3, now);
        gainBass.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        oscBass.start(now);
        oscBass.stop(now + 1.5);

        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            const start = now + (i * 0.1);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.1, start + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 2.0);
            osc.start(start);
            osc.stop(start + 2.0);
        });
    },

    generateRankUp() {
        this.generateLevelUp();
        setTimeout(() => {
            this.generateLevelUp();
        }, 300);
    }
};
