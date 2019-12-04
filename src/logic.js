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
}

class Player extends MovingObject {
  constructor (startX, startY, width, height, ctx) {
    super(startX, startY, width, height, ctx)
    this.img = new Image()
    this.img.src = './img/spaceship_90_102.png'
    this.draw = this.draw.bind(this)
  }
  draw () {
    this.ctx.drawImage(
      this.img,
      (this.positionX += this.speedX),
      (this.positionY += this.speedY)
    )
  }
}

class Asteroid extends MovingObject {
  constructor (startX, startY, width, height, imgSrc, ctx) {
    super(startX, startY, width, height, ctx)
    this.speedX = Math.random() * 10
    this.img = new Image()
    this.img.src = imgSrc
    this.draw = this.draw.bind(this)
    this.fly = this.fly.bind(this)
  }
  fly () {
    this.positionX -= this.speedX
    this.draw()
  }

  draw () {
    this.ctx.drawImage(this.img, this.positionX, this.positionY)
  }
}

class Game {
  constructor (width, height) {
    this.music = new Audio('./sounds/game.mp3')
    this.audioIntro = new Audio('./sounds/intro.mp3')

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = width
    this.canvas.height = height
    document.getElementById('game-board').appendChild(this.canvas)

    this.board = new Board(this.canvas.width, this.canvas.height, this.ctx)
    this.player = new Player(80, 80, 80, 80, this.ctx)
    this.asteroids = []
    this.frames = 0

    this.start = this.start.bind(this)
    this.update = this.update.bind(this)
    this.spawnAsteroid = this.spawnAsteroid.bind(this)
    this.speedY = 0
    this.speedX = 0
    document.onkeydown = e => {
      switch (e.keyCode) {
        case 38:
          this.player.speedY -= 1
          break
        case 40:
          this.player.speedY += 1
          break
        case 37:
          this.player.speedX -= 1
          break
        case 39:
          this.player.speedX += 1
          break
        default:
      }
    }
  }
  spawnAsteroid () {
    let randomAsteroidImg = ['./img/asteroid_200.png','./img/asteroid_150.png','./img/asteroid_100.png'];
    let AsteroidSizes = ['110','83','56'];
    let randomIndex = Math.floor(Math.random() * randomAsteroidImg.length)
    this.frames += 1
    if (this.frames % 100 === 0) {
      this.randomSpawn = Math.random() * 350 + 1
      this.asteroid = new Asteroid(1500,this.randomSpawn,AsteroidSizes[randomIndex],AsteroidSizes[randomIndex],randomAsteroidImg[randomIndex],this.ctx)
      this.asteroids.push(this.asteroid)
    }
  }

  start () {
    // this.audioIntro.pause();
    this.music.play()
    this.update()
  }

  update () {
    this.board.scroll()
    this.player.draw()
    this.spawnAsteroid()
    this.asteroids.forEach((asteroid, _, asteroidsArray) => {
      if (asteroid.positionX > -asteroid.width) {
        asteroid.fly()
      } else if (asteroid.positionX < -asteroid.width) {
       console.log(asteroidsArray, asteroidsArray.length)
        // debugger;
        asteroidsArray.splice(asteroidsArray.indexOf(asteroid), 1)
      }
    })
    window.requestAnimationFrame(this.update)
  }
}

window.onload = function () {
  let game = new Game(1000, 500)
  // game.audioIntro.play()
  document.getElementById('start-button').onclick = function () {
    game.start()
  }
}
