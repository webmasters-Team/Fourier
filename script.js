//https://www.youtube.com/watch?v=LznjC4Lo7lE

var i, t, animation = 'stop',
  fourier = $('canvas#fourier'),
  canvas = fourier[0],
  ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 250;

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

var grid1 = {
  l: 30,
  t: 15,
  x: 20,
  y: 20,
  w: 200,
  h: 200,
  cx: 2.5,
  cy: 2.5,
  sx: 0.5,
  sy: 0.5
};
var grid2 = {
  l: 270,
  t: grid1.t,
  x: Math.PI * 10,
  y: grid1.y,
  w: 300,
  h: grid1.h,
  cx: 0,
  cy: grid1.cy,
  sx: 2,
  sy: grid1.sy,
  last: true,
  alpha: 1
};
var speed = 0.01 * Math.PI,
  ad = 0.025;

var drawGrid = function(o) {
  ctx.beginPath();
  //horizontal
  ctx.textAlign = 'right';
  for (i = 0; i <= (o.h / o.y); i++) {
    ctx.moveTo(o.l, Math.round((o.y * i) + o.t) + 0.5);
    ctx.lineTo(o.w + o.l, Math.round((o.y * i) + o.t) + 0.5);
    ctx.fillText(Math.round(((-i * o.sy) + o.cy) * 10) / 10,
      o.l - 5,
      (i * o.y) + o.t + 5
    );
  }
  //vertical
  ctx.textAlign = 'center';
  for (i = 0; i <= (o.w / o.x); i++) {
    ctx.moveTo(Math.round((o.x * i) + o.l) + 0.5, o.t);
    ctx.lineTo(Math.round((o.x * i) + o.l) + 0.5, o.h + o.t);
    ctx.fillText(Math.round(((-i * o.sx) + o.cx) * -10) / 10,
      (i * o.x) + o.l,
      o.t + o.h + 15
    );
  }
  if (o.last) {
    ctx.moveTo(o.w + o.l + 0.5, o.t);
    ctx.lineTo(o.w + o.l + 0.5, o.h + o.t);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.stroke();
};

var drawGrids = function() {
  drawGrid(grid1);
  drawGrid(grid2);
};

var circles = [{
  x: 0,
  y: 0,
  a: 0,
  data: [],
  r: 4 / Math.PI,
  c: 'royalblue'
}, {
  x: 0,
  y: 0,
  a: 0,
  data: [],
  r: 4 / (Math.PI * 3),
  c: 'tomato'
}, {
  x: 0,
  y: 0,
  a: 0,
  data: [],
  r: 4 / (Math.PI * 5),
  c: 'limegreen'
}, {
  x: 0,
  y: 0,
  a: 0,
  data: [],
  r: 4 / (Math.PI * 7),
  c: 'darkslategray'
}];

var drawCircle = function(i, o) {
  var circle = circles[i];
  ctx.beginPath();
  ctx.arc(
    o.l + ((circle.x + o.cx) * o.x / o.sx),
    o.t + ((circle.y + o.cy) * o.y / o.sy),
    circle.r * o.x / o.sx, 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeStyle = circle.c;
  ctx.stroke();
};

var drawClockLine = function(i, o, ext) {
  var circle = circles[i];
  ctx.beginPath();
  var r = {
    x: circle.r * Math.cos(circle.a),
    y: circle.r * Math.sin(circle.a)
  };
  ctx.moveTo(
    o.l + ((circle.x + o.cx) * o.x / o.sx),
    o.t + ((circle.y + o.cy) * o.y / o.sy));
  ctx.lineTo(
    o.l + ((circle.x + o.cx + r.x) * o.x / o.sx),
    o.t + ((circle.y + o.cy + r.y) * o.y / o.sy));
  ctx.arc(
    o.l + ((circle.x + o.cx + r.x) * o.x / o.sx),
    o.t + ((circle.y + o.cy + r.y) * o.y / o.sy),
    1.5, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = circle.c;
  ctx.setLineDash([]);
  ctx.stroke();
  if (ext) {
    ctx.beginPath();
    ctx.moveTo(
      o.l + ((circle.x + o.cx + r.x) * o.x / o.sx),
      o.t + ((circle.y + o.cy + r.y) * o.y / o.sy));
    var n = circle.data.length;
    ctx.lineTo(
      grid2.l + (((n + grid2.cx) * grid2.x * ad / grid2.sx)),
      grid2.t + ((circle.y + grid2.cy + r.y) * grid2.y / grid2.sy));
    ctx.setLineDash([4, 3]);
    ctx.stroke();
  }
  circle.data.push(circle.y + r.y);
};

var drawWave = function(i, o) {
  var circle = circles[i],
    n = circle.data.length,
    j = circle.data[n - 1];
  ctx.beginPath();
  ctx.arc(
    o.l + (((n + o.cx) * o.x * ad / o.sx)),
    o.t + ((j + o.cy) * o.y / o.sy),
    1.5, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = circle.c;
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
  for (i = 0; i < n; i++) {
    j = circle.data[i];

    y = o.t + ((j + o.cy) * o.y / o.sy);
    ctx.lineTo(
      o.l + (((i + o.cx) * o.x * ad / o.sx)),
      o.t + y);
    play(parseInt(y * 10), i)
  }
  ctx.lineWidth = 0.6;
  ctx.strokeStyle = circle.c;

  ctx.setLineDash([]);
  ctx.stroke();
};

var rotateCircle = function(i, o, d) {
  var circle = circles[i];
  circle.x = d.x + d.r * Math.cos(d.a);
  circle.y = d.y + d.r * Math.sin(d.a);
};

var concentric = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrids();
  for (i = 0; i < circles.length; i++) {
    drawCircle(i, grid1);
    circles[i].a -= speed / circles[i].r;
    drawClockLine(i, grid1, 1);
    drawWave(i, grid2);
  }
  var n = circles[0].data.length,
    x = grid2.l + ((n + grid2.cx) * grid2.x * ad / grid2.sx);
  if (x > grid2.l + grid2.w) {
    animation = 'stop';
    t = setTimeout(function() {
      reset();
      animation = 'move';
    }, 2000);
  }
};

var moveCircles = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrids();
  for (i = 0; i < circles.length; i++) {
    drawCircle(i, grid1);
    drawWave(i, grid2);
  }
  circles[1].x += circles[0].r * 0.01;
  circles[2].x += (circles[0].r + circles[1].r) * 0.01;
  circles[3].x += (circles[0].r + circles[1].r + circles[2].r) * 0.01;
  if (circles[1].x > circles[0].r) {
    animation = 'stop';
    t = setTimeout(start2, 2000);
  }
};

var summation = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrids();
  for (i = 0; i < circles.length; i++) {
    drawCircle(i, grid1);
  }
  circles[0].a -= speed / circles[0].r;
  circles[1].a -= speed / circles[1].r;
  circles[2].a -= speed / circles[2].r;
  circles[3].a -= speed / circles[3].r;
  drawClockLine(1, grid1);
  drawClockLine(2, grid1);
  drawClockLine(3, grid1, 1);
  rotateCircle(1, grid1, circles[0]);
  rotateCircle(2, grid1, circles[1]);
  rotateCircle(3, grid1, circles[2]);
  drawWave(3, grid2);
  var n = circles[3].data.length,
    x = grid2.l + ((n + grid2.cx) * grid2.x * ad / grid2.sx);
  if (x > grid2.l + grid2.w) {
    animation = 'stop';
    t = setTimeout(start, 2000);
  }
};

var frame = function() {
  requestAnimationFrame(frame);
  if (animation == 'concentric') {
    concentric();
  }
  if (animation == 'move') {
    moveCircles();
  }
  if (animation == 'summation') {
    summation();
  }
  if (animation == 'stop') {
    grid2.alpha -= 0.01;
  }
};

var reset = function() {
  animation = 'stop';
  clearTimeout(t);
  for (i = 0; i < circles.length; i++) {
    circles[i].x = 0;
    circles[i].y = 0;
    circles[i].a = 0;
    circles[i].data = [];
  }
};

var start = function() {
  reset();
  animation = 'concentric';
};

var start2 = function() {
  reset();
  circles[1].x = circles[0].r;
  circles[2].x = circles[0].r + circles[1].r;
  circles[3].x = circles[0].r + circles[1].r + circles[2].r;
  animation = 'summation';
};

var gui = new dat.GUI();

gui.add(window, 'start').name('concentric');
gui.add(window, 'start2').name('summation');
gui.add(window, 'speed', speed / 20, speed * 20);
gui.add(grid2, 'sx', grid2.sx, 10).listen();
gui.add(circles[0], 'r', 0.01, 1.5).name('radius 0');
gui.add(circles[1], 'r', 0.01, 0.5).name('radius 1');
gui.add(circles[2], 'r', 0.01, 0.3).name('radius 2');
gui.add(circles[3], 'r', 0.01, 0.2).name('radius 3');

frame();
start();

var sounds = [], soundCount = 4;

var audioContext = new AudioContext();
for(var i=0; i<soundCount; i++) {
  sounds[i] = audioContext.createOscillator();
  sounds[i].frequency.value = 0;
  sounds[i].detune.value = 0;
  sounds[i].type = 'sine';
  sounds[i].connect(audioContext.destination);
  sounds[i].start(0);
}


var eleSound = document.querySelector("#sound");
var soundPlay = eleSound.checked;
eleSound.onchange = function() {
  soundPlay = eleSound.checked
  if (soundPlay) {
    for(var i=0; i<soundCount; i++) {
      sounds[i].start(0);
    }

  } else {
    for(var i=0; i<soundCount; i++) {
      sounds[i].frequency.value = 0;
    }
  }
}

function play(freq, sound) {
  if (!soundPlay) return;
  if (sounds[sound]) {
  sounds[sound].frequency.value = freq*1/3;
    }
}