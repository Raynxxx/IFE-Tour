
function TreeNode(params) {
  this.parent = params.parent || null;
  this.childs = params.childs || [];
  this.text = params.text || "";
  this.selfElement = params.selfElement;
  
  // DOM上也可以访问到TreeNode
  this.selfElement.TreeNode = this;
  
  // 常用工具节点
  this.childBox = null;
  this.nodeArrow = null;
  
  this.render();
}

TreeNode.prototype = {
  
  constructor: TreeNode,
  
  render: function() {
    // nodeHeader
    var nodeHeader = document.createElement('div');
    nodeHeader.classList.add('node-header');
    
    // nodeArrow
    var nodeArrow = document.createElement('i');
    nodeArrow.classList.add('arrow');
    if (this.selfElement.classList.contains('fold')) {
      nodeArrow.classList.add('arrow-right');
    } else {
      nodeArrow.classList.add('arrow-down');
    }
    
    // nodeTitle
    var nodeTitle = document.createElement('span');
    nodeTitle.classList.add('node-title');
    nodeTitle.textContent = this.text;
    
    // nodeAdd
    var nodeAdd = document.createElement('button');
    nodeAdd.textContent = '+';
    nodeAdd.className = 'btn btn-add';
    
    // nodeDel
    var nodeDel = document.createElement('button');
    nodeDel.textContent = '×';
    nodeDel.className = 'btn btn-del';
    
    // nodeChildBox
    var nodeChildBox = document.createElement('div');
    nodeChildBox.classList.add('childs-box');
    
    // append to DOM
    nodeHeader.appendChild(nodeArrow);
    nodeHeader.appendChild(nodeTitle);
    nodeHeader.appendChild(nodeAdd);
    nodeHeader.appendChild(nodeDel);
    this.selfElement.appendChild(nodeHeader);
    this.selfElement.appendChild(nodeChildBox);
    this.childBox = nodeChildBox;
    this.nodeArrow = nodeArrow;
  },
  
  isLeaf: function() {
    return this.childs.length === 0;
  },
  
  isFold: function() {
    if (this.isLeaf()) return false;
    return this.selfElement.classList.contains('fold');
  },
  
  toggleFold: function() {
    this.selfElement.classList.toggle('fold');
    if (this.nodeArrow.classList.contains('arrow-right')) {
      this.nodeArrow.classList.remove('arrow-right');
      this.nodeArrow.classList.add('arrow-down');
    } else {
      this.nodeArrow.classList.remove('arrow-down');
      this.nodeArrow.classList.add('arrow-right');
    }
    return this;
  },
  
  addChild: function(text) {
    if (text == null || text.trim() === "") return this;
    
    // 创建 DOM 节点
    var newNode = document.createElement('div');
    newNode.classList.add('tree-node');
    newNode.classList.add('fold');
    
    // 创建 TreeNode
    var newChild = new TreeNode({
      parent: this,
      text: text,
      selfElement: newNode
    });
    
    // append to parentNode
    this.childBox.appendChild(newNode);
    this.childs.push(newChild);
    
    // 有子菜单，展开
    if (this.isFold()) {
      this.toggleFold();
    }
    return this;
  },
  
  destory: function() {
    if (!this.isLeaf()) {
      for (var i = 0; i < this.childs.length; ++i) {
        this.childs[i].destory();
      }
    } else {
      this.parent.childBox.removeChild(this.selfElement);
      for (var i = 0; i < this.parent.childs.length; ++i) {
        if (this.parent.childs[i] === this) {
          this.parent.childs.splice(i, 1);
          break;
        }
      }
    }
  },
  
  hasMark: function() {
    return this.selfElement.classList.contains('mark');
  },
  
  setMark: function() {
    if (!this.hasMark()) {
      this.selfElement.classList.add('mark');
    }
    return this;
  },
  
  removeMark: function() {
    this.selfElement.classList.remove('mark');
    return this;
  },
  
  search: function(text) {
    var size = 0;
    if (!this.isLeaf()) {
      if (this.isFold()) this.toggleFold();
      for (var i = 0; i < this.childs.length; ++i) {
        size += this.childs[i].search(text);
      }
      if (size === 0) this.toggleFold();
    }
    
    if (this.text.includes(text)) {
      this.setMark();
      size += 1;
    } else {
      this.removeMark();
    }
    return size;
  }
};

function getTreeNode(target) {
  var node = target;
  while (!node.classList.contains('tree-node')) {
    node = node.parentNode;
  }
  return node.TreeNode;
}

function initEvent(root, search) {
  root.addEventListener('click', function(event) {
    var target = event.target;
    var treeNode = getTreeNode(target);
    if (target.classList.contains('arrow')) {
      treeNode.toggleFold();
    } else if (target.classList.contains('btn-add')) {
      var text = prompt("请输入子结点的内容：");
      if (text != null) {
        treeNode.addChild(text);
      }
    } else if (target.classList.contains('btn-del')) {
      treeNode.destory();
    }
    event.stopPropagation();
  }, false);
  
  search.addEventListener('click', function(event) {
    var input = document.getElementById('search-input');
    if (input.value) {
      var num = root.TreeNode.search(input.value);
      console.log(num);
    }
  }, false);
}

// 程序入口
window.onload = function() {

  var root = new TreeNode({
    text: '菜单',
    selfElement: document.getElementsByClassName('tree-node')[0]
  });
  
  initEvent(root.selfElement, document.getElementById('search-btn'));
  
  root.addChild('前端').addChild('计算机网络');
  root.childs[0].addChild('Javascript').addChild('HTML5');
  root.childs[1].addChild('TCP/IP').addChild('HTTP').addChild('FTP');
 
}

