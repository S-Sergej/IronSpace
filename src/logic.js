window.onload = function () {
    let newBoard = new Board(800, 500)
    document.getElementById('start-button').onclick = function () {
      startGame();
    }

    function startGame () {
        newBoard.clear();
        newBoard.drawBoard();
    }
}

class Board {
    constructor (width, height,) {
      this.canvas = document.createElement('canvas')
      this.canvas.width = width
      this.canvas.height = height
      this.ctx = this.canvas.getContext('2d')
      document.body.insertBefore(this.canvas, document.body.childNodes[0])
      }

    clear (){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    drawBoard(){
    let img = new Image()
    img.src = "../img/SpaceBackground.png"
    img.onload = () => {
        this.ctx.drawImage(img, 0, 0)
        }
    }
}

