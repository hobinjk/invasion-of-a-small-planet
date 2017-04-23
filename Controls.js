function Controls(player) {
  this.player = player;

  this.left = false;
  this.right = false;
  this.onKeyDown = this.onKeyDown.bind(this);
  this.onKeyUp = this.onKeyUp.bind(this);

  window.addEventListener('keydown', this.onKeyDown);
  window.addEventListener('keyup', this.onKeyUp);
}

Controls.prototype.onKeyDown = function(event) {
  if (event.key === 'a' || event.keyCode === 65) {
    if (!this.left) {
      this.left = Date.now();
    }
  } else if (event.key === 'd' || event.keyCode === 68) {
    if (!this.right) {
      this.right = Date.now();
    }
  }

  if (event.key === ' ' || event.keyCode == 32) {
    this.player.fire();
  }

  if (event.key === 'e' || event.keyCode === 69) {
    this.player.flip(100);
  }

  if (event.key === 'q' || event.keyCode === 81) {
    this.player.flip(-100);
  }
};

Controls.prototype.update = function() {
  var impulse = 0;
  if (this.right) {
    impulse = 3;
  } else if (this.left) {
    impulse = -3;
  }
  this.player.setMotor(impulse);
};

Controls.prototype.onKeyUp = function(event) {
  if (event.key === 'a' || event.keyCode === 65) {
    this.left = null;
  } else if (event.key === 'd' || event.keyCode === 68) {
    this.right = null;
  }
};
