function Player(game, world, planet) {
  this.game = game;
  this.world = world;
  this.planet = planet;

  // This draws from the p2.js car demo because it's a car
  // also the suspension demo for the sweet suspension

  this.chassis = new p2.Body({
    position: [0, 4.4],
    mass: 4
  });
  function setCollision(shape) {
    shape.collisionMask = PLANET | ENEMY | BULLET;
    shape.collisionGroup = PLAYER;
    return shape;
  }
  this.chassisWidth = 1;
  this.chassisHeight = 0.4;
  this.chassis.addShape(
    setCollision(new p2.Rectangle(this.chassisWidth, this.chassisHeight)));
  this.world.addBody(this.chassis);

  this.wheelRadius = 0.4;
  this.wheelLeft = new p2.Body({
    position: [this.chassis.position[0] - 0.5, this.chassis.position[1]],
    mass: 0.5
  });
  this.wheelLeft.collisionGroup = PLAYER;
  this.wheelLeft.addShape(
    setCollision(new p2.Circle(this.wheelRadius)));
  this.world.addBody(this.wheelLeft);

  this.wheelRight = new p2.Body({
    position: [this.chassis.position[0] + 0.5, this.chassis.position[1]],
    mass: 0.5
  });
  this.wheelRight.collisionGroup = PLAYER;
  this.wheelRight.addShape(
    setCollision(new p2.Circle(this.wheelRadius)));
  this.world.addBody(this.wheelRight);

  var prismLeft = new p2.PrismaticConstraint(this.chassis, this.wheelLeft, {
    localAnchorA: [-0.5, -0.3],
    localAnchorB: [0, 0],
    localAxisA: [0, 1],
    disableRotationalLock: true
  });

  var prismRight = new p2.PrismaticConstraint(this.chassis, this.wheelRight, {
    localAnchorA: [0.5, -0.3],
    localAnchorB: [0, 0],
    localAxisA: [0, 1],
    disableRotationalLock: true
  });

  prismLeft.setLimits(-0.4, 0.2);
  prismRight.setLimits(-0.4, 0.2);
  this.world.addConstraint(prismLeft);
  this.world.addConstraint(prismRight);

  var stiffness = 100;
  var damping = 5;
  var restLength = 0.4;

  this.world.addSpring(new p2.LinearSpring(this.chassis, this.wheelLeft, {
    restLength: restLength,
    stiffness: stiffness,
    damping: damping,
    localAnchorA: [-0.5, 0],
    localAnchorB: [0, 0]
  }));

  this.world.addSpring(new p2.LinearSpring(this.chassis, this.wheelRight, {
    restLength: restLength,
    stiffness: stiffness,
    damping: damping,
    localAnchorA: [0.5, 0],
    localAnchorB: [0, 0]
  }));

  this.impulse = 0;
}

Player.prototype.update = function() {
  var max = 50;
  if (this.wheelLeft.angularVelocity * this.impulse < max) {
    this.wheelLeft.angularForce += this.impulse;
  }
  if (this.wheelRight.angularVelocity * this.impulse < max) {
    this.wheelRight.angularForce += this.impulse;
  }
};

Player.prototype.getX = function() {
  return this.chassis.position[0];
};

Player.prototype.getY = function() {
  return this.chassis.position[1];
};

Player.prototype.draw = function(gfx) {
  gfx.save();
  gfx.translate(this.getX(), this.getY());
  gfx.rotate(this.chassis.angle);
  gfx.strokeStyle = '#00ffff';
  gfx.strokeRect(
    -this.chassisWidth / 2,
    -this.chassisHeight / 2,
    this.chassisWidth,
    this.chassisHeight
  );
  gfx.restore();

  gfx.strokeStyle = '#ffa400';
  this.drawWheel(gfx, this.wheelRight);
  this.drawWheel(gfx, this.wheelLeft);
};

Player.prototype.drawWheel = function(gfx, wheel) {
  gfx.save();
  gfx.translate(wheel.position[0], wheel.position[1]);
  gfx.rotate(wheel.angle);
  strokeCircle(gfx, this.wheelRadius, 8)
  gfx.restore();
}


Player.prototype.setMotor = function(impulse) {
  this.impulse = impulse;
};

Player.prototype.fire = function() {
  var dx = Math.cos(this.chassis.angle + Math.PI / 2) * 0.5;
  var dy = Math.sin(this.chassis.angle + Math.PI / 2) * 0.5;
  var x = this.getX() + dx;
  var y = this.getY() + dy;
  var vx = 10 * dx + this.chassis.velocity[0];
  var vy = 10 * dy + this.chassis.velocity[1];
  this.game.bullets.push(new Bullet(this.world, x, y, vx, vy));
  this.chassis.force[0] = -dx * 400;
  this.chassis.force[1] = -dy * 400;
};

Player.prototype.onHit = function() {
};


Player.prototype.flip = function(impulse) {
  var max = 500;
  if (this.chassis.angularVelocity * impulse < max) {
    this.chassis.angularForce = impulse;
  }
};

