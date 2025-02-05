// Define the TreeNode class
var TreeNode = /** @class */ (function () {
    function TreeNode(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
    return TreeNode;
}());
function lca(root, node1, node2) {
    // console.log("Currently running LCA on node: ", root?.val)
    // If you hit a dead end return null for that child
    if (!root) {
        return null;
    }
    // If you reach one of the target nodes, return that node for that child (stop traversing)
    if (root === node1 || root === node2) {
        return root;
    }
    // Start traversing the tree
    var left = lca(root.left, node1, node2);
    var right = lca(root.right, node1, node2);
    // If both children are not null, then you've found the lca
    if (left && right) {
        console.log("LCA found at: ", root.val);
        return root;
    }
    // Return the non-null child
    return left ? left : right;
}
function findLevel(root, target, depth) {
    if (!root) {
        return -1;
    }
    if (root === target) {
        return depth;
    }
    var leftLevel = findLevel(root.left, target, depth + 1);
    var rightLevel = findLevel(root.right, target, depth + 1);
    if (leftLevel > 0) {
        return leftLevel;
    }
    if (rightLevel > 0) {
        return rightLevel;
    }
    return -1;
    // find depth left child, depth + 1
    // find depth right child, depth + 1
    // if root is null, return -1
    // if root matches target, return depth of target
    // if left or right > 1, return that depth
}
function findDepth(root, q, depth) {
    if (!root) {
        return -1;
    }
    if (root == q) {
        return depth;
    }
    var leftDistance = findDepth(root.left, q, depth + 1);
    var rightDistance = findDepth(root.right, q, depth + 1);
    if (leftDistance > 0) {
        return leftDistance;
    }
    else {
        return rightDistance;
    }
    // Traverse left child
    // Traverse right child
    // If current node(child) is null return null
    // If current node(child) is equal to target:
    //      increment counter
    //      return root
    // If one of the children is not null:
    //      increment counter
    //      return root
}
function distanceBetweenNodes(root, q, p) {
    // Find LCA
    // Find distance to first node
    // Find distance to second node
    // Add the distances
    var ancestor = lca(root, q, p);
    var dist1 = findDepth(ancestor, q, 0);
    var dist2 = findDepth(ancestor, p, 0);
    var distance = dist1 + dist2;
    return distance;
}
function areTreesIdentical(root1, root2) {
    // If both are null, return true
    if (!root1 && !root2) {
        return true;
    }
    // If only one is null, return false
    if (!root1 || !root2) {
        return false;
    }
    var isLeftIdentical = areTreesIdentical(root1.left, root2.left);
    var isRightIdentical = areTreesIdentical(root1.right, root2.right);
    if (isLeftIdentical && isRightIdentical) {
        if (root1.val == root2.val) {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
    // Check left1 against left2
    // Check right1 against right2
    // If both children are null return true
    // if root1 value equal to root2 value return true
}
function invertTree(root) {
    if (!root) {
        return null;
    }
    // invert left child
    // invert right child
    // if null return null
    // if both children null, return root (no change)
    // else,
    // create inverted copy of root
    // left is right and right is left
    // return the inverted copy
    var invertedLeft = invertTree(root.left);
    var invertedRight = invertTree(root.right);
    if (!invertedLeft && !invertedRight) {
        return root;
    }
    var invertedRoot;
    invertedRoot = root;
    invertedRoot.left = invertedRight;
    invertedRoot.right = invertedLeft;
    return invertedRoot;
}
// 4. Find Cousins
function findCousins(root, target) {
    if (!root || !target) {
        return [];
    }
    var queue = [[root, null]];
    var targetLevel = -1;
    var targetParent = null;
    var level = 0;
    // Find target's level and parent
    while (queue.length && targetLevel === -1) {
        var levelSize = queue.length;
        for (var i = 0; i < levelSize; i++) {
            var _a = queue.shift(), node = _a[0], parent_1 = _a[1];
            if (node === target) {
                targetLevel = level;
                targetParent = parent_1;
                break;
            }
            if (node.left) {
                queue.push([node.left, node]);
            }
            if (node.right) {
                queue.push([node.right, node]);
            }
        }
        level++;
    }
    // Find cousins
    var cousins = [];
    if (targetLevel !== -1) {
        queue.length = 0;
        queue.push([root, null]);
        level = 0;
        while (queue.length && level <= targetLevel) {
            var levelSize = queue.length;
            for (var i = 0; i < levelSize; i++) {
                var _b = queue.shift(), node = _b[0], parent_2 = _b[1];
                if (level === targetLevel && parent_2 !== targetParent) {
                    cousins.push(node.val);
                }
                if (node.left) {
                    queue.push([node.left, node]);
                }
                if (node.right) {
                    queue.push([node.right, node]);
                }
            }
            level++;
        }
    }
    return cousins;
}
// Create sample tree for testing
function createSampleTree() {
    var root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.left = new TreeNode(6);
    root.right.right = new TreeNode(7);
    return root;
}
// Function to print the tree
function printTree(root) {
    if (!root) {
        console.log("Empty tree");
        return;
    }
    // Get the height of the tree
    function getHeight(node) {
        if (!node)
            return 0;
        return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }
    var height = getHeight(root);
    var width = Math.pow(2, height) * 3; // Width for spacing
    var levels = Array(height).fill(0).map(function () { return Array(width).fill(' '); });
    // Fill the levels array with node values
    function fillLevels(node, level, left, right) {
        if (!node)
            return;
        var mid = Math.floor((left + right) / 2);
        levels[level][mid] = node.val.toString();
        // Draw branches if there are child nodes
        if (node.left) {
            var nextMid = Math.floor((left + mid) / 2);
            for (var i = nextMid + 1; i < mid; i++) {
                levels[level][i] = '_';
            }
        }
        if (node.right) {
            var nextMid = Math.floor((mid + right) / 2);
            for (var i = mid + 1; i < nextMid; i++) {
                levels[level][i] = '_';
            }
        }
        fillLevels(node.left, level + 1, left, mid);
        fillLevels(node.right, level + 1, mid, right);
    }
    fillLevels(root, 0, 0, width);
    // Print the tree
    levels.forEach(function (level) {
        console.log(level.join(''));
    });
}
// Test cases
function runTests() {
    console.log("Running tests...");
    //        1
    //    2       3
    //  4   5   6   7
    // Create sample trees
    var tree1 = createSampleTree();
    printTree(tree1);
    /*
        Tree1 structure:
              1
           /     \
          2       3
         / \     / \
        4   5   6   7
    */
    var p = tree1.right.left; // value 6
    var q = tree1.right.right; // value 7
    console.log("\nTesting Lowest Common Ancestor:");
    // Test LCA
    console.log("\nTesting LCA2:");
    var lca_result = lca(tree1, p, q);
    console.log("LCA2 of nodes ".concat(p.val, " and ").concat(q.val, " is: ").concat(lca_result === null || lca_result === void 0 ? void 0 : lca_result.val));
    // Get distance to one node, which is the same as the depth
    console.log("\nFinding Distance to a Node:");
    var depth = findDepth(tree1, p, 0);
    console.log("Distance to node: ".concat(p.val, " is: ").concat(depth));
    // Get distance between two particular nodes
    console.log("\nTesting Distance Between Nodes:");
    var distance = distanceBetweenNodes(tree1, p, q);
    console.log("Distance between nodes ".concat(p.val, " and ").concat(q.val, " is: ").concat(distance));
    // Invert a tree
    console.log("\nInverting a Tree:");
    console.log("Original Tree:");
    printTree(tree1);
    var invertedTree = invertTree(tree1);
    console.log("Inverted Tree:");
    printTree(invertedTree);
    // Test Identical Trees
    console.log("\nTesting Identical Trees:");
    console.log("Comparing the following Trees:");
    var tree2 = createSampleTree(); // Create an identical tree
    printTree(tree1);
    printTree(tree2);
    console.log("Are trees identical? ".concat(areTreesIdentical(tree1, tree2)));
    // Modify tree2 slightly
    console.log("Modifying the second tree:");
    tree2.right.right.val = 8;
    printTree(tree1);
    printTree(tree2);
    console.log("Are modified trees identical? ".concat(areTreesIdentical(tree1, tree2)));
    // Test Find Cousins
    console.log("\nTesting Find Cousins:");
    var cousins = findCousins(tree1, p); // Looking for cousins of node 4
    console.log("Cousins of node ".concat(p.val, " are: ").concat(cousins)); // Should print [6, 7]
}
// Run all tests
runTests();
