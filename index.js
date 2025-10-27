// 2372013 - Rey Immanuel
// 2372017 - Christian Jeffry
// 2372019 - Charles Sung
// 2372021 - Nathanael

// Tugas Besar Grafika Komputer
// Visualisasi AVL Tree

import { initGraphics, clearCanvas, drawNumberBox } from "./graflib.js";

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
initGraphics("mycanvas");

// insert manual
avl.root = avl.insert(avl.root, 10);
avl.root = avl.insert(avl.root, 20);
avl.root = avl.insert(avl.root, 30);
avl.root = avl.insert(avl.root, 40);
avl.root = avl.insert(avl.root, 50);
avl.root = avl.insert(avl.root, 25);
avl.root = avl.insert(avl.root, 71);
avl.root = avl.insert(avl.root, 80);
avl.root = avl.insert(avl.root, 15);

console.log("Inorder traversal:");
avl.printInorder(avl.root);
console.log("Tinggi pohon:", avl.treeHeight());

// hapus node
avl.root = avl.delete(avl.root, 30);
console.log("Setelah hapus 30:");
avl.printInorder(avl.root);

//  gambar AVL Tree ke kanvas
function drawInorderToCanvas(node, x, y, gapX, size) {
  if (node) {
    x = drawInorderToCanvas(node.left, x, y, gapX, size);
    drawNumberBox(x, y, size, node.info);
    x += gapX;
    x = drawInorderToCanvas(node.right, x, y, gapX, size);
  }
  return x;
}

// bersihkan & gambar ulang
clearCanvas();
drawInorderToCanvas(avl.root, 50, 100, 70, 40);