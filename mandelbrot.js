var imgData;
var width;
var height;
var colorMode;

function paintPixel(x, y, r, g, b) {
	var startIndex = (y*width + x) * 4;
	imgData.data[startIndex] = r;
	imgData.data[startIndex + 1] = g;
	imgData.data[startIndex + 2] = b;
	imgData.data[startIndex + 3] = 255;
}

function mandelbrot(x, y, depth) {
	var x1 = 0, y1 = 0, x2, i = 0;
	for (i; i < depth; i+=0.1) {
		x2 = x1*x1 - y1*y1 + x;
		y1 = 2*x1*y1 + y;
		x1 = x2;
		if (x1*x1 + y1*y1 > 4) {
            break;
		}
	}
	return i;
}

//generates color for given depth
function genColor(d) {
	var color = [];
	if(colorMode == "green1") {
		color['r'] = (((Math.sin(d * 0.0125 + 30) + 1) / 2) * 255);
		color['g'] = (((Math.sin(d * 0.01875) + 1) / 2) * 255);
		color['b'] = (((Math.sin(d * 0.01875 + 60) + 1) / 2) * 255);
	} else if(colorMode == "multi1") {
		color['r'] = (((d) % 3 + 1) * 30) % 255;
		color['g'] = (((d) % 3 + 1) * 60) % 255;
		color['b'] = (((d) % 3 + 1) * 140) % 255;
	}
	return color;
}

function renderImage(zoom, transX, transY, depth) {
	var a, b;
	for (var i = 0; i < height; i++) {
		b = (i * 3 / height - 1.5) / zoom + transY;
		for (var j = 0; j < width; j++) {
			a = (j * 3 / height - 2.5 * height / 600) / zoom + transX
            var color = genColor(depth - mandelbrot(a, b, depth) * 10)
			paintPixel(j, i, color['r'], color['g'], color['b']);
		}
        if (i % 5 == 0) {
            self.postMessage(imgData);
        }
	}
    self.postMessage(imgData);
}

self.addEventListener('message', function(e) {
	imgData = e.data['imageData'];
	width = e.data['width'];
	height = e.data['height'];
	colorMode = e.data['colorMode']
	renderImage(e.data['zoom'],
				e.data['transX'],
				e.data['transY'],
				e.data['depth']);
});
