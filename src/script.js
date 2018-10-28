const genColor = require('./coloring.js')

let w
let canvas, context, fullWindowState

let zoom = 0,
  transX = 0,
  transY = 0,
  depth = 70,
  state,
  colorMode
const selectBox = document.getElementById('color_mode')

for (const color in genColor) {
  const option = document.createElement('option')
  option.textContent = color
  selectBox.add(option)
}

const updateVarValues = () => {
  const zoomIn = document.getElementById('zoom')
  const transXIn = document.getElementById('transX')
  const transYIn = document.getElementById('transY')
  const depthIn = document.getElementById('depth')
  const colorModeIn = document.getElementById('color_mode')

  zoom = parseFloat(zoomIn.value)
  transX = parseFloat(transXIn.value)
  transY = parseFloat(transYIn.value)
  depth = parseInt(depthIn.value)
  colorMode = colorModeIn.value
}

// sets the input fields values
const updateInputValues = () => {
  const zoomIn = document.getElementById('zoom')
  const transXIn = document.getElementById('transX')
  const transYIn = document.getElementById('transY')
  const depthIn = document.getElementById('depth')

  zoomIn.value = zoom
  transXIn.value = transX
  transYIn.value = transY
  depthIn.value = depth
}

const drawToCanvas = e => {
  let text, textWidth
  state++
  context.putImageData(e.data, 0, 0)
  const percent = Math.floor((state / (canvas.height / 5)) * 100)
  context.globalAlpha = 0.5
  context.fillStyle = '#000000'
  context.fillRect(0, 0, canvas.width, 30)
  context.globalAlpha = 1
  context.fillStyle = '#FFFFFF'
  context.font = '20px Roboto'
  context.fillText(percent + ' %', 5, 22)
  context.fillText('ZOOM ' + zoom, 70, 22)
  context.font = '13px Roboto'
  text = 'X ' + transX
  textWidth = context.measureText(text).width
  context.fillText(text, canvas.width / 2 - textWidth / 2, 14)
  text = 'Y ' + transY
  textWidth = context.measureText(text).width
  context.fillText(text, canvas.width / 2 - textWidth / 2, 26)

  context.font = '20px Roboto'
  text = 'DEPTH ' + depth
  textWidth = context.measureText(text).width
  context.fillText(text, canvas.width - 18 - textWidth, 22)
  if (state > canvas.height / 5) {
    stop()
  }
}

const createWorker = () => {
  // create and start new worker
  w = new Worker('mandelbrot.js')
  w.addEventListener('message', drawToCanvas)
  const mandelData = []
  mandelData['zoom'] = zoom
  mandelData['transX'] = transX
  mandelData['transY'] = transY
  mandelData['depth'] = depth
  mandelData['width'] = canvas.width
  mandelData['height'] = canvas.height
  mandelData['colorMode'] = colorMode
  mandelData['imageData'] = context.createImageData(canvas.width, canvas.height)

  for (let i = 0; i <= canvas.width * canvas.height; i++) {
    mandelData['imageData'].data[i * 4] = 182
    mandelData['imageData'].data[i * 4 + 1] = 182
    mandelData['imageData'].data[i * 4 + 2] = 182
    mandelData['imageData'].data[i * 4 + 3] = 255
  }

  w.postMessage(mandelData)
}

const start = () => {
  // enable/disable buttons
  document.getElementById('stop_button').disabled = false
  document.getElementById('start_button').disabled = true

  // set state and terminate running worker
  state = 0
  if (w !== undefined) {
    w.terminate()
  }
  canvas = document.getElementById('mandelbrot_canvas')
  context = canvas.getContext('2d')
  context.fillStyle = '#b6b6b6'
  context.fillRect(0, 0, canvas.width, canvas.height)

  updateVarValues()
  if (typeof Worker !== 'undefined') {
    createWorker()
  } else {
    alert("Sorry, your Browser doesn't support web-workers!")
  }
}

// stops a running worker
const stop = () => {
  w.terminate()

  document.getElementById('stop_button').disabled = true
  document.getElementById('start_button').disabled = false
}

// moves/zooms the image in given direction
const move = direction => {
  stop()
  switch (direction) {
    case 'right':
      transX += 0.5 / Math.pow(2, zoom)
      break
    case 'left':
      transX -= 0.5 / Math.pow(2, zoom)
      break
    case 'up':
      transY -= 0.5 / Math.pow(2, zoom)
      break
    case 'down':
      transY += 0.5 / Math.pow(2, zoom)
      break
    case 'zoomin':
      zoom = zoom + 1
      break
    case 'zoomout':
      zoom = zoom - 1
      break
    case 'depthup':
      depth += 10
      break
    case 'depthdown':
      depth -= 10
      break
  }
  updateInputValues()
  start()
}

// toggle the fullscreen mode
const fullscreen = () => {
  if (!fullWindowState) {
    stop()
    fullWindowState = true
    // canvas goes full Window
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.className = 'fullscreen'
    document.body.scrollTop = 0
    document.body.style.overflow = 'hidden'
    document.body.position = 'fixed'
    start()
  } else {
    stop()
    fullWindowState = false
    // canvas goes normal
    canvas.width = 820
    canvas.height = 600
    canvas.className = ''
    document.body.style.overflow = 'visible'
    document.body.position = 'relative'
    start()
  }
}

// window resize handler for fullscreen mode
const onResizeHandler = () => {
  if (fullWindowState) {
    stop()
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    start()
  }
}
window.onresize = onResizeHandler

const exportValues = () => {
  const area = document.getElementById('export_import_area')
  const jsonString =
    '{"zoom":' +
    zoom +
    ',"x":' +
    transX +
    ',"y":' +
    transY +
    ',"depth":' +
    depth +
    ',"color":"' +
    colorMode +
    '"}'
  area.value = jsonString
}
window.exportValues = exportValues

const importValues = () => {
  const area = document.getElementById('export_import_area')
  const values = JSON.parse(area.value)
  zoom = values.zoom
  transX = values.x
  transY = values.y
  depth = values.depth
  colorMode = values.color
  updateInputValues()
  start()
}
window.importValues = importValues

// declaring keyboard shortcuts
window.onkeyup = function(e) {
  const code = e.keyCode ? e.keyCode : e.which
  if (code === 65) {
    // a key
    move('left')
  } else if (code === 87) {
    // w key
    move('up')
  } else if (code === 68) {
    // d key
    move('right')
  } else if (code === 83) {
    // s key
    move('down')
  } else if (code === 73) {
    // i key
    move('zoomin')
  } else if (code === 75) {
    // k key
    move('zoomout')
  } else if (code === 76) {
    // l key
    move('depthup')
  } else if (code === 74) {
    // j key
    move('depthdown')
  } else if (code === 69) {
    // e key
    start()
  } else if (code === 81) {
    // q key
    stop()
  } else if (code === 85) {
    // u key
    importValues()
  } else if (code === 79) {
    // o key
    exportValues()
  } else if (code === 70) {
    // f key
    fullscreen()
  } else if (code === 27) {
    // esc key
    if (fullWindowState) {
      fullscreen()
    }
  }
}

updateInputValues()
start()
