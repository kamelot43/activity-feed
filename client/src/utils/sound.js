class SoundManager {
    constructor() {
      this.audioContext = null;
      this.soundEnabled = true;
    }
  
    // Включаем/выключаем звук
    toggle() {
      this.soundEnabled = !this.soundEnabled;
      return this.soundEnabled;
    }
  
    async init() {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Важно: audioContext может быть suspended из-за политики браузера
      if (this.audioContext.state === 'suspended') {
        try {
          await this.audioContext.resume();
        } catch (e) {
          console.log('Не удалось запустить AudioContext');
        }
      }
    }
  
    // Звук нового поста (короткий "динь-дон")
    async playNewPost() {
      if (!this.soundEnabled) return;
      
      await this.init();
      if (this.audioContext.state !== 'running') return;
  
      const now = this.audioContext.currentTime;
      
      // Первая нота
      const osc1 = this.audioContext.createOscillator();
      const gain1 = this.audioContext.createGain();
      osc1.type = 'sine';
      osc1.frequency.value = 880; // Ля
      gain1.gain.setValueAtTime(0.1, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(this.audioContext.destination);
      
      // Вторая нота (чуть позже)
      const osc2 = this.audioContext.createOscillator();
      const gain2 = this.audioContext.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = 1320; // Ми
      gain2.gain.setValueAtTime(0.1, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc2.connect(gain2);
      gain2.connect(this.audioContext.destination);
  
      osc1.start(now);
      osc1.stop(now + 0.2);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.3);
    }
  
    // Звук лайка (короткий "клик")
    async playLike() {
      if (!this.soundEnabled) return;
      
      await this.init();
      if (this.audioContext.state !== 'running') return;
  
      const now = this.audioContext.currentTime;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = 440; // Ля
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
  
      osc.start(now);
      osc.stop(now + 0.1);
    }
  
    // Звук подключения (радостный)
    async playConnect() {
      if (!this.soundEnabled) return;
      
      await this.init();
      if (this.audioContext.state !== 'running') return;
  
      const now = this.audioContext.currentTime;
      
      // Три короткие ноты вверх
      const notes = [523.25, 659.25, 783.99]; // До, Ми, Соль
      
      notes.forEach((freq, i) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0.08, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
  
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
  
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.2);
      });
    }
  }
  
  export const sounds = new SoundManager();