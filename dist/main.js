!function(e){var t={};function o(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(n,a,function(t){return e[t]}.bind(null,a));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=1)}([function(e,t){e.exports={multi:function(e){const t=[];return t.r=(Math.sin(.0125*e+30)+1)/2*255,t.g=(Math.sin(.01875*e)+1)/2*255,t.b=(Math.sin(.01875*e+60)+1)/2*255,t},rgb:function(e){const t=[];return(e=e%99/33)>=2?(e-=2,t.r=255*e,t.g=0,t.b=255*(1-e),t):e>=1?(e-=1,t.r=0,t.g=255*(1-e),t.b=255*e,t):e<1?(t.r=255*(1-e),t.g=255*e,t.b=0,t):void 0}}},function(e,t,o){const n=o(0);let a,d,r,i,l,u,c=0,s=0,m=0,h=70;const p=document.getElementById("color_mode");for(const e in n){const t=document.createElement("option");t.textContent=e,p.add(t)}const f=()=>{const e=document.getElementById("zoom"),t=document.getElementById("transX"),o=document.getElementById("transY"),n=document.getElementById("depth");e.value=c,t.value=s,o.value=m,n.value=h},g=e=>{let t,o;l++,r.putImageData(e.data,0,0);const n=Math.floor(l/(d.height/5)*100);r.globalAlpha=.5,r.fillStyle="#000000",r.fillRect(0,0,d.width,30),r.globalAlpha=1,r.fillStyle="#FFFFFF",r.font="20px Roboto",r.fillText(n+" %",5,22),r.fillText("ZOOM "+c,70,22),r.font="13px Roboto",t="X "+s,o=r.measureText(t).width,r.fillText(t,d.width/2-o/2,14),t="Y "+m,o=r.measureText(t).width,r.fillText(t,d.width/2-o/2,26),r.font="20px Roboto",t="DEPTH "+h,o=r.measureText(t).width,r.fillText(t,d.width-18-o,22),l>d.height/5&&w()},b=()=>{document.getElementById("stop_button").disabled=!1,document.getElementById("start_button").disabled=!0,l=0,void 0!==a&&a.terminate(),d=document.getElementById("mandelbrot_canvas"),(r=d.getContext("2d")).fillStyle="#b6b6b6",r.fillRect(0,0,d.width,d.height),(()=>{const e=document.getElementById("zoom"),t=document.getElementById("transX"),o=document.getElementById("transY"),n=document.getElementById("depth"),a=document.getElementById("color_mode");c=parseFloat(e.value),s=parseFloat(t.value),m=parseFloat(o.value),h=parseInt(n.value),u=a.value})(),"undefined"!=typeof Worker?(()=>{(a=new Worker("mandelbrot.js")).addEventListener("message",g);const e=[];e.zoom=c,e.transX=s,e.transY=m,e.depth=h,e.width=d.width,e.height=d.height,e.colorMode=u,e.imageData=r.createImageData(d.width,d.height);for(let t=0;t<=d.width*d.height;t++)e.imageData.data[4*t]=182,e.imageData.data[4*t+1]=182,e.imageData.data[4*t+2]=182,e.imageData.data[4*t+3]=255;a.postMessage(e)})():alert("Sorry, your Browser doesn't support web-workers!")},w=()=>{a.terminate(),document.getElementById("stop_button").disabled=!0,document.getElementById("start_button").disabled=!1},y=e=>{switch(w(),e){case"right":s+=.5/Math.pow(2,c);break;case"left":s-=.5/Math.pow(2,c);break;case"up":m-=.5/Math.pow(2,c);break;case"down":m+=.5/Math.pow(2,c);break;case"zoomin":c+=1;break;case"zoomout":c-=1;break;case"depthup":h+=10;break;case"depthdown":h-=10}f(),b()},v=()=>{i?(w(),i=!1,d.width=820,d.height=600,d.className="",document.body.style.overflow="visible",document.body.position="relative",b()):(w(),i=!0,d.width=window.innerWidth,d.height=window.innerHeight,d.className="fullscreen",document.body.scrollTop=0,document.body.style.overflow="hidden",document.body.position="fixed",b())};window.onresize=(()=>{i&&(w(),d.width=window.innerWidth,d.height=window.innerHeight,b())});const x=()=>{const e=document.getElementById("export_import_area"),t='{"zoom":'+c+',"x":'+s+',"y":'+m+',"depth":'+h+',"color":"'+u+'"}';e.value=t};window.exportValues=x;const E=()=>{const e=document.getElementById("export_import_area"),t=JSON.parse(e.value);c=t.zoom,s=t.x,m=t.y,h=t.depth,u=t.color,f(),b()};window.importValues=E,window.onkeyup=function(e){const t=e.keyCode?e.keyCode:e.which;65===t?y("left"):87===t?y("up"):68===t?y("right"):83===t?y("down"):73===t?y("zoomin"):75===t?y("zoomout"):76===t?y("depthup"):74===t?y("depthdown"):69===t?b():81===t?w():85===t?E():79===t?x():70===t?v():27===t&&i&&v()},f(),b()}]);