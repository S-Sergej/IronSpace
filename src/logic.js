class Board {
  constructor(width, height, ctx) {
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = "./img/finished_background.jpg";
    this.x = 0;
    this.absoluteWidth = 1143;
    this.speed = -5;
    this.scroll = this.scroll.bind(this);
    this.draw = this.draw.bind(this);
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
    this.ctx.clearRect(0, 0, this.absoluteWidth, this.ctx.height);
    this.x += this.speed;
    this.x %= this.absoluteWidth;
    this.draw();
  }
}

class MovingObject {
  constructor(positionX, positionY, width, height, ctx) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
  }
}

class Player extends MovingObject {
  constructor(ctx) {
    super(20, 250, 80, 80);
    this.img = new Image();
    this.img.src = "../img/spaceship.png";
    document.onkeydown = e => {
      switch(e.keyCode){
        case 38:
          this.ySpeed -= 10;
          break;
        case 40:
          this.ySpeed += 10;
          break;
        default:
      }
    }
    document.onkeyup = e => {
      this.ySpeed = 0;
    }
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
    this.ctx.clearRect(0, 0, this.absoluteWidth, this.ctx.height);
    this.x += this.speed;
    this.x %= this.absoluteWidth;
    this.draw();
  }



}

class Asteroids extends MovingObject {
  constructor(x, y) {
    super(x, y)

  }
}

class Game {
constructor(width, height) {
this.music = new Audio("./sounds/game.mp3");
this.audioIntro = new Audio("./sounds/intro.mp3");

this.canvas = document.createElement("canvas");
this.ctx = this.canvas.getContext("2d");
this.canvas.width = width;
this.canvas.height = height;
document.getElementById("game-board").appendChild(this.canvas);

this.board = new Board(this.canvas.width, this.canvas.height, this.ctx); 
this.player = new Player(20, 20, 80, 80, this.ctx);
this.start = this.start.bind(this);
this.update = this.update.bind(this);
}

start(){
this.audioIntro.pause();
this.music.play();
this.update();
}

update(){
this.board.scroll();
//this.player.update();
window.requestAnimationFrame(this.update);
}

}

window.onload = function () {
  let game = new Game(800, 500);
  game.audioIntro.play()
  document.getElementById('start-button').onclick = function () {
    game.start()
  }
}