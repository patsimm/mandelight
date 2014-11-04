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

function checkC(imC, reC, depth) {
    var x = 0, x2, y = 0;
    for (var i = 0; i < depth; i++) {
        var x2 = x * x - y * y + imC;
        y = 2 * x * y + reC;
        x = x2;
        if (x * x + y * y > 4) {
            return false;
        }
    }
    return true;
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
    for (var d = 0; d < depth; d++) {
        var a, b;
        var color = genColor(d);

        for (var i = 0; i < height; i++) {
            b = (i * 3 / height - 1.5) / zoom + transY;
            for (var j = 0; j < width; j++) {
                a = (j * 3 / height - 2.5) / zoom + transX
                if (checkC(a, b, d)) {
                    paintPixel(j, i, color['r'], color['g'], color['b']);
                }
            }
        }
        self.postMessage(imgData);
    }
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
