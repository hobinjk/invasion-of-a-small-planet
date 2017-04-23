var EnemyState = {
  LEFT: 0,
  DOWN_ON_LEFT: 1,
  RIGHT: 2,
  DOWN_ON_RIGHT: 3
};

function Enemy(world, r, theta) {
  this.world = world;
  this.r = r;
  this.theta = theta;
  this.width = 2.8;
  this.height = 1.3;
  this.state = EnemyState.LEFT;
  this.remaining = 1;
  this.speed = 0.0005;
  this.angleSpeed = 0.0005;
  this.lastUpdate = Date.now();

  this.body = new p2.Body({
    position: [this.getX(), this.getY()],
    mass: 1000
  });
  this.body.addShape(new p2.Rectangle(this.width, this.height));
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
  this.remaining -= this.speed * dt;
  if (this.remaining <= 0) {
    switch (this.state) {
      case EnemyState.LEFT:
        this.state = EnemyState.DOWN_ON_LEFT;
        break;
      case EnemyState.RIGHT:
        this.state = EnemyState.DOWN_ON_RIGHT;
        break;
      case EnemyState.DOWN_ON_LEFT:
        this.state = EnemyState.RIGHT;
        break;
      case EnemyState.DOWN_ON_RIGHT:
        this.state = EnemyState.LEFT;
        break;
    }
    this.remaining = 1;
  }

  this.body.position[0] = this.getX();
  this.body.position[1] = this.getY();
  this.body.angle = this.theta + Math.PI / 2;
}

Enemy.prototype.draw = function(gfx) {
  gfx.save();
  gfx.translate(this.getX(), this.getY());

  gfx.rotate(this.body.angle);
  gfx.fillStyle = 'red';
  gfx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  gfx.restore();
}

Enemy.prototype.getX = function() {
  return Math.cos(this.theta) * this.r;
};

Enemy.prototype.getY = function() {
  return Math.sin(this.theta) * this.r;
};
