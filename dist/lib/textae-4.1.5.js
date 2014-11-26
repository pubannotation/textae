(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var asap = require('asap')

module.exports = Promise
function Promise(fn) {
  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
  if (typeof fn !== 'function') throw new TypeError('not a function')
  var state = null
  var value = null
  var deferreds = []
  var self = this

  this.then = function(onFulfilled, onRejected) {
    return new Promise(function(resolve, reject) {
      handle(new Handler(onFulfilled, onRejected, resolve, reject))
    })
  }

  function handle(deferred) {
    if (state === null) {
      deferreds.push(deferred)
      return
    }
    asap(function() {
      var cb = state ? deferred.onFulfilled : deferred.onRejected
      if (cb === null) {
        (state ? deferred.resolve : deferred.reject)(value)
        return
      }
      var ret
      try {
        ret = cb(value)
      }
      catch (e) {
        deferred.reject(e)
        return
      }
      deferred.resolve(ret)
    })
  }

  function resolve(newValue) {
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then
        if (typeof then === 'function') {
          doResolve(then.bind(newValue), resolve, reject)
          return
        }
      }
      state = true
      value = newValue
      finale()
    } catch (e) { reject(e) }
  }

  function reject(newValue) {
    state = false
    value = newValue
    finale()
  }

  function finale() {
    for (var i = 0, len = deferreds.length; i < len; i++)
      handle(deferreds[i])
    deferreds = null
  }

  doResolve(fn, resolve, reject)
}


function Handler(onFulfilled, onRejected, resolve, reject){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.resolve = resolve
  this.reject = reject
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}

},{"asap":3}],2:[function(require,module,exports){
'use strict';

//This file contains then/promise specific extensions to the core promise API

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

function ValuePromise(value) {
  this.then = function (onFulfilled) {
    if (typeof onFulfilled !== 'function') return this
    return new Promise(function (resolve, reject) {
      asap(function () {
        try {
          resolve(onFulfilled(value))
        } catch (ex) {
          reject(ex);
        }
      })
    })
  }
}
ValuePromise.prototype = Object.create(Promise.prototype)

var TRUE = new ValuePromise(true)
var FALSE = new ValuePromise(false)
var NULL = new ValuePromise(null)
var UNDEFINED = new ValuePromise(undefined)
var ZERO = new ValuePromise(0)
var EMPTYSTRING = new ValuePromise('')

Promise.resolve = function (value) {
  if (value instanceof Promise) return value

  if (value === null) return NULL
  if (value === undefined) return UNDEFINED
  if (value === true) return TRUE
  if (value === false) return FALSE
  if (value === 0) return ZERO
  if (value === '') return EMPTYSTRING

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        return new Promise(then.bind(value))
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex)
      })
    }
  }

  return new ValuePromise(value)
}

Promise.from = Promise.cast = function (value) {
  var err = new Error('Promise.from and Promise.cast are deprecated, use Promise.resolve instead')
  err.name = 'Warning'
  console.warn(err.stack)
  return Promise.resolve(value)
}

Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity
  return function () {
    var self = this
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop()
      }
      args.push(function (err, res) {
        if (err) reject(err)
        else resolve(res)
      })
      fn.apply(self, args)
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    try {
      return fn.apply(this, arguments).nodeify(callback)
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) { reject(ex) })
      } else {
        asap(function () {
          callback(ex)
        })
      }
    }
  }
}

Promise.all = function () {
  var calledWithArray = arguments.length === 1 && Array.isArray(arguments[0])
  var args = Array.prototype.slice.call(calledWithArray ? arguments[0] : arguments)

  if (!calledWithArray) {
    var err = new Error('Promise.all should be called with a single array, calling it with multiple arguments is deprecated')
    err.name = 'Warning'
    console.warn(err.stack)
  }

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { res(i, val) }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) { 
    reject(value);
  });
}

Promise.race = function (values) {
  return new Promise(function (resolve, reject) { 
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    })
  });
}

/* Prototype Methods */

Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, function (err) {
    asap(function () {
      throw err
    })
  })
}

Promise.prototype.nodeify = function (callback) {
  if (typeof callback != 'function') return this

  this.then(function (value) {
    asap(function () {
      callback(null, value)
    })
  }, function (err) {
    asap(function () {
      callback(err)
    })
  })
}

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
}

},{"./core.js":1,"asap":3}],3:[function(require,module,exports){
(function (process){

// Use the fastest possible means to execute a task in a future turn
// of the event loop.

// linked list of tasks (single, with head node)
var head = {task: void 0, next: null};
var tail = head;
var flushing = false;
var requestFlush = void 0;
var isNodeJS = false;

function flush() {
    /* jshint loopfunc: true */

    while (head.next) {
        head = head.next;
        var task = head.task;
        head.task = void 0;
        var domain = head.domain;

        if (domain) {
            head.domain = void 0;
            domain.enter();
        }

        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function() {
                   throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    flushing = false;
}

if (typeof process !== "undefined" && process.nextTick) {
    // Node.js before 0.9. Note that some fake-Node environments, like the
    // Mocha test runner, introduce a `process` global without a `nextTick`.
    isNodeJS = true;

    requestFlush = function () {
        process.nextTick(flush);
    };

} else if (typeof setImmediate === "function") {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
        requestFlush = setImmediate.bind(window, flush);
    } else {
        requestFlush = function () {
            setImmediate(flush);
        };
    }

} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    requestFlush = function () {
        channel.port2.postMessage(0);
    };

} else {
    // old browsers
    requestFlush = function () {
        setTimeout(flush, 0);
    };
}

function asap(task) {
    tail = tail.next = {
        task: task,
        domain: isNodeJS && process.domain,
        next: null
    };

    if (!flushing) {
        flushing = true;
        requestFlush();
    }
};

module.exports = asap;


}).call(this,require("JkpR2F"))
},{"JkpR2F":4}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(require,module,exports){
(function (global){
/*! http://mths.be/punycode v1.2.4 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports;
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings.
	 * @private
	 * @param {String} domain The domain name.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		return map(string.split(regexSeparators), fn).join('.');
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <http://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols to a Punycode string of ASCII-only
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name to Unicode. Only the
	 * Punycoded parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it on a string that has already been converted to
	 * Unicode.
	 * @memberOf punycode
	 * @param {String} domain The Punycode domain name to convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(domain) {
		return mapDomain(domain, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name to Punycode. Only the
	 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it with a domain that's already in ASCII.
	 * @memberOf punycode
	 * @param {String} domain The domain name to convert, as a Unicode string.
	 * @returns {String} The Punycode representation of the given domain name.
	 */
	function toASCII(domain) {
		return mapDomain(domain, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.2.4',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],8:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":6,"./encode":7}],9:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

},{"punycode":5,"querystring":8}],10:[function(require,module,exports){
module.exports = function() {
	var defaults = {
			"delimiter characters": [
				" ",
				".",
				"!",
				"?",
				",",
				":",
				";",
				"-",
				"/",
				"&",
				"(",
				")",
				"{",
				"}",
				"[",
				"]",
				"+",
				"*",
				"\\",
				"\"",
				"'",
				"\n",
				"–"
			],
			"non-edge characters": [
				" ",
				"\n"
			]
		},
		api = {
			delimiterCharacters: null,
			nonEdgeCharacters: null,
			reset: function() {
				this.set(defaults);
			},
			set: function(config) {
				var settings = _.extend({}, defaults, config);

				if (settings['delimiter characters'] !== undefined) {
					api.delimiterCharacters = settings['delimiter characters'];
				}

				if (settings['non-edge characters'] !== undefined) {
					api.nonEdgeCharacters = settings['non-edge characters'];
				}

				return config;
			},
			isNonEdgeCharacter: function(char) {
				return (api.nonEdgeCharacters.indexOf(char) >= 0);
			},
			isDelimiter: function(char) {
				if (api.delimiterCharacters.indexOf('ANY') >= 0) {
					return 1;
				}
				return (api.delimiterCharacters.indexOf(char) >= 0);
			}
		};

	return api;
};
},{}],11:[function(require,module,exports){
var bindEvent = function($target, event, func) {
        $target.on(event, func);
    },
    bindCloseEvent = function($dialog) {
        bindEvent($dialog, 'dialog.close', function() {
            $dialog.close();
        });
        return $dialog;
    },
    ajaxAccessor = require('../util/ajaxAccessor'),
    jQuerySugar = require('../util/jQuerySugar'),
    url = require('url');

// A sub component to save and load data.
module.exports = function(editor, confirmDiscardChangeMessage) {
    var dataSourceUrl = '',
        cursorChanger = require('../util/CursorChanger')(editor),
        getAnnotationFromServer = function(urlToJson) {
            cursorChanger.startWait();
            ajaxAccessor.getAsync(urlToJson, function getAnnotationFromServerSuccess(annotation) {
                api.trigger('load', {
                    annotation: annotation,
                    source: jQuerySugar.toLink(url.resolve(location.href, urlToJson))
                });
                dataSourceUrl = urlToJson;
            }, function() {
                cursorChanger.endWait();
                alert("connection failed.");
            });
        },
        //load/saveDialog
        loadSaveDialog = function() {
            var extendOpenWithUrl = function($dialog) {
                    // Do not set twice.
                    if (!$dialog.openAndSetParam) {
                        $dialog.openAndSetParam = _.compose($dialog.open.bind($dialog), function(params) {
                            // Display dataSourceUrl.
                            this.find('[type="text"].url')
                                .val(dataSourceUrl)
                                .trigger('input');

                            $dialog.params = params;
                        });
                    }

                    return $dialog;
                },
                getDialog = _.compose(extendOpenWithUrl, bindCloseEvent, require('../util/dialog/GetEditorDialog')(editor)),
                label = {
                    URL: 'URL',
                    LOCAL: 'Local'
                },
                getLoadDialog = function(editorId) {
                    var getAnnotationFromFile = function(file) {
                            var firstFile = file.files[0],
                                reader = new FileReader();

                            reader.onload = function() {
                                var annotation = JSON.parse(this.result);
                                api.trigger('load', {
                                    annotation: annotation,
                                    source: firstFile.name + '(local file)'
                                });
                            };
                            reader.readAsText(firstFile);
                        },
                        RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__load-dialog__row'),
                        RowLabel = _.partial(jQuerySugar.Label, 'textae-editor__load-dialog__label'),
                        OpenButton = _.partial(jQuerySugar.Button, 'Open'),
                        isUserComfirm = function() {
                            // The params was set hasAnythingToSave.
                            return !$dialog.params || window.confirm(confirmDiscardChangeMessage);
                        },
                        $buttonUrl = new OpenButton('url'),
                        $buttonLocal = new OpenButton('local'),
                        $content = $('<div>')
                        .append(
                            new RowDiv().append(
                                new RowLabel(label.URL),
                                $('<input type="text" class="textae-editor__load-dialog__file-name url" />'),
                                $buttonUrl
                            )
                        )
                        .on('input', '[type="text"].url', function() {
                            jQuerySugar.enabled($buttonUrl, this.value);
                        })
                        .on('click', '[type="button"].url', function() {
                            if (isUserComfirm()) {
                                getAnnotationFromServer(jQuerySugar.getValueFromText($content, 'url'));
                            }

                            $content.trigger('dialog.close');
                        })
                        .append(
                            new RowDiv().append(
                                new RowLabel(label.LOCAL),
                                $('<input class="textae-editor__load-dialog__file" type="file" />'),
                                $buttonLocal
                            )
                        )
                        .on('change', '[type="file"]', function() {
                            jQuerySugar.enabled($buttonLocal, this.files.length > 0);
                        })
                        .on('click', '[type="button"].local', function() {
                            if (isUserComfirm()) {
                                getAnnotationFromFile($content.find('[type="file"]')[0]);
                            }

                            $content.trigger('dialog.close');
                        });

                    // Capture the local variable by inner funcitons.
                    var $dialog = getDialog('textae.dialog.load', 'Load Annotations', $content);

                    return $dialog;
                },
                getSaveDialog = function(editorId) {
                    var showSaveSuccess = function() {
                            api.trigger('save');
                            cursorChanger.endWait();
                        },
                        showSaveError = function() {
                            api.trigger('save error');
                            cursorChanger.endWait();
                        },
                        saveAnnotationToServer = function(url, jsonData) {
                            cursorChanger.startWait();
                            ajaxAccessor.post(url, jsonData, showSaveSuccess, showSaveError, function() {
                                cursorChanger.endWait();
                            });
                        },
                        createDownloadPath = function(contents) {
                            var blob = new Blob([contents], {
                                type: 'application/json'
                            });
                            return URL.createObjectURL(blob);
                        },
                        getFilename = function() {
                            var $fileInput = getLoadDialog(editorId).find("input[type='file']"),
                                file = $fileInput.prop('files')[0];

                            return file ? file.name : 'annotations.json';
                        },
                        RowDiv = _.partial(jQuerySugar.Div, 'textae-editor__save-dialog__row'),
                        RowLabel = _.partial(jQuerySugar.Label, 'textae-editor__save-dialog__label'),
                        $saveButton = new jQuerySugar.Button('Save', 'url'),
                        $content = $('<div>')
                        .append(
                            new RowDiv().append(
                                new RowLabel(label.URL),
                                $('<input type="text" class="textae-editor__save-dialog__server-file-name url" />'),
                                $saveButton
                            )
                        )
                        .on('input', 'input.url', function() {
                            jQuerySugar.enabled($saveButton, this.value);
                        })
                        .on('click', '[type="button"].url', function() {
                            saveAnnotationToServer(jQuerySugar.getValueFromText($content, 'url'), $dialog.params);
                            $content.trigger('dialog.close');
                        })
                        .append(
                            new RowDiv().append(
                                new RowLabel(label.LOCAL),
                                $('<input type="text" class="textae-editor__save-dialog__local-file-name local">'),
                                $('<a class="download" href="#">Download</a>')
                            )
                        )
                        .on('click', 'a.download', function() {
                            var downloadPath = createDownloadPath($dialog.params);
                            $(this)
                                .attr('href', downloadPath)
                                .attr('download', jQuerySugar.getValueFromText($content, 'local'));
                            api.trigger('save');
                            $content.trigger('dialog.close');
                        })
                        .append(
                            new RowDiv().append(
                                new RowLabel(),
                                $('<a class="viewsource" href="#">Click to see the json source in a new window.</a>')
                            )
                        )
                        .on('click', 'a.viewsource', function(e) {
                            var downloadPath = createDownloadPath($dialog.params);
                            window.open(downloadPath, '_blank');
                            api.trigger('save');
                            $content.trigger('dialog.close');
                            return false;
                        });

                    var $dialog = getDialog('textae.dialog.save', 'Save Annotations', $content);

                    // Set the filename when the dialog is opened.
                    $dialog.on('dialogopen', function() {
                        var filename = getFilename();
                        $dialog
                            .find('[type="text"].local')
                            .val(filename);
                    });

                    return $dialog;
                };

            return {
                showLoad: function(editorId, hasAnythingToSave) {
                    getLoadDialog(editorId).openAndSetParam(hasAnythingToSave);
                },
                showSave: function(editorId, jsonData) {
                    getSaveDialog(editorId).openAndSetParam(jsonData);
                }
            };
        }();

    var api = require('../util/extendBindable')({
        getAnnotationFromServer: getAnnotationFromServer,
        showAccess: _.partial(loadSaveDialog.showLoad, editor.editorId),
        showSave: _.partial(loadSaveDialog.showSave, editor.editorId),
    });

    return api;
};
},{"../util/CursorChanger":36,"../util/ajaxAccessor":39,"../util/dialog/GetEditorDialog":44,"../util/extendBindable":47,"../util/jQuerySugar":50,"url":9}],12:[function(require,module,exports){
var Pallet = function(emitter) {
		return $('<div>')
			.addClass("textae-editor__type-pallet")
			.append($('<table>'))
			.css('position', 'fixed')
			.on('click', '.textae-editor__type-pallet__entity-type__label', function() {
				emitter.trigger('type.select', $(this).attr('label'));
			})
			.on('change', '.textae-editor__type-pallet__entity-type__radio', function() {
				emitter.trigger('default-type.select', $(this).attr('label'));
			})
			.hide();
	},
	rowParts = {
		RadioButton: function(typeContainer, typeName) {
			// The event handler is bound direct,because jQuery detects events of radio buttons directly only.
			var $radioButton = $('<input>')
				.addClass('textae-editor__type-pallet__entity-type__radio')
				.attr({
					'type': 'radio',
					'name': 'etype',
					'label': typeName
				});

			// Select the radio button if it is default type.
			if (typeName === typeContainer.getDefaultType()) {
				$radioButton.attr({
					'title': 'default type',
					'checked': 'checked'
				});
			}
			return $radioButton;
		},
		Link: function(uri) {
			if (uri) {
				return $('<a>')
					.attr({
						'href': uri,
						'target': '_blank'
					})
					.append($('<span>').addClass('textae-editor__type-pallet__link'));
			}
		},
		wrapTd: function($element) {
			if ($element) {
				return $('<td>').append($element);
			} else {
				return $('<td>');
			}
		}
	},
	PalletRow = function(typeContainer) {
		var Column1 = _.compose(rowParts.wrapTd, _.partial(rowParts.RadioButton, typeContainer)),
			Column2 = function(typeName) {
				return $('<td>')
					.addClass('textae-editor__type-pallet__entity-type__label')
					.attr('label', typeName)
					.text(typeName);
			},
			Column3 = _.compose(rowParts.wrapTd, rowParts.Link, typeContainer.getUri);

		return typeContainer.getSortedNames().map(function(typeName) {
			var $column1 = new Column1(typeName);
			var $column2 = new Column2(typeName);
			var $column3 = new Column3(typeName);

			return $('<tr>')
				.addClass('textae-editor__type-pallet__entity-type')
				.css({
					'background-color': typeContainer.getColor(typeName)
				})
				.append([$column1, $column2, $column3]);
		});
	};

module.exports = function() {
	var emitter = require('../util/extendBindable')({}),
		$pallet = new Pallet(emitter),
		show = function() {
			var reuseOldPallet = function($pallet) {
					var $oldPallet = $('.textae-editor__type-pallet');
					if ($oldPallet.length !== 0) {
						return $oldPallet.find('table').empty().end().css('width', 'auto');
					} else {
						// Append the pallet to body to show on top.
						$("body").append($pallet);
						return $pallet;
					}
				},
				appendRows = function(palletConfig, $pallet) {
					return $pallet.find("table")
						.append(new PalletRow(palletConfig.typeContainer))
						.end();
				},
				setMaxHeight = function($pallet) {
					// Show the scrollbar-y if the height of the pallet is same witch max-height.
					if ($pallet.outerHeight() + 'px' === $pallet.css('max-height')) {
						return $pallet.css('overflow-y', 'scroll');
					} else {
						return $pallet.css('overflow-y', '');
					}
				},
				show = function($pallet, palletConfig, point) {
					if (palletConfig.typeContainer && palletConfig.typeContainer.getSortedNames().length > 0) {
						var fillPallet = _.compose(setMaxHeight, _.partial(appendRows, palletConfig), reuseOldPallet);

						// Move the pallet to mouse.
						fillPallet($pallet)
							.css(point)
							.show();
					}
				};

			return show;
		}();

	return _.extend(emitter, {
		show: _.partial(show, $pallet),
		hide: $pallet.hide.bind($pallet)
	});
};
},{"../util/extendBindable":47}],13:[function(require,module,exports){
var getMessageAreaFrom = function($parent) {
	var $messageArea = $parent.find('.textae-editor__footer .textae-editor__footer__message');
	if ($messageArea.length === 0) {
		$messageArea = $('<div>').addClass('textae-editor__footer__message');
		var $footer = $('<div>')
			.addClass('textae-editor__footer')
			.append($messageArea);
		$parent.append($footer);
	}

	return $messageArea;
};

module.exports = function(editor) {
	var getMessageAreaFromEditor = _.partial(getMessageAreaFrom, editor),
		updateSoruceInfo = function(inlineElement) {
			if (inlineElement !== '') getMessageAreaFromEditor().html('Source: ' + inlineElement);
		},
		showFlashMessage = function(message) {
			var origin = getMessageAreaFromEditor().html();
			getMessageAreaFromEditor()
				.html(message)
				.fadeIn()
				.fadeOut(5000, function() {
					getMessageAreaFromEditor()
						.html(origin)
						.removeAttr('style');
				});
		};

	return {
		updateSoruceInfo: updateSoruceInfo,
		showFlashMessage: showFlashMessage
	};
};
},{}],14:[function(require,module,exports){
var TitleDom = function() {
        return $('<span>')
            .addClass('textae-control__title')
            .append($('<a>')
                .attr('href', 'http://bionlp.dbcls.jp/textae/')
                .text('TextAE'));
    },
    ButtonDom = function(buttonType, title) {
        return $('<span>')
            .addClass('textae-control__icon')
            .addClass('textae-control__' + buttonType + '-button')
            .attr('title', title);
    },
    SeparatorDom = function() {
        return $('<span>').addClass('textae-control__separator');
    },
    makeButtons = function($control, buttonMap) {
        var buttonContainer = {},
            // Make a group of buttons that is headed by the separator. 
            icons = _.flatten(buttonMap.map(function(params) {
                var buttons = _.map(params, function(title, buttonType) {
                    var button = new ButtonDom(buttonType, title);

                    buttonContainer[buttonType] = {
                        instance: button,
                        eventValue: 'textae.control.button.' + buttonType.replace(/-/g, '_') + '.click'
                    };

                    return button;
                });

                return [new SeparatorDom()]
                    .concat(buttons);
            }));

        $control
            .append(new TitleDom())
            .append($('<span>').append(icons));

        return buttonContainer;
    },
    // Utility functions to change appearance of bunttons.
    cssUtil = {
        enable: function($button) {
            $button.removeClass('textae-control__icon--disabled');
        },
        disable: function($button) {
            $button.addClass('textae-control__icon--disabled');
        },
        isDisable: function($button) {
            return $button.hasClass('textae-control__icon--disabled');
        },
        push: function($button) {
            $button.addClass('textae-control__icon--pushed');
        },
        unpush: function($button) {
            $button.removeClass('textae-control__icon--pushed');
        },
        isPushed: function($button) {
            return $button.hasClass('textae-control__icon--pushed');
        }
    },
    setButtonApearanceAndEventHandler = function(button, enable, eventHandler) {
        var event = 'click';

        // Set apearance and eventHandler to button.
        if (enable === true) {
            button
                .off(event)
                .on(event, eventHandler);
            cssUtil.enable(button);
        } else {
            button.off(event);
            cssUtil.disable(button);
        }
    },
    // A parameter can be spesified by object like { 'buttonName1': true, 'buttonName2': false }.
    updateButtons = function(buttonContainer, clickEventHandler, buttonEnables) {
        _.each(buttonEnables, function(enable, buttonName) {
            var button = buttonContainer[buttonName],
                eventHandler = function() {
                    clickEventHandler(button.eventValue);
                    return false;
                };

            if (button) setButtonApearanceAndEventHandler(button.instance, enable, eventHandler);
        });
    };

// The control is a control bar to edit.
// This can controls mulitple instance of editor.
module.exports = function($control) {
    // This contains buttons and event definitions like as {'buttonName' : { instance: $button, eventValue : 'textae.control.button.read.click' }}
    var buttonContainer = makeButtons($control, [{
            'read': 'Import [I]',
            'write': 'Upload [U]'
        }, {
            'undo': 'Undo [Z]',
            'redo': 'Redo [A]'
        }, {
            'replicate': 'Replicate span annotation [R]',
            'replicate-auto': 'Auto replicate (Toggle)',
            'relation-edit-mode': 'Edit Relation [F]'
        }, {
            'entity': 'New entity [E]',
            'pallet': 'Select label [Q]',
            'change-label': 'Change label [W]'
        }, {
            'negation': 'Negation [X]',
            'speculation': 'Speculation [S]'
        }, {
            'delete': 'Delete [D]',
            'copy': 'Copy [C]',
            'paste': 'Paste [V]'
        }, {
            'setting': 'Setting'
        }, {
            'help': 'Help [H]',
            'about': 'About'
        }]),
        triggrButtonClickEvent = $control.trigger.bind($control, 'textae.control.button.click'),
        // A function to enable/disable button.
        enableButton = _.partial(updateButtons, buttonContainer, triggrButtonClickEvent),
        // Buttons that always eanable.
        alwaysEnables = {
            'read': true,
            'help': true,
            'about': true
        },
        // Update all button state when an instance of textEditor is changed.
        updateAllButtonEnableState = function(disableButtons) {
            // Make buttons in a disableButtons disalbed, and other buttons in the buttonContainer enabled.
            enableButton(_.extend({}, buttonContainer, alwaysEnables, disableButtons));
        },
        // Update button push state.
        updateButtonPushState = function(bottonName, isPushed) {
            var button = buttonContainer[bottonName].instance;

            if (isPushed) {
                cssUtil.push(button);
            } else {
                cssUtil.unpush(button);
            }
        };

    // Public API
    $control.updateAllButtonEnableState = updateAllButtonEnableState;
    $control.updateButtonPushState = updateButtonPushState;

    return $control;
};
},{}],15:[function(require,module,exports){
var Controller = function(editor, history, presenter, view) {
        return {
            init: function(confirmDiscardChangeMessage) {
                // Prevent the default selection by the browser with shift keies.
                editor.on('mousedown', function(e) {
                    if (e.shiftKey) {
                        return false;
                    }
                }).on('mousedown', '.textae-editor__type', function() {
                    // Prevent a selection of a type by the double-click.
                    return false;
                }).on('mousedown', '.textae-editor__body__text-box__paragraph-margin', function(e) {
                    // Prevent a selection of a margin of a paragraph by the double-click.
                    if (e.target.className === 'textae-editor__body__text-box__paragraph-margin') return false;
                });

                // Bind user input event to handler
                editor
                    .on('mouseup', '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', presenter.event.editorSelected)
                    .on('mouseenter', '.textae-editor__entity', function(e) {
                        view.hoverRelation.on($(this).attr('title'));
                    }).on('mouseleave', '.textae-editor__entity', function(e) {
                        view.hoverRelation.off($(this).attr('title'));
                    });

                history.bind('change', function(state) {
                    //change button state
                    view.viewModel.buttonStateHelper.enabled("write", state.hasAnythingToSave);
                    view.viewModel.buttonStateHelper.enabled("undo", state.hasAnythingToUndo);
                    view.viewModel.buttonStateHelper.enabled("redo", state.hasAnythingToRedo);

                    //change leaveMessage show
                    window.onbeforeunload = state.hasAnythingToSave ? function() {
                        return confirmDiscardChangeMessage;
                    } : null;
                });
            }
        };
    },
    getParams = function(editor) {
        // Read model parameters from url parameters and html attributes.
        var params = _.extend(require('./util/getUrlParameters')(location.search),
            // Html attributes preced url parameters.
            {
                config: editor.attr('config')
            });

        // 'source' prefer to 'target'
        params.target = editor.attr('source') || editor.attr('target') || params.source || params.target;

        // Mode is prior in the url parameter.
        if (!params.mode && editor.attr('mode')) {
            params.mode = editor.attr('mode');
        }

        // Read Html text and clear it.  
        var inlineAnnotation = editor.text();
        editor.empty();

        // Set annotaiton parameters.
        params.annotation = {
            inlineAnnotation: inlineAnnotation,
            url: params.target
        };

        return params;
    },
    setTypeConfig = function(view, config) {
        view.typeContainer.setDefinedEntityTypes(config ? config['entity types'] : []);
        view.typeContainer.setDefinedRelationTypes(config ? config['relation types'] : []);

        if (config && config.css !== undefined) {
            $('#css_area').html('<link rel="stylesheet" href="' + config.css + '"/>');
        }

        return config;
    },
    handle = function(map, key, value) {
        if (map[key]) map[key](value);
    },
    createDaoForEditor = function(editor, confirmDiscardChangeMessage, history, statusBar, setAnnotationFunc) {
        return require('./component/DataAccessObject')(editor, confirmDiscardChangeMessage)
            .bind('save', function() {
                history.saved();
                statusBar.showFlashMessage("annotation saved");
            })
            .bind('save error', function() {
                statusBar.showFlashMessage("could not save");
            })
            .bind('load', function(data) {
                setAnnotationFunc(data.annotation);
                statusBar.updateSoruceInfo(data.source);
            });
    };

module.exports = function() {
    // model manages data objects.
    var model = require('./model/Model')(this),
        // The history of command that providing undo and redo.
        history = require('./model/History')(),
        // Configulation of span
        spanConfig = require('./SpanConfig')(),
        // Users can edit model only via commands. 
        command = require('./model/Command')(this, model, history, spanConfig),
        view = require('./view/View')(this, model),
        presenter = require('./presenter/Presenter')(this, model, view, command, spanConfig),
        //handle user input event.
        controller = new Controller(this, history, presenter, view),
        setTypeConfigToView = _.partial(setTypeConfig, view),
        setSpanAndTypeConfig = function(config) {
            spanConfig.set(config);
            setTypeConfigToView(config);
        },
        setConfigInAnnotation = function(annotation) {
            spanConfig.reset();
            setSpanAndTypeConfig(annotation.config);

            if (!annotation.config) {
                return 'no config';
            }
        },
        resetData = function(annotation) {
            model.annotationData.reset(annotation);
            history.reset();
        },
        setConfigFromServer = function(config, annotation) {
            spanConfig.reset();

            if (typeof config === 'string') {
                require('./util/ajaxAccessor')
                    .getAsync(config,
                        function(configFromServer) {
                            setSpanAndTypeConfig(configFromServer);
                            resetData(annotation);
                        },
                        function() {
                            alert('could not read the span configuration from the location you specified.: ' + config);
                        }
                    );
            } else {
                resetData(annotation);
            }
        },
        setAnnotation = function(config, annotation) {
            var ret = setConfigInAnnotation(annotation);
            if (ret === 'no config') {
                setConfigFromServer(config, annotation);
            } else {
                resetData(annotation);
            }
        },
        statusBar = require('./component/StatusBar')(this),
        loadAnnotation = function(params, dataAccessObject) {
            var annotation = params.annotation;
            if (annotation) {
                if (annotation.inlineAnnotation) {
                    // Set an inline annotation.
                    setAnnotation(params.config, JSON.parse(annotation.inlineAnnotation));
                    statusBar.updateSoruceInfo('inline');
                } else if (annotation.url) {
                    // Load an annotation from server.
                    dataAccessObject.getAnnotationFromServer(annotation.url);
                }
            }
        },
        loadOuterFiles = function(params, dataAccessObject) {
            presenter.setMode(params.mode);
            loadAnnotation(params, dataAccessObject);
        };

    // public funcitons of editor
    this.api = function(editor) {
        var updateAPIs = function(dataAccessObject) {
                var showAccess = function() {
                        dataAccessObject.showAccess(history.hasAnythingToSave());
                    },
                    showSave = function() {
                        dataAccessObject.showSave(model.annotationData.toJson());
                    },
                    keyApiMap = {
                        'A': command.redo,
                        'C': presenter.event.copyEntities,
                        'D': presenter.event.removeSelectedElements,
                        'DEL': presenter.event.removeSelectedElements,
                        'E': presenter.event.createEntity,
                        'F': presenter.event.toggleRelationEditMode,
                        'I': showAccess,
                        'M': presenter.event.toggleRelationEditMode,
                        'Q': presenter.event.showPallet,
                        'R': presenter.event.replicate,
                        'S': presenter.event.speculation,
                        'U': showSave,
                        'V': presenter.event.pasteEntities,
                        'W': presenter.event.newLabel,
                        'X': presenter.event.negation,
                        'Y': command.redo,
                        'Z': command.undo,
                        'ESC': presenter.event.cancelSelect,
                        'LEFT': presenter.event.selectLeftSpan,
                        'RIGHT': presenter.event.selectRightSpan,
                    },
                    iconApiMap = {
                        'textae.control.button.read.click': showAccess,
                        'textae.control.button.write.click': showSave,
                        'textae.control.button.undo.click': command.undo,
                        'textae.control.button.redo.click': command.redo,
                        'textae.control.button.replicate.click': presenter.event.replicate,
                        'textae.control.button.replicate_auto.click': view.viewModel.modeAccordingToButton['replicate-auto'].toggle,
                        'textae.control.button.relation_edit_mode.click': presenter.event.toggleRelationEditMode,
                        'textae.control.button.entity.click': presenter.event.createEntity,
                        'textae.control.button.change_label.click': presenter.event.newLabel,
                        'textae.control.button.pallet.click': presenter.event.showPallet,
                        'textae.control.button.negation.click': presenter.event.negation,
                        'textae.control.button.speculation.click': presenter.event.speculation,
                        'textae.control.button.delete.click': presenter.event.removeSelectedElements,
                        'textae.control.button.copy.click': presenter.event.copyEntities,
                        'textae.control.button.paste.click': presenter.event.pasteEntities,
                        'textae.control.button.setting.click': presenter.event.showSettingDialog
                    };

                // Update APIs
                editor.api = {
                    handleKeyInput: _.partial(handle, keyApiMap),
                    handleButtonClick: _.partial(handle, iconApiMap),
                    redraw: function() {
                        console.log(editor.editorId, 'redraw');
                        presenter.event.redraw();
                    }
                };
            },
            start = function start(editor) {
                var CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.';
                var params = getParams(editor);

                view.init();
                controller.init(CONFIRM_DISCARD_CHANGE_MESSAGE);
                presenter.init();

                var dataAccessObject = createDaoForEditor(
                    editor,
                    CONFIRM_DISCARD_CHANGE_MESSAGE,
                    history,
                    statusBar,
                    _.partial(setAnnotation, params.config)
                );

                loadOuterFiles(params, dataAccessObject);

                updateAPIs(dataAccessObject);
            };

        return {
            start: start
        };
    }(this);

    return this;
};
},{"./SpanConfig":10,"./component/DataAccessObject":11,"./component/StatusBar":13,"./model/Command":17,"./model/History":18,"./model/Model":20,"./presenter/Presenter":27,"./util/ajaxAccessor":39,"./util/getUrlParameters":48,"./view/View":58}],16:[function(require,module,exports){
var tool = require('./tool'),
    control = require('./control'),
    editor = require('./editor');

jQuery.fn.textae = (function() {
    return function() {
        if (this.hasClass("textae-editor")) {
            this.each(function() {
                var e = $(this);
                tool.pushEditor(e);
                editor.apply(e);
                e.api.start(e);
                return e;
            });
            tool.selectFirstEditor();
        } else if (this.hasClass("textae-control")) {
            var c = control(this);
            tool.setControl(c);
            return c;
        }
    };
})();
},{"./control":14,"./editor":15,"./tool":35}],17:[function(require,module,exports){
var invoke = function(commands) {
        commands.forEach(function(command) {
            command.execute();
        });
    },
    executeSubCommands = function(subCommands) {
        subCommands.forEach(function(command) {
            command.execute();
        });
    },
    RevertCommands = function(commands) {
        commands = Object.create(commands);
        commands.reverse();
        return commands.map(function(originCommand) {
            return originCommand.revert();
        });
    },
    invokeRevert = _.compose(invoke, RevertCommands),
    debugLog = function(message, object) {
        // For debug
        if (object) {
            console.log('[command.invoke]', message, object);
        } else {
            console.log('[command.invoke]', message);
        }
    },
    setRevertAndLog = function() {
        var log = function(prefix, param) {
                debugLog(prefix + param.commandType + ' a ' + param.modelType + ': ' + param.id);
            },
            doneLog = _.partial(log, ''),
            revertLog = _.partial(log, 'revert '),
            RevertFunction = function(subCommands, logParam) {
                var toRevert = function(command) {
                        return command.revert();
                    },
                    execute = function(command) {
                        command.execute();
                    },
                    revertedCommand = {
                        execute: function() {
                            invokeRevert(subCommands);
                            revertLog(logParam);
                        }
                    };

                return function() {
                    return revertedCommand;
                };
            },
            setRevert = function(modelType, command, commandType, id, subCommands) {
                var logParam = {
                    modelType: modelType,
                    commandType: commandType,
                    id: id
                };

                command.revert = new RevertFunction(subCommands, logParam);
                return logParam;
            };

        return _.compose(doneLog, setRevert);
    }(),
    updateSelection = function(model, modelType, newModel) {
        if (model.selectionModel[modelType]) {
            model.selectionModel[modelType].add(newModel.id);
        }
    };

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands. 
module.exports = function(editor, model, history, spanConfig) {
    var factory = function() {
        var idFactory = require('../util/IdFactory')(editor),
            createCommand = function(model, modelType, isSelectable, newModel) {
                return {
                    execute: function() {
                        // Update model
                        newModel = model.annotationData[modelType].add(newModel);

                        // Update Selection
                        if (isSelectable) updateSelection(model, modelType, newModel);

                        // Set revert
                        this.revert = _.partial(factory[modelType + 'RemoveCommand'], newModel.id);

                        debugLog('create a new ' + modelType + ': ', newModel);

                        return newModel;
                    }
                };
            },
            createCommandForModel = _.partial(createCommand, model),
            removeCommand = function(modelType, id) {
                return {
                    execute: function() {
                        // Update model
                        var oloModel = model.annotationData[modelType].remove(id);

                        if (oloModel) {
                            // Set revert
                            this.revert = _.partial(createCommandForModel, modelType, false, oloModel);
                            debugLog('remove a ' + modelType + ': ', oloModel);
                        } else {
                            // Do not revert unless an object was removed.
                            this.revert = function() {
                                return {
                                    execute: function() {}
                                };
                            };
                            debugLog('already removed ' + modelType + ': ', id);
                        }
                    },
                };
            },
            changeTypeCommand = function(modelType, id, newType) {
                return {
                    execute: function() {
                        var oldType = model.annotationData[modelType].get(id).type;

                        // Update model
                        var targetModel = model.annotationData[modelType].changeType(id, newType);

                        // Set revert
                        this.revert = _.partial(factory[modelType + 'ChangeTypeCommand'], id, oldType);

                        debugLog('change type of a ' + modelType + '. oldtype:' + oldType + ' ' + modelType + ':', targetModel);
                    }
                };
            },
            setRevertAndLogSpan = _.partial(setRevertAndLog, 'span'),
            spanCreateCommand = _.partial(createCommandForModel, 'span', true),
            entityCreateCommand = _.partial(createCommandForModel, 'entity', true),
            spanAndDefaultEntryCreateCommand = function(type, span) {
                var id = idFactory.makeSpanId(span),
                    createSpan = spanCreateCommand(span),
                    createEntity = entityCreateCommand({
                        span: id,
                        type: type
                    }),
                    subCommands = [createSpan, createEntity];

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLogSpan(this, 'create', id, subCommands);
                    }
                };
            },
            spanReplicateCommand = function(type, span) {
                var createSpan = _.partial(spanAndDefaultEntryCreateCommand, type),
                    subCommands = model
                    .getReplicationSpans(span, spanConfig)
                    .map(createSpan);

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLogSpan(this, 'replicate', span.id, subCommands);
                    }
                };
            },
            // The relaitonId is optional set only when revert of the relationRemoveCommand.
            // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
            relationCreateCommand = _.partial(createCommandForModel, 'relation', false),
            relationCreateAndSelectCommand = _.partial(createCommandForModel, 'relation', true),
            modificationRemoveCommand = _.partial(removeCommand, 'modification'),
            relationRemoveCommand = _.partial(removeCommand, 'relation'),
            relationAndAssociatesRemoveCommand = function(id) {
                var removeRelation = relationRemoveCommand(id),
                    removeModification = model.annotationData.getModificationOf(id)
                    .map(function(modification) {
                        return modification.id;
                    })
                    .map(modificationRemoveCommand),
                    subCommands = removeModification.concat(removeRelation);

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLog('relation', this, 'remove', id, subCommands);
                    }
                };

            },
            entityRemoveCommand = _.partial(removeCommand, 'entity'),
            entityAndAssociatesRemoveCommand = function(id) {
                var removeEntity = entityRemoveCommand(id),
                    removeRelation = model.annotationData.entity.assosicatedRelations(id)
                    .map(relationRemoveCommand),
                    removeModification = model.annotationData.getModificationOf(id)
                    .map(function(modification) {
                        return modification.id;
                    })
                    .map(modificationRemoveCommand),
                    subCommands = removeRelation.concat(removeModification).concat(removeEntity);

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLog('entity', this, 'remove', id, subCommands);
                    }
                };
            },
            spanRemoveCommand = function(id) {
                var removeSpan = _.partial(removeCommand, 'span')(id),
                    removeEntity = _.flatten(model.annotationData.span.get(id).getTypes().map(function(type) {
                        return type.entities.map(function(entityId) {
                            return entityAndAssociatesRemoveCommand(entityId);
                        });
                    })),
                    subCommands = removeEntity.concat(removeSpan);

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLogSpan(this, 'remove', id, subCommands);
                    }
                };
            },
            entityRemoveAndSpanRemeveIfNoEntityRestCommand = function(id) {
                var span = model.annotationData.span.get(model.annotationData.entity.get(id).span),
                    numberOfRestEntities = _.reject(
                        _.flatten(
                            span.getTypes()
                            .map(function(type) {
                                return type.entities;
                            })
                        ),
                        function(entityId) {
                            return entityId === id;
                        }
                    ).length;

                return numberOfRestEntities === 0 ?
                    spanRemoveCommand(span.id) :
                    entityAndAssociatesRemoveCommand(id);
            },
            entityChangeTypeCommand = _.partial(changeTypeCommand, 'entity'),
            entityChangeTypeRemoveRelationCommand = function(id, newType, isRemoveRelations) {
                var changeType = _.partial(changeTypeCommand, 'entity')(id, newType),
                    subCommands = isRemoveRelations ?
                    model.annotationData.entity.assosicatedRelations(id)
                    .map(relationRemoveCommand)
                    .concat(changeType) :
                    [changeType];

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLog('entity', this, 'change', id, subCommands);
                    }
                };
            },
            spanMoveCommand = function(spanId, newSpan) {
                var subCommands = [],
                    newSpanId = idFactory.makeSpanId(newSpan),
                    d = model.annotationData;

                if (!d.span.get(newSpanId)) {
                    subCommands.push(spanRemoveCommand(spanId));
                    subCommands.push(spanCreateCommand({
                        begin: newSpan.begin,
                        end: newSpan.end
                    }));
                    d.span.get(spanId).getTypes().forEach(function(type) {
                        type.entities.forEach(function(id) {
                            subCommands.push(entityCreateCommand({
                                id: id,
                                span: newSpanId,
                                type: type.name
                            }));

                            subCommands = subCommands.concat(
                                d.entity.assosicatedRelations(id)
                                .map(d.relation.get)
                                .map(relationCreateCommand)
                            );
                        });
                    });
                }

                return {
                    execute: function() {
                        executeSubCommands(subCommands);
                        setRevertAndLog('span', this, 'move', spanId, subCommands);
                    }
                };
            };

        return {
            spanCreateCommand: spanAndDefaultEntryCreateCommand,
            spanRemoveCommand: spanRemoveCommand,
            spanMoveCommand: spanMoveCommand,
            spanReplicateCommand: spanReplicateCommand,
            entityCreateCommand: entityCreateCommand,
            entityRemoveCommand: entityRemoveAndSpanRemeveIfNoEntityRestCommand,
            entityChangeTypeCommand: entityChangeTypeRemoveRelationCommand,
            relationCreateCommand: relationCreateAndSelectCommand,
            relationRemoveCommand: relationAndAssociatesRemoveCommand,
            relationChangeTypeCommand: _.partial(changeTypeCommand, 'relation'),
            modificationCreateCommand: _.partial(createCommandForModel, 'modification', false),
            modificationRemoveCommand: modificationRemoveCommand
        };
    }();

    return {
        invoke: function(commands) {
            if (commands && commands.length > 0) {
                invoke(commands);
                history.push(commands);
            }
        },
        undo: function() {
            return function() {
                if (history.hasAnythingToUndo()) {
                    model.selectionModel.clear();
                    invokeRevert(history.prev());
                }
            };
        }(),
        redo: function() {
            if (history.hasAnythingToRedo()) {
                model.selectionModel.clear();
                invoke(history.next());
            }
        },
        factory: factory
    };
};
},{"../util/IdFactory":38}],18:[function(require,module,exports){
// histories of edit to undo and redo.
module.exports = function() {
    var lastSaveIndex = -1,
        lastEditIndex = -1,
        history = [],
        hasAnythingToUndo = function() {
            return lastEditIndex > -1;
        },
        hasAnythingToRedo = function() {
            return lastEditIndex < history.length - 1;
        },
        hasAnythingToSave = function() {
            return lastEditIndex != lastSaveIndex;
        },
        trigger = function() {
            api.trigger('change', {
                hasAnythingToSave: hasAnythingToSave(),
                hasAnythingToUndo: hasAnythingToUndo(),
                hasAnythingToRedo: hasAnythingToRedo()
            });
        };

    var api = require('../util/extendBindable')({
        reset: function() {
            lastSaveIndex = -1;
            lastEditIndex = -1;
            history = [];
            trigger();
        },
        push: function(commands) {
            history.splice(lastEditIndex + 1, history.length - lastEditIndex, commands);
            lastEditIndex++;
            trigger();
        },
        next: function() {
            lastEditIndex++;
            trigger();
            return history[lastEditIndex];
        },
        prev: function() {
            var lastEdit = history[lastEditIndex];
            lastEditIndex--;
            trigger();
            return lastEdit;
        },
        saved: function() {
            lastSaveIndex = lastEditIndex;
            trigger();
        },
        hasAnythingToSave: hasAnythingToSave,
        hasAnythingToUndo: hasAnythingToUndo,
        hasAnythingToRedo: hasAnythingToRedo
    });

    return api;
};
},{"../util/extendBindable":47}],19:[function(require,module,exports){
module.exports = function(kindName) {
	var extendBindable = require('../util/extendBindable'),
		selected = {},
		triggerChange = function() {
			api.trigger(kindName + '.change');
		};

	var api = extendBindable({
		name: kindName,
		add: function(id) {
			selected[id] = id;
			api.trigger(kindName + '.add', id);
			triggerChange();
		},
		all: function() {
			return _.toArray(selected);
		},
		has: function(id) {
			return _.contains(selected, id);
		},
		some: function() {
			return _.some(selected);
		},
		single: function() {
			var array = api.all();
			return array.length === 1 ? array[0] : null;
		},
		toggle: function(id) {
			if (api.has(id)) {
				api.remove(id);
			} else {
				api.add(id);
			}
		},
		remove: function(id) {
			delete selected[id];
			api.trigger(kindName + '.remove', id);
			triggerChange();
		},
		clear: function() {
			if (!api.some()) return;

			_.each(api.all(), api.remove);
			selected = {};
			triggerChange();
		}
	});

	return api;
};
},{"../util/extendBindable":47}],20:[function(require,module,exports){
// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
var EntityContainer = function(editor, eventEmitter, relation) {
        var idFactory = require('../util/IdFactory')(editor),
            mappingFunction = function(denotations) {
                denotations = denotations || [];
                return denotations.map(function(entity) {
                    return {
                        id: entity.id,
                        span: idFactory.makeSpanId(entity.span),
                        type: entity.obj,
                    };
                });
            },
            entityContainer = require('./ModelContainer')(eventEmitter, 'entity', mappingFunction),
            api = _.extend(entityContainer, {
                add: _.compose(entityContainer.add, function(entity) {
                    if (entity.span) return entity;
                    throw new Error('entity has no span! ' + JSON.stringify(entity));
                }),
                assosicatedRelations: function(entityId) {
                    return relation.all().filter(function(r) {
                        return r.obj === entityId || r.subj === entityId;
                    }).map(function(r) {
                        return r.id;
                    });
                }
            });

        return api;
    },
    AnntationData = function(editor) {
        var originalData,
            extendBindable = require('../util/extendBindable'),
            eventEmitter = extendBindable({}),
            ModelContainerForAnnotationData = _.partial(require('./ModelContainer'), eventEmitter),
            paragraph = require('./ParagraphContainer')(editor, eventEmitter),
            span = require('./SpanContainer')(editor, eventEmitter, paragraph),
            relation = new ModelContainerForAnnotationData('relation', function(relations) {
                relations = relations || [];
                return relations.map(function(r) {
                    return {
                        id: r.id,
                        type: r.pred,
                        subj: r.subj,
                        obj: r.obj
                    };
                });
            }),
            entity = new EntityContainer(editor, eventEmitter, relation),
            modification = new ModelContainerForAnnotationData('modification', _.identity),
            dataStore = _.extend(eventEmitter, {
                span: span,
                entity: entity,
                relation: relation,
                modification: modification,
                paragraph: paragraph,
                sourceDoc: ''
            }),
            clearAnnotationData = _.compose(
                dataStore.span.clear,
                dataStore.entity.clear,
                dataStore.relation.clear,
                dataStore.modification.clear,
                dataStore.paragraph.clear
            );

        return _.extend(dataStore, {
            reset: function() {
                var setOriginalData = function(annotation) {
                        originalData = annotation;

                        return annotation;
                    },
                    parseBaseText = function(dataStore, annotation) {
                        var sourceDoc = annotation.text;

                        if (sourceDoc) {
                            // Parse a source document.
                            dataStore.sourceDoc = sourceDoc;

                            // Parse paragraphs
                            paragraph.addSource(sourceDoc);

                            eventEmitter.trigger('change-text', {
                                sourceDoc: sourceDoc,
                                paragraphs: paragraph.all()
                            });
                        } else {
                            throw "read failed.";
                        }

                        return annotation;
                    },
                    translateDenotation = function(prefix, src) {
                        return _.extend({}, src, {
                            id: prefix + src.id
                        });
                    },
                    translateRelation = function(prefix, src) {
                        return _.extend({}, src, {
                            id: prefix + src.id,
                            subj: prefix + src.subj,
                            obj: prefix + src.obj
                        });
                    },
                    translateModification = function(prefix, src) {
                        return _.extend({}, src, {
                            id: prefix + src.id,
                            obj: prefix + src.obj
                        });
                    },
                    doPrefix = function(origin, translater, prefix) {
                        prefix = prefix || '';
                        return origin && translater ?
                            origin.map(_.partial(translater, prefix)) :
                            origin;
                    },
                    // Expected denotations is an Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
                    parseDenotations = function(dataStore, annotation, prefix) {
                        var denotations = doPrefix(annotation.denotations, translateDenotation, prefix);
                        dataStore.span.addSource(denotations);
                        dataStore.entity.addSource(denotations);
                        return annotation;
                    },
                    // Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
                    parseRelations = function(dataStore, annotation, prefix) {
                        var relations = doPrefix(annotation.relations, translateRelation, prefix);
                        dataStore.relation.addSource(relations);
                        return annotation;
                    },
                    // Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
                    parseModifications = function(dataStore, annotation, prefix) {
                        var modifications = doPrefix(annotation.modifications, translateModification, prefix);
                        dataStore.modification.addSource(modifications);
                        return annotation;
                    },
                    parseAnnotations = function(dataStore, annotation, prefix) {
                        parseDenotations(dataStore, annotation, prefix);
                        parseRelations(dataStore, annotation, prefix);
                        parseModifications(dataStore, annotation, prefix);
                        return annotation;
                    },
                    parseTracks = function(dataStore, annotation) {
                        if (annotation.tracks) {
                            annotation.tracks
                                .forEach(function(track, i) {
                                    var prefix = 'track' + (i + 1) + '_';
                                    parseAnnotations(dataStore, track, prefix);
                                });

                            delete annotation.tracks;
                        }
                        return annotation;
                    },
                    parseConfig = function(dataStore, annotation) {
                        dataStore.config = annotation.config;

                        return annotation;
                    };

                return function(annotation) {
                    var setNewData = _.compose(
                        _.partial(parseConfig, dataStore),
                        _.partial(parseAnnotations, dataStore),
                        _.partial(parseTracks, dataStore),
                        _.partial(parseBaseText, dataStore),
                        setOriginalData);

                    try {
                        clearAnnotationData();
                        setNewData(annotation);
                        eventEmitter.trigger('all.change', eventEmitter);
                    } catch (error) {
                        console.error(error, error.stack);
                    }
                };
            }(),
            toJson: function() {
                var denotations = entity.all()
                    .filter(function(entity) {
                        // Span may be not exists, because crossing spans are not add to the dataStore.
                        return span.get(entity.span);
                    })
                    .map(function(entity) {
                        var currentSpan = span.get(entity.span);
                        return {
                            'id': entity.id,
                            'span': {
                                'begin': currentSpan.begin,
                                'end': currentSpan.end
                            },
                            'obj': entity.type
                        };
                    });

                return JSON.stringify($.extend(originalData, {
                    'denotations': denotations,
                    'relations': relation.all().map(function(r) {
                        return {
                            id: r.id,
                            pred: r.type,
                            subj: r.subj,
                            obj: r.obj
                        };
                    }),
                    'modifications': modification.all()
                }));
            },
            isBoundaryCrossingWithOtherSpans: _.partial(require('./isBoundaryCrossingWithOtherSpans'), span.all),
            getModificationOf: function(objectId) {
                return modification.all()
                    .filter(function(m) {
                        return m.obj === objectId;
                    });
            }
        });
    };

module.exports = function(editor) {
    var annotationData = new AnntationData(editor),
        getReplicationSpans = function(dataStore, originSpan, spanConfig) {
            // Get spans their stirng is same with the originSpan from sourceDoc.
            var getSpansTheirStringIsSameWith = function(originSpan) {
                var getNextStringIndex = String.prototype.indexOf.bind(dataStore.sourceDoc, dataStore.sourceDoc.substring(originSpan.begin, originSpan.end));
                var length = originSpan.end - originSpan.begin;

                var findStrings = [];
                var offset = 0;
                for (var index = getNextStringIndex(offset); index !== -1; index = getNextStringIndex(offset)) {
                    findStrings.push({
                        begin: index,
                        end: index + length
                    });

                    offset = index + length;
                }
                return findStrings;
            };

            // The candidateSpan is a same span when begin is same.
            // Because string of each others are same. End of them are same too.
            var isOriginSpan = function(candidateSpan) {
                return candidateSpan.begin === originSpan.begin;
            };

            // The preceding charactor and the following of a word charactor are delimiter.
            // For example, 't' ,a part of 'that', is not same with an origin span when it is 't'. 
            var isWord = function(candidateSpan) {
                var precedingChar = dataStore.sourceDoc.charAt(candidateSpan.begin - 1);
                var followingChar = dataStore.sourceDoc.charAt(candidateSpan.end);

                return spanConfig.isDelimiter(precedingChar) && spanConfig.isDelimiter(followingChar);
            };

            // Is the candidateSpan is spaned already?
            var isAlreadySpaned = function(candidateSpan) {
                return dataStore.span.all().filter(function(existSpan) {
                    return existSpan.begin === candidateSpan.begin && existSpan.end === candidateSpan.end;
                }).length > 0;
            };

            return getSpansTheirStringIsSameWith(originSpan).filter(function(span) {
                return !isOriginSpan(span) && isWord(span) && !isAlreadySpaned(span) && !dataStore.isBoundaryCrossingWithOtherSpans(span);
            });
        };

    return {
        annotationData: annotationData,
        // A contaier of selection state.
        selectionModel: require('./Selection')(['span', 'entity', 'relation']),
        getReplicationSpans: _.partial(getReplicationSpans, annotationData)
    };
};
},{"../util/IdFactory":38,"../util/extendBindable":47,"./ModelContainer":21,"./ParagraphContainer":22,"./Selection":23,"./SpanContainer":24,"./isBoundaryCrossingWithOtherSpans":25}],21:[function(require,module,exports){
var createId = function(prefix, getIdsFunction) {
		var ids = getIdsFunction()
			.filter(function(id) {
				return id[0] === prefix;
			})
			.map(function(id) {
				return id.slice(1);
			});

		// The Math.max retrun -Infinity when the second argument array is empty.
		return prefix + (ids.length === 0 ? 1 : Math.max.apply(null, ids) + 1);
	},
	ERROR_MESSAGE = 'Set the mappingFunction by the constructor to use the method "ModelContainer.setSource".';

module.exports = function(eventEmitter, prefix, mappingFunction) {
	var contaier = {},
		getIds = function() {
			return Object.keys(contaier);
		},
		getNewId = _.partial(createId, prefix ? prefix.charAt(0).toUpperCase() : '', getIds),
		add = function(model) {
			// Overwrite to revert
			model.id = model.id || getNewId();
			contaier[model.id] = model;
			return model;
		},
		concat = function(collection) {
			if (collection) collection.forEach(add);
		},
		get = function(id) {
			return contaier[id];
		},
		all = function() {
			return _.map(contaier, _.identity);
		},
		clear = function() {
			contaier = {};
		};

	return {
		name: prefix,
		addSource: function(source) {
			if (!_.isFunction(mappingFunction)) {
				throw new Error(ERROR_MESSAGE);
			}

			concat(mappingFunction(source));
		},
		add: function(model, doAfter) {
			var newModel = add(model);
			if (_.isFunction(doAfter)) doAfter();

			return eventEmitter.trigger(prefix + '.add', newModel);
		},
		get: get,
		all: all,
		some: function() {
			return _.some(contaier);
		},
		types: function() {
			return all().map(function(model) {
				return model.type;
			});
		},
		changeType: function(id, newType) {
			var model = get(id);
			model.type = newType;
			eventEmitter.trigger(prefix + '.change', model);
			return model;
		},
		remove: function(id) {
			var model = contaier[id];
			if (model) {
				delete contaier[id];
				eventEmitter.trigger(prefix + '.remove', model);
			}
			return model;
		},
		clear: clear
	};
};
},{}],22:[function(require,module,exports){
module.exports = function(editor, annotationDataApi) {
	var idFactory = require('../util/IdFactory')(editor),
		mappingFunction = function(sourceDoc) {
			sourceDoc = sourceDoc || [];
			var textLengthBeforeThisParagraph = 0;

			return sourceDoc.split("\n")
				.map(function(p, index) {
					var ret = {
						id: idFactory.makeParagraphId(index),
						begin: textLengthBeforeThisParagraph,
						end: textLengthBeforeThisParagraph + p.length,
					};

					textLengthBeforeThisParagraph += p.length + 1;
					return ret;
				});
		},
		contaier = require('./ModelContainer')(annotationDataApi, 'paragraph', mappingFunction),
		api = _.extend(contaier, {
			//get the paragraph that span is belong to.
			getBelongingTo: function(span) {
				var match = contaier.all().filter(function(p) {
					return span.begin >= p.begin && span.end <= p.end;
				});

				if (match.length === 0) {
					throw new Error('span should belong to any paragraph.');
				} else {
					return match[0];
				}
			}
		});

	return api;
};
},{"../util/IdFactory":38,"./ModelContainer":21}],23:[function(require,module,exports){
var clearAll = function(containerList) {
		_.each(containerList, function(container) {
			container.clear();
		});
	},
	someAll = function(containerList) {
		return containerList
			.map(function(container) {
				return container.some();
			})
			.reduce(function(a, b) {
				return a || b;
			});

	},
	relayEventsOfEachContainer = function(api) {
		_.each(api, function(container) {
			container
				.bind(container.name + '.change', function() {
					api.trigger(container.name + '.change');
				})
				.bind(container.name + '.add', function(id) {
					api.trigger(container.name + '.select', id);
				})
				.bind(container.name + '.remove', function(id) {
					api.trigger(container.name + '.deselect', id);
				});
		});
	},
	extendUtilFunctions = function(containerList, api) {
		return _.extend(api, {
			clear: _.partial(clearAll, containerList),
			some: _.partial(someAll, containerList)
		});
	};

module.exports = function(kinds) {
	var containerList = kinds.map(require('./IdContainer')),
		api = require('../util/extendBindable')(
			containerList
			.reduce(function(a, b) {
				a[b.name] = b;
				return a;
			}, {})
		);

	relayEventsOfEachContainer(api);

	return extendUtilFunctions(containerList, api);
};
},{"../util/extendBindable":47,"./IdContainer":19}],24:[function(require,module,exports){
module.exports = function(editor, annotationDataApi, paragraph) {
	var idFactory = require('../util/IdFactory')(editor),
		toSpanModel = function() {
			var spanExtension = {
				isChildOf: function(maybeParent) {
					if (!maybeParent) return false;

					var id = idFactory.makeSpanId(maybeParent);
					if (!spanContainer.get(id)) throw new Error('maybeParent is removed. ' + maybeParent.toStringOnlyThis());

					return maybeParent.begin <= this.begin && this.end <= maybeParent.end;
				},
				//for debug. print myself only.
				toStringOnlyThis: function() {
					return "span " + this.begin + ":" + this.end + ":" + annotationDataApi.sourceDoc.substring(this.begin, this.end);
				},
				//for debug. print with children.
				toString: function(depth) {
					depth = depth || 1; //default depth is 1

					var childrenString = this.children && this.children.length > 0 ?
						"\n" + this.children.map(function(child) {
							return new Array(depth + 1).join("\t") + child.toString(depth + 1);
						}).join("\n") : "";

					return this.toStringOnlyThis() + childrenString;
				},
				// A big brother is brother node on a structure at rendered.
				// There is no big brother if the span is first in a paragraph.
				// Warning: parent is set at updateSpanTree, is not exists now.
				getBigBrother: function() {
					var index;
					if (this.parent) {
						index = this.parent.children.indexOf(this);
						return index === 0 ? null : this.parent.children[index - 1];
					} else {
						index = spanTopLevel.indexOf(this);
						return index === 0 || spanTopLevel[index - 1].paragraph !== this.paragraph ? null : spanTopLevel[index - 1];
					}
				},
				// Get online for update is not grantieed.
				getTypes: function() {
					var spanId = this.id;

					// Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"] }.
					return annotationDataApi.entity.all()
						.filter(function(entity) {
							return spanId === entity.span;
						})
						.reduce(function(a, b) {
							var typeId = idFactory.makeTypeId(b.span, b.type);

							var type = a.filter(function(type) {
								return type.id === typeId;
							});

							if (type.length > 0) {
								type[0].entities.push(b.id);
							} else {
								a.push({
									id: typeId,
									name: b.type,
									entities: [b.id]
								});
							}
							return a;
						}, []);
				},
				getEntities: function() {
					return _.flatten(this.getTypes().map(function(type) {
						return type.entities;
					}));
				}
			};

			return function(span) {
				return $.extend({},
					span, {
						id: idFactory.makeSpanId(span),
						paragraph: paragraph.getBelongingTo(span),
					},
					spanExtension);
			};
		}(),
		isBoundaryCrossingWithOtherSpans = require('./isBoundaryCrossingWithOtherSpans'),
		mappingFunction = function(denotations) {
			denotations = denotations || [];
			return denotations.map(function(entity) {
					return entity.span;
				}).map(toSpanModel)
				.filter(function(span, index, array) {
					return !isBoundaryCrossingWithOtherSpans(
						function() {
							return array.slice(0, index - 1);
						}, span);
				});
		},
		spanContainer = require('./ModelContainer')(annotationDataApi, 'span', mappingFunction),
		spanTopLevel = [],
		adopt = function(parent, span) {
			parent.children.push(span);
			span.parent = parent;
		},
		getParet = function(parent, span) {
			if (span.isChildOf(parent)) {
				return parent;
			} else {
				if (parent.parent) {
					return getParet(parent.parent, span);
				} else {
					return null;
				}
			}
		},
		updateSpanTree = function() {
			// Sort id of spans by the position.
			var sortedSpans = spanContainer.all().sort(spanComparator);

			// the spanTree has parent-child structure.
			var spanTree = [];

			sortedSpans
				.map(function(span, index, array) {
					return $.extend(span, {
						// Reset parent
						parent: null,
						// Reset children
						children: [],
						// Order by position
						left: index !== 0 ? array[index - 1] : null,
						right: index !== array.length - 1 ? array[index + 1] : null,
					});
				})
				.forEach(function(span) {
					if (span.left) {
						var parent = getParet(span.left, span);
						if (parent) {
							adopt(parent, span);
						} else {
							spanTree.push(span);
						}
					} else {
						spanTree.push(span);
					}
				});

			//this for debug.
			spanTree.toString = function() {
				return this.map(function(span) {
					return span.toString();
				}).join("\n");
			};
			// console.log(spanTree.toString());

			spanTopLevel = spanTree;
		},
		spanComparator = function(a, b) {
			return a.begin - b.begin || b.end - a.end;
		},
		api = {

			//expected span is like { "begin": 19, "end": 49 }
			add: function(span) {
				if (span)
					return spanContainer.add(toSpanModel(span), updateSpanTree);
				throw new Error('span is undefined.');
			},
			addSource: function(spans) {
				spanContainer.addSource(spans);
				updateSpanTree();
			},
			get: function(spanId) {
				return spanContainer.get(spanId);
			},
			all: spanContainer.all,
			range: function(firstId, secondId) {
				var first = spanContainer.get(firstId);
				var second = spanContainer.get(secondId);

				//switch if seconfId before firstId
				if (spanComparator(first, second) > 0) {
					var temp = first;
					first = second;
					second = temp;
				}

				return spanContainer.all()
					.filter(function(span) {
						return first.begin <= span.begin && span.end <= second.end;
					})
					.map(function(span) {
						return span.id;
					});
			},
			topLevel: function() {
				return spanTopLevel;
			},
			multiEntities: function() {
				return spanContainer.all()
					.filter(function(span) {
						var multiEntitiesTypes = span.getTypes().filter(function(type) {
							return type.entities.length > 1;
						});

						return multiEntitiesTypes.length > 0;
					});
			},
			remove: spanContainer.remove,
			clear: function() {
				spanContainer.clear();
				spanTopLevel = [];
			}
		};

	return api;
};
},{"../util/IdFactory":38,"./ModelContainer":21,"./isBoundaryCrossingWithOtherSpans":25}],25:[function(require,module,exports){
// A span its range is coross over with other spans are not able to rendered.
// Because spans are renderd with span tag. Html tags can not be cross over.
module.exports = function(getAll, candidateSpan) {
	return getAll().filter(function(existSpan) {
		return (existSpan.begin < candidateSpan.begin && candidateSpan.begin < existSpan.end && existSpan.end < candidateSpan.end) ||
			(candidateSpan.begin < existSpan.begin && existSpan.begin < candidateSpan.end && candidateSpan.end < existSpan.end);
	}).length > 0;
};
},{}],26:[function(require,module,exports){
var typeGap = function() {
	var seed = {
			instanceHide: 0,
			instanceShow: 2
		},
		set = function(mode, val) {
			typeGap[mode] = val;
			return val;
		},
		api = _.extend({}, seed),
		capitalize = require('../util/capitalize');

	_.each(seed, function(val, key) {
		api['set' + capitalize(key)] = _.partial(set, key);
	});

	return api;
}();

module.exports = function(model, viewMode, typeEditor) {
	var api = {
			init: function() {
				viewMode.changeTypeGap(-1);
				_.extend(api, state.init);
			},
			get typeGap() {
				return viewMode.getTypeGapValue();
			},
			get lineHeight() {
				return Math.floor(viewMode.getLineHeight());
			},
			changeLineHeight: viewMode.changeLineHeight
		},
		resetView = function() {
			typeEditor.hideDialogs();
			model.selectionModel.clear();
		},
		transition = {
			toTerm: function() {
				resetView();

				typeEditor.editEntity();
				viewMode.setTerm();
				viewMode.setEditable(true);
				viewMode.changeTypeGap(typeGap.instanceHide);

				_.extend(api, state.termCentric);
			},
			toInstance: function() {
				resetView();

				typeEditor.editEntity();
				viewMode.setInstance();
				viewMode.setEditable(true);
				viewMode.changeTypeGap(typeGap.instanceShow);

				_.extend(api, state.instanceRelation);
			},
			toRelation: function() {
				resetView();

				typeEditor.editRelation();
				viewMode.setRelation();
				viewMode.setEditable(true);
				viewMode.changeTypeGap(typeGap.instanceShow);

				_.extend(api, state.relationEdit);
			},
			toViewTerm: function() {
				resetView();

				typeEditor.noEdit();
				viewMode.setTerm();
				viewMode.setEditable(false);
				viewMode.changeTypeGap(typeGap.instanceHide);

				_.extend(api, state.viewTerm);
			},
			toViewInstance: function() {
				resetView();

				typeEditor.noEdit();
				viewMode.setInstance();
				viewMode.setEditable(false);
				viewMode.changeTypeGap(typeGap.instanceShow);

				_.extend(api, state.viewInstance);
			}
		},
		// Calculate the line-height when the view-mode set
		notTransit = function() {
			console.log('no mode transition.', this.name);
		},
		changeTypeGapInstanceHide = _.compose(viewMode.changeTypeGap, typeGap.setInstanceHide),
		changeTypeGapInstanceShow = _.compose(viewMode.changeTypeGap, typeGap.setInstanceShow),
		state = {
			init: _.extend({}, transition, {
				name: 'Init'
			}),
			termCentric: _.extend({}, transition, {
				name: 'Term Centric',
				toTerm: notTransit,
				changeTypeGap: changeTypeGapInstanceHide,
				showInstance: false
			}),
			instanceRelation: _.extend({}, transition, {
				name: 'Instance / Relation',
				toInstance: notTransit,
				changeTypeGap: changeTypeGapInstanceShow,
				showInstance: true
			}),
			relationEdit: _.extend({}, transition, {
				name: 'Relation Edit',
				toRelation: notTransit,
				changeTypeGap: changeTypeGapInstanceShow,
				showInstance: true
			}),
			viewTerm: _.extend({}, transition, {
				name: 'View Only',
				toTerm: notTransit,
				toInstance: transition.toViewInstance,
				toRelation: notTransit,
				toViewTerm: notTransit,
				changeTypeGap: changeTypeGapInstanceHide,
				showInstance: false
			}),
			viewInstance: _.extend({}, transition, {
				name: 'View Only',
				toTerm: transition.toViewTerm,
				toInstance: notTransit,
				toRelation: notTransit,
				toViewInstance: notTransit,
				changeTypeGap: changeTypeGapInstanceShow,
				showInstance: true
			})
		};

	return api;
};
},{"../util/capitalize":40}],27:[function(require,module,exports){
module.exports = function(editor, model, view, command, spanConfig) {
    var editorSelected = function() {
            userEvent.viewHandler.hideDialogs();

            // Select this editor.
            editor.eventEmitter.trigger('textae.editor.select');
            view.viewModel.buttonStateHelper.propagate();
        },
        typeEditor = require('./TypeEditor')(editor, model, spanConfig, command, view.viewModel, view.typeContainer),
        userEvent = function() {
            var editHandler = function() {
                    var toggleModification = function(modificationType) {
                        var isModificationType = function(modification) {
                                return modification.pred === modificationType;
                            },
                            getSpecificModification = function(id) {
                                return model.annotationData
                                    .getModificationOf(id)
                                    .filter(isModificationType);
                            },
                            commands,
                            has = view.viewModel.modeAccordingToButton[modificationType.toLowerCase()].value();

                        if (has) {
                            commands = typeEditor.getSelectedIdEditable().map(function(id) {
                                var modification = getSpecificModification(id)[0];
                                return command.factory.modificationRemoveCommand(modification.id);
                            });
                        } else {
                            commands = _.reject(typeEditor.getSelectedIdEditable(), function(id) {
                                return getSpecificModification(id).length > 0;
                            }).map(function(id) {
                                return command.factory.modificationCreateCommand({
                                    obj: id,
                                    pred: modificationType
                                });
                            });
                        }

                        command.invoke(commands);
                    };

                    return {
                        replicate: function() {
                            var spanId = model.selectionModel.span.single();
                            if (spanId) {
                                command.invoke(
                                    [command.factory.spanReplicateCommand(
                                        view.typeContainer.entity.getDefaultType(),
                                        model.annotationData.span.get(spanId)
                                    )]
                                );
                            } else {
                                alert('You can replicate span annotation when there is only span selected.');
                            }
                        },
                        createEntity: function() {
                            var commands = model.selectionModel.span.all().map(function(spanId) {
                                return command.factory.entityCreateCommand({
                                    span: spanId,
                                    type: view.typeContainer.entity.getDefaultType()
                                });
                            });

                            command.invoke(commands);
                        },
                        newLabel: function() {
                            if (model.selectionModel.entity.some() || model.selectionModel.relation.some()) {
                                var newTypeLabel = prompt("Please enter a new label", "");
                                if (newTypeLabel) {
                                    typeEditor.setNewType(newTypeLabel);
                                }
                            }
                        },
                        negation: _.partial(toggleModification, 'Negation'),
                        speculation: _.partial(toggleModification, 'Speculation'),
                        removeSelectedElements: function() {
                            var removeCommand = function() {
                                var spanIds = [],
                                    entityIds = [],
                                    relationIds = [];

                                return {
                                    addSpanId: function(spanId) {
                                        spanIds.push(spanId);
                                    },
                                    addEntityId: function(entityId) {
                                        entityIds.push(entityId);
                                    },
                                    addRelations: function(addedRelations) {
                                        relationIds = relationIds.concat(addedRelations);
                                    },
                                    getAll: function() {
                                        return _.uniq(relationIds).map(command.factory.relationRemoveCommand)
                                            .concat(
                                                _.uniq(entityIds).map(function(entity) {
                                                    // Wrap by a anonymous function, because command.factory.entityRemoveCommand has two optional arguments.
                                                    return command.factory.entityRemoveCommand(entity);
                                                }),
                                                _.uniq(spanIds).map(command.factory.spanRemoveCommand));
                                    },
                                };
                            }();

                            //remove spans
                            model.selectionModel.span.all().forEach(function(spanId) {
                                removeCommand.addSpanId(spanId);
                            });

                            //remove entities
                            model.selectionModel.entity.all().forEach(function(entityId) {
                                removeCommand.addEntityId(entityId);
                            });

                            //remove relations
                            removeCommand.addRelations(model.selectionModel.relation.all());

                            command.invoke(removeCommand.getAll());
                        },
                        copyEntities: function() {
                            // Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
                            view.clipBoard.clipBoard = _.uniq(
                                function getEntitiesFromSelectedSpan() {
                                    return _.flatten(model.selectionModel.span.all().map(function(spanId) {
                                        return model.annotationData.span.get(spanId).getEntities();
                                    }));
                                }().concat(
                                    model.selectionModel.entity.all()
                                )
                            ).map(function(entityId) {
                                // Map entities to types, because entities may be delete.
                                return model.annotationData.entity.get(entityId).type;
                            });
                        },
                        pasteEntities: function() {
                            // Make commands per selected spans from types in clipBoard. 
                            var commands = _.flatten(model.selectionModel.span.all().map(function(spanId) {
                                return view.clipBoard.clipBoard.map(function(type) {
                                    return command.factory.entityCreateCommand({
                                        span: spanId,
                                        type: type
                                    });
                                });
                            }));

                            command.invoke(commands);
                        }
                    };
                }(),
                viewHandler = function() {
                    var editMode = require('./EditMode')(model, view.viewMode, typeEditor),
                        setViewMode = function(mode) {
                            if (editMode['to' + mode]) {
                                editMode['to' + mode]();
                            }
                        };

                    return {
                        showPallet: typeEditor.showPallet,
                        hideDialogs: typeEditor.hideDialogs,
                        cancelSelect: typeEditor.cancelSelect,
                        selectLeftSpan: function() {
                            var spanId = model.selectionModel.span.single();
                            if (spanId) {
                                var span = model.annotationData.span.get(spanId);
                                model.selectionModel.clear();
                                if (span.left) {
                                    model.selectionModel.span.add(span.left.id);
                                }
                            }
                        },
                        selectRightSpan: function() {
                            var spanId = model.selectionModel.span.single();
                            if (spanId) {
                                var span = model.annotationData.span.get(spanId);
                                model.selectionModel.clear();
                                if (span.right) {
                                    model.selectionModel.span.add(span.right.id);
                                }
                            }
                        },
                        showSettingDialog: require('./SettingDialog')(editor, editMode),
                        toggleRelationEditMode: function() {
                            // ビューモードを切り替える
                            if (view.viewModel.modeAccordingToButton['relation-edit-mode'].value()) {
                                editMode.toInstance();
                            } else {
                                editMode.toRelation();
                            }
                        },
                        bindChangeViewMode: function() {
                            var changeViewMode = function(prefix) {
                                editMode.init();

                                // Change view mode accoding to the annotation data.
                                if (model.annotationData.relation.some() || model.annotationData.span.multiEntities().length > 0) {
                                    setViewMode(prefix + 'Instance');
                                } else {
                                    setViewMode(prefix + 'Term');
                                }
                            };

                            return function(mode) {
                                var prefix = mode === 'edit' ? '' : 'View';
                                model.annotationData.bind('all.change', _.partial(changeViewMode, prefix));
                            };
                        }()
                    };
                }();

            return {
                // User event to edit model
                editHandler: editHandler,
                // User event that does not change data.
                viewHandler: viewHandler
            };
        }();

    return {
        init: function() {
            // The jsPlumbConnetion has an original event mecanism.
            // We can only bind the connection directory.
            editor
                .on('textae.editor.jsPlumbConnection.add', function(event, jsPlumbConnection) {
                    jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked);
                });

            // Set cursor control by view rendering events.
            var cursorChanger = require('../util/CursorChanger')(editor);
            view
                .bind('render.start', function(editor) {
                    console.log(editor.editorId, 'render.start');
                    cursorChanger.startWait();
                })
                .bind('render.end', function(editor) {
                    console.log(editor.editorId, 'render.end');
                    cursorChanger.endWait();
                });
        },
        setMode: userEvent.viewHandler.bindChangeViewMode,
        event: {
            editorSelected: editorSelected,
            redraw: view.updateDisplay,
            copyEntities: userEvent.editHandler.copyEntities,
            removeSelectedElements: userEvent.editHandler.removeSelectedElements,
            createEntity: userEvent.editHandler.createEntity,
            showPallet: userEvent.viewHandler.showPallet,
            replicate: userEvent.editHandler.replicate,
            pasteEntities: userEvent.editHandler.pasteEntities,
            newLabel: userEvent.editHandler.newLabel,
            cancelSelect: userEvent.viewHandler.cancelSelect,
            selectLeftSpan: userEvent.viewHandler.selectLeftSpan,
            selectRightSpan: userEvent.viewHandler.selectRightSpan,
            toggleRelationEditMode: userEvent.viewHandler.toggleRelationEditMode,
            negation: userEvent.editHandler.negation,
            speculation: userEvent.editHandler.speculation,
            showSettingDialog: userEvent.viewHandler.showSettingDialog
        }
    };
};
},{"../util/CursorChanger":36,"./EditMode":26,"./SettingDialog":29,"./TypeEditor":32}],28:[function(require,module,exports){
module.exports = function(editor, model, spanConfig, command, viewModel, typeContainer) {
	var selectionValidator = function(editor, model, spanConfig) {
			var selectPosition = require('./selectPosition'),
				domUtil = require('../util/DomUtil')(editor),
				hasCharacters = function(selection) {
					var positions = selectPosition.toPositions(model.annotationData, selection);

					// A span cannot be created include nonEdgeCharacters only.
					var stringWithoutNonEdgeCharacters = model.annotationData.sourceDoc.substring(positions.anchorPosition, positions.focusPosition);
					spanConfig.nonEdgeCharacters.forEach(function(char) {
						stringWithoutNonEdgeCharacters = stringWithoutNonEdgeCharacters.replace(char, '');
					});

					return stringWithoutNonEdgeCharacters.length > 0;
				},
				isInOneParent = function(selection) {
					// A span can be created at the same parent node.
					// The parentElement is expected as a paragraph or a span.
					return selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id;
				},
				getAnchorNodeParent = function(selection) {
					return $(selection.anchorNode.parentNode);
				},
				getFocusNodeParent = function(selection) {
					return $(selection.focusNode.parentNode);
				},
				hasSpan = function($node) {
					return $node.hasClass('textae-editor__span');
				},
				hasParagraphs = function($node) {
					return $node.hasClass('textae-editor__body__text-box__paragraph');
				},
				hasSpanOrParagraphs = function($node) {
					return hasSpan($node) || hasParagraphs($node);
				},
				isAnchrNodeInSpan = _.compose(hasSpan, getAnchorNodeParent),
				isFocusNodeInSpan = _.compose(hasSpan, getFocusNodeParent),
				isFocusNodeInParagraph = _.compose(hasParagraphs, getFocusNodeParent),
				isAnchrNodeInSpanOrParagraph = _.compose(hasSpanOrParagraphs, getAnchorNodeParent),
				isInSameParagraph = function() {
					var getParagraph = function($node) {
							if (hasParagraphs($node)) {
								return $node;
							} else {
								return getParagraph($node.parent());
							}
						},
						getParagraphId = function(selection, position) {
							var $parent = $(selection[position + 'Node'].parentNode);
							return getParagraph($parent).attr('id');
						};

					return function(selection) {
						var anchorParagraphId = getParagraphId(selection, 'anchor'),
							focusParagraphId = getParagraphId(selection, 'focus');

						return anchorParagraphId === focusParagraphId;
					};
				}(),
				isAnchorOneDownUnderForcus = function(selection) {
					return selection.anchorNode.parentNode.parentNode === selection.focusNode.parentNode;
				},
				isForcusOneDownUnderAnchor = function(selection) {
					return selection.anchorNode.parentNode === selection.focusNode.parentNode.parentNode;
				},
				isInSelectedSpan = function(position) {
					var spanId = model.selectionModel.span.single();
					if (spanId) {
						var selectedSpan = model.annotationData.span.get(spanId);
						return selectedSpan.begin < position && position < selectedSpan.end;
					}
					return false;
				},
				isAnchorInSelectedSpan = function(selection) {
					return isInSelectedSpan(selectPosition.getAnchorPosition(model.annotationData, selection));
				},
				isFocusOnSelectedSpan = function(selection) {
					return selection.focusNode.parentNode.id === model.selectionModel.span.single();
				},
				isFocusInSelectedSpan = function(selection) {
					return isInSelectedSpan(selectPosition.getFocusPosition(model.annotationData, selection));
				},
				isSelectedSpanOneDownUnderFocus = function(selection) {
					var selectedSpanId = model.selectionModel.span.single();
					return domUtil.selector.span.get(selectedSpanId).parent().attr('id') === selection.focusNode.parentNode.id;
				},
				isLongerThanParentSpan = function(selection) {
					var $getAnchorNodeParent = getAnchorNodeParent(selection),
						focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

					if (hasSpan($getAnchorNodeParent) && $getAnchorNodeParent.parent() && hasSpan($getAnchorNodeParent.parent())) {
						var span = model.annotationData.span.get($getAnchorNodeParent.parent().attr('id'));
						if (focusPosition < span.begin || span.end < focusPosition)
							return true;
					}
				},
				isShorterThanChildSpan = function(selection) {
					var $getFocusNodeParent = getFocusNodeParent(selection),
						anchorPosition = selectPosition.getAnchorPosition(model.annotationData, selection);

					if (hasSpan($getFocusNodeParent) && $getFocusNodeParent.parent() && hasSpan($getFocusNodeParent.parent())) {
						var span = model.annotationData.span.get($getFocusNodeParent.parent().attr('id'));
						if (anchorPosition < span.begin || span.end < anchorPosition)
							return true;
					}
				};

			return {
				hasCharacters: hasCharacters,
				isInOneParent: isInOneParent,
				isAnchrNodeInSpan: isAnchrNodeInSpan,
				isAnchrNodeInSpanOrParagraph: isAnchrNodeInSpanOrParagraph,
				isFocusNodeInSpan: isFocusNodeInSpan,
				isFocusNodeInParagraph: isFocusNodeInParagraph,
				isInSameParagraph: isInSameParagraph,
				isAnchorOneDownUnderForcus: isAnchorOneDownUnderForcus,
				isForcusOneDownUnderAnchor: isForcusOneDownUnderAnchor,
				isAnchorInSelectedSpan: isAnchorInSelectedSpan,
				isFocusOnSelectedSpan: isFocusOnSelectedSpan,
				isFocusInSelectedSpan: isFocusInSelectedSpan,
				isSelectedSpanOneDownUnderFocus: isSelectedSpanOneDownUnderFocus,
				isLongerThanParentSpan: isLongerThanParentSpan,
				isShorterThanChildSpan: isShorterThanChildSpan
			};
		}(editor, model, spanConfig),
		dismissBrowserSelection = require('./dismissBrowserSelection'),
		validate = function(selectionValidator) {
			var boundaryMiss = function() {
					alert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
					dismissBrowserSelection();
				},
				doUnless = function(doFunc, predicate, selection) {
					if (selection && !predicate(selection)) {
						return doFunc();
					}
					return selection;
				},
				cancelSelectionUnless = _.partial(doUnless, dismissBrowserSelection),
				validateAnchrNodeInSpanOrParagraph = _.partial(
					cancelSelectionUnless,
					selectionValidator.isAnchrNodeInSpanOrParagraph
				),
				validateFocusNodeInParagraph = _.partial(
					cancelSelectionUnless,
					selectionValidator.isFocusNodeInParagraph
				),
				validateFocusNodeInSpan = _.partial(
					cancelSelectionUnless,
					selectionValidator.isFocusNodeInSpan
				),
				validateInSameParagrarh = _.partial(
					doUnless,
					boundaryMiss,
					selectionValidator.isInSameParagraph
				),
				validateHasCharactor = _.partial(
					cancelSelectionUnless,
					selectionValidator.hasCharacters
				),
				commonValidate = _.partial(
					_.compose,
					validateHasCharactor,
					validateInSameParagrarh,
					validateAnchrNodeInSpanOrParagraph
				),
				validateOnText = commonValidate(
					validateFocusNodeInParagraph
				),
				validateOnSpan = commonValidate(
					validateFocusNodeInSpan
				);

			return {
				validateOnText: validateOnText,
				validateOnSpan: validateOnSpan
			};
		}(selectionValidator),
		process = function(editor, model, spanConfig, selectionValidator, command, viewModel, typeContainer) {
			var spanManipulater = require('./SpanManipulater')(spanConfig, model),
				idFactory = require('../util/IdFactory')(editor),
				moveSpan = function(spanId, newSpan) {
					// Do not need move.
					if (spanId === idFactory.makeSpanId(newSpan)) {
						return;
					}

					return [command.factory.spanMoveCommand(spanId, newSpan)];
				},
				removeSpan = function(spanId) {
					return [command.factory.spanRemoveCommand(spanId)];
				},
				doCreate = function(selection) {
					var BLOCK_THRESHOLD = 100,
						newSpan = spanManipulater.create(selection);

					// The span cross exists spans.
					if (model.annotationData.isBoundaryCrossingWithOtherSpans({
							begin: newSpan.begin,
							end: newSpan.end
						})) {
						dismissBrowserSelection();
						return;
					}

					// The span exists already.
					var spanId = idFactory.makeSpanId(newSpan);
					if (model.annotationData.span.get(spanId)) {
						dismissBrowserSelection();
						return;
					}

					var commands = [command.factory.spanCreateCommand(
						typeContainer.entity.getDefaultType(), {
							begin: newSpan.begin,
							end: newSpan.end
						}
					)];

					if (viewModel.modeAccordingToButton['replicate-auto'].value() && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
						commands.push(command.factory.spanReplicateCommand(
							typeContainer.entity.getDefaultType(), {
								begin: newSpan.begin,
								end: newSpan.end
							}));
					}

					command.invoke(commands);
					dismissBrowserSelection();
				},
				doExpand = function() {
					var expandSpanToSelection = function(spanId, selection) {
						var newSpan = spanManipulater.expand(spanId, selection);

						// The span cross exists spans.
						if (model.annotationData.isBoundaryCrossingWithOtherSpans({
								begin: newSpan.begin,
								end: newSpan.end
							})) {
							alert('A span cannot be expanded to make a boundary crossing.');
							dismissBrowserSelection();
							return;
						}

						command.invoke(moveSpan(spanId, newSpan));
						dismissBrowserSelection();
					};

					return function(selection) {
						// If a span is selected, it is able to begin drag a span in the span and expand the span.
						// The focus node should be at one level above the selected node.
						if (selectionValidator.isAnchorInSelectedSpan(selection)) {
							// cf.
							// 1. one side of a inner span is same with one side of the outside span.
							// 2. Select an outside span.
							// 3. Begin Drug from an inner span to out of an outside span. 
							// Expand the selected span.
							expandSpanToSelection(model.selectionModel.span.single(), selection);
						} else if (selectionValidator.isAnchorOneDownUnderForcus(selection)) {
							// To expand the span , belows are needed:
							// 1. The anchorNode is in the span.
							// 2. The foucusNode is out of the span and in the parent of the span.
							expandSpanToSelection(selection.anchorNode.parentNode.id, selection);
						}
						return selection;
					};
				}(),
				doShrink = function() {
					var shrinkSpanToSelection = function(spanId, selection) {
						var newSpan = spanManipulater.shrink(spanId, selection);

						// The span cross exists spans.
						if (model.annotationData.isBoundaryCrossingWithOtherSpans({
								begin: newSpan.begin,
								end: newSpan.end
							})) {
							alert('A span cannot be shrinked to make a boundary crossing.');
							dismissBrowserSelection();
							return;
						}

						var newSpanId = idFactory.makeSpanId(newSpan),
							sameSpan = model.annotationData.span.get(newSpanId);

						command.invoke(
							newSpan.begin < newSpan.end && !sameSpan ?
							moveSpan(spanId, newSpan) :
							removeSpan(spanId)
						);
						dismissBrowserSelection();
					};

					return function(selection) {
						if (selectionValidator.isFocusInSelectedSpan(selection)) {
							// If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
							// The focus node should be at the selected node.
							// cf.
							// 1. Select an inner span.
							// 2. Begin Drug from out of an outside span to the selected span. 
							// Shrink the selected span.
							shrinkSpanToSelection(model.selectionModel.span.single(), selection);
						} else if (selectionValidator.isForcusOneDownUnderAnchor(selection)) {
							// To shrink the span , belows are needed:
							// 1. The anchorNode out of the span and in the parent of the span.
							// 2. The foucusNode is in the span.
							shrinkSpanToSelection(selection.focusNode.parentNode.id, selection);
						}
						return selection;
					};
				}(),
				processSelectionIf = function(doFunc, predicate, selection) {
					if (selection && predicate(selection)) {
						return doFunc(selection);
					}
					return selection;
				},
				create = _.partial(processSelectionIf, doCreate, selectionValidator.isInOneParent),
				expand = _.partial(processSelectionIf, doExpand, selectionValidator.isAnchrNodeInSpan),
				shrink = _.partial(processSelectionIf, doShrink, selectionValidator.isFocusNodeInSpan),
				dismissUnlessProcess = _.partial(processSelectionIf, dismissBrowserSelection, function() {
					return true;
				}),
				selectEndOfText = _.compose(dismissUnlessProcess, expand, create, validate.validateOnText),
				selectEndOnSpan = _.compose(dismissUnlessProcess, shrink, expand, create, validate.validateOnSpan);

			return {
				selectEndOfText: selectEndOfText,
				selectEndOnSpan: selectEndOnSpan
			};
		}(editor, model, spanConfig, selectionValidator, command, viewModel, typeContainer);

	return {
		onText: process.selectEndOfText,
		onSpan: process.selectEndOnSpan
	};
};
},{"../util/DomUtil":37,"../util/IdFactory":38,"./SpanManipulater":31,"./dismissBrowserSelection":33,"./selectPosition":34}],29:[function(require,module,exports){
var debounce300 = function(func) {
		return _.debounce(func, 300);
	},
	sixteenTimes = function(val) {
		return val * 16;
	},
	// Redraw all editors in tha windows.
	redrawAllEditor = function() {
		$(window).trigger('resize');
	},
	createContent = function() {
		return jQuerySugar.Div('textae-editor__setting-dialog');
	},
	// Open the dialog.
	open = function($dialog) {
		return $dialog.open();
	},
	jQuerySugar = require('../util/jQuerySugar'),
	// Update the checkbox state, because it is updated by the button on control too.
	updateViewMode = function(editMode, $content) {
		return jQuerySugar.setChecked(
			$content,
			'.mode',
			editMode.showInstance ? 'checked' : null
		);
	},
	updateLineHeight = function(editMode, $content) {
		return jQuerySugar.setValue(
			$content,
			'.line-height',
			editMode.lineHeight
		);
	},
	updateTypeGapValue = function(editMode, $content) {
		return jQuerySugar.setValue(
			$content,
			'.type-gap',
			editMode.typeGap
		);
	},
	toTypeGap = function($content) {
		return $content.find('.type-gap');
	},
	updateTypeGapEnable = function(editMode, $content) {
		jQuerySugar.enabled(toTypeGap($content), editMode.showInstance);
		return $content;
	},
	changeMode = function(editMode, $content, checked) {
		if (checked) {
			editMode.toInstance();
		} else {
			editMode.toTerm();
		}
		updateTypeGapEnable(editMode, $content);
		updateTypeGapValue(editMode, $content);
		updateLineHeight(editMode, $content);
	},
	SettingDialogLabel = _.partial(jQuerySugar.Label, 'textae-editor__setting-dialog__label');

module.exports = function(editor, editMode) {
	var addInstanceRelationView = function($content) {
			var onModeChanged = debounce300(function() {
				changeMode(editMode, $content, $(this).is(':checked'));
			});

			return $content
				.append(jQuerySugar.Div()
					.append(
						new SettingDialogLabel('Instance/Relation View')
					)
					.append(
						jQuerySugar.Checkbox('textae-editor__setting-dialog__term-centric-view mode')
					)
				)
				.on(
					'click',
					'.mode',
					onModeChanged
				);
		},
		addTypeGap = function($content) {
			var onTypeGapChange = debounce300(
				function() {
					editMode.changeTypeGap($(this).val());
					updateLineHeight(editMode, $content);
				}
			);

			return $content
				.append(jQuerySugar.Div()
					.append(
						new SettingDialogLabel('Type Gap')
					)
					.append(
						jQuerySugar.Number('textae-editor__setting-dialog__type-gap type-gap')
						.attr({
							step: 1,
							min: 0,
							max: 5
						})
					)
				).on(
					'change',
					'.type-gap',
					onTypeGapChange
				);
		},
		addLineHeight = function($content) {
			var changeLineHeight = _.compose(redrawAllEditor, editMode.changeLineHeight, sixteenTimes),
				onLineHeightChange = debounce300(
					function() {
						changeLineHeight($(this).val());
					}
				);

			return $content
				.append(jQuerySugar.Div()
					.append(
						new SettingDialogLabel('Line Height')
					)
					.append(
						jQuerySugar.Number('textae-editor__setting-dialog__line-height line-height')
						.attr({
							'step': 1,
							'min': 3,
							'max': 50
						})
					))
				.on(
					'change',
					'.line-height',
					onLineHeightChange
				);
		},
		appendToDialog = function($content) {
			return require('../util/dialog/GetEditorDialog')(editor)(
				'textae.dialog.setting',
				'Setting',
				$content,
				true
			);
		},
		partialEditMode = function(func) {
			return _.partial(func, editMode);
		};

	// Update values after creating a dialog because the dialog is re-used.
	return _.compose(
		open,
		partialEditMode(updateLineHeight),
		partialEditMode(updateTypeGapValue),
		partialEditMode(updateTypeGapEnable),
		partialEditMode(updateViewMode),
		appendToDialog,
		addLineHeight,
		addTypeGap,
		addInstanceRelationView,
		createContent
	);
};
},{"../util/dialog/GetEditorDialog":44,"../util/jQuerySugar":50}],30:[function(require,module,exports){
// adjust the beginning position of a span
var adjustSpanBeginLong = function(spanConfig, sourceDoc, beginPosition) {
        var pos = beginPosition;

        while (
            spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos))
        ) {
            pos++;
        }

        while (
            pos > 0 &&
            !spanConfig.isDelimiter(sourceDoc.charAt(pos)) &&
            !spanConfig.isDelimiter(sourceDoc.charAt(pos - 1))
        ) {
            pos--;
        }
        return pos;
    },
    // adjust the end position of a span
    adjustSpanEndLong = function(spanConfig, sourceDoc, endPosition) {
        var pos = endPosition;

        while (
            spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos - 1))
        ) {
            pos--;
        }

        while (!spanConfig.isDelimiter(sourceDoc.charAt(pos)) &&
            pos < sourceDoc.length
        ) {
            pos++;
        }
        return pos;
    },
    // adjust the beginning position of a span for shortening
    adjustSpanBeginShort = function(spanConfig, sourceDoc, beginPosition) {
        var pos = beginPosition;
        while (
            pos < sourceDoc.length &&
            (
                spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos)) ||
                !spanConfig.isDelimiter(sourceDoc.charAt(pos - 1))
            )
        ) {
            pos++;
        }
        return pos;
    },
    // adjust the end position of a span for shortening
    adjustSpanEndShort = function(spanConfig, sourceDoc, endPosition) {
        var pos = endPosition;
        while (
            pos > 0 &&
            (
                spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos - 1)) ||
                !spanConfig.isDelimiter(sourceDoc.charAt(pos))
            )
        ) {
            pos--;
        }
        return pos;
    },
    spanAdjuster = {
        adjustSpanBeginLong: adjustSpanBeginLong,
        adjustSpanEndLong: adjustSpanEndLong,
        adjustSpanBeginShort: adjustSpanBeginShort,
        adjustSpanEndShort: adjustSpanEndShort
    };

module.exports = spanAdjuster;
},{}],31:[function(require,module,exports){
module.exports = function(spanConfig, model) {
    var spanAdjuster = require('./SpanAdjuster'),
        selectPosition = require('./selectPosition'),
        createSpan = function() {
            var toSpanPosition = function(selection) {
                var positions = selectPosition.toPositions(model.annotationData, selection);
                return {
                    begin: spanAdjuster.adjustSpanBeginLong(spanConfig, model.annotationData.sourceDoc, positions.anchorPosition),
                    end: spanAdjuster.adjustSpanEndLong(spanConfig, model.annotationData.sourceDoc, positions.focusPosition)
                };
            };

            return function(selection) {
                model.selectionModel.clear();
                return toSpanPosition(selection);
            };
        }(),
        expandSpan = function() {
            var getNewSpan = function(spanId, selectionRange, anchorNodeRange, focusPosition) {
                var span = model.annotationData.span.get(spanId);

                if (selectionRange.compareBoundaryPoints(Range.START_TO_START, anchorNodeRange) < 0) {
                    // expand to the left
                    return {
                        begin: spanAdjuster.adjustSpanBeginLong(spanConfig, model.annotationData.sourceDoc, focusPosition),
                        end: span.end
                    };
                } else {
                    // expand to the right
                    return {
                        begin: span.begin,
                        end: spanAdjuster.adjustSpanEndLong(spanConfig, model.annotationData.sourceDoc, focusPosition)
                    };
                }
            };

            return function(spanId, selection) {
                model.selectionModel.clear();

                var selectionRange = selection.getRangeAt(0);
                var anchorNodeRange = document.createRange();
                anchorNodeRange.selectNode(selection.anchorNode);
                var focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

                return getNewSpan(spanId, selectionRange, anchorNodeRange, focusPosition);
            };
        }(),
        shortenSpan = function() {
            var getNewSpan = function(spanId, selectionRange, focusNodeRange, focusPosition) {
                var span = model.annotationData.span.get(spanId);
                if (selectionRange.compareBoundaryPoints(Range.START_TO_START, focusNodeRange) > 0) {
                    // shorten the right boundary
                    return {
                        begin: span.begin,
                        end: spanAdjuster.adjustSpanEndShort(spanConfig, model.annotationData.sourceDoc, focusPosition)
                    };
                } else {
                    // shorten the left boundary
                    return {
                        begin: spanAdjuster.adjustSpanBeginShort(spanConfig, model.annotationData.sourceDoc, focusPosition),
                        end: span.end
                    };
                }
            };

            return function(spanId, selection) {
                model.selectionModel.clear();

                var selectionRange = selection.getRangeAt(0);
                var focusNodeRange = document.createRange();
                focusNodeRange.selectNode(selection.focusNode);
                var focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

                return getNewSpan(spanId, selectionRange, focusNodeRange, focusPosition);
            };
        }();

    return {
        create: createSpan,
        expand: expandSpan,
        shrink: shortenSpan
    };
};
},{"./SpanAdjuster":30,"./selectPosition":34}],32:[function(require,module,exports){
module.exports = function(editor, model, spanConfig, command, viewModel, typeContainer) {
	var dismissBrowserSelection = require('./dismissBrowserSelection'),
		// changeEventHandler will init.
		changeTypeOfSelected,
		getSelectedIdEditable,
		// The Reference to content to be shown in the pallet.
		palletConfig = {},
		pallet = require('../component/Pallet')(),
		hideDialogs = function() {
			pallet.hide();
		},
		cancelSelect = function() {
			hideDialogs();
			model.selectionModel.clear();
			dismissBrowserSelection();
		},
		changeType = function(getSelectedAndEditable, createChangeTypeCommandFunction, newType) {
			var ids = getSelectedAndEditable();
			if (ids.length > 0) {
				var commands = ids.map(function(id) {
					return createChangeTypeCommandFunction(id, newType);
				});

				command.invoke(commands);
			}
		},
		unbindAllEventhandler = function() {
			return editor
				.off('mouseup', '.textae-editor__body')
				.off('mouseup', '.textae-editor__span')
				.off('mouseup', '.textae-editor__span_block')
				.off('mouseup', '.textae-editor__type-label')
				.off('mouseup', '.textae-editor__entity-pane')
				.off('mouseup', '.textae-editor__entity');
		},
		editRelation = function() {
			var entityClickedAtRelationMode = function(e) {
					if (!model.selectionModel.entity.some()) {
						model.selectionModel.clear();
						model.selectionModel.entity.add($(e.target).attr('title'));
					} else {
						// Cannot make a self reference relation.
						var subjectEntityId = model.selectionModel.entity.all()[0];
						var objectEntityId = $(e.target).attr('title');

						if (subjectEntityId === objectEntityId) {
							// Deslect already selected entity.
							model.selectionModel.entity.remove(subjectEntityId);
						} else {
							model.selectionModel.entity.add(objectEntityId);
							_.defer(function() {
								command.invoke([command.factory.relationCreateCommand({
									subj: subjectEntityId,
									obj: objectEntityId,
									type: typeContainer.relation.getDefaultType()
								})]);

								if (e.ctrlKey || e.metaKey) {
									// Remaining selection of the subject entity.
									model.selectionModel.entity.remove(objectEntityId);
								} else if (e.shiftKey) {
									dismissBrowserSelection();
									model.selectionModel.entity.remove(subjectEntityId);
									model.selectionModel.entity.add(objectEntityId);
									return false;
								} else {
									model.selectionModel.entity.remove(subjectEntityId);
									model.selectionModel.entity.remove(objectEntityId);
								}
							});
						}
					}
					return false;
				},
				// Select or deselect relation.
				// This function is expected to be called when Relation-Edit-Mode.
				selectRelation = function(jsPlumbConnection, event) {
					var relationId = jsPlumbConnection.getParameter("id");

					if (event.ctrlKey || event.metaKey) {
						model.selectionModel.relation.toggle(relationId);
					} else {
						// Select only self
						if (model.selectionModel.relation.single() !== relationId) {
							model.selectionModel.clear();
							model.selectionModel.relation.add(relationId);
						}
					}
				},
				returnFalse = function() {
					return false;
				};

			return function() {
				// Control only entities and relations.
				// Cancel events of relations and theier label.
				// Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
				// And jQuery events are propergated to body click events and cancel select.
				// So multi selection of relations with Ctrl-key is not work. 
				unbindAllEventhandler()
					.on('mouseup', '.textae-editor__entity', entityClickedAtRelationMode)
					.on('mouseup', '.textae-editor__relation, .textae-editor__relation__label', returnFalse)
					.on('mouseup', '.textae-editor__body', cancelSelect);

				palletConfig.typeContainer = typeContainer.relation;
				getSelectedIdEditable = model.selectionModel.relation.all;
				changeTypeOfSelected = _.partial(changeType, getSelectedIdEditable, command.factory.relationChangeTypeCommand);

				jsPlumbConnectionClickedImpl = selectRelation;
			};
		}(),
		editEntity = function() {
			var selectEnd = require('./SelectEnd')(editor, model, spanConfig, command, viewModel, typeContainer),
				bodyClicked = function() {
					var selection = window.getSelection();

					// No select
					if (selection.isCollapsed) {
						cancelSelect();
					} else {
						selectEnd.onText(selection);
					}
				},
				selectSpan = function() {
					var getBlockEntities = function(spanId) {
							return _.flatten(
								model.annotationData.span.get(spanId)
								.getTypes()
								.filter(function(type) {
									return typeContainer.entity.isBlock(type.name);
								})
								.map(function(type) {
									return type.entities;
								})
							);
						},
						operateSpanWithBlockEntities = function(method, spanId) {
							model.selectionModel.span[method](spanId);
							if (editor.find('#' + spanId).hasClass('textae-editor__span--block')) {
								getBlockEntities(spanId).forEach(model.selectionModel.entity[method]);
							}
						},
						selectSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'add'),
						toggleSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'toggle');

					return function(event) {
						var firstId = model.selectionModel.span.single(),
							target = event.target,
							id = target.id;

						if (event.shiftKey && firstId) {
							//select reange of spans.
							model.selectionModel.clear();
							model.annotationData.span.range(firstId, id)
								.forEach(function(spanId) {
									selectSpanWithBlockEnities(spanId);
								});
						} else if (event.ctrlKey || event.metaKey) {
							toggleSpanWithBlockEnities(id);
						} else {
							model.selectionModel.clear();
							selectSpanWithBlockEnities(id);
						}
					};
				}(),
				spanClicked = function(event) {
					var selection = window.getSelection();

					// No select
					if (selection.isCollapsed) {
						selectSpan(event);
						return false;
					} else {
						selectEnd.onSpan(selection);
						// Cancel selection of a paragraph.
						// And do non propagate the parent span.
						event.stopPropagation();
					}
				},
				labelOrPaneClicked = function(ctrlKey, $typeLabel, $entities) {
					var selectEntities = function($entities) {
							$entities.each(function() {
								model.selectionModel.entity.add($(this).attr('title'));
							});
						},
						deselectEntities = function($entities) {
							$entities.each(function() {
								model.selectionModel.entity.remove($(this).attr('title'));
							});
						};

					if (ctrlKey) {
						if ($typeLabel.hasClass('ui-selected')) {
							deselectEntities($entities);
						} else {
							selectEntities($entities);
						}
					} else {
						model.selectionModel.clear();
						selectEntities($entities);
					}
					return false;
				},
				typeLabelClicked = function(e) {
					var $typeLabel = $(e.target);
					return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typeLabel, $typeLabel.next().children());
				},
				entityClicked = function(e) {
					var $target = $(e.target);
					if (e.ctrlKey || e.metaKey) {
						model.selectionModel.entity.toggle($target.attr('title'));
					} else {
						model.selectionModel.clear();
						model.selectionModel.entity.add($target.attr('title'));
					}
					return false;
				},
				entityPaneClicked = function(e) {
					var $typePane = $(e.target);
					return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typePane.prev(), $typePane.children());
				},
				createEntityChangeTypeCommand = function(id, newType) {
					return command.factory.entityChangeTypeCommand(
						id,
						newType,
						typeContainer.entity.isBlock(newType)
					);
				};

			return function() {
				unbindAllEventhandler()
					.on('mouseup', '.textae-editor__body', bodyClicked)
					.on('mouseup', '.textae-editor__span', spanClicked)
					.on('mouseup', '.textae-editor__type-label', typeLabelClicked)
					.on('mouseup', '.textae-editor__entity-pane', entityPaneClicked)
					.on('mouseup', '.textae-editor__entity', entityClicked);

				palletConfig.typeContainer = typeContainer.entity;
				getSelectedIdEditable = model.selectionModel.entity.all;
				changeTypeOfSelected = _.partial(
					changeType,
					getSelectedIdEditable,
					createEntityChangeTypeCommand
				);

				jsPlumbConnectionClickedImpl = null;
			};
		}(),
		noEdit = function() {
			unbindAllEventhandler();

			palletConfig.typeContainer = null;
			changeTypeOfSelected = null;
			getSelectedIdEditable = null;

			jsPlumbConnectionClickedImpl = null;
		};

	pallet
		.bind('type.select', function(label) {
			pallet.hide();
			changeTypeOfSelected(label);
		})
		.bind('default-type.select', function(label) {
			pallet.hide();
			palletConfig.typeContainer.setDefaultType(label);
		});

	// A Swithing point to change a behavior when relation is clicked.
	var jsPlumbConnectionClickedImpl = null;

	// A relation is drawn by a jsPlumbConnection.
	// The EventHandlar for clieck event of jsPlumbConnection. 
	var jsPlumbConnectionClicked = function() {
		return function(jsPlumbConnection, event) {
			// Check the event is processed already.
			// Because the jsPlumb will call the event handler twice
			// when a label is clicked that of a relation added after the initiation.
			if (jsPlumbConnectionClickedImpl && !event.processedByTextae) {
				jsPlumbConnectionClickedImpl(jsPlumbConnection, event);
			}

			event.processedByTextae = true;
		};
	}();

	return {
		editRelation: editRelation,
		editEntity: editEntity,
		noEdit: noEdit,
		showPallet: function(point) {
			pallet.show(palletConfig, point);
		},
		setNewType: function(newTypeName) {
			changeTypeOfSelected(newTypeName);
		},
		hideDialogs: hideDialogs,
		cancelSelect: cancelSelect,
		jsPlumbConnectionClicked: jsPlumbConnectionClicked,
		getSelectedIdEditable: function() {
			return getSelectedIdEditable && getSelectedIdEditable();
		}
	};
};
},{"../component/Pallet":12,"./SelectEnd":28,"./dismissBrowserSelection":33}],33:[function(require,module,exports){
module.exports = function() {
	var selection = window.getSelection();
	selection.collapse(document.body, 0);
};
},{}],34:[function(require,module,exports){
var getPosition = function(paragraph, span, node) {
		var $parent = $(node).parent();
		var parentId = $parent.attr("id");

		var pos;
		if ($parent.hasClass("textae-editor__body__text-box__paragraph")) {
			pos = paragraph.get(parentId).begin;
		} else if ($parent.hasClass("textae-editor__span")) {
			pos = span.get(parentId).begin;
		} else {
			throw new Error('Can not get position of a node : ' + node + ' ' + node.data);
		}

		var childNodes = node.parentElement.childNodes;
		for (var i = 0; childNodes[i] != node; i++) { // until the focus node
			pos += (childNodes[i].nodeName == "#text") ? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
		}

		return pos;
	},
	getFocusPosition = function(annotationData, selection) {
		var pos = getPosition(annotationData.paragraph, annotationData.span, selection.focusNode);
		return pos += selection.focusOffset;
	},
	getAnchorPosition = function(annotationData, selection) {
		var pos = getPosition(annotationData.paragraph, annotationData.span, selection.anchorNode);
		return pos + selection.anchorOffset;
	},
	toPositions = function(annotationData, selection) {
		var anchorPosition = getAnchorPosition(annotationData, selection),
			focusPosition = getFocusPosition(annotationData, selection);

		// switch the position when the selection is made from right to left
		if (anchorPosition > focusPosition) {
			var tmpPos = anchorPosition;
			anchorPosition = focusPosition;
			focusPosition = tmpPos;
		}

		return {
			anchorPosition: anchorPosition,
			focusPosition: focusPosition
		};
	};

module.exports = {
	toPositions: toPositions,
	getAnchorPosition: getAnchorPosition,
	getFocusPosition: getFocusPosition,
};
},{}],35:[function(require,module,exports){
// Ovserve and record mouse position to return it.
var getMousePoint = function() {
        var lastMousePoint = {},
            recordMousePoint = function(e) {
                lastMousePoint = {
                    top: e.clientY,
                    left: e.clientX
                };
            },
            onMousemove = _.debounce(recordMousePoint, 30);

        $('html').on('mousemove', onMousemove);

        return function() {
            return lastMousePoint;
        };
    }(),
    // Observe key-input events and convert events to readable code.
    observeKeybordInput = function(keyInputHandler) {
        // Declare keyApiMap of control keys 
        var controlKeyEventMap = {
            27: 'ESC',
            46: 'DEL',
            37: 'LEFT',
            39: 'RIGHT'
        };

        var convertKeyEvent = function(keyCode) {
            if (65 <= keyCode && keyCode <= 90) {
                // From a to z, convert 'A' to 'Z'
                return String.fromCharCode(keyCode);
            } else if (controlKeyEventMap[keyCode]) {
                // Control keys, like ESC, DEL ...
                return controlKeyEventMap[keyCode];
            }
        };

        var getKeyCode = function(e) {
            return e.keyCode;
        };

        // EventHandlers for key-input.
        var eventHandler = _.compose(keyInputHandler, convertKeyEvent, getKeyCode);

        // Observe key-input
        var onKeyup = eventHandler;
        $(document).on('keyup', function(event) {
            onKeyup(event);
        });

        // Disable/Enable key-input When a jquery-ui dialog is opened/closeed
        $('body').on('dialogopen', '.ui-dialog', function() {
            onKeyup = function() {};
        }).on('dialogclose', '.ui-dialog', function() {
            onKeyup = eventHandler;
        });
    },
    // Observe window-resize event and redraw all editors. 
    observeWindowResize = function(editors) {
        // Bind resize event
        $(window).on('resize', _.debounce(function() {
            // Redraw all editors per editor.
            editors.forEach(function(editor) {
                console.log(editor.editorId, 'redraw');
                _.defer(editor.api.redraw);
            });
        }, 500));
    },
    openDialog = function() {
        var ToolDialog = require('./util/dialog/GetToolDialog'),
            helpDialog = new ToolDialog(
                'textae-control__help',
                'Help (Keyboard short-cuts)', {
                    height: 313,
                    width: 523
                },
                $('<div>').addClass('textae-tool__key-help')),
            aboutDialog = new ToolDialog(
                'textae-control__about',
                'About TextAE (Text Annotation Editor)', {
                    height: 500,
                    width: 600
                },
                $('<div>')
                .html('<p>今ご覧になっているTextAEはPubAnnotationで管理しているアノテーションのビューアもしくはエディタです。</p>' +
                    '<p>PubAnnotationではPubMedのアブストラクトにアノテーションを付けることができます。</p>' +
                    '<p>現在はEntrez Gene IDによる自動アノテーションおよびそのマニュアル修正作業が可能となっています。' +
                    '今後は自動アノテーションの種類を増やす計画です。</p>' +
                    '<p>間違ったアノテーションも目に付くと思いますが、それを簡単に直して自分のプロジェクトにセーブできるのがポイントです。</p>' +
                    '<p>自分のアノテーションを作成するためにはPubAnnotation上で自分のプロジェクトを作る必要があります。' +
                    '作成したアノテーションは後で纏めてダウンロードしたり共有することができます。</p>' +
                    '<p>まだ開発中のサービスであり、実装すべき機能が残っています。' +
                    'ユーザの皆様の声を大事にして開発していきたいと考えておりますので、ご意見などございましたら教えていただければ幸いです。</p>'));

        return {
            help: helpDialog.open,
            about: aboutDialog.open
        };
    }(),
    ControlBar = function() {
        var control = null;
        return {
            setInstance: function(instance) {
                control = instance;
            },
            changeButtonState: function(disableButtons) {
                if (control) {
                    control.updateAllButtonEnableState(disableButtons);
                }
            },
            push: function(buttonName, push) {
                if (control) control.updateButtonPushState(buttonName, push);
            }
        };
    },
    EditorContainer = function(controlBar) {
        var switchActiveClass = function(editors, selected) {
                var activeClass = 'textae-editor--active';

                // Remove activeClass from others than selected.
                _.reject(editors, function(editor) {
                    return editor === selected;
                }).forEach(function(others) {
                    others.removeClass(activeClass);
                    console.log('deactive', others.editorId);
                });

                // Add activeClass to the selected.
                selected.addClass(activeClass);
                console.log('active', selected.editorId);
            },
            editorList = [],
            selected = null,
            select = function(editor) {
                switchActiveClass(editorList, editor);
                selected = editor;
            },
            // A container of editors that is extended from Array. 
            editors = {
                push: function(editor) {
                    editorList.push(editor);
                },
                getNewId: function() {
                    return 'editor' + editorList.length;
                },
                getSelected: function() {
                    return selected;
                },
                select: select,
                selectFirst: function() {
                    select(editorList[0]);
                    controlBar.changeButtonState();
                },
                forEach: editorList.forEach.bind(editorList)
            };

        return editors;
    },
    KeyInputHandler = function(openDialog, editors) {
        return function(key) {
            if (key === 'H') {
                openDialog.help();
            } else {
                if (editors.getSelected()) {
                    editors.getSelected().api.handleKeyInput(key, getMousePoint());
                }
            }
        };
    },
    ControlButtonHandler = function(openDialog, editors) {
        return function(name) {
            switch (name) {
                case 'textae.control.button.help.click':
                    openDialog.help();
                    break;
                case 'textae.control.button.about.click':
                    openDialog.about();
                    break;
                default:
                    if (editors.getSelected()) {
                        editors.getSelected().api.handleButtonClick(name, getMousePoint());
                    }
            }
        };
    };

// The tool manages interactions between components. 
module.exports = function() {
    var controlBar = new ControlBar(),
        editors = new EditorContainer(controlBar),
        handleKeyInput = new KeyInputHandler(openDialog, editors),
        handleControlButtonClick = new ControlButtonHandler(openDialog, editors);

    // Start observation at document ready, because this function may be called before body is loaded.
    $(function() {
        observeWindowResize(editors);
        observeKeybordInput(handleKeyInput);
    });

    return {
        // Register a control to tool.
        setControl: function(instance) {
            instance
                .on('textae.control.button.click', function() {
                    handleControlButtonClick.apply(null, _.rest(arguments));
                });

            controlBar.setInstance(instance);
        },
        // Register editors to tool
        pushEditor: function(editor) {
            editors.push(editor);

            // Add an event emitter to the editer.
            var eventEmitter = require('./util/extendBindable')({})
                .bind('textae.editor.select', _.partial(editors.select, editor))
                .bind('textae.control.button.push', function(data) {
                    controlBar.push(data.buttonName, data.state);
                })
                .bind('textae.control.buttons.change', function(disableButtons) {
                    if (editor === editors.getSelected()) controlBar.changeButtonState(disableButtons);
                });

            $.extend(editor, {
                editorId: editors.getNewId(),
                eventEmitter: eventEmitter
            });
        },
        // Select the first editor
        selectFirstEditor: function() {
            editors.selectFirst();
        },
    };
}();
},{"./util/dialog/GetToolDialog":45,"./util/extendBindable":47}],36:[function(require,module,exports){
var changeCursor = function(editor, action) {
	// Add jQuery Ui dialogs to targets because they are not in the editor.
	editor = editor.add('.ui-dialog, .ui-widget-overlay');
	editor[action + 'Class']('textae-editor--wait');
};

module.exports = function(editor) {
	var wait = _.partial(changeCursor, editor, 'add'),
		endWait = _.partial(changeCursor, editor, 'remove');

	return {
		startWait: wait,
		endWait: endWait,
	};
};
},{}],37:[function(require,module,exports){
module.exports = function(editor) {
	var idFactory = require('../util/IdFactory')(editor);

	return {
		selector: {
			span: {
				get: function(spanId) {
					return editor.find('#' + spanId);
				}
			},
			entity: {
				get: function(entityId) {
					return editor.find('#' + idFactory.makeEntityDomId(entityId));
				}
			},
			grid: {
				get: function(spanId) {
					return editor.find('#G' + spanId);
				}
			},
		}
	};
};
},{"../util/IdFactory":38}],38:[function(require,module,exports){
var typeCounter = [],
    makeTypePrefix = function(editorId, prefix) {
        return editorId + '__' + prefix;
    },
    makeId = function(editorId, prefix, id) {
        return makeTypePrefix(editorId, prefix) + id;
    },
    spanDelimiter = '_';

module.exports = function(editor) {
    var spanPrefix = makeTypePrefix(editor.editorId, 'S');

    return {
        // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
        makeSpanId: function(span) {
            return spanPrefix + span.begin + spanDelimiter + span.end;
        },
        // Get a span object from the spanId.
        parseSpanId: function(spanId) {
            var beginEnd = spanId.replace(spanPrefix, '').split(spanDelimiter);
            return {
                begin: Number(beginEnd[0]),
                end: Number(beginEnd[1])
            };
        },
        // The ID of type has number of type.
        // This IDs are used for id of DOM element and css selector for jQuery.
        // But types are inputed by users and may have `!"#$%&'()*+,./:;<=>?@[\]^`{|}~` which can not be used for css selecor. 
        makeTypeId: function(spanId, type) {
            if (typeCounter.indexOf(type) === -1) {
                typeCounter.push(type);
            }
            return spanId + '-' + typeCounter.indexOf(type);
        },
        makeEntityDomId: _.partial(makeId, editor.editorId, 'E'),
        makeParagraphId: _.partial(makeId, editor.editorId, 'P')
    };
};
},{}],39:[function(require,module,exports){
var isEmpty = function(str) {
		return !str || str === "";
	},
	getAsync = function(url, dataHandler, failedHandler) {
		if (isEmpty(url)) {
			return;
		}

		$.ajax({
			type: "GET",
			url: url,
			cache: false
		})
			.done(function(data) {
				if (dataHandler !== undefined) {
					dataHandler(data);
				}
			})
			.fail(function(res, textStatus, errorThrown) {
				if (failedHandler !== undefined) {
					failedHandler();
				}
			});
	},
	post = function(url, data, successHandler, failHandler, finishHandler) {
		if (isEmpty(url)) {
			return;
		}

		console.log("POST data", data);

		$.ajax({
			type: "post",
			url: url,
			contentType: "application/json",
			data: data,
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		})
			.done(successHandler)
			.fail(failHandler)
			.always(finishHandler);
	};

module.exports = function() {
	return {
		getAsync: getAsync,
		post: post
	};
}();
},{}],40:[function(require,module,exports){
module.exports = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
},{}],41:[function(require,module,exports){
var Dialog = function(id, title, $content) {
		return $('<div>')
			.attr('id', id)
			.attr('title', title)
			.hide()
			.append($content);
	},
	OpenCloseMixin = function($dialog, openOption) {
		return {
			open: function() {
				$dialog.dialog(openOption);
			},
			close: function() {
				$dialog.dialog('close');
			},
		};
	},
	extendDialog = function(openOption, $dialog) {
		return _.extend(
			$dialog,
			new OpenCloseMixin($dialog, openOption)
		);
	},
	appendDialog = function($dialog) {
		$('body').append($dialog);
		return $dialog;
	};

module.exports = function(openOption, id, title, $content) {
	openOption = _.extend({
		resizable: false,
		modal: true
	}, openOption);

	var extendDialogWithOpenOption = _.partial(extendDialog, openOption),
		createAndAppendDialog = _.compose(
			appendDialog,
			extendDialogWithOpenOption,
			Dialog
		);

	return createAndAppendDialog(id, title, $content);
};
},{}],42:[function(require,module,exports){
var Dialog = require('./Dialog'),
	getDialogId = function(editorId, id) {
		return editorId + '.' + id;
	};

module.exports = function(editorId, id, title, $content, noCancelButton) {
	var openOption = {
			width: 550,
			height: 220,
			buttons: noCancelButton ? {} : {
				Cancel: function() {
					$(this).dialog('close');
				}
			}
		},
		$dialog = new Dialog(
			openOption,
			getDialogId(editorId, id),
			title,
			$content
		);

	return _.extend($dialog, {
		id: id
	});
};
},{"./Dialog":41}],43:[function(require,module,exports){
var getFromContainer = function(container, id) {
		return container[id];
	},
	addToContainer = function(container, id, object) {
		container[id] = object;
		return object;
	};

// Cash a div for dialog by self, because $('#dialog_id') cannot find exists div element.
// The first parameter of an createFunction must be id. 
// A createFunction must return an object having a parameter 'id'.
module.exports = function(createFunction) {
	var cache = {},
		serachCache = _.partial(getFromContainer, cache),
		addCache = _.partial(addToContainer, cache),
		createAndCache = function(createFunction, params) {
			object = createFunction.apply(null, params);
			return addCache(object.id, object);
		};

	return function(id, title, $content, options) {
		return serachCache(id) ||
			createAndCache(createFunction, arguments);
	};
};
},{}],44:[function(require,module,exports){
var EditorDialog = require('./EditorDialog'),
	FunctionUseCache = require('./FunctionUseCache');

// Cache instances per editor.
module.exports = function(editor) {
	editor.getDialog = editor.getDialog || new FunctionUseCache(_.partial(EditorDialog, editor.editorId));
	return editor.getDialog;
};
},{"./EditorDialog":42,"./FunctionUseCache":43}],45:[function(require,module,exports){
var ToolDialog = require('./ToolDialog'),
	FunctionUseCache = require('./FunctionUseCache');

module.exports = new FunctionUseCache(ToolDialog);
},{"./FunctionUseCache":43,"./ToolDialog":46}],46:[function(require,module,exports){
var Dialog = require('./Dialog');

module.exports = function(id, title, size, $content) {
	var $dialog = new Dialog(
		size,
		id,
		title,
		$content
	);

	return _.extend($dialog, {
		id: id
	});
};
},{"./Dialog":41}],47:[function(require,module,exports){
// A mixin for the separeted presentation by the observer pattern.
var bindable = function() {
    var callbacks = {};

    return {
        bind: function(event, callback) {
            if (!_.isFunction(callback)) throw new Error('Only a function is bindable!');

            callbacks[event] = callbacks[event] || [];
            callbacks[event].push(callback);
            return this;
        },
        unbind: function(event, callback) {
            if (!callbacks[event]) return this;

            callbacks[event] = _.reject(callbacks[event], function(existsCallback) {
                return existsCallback === callback;
            });
            return this;
        },
        trigger: function(event, data) {
            if (callbacks[event]) {
                callbacks[event].forEach(function(callback) {
                    callback(data);
                });
            }
            return data;
        }
    };
};

module.exports = function(obj) {
    return _.extend({}, obj, bindable());
};
},{}],48:[function(require,module,exports){
// Usage sample: getUrlParameters(location.search). 
module.exports = function(urlQuery) {
	// Remove ? at top.
	var queryString = urlQuery ? String(urlQuery).replace(/^\?(.*)/, '$1') : '';

	// Convert to array if exists
	var querys = queryString.length > 0 ? queryString.split('&') : [];

	return querys
		.map(function(param) {
			// Convert string "key=value" to object.
			var vals = param.split('=');
			return {
				key: vals[0],
				val: vals[1]
			};
		}).reduce(function(a, b) {
			// Convert [{key: 'abc', val: '123'},...] to { abc: 123 ,...}
			// Set value true if val is not set.
			a[b.key] = b.val ? b.val : true;
			return a;
		}, {});
};
},{}],49:[function(require,module,exports){
module.exports = function($target, enable) {
	if (enable) {
		$target.removeAttr('disabled');
	} else {
		$target.attr('disabled', 'disabled');
	}
};
},{}],50:[function(require,module,exports){
var setProp = function(key, $target, className, value) {
	var valueObject = {};

	valueObject[key] = value;
	return $target.find(className)
		.prop(valueObject)
		.end();
};

module.exports = {
	enabled: jQueryEnabled = require('./jQueryEnabled'),
	Div: function(className) {
		return $('<div>')
			.addClass(className);
	},
	Label: function(className, text) {
		return $('<label>')
			.addClass(className)
			.text(text);
	},
	Button: function(label, className) {
		return $('<input type="button" disabled="disabled" />')
			.addClass(className)
			.val(label);
	},
	Checkbox: function(className) {
		return $('<input type="checkbox"/>')
			.addClass(className);
	},
	Number: function(className) {
		return $('<input type="number"/>')
			.addClass(className);
	},
	toLink: function(url) {
		return '<a href="' + url + '">' + url + '</a>';
	},
	getValueFromText: function($target, className) {
		return $target.find('[type="text"].' + className).val();
	},
	setChecked: _.partial(setProp, 'checked'),
	setValue: _.partial(setProp, 'value')
};
},{"./jQueryEnabled":49}],51:[function(require,module,exports){
module.exports = function(hash, element) {
	hash[element.name] = element;
	return hash;
};
},{}],52:[function(require,module,exports){
module.exports = {
	isUri: function(type) {
		return String(type).indexOf('http') > -1;
	},
	getUrlMatches: function(type) {
		// The regular-expression to parse URL.
		// See detail:
		// http://someweblog.com/url-regular-expression-javascript-link-shortener/
		var urlRegex = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
		return urlRegex.exec(type);
	}
};
},{}],53:[function(require,module,exports){
var ModeAccordingToButton = function(editor) {
		var reduce2hash = require('../util/reduce2hash'),
			Button = function(buttonName) {
				// Button state is true when the button is pushed.
				var state = false,
					value = function(newValue) {
						if (newValue !== undefined) {
							state = newValue;
							propagate();
						} else {
							return state;
						}
					},
					toggle = function toggleButton() {
						state = !state;
						propagate();
					},
					// Propagate button state to the tool.
					propagate = function() {
						editor.eventEmitter.trigger('textae.control.button.push', {
							buttonName: buttonName,
							state: state
						});
					};

				return {
					name: buttonName,
					value: value,
					toggle: toggle,
					propagate: propagate
				};
			};

		var buttons = [
				'replicate-auto',
				'relation-edit-mode',
				'negation',
				'speculation'
			].map(Button),
			propagateStateOfAllButtons = function() {
				buttons
					.map(function(button) {
						return button.propagate;
					})
					.forEach(function(propagate) {
						propagate();
					});
			};

		// The public object.
		var api = buttons.reduce(reduce2hash, {});

		return _.extend(api, {
			propagate: propagateStateOfAllButtons
		});
	},
	ButtonEnableStates = function(editor) {
		var states = {},
			set = function(button, enable) {
				states[button] = enable;
			},
			propagate = function() {
				editor.eventEmitter.trigger('textae.control.buttons.change', states);
			};

		return {
			set: set,
			propagate: propagate
		};
	},
	UpdateButtonState = function(model, buttonEnableStates, clipBoard) {
		// Short cut name 
		var s = model.selectionModel,
			doPredicate = function(name) {
				return _.isFunction(name) ? name() : s[name].some();
			},
			and = function() {
				for (var i = 0; i < arguments.length; i++) {
					if (!doPredicate(arguments[i])) return false;
				}

				return true;
			},
			or = function() {
				for (var i = 0; i < arguments.length; i++) {
					if (doPredicate(arguments[i])) return true;
				}

				return false;
			},
			hasCopy = function() {
				return clipBoard.clipBoard.length > 0;
			},
			sOrE = _.partial(or, 'span', 'entity'),
			eOrR = _.partial(or, 'entity', 'relation');


		// Check all associated anntation elements.
		// For exapmle, it should be that buttons associate with entitis is enable,
		// when deselect the span after select a span and an entity.
		var predicates = {
			replicate: function() {
				return !!s.span.single();
			},
			entity: s.span.some,
			'delete': s.some, // It works well on relation-edit-mode if relations are deselect brefore an entity is select.
			copy: sOrE,
			paste: _.partial(and, hasCopy, 'span'),
			pallet: eOrR,
			'change-label': eOrR,
			negation: eOrR,
			speculation: eOrR
		};

		return function(buttons) {
			buttons.forEach(function(buttonName) {
				buttonEnableStates.set(buttonName, predicates[buttonName]());
			});
		};
	},
	UpdateModificationButtons = function(model, modeAccordingToButton) {
		var doesAllModificaionHasSpecified = function(specified, modificationsOfSelectedElement) {
				return modificationsOfSelectedElement.length > 0 && _.every(modificationsOfSelectedElement, function(m) {
					return _.contains(m, specified);
				});
			},
			updateModificationButton = function(specified, modificationsOfSelectedElement) {
				// All modification has specified modification if exits.
				modeAccordingToButton[specified.toLowerCase()]
					.value(doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement));
			};

		return function(selectionModel) {
			var modifications = selectionModel.all().map(function(e) {
				return model.annotationData.getModificationOf(e).map(function(m) {
					return m.pred;
				});
			});

			updateModificationButton('Negation', modifications);
			updateModificationButton('Speculation', modifications);
		};
	},
	ButtonStateHelper = function(model, modeAccordingToButton, buttonEnableStates, updateButtonState, updateModificationButtons) {
		var allButtons = ['delete'],
			spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste']),
			relationButtons = allButtons.concat(['pallet', 'change-label', 'negation', 'speculation']),
			entityButtons = relationButtons.concat(['copy']),
			propagate = _.compose(modeAccordingToButton.propagate, buttonEnableStates.propagate),
			propagateAfter = _.partial(_.compose, propagate);

		return {
			propagate: propagate,
			enabled: propagateAfter(buttonEnableStates.set),
			updateBySpan: propagateAfter(_.partial(updateButtonState, spanButtons)),
			updateByEntity: _.compose(
				propagate,
				_.partial(updateModificationButtons, model.selectionModel.entity),
				_.partial(updateButtonState, entityButtons)
			),
			updateByRelation: _.compose(
				propagate,
				_.partial(updateModificationButtons, model.selectionModel.relation),
				_.partial(updateButtonState, relationButtons)
			)
		};
	};

module.exports = function(editor, model, clipBoard) {
	// Save state of push control buttons.
	var modeAccordingToButton = new ModeAccordingToButton(editor),
		// Save enable/disable state of contorol buttons.
		buttonEnableStates = new ButtonEnableStates(editor),
		updateButtonState = new UpdateButtonState(model, buttonEnableStates, clipBoard),
		// Change push/unpush of buttons of modifications.
		updateModificationButtons = new UpdateModificationButtons(model, modeAccordingToButton),
		// Helper to update button state. 
		buttonStateHelper = new ButtonStateHelper(
			model,
			modeAccordingToButton,
			buttonEnableStates,
			updateButtonState,
			updateModificationButtons
		);

	return {
		// Modes accoding to buttons of control.
		modeAccordingToButton: modeAccordingToButton,
		buttonStateHelper: buttonStateHelper,
	};
};
},{"../util/reduce2hash":51}],54:[function(require,module,exports){
var Cache = function() {
        var cache = {},
            set = function(key, value) {
                cache[key] = value;
                return value;
            },
            get = function(key) {
                return cache[key];
            },
            remove = function(key) {
                delete cache[key];
            },
            clear = function() {
                cache = {};
            };

        return {
            set: set,
            get: get,
            remove: remove,
            clear: clear,
            // To debug.
            keys: function() {
                return Object.keys(cache);
            }
        };
    },
    cacheMan = function() {
        var caches = [],
            add = function(cache) {
                caches.push(cache);
            },
            getFromCache = function(cache, getPositionFunciton, id) {
                return cache.get(id) ? cache.get(id) : cache.set(id, getPositionFunciton(id));
            },
            create = function(func) {
                var cache = new Cache();
                add(cache);
                return _.partial(getFromCache, cache, func);
            },
            clear = function() {
                caches.forEach(function(cache) {
                    cache.clear();
                });
            };

        return {
            create: create,
            clear: clear
        };
    }(),
    createNewCache = function(editor, entityModel) {
        var domUtil = require('../util/DomUtil')(editor);

        // The chache for position of grids.
        // This is updated at arrange position of grids.
        // This is referenced at create or move relations.
        var gridPositionCache = _.extend(new Cache(), {
            isGridPrepared: function(entityId) {
                var spanId = entityModel.get(entityId).span;
                return gridPositionCache.get(spanId);
            }
        });

        // The posion of the text-box to calculate span postion; 
        var getTextNodeFunc = function() {
                return editor.find('.textae-editor__body__text-box').offset();
            },
            getTextNode = cacheMan.create(getTextNodeFunc),
            getSpanFunc = function(spanId) {
                var $span = domUtil.selector.span.get(spanId);
                if ($span.length === 0) {
                    throw new Error("span is not renderd : " + spanId);
                }

                var offset = $span.offset();
                return {
                    top: offset.top - getTextNode().top,
                    left: offset.left - getTextNode().left,
                    width: $span.outerWidth(),
                    height: $span.outerHeight(),
                    center: $span.get(0).offsetLeft + $span.outerWidth() / 2
                };
            },
            getEntityFunc = function(entityId) {
                var $entity = domUtil.selector.entity.get(entityId);
                if ($entity.length === 0) {
                    throw new Error("entity is not rendered : " + entityId);
                }

                var spanId = entityModel.get(entityId).span;
                var gridPosition = gridPositionCache.get(spanId);
                var entityElement = $entity.get(0);
                return {
                    top: gridPosition.top + entityElement.offsetTop,
                    center: gridPosition.left + entityElement.offsetLeft + $entity.outerWidth() / 2,
                };
            };

        // The connectCache has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
        // This is refered by render.relation and domUtil.selector.relation.
        var connectCache = new Cache();
        var toConnect = function(relationId) {
            return connectCache.get(relationId);
        };

        // The cache for span positions.
        // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
        // This cache is big effective for the initiation, and little effective for resize. 
        var getSpan = cacheMan.create(getSpanFunc);
        var getEntity = cacheMan.create(getEntityFunc);

        return {
            reset: cacheMan.clear,
            getSpan: getSpan,
            getEntity: getEntity,
            gridPositionCache: gridPositionCache,
            getGrid: gridPositionCache.get,
            setGrid: gridPositionCache.set,
            toConnect: toConnect,
            connectCache: connectCache
        };
    };

// Utility functions for get positions of DOM elemnts.
module.exports = function(editor, entityModel) {
    // The editor has onry one position cache.
    editor.postionCache = editor.postionCache || createNewCache(editor, entityModel);
    return editor.postionCache;
};
},{"../util/DomUtil":37}],55:[function(require,module,exports){
var filterVisibleGrid = function(grid) {
      if (grid && grid.hasClass('hidden')) {
         return grid;
      }
   },
   showGrid = function(grid) {
      if (grid) {
         grid.removeClass('hidden');
      }
   };

// Management position of annotation components.
module.exports = function(editor, annotationData) {
   var domPositionCaChe = require('./DomPositionCache')(editor, annotationData.entity),
      domUtil = require('../util/DomUtil')(editor),
      filterChanged = function(span, newPosition) {
         var oldGridPosition = domPositionCaChe.getGrid(span.id);
         if (!oldGridPosition || oldGridPosition.top !== newPosition.top || oldGridPosition.left !== newPosition.left) {
            return newPosition;
         } else {
            return undefined;
         }
      },
      getGrid = function(span) {
         if (span) {
            return domUtil.selector.grid.get(span.id);
         }
      },
      updateGridPositon = function(span, newPosition) {
         if (newPosition) {
            getGrid(span).css(newPosition);
            domPositionCaChe.setGrid(span.id, newPosition);
            return span;
         }
      },
      getNewPosition = function(typeGapValue, span) {
         var stickGridOnSpan = function(span) {
            var spanPosition = domPositionCaChe.getSpan(span.id);

            return {
               'top': spanPosition.top - getGrid(span).outerHeight(),
               'left': spanPosition.left
            };
         };

         var pullUpGridOverDescendants = function(span) {
            // Culculate the height of the grid include descendant grids, because css style affects slowly.
            var getHeightIncludeDescendantGrids = function(span) {
               var descendantsMaxHeight = span.children.length === 0 ? 0 :
                  Math.max.apply(null, span.children.map(function(childSpan) {
                     return getHeightIncludeDescendantGrids(childSpan);
                  }));

               var gridHeight = span.getTypes().length * (typeGapValue * 18 + 18);
               return gridHeight + descendantsMaxHeight;
            };

            var spanPosition = domPositionCaChe.getSpan(span.id);
            var descendantsMaxHeight = getHeightIncludeDescendantGrids(span);

            return {
               'top': spanPosition.top - descendantsMaxHeight,
               'left': spanPosition.left
            };
         };

         if (span.children.length === 0) {
            return stickGridOnSpan(span);
         } else {
            return pullUpGridOverDescendants(span);
         }
      },
      Promise = require('Promise'),
      arrangeGridPosition = function(typeGapValue, span) {
         var moveTheGridIfChange = _.compose(
               _.partial(updateGridPositon, span),
               _.partial(filterChanged, span),
               _.partial(getNewPosition, typeGapValue)
            ),
            showInvisibleGrid = _.compose(showGrid, filterVisibleGrid, getGrid);

         // The span may be remeved because this functon is call asynchronously.
         if (annotationData.span.get(span.id)) {
            // Move all relations because entities are increased or decreased unless the grid is moved.  
            _.compose(showInvisibleGrid, moveTheGridIfChange)(span);
         }
      },
      arrangeGridPositionPromise = function(typeGapValue, span) {
         return new Promise(function(resolve, reject) {
            _.defer(function() {
               try {
                  arrangeGridPosition(typeGapValue, span);
                  resolve();
               } catch (error) {
                  reject();
               }
            });
         });
      },
      arrangeGridPositionAll = function(typeGapValue) {
         return annotationData.span.all()
            .filter(function(span) {
               // There is at least one type in span that has a grid.
               return span.getTypes().length > 0;
            })
            .map(function(span) {
               // Cache all span position because alternating between getting offset and setting offset.
               domPositionCaChe.getSpan(span.id);
               return span;
            })
            .map(_.partial(arrangeGridPositionPromise, typeGapValue));
      },
      arrangePositionAll = function(typeGapValue) {
         domPositionCaChe.reset();
         return Promise.all(arrangeGridPositionAll(typeGapValue));
      };

   return {
      arrangePosition: arrangePositionAll
   };
};
},{"../util/DomUtil":37,"./DomPositionCache":54,"Promise":2}],56:[function(require,module,exports){
var selectionClass = require('./selectionClass');

module.exports = function(editor, model) {
	var domPositionCaChe = require('./DomPositionCache')(editor, model.annotationData.entity),
		domUtil = require('../util/DomUtil')(editor),
		modify = function(type, handle, id) {
			var $elment = domUtil.selector[type].get(id);
			selectionClass[handle + 'Class']($elment);
		},
		selectSpan = _.partial(modify, 'span', 'add'),
		deselectSpan = _.partial(modify, 'span', 'remove'),
		selectEntity = _.partial(modify, 'entity', 'add'),
		deselectEntity = _.partial(modify, 'entity', 'remove'),
		selectRelation = function(relationId) {
			var addUiSelectClass = function(connect) {
					if (connect && connect.select) connect.select();
				},
				selectRelation = _.compose(addUiSelectClass, domPositionCaChe.toConnect);

			selectRelation(relationId);
		},
		deselectRelation = function(relationId) {
			var removeUiSelectClass = function(connect) {
					if (connect && connect.deselect) connect.deselect();
				},
				deselectRelation = _.compose(removeUiSelectClass, domPositionCaChe.toConnect);

			deselectRelation(relationId);
		}, // Select the typeLabel if all entities is selected.
		updateEntityLabel = function(entityId) {
			var $entity = domUtil.selector.entity.get(entityId),
				$typePane = $entity.parent(),
				$typeLabel = $typePane.prev();

			if ($typePane.children().length === $typePane.find('.ui-selected').length) {
				selectionClass.addClass($typeLabel);
			} else {
				selectionClass.removeClass($typeLabel);
			}
		};

	return {
		span: {
			select: selectSpan,
			deselect: deselectSpan
		},
		entity: {
			select: selectEntity,
			deselect: deselectEntity
		},
		relation: {
			select: selectRelation,
			deselect: deselectRelation
		},
		entityLabel: {
			update: updateEntityLabel
		}
	};
};
},{"../util/DomUtil":37,"./DomPositionCache":54,"./selectionClass":64}],57:[function(require,module,exports){
module.exports = function(model) {
	var reduce2hash = require('../util/reduce2hash'),
		uri = require('../util/uri'),
		DEFAULT_TYPE = 'something',
		TypeContainer = function(getActualTypesFunction, defaultColor) {
			var definedTypes = {},
				defaultType = DEFAULT_TYPE;

			return {
				setDefinedTypes: function(newDefinedTypes) {
					definedTypes = newDefinedTypes;
				},
				getDeinedTypes: function() {
					return _.extend({}, definedTypes);
				},
				setDefaultType: function(name) {
					defaultType = name;
				},
				getDefaultType: function() {
					return defaultType || this.getSortedNames()[0];
				},
				getColor: function(name) {
					return definedTypes[name] && definedTypes[name].color || defaultColor;
				},
				getUri: function(name) {
					return definedTypes[name] && definedTypes[name].uri ||
						uri.getUrlMatches(name) ? name : undefined;
				},
				getSortedNames: function() {
					if (getActualTypesFunction) {
						var typeCount = getActualTypesFunction()
							.concat(Object.keys(definedTypes))
							.reduce(function(a, b) {
								a[b] = a[b] ? a[b] + 1 : 1;
								return a;
							}, {});

						// Sort by number of types, and by name if numbers are same.
						var typeNames = Object.keys(typeCount);
						typeNames.sort(function(a, b) {
							var diff = typeCount[b] - typeCount[a];
							return diff !== 0 ? diff :
								a > b ? 1 :
								b < a ? -1 :
								0;
						});

						return typeNames;
					} else {
						return [];
					}
				}
			};
		},
		setContainerDefinedTypes = function(container, newDefinedTypes) {
			// expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
			if (newDefinedTypes !== undefined) {
				container.setDefinedTypes(newDefinedTypes.reduce(reduce2hash, {}));
				container.setDefaultType(
					newDefinedTypes.filter(function(type) {
						return type["default"] === true;
					}).map(function(type) {
						return type.name;
					}).shift() || DEFAULT_TYPE
				);
			}
		},
		entityContainer = _.extend(new TypeContainer(model.annotationData.entity.types, '#77DDDD'), {
			isBlock: function(type) {
				// console.log(type, entityContainer.getDeinedTypes(), entityContainer.getDeinedTypes()[type]);
				var definition = entityContainer.getDeinedTypes()[type];
				return definition && definition.type && definition.type === 'block';
			}
		}),
		relationContaier = new TypeContainer(model.annotationData.relation.types, '#555555');

	return {
		entity: entityContainer,
		setDefinedEntityTypes: _.partial(setContainerDefinedTypes, entityContainer),
		relation: relationContaier,
		setDefinedRelationTypes: _.partial(setContainerDefinedTypes, relationContaier)
	};
};
},{"../util/reduce2hash":51,"../util/uri":52}],58:[function(require,module,exports){
var delay150 = function(func) {
        return _.partial(_.delay, func, 150);
    },
    ViewMode = function(editor, model, buttonController, renderFunc) {
        var selector = require('./Selector')(editor, model),
            changeCssClass = function(mode) {
                editor
                    .removeClass('textae-editor_term-mode')
                    .removeClass('textae-editor_instance-mode')
                    .removeClass('textae-editor_relation-mode')
                    .addClass('textae-editor_' + mode + '-mode');
            },
            setSettingButtonEnable = _.partial(buttonController.buttonStateHelper.enabled, 'setting', true),
            setControlButtonForRelation = function(isRelation) {
                buttonController.buttonStateHelper.enabled('replicate-auto', !isRelation);
                buttonController.modeAccordingToButton['relation-edit-mode'].value(isRelation);
            },
            // This notify is off at relation-edit-mode.
            entitySelectChanged = _.compose(buttonController.buttonStateHelper.updateByEntity, selector.entityLabel.update),
            changeLineHeight = function(heightValue) {
                editor.find('.textae-editor__body__text-box').css({
                    'line-height': heightValue + 'px',
                    'padding-top': heightValue / 2 + 'px'
                });
            },
            calculateLineHeight = function(typeGapValue) {
                var TEXT_HEIGHT = 23,
                    MARGIN_TOP = 60,
                    MINIMUM_HEIGHT = 16 * 4,
                    heightOfType = typeGapValue * 18 + 18,
                    maxHeight = _.max(model.annotationData.span.all()
                        .map(function(span) {
                            var height = TEXT_HEIGHT + MARGIN_TOP;
                            var countHeight = function(span) {
                                // Grid height is height of types and margin bottom of the grid.
                                height += span.getTypes().length * heightOfType;
                                if (span.parent) {
                                    countHeight(span.parent);
                                }
                            };

                            countHeight(span);

                            return height;
                        }).concat(MINIMUM_HEIGHT)
                    );

                changeLineHeight(maxHeight);
            },
            typeGapValue = 0,
            TypeStyle = function(newValue) {
                return {
                    height: 18 * newValue + 18 + 'px',
                    'padding-top': 18 * newValue + 'px'
                };
            };

        var api = {
            getTypeGapValue: function() {
                return typeGapValue;
            },
            setTerm: function() {
                changeCssClass('term');
                setSettingButtonEnable();
                setControlButtonForRelation(false);

                model.selectionModel
                    .unbind('entity.select', entitySelectChanged)
                    .unbind('entity.deselect', entitySelectChanged)
                    .unbind('entity.change', entitySelectChanged)
                    .bind('entity.select', entitySelectChanged)
                    .bind('entity.deselect', entitySelectChanged)
                    .bind('entity.change', buttonController.buttonStateHelper.updateByEntity);
            },
            setInstance: function() {
                changeCssClass('instance');
                setSettingButtonEnable();
                setControlButtonForRelation(false);

                model.selectionModel
                    .unbind('entity.select', entitySelectChanged)
                    .unbind('entity.deselect', entitySelectChanged)
                    .unbind('entity.change', buttonController.buttonStateHelper.updateByEntity)
                    .bind('entity.select', entitySelectChanged)
                    .bind('entity.deselect', entitySelectChanged)
                    .bind('entity.change', buttonController.buttonStateHelper.updateByEntity);
            },
            setRelation: function() {
                changeCssClass('relation');
                setSettingButtonEnable();
                setControlButtonForRelation(true);

                model.selectionModel
                    .unbind('entity.select', entitySelectChanged)
                    .unbind('entity.deselect', entitySelectChanged)
                    .unbind('entity.change', buttonController.buttonStateHelper.updateByEntity);
            },
            setEditable: function(isEditable) {
                if (isEditable) {
                    editor.addClass('textae-editor_editable');
                    buttonController.buttonStateHelper.enabled('relation-edit-mode', true);
                } else {
                    editor.removeClass('textae-editor_editable');
                    buttonController.buttonStateHelper.enabled('replicate-auto', false);
                    buttonController.buttonStateHelper.enabled('relation-edit-mode', false);
                }
            },
            getLineHeight: function() {
                return parseInt(editor.find('.textae-editor__body__text-box').css('line-height')) / 16;
            },
            changeLineHeight: changeLineHeight,
            changeTypeGap: function(newValue) {
                if (typeGapValue === newValue) return;

                // init
                if (newValue !== -1) {
                    editor.find('.textae-editor__type')
                        .css(new TypeStyle(newValue));
                    calculateLineHeight(newValue);
                    renderFunc(newValue);
                }

                typeGapValue = newValue;
            },
            getTypeStyle: function() {
                return new TypeStyle(typeGapValue);
            }
        };

        return api;
    };

module.exports = function(editor, model) {
    var selector = require('./Selector')(editor, model),
        clipBoard = {
            // clipBoard has entity type.
            clipBoard: []
        },
        buttonController = require('./ButtonController')(editor, model, clipBoard),
        typeContainer = require('./TypeContainer')(model),
        // Render DOM elements conforming with the Model.
        renderer = require('./renderer/Renderer')(editor, model, buttonController, typeContainer),
        gridLayout = require('./GridLayout')(editor, model.annotationData),
        api = require('../util/extendBindable')({}),
        render = function(typeGapValue) {
            api.trigger('render.start', editor);
            // Do asynchronous to change behavior of editor.
            // For example a wait cursor or a disabled control.
            _.defer(function() {
                gridLayout.arrangePosition(typeGapValue)
                    .then(renderer.renderLazyRelationAll)
                    .then(renderer.arrangeRelationPositionAll)
                    .then(function() {
                        api.trigger('render.end', editor);
                    })
                    .catch(function(error) {
                        console.error(error, error.stack);
                    });
            });
        },
        viewMode = new ViewMode(editor, model, buttonController, render),
        hover = function() {
            var domPositionCaChe = require('./DomPositionCache')(editor, model.annotationData.entity),
                processAccosiatedRelation = function(func, entityId) {
                    model.annotationData.entity.assosicatedRelations(entityId)
                        .map(domPositionCaChe.toConnect)
                        .filter(function(connect) {
                            return connect.pointup && connect.pointdown;
                        })
                        .forEach(func);
                };

            return {
                on: _.partial(processAccosiatedRelation, function(connect) {
                    connect.pointup();
                }),
                off: _.partial(processAccosiatedRelation, function(connect) {
                    connect.pointdown();
                })
            };
        }(),
        setSelectionModelHandler = function() {
            // The buttonController.buttonStateHelper.updateByEntity is set at viewMode.
            // Because entity.change is off at relation-edit-mode.
            model.selectionModel
                .bind('span.select', selector.span.select)
                .bind('span.deselect', selector.span.deselect)
                .bind('span.change', buttonController.buttonStateHelper.updateBySpan)
                .bind('entity.select', selector.entity.select)
                .bind('entity.deselect', selector.entity.deselect)
                .bind('relation.select', delay150(selector.relation.select))
                .bind('relation.deselect', delay150(selector.relation.deselect))
                .bind('relation.change', buttonController.buttonStateHelper.updateByRelation);
        },
        updateDisplay = function() {
            render(viewMode.getTypeGapValue());
        };

    renderer
        .bind('change', updateDisplay)
        .bind('entity.render', function(entity) {
            // Set css accoridng to the typeGapValue. 
            renderer.setEntityCss(entity, viewMode.getTypeStyle());
        });

    return _.extend(api, {
        init: _.compose(setSelectionModelHandler, renderer.setModelHandler),
        viewModel: buttonController,
        clipBoard: clipBoard,
        viewMode: viewMode,
        hoverRelation: hover,
        updateDisplay: updateDisplay,
        typeContainer: typeContainer
    });
};
},{"../util/extendBindable":47,"./ButtonController":53,"./DomPositionCache":54,"./GridLayout":55,"./Selector":56,"./TypeContainer":57,"./renderer/Renderer":61}],59:[function(require,module,exports){
var // Arrange a position of the pane to center entities when entities width is longer than pane width.
	arrangePositionOfPane = function(pane) {
		var paneWidth = pane.outerWidth();
		var entitiesWidth = pane.find('.textae-editor__entity').toArray().map(function(e) {
			return e.offsetWidth;
		}).reduce(function(pv, cv) {
			return pv + cv;
		}, 0);

		pane.css({
			'left': entitiesWidth > paneWidth ? (paneWidth - entitiesWidth) / 2 : 0
		});
	},
	uri = require('../../util/uri'),
	// Display short name for URL(http or https);
	getDisplayName = function(type) {
		// For tunning, search the scheme before execute a regular-expression.
		if (uri.isUri(type)) {
			var matches = uri.getUrlMatches(type);

			if (matches) {
				// Order to dispaly.
				// 1. The anchor without #.
				// 2. The file name with the extention.
				// 3. The last directory name.
				// 4. The domain name.
				return matches[9] ? matches[9].slice(1) :
					matches[6] ? matches[6] + (matches[7] || '') :
					matches[5] ? matches[5].split('/').filter(function(s) {
						return s !== '';
					}).pop() :
					matches[3];
			}
		}
		return type;
	};

module.exports = function(editor, model, typeContainer, gridRenderer, modification) {
	var domUtil = require('../../util/DomUtil')(editor),
		idFactory = require('../../util/IdFactory')(editor),
		getTypeDom = function(spanId, type) {
			return $('#' + idFactory.makeTypeId(spanId, type));
		},
		doesSpanHasNoEntity = function(spanId) {
			return model.annotationData.span.get(spanId).getTypes().length === 0;
		},
		removeEntityElement = function() {
			var doesTypeHasNoEntity = function(entity, typeName) {
				return model.annotationData.span.get(entity.span).getTypes().filter(function(type) {
					return type.name === typeName;
				}).length === 0;
			};

			return function(entity) {
				// Get old type from Dom, Because the entity may have new type when changing type of the entity.
				var oldType = domUtil.selector.entity.get(entity.id).remove().attr('type');

				// Delete type if no entity.
				if (doesTypeHasNoEntity(entity, oldType)) {
					getTypeDom(entity.span, oldType).remove();
				} else {
					// Arrage the position of TypePane, because number of entities decrease.
					arrangePositionOfPane(getTypeDom(entity.span, oldType).find('.textae-editor__entity-pane'));
				}
			};
		}(),
		// An entity is a circle on Type that is an endpoint of a relation.
		// A span have one grid and a grid can have multi types and a type can have multi entities.
		// A grid is only shown when at least one entity is owned by a correspond span.  
		create = function() {
			//render type unless exists.
			var getTypeElement = function() {
					var getUri = function(type) {
							if (uri.isUri(type)) {
								return type;
							} else if (typeContainer.entity.getUri(type)) {
								return typeContainer.entity.getUri(type);
							}
						},
						// A Type element has an entity_pane elment that has a label and will have entities.
						createEmptyTypeDomElement = function(spanId, type) {
							var typeId = idFactory.makeTypeId(spanId, type);

							// The EntityPane will have entities.
							var $entityPane = $('<div>')
								.attr('id', 'P-' + typeId)
								.addClass('textae-editor__entity-pane');

							// The label over the span.
							var $typeLabel = $('<div>')
								.addClass('textae-editor__type-label')
								.css({
									'background-color': typeContainer.entity.getColor(type),
								});

							// Set the name of the label with uri of the type.
							var uri = getUri(type);
							if (uri) {
								$typeLabel.append(
									$('<a target="_blank"/>')
									.attr('href', uri)
									.text(getDisplayName(type))
								);
							} else {
								$typeLabel.text(getDisplayName(type));
							}

							return $('<div>')
								.attr('id', typeId)
								.addClass('textae-editor__type')
								.append($typeLabel)
								.append($entityPane); // Set pane after label because pane is over label.
						},
						getGrid = function(spanId) {
							// Create a grid unless it exists.
							var $grid = domUtil.selector.grid.get(spanId);
							if ($grid.length === 0) {
								return gridRenderer.render(spanId);
							} else {
								return $grid;
							}
						};

					return function(spanId, type) {
						var $type = getTypeDom(spanId, type);
						if ($type.length === 0) {
							$type = createEmptyTypeDomElement(spanId, type);
							getGrid(spanId).append($type);
						}

						return $type;
					};
				}(),
				createEntityElement = function(entity) {
					var $entity = $('<div>')
						.attr('id', idFactory.makeEntityDomId(entity.id))
						.attr('title', entity.id)
						.attr('type', entity.type)
						.addClass('textae-editor__entity')
						.css({
							'border-color': typeContainer.entity.getColor(entity.type)
						});

					// Set css classes for modifications.
					$entity.addClass(modification.getClasses(entity.id));

					return $entity;
				};

			return function(entity) {
				// Replace null to 'null' if type is null and undefined too.
				entity.type = String(entity.type);

				// Append a new entity to the type
				var pane = getTypeElement(entity.span, entity.type)
					.find('.textae-editor__entity-pane')
					.append(createEntityElement(entity));

				arrangePositionOfPane(pane);
			};
		}(),
		api = require('../../util/extendBindable')({}),
		createEntityUnlessBlock = function(entity) {
			if (!typeContainer.entity.isBlock(entity.type)) {
				create(entity);
			}

			api.trigger('render', entity);

			return entity;
		},
		selector = require('../Selector')(editor, model),
		changeTypeOfExists = function(entity) {
			// Remove an old entity.
			removeEntityElement(entity);

			// Show a new entity.
			createEntityUnlessBlock(entity);

			// Re-select a new entity instance.
			if (model.selectionModel.entity.has(entity.id)) {
				selector.entity.select(entity.id);
			}

			return entity;
		},
		changeModificationOfExists = function(entity) {
			var $entity = domUtil.selector.entity.get(entity.id);
			modification.update($entity, entity.id);
		},
		destroy = function(entity) {
			if (doesSpanHasNoEntity(entity.span)) {
				// Destroy a grid when all entities are remove. 
				gridRenderer.remove(entity.span);
			} else {
				// Destroy an each entity.
				removeEntityElement(entity);
			}

			return entity;
		};

	return _.extend(api, {
		render: createEntityUnlessBlock,
		change: changeTypeOfExists,
		changeModification: changeModificationOfExists,
		remove: destroy,
		getTypeDom: function(entity) {
			return getTypeDom(entity.span, entity.type);
		}
	});
};
},{"../../util/DomUtil":37,"../../util/IdFactory":38,"../../util/extendBindable":47,"../../util/uri":52,"../Selector":56}],60:[function(require,module,exports){
var POINTUP_LINE_WIDTH = 3,
	LABEL = {
		cssClass: 'textae-editor__relation__label',
		id: 'label'
	},
	CURVINESS_PARAMETERS = {
		// curviness parameters
		xrate: 0.6,
		yrate: 0.05,

		// curviness offset
		c_offset: 20,
	},
	makeJsPlumbInstance = function(container) {
		var newInstance = jsPlumb.getInstance({
			ConnectionsDetachable: false,
			Endpoint: ['Dot', {
				radius: 1
			}]
		});
		newInstance.setRenderMode(newInstance.SVG);
		newInstance.Defaults.Container = container;
		return newInstance;
	},
	LabelOverlay = function(connect) {
		// Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
		var labelOverlay = connect.getOverlay(LABEL.id);
		if (!labelOverlay) {
			throw 'no label overlay';
		}

		return labelOverlay;
	},
	// A Module to modify jsPlumb Arrow Overlays.
	jsPlumbArrowOverlayUtil = require('./jsPlumbArrowOverlayUtil');

module.exports = function(editor, model, typeContainer, modification) {
	// Init a jsPlumb instance.
	var domUtil = require('../../util/DomUtil')(editor),
		domPositionCaChe = require('../DomPositionCache')(editor, model.annotationData.entity),
		jsPlumbInstance,
		init = function(container) {
			jsPlumbInstance = makeJsPlumbInstance(container);
		},
		ConnectorStrokeStyle = function() {
			var converseHEXinotRGBA = function(color, opacity) {
				var c = color.slice(1);
				r = parseInt(c.substr(0, 2), 16);
				g = parseInt(c.substr(2, 2), 16);
				b = parseInt(c.substr(4, 2), 16);

				return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
			};

			return function(relationId) {
				var type = model.annotationData.relation.get(relationId).type,
					colorHex = typeContainer.relation.getColor(type);

				return {
					lineWidth: 1,
					strokeStyle: converseHEXinotRGBA(colorHex, 1)
				};
			};
		}(),
		// Cache a connect instance.
		cache = function(connect) {
			var relationId = connect.relationId;
			domPositionCaChe.connectCache.set(relationId, connect);
			return connect;
		},
		toAnchors = function(relationId) {
			return {
				sourceId: model.annotationData.relation.get(relationId).subj,
				targetId: model.annotationData.relation.get(relationId).obj
			};
		},
		isGridPrepared = function(relationId) {
			if (!model.annotationData.relation.get(relationId)) return;

			var anchors = toAnchors(relationId);
			return domPositionCaChe.gridPositionCache.isGridPrepared(anchors.sourceId) &&
				domPositionCaChe.gridPositionCache.isGridPrepared(anchors.targetId);
		},
		filterGridExists = function(connect) {
			// The grid may be destroyed when the spans was moved repetitively by undo or redo.   
			if (!isGridPrepared(connect.relationId)) {
				return;
			}
			return connect;
		},
		determineCurviness = function(relationId) {
			var anchors = toAnchors(relationId);
			var sourcePosition = domPositionCaChe.getEntity(anchors.sourceId);
			var targetPosition = domPositionCaChe.getEntity(anchors.targetId);

			var sourceX = sourcePosition.center;
			var targetX = targetPosition.center;

			var sourceY = sourcePosition.top;
			var targetY = targetPosition.top;

			var xdiff = Math.abs(sourceX - targetX);
			var ydiff = Math.abs(sourceY - targetY);
			var curviness = xdiff * CURVINESS_PARAMETERS.xrate + ydiff * CURVINESS_PARAMETERS.yrate + CURVINESS_PARAMETERS.c_offset;
			curviness /= 2.4;

			return curviness;
		},
		render = function() {
			var deleteRender = function(relation) {
					delete relation.render;
					return relation;
				},
				createJsPlumbConnect = function(relation) {
					// Make a connect by jsPlumb.
					return jsPlumbInstance.connect({
						source: domUtil.selector.entity.get(relation.subj),
						target: domUtil.selector.entity.get(relation.obj),
						anchors: ['TopCenter', "TopCenter"],
						connector: ['Bezier', {
							curviness: determineCurviness(relation.id)
						}],
						paintStyle: new ConnectorStrokeStyle(relation.id),
						parameters: {
							'id': relation.id,
						},
						cssClass: 'textae-editor__relation',
						overlays: [
							['Arrow', jsPlumbArrowOverlayUtil.NORMAL_ARROW],
							['Label', _.extend({}, LABEL, {
								label: '[' + relation.id + '] ' + relation.type,
								cssClass: LABEL.cssClass + ' ' + modification.getClasses(relation.id)
							})]
						]
					});
				},
				create = function(relation) {
					return _.extend(createJsPlumbConnect(relation), {
						relationId: relation.id
					});
				},
				extendPointup = function() {
					var Pointupable = function() {
						var hoverupLabel = function(connect) {
								new LabelOverlay(connect).addClass('hover');
								return connect;
							},
							hoverdownLabel = function(connect) {
								new LabelOverlay(connect).removeClass('hover');
								return connect;
							},
							selectLabel = function(connect) {
								new LabelOverlay(connect).addClass('ui-selected');
								return connect;
							},
							deselectLabel = function(connect) {
								new LabelOverlay(connect).removeClass('ui-selected');
								return connect;
							},
							hoverupLine = function(connect) {
								connect.addClass('hover');
								return connect;
							},
							hoverdownLine = function(connect) {
								connect.removeClass('hover');
								return connect;
							},
							selectLine = function(connect) {
								connect.addClass('ui-selected');
								return connect;
							},
							deselectLine = function(connect) {
								connect.removeClass('ui-selected');
								return connect;
							},
							hasClass = function(connect, className) {
								return connect.connector.canvas.classList.contains(className);
							},
							unless = function(connect, predicate, func) {
								// Evaluate lazily to use with _.delay.
								return function() {
									if (!predicate(connect)) func(connect);
								};
							},
							pointupLine = function(getStrokeStyle, connect) {
								connect.setPaintStyle(_.extend(getStrokeStyle(), {
									lineWidth: POINTUP_LINE_WIDTH
								}));
								return connect;
							},
							pointdownLine = function(getStrokeStyle, connect) {
								connect.setPaintStyle(getStrokeStyle());
								return connect;
							};

						return function(relationId, connect) {
							var getStrokeStyle = _.partial(ConnectorStrokeStyle, relationId),
								pointupLineColor = _.partial(pointupLine, getStrokeStyle),
								pointdownLineColor = _.partial(pointdownLine, getStrokeStyle),
								unlessSelect = _.partial(unless, connect, function(connect) {
									return hasClass(connect, 'ui-selected');
								}),
								unlessDead = _.partial(unless, connect, function(connect) {
									return connect.dead;
								}),
								hoverup = _.compose(
									hoverupLine,
									hoverupLabel,
									pointupLineColor,
									jsPlumbArrowOverlayUtil.showBigArrow
								),
								hoverdown = _.compose(
									hoverdownLine,
									hoverdownLabel,
									pointdownLineColor,
									jsPlumbArrowOverlayUtil.hideBigArrow
								),
								select = _.compose(
									selectLine,
									selectLabel,
									hoverdownLine,
									hoverdownLabel,
									pointupLineColor,
									jsPlumbArrowOverlayUtil.showBigArrow
								),
								deselect = _.compose(
									deselectLine,
									deselectLabel,
									pointdownLineColor,
									jsPlumbArrowOverlayUtil.hideBigArrow
								);

							return {
								pointup: unlessSelect(hoverup),
								pointdown: unlessSelect(hoverdown),
								select: unlessDead(select),
								deselect: unlessDead(deselect)
							};
						};
					}();

					return function(connect) {
						var relationId = connect.relationId;
						return _.extend(
							connect,
							new Pointupable(relationId, connect)
						);
					};
				}(),
				// Set hover action.
				hoverize = function() {
					var bindHoverAction = function(jsPlumbElement, onMouseOver, onMouseRemove) {
							jsPlumbElement.bind('mouseenter', onMouseOver).bind('mouseexit', onMouseRemove);
						},
						pointup = function(connect) {
							connect.pointup();
						},
						pointdown = function(connect) {
							connect.pointdown();
						},
						toComponent = function(label) {
							return label.component;
						},
						bindConnect = function(connect) {
							bindHoverAction(connect, pointup, pointdown);
							return connect;
						},
						bindLabel = function(connect) {
							bindHoverAction(
								new LabelOverlay(connect),
								_.compose(pointup, toComponent),
								_.compose(pointdown, toComponent)
							);
							return connect;
						};

					return _.compose(bindLabel, bindConnect);
				}(),
				extendApi = function() {
					// Extend module for jsPlumb.Connection.
					var Api = function(connect) {
						var bindClickAction = function(onClick) {
							this.bind('click', onClick);
							this.getOverlay(LABEL.id).bind('click', function(label, event) {
								onClick(label.component, event);
							});
						};

						return _.extend({
							bindClickAction: bindClickAction
						});
					};

					return function(connect) {
						return _.extend(
							connect,
							new Api(connect)
						);
					};
				}(),
				// Notify to controller that a new jsPlumbConnection is added.
				notify = function(connect) {
					editor.trigger('textae.editor.jsPlumbConnection.add', connect);
					return connect;
				};

			return _.compose(
				cache,
				notify,
				extendApi,
				hoverize,
				extendPointup,
				create,
				deleteRender
			);
		}(),
		Promise = require('Promise'),
		// Create a dummy relation when before moving grids after creation grids.
		// Because a jsPlumb error occurs when a relation between same points.
		// And entities of same length spans was same point before moving grids.
		renderLazy = function() {
			var extendRelationId = function(relation) {
					return _.extend(relation, {
						relationId: relation.id
					});
				},
				renderIfGridExists = function(relation) {
					if (filterGridExists(relation)) render(relation);
				},
				extendDummyApiToCreateRlationWhenGridMoved = function(relation) {
					var render = function() {
						return new Promise(function(resolve, reject) {
							_.defer(function() {
								try {
									renderIfGridExists(relation);
									resolve(relation);
								} catch (error) {
									reject(error);
								}
							});
						});
					};

					return _.extend(relation, {
						render: render
					});
				};

			return _.compose(cache, extendDummyApiToCreateRlationWhenGridMoved, extendRelationId);
		}(),
		Connect = function(relationId) {
			var connect = domPositionCaChe.toConnect(relationId);
			if (!connect) {
				throw 'no connect';
			}

			return connect;
		},
		changeType = function(relation) {
			var connect = new Connect(relation.id),
				strokeStyle = new ConnectorStrokeStyle(relation.id);

			// The connect may be an object for lazyRender instead of jsPlumb.Connection.
			// This occurs when changing types and deletes was reverted.
			if (connect instanceof jsPlumb.Connection) {
				if (model.selectionModel.relation.has(relation.id)) {
					// Re-set style of the line and arrow if selected.
					strokeStyle.lineWidth = POINTUP_LINE_WIDTH;
				}
				connect.setPaintStyle(strokeStyle);

				new LabelOverlay(connect).setLabel('[' + relation.id + '] ' + relation.type);
			}
		},
		changeJsModification = function(relation) {
			var connect = new Connect(relation.id);

			// A connect may be an object before it rendered.
			if (connect instanceof jsPlumb.Connection) {
				modification.update(new LabelOverlay(connect), relation.id);
			}
		},
		remove = function(relation) {
			var connect = new Connect(relation.id);
			jsPlumbInstance.detach(connect);
			domPositionCaChe.connectCache.remove(relation.id);

			// Set the flag dead already to delay selection.
			connect.dead = true;
		},
		resetAllCurviness = function() {
			model.annotationData.relation
				.all()
				.map(function(relation) {
					return new Connect(relation.id);
				})
				.filter(function(connect) {
					// Set changed values only.
					return connect.setConnector &&
						connect.connector.getCurviness() !== determineCurviness(connect.relationId);
				})
				.forEach(function(connect) {
					connect.setConnector(['Bezier', {
						curviness: determineCurviness(connect.relationId)
					}]);
					// Re-set arrow because it is disappered when setConnector is called.
					jsPlumbArrowOverlayUtil.resetArrows(connect);
				});
		},
		renderLazyRelationAll = function() {
			// Render relations unless rendered.
			return Promise.all(
				model.annotationData.relation
				.all()
				.filter(function(connect) {
					return connect.render;
				})
				.map(function(connect) {
					return connect.render();
				})
			);
		},
		reselectAll = function() {
			model.selectionModel.relation
				.all()
				.map(function(relationId) {
					return new Connect(relationId);
				})
				.filter(function(connect) {
					return connect instanceof jsPlumb.Connection;
				})
				.forEach(function(connect) {
					connect.select();
				});
		},
		arrangePositionAll = function() {
			return new Promise(function(resolve, reject) {
				_.defer(function() {
					try {
						// For tuning
						// var startTime = new Date();

						resetAllCurviness();
						jsPlumbInstance.repaintEverything();
						reselectAll();

						// For tuning
						// var endTime = new Date();
						// console.log(editor.editorId, 'arrangePositionAll : ', endTime.getTime() - startTime.getTime() + 'ms');

						resolve();
					} catch (error) {
						reject(error);
						throw error;
					}
				});
			});
		};

	return {
		init: init,
		reset: function() {
			jsPlumbInstance.reset();
			domPositionCaChe.connectCache.clear();
		},
		render: renderLazy,
		change: changeType,
		changeModification: changeJsModification,
		remove: remove,
		renderLazyRelationAll: renderLazyRelationAll,
		arrangePositionAll: arrangePositionAll
	};
};
},{"../../util/DomUtil":37,"../DomPositionCache":54,"./jsPlumbArrowOverlayUtil":63,"Promise":2}],61:[function(require,module,exports){
var getElement = function($parent, tagName, className) {
        var $area = $parent.find('.' + className);
        if ($area.length === 0) {
            $area = $('<' + tagName + '>').addClass(className);
            $parent.append($area);
        }
        return $area;
    },
    modelToId = function(modelElement) {
        return modelElement.id;
    },
    capitalize = require('../../util/capitalize');

module.exports = function(editor, model, viewModel, typeContainer) {
    var // Make the display area for text, spans, denotations, relations.
        displayArea = _.partial(getElement, editor, 'div', 'textae-editor__body'),
        // Get the display area for denotations and relations.
        getAnnotationArea = function() {
            return getElement(displayArea(), 'div', 'textae-editor__body__annotation-box');
        },
        renderSourceDocument = function() {
            // Get the display area for text and spans.
            var getSourceDocArea = function() {
                    return getElement(displayArea(), 'div', 'textae-editor__body__text-box');
                },
                // the Souce document has multi paragraphs that are splited by '\n'.
                createTaggedSourceDoc = function(params) {
                    //set sroucedoc tagged <p> per line.
                    return params.sourceDoc.split("\n").map(function(content, index) {
                        return '<p class="textae-editor__body__text-box__paragraph-margin">' +
                            '<span class="textae-editor__body__text-box__paragraph" id="' +
                            params.paragraphs[index].id +
                            '" >' +
                            content +
                            '</span></p>';
                    }).join("\n");
                };

            return function(params) {
                // Render the source document
                getSourceDocArea().html(createTaggedSourceDoc(params));
            };
        }(),
        domPositionCaChe = require('../DomPositionCache')(editor, model.annotationData.entity),
        reset = function() {
            var renderAllSpan = function(annotationData) {
                    // For tuning
                    // var startTime = new Date();

                    annotationData.span.topLevel().forEach(function(span) {
                        rendererImpl.span.render(span);
                    });

                    // For tuning
                    // var endTime = new Date();
                    // console.log('render all span : ', endTime.getTime() - startTime.getTime() + 'ms');
                },
                renderAllRelation = function(annotationData) {
                    rendererImpl.relation.reset();
                    annotationData.relation.all().forEach(rendererImpl.relation.render);
                };

            return function(annotationData) {
                // Render annotations
                getAnnotationArea().empty();
                domPositionCaChe.gridPositionCache.clear();
                renderAllSpan(annotationData);

                // Render relations
                renderAllRelation(annotationData);
            };
        }(),
        rendererImpl = function() {
            var gridRenderer = function() {
                    var domUtil = require('../../util/DomUtil')(editor),
                        createGrid = function(container, spanId) {
                            var spanPosition = domPositionCaChe.getSpan(spanId);
                            var $grid = $('<div>')
                                .attr('id', 'G' + spanId)
                                .addClass('textae-editor__grid')
                                .addClass('hidden')
                                .css({
                                    'width': spanPosition.width
                                });

                            //append to the annotation area.
                            container.append($grid);

                            return $grid;
                        },
                        destroyGrid = function(spanId) {
                            domUtil.selector.grid.get(spanId).remove();
                            domPositionCaChe.gridPositionCache.remove(spanId);
                        },
                        init = function(container) {
                            gridRenderer.render = _.partial(createGrid, container);
                        };

                    return {
                        init: init,
                        // The render is set at init.
                        render: null,
                        remove: destroyGrid
                    };
                }(),
                modificationRenderer = function() {
                    var getClasses = function(objectId) {
                        return model.annotationData.getModificationOf(objectId)
                            .map(function(m) {
                                return 'textae-editor__' + m.pred.toLowerCase();
                            }).join(' ');
                    };

                    return {
                        getClasses: getClasses,
                        update: function() {
                            var allModificationClasses = 'textae-editor__negation textae-editor__speculation';

                            return function(domElement, objectId) {
                                domElement.removeClass(allModificationClasses);
                                domElement.addClass(getClasses(objectId));
                            };
                        }(),
                    };
                }(),
                entityRenderer = require('./EntityRenderer')(editor, model, typeContainer, gridRenderer, modificationRenderer),
                spanRenderer = require('./SpanRenderer')(editor, model, typeContainer, entityRenderer, gridRenderer),
                relationRenderer = require('./RelationRenderer')(editor, model, typeContainer, modificationRenderer);

            return {
                init: function(container) {
                    gridRenderer.init(container);
                    relationRenderer.init(container);
                },
                span: spanRenderer,
                entity: entityRenderer,
                relation: relationRenderer
            };
        }(),
        api = require('../../util/extendBindable')({}),
        triggerChange = _.debounce(function() {
            api.trigger('change');
        }, 100),
        triggerChangeAfter = _.partial(_.compose, triggerChange),
        updateSpanAfter = function() {
            var entityToSpan = function(entity) {
                return model.annotationData.span.get(entity.span);
            };

            return _.partial(_.compose, triggerChange, rendererImpl.span.change, entityToSpan);
        }(),
        renderModificationEntityOrRelation = function() {
            var renderModification = function(modelType, modification) {
                    var target = model.annotationData[modelType].get(modification.obj);
                    if (target) {
                        rendererImpl[modelType].changeModification(target);
                        viewModel.buttonStateHelper['updateBy' + capitalize(modelType)]();
                    }

                    return modification;
                },
                renderModificationOfEntity = _.partial(renderModification, 'entity'),
                renderModificationOfRelation = _.partial(renderModification, 'relation');

            return _.compose(renderModificationOfEntity, renderModificationOfRelation);
        }();

    rendererImpl.entity.bind('render', function(entity) {
        api.trigger('entity.render', entity);
        return entity;
    });

    _.extend(api, {
        setModelHandler: function() {
            rendererImpl.init(getAnnotationArea());

            model.annotationData
                .bind('change-text', renderSourceDocument)
                .bind('all.change', _.compose(model.selectionModel.clear, reset))
                .bind('span.add', triggerChangeAfter(rendererImpl.span.render))
                .bind('span.remove', triggerChangeAfter(rendererImpl.span.remove))
                .bind('span.remove', _.compose(model.selectionModel.span.remove, modelToId))
                .bind('entity.add', updateSpanAfter(rendererImpl.entity.render))
                .bind('entity.change', updateSpanAfter(rendererImpl.entity.change))
                .bind('entity.remove', updateSpanAfter(rendererImpl.entity.remove))
                .bind('entity.remove', _.compose(model.selectionModel.entity.remove, modelToId))
                .bind('relation.add', triggerChangeAfter(rendererImpl.relation.render))
                .bind('relation.change', rendererImpl.relation.change)
                .bind('relation.remove', rendererImpl.relation.remove)
                .bind('relation.remove', _.compose(model.selectionModel.relation.remove, modelToId))
                .bind('modification.add', renderModificationEntityOrRelation)
                .bind('modification.remove', renderModificationEntityOrRelation);
        },
        arrangeRelationPositionAll: rendererImpl.relation.arrangePositionAll,
        renderLazyRelationAll: rendererImpl.relation.renderLazyRelationAll,
        setEntityCss: function(entity, css) {
            rendererImpl
                .entity
                .getTypeDom(entity)
                .css(css);
        }
    });

    return api;
};
},{"../../util/DomUtil":37,"../../util/capitalize":40,"../../util/extendBindable":47,"../DomPositionCache":54,"./EntityRenderer":59,"./RelationRenderer":60,"./SpanRenderer":62}],62:[function(require,module,exports){
var getPosition = function(span, textNodeStartPosition) {
		var startPos = span.begin - textNodeStartPosition;
		var endPos = span.end - textNodeStartPosition;
		return {
			start: startPos,
			end: endPos
		};
	},
	validatePosition = function(position, textNode, span) {
		if (position.start < 0 || textNode.length < position.end) {
			throw new Error('oh my god! I cannot render this span. ' + span.toStringOnlyThis() + ', textNode ' + textNode.textContent);
		}
	},
	createRange = function(textNode, position) {
		var range = document.createRange();
		range.setStart(textNode, position.start);
		range.setEnd(textNode, position.end);
		return range;
	},
	// Create the Range to a new span add 
	createSpanRange = function(span, textNodeStartPosition, textNode) {
		var position = getPosition(span, textNodeStartPosition);
		validatePosition(position, textNode, span);

		return createRange(textNode, position);
	},
	isTextNode = function() {
		return this.nodeType === 3; //TEXT_NODE
	},
	getFirstTextNode = function($element) {
		return $element.contents().filter(isTextNode).get(0);
	},
	getParagraphElement = function(paragraphId) {
		return $('#' + paragraphId);
	},
	createRangeForFirstSpan = function(getJqueryObjectFunc, span, textaeRange) {
		var getTextNode = _.compose(getFirstTextNode, getJqueryObjectFunc);
		var textNode = getTextNode(textaeRange.id);
		return createSpanRange(span, textaeRange.begin, textNode);
	},
	createRangeForFirstSpanInParagraph = _.partial(createRangeForFirstSpan, getParagraphElement),
	createSpanElement = function(span) {
		var element = document.createElement('span');
		element.setAttribute('id', span.id);
		element.setAttribute('title', span.id);
		element.setAttribute('class', 'textae-editor__span');
		return element;
	},
	exists = function(span) {
		return document.getElementById(span.id) !== null;
	},
	not = function(value) {
		return !value;
	};

module.exports = function(editor, model, typeContainer, entityRenderer, gridRenderer) {
	var domUtil = require('../../util/DomUtil')(editor),
		// Get the Range to that new span tag insert.
		// This function works well when no child span is rendered. 
		getRangeToInsertSpanTag = function(span) {
			var createRangeForFirstSpanInParent = _.partial(createRangeForFirstSpan, domUtil.selector.span.get);

			// The parent of the bigBrother is same with span, which is a span or the root of spanTree. 
			var bigBrother = span.getBigBrother();
			if (bigBrother) {
				// The target text arrounded by span is in a textNode after the bigBrother if bigBrother exists.
				return createSpanRange(span, bigBrother.end, document.getElementById(bigBrother.id).nextSibling);
			} else {
				// The target text arrounded by span is the first child of parent unless bigBrother exists.
				if (span.parent) {
					// The parent is span.
					// This span is first child of span.
					return createRangeForFirstSpanInParent(span, span.parent);
				} else {
					// The parent is paragraph
					return createRangeForFirstSpanInParagraph(span, span.paragraph);
				}
			}
		},
		appendSpanElement = function(span, element) {
			getRangeToInsertSpanTag(span).surroundContents(element);

			return span;
		},
		renderSingleSpan = function(span) {
			return appendSpanElement(span, createSpanElement(span));
		},
		isBlockSpan = function(span) {
			return span.getTypes().filter(function(type) {
				return typeContainer.entity.isBlock(type.name);
			}).length > 0;
		},
		renderBlockOfSpan = function(span) {
			var $span = domUtil.selector.span.get(span.id);

			if (isBlockSpan(span)) {
				$span.addClass('textae-editor__span--block');
			} else {
				$span.removeClass('textae-editor__span--block');
			}

			return span;
		},
		renderEntitiesOfType = function(type) {
			type.entities.forEach(_.compose(entityRenderer.render, model.annotationData.entity.get));
		},
		renderEntitiesOfSpan = function(span) {
			span.getTypes()
				.forEach(renderEntitiesOfType);

			return span;
		},
		destroy = function(span) {
			var spanElement = document.getElementById(span.id);
			var parent = spanElement.parentNode;

			// Move the textNode wrapped this span in front of this span.
			while (spanElement.firstChild) {
				parent.insertBefore(spanElement.firstChild, spanElement);
			}

			$(spanElement).remove();
			parent.normalize();

			// Destroy a grid of the span. 
			gridRenderer.remove(span.id);
		},
		destroyChildrenSpan = function(span) {
			// Destroy DOM elements of descendant spans.
			var destroySpanRecurcive = function(span) {
				span.children.forEach(function(span) {
					destroySpanRecurcive(span);
				});
				destroy(span);
			};

			// Destroy rendered children.
			span.children.filter(exists).forEach(destroySpanRecurcive);

			return span;
		},
		renderChildresnSpan = function(span) {
			span.children.filter(_.compose(not, exists))
				.forEach(create);

			return span;
		},
		// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
		create = _.compose(renderChildresnSpan, renderEntitiesOfSpan, renderBlockOfSpan, renderSingleSpan, destroyChildrenSpan);

	return {
		render: create,
		remove: destroy,
		change: renderBlockOfSpan
	};
};
},{"../../util/DomUtil":37}],63:[function(require,module,exports){
var // Overlay styles for jsPlubm connections.
	NORMAL_ARROW = {
		width: 7,
		length: 9,
		location: 1,
		id: 'normal-arrow'
	},
	HOVER_ARROW = {
		width: 14,
		length: 18,
		location: 1,
		id: 'hover-arrow',
	},
	addArrow = function(id, connect) {
		if (id === NORMAL_ARROW.id) {
			connect.addOverlay(['Arrow', NORMAL_ARROW]);
		} else if (id === HOVER_ARROW.id) {
			connect.addOverlay(['Arrow', HOVER_ARROW]);
		}
		return connect;
	},
	addArrows = function(connect, arrows) {
		arrows.forEach(function(id) {
			addArrow(id, connect);
		});
		return arrows;
	},
	getArrowIds = function(connect) {
		return connect.getOverlays()
			.filter(function(overlay) {
				return overlay.type === 'Arrow';
			})
			.map(function(arrow) {
				return arrow.id;
			});
	},
	hasNormalArrow = function(connect) {
		return connect.getOverlay(NORMAL_ARROW.id);
	},
	hasHoverArrow = function(connect) {
		return connect.getOverlay(HOVER_ARROW.id);
	},
	removeArrow = function(id, connect) {
		connect.removeOverlay(id);
		return connect;
	},
	removeArrows = function(connect, arrows) {
		arrows.forEach(function(id) {
			removeArrow(id, connect);
		});
		return arrows;
	},
	resetArrows = function(connect) {
		_.compose(
			_.partial(addArrows, connect),
			_.partial(removeArrows, connect),
			getArrowIds
		)(connect);
	},
	addNormalArrow = _.partial(addArrow, NORMAL_ARROW.id),
	addHoverArrow = _.partial(addArrow, HOVER_ARROW.id),
	removeNormalArrow = _.partial(removeArrow, NORMAL_ARROW.id),
	removeHoverArrow = _.partial(removeArrow, HOVER_ARROW.id),
	// Remove a normal arrow and add a new big arrow.
	// Because an arrow is out of position if hideOverlay and showOverlay is used.
	switchHoverArrow = _.compose(
		addHoverArrow,
		removeNormalArrow
	),
	switchNormalArrow = _.compose(
		addNormalArrow,
		removeHoverArrow
	);

module.exports = {
	NORMAL_ARROW: NORMAL_ARROW,
	resetArrows: resetArrows,
	showBigArrow: function(connect) {
		// Do not add a big arrow twice when a relation has been selected during hover.
		if (hasHoverArrow(connect)) {
			return connect;
		}

		return switchHoverArrow(connect);
	},
	hideBigArrow: function(connect) {
		// Already affected
		if (hasNormalArrow(connect))
			return connect;

		return switchNormalArrow(connect);
	}
};
},{}],64:[function(require,module,exports){
// Add or Remove class to indicate selected state.
module.exports = function() {
    var addClass = function($target) {
            return $target.addClass('ui-selected');
        },
        removeClass = function($target) {
            return $target.removeClass('ui-selected');
        };

    return {
        addClass: addClass,
        removeClass: removeClass
    };
}();
},{}]},{},[16]);
//for module pattern with tail.js
(function(jQuery) { // Application main
	$(function() {
		//setup contorl
		$(".textae-control").textae();

		//setup editor
		$(".textae-editor").textae();
	});
})(jQuery);