// 2372013 - Rey Immanuel
// 2372017 - Christian Jeffry
// 2372019 - Charles Sung
// 2372021 - Nathanael

// Tugas Besar Grafika Komputer
// Visualisasi AVL Tree

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

// Fungsi untuk cari tinggi node
  getHeight(node) {
    if (!node) return 0;
    return node.height;
  }

  getBalance(node) {
    if (!node) return 0;
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

// Rotasi kanan
  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    // rotasi
    x.right = y;
    y.left = T2;

    // update tinggi
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));

    return x;
  }

// Rotasi kiri
  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    // rotasi
    y.left = x;
    x.right = T2;

    // update tinggi
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    return y;
  }

// Insert data
  insert(root, info) {
    if (!root) return new AVLNode(info);

    if (info < root.info) {
      root.left = this.insert(root.left, info);
    } else if (info > root.info) {
      root.right = this.insert(root.right, info);
    } else {
      // duplikat tidak diizinkan
      return root;
    }

    // update tinggi
    root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));

    // cek balance factor
    const balance = this.getBalance(root);

    // Rebalancing
    if (balance > 1 && info < root.left.info) {
      // Left Left
      return this.rotateRight(root);
    }

    if (balance < -1 && info > root.right.info) {
      // Right Right
      return this.rotateLeft(root);
    }

    if (balance > 1 && info > root.left.info) {
      // Left Right
      root.left = this.rotateLeft(root.left);
      return this.rotateRight(root);
    }

    if (balance < -1 && info < root.right.info) {
      // Right Left
      root.right = this.rotateRight(root.right);
      return this.rotateLeft(root);
    }

    return root;
  }

// Delete data
  delete(root, info) {
    if (!root) return root;

    if (info < root.info) {
      root.left = this.delete(root.left, info);
    } else if (info > root.info) {
      root.right = this.delete(root.right, info);
    } else {
      // node dengan satu anak atau tanpa anak
      if (!root.left) return root.right;
      else if (!root.right) return root.left;

      // node dengan dua anak
      const temp = this.getMinValueNode(root.right);
      root.info = temp.info;
      root.right = this.delete(root.right, temp.info);
    }

    if (!root) return root;

    // update tinggi
    root.height = 1 + Math.max(this.getHeight(root.left), this.getHeight(root.right));

    // cek balance factor
    const balance = this.getBalance(root);

    // Rebalancing
    if (balance > 1 && this.getBalance(root.left) >= 0) {
      // Left Left
      return this.rotateRight(root);
    }

    if (balance > 1 && this.getBalance(root.left) < 0) {
      // Left Right
      root.left = this.rotateLeft(root.left);
      return this.rotateRight(root);
    }

    if (balance < -1 && this.getBalance(root.right) <= 0) {
      // Right Right
      return this.rotateLeft(root);
    }

    if (balance < -1 && this.getBalance(root.right) > 0) {
      // Right Left
      root.right = this.rotateRight(root.right);
      return this.rotateLeft(root);
    }

    return root;
  }

  getMinValueNode(node) {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

// Inorder Traversal
  printInorder(root) {
    if (root) {
      this.printInorder(root.left);
      console.log(root.info);
      this.printInorder(root.right);
    }
  }

// Fungsi untuk cari tinggi pohon
  treeHeight() {
    return this.getHeight(this.root) - 1;
  }
}

// Export
if (typeof module !== 'undefined') {
  module.exports = { AVLNode, AVLTree };
}
