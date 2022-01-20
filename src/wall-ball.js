/**
 *
 * @param {object} options
 * @param {HTMLElement} options.root
 * @returns
 */
export const init = ({ root } = {}) => {
  /**
   *
   * @param {import('@types/p5')} p
   */
  function sketch(p) {
    // data / state
    let canvasWidth, canvasHeight, canvasCenterX, canvasCenterY, dropSoundFx
    let ballX = null,
      ballY = null,
      speedX = 12,
      speedY = 12,
      ballRadius = 25

    // setup variables/flags
    let drewFirstFrame = false,
      canvasBgColor = '#fe934b55'

    window.getCanvasDimensions = getCanvasDimensions
    function getCanvasDimensions() {
      const { windowWidth, windowHeight } = p

      let xMargin = 40
      let yMargin = 40

      p.canvas.style.transform = `translateY(${yMargin / 2}px)`

      canvasWidth = windowWidth - xMargin
      canvasHeight = windowHeight - yMargin

      canvasCenterX = canvasWidth / 2
      canvasCenterY = windowHeight / 2

      // if (ballX == null || ballX > canvasWidth) {
      //   ballX = canvasCenterX
      // }

      // if (ballY == null || ballY > canvasHeight) {
      //   ballY = canvasCenterY
      // }

      return [canvasWidth, canvasHeight]
    }

    function updateBallCoords() {
      let leftOutOfBound = ballX - ballRadius < 0
      let rightOutOfBound = ballX + ballRadius > canvasWidth
      if (leftOutOfBound) {
        // Reverse speed/direction
        speedX = Math.abs(speedX)
        // dropSoundFx.play()
      } else if (rightOutOfBound) {
        speedX = Math.abs(speedX) * -1
        // dropSoundFx.play()
      }

      let topOutOfBound = ballY - ballRadius < 0
      let bottomOutOfBound = ballY + ballRadius > canvasHeight
      if (topOutOfBound) {
        // Reverse speed/direction
        speedY = Math.abs(speedY)
        // dropSoundFx.play()
      } else if (bottomOutOfBound) {
        speedY = Math.abs(speedY) * -1
        // dropSoundFx.play()
      }

      ballX += speedX
      ballY += speedY
    }

    p.setup = () => {
      p.createCanvas.apply(p, getCanvasDimensions())
      p.background(canvasBgColor)

      ballX = p.random(ballRadius, canvasWidth - ballRadius)
      ballY = p.random(ballRadius, canvasHeight - ballRadius)
    }

    p.preload = () => {
      dropSoundFx = p.loadSound('./assets/drop.mp3')
    }

    p.windowResized = () => {
      p.resizeCanvas.apply(p, getCanvasDimensions())
    }

    p.draw = () => {
      if (!drewFirstFrame) drewFirstFrame = true
      p.background(canvasBgColor)

      updateBallCoords()

      p.noStroke()
      p.circle(ballX, ballY, ballRadius * 2)

      p.fill('#ffffff')
    }

    // p.mousePressed = () => {
    //   let d = p.dist(p.mouseX, p.mouseY, 360, 200)
    //   if (d < 100) {
    //   }
    // }
  }

  return new window.p5(sketch, root)
}
