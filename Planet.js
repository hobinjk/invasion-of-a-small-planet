function Planet(world) {
  this.world = world;


  this.heights = new Array(36);
  for (var i = 0; i < this.heights.length; i++) {
    var theta = 2 * Math.PI * i / (this.heights.length - 1);
    this.heights[i] = 4 + Math.cos(theta) * 0.2 + Math.cos(theta * 3) * 0.1 + Math.cos(theta * 5) * 0.05;
  }

  this.body = new p2.Body({
    position: [0, 0],
    mass: 0
  });
  this.mass = 0;
  this.generateSurface();
  this.initialMass = this.mass;

  this.world.addBody(this.body);
}

Planet.prototype.generateSurface = function() {
  var px = 0;
  var py = 0;
  this.mass = 0;
  while (this.body.shapes.length > 0) {
    this.body.removeShape(this.body.shapes[0]);
  }
  for (var i = 0; i < this.heights.length; i++) {
    var theta = 2 * Math.PI * i / (this.heights.length - 1);
    var height = this.heights[i];
    this.mass += height;
    var x = Math.cos(theta) * height;
    var y = Math.sin(theta) * height;
    if (i > 0) {
      var shape = new p2.Convex([
        [px, py],
        [x, y],
        [0, 0]
      ]);
      shape.collisionMask = PLAYER | BULLET;
      shape.collisionGroup = PLANET;
      this.body.addShape(shape);
    }
    px = x;
    py = y;
  }
};

Planet.prototype.getX = function() {
  return this.body.position[0];
};

Planet.prototype.getY = function() {
  return this.body.position[1];
};

Planet.prototype.draw = function(gfx) {
  gfx.fillStyle = '#00aa33';
  gfx.strokeStyle = '#00aa33';
  gfx.lineWidth = 0.05;
  gfx.beginPath();
  for (var i = 0; i < this.body.shapes.length; i++) {
    var shape = this.body.shapes[i];
    if (i === 0) {
      var start = shape.vertices[0]
      gfx.moveTo(start[0], start[1]);
    }
    var vert = shape.vertices[1];
    gfx.lineTo(vert[0], vert[1]);
  }
  gfx.stroke();
};

Planet.prototype.onHit = function(bullet) {
  var collisionTheta = (2 * Math.PI + Math.atan2(bullet.getY(), bullet.getX())) % (2 * Math.PI);
  var craterWidth = 0.3;
  for (var i = 0; i < this.heights.length; i++) {
    var theta = 2 * Math.PI * i / (this.heights.length - 1);
    // TODO this is a lot of sqrts
    // 2pi - 0.1 < 0.3
    var dTheta = theta - collisionTheta;
    if (Math.abs(dTheta) > craterWidth && Math.abs(dTheta) < 2 * Math.PI - craterWidth) {
      continue;
    }
    var dHeight = 0.4 * Math.cos(dTheta / craterWidth * Math.PI / 2);
    if (this.heights[i] > dHeight + 0.5) {
      this.heights[i] -= dHeight;
    }
  }

  var newHeights = new Array(this.heights.length);
  for (var hi = 0; hi < this.heights.length; hi++) {
    var left = this.heights[(hi + this.heights.length - 1) % this.heights.length];
    var right = this.heights[(hi + 1) % this.heights.length];
    var height = this.heights[hi];
    newHeights[hi] = left * 0.25 + height * 0.5 + right * 0.25;
  }
  this.heights[this.heights.length - 1] = this.heights[0];
  this.heights = newHeights;

  this.generateSurface();
};
