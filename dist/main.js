(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["useoscEventEmitter"] = factory();
	else
		root["useoscEventEmitter"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: EventEmitter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventEmitter", function() { return EventEmitter; });
//简单的事件库
const getEventNames = name => name instanceof Array ? //返回事件数组
name : String(name).replace(/\s+/g, '').split(',');

class EventEmitter {
  constructor(name = 'undefined') {
    //事件对象名称
    this.name = name; //事件数组

    this.events = {};
  } //删除事件


  destroy() {
    this.events = {};
  } //监听事件(options.once=>触发一次)


  on(name, callback, options = {}) {
    options = options || {};

    if (typeof callback !== 'function') {
      throw new TypeError('Invalid callback');
    }

    getEventNames(name).forEach(n => {
      if (!this.events[n]) {
        this.events[n] = [];
      }

      this.events[n].push({
        callback,
        options
      });
    });
    return this;
  } //添加一个只触发一次的事件


  once(name, callback) {
    return this.on(name, callback, {
      once: true
    });
  } //删除一个事件监听


  off(name, callback = null, force = false) {
    getEventNames(name).filter(n => !!this.events[n]).forEach(n => {
      if (callback) {
        let i = this.events[n].length;

        while (i--) {
          const ev = this.events[n][i];
          const removable = !ev.options.persist || force;

          if (removable && ev.callback === callback) {
            this.events[n].split(i, 1);
          }
        }
      } else {
        this.events[n] = force ? [] : this.events[n].filter(({
          options
        }) => options.persist === true);
      }
    });
    return this;
  } //触发事件


  emit(name, ...args) {
    getEventNames(name).forEach(n => {
      if (this.events[n]) {
        let i = this.events[n].length;

        while (i--) {
          const {
            options,
            callback
          } = this.events[n][i];

          try {
            callback(...args);
          } catch (e) {
            console.warn(e);
          }

          if (options && options.once) {
            this.events[n].split(i, 1);
          }
        }
      }
    });
    return this;
  }

}

/***/ }),

/***/ 0:
/*!************************!*\
  !*** multi ./index.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! E:\useosc\useosc-emitter\index.js */"./index.js");


/***/ })

/******/ });
});
//# sourceMappingURL=main.js.map