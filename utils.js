function strokeCircle(gfx, radius, res) {
  gfx.beginPath();
  for (var i = 0; i <= res; i++) {
    var theta = i / res * 2 * Math.PI;
    var x = Math.cos(theta) * radius;
    var y = Math.sin(theta) * radius;
    gfx.lineTo(x, y);
  }
  gfx.stroke();
}
