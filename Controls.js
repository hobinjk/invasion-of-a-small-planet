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
};

Controls.prototype.update = function() {
  var impulse = 0;
  if (this.right) {
    impulse = -10; // Math.min((Date.now() - this.right) / 50, 10);
  } else if (this.left) {
    impulse = 10; //Math.min((Date.now() - this.left) / 50, 10);
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
