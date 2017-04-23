var EnemyState = {
  LEFT: 0,
  DOWN_ON_LEFT: 1,
  RIGHT: 2,
  DOWN_ON_RIGHT: 3
};

function Enemy(game, world, r, theta) {
  this.game = game;
  this.world = world;
  this.r = r;
  this.theta = theta;
  this.width = 2.8;
  this.height = 1.3;
  this.state = EnemyState.LEFT;
  this.remaining = 1500;
  this.rFloor = 6;
  this.speed = 0.0005;
  this.angleSpeed = 0.0003;
  this.lastUpdate = Date.now();
  this.lastFire = Date.now();
  this.fireDelay = 1000;

  this.body = new p2.Body({
    position: [this.getX(), this.getY()],
    mass: 1000
  });
  var shape = new p2.Rectangle(this.width, this.height);
  shape.collisionGroup = ENEMY;
  shape.collisionMask = BULLET | PLAYER;
  this.body.addShape(shape);
  this.world.addBody(this.body);
}

Enemy.prototype.update = function() {
  var dt = Date.now() - this.lastUpdate;
  this.lastUpdate = Date.now();

  switch (this.state) {
    case EnemyState.LEFT:
      this.theta -= this.angleSpeed * dt;
      break;
    case EnemyState.RIGHT:
      this.theta += this.angleSpeed * dt;
      break;
    case EnemyState.DOWN_ON_LEFT:
      this.r -= this.speed * dt;
      break;
    case EnemyState.DOWN_ON_RIGHT:
      this.r -= this.speed * dt;
      break;
  }
  this.remaining -= dt;
  if (this.remaining <= 0) {
    switch (this.state) {
      case EnemyState.LEFT:
        if (this.r > this.rFloor) {
          this.state = EnemyState.DOWN_ON_LEFT;
        } else {
          this.state = EnemyState.RIGHT;
        }
        break;
      case EnemyState.RIGHT:
        if (this.r > this.rFloor) {
          this.state = EnemyState.DOWN_ON_RIGHT;
        } else {
          this.state = EnemyState.LEFT;
        }
        break;
      case EnemyState.DOWN_ON_LEFT:
        this.state = EnemyState.RIGHT;
        break;
      case EnemyState.DOWN_ON_RIGHT:
        this.state = EnemyState.LEFT;
        break;
    }
    this.remaining = 1500;
  }

  if (this.lastFire + this.fireDelay < Date.now()) {
    this.fire();
    this.lastFire = Date.now();
  }
  this.body.position[0] = this.getX();
  this.body.position[1] = this.getY();
  this.body.angle = this.theta + Math.PI / 2;
}

Enemy.prototype.draw = function(gfx) {
  gfx.save();
  gfx.translate(this.getX(), this.getY());

  gfx.rotate(this.body.angle);
  gfx.strokeStyle = '#3300ff';
  gfx.beginPath();
  gfx.moveTo(-this.width / 2, -this.height / 2);
  gfx.lineTo(this.width / 2, this.height / 2);
  gfx.lineTo(this.width / 2, -this.height / 2);
  gfx.lineTo(-this.width / 2, this.height / 2);
  gfx.lineTo(-this.width / 2, -this.height / 2);
  gfx.stroke();
  gfx.restore();
}

Enemy.prototype.getX = function() {
  return Math.cos(this.theta) * this.r;
};

Enemy.prototype.getY = function() {
  return Math.sin(this.theta) * this.r;
};

Enemy.prototype.fire = function() {
  var dx = Math.cos(this.body.angle + Math.PI / 2) * 1;
  var dy = Math.sin(this.body.angle + Math.PI / 2) * 1;
  var x = this.getX() + dx;
  var y = this.getY() + dy;
  this.game.bullets.push(new Bullet(this.world, x, y, dx * 10, dy * 10));
};
