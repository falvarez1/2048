function SettingsManager() {
  this.settingsOverlay = document.getElementById('settings-overlay');
  this.settingsButton = document.querySelector('.settings-button');
  this.closeButton = document.querySelector('.close-settings');

  this.themeToggle = document.getElementById('theme-toggle');
  this.soundToggle = document.getElementById('sound-toggle');
  this.particlesToggle = document.getElementById('particles-toggle');

  this.settings = this.loadSettings();
  this.applySettings();
  this.bindEvents();
}

SettingsManager.prototype.loadSettings = function () {
  var defaults = {
    darkMode: false,
    soundEnabled: true,
    particlesEnabled: true
  };

  try {
    var saved = localStorage.getItem('gameSettings');
    return saved ? Object.assign({}, defaults, JSON.parse(saved)) : defaults;
  } catch (e) {
    return defaults;
  }
};

SettingsManager.prototype.saveSettings = function () {
  try {
    localStorage.setItem('gameSettings', JSON.stringify(this.settings));
  } catch (e) {
    // Ignore storage errors
  }
};

SettingsManager.prototype.applySettings = function () {
  // Apply dark mode
  if (this.settings.darkMode) {
    document.body.classList.add('dark-mode');
    this.themeToggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    this.themeToggle.checked = false;
  }

  // Apply sound setting
  this.soundToggle.checked = this.settings.soundEnabled;

  // Apply particles setting
  this.particlesToggle.checked = this.settings.particlesEnabled;
};

SettingsManager.prototype.bindEvents = function () {
  var self = this;

  // Open settings
  this.settingsButton.addEventListener('click', function () {
    self.openSettings();
  });

  // Close settings
  this.closeButton.addEventListener('click', function () {
    self.closeSettings();
  });

  // Close on overlay click
  this.settingsOverlay.addEventListener('click', function (e) {
    if (e.target === self.settingsOverlay) {
      self.closeSettings();
    }
  });

  // Theme toggle
  this.themeToggle.addEventListener('change', function () {
    self.settings.darkMode = this.checked;
    self.saveSettings();
    self.applySettings();
  });

  // Sound toggle
  this.soundToggle.addEventListener('change', function () {
    self.settings.soundEnabled = this.checked;
    self.saveSettings();
  });

  // Particles toggle
  this.particlesToggle.addEventListener('change', function () {
    self.settings.particlesEnabled = this.checked;
    self.saveSettings();
  });
};

SettingsManager.prototype.openSettings = function () {
  this.settingsOverlay.classList.add('active');
};

SettingsManager.prototype.closeSettings = function () {
  this.settingsOverlay.classList.remove('active');
};

SettingsManager.prototype.isSoundEnabled = function () {
  return this.settings.soundEnabled;
};

SettingsManager.prototype.areParticlesEnabled = function () {
  return this.settings.particlesEnabled;
};
