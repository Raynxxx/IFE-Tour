/**
 * modal.js
 * Created by Rayn on 2016/06/08
 */ 

var $ = function (selector, ele) {
  ele = ele || document;
  return ele.querySelector(selector);
}

var $$ = function (selector, ele) {
  ele = ele || document;
  return ele.querySelectorAll(selector);
}

var Modal = function (trigger, ele, params) {
  this.triggerEle = trigger;
  this.modalEle = ele;
  this.maskEle = null;
  this.visible = false;
  this.animateTime = 600;
}

Modal.prototype = {
  constructor: Modal,

  init: function (params) {
    this.maskEle = document.createElement('div');
    this.maskEle.className = 'modal-mask ' + (this.visible ? 'show' : 'hide');
    this.maskEle.style.width = document.body.clientWidth + 'px';
    this.maskEle.style.height = document.body.clientHeight + 'px';

    this.modalEle.parentNode.removeChild(this.modalEle);
    this.maskEle.appendChild(this.modalEle);
    document.body.appendChild(this.maskEle);

    var self = this;
    this.maskEle.addEventListener('click', function (event) {
      if (self.maskEle === event.target) {
        self.hide();
      }
    });
    this.triggerEle.addEventListener('click', function (event) {
      self.show();
    });
  },

  show: function () {
    this.visible = true;
    this.maskEle.className = 'modal-mask ' + (this.visible ? 'show' : 'hide');
  },

  hide: function () {
    this.visible = false;
    this.maskEle.className = 'modal-mask ' + (this.visible ? 'show' : 'hide');
  }
}

window.onload = function () {
  var $modalClose = $('#close-modal');
  var modal = new Modal($('#modal-btn'), $('.modal'));
  modal.init();
  
  $modalClose.addEventListener('click', function (event) {
    modal.hide();
  });
}