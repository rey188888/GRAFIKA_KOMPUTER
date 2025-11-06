// 2372013 - Rey Immanuel
// 2372017 - Christian Jeffry
// 2372019 - Charles Sung
// 2372021 - Nathanael

// ================================
// Bagian: graflib.js (digabung)
// ================================

let canvas;
let ctx;
let imageData;
let animationRunning = false;
let animationFrame = 0;


function initGraphics(canvasId) {
  canvas = document.getElementById(canvasId);
  ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
}

// Algoritma DDA
function draw_dot(x, y) {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let index = 4 * (Math.round(x) + Math.round(y) * canvas.width);
  imageData.data[index] = 0;
  imageData.data[index + 1] = 0;
  imageData.data[index + 2] = 0;
  imageData.data[index + 3] = 255;
  ctx.putImageData(imageData, 0, 0);
}

function dda_line(x1, y1, x2, y2) {
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

function garisPenghubung(x1, y1, x2, y2, size) {
  let xAwal = x1 + size / 2;
  let yAwal = y1 + size / 2;
  let xAkhir = x2 + size / 2;
  let yAkhir = y2 + size / 2;

  let dx = xAkhir - xAwal;
  let dy = yAkhir - yAwal;
  let panjang = Math.sqrt(dx * dx + dy * dy);

  if (panjang === 0) return;
  let nx = dx / panjang;
  let ny = dy / panjang;

  let titikTengah = size / 1.5;

  let xMulai = xAwal + nx * titikTengah;
  let yMulai = yAwal + ny * titikTengah;
  let xSelesai = xAkhir - nx * titikTengah;
  let ySelesai = yAkhir - ny * titikTengah;

  dda_line(xMulai, yMulai, xSelesai, ySelesai);
}

function drawTree(node, x, y, level, jarakX, jarakY, size) {
  if (node == null) return;

  let leftX = x - jarakX / (level + 1);
  let rightX = x + jarakX / (level + 1);
  let nextY = y + jarakY;

  if (node.left != null) {
    garisPenghubung(x, y, leftX, nextY, size);
  }

  if (node.right != null) {
    garisPenghubung(x, y, rightX, nextY, size);
  }

  drawNumberBox(x, y, size, node.info);
  drawTree(node.left, leftX, nextY, level + 1, jarakX, jarakY, size);
  drawTree(node.right, rightX, nextY, level + 1, jarakX, jarakY, size);
}

function draw_polygon(points) {
  for (let i = 0; i < points.length; i++) {
    let x1 = points[i].x;
    let y1 = points[i].y;
    let x2 = points[(i + 1) % points.length].x;
    let y2 = points[(i + 1) % points.length].y;
    dda_line(x1, y1, x2, y2);
  }
}

function drawText(x, y, text) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawNumberBox(x, y, size, number) {
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

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

class AVLNode {
  constructor(info) {
    this.info = info;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  // operasi AVL Tree
  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // rotasi kanan
  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    // rotasi
    x.right = y;
    y.left = T2;

    // update tinggi node
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));

    return x; // root baru
  }

  // Rotasi Kiri
  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    // rotasi
    y.left = x;
    x.right = T2;

    // update tinggi node
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    return y; // root baru
  }

  //  insert Node AVL
  insert(root, info) {
    if (!root) return new AVLNode(info);

    if (info < root.info) root.left = this.insert(root.left, info);
    else if (info > root.info) root.right = this.insert(root.right, info);
    else return root; // tidak boleh duplikat

    // update tinggi node
    root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));

    // hitung balance
    const balance = this.getBalance(root);

    // kasus rotasi
    if (balance > 1 && info < root.left.info) return this.rotateRight(root); // Left Left
    if (balance < -1 && info > root.right.info) return this.rotateLeft(root); // Right Right
    if (balance > 1 && info > root.left.info) { // Left Right
      root.left = this.rotateLeft(root.left);
      return this.rotateRight(root);
    }
    if (balance < -1 && info < root.right.info) { // Right Left
      root.right = this.rotateRight(root.right);
      return this.rotateLeft(root);
    }

    return root;
  }

  //  delete Node AVL
  delete(root, info) {
    if (!root) return root;

    if (info < root.info) root.left = this.delete(root.left, info);
    else if (info > root.info) root.right = this.delete(root.right, info);
    else {
      if (!root.left) return root.right;
      else if (!root.right) return root.left;

      const temp = this.getMinValueNode(root.right);
      root.info = temp.info;
      root.right = this.delete(root.right, temp.info);
    }

    if (!root) return root;

    root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));
    const balance = this.getBalance(root);

    if (balance > 1 && this.getBalance(root.left) >= 0) return this.rotateRight(root);
    if (balance > 1 && this.getBalance(root.left) < 0) {
      root.left = this.rotateLeft(root.left);
      return this.rotateRight(root);
    }
    if (balance < -1 && this.getBalance(root.right) <= 0) return this.rotateLeft(root);
    if (balance < -1 && this.getBalance(root.right) > 0) {
      root.right = this.rotateRight(root.right);
      return this.rotateLeft(root);
    }

    return root;
  }

  // ambil node terkecil (paling kiri)
  getMinValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }

  // traversal inorder (debug console)
  printInorder(root) {
    if (root) {
      this.printInorder(root.left);
      console.log(root.info);
      this.printInorder(root.right);
    }
  }

  // hitung tinggi pohon
  treeHeight() {
    return this.getHeight(this.root) - 1;
  }
}

const avl = new AVLTree();


const insertBtn = document.getElementById("insertBtn");
const deleteBtn = document.getElementById("deleteBtn");
const resetBtn = document.getElementById("resetBtn");
const nodeValue = document.getElementById("nodeValue");

function refreshCanvas() {
  if (!animationRunning) {
    animationRunning = true;
    animateTree();
  }
}

function animateTree() {
  clearCanvas();
  const offset = Math.sin(animationFrame) * 10;
  drawTreeAnimated(avl.root, 400, 100 + offset, 1, 250, 100, 40);
  animationFrame++;
  requestAnimationFrame(animateTree);
}

function drawTreeAnimated(node, x, y, level, jarakX, jarakY, size) {
  if (node == null) return;

  let leftX = x - jarakX / (level + 1);
  let rightX = x + jarakX / (level + 1);
  let nextY = y + jarakY;

  if (node.left != null) {
    garisPenghubung(x, y, leftX, nextY, size);
  }
  if (node.right != null) {
    garisPenghubung(x, y, rightX, nextY, size);
  }

  drawNumberBox(x, y, size, node.info);
  drawTreeAnimated(node.left, leftX, nextY, level + 1, jarakX, jarakY, size);
  drawTreeAnimated(node.right, rightX, nextY, level + 1, jarakX, jarakY, size);
}



insertBtn.addEventListener("click", () => {
  const val = parseInt(nodeValue.value);
  if (!isNaN(val)) {
    avl.root = avl.insert(avl.root, val);
    refreshCanvas();
    nodeValue.value = "";
  }
});

deleteBtn.addEventListener("click", () => {
  const val = parseInt(nodeValue.value);
  if (!isNaN(val)) {
    avl.root = avl.delete(avl.root, val);
    refreshCanvas();
    nodeValue.value = "";
  }
});

resetBtn.addEventListener("click", () => {
  avl.root = null;
  clearCanvas();
  nodeValue.value = "";
});

window.onload = function () {
  initGraphics("mycanvas");
};