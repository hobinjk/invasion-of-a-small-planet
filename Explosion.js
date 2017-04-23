function Explosion(x, y) {
  this.x = x;
  this.y = y;
  this.startTime = Date.now();
  this.duration = 200;
  this.angle = Math.random() * 2 * Math.PI;
  this.radius = 1;
  this.alive = true;
}

Explosion.prototype.update = function() {
  this.alive = Date.now() - this.startTime < this.duration;
};

Explosion.prototype.draw = function(gfx) {
  gfx.strokeStyle = 'red';
  var radius = (Date.now() - this.startTime) / this.duration * this.radius;
  gfx.save();
  gfx.translate(this.x, this.y);
  gfx.rotate(this.angle);
  strokeCircle(gfx, radius, 6);
  gfx.restore();
};

