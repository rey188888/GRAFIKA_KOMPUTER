// 2372013 - Rey Immanuel
// 2372017 - Christian Jeffry
// 2372019 - Charles Sung
// 2372021 - Nathanael

// Tugas Besar Grafika Komputer
// Visualisasi AVL Tree

const avl = new AVLTree();

// Tes manual di console
avl.root = avl.insert(avl.root, 10);
avl.root = avl.insert(avl.root, 20);
avl.root = avl.insert(avl.root, 30);
avl.root = avl.insert(avl.root, 40);
avl.root = avl.insert(avl.root, 50);
avl.root = avl.insert(avl.root, 25);

console.log("Inorder traversal:");
avl.printInorder(avl.root);
console.log("Tinggi pohon:", avl.treeHeight());

avl.root = avl.delete(avl.root, 30);
console.log("Setelah hapus 30:");
avl.printInorder(avl.root);
