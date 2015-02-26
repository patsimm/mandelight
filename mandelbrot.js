var imgData;

importScripts('coloring.js')

function paintPixel(x, y, width, r, g, b) {
    var startIndex = (y*width + x) * 4;
    imgData.data[startIndex] = r;
    imgData.data[startIndex + 1] = g;
    imgData.data[startIndex + 2] = b;
    imgData.data[startIndex + 3] = 255;
}

function mandelbrot(x, y, depth, escape) {
    var x1 = 0, y1 = 0, x2, i = 0;
    for (i; i < depth; i++) {
        x2 = x1*x1 - y1*y1 + x;
        y1 = 2*x1*y1 + y;
        x1 = x2;
        if (Math.sqrt(x1*x1 + y1*y1) > escape) {
            break;
        }
    }
    mu = 5 + i - Math.log(Math.log(Math.sqrt(x1*x1 + y1*y1))) / Math.log(2);
    if (isNaN(mu))
        return depth + escape*escape;
    return mu;
}

function renderImage(zoom, transX, transY, depth, width, height, colorMode) {
    var a, b, centerX, centerY;
    pixelWidth = (3 / height) / zoom
    x0 = transX - .5 - (pixelWidth * width)/2;
    y0 = transY - (pixelWidth * height)/2;
    for (var y = 0; y < height; y++) {
        b = y0 + y * pixelWidth;
        for (var x = 0; x < width; x++) {
            a = x0 + x * pixelWidth;
            colorIndex = depth - mandelbrot(a, b, depth, 3.3)
            var color = genColor[colorMode](colorIndex)
            paintPixel(x, y, width, color['r'], color['g'], color['b']);
        }
        if (y % 5 == 0) {
            self.postMessage(imgData);
        }
    }
    self.postMessage(imgData);
}

self.addEventListener('message', function(e) {
    imgData = e.data['imageData'];
    renderImage(e.data['zoom'],
                e.data['transX'],
                e.data['transY'],
                e.data['depth'],
                e.data['width'],
                e.data['height'],
                e.data['colorMode']);
});
