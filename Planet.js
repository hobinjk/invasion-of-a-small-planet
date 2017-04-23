function Planet(world) {
  this.world = world;


  this.surface = new Array(120);
  for (var i = 0; i < this.surface.length; i++) {
    var theta = 2 * Math.PI * i / this.surface.length;
    var height = 3 + Math.sin(theta * 3) * 0.1 + Math.sin(theta * 5) * 0.05 + Math.sin(theta * 7) * 0.025;
    this.surface[i] = [
      Math.cos(theta) * height,
      Math.sin(theta) * height
    ];
  }

  this.body = new p2.Body({
    position: [0, 0],
    mass: 0
  });

  this.body.fromPolygon(this.surface);

  this.world.addBody(this.body);
}

Planet.prototype.getX = function() {
  return this.body.position[0];
};

Planet.prototype.getY = function() {
  return this.body.position[1];
};

Planet.prototype.draw = function(gfx) {
  gfx.fillStyle = '#00aa33';
  gfx.beginPath();
  gfx.moveTo(this.surface[0][0], this.surface[0][1]);
  for (var i = 1; i < this.surface.length; i++) {
    var x = this.surface[i][0];
    var y = this.surface[i][1];
    gfx.lineTo(x, y);
  }
  gfx.fill();
};
