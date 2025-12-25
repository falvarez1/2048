function SoundManager(settingsManager) {
  this.settingsManager = settingsManager;
  this.audioContext = null;
  this.initAudioContext();
}

SoundManager.prototype.initAudioContext = function () {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
  } catch (e) {
    // Audio not supported
    this.audioContext = null;
  }
};

SoundManager.prototype.playSound = function (frequency, duration, type) {
  if (!this.audioContext || !this.settingsManager.isSoundEnabled()) {
    return;
  }

  try {
    var oscillator = this.audioContext.createOscillator();
    var gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type || 'sine';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  } catch (e) {
    // Ignore audio errors
  }
};

SoundManager.prototype.playMove = function () {
  this.playSound(200, 0.05, 'sine');
};

SoundManager.prototype.playMerge = function (value) {
  // Higher value = higher pitch
  var baseFrequency = 300;
  var frequency = baseFrequency + Math.log2(value) * 50;
  this.playSound(frequency, 0.1, 'triangle');
};

SoundManager.prototype.playWin = function () {
  if (!this.audioContext || !this.settingsManager.isSoundEnabled()) {
    return;
  }

  // Play a pleasant chord progression
  var self = this;
  var notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
  notes.forEach(function (freq, index) {
    setTimeout(function () {
      self.playSound(freq, 0.3, 'sine');
    }, index * 100);
  });
};

SoundManager.prototype.playLose = function () {
  // Play descending notes
  this.playSound(400, 0.2, 'square');
  var self = this;
  setTimeout(function () {
    self.playSound(300, 0.3, 'square');
  }, 200);
};
