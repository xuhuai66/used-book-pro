(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('long'), require('buffer')) :
	typeof define === 'function' && define.amd ? define(['exports', 'long', 'buffer'], factory) :
	(factory((global.BSON = {}),global.long,global.Buffer));
}(this, (function (exports,long,buffer) { 'use strict';

	long = long && long.hasOwnProperty('default') ? long['default'] : long;
	buffer = buffer && buffer.hasOwnProperty('default') ? buffer['default'] : buffer;

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n.default || n;
	}

	var map = createCommonjsModule(function (module) {

	  if (typeof commonjsGlobal.Map !== 'undefined') {
	    module.exports = commonjsGlobal.Map;
	    module.exports.Map = commonjsGlobal.Map;
	  } else {
	    // We will return a polyfill
	    var Map = function Map(array) {
	      this._keys = [];
	      this._values = {};

	      for (var i = 0; i < array.length; i++) {
	        if (array[i] == null) continue; // skip null and undefined

	        var entry = array[i];
	        var key = entry[0];
	        var value = entry[1]; // Add the key to the list of keys in order

	        this._keys.push(key); // Add the key and value to the values dictionary with a point
	        // to the location in the ordered keys list


	        this._values[key] = {
	          v: value,
	          i: this._keys.length - 1
	        };
	      }
	    };

	    Map.prototype.clear = function () {
	      this._keys = [];
	      this._values = {};
	    };

	    Map.prototype.delete = function (key) {
	      var value = this._values[key];
	      if (value == null) return false; // Delete entry

	      delete this._values[key]; // Remove the key from the ordered keys list

	      this._keys.splice(value.i, 1);

	      return true;
	    };

	    Map.prototype.entries = function () {
	      var self = this;
	      var index = 0;
	      return {
	        next: function next() {
	          var key = self._keys[index++];
	          return {
	            value: key !== undefined ? [key, self._values[key].v] : undefined,
	            done: key !== undefined ? false : true
	          };
	        }
	      };
	    };

	    Map.prototype.forEach = function (callback, self) {
	      self = self || this;

	      for (var i = 0; i < this._keys.length; i++) {
	        var key = this._keys[i]; // Call the forEach callback

	        callback.call(self, this._values[key].v, key, self);
	      }
	    };

	    Map.prototype.get = function (key) {
	      return this._values[key] ? this._values[key].v : undefined;
	    };

	    Map.prototype.has = function (key) {
	      return this._values[key] != null;
	    };

	    Map.prototype.keys = function () {
	      var self = this;
	      var index = 0;
	      return {
	        next: function next() {
	          var key = self._keys[index++];
	          return {
	            value: key !== undefined ? key : undefined,
	            done: key !== undefined ? false : true
	          };
	        }
	      };
	    };

	    Map.prototype.set = function (key, value) {
	      if (this._values[key]) {
	        this._values[key].v = value;
	        return this;
	      } // Add the key to the list of keys in order


	      this._keys.push(key); // Add the key and value to the values dictionary with a point
	      // to the location in the ordered keys list


	      this._values[key] = {
	        v: value,
	        i: this._keys.length - 1
	      };
	      return this;
	    };

	    Map.prototype.values = function () {
	      var self = this;
	      var index = 0;
	      return {
	        next: function next() {
	          var key = self._keys[index++];
	          return {
	            value: key !== undefined ? self._values[key].v : undefined,
	            done: key !== undefined ? false : true
	          };
	        }
	      };
	    }; // Last ismaster


	    Object.defineProperty(Map.prototype, 'size', {
	      enumerable: true,
	      get: function get() {
	        return this._keys.length;
	      }
	    });
	    module.exports = Map;
	  }
	});
	var map_1 = map.Map;

	/**
	 * @ignore
	 */


	long.prototype.toExtendedJSON = function (options) {
	  if (options && options.relaxed) return this.toNumber();
	  return {
	    $numberLong: this.toString()
	  };
	};
	/**
	 * @ignore
	 */


	long.fromExtendedJSON = function (doc, options) {
	  var result = long.fromString(doc.$numberLong);
	  return options && options.relaxed ? result.toNumber() : result;
	};

	Object.defineProperty(long.prototype, '_bsontype', {
	  value: 'Long'
	});
	var long_1 = long;

	/**
	 * A class representation of the BSON Double type.
	 */

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

	var Double =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a Double type
	   *
	   * @param {number} value the number we want to represent as a double.
	   * @return {Double}
	   */
	  function Double(value) {
	    _classCallCheck(this, Double);

	    this.value = value;
	  }
	  /**
	   * Access the number value.
	   *
	   * @method
	   * @return {number} returns the wrapped double number.
	   */


	  _createClass(Double, [{
	    key: "valueOf",
	    value: function valueOf() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON(options) {
	      if (options && options.relaxed && isFinite(this.value)) return this.value;
	      return {
	        $numberDouble: this.value.toString()
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc, options) {
	      return options && options.relaxed ? parseFloat(doc.$numberDouble) : new Double(parseFloat(doc.$numberDouble));
	    }
	  }]);

	  return Double;
	}();

	Object.defineProperty(Double.prototype, '_bsontype', {
	  value: 'Double'
	});
	var double_1 = Double;

	function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

	function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

	function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

	function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

	function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

	function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
	/**
	 * @class
	 * @param {number} low  the low (signed) 32 bits of the Timestamp.
	 * @param {number} high the high (signed) 32 bits of the Timestamp.
	 * @return {Timestamp}
	 */


	var Timestamp =
	/*#__PURE__*/
	function (_Long) {
	  _inherits(Timestamp, _Long);

	  function Timestamp(low, high) {
	    var _this;

	    _classCallCheck$1(this, Timestamp);

	    if (long_1.isLong(low)) {
	      _this = _possibleConstructorReturn(this, _getPrototypeOf(Timestamp).call(this, low.low, low.high));
	    } else {
	      _this = _possibleConstructorReturn(this, _getPrototypeOf(Timestamp).call(this, low, high));
	    }

	    return _possibleConstructorReturn(_this);
	  }
	  /**
	   * Return the JSON value.
	   *
	   * @method
	   * @return {String} the JSON representation.
	   */


	  _createClass$1(Timestamp, [{
	    key: "toJSON",
	    value: function toJSON() {
	      return {
	        $timestamp: this.toString()
	      };
	    }
	    /**
	     * Returns a Timestamp represented by the given (32-bit) integer value.
	     *
	     * @method
	     * @param {number} value the 32-bit integer in question.
	     * @return {Timestamp} the timestamp.
	     */

	  }, {
	    key: "toExtendedJSON",

	    /**
	     * @ignore
	     */
	    value: function toExtendedJSON() {
	      return {
	        $timestamp: {
	          t: this.high,
	          i: this.low
	        }
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromInt",
	    value: function fromInt(value) {
	      return new Timestamp(long_1.fromInt(value));
	    }
	    /**
	     * Returns a Timestamp representing the given number value, provided that it is a finite number. Otherwise, zero is returned.
	     *
	     * @method
	     * @param {number} value the number in question.
	     * @return {Timestamp} the timestamp.
	     */

	  }, {
	    key: "fromNumber",
	    value: function fromNumber(value) {
	      return new Timestamp(long_1.fromNumber(value));
	    }
	    /**
	     * Returns a Timestamp for the given high and low bits. Each is assumed to use 32 bits.
	     *
	     * @method
	     * @param {number} lowBits the low 32-bits.
	     * @param {number} highBits the high 32-bits.
	     * @return {Timestamp} the timestamp.
	     */

	  }, {
	    key: "fromBits",
	    value: function fromBits(lowBits, highBits) {
	      return new Timestamp(lowBits, highBits);
	    }
	    /**
	     * Returns a Timestamp from the given string, optionally using the given radix.
	     *
	     * @method
	     * @param {String} str the textual representation of the Timestamp.
	     * @param {number} [opt_radix] the radix in which the text is written.
	     * @return {Timestamp} the timestamp.
	     */

	  }, {
	    key: "fromString",
	    value: function fromString(str, opt_radix) {
	      return new Timestamp(long_1.fromString(str, opt_radix));
	    }
	  }, {
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new Timestamp(doc.$timestamp.i, doc.$timestamp.t);
	    }
	  }]);

	  return Timestamp;
	}(long_1);

	Object.defineProperty(Timestamp.prototype, '_bsontype', {
	  value: 'Timestamp'
	});
	var timestamp = Timestamp;

	var empty = {};

	var empty$1 = /*#__PURE__*/Object.freeze({
		default: empty
	});

	var require$$0 = getCjsExportFromNamespace(empty$1);

	/* global window */

	/**
	 * Normalizes our expected stringified form of a function across versions of node
	 * @param {Function} fn The function to stringify
	 */


	function normalizedFunctionString(fn) {
	  return fn.toString().replace('function(', 'function (');
	}

	function insecureRandomBytes(size) {
	  var result = new Uint8Array(size);

	  for (var i = 0; i < size; ++i) {
	    result[i] = Math.floor(Math.random() * 256);
	  }

	  return result;
	}

	var randomBytes = insecureRandomBytes;

	if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
	  randomBytes = function randomBytes(size) {
	    return window.crypto.getRandomValues(new Uint8Array(size));
	  };
	} else {
	  try {
	    randomBytes = require$$0.randomBytes;
	  } catch (e) {} // keep the fallback
	  // NOTE: in transpiled cases the above require might return null/undefined


	  if (randomBytes == null) {
	    randomBytes = insecureRandomBytes;
	  }
	}

	var utils = {
	  normalizedFunctionString: normalizedFunctionString,
	  randomBytes: randomBytes
	};

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js
	function defaultSetTimout() {
	  throw new Error('setTimeout has not been defined');
	}

	function defaultClearTimeout() {
	  throw new Error('clearTimeout has not been defined');
	}

	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;

	if (typeof global.setTimeout === 'function') {
	  cachedSetTimeout = setTimeout;
	}

	if (typeof global.clearTimeout === 'function') {
	  cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	  if (cachedSetTimeout === setTimeout) {
	    //normal enviroments in sane situations
	    return setTimeout(fun, 0);
	  } // if setTimeout wasn't available but was latter defined


	  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	    cachedSetTimeout = setTimeout;
	    return setTimeout(fun, 0);
	  }

	  try {
	    // when when somebody has screwed with setTimeout but no I.E. maddness
	    return cachedSetTimeout(fun, 0);
	  } catch (e) {
	    try {
	      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	      return cachedSetTimeout.call(null, fun, 0);
	    } catch (e) {
	      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	      return cachedSetTimeout.call(this, fun, 0);
	    }
	  }
	}

	function runClearTimeout(marker) {
	  if (cachedClearTimeout === clearTimeout) {
	    //normal enviroments in sane situations
	    return clearTimeout(marker);
	  } // if clearTimeout wasn't available but was latter defined


	  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	    cachedClearTimeout = clearTimeout;
	    return clearTimeout(marker);
	  }

	  try {
	    // when when somebody has screwed with setTimeout but no I.E. maddness
	    return cachedClearTimeout(marker);
	  } catch (e) {
	    try {
	      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	      return cachedClearTimeout.call(null, marker);
	    } catch (e) {
	      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	      return cachedClearTimeout.call(this, marker);
	    }
	  }
	}

	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	  if (!draining || !currentQueue) {
	    return;
	  }

	  draining = false;

	  if (currentQueue.length) {
	    queue = currentQueue.concat(queue);
	  } else {
	    queueIndex = -1;
	  }

	  if (queue.length) {
	    drainQueue();
	  }
	}

	function drainQueue() {
	  if (draining) {
	    return;
	  }

	  var timeout = runTimeout(cleanUpNextTick);
	  draining = true;
	  var len = queue.length;

	  while (len) {
	    currentQueue = queue;
	    queue = [];

	    while (++queueIndex < len) {
	      if (currentQueue) {
	        currentQueue[queueIndex].run();
	      }
	    }

	    queueIndex = -1;
	    len = queue.length;
	  }

	  currentQueue = null;
	  draining = false;
	  runClearTimeout(timeout);
	}

	function nextTick(fun) {
	  var args = new Array(arguments.length - 1);

	  if (arguments.length > 1) {
	    for (var i = 1; i < arguments.length; i++) {
	      args[i - 1] = arguments[i];
	    }
	  }

	  queue.push(new Item(fun, args));

	  if (queue.length === 1 && !draining) {
	    runTimeout(drainQueue);
	  }
	} // v8 likes predictible objects

	function Item(fun, array) {
	  this.fun = fun;
	  this.array = array;
	}

	Item.prototype.run = function () {
	  this.fun.apply(null, this.array);
	};

	var title = 'browser';
	var platform = 'browser';
	var browser = true;
	var env = {};
	var argv = [];
	var version = ''; // empty string to avoid regexp issues

	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;
	function binding(name) {
	  throw new Error('process.binding is not supported');
	}
	function cwd() {
	  return '/';
	}
	function chdir(dir) {
	  throw new Error('process.chdir is not supported');
	}
	function umask() {
	  return 0;
	} // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js

	var performance = global.performance || {};

	var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
	  return new Date().getTime();
	}; // generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime


	function hrtime(previousTimestamp) {
	  var clocktime = performanceNow.call(performance) * 1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor(clocktime % 1 * 1e9);

	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];

	    if (nanoseconds < 0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }

	  return [seconds, nanoseconds];
	}
	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}
	var process = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser,
	  env: env,
	  argv: argv,
	  version: version,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	var inherits;

	if (typeof Object.create === 'function') {
	  inherits = function inherits(ctor, superCtor) {
	    // implementation from standard node.js 'util' module
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  inherits = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;

	    var TempCtor = function TempCtor() {};

	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

	var inherits$1 = inherits;

	function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }
	var formatRegExp = /%[sdj%]/g;
	function format(f) {
	  if (!isString(f)) {
	    var objects = [];

	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }

	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function (x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;

	    switch (x) {
	      case '%s':
	        return String(args[i++]);

	      case '%d':
	        return Number(args[i++]);

	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }

	      default:
	        return x;
	    }
	  });

	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }

	  return str;
	}
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.

	function deprecate(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function () {
	      return deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  var warned = false;

	  function deprecated() {
	    if (!warned) {
	      {
	        console.error(msg);
	      }

	      warned = true;
	    }

	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}
	var debugs = {};
	var debugEnviron;
	function debuglog(set) {
	  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();

	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = 0;

	      debugs[set] = function () {
	        var msg = format.apply(null, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function () {};
	    }
	  }

	  return debugs[set];
	}
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */

	/* legacy: obj, showHidden, depth, colors*/

	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  }; // legacy...

	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];

	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    _extend(ctx, opts);
	  } // set default options


	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	} // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

	inspect.colors = {
	  'bold': [1, 22],
	  'italic': [3, 23],
	  'underline': [4, 24],
	  'inverse': [7, 27],
	  'white': [37, 39],
	  'grey': [90, 39],
	  'black': [30, 39],
	  'blue': [34, 39],
	  'cyan': [36, 39],
	  'green': [32, 39],
	  'magenta': [35, 39],
	  'red': [31, 39],
	  'yellow': [33, 39]
	}; // Don't use 'blue' not visible on cmd.exe

	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};

	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return "\x1B[" + inspect.colors[style][0] + 'm' + str + "\x1B[" + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}

	function stylizeNoColor(str, styleType) {
	  return str;
	}

	function arrayToHash(array) {
	  var hash = {};
	  array.forEach(function (val, idx) {
	    hash[val] = true;
	  });
	  return hash;
	}

	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
	  value.inspect !== inspect && // Also filter out any prototype objects using the circular check.
	  !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);

	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }

	    return ret;
	  } // Primitive types cannot have properties


	  var primitive = formatPrimitive(ctx, value);

	  if (primitive) {
	    return primitive;
	  } // Look up the keys of the object.


	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  } // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


	  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  } // Some type of object without properties can be shortcutted.


	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }

	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }

	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }

	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '',
	      array = false,
	      braces = ['{', '}']; // Make Array say that they are Array

	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  } // Make functions say that they are functions


	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  } // Make RegExps say that they are RegExps


	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  } // Make dates with properties first say the date


	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  } // Make error with message first say the error


	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);
	  var output;

	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function (key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();
	  return reduceToSingleString(output, base, braces);
	}

	function formatPrimitive(ctx, value) {
	  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }

	  if (isNumber(value)) return ctx.stylize('' + value, 'number');
	  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

	  if (isNull(value)) return ctx.stylize('null', 'null');
	}

	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}

	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];

	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
	    } else {
	      output.push('');
	    }
	  }

	  keys.forEach(function (key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
	    }
	  });
	  return output;
	}

	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || {
	    value: value[key]
	  };

	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }

	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }

	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }

	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function (line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function (line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }

	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }

	    name = JSON.stringify('' + key);

	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}

	function reduceToSingleString(output, base, braces) {
	  var length = output.reduce(function (prev, cur) {
	    if (cur.indexOf('\n') >= 0) ;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	} // NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.


	function isArray(ar) {
	  return Array.isArray(ar);
	}
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	function isString(arg) {
	  return typeof arg === 'string';
	}
	function isSymbol(arg) {
	  return _typeof$1(arg) === 'symbol';
	}
	function isUndefined(arg) {
	  return arg === void 0;
	}
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	function isObject(arg) {
	  return _typeof$1(arg) === 'object' && arg !== null;
	}
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	function isError(e) {
	  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	function isPrimitive(arg) {
	  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || _typeof$1(arg) === 'symbol' || // ES6 symbol
	  typeof arg === 'undefined';
	}
	function isBuffer(maybeBuf) {
	  return Buffer.isBuffer(maybeBuf);
	}

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

	function timestamp$1() {
	  var d = new Date();
	  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	} // log is just a thin wrapper to console.log that prepends a timestamp


	function log() {
	  console.log('%s - %s', timestamp$1(), format.apply(null, arguments));
	}
	function _extend(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	  var keys = Object.keys(add);
	  var i = keys.length;

	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }

	  return origin;
	}

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	var util = {
	  inherits: inherits$1,
	  _extend: _extend,
	  log: log,
	  isBuffer: isBuffer,
	  isPrimitive: isPrimitive,
	  isFunction: isFunction,
	  isError: isError,
	  isDate: isDate,
	  isObject: isObject,
	  isRegExp: isRegExp,
	  isUndefined: isUndefined,
	  isSymbol: isSymbol,
	  isString: isString,
	  isNumber: isNumber,
	  isNullOrUndefined: isNullOrUndefined,
	  isNull: isNull,
	  isBoolean: isBoolean,
	  isArray: isArray,
	  inspect: inspect,
	  deprecate: deprecate,
	  format: format,
	  debuglog: debuglog
	};

	var util$1 = /*#__PURE__*/Object.freeze({
		format: format,
		deprecate: deprecate,
		debuglog: debuglog,
		inspect: inspect,
		isArray: isArray,
		isBoolean: isBoolean,
		isNull: isNull,
		isNullOrUndefined: isNullOrUndefined,
		isNumber: isNumber,
		isString: isString,
		isSymbol: isSymbol,
		isUndefined: isUndefined,
		isRegExp: isRegExp,
		isObject: isObject,
		isDate: isDate,
		isError: isError,
		isFunction: isFunction,
		isPrimitive: isPrimitive,
		isBuffer: isBuffer,
		log: log,
		inherits: inherits$1,
		_extend: _extend,
		default: util
	});

	var util$2 = getCjsExportFromNamespace(util$1);

	function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

	var Buffer$1 = buffer.Buffer;
	var randomBytes$1 = utils.randomBytes;
	var deprecate$1 = util$2.deprecate; // constants

	var PROCESS_UNIQUE = randomBytes$1(5); // Regular expression that checks for hex value

	var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
	var hasBufferType = false; // Check if buffer exists

	try {
	  if (Buffer$1 && Buffer$1.from) hasBufferType = true;
	} catch (err) {
	  hasBufferType = false;
	} // Precomputed hex table enables speedy hex string conversion


	var hexTable = [];

	for (var _i = 0; _i < 256; _i++) {
	  hexTable[_i] = (_i <= 15 ? '0' : '') + _i.toString(16);
	} // Lookup tables


	var decodeLookup = [];
	var i = 0;

	while (i < 10) {
	  decodeLookup[0x30 + i] = i++;
	}

	while (i < 16) {
	  decodeLookup[0x41 - 10 + i] = decodeLookup[0x61 - 10 + i] = i++;
	}

	var _Buffer = Buffer$1;

	function convertToHex(bytes) {
	  return bytes.toString('hex');
	}

	function makeObjectIdError(invalidString, index) {
	  var invalidCharacter = invalidString[index];
	  return new TypeError("ObjectId string \"".concat(invalidString, "\" contains invalid character \"").concat(invalidCharacter, "\" with character code (").concat(invalidString.charCodeAt(index), "). All character codes for a non-hex string must be less than 256."));
	}
	/**
	 * A class representation of the BSON ObjectId type.
	 */


	var ObjectId =
	/*#__PURE__*/
	function () {
	  /**
	   * Create an ObjectId type
	   *
	   * @param {(string|Buffer|number)} id Can be a 24 byte hex string, 12 byte binary Buffer, or a Number.
	   * @property {number} generationTime The generation time of this ObjectId instance
	   * @return {ObjectId} instance of ObjectId.
	   */
	  function ObjectId(id) {
	    _classCallCheck$2(this, ObjectId);

	    // Duck-typing to support ObjectId from different npm packages
	    if (id instanceof ObjectId) return id; // The most common usecase (blank id, new objectId instance)

	    if (id == null || typeof id === 'number') {
	      // Generate a new id
	      this.id = ObjectId.generate(id); // If we are caching the hex string

	      if (ObjectId.cacheHexString) this.__id = this.toString('hex'); // Return the object

	      return;
	    } // Check if the passed in id is valid


	    var valid = ObjectId.isValid(id); // Throw an error if it's not a valid setup

	    if (!valid && id != null) {
	      throw new TypeError('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	    } else if (valid && typeof id === 'string' && id.length === 24 && hasBufferType) {
	      return new ObjectId(Buffer$1.from(id, 'hex'));
	    } else if (valid && typeof id === 'string' && id.length === 24) {
	      return ObjectId.createFromHexString(id);
	    } else if (id != null && id.length === 12) {
	      // assume 12 byte string
	      this.id = id;
	    } else if (id != null && id.toHexString) {
	      // Duck-typing to support ObjectId from different npm packages
	      return ObjectId.createFromHexString(id.toHexString());
	    } else {
	      throw new TypeError('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	    }

	    if (ObjectId.cacheHexString) this.__id = this.toString('hex');
	  }
	  /**
	   * Return the ObjectId id as a 24 byte hex string representation
	   *
	   * @method
	   * @return {string} return the 24 byte hex string representation.
	   */


	  _createClass$2(ObjectId, [{
	    key: "toHexString",
	    value: function toHexString() {
	      if (ObjectId.cacheHexString && this.__id) return this.__id;
	      var hexString = '';

	      if (!this.id || !this.id.length) {
	        throw new TypeError('invalid ObjectId, ObjectId.id must be either a string or a Buffer, but is [' + JSON.stringify(this.id) + ']');
	      }

	      if (this.id instanceof _Buffer) {
	        hexString = convertToHex(this.id);
	        if (ObjectId.cacheHexString) this.__id = hexString;
	        return hexString;
	      }

	      for (var _i2 = 0; _i2 < this.id.length; _i2++) {
	        var hexChar = hexTable[this.id.charCodeAt(_i2)];

	        if (typeof hexChar !== 'string') {
	          throw makeObjectIdError(this.id, _i2);
	        }

	        hexString += hexChar;
	      }

	      if (ObjectId.cacheHexString) this.__id = hexString;
	      return hexString;
	    }
	    /**
	     * Update the ObjectId index used in generating new ObjectId's on the driver
	     *
	     * @method
	     * @return {number} returns next index value.
	     * @ignore
	     */

	  }, {
	    key: "toString",

	    /**
	     * Converts the id into a 24 byte hex string for printing
	     *
	     * @param {String} format The Buffer toString format parameter.
	     * @return {String} return the 24 byte hex string representation.
	     * @ignore
	     */
	    value: function toString(format) {
	      // Is the id a buffer then use the buffer toString method to return the format
	      if (this.id && this.id.copy) {
	        return this.id.toString(typeof format === 'string' ? format : 'hex');
	      }

	      return this.toHexString();
	    }
	    /**
	     * Converts to its JSON representation.
	     *
	     * @return {String} return the 24 byte hex string representation.
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.toHexString();
	    }
	    /**
	     * Compares the equality of this ObjectId with `otherID`.
	     *
	     * @method
	     * @param {object} otherId ObjectId instance to compare against.
	     * @return {boolean} the result of comparing two ObjectId's
	     */

	  }, {
	    key: "equals",
	    value: function equals(otherId) {
	      if (otherId instanceof ObjectId) {
	        return this.toString() === otherId.toString();
	      }

	      if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 12 && this.id instanceof _Buffer) {
	        return otherId === this.id.toString('binary');
	      }

	      if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 24) {
	        return otherId.toLowerCase() === this.toHexString();
	      }

	      if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 12) {
	        return otherId === this.id;
	      }

	      if (otherId != null && (otherId instanceof ObjectId || otherId.toHexString)) {
	        return otherId.toHexString() === this.toHexString();
	      }

	      return false;
	    }
	    /**
	     * Returns the generation date (accurate up to the second) that this ID was generated.
	     *
	     * @method
	     * @return {Date} the generation date
	     */

	  }, {
	    key: "getTimestamp",
	    value: function getTimestamp() {
	      var timestamp = new Date();
	      var time = this.id.readUInt32BE(0);
	      timestamp.setTime(Math.floor(time) * 1000);
	      return timestamp;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",

	    /**
	     * @ignore
	     */
	    value: function toExtendedJSON() {
	      if (this.toHexString) return {
	        $oid: this.toHexString()
	      };
	      return {
	        $oid: this.toString('hex')
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "getInc",
	    value: function getInc() {
	      return ObjectId.index = (ObjectId.index + 1) % 0xffffff;
	    }
	    /**
	     * Generate a 12 byte id buffer used in ObjectId's
	     *
	     * @method
	     * @param {number} [time] optional parameter allowing to pass in a second based timestamp.
	     * @return {Buffer} return the 12 byte id buffer string.
	     */

	  }, {
	    key: "generate",
	    value: function generate(time) {
	      if ('number' !== typeof time) {
	        time = ~~(Date.now() / 1000);
	      }

	      var inc = ObjectId.getInc();
	      var buffer$$1 = Buffer$1.alloc(12); // 4-byte timestamp

	      buffer$$1[3] = time & 0xff;
	      buffer$$1[2] = time >> 8 & 0xff;
	      buffer$$1[1] = time >> 16 & 0xff;
	      buffer$$1[0] = time >> 24 & 0xff; // 5-byte process unique

	      buffer$$1[4] = PROCESS_UNIQUE[0];
	      buffer$$1[5] = PROCESS_UNIQUE[1];
	      buffer$$1[6] = PROCESS_UNIQUE[2];
	      buffer$$1[7] = PROCESS_UNIQUE[3];
	      buffer$$1[8] = PROCESS_UNIQUE[4]; // 3-byte counter

	      buffer$$1[11] = inc & 0xff;
	      buffer$$1[10] = inc >> 8 & 0xff;
	      buffer$$1[9] = inc >> 16 & 0xff;
	      return buffer$$1;
	    }
	  }, {
	    key: "createPk",
	    value: function createPk() {
	      return new ObjectId();
	    }
	    /**
	     * Creates an ObjectId from a second based number, with the rest of the ObjectId zeroed out. Used for comparisons or sorting the ObjectId.
	     *
	     * @method
	     * @param {number} time an integer number representing a number of seconds.
	     * @return {ObjectId} return the created ObjectId
	     */

	  }, {
	    key: "createFromTime",
	    value: function createFromTime(time) {
	      var buffer$$1 = Buffer$1.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Encode time into first 4 bytes

	      buffer$$1[3] = time & 0xff;
	      buffer$$1[2] = time >> 8 & 0xff;
	      buffer$$1[1] = time >> 16 & 0xff;
	      buffer$$1[0] = time >> 24 & 0xff; // Return the new objectId

	      return new ObjectId(buffer$$1);
	    }
	    /**
	     * Creates an ObjectId from a hex string representation of an ObjectId.
	     *
	     * @method
	     * @param {string} hexString create a ObjectId from a passed in 24 byte hexstring.
	     * @return {ObjectId} return the created ObjectId
	     */

	  }, {
	    key: "createFromHexString",
	    value: function createFromHexString(string) {
	      // Throw an error if it's not a valid setup
	      if (typeof string === 'undefined' || string != null && string.length !== 24) {
	        throw new TypeError('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
	      } // Use Buffer.from method if available


	      if (hasBufferType) return new ObjectId(Buffer$1.from(string, 'hex')); // Calculate lengths

	      var array = new _Buffer(12);
	      var n = 0;
	      var i = 0;

	      while (i < 24) {
	        array[n++] = decodeLookup[string.charCodeAt(i++)] << 4 | decodeLookup[string.charCodeAt(i++)];
	      }

	      return new ObjectId(array);
	    }
	    /**
	     * Checks if a value is a valid bson ObjectId
	     *
	     * @method
	     * @return {boolean} return true if the value is a valid bson ObjectId, return false otherwise.
	     */

	  }, {
	    key: "isValid",
	    value: function isValid(id) {
	      if (id == null) return false;

	      if (typeof id === 'number') {
	        return true;
	      }

	      if (typeof id === 'string') {
	        return id.length === 12 || id.length === 24 && checkForHexRegExp.test(id);
	      }

	      if (id instanceof ObjectId) {
	        return true;
	      }

	      if (id instanceof _Buffer && id.length === 12) {
	        return true;
	      } // Duck-Typing detection of ObjectId like objects


	      if (id.toHexString) {
	        return id.id.length === 12 || id.id.length === 24 && checkForHexRegExp.test(id.id);
	      }

	      return false;
	    }
	  }, {
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new ObjectId(doc.$oid);
	    }
	  }]);

	  return ObjectId;
	}(); // Deprecated methods


	ObjectId.get_inc = deprecate$1(function () {
	  return ObjectId.getInc();
	}, 'Please use the static `ObjectId.getInc()` instead');
	ObjectId.prototype.get_inc = deprecate$1(function () {
	  return ObjectId.getInc();
	}, 'Please use the static `ObjectId.getInc()` instead');
	ObjectId.prototype.getInc = deprecate$1(function () {
	  return ObjectId.getInc();
	}, 'Please use the static `ObjectId.getInc()` instead');
	ObjectId.prototype.generate = deprecate$1(function (time) {
	  return ObjectId.generate(time);
	}, 'Please use the static `ObjectId.generate(time)` instead');
	/**
	 * @ignore
	 */

	Object.defineProperty(ObjectId.prototype, 'generationTime', {
	  enumerable: true,
	  get: function get() {
	    return this.id[3] | this.id[2] << 8 | this.id[1] << 16 | this.id[0] << 24;
	  },
	  set: function set(value) {
	    // Encode time into first 4 bytes
	    this.id[3] = value & 0xff;
	    this.id[2] = value >> 8 & 0xff;
	    this.id[1] = value >> 16 & 0xff;
	    this.id[0] = value >> 24 & 0xff;
	  }
	});
	/**
	 * Converts to a string representation of this Id.
	 *
	 * @return {String} return the 24 byte hex string representation.
	 * @ignore
	 */

	ObjectId.prototype[util$2.inspect.custom || 'inspect'] = ObjectId.prototype.toString;
	/**
	 * @ignore
	 */

	ObjectId.index = ~~(Math.random() * 0xffffff); // In 4.0.0 and 4.0.1, this property name was changed to ObjectId to match the class name.
	// This caused interoperability problems with previous versions of the library, so in
	// later builds we changed it back to ObjectID (capital D) to match legacy implementations.

	Object.defineProperty(ObjectId.prototype, '_bsontype', {
	  value: 'ObjectID'
	});
	var objectid = ObjectId;

	function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }

	function alphabetize(str) {
	  return str.split('').sort().join('');
	}
	/**
	 * A class representation of the BSON RegExp type.
	 */


	var BSONRegExp =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a RegExp type
	   *
	   * @param {string} pattern The regular expression pattern to match
	   * @param {string} options The regular expression options
	   */
	  function BSONRegExp(pattern, options) {
	    _classCallCheck$3(this, BSONRegExp);

	    // Execute
	    this.pattern = pattern || '';
	    this.options = options ? alphabetize(options) : ''; // Validate options

	    for (var i = 0; i < this.options.length; i++) {
	      if (!(this.options[i] === 'i' || this.options[i] === 'm' || this.options[i] === 'x' || this.options[i] === 'l' || this.options[i] === 's' || this.options[i] === 'u')) {
	        throw new Error("The regular expression option [".concat(this.options[i], "] is not supported"));
	      }
	    }
	  }
	  /**
	   * @ignore
	   */


	  _createClass$3(BSONRegExp, [{
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      return {
	        $regularExpression: {
	          pattern: this.pattern,
	          options: this.options
	        }
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new BSONRegExp(doc.$regularExpression.pattern, doc.$regularExpression.options.split('').sort().join(''));
	    }
	  }]);

	  return BSONRegExp;
	}();

	Object.defineProperty(BSONRegExp.prototype, '_bsontype', {
	  value: 'BSONRegExp'
	});
	var regexp = BSONRegExp;

	/**
	 * A class representation of the BSON Symbol type.
	 */

	function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); return Constructor; }

	var BSONSymbol =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a Symbol type
	   *
	   * @param {string} value the string representing the symbol.
	   */
	  function BSONSymbol(value) {
	    _classCallCheck$4(this, BSONSymbol);

	    this.value = value;
	  }
	  /**
	   * Access the wrapped string value.
	   *
	   * @method
	   * @return {String} returns the wrapped string.
	   */


	  _createClass$4(BSONSymbol, [{
	    key: "valueOf",
	    value: function valueOf() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toString",
	    value: function toString() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "inspect",
	    value: function inspect() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      return {
	        $symbol: this.value
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new BSONSymbol(doc.$symbol);
	    }
	  }]);

	  return BSONSymbol;
	}();

	Object.defineProperty(BSONSymbol.prototype, '_bsontype', {
	  value: 'Symbol'
	});
	var symbol = BSONSymbol;

	/**
	 * A class representation of a BSON Int32 type.
	 */

	function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$5(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$5(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$5(Constructor.prototype, protoProps); if (staticProps) _defineProperties$5(Constructor, staticProps); return Constructor; }

	var Int32 =
	/*#__PURE__*/
	function () {
	  /**
	   * Create an Int32 type
	   *
	   * @param {number} value the number we want to represent as an int32.
	   * @return {Int32}
	   */
	  function Int32(value) {
	    _classCallCheck$5(this, Int32);

	    this.value = value;
	  }
	  /**
	   * Access the number value.
	   *
	   * @method
	   * @return {number} returns the wrapped int32 number.
	   */


	  _createClass$5(Int32, [{
	    key: "valueOf",
	    value: function valueOf() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.value;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON(options) {
	      if (options && options.relaxed) return this.value;
	      return {
	        $numberInt: this.value.toString()
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc, options) {
	      return options && options.relaxed ? parseInt(doc.$numberInt, 10) : new Int32(doc.$numberInt);
	    }
	  }]);

	  return Int32;
	}();

	Object.defineProperty(Int32.prototype, '_bsontype', {
	  value: 'Int32'
	});
	var int_32 = Int32;

	/**
	 * A class representation of the BSON Code type.
	 */

	function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$6(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$6(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$6(Constructor.prototype, protoProps); if (staticProps) _defineProperties$6(Constructor, staticProps); return Constructor; }

	var Code =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a Code type
	   *
	   * @param {(string|function)} code a string or function.
	   * @param {Object} [scope] an optional scope for the function.
	   * @return {Code}
	   */
	  function Code(code, scope) {
	    _classCallCheck$6(this, Code);

	    this.code = code;
	    this.scope = scope;
	  }
	  /**
	   * @ignore
	   */


	  _createClass$6(Code, [{
	    key: "toJSON",
	    value: function toJSON() {
	      return {
	        scope: this.scope,
	        code: this.code
	      };
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      if (this.scope) {
	        return {
	          $code: this.code,
	          $scope: this.scope
	        };
	      }

	      return {
	        $code: this.code
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      return new Code(doc.$code, doc.$scope);
	    }
	  }]);

	  return Code;
	}();

	Object.defineProperty(Code.prototype, '_bsontype', {
	  value: 'Code'
	});
	var code = Code;

	var Buffer$2 = buffer.Buffer;
	var PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/;
	var PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/i;
	var PARSE_NAN_REGEXP = /^(\+|-)?NaN$/i;
	var EXPONENT_MAX = 6111;
	var EXPONENT_MIN = -6176;
	var EXPONENT_BIAS = 6176;
	var MAX_DIGITS = 34; // Nan value bits as 32 bit values (due to lack of longs)

	var NAN_BUFFER = [0x7c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse(); // Infinity value bits 32 bit values (due to lack of longs)

	var INF_NEGATIVE_BUFFER = [0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse();
	var INF_POSITIVE_BUFFER = [0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].reverse();
	var EXPONENT_REGEX = /^([-+])?(\d+)?$/; // Detect if the value is a digit

	function isDigit(value) {
	  return !isNaN(parseInt(value, 10));
	} // Divide two uint128 values


	function divideu128(value) {
	  var DIVISOR = long_1.fromNumber(1000 * 1000 * 1000);

	  var _rem = long_1.fromNumber(0);

	  if (!value.parts[0] && !value.parts[1] && !value.parts[2] && !value.parts[3]) {
	    return {
	      quotient: value,
	      rem: _rem
	    };
	  }

	  for (var i = 0; i <= 3; i++) {
	    // Adjust remainder to match value of next dividend
	    _rem = _rem.shiftLeft(32); // Add the divided to _rem

	    _rem = _rem.add(new long_1(value.parts[i], 0));
	    value.parts[i] = _rem.div(DIVISOR).low;
	    _rem = _rem.modulo(DIVISOR);
	  }

	  return {
	    quotient: value,
	    rem: _rem
	  };
	} // Multiply two Long values and return the 128 bit value


	function multiply64x2(left, right) {
	  if (!left && !right) {
	    return {
	      high: long_1.fromNumber(0),
	      low: long_1.fromNumber(0)
	    };
	  }

	  var leftHigh = left.shiftRightUnsigned(32);
	  var leftLow = new long_1(left.getLowBits(), 0);
	  var rightHigh = right.shiftRightUnsigned(32);
	  var rightLow = new long_1(right.getLowBits(), 0);
	  var productHigh = leftHigh.multiply(rightHigh);
	  var productMid = leftHigh.multiply(rightLow);
	  var productMid2 = leftLow.multiply(rightHigh);
	  var productLow = leftLow.multiply(rightLow);
	  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
	  productMid = new long_1(productMid.getLowBits(), 0).add(productMid2).add(productLow.shiftRightUnsigned(32));
	  productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
	  productLow = productMid.shiftLeft(32).add(new long_1(productLow.getLowBits(), 0)); // Return the 128 bit result

	  return {
	    high: productHigh,
	    low: productLow
	  };
	}

	function lessThan(left, right) {
	  // Make values unsigned
	  var uhleft = left.high >>> 0;
	  var uhright = right.high >>> 0; // Compare high bits first

	  if (uhleft < uhright) {
	    return true;
	  } else if (uhleft === uhright) {
	    var ulleft = left.low >>> 0;
	    var ulright = right.low >>> 0;
	    if (ulleft < ulright) return true;
	  }

	  return false;
	}

	function invalidErr(string, message) {
	  throw new TypeError("\"".concat(string, "\" is not a valid Decimal128 string - ").concat(message));
	}
	/**
	 * A class representation of the BSON Decimal128 type.
	 *
	 * @class
	 * @param {Buffer} bytes a buffer containing the raw Decimal128 bytes.
	 * @return {Double}
	 */


	function Decimal128(bytes) {
	  this.bytes = bytes;
	}
	/**
	 * Create a Decimal128 instance from a string representation
	 *
	 * @method
	 * @param {string} string a numeric string representation.
	 * @return {Decimal128} returns a Decimal128 instance.
	 */


	Decimal128.fromString = function (string) {
	  // Parse state tracking
	  var isNegative = false;
	  var sawRadix = false;
	  var foundNonZero = false; // Total number of significant digits (no leading or trailing zero)

	  var significantDigits = 0; // Total number of significand digits read

	  var nDigitsRead = 0; // Total number of digits (no leading zeros)

	  var nDigits = 0; // The number of the digits after radix

	  var radixPosition = 0; // The index of the first non-zero in *str*

	  var firstNonZero = 0; // Digits Array

	  var digits = [0]; // The number of digits in digits

	  var nDigitsStored = 0; // Insertion pointer for digits

	  var digitsInsert = 0; // The index of the first non-zero digit

	  var firstDigit = 0; // The index of the last digit

	  var lastDigit = 0; // Exponent

	  var exponent = 0; // loop index over array

	  var i = 0; // The high 17 digits of the significand

	  var significandHigh = [0, 0]; // The low 17 digits of the significand

	  var significandLow = [0, 0]; // The biased exponent

	  var biasedExponent = 0; // Read index

	  var index = 0; // Naively prevent against REDOS attacks.
	  // TODO: implementing a custom parsing for this, or refactoring the regex would yield
	  //       further gains.

	  if (string.length >= 7000) {
	    throw new TypeError('' + string + ' not a valid Decimal128 string');
	  } // Results


	  var stringMatch = string.match(PARSE_STRING_REGEXP);
	  var infMatch = string.match(PARSE_INF_REGEXP);
	  var nanMatch = string.match(PARSE_NAN_REGEXP); // Validate the string

	  if (!stringMatch && !infMatch && !nanMatch || string.length === 0) {
	    throw new TypeError('' + string + ' not a valid Decimal128 string');
	  }

	  if (stringMatch) {
	    // full_match = stringMatch[0]
	    // sign = stringMatch[1]
	    var unsignedNumber = stringMatch[2]; // stringMatch[3] is undefined if a whole number (ex "1", 12")
	    // but defined if a number w/ decimal in it (ex "1.0, 12.2")

	    var e = stringMatch[4];
	    var expSign = stringMatch[5];
	    var expNumber = stringMatch[6]; // they provided e, but didn't give an exponent number. for ex "1e"

	    if (e && expNumber === undefined) invalidErr(string, 'missing exponent power'); // they provided e, but didn't give a number before it. for ex "e1"

	    if (e && unsignedNumber === undefined) invalidErr(string, 'missing exponent base');

	    if (e === undefined && (expSign || expNumber)) {
	      invalidErr(string, 'missing e before exponent');
	    }
	  } // Get the negative or positive sign


	  if (string[index] === '+' || string[index] === '-') {
	    isNegative = string[index++] === '-';
	  } // Check if user passed Infinity or NaN


	  if (!isDigit(string[index]) && string[index] !== '.') {
	    if (string[index] === 'i' || string[index] === 'I') {
	      return new Decimal128(Buffer$2.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
	    } else if (string[index] === 'N') {
	      return new Decimal128(Buffer$2.from(NAN_BUFFER));
	    }
	  } // Read all the digits


	  while (isDigit(string[index]) || string[index] === '.') {
	    if (string[index] === '.') {
	      if (sawRadix) invalidErr(string, 'contains multiple periods');
	      sawRadix = true;
	      index = index + 1;
	      continue;
	    }

	    if (nDigitsStored < 34) {
	      if (string[index] !== '0' || foundNonZero) {
	        if (!foundNonZero) {
	          firstNonZero = nDigitsRead;
	        }

	        foundNonZero = true; // Only store 34 digits

	        digits[digitsInsert++] = parseInt(string[index], 10);
	        nDigitsStored = nDigitsStored + 1;
	      }
	    }

	    if (foundNonZero) nDigits = nDigits + 1;
	    if (sawRadix) radixPosition = radixPosition + 1;
	    nDigitsRead = nDigitsRead + 1;
	    index = index + 1;
	  }

	  if (sawRadix && !nDigitsRead) throw new TypeError('' + string + ' not a valid Decimal128 string'); // Read exponent if exists

	  if (string[index] === 'e' || string[index] === 'E') {
	    // Read exponent digits
	    var match = string.substr(++index).match(EXPONENT_REGEX); // No digits read

	    if (!match || !match[2]) return new Decimal128(Buffer$2.from(NAN_BUFFER)); // Get exponent

	    exponent = parseInt(match[0], 10); // Adjust the index

	    index = index + match[0].length;
	  } // Return not a number


	  if (string[index]) return new Decimal128(Buffer$2.from(NAN_BUFFER)); // Done reading input
	  // Find first non-zero digit in digits

	  firstDigit = 0;

	  if (!nDigitsStored) {
	    firstDigit = 0;
	    lastDigit = 0;
	    digits[0] = 0;
	    nDigits = 1;
	    nDigitsStored = 1;
	    significantDigits = 0;
	  } else {
	    lastDigit = nDigitsStored - 1;
	    significantDigits = nDigits;

	    if (significantDigits !== 1) {
	      while (string[firstNonZero + significantDigits - 1] === '0') {
	        significantDigits = significantDigits - 1;
	      }
	    }
	  } // Normalization of exponent
	  // Correct exponent based on radix position, and shift significand as needed
	  // to represent user input
	  // Overflow prevention


	  if (exponent <= radixPosition && radixPosition - exponent > 1 << 14) {
	    exponent = EXPONENT_MIN;
	  } else {
	    exponent = exponent - radixPosition;
	  } // Attempt to normalize the exponent


	  while (exponent > EXPONENT_MAX) {
	    // Shift exponent to significand and decrease
	    lastDigit = lastDigit + 1;

	    if (lastDigit - firstDigit > MAX_DIGITS) {
	      // Check if we have a zero then just hard clamp, otherwise fail
	      var digitsString = digits.join('');

	      if (digitsString.match(/^0+$/)) {
	        exponent = EXPONENT_MAX;
	        break;
	      }

	      invalidErr(string, 'overflow');
	    }

	    exponent = exponent - 1;
	  }

	  while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
	    // Shift last digit. can only do this if < significant digits than # stored.
	    if (lastDigit === 0 && significantDigits < nDigitsStored) {
	      exponent = EXPONENT_MIN;
	      significantDigits = 0;
	      break;
	    }

	    if (nDigitsStored < nDigits) {
	      // adjust to match digits not stored
	      nDigits = nDigits - 1;
	    } else {
	      // adjust to round
	      lastDigit = lastDigit - 1;
	    }

	    if (exponent < EXPONENT_MAX) {
	      exponent = exponent + 1;
	    } else {
	      // Check if we have a zero then just hard clamp, otherwise fail
	      var _digitsString = digits.join('');

	      if (_digitsString.match(/^0+$/)) {
	        exponent = EXPONENT_MAX;
	        break;
	      }

	      invalidErr(string, 'overflow');
	    }
	  } // Round
	  // We've normalized the exponent, but might still need to round.


	  if (lastDigit - firstDigit + 1 < significantDigits) {
	    var endOfString = nDigitsRead; // If we have seen a radix point, 'string' is 1 longer than we have
	    // documented with ndigits_read, so inc the position of the first nonzero
	    // digit and the position that digits are read to.

	    if (sawRadix) {
	      firstNonZero = firstNonZero + 1;
	      endOfString = endOfString + 1;
	    } // if negative, we need to increment again to account for - sign at start.


	    if (isNegative) {
	      firstNonZero = firstNonZero + 1;
	      endOfString = endOfString + 1;
	    }

	    var roundDigit = parseInt(string[firstNonZero + lastDigit + 1], 10);
	    var roundBit = 0;

	    if (roundDigit >= 5) {
	      roundBit = 1;

	      if (roundDigit === 5) {
	        roundBit = digits[lastDigit] % 2 === 1;

	        for (i = firstNonZero + lastDigit + 2; i < endOfString; i++) {
	          if (parseInt(string[i], 10)) {
	            roundBit = 1;
	            break;
	          }
	        }
	      }
	    }

	    if (roundBit) {
	      var dIdx = lastDigit;

	      for (; dIdx >= 0; dIdx--) {
	        if (++digits[dIdx] > 9) {
	          digits[dIdx] = 0; // overflowed most significant digit

	          if (dIdx === 0) {
	            if (exponent < EXPONENT_MAX) {
	              exponent = exponent + 1;
	              digits[dIdx] = 1;
	            } else {
	              return new Decimal128(Buffer$2.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
	            }
	          }
	        }
	      }
	    }
	  } // Encode significand
	  // The high 17 digits of the significand


	  significandHigh = long_1.fromNumber(0); // The low 17 digits of the significand

	  significandLow = long_1.fromNumber(0); // read a zero

	  if (significantDigits === 0) {
	    significandHigh = long_1.fromNumber(0);
	    significandLow = long_1.fromNumber(0);
	  } else if (lastDigit - firstDigit < 17) {
	    var _dIdx = firstDigit;
	    significandLow = long_1.fromNumber(digits[_dIdx++]);
	    significandHigh = new long_1(0, 0);

	    for (; _dIdx <= lastDigit; _dIdx++) {
	      significandLow = significandLow.multiply(long_1.fromNumber(10));
	      significandLow = significandLow.add(long_1.fromNumber(digits[_dIdx]));
	    }
	  } else {
	    var _dIdx2 = firstDigit;
	    significandHigh = long_1.fromNumber(digits[_dIdx2++]);

	    for (; _dIdx2 <= lastDigit - 17; _dIdx2++) {
	      significandHigh = significandHigh.multiply(long_1.fromNumber(10));
	      significandHigh = significandHigh.add(long_1.fromNumber(digits[_dIdx2]));
	    }

	    significandLow = long_1.fromNumber(digits[_dIdx2++]);

	    for (; _dIdx2 <= lastDigit; _dIdx2++) {
	      significandLow = significandLow.multiply(long_1.fromNumber(10));
	      significandLow = significandLow.add(long_1.fromNumber(digits[_dIdx2]));
	    }
	  }

	  var significand = multiply64x2(significandHigh, long_1.fromString('100000000000000000'));
	  significand.low = significand.low.add(significandLow);

	  if (lessThan(significand.low, significandLow)) {
	    significand.high = significand.high.add(long_1.fromNumber(1));
	  } // Biased exponent


	  biasedExponent = exponent + EXPONENT_BIAS;
	  var dec = {
	    low: long_1.fromNumber(0),
	    high: long_1.fromNumber(0)
	  }; // Encode combination, exponent, and significand.

	  if (significand.high.shiftRightUnsigned(49).and(long_1.fromNumber(1)).equals(long_1.fromNumber(1))) {
	    // Encode '11' into bits 1 to 3
	    dec.high = dec.high.or(long_1.fromNumber(0x3).shiftLeft(61));
	    dec.high = dec.high.or(long_1.fromNumber(biasedExponent).and(long_1.fromNumber(0x3fff).shiftLeft(47)));
	    dec.high = dec.high.or(significand.high.and(long_1.fromNumber(0x7fffffffffff)));
	  } else {
	    dec.high = dec.high.or(long_1.fromNumber(biasedExponent & 0x3fff).shiftLeft(49));
	    dec.high = dec.high.or(significand.high.and(long_1.fromNumber(0x1ffffffffffff)));
	  }

	  dec.low = significand.low; // Encode sign

	  if (isNegative) {
	    dec.high = dec.high.or(long_1.fromString('9223372036854775808'));
	  } // Encode into a buffer


	  var buffer$$1 = Buffer$2.alloc(16);
	  index = 0; // Encode the low 64 bits of the decimal
	  // Encode low bits

	  buffer$$1[index++] = dec.low.low & 0xff;
	  buffer$$1[index++] = dec.low.low >> 8 & 0xff;
	  buffer$$1[index++] = dec.low.low >> 16 & 0xff;
	  buffer$$1[index++] = dec.low.low >> 24 & 0xff; // Encode high bits

	  buffer$$1[index++] = dec.low.high & 0xff;
	  buffer$$1[index++] = dec.low.high >> 8 & 0xff;
	  buffer$$1[index++] = dec.low.high >> 16 & 0xff;
	  buffer$$1[index++] = dec.low.high >> 24 & 0xff; // Encode the high 64 bits of the decimal
	  // Encode low bits

	  buffer$$1[index++] = dec.high.low & 0xff;
	  buffer$$1[index++] = dec.high.low >> 8 & 0xff;
	  buffer$$1[index++] = dec.high.low >> 16 & 0xff;
	  buffer$$1[index++] = dec.high.low >> 24 & 0xff; // Encode high bits

	  buffer$$1[index++] = dec.high.high & 0xff;
	  buffer$$1[index++] = dec.high.high >> 8 & 0xff;
	  buffer$$1[index++] = dec.high.high >> 16 & 0xff;
	  buffer$$1[index++] = dec.high.high >> 24 & 0xff; // Return the new Decimal128

	  return new Decimal128(buffer$$1);
	}; // Extract least significant 5 bits


	var COMBINATION_MASK = 0x1f; // Extract least significant 14 bits

	var EXPONENT_MASK = 0x3fff; // Value of combination field for Inf

	var COMBINATION_INFINITY = 30; // Value of combination field for NaN

	var COMBINATION_NAN = 31;
	/**
	 * Create a string representation of the raw Decimal128 value
	 *
	 * @method
	 * @return {string} returns a Decimal128 string representation.
	 */

	Decimal128.prototype.toString = function () {
	  // Note: bits in this routine are referred to starting at 0,
	  // from the sign bit, towards the coefficient.
	  // bits 0 - 31
	  var high; // bits 32 - 63

	  var midh; // bits 64 - 95

	  var midl; // bits 96 - 127

	  var low; // bits 1 - 5

	  var combination; // decoded biased exponent (14 bits)

	  var biased_exponent; // the number of significand digits

	  var significand_digits = 0; // the base-10 digits in the significand

	  var significand = new Array(36);

	  for (var i = 0; i < significand.length; i++) {
	    significand[i] = 0;
	  } // read pointer into significand


	  var index = 0; // unbiased exponent

	  var exponent; // the exponent if scientific notation is used

	  var scientific_exponent; // true if the number is zero

	  var is_zero = false; // the most signifcant significand bits (50-46)

	  var significand_msb; // temporary storage for significand decoding

	  var significand128 = {
	    parts: new Array(4)
	  }; // indexing variables

	  var j, k; // Output string

	  var string = []; // Unpack index

	  index = 0; // Buffer reference

	  var buffer$$1 = this.bytes; // Unpack the low 64bits into a long

	  low = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	  midl = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Unpack the high 64bits into a long

	  midh = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	  high = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Unpack index

	  index = 0; // Create the state of the decimal

	  var dec = {
	    low: new long_1(low, midl),
	    high: new long_1(midh, high)
	  };

	  if (dec.high.lessThan(long_1.ZERO)) {
	    string.push('-');
	  } // Decode combination field and exponent


	  combination = high >> 26 & COMBINATION_MASK;

	  if (combination >> 3 === 3) {
	    // Check for 'special' values
	    if (combination === COMBINATION_INFINITY) {
	      return string.join('') + 'Infinity';
	    } else if (combination === COMBINATION_NAN) {
	      return 'NaN';
	    } else {
	      biased_exponent = high >> 15 & EXPONENT_MASK;
	      significand_msb = 0x08 + (high >> 14 & 0x01);
	    }
	  } else {
	    significand_msb = high >> 14 & 0x07;
	    biased_exponent = high >> 17 & EXPONENT_MASK;
	  }

	  exponent = biased_exponent - EXPONENT_BIAS; // Create string of significand digits
	  // Convert the 114-bit binary number represented by
	  // (significand_high, significand_low) to at most 34 decimal
	  // digits through modulo and division.

	  significand128.parts[0] = (high & 0x3fff) + ((significand_msb & 0xf) << 14);
	  significand128.parts[1] = midh;
	  significand128.parts[2] = midl;
	  significand128.parts[3] = low;

	  if (significand128.parts[0] === 0 && significand128.parts[1] === 0 && significand128.parts[2] === 0 && significand128.parts[3] === 0) {
	    is_zero = true;
	  } else {
	    for (k = 3; k >= 0; k--) {
	      var least_digits = 0; // Peform the divide

	      var result = divideu128(significand128);
	      significand128 = result.quotient;
	      least_digits = result.rem.low; // We now have the 9 least significant digits (in base 2).
	      // Convert and output to string.

	      if (!least_digits) continue;

	      for (j = 8; j >= 0; j--) {
	        // significand[k * 9 + j] = Math.round(least_digits % 10);
	        significand[k * 9 + j] = least_digits % 10; // least_digits = Math.round(least_digits / 10);

	        least_digits = Math.floor(least_digits / 10);
	      }
	    }
	  } // Output format options:
	  // Scientific - [-]d.dddE(+/-)dd or [-]dE(+/-)dd
	  // Regular    - ddd.ddd


	  if (is_zero) {
	    significand_digits = 1;
	    significand[index] = 0;
	  } else {
	    significand_digits = 36;

	    while (!significand[index]) {
	      significand_digits = significand_digits - 1;
	      index = index + 1;
	    }
	  }

	  scientific_exponent = significand_digits - 1 + exponent; // The scientific exponent checks are dictated by the string conversion
	  // specification and are somewhat arbitrary cutoffs.
	  //
	  // We must check exponent > 0, because if this is the case, the number
	  // has trailing zeros.  However, we *cannot* output these trailing zeros,
	  // because doing so would change the precision of the value, and would
	  // change stored data if the string converted number is round tripped.

	  if (scientific_exponent >= 34 || scientific_exponent <= -7 || exponent > 0) {
	    // Scientific format
	    // if there are too many significant digits, we should just be treating numbers
	    // as + or - 0 and using the non-scientific exponent (this is for the "invalid
	    // representation should be treated as 0/-0" spec cases in decimal128-1.json)
	    if (significand_digits > 34) {
	      string.push(0);
	      if (exponent > 0) string.push('E+' + exponent);else if (exponent < 0) string.push('E' + exponent);
	      return string.join('');
	    }

	    string.push(significand[index++]);
	    significand_digits = significand_digits - 1;

	    if (significand_digits) {
	      string.push('.');
	    }

	    for (var _i = 0; _i < significand_digits; _i++) {
	      string.push(significand[index++]);
	    } // Exponent


	    string.push('E');

	    if (scientific_exponent > 0) {
	      string.push('+' + scientific_exponent);
	    } else {
	      string.push(scientific_exponent);
	    }
	  } else {
	    // Regular format with no decimal place
	    if (exponent >= 0) {
	      for (var _i2 = 0; _i2 < significand_digits; _i2++) {
	        string.push(significand[index++]);
	      }
	    } else {
	      var radix_position = significand_digits + exponent; // non-zero digits before radix

	      if (radix_position > 0) {
	        for (var _i3 = 0; _i3 < radix_position; _i3++) {
	          string.push(significand[index++]);
	        }
	      } else {
	        string.push('0');
	      }

	      string.push('.'); // add leading zeros after radix

	      while (radix_position++ < 0) {
	        string.push('0');
	      }

	      for (var _i4 = 0; _i4 < significand_digits - Math.max(radix_position - 1, 0); _i4++) {
	        string.push(significand[index++]);
	      }
	    }
	  }

	  return string.join('');
	};

	Decimal128.prototype.toJSON = function () {
	  return {
	    $numberDecimal: this.toString()
	  };
	};
	/**
	 * @ignore
	 */


	Decimal128.prototype.toExtendedJSON = function () {
	  return {
	    $numberDecimal: this.toString()
	  };
	};
	/**
	 * @ignore
	 */


	Decimal128.fromExtendedJSON = function (doc) {
	  return Decimal128.fromString(doc.$numberDecimal);
	};

	Object.defineProperty(Decimal128.prototype, '_bsontype', {
	  value: 'Decimal128'
	});
	var decimal128 = Decimal128;

	/**
	 * A class representation of the BSON MinKey type.
	 */

	function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$7(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$7(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$7(Constructor.prototype, protoProps); if (staticProps) _defineProperties$7(Constructor, staticProps); return Constructor; }

	var MinKey =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a MinKey type
	   *
	   * @return {MinKey} A MinKey instance
	   */
	  function MinKey() {
	    _classCallCheck$7(this, MinKey);
	  }
	  /**
	   * @ignore
	   */


	  _createClass$7(MinKey, [{
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      return {
	        $minKey: 1
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON() {
	      return new MinKey();
	    }
	  }]);

	  return MinKey;
	}();

	Object.defineProperty(MinKey.prototype, '_bsontype', {
	  value: 'MinKey'
	});
	var min_key = MinKey;

	/**
	 * A class representation of the BSON MaxKey type.
	 */

	function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$8(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$8(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$8(Constructor.prototype, protoProps); if (staticProps) _defineProperties$8(Constructor, staticProps); return Constructor; }

	var MaxKey =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a MaxKey type
	   *
	   * @return {MaxKey} A MaxKey instance
	   */
	  function MaxKey() {
	    _classCallCheck$8(this, MaxKey);
	  }
	  /**
	   * @ignore
	   */


	  _createClass$8(MaxKey, [{
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      return {
	        $maxKey: 1
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON() {
	      return new MaxKey();
	    }
	  }]);

	  return MaxKey;
	}();

	Object.defineProperty(MaxKey.prototype, '_bsontype', {
	  value: 'MaxKey'
	});
	var max_key = MaxKey;

	/**
	 * A class representation of the BSON DBRef type.
	 */

	function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$9(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$9(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$9(Constructor.prototype, protoProps); if (staticProps) _defineProperties$9(Constructor, staticProps); return Constructor; }

	var DBRef =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a DBRef type
	   *
	   * @param {string} collection the collection name.
	   * @param {ObjectId} oid the reference ObjectId.
	   * @param {string} [db] optional db name, if omitted the reference is local to the current db.
	   * @return {DBRef}
	   */
	  function DBRef(collection, oid, db, fields) {
	    _classCallCheck$9(this, DBRef);

	    // check if namespace has been provided
	    var parts = collection.split('.');

	    if (parts.length === 2) {
	      db = parts.shift();
	      collection = parts.shift();
	    }

	    this.collection = collection;
	    this.oid = oid;
	    this.db = db;
	    this.fields = fields || {};
	  }
	  /**
	   * @ignore
	   * @api private
	   */


	  _createClass$9(DBRef, [{
	    key: "toJSON",
	    value: function toJSON() {
	      var o = Object.assign({
	        $ref: this.collection,
	        $id: this.oid
	      }, this.fields);
	      if (this.db != null) o.$db = this.db;
	      return o;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      var o = {
	        $ref: this.collection,
	        $id: this.oid
	      };
	      if (this.db) o.$db = this.db;
	      o = Object.assign(o, this.fields);
	      return o;
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      var copy = Object.assign({}, doc);
	      ['$ref', '$id', '$db'].forEach(function (k) {
	        return delete copy[k];
	      });
	      return new DBRef(doc.$ref, doc.$id, doc.$db, copy);
	    }
	  }]);

	  return DBRef;
	}();

	Object.defineProperty(DBRef.prototype, '_bsontype', {
	  value: 'DBRef'
	}); // the 1.x parser used a "namespace" property, while 4.x uses "collection". To ensure backwards
	// compatibility, let's expose "namespace"

	Object.defineProperty(DBRef.prototype, 'namespace', {
	  get: function get() {
	    return this.collection;
	  },
	  set: function set(val) {
	    this.collection = val;
	  },
	  configurable: false
	});
	var db_ref = DBRef;

	function _classCallCheck$a(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties$a(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass$a(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$a(Constructor.prototype, protoProps); if (staticProps) _defineProperties$a(Constructor, staticProps); return Constructor; }

	var Buffer$3 = buffer.Buffer;
	/**
	 * A class representation of the BSON Binary type.
	 */

	var Binary =
	/*#__PURE__*/
	function () {
	  /**
	   * Create a Binary type
	   *
	   * Sub types
	   *  - **BSON.BSON_BINARY_SUBTYPE_DEFAULT**, default BSON type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_FUNCTION**, BSON function type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY**, BSON byte array type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_UUID**, BSON uuid type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_MD5**, BSON md5 type.
	   *  - **BSON.BSON_BINARY_SUBTYPE_USER_DEFINED**, BSON user defined type.
	   *
	   * @param {Buffer} buffer a buffer object containing the binary data.
	   * @param {Number} [subType] the option binary type.
	   * @return {Binary}
	   */
	  function Binary(buffer$$1, subType) {
	    _classCallCheck$a(this, Binary);

	    if (buffer$$1 != null && !(typeof buffer$$1 === 'string') && !Buffer$3.isBuffer(buffer$$1) && !(buffer$$1 instanceof Uint8Array) && !Array.isArray(buffer$$1)) {
	      throw new TypeError('only String, Buffer, Uint8Array or Array accepted');
	    }

	    this.sub_type = subType == null ? BSON_BINARY_SUBTYPE_DEFAULT : subType;
	    this.position = 0;

	    if (buffer$$1 != null && !(buffer$$1 instanceof Number)) {
	      // Only accept Buffer, Uint8Array or Arrays
	      if (typeof buffer$$1 === 'string') {
	        // Different ways of writing the length of the string for the different types
	        if (typeof Buffer$3 !== 'undefined') {
	          this.buffer = Buffer$3.from(buffer$$1);
	        } else if (typeof Uint8Array !== 'undefined' || Array.isArray(buffer$$1)) {
	          this.buffer = writeStringToArray(buffer$$1);
	        } else {
	          throw new TypeError('only String, Buffer, Uint8Array or Array accepted');
	        }
	      } else {
	        this.buffer = buffer$$1;
	      }

	      this.position = buffer$$1.length;
	    } else {
	      if (typeof Buffer$3 !== 'undefined') {
	        this.buffer = Buffer$3.alloc(Binary.BUFFER_SIZE);
	      } else if (typeof Uint8Array !== 'undefined') {
	        this.buffer = new Uint8Array(new ArrayBuffer(Binary.BUFFER_SIZE));
	      } else {
	        this.buffer = new Array(Binary.BUFFER_SIZE);
	      }
	    }
	  }
	  /**
	   * Updates this binary with byte_value.
	   *
	   * @method
	   * @param {string} byte_value a single byte we wish to write.
	   */


	  _createClass$a(Binary, [{
	    key: "put",
	    value: function put(byte_value) {
	      // If it's a string and a has more than one character throw an error
	      if (byte_value['length'] != null && typeof byte_value !== 'number' && byte_value.length !== 1) throw new TypeError('only accepts single character String, Uint8Array or Array');
	      if (typeof byte_value !== 'number' && byte_value < 0 || byte_value > 255) throw new TypeError('only accepts number in a valid unsigned byte range 0-255'); // Decode the byte value once

	      var decoded_byte = null;

	      if (typeof byte_value === 'string') {
	        decoded_byte = byte_value.charCodeAt(0);
	      } else if (byte_value['length'] != null) {
	        decoded_byte = byte_value[0];
	      } else {
	        decoded_byte = byte_value;
	      }

	      if (this.buffer.length > this.position) {
	        this.buffer[this.position++] = decoded_byte;
	      } else {
	        if (typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(this.buffer)) {
	          // Create additional overflow buffer
	          var buffer$$1 = Buffer$3.alloc(Binary.BUFFER_SIZE + this.buffer.length); // Combine the two buffers together

	          this.buffer.copy(buffer$$1, 0, 0, this.buffer.length);
	          this.buffer = buffer$$1;
	          this.buffer[this.position++] = decoded_byte;
	        } else {
	          var _buffer = null; // Create a new buffer (typed or normal array)

	          if (isUint8Array(this.buffer)) {
	            _buffer = new Uint8Array(new ArrayBuffer(Binary.BUFFER_SIZE + this.buffer.length));
	          } else {
	            _buffer = new Array(Binary.BUFFER_SIZE + this.buffer.length);
	          } // We need to copy all the content to the new array


	          for (var i = 0; i < this.buffer.length; i++) {
	            _buffer[i] = this.buffer[i];
	          } // Reassign the buffer


	          this.buffer = _buffer; // Write the byte

	          this.buffer[this.position++] = decoded_byte;
	        }
	      }
	    }
	    /**
	     * Writes a buffer or string to the binary.
	     *
	     * @method
	     * @param {(Buffer|string)} string a string or buffer to be written to the Binary BSON object.
	     * @param {number} offset specify the binary of where to write the content.
	     * @return {null}
	     */

	  }, {
	    key: "write",
	    value: function write(string, offset) {
	      offset = typeof offset === 'number' ? offset : this.position; // If the buffer is to small let's extend the buffer

	      if (this.buffer.length < offset + string.length) {
	        var buffer$$1 = null; // If we are in node.js

	        if (typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(this.buffer)) {
	          buffer$$1 = Buffer$3.alloc(this.buffer.length + string.length);
	          this.buffer.copy(buffer$$1, 0, 0, this.buffer.length);
	        } else if (isUint8Array(this.buffer)) {
	          // Create a new buffer
	          buffer$$1 = new Uint8Array(new ArrayBuffer(this.buffer.length + string.length)); // Copy the content

	          for (var i = 0; i < this.position; i++) {
	            buffer$$1[i] = this.buffer[i];
	          }
	        } // Assign the new buffer


	        this.buffer = buffer$$1;
	      }

	      if (typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(string) && Buffer$3.isBuffer(this.buffer)) {
	        string.copy(this.buffer, offset, 0, string.length);
	        this.position = offset + string.length > this.position ? offset + string.length : this.position; // offset = string.length
	      } else if (typeof Buffer$3 !== 'undefined' && typeof string === 'string' && Buffer$3.isBuffer(this.buffer)) {
	        this.buffer.write(string, offset, 'binary');
	        this.position = offset + string.length > this.position ? offset + string.length : this.position; // offset = string.length;
	      } else if (isUint8Array(string) || Array.isArray(string) && typeof string !== 'string') {
	        for (var _i = 0; _i < string.length; _i++) {
	          this.buffer[offset++] = string[_i];
	        }

	        this.position = offset > this.position ? offset : this.position;
	      } else if (typeof string === 'string') {
	        for (var _i2 = 0; _i2 < string.length; _i2++) {
	          this.buffer[offset++] = string.charCodeAt(_i2);
	        }

	        this.position = offset > this.position ? offset : this.position;
	      }
	    }
	    /**
	     * Reads **length** bytes starting at **position**.
	     *
	     * @method
	     * @param {number} position read from the given position in the Binary.
	     * @param {number} length the number of bytes to read.
	     * @return {Buffer}
	     */

	  }, {
	    key: "read",
	    value: function read(position, length) {
	      length = length && length > 0 ? length : this.position; // Let's return the data based on the type we have

	      if (this.buffer['slice']) {
	        return this.buffer.slice(position, position + length);
	      } // Create a buffer to keep the result


	      var buffer$$1 = typeof Uint8Array !== 'undefined' ? new Uint8Array(new ArrayBuffer(length)) : new Array(length);

	      for (var i = 0; i < length; i++) {
	        buffer$$1[i] = this.buffer[position++];
	      } // Return the buffer


	      return buffer$$1;
	    }
	    /**
	     * Returns the value of this binary as a string.
	     *
	     * @method
	     * @return {string}
	     */

	  }, {
	    key: "value",
	    value: function value(asRaw) {
	      asRaw = asRaw == null ? false : asRaw; // Optimize to serialize for the situation where the data == size of buffer

	      if (asRaw && typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(this.buffer) && this.buffer.length === this.position) return this.buffer; // If it's a node.js buffer object

	      if (typeof Buffer$3 !== 'undefined' && Buffer$3.isBuffer(this.buffer)) {
	        return asRaw ? this.buffer.slice(0, this.position) : this.buffer.toString('binary', 0, this.position);
	      } else {
	        if (asRaw) {
	          // we support the slice command use it
	          if (this.buffer['slice'] != null) {
	            return this.buffer.slice(0, this.position);
	          } else {
	            // Create a new buffer to copy content to
	            var newBuffer = isUint8Array(this.buffer) ? new Uint8Array(new ArrayBuffer(this.position)) : new Array(this.position); // Copy content

	            for (var i = 0; i < this.position; i++) {
	              newBuffer[i] = this.buffer[i];
	            } // Return the buffer


	            return newBuffer;
	          }
	        } else {
	          return convertArraytoUtf8BinaryString(this.buffer, 0, this.position);
	        }
	      }
	    }
	    /**
	     * Length.
	     *
	     * @method
	     * @return {number} the length of the binary.
	     */

	  }, {
	    key: "length",
	    value: function length() {
	      return this.position;
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      return this.buffer != null ? this.buffer.toString('base64') : '';
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toString",
	    value: function toString(format) {
	      return this.buffer != null ? this.buffer.slice(0, this.position).toString(format) : '';
	    }
	    /**
	     * @ignore
	     */

	  }, {
	    key: "toExtendedJSON",
	    value: function toExtendedJSON() {
	      var base64String = Buffer$3.isBuffer(this.buffer) ? this.buffer.toString('base64') : Buffer$3.from(this.buffer).toString('base64');
	      var subType = Number(this.sub_type).toString(16);
	      return {
	        $binary: {
	          base64: base64String,
	          subType: subType.length === 1 ? '0' + subType : subType
	        }
	      };
	    }
	    /**
	     * @ignore
	     */

	  }], [{
	    key: "fromExtendedJSON",
	    value: function fromExtendedJSON(doc) {
	      var type = doc.$binary.subType ? parseInt(doc.$binary.subType, 16) : 0;
	      var data = Buffer$3.from(doc.$binary.base64, 'base64');
	      return new Binary(data, type);
	    }
	  }]);

	  return Binary;
	}();
	/**
	 * Binary default subtype
	 * @ignore
	 */


	var BSON_BINARY_SUBTYPE_DEFAULT = 0;

	function isUint8Array(obj) {
	  return Object.prototype.toString.call(obj) === '[object Uint8Array]';
	}
	/**
	 * @ignore
	 */


	function writeStringToArray(data) {
	  // Create a buffer
	  var buffer$$1 = typeof Uint8Array !== 'undefined' ? new Uint8Array(new ArrayBuffer(data.length)) : new Array(data.length); // Write the content to the buffer

	  for (var i = 0; i < data.length; i++) {
	    buffer$$1[i] = data.charCodeAt(i);
	  } // Write the string to the buffer


	  return buffer$$1;
	}
	/**
	 * Convert Array ot Uint8Array to Binary String
	 *
	 * @ignore
	 */


	function convertArraytoUtf8BinaryString(byteArray, startIndex, endIndex) {
	  var result = '';

	  for (var i = startIndex; i < endIndex; i++) {
	    result = result + String.fromCharCode(byteArray[i]);
	  }

	  return result;
	}

	Binary.BUFFER_SIZE = 256;
	/**
	 * Default BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_DEFAULT = 0;
	/**
	 * Function BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_FUNCTION = 1;
	/**
	 * Byte Array BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_BYTE_ARRAY = 2;
	/**
	 * OLD UUID BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_UUID_OLD = 3;
	/**
	 * UUID BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_UUID = 4;
	/**
	 * MD5 BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_MD5 = 5;
	/**
	 * User BSON type
	 *
	 * @classconstant SUBTYPE_DEFAULT
	 **/

	Binary.SUBTYPE_USER_DEFINED = 128;
	Object.defineProperty(Binary.prototype, '_bsontype', {
	  value: 'Binary'
	});
	var binary = Binary;

	var constants = {
	  // BSON MAX VALUES
	  BSON_INT32_MAX: 0x7fffffff,
	  BSON_INT32_MIN: -0x80000000,
	  BSON_INT64_MAX: Math.pow(2, 63) - 1,
	  BSON_INT64_MIN: -Math.pow(2, 63),
	  // JS MAX PRECISE VALUES
	  JS_INT_MAX: 0x20000000000000,
	  // Any integer up to 2^53 can be precisely represented by a double.
	  JS_INT_MIN: -0x20000000000000,
	  // Any integer down to -2^53 can be precisely represented by a double.

	  /**
	   * Number BSON Type
	   *
	   * @classconstant BSON_DATA_NUMBER
	   **/
	  BSON_DATA_NUMBER: 1,

	  /**
	   * String BSON Type
	   *
	   * @classconstant BSON_DATA_STRING
	   **/
	  BSON_DATA_STRING: 2,

	  /**
	   * Object BSON Type
	   *
	   * @classconstant BSON_DATA_OBJECT
	   **/
	  BSON_DATA_OBJECT: 3,

	  /**
	   * Array BSON Type
	   *
	   * @classconstant BSON_DATA_ARRAY
	   **/
	  BSON_DATA_ARRAY: 4,

	  /**
	   * Binary BSON Type
	   *
	   * @classconstant BSON_DATA_BINARY
	   **/
	  BSON_DATA_BINARY: 5,

	  /**
	   * Binary BSON Type
	   *
	   * @classconstant BSON_DATA_UNDEFINED
	   **/
	  BSON_DATA_UNDEFINED: 6,

	  /**
	   * ObjectId BSON Type
	   *
	   * @classconstant BSON_DATA_OID
	   **/
	  BSON_DATA_OID: 7,

	  /**
	   * Boolean BSON Type
	   *
	   * @classconstant BSON_DATA_BOOLEAN
	   **/
	  BSON_DATA_BOOLEAN: 8,

	  /**
	   * Date BSON Type
	   *
	   * @classconstant BSON_DATA_DATE
	   **/
	  BSON_DATA_DATE: 9,

	  /**
	   * null BSON Type
	   *
	   * @classconstant BSON_DATA_NULL
	   **/
	  BSON_DATA_NULL: 10,

	  /**
	   * RegExp BSON Type
	   *
	   * @classconstant BSON_DATA_REGEXP
	   **/
	  BSON_DATA_REGEXP: 11,

	  /**
	   * Code BSON Type
	   *
	   * @classconstant BSON_DATA_DBPOINTER
	   **/
	  BSON_DATA_DBPOINTER: 12,

	  /**
	   * Code BSON Type
	   *
	   * @classconstant BSON_DATA_CODE
	   **/
	  BSON_DATA_CODE: 13,

	  /**
	   * Symbol BSON Type
	   *
	   * @classconstant BSON_DATA_SYMBOL
	   **/
	  BSON_DATA_SYMBOL: 14,

	  /**
	   * Code with Scope BSON Type
	   *
	   * @classconstant BSON_DATA_CODE_W_SCOPE
	   **/
	  BSON_DATA_CODE_W_SCOPE: 15,

	  /**
	   * 32 bit Integer BSON Type
	   *
	   * @classconstant BSON_DATA_INT
	   **/
	  BSON_DATA_INT: 16,

	  /**
	   * Timestamp BSON Type
	   *
	   * @classconstant BSON_DATA_TIMESTAMP
	   **/
	  BSON_DATA_TIMESTAMP: 17,

	  /**
	   * Long BSON Type
	   *
	   * @classconstant BSON_DATA_LONG
	   **/
	  BSON_DATA_LONG: 18,

	  /**
	   * Long BSON Type
	   *
	   * @classconstant BSON_DATA_DECIMAL128
	   **/
	  BSON_DATA_DECIMAL128: 19,

	  /**
	   * MinKey BSON Type
	   *
	   * @classconstant BSON_DATA_MIN_KEY
	   **/
	  BSON_DATA_MIN_KEY: 0xff,

	  /**
	   * MaxKey BSON Type
	   *
	   * @classconstant BSON_DATA_MAX_KEY
	   **/
	  BSON_DATA_MAX_KEY: 0x7f,

	  /**
	   * Binary Default Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_DEFAULT
	   **/
	  BSON_BINARY_SUBTYPE_DEFAULT: 0,

	  /**
	   * Binary Function Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_FUNCTION
	   **/
	  BSON_BINARY_SUBTYPE_FUNCTION: 1,

	  /**
	   * Binary Byte Array Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_BYTE_ARRAY
	   **/
	  BSON_BINARY_SUBTYPE_BYTE_ARRAY: 2,

	  /**
	   * Binary UUID Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_UUID
	   **/
	  BSON_BINARY_SUBTYPE_UUID: 3,

	  /**
	   * Binary MD5 Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_MD5
	   **/
	  BSON_BINARY_SUBTYPE_MD5: 4,

	  /**
	   * Binary User Defined Type
	   *
	   * @classconstant BSON_BINARY_SUBTYPE_USER_DEFINED
	   **/
	  BSON_BINARY_SUBTYPE_USER_DEFINED: 128
	};

	function _typeof$2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }
	// const Map = require('./map');

	/**
	 * @namespace EJSON
	 */
	// all the types where we don't need to do any special processing and can just pass the EJSON
	//straight to type.fromExtendedJSON


	var keysToCodecs = {
	  $oid: objectid,
	  $binary: binary,
	  $symbol: symbol,
	  $numberInt: int_32,
	  $numberDecimal: decimal128,
	  $numberDouble: double_1,
	  $numberLong: long_1,
	  $minKey: min_key,
	  $maxKey: max_key,
	  $regularExpression: regexp,
	  $timestamp: timestamp
	};

	function deserializeValue(self, key, value, options) {
	  if (typeof value === 'number') {
	    if (options.relaxed) {
	      return value;
	    } // if it's an integer, should interpret as smallest BSON integer
	    // that can represent it exactly. (if out of range, interpret as double.)


	    if (Math.floor(value) === value) {
	      if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX) return new int_32(value);
	      if (value >= BSON_INT64_MIN && value <= BSON_INT64_MAX) return new long_1.fromNumber(value);
	    } // If the number is a non-integer or out of integer range, should interpret as BSON Double.


	    return new double_1(value);
	  } // from here on out we're looking for bson types, so bail if its not an object


	  if (value == null || _typeof$2(value) !== 'object') return value; // upgrade deprecated undefined to null

	  if (value.$undefined) return null;
	  var keys = Object.keys(value).filter(function (k) {
	    return k.startsWith('$') && value[k] != null;
	  });

	  for (var i = 0; i < keys.length; i++) {
	    var c = keysToCodecs[keys[i]];
	    if (c) return c.fromExtendedJSON(value, options);
	  }

	  if (value.$date != null) {
	    var d = value.$date;
	    var date = new Date();
	    if (typeof d === 'string') date.setTime(Date.parse(d));else if (long_1.isLong(d)) date.setTime(d.toNumber());else if (typeof d === 'number' && options.relaxed) date.setTime(d);
	    return date;
	  }

	  if (value.$code != null) {
	    var copy = Object.assign({}, value);

	    if (value.$scope) {
	      copy.$scope = deserializeValue(self, null, value.$scope);
	    }

	    return code.fromExtendedJSON(value);
	  }

	  if (value.$ref != null || value.$dbPointer != null) {
	    var v = value.$ref ? value : value.$dbPointer; // we run into this in a "degenerate EJSON" case (with $id and $ref order flipped)
	    // because of the order JSON.parse goes through the document

	    if (v instanceof db_ref) return v;
	    var dollarKeys = Object.keys(v).filter(function (k) {
	      return k.startsWith('$');
	    });
	    var valid = true;
	    dollarKeys.forEach(function (k) {
	      if (['$ref', '$id', '$db'].indexOf(k) === -1) valid = false;
	    }); // only make DBRef if $ keys are all valid

	    if (valid) return db_ref.fromExtendedJSON(v);
	  }

	  return value;
	}
	/**
	 * Parse an Extended JSON string, constructing the JavaScript value or object described by that
	 * string.
	 *
	 * @memberof EJSON
	 * @param {string} text
	 * @param {object} [options] Optional settings
	 * @param {boolean} [options.relaxed=true] Attempt to return native JS types where possible, rather than BSON types (if true)
	 * @return {object}
	 *
	 * @example
	 * const { EJSON } = require('bson');
	 * const text = '{ "int32": { "$numberInt": "10" } }';
	 *
	 * // prints { int32: { [String: '10'] _bsontype: 'Int32', value: '10' } }
	 * console.log(EJSON.parse(text, { relaxed: false }));
	 *
	 * // prints { int32: 10 }
	 * console.log(EJSON.parse(text));
	 */


	function parse(text, options) {
	  var _this = this;

	  options = Object.assign({}, {
	    relaxed: true
	  }, options); // relaxed implies not strict

	  if (typeof options.relaxed === 'boolean') options.strict = !options.relaxed;
	  if (typeof options.strict === 'boolean') options.relaxed = !options.strict;
	  return JSON.parse(text, function (key, value) {
	    return deserializeValue(_this, key, value, options);
	  });
	} //
	// Serializer
	//
	// MAX INT32 boundaries


	var BSON_INT32_MAX = 0x7fffffff,
	    BSON_INT32_MIN = -0x80000000,
	    BSON_INT64_MAX = 0x7fffffffffffffff,
	    BSON_INT64_MIN = -0x8000000000000000;
	/**
	 * Converts a BSON document to an Extended JSON string, optionally replacing values if a replacer
	 * function is specified or optionally including only the specified properties if a replacer array
	 * is specified.
	 *
	 * @memberof EJSON
	 * @param {object} value The value to convert to extended JSON
	 * @param {function|array} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string
	 * @param {string|number} [space] A String or Number object that's used to insert white space into the output JSON string for readability purposes.
	 * @param {object} [options] Optional settings
	 * @param {boolean} [options.relaxed=true] Enabled Extended JSON's `relaxed` mode
	 * @returns {string}
	 *
	 * @example
	 * const { EJSON } = require('bson');
	 * const Int32 = require('mongodb').Int32;
	 * const doc = { int32: new Int32(10) };
	 *
	 * // prints '{"int32":{"$numberInt":"10"}}'
	 * console.log(EJSON.stringify(doc, { relaxed: false }));
	 *
	 * // prints '{"int32":10}'
	 * console.log(EJSON.stringify(doc));
	 */

	function stringify(value, replacer, space, options) {
	  if (space != null && _typeof$2(space) === 'object') {
	    options = space;
	    space = 0;
	  }

	  if (replacer != null && _typeof$2(replacer) === 'object' && !Array.isArray(replacer)) {
	    options = replacer;
	    replacer = null;
	    space = 0;
	  }

	  options = Object.assign({}, {
	    relaxed: true
	  }, options);
	  var doc = Array.isArray(value) ? serializeArray(value, options) : serializeDocument(value, options);
	  return JSON.stringify(doc, replacer, space);
	}
	/**
	 * Serializes an object to an Extended JSON string, and reparse it as a JavaScript object.
	 *
	 * @memberof EJSON
	 * @param {object} bson The object to serialize
	 * @param {object} [options] Optional settings passed to the `stringify` function
	 * @return {object}
	 */


	function serialize(bson, options) {
	  options = options || {};
	  return JSON.parse(stringify(bson, options));
	}
	/**
	 * Deserializes an Extended JSON object into a plain JavaScript object with native/BSON types
	 *
	 * @memberof EJSON
	 * @param {object} ejson The Extended JSON object to deserialize
	 * @param {object} [options] Optional settings passed to the parse method
	 * @return {object}
	 */


	function deserialize(ejson, options) {
	  options = options || {};
	  return parse(JSON.stringify(ejson), options);
	}

	function serializeArray(array, options) {
	  return array.map(function (v) {
	    return serializeValue(v, options);
	  });
	}

	function getISOString(date) {
	  var isoStr = date.toISOString(); // we should only show milliseconds in timestamp if they're non-zero

	  return date.getUTCMilliseconds() !== 0 ? isoStr : isoStr.slice(0, -5) + 'Z';
	}

	function serializeValue(value, options) {
	  if (Array.isArray(value)) return serializeArray(value, options);
	  if (value === undefined) return null;

	  if (value instanceof Date) {
	    var dateNum = value.getTime(),
	        // is it in year range 1970-9999?
	    inRange = dateNum > -1 && dateNum < 253402318800000;
	    return options.relaxed && inRange ? {
	      $date: getISOString(value)
	    } : {
	      $date: {
	        $numberLong: value.getTime().toString()
	      }
	    };
	  }

	  if (typeof value === 'number' && !options.relaxed) {
	    // it's an integer
	    if (Math.floor(value) === value) {
	      var int32Range = value >= BSON_INT32_MIN && value <= BSON_INT32_MAX,
	          int64Range = value >= BSON_INT64_MIN && value <= BSON_INT64_MAX; // interpret as being of the smallest BSON integer type that can represent the number exactly

	      if (int32Range) return {
	        $numberInt: value.toString()
	      };
	      if (int64Range) return {
	        $numberLong: value.toString()
	      };
	    }

	    return {
	      $numberDouble: value.toString()
	    };
	  }

	  if (value instanceof RegExp) {
	    var flags = value.flags;

	    if (flags === undefined) {
	      flags = value.toString().match(/[gimuy]*$/)[0];
	    }

	    var rx = new regexp(value.source, flags);
	    return rx.toExtendedJSON();
	  }

	  if (value != null && _typeof$2(value) === 'object') return serializeDocument(value, options);
	  return value;
	}

	var BSON_TYPE_MAPPINGS = {
	  Binary: function Binary(o) {
	    return new binary(o.value(), o.subtype);
	  },
	  Code: function Code(o) {
	    return new code(o.code, o.scope);
	  },
	  DBRef: function DBRef(o) {
	    return new db_ref(o.collection || o.namespace, o.oid, o.db, o.fields);
	  },
	  // "namespace" for 1.x library backwards compat
	  Decimal128: function Decimal128(o) {
	    return new decimal128(o.bytes);
	  },
	  Double: function Double(o) {
	    return new double_1(o.value);
	  },
	  Int32: function Int32(o) {
	    return new int_32(o.value);
	  },
	  Long: function Long(o) {
	    return long_1.fromBits( // underscore variants for 1.x backwards compatibility
	    o.low != null ? o.low : o.low_, o.low != null ? o.high : o.high_, o.low != null ? o.unsigned : o.unsigned_);
	  },
	  MaxKey: function MaxKey() {
	    return new max_key();
	  },
	  MinKey: function MinKey() {
	    return new min_key();
	  },
	  ObjectID: function ObjectID(o) {
	    return new objectid(o);
	  },
	  ObjectId: function ObjectId(o) {
	    return new objectid(o);
	  },
	  // support 4.0.0/4.0.1 before _bsontype was reverted back to ObjectID
	  BSONRegExp: function BSONRegExp(o) {
	    return new regexp(o.pattern, o.options);
	  },
	  Symbol: function Symbol(o) {
	    return new symbol(o.value);
	  },
	  Timestamp: function Timestamp(o) {
	    return timestamp.fromBits(o.low, o.high);
	  }
	};

	function serializeDocument(doc, options) {
	  if (doc == null || _typeof$2(doc) !== 'object') throw new Error('not an object instance');
	  var bsontype = doc._bsontype;

	  if (typeof bsontype === 'undefined') {
	    // It's a regular object. Recursively serialize its property values.
	    var _doc = {};

	    for (var name in doc) {
	      _doc[name] = serializeValue(doc[name], options);
	    }

	    return _doc;
	  } else if (typeof bsontype === 'string') {
	    // the "document" is really just a BSON type object
	    var _doc2 = doc;

	    if (typeof _doc2.toExtendedJSON !== 'function') {
	      // There's no EJSON serialization function on the object. It's probably an
	      // object created by a previous version of this library (or another library)
	      // that's duck-typing objects to look like they were generated by this library).
	      // Copy the object into this library's version of that type.
	      var mapper = BSON_TYPE_MAPPINGS[bsontype];

	      if (!mapper) {
	        throw new TypeError('Unrecognized or invalid _bsontype: ' + bsontype);
	      }

	      _doc2 = mapper(_doc2);
	    } // Two BSON types may have nested objects that may need to be serialized too


	    if (bsontype === 'Code' && _doc2.scope) {
	      _doc2 = new code(_doc2.code, serializeValue(_doc2.scope, options));
	    } else if (bsontype === 'DBRef' && _doc2.oid) {
	      _doc2 = new db_ref(_doc2.collection, serializeValue(_doc2.oid, options), _doc2.db, _doc2.fields);
	    }

	    return _doc2.toExtendedJSON(options);
	  } else {
	    throw new Error('_bsontype must be a string, but was: ' + _typeof$2(bsontype));
	  }
	}

	var extended_json = {
	  parse: parse,
	  deserialize: deserialize,
	  serialize: serialize,
	  stringify: stringify
	};

	var FIRST_BIT = 0x80;
	var FIRST_TWO_BITS = 0xc0;
	var FIRST_THREE_BITS = 0xe0;
	var FIRST_FOUR_BITS = 0xf0;
	var FIRST_FIVE_BITS = 0xf8;
	var TWO_BIT_CHAR = 0xc0;
	var THREE_BIT_CHAR = 0xe0;
	var FOUR_BIT_CHAR = 0xf0;
	var CONTINUING_CHAR = 0x80;
	/**
	 * Determines if the passed in bytes are valid utf8
	 * @param {Buffer|Uint8Array} bytes An array of 8-bit bytes. Must be indexable and have length property
	 * @param {Number} start The index to start validating
	 * @param {Number} end The index to end validating
	 * @returns {boolean} True if valid utf8
	 */

	function validateUtf8(bytes, start, end) {
	  var continuation = 0;

	  for (var i = start; i < end; i += 1) {
	    var byte = bytes[i];

	    if (continuation) {
	      if ((byte & FIRST_TWO_BITS) !== CONTINUING_CHAR) {
	        return false;
	      }

	      continuation -= 1;
	    } else if (byte & FIRST_BIT) {
	      if ((byte & FIRST_THREE_BITS) === TWO_BIT_CHAR) {
	        continuation = 1;
	      } else if ((byte & FIRST_FOUR_BITS) === THREE_BIT_CHAR) {
	        continuation = 2;
	      } else if ((byte & FIRST_FIVE_BITS) === FOUR_BIT_CHAR) {
	        continuation = 3;
	      } else {
	        return false;
	      }
	    }
	  }

	  return !continuation;
	}

	var validateUtf8_1 = validateUtf8;
	var validate_utf8 = {
	  validateUtf8: validateUtf8_1
	};

	var Buffer$4 = buffer.Buffer;
	var validateUtf8$1 = validate_utf8.validateUtf8; // Internal long versions

	var JS_INT_MAX_LONG = long_1.fromNumber(constants.JS_INT_MAX);
	var JS_INT_MIN_LONG = long_1.fromNumber(constants.JS_INT_MIN);
	var functionCache = {};

	function deserialize$1(buffer$$1, options, isArray) {
	  options = options == null ? {} : options;
	  var index = options && options.index ? options.index : 0; // Read the document size

	  var size = buffer$$1[index] | buffer$$1[index + 1] << 8 | buffer$$1[index + 2] << 16 | buffer$$1[index + 3] << 24;

	  if (size < 5) {
	    throw new Error("bson size must be >= 5, is ".concat(size));
	  }

	  if (options.allowObjectSmallerThanBufferSize && buffer$$1.length < size) {
	    throw new Error("buffer length ".concat(buffer$$1.length, " must be >= bson size ").concat(size));
	  }

	  if (!options.allowObjectSmallerThanBufferSize && buffer$$1.length !== size) {
	    throw new Error("buffer length ".concat(buffer$$1.length, " must === bson size ").concat(size));
	  }

	  if (size + index > buffer$$1.length) {
	    throw new Error("(bson size ".concat(size, " + options.index ").concat(index, " must be <= buffer length ").concat(Buffer$4.byteLength(buffer$$1), ")"));
	  } // Illegal end value


	  if (buffer$$1[index + size - 1] !== 0) {
	    throw new Error("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
	  } // Start deserializtion


	  return deserializeObject(buffer$$1, index, options, isArray);
	}

	function deserializeObject(buffer$$1, index, options, isArray) {
	  var evalFunctions = options['evalFunctions'] == null ? false : options['evalFunctions'];
	  var cacheFunctions = options['cacheFunctions'] == null ? false : options['cacheFunctions'];
	  var cacheFunctionsCrc32 = options['cacheFunctionsCrc32'] == null ? false : options['cacheFunctionsCrc32'];
	  if (!cacheFunctionsCrc32) var crc32 = null;
	  var fieldsAsRaw = options['fieldsAsRaw'] == null ? null : options['fieldsAsRaw']; // Return raw bson buffer instead of parsing it

	  var raw = options['raw'] == null ? false : options['raw']; // Return BSONRegExp objects instead of native regular expressions

	  var bsonRegExp = typeof options['bsonRegExp'] === 'boolean' ? options['bsonRegExp'] : false; // Controls the promotion of values vs wrapper classes

	  var promoteBuffers = options['promoteBuffers'] == null ? false : options['promoteBuffers'];
	  var promoteLongs = options['promoteLongs'] == null ? true : options['promoteLongs'];
	  var promoteValues = options['promoteValues'] == null ? true : options['promoteValues']; // Set the start index

	  var startIndex = index; // Validate that we have at least 4 bytes of buffer

	  if (buffer$$1.length < 5) throw new Error('corrupt bson message < 5 bytes long'); // Read the document size

	  var size = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Ensure buffer is valid size

	  if (size < 5 || size > buffer$$1.length) throw new Error('corrupt bson message'); // Create holding object

	  var object = isArray ? [] : {}; // Used for arrays to skip having to perform utf8 decoding

	  var arrayIndex = 0;
	  var done = false; // While we have more left data left keep parsing

	  while (!done) {
	    // Read the type
	    var elementType = buffer$$1[index++]; // If we get a zero it's the last byte, exit

	    if (elementType === 0) break; // Get the start search index

	    var i = index; // Locate the end of the c string

	    while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	      i++;
	    } // If are at the end of the buffer there is a problem with the document


	    if (i >= Buffer$4.byteLength(buffer$$1)) throw new Error('Bad BSON Document: illegal CString');
	    var name = isArray ? arrayIndex++ : buffer$$1.toString('utf8', index, i);
	    index = i + 1;

	    if (elementType === constants.BSON_DATA_STRING) {
	      var stringSize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	      if (stringSize <= 0 || stringSize > buffer$$1.length - index || buffer$$1[index + stringSize - 1] !== 0) throw new Error('bad string length in bson');

	      if (!validateUtf8$1(buffer$$1, index, index + stringSize - 1)) {
	        throw new Error('Invalid UTF-8 string in BSON document');
	      }

	      var s = buffer$$1.toString('utf8', index, index + stringSize - 1);
	      object[name] = s;
	      index = index + stringSize;
	    } else if (elementType === constants.BSON_DATA_OID) {
	      var oid = Buffer$4.alloc(12);
	      buffer$$1.copy(oid, 0, index, index + 12);
	      object[name] = new objectid(oid);
	      index = index + 12;
	    } else if (elementType === constants.BSON_DATA_INT && promoteValues === false) {
	      object[name] = new int_32(buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24);
	    } else if (elementType === constants.BSON_DATA_INT) {
	      object[name] = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	    } else if (elementType === constants.BSON_DATA_NUMBER && promoteValues === false) {
	      object[name] = new double_1(buffer$$1.readDoubleLE(index));
	      index = index + 8;
	    } else if (elementType === constants.BSON_DATA_NUMBER) {
	      object[name] = buffer$$1.readDoubleLE(index);
	      index = index + 8;
	    } else if (elementType === constants.BSON_DATA_DATE) {
	      var lowBits = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	      var highBits = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	      object[name] = new Date(new long_1(lowBits, highBits).toNumber());
	    } else if (elementType === constants.BSON_DATA_BOOLEAN) {
	      if (buffer$$1[index] !== 0 && buffer$$1[index] !== 1) throw new Error('illegal boolean type value');
	      object[name] = buffer$$1[index++] === 1;
	    } else if (elementType === constants.BSON_DATA_OBJECT) {
	      var _index = index;
	      var objectSize = buffer$$1[index] | buffer$$1[index + 1] << 8 | buffer$$1[index + 2] << 16 | buffer$$1[index + 3] << 24;
	      if (objectSize <= 0 || objectSize > buffer$$1.length - index) throw new Error('bad embedded document length in bson'); // We have a raw value

	      if (raw) {
	        object[name] = buffer$$1.slice(index, index + objectSize);
	      } else {
	        object[name] = deserializeObject(buffer$$1, _index, options, false);
	      }

	      index = index + objectSize;
	    } else if (elementType === constants.BSON_DATA_ARRAY) {
	      var _index2 = index;

	      var _objectSize = buffer$$1[index] | buffer$$1[index + 1] << 8 | buffer$$1[index + 2] << 16 | buffer$$1[index + 3] << 24;

	      var arrayOptions = options; // Stop index

	      var stopIndex = index + _objectSize; // All elements of array to be returned as raw bson

	      if (fieldsAsRaw && fieldsAsRaw[name]) {
	        arrayOptions = {};

	        for (var n in options) {
	          arrayOptions[n] = options[n];
	        }

	        arrayOptions['raw'] = true;
	      }

	      object[name] = deserializeObject(buffer$$1, _index2, arrayOptions, true);
	      index = index + _objectSize;
	      if (buffer$$1[index - 1] !== 0) throw new Error('invalid array terminator byte');
	      if (index !== stopIndex) throw new Error('corrupted array bson');
	    } else if (elementType === constants.BSON_DATA_UNDEFINED) {
	      object[name] = undefined;
	    } else if (elementType === constants.BSON_DATA_NULL) {
	      object[name] = null;
	    } else if (elementType === constants.BSON_DATA_LONG) {
	      // Unpack the low and high bits
	      var _lowBits = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      var _highBits = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      var long$$1 = new long_1(_lowBits, _highBits); // Promote the long if possible

	      if (promoteLongs && promoteValues === true) {
	        object[name] = long$$1.lessThanOrEqual(JS_INT_MAX_LONG) && long$$1.greaterThanOrEqual(JS_INT_MIN_LONG) ? long$$1.toNumber() : long$$1;
	      } else {
	        object[name] = long$$1;
	      }
	    } else if (elementType === constants.BSON_DATA_DECIMAL128) {
	      // Buffer to contain the decimal bytes
	      var bytes = Buffer$4.alloc(16); // Copy the next 16 bytes into the bytes buffer

	      buffer$$1.copy(bytes, 0, index, index + 16); // Update index

	      index = index + 16; // Assign the new Decimal128 value

	      var decimal128$$1 = new decimal128(bytes); // If we have an alternative mapper use that

	      object[name] = decimal128$$1.toObject ? decimal128$$1.toObject() : decimal128$$1;
	    } else if (elementType === constants.BSON_DATA_BINARY) {
	      var binarySize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	      var totalBinarySize = binarySize;
	      var subType = buffer$$1[index++]; // Did we have a negative binary size, throw

	      if (binarySize < 0) throw new Error('Negative binary type element size found'); // Is the length longer than the document

	      if (binarySize > Buffer$4.byteLength(buffer$$1)) throw new Error('Binary type size larger than document size'); // Decode as raw Buffer object if options specifies it

	      if (buffer$$1['slice'] != null) {
	        // If we have subtype 2 skip the 4 bytes for the size
	        if (subType === binary.SUBTYPE_BYTE_ARRAY) {
	          binarySize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	          if (binarySize < 0) throw new Error('Negative binary type element size found for subtype 0x02');
	          if (binarySize > totalBinarySize - 4) throw new Error('Binary type with subtype 0x02 contains to long binary size');
	          if (binarySize < totalBinarySize - 4) throw new Error('Binary type with subtype 0x02 contains to short binary size');
	        }

	        if (promoteBuffers && promoteValues) {
	          object[name] = buffer$$1.slice(index, index + binarySize);
	        } else {
	          object[name] = new binary(buffer$$1.slice(index, index + binarySize), subType);
	        }
	      } else {
	        var _buffer = typeof Uint8Array !== 'undefined' ? new Uint8Array(new ArrayBuffer(binarySize)) : new Array(binarySize); // If we have subtype 2 skip the 4 bytes for the size


	        if (subType === binary.SUBTYPE_BYTE_ARRAY) {
	          binarySize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;
	          if (binarySize < 0) throw new Error('Negative binary type element size found for subtype 0x02');
	          if (binarySize > totalBinarySize - 4) throw new Error('Binary type with subtype 0x02 contains to long binary size');
	          if (binarySize < totalBinarySize - 4) throw new Error('Binary type with subtype 0x02 contains to short binary size');
	        } // Copy the data


	        for (i = 0; i < binarySize; i++) {
	          _buffer[i] = buffer$$1[index + i];
	        }

	        if (promoteBuffers && promoteValues) {
	          object[name] = _buffer;
	        } else {
	          object[name] = new binary(_buffer, subType);
	        }
	      } // Update the index


	      index = index + binarySize;
	    } else if (elementType === constants.BSON_DATA_REGEXP && bsonRegExp === false) {
	      // Get the start search index
	      i = index; // Locate the end of the c string

	      while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	        i++;
	      } // If are at the end of the buffer there is a problem with the document


	      if (i >= buffer$$1.length) throw new Error('Bad BSON Document: illegal CString'); // Return the C string

	      var source = buffer$$1.toString('utf8', index, i); // Create the regexp

	      index = i + 1; // Get the start search index

	      i = index; // Locate the end of the c string

	      while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	        i++;
	      } // If are at the end of the buffer there is a problem with the document


	      if (i >= buffer$$1.length) throw new Error('Bad BSON Document: illegal CString'); // Return the C string

	      var regExpOptions = buffer$$1.toString('utf8', index, i);
	      index = i + 1; // For each option add the corresponding one for javascript

	      var optionsArray = new Array(regExpOptions.length); // Parse options

	      for (i = 0; i < regExpOptions.length; i++) {
	        switch (regExpOptions[i]) {
	          case 'm':
	            optionsArray[i] = 'm';
	            break;

	          case 's':
	            optionsArray[i] = 'g';
	            break;

	          case 'i':
	            optionsArray[i] = 'i';
	            break;
	        }
	      }

	      object[name] = new RegExp(source, optionsArray.join(''));
	    } else if (elementType === constants.BSON_DATA_REGEXP && bsonRegExp === true) {
	      // Get the start search index
	      i = index; // Locate the end of the c string

	      while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	        i++;
	      } // If are at the end of the buffer there is a problem with the document


	      if (i >= buffer$$1.length) throw new Error('Bad BSON Document: illegal CString'); // Return the C string

	      var _source = buffer$$1.toString('utf8', index, i);

	      index = i + 1; // Get the start search index

	      i = index; // Locate the end of the c string

	      while (buffer$$1[i] !== 0x00 && i < buffer$$1.length) {
	        i++;
	      } // If are at the end of the buffer there is a problem with the document


	      if (i >= buffer$$1.length) throw new Error('Bad BSON Document: illegal CString'); // Return the C string

	      var _regExpOptions = buffer$$1.toString('utf8', index, i);

	      index = i + 1; // Set the object

	      object[name] = new regexp(_source, _regExpOptions);
	    } else if (elementType === constants.BSON_DATA_SYMBOL) {
	      var _stringSize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      if (_stringSize <= 0 || _stringSize > buffer$$1.length - index || buffer$$1[index + _stringSize - 1] !== 0) throw new Error('bad string length in bson'); // symbol is deprecated - upgrade to string.

	      object[name] = buffer$$1.toString('utf8', index, index + _stringSize - 1);
	      index = index + _stringSize;
	    } else if (elementType === constants.BSON_DATA_TIMESTAMP) {
	      var _lowBits2 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      var _highBits2 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      object[name] = new timestamp(_lowBits2, _highBits2);
	    } else if (elementType === constants.BSON_DATA_MIN_KEY) {
	      object[name] = new min_key();
	    } else if (elementType === constants.BSON_DATA_MAX_KEY) {
	      object[name] = new max_key();
	    } else if (elementType === constants.BSON_DATA_CODE) {
	      var _stringSize2 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24;

	      if (_stringSize2 <= 0 || _stringSize2 > buffer$$1.length - index || buffer$$1[index + _stringSize2 - 1] !== 0) throw new Error('bad string length in bson');
	      var functionString = buffer$$1.toString('utf8', index, index + _stringSize2 - 1); // If we are evaluating the functions

	      if (evalFunctions) {
	        // If we have cache enabled let's look for the md5 of the function in the cache
	        if (cacheFunctions) {
	          var hash = cacheFunctionsCrc32 ? crc32(functionString) : functionString; // Got to do this to avoid V8 deoptimizing the call due to finding eval

	          object[name] = isolateEvalWithHash(functionCache, hash, functionString, object);
	        } else {
	          object[name] = isolateEval(functionString);
	        }
	      } else {
	        object[name] = new code(functionString);
	      } // Update parse index position


	      index = index + _stringSize2;
	    } else if (elementType === constants.BSON_DATA_CODE_W_SCOPE) {
	      var totalSize = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Element cannot be shorter than totalSize + stringSize + documentSize + terminator

	      if (totalSize < 4 + 4 + 4 + 1) {
	        throw new Error('code_w_scope total size shorter minimum expected length');
	      } // Get the code string size


	      var _stringSize3 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Check if we have a valid string


	      if (_stringSize3 <= 0 || _stringSize3 > buffer$$1.length - index || buffer$$1[index + _stringSize3 - 1] !== 0) throw new Error('bad string length in bson'); // Javascript function

	      var _functionString = buffer$$1.toString('utf8', index, index + _stringSize3 - 1); // Update parse index position


	      index = index + _stringSize3; // Parse the element

	      var _index3 = index; // Decode the size of the object document

	      var _objectSize2 = buffer$$1[index] | buffer$$1[index + 1] << 8 | buffer$$1[index + 2] << 16 | buffer$$1[index + 3] << 24; // Decode the scope object


	      var scopeObject = deserializeObject(buffer$$1, _index3, options, false); // Adjust the index

	      index = index + _objectSize2; // Check if field length is to short

	      if (totalSize < 4 + 4 + _objectSize2 + _stringSize3) {
	        throw new Error('code_w_scope total size is to short, truncating scope');
	      } // Check if totalSize field is to long


	      if (totalSize > 4 + 4 + _objectSize2 + _stringSize3) {
	        throw new Error('code_w_scope total size is to long, clips outer document');
	      } // If we are evaluating the functions


	      if (evalFunctions) {
	        // If we have cache enabled let's look for the md5 of the function in the cache
	        if (cacheFunctions) {
	          var _hash = cacheFunctionsCrc32 ? crc32(_functionString) : _functionString; // Got to do this to avoid V8 deoptimizing the call due to finding eval


	          object[name] = isolateEvalWithHash(functionCache, _hash, _functionString, object);
	        } else {
	          object[name] = isolateEval(_functionString);
	        }

	        object[name].scope = scopeObject;
	      } else {
	        object[name] = new code(_functionString, scopeObject);
	      }
	    } else if (elementType === constants.BSON_DATA_DBPOINTER) {
	      // Get the code string size
	      var _stringSize4 = buffer$$1[index++] | buffer$$1[index++] << 8 | buffer$$1[index++] << 16 | buffer$$1[index++] << 24; // Check if we have a valid string


	      if (_stringSize4 <= 0 || _stringSize4 > buffer$$1.length - index || buffer$$1[index + _stringSize4 - 1] !== 0) throw new Error('bad string length in bson'); // Namespace

	      if (!validateUtf8$1(buffer$$1, index, index + _stringSize4 - 1)) {
	        throw new Error('Invalid UTF-8 string in BSON document');
	      }

	      var namespace = buffer$$1.toString('utf8', index, index + _stringSize4 - 1); // Update parse index position

	      index = index + _stringSize4; // Read the oid

	      var oidBuffer = Buffer$4.alloc(12);
	      buffer$$1.copy(oidBuffer, 0, index, index + 12);

	      var _oid = new objectid(oidBuffer); // Update the index


	      index = index + 12; // Upgrade to DBRef type

	      object[name] = new db_ref(namespace, _oid);
	    } else {
	      throw new Error('Detected unknown BSON type ' + elementType.toString(16) + ' for fieldname "' + name + '", are you using the latest BSON parser?');
	    }
	  } // Check if the deserialization was against a valid array/object


	  if (size !== index - startIndex) {
	    if (isArray) throw new Error('corrupt array bson');
	    throw new Error('corrupt object bson');
	  } // check if object's $ keys are those of a DBRef


	  var dollarKeys = Object.keys(object).filter(function (k) {
	    return k.startsWith('$');
	  });
	  var valid = true;
	  dollarKeys.forEach(function (k) {
	    if (['$ref', '$id', '$db'].indexOf(k) === -1) valid = false;
	  }); // if a $key not in "$ref", "$id", "$db", don't make a DBRef

	  if (!valid) return object;

	  if (object['$id'] != null && object['$ref'] != null) {
	    var copy = Object.assign({}, object);
	    delete copy.$ref;
	    delete copy.$id;
	    delete copy.$db;
	    return new db_ref(object.$ref, object.$id, object.$db || null, copy);
	  }

	  return object;
	}
	/**
	 * Ensure eval is isolated.
	 *
	 * @ignore
	 * @api private
	 */


	function isolateEvalWithHash(functionCache, hash, functionString, object) {
	  // Contains the value we are going to set
	  var value = null; // Check for cache hit, eval if missing and return cached function

	  if (functionCache[hash] == null) {
	    eval('value = ' + functionString);
	    functionCache[hash] = value;
	  } // Set the object


	  return functionCache[hash].bind(object);
	}
	/**
	 * Ensure eval is isolated.
	 *
	 * @ignore
	 * @api private
	 */


	function isolateEval(functionString) {
	  // Contains the value we are going to set
	  var value = null; // Eval the function

	  eval('value = ' + functionString);
	  return value;
	}

	var deserializer = deserialize$1;

	// All rights reserved.
	//
	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions are met:
	//
	//  * Redistributions of source code must retain the above copyright notice,
	//    this list of conditions and the following disclaimer.
	//
	//  * Redistributions in binary form must reproduce the above copyright notice,
	//    this list of conditions and the following disclaimer in the documentation
	//    and/or other materials provided with the distribution.
	//
	//  * Neither the name of Fair Oaks Labs, Inc. nor the names of its contributors
	//    may be used to endorse or promote products derived from this software
	//    without specific prior written permission.
	//
	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	// ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
	// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
	// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
	// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	// POSSIBILITY OF SUCH DAMAGE.
	//
	//
	// Modifications to writeIEEE754 to support negative zeroes made by Brian White

	function readIEEE754(buffer$$1, offset, endian, mLen, nBytes) {
	  var e,
	      m,
	      bBE = endian === 'big',
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = -7,
	      i = bBE ? 0 : nBytes - 1,
	      d = bBE ? 1 : -1,
	      s = buffer$$1[offset + i];
	  i += d;
	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;

	  for (; nBits > 0; e = e * 256 + buffer$$1[offset + i], i += d, nBits -= 8) {
	  }

	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;

	  for (; nBits > 0; m = m * 256 + buffer$$1[offset + i], i += d, nBits -= 8) {
	  }

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }

	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	}

	function writeIEEE754(buffer$$1, value, offset, endian, mLen, nBytes) {
	  var e,
	      m,
	      c,
	      bBE = endian === 'big',
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
	      i = bBE ? nBytes - 1 : 0,
	      d = bBE ? -1 : 1,
	      s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);

	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }

	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }

	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  if (isNaN(value)) m = 0;

	  while (mLen >= 8) {
	    buffer$$1[offset + i] = m & 0xff;
	    i += d;
	    m /= 256;
	    mLen -= 8;
	  }

	  e = e << mLen | m;
	  if (isNaN(value)) e += 8;
	  eLen += mLen;

	  while (eLen > 0) {
	    buffer$$1[offset + i] = e & 0xff;
	    i += d;
	    e /= 256;
	    eLen -= 8;
	  }

	  buffer$$1[offset + i - d] |= s * 128;
	}

	var float_parser = {
	  readIEEE754: readIEEE754,
	  writeIEEE754: writeIEEE754
	};

	function _typeof$3(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }

	var Buffer$5 = buffer.Buffer;
	var writeIEEE754$1 = float_parser.writeIEEE754;
	var normalizedFunctionString$1 = utils.normalizedFunctionString;
	var regexp$1 = /\x00/; // eslint-disable-line no-control-regex

	var ignoreKeys = new Set(['$db', '$ref', '$id', '$clusterTime']); // To ensure that 0.4 of node works correctly

	var isDate$1 = function isDate(d) {
	  return _typeof$3(d) === 'object' && Object.prototype.toString.call(d) === '[object Date]';
	};

	var isRegExp$1 = function isRegExp(d) {
	  return Object.prototype.toString.call(d) === '[object RegExp]';
	};

	function serializeString(buffer$$1, key, value, index, isArray) {
	  // Encode String type
	  buffer$$1[index++] = constants.BSON_DATA_STRING; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes + 1;
	  buffer$$1[index - 1] = 0; // Write the string

	  var size = buffer$$1.write(value, index + 4, 'utf8'); // Write the size of the string to buffer

	  buffer$$1[index + 3] = size + 1 >> 24 & 0xff;
	  buffer$$1[index + 2] = size + 1 >> 16 & 0xff;
	  buffer$$1[index + 1] = size + 1 >> 8 & 0xff;
	  buffer$$1[index] = size + 1 & 0xff; // Update index

	  index = index + 4 + size; // Write zero

	  buffer$$1[index++] = 0;
	  return index;
	}

	function serializeNumber(buffer$$1, key, value, index, isArray) {
	  // We have an integer value
	  if (Math.floor(value) === value && value >= constants.JS_INT_MIN && value <= constants.JS_INT_MAX) {
	    // If the value fits in 32 bits encode as int, if it fits in a double
	    // encode it as a double, otherwise long
	    if (value >= constants.BSON_INT32_MIN && value <= constants.BSON_INT32_MAX) {
	      // Set int type 32 bits or less
	      buffer$$1[index++] = constants.BSON_DATA_INT; // Number of written bytes

	      var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	      index = index + numberOfWrittenBytes;
	      buffer$$1[index++] = 0; // Write the int value

	      buffer$$1[index++] = value & 0xff;
	      buffer$$1[index++] = value >> 8 & 0xff;
	      buffer$$1[index++] = value >> 16 & 0xff;
	      buffer$$1[index++] = value >> 24 & 0xff;
	    } else if (value >= constants.JS_INT_MIN && value <= constants.JS_INT_MAX) {
	      // Encode as double
	      buffer$$1[index++] = constants.BSON_DATA_NUMBER; // Number of written bytes

	      var _numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name


	      index = index + _numberOfWrittenBytes;
	      buffer$$1[index++] = 0; // Write float

	      writeIEEE754$1(buffer$$1, value, index, 'little', 52, 8); // Ajust index

	      index = index + 8;
	    } else {
	      // Set long type
	      buffer$$1[index++] = constants.BSON_DATA_LONG; // Number of written bytes

	      var _numberOfWrittenBytes2 = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name


	      index = index + _numberOfWrittenBytes2;
	      buffer$$1[index++] = 0;
	      var longVal = long_1.fromNumber(value);
	      var lowBits = longVal.getLowBits();
	      var highBits = longVal.getHighBits(); // Encode low bits

	      buffer$$1[index++] = lowBits & 0xff;
	      buffer$$1[index++] = lowBits >> 8 & 0xff;
	      buffer$$1[index++] = lowBits >> 16 & 0xff;
	      buffer$$1[index++] = lowBits >> 24 & 0xff; // Encode high bits

	      buffer$$1[index++] = highBits & 0xff;
	      buffer$$1[index++] = highBits >> 8 & 0xff;
	      buffer$$1[index++] = highBits >> 16 & 0xff;
	      buffer$$1[index++] = highBits >> 24 & 0xff;
	    }
	  } else {
	    // Encode as double
	    buffer$$1[index++] = constants.BSON_DATA_NUMBER; // Number of written bytes

	    var _numberOfWrittenBytes3 = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name


	    index = index + _numberOfWrittenBytes3;
	    buffer$$1[index++] = 0; // Write float

	    writeIEEE754$1(buffer$$1, value, index, 'little', 52, 8); // Ajust index

	    index = index + 8;
	  }

	  return index;
	}

	function serializeNull(buffer$$1, key, value, index, isArray) {
	  // Set long type
	  buffer$$1[index++] = constants.BSON_DATA_NULL; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;
	  return index;
	}

	function serializeBoolean(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_BOOLEAN; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Encode the boolean value

	  buffer$$1[index++] = value ? 1 : 0;
	  return index;
	}

	function serializeDate(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_DATE; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the date

	  var dateInMilis = long_1.fromNumber(value.getTime());
	  var lowBits = dateInMilis.getLowBits();
	  var highBits = dateInMilis.getHighBits(); // Encode low bits

	  buffer$$1[index++] = lowBits & 0xff;
	  buffer$$1[index++] = lowBits >> 8 & 0xff;
	  buffer$$1[index++] = lowBits >> 16 & 0xff;
	  buffer$$1[index++] = lowBits >> 24 & 0xff; // Encode high bits

	  buffer$$1[index++] = highBits & 0xff;
	  buffer$$1[index++] = highBits >> 8 & 0xff;
	  buffer$$1[index++] = highBits >> 16 & 0xff;
	  buffer$$1[index++] = highBits >> 24 & 0xff;
	  return index;
	}

	function serializeRegExp(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_REGEXP; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;

	  if (value.source && value.source.match(regexp$1) != null) {
	    throw Error('value ' + value.source + ' must not contain null bytes');
	  } // Adjust the index


	  index = index + buffer$$1.write(value.source, index, 'utf8'); // Write zero

	  buffer$$1[index++] = 0x00; // Write the parameters

	  if (value.ignoreCase) buffer$$1[index++] = 0x69; // i

	  if (value.global) buffer$$1[index++] = 0x73; // s

	  if (value.multiline) buffer$$1[index++] = 0x6d; // m
	  // Add ending zero

	  buffer$$1[index++] = 0x00;
	  return index;
	}

	function serializeBSONRegExp(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_REGEXP; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Check the pattern for 0 bytes

	  if (value.pattern.match(regexp$1) != null) {
	    // The BSON spec doesn't allow keys with null bytes because keys are
	    // null-terminated.
	    throw Error('pattern ' + value.pattern + ' must not contain null bytes');
	  } // Adjust the index


	  index = index + buffer$$1.write(value.pattern, index, 'utf8'); // Write zero

	  buffer$$1[index++] = 0x00; // Write the options

	  index = index + buffer$$1.write(value.options.split('').sort().join(''), index, 'utf8'); // Add ending zero

	  buffer$$1[index++] = 0x00;
	  return index;
	}

	function serializeMinMax(buffer$$1, key, value, index, isArray) {
	  // Write the type of either min or max key
	  if (value === null) {
	    buffer$$1[index++] = constants.BSON_DATA_NULL;
	  } else if (value._bsontype === 'MinKey') {
	    buffer$$1[index++] = constants.BSON_DATA_MIN_KEY;
	  } else {
	    buffer$$1[index++] = constants.BSON_DATA_MAX_KEY;
	  } // Number of written bytes


	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;
	  return index;
	}

	function serializeObjectId(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_OID; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the objectId into the shared buffer

	  if (typeof value.id === 'string') {
	    buffer$$1.write(value.id, index, 'binary');
	  } else if (value.id && value.id.copy) {
	    value.id.copy(buffer$$1, index, 0, 12);
	  } else {
	    throw new TypeError('object [' + JSON.stringify(value) + '] is not a valid ObjectId');
	  } // Ajust index


	  return index + 12;
	}

	function serializeBuffer(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_BINARY; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Get size of the buffer (current write point)

	  var size = value.length; // Write the size of the string to buffer

	  buffer$$1[index++] = size & 0xff;
	  buffer$$1[index++] = size >> 8 & 0xff;
	  buffer$$1[index++] = size >> 16 & 0xff;
	  buffer$$1[index++] = size >> 24 & 0xff; // Write the default subtype

	  buffer$$1[index++] = constants.BSON_BINARY_SUBTYPE_DEFAULT; // Copy the content form the binary field to the buffer

	  value.copy(buffer$$1, index, 0, size); // Adjust the index

	  index = index + size;
	  return index;
	}

	function serializeObject(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, isArray, path) {
	  for (var i = 0; i < path.length; i++) {
	    if (path[i] === value) throw new Error('cyclic dependency detected');
	  } // Push value to stack


	  path.push(value); // Write the type

	  buffer$$1[index++] = Array.isArray(value) ? constants.BSON_DATA_ARRAY : constants.BSON_DATA_OBJECT; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;
	  var endIndex = serializeInto(buffer$$1, value, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined, path); // Pop stack

	  path.pop();
	  return endIndex;
	}

	function serializeDecimal128(buffer$$1, key, value, index, isArray) {
	  buffer$$1[index++] = constants.BSON_DATA_DECIMAL128; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the data from the value

	  value.bytes.copy(buffer$$1, index, 0, 16);
	  return index + 16;
	}

	function serializeLong(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = value._bsontype === 'Long' ? constants.BSON_DATA_LONG : constants.BSON_DATA_TIMESTAMP; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the date

	  var lowBits = value.getLowBits();
	  var highBits = value.getHighBits(); // Encode low bits

	  buffer$$1[index++] = lowBits & 0xff;
	  buffer$$1[index++] = lowBits >> 8 & 0xff;
	  buffer$$1[index++] = lowBits >> 16 & 0xff;
	  buffer$$1[index++] = lowBits >> 24 & 0xff; // Encode high bits

	  buffer$$1[index++] = highBits & 0xff;
	  buffer$$1[index++] = highBits >> 8 & 0xff;
	  buffer$$1[index++] = highBits >> 16 & 0xff;
	  buffer$$1[index++] = highBits >> 24 & 0xff;
	  return index;
	}

	function serializeInt32(buffer$$1, key, value, index, isArray) {
	  // Set int type 32 bits or less
	  buffer$$1[index++] = constants.BSON_DATA_INT; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the int value

	  buffer$$1[index++] = value & 0xff;
	  buffer$$1[index++] = value >> 8 & 0xff;
	  buffer$$1[index++] = value >> 16 & 0xff;
	  buffer$$1[index++] = value >> 24 & 0xff;
	  return index;
	}

	function serializeDouble(buffer$$1, key, value, index, isArray) {
	  // Encode as double
	  buffer$$1[index++] = constants.BSON_DATA_NUMBER; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write float

	  writeIEEE754$1(buffer$$1, value.value, index, 'little', 52, 8); // Adjust index

	  index = index + 8;
	  return index;
	}

	function serializeFunction(buffer$$1, key, value, index, checkKeys, depth, isArray) {
	  buffer$$1[index++] = constants.BSON_DATA_CODE; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Function string

	  var functionString = normalizedFunctionString$1(value); // Write the string

	  var size = buffer$$1.write(functionString, index + 4, 'utf8') + 1; // Write the size of the string to buffer

	  buffer$$1[index] = size & 0xff;
	  buffer$$1[index + 1] = size >> 8 & 0xff;
	  buffer$$1[index + 2] = size >> 16 & 0xff;
	  buffer$$1[index + 3] = size >> 24 & 0xff; // Update index

	  index = index + 4 + size - 1; // Write zero

	  buffer$$1[index++] = 0;
	  return index;
	}

	function serializeCode(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, isArray) {
	  if (value.scope && _typeof$3(value.scope) === 'object') {
	    // Write the type
	    buffer$$1[index++] = constants.BSON_DATA_CODE_W_SCOPE; // Number of written bytes

	    var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	    index = index + numberOfWrittenBytes;
	    buffer$$1[index++] = 0; // Starting index

	    var startIndex = index; // Serialize the function
	    // Get the function string

	    var functionString = typeof value.code === 'string' ? value.code : value.code.toString(); // Index adjustment

	    index = index + 4; // Write string into buffer

	    var codeSize = buffer$$1.write(functionString, index + 4, 'utf8') + 1; // Write the size of the string to buffer

	    buffer$$1[index] = codeSize & 0xff;
	    buffer$$1[index + 1] = codeSize >> 8 & 0xff;
	    buffer$$1[index + 2] = codeSize >> 16 & 0xff;
	    buffer$$1[index + 3] = codeSize >> 24 & 0xff; // Write end 0

	    buffer$$1[index + 4 + codeSize - 1] = 0; // Write the

	    index = index + codeSize + 4; //
	    // Serialize the scope value

	    var endIndex = serializeInto(buffer$$1, value.scope, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined);
	    index = endIndex - 1; // Writ the total

	    var totalSize = endIndex - startIndex; // Write the total size of the object

	    buffer$$1[startIndex++] = totalSize & 0xff;
	    buffer$$1[startIndex++] = totalSize >> 8 & 0xff;
	    buffer$$1[startIndex++] = totalSize >> 16 & 0xff;
	    buffer$$1[startIndex++] = totalSize >> 24 & 0xff; // Write trailing zero

	    buffer$$1[index++] = 0;
	  } else {
	    buffer$$1[index++] = constants.BSON_DATA_CODE; // Number of written bytes

	    var _numberOfWrittenBytes4 = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name


	    index = index + _numberOfWrittenBytes4;
	    buffer$$1[index++] = 0; // Function string

	    var _functionString = value.code.toString(); // Write the string


	    var size = buffer$$1.write(_functionString, index + 4, 'utf8') + 1; // Write the size of the string to buffer

	    buffer$$1[index] = size & 0xff;
	    buffer$$1[index + 1] = size >> 8 & 0xff;
	    buffer$$1[index + 2] = size >> 16 & 0xff;
	    buffer$$1[index + 3] = size >> 24 & 0xff; // Update index

	    index = index + 4 + size - 1; // Write zero

	    buffer$$1[index++] = 0;
	  }

	  return index;
	}

	function serializeBinary(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_BINARY; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Extract the buffer

	  var data = value.value(true); // Calculate size

	  var size = value.position; // Add the deprecated 02 type 4 bytes of size to total

	  if (value.sub_type === binary.SUBTYPE_BYTE_ARRAY) size = size + 4; // Write the size of the string to buffer

	  buffer$$1[index++] = size & 0xff;
	  buffer$$1[index++] = size >> 8 & 0xff;
	  buffer$$1[index++] = size >> 16 & 0xff;
	  buffer$$1[index++] = size >> 24 & 0xff; // Write the subtype to the buffer

	  buffer$$1[index++] = value.sub_type; // If we have binary type 2 the 4 first bytes are the size

	  if (value.sub_type === binary.SUBTYPE_BYTE_ARRAY) {
	    size = size - 4;
	    buffer$$1[index++] = size & 0xff;
	    buffer$$1[index++] = size >> 8 & 0xff;
	    buffer$$1[index++] = size >> 16 & 0xff;
	    buffer$$1[index++] = size >> 24 & 0xff;
	  } // Write the data to the object


	  data.copy(buffer$$1, index, 0, value.position); // Adjust the index

	  index = index + value.position;
	  return index;
	}

	function serializeSymbol(buffer$$1, key, value, index, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_SYMBOL; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0; // Write the string

	  var size = buffer$$1.write(value.value, index + 4, 'utf8') + 1; // Write the size of the string to buffer

	  buffer$$1[index] = size & 0xff;
	  buffer$$1[index + 1] = size >> 8 & 0xff;
	  buffer$$1[index + 2] = size >> 16 & 0xff;
	  buffer$$1[index + 3] = size >> 24 & 0xff; // Update index

	  index = index + 4 + size - 1; // Write zero

	  buffer$$1[index++] = 0x00;
	  return index;
	}

	function serializeDBRef(buffer$$1, key, value, index, depth, serializeFunctions, isArray) {
	  // Write the type
	  buffer$$1[index++] = constants.BSON_DATA_OBJECT; // Number of written bytes

	  var numberOfWrittenBytes = !isArray ? buffer$$1.write(key, index, 'utf8') : buffer$$1.write(key, index, 'ascii'); // Encode the name

	  index = index + numberOfWrittenBytes;
	  buffer$$1[index++] = 0;
	  var startIndex = index;
	  var endIndex;
	  var output = {
	    $ref: value.collection || value.namespace,
	    // "namespace" was what library 1.x called "collection"
	    $id: value.oid
	  };
	  if (value.db != null) output.$db = value.db;
	  output = Object.assign(output, value.fields);
	  endIndex = serializeInto(buffer$$1, output, false, index, depth + 1, serializeFunctions); // Calculate object size

	  var size = endIndex - startIndex; // Write the size

	  buffer$$1[startIndex++] = size & 0xff;
	  buffer$$1[startIndex++] = size >> 8 & 0xff;
	  buffer$$1[startIndex++] = size >> 16 & 0xff;
	  buffer$$1[startIndex++] = size >> 24 & 0xff; // Set index

	  return endIndex;
	}

	function serializeInto(buffer$$1, object, checkKeys, startingIndex, depth, serializeFunctions, ignoreUndefined, path) {
	  startingIndex = startingIndex || 0;
	  path = path || []; // Push the object to the path

	  path.push(object); // Start place to serialize into

	  var index = startingIndex + 4; // Special case isArray

	  if (Array.isArray(object)) {
	    // Get object keys
	    for (var i = 0; i < object.length; i++) {
	      var key = '' + i;
	      var value = object[i]; // Is there an override value

	      if (value && value.toBSON) {
	        if (typeof value.toBSON !== 'function') throw new TypeError('toBSON is not a function');
	        value = value.toBSON();
	      }

	      var type = _typeof$3(value);

	      if (type === 'string') {
	        index = serializeString(buffer$$1, key, value, index, true);
	      } else if (type === 'number') {
	        index = serializeNumber(buffer$$1, key, value, index, true);
	      } else if (type === 'boolean') {
	        index = serializeBoolean(buffer$$1, key, value, index, true);
	      } else if (value instanceof Date || isDate$1(value)) {
	        index = serializeDate(buffer$$1, key, value, index, true);
	      } else if (value === undefined) {
	        index = serializeNull(buffer$$1, key, value, index, true);
	      } else if (value === null) {
	        index = serializeNull(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'ObjectId' || value['_bsontype'] === 'ObjectID') {
	        index = serializeObjectId(buffer$$1, key, value, index, true);
	      } else if (Buffer$5.isBuffer(value)) {
	        index = serializeBuffer(buffer$$1, key, value, index, true);
	      } else if (value instanceof RegExp || isRegExp$1(value)) {
	        index = serializeRegExp(buffer$$1, key, value, index, true);
	      } else if (type === 'object' && value['_bsontype'] == null) {
	        index = serializeObject(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true, path);
	      } else if (type === 'object' && value['_bsontype'] === 'Decimal128') {
	        index = serializeDecimal128(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'Long' || value['_bsontype'] === 'Timestamp') {
	        index = serializeLong(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'Double') {
	        index = serializeDouble(buffer$$1, key, value, index, true);
	      } else if (typeof value === 'function' && serializeFunctions) {
	        index = serializeFunction(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, true);
	      } else if (value['_bsontype'] === 'Code') {
	        index = serializeCode(buffer$$1, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true);
	      } else if (value['_bsontype'] === 'Binary') {
	        index = serializeBinary(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'Symbol') {
	        index = serializeSymbol(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'DBRef') {
	        index = serializeDBRef(buffer$$1, key, value, index, depth, serializeFunctions, true);
	      } else if (value['_bsontype'] === 'BSONRegExp') {
	        index = serializeBSONRegExp(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'Int32') {
	        index = serializeInt32(buffer$$1, key, value, index, true);
	      } else if (value['_bsontype'] === 'MinKey' || value['_bsontype'] === 'MaxKey') {
	        index = serializeMinMax(buffer$$1, key, value, index, true);
	      } else if (typeof value['_bsontype'] !== 'undefined') {
	        throw new TypeError('Unrecognized or invalid _bsontype: ' + value['_bsontype']);
	      }
	    }
	  } else if (object instanceof map) {
	    var iterator = object.entries();
	    var done = false;

	    while (!done) {
	      // Unpack the next entry
	      var entry = iterator.next();
	      done = entry.done; // Are we done, then skip and terminate

	      if (done) continue; // Get the entry values

	      var _key = entry.value[0];
	      var _value = entry.value[1]; // Check the type of the value

	      var _type = _typeof$3(_value); // Check the key and throw error if it's illegal


	      if (typeof _key === 'string' && !ignoreKeys.has(_key)) {
	        if (_key.match(regexp$1) != null) {
	          // The BSON spec doesn't allow keys with null bytes because keys are
	          // null-terminated.
	          throw Error('key ' + _key + ' must not contain null bytes');
	        }

	        if (checkKeys) {
	          if ('$' === _key[0]) {
	            throw Error('key ' + _key + " must not start with '$'");
	          } else if (~_key.indexOf('.')) {
	            throw Error('key ' + _key + " must not contain '.'");
	          }
	        }
	      }

	      if (_type === 'string') {
	        index = serializeString(buffer$$1, _key, _value, index);
	      } else if (_type === 'number') {
	        index = serializeNumber(buffer$$1, _key, _value, index);
	      } else if (_type === 'boolean') {
	        index = serializeBoolean(buffer$$1, _key, _value, index);
	      } else if (_value instanceof Date || isDate$1(_value)) {
	        index = serializeDate(buffer$$1, _key, _value, index);
	      } else if (_value === null || _value === undefined && ignoreUndefined === false) {
	        index = serializeNull(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'ObjectId' || _value['_bsontype'] === 'ObjectID') {
	        index = serializeObjectId(buffer$$1, _key, _value, index);
	      } else if (Buffer$5.isBuffer(_value)) {
	        index = serializeBuffer(buffer$$1, _key, _value, index);
	      } else if (_value instanceof RegExp || isRegExp$1(_value)) {
	        index = serializeRegExp(buffer$$1, _key, _value, index);
	      } else if (_type === 'object' && _value['_bsontype'] == null) {
	        index = serializeObject(buffer$$1, _key, _value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
	      } else if (_type === 'object' && _value['_bsontype'] === 'Decimal128') {
	        index = serializeDecimal128(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Long' || _value['_bsontype'] === 'Timestamp') {
	        index = serializeLong(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Double') {
	        index = serializeDouble(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Code') {
	        index = serializeCode(buffer$$1, _key, _value, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
	      } else if (typeof _value === 'function' && serializeFunctions) {
	        index = serializeFunction(buffer$$1, _key, _value, index, checkKeys, depth, serializeFunctions);
	      } else if (_value['_bsontype'] === 'Binary') {
	        index = serializeBinary(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Symbol') {
	        index = serializeSymbol(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'DBRef') {
	        index = serializeDBRef(buffer$$1, _key, _value, index, depth, serializeFunctions);
	      } else if (_value['_bsontype'] === 'BSONRegExp') {
	        index = serializeBSONRegExp(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'Int32') {
	        index = serializeInt32(buffer$$1, _key, _value, index);
	      } else if (_value['_bsontype'] === 'MinKey' || _value['_bsontype'] === 'MaxKey') {
	        index = serializeMinMax(buffer$$1, _key, _value, index);
	      } else if (typeof _value['_bsontype'] !== 'undefined') {
	        throw new TypeError('Unrecognized or invalid _bsontype: ' + _value['_bsontype']);
	      }
	    }
	  } else {
	    // Did we provide a custom serialization method
	    if (object.toBSON) {
	      if (typeof object.toBSON !== 'function') throw new TypeError('toBSON is not a function');
	      object = object.toBSON();
	      if (object != null && _typeof$3(object) !== 'object') throw new TypeError('toBSON function did not return an object');
	    } // Iterate over all the keys


	    for (var _key2 in object) {
	      var _value2 = object[_key2]; // Is there an override value

	      if (_value2 && _value2.toBSON) {
	        if (typeof _value2.toBSON !== 'function') throw new TypeError('toBSON is not a function');
	        _value2 = _value2.toBSON();
	      } // Check the type of the value


	      var _type2 = _typeof$3(_value2); // Check the key and throw error if it's illegal


	      if (typeof _key2 === 'string' && !ignoreKeys.has(_key2)) {
	        if (_key2.match(regexp$1) != null) {
	          // The BSON spec doesn't allow keys with null bytes because keys are
	          // null-terminated.
	          throw Error('key ' + _key2 + ' must not contain null bytes');
	        }

	        if (checkKeys) {
	          if ('$' === _key2[0]) {
	            throw Error('key ' + _key2 + " must not start with '$'");
	          } else if (~_key2.indexOf('.')) {
	            throw Error('key ' + _key2 + " must not contain '.'");
	          }
	        }
	      }

	      if (_type2 === 'string') {
	        index = serializeString(buffer$$1, _key2, _value2, index);
	      } else if (_type2 === 'number') {
	        index = serializeNumber(buffer$$1, _key2, _value2, index);
	      } else if (_type2 === 'boolean') {
	        index = serializeBoolean(buffer$$1, _key2, _value2, index);
	      } else if (_value2 instanceof Date || isDate$1(_value2)) {
	        index = serializeDate(buffer$$1, _key2, _value2, index);
	      } else if (_value2 === undefined) {
	        if (ignoreUndefined === false) index = serializeNull(buffer$$1, _key2, _value2, index);
	      } else if (_value2 === null) {
	        index = serializeNull(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'ObjectId' || _value2['_bsontype'] === 'ObjectID') {
	        index = serializeObjectId(buffer$$1, _key2, _value2, index);
	      } else if (Buffer$5.isBuffer(_value2)) {
	        index = serializeBuffer(buffer$$1, _key2, _value2, index);
	      } else if (_value2 instanceof RegExp || isRegExp$1(_value2)) {
	        index = serializeRegExp(buffer$$1, _key2, _value2, index);
	      } else if (_type2 === 'object' && _value2['_bsontype'] == null) {
	        index = serializeObject(buffer$$1, _key2, _value2, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
	      } else if (_type2 === 'object' && _value2['_bsontype'] === 'Decimal128') {
	        index = serializeDecimal128(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Long' || _value2['_bsontype'] === 'Timestamp') {
	        index = serializeLong(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Double') {
	        index = serializeDouble(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Code') {
	        index = serializeCode(buffer$$1, _key2, _value2, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
	      } else if (typeof _value2 === 'function' && serializeFunctions) {
	        index = serializeFunction(buffer$$1, _key2, _value2, index, checkKeys, depth, serializeFunctions);
	      } else if (_value2['_bsontype'] === 'Binary') {
	        index = serializeBinary(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Symbol') {
	        index = serializeSymbol(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'DBRef') {
	        index = serializeDBRef(buffer$$1, _key2, _value2, index, depth, serializeFunctions);
	      } else if (_value2['_bsontype'] === 'BSONRegExp') {
	        index = serializeBSONRegExp(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'Int32') {
	        index = serializeInt32(buffer$$1, _key2, _value2, index);
	      } else if (_value2['_bsontype'] === 'MinKey' || _value2['_bsontype'] === 'MaxKey') {
	        index = serializeMinMax(buffer$$1, _key2, _value2, index);
	      } else if (typeof _value2['_bsontype'] !== 'undefined') {
	        throw new TypeError('Unrecognized or invalid _bsontype: ' + _value2['_bsontype']);
	      }
	    }
	  } // Remove the path


	  path.pop(); // Final padding byte for object

	  buffer$$1[index++] = 0x00; // Final size

	  var size = index - startingIndex; // Write the size of the object

	  buffer$$1[startingIndex++] = size & 0xff;
	  buffer$$1[startingIndex++] = size >> 8 & 0xff;
	  buffer$$1[startingIndex++] = size >> 16 & 0xff;
	  buffer$$1[startingIndex++] = size >> 24 & 0xff;
	  return index;
	}

	var serializer = serializeInto;

	function _typeof$4(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }

	var Buffer$6 = buffer.Buffer;
	var normalizedFunctionString$2 = utils.normalizedFunctionString; // To ensure that 0.4 of node works correctly

	function isDate$2(d) {
	  return _typeof$4(d) === 'object' && Object.prototype.toString.call(d) === '[object Date]';
	}

	function calculateObjectSize(object, serializeFunctions, ignoreUndefined) {
	  var totalLength = 4 + 1;

	  if (Array.isArray(object)) {
	    for (var i = 0; i < object.length; i++) {
	      totalLength += calculateElement(i.toString(), object[i], serializeFunctions, true, ignoreUndefined);
	    }
	  } else {
	    // If we have toBSON defined, override the current object
	    if (object.toBSON) {
	      object = object.toBSON();
	    } // Calculate size


	    for (var key in object) {
	      totalLength += calculateElement(key, object[key], serializeFunctions, false, ignoreUndefined);
	    }
	  }

	  return totalLength;
	}
	/**
	 * @ignore
	 * @api private
	 */


	function calculateElement(name, value, serializeFunctions, isArray, ignoreUndefined) {
	  // If we have toBSON defined, override the current object
	  if (value && value.toBSON) {
	    value = value.toBSON();
	  }

	  switch (_typeof$4(value)) {
	    case 'string':
	      return 1 + Buffer$6.byteLength(name, 'utf8') + 1 + 4 + Buffer$6.byteLength(value, 'utf8') + 1;

	    case 'number':
	      if (Math.floor(value) === value && value >= constants.JS_INT_MIN && value <= constants.JS_INT_MAX) {
	        if (value >= constants.BSON_INT32_MIN && value <= constants.BSON_INT32_MAX) {
	          // 32 bit
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (4 + 1);
	        } else {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	        }
	      } else {
	        // 64 bit
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	      }

	    case 'undefined':
	      if (isArray || !ignoreUndefined) return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1;
	      return 0;

	    case 'boolean':
	      return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (1 + 1);

	    case 'object':
	      if (value == null || value['_bsontype'] === 'MinKey' || value['_bsontype'] === 'MaxKey') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1;
	      } else if (value['_bsontype'] === 'ObjectId' || value['_bsontype'] === 'ObjectID') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (12 + 1);
	      } else if (value instanceof Date || isDate$2(value)) {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	      } else if (typeof Buffer$6 !== 'undefined' && Buffer$6.isBuffer(value)) {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (1 + 4 + 1) + value.length;
	      } else if (value['_bsontype'] === 'Long' || value['_bsontype'] === 'Double' || value['_bsontype'] === 'Timestamp') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (8 + 1);
	      } else if (value['_bsontype'] === 'Decimal128') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (16 + 1);
	      } else if (value['_bsontype'] === 'Code') {
	        // Calculate size depending on the availability of a scope
	        if (value.scope != null && Object.keys(value.scope).length > 0) {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + 4 + 4 + Buffer$6.byteLength(value.code.toString(), 'utf8') + 1 + calculateObjectSize(value.scope, serializeFunctions, ignoreUndefined);
	        } else {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + 4 + Buffer$6.byteLength(value.code.toString(), 'utf8') + 1;
	        }
	      } else if (value['_bsontype'] === 'Binary') {
	        // Check what kind of subtype we have
	        if (value.sub_type === binary.SUBTYPE_BYTE_ARRAY) {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (value.position + 1 + 4 + 1 + 4);
	        } else {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + (value.position + 1 + 4 + 1);
	        }
	      } else if (value['_bsontype'] === 'Symbol') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + Buffer$6.byteLength(value.value, 'utf8') + 4 + 1 + 1;
	      } else if (value['_bsontype'] === 'DBRef') {
	        // Set up correct object for serialization
	        var ordered_values = Object.assign({
	          $ref: value.collection,
	          $id: value.oid
	        }, value.fields); // Add db reference if it exists

	        if (value.db != null) {
	          ordered_values['$db'] = value.db;
	        }

	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + calculateObjectSize(ordered_values, serializeFunctions, ignoreUndefined);
	      } else if (value instanceof RegExp || Object.prototype.toString.call(value) === '[object RegExp]') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + Buffer$6.byteLength(value.source, 'utf8') + 1 + (value.global ? 1 : 0) + (value.ignoreCase ? 1 : 0) + (value.multiline ? 1 : 0) + 1;
	      } else if (value['_bsontype'] === 'BSONRegExp') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + Buffer$6.byteLength(value.pattern, 'utf8') + 1 + Buffer$6.byteLength(value.options, 'utf8') + 1;
	      } else {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + calculateObjectSize(value, serializeFunctions, ignoreUndefined) + 1;
	      }

	    case 'function':
	      // WTF for 0.4.X where typeof /someregexp/ === 'function'
	      if (value instanceof RegExp || Object.prototype.toString.call(value) === '[object RegExp]' || String.call(value) === '[object RegExp]') {
	        return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + Buffer$6.byteLength(value.source, 'utf8') + 1 + (value.global ? 1 : 0) + (value.ignoreCase ? 1 : 0) + (value.multiline ? 1 : 0) + 1;
	      } else {
	        if (serializeFunctions && value.scope != null && Object.keys(value.scope).length > 0) {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + 4 + 4 + Buffer$6.byteLength(normalizedFunctionString$2(value), 'utf8') + 1 + calculateObjectSize(value.scope, serializeFunctions, ignoreUndefined);
	        } else if (serializeFunctions) {
	          return (name != null ? Buffer$6.byteLength(name, 'utf8') + 1 : 0) + 1 + 4 + Buffer$6.byteLength(normalizedFunctionString$2(value), 'utf8') + 1;
	        }
	      }

	  }

	  return 0;
	}

	var calculate_size = calculateObjectSize;

	var Buffer$7 = buffer.Buffer;
	/**
	 * Makes sure that, if a Uint8Array is passed in, it is wrapped in a Buffer.
	 *
	 * @param {Buffer|Uint8Array} potentialBuffer The potential buffer
	 * @returns {Buffer} the input if potentialBuffer is a buffer, or a buffer that
	 * wraps a passed in Uint8Array
	 * @throws {TypeError} If anything other than a Buffer or Uint8Array is passed in
	 */

	var ensure_buffer = function ensureBuffer(potentialBuffer) {
	  if (potentialBuffer instanceof Buffer$7) {
	    return potentialBuffer;
	  }

	  if (potentialBuffer instanceof Uint8Array) {
	    return Buffer$7.from(potentialBuffer.buffer);
	  }

	  throw new TypeError('Must use either Buffer or Uint8Array');
	};

	var Buffer$8 = buffer.Buffer; // Parts of the parser

	/**
	 * @ignore
	 */
	// Default Max Size

	var MAXSIZE = 1024 * 1024 * 17; // Current Internal Temporary Serialization Buffer

	var buffer$1 = Buffer$8.alloc(MAXSIZE);
	/**
	 * Sets the size of the internal serialization buffer.
	 *
	 * @method
	 * @param {number} size The desired size for the internal serialization buffer
	 */

	function setInternalBufferSize(size) {
	  // Resize the internal serialization buffer if needed
	  if (buffer$1.length < size) {
	    buffer$1 = Buffer$8.alloc(size);
	  }
	}
	/**
	 * Serialize a Javascript object.
	 *
	 * @param {Object} object the Javascript object to serialize.
	 * @param {Boolean} [options.checkKeys] the serializer will check if keys are valid.
	 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
	 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
	 * @return {Buffer} returns the Buffer object containing the serialized object.
	 */


	function serialize$1(object, options) {
	  options = options || {}; // Unpack the options

	  var checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
	  var serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
	  var ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
	  var minInternalBufferSize = typeof options.minInternalBufferSize === 'number' ? options.minInternalBufferSize : MAXSIZE; // Resize the internal serialization buffer if needed

	  if (buffer$1.length < minInternalBufferSize) {
	    buffer$1 = Buffer$8.alloc(minInternalBufferSize);
	  } // Attempt to serialize


	  var serializationIndex = serializer(buffer$1, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined, []); // Create the final buffer

	  var finishedBuffer = Buffer$8.alloc(serializationIndex); // Copy into the finished buffer

	  buffer$1.copy(finishedBuffer, 0, 0, finishedBuffer.length); // Return the buffer

	  return finishedBuffer;
	}
	/**
	 * Serialize a Javascript object using a predefined Buffer and index into the buffer, useful when pre-allocating the space for serialization.
	 *
	 * @param {Object} object the Javascript object to serialize.
	 * @param {Buffer} buffer the Buffer you pre-allocated to store the serialized BSON object.
	 * @param {Boolean} [options.checkKeys] the serializer will check if keys are valid.
	 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
	 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
	 * @param {Number} [options.index] the index in the buffer where we wish to start serializing into.
	 * @return {Number} returns the index pointing to the last written byte in the buffer.
	 */


	function serializeWithBufferAndIndex(object, finalBuffer, options) {
	  options = options || {}; // Unpack the options

	  var checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
	  var serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
	  var ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
	  var startIndex = typeof options.index === 'number' ? options.index : 0; // Attempt to serialize

	  var serializationIndex = serializer(buffer$1, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined);
	  buffer$1.copy(finalBuffer, startIndex, 0, serializationIndex); // Return the index

	  return startIndex + serializationIndex - 1;
	}
	/**
	 * Deserialize data as BSON.
	 *
	 * @param {Buffer} buffer the buffer containing the serialized set of BSON documents.
	 * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
	 * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
	 * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
	 * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
	 * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
	 * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
	 * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
	 * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
	 * @param {boolean} [options.allowObjectSmallerThanBufferSize=false] allows the buffer to be larger than the parsed BSON object
	 * @return {Object} returns the deserialized Javascript Object.
	 */


	function deserialize$2(buffer$$1, options) {
	  buffer$$1 = ensure_buffer(buffer$$1);
	  return deserializer(buffer$$1, options);
	}
	/**
	 * Calculate the bson size for a passed in Javascript object.
	 *
	 * @param {Object} object the Javascript object to calculate the BSON byte size for.
	 * @param {Boolean} [options.serializeFunctions=false] serialize the javascript functions **(default:false)**.
	 * @param {Boolean} [options.ignoreUndefined=true] ignore undefined fields **(default:true)**.
	 * @return {Number} returns the number of bytes the BSON object will take up.
	 */


	function calculateObjectSize$1(object, options) {
	  options = options || {};
	  var serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
	  var ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
	  return calculate_size(object, serializeFunctions, ignoreUndefined);
	}
	/**
	 * Deserialize stream data as BSON documents.
	 *
	 * @param {Buffer} data the buffer containing the serialized set of BSON documents.
	 * @param {Number} startIndex the start index in the data Buffer where the deserialization is to start.
	 * @param {Number} numberOfDocuments number of documents to deserialize.
	 * @param {Array} documents an array where to store the deserialized documents.
	 * @param {Number} docStartIndex the index in the documents array from where to start inserting documents.
	 * @param {Object} [options] additional options used for the deserialization.
	 * @param {Object} [options.evalFunctions=false] evaluate functions in the BSON document scoped to the object deserialized.
	 * @param {Object} [options.cacheFunctions=false] cache evaluated functions for reuse.
	 * @param {Object} [options.cacheFunctionsCrc32=false] use a crc32 code for caching, otherwise use the string of the function.
	 * @param {Object} [options.promoteLongs=true] when deserializing a Long will fit it into a Number if it's smaller than 53 bits
	 * @param {Object} [options.promoteBuffers=false] when deserializing a Binary will return it as a node.js Buffer instance.
	 * @param {Object} [options.promoteValues=false] when deserializing will promote BSON values to their Node.js closest equivalent types.
	 * @param {Object} [options.fieldsAsRaw=null] allow to specify if there what fields we wish to return as unserialized raw buffer.
	 * @param {Object} [options.bsonRegExp=false] return BSON regular expressions as BSONRegExp instances.
	 * @return {Number} returns the next index in the buffer after deserialization **x** numbers of documents.
	 */


	function deserializeStream(data, startIndex, numberOfDocuments, documents, docStartIndex, options) {
	  options = Object.assign({
	    allowObjectSmallerThanBufferSize: true
	  }, options);
	  data = ensure_buffer(data);
	  var index = startIndex; // Loop over all documents

	  for (var i = 0; i < numberOfDocuments; i++) {
	    // Find size of the document
	    var size = data[index] | data[index + 1] << 8 | data[index + 2] << 16 | data[index + 3] << 24; // Update options with index

	    options.index = index; // Parse the document at this point

	    documents[docStartIndex + i] = deserializer(data, options); // Adjust index by the document size

	    index = index + size;
	  } // Return object containing end index of parsing and list of documents


	  return index;
	}

	var bson = {
	  // constants
	  // NOTE: this is done this way because rollup can't resolve an `Object.assign`ed export
	  BSON_INT32_MAX: constants.BSON_INT32_MAX,
	  BSON_INT32_MIN: constants.BSON_INT32_MIN,
	  BSON_INT64_MAX: constants.BSON_INT64_MAX,
	  BSON_INT64_MIN: constants.BSON_INT64_MIN,
	  JS_INT_MAX: constants.JS_INT_MAX,
	  JS_INT_MIN: constants.JS_INT_MIN,
	  BSON_DATA_NUMBER: constants.BSON_DATA_NUMBER,
	  BSON_DATA_STRING: constants.BSON_DATA_STRING,
	  BSON_DATA_OBJECT: constants.BSON_DATA_OBJECT,
	  BSON_DATA_ARRAY: constants.BSON_DATA_ARRAY,
	  BSON_DATA_BINARY: constants.BSON_DATA_BINARY,
	  BSON_DATA_UNDEFINED: constants.BSON_DATA_UNDEFINED,
	  BSON_DATA_OID: constants.BSON_DATA_OID,
	  BSON_DATA_BOOLEAN: constants.BSON_DATA_BOOLEAN,
	  BSON_DATA_DATE: constants.BSON_DATA_DATE,
	  BSON_DATA_NULL: constants.BSON_DATA_NULL,
	  BSON_DATA_REGEXP: constants.BSON_DATA_REGEXP,
	  BSON_DATA_DBPOINTER: constants.BSON_DATA_DBPOINTER,
	  BSON_DATA_CODE: constants.BSON_DATA_CODE,
	  BSON_DATA_SYMBOL: constants.BSON_DATA_SYMBOL,
	  BSON_DATA_CODE_W_SCOPE: constants.BSON_DATA_CODE_W_SCOPE,
	  BSON_DATA_INT: constants.BSON_DATA_INT,
	  BSON_DATA_TIMESTAMP: constants.BSON_DATA_TIMESTAMP,
	  BSON_DATA_LONG: constants.BSON_DATA_LONG,
	  BSON_DATA_DECIMAL128: constants.BSON_DATA_DECIMAL128,
	  BSON_DATA_MIN_KEY: constants.BSON_DATA_MIN_KEY,
	  BSON_DATA_MAX_KEY: constants.BSON_DATA_MAX_KEY,
	  BSON_BINARY_SUBTYPE_DEFAULT: constants.BSON_BINARY_SUBTYPE_DEFAULT,
	  BSON_BINARY_SUBTYPE_FUNCTION: constants.BSON_BINARY_SUBTYPE_FUNCTION,
	  BSON_BINARY_SUBTYPE_BYTE_ARRAY: constants.BSON_BINARY_SUBTYPE_BYTE_ARRAY,
	  BSON_BINARY_SUBTYPE_UUID: constants.BSON_BINARY_SUBTYPE_UUID,
	  BSON_BINARY_SUBTYPE_MD5: constants.BSON_BINARY_SUBTYPE_MD5,
	  BSON_BINARY_SUBTYPE_USER_DEFINED: constants.BSON_BINARY_SUBTYPE_USER_DEFINED,
	  // wrapped types
	  Code: code,
	  Map: map,
	  BSONSymbol: symbol,
	  DBRef: db_ref,
	  Binary: binary,
	  ObjectId: objectid,
	  Long: long_1,
	  Timestamp: timestamp,
	  Double: double_1,
	  Int32: int_32,
	  MinKey: min_key,
	  MaxKey: max_key,
	  BSONRegExp: regexp,
	  Decimal128: decimal128,
	  // methods
	  serialize: serialize$1,
	  serializeWithBufferAndIndex: serializeWithBufferAndIndex,
	  deserialize: deserialize$2,
	  calculateObjectSize: calculateObjectSize$1,
	  deserializeStream: deserializeStream,
	  setInternalBufferSize: setInternalBufferSize,
	  // legacy support
	  ObjectID: objectid,
	  // Extended JSON
	  EJSON: extended_json
	};
	var bson_1 = bson.BSON_INT32_MAX;
	var bson_2 = bson.BSON_INT32_MIN;
	var bson_3 = bson.BSON_INT64_MAX;
	var bson_4 = bson.BSON_INT64_MIN;
	var bson_5 = bson.JS_INT_MAX;
	var bson_6 = bson.JS_INT_MIN;
	var bson_7 = bson.BSON_DATA_NUMBER;
	var bson_8 = bson.BSON_DATA_STRING;
	var bson_9 = bson.BSON_DATA_OBJECT;
	var bson_10 = bson.BSON_DATA_ARRAY;
	var bson_11 = bson.BSON_DATA_BINARY;
	var bson_12 = bson.BSON_DATA_UNDEFINED;
	var bson_13 = bson.BSON_DATA_OID;
	var bson_14 = bson.BSON_DATA_BOOLEAN;
	var bson_15 = bson.BSON_DATA_DATE;
	var bson_16 = bson.BSON_DATA_NULL;
	var bson_17 = bson.BSON_DATA_REGEXP;
	var bson_18 = bson.BSON_DATA_DBPOINTER;
	var bson_19 = bson.BSON_DATA_CODE;
	var bson_20 = bson.BSON_DATA_SYMBOL;
	var bson_21 = bson.BSON_DATA_CODE_W_SCOPE;
	var bson_22 = bson.BSON_DATA_INT;
	var bson_23 = bson.BSON_DATA_TIMESTAMP;
	var bson_24 = bson.BSON_DATA_LONG;
	var bson_25 = bson.BSON_DATA_DECIMAL128;
	var bson_26 = bson.BSON_DATA_MIN_KEY;
	var bson_27 = bson.BSON_DATA_MAX_KEY;
	var bson_28 = bson.BSON_BINARY_SUBTYPE_DEFAULT;
	var bson_29 = bson.BSON_BINARY_SUBTYPE_FUNCTION;
	var bson_30 = bson.BSON_BINARY_SUBTYPE_BYTE_ARRAY;
	var bson_31 = bson.BSON_BINARY_SUBTYPE_UUID;
	var bson_32 = bson.BSON_BINARY_SUBTYPE_MD5;
	var bson_33 = bson.BSON_BINARY_SUBTYPE_USER_DEFINED;
	var bson_34 = bson.Code;
	var bson_35 = bson.BSONSymbol;
	var bson_36 = bson.DBRef;
	var bson_37 = bson.Binary;
	var bson_38 = bson.ObjectId;
	var bson_39 = bson.Long;
	var bson_40 = bson.Timestamp;
	var bson_41 = bson.Double;
	var bson_42 = bson.Int32;
	var bson_43 = bson.MinKey;
	var bson_44 = bson.MaxKey;
	var bson_45 = bson.BSONRegExp;
	var bson_46 = bson.Decimal128;
	var bson_47 = bson.serialize;
	var bson_48 = bson.serializeWithBufferAndIndex;
	var bson_49 = bson.deserialize;
	var bson_50 = bson.calculateObjectSize;
	var bson_51 = bson.deserializeStream;
	var bson_52 = bson.setInternalBufferSize;
	var bson_53 = bson.ObjectID;
	var bson_54 = bson.EJSON;

	exports.default = bson;
	exports.BSON_INT32_MAX = bson_1;
	exports.BSON_INT32_MIN = bson_2;
	exports.BSON_INT64_MAX = bson_3;
	exports.BSON_INT64_MIN = bson_4;
	exports.JS_INT_MAX = bson_5;
	exports.JS_INT_MIN = bson_6;
	exports.BSON_DATA_NUMBER = bson_7;
	exports.BSON_DATA_STRING = bson_8;
	exports.BSON_DATA_OBJECT = bson_9;
	exports.BSON_DATA_ARRAY = bson_10;
	exports.BSON_DATA_BINARY = bson_11;
	exports.BSON_DATA_UNDEFINED = bson_12;
	exports.BSON_DATA_OID = bson_13;
	exports.BSON_DATA_BOOLEAN = bson_14;
	exports.BSON_DATA_DATE = bson_15;
	exports.BSON_DATA_NULL = bson_16;
	exports.BSON_DATA_REGEXP = bson_17;
	exports.BSON_DATA_DBPOINTER = bson_18;
	exports.BSON_DATA_CODE = bson_19;
	exports.BSON_DATA_SYMBOL = bson_20;
	exports.BSON_DATA_CODE_W_SCOPE = bson_21;
	exports.BSON_DATA_INT = bson_22;
	exports.BSON_DATA_TIMESTAMP = bson_23;
	exports.BSON_DATA_LONG = bson_24;
	exports.BSON_DATA_DECIMAL128 = bson_25;
	exports.BSON_DATA_MIN_KEY = bson_26;
	exports.BSON_DATA_MAX_KEY = bson_27;
	exports.BSON_BINARY_SUBTYPE_DEFAULT = bson_28;
	exports.BSON_BINARY_SUBTYPE_FUNCTION = bson_29;
	exports.BSON_BINARY_SUBTYPE_BYTE_ARRAY = bson_30;
	exports.BSON_BINARY_SUBTYPE_UUID = bson_31;
	exports.BSON_BINARY_SUBTYPE_MD5 = bson_32;
	exports.BSON_BINARY_SUBTYPE_USER_DEFINED = bson_33;
	exports.Code = bson_34;
	exports.BSONSymbol = bson_35;
	exports.DBRef = bson_36;
	exports.Binary = bson_37;
	exports.ObjectId = bson_38;
	exports.Long = bson_39;
	exports.Timestamp = bson_40;
	exports.Double = bson_41;
	exports.Int32 = bson_42;
	exports.MinKey = bson_43;
	exports.MaxKey = bson_44;
	exports.BSONRegExp = bson_45;
	exports.Decimal128 = bson_46;
	exports.serialize = bson_47;
	exports.serializeWithBufferAndIndex = bson_48;
	exports.deserialize = bson_49;
	exports.calculateObjectSize = bson_50;
	exports.deserializeStream = bson_51;
	exports.setInternalBufferSize = bson_52;
	exports.ObjectID = bson_53;
	exports.EJSON = bson_54;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
