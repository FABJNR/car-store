(function (win, doc) {
  'use strict';

  function DOM(elements) {
    if (!(this instanceof DOM))
      return new DOM(elements);

    this.element = doc.querySelectorAll(elements);
  }

  DOM.prototype.on = function on(eventType, callback) {
    Array.prototype.forEach.call(this.element, function (element) {
      element.addEventListener(eventType, callback, false);
    });
  };

  DOM.prototype.off = function off(eventType, callback) {
    Array.prototype.forEach.call(this.element, function (element) {
      element.removeEventListener(eventType, callback, false);
    });
  };

  DOM.prototype.get = function get(index) {
    if (!index)
      return this.element[0];

    return this.element[index];
  };

  DOM.prototype.forEach = function forEach() {
    return Array.prototype.forEach.apply(this.element, arguments);
  };

  DOM.prototype.map = function map() {
    return Array.prototype.map.apply(this.element, arguments);
  };

  DOM.prototype.filter = function filter() {
    return Array.prototype.filter.apply(this.element, arguments);
  };

  DOM.prototype.reduce = function reduce() {
    return Array.prototype.reduce.apply(this.element, arguments);
  };

  DOM.prototype.reduceRight = function reduceRight() {
    return Array.prototype.reduceRight.apply(this.element, arguments);
  };

  DOM.prototype.every = function every() {
    return Array.prototype.every.apply(this.element, arguments);
  };

  DOM.prototype.some = function some() {
    return Array.prototype.some.apply(this.element, arguments);
  };

  DOM.objectType = function objectType(param) {
    return Object.prototype.toString.call(param);
  };

  DOM.isArray = function isArray(param) {
    return DOM.objectType(param) === '[object Array]';
  };

  DOM.isObject = function isObject(param) {
    return DOM.objectType(param) === '[object Object]';
  };

  DOM.isFunction = function isFunction(param) {
    return DOM.objectType(param) === '[object Function]';
  };

  DOM.isNumber = function isNumber(param) {
    return DOM.objectType(param) === '[object Number]';
  };

  DOM.isString = function isString(param) {
    return DOM.objectType(param) === '[object String]';
  };

  DOM.isBoolean = function isBoolean(param) {
    return DOM.objectType(param) === '[object Boolean]';
  };

  DOM.isNull = function isNull(param) {
    return DOM.objectType(param) === '[object Null]' || DOM.objectType(param) === '[object Undefined]';
  };

  win.DOM = DOM;
})(window, document);
