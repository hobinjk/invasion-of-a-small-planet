function Player(game, world, planet) {
  this.game = game;
  this.world = world;
  this.planet = planet;

  // This draws from the p2.js car demo because it's a car
  this.chassis = new p2.Body({
    position: [0, 3.4],
    mass: 4
  });
  this.chassisWidth = 1;
  this.chassisHeight = 0.2;
  this.chassis.addShape(new p2.Rectangle(this.chassisWidth, this.chassisHeight));
  this.world.addBody(this.chassis);

  this.wheelRadius = 0.3;
  this.wheelLeft = new p2.Body({
    position: [this.chassis.position[0] - 0.5, this.chassis.position[1]],
    mass: 0.5
  });
  this.wheelLeft.addShape(new p2.Circle(this.wheelRadius));
  this.world.addBody(this.wheelLeft);

  this.wheelRight = new p2.Body({
    position: [this.chassis.position[0] + 0.5, this.chassis.position[1]],
    mass: 0.5
  });
  this.wheelRight.addShape(new p2.Circle(this.wheelRadius));
  this.world.addBody(this.wheelRight);

  this.motorLeft = new p2.RevoluteConstraint(this.chassis, this.wheelLeft, {
    localPivotA: [-0.5, 0.0],
    localPivotB: [0, 0],
    collideConnected: false
  });
  this.world.addConstraint(this.motorLeft);

  this.motorRight = new p2.RevoluteConstraint(this.chassis, this.wheelRight, {
    localPivotA: [0.5, 0.0],
    localPivotB: [0, 0],
    collideConnected: false
  });
  this.world.addConstraint(this.motorRight);

  this.motorLeft.enableMotor();
  this.motorRight.enableMotor();
}

Player.prototype.update = function() {
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
  gfx.fillStyle = '#00ffff';
  gfx.fillRect(
    -this.chassisWidth / 2,
    -this.chassisHeight / 2,
    this.chassisWidth,
    this.chassisHeight
  );
  gfx.restore();

  gfx.fillStyle = '#ffa400';
  gfx.beginPath();
  gfx.arc(this.wheelRight.position[0], this.wheelRight.position[1], this.wheelRadius, 0, 2 * Math.PI);
  gfx.arc(this.wheelLeft.position[0], this.wheelLeft.position[1], this.wheelRadius, 0, 2 * Math.PI);
  gfx.fill();
};

Player.prototype.setMotor = function(impulse) {
  this.motorLeft.setMotorSpeed(impulse);
  this.motorRight.setMotorSpeed(impulse);
};

Player.prototype.fire = function() {
  var dx = Math.cos(this.chassis.angle + Math.PI / 2) * 0.5;
  var dy = Math.sin(this.chassis.angle + Math.PI / 2) * 0.5;
  var x = this.getX() + dx;
  var y = this.getY() + dy;
  this.game.bullets.push(new Bullet(this.world, x, y, dx * 10, dy * 10));
};

