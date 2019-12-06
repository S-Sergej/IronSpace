
class Board {
  constructor (width, height, ctx) {
    this.ctx = ctx
    this.img = new Image()
    this.img.src = './img/finished_background.jpg'
    this.x = 0
    this.absoluteWidth = 1143
    this.speed = -5
    this.scroll = this.scroll.bind(this)
    this.draw = this.draw.bind(this)
  }
  draw () {
    this.ctx.drawImage(this.img, this.x, 0)
    if (this.x < 0) {
      this.ctx.drawImage(this.img, this.x + this.absoluteWidth, 0)
    } else {
      this.ctx.drawImage(this.img, this.x - this.absoluteWidth, 0)
    }
  }
  scroll () {
    this.ctx.clearRect(0, 0, this.absoluteWidth, this.ctx.height)
    this.x += this.speed
    this.x %= this.absoluteWidth
    this.draw()
  }
}

class MovingObject {
  constructor (startX, startY, width, height, ctx) {
    this.startX = startX
    this.startY = startY
    this.positionX = startX
    this.positionY = startY
    this.width = width
    this.height = height
    this.ctx = ctx
    this.speedX = 0
    this.speedY = 0
  }

  left(){
    return this.positionX;
  }
  right(){
    return this.positionX + this.width;
  }
  top (){
    return this.positionY
  }
  bottom (){
    return this.positionY + this.height;
  }
}

class Player extends MovingObject {
  constructor (startX, startY, width, height, ctx) {
    super(startX, startY, width, height, ctx)
    this.invincible = 0;
    this.img = new Image()
    this.img.src = './img/spaceship_62_70.png'
    this.draw = this.draw.bind(this)
    this.fly = this.fly.bind(this)
  }
  draw() {
    this.ctx.drawImage(this.img, (this.positionX += this.speedX), (this.positionY += this.speedY))
  }
  fly() {
    if (this.invincible) {
      this.invincible -= 1
      if (this.invincible%2 == 0){
        this.draw()
      }
    }else{
    this.draw();
    }
  }
}

class Asteroid extends MovingObject {
  constructor (startX, startY, width, height, imgSrc, ctx) {
    super(startX, startY, width, height, ctx)
    this.speedX = Math.random() * 10
    this.speedY = Math.random() * 5
    this.img = new Image()
    this.img.src = imgSrc
    this.draw = this.draw.bind(this)
    this.fly = this.fly.bind(this)
  }
  fly () {
    this.positionX -= this.speedX;
    this.positionY -= this.speedY;
    this.draw();

  }

  bounce(){
    this.speedY = -this.speedY
  }

  draw () {
    this.ctx.drawImage(this.img, this.positionX, this.positionY)
  }
}

class Game {
  constructor (width, height) {
    this.music = new Audio('./sounds/game.mp3')
    this.audioIntro = new Audio('./sounds/intro.mp3')
    this.audioExplosion = new Audio('./sounds/explosion.wav')
    this.audioPassedAsteroids = new Audio('./sounds/passed_counter.wav')
    this.gameOver = new Image()
    this.gameOver.src = './img/gameOver.png';
    this.winGame = new Image();
    this.winGame.src = './img/win.png'
    this.frames = 0;
    this.lives = 2;
    this.score = 0;
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = width
    this.canvas.height = height
    document.getElementById('game-board').appendChild(this.canvas)

    this.board = new Board(this.canvas.width, this.canvas.height, this.ctx)
    this.player = new Player(80, 220, 40, 60, this.ctx)
    this.asteroids = []
    this.movingObjects = []
    this.playerObject = []
    this.playerObject.push(this.player);

    this.start = this.start.bind(this)
    this.update = this.update.bind(this)
    this.spawnAsteroid = this.spawnAsteroid.bind(this)
    this.checkCollision = this.checkCollision.bind(this)
    this.areCollided = this.areCollided.bind(this)
    this.stopGame = this.stopGame.bind(this)
    this.gameWin = this.gameWin.bind(this)
    this.speedY = 0
    this.speedX = 0
    this.explosions = [];
    document.onkeydown = e => {
      switch (e.keyCode) {
        case 38:
          this.player.speedY -= 1
          e.preventDefault();
          break
        case 40:
          this.player.speedY += 1
          e.preventDefault();
          break
        case 37:
          this.player.speedX -= 1
          e.preventDefault();
          break
        case 39:
          this.player.speedX += 1
          e.preventDefault();
          break
        default:
      }
    }
  }
  spawnAsteroid () {
    let randomAsteroidImg = ['./img/asteroid_200.png','./img/asteroid_150.png','./img/asteroid_100.png'];
    let AsteroidSizes = [113,83,56];
    let randomIndex = Math.floor(Math.random() * randomAsteroidImg.length)
    this.frames += 1;
    if (this.frames % 100 === 0) {
      this.randomSpawn = Math.floor(Math.random() * 320)
      let asteroid = new Asteroid(this.canvas.width,this.randomSpawn,AsteroidSizes[randomIndex],AsteroidSizes[randomIndex],randomAsteroidImg[randomIndex],this.ctx)
      this.asteroids.push(asteroid);
      this.movingObjects = this.playerObject.concat(this.asteroids);
    }
  }

  checkCollision(){
    let animationPuffer = 20;
    let animationPufferBottom = 10;
    this.explosionSound = new Audio('./sounds/collision.wav')
    if (this.player.positionX < 0) { this.player.speedX = -this.player.speedX};
    if (this.player.positionX + this.player.width + animationPuffer > 1000) { this.player.speedX = -this.player.speedX };
    if (this.player.positionY < 0) { this.player.speedY = -this.player.speedY  };
    if (this.player.positionY + this.player.height + animationPufferBottom > 480) { this.player.speedY = -this.player.speedY}
    
    this.asteroids.forEach(asteroid => {
      if (asteroid.positionY + asteroid.height > 480 || asteroid.positionY < 0) asteroid.bounce();
    })

    this.asteroids.forEach((asteroid, _, asteroidsArray) => {
      if (asteroid.positionX+animationPuffer > -asteroid.width) {
        asteroid.fly();
      } else if (asteroid.positionX+animationPuffer < -asteroid.width) {
        asteroidsArray.splice(asteroidsArray.indexOf(asteroid), 1)
        this.score += 5;
        this.audioPassedAsteroids.play();
      }
    })
  }
  areCollided(player, asteroid){
    if (asteroid == player) return false;
    if (player.invincible) return false;
  if (asteroid.left() < player.right() && player.left() < asteroid.right()){
      if (asteroid.top() < player.bottom() &&player.top() < asteroid.bottom()){
        this.lives -= 1
        this.explosionSound.play();
        this.player.invincible = 50;
        //this.ctx.drawImage(this.explodeAnimation, 128*Math.floor(this.positionX),128*Math.floor(this.positionY),128,128, this.positionX, this.positionY, 100, 100);
      }
      return false; 
    }
    return false; 
}

  checkGameOver(){
    this.movingObjects.forEach(asteroid => {this.areCollided(this.player, asteroid)})
    if (this.lives === 0){
      this.stopGame();
    }
  }

  gameWin(){
    document.getElementById("start-easy").removeAttribute("disabled")
    clearInterval(this.interval);
    clearInterval(this.timeOut);
    this.ctx.drawImage(this.winGame,250,156)
    this.music.pause();
    setTimeout(function(){
      this.audioGameOver = new Audio('./sounds/GameOver.mp3')
      this.audioGameOver.play()
    }, 1500);
  }

  stopGame(){
    document.getElementById("start-easy").removeAttribute("disabled")
      clearInterval(this.interval);
      clearInterval(this.timeOut);
      this.ctx.drawImage(this.gameOver,250,156)
      this.music.pause();
      this.audioExplosion.play();
      setTimeout(function(){
        this.audioGameOver = new Audio('./sounds/GameOver.mp3')
        this.audioGameOver.play()
      }, 1500);
    }


  start (){
    this.audioIntro.pause();
    document.getElementById("start-easy","start-medium","start-hardcore").setAttribute("disabled", "disabled");
    this.music.play()
    this.interval = setInterval(this.update, 20)
    this.timeOut = setInterval(this.gameWin,5000)

    console.log(this.frames/2.5);
  }


  update () {
    this.board.scroll()
    this.player.fly()
    this.checkCollision()
    this.spawnAsteroid()
    this.checkGameOver()
    document.getElementById("shield").innerHTML = this.lives;
    document.getElementById("score").innerHTML = this.score;
    document.getElementById("timer").innerHTML = Math.ceil((5000/20-this.frames)/60);
}
}

window.onload = function () {
  let game = new Game(1000, 480)
    game.audioIntro.play()
  document.getElementById('start-easy').onclick = function () {
    game.start()
  }
  //for other levels
  /*  document.getElementById('start-medium').onclick = function () {
  }
    document.getElementById('start-hardcore').onclick = function () {
  }*/
}
