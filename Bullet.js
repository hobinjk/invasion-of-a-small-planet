function Bullet(world, x, y, vx, vy) {
  this.world = world;
  this.body = new p2.Body({
    mass: 4,
    position: [x, y]
  });
  this.body.angle = Math.atan2(vy, vx) + Math.PI / 2;
  this.body.gravityScale = 0;
  this.body.velocity[0] = vx;
  this.body.velocity[1] = vy;
  this.width = 0.08;
  this.height = 0.2;
  var shape = new p2.Rectangle(this.width, this.height);
  shape.collisionGroup = BULLET;
  shape.collisionMask = PLAYER | PLANET | ENEMY | BULLET;
  this.body.addShape(shape);
  this.world.addBody(this.body);
}

Bullet.prototype.draw = function(gfx) {
  gfx.save();
  gfx.translate(this.getX(), this.getY());
  gfx.rotate(this.body.angle);
  gfx.strokeStyle = '#ff0000';
  gfx.beginPath();
  gfx.moveTo(0, -this.height / 2);
  gfx.lineTo(0, this.height);
  gfx.stroke();
  gfx.restore();
};

Bullet.prototype.getX = function() {
  return this.body.position[0];
};

Bullet.prototype.getY = function() {
  return this.body.position[1];
};

