var myCan = document.getElementById("mycanvas");
var cnt = myCan.getContext("2d");

var frames = 0;

var sprite = new Image();
sprite.src = "img/BIRD.png";

var Die = new Audio();
Die.src = "sound/sfx_die.wav";

var Hit = new Audio();
Hit.src = "sound/sfx_hit.wav";

var Point = new Audio();
Point.src = "sound/sfx_point.wav";

var Start = new Audio();
Start.src = "sound/sfx_start.wav";

var Wing = new Audio();
Wing.src = "sound/sfx_wing.Mp3";

var bg = {
  sx: 0,
  sy: 0,
  w: 288,
  h: 510,
  x: 0,
  y: 0,
  draw: function () {
    cnt.drawImage(
      sprite,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    cnt.drawImage(
      sprite,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};
var fg = {
  sx: 585,
  sy: 0,
  w: 334,
  h: 110,
  x: 0,
  y: myCan.height - 110,
  dx: 2,
  draw: function () {
    cnt.drawImage(
      sprite,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    cnt.drawImage(
      sprite,
      this.sx,
      this.sy,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
  update: function () {
    if (state.current != state.play) return;
    this.x -= this.dx;
    if (this.x <= -myCan.width / 2) {
      this.x = 0;
    }
  },
};

var pipes = {
  top: { sx: 112, sy: 644 },
  botton: { sx: 168, sy: 644 },
  w: 53,
  h: 320,
  x: myCan.width,
  gap: 100,
  dx: 2,
  ymax: -110,
  position: [],
  draw: function () {
    for (i = 0; i < this.position.length; i++) {
      var p = this.position[i];
      var yBotton = p.y + this.h + this.gap;
      cnt.drawImage(
        sprite,
        this.top.sx,
        this.top.sy,
        this.w,
        this.h,
        p.x,
        p.y,
        this.w,
        this.h
      );
      cnt.drawImage(
        sprite,
        this.botton.sx,
        this.botton.sy,
        this.w,
        this.h,
        p.x,
        yBotton,
        this.w,
        this.h
      );
    }
  },
  update: function () {
    if (state.current != state.play) return;
    if (frames % 100 == 0) {
      this.position.push({
        x: myCan.width,
        y: (Math.random() + 1) * this.ymax,
      });
    }
    for (i = 0; i < this.position.length; i++) {
      var p = this.position[i];
      var yTopBottom = p.y + this.h + this.gap;

      if (
        bird.x + bird.w > p.x &&
        bird.x < p.x + this.w &&
        bird.y < p.y + this.h &&
        bird.y + bird.h > p.y
      ) {
        Hit.play();
        state.current = state.gameover;
      }
      if (
        bird.x + bird.w > p.x &&
        bird.x < p.x + this.w &&
        bird.y < yTopBottom + this.h &&
        bird.y + bird.h > yTopBottom
      ) {
        Hit.play();
        state.current = state.gameover;
      }
      p.x -= this.dx;
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.current++;
        Point.play();
        score.best = Math.max(score.current, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },
};

var gameOver = {
  sx: 320,
  sy: 560,
  w: 258,
  h: 240,
  x: myCan.width / 2 - 258 / 2,
  y: myCan.height / 2 - 240 / 2,
  draw: function () {
    if (state.current == state.gameover) {
      cnt.drawImage(
        sprite,
        this.sx,
        this.sy,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};
var getReady = {
  sx: 582,
  sy: 113,
  w: 208,
  h: 187,
  x: myCan.width / 2 - 208 / 2,
  y: myCan.height / 2 - 187 / 2,
  draw: function () {
    if (state.current == state.ready) {
      cnt.drawImage(
        sprite,
        this.sx,
        this.sy,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

var bird = {
  position: [
    { sx: 2, sy: 969 },
    { sx: 58, sy: 969 },
    { sx: 114, sy: 969 },
  ],
  w: 36,
  h: 36,
  x: 100,
  y: 150,
  pos: 0,
  ySpeed: 0,
  shetab: 0.5,
  draw: function () {
    cnt.drawImage(
      sprite,
      this.position[this.pos].sx,
      this.position[this.pos].sy,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
  },
  update: function () {
    if (frames % 5 == 0) this.pos++;
    this.pos %= 3;
    if (state.current == state.ready) {
      this.y = 150;
    } else {
      this.y += this.ySpeed;
      this.ySpeed += this.shetab;
    }
    if (this.y >= 365) {
      this.y = 365;
      this.pos = 0;
      if (state.current == state.play) {
        state.current = state.gameover;
        Die.play();
      }
    }
  },
  flap: function () {
    this.ySpeed = -5;
    Wing.play();
  },
};

var score = {
  current: 0,
  best: localStorage.getItem("best") || 0,
  draw: function () {
    if (state.current == state.gameover) {
      cnt.lineWidth = 2;
      cnt.font = "25px IMPACT";
      cnt.strokeStyle = "darkblue";
      cnt.strokeText(this.current, 270, 263);
      cnt.strokeText(this.best, 270, 305);
    }
  },
};

var Medal = {
  sx: 240,
  syBest: 563,
  sy: 514,
  w: 47,
  h: 47,
  x: 119,
  y: 249,
  draw: function () {
    if (state.current == state.gameover) {
      if (score.current < score.best) {
        cnt.drawImage(
          sprite,
          this.sx,
          this.sy,
          this.w,
          this.h,
          this.x,
          this.y,
          this.w,
          this.h
        );
      } else {
        cnt.drawImage(
          sprite,
          this.sx,
          this.syBest,
          this.w,
          this.h,
          this.x,
          this.y,
          this.w,
          this.h
        );
      }
    }
  },
};
let state = { current: 0, ready: 0, gameover: 1, play: 2 };
function clickHandler() {
  switch (state.current) {
    case state.ready:
      Start.play();
      state.current = state.play;

      break;
    case state.gameover:
      bird.ySpeed = 0;
      pipes.position = [];
      score.current = 0;
      state.current = state.ready;

      break;
    default:
      bird.flap();
  }
}
document.addEventListener("click", clickHandler);
document.addEventListener("keydown", function (e) {
  if (e.which == 32) {
    clickHandler();
  }
});

function draw() {
  bg.draw();

  pipes.draw();
  fg.draw();
  bird.draw();
  gameOver.draw();
  getReady.draw();
  score.draw();
  Medal.draw();
}

function update() {
  bird.update();
  pipes.update();
  fg.update();
}
function animate() {
  update();
  draw();
  frames++;

  requestAnimationFrame(animate);
}

animate();
