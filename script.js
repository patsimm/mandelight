var w;
var canvas, context, fullWindowState;

var zoom = 1, transX = 0, transY = 0, depth = 30, state, colorMode;
var selectBox = document.getElementById('color_mode')

for (color in genColor) {
   option = document.createElement("option");
   option.textContent = color;
   selectBox.add(option);
}

function updateVarValues() {
    var zoomIn = document.getElementById("zoom");
    var transXIn = document.getElementById("transX");
    var transYIn = document.getElementById("transY");
    var depthIn  = document.getElementById("depth");
    var colorModeIn = document.getElementById("color_mode");

    zoom = parseFloat(zoomIn.value);
    transX = parseFloat(transXIn.value);
    transY = parseFloat(transYIn.value);
    depth = parseInt(depthIn.value);
    colorMode = colorModeIn.value;
}

//sets the input fields values
function updateInputValues() {
    var zoomIn = document.getElementById("zoom");
    var transXIn = document.getElementById("transX");
    var transYIn = document.getElementById("transY");
    var depthIn  = document.getElementById("depth");

    zoomIn.value = zoom;
    transXIn.value = transX;
    transYIn.value = transY;
    depthIn.value = depth;
}

function drawToCanvas(e) {
    var percent;
    context.putImageData(e.data, 0, 0);
    state++
    percent = Math.floor(state/(canvas.height/5)*100);
    context.globalAlpha = 0.5;
    context.fillStyle = "#000000";
    context.fillRect(0,0, canvas.width, 30);
    context.globalAlpha = 1;
    context.fillStyle = "#FFFFFF";
    context.font="20px Roboto";
    context.fillText(percent + " %", 5, 22);
    context.fillText("Zoom: " + zoom, 100, 22);
    context.font="13px Roboto";
    context.fillText("X: " + transX, canvas.width/2-50, 14);
    context.fillText("Y: " + transY, canvas.width/2-50, 26);
    context.fillText("by patsimm", canvas.width-85, 18);
    if(state > canvas.height / 5) {
        stop();
    }
}

function createWorker() {
    //create and start new worker
    w = new Worker('mandelbrot.js');
    w.addEventListener('message', drawToCanvas)
    var mandelData = [];
    mandelData['zoom'] = zoom;
    mandelData['transX'] = transX;
    mandelData['transY'] = transY;
    mandelData['depth'] = depth;
    mandelData['width'] = canvas.width;
    mandelData['height'] = canvas.height;
    mandelData['colorMode'] = colorMode;
    mandelData['imageData'] = context.createImageData(canvas.width, canvas.height);

    for(var i = 0; i <= canvas.width*canvas.height; i++) {
        mandelData['imageData'].data[i*4] = 182
        mandelData['imageData'].data[i*4+1] = 182
        mandelData['imageData'].data[i*4+2] = 182
        mandelData['imageData'].data[i*4+3] = 255
    }

    w.postMessage(mandelData);
}

function start() {
    //enable/disable buttons
    document.getElementById("stop_button").disabled = false;
    document.getElementById("start_button").disabled = true;

    //set state and terminate running worker
    state = 0;
    if(w !== undefined) {
        w.terminate();
    }
    canvas = document.getElementById('mandelbrot_canvas');
    context = canvas.getContext('2d');
    context.fillStyle = "#b6b6b6";
    context.fillRect(0, 0, canvas.width, canvas.height);

    updateVarValues();
    if(typeof(Worker) !== "undefined") {
        createWorker();
    } else {
        alert("Sorry, your Browser doesn't support web-workers!");
    }
}

//stops a running worker
function stop() {
    w.terminate();

    document.getElementById("stop_button").disabled = true;
    document.getElementById("start_button").disabled = false;
}

//moves/zooms the image in given direction
function move(direction) {
    stop();
    switch(direction) {
    case "right": transX += 1/zoom; break;
    case "left": transX -= 1/zoom; break;
    case "up": transY -= 1/zoom; break;
    case "down": transY += 1/zoom; break;
    case "zoomin": zoom = zoom * 2; break;
    case "zoomout": zoom = zoom / 2; break;
    case "depthup": depth += 5; break;
    case "depthdown": depth -= 5; break;
    }
    updateInputValues();
    start();
}

//toggle the fullscreen mode
function fullscreen() {
    if (!fullWindowState) {
        stop();
        fullWindowState = true;
        //canvas goes full Window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.className = 'fullscreen';
        document.body.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        document.body.position = 'fixed';
        start();
    } else {
        stop();
        fullWindowState = false;
        //canvas goes normal
        canvas.width = 820;
        canvas.height = 600;
        canvas.className = '';
        document.body.style.overflow = 'visible';
        document.body.position = 'relative';
        start();
    }
}

//window resize handler for fullscreen mode
window.onresize = onResizeHandler;
function onResizeHandler(e){
    if (fullWindowState){
        stop();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        start();
    }
}

function exportValues() {
    area = document.getElementById("export_import_area");
    jsonString = '{"zoom":' + zoom + ',"x":' + transX + ',"y":' + transY + ',"depth":' + depth + '}';
    area.value = jsonString;
}

function importValues() {
    area = document.getElementById("export_import_area");
    values = JSON.parse(area.value);
    zoom = values.zoom;
    transX = values.x;
    transY = values.y;
    depth = values.depth;
    updateInputValues();
    start();
}

//declaring keyboard shortcutswindow.onresize = onResizeHandler;
window.onkeyup = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 65) { //a key
        move("left");
    } else if (code === 87) { //w key
        move("up");
    } else if (code === 68) { //d key
        move("right");
    } else if (code === 83) { //s key
        move("down");
    } else if (code === 73) { //i key
        move("zoomin");
    } else if (code === 75) { //k key
        move("zoomout");
    } else if (code === 76) { //l key
        move("depthup");
    } else if (code === 74) { //j key
        move("depthdown");
    } else if (code === 69) { //e key
        start();
    } else if (code === 81) { //q key
        stop();
    } else if (code === 85) { //u key
        importValues();
    } else if (code === 79) { //o key
        exportValues();
    } else if (code === 70) { //f key
        fullscreen();
    } else if (code === 27) { //esc key
        if(fullWindowState) {
            fullscreen();
        }
    }
};
