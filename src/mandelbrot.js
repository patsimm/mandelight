const genColor = require('./coloring.js')

let imgData

const paintPixel = (x, y, width, r, g, b) => {
  const startIndex = (y * width + x) * 4
  imgData.data[startIndex] = r
  imgData.data[startIndex + 1] = g
  imgData.data[startIndex + 2] = b
  imgData.data[startIndex + 3] = 255
}

const mandelbrot = (x, y, depth, escape) => {
  let x1 = 0,
    y1 = 0,
    x2,
    i = 0
  for (i; i < depth; i++) {
    x2 = x1 * x1 - y1 * y1 + x
    y1 = 2 * x1 * y1 + y
    x1 = x2
    if (Math.sqrt(x1 * x1 + y1 * y1) > escape) {
      break
    }
  }
  const mu =
    5 + i - Math.log(Math.log(Math.sqrt(x1 * x1 + y1 * y1))) / Math.log(2)
  if (isNaN(mu)) return depth + escape * escape
  return mu
}

const renderImage = (zoom, transX, transY, depth, width, height, colorMode) => {
  let a, b
  const pixelWidth = 3 / height / Math.pow(2, zoom)
  const x0 = transX - 0.5 - (pixelWidth * width) / 2
  const y0 = transY - (pixelWidth * height) / 2
  for (let y = 0; y < height; y++) {
    b = y0 + y * pixelWidth
    for (let x = 0; x < width; x++) {
      a = x0 + x * pixelWidth
      const colorIndex = depth - mandelbrot(a, b, depth, 3.3)
      const color = genColor[colorMode](colorIndex)
      paintPixel(x, y, width, color['r'], color['g'], color['b'])
    }
    if (y % 5 == 0) {
      self.postMessage(imgData)
    }
  }
  self.postMessage(imgData)
}

self.addEventListener('message', e => {
  imgData = e.data['imageData']
  renderImage(
    e.data['zoom'],
    e.data['transX'],
    e.data['transY'],
    e.data['depth'],
    e.data['width'],
    e.data['height'],
    e.data['colorMode']
  )
})
