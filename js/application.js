// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  // Initialize settings manager
  var settingsManager = new SettingsManager();

  // Initialize sound and particle managers
  var soundManager = new SoundManager(settingsManager);
  var particleManager = new ParticleManager(settingsManager);

  // Initialize game manager
  var gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

  // Set managers on actuator
  gameManager.actuator.setSoundManager(soundManager);
  gameManager.actuator.setParticleManager(particleManager);
});
