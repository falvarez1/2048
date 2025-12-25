function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.movesContainer   = document.querySelector(".moves-count");

  this.score = 0;
  this.soundManager = null;
  this.particleManager = null;
}

HTMLActuator.prototype.setSoundManager = function (soundManager) {
  this.soundManager = soundManager;
};

HTMLActuator.prototype.setParticleManager = function (particleManager) {
  this.particleManager = particleManager;
};

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);
    self.updateMoves(metadata.moves);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false, metadata); // You lose
        if (self.soundManager) {
          self.soundManager.playLose();
        }
      } else if (metadata.won) {
        self.message(true, metadata); // You win!
        if (self.soundManager) {
          self.soundManager.playWin();
        }
        if (self.particleManager) {
          self.particleManager.celebrate2048();
        }
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Play merge sound
    if (this.soundManager) {
      this.soundManager.playMerge(tile.value);
    }

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  var difference = score - this.score;

  if (difference > 0) {
    // Animate score counting
    this.animateScore(this.score, score);

    // Show score addition
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;
    this.scoreContainer.appendChild(addition);
  } else {
    this.scoreContainer.textContent = score;
  }

  this.score = score;
};

HTMLActuator.prototype.animateScore = function (oldScore, newScore) {
  var self = this;
  var range = newScore - oldScore;
  var duration = 300;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    var eased = 1 - Math.pow(1 - progress, 3);
    var currentScore = Math.floor(oldScore + range * eased);

    self.scoreContainer.textContent = currentScore;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      self.scoreContainer.textContent = newScore;
    }
  }

  window.requestAnimationFrame(step);
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.updateMoves = function (moves) {
  if (this.movesContainer) {
    this.movesContainer.textContent = moves;
  }
};

HTMLActuator.prototype.message = function (won, metadata) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  // Add statistics to message
  if (metadata && metadata.moves) {
    message += "\n";
    if (won) {
      message = "Congratulations! You reached 2048!";
    } else {
      message = "Game over!";
    }
  }

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
