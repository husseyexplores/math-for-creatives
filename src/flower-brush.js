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
    let Flower = flowerMaker(p)

    // data / state
    let canvasWidth, canvasHeight, canvasCenterX, canvasCenterY
    const MIN_BRUSH_RAD = 10,
      MAX_Brush_RAD = 40
    let brushRadius = MIN_BRUSH_RAD
    let brushColor = p.random(360)
    let flowers = []

    // setup variables/flags
    let canvasBgColor = '#111118'

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

    function updateBrush() {
      brushRadius = p.constrain(
        (brushRadius += 0.2),
        MIN_BRUSH_RAD,
        MAX_Brush_RAD
      )
      brushColor += 1.5
      if (brushColor > 360) brushColor = 0
    }

    p.setup = () => {
      p.createCanvas.apply(p, getCanvasDimensions())
      flowers = []
      p.background(canvasBgColor)
    }

    p.windowResized = () => {
      p.resizeCanvas.apply(p, getCanvasDimensions())
    }

    p.draw = () => {
      p.background(canvasBgColor)
      if (p.mouseIsPressed) {
        updateBrush()
        let flower = Flower(p.mouseX, p.mouseY, brushColor, brushRadius)
        flowers.push(flower)
      } else {
        // Space or backspace is pressed
        if (p.keyIsDown(32) || p.keyIsDown(8)) {
          flowers.pop()
        }
      }

      flowers.forEach(f => f.draw())
    }

    p.mouseReleased = () => {
      brushRadius = MIN_BRUSH_RAD
    }
  }

  return new window.p5(sketch, root)
}

/**
 *
 * @param {import('@types/p5')} p
 * @returns {Function}
 */
const flowerMaker = p => (x, y, hue, size) => {
  let petalCount = Math.floor(p.random(5, 14))

  let petalSize = Math.max(2, Math.floor(p.random(size / 3, size / 10)))
  let eachPetalAngle = p.TWO_PI / petalCount

  let startRot = 0
  let rotSpeed = p.random(-0.001, 0.01)

  return {
    draw() {
      startRot += rotSpeed

      p.noStroke()
      p.colorMode(p.HSB)
      p.fill(hue, 100, 90)
      p.circle(x, y, size * 2)

      for (let i = 0; i < petalCount; i++) {
        let angle = (p.TWO_PI * i) / petalCount + startRot
        let branch = p.createVector(size + 5, 0)
        branch.rotate(angle)
        branch.add(x, y)
        p.ellipse(branch.x, branch.y, petalSize * 2)
      }
    },
  }
}
