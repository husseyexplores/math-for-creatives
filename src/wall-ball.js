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
    let ballPos = p.createVector(100, 100),
      ballSpeed = p.createVector(10, 10),
      ballRadius = 50

    // setup variables/flags
    let drewFirstFrame = false,
      canvasBgColor = '#fe934b55'

    function getCanvasDimensions() {
      const { windowWidth, windowHeight } = p

      let xMargin = 40
      let yMargin = 40

      p.canvas.style.transform = `translateY(${yMargin / 2}px)`

      canvasWidth = windowWidth - xMargin
      canvasHeight = windowHeight - yMargin

      canvasCenterX = canvasWidth / 2
      canvasCenterY = windowHeight / 2

      // if (ballPos.x == null || ballPos.x > canvasWidth) {
      //   ballPos.x = canvasCenterX
      // }

      // if (ballPos.y == null || ballPos.y > canvasHeight) {
      //   ballPos.y = canvasCenterY
      // }

      return [canvasWidth, canvasHeight]
    }

    function updateBallCoords() {
      let leftOutOfBound = ballPos.x - ballRadius <= 0
      let rightOutOfBound = ballPos.x + ballRadius >= canvasWidth
      if (leftOutOfBound) {
        // Reverse speed/direction
        ballSpeed.x = Math.abs(ballSpeed.x)
        dropSoundFx.play()
      } else if (rightOutOfBound) {
        ballSpeed.x = Math.abs(ballSpeed.x) * -1
        dropSoundFx.play()
      }

      let topOutOfBound = ballPos.y - ballRadius <= 0
      let bottomOutOfBound = ballPos.y + ballRadius >= canvasHeight
      if (topOutOfBound) {
        // Reverse speed/direction
        ballSpeed.y = Math.abs(ballSpeed.y)
        dropSoundFx.play()
      } else if (bottomOutOfBound) {
        ballSpeed.y = Math.abs(ballSpeed.y) * -1
        dropSoundFx.play()
      }

      // ballPos.x += ballSpeed.x
      // ballPos.y += ballSpeed.y
      ballPos.add(ballSpeed)

      // If out of screen - align it to the edge
      ballPos.x = p.constrain(ballPos.x, ballRadius, canvasWidth - ballRadius)
      ballPos.y = p.constrain(ballPos.y, ballRadius, canvasWidth - ballRadius)
    }

    function changeBallDirection() {
      ballSpeed.rotate(p.random(0.5, p.TWO_PI))
    }

    p.setup = () => {
      p.createCanvas.apply(p, getCanvasDimensions())
      p.background(canvasBgColor)

      ballPos = p.createVector(
        p.random(ballRadius, canvasWidth - ballRadius),
        p.random(ballRadius, canvasHeight - ballRadius)
      )

      changeBallDirection()
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
      p.circle(ballPos.x, ballPos.y, ballRadius * 2)

      p.fill('#ffffff')
    }

    p.mousePressed = () => {
      changeBallDirection()
    }
    p.keyPressed = () => {
      let activeEl = document.activeElement
      if (activeEl !== document.body && activeEl !== p.canvas) return

      // Space or enter is pressed
      if (p.keyIsDown(32) || p.keyIsDown(13)) {
        changeBallDirection()
      }
    }

    p.mouseWheel = e => {
      let scrolledUp = e.deltaY < 0
      ballSpeed.mult(scrolledUp ? 0.95 : 1.05)
    }
  }

  return new window.p5(sketch, root)
}
