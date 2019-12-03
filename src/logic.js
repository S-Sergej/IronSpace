let music = new Audio("./sounds/game.mp3");
let intro = new Audio("./sounds/intro.mp3");

window.onload = function () {
  intro.play();
  document.getElementById('start-button').onclick = function () {
    intro.pause();
    music.play();
    let playfield = new Board(800, 500);
    playfield.scroll();
  }
}

class Board {
  constructor(width, height) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    document.getElementById("game-board").appendChild(this.canvas);
    this.img = new Image();
    this.img.src = "./img/finished_background.jpg";
    this.x = 0;
    this.absoluteWidth = 1143;
    this.speed = -5;
    this.scroll = this.scroll.bind(this);
  }
  draw() {
    this.ctx.drawImage(this.img, this.x, 0);
    if (this.x < 0) {
      this.ctx.drawImage(this.img, this.x + this.absoluteWidth, 0);
    } else {
      this.ctx.drawImage(this.img, this.x - this.absoluteWidth, 0);
    }
  }
  scroll() {
    console.log("update")
    this.ctx.clearRect(0, 0, this.absoluteWidth, this.canvas.height);
    this.x += this.speed;
    this.x %= this.absoluteWidth;
    this.draw();
    requestAnimationFrame(this.scroll);
  }
}

class MovingObject {
  constructor(x, y) {
    console.log("i am :", this)
  }
}

class Player extends MovingObject {
  constructor(x, y) {
    super(x, y)
    console.log("i am :", this)

  }
}

class Asteroids extends MovingObject {
  constructor(x, y) {
    super(x, y)
    console.log("i am :", this)

  }
}

class Game {

}