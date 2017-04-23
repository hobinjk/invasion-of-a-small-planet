function Bullet(world, x, y, vx, vy) {
  this.world = world;
  this.body = new p2.Body({
    mass: 1,
    position: [x, y]
  });
  this.body.gravityScale = 0;
  this.body.velocity[0] = vx;
  this.body.velocity[1] = vy;
  this.width = 0.08;
  this.height = 0.2;
  this.body.addShape(new p2.Rectangle(this.width, this.height));
  this.world.addBody(this.body);
}

Bullet.prototype.draw = function(gfx) {
  gfx.save();
  gfx.translate(this.getX(), this.getY());
  gfx.rotate(this.body.angle);
  gfx.fillStyle = '#ffffff';
  gfx.fillRect(
    -this.width / 2,
    -this.height / 2,
    this.width,
    this.height
  );
  gfx.restore();
};

Bullet.prototype.getX = function() {
  return this.body.position[0];
};

Bullet.prototype.getY = function() {
  return this.body.position[1];
};

