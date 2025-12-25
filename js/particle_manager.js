function ParticleManager(settingsManager) {
  this.settingsManager = settingsManager;
  this.particleContainer = document.querySelector('.particle-container');
}

ParticleManager.prototype.createParticleBurst = function (x, y, color, count) {
  if (!this.settingsManager.areParticlesEnabled() || !this.particleContainer) {
    return;
  }

  count = count || 20;

  for (var i = 0; i < count; i++) {
    this.createParticle(x, y, color, i, count);
  }
};

ParticleManager.prototype.createParticle = function (x, y, color, index, total) {
  var particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.background = color;
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';

  // Calculate trajectory in a circular pattern
  var angle = (Math.PI * 2 * index) / total;
  var velocity = 80 + Math.random() * 40;
  var tx = Math.cos(angle) * velocity;
  var ty = Math.sin(angle) * velocity;

  particle.style.setProperty('--tx', tx + 'px');
  particle.style.setProperty('--ty', ty + 'px');

  this.particleContainer.appendChild(particle);

  // Remove particle after animation
  setTimeout(function () {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 1000);
};

ParticleManager.prototype.celebrate2048 = function () {
  if (!this.settingsManager.areParticlesEnabled()) {
    return;
  }

  var self = this;
  var colors = ['#edc22e', '#f67c5f', '#f59563', '#f2b179'];

  // Create multiple bursts across the container
  for (var i = 0; i < 5; i++) {
    setTimeout(function () {
      var x = Math.random() * 500;
      var y = Math.random() * 500;
      var color = colors[Math.floor(Math.random() * colors.length)];
      self.createParticleBurst(x, y, color, 30);
    }, i * 200);
  }
};
