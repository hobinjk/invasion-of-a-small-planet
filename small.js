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
  this.lost = false;
  this.uiContainer = document.getElementById('ui-container');
  this.loseText = document.getElementById('lose-text');
  this.scoreText = document.getElementById('score-text');
  this.introText = document.getElementById('intro-text');
  this.start = this.start.bind(this);
  this.startButton = document.getElementById('start-button');
  this.startButton.addEventListener('click', this.start);
  this.startButton.addEventListener('touchend', this.start);

  this.gfx = this.canvas.getContext('2d');
  this.world = new p2.World({
    gravity: [0, -10],
    broadphase: new p2.SAPBroadphase()
  });

  this.onImpact = this.onImpact.bind(this);
  this.world.on('impact', this.onImpact);

  this.world.defaultContactMaterial.friction = 5;

  this.effects = [];

  this.planet = new Planet(this.world);
  this.player = new Player(this, this.world, this.planet);

  this.bullets = [];
  this.wave = 1;
  this.score = 0;
  this.enemies = [];

  this.lastUpdate = Date.now();
  this.update = this.update.bind(this);

  this.stars = new Array(128);
  for (var si = 0; si < this.stars.length; si++) {
    var theta = Math.random() * 2 * Math.PI;
    var r = Math.random() * 24 + 4;
    this.stars[si] = {
      x: Math.cos(theta) * r,
      y: Math.sin(theta) * r
    };
  }

  this.controls = new Controls(this.player);

  this.onResize = this.onResize.bind(this);
  window.addEventListener('resize', this.onResize);
  this.onResize();

  window.requestAnimationFrame(this.update);
}

SmallGame.prototype.spawnEnemies = function() {
  for (var i = 0; i < this.wave; i++) {
    var height = 20;
    var theta = i / this.wave * 2 * Math.PI;
    if (this.wave > 9) {
      height = 20 + Math.floor(i / 9);
      theta = (i % 9) / 9 * 2 * Math.PI;
    }
    this.enemies.push(new Enemy(this, this.world, height, theta));
  }
};

SmallGame.prototype.update = function() {
  var dt = Date.now() - this.lastUpdate;
  this.controls.update();
  this.player.update();
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].update();
  }
  var screenRSq = this.width * this.width + this.height * this.height;
  screenRSq /= this.scale * this.scale * 4;

  for (var bi = this.bullets.length - 1; bi >= 0; bi--) {
    var bullet = this.bullets[bi];
    var dx = this.player.getX() - bullet.getX();
    var dy = this.player.getY() - bullet.getY();

    if (dx * dx + dy * dy > screenRSq) {
      this.world.removeBody(bullet.body);
      this.bullets.splice(bi, 1);
    }
  }

  for (var ei = this.effects.length - 1; ei >= 0; ei--) {
    var effect = this.effects[ei];
    effect.update();
    if (!effect.alive) {
      this.effects.splice(ei, 1);
    }
  }

  this.updateGravity();
  this.world.step(1/60, Math.min(dt / 1000, 0.5));

  this.draw();

  if (this.planet.mass / this.planet.initialMass < 0.08) {
    this.lose();
  }

  this.lastUpdate = Date.now();
  window.requestAnimationFrame(this.update);
};

SmallGame.prototype.start = function() {
  this.introText.style.display = 'none';
  this.startButton.style.display = 'none';
  this.uiContainer.classList.remove('important');
  this.spawnEnemies();
};

SmallGame.prototype.lose = function() {
  if (this.lost) {
    return;
  }
  this.lost = true;
  this.loseText.style.display = 'block';
  this.loseText.innerHTML += 'score: ' + this.score;
  this.scoreText.style.display = 'none';
  this.uiContainer.classList.add('important');
};

SmallGame.prototype.draw = function() {
  this.gfx.save();
  this.gfx.fillStyle = 'black';
  this.gfx.fillRect(0, 0, this.width, this.height);

  // this.gfx.strokeStyle = '#00aa33';
  // this.gfx.strokeRect(10, 10, 200, 40);
  // var planetHealth = this.planet.mass / this.planet.initialMass * 200;
  // this.gfx.beginPath();
  // for (var tick = 5; tick < planetHealth; tick += 5) {
  //   this.gfx.moveTo(10 + tick, 10);
  //   this.gfx.lineTo(10 + tick, 50);
  // }
  // this.gfx.stroke();

  this.gfx.translate(this.width / 2, this.height * 9 / 10);
  this.scale = 60;
  this.gfx.scale(this.scale, this.scale);
  this.gfx.rotate(-this.theta + Math.PI / 2);

  this.gfx.lineWidth = 0.025;
  for (var si = 0; si < this.stars.length; si++) {
    var x = this.stars[si].x;
    var y = this.stars[si].y;

    var c = Math.floor(Math.random() * 5 + 10).toString(16);
    this.gfx.strokeStyle = '#' + c + c + c;
    this.gfx.beginPath();
    this.gfx.moveTo(x - 0.1, y);
    this.gfx.lineTo(x + 0.1, y);
    this.gfx.moveTo(x, y - 0.1);
    this.gfx.lineTo(x, y + 0.1);
    this.gfx.stroke();
  }

  this.gfx.lineWidth = 0.05;
  this.planet.draw(this.gfx);
  this.player.draw(this.gfx);
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].draw(this.gfx);
  }

  for (var bi = 0; bi < this.bullets.length; bi++) {
    this.bullets[bi].draw(this.gfx);
  }
  for (var ei = 0; ei < this.effects.length; ei++) {
    var effect = this.effects[ei];
    effect.draw(this.gfx);
  }

  this.gfx.restore();

  if (!this.lost) {
    this.gfx.save();
    this.gfx.translate(this.width * 9.4 / 10, this.height / 10);

    this.gfx.rotate(Math.PI);
    this.gfx.scale(this.scale / 10, this.scale / 10);

    this.gfx.lineWidth = 0.5;
    this.planet.draw(this.gfx);
    this.player.draw(this.gfx);
    for (var ni = 0; ni < this.enemies.length; ni++) {
      this.enemies[ni].draw(this.gfx);
    }

    this.gfx.restore();
  }
};

SmallGame.prototype.updateGravity = function() {

  this.theta = Math.atan2(this.planet.getY() - this.player.getY(),
    this.planet.getX() - this.player.getX());

  var gravity = 5 * this.planet.mass / this.planet.initialMass;
  this.world.gravity[0] = gravity * Math.cos(this.theta);
  this.world.gravity[1] = gravity * Math.sin(this.theta);
};

SmallGame.prototype.onResize = function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var dpr = window.devicePixelRatio || 1;

  this.canvas.width = this.width = width * dpr;
  this.canvas.height = this.height = height * dpr;
  this.canvas.style.width = width + 'px';
  this.canvas.style.height = height + 'px';
};

SmallGame.prototype.onImpact = function(event) {
  var bulletBody = null;
  var hitBody = null;
  if (event.bodyA.shapes[0].collisionGroup === BULLET) {
    bulletBody = event.bodyA;
    hitBody = event.bodyB;
  } else if (event.bodyB.shapes[0].collisionGroup === BULLET) {
    bulletBody = event.bodyB;
    hitBody = event.bodyA;
  } else {
    return;
  }

  var bullet = null;
  var bulletIndex = -1;
  for (var i = 0; i < this.bullets.length; i++) {
    if (this.bullets[i].body === bulletBody) {
      bullet = this.bullets[i];
      bulletIndex = i;
      break;
    }
  }
  if (!bullet) {
    return;
  }
  this.effects.push(new Explosion(bullet.getX(), bullet.getY()));
  this.world.removeBody(bullet.body);
  this.bullets.splice(bulletIndex, 1);

  if (hitBody.shapes[0].collisionGroup === PLAYER) {
    this.player.onHit(bullet);
  } else if (hitBody.shapes[0].collisionGroup === PLANET) {
    this.planet.onHit(bullet);
  } else if (hitBody.shapes[0].collisionGroup === ENEMY) {
    var enemy = null;
    var enemyIndex = -1;
    for (var ei = 0; ei < this.enemies.length; ei++) {
      if (this.enemies[ei].body === hitBody) {
        enemy = this.enemies[ei];
        enemyIndex = ei;
        break;
      }
    }
    if (!enemy) {
      return;
    }
    this.world.removeBody(enemy.body);
    this.enemies.splice(enemyIndex, 1);
    this.score += 100;
    this.scoreText.textContent = this.score;
    if (this.enemies.length === 0) {
      this.wave += 2;
      this.spawnEnemies();
    }
  }
};

window.game = new SmallGame();
