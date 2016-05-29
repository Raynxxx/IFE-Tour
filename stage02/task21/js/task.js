
var TagTool = (function() {
  
  function _tag(input, button) {
    var number = 0;
    
    this.input = document.getElementById(input);
    this.container = document.getElementById(input + '-container');
    this.button = document.getElementById(button);
    
    console.log(this.container);
    
    this.getData = function() {
      switch(input) {
        case 'tag':
          var value = this.input.value.split(/\s|,|\，/)[0];
          return value;
        case 'hobby':
          var values = this.input.value.trim().split(/,|，|、|、|\s|\n|\r|\t/);
          return values;
        default:
          return;
      }
    };
    
    this.renderTag = function(value) {
      if (value === '') return;
      var wrap = document.createElement('span');
      wrap.textContent = value;
      this.container.appendChild(wrap);
      number++;
    }
    
    this.delTag = function(ele) {
      this.container.removeChild(ele);
      number--;
    }
    
    this.getSize = function() {
      return number;
    }
    
    this.setSize = function(_number) {
      number = _number;
    }
    
    if (this.button) {
      this.init('button');
    } else {
      this.init('key');
    }
    
  }
  
  _tag.prototype = {
    isRepeat: function(value) {
      var children = this.container.childNodes;
      var length = children.length;
      for (var i = 0; i < length; ++i) {
        if (children[i].textContent.localeCompare(value) === 0) {
          this.input.value = '';
          return true;
        }
      }
      return false;
    },
    
    init: function(type) {
      var self = this;
      this.container.addEventListener('mouseover', function(event) {
        if (event.target.nodeName.toLowerCase() === 'span') {
          event.target.textContent = '点击删除 ' + event.target.textContent;
          event.target.classList.toggle('del');
        }
      }, false);
      
      this.container.addEventListener('mouseout', function(event) {
        if (event.target.nodeName.toLowerCase() === 'span') {
          event.target.textContent = event.target.textContent.replace(/点击删除 /, '');
          event.target.classList.toggle('del');
        }
      });
      
      this.container.addEventListener('click', function(event) {
        self.container.removeChild(event.target);
        self.setSize(self.container.childNodes.length);
      });
      
      switch (type) {
        case 'key':
          document.addEventListener('keyup', function(event) {
            console.log(self.getData());
            if (/(,|\，|\s)$/.test(self.input.value) || event.keyCode === 13) {
              var data = self.getData().trim();
              console.log(data);
              if (!self.isRepeat(data)) {
                self.renderTag(data);
              }
              self.input.value = '';
              if (self.getSize() > 10) {
                self.delTag(self.container.firstChild);
              }
            }
          });
          break;
        case 'button':
          self.button.addEventListener('click', function() {
            console.log(self.getData());
            for (var i = 0; i < self.getData().length; ++i) {
              var data = self.getData()[i];
              if (!self.isRepeat(data)) {
                self.renderTag(data);
              }
              if (self.getSize() > 10) {
                self.delTag(self.container.firstChild);
              }
            }
            self.input.value = '';
          });
          break;
      }
    }
  }
  
  return _tag;
})();


var tag = new TagTool('tag');
var tag = new TagTool('hobby', 'confirm');