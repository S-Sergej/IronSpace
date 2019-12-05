let score = 0;
let shield = 20;

class Board {
  constructor (width, height, ctx) {
    this.ctx = ctx
    this.img = new Image()
    this.img.src = './img/finished_background.jpg'
    this.x = 0
    this.absoluteWidth = 1143
    this.speed = -3
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
    this.img = new Image()
    this.img.src = './img/spaceship_90_102.png'
    this.draw = this.draw.bind(this)
  }
  draw () {
    this.ctx.drawImage(this.img,(this.positionX += this.speedX),(this.positionY += this.speedY))
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
    this.positionX -= this.speedX
    this.positionY -= this.speedY
    this.draw()
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
    this.frames = 0;
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = width
    this.canvas.height = height
    document.getElementById('game-board').appendChild(this.canvas)

    this.board = new Board(this.canvas.width, this.canvas.height, this.ctx)
    this.player = new Player(80, 80, 60, 70, this.ctx)
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
    this.speedY = 0
    this.speedX = 0
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
    let AsteroidSizes = [110,83,56];
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
    let animationPuffer = 40;
    
    if (this.player.positionX < 0){this.player.speedX +=0.5};
    if (this.player.positionX+this.player.width > 1000){this.player.speedX -=0.5};
    if (this.player.positionY < 0){this.player.speedY +=0.5};
    if (this.player.positionY+this.player.height > 480){this.player.speedY -=0.5};
    
    this.asteroids.forEach(asteroid => {
      if (asteroid.positionY + asteroid.height*1.4 > 480 || asteroid.positionY + asteroid.height/2.5 < 0) asteroid.bounce();
    })

    this.asteroids.forEach((asteroid, _, asteroidsArray) => {
      if (asteroid.positionX+animationPuffer > -asteroid.width) {
        asteroid.fly();
      } else if (asteroid.positionX+animationPuffer < -asteroid.width) {
        asteroidsArray.splice(asteroidsArray.indexOf(asteroid), 1)
        score = score + 5;
      }
    })
  }
  areCollided(player, asteroid){
    this.explosion = new Audio('../sounds/explosion.mp3')
    if (asteroid == player) return false;
  if (asteroid.left() < player.right() && player.left() < asteroid.right()){
      if (asteroid.top() < player.bottom() &&player.top() < asteroid.bottom()){
        shield -= 1
        this.explosion.play();
        if (this.shield < 0){
          return true;
        }
      }
      return false; 
    }
    return false; 
}

  /*drawScore(){
    this.ctx.font = "16px arial";
    this.ctx.fillstyle = "white";
    this.ctx.fillText("Score: " + score, 8, 20)
  }*/


  checkGameOver(){
    let spaceshipDestroyed = this.movingObjects.some(asteroid => {return this.areCollided(this.player, asteroid)})
    if (spaceshipDestroyed){
      //document.getElementById('game-over').appendChild(this.canvas)
      this.stopGame();
    };
  }

  stopGame(){
    document.getElementById("start-button").removeAttribute("disabled");
  }

  start () {
    // this.audioIntro.pause();
    document.getElementById("start-button").setAttribute("disabled", "disabled");
    this.music.play()
    this.update()
  }


  update () {
    this.board.scroll()
    this.player.draw()
    this.checkCollision()
    this.spawnAsteroid()
    this.checkGameOver()
    if (shield > 1){
    window.requestAnimationFrame(this.update)
    }
    else{
      this.music.pause();
    }
  }
}

window.onload = function () {
  let game = new Game(1000, 480)
  // game.audioIntro.play()
  document.getElementById('start-button').onclick = function () {
    game.start()
    event.preventDefault();
  }
}
