// car has two circles and a rectangle with a
// revolute between them
// The world is a poly that can be deformed by planet buster missiles
// standard missiles damage the car
//
// bulldozer smooths the world
// standard bullet hell weapon pickups
// jump jets

function SmallGame() {
  this.canvas = document.getElementById('small-canvas');
  this.canvas.width = this.width = 320;
  this.canvas.height = this.height = 320 * 16 / 9;

  this.gfx = this.canvas.getContext('2d');
  this.world = new p2.World({
    gravity: [0, -10],
    broadphase: new p2.SAPBroadphase()
  });

  this.world.defaultContactMaterial.friction = 5;


  this.planet = new Planet(this.world);
  this.player = new Player(this, this.world, this.planet);

  this.bullets = [];
  this.enemies = new Array(10);
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i] = new Enemy(this.world, 10, i / this.enemies.length * 2 * Math.PI);
  }

  this.lastUpdate = Date.now();
  this.update = this.update.bind(this);

  this.controls = new Controls(this.player);

  this.onResize = this.onResize.bind(this);
  window.addEventListener('resize', this.onResize);
  this.onResize();

  window.requestAnimationFrame(this.update);
}


SmallGame.prototype.update = function() {
  var dt = Date.now() - this.lastUpdate;
  this.controls.update();
  this.player.update();
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].update();
  }

  this.updateGravity();
  this.world.step(1/60, Math.min(dt / 1000, 0.5));

  this.draw();

  this.lastUpdate = Date.now();;
  window.requestAnimationFrame(this.update);
};

SmallGame.prototype.draw = function() {
  this.gfx.save();
  this.gfx.fillStyle = 'black';
  this.gfx.fillRect(0, 0, this.width, this.height);
  this.gfx.translate(this.width / 2, this.height * 9 / 10);
  this.scale = 60;
  this.gfx.scale(this.scale, this.scale);
  this.gfx.rotate(-this.theta + Math.PI / 2);
  this.planet.draw(this.gfx);
  this.player.draw(this.gfx);
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].draw(this.gfx);
  }

  for (var i = 0; i < this.bullets.length; i++) {
    this.bullets[i].draw(this.gfx);
  }
  this.gfx.restore();
};

SmallGame.prototype.updateGravity = function() {

  this.theta = Math.atan2(this.planet.getY() - this.player.getY(),
    this.planet.getX() - this.player.getX());

  this.world.gravity[0] = 5 * Math.cos(this.theta);
  this.world.gravity[1] = 5 * Math.sin(this.theta);
}

SmallGame.prototype.onResize = function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var dpr = window.devicePixelRatio || 1;

  this.canvas.width = this.width = width * dpr;
  this.canvas.height = this.height = height * dpr;
  this.canvas.style.width = width + 'px';
  this.canvas.style.height = height + 'px';
}

var game = new SmallGame();
