// 2372013 - Rey Immanuel
// 2372017 - Christian Jeffry
// 2372019 - Charles Sung
// 2372021 - Nathanael

let canvas;
let ctx;
let imageData;

export function initGraphics(canvasId) {
  canvas = document.getElementById(canvasId);
  ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
}

//  Algoritma DDA
export function draw_dot(x, y) {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let index = 4 * (Math.round(x) + Math.round(y) * canvas.width);
  imageData.data[index] = 0;     
  imageData.data[index + 1] = 0; 
  imageData.data[index + 2] = 0; 
  imageData.data[index + 3] = 255; 
  ctx.putImageData(imageData, 0, 0);
}

export function dda_line(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;

  let steps = Math.max(Math.abs(dx), Math.abs(dy));
  let Xinc = dx / steps;
  let Yinc = dy / steps;

  let X = x1;
  let Y = y1;

  for (let i = 0; i <= steps; i++) {
    draw_dot(X, Y);
    X += Xinc;
    Y += Yinc;
  }
}

export function draw_polygon(points) {
  for (let i = 0; i < points.length; i++) {
    let x1 = points[i].x;
    let y1 = points[i].y;
    let x2 = points[(i + 1) % points.length].x;
    let y2 = points[(i + 1) % points.length].y;
    dda_line(x1, y1, x2, y2);
  }
}

export function drawText(x, y, text) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

export function drawNumberBox(x, y, size, number) {
  const half = size / 2;
  const points = [
    { x: x, y: y },
    { x: x + size, y: y },
    { x: x + size, y: y + size },
    { x: x, y: y + size },
  ];
  draw_polygon(points);

  drawText(x + half, y + half, number);
}

export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}