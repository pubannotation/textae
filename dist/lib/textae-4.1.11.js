(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    if (promise.isRejected()) {
        return promise;
    }
    ret.setHowMany(1);
    ret.setUnwrap();
    ret.init();
    return promise;
}

Promise.any = function (promises) {
    return any(promises);
};

Promise.prototype.any = function () {
    return any(this);
};

};

},{}],2:[function(require,module,exports){
(function (process){
"use strict";
var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = require("./schedule.js");
var Queue = require("./queue.js");
var _process = typeof process !== "undefined" ? process : undefined;

function Async() {
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();
    };
    this._schedule =
        schedule.isStatic ? schedule(this.drainQueues) : schedule;
}

Async.prototype.haveItemsQueued = function () {
    return this._normalQueue.length() > 0;
};

Async.prototype._withDomain = function(fn) {
    if (_process !== undefined &&
        _process.domain != null &&
        !fn.domain) {
        fn = _process.domain.bind(fn);
    }
    return fn;
};

Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
        arg = fn;
        fn = function () { throw arg; };
    }
    fn = this._withDomain(fn);
    if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
            fn(arg);
        }, 0);
    } else try {
        this._schedule(function() {
            fn(arg);
        });
    } catch (e) {
        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/m3OTXk\u000a");
    }
};

Async.prototype.invokeLater = function (fn, receiver, arg) {
    fn = this._withDomain(fn);
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
};

Async.prototype.invokeFirst = function (fn, receiver, arg) {
    fn = this._withDomain(fn);
    this._normalQueue.unshift(fn, receiver, arg);
    this._queueTick();
};

Async.prototype.invoke = function (fn, receiver, arg) {
    fn = this._withDomain(fn);
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
};

Async.prototype.settlePromises = function(promise) {
    this._normalQueue._pushOne(promise);
    this._queueTick();
};

Async.prototype._drainQueue = function(queue) {
    while (queue.length() > 0) {
        var fn = queue.shift();
        if (typeof fn !== "function") {
            fn._settlePromises();
            continue;
        }
        var receiver = queue.shift();
        var arg = queue.shift();
        fn.call(receiver, arg);
    }
};

Async.prototype._drainQueues = function () {
    this._drainQueue(this._normalQueue);
    this._reset();
    this._drainQueue(this._lateQueue);
};

Async.prototype._queueTick = function () {
    if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
    }
};

Async.prototype._reset = function () {
    this._isTickUsed = false;
};

module.exports = new Async();
module.exports.firstLineError = firstLineError;

}).call(this,require('_process'))
},{"./queue.js":24,"./schedule.js":27,"_process":38}],3:[function(require,module,exports){
"use strict";
var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict() {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
var bluebird = require("./promise.js")();
bluebird.noConflict = noConflict;
module.exports = bluebird;

},{"./promise.js":19}],4:[function(require,module,exports){
"use strict";
var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = require("./util.js");
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

function makeMethodCaller (methodName) {
    return new Function("obj", "                                             \n\
        'use strict'                                                         \n\
        var len = this.length;                                               \n\
        switch(len) {                                                        \n\
            case 1: return obj.methodName(this[0]);                          \n\
            case 2: return obj.methodName(this[0], this[1]);                 \n\
            case 3: return obj.methodName(this[0], this[1], this[2]);        \n\
            case 0: return obj.methodName();                                 \n\
            default: return obj.methodName.apply(obj, this);                 \n\
        }                                                                    \n\
        ".replace(/methodName/g, methodName));
}

function makeGetter (propertyName) {
    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
}

function getCompiled(name, compiler, cache) {
    var ret = cache[name];
    if (typeof ret !== "function") {
        if (!isIdentifier(name)) {
            return null;
        }
        ret = compiler(name);
        cache[name] = ret;
        cache[" size"]++;
        if (cache[" size"] > 512) {
            var keys = Object.keys(cache);
            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
            cache[" size"] = keys.length - 256;
        }
    }
    return ret;
}

function getMethodCaller(name) {
    return getCompiled(name, makeMethodCaller, callerCache);
}

function getGetter(name) {
    return getCompiled(name, makeGetter, getterCache);
}

function caller(obj) {
    return obj[this.pop()].apply(obj, this);
}
Promise.prototype.call = function (methodName) {
    var $_len = arguments.length;var args = new Array($_len - 1); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];}
    if (canEvaluate) {
        var maybeCaller = getMethodCaller(methodName);
        if (maybeCaller !== null) {
            return this._then(
                maybeCaller, undefined, undefined, args, undefined);
        }
    }
    args.push(methodName);
    return this._then(caller, undefined, undefined, args, undefined);
};

function namedGetter(obj) {
    return obj[this];
}
function indexedGetter(obj) {
    var index = +this;
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}
Promise.prototype.get = function (propertyName) {
    var isIndex = (typeof propertyName === "number");
    var getter;
    if (!isIndex) {
        if (canEvaluate) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
        } else {
            getter = namedGetter;
        }
    } else {
        getter = indexedGetter;
    }
    return this._then(getter, undefined, undefined, propertyName, undefined);
};
};

},{"./util.js":34}],5:[function(require,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var errors = require("./errors.js");
var async = require("./async.js");
var CancellationError = errors.CancellationError;

Promise.prototype._cancel = function (reason) {
    if (!this.isCancellable()) return this;
    var parent;
    var promiseToReject = this;
    while ((parent = promiseToReject._cancellationParent) !== undefined &&
        parent.isCancellable()) {
        promiseToReject = parent;
    }
    this._unsetCancellable();
    promiseToReject._target()._rejectCallback(reason, false, true);
};

Promise.prototype.cancel = function (reason) {
    if (!this.isCancellable()) return this;
    if (reason === undefined) reason = new CancellationError();
    async.invokeLater(this._cancel, this, reason);
    return this;
};

Promise.prototype.cancellable = function () {
    if (this._cancellable()) return this;
    this._setCancellable();
    this._cancellationParent = undefined;
    return this;
};

Promise.prototype.uncancellable = function () {
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 4);
    ret._follow(this);
    ret._unsetCancellable();
    return ret;
};

Promise.prototype.fork = function (didFulfill, didReject, didProgress) {
    var ret = this._then(didFulfill, didReject, didProgress,
                         undefined, undefined);

    ret._setCancellable();
    ret._cancellationParent = undefined;
    return ret;
};
};

},{"./async.js":2,"./errors.js":10}],6:[function(require,module,exports){
(function (process){
"use strict";
module.exports = function() {
var async = require("./async.js");
var inherits = require("./util.js").inherits;
var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](main|debug|zalgo)/;
var stackFramePattern = null;
var formatStack = null;

function CapturedTrace(parent) {
    this._parent = parent;
    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
    captureStackTrace(this, CapturedTrace);
    if (length > 32) this.uncycle();
}
inherits(CapturedTrace, Error);

CapturedTrace.prototype.uncycle = function() {
    var length = this._length;
    if (length < 2) return;
    var nodes = [];
    var stackToIndex = {};

    for (var i = 0, node = this; node !== undefined; ++i) {
        nodes.push(node);
        node = node._parent;
    }
    length = this._length = i;
    for (var i = length - 1; i >= 0; --i) {
        var stack = nodes[i].stack;
        if (stackToIndex[stack] === undefined) {
            stackToIndex[stack] = i;
        }
    }
    for (var i = 0; i < length; ++i) {
        var currentStack = nodes[i].stack;
        var index = stackToIndex[currentStack];
        if (index !== undefined && index !== i) {
            if (index > 0) {
                nodes[index - 1]._parent = undefined;
                nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = undefined;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

            if (index < length - 1) {
                cycleEdgeNode._parent = nodes[index + 1];
                cycleEdgeNode._parent.uncycle();
                cycleEdgeNode._length =
                    cycleEdgeNode._parent._length + 1;
            } else {
                cycleEdgeNode._parent = undefined;
                cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
                nodes[j]._length = currentChildLength;
                currentChildLength++;
            }
            return;
        }
    }
};

CapturedTrace.prototype.parent = function() {
    return this._parent;
};

CapturedTrace.prototype.hasParent = function() {
    return this._parent !== undefined;
};

CapturedTrace.prototype.attachExtraTrace = function(error) {
    if (error.__stackCleaned__) return;
    this.uncycle();
    var header = CapturedTrace.cleanHeaderStack(error, false);
    var stacks = [header.slice(1)];
    var trace = this;

    while (trace !== undefined) {
        stacks.push(cleanStack(trace.stack.split("\n"), 0));
        trace = trace._parent;
    }
    removeCommonRoots(stacks);
    removeDuplicateOrEmptyJumps(stacks);
    var message = header[0].split("\u0002\u0000\u0001").join("\n");
    error.stack = reconstructStack(message, stacks);
};

function reconstructStack(message, stacks) {
    for (var i = 0; i < stacks.length - 1; ++i) {
        stacks[i].push("From previous event:");
        stacks[i] = stacks[i].join("\n");
    }
    stacks[i] = stacks[i].join("\n");
    return message + "\n" + stacks.join("\n");
}

function removeDuplicateOrEmptyJumps(stacks) {
    for (var i = 0; i < stacks.length; ++i) {
        if (stacks[i].length === 0 ||
            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
            stacks.splice(i, 1);
            i--;
        }
    }
}

function removeCommonRoots(stacks) {
    var current = stacks[0];
    for (var i = 1; i < stacks.length; ++i) {
        var prev = stacks[i];
        var currentLastIndex = current.length - 1;
        var currentLastLine = current[currentLastIndex];
        var commonRootMeetPoint = -1;

        for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
                commonRootMeetPoint = j;
                break;
            }
        }

        for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
                current.pop();
                currentLastIndex--;
            } else {
                break;
            }
        }
        current = prev;
    }
}

function protectErrorMessageNewlines (stack) {
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
        }
    }
    if (i <= 1) return 1;
    var errorMessageLines = [];
    for (var j = 0; j < i; ++j) {
        errorMessageLines.push(stack.shift());
    }
    stack.unshift(errorMessageLines.join("\u0002\u0000\u0001"));
    return i;
}

function unProtectNewlines(stack) {
    if (stack.length > 0) {
        stack[0] = stack[0].split("\u0002\u0000\u0001").join("\n");
    }
    return stack;
}

function cleanStack(stack, initialIndex) {
    var ret = stack.slice(0, initialIndex);
    for (var i = initialIndex; i < stack.length; ++i) {
        var line = stack[i];
        var isTraceLine = stackFramePattern.test(line) ||
            "    (No stack trace)" === line;
        var isInternalFrame = isTraceLine && shouldIgnore(line);
        if (isTraceLine && !isInternalFrame) {
            ret.push(line);
        }
    }
    return ret;
}

CapturedTrace.cleanHeaderStack = function(error, shouldUnProtectNewlines) {
    if (error.__stackCleaned__) return;
    error.__stackCleaned__ = true;
    var stack = error.stack;
    stack = typeof stack === "string"
        ? stack.split("\n")
        : [error.toString(), "    (No stack trace)"];
    var initialIndex = protectErrorMessageNewlines(stack);
    stack = cleanStack(stack, initialIndex);
    if (shouldUnProtectNewlines) stack = unProtectNewlines(stack);
    error.stack = stack.join("\n");
    return stack;
};

CapturedTrace.formatAndLogError = function(error, title) {
    if (typeof console === "object") {
        var message;
        if (typeof error === "object" || typeof error === "function") {
            var stack = error.stack;
            message = title + formatStack(stack, error);
        } else {
            message = title + String(error);
        }
        if (typeof console.warn === "function" ||
            typeof console.warn === "object") {
            console.warn(message);
        } else if (typeof console.log === "function" ||
            typeof console.log === "object") {
            console.log(message);
        }
    }
};

CapturedTrace.unhandledRejection = function (reason) {
    CapturedTrace.formatAndLogError(reason, "^--- With additional stack trace: ");
};

CapturedTrace.isSupported = function () {
    return typeof captureStackTrace === "function";
};

CapturedTrace.fireRejectionEvent =
function(name, localHandler, reason, promise) {
    var localEventFired = false;
    try {
        if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
                localHandler(promise);
            } else {
                localHandler(reason, promise);
            }
        }
    } catch (e) {
        async.throwLater(e);
    }

    var globalEventFired = false;
    try {
        globalEventFired = fireGlobalEvent(name, reason, promise);
    } catch (e) {
        globalEventFired = true;
        async.throwLater(e);
    }

    var domEventFired = false;
    if (fireDomEvent) {
        try {
            domEventFired = fireDomEvent(name.toLowerCase(), {
                reason: reason,
                promise: promise
            });
        } catch (e) {
            domEventFired = true;
            async.throwLater(e);
        }
    }

    if (!globalEventFired && !localEventFired && !domEventFired &&
        name === "unhandledRejection") {
        CapturedTrace.formatAndLogError(reason, "Possibly unhandled ");
    }
};

function formatNonError(obj) {
    var str;
    if (typeof obj === "function") {
        str = "[function " +
            (obj.name || "anonymous") +
            "]";
    } else {
        str = obj.toString();
        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
        if (ruselessToString.test(str)) {
            try {
                var newStr = JSON.stringify(obj);
                str = newStr;
            }
            catch(e) {

            }
        }
        if (str.length === 0) {
            str = "(empty array)";
        }
    }
    return ("(<" + snip(str) + ">, no stack trace)");
}

function snip(str) {
    var maxChars = 41;
    if (str.length < maxChars) {
        return str;
    }
    return str.substr(0, maxChars - 3) + "...";
}

var shouldIgnore = function() { return false; };
var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
function parseLineInfo(line) {
    var matches = line.match(parseLineInfoRegex);
    if (matches) {
        return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
        };
    }
}
CapturedTrace.setBounds = function(firstLineError, lastLineError) {
    if (!CapturedTrace.isSupported()) return;
    var firstStackLines = firstLineError.stack.split("\n");
    var lastStackLines = lastLineError.stack.split("\n");
    var firstIndex = -1;
    var lastIndex = -1;
    var firstFileName;
    var lastFileName;
    for (var i = 0; i < firstStackLines.length; ++i) {
        var result = parseLineInfo(firstStackLines[i]);
        if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
        }
    }
    for (var i = 0; i < lastStackLines.length; ++i) {
        var result = parseLineInfo(lastStackLines[i]);
        if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
        }
    }
    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
        firstFileName !== lastFileName || firstIndex >= lastIndex) {
        return;
    }

    shouldIgnore = function(line) {
        if (bluebirdFramePattern.test(line)) return true;
        var info = parseLineInfo(line);
        if (info) {
            if (info.fileName === firstFileName &&
                (firstIndex <= info.line && info.line <= lastIndex)) {
                return true;
            }
        }
        return false;
    };
};

var captureStackTrace = (function stackDetection() {
    var v8stackFramePattern = /^\s*at\s*/;
    var v8stackFormatter = function(stack, error) {
        if (typeof stack === "string") return stack;

        if (error.name !== undefined &&
            error.message !== undefined) {
            return error.name + ". " + error.message;
        }
        return formatNonError(error);
    };

    if (typeof Error.stackTraceLimit === "number" &&
        typeof Error.captureStackTrace === "function") {
        Error.stackTraceLimit = Error.stackTraceLimit + 6;
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        var captureStackTrace = Error.captureStackTrace;

        shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
        };
        return function(receiver, ignoreUntil) {
            Error.stackTraceLimit = Error.stackTraceLimit + 6;
            captureStackTrace(receiver, ignoreUntil);
            Error.stackTraceLimit = Error.stackTraceLimit - 6;
        };
    }
    var err = new Error();

    if (typeof err.stack === "string" &&
        typeof "".startsWith === "function" &&
        (err.stack.startsWith("stackDetection@")) &&
        stackDetection.name === "stackDetection") {

        stackFramePattern = /@/;
        var rline = /[@\n]/;

        formatStack = function(stack, error) {
            if (typeof stack === "string") {
                return (error.name + ". " + error.message + "\n" + stack);
            }

            if (error.name !== undefined &&
                error.message !== undefined) {
                return error.name + ". " + error.message;
            }
            return formatNonError(error);
        };

        return function captureStackTrace(o) {
            var stack = new Error().stack;
            var split = stack.split(rline);
            var len = split.length;
            var ret = "";
            for (var i = 0; i < len; i += 2) {
                ret += split[i];
                ret += "@";
                ret += split[i + 1];
                ret += "\n";
            }
            o.stack = ret;
        };
    }

    var hasStackAfterThrow;
    try { throw new Error(); }
    catch(e) {
        hasStackAfterThrow = ("stack" in e);
    }
    if (!("stack" in err) && hasStackAfterThrow) {
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        return function captureStackTrace(o) {
            try { throw new Error(); }
            catch(e) { o.stack = e.stack; }
        };
    }

    formatStack = function(stack, error) {
        if (typeof stack === "string") return stack;

        if ((typeof error === "object" ||
            typeof error === "function") &&
            error.name !== undefined &&
            error.message !== undefined) {
            return error.name + ". " + error.message;
        }
        return formatNonError(error);
    };

    return null;

})();

var fireDomEvent;
var fireGlobalEvent = (function() {
    if (typeof process !== "undefined" &&
        typeof process.version === "string" &&
        typeof window === "undefined") {
        return function(name, reason, promise) {
            if (name === "rejectionHandled") {
                return process.emit(name, promise);
            } else {
                return process.emit(name, reason, promise);
            }
        };
    } else {
        var customEventWorks = false;
        try {
            var ev = new self.CustomEvent("test");
            customEventWorks = ev instanceof CustomEvent;
        } catch (e) {}
        fireDomEvent = function(type, detail) {
            var event;
            if (customEventWorks) {
                event = new self.CustomEvent(type, {
                    detail: detail,
                    bubbles: false,
                    cancelable: true
                });
            } else if (self.dispatchEvent) {
                event = document.createEvent("CustomEvent");
                event.initCustomEvent(type, false, true, detail);
            }

            return event ? !self.dispatchEvent(event) : false;
        };

        var toWindowMethodNameMap = {};
        toWindowMethodNameMap["unhandledRejection"] = ("on" +
            "unhandledRejection").toLowerCase();
        toWindowMethodNameMap["rejectionHandled"] = ("on" +
            "rejectionHandled").toLowerCase();

        return function(name, reason, promise) {
            var methodName = toWindowMethodNameMap[name];
            var method = self[methodName];
            if (!method) return false;
            if (name === "rejectionHandled") {
                method.call(self, promise);
            } else {
                method.call(self, reason, promise);
            }
            return true;
        };
    }
})();

return CapturedTrace;
};

}).call(this,require('_process'))
},{"./async.js":2,"./util.js":34,"_process":38}],7:[function(require,module,exports){
"use strict";
module.exports = function(NEXT_FILTER) {
var util = require("./util.js");
var errors = require("./errors.js");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var keys = require("./es5.js").keys;
var TypeError = errors.TypeError;

function CatchFilter(instances, callback, promise) {
    this._instances = instances;
    this._callback = callback;
    this._promise = promise;
}

function safePredicate(predicate, e) {
    var safeObject = {};
    var retfilter = tryCatch(predicate).call(safeObject, e);

    if (retfilter === errorObj) return retfilter;

    var safeKeys = keys(safeObject);
    if (safeKeys.length) {
        errorObj.e = new TypeError("Catch filter must inherit from Error or be a simple predicate function\u000a\u000a    See http://goo.gl/o84o68\u000a");
        return errorObj;
    }
    return retfilter;
}

CatchFilter.prototype.doFilter = function (e) {
    var cb = this._callback;
    var promise = this._promise;
    var boundTo = promise._boundTo;
    for (var i = 0, len = this._instances.length; i < len; ++i) {
        var item = this._instances[i];
        var itemIsErrorType = item === Error ||
            (item != null && item.prototype instanceof Error);

        if (itemIsErrorType && e instanceof item) {
            var ret = tryCatch(cb).call(boundTo, e);
            if (ret === errorObj) {
                NEXT_FILTER.e = ret.e;
                return NEXT_FILTER;
            }
            return ret;
        } else if (typeof item === "function" && !itemIsErrorType) {
            var shouldHandle = safePredicate(item, e);
            if (shouldHandle === errorObj) {
                e = errorObj.e;
                break;
            } else if (shouldHandle) {
                var ret = tryCatch(cb).call(boundTo, e);
                if (ret === errorObj) {
                    NEXT_FILTER.e = ret.e;
                    return NEXT_FILTER;
                }
                return ret;
            }
        }
    }
    NEXT_FILTER.e = e;
    return NEXT_FILTER;
};

return CatchFilter;
};

},{"./errors.js":10,"./es5.js":11,"./util.js":34}],8:[function(require,module,exports){
"use strict";
var util = require("./util.js");
var isPrimitive = util.isPrimitive;
var wrapsPrimitiveReceiver = util.wrapsPrimitiveReceiver;

module.exports = function(Promise) {
var returner = function () {
    return this;
};
var thrower = function () {
    throw this;
};

var wrapper = function (value, action) {
    if (action === 1) {
        return function () {
            throw value;
        };
    } else if (action === 2) {
        return function () {
            return value;
        };
    }
};


Promise.prototype["return"] =
Promise.prototype.thenReturn = function (value) {
    if (wrapsPrimitiveReceiver && isPrimitive(value)) {
        return this._then(
            wrapper(value, 2),
            undefined,
            undefined,
            undefined,
            undefined
       );
    }
    return this._then(returner, undefined, undefined, value, undefined);
};

Promise.prototype["throw"] =
Promise.prototype.thenThrow = function (reason) {
    if (wrapsPrimitiveReceiver && isPrimitive(reason)) {
        return this._then(
            wrapper(reason, 1),
            undefined,
            undefined,
            undefined,
            undefined
       );
    }
    return this._then(thrower, undefined, undefined, reason, undefined);
};
};

},{"./util.js":34}],9:[function(require,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var PromiseReduce = Promise.reduce;

Promise.prototype.each = function (fn) {
    return PromiseReduce(this, fn, null, INTERNAL);
};

Promise.each = function (promises, fn) {
    return PromiseReduce(promises, fn, null, INTERNAL);
};
};

},{}],10:[function(require,module,exports){
"use strict";
var Objectfreeze = require("./es5.js").freeze;
var util = require("./util.js");
var inherits = util.inherits;
var notEnumerableProp = util.notEnumerableProp;

function subError(nameProperty, defaultMessage) {
    function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        notEnumerableProp(this, "message",
            typeof message === "string" ? message : defaultMessage);
        notEnumerableProp(this, "name", nameProperty);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var CancellationError = subError("CancellationError", "cancellation error");
var TimeoutError = subError("TimeoutError", "timeout error");
var AggregateError = subError("AggregateError", "aggregate error");
try {
    _TypeError = TypeError;
    _RangeError = RangeError;
} catch(e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
}

var methods = ("join pop push shift unshift slice filter forEach some " +
    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
}

AggregateError.prototype.length = 0;
AggregateError.prototype["isOperational"] = true;
var level = 0;
AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:" + "\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret += str + "\n";
    }
    level--;
    return ret;
};

function OperationalError(message) {
    notEnumerableProp(this, "name", "OperationalError");
    notEnumerableProp(this, "message", message);
    this.cause = message;
    this["isOperational"] = true;

    if (message instanceof Error) {
        notEnumerableProp(this, "message", message.message);
        notEnumerableProp(this, "stack", message.stack);
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

}
inherits(OperationalError, Error);

var errorTypes = Error["__BluebirdErrorTypes__"];
if (!errorTypes) {
    errorTypes = Objectfreeze({
        CancellationError: CancellationError,
        TimeoutError: TimeoutError,
        OperationalError: OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError
    });
    notEnumerableProp(Error, "__BluebirdErrorTypes__", errorTypes);
}

module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError
};

},{"./es5.js":11,"./util.js":34}],11:[function(require,module,exports){
var isES5 = (function(){
    "use strict";
    return this === undefined;
})();

if (isES5) {
    module.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        keys: Object.keys,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5: isES5,
        propertyIsWritable: function(obj, prop) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            return !!(!descriptor || descriptor.writable || descriptor.set);
        }
    };
} else {
    var has = {}.hasOwnProperty;
    var str = {}.toString;
    var proto = {}.constructor.prototype;

    var ObjectKeys = function (o) {
        var ret = [];
        for (var key in o) {
            if (has.call(o, key)) {
                ret.push(key);
            }
        }
        return ret;
    };

    var ObjectDefineProperty = function (o, key, desc) {
        o[key] = desc.value;
        return o;
    };

    var ObjectFreeze = function (obj) {
        return obj;
    };

    var ObjectGetPrototypeOf = function (obj) {
        try {
            return Object(obj).constructor.prototype;
        }
        catch (e) {
            return proto;
        }
    };

    var ArrayIsArray = function (obj) {
        try {
            return str.call(obj) === "[object Array]";
        }
        catch(e) {
            return false;
        }
    };

    module.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5: isES5,
        propertyIsWritable: function() {
            return true;
        }
    };
}

},{}],12:[function(require,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var PromiseMap = Promise.map;

Promise.prototype.filter = function (fn, options) {
    return PromiseMap(this, fn, options, INTERNAL);
};

Promise.filter = function (promises, fn, options) {
    return PromiseMap(promises, fn, options, INTERNAL);
};
};

},{}],13:[function(require,module,exports){
"use strict";
module.exports = function(Promise, NEXT_FILTER, tryConvertToPromise) {
var util = require("./util.js");
var wrapsPrimitiveReceiver = util.wrapsPrimitiveReceiver;
var isPrimitive = util.isPrimitive;
var thrower = util.thrower;

function returnThis() {
    return this;
}
function throwThis() {
    throw this;
}
function return$(r) {
    return function() {
        return r;
    };
}
function throw$(r) {
    return function() {
        throw r;
    };
}
function promisedFinally(ret, reasonOrValue, isFulfilled) {
    var then;
    if (wrapsPrimitiveReceiver && isPrimitive(reasonOrValue)) {
        then = isFulfilled ? return$(reasonOrValue) : throw$(reasonOrValue);
    } else {
        then = isFulfilled ? returnThis : throwThis;
    }
    return ret._then(then, thrower, undefined, reasonOrValue, undefined);
}

function finallyHandler(reasonOrValue) {
    var promise = this.promise;
    var handler = this.handler;

    var ret = promise._isBound()
                    ? handler.call(promise._boundTo)
                    : handler();

    if (ret !== undefined) {
        var maybePromise = tryConvertToPromise(ret, promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            return promisedFinally(maybePromise, reasonOrValue,
                                    promise.isFulfilled());
        }
    }

    if (promise.isRejected()) {
        NEXT_FILTER.e = reasonOrValue;
        return NEXT_FILTER;
    } else {
        return reasonOrValue;
    }
}

function tapHandler(value) {
    var promise = this.promise;
    var handler = this.handler;

    var ret = promise._isBound()
                    ? handler.call(promise._boundTo, value)
                    : handler(value);

    if (ret !== undefined) {
        var maybePromise = tryConvertToPromise(ret, promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            return promisedFinally(maybePromise, value, true);
        }
    }
    return value;
}

Promise.prototype._passThroughHandler = function (handler, isFinally) {
    if (typeof handler !== "function") return this.then();

    var promiseAndHandler = {
        promise: this,
        handler: handler
    };

    return this._then(
            isFinally ? finallyHandler : tapHandler,
            isFinally ? finallyHandler : undefined, undefined,
            promiseAndHandler, undefined);
};

Promise.prototype.lastly =
Promise.prototype["finally"] = function (handler) {
    return this._passThroughHandler(handler, true);
};

Promise.prototype.tap = function (handler) {
    return this._passThroughHandler(handler, false);
};
};

},{"./util.js":34}],14:[function(require,module,exports){
"use strict";
module.exports = function(Promise,
                          apiRejection,
                          INTERNAL,
                          tryConvertToPromise) {
var errors = require("./errors.js");
var TypeError = errors.TypeError;
var deprecated = require("./util.js").deprecated;
var util = require("./util.js");
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
var yieldHandlers = [];

function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
    for (var i = 0; i < yieldHandlers.length; ++i) {
        traceParent._pushContext();
        var result = tryCatch(yieldHandlers[i])(value);
        traceParent._popContext();
        if (result === errorObj) {
            traceParent._pushContext();
            var ret = Promise.reject(errorObj.e);
            traceParent._popContext();
            return ret;
        }
        var maybePromise = tryConvertToPromise(result, traceParent);
        if (maybePromise instanceof Promise) return maybePromise;
    }
    return null;
}

function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
    var promise = this._promise = new Promise(INTERNAL);
    promise._captureStackTrace();
    this._stack = stack;
    this._generatorFunction = generatorFunction;
    this._receiver = receiver;
    this._generator = undefined;
    this._yieldHandlers = typeof yieldHandler === "function"
        ? [yieldHandler].concat(yieldHandlers)
        : yieldHandlers;
}

PromiseSpawn.prototype.promise = function () {
    return this._promise;
};

PromiseSpawn.prototype._run = function () {
    this._generator = this._generatorFunction.call(this._receiver);
    this._receiver =
        this._generatorFunction = undefined;
    this._next(undefined);
};

PromiseSpawn.prototype._continue = function (result) {
    if (result === errorObj) {
        this._generator = undefined;
        var trace = util.canAttachTrace(result.e)
            ? result.e : new Error(util.toString(result.e));
        this._promise._attachExtraTrace(trace);
        this._promise._reject(result.e, trace);
        return;
    }

    var value = result.value;
    if (result.done === true) {
        this._generator = undefined;
        if (!this._promise._tryFollow(value)) {
            this._promise._fulfill(value);
        }
    } else {
        var maybePromise = tryConvertToPromise(value, this._promise);
        if (!(maybePromise instanceof Promise)) {
            maybePromise =
                promiseFromYieldHandler(maybePromise,
                                        this._yieldHandlers,
                                        this._promise);
            if (maybePromise === null) {
                this._throw(
                    new TypeError(
                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/4Y4pDk\u000a\u000a".replace("%s", value) +
                        "From coroutine:\u000a" +
                        this._stack.split("\n").slice(1, -7).join("\n")
                    )
                );
                return;
            }
        }
        maybePromise._then(
            this._next,
            this._throw,
            undefined,
            this,
            null
       );
    }
};

PromiseSpawn.prototype._throw = function (reason) {
    if (util.canAttachTrace(reason))
        this._promise._attachExtraTrace(reason);
    this._promise._pushContext();
    var result = tryCatch(this._generator["throw"])
        .call(this._generator, reason);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._next = function (value) {
    this._promise._pushContext();
    var result = tryCatch(this._generator.next).call(this._generator, value);
    this._promise._popContext();
    this._continue(result);
};

Promise.coroutine = function (generatorFunction, options) {
    if (typeof generatorFunction !== "function") {
        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/6Vqhm0\u000a");
    }
    var yieldHandler = Object(options).yieldHandler;
    var PromiseSpawn$ = PromiseSpawn;
    var stack = new Error().stack;
    return function () {
        var generator = generatorFunction.apply(this, arguments);
        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
                                      stack);
        spawn._generator = generator;
        spawn._next(undefined);
        return spawn.promise();
    };
};

Promise.coroutine.addYieldHandler = function(fn) {
    if (typeof fn !== "function") throw new TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
    yieldHandlers.push(fn);
};

Promise.spawn = function (generatorFunction) {
    deprecated("Promise.spawn is deprecated. Use Promise.coroutine instead.");
    if (typeof generatorFunction !== "function") {
        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/6Vqhm0\u000a");
    }
    var spawn = new PromiseSpawn(generatorFunction, this);
    var ret = spawn.promise();
    spawn._run(Promise.spawn);
    return ret;
};
};

},{"./errors.js":10,"./util.js":34}],15:[function(require,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, tryConvertToPromise, INTERNAL) {
var util = require("./util.js");
var canEvaluate = util.canEvaluate;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

if (canEvaluate) {
    var thenCallback = function(i) {
        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
    };

    var caller = function(count) {
        var values = [];
        for (var i = 1; i <= count; ++i) values.push("holder.p" + i);
        return new Function("holder", "                                      \n\
            'use strict';                                                    \n\
            var callback = holder.fn;                                        \n\
            return callback(values);                                         \n\
            ".replace(/values/g, values.join(", ")));
    };
    var thenCallbacks = [];
    var callers = [undefined];
    for (var i = 1; i <= 5; ++i) {
        thenCallbacks.push(thenCallback(i));
        callers.push(caller(i));
    }

    var Holder = function(total, fn) {
        this.p1 = this.p2 = this.p3 = this.p4 = this.p5 = null;
        this.fn = fn;
        this.total = total;
        this.now = 0;
    };

    Holder.prototype.callers = callers;
    Holder.prototype.checkFulfillment = function(promise) {
        var now = this.now;
        now++;
        var total = this.total;
        if (now >= total) {
            var handler = this.callers[total];
            promise._pushContext();
            var ret = tryCatch(handler)(this);
            promise._popContext();
            if (ret === errorObj) {
                promise._rejectCallback(ret.e, false, true);
            } else if (!promise._tryFollow(ret)) {
                promise._fulfillUnchecked(ret);
            }
        } else {
            this.now = now;
        }
    };
}

function reject(reason) {
    this._reject(reason);
}

Promise.join = function () {
    var last = arguments.length - 1;
    var fn;
    if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        if (last < 6 && canEvaluate) {
            var ret = new Promise(INTERNAL);
            ret._captureStackTrace();
            var holder = new Holder(last, fn);
            var callbacks = thenCallbacks;
            for (var i = 0; i < last; ++i) {
                var maybePromise = tryConvertToPromise(arguments[i], ret);
                if (maybePromise instanceof Promise) {
                    maybePromise = maybePromise._target();
                    if (maybePromise._isPending()) {
                        maybePromise._then(callbacks[i], reject,
                                           undefined, ret, holder);
                    } else if (maybePromise._isFulfilled()) {
                        callbacks[i].call(ret,
                                          maybePromise._value(), holder);
                    } else {
                        ret._reject(maybePromise._reason());
                    }
                } else {
                    callbacks[i].call(ret, maybePromise, holder);
                }
            }
            return ret;
        }
    }
    var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];}
    var ret = new PromiseArray(args).promise();
    return fn !== undefined ? ret.spread(fn) : ret;
};

};

},{"./util.js":34}],16:[function(require,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL) {
var util = require("./util.js");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var PENDING = {};
var EMPTY_ARRAY = [];

function MappingPromiseArray(promises, fn, limit, _filter) {
    this.constructor$(promises);
    this._promise._setIsSpreadable();
    this._promise._captureStackTrace();
    this._callback = fn;
    this._preservedValues = _filter === INTERNAL
        ? new Array(this.length())
        : null;
    this._limit = limit;
    this._inFlight = 0;
    this._queue = limit >= 1 ? [] : EMPTY_ARRAY;
    this._init$(undefined, -2);
}
util.inherits(MappingPromiseArray, PromiseArray);

MappingPromiseArray.prototype._init = function () {};

MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var values = this._values;
    var length = this.length();
    var preservedValues = this._preservedValues;
    var limit = this._limit;
    if (values[index] === PENDING) {
        values[index] = value;
        if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved()) return;
        }
    } else {
        if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return;
        }
        if (preservedValues !== null) preservedValues[index] = value;

        var callback = this._callback;
        var receiver = this._promise._boundTo;
        this._promise._pushContext();
        var ret = tryCatch(callback).call(receiver, value, index, length);
        this._promise._popContext();
        if (ret === errorObj) return this._reject(ret.e);

        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            if (maybePromise._isPending()) {
                if (limit >= 1) this._inFlight++;
                values[index] = PENDING;
                return maybePromise._proxyPromiseArray(this, index);
            } else if (maybePromise._isFulfilled()) {
                ret = maybePromise._value();
            } else {
                return this._reject(maybePromise._reason());
            }
        }
        values[index] = ret;
    }
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= length) {
        if (preservedValues !== null) {
            this._filter(values, preservedValues);
        } else {
            this._resolve(values);
        }

    }
};

MappingPromiseArray.prototype._drainQueue = function () {
    var queue = this._queue;
    var limit = this._limit;
    var values = this._values;
    while (queue.length > 0 && this._inFlight < limit) {
        if (this._isResolved()) return;
        var index = queue.pop();
        this._promiseFulfilled(values[index], index);
    }
};

MappingPromiseArray.prototype._filter = function (booleans, values) {
    var len = values.length;
    var ret = new Array(len);
    var j = 0;
    for (var i = 0; i < len; ++i) {
        if (booleans[i]) ret[j++] = values[i];
    }
    ret.length = j;
    this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues = function () {
    return this._preservedValues;
};

function map(promises, fn, options, _filter) {
    var limit = typeof options === "object" && options !== null
        ? options.concurrency
        : 0;
    limit = typeof limit === "number" &&
        isFinite(limit) && limit >= 1 ? limit : 0;
    return new MappingPromiseArray(promises, fn, limit, _filter);
}

Promise.prototype.map = function (fn, options) {
    if (typeof fn !== "function") return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");

    return map(this, fn, options, null).promise();
};

Promise.map = function (promises, fn, options, _filter) {
    if (typeof fn !== "function") return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
    return map(promises, fn, options, _filter).promise();
};


};

},{"./util.js":34}],17:[function(require,module,exports){
"use strict";
module.exports = function(Promise) {
var util = require("./util.js");
var async = require("./async.js");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function spreadAdapter(val, nodeback) {
    var promise = this;
    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
    var ret = tryCatch(nodeback).apply(promise._boundTo, [null].concat(val));
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

function successAdapter(val, nodeback) {
    var promise = this;
    var receiver = promise._boundTo;
    var ret = val === undefined
        ? tryCatch(nodeback).call(receiver, null)
        : tryCatch(nodeback).call(receiver, null, val);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}
function errorAdapter(reason, nodeback) {
    var promise = this;
    if (!reason) {
        var target = promise._target();
        var newReason = target._getCarriedStackTrace();
        newReason.cause = reason;
        reason = newReason;
    }
    var ret = tryCatch(nodeback).call(promise._boundTo, reason);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

Promise.prototype.nodeify = function (nodeback, options) {
    if (typeof nodeback == "function") {
        var adapter = successAdapter;
        if (options !== undefined && Object(options).spread) {
            adapter = spreadAdapter;
        }
        this._then(
            adapter,
            errorAdapter,
            undefined,
            this,
            nodeback
        );
    }
    return this;
};
};

},{"./async.js":2,"./util.js":34}],18:[function(require,module,exports){
"use strict";
module.exports = function(Promise, PromiseArray) {
var util = require("./util.js");
var async = require("./async.js");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

Promise.prototype.progressed = function (handler) {
    return this._then(undefined, undefined, handler, undefined, undefined);
};

Promise.prototype._progress = function (progressValue) {
    if (this._isFollowingOrFulfilledOrRejected()) return;
    this._target()._progressUnchecked(progressValue);

};

Promise.prototype._progressHandlerAt = function (index) {
    return index === 0
        ? this._progressHandler0
        : this[(index << 2) + index - 5 + 2];
};

Promise.prototype._doProgressWith = function (progression) {
    var progressValue = progression.value;
    var handler = progression.handler;
    var promise = progression.promise;
    var receiver = progression.receiver;

    var ret = tryCatch(handler).call(receiver, progressValue);
    if (ret === errorObj) {
        if (ret.e != null &&
            ret.e.name !== "StopProgressPropagation") {
            var trace = util.canAttachTrace(ret.e)
                ? ret.e : new Error(util.toString(ret.e));
            promise._attachExtraTrace(trace);
            promise._progress(ret.e);
        }
    } else if (ret instanceof Promise) {
        ret._then(promise._progress, null, null, promise, undefined);
    } else {
        promise._progress(ret);
    }
};


Promise.prototype._progressUnchecked = function (progressValue) {
    var len = this._length();
    var progress = this._progress;
    for (var i = 0; i < len; i++) {
        var handler = this._progressHandlerAt(i);
        var promise = this._promiseAt(i);
        if (!(promise instanceof Promise)) {
            var receiver = this._receiverAt(i);
            if (typeof handler === "function") {
                handler.call(receiver, progressValue, promise);
            } else if (receiver instanceof PromiseArray &&
                       !receiver._isResolved()) {
                receiver._promiseProgressed(progressValue, promise);
            }
            continue;
        }

        if (typeof handler === "function") {
            async.invoke(this._doProgressWith, this, {
                handler: handler,
                promise: promise,
                receiver: this._receiverAt(i),
                value: progressValue
            });
        } else {
            async.invoke(progress, promise, progressValue);
        }
    }
};
};

},{"./async.js":2,"./util.js":34}],19:[function(require,module,exports){
(function (process){
"use strict";
module.exports = function() {
var makeSelfResolutionError = function () {
    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/LhFpo0\u000a");
};
var reflect = function() {
    return new Promise.PromiseInspection(this._target());
};
var apiRejection = function(msg) {
    return Promise.reject(new TypeError(msg));
};
var util = require("./util.js");
var async = require("./async.js");
var errors = require("./errors.js");
var RangeError = errors.RangeError;
var TypeError = errors.TypeError;
var CancellationError = errors.CancellationError;
var TimeoutError = errors.TimeoutError;
var OperationalError = errors.OperationalError;
var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {e: null};
var tryConvertToPromise = require("./thenables.js")(Promise, INTERNAL);
var PromiseArray =
    require("./promise_array.js")(Promise, INTERNAL,
                                    tryConvertToPromise, apiRejection);
var CapturedTrace = require("./captured_trace.js")();
var CatchFilter = require("./catch_filter.js")(NEXT_FILTER);
var PromiseResolver = require("./promise_resolver.js");
var isArray = util.isArray;
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
var originatesFromRejection = util.originatesFromRejection;
var markAsOriginatingFromRejection = util.markAsOriginatingFromRejection;
var canAttachTrace = util.canAttachTrace;
var unhandledRejectionHandled;
var possiblyUnhandledRejection;

var debugging = false || !!(
    typeof process !== "undefined" &&
    typeof process.execPath === "string" &&
    typeof process.env === "object" &&
    (process.env["BLUEBIRD_DEBUG"] ||
        process.env["NODE_ENV"] === "development")
);
function Promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("the promise constructor requires a resolver function\u000a\u000a    See http://goo.gl/EC22Yn\u000a");
    }
    if (this.constructor !== Promise) {
        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/KsIlge\u000a");
    }
    this._bitField = 0;
    this._fulfillmentHandler0 = undefined;
    this._rejectionHandler0 = undefined;
    this._progressHandler0 = undefined;
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._settledValue = undefined;
    this._boundTo = undefined;
    if (resolver !== INTERNAL) this._resolveFromResolver(resolver);
}

Promise.prototype.bind = function (thisArg) {
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 1);
    var target = this._target();
    if (maybePromise instanceof Promise) {
        target._then(INTERNAL, ret._reject, ret._progress, ret, null);
        maybePromise._then(function(thisArg) {
            if (ret._isPending()) {
                ret._setBoundTo(thisArg);
                ret._follow(target);
            }
        }, ret._reject, ret._progress, ret, null);
    } else {
        ret._setBoundTo(thisArg);
        ret._follow(target);
    }

    return ret;
};

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
    var len = arguments.length;
    if (len > 1) {
        var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (typeof item === "function") {
                catchInstances[j++] = item;
            } else {
                return Promise.reject(
                    new TypeError("Catch filter must inherit from Error or be a simple predicate function\u000a\u000a    See http://goo.gl/o84o68\u000a"));
            }
        }
        catchInstances.length = j;
        fn = arguments[i];
        var catchFilter = new CatchFilter(catchInstances, fn, this);
        return this._then(undefined, catchFilter.doFilter, undefined,
            catchFilter, undefined);
    }
    return this._then(undefined, fn, undefined, undefined, undefined);
};

Promise.prototype.reflect = function () {
    return this._then(reflect, reflect, undefined, this, undefined);
};

Promise.prototype.then = function (didFulfill, didReject, didProgress) {
    return this._then(didFulfill, didReject, didProgress,
        undefined, undefined);
};


Promise.prototype.done = function (didFulfill, didReject, didProgress) {
    var promise = this._then(didFulfill, didReject, didProgress,
        undefined, undefined);
    promise._setIsFinal();
};

Promise.prototype.spread = function (didFulfill, didReject) {
    var followee = this._target();
    var target = followee._isSpreadable()
        ? (followee === this ? this : this.then())
        : this.all();
    return target._then(didFulfill, didReject, undefined, APPLY, undefined);
};

Promise.prototype.isCancellable = function () {
    return !this.isResolved() &&
        this._cancellable();
};

Promise.prototype.toJSON = function () {
    var ret = {
        isFulfilled: false,
        isRejected: false,
        fulfillmentValue: undefined,
        rejectionReason: undefined
    };
    if (this.isFulfilled()) {
        ret.fulfillmentValue = this.value();
        ret.isFulfilled = true;
    } else if (this.isRejected()) {
        ret.rejectionReason = this.reason();
        ret.isRejected = true;
    }
    return ret;
};

Promise.prototype.all = function () {
    var ret = new PromiseArray(this).promise();
    ret._setIsSpreadable();
    return ret;
};

Promise.prototype.error = function (fn) {
    return this.caught(originatesFromRejection, fn);
};

Promise.is = function (val) {
    return val instanceof Promise;
};

Promise.all = function (promises) {
    var ret = new PromiseArray(promises).promise();
    ret._setIsSpreadable();
    return ret;
};

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        ret._popContext();
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function (fn, args, ctx) {
    if (typeof fn !== "function") {
        return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value = isArray(args)
        ? tryCatch(fn).apply(ctx, args)
        : tryCatch(fn).call(ctx, args);
    ret._popContext();
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.defer = Promise.pending = function () {
    var promise = new Promise(INTERNAL);
    return new PromiseResolver(promise);
};

Promise.bind = function (thisArg) {
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);

    if (maybePromise instanceof Promise) {
        maybePromise._then(function(thisArg) {
            ret._setBoundTo(thisArg);
            ret._fulfill(undefined);
        }, ret._reject, ret._progress, ret, null);
    } else {
        ret._setBoundTo(thisArg);
        ret._setFulfilled();
    }
    return ret;
};

Promise.cast = function (obj) {
    var ret = tryConvertToPromise(obj);
    if (!(ret instanceof Promise)) {
        var val = ret;
        ret = new Promise(INTERNAL);
        ret._setFulfilled();
        ret._settledValue = val;
        ret._cleanValues();
    }
    return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function (reason) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._rejectCallback(reason, true);
    return ret;
};

Promise.onPossiblyUnhandledRejection = function (fn) {
    possiblyUnhandledRejection = typeof fn === "function" ? fn : undefined;
};

Promise.onUnhandledRejectionHandled = function (fn) {
    unhandledRejectionHandled = typeof fn === "function" ? fn : undefined;
};

Promise.longStackTraces = function () {
    if (async.haveItemsQueued() &&
        debugging === false
   ) {
        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/DT1qyG\u000a");
    }
    debugging = CapturedTrace.isSupported();
};

Promise.hasLongStackTraces = function () {
    return debugging && CapturedTrace.isSupported();
};

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") throw new TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
    async._schedule = fn;
};

Promise.prototype._then = function (
    didFulfill,
    didReject,
    didProgress,
    receiver,
    internalData
) {
    var haveInternalData = internalData !== undefined;
    var ret = haveInternalData ? internalData : new Promise(INTERNAL);

    if (!haveInternalData) {
        ret._propagateFrom(this, 4 | 1);
        ret._captureStackTrace();
    }

    var target = this._target();
    if (target !== this) {
        if (receiver === undefined) receiver = this._boundTo;
        if (!haveInternalData) ret._setIsMigrated();
    }

    var callbackIndex =
        target._addCallbacks(didFulfill, didReject, didProgress, ret, receiver);

    if (target._isResolved() && !target._isSettlePromisesQueued()) {
        async.invoke(
            target._settlePromiseAtPostResolution, target, callbackIndex);
    }

    return ret;
};

Promise.prototype._settlePromiseAtPostResolution = function (index) {
    if (this._isRejectionUnhandled()) this._unsetRejectionIsUnhandled();
    this._settlePromiseAt(index);
};

Promise.prototype._length = function () {
    return this._bitField & 131071;
};

Promise.prototype._isFollowingOrFulfilledOrRejected = function () {
    return (this._bitField & 939524096) > 0;
};

Promise.prototype._isFollowing = function () {
    return (this._bitField & 536870912) === 536870912;
};

Promise.prototype._setLength = function (len) {
    this._bitField = (this._bitField & -131072) |
        (len & 131071);
};

Promise.prototype._setFulfilled = function () {
    this._bitField = this._bitField | 268435456;
};

Promise.prototype._setRejected = function () {
    this._bitField = this._bitField | 134217728;
};

Promise.prototype._setFollowing = function () {
    this._bitField = this._bitField | 536870912;
};

Promise.prototype._setIsFinal = function () {
    this._bitField = this._bitField | 33554432;
};

Promise.prototype._isFinal = function () {
    return (this._bitField & 33554432) > 0;
};

Promise.prototype._cancellable = function () {
    return (this._bitField & 67108864) > 0;
};

Promise.prototype._setCancellable = function () {
    this._bitField = this._bitField | 67108864;
};

Promise.prototype._unsetCancellable = function () {
    this._bitField = this._bitField & (~67108864);
};

Promise.prototype._setRejectionIsUnhandled = function () {
    this._bitField = this._bitField | 2097152;
};

Promise.prototype._unsetRejectionIsUnhandled = function () {
    this._bitField = this._bitField & (~2097152);
    if (this._isUnhandledRejectionNotified()) {
        this._unsetUnhandledRejectionIsNotified();
        this._notifyUnhandledRejectionIsHandled();
    }
};

Promise.prototype._isRejectionUnhandled = function () {
    return (this._bitField & 2097152) > 0;
};

Promise.prototype._isSpreadable = function () {
    return (this._bitField & 131072) > 0;
};

Promise.prototype._setIsSpreadable = function () {
    this._bitField = this._bitField | 131072;
};

Promise.prototype._setIsMigrated = function () {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._unsetIsMigrated = function () {
    this._bitField = this._bitField & (~4194304);
};

Promise.prototype._isMigrated = function () {
    return (this._bitField & 4194304) > 0;
};

Promise.prototype._setUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField | 524288;
};

Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField & (~524288);
};

Promise.prototype._isUnhandledRejectionNotified = function () {
    return (this._bitField & 524288) > 0;
};

Promise.prototype._setCarriedStackTrace = function (capturedTrace) {
    this._bitField = this._bitField | 1048576;
    this._fulfillmentHandler0 = capturedTrace;
};

Promise.prototype._isCarryingStackTrace = function () {
    return (this._bitField & 1048576) > 0;
};

Promise.prototype._getCarriedStackTrace = function () {
    return this._isCarryingStackTrace()
        ? this._fulfillmentHandler0
        : undefined;
};

Promise.prototype._receiverAt = function (index) {
    var ret = index === 0
        ? this._receiver0
        : this[
            index * 5 - 5 + 4];
    if (this._isBound() && ret === undefined) {
        return this._boundTo;
    }
    return ret;
};

Promise.prototype._promiseAt = function (index) {
    return index === 0
        ? this._promise0
        : this[index * 5 - 5 + 3];
};

Promise.prototype._fulfillmentHandlerAt = function (index) {
    return index === 0
        ? this._fulfillmentHandler0
        : this[index * 5 - 5 + 0];
};

Promise.prototype._rejectionHandlerAt = function (index) {
    return index === 0
        ? this._rejectionHandler0
        : this[index * 5 - 5 + 1];
};

Promise.prototype._migrateCallbacks = function (
    fulfill,
    reject,
    progress,
    promise,
    receiver
) {
    if (promise instanceof Promise) promise._setIsMigrated();
    this._addCallbacks(fulfill, reject, progress, promise, receiver);
};

Promise.prototype._addCallbacks = function (
    fulfill,
    reject,
    progress,
    promise,
    receiver
) {
    var index = this._length();

    if (index >= 131071 - 5) {
        index = 0;
        this._setLength(0);
    }

    if (index === 0) {
        this._promise0 = promise;
        if (receiver !== undefined) this._receiver0 = receiver;
        if (typeof fulfill === "function" && !this._isCarryingStackTrace())
            this._fulfillmentHandler0 = fulfill;
        if (typeof reject === "function") this._rejectionHandler0 = reject;
        if (typeof progress === "function") this._progressHandler0 = progress;
    } else {
        var base = index * 5 - 5;
        this[base + 3] = promise;
        this[base + 4] = receiver;
        if (typeof fulfill === "function")
            this[base + 0] = fulfill;
        if (typeof reject === "function")
            this[base + 1] = reject;
        if (typeof progress === "function")
            this[base + 2] = progress;
    }
    this._setLength(index + 1);
    return index;
};

Promise.prototype._setProxyHandlers = function (receiver, promiseSlotValue) {
    var index = this._length();

    if (index >= 131071 - 5) {
        index = 0;
        this._setLength(0);
    }
    if (index === 0) {
        this._promise0 = promiseSlotValue;
        this._receiver0 = receiver;
    } else {
        var base = index * 5 - 5;
        this[base + 3] = promiseSlotValue;
        this[base + 4] = receiver;
    }
    this._setLength(index + 1);
};

Promise.prototype._proxyPromiseArray = function (promiseArray, index) {
    this._setProxyHandlers(promiseArray, index);
};

Promise.prototype._setBoundTo = function (obj) {
    if (obj !== undefined) {
        this._bitField = this._bitField | 8388608;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~8388608);
    }
};

Promise.prototype._isBound = function () {
    return (this._bitField & 8388608) === 8388608;
};

Promise.prototype._resolveCallback = function(value) {
    if (this._tryFollow(value)) {
        return;
    }
    this._fulfill(value);
};

Promise.prototype._rejectCallback =
function(reason, synchronous, shouldNotMarkOriginatingFromRejection) {
    if (!shouldNotMarkOriginatingFromRejection) {
        markAsOriginatingFromRejection(reason);
    }
    var trace = util.ensureErrorObject(reason);
    var hasStack = canAttachTrace(reason) &&
        typeof trace.stack === "string";
    this._attachExtraTrace(trace, synchronous ? hasStack : false);
    this._reject(reason, trace === reason ? undefined : trace);
};

Promise.prototype._resolveFromResolver = function (resolver) {
    var promise = this;
    this._captureStackTrace();
    this._pushContext();
    var synchronous = true;
    var r = tryCatch(resolver)(function(value) {
        promise._resolveCallback(value);
    }, function (reason) {
        promise._rejectCallback(reason, synchronous);
    });
    synchronous = false;
    this._popContext();

    if (r !== undefined && r === errorObj) {
        promise._rejectCallback(r.e, true, true);
    }
};

Promise.prototype._settlePromiseFromHandler = function (
    handler, receiver, value, promise
) {
    if (promise._isRejected()) return;
    promise._pushContext();
    var x;
    if (receiver === APPLY && !this._isRejected()) {
        x = tryCatch(handler).apply(this._boundTo, value);
    } else {
        x = tryCatch(handler).call(receiver, value);
    }
    promise._popContext();

    if (x === errorObj || x === promise || x === NEXT_FILTER) {
        var err = x === promise ? makeSelfResolutionError() : x.e;
        promise._rejectCallback(err, false, true);
    } else {
        promise._resolveCallback(x);
    }
};

Promise.prototype._target = function() {
    var ret = this;
    while (ret._isFollowing()) ret = ret._followee();
    return ret;
};

Promise.prototype._followee = function() {
    return this._rejectionHandler0;
};

Promise.prototype._setFollowee = function(promise) {
    this._rejectionHandler0 = promise;
};

Promise.prototype._follow = function (promise) {
    if (promise._isPending()) {
        var len = this._length();
        for (var i = 0; i < len; ++i) {
            promise._migrateCallbacks(
                this._fulfillmentHandlerAt(i),
                this._rejectionHandlerAt(i),
                this._progressHandlerAt(i),
                this._promiseAt(i),
                this._receiverAt(i)
            );
        }
        this._setFollowing();
        this._setLength(0);
        this._setFollowee(promise);
        this._propagateFrom(promise, 1);
    } else if (promise._isFulfilled()) {
        this._fulfillUnchecked(promise._value());
    } else {
        this._rejectUnchecked(promise._reason(),
            promise._getCarriedStackTrace());
    }
    if (promise._isRejectionUnhandled()) promise._unsetRejectionIsUnhandled();
};

Promise.prototype._tryFollow = function (value) {
    if (this._isFollowingOrFulfilledOrRejected() ||
        value === this) {
        return false;
    }
    var maybePromise = tryConvertToPromise(value, this);
    if (!(maybePromise instanceof Promise)) {
        return false;
    }
    this._follow(maybePromise._target());
    return true;
};

Promise.prototype._captureStackTrace = function () {
    if (debugging) {
        this._trace = new CapturedTrace(this._peekContext());
    }
    return this;
};

Promise.prototype._canAttachTrace = function(error) {
    return debugging && canAttachTrace(error);
};

Promise.prototype._attachExtraTraceIgnoreSelf = function (error) {
    if (this._canAttachTrace(error) && this._trace._parent !== undefined) {
        this._trace._parent.attachExtraTrace(error);
    }
};

Promise.prototype._attachExtraTrace = function (error, ignoreSelf) {
    if (debugging && canAttachTrace(error)) {
        var trace = this._trace;
        if (trace !== undefined) {
            if (ignoreSelf) trace = trace._parent;
        }
        if (trace !== undefined) {
            trace.attachExtraTrace(error);
        } else {
            CapturedTrace.cleanHeaderStack(error, true);
        }
    }
};

Promise.prototype._cleanValues = function () {
    if (this._cancellable()) {
        this._cancellationParent = undefined;
    }
};

Promise.prototype._propagateFrom = function (parent, flags) {
    if ((flags & 1) > 0 && parent._cancellable()) {
        this._setCancellable();
        this._cancellationParent = parent;
    }
    if ((flags & 4) > 0) {
        this._setBoundTo(parent._boundTo);
    }
};

Promise.prototype._fulfill = function (value) {
    if (this._isFollowingOrFulfilledOrRejected()) return;
    this._fulfillUnchecked(value);
};

Promise.prototype._reject = function (reason, carriedStackTrace) {
    if (this._isFollowingOrFulfilledOrRejected()) return;
    this._rejectUnchecked(reason, carriedStackTrace);
};

Promise.prototype._settlePromiseAt = function (index) {
    var promise = this._promiseAt(index);
    var isPromise = promise instanceof Promise;

    if (isPromise && promise._isMigrated()) {
        promise._unsetIsMigrated();
        return async.invoke(this._settlePromiseAt, this, index);
    }
    var handler = this._isFulfilled()
        ? this._fulfillmentHandlerAt(index)
        : this._rejectionHandlerAt(index);

    var carriedStackTrace =
        this._isCarryingStackTrace() ? this._getCarriedStackTrace() : undefined;
    var value = this._settledValue;
    var receiver = this._receiverAt(index);


    this._clearCallbackDataAtIndex(index);

    if (typeof handler === "function") {
        if (!isPromise) {
            handler.call(receiver, value, promise);
        } else {
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (receiver instanceof PromiseArray) {
        if (!receiver._isResolved()) {
            if (this._isFulfilled()) {
                receiver._promiseFulfilled(value, promise);
            }
            else {
                receiver._promiseRejected(value, promise);
            }
        }
    } else if (isPromise) {
        if (this._isFulfilled()) {
            promise._fulfill(value);
        } else {
            promise._reject(value, carriedStackTrace);
        }
    }

    if (index >= 4 && (index & 31) === 4)
        async.invokeLater(this._setLength, this, 0);
};

Promise.prototype._clearCallbackDataAtIndex = function(index) {
    if (index === 0) {
        if (!this._isCarryingStackTrace()) {
            this._fulfillmentHandler0 = undefined;
        }
        this._rejectionHandler0 =
        this._progressHandler0 =
        this._receiver0 =
        this._promise0 = undefined;
    } else {
        var base = index * 5 - 5;
        this[base + 3] =
        this[base + 4] =
        this[base + 0] =
        this[base + 1] =
        this[base + 2] = undefined;
    }
};

Promise.prototype._isSettlePromisesQueued = function () {
    return (this._bitField &
            -1073741824) === -1073741824;
};

Promise.prototype._setSettlePromisesQueued = function () {
    this._bitField = this._bitField | -1073741824;
};

Promise.prototype._unsetSettlePromisesQueued = function () {
    this._bitField = this._bitField & (~-1073741824);
};

Promise.prototype._queueSettlePromises = function() {
    if (!this._isSettlePromisesQueued()) {
        async.settlePromises(this);
        this._setSettlePromisesQueued();
    }
};

Promise.prototype._fulfillUnchecked = function (value) {
    if (value === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._rejectUnchecked(err, undefined);
    }
    this._setFulfilled();
    this._settledValue = value;
    this._cleanValues();

    if (this._length() > 0) {
        this._queueSettlePromises();
    }
};

Promise.prototype._rejectUncheckedCheckError = function (reason) {
    var trace = util.ensureErrorObject(reason);
    this._rejectUnchecked(reason, trace === reason ? undefined : trace);
};

Promise.prototype._rejectUnchecked = function (reason, trace) {
    if (reason === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._rejectUnchecked(err);
    }
    this._setRejected();
    this._settledValue = reason;
    this._cleanValues();

    if (this._isFinal()) {
        async.throwLater(function(e) {
            if ("stack" in e) {
                async.invokeFirst(
                    CapturedTrace.unhandledRejection, undefined, e);
            }
            throw e;
        }, trace === undefined ? reason : trace);
        return;
    }

    if (trace !== undefined && trace !== reason) {
        this._setCarriedStackTrace(trace);
    }

    if (this._length() > 0) {
        this._queueSettlePromises();
    } else {
        this._ensurePossibleRejectionHandled();
    }
};

Promise.prototype._settlePromises = function () {
    this._unsetSettlePromisesQueued();
    var len = this._length();
    for (var i = 0; i < len; i++) {
        this._settlePromiseAt(i);
    }
};

Promise.prototype._ensurePossibleRejectionHandled = function () {
    this._setRejectionIsUnhandled();
    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
};

Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
    CapturedTrace.fireRejectionEvent("rejectionHandled",
                                  unhandledRejectionHandled, undefined, this);
};

Promise.prototype._notifyUnhandledRejection = function () {
    if (this._isRejectionUnhandled()) {
        var reason = this._getCarriedStackTrace() || this._settledValue;
        this._setUnhandledRejectionIsNotified();
        CapturedTrace.fireRejectionEvent("unhandledRejection",
                                      possiblyUnhandledRejection, reason, this);
    }
};

var contextStack = [];
function Context() {
    this._trace = new CapturedTrace(peekContext());
}
Context.prototype._pushContext = function () {
    if (!debugging) return;
    if (this._trace !== undefined) {
        contextStack.push(this._trace);
    }
};

Context.prototype._popContext = function () {
    if (!debugging) return;
    if (this._trace !== undefined) {
        contextStack.pop();
    }
};

 /*jshint unused:false*/
function createContext() {
    if (debugging) return new Context();
}

function peekContext() {
    var lastIndex = contextStack.length - 1;
    if (lastIndex >= 0) {
        return contextStack[lastIndex];
    }
    return undefined;
}

Promise.prototype._peekContext = peekContext;
Promise.prototype._pushContext = Context.prototype._pushContext;
Promise.prototype._popContext = Context.prototype._popContext;

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === errorObj) {
        this._setRejected();
        var reason = value.e;
        this._settledValue = reason;
        this._cleanValues();
        this._attachExtraTrace(reason);
        this._ensurePossibleRejectionHandled();
    } else {
        var maybePromise = tryConvertToPromise(value, this);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            this._follow(maybePromise);
        } else {
            this._setFulfilled();
            this._settledValue = value;
            this._cleanValues();
        }
    }
};



if (!CapturedTrace.isSupported()) {
    Promise.longStackTraces = function(){};
    debugging = false;
}

Promise._makeSelfResolutionError = makeSelfResolutionError;
require("./finally.js")(Promise, NEXT_FILTER, tryConvertToPromise);
require("./direct_resolve.js")(Promise);
require("./synchronous_inspection.js")(Promise);
require("./join.js")(Promise, PromiseArray, tryConvertToPromise, INTERNAL);
Promise.RangeError = RangeError;
Promise.CancellationError = CancellationError;
Promise.TimeoutError = TimeoutError;
Promise.TypeError = TypeError;
Promise.OperationalError = OperationalError;
Promise.RejectionError = OperationalError;
Promise.AggregateError = errors.AggregateError;

util.toFastProperties(Promise);
util.toFastProperties(Promise.prototype);
Promise.Promise = Promise;
CapturedTrace.setBounds(async.firstLineError, util.lastLineError);
require('./nodeify.js')(Promise);
require('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext);
require('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise);
require('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL);
require('./cancel.js')(Promise, INTERNAL);
require('./promisify.js')(Promise, INTERNAL);
require('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
require('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
require('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL);
require('./settle.js')(Promise, PromiseArray);
require('./call_get.js')(Promise);
require('./some.js')(Promise, PromiseArray, apiRejection);
require('./progress.js')(Promise, PromiseArray);
require('./any.js')(Promise);
require('./each.js')(Promise, INTERNAL);
require('./timers.js')(Promise, INTERNAL, tryConvertToPromise);
require('./filter.js')(Promise, INTERNAL);

Promise.prototype = Promise.prototype;
return Promise;

};

}).call(this,require('_process'))
},{"./any.js":1,"./async.js":2,"./call_get.js":4,"./cancel.js":5,"./captured_trace.js":6,"./catch_filter.js":7,"./direct_resolve.js":8,"./each.js":9,"./errors.js":10,"./filter.js":12,"./finally.js":13,"./generators.js":14,"./join.js":15,"./map.js":16,"./nodeify.js":17,"./progress.js":18,"./promise_array.js":20,"./promise_resolver.js":21,"./promisify.js":22,"./props.js":23,"./race.js":25,"./reduce.js":26,"./settle.js":28,"./some.js":29,"./synchronous_inspection.js":30,"./thenables.js":31,"./timers.js":32,"./using.js":33,"./util.js":34,"_process":38}],20:[function(require,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise,
    apiRejection) {
var util = require("./util.js");
var isArray = util.isArray;

function toResolutionValue(val) {
    switch(val) {
    case -1: return undefined;
    case -2: return [];
    case -3: return {};
    }
}

function PromiseArray(values) {
    var promise = this._promise = new Promise(INTERNAL);
    var parent;
    if (values instanceof Promise) {
        parent = values;
        promise._propagateFrom(parent, 1 | 4);
    }
    this._values = values;
    this._length = 0;
    this._totalResolved = 0;
    this._init(undefined, -2);
}
PromiseArray.prototype.length = function () {
    return this._length;
};

PromiseArray.prototype.promise = function () {
    return this._promise;
};

PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
    var values = tryConvertToPromise(this._values, this._promise);
    if (values instanceof Promise) {
        values._setBoundTo(this._promise._boundTo);
        values = values._target();
        this._values = values;
        if (values._isFulfilled()) {
            values = values._value();
            if (!isArray(values)) {
                var err = new Promise.TypeError("expecting an array, a promise or a thenable\u000a\u000a    See http://goo.gl/s8MMhc\u000a");
                this.__hardReject__(err);
                return;
            }
        } else if (values._isPending()) {
            values._then(
                init,
                this._reject,
                undefined,
                this,
                resolveValueIfEmpty
           );
            return;
        } else {
            this._reject(values._reason());
            return;
        }
    } else if (!isArray(values)) {
        this._promise._follow(apiRejection("expecting an array, a promise or a thenable\u000a\u000a    See http://goo.gl/s8MMhc\u000a"));
        return;
    }

    if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
        }
        else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
    }
    var len = this.getActualLength(values.length);
    this._length = len;
    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
    var promise = this._promise;
    for (var i = 0; i < len; ++i) {
        var isResolved = this._isResolved();
        var maybePromise = tryConvertToPromise(values[i], promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            if (isResolved) {
                maybePromise._unsetRejectionIsUnhandled();
            } else if (maybePromise._isPending()) {
                maybePromise._proxyPromiseArray(this, i);
            } else if (maybePromise._isFulfilled()) {
                this._promiseFulfilled(maybePromise._value(), i);
            } else {
                this._promiseRejected(maybePromise._reason(), i);
            }
        } else if (!isResolved) {
            this._promiseFulfilled(maybePromise, i);
        }
    }
};

PromiseArray.prototype._isResolved = function () {
    return this._values === null;
};

PromiseArray.prototype._resolve = function (value) {
    this._values = null;
    this._promise._fulfill(value);
};

PromiseArray.prototype.__hardReject__ =
PromiseArray.prototype._reject = function (reason) {
    this._values = null;
    this._promise._rejectCallback(reason, false, true);
};

PromiseArray.prototype._promiseProgressed = function (progressValue, index) {
    this._promise._progress({
        index: index,
        value: progressValue
    });
};


PromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
    }
};

PromiseArray.prototype._promiseRejected = function (reason, index) {
    this._totalResolved++;
    this._reject(reason);
};

PromiseArray.prototype.shouldCopyValues = function () {
    return true;
};

PromiseArray.prototype.getActualLength = function (len) {
    return len;
};

return PromiseArray;
};

},{"./util.js":34}],21:[function(require,module,exports){
"use strict";
var util = require("./util.js");
var maybeWrapAsError = util.maybeWrapAsError;
var errors = require("./errors.js");
var TimeoutError = errors.TimeoutError;
var OperationalError = errors.OperationalError;
var haveGetters = util.haveGetters;
var es5 = require("./es5.js");

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);
        ret.name = obj.name;
        ret.message = obj.message;
        ret.stack = obj.stack;
        var keys = es5.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!rErrorKey.test(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    util.markAsOriginatingFromRejection(obj);
    return obj;
}

function nodebackForPromise(promise) {
    return function(err, value) {
        if (promise === null) return;

        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (arguments.length > 2) {
            var $_len = arguments.length;var args = new Array($_len - 1); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];}
            promise._fulfill(args);
        } else {
            promise._fulfill(value);
        }

        promise = null;
    };
}


var PromiseResolver;
if (!haveGetters) {
    PromiseResolver = function (promise) {
        this.promise = promise;
        this.asCallback = nodebackForPromise(promise);
        this.callback = this.asCallback;
    };
}
else {
    PromiseResolver = function (promise) {
        this.promise = promise;
    };
}
if (haveGetters) {
    var prop = {
        get: function() {
            return nodebackForPromise(this.promise);
        }
    };
    es5.defineProperty(PromiseResolver.prototype, "asCallback", prop);
    es5.defineProperty(PromiseResolver.prototype, "callback", prop);
}

PromiseResolver._nodebackForPromise = nodebackForPromise;

PromiseResolver.prototype.toString = function () {
    return "[object PromiseResolver]";
};

PromiseResolver.prototype.resolve =
PromiseResolver.prototype.fulfill = function (value) {
    if (!(this instanceof PromiseResolver)) {
        throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\u000a\u000a    See http://goo.gl/sdkXL9\u000a");
    }
    this.promise._resolveCallback(value);
};

PromiseResolver.prototype.reject = function (reason) {
    if (!(this instanceof PromiseResolver)) {
        throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\u000a\u000a    See http://goo.gl/sdkXL9\u000a");
    }
    this.promise._rejectCallback(reason);
};

PromiseResolver.prototype.progress = function (value) {
    if (!(this instanceof PromiseResolver)) {
        throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\u000a\u000a    See http://goo.gl/sdkXL9\u000a");
    }
    this.promise._progress(value);
};

PromiseResolver.prototype.cancel = function () {
    this.promise.cancel();
};

PromiseResolver.prototype.timeout = function () {
    this.reject(new TimeoutError("timeout"));
};

PromiseResolver.prototype.isResolved = function () {
    return this.promise.isResolved();
};

PromiseResolver.prototype.toJSON = function () {
    return this.promise.toJSON();
};

module.exports = PromiseResolver;

},{"./errors.js":10,"./es5.js":11,"./util.js":34}],22:[function(require,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var THIS = {};
var util = require("./util.js");
var nodebackForPromise = require("./promise_resolver.js")
    ._nodebackForPromise;
var withAppended = util.withAppended;
var maybeWrapAsError = util.maybeWrapAsError;
var canEvaluate = util.canEvaluate;
var TypeError = require("./errors").TypeError;
var defaultSuffix = "Async";
var defaultFilter = function(name, func) {
    return util.isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        !util.isClass(func);
};
var defaultPromisified = {__isPromisified__: true};


function escapeIdentRegex(str) {
    return str.replace(/([$])/, "\\$");
}

function isPromisified(fn) {
    try {
        return fn.__isPromisified__ === true;
    }
    catch (e) {
        return false;
    }
}

function hasPromisified(obj, key, suffix) {
    var val = util.getDataPropertyOrDefault(obj, key + suffix,
                                            defaultPromisified);
    return val ? isPromisified(val) : false;
}
function checkValid(ret, suffix, suffixRegexp) {
    for (var i = 0; i < ret.length; i += 2) {
        var key = ret[i];
        if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret.length; j += 2) {
                if (ret[j] === keyWithoutAsyncSuffix) {
                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/iWrZbw\u000a"
                        .replace("%s", suffix));
                }
            }
        }
    }
}

function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
    var keys = util.inheritedDataKeys(obj);
    var ret = [];
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = obj[key];
        var passesDefaultFilter = filter === defaultFilter
            ? true : defaultFilter(key, value, obj);
        if (typeof value === "function" &&
            !isPromisified(value) &&
            !hasPromisified(obj, key, suffix) &&
            filter(key, value, obj, passesDefaultFilter)) {
            ret.push(key, value);
        }
    }
    checkValid(ret, suffix, suffixRegexp);
    return ret;
}

function switchCaseArgumentOrder(likelyArgumentCount) {
    var ret = [likelyArgumentCount];
    var min = Math.max(0, likelyArgumentCount - 1 - 5);
    for(var i = likelyArgumentCount - 1; i >= min; --i) {
        if (i === likelyArgumentCount) continue;
        ret.push(i);
    }
    for(var i = likelyArgumentCount + 1; i <= 5; ++i) {
        ret.push(i);
    }
    return ret;
}

function argumentSequence(argumentCount) {
    return util.filledRange(argumentCount, "arguments[", "]");
}

function parameterDeclaration(parameterCount) {
    return util.filledRange(parameterCount, "_arg", "");
}

function parameterCount(fn) {
    if (typeof fn.length === "number") {
        return Math.max(Math.min(fn.length, 1023 + 1), 0);
    }
    return 0;
}

function generatePropertyAccess(key) {
    if (util.isIdentifier(key)) {
        return "." + key;
    }
    else return "['" + key.replace(/(['\\])/g, "\\$1") + "']";
}

function makeNodePromisifiedEval(callback, receiver, originalName, fn, suffix) {
    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
    var callbackName =
        (typeof originalName === "string" && util.isIdentifier(originalName)
            ? originalName + suffix
            : "promisified");

    function generateCallForArgumentCount(count) {
        var args = argumentSequence(count).join(", ");
        var comma = count > 0 ? ", " : "";
        var ret;
        if (typeof callback === "string") {
            ret = "                                                          \n\
                this.method({{args}}, fn);                                   \n\
                break;                                                       \n\
            ".replace(".method", generatePropertyAccess(callback));
        } else if (receiver === THIS) {
            ret =  "                                                         \n\
                callback.call(this, {{args}}, fn);                           \n\
                break;                                                       \n\
            ";
        } else if (receiver !== undefined) {
            ret =  "                                                         \n\
                callback.call(receiver, {{args}}, fn);                       \n\
                break;                                                       \n\
            ";
        } else {
            ret =  "                                                         \n\
                callback({{args}}, fn);                                      \n\
                break;                                                       \n\
            ";
        }
        return ret.replace("{{args}}", args).replace(", ", comma);
    }

    function generateArgumentSwitchCase() {
        var ret = "";
        for(var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] +":" +
                generateCallForArgumentCount(argumentOrder[i]);
        }
        var codeForCall;
        if (typeof callback === "string") {
            codeForCall = "                                                  \n\
                this.property.apply(this, args);                             \n\
            "
                .replace(".property", generatePropertyAccess(callback));
        } else if (receiver === THIS) {
            codeForCall = "                                                  \n\
                callback.apply(this, args);                                  \n\
            ";
        } else {
            codeForCall = "                                                  \n\
                callback.apply(receiver, args);                              \n\
            ";
        }

        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = fn;                                                    \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", codeForCall);
        return ret;
    }

    return new Function("Promise",
                        "callback",
                        "receiver",
                        "withAppended",
                        "maybeWrapAsError",
                        "nodebackForPromise",
                        "INTERNAL","                                         \n\
        var ret = function (Parameters) {                        \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            promise._setIsSpreadable();                                      \n\
            var fn = nodebackForPromise(promise);                            \n\
            try {                                                            \n\
                switch(len) {                                                \n\
                    [CodeForSwitchCase]                                      \n\
                }                                                            \n\
            } catch (e) {                                                    \n\
                var wrapped = maybeWrapAsError(e);                           \n\
                promise._attachExtraTrace(wrapped);                          \n\
                promise._reject(wrapped);                                    \n\
            }                                                                \n\
            return promise;                                                  \n\
        };                                                                   \n\
        ret.__isPromisified__ = true;                                        \n\
        return ret;                                                          \n\
        "
        .replace("FunctionName", callbackName)
        .replace("Parameters", parameterDeclaration(newParameterCount))
        .replace("[CodeForSwitchCase]", generateArgumentSwitchCase()))(
            Promise,
            callback,
            receiver,
            withAppended,
            maybeWrapAsError,
            nodebackForPromise,
            INTERNAL
        );
}

function makeNodePromisifiedClosure(callback, receiver) {
    function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        if (typeof callback === "string") {
            callback = _receiver[callback];
        }
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        promise._setIsSpreadable();
        var fn = nodebackForPromise(promise);
        try {
            callback.apply(_receiver, withAppended(arguments, fn));
        } catch(e) {
            var wrapped = maybeWrapAsError(e);
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        }
        return promise;
    }
    promisified.__isPromisified__ = true;
    return promisified;
}

var makeNodePromisified = canEvaluate
    ? makeNodePromisifiedEval
    : makeNodePromisifiedClosure;

function promisifyAll(obj, suffix, filter, promisifier) {
    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
    var methods =
        promisifiableMethods(obj, suffix, suffixRegexp, filter);

    for (var i = 0, len = methods.length; i < len; i+= 2) {
        var key = methods[i];
        var fn = methods[i+1];
        var promisifiedKey = key + suffix;
        obj[promisifiedKey] = promisifier === makeNodePromisified
                ? makeNodePromisified(key, THIS, key, fn, suffix)
                : promisifier(fn, function() {
                    return makeNodePromisified(key, THIS, key, fn, suffix);
                });
    }
    util.toFastProperties(obj);
    return obj;
}

function promisify(callback, receiver) {
    return makeNodePromisified(callback, receiver, undefined, callback);
}

Promise.promisify = function (fn, receiver) {
    if (typeof fn !== "function") {
        throw new TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
    }
    if (isPromisified(fn)) {
        return fn;
    }
    return promisify(fn, arguments.length < 2 ? THIS : receiver);
};

Promise.promisifyAll = function (target, options) {
    if (typeof target !== "function" && typeof target !== "object") {
        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/9ITlV0\u000a");
    }
    options = Object(options);
    var suffix = options.suffix;
    if (typeof suffix !== "string") suffix = defaultSuffix;
    var filter = options.filter;
    if (typeof filter !== "function") filter = defaultFilter;
    var promisifier = options.promisifier;
    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

    if (!util.isIdentifier(suffix)) {
        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/8FZo5V\u000a");
    }

    var keys = util.inheritedDataKeys(target, {includeHidden: true});
    for (var i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        if (keys[i] !== "constructor" &&
            util.isClass(value)) {
            promisifyAll(value.prototype, suffix, filter, promisifier);
            promisifyAll(value, suffix, filter, promisifier);
        }
    }

    return promisifyAll(target, suffix, filter, promisifier);
};
};


},{"./errors":10,"./promise_resolver.js":21,"./util.js":34}],23:[function(require,module,exports){
"use strict";
module.exports = function(
    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
var util = require("./util.js");
var isObject = util.isObject;
var es5 = require("./es5.js");

function PropertiesPromiseArray(obj) {
    var keys = es5.keys(obj);
    var len = keys.length;
    var values = new Array(len * 2);
    for (var i = 0; i < len; ++i) {
        var key = keys[i];
        values[i] = obj[key];
        values[i + len] = key;
    }
    this.constructor$(values);
}
util.inherits(PropertiesPromiseArray, PromiseArray);

PropertiesPromiseArray.prototype._init = function () {
    this._init$(undefined, -3) ;
};

PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        var val = {};
        var keyOffset = this.length();
        for (var i = 0, len = this.length(); i < len; ++i) {
            val[this._values[i + keyOffset]] = this._values[i];
        }
        this._resolve(val);
    }
};

PropertiesPromiseArray.prototype._promiseProgressed = function (value, index) {
    this._promise._progress({
        key: this._values[index + this.length()],
        value: value
    });
};

PropertiesPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

PropertiesPromiseArray.prototype.getActualLength = function (len) {
    return len >> 1;
};

function props(promises) {
    var ret;
    var castValue = tryConvertToPromise(promises);

    if (!isObject(castValue)) {
        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/OsFKC8\u000a");
    } else if (castValue instanceof Promise) {
        ret = castValue._then(
            Promise.props, undefined, undefined, undefined, undefined);
    } else {
        ret = new PropertiesPromiseArray(castValue).promise();
    }

    if (castValue instanceof Promise) {
        ret._propagateFrom(castValue, 4);
    }
    return ret;
}

Promise.prototype.props = function () {
    return props(this);
};

Promise.props = function (promises) {
    return props(promises);
};
};

},{"./es5.js":11,"./util.js":34}],24:[function(require,module,exports){
"use strict";
function arrayMove(src, srcIndex, dst, dstIndex, len) {
    for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
    }
}

function Queue(capacity) {
    this._capacity = capacity;
    this._length = 0;
    this._front = 0;
}

Queue.prototype._willBeOverCapacity = function (size) {
    return this._capacity < size;
};

Queue.prototype._pushOne = function (arg) {
    var length = this.length();
    this._checkCapacity(length + 1);
    var i = (this._front + length) & (this._capacity - 1);
    this[i] = arg;
    this._length = length + 1;
};

Queue.prototype._unshiftOne = function(value) {
    var capacity = this._capacity;
    this._checkCapacity(this.length() + 1);
    var front = this._front;
    var i = (((( front - 1 ) &
                    ( capacity - 1) ) ^ capacity ) - capacity );
    this[i] = value;
    this._front = i;
    this._length = this.length() + 1;
};

Queue.prototype.unshift = function(fn, receiver, arg) {
    this._unshiftOne(arg);
    this._unshiftOne(receiver);
    this._unshiftOne(fn);
};

Queue.prototype.push = function (fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver);
        this._pushOne(arg);
        return;
    }
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[(j + 0) & wrapMask] = fn;
    this[(j + 1) & wrapMask] = receiver;
    this[(j + 2) & wrapMask] = arg;
    this._length = length;
};

Queue.prototype.shift = function () {
    var front = this._front,
        ret = this[front];

    this[front] = undefined;
    this._front = (front + 1) & (this._capacity - 1);
    this._length--;
    return ret;
};

Queue.prototype.length = function () {
    return this._length;
};

Queue.prototype._checkCapacity = function (size) {
    if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
    }
};

Queue.prototype._resizeTo = function (capacity) {
    var oldCapacity = this._capacity;
    this._capacity = capacity;
    var front = this._front;
    var length = this._length;
    if (front + length > oldCapacity) {
        var moveItemsCount = (front + length) & (oldCapacity - 1);
        arrayMove(this, 0, this, oldCapacity, moveItemsCount);
    }
};

module.exports = Queue;

},{}],25:[function(require,module,exports){
"use strict";
module.exports = function(
    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var isArray = require("./util.js").isArray;

var raceLater = function (promise) {
    return promise.then(function(array) {
        return race(array, promise);
    });
};

function race(promises, parent) {
    var maybePromise = tryConvertToPromise(promises);

    if (maybePromise instanceof Promise) {
        return raceLater(maybePromise);
    } else if (!isArray(promises)) {
        return apiRejection("expecting an array, a promise or a thenable\u000a\u000a    See http://goo.gl/s8MMhc\u000a");
    }

    var ret = new Promise(INTERNAL);
    if (parent !== undefined) {
        ret._propagateFrom(parent, 4 | 1);
    }
    var fulfill = ret._fulfill;
    var reject = ret._reject;
    for (var i = 0, len = promises.length; i < len; ++i) {
        var val = promises[i];

        if (val === undefined && !(i in promises)) {
            continue;
        }

        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
    }
    return ret;
}

Promise.race = function (promises) {
    return race(promises, undefined);
};

Promise.prototype.race = function () {
    return race(this, undefined);
};

};

},{"./util.js":34}],26:[function(require,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL) {
var util = require("./util.js");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
function ReductionPromiseArray(promises, fn, accum, _each) {
    this.constructor$(promises);
    this._promise._captureStackTrace();
    this._preservedValues = _each === INTERNAL ? [] : null;
    this._zerothIsAccum = (accum === undefined);
    this._gotAccum = false;
    this._reducingIndex = (this._zerothIsAccum ? 1 : 0);
    this._valuesPhase = undefined;
    var maybePromise = tryConvertToPromise(accum, this._promise);
    var rejected = false;
    var isPromise = maybePromise instanceof Promise;
    if (isPromise) {
        maybePromise = maybePromise._target();
        if (maybePromise._isPending()) {
            maybePromise._proxyPromiseArray(this, -1);
        } else if (maybePromise._isFulfilled()) {
            accum = maybePromise._value();
            this._gotAccum = true;
        } else {
            this._reject(maybePromise._reason());
            rejected = true;
        }
    }
    if (!(isPromise || this._zerothIsAccum)) this._gotAccum = true;
    this._callback = fn;
    this._accum = accum;
    if (!rejected) this._init$(undefined, -5);
}
util.inherits(ReductionPromiseArray, PromiseArray);

ReductionPromiseArray.prototype._init = function () {};

ReductionPromiseArray.prototype._resolveEmptyArray = function () {
    if (this._gotAccum || this._zerothIsAccum) {
        this._resolve(this._preservedValues !== null
                        ? [] : this._accum);
    }
};

ReductionPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var values = this._values;
    values[index] = value;
    var length = this.length();
    var preservedValues = this._preservedValues;
    var isEach = preservedValues !== null;
    var gotAccum = this._gotAccum;
    var valuesPhase = this._valuesPhase;
    var valuesPhaseIndex;
    if (!valuesPhase) {
        valuesPhase = this._valuesPhase = Array(length);
        for (valuesPhaseIndex=0; valuesPhaseIndex<length; ++valuesPhaseIndex) {
            valuesPhase[valuesPhaseIndex] = 0;
        }
    }
    valuesPhaseIndex = valuesPhase[index];

    if (index === 0 && this._zerothIsAccum) {
        if (!gotAccum) {
            this._accum = value;
            this._gotAccum = gotAccum = true;
        }
        valuesPhase[index] = ((valuesPhaseIndex === 0)
            ? 1 : 2);
    } else if (index === -1) {
        if (!gotAccum) {
            this._accum = value;
            this._gotAccum = gotAccum = true;
        }
    } else {
        if (valuesPhaseIndex === 0) {
            valuesPhase[index] = 1;
        }
        else {
            valuesPhase[index] = 2;
            if (gotAccum) {
                this._accum = value;
            }
        }
    }
    if (!gotAccum) return;

    var callback = this._callback;
    var receiver = this._promise._boundTo;
    var ret;

    for (var i = this._reducingIndex; i < length; ++i) {
        valuesPhaseIndex = valuesPhase[i];
        if (valuesPhaseIndex === 2) {
            this._reducingIndex = i + 1;
            continue;
        }
        if (valuesPhaseIndex !== 1) return;
        value = values[i];
        if (value instanceof Promise) {
            value = value._target();
            if (value._isFulfilled()) {
                value = value._value();
            } else if (value._isPending()) {
                return;
            } else {
                return this._reject(value._reason());
            }
        }

        this._promise._pushContext();
        if (isEach) {
            preservedValues.push(value);
            ret = tryCatch(callback).call(receiver, value, i, length);
        }
        else {
            ret = tryCatch(callback)
                .call(receiver, this._accum, value, i, length);
        }
        this._promise._popContext();

        if (ret === errorObj) return this._reject(ret.e);

        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            if (maybePromise._isPending()) {
                valuesPhase[i] = 4;
                return maybePromise._proxyPromiseArray(this, i);
            } else if (maybePromise._isFulfilled()) {
                ret = maybePromise._value();
            } else {
                return this._reject(maybePromise._reason());
            }
        }

        this._reducingIndex = i + 1;
        this._accum = ret;
    }

    if (this._reducingIndex < length) return;
    this._resolve(isEach ? preservedValues : this._accum);
};

function reduce(promises, fn, initialValue, _each) {
    if (typeof fn !== "function") return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
    return array.promise();
}

Promise.prototype.reduce = function (fn, initialValue) {
    return reduce(this, fn, initialValue, null);
};

Promise.reduce = function (promises, fn, initialValue, _each) {
    return reduce(promises, fn, initialValue, _each);
};
};

},{"./util.js":34}],27:[function(require,module,exports){
(function (process){
"use strict";
var schedule;
if (typeof process === "object" && typeof process.version === "string") {
    schedule = parseInt(process.version.split(".")[1], 10) > 10
        ? setImmediate : process.nextTick;
}
else if (typeof MutationObserver !== "undefined") {
    schedule = function(fn) {
        var div = document.createElement("div");
        var observer = new MutationObserver(fn);
        observer.observe(div, {attributes: true});
        return function() { div.classList.toggle("foo"); };
    };
    schedule.isStatic = true;
}
else if (typeof setTimeout !== "undefined") {
    schedule = function (fn) {
        setTimeout(fn, 0);
    };
}
else {
    schedule = function() {
        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/m3OTXk\u000a");
    };
}
module.exports = schedule;

}).call(this,require('_process'))
},{"_process":38}],28:[function(require,module,exports){
"use strict";
module.exports =
    function(Promise, PromiseArray) {
var PromiseInspection = Promise.PromiseInspection;
var util = require("./util.js");

function SettledPromiseArray(values) {
    this.constructor$(values);
    this._promise._setIsSpreadable();
}
util.inherits(SettledPromiseArray, PromiseArray);

SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
    this._values[index] = inspection;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
    }
};

SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var ret = new PromiseInspection();
    ret._bitField = 268435456;
    ret._settledValue = value;
    this._promiseResolved(index, ret);
};
SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
    var ret = new PromiseInspection();
    ret._bitField = 134217728;
    ret._settledValue = reason;
    this._promiseResolved(index, ret);
};

Promise.settle = function (promises) {
    return new SettledPromiseArray(promises).promise();
};

Promise.prototype.settle = function () {
    return new SettledPromiseArray(this).promise();
};
};

},{"./util.js":34}],29:[function(require,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, apiRejection) {
var util = require("./util.js");
var RangeError = require("./errors.js").RangeError;
var AggregateError = require("./errors.js").AggregateError;
var isArray = util.isArray;


function SomePromiseArray(values) {
    this.constructor$(values);
    this._howMany = 0;
    this._unwrap = false;
    this._initialized = false;
}
util.inherits(SomePromiseArray, PromiseArray);

SomePromiseArray.prototype._init = function () {
    if (!this._initialized) {
        return;
    }
    this._promise._setIsSpreadable();
    if (this._howMany === 0) {
        this._resolve([]);
        return;
    }
    this._init$(undefined, -5);
    var isArrayResolved = isArray(this._values);
    if (!this._isResolved() &&
        isArrayResolved &&
        this._howMany > this._canPossiblyFulfill()) {
        this._reject(this._getRangeError(this.length()));
    }
};

SomePromiseArray.prototype.init = function () {
    this._initialized = true;
    this._init();
};

SomePromiseArray.prototype.setUnwrap = function () {
    this._unwrap = true;
};

SomePromiseArray.prototype.howMany = function () {
    return this._howMany;
};

SomePromiseArray.prototype.setHowMany = function (count) {
    if (this._isResolved()) return;
    this._howMany = count;
};

SomePromiseArray.prototype._promiseFulfilled = function (value) {
    this._addFulfilled(value);
    if (this._fulfilled() === this.howMany()) {
        this._values.length = this.howMany();
        if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
        } else {
            this._resolve(this._values);
        }
    }

};
SomePromiseArray.prototype._promiseRejected = function (reason) {
    this._addRejected(reason);
    if (this.howMany() > this._canPossiblyFulfill()) {
        var e = new AggregateError();
        for (var i = this.length(); i < this._values.length; ++i) {
            e.push(this._values[i]);
        }
        this._reject(e);
    }
};

SomePromiseArray.prototype._fulfilled = function () {
    return this._totalResolved;
};

SomePromiseArray.prototype._rejected = function () {
    return this._values.length - this.length();
};

SomePromiseArray.prototype._addRejected = function (reason) {
    this._values.push(reason);
};

SomePromiseArray.prototype._addFulfilled = function (value) {
    this._values[this._totalResolved++] = value;
};

SomePromiseArray.prototype._canPossiblyFulfill = function () {
    return this.length() - this._rejected();
};

SomePromiseArray.prototype._getRangeError = function (count) {
    var message = "Input array must contain at least " +
            this._howMany + " items but contains only " + count + " items";
    return new RangeError(message);
};

SomePromiseArray.prototype._resolveEmptyArray = function () {
    this._reject(this._getRangeError(0));
};

function some(promises, howMany) {
    if ((howMany | 0) !== howMany || howMany < 0) {
        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/1wAmHx\u000a");
    }
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    if (promise.isRejected()) {
        return promise;
    }
    ret.setHowMany(howMany);
    ret.init();
    return promise;
}

Promise.some = function (promises, howMany) {
    return some(promises, howMany);
};

Promise.prototype.some = function (howMany) {
    return some(this, howMany);
};

Promise._SomePromiseArray = SomePromiseArray;
};

},{"./errors.js":10,"./util.js":34}],30:[function(require,module,exports){
"use strict";
module.exports = function(Promise) {
function PromiseInspection(promise) {
    if (promise !== undefined) {
        promise = promise._target();
        this._bitField = promise._bitField;
        this._settledValue = promise._settledValue;
    }
    else {
        this._bitField = 0;
        this._settledValue = undefined;
    }
}

PromiseInspection.prototype.value = function () {
    if (!this.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/hc1DLj\u000a");
    }
    return this._settledValue;
};

PromiseInspection.prototype.error =
PromiseInspection.prototype.reason = function () {
    if (!this.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/hPuiwB\u000a");
    }
    return this._settledValue;
};

PromiseInspection.prototype.isFulfilled =
Promise.prototype._isFulfilled = function () {
    return (this._bitField & 268435456) > 0;
};

PromiseInspection.prototype.isRejected =
Promise.prototype._isRejected = function () {
    return (this._bitField & 134217728) > 0;
};

PromiseInspection.prototype.isPending =
Promise.prototype._isPending = function () {
    return (this._bitField & 402653184) === 0;
};

PromiseInspection.prototype.isResolved =
Promise.prototype._isResolved = function () {
    return (this._bitField & 402653184) > 0;
};

Promise.prototype.isPending = function() {
    return this._target()._isPending();
};

Promise.prototype.isRejected = function() {
    return this._target()._isRejected();
};

Promise.prototype.isFulfilled = function() {
    return this._target()._isFulfilled();
};

Promise.prototype.isResolved = function() {
    return this._target()._isResolved();
};

Promise.prototype._value = function() {
    return this._settledValue;
};

Promise.prototype._reason = function() {
    this._unsetRejectionIsUnhandled();
    return this._settledValue;
};

Promise.prototype.value = function() {
    var target = this._target();
    if (!target.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/hc1DLj\u000a");
    }
    return target._settledValue;
};

Promise.prototype.reason = function() {
    var target = this._target();
    if (!target.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/hPuiwB\u000a");
    }
    return target._settledValue;
};


Promise.PromiseInspection = PromiseInspection;
};

},{}],31:[function(require,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var util = require("./util.js");
var errorObj = util.errorObj;
var isObject = util.isObject;

function tryConvertToPromise(obj, context) {
    if (isObject(obj)) {
        if (obj instanceof Promise) {
            return obj;
        }
        else if (isAnyBluebirdPromise(obj)) {
            var ret = new Promise(INTERNAL);
            obj._then(
                ret._fulfillUnchecked,
                ret._rejectUncheckedCheckError,
                ret._progressUnchecked,
                ret,
                null
            );
            return ret;
        }
        var then = util.tryCatch(getThen)(obj);
        if (then === errorObj) {
            if (context) context._pushContext();
            var ret = Promise.reject(then.e);
            if (context) context._popContext();
            return ret;
        } else if (typeof then === "function") {
            return doThenable(obj, then, context);
        }
    }
    return obj;
}

function getThen(obj) {
    return obj.then;
}

var hasProp = {}.hasOwnProperty;
function isAnyBluebirdPromise(obj) {
    return hasProp.call(obj, "_promise0");
}

function doThenable(x, then, context) {
    var promise = new Promise(INTERNAL);
    if (context) context._pushContext();
    promise._captureStackTrace();
    if (context) context._popContext();
    var synchronous = true;
    var result = util.tryCatch(then).call(x,
                                        resolveFromThenable,
                                        rejectFromThenable,
                                        progressFromThenable);
    synchronous = false;
    if (result === errorObj) {
        promise._rejectCallback(result.e, true, true);
    }

    function resolveFromThenable(value) {
        if (x === value) {
            return promise._rejectCallback(
                Promise._makeSelfResolutionError(), false, true);
        }
        promise._resolveCallback(value);
    }

    function rejectFromThenable(reason) {
        promise._rejectCallback(reason, synchronous, true);
    }

    function progressFromThenable(value) {
        if (typeof promise._progress === "function") {
            promise._progress(value);
        }
    }
    return promise;
}

return tryConvertToPromise;
};

},{"./util.js":34}],32:[function(require,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise) {
var util = require("./util.js");
var TimeoutError = Promise.TimeoutError;

var afterTimeout = function (promise, message) {
    if (!promise.isPending()) return;
    if (typeof message !== "string") {
        message = "operation timed out";
    }
    var err = new TimeoutError(message);
    util.markAsOriginatingFromRejection(err);
    promise._attachExtraTrace(err);
    promise._cancel(err);
};

var afterDelay = function (value, promise) {
    promise._fulfill(value);
};

var delay = Promise.delay = function (value, ms) {
    if (ms === undefined) {
        ms = value;
        value = undefined;
    }
    ms = +ms;
    var maybePromise = tryConvertToPromise(value);
    var promise = new Promise(INTERNAL);

    if (maybePromise instanceof Promise) {
        promise._propagateFrom(maybePromise, 4 | 1);
        promise._follow(maybePromise._target());
        return promise.then(function(value) {
            return Promise.delay(value, ms);
        });
    } else {
        setTimeout(function delayTimeout() {
            afterDelay(value, promise);
        }, ms);
    }
    return promise;
};

Promise.prototype.delay = function (ms) {
    return delay(this, ms);
};

function successClear(value) {
    var handle = this;
    if (handle instanceof Number) handle = +handle;
    clearTimeout(handle);
    return value;
}

function failureClear(reason) {
    var handle = this;
    if (handle instanceof Number) handle = +handle;
    clearTimeout(handle);
    throw reason;
}

Promise.prototype.timeout = function (ms, message) {
    var target = this._target();
    ms = +ms;
    var ret = new Promise(INTERNAL).cancellable();
    ret._propagateFrom(this, 4 | 1);
    ret._follow(target);
    var handle = setTimeout(function timeoutTimeout() {
        afterTimeout(ret, message);
    }, ms);
    return ret._then(successClear, failureClear, undefined, handle, undefined);
};

};

},{"./util.js":34}],33:[function(require,module,exports){
"use strict";
module.exports = function (Promise, apiRejection, tryConvertToPromise,
    createContext) {
    var TypeError = require("./errors.js").TypeError;
    var inherits = require("./util.js").inherits;
    var PromiseInspection = Promise.PromiseInspection;

    function inspectionMapper(inspections) {
        var len = inspections.length;
        for (var i = 0; i < len; ++i) {
            var inspection = inspections[i];
            if (inspection.isRejected()) {
                return Promise.reject(inspection.error());
            }
            inspections[i] = inspection._settledValue;
        }
        return inspections;
    }

    function thrower(e) {
        setTimeout(function(){throw e;}, 0);
    }

    function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable &&
            typeof thenable._isDisposable === "function" &&
            typeof thenable._getDisposer === "function" &&
            thenable._isDisposable()) {
            maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
    }
    function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret = Promise.defer();
        function iterator() {
            if (i >= len) return ret.resolve();
            var maybePromise = castPreservingDisposable(resources[i++]);
            if (maybePromise instanceof Promise &&
                maybePromise._isDisposable()) {
                try {
                    maybePromise = tryConvertToPromise(
                        maybePromise._getDisposer().tryDispose(inspection),
                        resources.promise);
                } catch (e) {
                    return thrower(e);
                }
                if (maybePromise instanceof Promise) {
                    return maybePromise._then(iterator, thrower,
                                              null, null, null);
                }
            }
            iterator();
        }
        iterator();
        return ret.promise;
    }

    function disposerSuccess(value) {
        var inspection = new PromiseInspection();
        inspection._settledValue = value;
        inspection._bitField = 268435456;
        return dispose(this, inspection).thenReturn(value);
    }

    function disposerFail(reason) {
        var inspection = new PromiseInspection();
        inspection._settledValue = reason;
        inspection._bitField = 134217728;
        return dispose(this, inspection).thenThrow(reason);
    }

    function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
    }

    Disposer.prototype.data = function () {
        return this._data;
    };

    Disposer.prototype.promise = function () {
        return this._promise;
    };

    Disposer.prototype.resource = function () {
        if (this.promise().isFulfilled()) {
            return this.promise().value();
        }
        return null;
    };

    Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== undefined) context._pushContext();
        var ret = resource !== null
            ? this.doDispose(resource, inspection) : null;
        if (context !== undefined) context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret;
    };

    Disposer.isDisposer = function (d) {
        return (d != null &&
                typeof d.resource === "function" &&
                typeof d.tryDispose === "function");
    };

    function FunctionDisposer(fn, promise) {
        this.constructor$(fn, promise);
    }
    inherits(FunctionDisposer, Disposer);

    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
    };

    function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
            this.resources[this.index]._setDisposable(value);
            return value.promise();
        }
        return value;
    }

    Promise.using = function () {
        var len = arguments.length;
        if (len < 2) return apiRejection(
                        "you must pass at least 2 arguments to Promise.using");
        var fn = arguments[len - 1];
        if (typeof fn !== "function") return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
        len--;
        var resources = new Array(len);
        for (var i = 0; i < len; ++i) {
            var resource = arguments[i];
            if (Disposer.isDisposer(resource)) {
                var disposer = resource;
                resource = resource.promise();
                resource._setDisposable(disposer);
            } else {
                var maybePromise = tryConvertToPromise(resource);
                if (maybePromise instanceof Promise) {
                    resource =
                        maybePromise._then(maybeUnwrapDisposer, null, null, {
                            resources: resources,
                            index: i
                    }, undefined);
                }
            }
            resources[i] = resource;
        }

        var promise = Promise.settle(resources)
            .then(inspectionMapper)
            .then(function(vals) {
                promise._pushContext();
                var ret;
                try {
                    ret = fn.apply(undefined, vals);
                } finally {
                    promise._popContext();
                }
                return ret;
            })
            ._then(
                disposerSuccess, disposerFail, undefined, resources, undefined);
        resources.promise = promise;
        return promise;
    };

    Promise.prototype._setDisposable = function (disposer) {
        this._bitField = this._bitField | 262144;
        this._disposer = disposer;
    };

    Promise.prototype._isDisposable = function () {
        return (this._bitField & 262144) > 0;
    };

    Promise.prototype._getDisposer = function () {
        return this._disposer;
    };

    Promise.prototype._unsetDisposable = function () {
        this._bitField = this._bitField & (~262144);
        this._disposer = undefined;
    };

    Promise.prototype.disposer = function (fn) {
        if (typeof fn === "function") {
            return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError();
    };

};

},{"./errors.js":10,"./util.js":34}],34:[function(require,module,exports){
"use strict";
var es5 = require("./es5.js");
var canEvaluate = typeof navigator == "undefined";
var haveGetters = (function(){
    try {
        var o = {};
        es5.defineProperty(o, "f", {
            get: function () {
                return 3;
            }
        });
        return o.f === 3;
    }
    catch (e) {
        return false;
    }

})();

var errorObj = {e: {}};
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}

var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;

    function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
            if (hasProp.call(Parent.prototype, propertyName) &&
                propertyName.charAt(propertyName.length-1) !== "$"
           ) {
                this[propertyName + "$"] = Parent.prototype[propertyName];
            }
        }
    }
    T.prototype = Parent.prototype;
    Child.prototype = new T();
    return Child.prototype;
};

function asString(val) {
    return typeof val === "string" ? val : ("" + val);
}

function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";

}

function isObject(value) {
    return !isPrimitive(value);
}

function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;

    return new Error(asString(maybeError));
}

function withAppended(target, appendee) {
    var len = target.length;
    var ret = new Array(len + 1);
    var i;
    for (i = 0; i < len; ++i) {
        ret[i] = target[i];
    }
    ret[i] = appendee;
    return ret;
}

function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj, key);
        if (desc != null) {
            return desc.get == null && desc.set == null
                    ? desc.value
                    : defaultValue;
        }
    } else {
        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
    }
}

function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
    };
    es5.defineProperty(obj, name, descriptor);
    return obj;
}


var wrapsPrimitiveReceiver = (function() {
    return this !== "string";
}).call("string");

function thrower(r) {
    throw r;
}

var inheritedDataKeys = (function() {
    if (es5.isES5) {
        return function(obj, opts) {
            var ret = [];
            var visitedKeys = Object.create(null);
            var getKeys = Object(opts).includeHidden
                ? Object.getOwnPropertyNames
                : Object.keys;
            while (obj != null) {
                var keys;
                try {
                    keys = getKeys(obj);
                } catch (e) {
                    return ret;
                }
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (visitedKeys[key]) continue;
                    visitedKeys[key] = true;
                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                    if (desc != null && desc.get == null && desc.set == null) {
                        ret.push(key);
                    }
                }
                obj = es5.getPrototypeOf(obj);
            }
            return ret;
        };
    } else {
        return function(obj) {
            var ret = [];
            /*jshint forin:false */
            for (var key in obj) {
                ret.push(key);
            }
            return ret;
        };
    }

})();

function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = es5.keys(fn.prototype);
            return keys.length > 0 &&
                   !(keys.length === 1 && keys[0] === "constructor");
        }
        return false;
    } catch (e) {
        return false;
    }
}

function toFastProperties(obj) {
    /*jshint -W027*/
    function f() {}
    f.prototype = obj;
    return f;
    eval(obj);
}

var rident = /^[a-z$_][a-z$_0-9]*$/i;
function isIdentifier(str) {
    return rident.test(str);
}

function filledRange(count, prefix, suffix) {
    var ret = new Array(count);
    for(var i = 0; i < count; ++i) {
        ret[i] = prefix + i + suffix;
    }
    return ret;
}

function safeToString(obj) {
    try {
        return obj + "";
    } catch (e) {
        return "[no string representation]";
    }
}

function markAsOriginatingFromRejection(e) {
    try {
        notEnumerableProp(e, "isOperational", true);
    }
    catch(ignore) {}
}

function originatesFromRejection(e) {
    if (e == null) return false;
    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
        e["isOperational"] === true);
}

function canAttachTrace(obj) {
    return obj instanceof Error && es5.propertyIsWritable(obj, "stack");
}

var ensureErrorObject = (function() {
    if (!("stack" in new Error())) {
        return function(value) {
            if (canAttachTrace(value)) return value;
            try {throw new Error(safeToString(value));}
            catch(err) {return err;}
        };
    } else {
        return function(value) {
            if (canAttachTrace(value)) return value;
            return new Error(safeToString(value));
        };
    }
})();

var ret = {
    isClass: isClass,
    isIdentifier: isIdentifier,
    inheritedDataKeys: inheritedDataKeys,
    getDataPropertyOrDefault: getDataPropertyOrDefault,
    thrower: thrower,
    isArray: es5.isArray,
    haveGetters: haveGetters,
    notEnumerableProp: notEnumerableProp,
    isPrimitive: isPrimitive,
    isObject: isObject,
    canEvaluate: canEvaluate,
    errorObj: errorObj,
    tryCatch: tryCatch,
    inherits: inherits,
    withAppended: withAppended,
    asString: asString,
    maybeWrapAsError: maybeWrapAsError,
    wrapsPrimitiveReceiver: wrapsPrimitiveReceiver,
    toFastProperties: toFastProperties,
    filledRange: filledRange,
    toString: safeToString,
    canAttachTrace: canAttachTrace,
    ensureErrorObject: ensureErrorObject,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection
};
try {throw new Error(); } catch (e) {ret.lastLineError = e;}
module.exports = ret;

},{"./es5.js":11}],35:[function(require,module,exports){
var Emitter = require('events').EventEmitter

function StateMachine (opts) {

    Emitter.call(this)

    opts = opts || {}
    this.states = opts.states || ['default']
    this.currentState = opts.defaultState || this.states[0]
    this.history = []
    this.configs = {}
    this.events  = []

    var self = this
    this.on('transition', function (e) {
        self.events.forEach(function (condition) {
            if (condition.from === e.from && condition.to === e.to) {
                self.emit(condition.event)
            }
        })
    })

}

StateMachine.prototype = Object.create(Emitter.prototype)

StateMachine.prototype.setState = function (to) {

    var from = this.currentState
    if (!this._validate(from, to)) {
        return false
    }

    this.history.push({
        state : from,
        args  : this.currentArgs
    })

    var args = arguments.length > 1
        ? [].slice.call(arguments, 1)
        : null

    this.currentArgs  = args
    this.currentState = to
    this._emit(from, to, args)

    return true

}

StateMachine.prototype.back = function () {

    if (!this.history.length) {
        return false
    }

    var last = this.history[this.history.length - 1],
        from = this.currentState,
        to   = last.state,
        args = last.args

    if (!this._validate(from, to)) {
        return false
    }

    this.history.pop()
    this.currentState = to
    this.currentArgs  = args
    this._emit(from, to, args, true)

    return true

}

StateMachine.prototype.lock = function () {

    this.locked = true

}

StateMachine.prototype.unlock = function () {

    this.locked = false

}

StateMachine.prototype.config = function (state, options) {

    options.to   = options.to   || {}
    options.from = options.from || {}
    this.configs[state] = options

}

StateMachine.prototype.register = function (event, condition) {
    
    this.events.push({
        event : event,
        from  : condition.from,
        to    : condition.to
    })

}

StateMachine.prototype._emit = function (from, to, args, back) {

    var event = {
        from : from,
        to   : to,
        args : args,
        back : back
    }

    this.emit('transition', event)
    this.emit('leave:' + from, event)
    this.emit('enter:' + to, event)

}

StateMachine.prototype._validate = function (from, to) {

    if (this.locked) return
    if (from === to) return
    if (this.states.indexOf(to) < 0) return

    var fromConf = this.configs[from]
    if (fromConf) {
        if (fromConf.to.only) {
            if (fromConf.to.only.indexOf(to) < 0) return
        } else if (fromConf.to.exclude) {
            if (fromConf.to.exclude.indexOf(to) > -1) return
        }
    }

    var toConf = this.configs[to]
    if (toConf) {
        if (toConf.from.only) {
            if (toConf.from.only.indexOf(from) < 0) return
        } else if (toConf.from.exclude) {
            if (toConf.from.exclude.indexOf(from) > -1) return
        }
    }

    return true

}

module.exports = StateMachine
},{"events":37}],36:[function(require,module,exports){

},{}],37:[function(require,module,exports){
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

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],38:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

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
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],39:[function(require,module,exports){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":40,"./encode":41}],43:[function(require,module,exports){
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

},{"punycode":39,"querystring":42}],44:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var Handlebars = require("./handlebars.runtime")["default"];

// Compiler imports
var AST = require("./handlebars/compiler/ast")["default"];
var Parser = require("./handlebars/compiler/base").parser;
var parse = require("./handlebars/compiler/base").parse;
var Compiler = require("./handlebars/compiler/compiler").Compiler;
var compile = require("./handlebars/compiler/compiler").compile;
var precompile = require("./handlebars/compiler/compiler").precompile;
var JavaScriptCompiler = require("./handlebars/compiler/javascript-compiler")["default"];

var _create = Handlebars.create;
var create = function() {
  var hb = _create();

  hb.compile = function(input, options) {
    return compile(input, options, hb);
  };
  hb.precompile = function (input, options) {
    return precompile(input, options, hb);
  };

  hb.AST = AST;
  hb.Compiler = Compiler;
  hb.JavaScriptCompiler = JavaScriptCompiler;
  hb.Parser = Parser;
  hb.parse = parse;

  return hb;
};

Handlebars = create();
Handlebars.create = create;

Handlebars['default'] = Handlebars;

exports["default"] = Handlebars;
},{"./handlebars.runtime":45,"./handlebars/compiler/ast":47,"./handlebars/compiler/base":48,"./handlebars/compiler/compiler":49,"./handlebars/compiler/javascript-compiler":51}],45:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

Handlebars['default'] = Handlebars;

exports["default"] = Handlebars;
},{"./handlebars/base":46,"./handlebars/exception":55,"./handlebars/runtime":56,"./handlebars/safe-string":57,"./handlebars/utils":58}],46:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "2.0.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 6;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn) {
    if (toString.call(name) === objectType) {
      if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function(name) {
    delete this.helpers[name];
  },

  registerPartial: function(name, partial) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function(name) {
    delete this.partials[name];
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(/* [args, ]options */) {
    if(arguments.length === 1) {
      // A missing field in a {{foo}} constuct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
        options = {data: data};
      }

      return fn(context, options);
    }
  });

  instance.registerHelper('each', function(context, options) {
    if (!options) {
      throw new Exception('Must pass iterator to #each');
    }

    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    var contextPath;
    if (options.data && options.ids) {
      contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));

            if (contextPath) {
              data.contextPath = contextPath + i;
            }
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) {
              data.key = key;
              data.index = i;
              data.first = (i === 0);

              if (contextPath) {
                data.contextPath = contextPath + key;
              }
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    var fn = options.fn;

    if (!Utils.isEmpty(context)) {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
        options = {data:data};
      }

      return fn(context, options);
    } else {
      return options.inverse(this);
    }
  });

  instance.registerHelper('log', function(message, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, message);
  });

  instance.registerHelper('lookup', function(obj, field) {
    return obj && obj[field];
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, message) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, message);
      }
    }
  }
};
exports.logger = logger;
var log = logger.log;
exports.log = log;
var createFrame = function(object) {
  var frame = Utils.extend({}, object);
  frame._parent = object;
  return frame;
};
exports.createFrame = createFrame;
},{"./exception":55,"./utils":58}],47:[function(require,module,exports){
"use strict";
var Exception = require("../exception")["default"];

function LocationInfo(locInfo) {
  locInfo = locInfo || {};
  this.firstLine   = locInfo.first_line;
  this.firstColumn = locInfo.first_column;
  this.lastColumn  = locInfo.last_column;
  this.lastLine    = locInfo.last_line;
}

var AST = {
  ProgramNode: function(statements, strip, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "program";
    this.statements = statements;
    this.strip = strip;
  },

  MustacheNode: function(rawParams, hash, open, strip, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "mustache";
    this.strip = strip;

    // Open may be a string parsed from the parser or a passed boolean flag
    if (open != null && open.charAt) {
      // Must use charAt to support IE pre-10
      var escapeFlag = open.charAt(3) || open.charAt(2);
      this.escaped = escapeFlag !== '{' && escapeFlag !== '&';
    } else {
      this.escaped = !!open;
    }

    if (rawParams instanceof AST.SexprNode) {
      this.sexpr = rawParams;
    } else {
      // Support old AST API
      this.sexpr = new AST.SexprNode(rawParams, hash);
    }

    // Support old AST API that stored this info in MustacheNode
    this.id = this.sexpr.id;
    this.params = this.sexpr.params;
    this.hash = this.sexpr.hash;
    this.eligibleHelper = this.sexpr.eligibleHelper;
    this.isHelper = this.sexpr.isHelper;
  },

  SexprNode: function(rawParams, hash, locInfo) {
    LocationInfo.call(this, locInfo);

    this.type = "sexpr";
    this.hash = hash;

    var id = this.id = rawParams[0];
    var params = this.params = rawParams.slice(1);

    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    this.isHelper = !!(params.length || hash);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    this.eligibleHelper = this.isHelper || id.isSimple;

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
  },

  PartialNode: function(partialName, context, hash, strip, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type         = "partial";
    this.partialName  = partialName;
    this.context      = context;
    this.hash = hash;
    this.strip = strip;

    this.strip.inlineStandalone = true;
  },

  BlockNode: function(mustache, program, inverse, strip, locInfo) {
    LocationInfo.call(this, locInfo);

    this.type = 'block';
    this.mustache = mustache;
    this.program  = program;
    this.inverse  = inverse;
    this.strip = strip;

    if (inverse && !program) {
      this.isInverse = true;
    }
  },

  RawBlockNode: function(mustache, content, close, locInfo) {
    LocationInfo.call(this, locInfo);

    if (mustache.sexpr.id.original !== close) {
      throw new Exception(mustache.sexpr.id.original + " doesn't match " + close, this);
    }

    content = new AST.ContentNode(content, locInfo);

    this.type = 'block';
    this.mustache = mustache;
    this.program = new AST.ProgramNode([content], {}, locInfo);
  },

  ContentNode: function(string, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "content";
    this.original = this.string = string;
  },

  HashNode: function(pairs, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "hash";
    this.pairs = pairs;
  },

  IdNode: function(parts, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "ID";

    var original = "",
        dig = [],
        depth = 0,
        depthString = '';

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i].part;
      original += (parts[i].separator || '') + part;

      if (part === ".." || part === "." || part === "this") {
        if (dig.length > 0) {
          throw new Exception("Invalid path: " + original, this);
        } else if (part === "..") {
          depth++;
          depthString += '../';
        } else {
          this.isScoped = true;
        }
      } else {
        dig.push(part);
      }
    }

    this.original = original;
    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;
    this.idName   = depthString + this.string;

    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

    this.stringModeValue = this.string;
  },

  PartialNameNode: function(name, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "PARTIAL_NAME";
    this.name = name.original;
  },

  DataNode: function(id, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "DATA";
    this.id = id;
    this.stringModeValue = id.stringModeValue;
    this.idName = '@' + id.stringModeValue;
  },

  StringNode: function(string, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "STRING";
    this.original =
      this.string =
      this.stringModeValue = string;
  },

  NumberNode: function(number, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "NUMBER";
    this.original =
      this.number = number;
    this.stringModeValue = Number(number);
  },

  BooleanNode: function(bool, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "BOOLEAN";
    this.bool = bool;
    this.stringModeValue = bool === "true";
  },

  CommentNode: function(comment, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "comment";
    this.comment = comment;

    this.strip = {
      inlineStandalone: true
    };
  }
};


// Must be exported as an object rather than the root of the module as the jison lexer
// most modify the object to operate properly.
exports["default"] = AST;
},{"../exception":55}],48:[function(require,module,exports){
"use strict";
var parser = require("./parser")["default"];
var AST = require("./ast")["default"];
var Helpers = require("./helpers");
var extend = require("../utils").extend;

exports.parser = parser;

var yy = {};
extend(yy, Helpers, AST);

function parse(input) {
  // Just return if an already-compile AST was passed in.
  if (input.constructor === AST.ProgramNode) { return input; }

  parser.yy = yy;

  return parser.parse(input);
}

exports.parse = parse;
},{"../utils":58,"./ast":47,"./helpers":50,"./parser":52}],49:[function(require,module,exports){
"use strict";
var Exception = require("../exception")["default"];
var isArray = require("../utils").isArray;

var slice = [].slice;

function Compiler() {}

exports.Compiler = Compiler;// the foundHelper register will disambiguate helper lookup from finding a
// function in a context. This is necessary for mustache compatibility, which
// requires that context functions in blocks are evaluated by blockHelperMissing,
// and then proceed as if the resulting value was provided to blockHelperMissing.

Compiler.prototype = {
  compiler: Compiler,

  equals: function(other) {
    var len = this.opcodes.length;
    if (other.opcodes.length !== len) {
      return false;
    }

    for (var i = 0; i < len; i++) {
      var opcode = this.opcodes[i],
          otherOpcode = other.opcodes[i];
      if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
        return false;
      }
    }

    // We know that length is the same between the two arrays because they are directly tied
    // to the opcode behavior above.
    len = this.children.length;
    for (i = 0; i < len; i++) {
      if (!this.children[i].equals(other.children[i])) {
        return false;
      }
    }

    return true;
  },

  guid: 0,

  compile: function(program, options) {
    this.opcodes = [];
    this.children = [];
    this.depths = {list: []};
    this.options = options;
    this.stringParams = options.stringParams;
    this.trackIds = options.trackIds;

    // These changes will propagate to the other compiler components
    var knownHelpers = this.options.knownHelpers;
    this.options.knownHelpers = {
      'helperMissing': true,
      'blockHelperMissing': true,
      'each': true,
      'if': true,
      'unless': true,
      'with': true,
      'log': true,
      'lookup': true
    };
    if (knownHelpers) {
      for (var name in knownHelpers) {
        this.options.knownHelpers[name] = knownHelpers[name];
      }
    }

    return this.accept(program);
  },

  accept: function(node) {
    return this[node.type](node);
  },

  program: function(program) {
    var statements = program.statements;

    for(var i=0, l=statements.length; i<l; i++) {
      this.accept(statements[i]);
    }
    this.isSimple = l === 1;

    this.depths.list = this.depths.list.sort(function(a, b) {
      return a - b;
    });

    return this;
  },

  compileProgram: function(program) {
    var result = new this.compiler().compile(program, this.options);
    var guid = this.guid++, depth;

    this.usePartial = this.usePartial || result.usePartial;

    this.children[guid] = result;

    for(var i=0, l=result.depths.list.length; i<l; i++) {
      depth = result.depths.list[i];

      if(depth < 2) { continue; }
      else { this.addDepth(depth - 1); }
    }

    return guid;
  },

  block: function(block) {
    var mustache = block.mustache,
        program = block.program,
        inverse = block.inverse;

    if (program) {
      program = this.compileProgram(program);
    }

    if (inverse) {
      inverse = this.compileProgram(inverse);
    }

    var sexpr = mustache.sexpr;
    var type = this.classifySexpr(sexpr);

    if (type === "helper") {
      this.helperSexpr(sexpr, program, inverse);
    } else if (type === "simple") {
      this.simpleSexpr(sexpr);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('blockValue', sexpr.id.original);
    } else {
      this.ambiguousSexpr(sexpr, program, inverse);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('ambiguousBlockValue');
    }

    this.opcode('append');
  },

  hash: function(hash) {
    var pairs = hash.pairs, i, l;

    this.opcode('pushHash');

    for(i=0, l=pairs.length; i<l; i++) {
      this.pushParam(pairs[i][1]);
    }
    while(i--) {
      this.opcode('assignToHash', pairs[i][0]);
    }
    this.opcode('popHash');
  },

  partial: function(partial) {
    var partialName = partial.partialName;
    this.usePartial = true;

    if (partial.hash) {
      this.accept(partial.hash);
    } else {
      this.opcode('push', 'undefined');
    }

    if (partial.context) {
      this.accept(partial.context);
    } else {
      this.opcode('getContext', 0);
      this.opcode('pushContext');
    }

    this.opcode('invokePartial', partialName.name, partial.indent || '');
    this.opcode('append');
  },

  content: function(content) {
    if (content.string) {
      this.opcode('appendContent', content.string);
    }
  },

  mustache: function(mustache) {
    this.sexpr(mustache.sexpr);

    if(mustache.escaped && !this.options.noEscape) {
      this.opcode('appendEscaped');
    } else {
      this.opcode('append');
    }
  },

  ambiguousSexpr: function(sexpr, program, inverse) {
    var id = sexpr.id,
        name = id.parts[0],
        isBlock = program != null || inverse != null;

    this.opcode('getContext', id.depth);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    this.ID(id);

    this.opcode('invokeAmbiguous', name, isBlock);
  },

  simpleSexpr: function(sexpr) {
    var id = sexpr.id;

    if (id.type === 'DATA') {
      this.DATA(id);
    } else if (id.parts.length) {
      this.ID(id);
    } else {
      // Simplified ID for `this`
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);
      this.opcode('pushContext');
    }

    this.opcode('resolvePossibleLambda');
  },

  helperSexpr: function(sexpr, program, inverse) {
    var params = this.setupFullMustacheParams(sexpr, program, inverse),
        id = sexpr.id,
        name = id.parts[0];

    if (this.options.knownHelpers[name]) {
      this.opcode('invokeKnownHelper', params.length, name);
    } else if (this.options.knownHelpersOnly) {
      throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
    } else {
      id.falsy = true;

      this.ID(id);
      this.opcode('invokeHelper', params.length, id.original, id.isSimple);
    }
  },

  sexpr: function(sexpr) {
    var type = this.classifySexpr(sexpr);

    if (type === "simple") {
      this.simpleSexpr(sexpr);
    } else if (type === "helper") {
      this.helperSexpr(sexpr);
    } else {
      this.ambiguousSexpr(sexpr);
    }
  },

  ID: function(id) {
    this.addDepth(id.depth);
    this.opcode('getContext', id.depth);

    var name = id.parts[0];
    if (!name) {
      // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
      this.opcode('pushContext');
    } else {
      this.opcode('lookupOnContext', id.parts, id.falsy, id.isScoped);
    }
  },

  DATA: function(data) {
    this.options.data = true;
    this.opcode('lookupData', data.id.depth, data.id.parts);
  },

  STRING: function(string) {
    this.opcode('pushString', string.string);
  },

  NUMBER: function(number) {
    this.opcode('pushLiteral', number.number);
  },

  BOOLEAN: function(bool) {
    this.opcode('pushLiteral', bool.bool);
  },

  comment: function() {},

  // HELPERS
  opcode: function(name) {
    this.opcodes.push({ opcode: name, args: slice.call(arguments, 1) });
  },

  addDepth: function(depth) {
    if(depth === 0) { return; }

    if(!this.depths[depth]) {
      this.depths[depth] = true;
      this.depths.list.push(depth);
    }
  },

  classifySexpr: function(sexpr) {
    var isHelper   = sexpr.isHelper;
    var isEligible = sexpr.eligibleHelper;
    var options    = this.options;

    // if ambiguous, we can possibly resolve the ambiguity now
    // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
    if (isEligible && !isHelper) {
      var name = sexpr.id.parts[0];

      if (options.knownHelpers[name]) {
        isHelper = true;
      } else if (options.knownHelpersOnly) {
        isEligible = false;
      }
    }

    if (isHelper) { return "helper"; }
    else if (isEligible) { return "ambiguous"; }
    else { return "simple"; }
  },

  pushParams: function(params) {
    for(var i=0, l=params.length; i<l; i++) {
      this.pushParam(params[i]);
    }
  },

  pushParam: function(val) {
    if (this.stringParams) {
      if(val.depth) {
        this.addDepth(val.depth);
      }
      this.opcode('getContext', val.depth || 0);
      this.opcode('pushStringParam', val.stringModeValue, val.type);

      if (val.type === 'sexpr') {
        // Subexpressions get evaluated and passed in
        // in string params mode.
        this.sexpr(val);
      }
    } else {
      if (this.trackIds) {
        this.opcode('pushId', val.type, val.idName || val.stringModeValue);
      }
      this.accept(val);
    }
  },

  setupFullMustacheParams: function(sexpr, program, inverse) {
    var params = sexpr.params;
    this.pushParams(params);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    if (sexpr.hash) {
      this.hash(sexpr.hash);
    } else {
      this.opcode('emptyHash');
    }

    return params;
  }
};

function precompile(input, options, env) {
  if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
    throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  if (options.compat) {
    options.useDepths = true;
  }

  var ast = env.parse(input);
  var environment = new env.Compiler().compile(ast, options);
  return new env.JavaScriptCompiler().compile(environment, options);
}

exports.precompile = precompile;function compile(input, options, env) {
  if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
    throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
  }

  options = options || {};

  if (!('data' in options)) {
    options.data = true;
  }
  if (options.compat) {
    options.useDepths = true;
  }

  var compiled;

  function compileInput() {
    var ast = env.parse(input);
    var environment = new env.Compiler().compile(ast, options);
    var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
    return env.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  var ret = function(context, options) {
    if (!compiled) {
      compiled = compileInput();
    }
    return compiled.call(this, context, options);
  };
  ret._setup = function(options) {
    if (!compiled) {
      compiled = compileInput();
    }
    return compiled._setup(options);
  };
  ret._child = function(i, data, depths) {
    if (!compiled) {
      compiled = compileInput();
    }
    return compiled._child(i, data, depths);
  };
  return ret;
}

exports.compile = compile;function argEquals(a, b) {
  if (a === b) {
    return true;
  }

  if (isArray(a) && isArray(b) && a.length === b.length) {
    for (var i = 0; i < a.length; i++) {
      if (!argEquals(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
}
},{"../exception":55,"../utils":58}],50:[function(require,module,exports){
"use strict";
var Exception = require("../exception")["default"];

function stripFlags(open, close) {
  return {
    left: open.charAt(2) === '~',
    right: close.charAt(close.length-3) === '~'
  };
}

exports.stripFlags = stripFlags;
function prepareBlock(mustache, program, inverseAndProgram, close, inverted, locInfo) {
  /*jshint -W040 */
  if (mustache.sexpr.id.original !== close.path.original) {
    throw new Exception(mustache.sexpr.id.original + ' doesn\'t match ' + close.path.original, mustache);
  }

  var inverse = inverseAndProgram && inverseAndProgram.program;

  var strip = {
    left: mustache.strip.left,
    right: close.strip.right,

    // Determine the standalone candiacy. Basically flag our content as being possibly standalone
    // so our parent can determine if we actually are standalone
    openStandalone: isNextWhitespace(program.statements),
    closeStandalone: isPrevWhitespace((inverse || program).statements)
  };

  if (mustache.strip.right) {
    omitRight(program.statements, null, true);
  }

  if (inverse) {
    var inverseStrip = inverseAndProgram.strip;

    if (inverseStrip.left) {
      omitLeft(program.statements, null, true);
    }
    if (inverseStrip.right) {
      omitRight(inverse.statements, null, true);
    }
    if (close.strip.left) {
      omitLeft(inverse.statements, null, true);
    }

    // Find standalone else statments
    if (isPrevWhitespace(program.statements)
        && isNextWhitespace(inverse.statements)) {

      omitLeft(program.statements);
      omitRight(inverse.statements);
    }
  } else {
    if (close.strip.left) {
      omitLeft(program.statements, null, true);
    }
  }

  if (inverted) {
    return new this.BlockNode(mustache, inverse, program, strip, locInfo);
  } else {
    return new this.BlockNode(mustache, program, inverse, strip, locInfo);
  }
}

exports.prepareBlock = prepareBlock;
function prepareProgram(statements, isRoot) {
  for (var i = 0, l = statements.length; i < l; i++) {
    var current = statements[i],
        strip = current.strip;

    if (!strip) {
      continue;
    }

    var _isPrevWhitespace = isPrevWhitespace(statements, i, isRoot, current.type === 'partial'),
        _isNextWhitespace = isNextWhitespace(statements, i, isRoot),

        openStandalone = strip.openStandalone && _isPrevWhitespace,
        closeStandalone = strip.closeStandalone && _isNextWhitespace,
        inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

    if (strip.right) {
      omitRight(statements, i, true);
    }
    if (strip.left) {
      omitLeft(statements, i, true);
    }

    if (inlineStandalone) {
      omitRight(statements, i);

      if (omitLeft(statements, i)) {
        // If we are on a standalone node, save the indent info for partials
        if (current.type === 'partial') {
          current.indent = (/([ \t]+$)/).exec(statements[i-1].original) ? RegExp.$1 : '';
        }
      }
    }
    if (openStandalone) {
      omitRight((current.program || current.inverse).statements);

      // Strip out the previous content node if it's whitespace only
      omitLeft(statements, i);
    }
    if (closeStandalone) {
      // Always strip the next node
      omitRight(statements, i);

      omitLeft((current.inverse || current.program).statements);
    }
  }

  return statements;
}

exports.prepareProgram = prepareProgram;function isPrevWhitespace(statements, i, isRoot) {
  if (i === undefined) {
    i = statements.length;
  }

  // Nodes that end with newlines are considered whitespace (but are special
  // cased for strip operations)
  var prev = statements[i-1],
      sibling = statements[i-2];
  if (!prev) {
    return isRoot;
  }

  if (prev.type === 'content') {
    return (sibling || !isRoot ? (/\r?\n\s*?$/) : (/(^|\r?\n)\s*?$/)).test(prev.original);
  }
}
function isNextWhitespace(statements, i, isRoot) {
  if (i === undefined) {
    i = -1;
  }

  var next = statements[i+1],
      sibling = statements[i+2];
  if (!next) {
    return isRoot;
  }

  if (next.type === 'content') {
    return (sibling || !isRoot ? (/^\s*?\r?\n/) : (/^\s*?(\r?\n|$)/)).test(next.original);
  }
}

// Marks the node to the right of the position as omitted.
// I.e. {{foo}}' ' will mark the ' ' node as omitted.
//
// If i is undefined, then the first child will be marked as such.
//
// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
// content is met.
function omitRight(statements, i, multiple) {
  var current = statements[i == null ? 0 : i + 1];
  if (!current || current.type !== 'content' || (!multiple && current.rightStripped)) {
    return;
  }

  var original = current.string;
  current.string = current.string.replace(multiple ? (/^\s+/) : (/^[ \t]*\r?\n?/), '');
  current.rightStripped = current.string !== original;
}

// Marks the node to the left of the position as omitted.
// I.e. ' '{{foo}} will mark the ' ' node as omitted.
//
// If i is undefined then the last child will be marked as such.
//
// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
// content is met.
function omitLeft(statements, i, multiple) {
  var current = statements[i == null ? statements.length - 1 : i - 1];
  if (!current || current.type !== 'content' || (!multiple && current.leftStripped)) {
    return;
  }

  // We omit the last node if it's whitespace only and not preceeded by a non-content node.
  var original = current.string;
  current.string = current.string.replace(multiple ? (/\s+$/) : (/[ \t]+$/), '');
  current.leftStripped = current.string !== original;
  return current.leftStripped;
}
},{"../exception":55}],51:[function(require,module,exports){
"use strict";
var COMPILER_REVISION = require("../base").COMPILER_REVISION;
var REVISION_CHANGES = require("../base").REVISION_CHANGES;
var Exception = require("../exception")["default"];

function Literal(value) {
  this.value = value;
}

function JavaScriptCompiler() {}

JavaScriptCompiler.prototype = {
  // PUBLIC API: You can override these methods in a subclass to provide
  // alternative compiled forms for name lookup and buffering semantics
  nameLookup: function(parent, name /* , type*/) {
    if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
      return parent + "." + name;
    } else {
      return parent + "['" + name + "']";
    }
  },
  depthedLookup: function(name) {
    this.aliases.lookup = 'this.lookup';

    return 'lookup(depths, "' + name + '")';
  },

  compilerInfo: function() {
    var revision = COMPILER_REVISION,
        versions = REVISION_CHANGES[revision];
    return [revision, versions];
  },

  appendToBuffer: function(string) {
    if (this.environment.isSimple) {
      return "return " + string + ";";
    } else {
      return {
        appendToBuffer: true,
        content: string,
        toString: function() { return "buffer += " + string + ";"; }
      };
    }
  },

  initializeBuffer: function() {
    return this.quotedString("");
  },

  namespace: "Handlebars",
  // END PUBLIC API

  compile: function(environment, options, context, asObject) {
    this.environment = environment;
    this.options = options;
    this.stringParams = this.options.stringParams;
    this.trackIds = this.options.trackIds;
    this.precompile = !asObject;

    this.name = this.environment.name;
    this.isChild = !!context;
    this.context = context || {
      programs: [],
      environments: []
    };

    this.preamble();

    this.stackSlot = 0;
    this.stackVars = [];
    this.aliases = {};
    this.registers = { list: [] };
    this.hashes = [];
    this.compileStack = [];
    this.inlineStack = [];

    this.compileChildren(environment, options);

    this.useDepths = this.useDepths || environment.depths.list.length || this.options.compat;

    var opcodes = environment.opcodes,
        opcode,
        i,
        l;

    for (i = 0, l = opcodes.length; i < l; i++) {
      opcode = opcodes[i];

      this[opcode.opcode].apply(this, opcode.args);
    }

    // Flush any trailing content that might be pending.
    this.pushSource('');

    /* istanbul ignore next */
    if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
      throw new Exception('Compile completed with content left on stack');
    }

    var fn = this.createFunctionContext(asObject);
    if (!this.isChild) {
      var ret = {
        compiler: this.compilerInfo(),
        main: fn
      };
      var programs = this.context.programs;
      for (i = 0, l = programs.length; i < l; i++) {
        if (programs[i]) {
          ret[i] = programs[i];
        }
      }

      if (this.environment.usePartial) {
        ret.usePartial = true;
      }
      if (this.options.data) {
        ret.useData = true;
      }
      if (this.useDepths) {
        ret.useDepths = true;
      }
      if (this.options.compat) {
        ret.compat = true;
      }

      if (!asObject) {
        ret.compiler = JSON.stringify(ret.compiler);
        ret = this.objectLiteral(ret);
      }

      return ret;
    } else {
      return fn;
    }
  },

  preamble: function() {
    // track the last context pushed into place to allow skipping the
    // getContext opcode when it would be a noop
    this.lastContext = 0;
    this.source = [];
  },

  createFunctionContext: function(asObject) {
    var varDeclarations = '';

    var locals = this.stackVars.concat(this.registers.list);
    if(locals.length > 0) {
      varDeclarations += ", " + locals.join(", ");
    }

    // Generate minimizer alias mappings
    for (var alias in this.aliases) {
      if (this.aliases.hasOwnProperty(alias)) {
        varDeclarations += ', ' + alias + '=' + this.aliases[alias];
      }
    }

    var params = ["depth0", "helpers", "partials", "data"];

    if (this.useDepths) {
      params.push('depths');
    }

    // Perform a second pass over the output to merge content when possible
    var source = this.mergeSource(varDeclarations);

    if (asObject) {
      params.push(source);

      return Function.apply(this, params);
    } else {
      return 'function(' + params.join(',') + ') {\n  ' + source + '}';
    }
  },
  mergeSource: function(varDeclarations) {
    var source = '',
        buffer,
        appendOnly = !this.forceBuffer,
        appendFirst;

    for (var i = 0, len = this.source.length; i < len; i++) {
      var line = this.source[i];
      if (line.appendToBuffer) {
        if (buffer) {
          buffer = buffer + '\n    + ' + line.content;
        } else {
          buffer = line.content;
        }
      } else {
        if (buffer) {
          if (!source) {
            appendFirst = true;
            source = buffer + ';\n  ';
          } else {
            source += 'buffer += ' + buffer + ';\n  ';
          }
          buffer = undefined;
        }
        source += line + '\n  ';

        if (!this.environment.isSimple) {
          appendOnly = false;
        }
      }
    }

    if (appendOnly) {
      if (buffer || !source) {
        source += 'return ' + (buffer || '""') + ';\n';
      }
    } else {
      varDeclarations += ", buffer = " + (appendFirst ? '' : this.initializeBuffer());
      if (buffer) {
        source += 'return buffer + ' + buffer + ';\n';
      } else {
        source += 'return buffer;\n';
      }
    }

    if (varDeclarations) {
      source = 'var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n  ') + source;
    }

    return source;
  },

  // [blockValue]
  //
  // On stack, before: hash, inverse, program, value
  // On stack, after: return value of blockHelperMissing
  //
  // The purpose of this opcode is to take a block of the form
  // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
  // replace it on the stack with the result of properly
  // invoking blockHelperMissing.
  blockValue: function(name) {
    this.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

    var params = [this.contextName(0)];
    this.setupParams(name, 0, params);

    var blockName = this.popStack();
    params.splice(1, 0, blockName);

    this.push('blockHelperMissing.call(' + params.join(', ') + ')');
  },

  // [ambiguousBlockValue]
  //
  // On stack, before: hash, inverse, program, value
  // Compiler value, before: lastHelper=value of last found helper, if any
  // On stack, after, if no lastHelper: same as [blockValue]
  // On stack, after, if lastHelper: value
  ambiguousBlockValue: function() {
    this.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

    // We're being a bit cheeky and reusing the options value from the prior exec
    var params = [this.contextName(0)];
    this.setupParams('', 0, params, true);

    this.flushInline();

    var current = this.topStack();
    params.splice(1, 0, current);

    this.pushSource("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
  },

  // [appendContent]
  //
  // On stack, before: ...
  // On stack, after: ...
  //
  // Appends the string value of `content` to the current buffer
  appendContent: function(content) {
    if (this.pendingContent) {
      content = this.pendingContent + content;
    }

    this.pendingContent = content;
  },

  // [append]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Coerces `value` to a String and appends it to the current buffer.
  //
  // If `value` is truthy, or 0, it is coerced into a string and appended
  // Otherwise, the empty string is appended
  append: function() {
    // Force anything that is inlined onto the stack so we don't have duplication
    // when we examine local
    this.flushInline();
    var local = this.popStack();
    this.pushSource('if (' + local + ' != null) { ' + this.appendToBuffer(local) + ' }');
    if (this.environment.isSimple) {
      this.pushSource("else { " + this.appendToBuffer("''") + " }");
    }
  },

  // [appendEscaped]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Escape `value` and append it to the buffer
  appendEscaped: function() {
    this.aliases.escapeExpression = 'this.escapeExpression';

    this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
  },

  // [getContext]
  //
  // On stack, before: ...
  // On stack, after: ...
  // Compiler value, after: lastContext=depth
  //
  // Set the value of the `lastContext` compiler value to the depth
  getContext: function(depth) {
    this.lastContext = depth;
  },

  // [pushContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext, ...
  //
  // Pushes the value of the current context onto the stack.
  pushContext: function() {
    this.pushStackLiteral(this.contextName(this.lastContext));
  },

  // [lookupOnContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext[name], ...
  //
  // Looks up the value of `name` on the current context and pushes
  // it onto the stack.
  lookupOnContext: function(parts, falsy, scoped) {
    /*jshint -W083 */
    var i = 0,
        len = parts.length;

    if (!scoped && this.options.compat && !this.lastContext) {
      // The depthed query is expected to handle the undefined logic for the root level that
      // is implemented below, so we evaluate that directly in compat mode
      this.push(this.depthedLookup(parts[i++]));
    } else {
      this.pushContext();
    }

    for (; i < len; i++) {
      this.replaceStack(function(current) {
        var lookup = this.nameLookup(current, parts[i], 'context');
        // We want to ensure that zero and false are handled properly if the context (falsy flag)
        // needs to have the special handling for these values.
        if (!falsy) {
          return ' != null ? ' + lookup + ' : ' + current;
        } else {
          // Otherwise we can use generic falsy handling
          return ' && ' + lookup;
        }
      });
    }
  },

  // [lookupData]
  //
  // On stack, before: ...
  // On stack, after: data, ...
  //
  // Push the data lookup operator
  lookupData: function(depth, parts) {
    /*jshint -W083 */
    if (!depth) {
      this.pushStackLiteral('data');
    } else {
      this.pushStackLiteral('this.data(data, ' + depth + ')');
    }

    var len = parts.length;
    for (var i = 0; i < len; i++) {
      this.replaceStack(function(current) {
        return ' && ' + this.nameLookup(current, parts[i], 'data');
      });
    }
  },

  // [resolvePossibleLambda]
  //
  // On stack, before: value, ...
  // On stack, after: resolved value, ...
  //
  // If the `value` is a lambda, replace it on the stack by
  // the return value of the lambda
  resolvePossibleLambda: function() {
    this.aliases.lambda = 'this.lambda';

    this.push('lambda(' + this.popStack() + ', ' + this.contextName(0) + ')');
  },

  // [pushStringParam]
  //
  // On stack, before: ...
  // On stack, after: string, currentContext, ...
  //
  // This opcode is designed for use in string mode, which
  // provides the string value of a parameter along with its
  // depth rather than resolving it immediately.
  pushStringParam: function(string, type) {
    this.pushContext();
    this.pushString(type);

    // If it's a subexpression, the string result
    // will be pushed after this opcode.
    if (type !== 'sexpr') {
      if (typeof string === 'string') {
        this.pushString(string);
      } else {
        this.pushStackLiteral(string);
      }
    }
  },

  emptyHash: function() {
    this.pushStackLiteral('{}');

    if (this.trackIds) {
      this.push('{}'); // hashIds
    }
    if (this.stringParams) {
      this.push('{}'); // hashContexts
      this.push('{}'); // hashTypes
    }
  },
  pushHash: function() {
    if (this.hash) {
      this.hashes.push(this.hash);
    }
    this.hash = {values: [], types: [], contexts: [], ids: []};
  },
  popHash: function() {
    var hash = this.hash;
    this.hash = this.hashes.pop();

    if (this.trackIds) {
      this.push('{' + hash.ids.join(',') + '}');
    }
    if (this.stringParams) {
      this.push('{' + hash.contexts.join(',') + '}');
      this.push('{' + hash.types.join(',') + '}');
    }

    this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
  },

  // [pushString]
  //
  // On stack, before: ...
  // On stack, after: quotedString(string), ...
  //
  // Push a quoted version of `string` onto the stack
  pushString: function(string) {
    this.pushStackLiteral(this.quotedString(string));
  },

  // [push]
  //
  // On stack, before: ...
  // On stack, after: expr, ...
  //
  // Push an expression onto the stack
  push: function(expr) {
    this.inlineStack.push(expr);
    return expr;
  },

  // [pushLiteral]
  //
  // On stack, before: ...
  // On stack, after: value, ...
  //
  // Pushes a value onto the stack. This operation prevents
  // the compiler from creating a temporary variable to hold
  // it.
  pushLiteral: function(value) {
    this.pushStackLiteral(value);
  },

  // [pushProgram]
  //
  // On stack, before: ...
  // On stack, after: program(guid), ...
  //
  // Push a program expression onto the stack. This takes
  // a compile-time guid and converts it into a runtime-accessible
  // expression.
  pushProgram: function(guid) {
    if (guid != null) {
      this.pushStackLiteral(this.programExpression(guid));
    } else {
      this.pushStackLiteral(null);
    }
  },

  // [invokeHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // Pops off the helper's parameters, invokes the helper,
  // and pushes the helper's return value onto the stack.
  //
  // If the helper is not found, `helperMissing` is called.
  invokeHelper: function(paramSize, name, isSimple) {
    this.aliases.helperMissing = 'helpers.helperMissing';

    var nonHelper = this.popStack();
    var helper = this.setupHelper(paramSize, name);

    var lookup = (isSimple ? helper.name + ' || ' : '') + nonHelper + ' || helperMissing';
    this.push('((' + lookup + ').call(' + helper.callParams + '))');
  },

  // [invokeKnownHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // This operation is used when the helper is known to exist,
  // so a `helperMissing` fallback is not required.
  invokeKnownHelper: function(paramSize, name) {
    var helper = this.setupHelper(paramSize, name);
    this.push(helper.name + ".call(" + helper.callParams + ")");
  },

  // [invokeAmbiguous]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of disambiguation
  //
  // This operation is used when an expression like `{{foo}}`
  // is provided, but we don't know at compile-time whether it
  // is a helper or a path.
  //
  // This operation emits more code than the other options,
  // and can be avoided by passing the `knownHelpers` and
  // `knownHelpersOnly` flags at compile-time.
  invokeAmbiguous: function(name, helperCall) {
    this.aliases.functionType = '"function"';
    this.aliases.helperMissing = 'helpers.helperMissing';
    this.useRegister('helper');

    var nonHelper = this.popStack();

    this.emptyHash();
    var helper = this.setupHelper(0, name, helperCall);

    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

    this.push(
      '((helper = (helper = ' + helperName + ' || ' + nonHelper + ') != null ? helper : helperMissing'
        + (helper.paramsInit ? '),(' + helper.paramsInit : '') + '),'
      + '(typeof helper === functionType ? helper.call(' + helper.callParams + ') : helper))');
  },

  // [invokePartial]
  //
  // On stack, before: context, ...
  // On stack after: result of partial invocation
  //
  // This operation pops off a context, invokes a partial with that context,
  // and pushes the result of the invocation back.
  invokePartial: function(name, indent) {
    var params = [this.nameLookup('partials', name, 'partial'), "'" + indent + "'", "'" + name + "'", this.popStack(), this.popStack(), "helpers", "partials"];

    if (this.options.data) {
      params.push("data");
    } else if (this.options.compat) {
      params.push('undefined');
    }
    if (this.options.compat) {
      params.push('depths');
    }

    this.push("this.invokePartial(" + params.join(", ") + ")");
  },

  // [assignToHash]
  //
  // On stack, before: value, ..., hash, ...
  // On stack, after: ..., hash, ...
  //
  // Pops a value off the stack and assigns it to the current hash
  assignToHash: function(key) {
    var value = this.popStack(),
        context,
        type,
        id;

    if (this.trackIds) {
      id = this.popStack();
    }
    if (this.stringParams) {
      type = this.popStack();
      context = this.popStack();
    }

    var hash = this.hash;
    if (context) {
      hash.contexts.push("'" + key + "': " + context);
    }
    if (type) {
      hash.types.push("'" + key + "': " + type);
    }
    if (id) {
      hash.ids.push("'" + key + "': " + id);
    }
    hash.values.push("'" + key + "': (" + value + ")");
  },

  pushId: function(type, name) {
    if (type === 'ID' || type === 'DATA') {
      this.pushString(name);
    } else if (type === 'sexpr') {
      this.pushStackLiteral('true');
    } else {
      this.pushStackLiteral('null');
    }
  },

  // HELPERS

  compiler: JavaScriptCompiler,

  compileChildren: function(environment, options) {
    var children = environment.children, child, compiler;

    for(var i=0, l=children.length; i<l; i++) {
      child = children[i];
      compiler = new this.compiler();

      var index = this.matchExistingProgram(child);

      if (index == null) {
        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
        this.context.environments[index] = child;

        this.useDepths = this.useDepths || compiler.useDepths;
      } else {
        child.index = index;
        child.name = 'program' + index;
      }
    }
  },
  matchExistingProgram: function(child) {
    for (var i = 0, len = this.context.environments.length; i < len; i++) {
      var environment = this.context.environments[i];
      if (environment && environment.equals(child)) {
        return i;
      }
    }
  },

  programExpression: function(guid) {
    var child = this.environment.children[guid],
        depths = child.depths.list,
        useDepths = this.useDepths,
        depth;

    var programParams = [child.index, 'data'];

    if (useDepths) {
      programParams.push('depths');
    }

    return 'this.program(' + programParams.join(', ') + ')';
  },

  useRegister: function(name) {
    if(!this.registers[name]) {
      this.registers[name] = true;
      this.registers.list.push(name);
    }
  },

  pushStackLiteral: function(item) {
    return this.push(new Literal(item));
  },

  pushSource: function(source) {
    if (this.pendingContent) {
      this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent)));
      this.pendingContent = undefined;
    }

    if (source) {
      this.source.push(source);
    }
  },

  pushStack: function(item) {
    this.flushInline();

    var stack = this.incrStack();
    this.pushSource(stack + " = " + item + ";");
    this.compileStack.push(stack);
    return stack;
  },

  replaceStack: function(callback) {
    var prefix = '',
        inline = this.isInline(),
        stack,
        createdStack,
        usedLiteral;

    /* istanbul ignore next */
    if (!this.isInline()) {
      throw new Exception('replaceStack on non-inline');
    }

    // We want to merge the inline statement into the replacement statement via ','
    var top = this.popStack(true);

    if (top instanceof Literal) {
      // Literals do not need to be inlined
      prefix = stack = top.value;
      usedLiteral = true;
    } else {
      // Get or create the current stack name for use by the inline
      createdStack = !this.stackSlot;
      var name = !createdStack ? this.topStackName() : this.incrStack();

      prefix = '(' + this.push(name) + ' = ' + top + ')';
      stack = this.topStack();
    }

    var item = callback.call(this, stack);

    if (!usedLiteral) {
      this.popStack();
    }
    if (createdStack) {
      this.stackSlot--;
    }
    this.push('(' + prefix + item + ')');
  },

  incrStack: function() {
    this.stackSlot++;
    if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
    return this.topStackName();
  },
  topStackName: function() {
    return "stack" + this.stackSlot;
  },
  flushInline: function() {
    var inlineStack = this.inlineStack;
    if (inlineStack.length) {
      this.inlineStack = [];
      for (var i = 0, len = inlineStack.length; i < len; i++) {
        var entry = inlineStack[i];
        if (entry instanceof Literal) {
          this.compileStack.push(entry);
        } else {
          this.pushStack(entry);
        }
      }
    }
  },
  isInline: function() {
    return this.inlineStack.length;
  },

  popStack: function(wrapped) {
    var inline = this.isInline(),
        item = (inline ? this.inlineStack : this.compileStack).pop();

    if (!wrapped && (item instanceof Literal)) {
      return item.value;
    } else {
      if (!inline) {
        /* istanbul ignore next */
        if (!this.stackSlot) {
          throw new Exception('Invalid stack pop');
        }
        this.stackSlot--;
      }
      return item;
    }
  },

  topStack: function() {
    var stack = (this.isInline() ? this.inlineStack : this.compileStack),
        item = stack[stack.length - 1];

    if (item instanceof Literal) {
      return item.value;
    } else {
      return item;
    }
  },

  contextName: function(context) {
    if (this.useDepths && context) {
      return 'depths[' + context + ']';
    } else {
      return 'depth' + context;
    }
  },

  quotedString: function(str) {
    return '"' + str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
      .replace(/\u2029/g, '\\u2029') + '"';
  },

  objectLiteral: function(obj) {
    var pairs = [];

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        pairs.push(this.quotedString(key) + ':' + obj[key]);
      }
    }

    return '{' + pairs.join(',') + '}';
  },

  setupHelper: function(paramSize, name, blockHelper) {
    var params = [],
        paramsInit = this.setupParams(name, paramSize, params, blockHelper);
    var foundHelper = this.nameLookup('helpers', name, 'helper');

    return {
      params: params,
      paramsInit: paramsInit,
      name: foundHelper,
      callParams: [this.contextName(0)].concat(params).join(", ")
    };
  },

  setupOptions: function(helper, paramSize, params) {
    var options = {}, contexts = [], types = [], ids = [], param, inverse, program;

    options.name = this.quotedString(helper);
    options.hash = this.popStack();

    if (this.trackIds) {
      options.hashIds = this.popStack();
    }
    if (this.stringParams) {
      options.hashTypes = this.popStack();
      options.hashContexts = this.popStack();
    }

    inverse = this.popStack();
    program = this.popStack();

    // Avoid setting fn and inverse if neither are set. This allows
    // helpers to do a check for `if (options.fn)`
    if (program || inverse) {
      if (!program) {
        program = 'this.noop';
      }

      if (!inverse) {
        inverse = 'this.noop';
      }

      options.fn = program;
      options.inverse = inverse;
    }

    // The parameters go on to the stack in order (making sure that they are evaluated in order)
    // so we need to pop them off the stack in reverse order
    var i = paramSize;
    while (i--) {
      param = this.popStack();
      params[i] = param;

      if (this.trackIds) {
        ids[i] = this.popStack();
      }
      if (this.stringParams) {
        types[i] = this.popStack();
        contexts[i] = this.popStack();
      }
    }

    if (this.trackIds) {
      options.ids = "[" + ids.join(",") + "]";
    }
    if (this.stringParams) {
      options.types = "[" + types.join(",") + "]";
      options.contexts = "[" + contexts.join(",") + "]";
    }

    if (this.options.data) {
      options.data = "data";
    }

    return options;
  },

  // the params and contexts arguments are passed in arrays
  // to fill in
  setupParams: function(helperName, paramSize, params, useRegister) {
    var options = this.objectLiteral(this.setupOptions(helperName, paramSize, params));

    if (useRegister) {
      this.useRegister('options');
      params.push('options');
      return 'options=' + options;
    } else {
      params.push(options);
      return '';
    }
  }
};

var reservedWords = (
  "break else new var" +
  " case finally return void" +
  " catch for switch while" +
  " continue function this with" +
  " default if throw" +
  " delete in try" +
  " do instanceof typeof" +
  " abstract enum int short" +
  " boolean export interface static" +
  " byte extends long super" +
  " char final native synchronized" +
  " class float package throws" +
  " const goto private transient" +
  " debugger implements protected volatile" +
  " double import public let yield"
).split(" ");

var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

for(var i=0, l=reservedWords.length; i<l; i++) {
  compilerWords[reservedWords[i]] = true;
}

JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
  return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
};

exports["default"] = JavaScriptCompiler;
},{"../base":46,"../exception":55}],52:[function(require,module,exports){
"use strict";
/* jshint ignore:start */
/* istanbul ignore next */
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"program_repetition0":6,"statement":7,"mustache":8,"block":9,"rawBlock":10,"partial":11,"CONTENT":12,"COMMENT":13,"openRawBlock":14,"END_RAW_BLOCK":15,"OPEN_RAW_BLOCK":16,"sexpr":17,"CLOSE_RAW_BLOCK":18,"openBlock":19,"block_option0":20,"closeBlock":21,"openInverse":22,"block_option1":23,"OPEN_BLOCK":24,"CLOSE":25,"OPEN_INVERSE":26,"inverseAndProgram":27,"INVERSE":28,"OPEN_ENDBLOCK":29,"path":30,"OPEN":31,"OPEN_UNESCAPED":32,"CLOSE_UNESCAPED":33,"OPEN_PARTIAL":34,"partialName":35,"param":36,"partial_option0":37,"partial_option1":38,"sexpr_repetition0":39,"sexpr_option0":40,"dataName":41,"STRING":42,"NUMBER":43,"BOOLEAN":44,"OPEN_SEXPR":45,"CLOSE_SEXPR":46,"hash":47,"hash_repetition_plus0":48,"hashSegment":49,"ID":50,"EQUALS":51,"DATA":52,"pathSegments":53,"SEP":54,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",12:"CONTENT",13:"COMMENT",15:"END_RAW_BLOCK",16:"OPEN_RAW_BLOCK",18:"CLOSE_RAW_BLOCK",24:"OPEN_BLOCK",25:"CLOSE",26:"OPEN_INVERSE",28:"INVERSE",29:"OPEN_ENDBLOCK",31:"OPEN",32:"OPEN_UNESCAPED",33:"CLOSE_UNESCAPED",34:"OPEN_PARTIAL",42:"STRING",43:"NUMBER",44:"BOOLEAN",45:"OPEN_SEXPR",46:"CLOSE_SEXPR",50:"ID",51:"EQUALS",52:"DATA",54:"SEP"},
productions_: [0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[10,3],[14,3],[9,4],[9,4],[19,3],[22,3],[27,2],[21,3],[8,3],[8,3],[11,5],[11,4],[17,3],[17,1],[36,1],[36,1],[36,1],[36,1],[36,1],[36,3],[47,1],[49,3],[35,1],[35,1],[35,1],[41,2],[30,1],[53,3],[53,1],[6,0],[6,2],[20,0],[20,1],[23,0],[23,1],[37,0],[37,1],[38,0],[38,1],[39,0],[39,2],[40,0],[40,1],[48,1],[48,2]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: yy.prepareProgram($$[$0-1].statements, true); return $$[$0-1]; 
break;
case 2:this.$ = new yy.ProgramNode(yy.prepareProgram($$[$0]), {}, this._$);
break;
case 3:this.$ = $$[$0];
break;
case 4:this.$ = $$[$0];
break;
case 5:this.$ = $$[$0];
break;
case 6:this.$ = $$[$0];
break;
case 7:this.$ = new yy.ContentNode($$[$0], this._$);
break;
case 8:this.$ = new yy.CommentNode($$[$0], this._$);
break;
case 9:this.$ = new yy.RawBlockNode($$[$0-2], $$[$0-1], $$[$0], this._$);
break;
case 10:this.$ = new yy.MustacheNode($$[$0-1], null, '', '', this._$);
break;
case 11:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], false, this._$);
break;
case 12:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], true, this._$);
break;
case 13:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
break;
case 14:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
break;
case 15:this.$ = { strip: yy.stripFlags($$[$0-1], $$[$0-1]), program: $$[$0] };
break;
case 16:this.$ = {path: $$[$0-1], strip: yy.stripFlags($$[$0-2], $$[$0])};
break;
case 17:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
break;
case 18:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
break;
case 19:this.$ = new yy.PartialNode($$[$0-3], $$[$0-2], $$[$0-1], yy.stripFlags($$[$0-4], $$[$0]), this._$);
break;
case 20:this.$ = new yy.PartialNode($$[$0-2], undefined, $$[$0-1], yy.stripFlags($$[$0-3], $$[$0]), this._$);
break;
case 21:this.$ = new yy.SexprNode([$$[$0-2]].concat($$[$0-1]), $$[$0], this._$);
break;
case 22:this.$ = new yy.SexprNode([$$[$0]], null, this._$);
break;
case 23:this.$ = $$[$0];
break;
case 24:this.$ = new yy.StringNode($$[$0], this._$);
break;
case 25:this.$ = new yy.NumberNode($$[$0], this._$);
break;
case 26:this.$ = new yy.BooleanNode($$[$0], this._$);
break;
case 27:this.$ = $$[$0];
break;
case 28:$$[$0-1].isHelper = true; this.$ = $$[$0-1];
break;
case 29:this.$ = new yy.HashNode($$[$0], this._$);
break;
case 30:this.$ = [$$[$0-2], $$[$0]];
break;
case 31:this.$ = new yy.PartialNameNode($$[$0], this._$);
break;
case 32:this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0], this._$), this._$);
break;
case 33:this.$ = new yy.PartialNameNode(new yy.NumberNode($$[$0], this._$));
break;
case 34:this.$ = new yy.DataNode($$[$0], this._$);
break;
case 35:this.$ = new yy.IdNode($$[$0], this._$);
break;
case 36: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2]; 
break;
case 37:this.$ = [{part: $$[$0]}];
break;
case 38:this.$ = [];
break;
case 39:$$[$0-1].push($$[$0]);
break;
case 48:this.$ = [];
break;
case 49:$$[$0-1].push($$[$0]);
break;
case 52:this.$ = [$$[$0]];
break;
case 53:$$[$0-1].push($$[$0]);
break;
}
},
table: [{3:1,4:2,5:[2,38],6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],31:[2,38],32:[2,38],34:[2,38]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:[1,10],13:[1,11],14:16,16:[1,20],19:14,22:15,24:[1,18],26:[1,19],28:[2,2],29:[2,2],31:[1,12],32:[1,13],34:[1,17]},{1:[2,1]},{5:[2,39],12:[2,39],13:[2,39],16:[2,39],24:[2,39],26:[2,39],28:[2,39],29:[2,39],31:[2,39],32:[2,39],34:[2,39]},{5:[2,3],12:[2,3],13:[2,3],16:[2,3],24:[2,3],26:[2,3],28:[2,3],29:[2,3],31:[2,3],32:[2,3],34:[2,3]},{5:[2,4],12:[2,4],13:[2,4],16:[2,4],24:[2,4],26:[2,4],28:[2,4],29:[2,4],31:[2,4],32:[2,4],34:[2,4]},{5:[2,5],12:[2,5],13:[2,5],16:[2,5],24:[2,5],26:[2,5],28:[2,5],29:[2,5],31:[2,5],32:[2,5],34:[2,5]},{5:[2,6],12:[2,6],13:[2,6],16:[2,6],24:[2,6],26:[2,6],28:[2,6],29:[2,6],31:[2,6],32:[2,6],34:[2,6]},{5:[2,7],12:[2,7],13:[2,7],16:[2,7],24:[2,7],26:[2,7],28:[2,7],29:[2,7],31:[2,7],32:[2,7],34:[2,7]},{5:[2,8],12:[2,8],13:[2,8],16:[2,8],24:[2,8],26:[2,8],28:[2,8],29:[2,8],31:[2,8],32:[2,8],34:[2,8]},{17:21,30:22,41:23,50:[1,26],52:[1,25],53:24},{17:27,30:22,41:23,50:[1,26],52:[1,25],53:24},{4:28,6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],28:[2,38],29:[2,38],31:[2,38],32:[2,38],34:[2,38]},{4:29,6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],28:[2,38],29:[2,38],31:[2,38],32:[2,38],34:[2,38]},{12:[1,30]},{30:32,35:31,42:[1,33],43:[1,34],50:[1,26],53:24},{17:35,30:22,41:23,50:[1,26],52:[1,25],53:24},{17:36,30:22,41:23,50:[1,26],52:[1,25],53:24},{17:37,30:22,41:23,50:[1,26],52:[1,25],53:24},{25:[1,38]},{18:[2,48],25:[2,48],33:[2,48],39:39,42:[2,48],43:[2,48],44:[2,48],45:[2,48],46:[2,48],50:[2,48],52:[2,48]},{18:[2,22],25:[2,22],33:[2,22],46:[2,22]},{18:[2,35],25:[2,35],33:[2,35],42:[2,35],43:[2,35],44:[2,35],45:[2,35],46:[2,35],50:[2,35],52:[2,35],54:[1,40]},{30:41,50:[1,26],53:24},{18:[2,37],25:[2,37],33:[2,37],42:[2,37],43:[2,37],44:[2,37],45:[2,37],46:[2,37],50:[2,37],52:[2,37],54:[2,37]},{33:[1,42]},{20:43,27:44,28:[1,45],29:[2,40]},{23:46,27:47,28:[1,45],29:[2,42]},{15:[1,48]},{25:[2,46],30:51,36:49,38:50,41:55,42:[1,52],43:[1,53],44:[1,54],45:[1,56],47:57,48:58,49:60,50:[1,59],52:[1,25],53:24},{25:[2,31],42:[2,31],43:[2,31],44:[2,31],45:[2,31],50:[2,31],52:[2,31]},{25:[2,32],42:[2,32],43:[2,32],44:[2,32],45:[2,32],50:[2,32],52:[2,32]},{25:[2,33],42:[2,33],43:[2,33],44:[2,33],45:[2,33],50:[2,33],52:[2,33]},{25:[1,61]},{25:[1,62]},{18:[1,63]},{5:[2,17],12:[2,17],13:[2,17],16:[2,17],24:[2,17],26:[2,17],28:[2,17],29:[2,17],31:[2,17],32:[2,17],34:[2,17]},{18:[2,50],25:[2,50],30:51,33:[2,50],36:65,40:64,41:55,42:[1,52],43:[1,53],44:[1,54],45:[1,56],46:[2,50],47:66,48:58,49:60,50:[1,59],52:[1,25],53:24},{50:[1,67]},{18:[2,34],25:[2,34],33:[2,34],42:[2,34],43:[2,34],44:[2,34],45:[2,34],46:[2,34],50:[2,34],52:[2,34]},{5:[2,18],12:[2,18],13:[2,18],16:[2,18],24:[2,18],26:[2,18],28:[2,18],29:[2,18],31:[2,18],32:[2,18],34:[2,18]},{21:68,29:[1,69]},{29:[2,41]},{4:70,6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],29:[2,38],31:[2,38],32:[2,38],34:[2,38]},{21:71,29:[1,69]},{29:[2,43]},{5:[2,9],12:[2,9],13:[2,9],16:[2,9],24:[2,9],26:[2,9],28:[2,9],29:[2,9],31:[2,9],32:[2,9],34:[2,9]},{25:[2,44],37:72,47:73,48:58,49:60,50:[1,74]},{25:[1,75]},{18:[2,23],25:[2,23],33:[2,23],42:[2,23],43:[2,23],44:[2,23],45:[2,23],46:[2,23],50:[2,23],52:[2,23]},{18:[2,24],25:[2,24],33:[2,24],42:[2,24],43:[2,24],44:[2,24],45:[2,24],46:[2,24],50:[2,24],52:[2,24]},{18:[2,25],25:[2,25],33:[2,25],42:[2,25],43:[2,25],44:[2,25],45:[2,25],46:[2,25],50:[2,25],52:[2,25]},{18:[2,26],25:[2,26],33:[2,26],42:[2,26],43:[2,26],44:[2,26],45:[2,26],46:[2,26],50:[2,26],52:[2,26]},{18:[2,27],25:[2,27],33:[2,27],42:[2,27],43:[2,27],44:[2,27],45:[2,27],46:[2,27],50:[2,27],52:[2,27]},{17:76,30:22,41:23,50:[1,26],52:[1,25],53:24},{25:[2,47]},{18:[2,29],25:[2,29],33:[2,29],46:[2,29],49:77,50:[1,74]},{18:[2,37],25:[2,37],33:[2,37],42:[2,37],43:[2,37],44:[2,37],45:[2,37],46:[2,37],50:[2,37],51:[1,78],52:[2,37],54:[2,37]},{18:[2,52],25:[2,52],33:[2,52],46:[2,52],50:[2,52]},{12:[2,13],13:[2,13],16:[2,13],24:[2,13],26:[2,13],28:[2,13],29:[2,13],31:[2,13],32:[2,13],34:[2,13]},{12:[2,14],13:[2,14],16:[2,14],24:[2,14],26:[2,14],28:[2,14],29:[2,14],31:[2,14],32:[2,14],34:[2,14]},{12:[2,10]},{18:[2,21],25:[2,21],33:[2,21],46:[2,21]},{18:[2,49],25:[2,49],33:[2,49],42:[2,49],43:[2,49],44:[2,49],45:[2,49],46:[2,49],50:[2,49],52:[2,49]},{18:[2,51],25:[2,51],33:[2,51],46:[2,51]},{18:[2,36],25:[2,36],33:[2,36],42:[2,36],43:[2,36],44:[2,36],45:[2,36],46:[2,36],50:[2,36],52:[2,36],54:[2,36]},{5:[2,11],12:[2,11],13:[2,11],16:[2,11],24:[2,11],26:[2,11],28:[2,11],29:[2,11],31:[2,11],32:[2,11],34:[2,11]},{30:79,50:[1,26],53:24},{29:[2,15]},{5:[2,12],12:[2,12],13:[2,12],16:[2,12],24:[2,12],26:[2,12],28:[2,12],29:[2,12],31:[2,12],32:[2,12],34:[2,12]},{25:[1,80]},{25:[2,45]},{51:[1,78]},{5:[2,20],12:[2,20],13:[2,20],16:[2,20],24:[2,20],26:[2,20],28:[2,20],29:[2,20],31:[2,20],32:[2,20],34:[2,20]},{46:[1,81]},{18:[2,53],25:[2,53],33:[2,53],46:[2,53],50:[2,53]},{30:51,36:82,41:55,42:[1,52],43:[1,53],44:[1,54],45:[1,56],50:[1,26],52:[1,25],53:24},{25:[1,83]},{5:[2,19],12:[2,19],13:[2,19],16:[2,19],24:[2,19],26:[2,19],28:[2,19],29:[2,19],31:[2,19],32:[2,19],34:[2,19]},{18:[2,28],25:[2,28],33:[2,28],42:[2,28],43:[2,28],44:[2,28],45:[2,28],46:[2,28],50:[2,28],52:[2,28]},{18:[2,30],25:[2,30],33:[2,30],46:[2,30],50:[2,30]},{5:[2,16],12:[2,16],13:[2,16],16:[2,16],24:[2,16],26:[2,16],28:[2,16],29:[2,16],31:[2,16],32:[2,16],34:[2,16]}],
defaultActions: {4:[2,1],44:[2,41],47:[2,43],57:[2,47],63:[2,10],70:[2,15],73:[2,45]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {


function strip(start, end) {
  return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
}


var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-2) === "\\\\") {
                                     strip(0,1);
                                     this.begin("mu");
                                   } else if(yy_.yytext.slice(-1) === "\\") {
                                     strip(0,1);
                                     this.begin("emu");
                                   } else {
                                     this.begin("mu");
                                   }
                                   if(yy_.yytext) return 12;
                                 
break;
case 1:return 12;
break;
case 2:
                                   this.popState();
                                   return 12;
                                 
break;
case 3:
                                  yy_.yytext = yy_.yytext.substr(5, yy_.yyleng-9);
                                  this.popState();
                                  return 15;
                                 
break;
case 4: return 12; 
break;
case 5:strip(0,4); this.popState(); return 13;
break;
case 6:return 45;
break;
case 7:return 46;
break;
case 8: return 16; 
break;
case 9:
                                  this.popState();
                                  this.begin('raw');
                                  return 18;
                                 
break;
case 10:return 34;
break;
case 11:return 24;
break;
case 12:return 29;
break;
case 13:this.popState(); return 28;
break;
case 14:this.popState(); return 28;
break;
case 15:return 26;
break;
case 16:return 26;
break;
case 17:return 32;
break;
case 18:return 31;
break;
case 19:this.popState(); this.begin('com');
break;
case 20:strip(3,5); this.popState(); return 13;
break;
case 21:return 31;
break;
case 22:return 51;
break;
case 23:return 50;
break;
case 24:return 50;
break;
case 25:return 54;
break;
case 26:// ignore whitespace
break;
case 27:this.popState(); return 33;
break;
case 28:this.popState(); return 25;
break;
case 29:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 42;
break;
case 30:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 42;
break;
case 31:return 52;
break;
case 32:return 44;
break;
case 33:return 44;
break;
case 34:return 43;
break;
case 35:return 50;
break;
case 36:yy_.yytext = strip(1,2); return 50;
break;
case 37:return 'INVALID';
break;
case 38:return 5;
break;
}
};
lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]*?(?=(\{\{\{\{\/)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
lexer.conditions = {"mu":{"rules":[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[5],"inclusive":false},"raw":{"rules":[3,4],"inclusive":false},"INITIAL":{"rules":[0,1,38],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();exports["default"] = handlebars;
/* jshint ignore:end */
},{}],53:[function(require,module,exports){
"use strict";
var Visitor = require("./visitor")["default"];

function print(ast) {
  return new PrintVisitor().accept(ast);
}

exports.print = print;function PrintVisitor() {
  this.padding = 0;
}

exports.PrintVisitor = PrintVisitor;PrintVisitor.prototype = new Visitor();

PrintVisitor.prototype.pad = function(string) {
  var out = "";

  for(var i=0,l=this.padding; i<l; i++) {
    out = out + "  ";
  }

  out = out + string + "\n";
  return out;
};

PrintVisitor.prototype.program = function(program) {
  var out = "",
      statements = program.statements,
      i, l;

  for(i=0, l=statements.length; i<l; i++) {
    out = out + this.accept(statements[i]);
  }

  this.padding--;

  return out;
};

PrintVisitor.prototype.block = function(block) {
  var out = "";

  out = out + this.pad("BLOCK:");
  this.padding++;
  out = out + this.accept(block.mustache);
  if (block.program) {
    out = out + this.pad("PROGRAM:");
    this.padding++;
    out = out + this.accept(block.program);
    this.padding--;
  }
  if (block.inverse) {
    if (block.program) { this.padding++; }
    out = out + this.pad("{{^}}");
    this.padding++;
    out = out + this.accept(block.inverse);
    this.padding--;
    if (block.program) { this.padding--; }
  }
  this.padding--;

  return out;
};

PrintVisitor.prototype.sexpr = function(sexpr) {
  var params = sexpr.params, paramStrings = [], hash;

  for(var i=0, l=params.length; i<l; i++) {
    paramStrings.push(this.accept(params[i]));
  }

  params = "[" + paramStrings.join(", ") + "]";

  hash = sexpr.hash ? " " + this.accept(sexpr.hash) : "";

  return this.accept(sexpr.id) + " " + params + hash;
};

PrintVisitor.prototype.mustache = function(mustache) {
  return this.pad("{{ " + this.accept(mustache.sexpr) + " }}");
};

PrintVisitor.prototype.partial = function(partial) {
  var content = this.accept(partial.partialName);
  if(partial.context) {
    content += " " + this.accept(partial.context);
  }
  if (partial.hash) {
    content += " " + this.accept(partial.hash);
  }
  return this.pad("{{> " + content + " }}");
};

PrintVisitor.prototype.hash = function(hash) {
  var pairs = hash.pairs;
  var joinedPairs = [], left, right;

  for(var i=0, l=pairs.length; i<l; i++) {
    left = pairs[i][0];
    right = this.accept(pairs[i][1]);
    joinedPairs.push( left + "=" + right );
  }

  return "HASH{" + joinedPairs.join(", ") + "}";
};

PrintVisitor.prototype.STRING = function(string) {
  return '"' + string.string + '"';
};

PrintVisitor.prototype.NUMBER = function(number) {
  return "NUMBER{" + number.number + "}";
};

PrintVisitor.prototype.BOOLEAN = function(bool) {
  return "BOOLEAN{" + bool.bool + "}";
};

PrintVisitor.prototype.ID = function(id) {
  var path = id.parts.join("/");
  if(id.parts.length > 1) {
    return "PATH:" + path;
  } else {
    return "ID:" + path;
  }
};

PrintVisitor.prototype.PARTIAL_NAME = function(partialName) {
    return "PARTIAL:" + partialName.name;
};

PrintVisitor.prototype.DATA = function(data) {
  return "@" + this.accept(data.id);
};

PrintVisitor.prototype.content = function(content) {
  return this.pad("CONTENT[ '" + content.string + "' ]");
};

PrintVisitor.prototype.comment = function(comment) {
  return this.pad("{{! '" + comment.comment + "' }}");
};
},{"./visitor":54}],54:[function(require,module,exports){
"use strict";
function Visitor() {}

Visitor.prototype = {
  constructor: Visitor,

  accept: function(object) {
    return this[object.type](object);
  }
};

exports["default"] = Visitor;
},{}],55:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],56:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;
var createFrame = require("./base").createFrame;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new Exception("No environment passed to template");
  }
  if (!templateSpec || !templateSpec.main) {
    throw new Exception('Unknown template object: ' + typeof templateSpec);
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  var invokePartialWrapper = function(partial, indent, name, context, hash, helpers, partials, data, depths) {
    if (hash) {
      context = Utils.extend({}, context, hash);
    }

    var result = env.VM.invokePartial.call(this, partial, name, context, helpers, partials, data, depths);

    if (result == null && env.compile) {
      var options = { helpers: helpers, partials: partials, data: data, depths: depths };
      partials[name] = env.compile(partial, { data: data !== undefined, compat: templateSpec.compat }, env);
      result = partials[name](context, options);
    }
    if (result != null) {
      if (indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    lookup: function(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function(i) {
      return templateSpec[i];
    },

    programs: [],
    program: function(i, data, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths) {
        programWrapper = program(this, i, fn, data, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(this, i, fn);
      }
      return programWrapper;
    },

    data: function(data, depth) {
      while (data && depth--) {
        data = data._parent;
      }
      return data;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = Utils.extend({}, common, param);
      }

      return ret;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  var ret = function(context, options) {
    options = options || {};
    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths;
    if (templateSpec.useDepths) {
      depths = options.depths ? [context].concat(options.depths) : [context];
    }

    return templateSpec.main.call(container, context, container.helpers, container.partials, data, depths);
  };
  ret.isTop = true;

  ret._setup = function(options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
    }
  };

  ret._child = function(i, data, depths) {
    if (templateSpec.useDepths && !depths) {
      throw new Exception('must pass parent depths');
    }

    return program(container, i, templateSpec[i], data, depths);
  };
  return ret;
}

exports.template = template;function program(container, i, fn, data, depths) {
  var prog = function(context, options) {
    options = options || {};

    return fn.call(container, context, container.helpers, container.partials, options.data || data, depths && [context].concat(depths));
  };
  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data, depths) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data, depths: depths };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? createFrame(data) : {};
    data.root = context;
  }
  return data;
}
},{"./base":46,"./exception":55,"./utils":58}],57:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],58:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
/* istanbul ignore next */
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (string == null) {
    return "";
  } else if (!string) {
    return string + '';
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}

exports.appendContextPath = appendContextPath;
},{"./safe-string":57}],59:[function(require,module,exports){
// USAGE:
// var handlebars = require('handlebars');

// var local = handlebars.create();

var handlebars = require('../dist/cjs/handlebars')["default"];

handlebars.Visitor = require('../dist/cjs/handlebars/compiler/visitor')["default"];

var printer = require('../dist/cjs/handlebars/compiler/printer');
handlebars.PrintVisitor = printer.PrintVisitor;
handlebars.print = printer.print;

module.exports = handlebars;

// Publish a Node.js require() handler for .handlebars and .hbs files
/* istanbul ignore else */
if (typeof require !== 'undefined' && require.extensions) {
  var extension = function(module, filename) {
    var fs = require("fs");
    var templateString = fs.readFileSync(filename, "utf8");
    module.exports = handlebars.compile(templateString);
  };
  require.extensions[".handlebars"] = extension;
  require.extensions[".hbs"] = extension;
}

},{"../dist/cjs/handlebars":44,"../dist/cjs/handlebars/compiler/printer":53,"../dist/cjs/handlebars/compiler/visitor":54,"fs":36}],60:[function(require,module,exports){
module.exports = Observable

function Observable(value) {
    var listeners = []
    value = value === undefined ? null : value

    observable.set = function (v) {
        value = v
        listeners.forEach(function (f) {
            f(v)
        })
    }

    return observable

    function observable(listener) {
        if (!listener) {
            return value
        }

        listeners.push(listener)

        return function remove() {
            listeners.splice(listeners.indexOf(listener), 1)
        }
    }
}

},{}],61:[function(require,module,exports){
"use strict";

module.exports = function (editor, presenter, view) {
  return {
    init: function () {
      // Prevent the default selection by the browser with shift keies.
      editor.on("mousedown", function (e) {
        if (e.shiftKey) {
          return false;
        }
      }).on("mousedown", ".textae-editor__type", function () {
        // Prevent a selection of a type by the double-click.
        return false;
      }).on("mousedown", ".textae-editor__body__text-box__paragraph-margin", function (e) {
        // Prevent a selection of a margin of a paragraph by the double-click.
        if (e.target.className === "textae-editor__body__text-box__paragraph-margin") return false;
      });

      // Bind user input event to handler
      editor.on("mouseup", ".textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity", presenter.event.editorSelected).on("mouseenter", ".textae-editor__entity", function (e) {
        view.hoverRelation.on($(this).attr("title"));
      }).on("mouseleave", ".textae-editor__entity", function (e) {
        view.hoverRelation.off($(this).attr("title"));
      });
    }
  };
};


},{}],62:[function(require,module,exports){
"use strict";

module.exports = function (rejects) {
  return rejects.reduce(function (result, reject) {
    return result || reject.hasError;
  }, false);
};


},{}],63:[function(require,module,exports){
"use strict";

module.exports = function (reject) {
  return {
    accept: [],
    reject: reject ? reject : []
  };
};


},{}],64:[function(require,module,exports){
"use strict";

var defaults = {
  "delimiter characters": [" ", ".", "!", "?", ",", ":", ";", "-", "/", "&", "(", ")", "{", "}", "[", "]", "+", "*", "\\", "\"", "'", "\n", "–"],
  "non-edge characters": [" ", "\n"]
};

module.exports = function () {
  var delimiterCharacters = [],
      blankCharacters = [],
      set = function (config) {
    var settings = _.extend({}, defaults, config);

    delimiterCharacters = settings["delimiter characters"];
    blankCharacters = settings["non-edge characters"];
    return config;
  },
      reset = _.partial(set, defaults),
      isDelimiter = function (char) {
    if (delimiterCharacters.indexOf("ANY") >= 0) {
      return 1;
    }
    return delimiterCharacters.indexOf(char) >= 0;
  },
      isBlankCharacter = function (char) {
    return blankCharacters.indexOf(char) >= 0;
  },
      removeBlankChractors = function (str) {
    blankCharacters.forEach(function (char) {
      str = str.replace(char, "");
    });
    return str;
  };

  return {
    reset: reset,
    set: set,
    isDelimiter: isDelimiter,
    isBlankCharacter: isBlankCharacter,
    removeBlankChractors: removeBlankChractors
  };
};


},{}],65:[function(require,module,exports){
"use strict";

module.exports = function (message, object) {
  // For debug
  if (object) {
    console.log("[command.invoke]", message, object);
  } else {
    console.log("[command.invoke]", message);
  }
};


},{}],66:[function(require,module,exports){
"use strict";

var updateSelection = function (model, modelType, newModel) {
  if (model.selectionModel[modelType]) {
    model.selectionModel[modelType].add(newModel.id);
  }
},
    commandLog = require("./commandLog"),
    createCommandImpl = function (removeCommand, model, modelType, isSelectable, newModel) {
  return {
    execute: function () {
      // Update model
      newModel = model.annotationData[modelType].add(newModel);

      // Update Selection
      if (isSelectable) updateSelection(model, modelType, newModel);

      // Set revert
      this.revert = _.partial(removeCommand, _.noop, model, modelType, newModel.id);

      commandLog("create a new " + modelType + ": ", newModel);

      return newModel;
    }
  };
},
    removeCommandImpl = function (createCommand, model, modelType, id) {
  return {
    execute: function () {
      // Update model
      var oloModel = model.annotationData[modelType].remove(id);

      if (oloModel) {
        // Set revert
        this.revert = _.partial(createCommand, _.noop, model, modelType, false, oloModel);
        commandLog("remove a " + modelType + ": ", oloModel);
      } else {
        // Do not revert unless an object was removed.
        this.revert = function () {
          return {
            execute: function () {}
          };
        };
        commandLog("already removed " + modelType + ": ", id);
      }
    } };
},
    createCommand = _.partial(createCommandImpl, removeCommandImpl),
    removeCommand = _.partial(removeCommandImpl, createCommandImpl),
    changeTypeCommand = function (model, modelType, id, newType) {
  return {
    execute: function () {
      var oldType = model.annotationData[modelType].get(id).type;

      // Update model
      var targetModel = model.annotationData[modelType].changeType(id, newType);

      // Set revert
      this.revert = _.partial(changeTypeCommand, model, modelType, id, oldType);

      commandLog("change type of a " + modelType + ". oldtype:" + oldType + " " + modelType + ":", targetModel);
    }
  };
},
    commandTemplate = {
  create: createCommand,
  remove: removeCommand,
  changeType: changeTypeCommand,
  debugLog: commandLog
};

module.exports = commandTemplate;


},{"./commandLog":65}],67:[function(require,module,exports){
"use strict";

var invokeCommand = require("./invokeCommand"),
    commandTemplate = require("./commandTemplate"),
    commandLog = require("./commandLog"),
    setRevertAndLog = (function () {
  var log = function (prefix, param) {
    commandLog(prefix + param.commandType + " a " + param.modelType + ": " + param.id);
  },
      doneLog = _.partial(log, ""),
      revertLog = _.partial(log, "revert "),
      RevertFunction = function (subCommands, logParam) {
    var toRevert = function (command) {
      return command.revert();
    },
        execute = function (command) {
      command.execute();
    },
        revertedCommand = {
      execute: function () {
        invokeCommand.invokeRevert(subCommands);
        revertLog(logParam);
      }
    };

    return function () {
      return revertedCommand;
    };
  },
      setRevert = function (modelType, command, commandType, id, subCommands) {
    var logParam = {
      modelType: modelType,
      commandType: commandType,
      id: id
    };

    command.revert = new RevertFunction(subCommands, logParam);
    return logParam;
  };

  return _.compose(doneLog, setRevert);
})(),
    executeCompositCommand = function (modelType, command, commandType, id, subCommands) {
  invokeCommand.invoke(subCommands);
  setRevertAndLog(modelType, command, commandType, id, subCommands);
};

module.exports = executeCompositCommand;


},{"./commandLog":65,"./commandTemplate":66,"./invokeCommand":70}],68:[function(require,module,exports){
"use strict";

// Get spans their stirng is same with the originSpan from sourceDoc.
var getSpansTheirStringIsSameWith = function (sourceDoc, originSpan) {
  var getNextStringIndex = String.prototype.indexOf.bind(sourceDoc, sourceDoc.substring(originSpan.begin, originSpan.end)),
      length = originSpan.end - originSpan.begin,
      findStrings = [],
      offset = 0;

  for (var index = getNextStringIndex(offset); index !== -1; index = getNextStringIndex(offset)) {
    findStrings.push({
      begin: index,
      end: index + length
    });

    offset = index + length;
  }

  return findStrings;
},


// The preceding charactor and the following of a word charactor are delimiter.
// For example, 't' ,a part of 'that', is not same with an origin span when it is 't'.
isWord = function (sourceDoc, detectBoundaryFunc, candidateSpan) {
  var precedingChar = sourceDoc.charAt(candidateSpan.begin - 1);
  var followingChar = sourceDoc.charAt(candidateSpan.end);

  return detectBoundaryFunc(precedingChar) && detectBoundaryFunc(followingChar);
},
    not = function (val) {
  return !val;
},
    isAlreadySpaned = require("../model/isAlreadySpaned"),
    isBoundaryCrossingWithOtherSpans = require("../model/isBoundaryCrossingWithOtherSpans");

// Check replications are word or not if spanConfig is set.
module.exports = function (dataStore, originSpan, detectBoundaryFunc) {
  var allSpans = dataStore.span.all(),
      wordFilter = detectBoundaryFunc ? _.partial(isWord, dataStore.sourceDoc, detectBoundaryFunc) : _.identity;

  return getSpansTheirStringIsSameWith(dataStore.sourceDoc, originSpan).filter(function (span) {
    // The candidateSpan is a same span when begin is same.
    // Because string of each others are same. End of them are same too.
    return span.begin !== originSpan.begin;
  }).filter(wordFilter).filter(_.compose(not, _.partial(isAlreadySpaned, allSpans))).filter(_.compose(not, _.partial(isBoundaryCrossingWithOtherSpans, allSpans)));
};


},{"../model/isAlreadySpaned":113,"../model/isBoundaryCrossingWithOtherSpans":114}],69:[function(require,module,exports){
"use strict";

var invokeCommand = require("./invokeCommand"),
    commandTemplate = require("./commandTemplate"),
    executeCompositCommand = require("./executeCompositCommand"),
    getReplicationSpans = require("./getReplicationSpans"),
    idFactory = require("../util/idFactory");

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
module.exports = function (editor, model, history) {
  var spanCreateCommand = _.partial(commandTemplate.create, model, "span", true),
      entityCreateCommand = _.partial(commandTemplate.create, model, "entity", true),
      spanAndDefaultEntryCreateCommand = function (type, span) {
    var id = idFactory.makeSpanId(editor, span),
        createSpan = spanCreateCommand(span),
        createEntity = entityCreateCommand({
      span: id,
      type: type
    }),
        subCommands = [createSpan, createEntity];

    return {
      execute: function () {
        executeCompositCommand("span", this, "create", id, subCommands);
      }
    };
  },
      spanReplicateCommand = function (type, span, detectBoundaryFunc) {
    var createSpan = _.partial(spanAndDefaultEntryCreateCommand, type),
        subCommands = getReplicationSpans(model.annotationData, span, detectBoundaryFunc).map(createSpan);

    return {
      execute: function () {
        executeCompositCommand("span", this, "replicate", span.id, subCommands);
      }
    };
  },


  // The relaitonId is optional set only when revert of the relationRemoveCommand.
  // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
  relationCreateCommand = _.partial(commandTemplate.create, model, "relation", false),
      relationCreateAndSelectCommand = _.partial(commandTemplate.create, model, "relation", true),
      modificationRemoveCommand = _.partial(commandTemplate.remove, model, "modification"),
      relationRemoveCommand = _.partial(commandTemplate.remove, model, "relation"),
      relationAndAssociatesRemoveCommand = function (id) {
    var removeRelation = relationRemoveCommand(id),
        removeModification = model.annotationData.getModificationOf(id).map(function (modification) {
      return modification.id;
    }).map(function (id) {
      return modificationRemoveCommand(id);
    }),
        subCommands = removeModification.concat(removeRelation);

    return {
      execute: function () {
        executeCompositCommand("relation", this, "remove", id, subCommands);
      }
    };
  },
      entityRemoveCommand = _.partial(commandTemplate.remove, model, "entity"),
      entityAndAssociatesRemoveCommand = function (id) {
    var removeEntity = entityRemoveCommand(id),
        removeRelation = model.annotationData.entity.assosicatedRelations(id).map(function (id) {
      return relationRemoveCommand(id);
    }),
        removeModification = model.annotationData.getModificationOf(id).map(function (modification) {
      return modification.id;
    }).map(function (id) {
      return modificationRemoveCommand(id);
    }),
        subCommands = removeRelation.concat(removeModification).concat(removeEntity);

    return {
      execute: function () {
        executeCompositCommand("entity", this, "remove", id, subCommands);
      }
    };
  },
      spanRemoveCommand = function (id) {
    var removeSpan = commandTemplate.remove(model, "span", id),
        removeEntity = _.flatten(model.annotationData.span.get(id).getTypes().map(function (type) {
      return type.entities.map(function (entityId) {
        return entityAndAssociatesRemoveCommand(entityId);
      });
    })),
        subCommands = removeEntity.concat(removeSpan);

    return {
      execute: function () {
        executeCompositCommand("span", this, "remove", id, subCommands);
      }
    };
  },
      toEntityPerSpan = function (ids) {
    return ids.map(function (id) {
      var span = model.annotationData.entity.get(id).span;
      return {
        id: id,
        span: span
      };
    }).reduce(function (ret, entity) {
      var hoge = ret[entity.span] ? ret[entity.span] : [];
      hoge.push(entity.id);
      ret[entity.span] = hoge;
      return ret;
    }, {});
  },
      entityRemoveAndSpanRemeveIfNoEntityRestCommand = function (ids) {
    var entityPerSpan = toEntityPerSpan(ids);

    return _.flatten(Object.keys(entityPerSpan).map(function (spanId) {
      var span = model.annotationData.span.get(spanId),
          targetIds = entityPerSpan[spanId],
          allEntitiesOfSpan = _.flatten(span.getTypes().map(function (type) {
        return type.entities;
      })),
          restEntities = _.reject(allEntitiesOfSpan, function (entityId) {
        return _.contains(targetIds, entityId);
      });

      return {
        entities: targetIds,
        spasId: spanId,
        noRestEntities: restEntities.length === 0
      };
    }).map(function (data) {
      if (data.noRestEntities) return spanRemoveCommand(data.spasId);else return data.entities.map(function (id) {
        return entityAndAssociatesRemoveCommand(id);
      });
    }));
  },
      entityChangeTypeRemoveRelationCommand = function (id, newType, isRemoveRelations) {
    var changeType = commandTemplate.changeType(model, "entity", id, newType),
        subCommands = isRemoveRelations ? model.annotationData.entity.assosicatedRelations(id).map(function (id) {
      return relationRemoveCommand(id);
    }).concat(changeType) : [changeType];

    return {
      execute: function () {
        executeCompositCommand("entity", this, "change", id, subCommands);
      }
    };
  },
      spanMoveCommand = function (spanId, newSpan) {
    var subCommands = [],
        newSpanId = idFactory.makeSpanId(editor, newSpan),
        d = model.annotationData;

    if (!d.span.get(newSpanId)) {
      subCommands.push(spanRemoveCommand(spanId));
      subCommands.push(spanCreateCommand({
        begin: newSpan.begin,
        end: newSpan.end
      }));
      d.span.get(spanId).getTypes().forEach(function (type) {
        type.entities.forEach(function (id) {
          subCommands.push(entityCreateCommand({
            id: id,
            span: newSpanId,
            type: type.name
          }));

          subCommands = subCommands.concat(d.entity.assosicatedRelations(id).map(d.relation.get).map(function (id) {
            return relationCreateCommand(id);
          }));
        });
      });
    }

    return {
      execute: function () {
        executeCompositCommand("span", this, "move", spanId, subCommands);
      }
    };
  };

  var factory = {
    spanCreateCommand: spanAndDefaultEntryCreateCommand,
    spanRemoveCommand: spanRemoveCommand,
    spanMoveCommand: spanMoveCommand,
    spanReplicateCommand: spanReplicateCommand,
    entityCreateCommand: entityCreateCommand,
    entityRemoveCommand: entityRemoveAndSpanRemeveIfNoEntityRestCommand,
    entityChangeTypeCommand: entityChangeTypeRemoveRelationCommand,
    relationCreateCommand: relationCreateAndSelectCommand,
    relationRemoveCommand: relationAndAssociatesRemoveCommand,
    relationChangeTypeCommand: _.partial(commandTemplate.changeType, model, "relation"),
    modificationCreateCommand: _.partial(commandTemplate.create, model, "modification", false),
    modificationRemoveCommand: modificationRemoveCommand
  };

  return {
    invoke: function (commands) {
      if (commands && commands.length > 0) {
        invokeCommand.invoke(commands);
        history.push(commands);
      }
    },
    undo: (function () {
      return function () {
        if (history.hasAnythingToUndo()) {
          model.selectionModel.clear();
          invokeCommand.invokeRevert(history.prev());
        }
      };
    })(),
    redo: function () {
      if (history.hasAnythingToRedo()) {
        model.selectionModel.clear();
        invokeCommand.invoke(history.next());
      }
    },
    factory: factory
  };
};


},{"../util/idFactory":158,"./commandTemplate":66,"./executeCompositCommand":67,"./getReplicationSpans":68,"./invokeCommand":70}],70:[function(require,module,exports){
"use strict";

var invoke = function (commands) {
  commands.forEach(function (command) {
    command.execute();
  });
},
    RevertCommands = function (commands) {
  commands = Object.create(commands);
  commands.reverse();
  return commands.map(function (originCommand) {
    return originCommand.revert();
  });
},
    invokeRevert = _.compose(invoke, RevertCommands),
    invokeCommand = {
  invoke: invoke,
  invokeRevert: invokeRevert
};

module.exports = invokeCommand;


},{}],71:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter;


var bindEvent = function ($target, event, func) {
  $target.on(event, func);
},
    bindCloseEvent = function ($dialog) {
  bindEvent($dialog, "dialog.close", function () {
    $dialog.close();
  });
  return $dialog;
},
    ajaxAccessor = require("../util/ajaxAccessor"),
    jQuerySugar = require("../util/jQuerySugar"),
    url = require("url");

// A sub component to save and load data.
module.exports = function (editor, confirmDiscardChangeMessage) {
  var dataSourceUrl = "",
      cursorChanger = require("../util/CursorChanger")(editor),
      getAnnotationFromServer = function (urlToJson) {
    cursorChanger.startWait();
    ajaxAccessor.getAsync(urlToJson, function getAnnotationFromServerSuccess(annotation) {
      api.emit("load", {
        annotation: annotation,
        source: jQuerySugar.toLink(url.resolve(location.href, urlToJson))
      });
      dataSourceUrl = urlToJson;
    }, function () {
      cursorChanger.endWait();
      alert("connection failed.");
    });
  },


  //load/saveDialog
  loadSaveDialog = (function () {
    var extendOpenWithUrl = function ($dialog) {
      // Do not set twice.
      if (!$dialog.openAndSetParam) {
        $dialog.openAndSetParam = _.compose($dialog.open.bind($dialog), function (params) {
          // Display dataSourceUrl.
          this.find("[type=\"text\"].url").val(dataSourceUrl).trigger("input");

          $dialog.params = params;
        });
      }

      return $dialog;
    },
        getDialog = _.compose(extendOpenWithUrl, bindCloseEvent, require("./dialog/GetEditorDialog")(editor)),
        label = {
      URL: "URL",
      LOCAL: "Local"
    },
        getLoadDialog = function (editorId) {
      var getAnnotationFromFile = function (file) {
        var firstFile = file.files[0],
            reader = new FileReader();

        reader.onload = function () {
          var annotation = JSON.parse(this.result);
          api.emit("load", {
            annotation: annotation,
            source: firstFile.name + "(local file)"
          });
        };
        reader.readAsText(firstFile);
      },
          RowDiv = _.partial(jQuerySugar.Div, "textae-editor__load-dialog__row"),
          RowLabel = _.partial(jQuerySugar.Label, "textae-editor__load-dialog__label"),
          OpenButton = _.partial(jQuerySugar.Button, "Open"),
          isUserComfirm = function () {
        // The params was set hasAnythingToSave.
        return !$dialog.params || window.confirm(confirmDiscardChangeMessage);
      },
          $buttonUrl = new OpenButton("url"),
          $buttonLocal = new OpenButton("local"),
          $content = $("<div>").append(new RowDiv().append(new RowLabel(label.URL), $("<input type=\"text\" class=\"textae-editor__load-dialog__file-name url\" />"), $buttonUrl)).on("input", "[type=\"text\"].url", function () {
        jQuerySugar.enabled($buttonUrl, this.value);
      }).on("click", "[type=\"button\"].url", function () {
        if (isUserComfirm()) {
          getAnnotationFromServer(jQuerySugar.getValueFromText($content, "url"));
        }

        $content.trigger("dialog.close");
      }).append(new RowDiv().append(new RowLabel(label.LOCAL), $("<input class=\"textae-editor__load-dialog__file\" type=\"file\" />"), $buttonLocal)).on("change", "[type=\"file\"]", function () {
        jQuerySugar.enabled($buttonLocal, this.files.length > 0);
      }).on("click", "[type=\"button\"].local", function () {
        if (isUserComfirm()) {
          getAnnotationFromFile($content.find("[type=\"file\"]")[0]);
        }

        $content.trigger("dialog.close");
      });

      // Capture the local variable by inner funcitons.
      var $dialog = getDialog("textae.dialog.load", "Load Annotations", $content);

      return $dialog;
    },
        getSaveDialog = function (editorId) {
      var showSaveSuccess = function () {
        api.emit("save");
        cursorChanger.endWait();
      },
          showSaveError = function () {
        api.emit("save error");
        cursorChanger.endWait();
      },
          saveAnnotationToServer = function (url, jsonData) {
        cursorChanger.startWait();
        ajaxAccessor.post(url, jsonData, showSaveSuccess, showSaveError, function () {
          cursorChanger.endWait();
        });
      },
          createDownloadPath = function (contents) {
        var blob = new Blob([contents], {
          type: "application/json"
        });
        return URL.createObjectURL(blob);
      },
          getFilename = function () {
        var $fileInput = getLoadDialog(editorId).find("input[type='file']"),
            file = $fileInput.prop("files")[0];

        return file ? file.name : "annotations.json";
      },
          RowDiv = _.partial(jQuerySugar.Div, "textae-editor__save-dialog__row"),
          RowLabel = _.partial(jQuerySugar.Label, "textae-editor__save-dialog__label"),
          $saveButton = new jQuerySugar.Button("Save", "url"),
          $content = $("<div>").append(new RowDiv().append(new RowLabel(label.URL), $("<input type=\"text\" class=\"textae-editor__save-dialog__server-file-name url\" />"), $saveButton)).on("input", "input.url", function () {
        jQuerySugar.enabled($saveButton, this.value);
      }).on("click", "[type=\"button\"].url", function () {
        saveAnnotationToServer(jQuerySugar.getValueFromText($content, "url"), $dialog.params);
        $content.trigger("dialog.close");
      }).append(new RowDiv().append(new RowLabel(label.LOCAL), $("<input type=\"text\" class=\"textae-editor__save-dialog__local-file-name local\">"), $("<a class=\"download\" href=\"#\">Download</a>"))).on("click", "a.download", function () {
        var downloadPath = createDownloadPath($dialog.params);
        $(this).attr("href", downloadPath).attr("download", jQuerySugar.getValueFromText($content, "local"));
        api.emit("save");
        $content.trigger("dialog.close");
      }).append(new RowDiv().append(new RowLabel(), $("<a class=\"viewsource\" href=\"#\">Click to see the json source in a new window.</a>"))).on("click", "a.viewsource", function (e) {
        var downloadPath = createDownloadPath($dialog.params);
        window.open(downloadPath, "_blank");
        api.emit("save");
        $content.trigger("dialog.close");
        return false;
      });

      var $dialog = getDialog("textae.dialog.save", "Save Annotations", $content);

      // Set the filename when the dialog is opened.
      $dialog.on("dialogopen", function () {
        var filename = getFilename();
        $dialog.find("[type=\"text\"].local").val(filename);
      });

      return $dialog;
    };

    return {
      showLoad: function (editorId, hasAnythingToSave) {
        getLoadDialog(editorId).openAndSetParam(hasAnythingToSave);
      },
      showSave: function (editorId, jsonData) {
        getSaveDialog(editorId).openAndSetParam(jsonData);
      }
    };
  })();

  var api = _.extend(new EventEmitter(), {
    getAnnotationFromServer: getAnnotationFromServer,
    showAccess: _.partial(loadSaveDialog.showLoad, editor.editorId),
    showSave: _.partial(loadSaveDialog.showSave, editor.editorId) });

  return api;
};


},{"../util/CursorChanger":152,"../util/ajaxAccessor":153,"../util/jQuerySugar":160,"./dialog/GetEditorDialog":79,"events":37,"url":43}],72:[function(require,module,exports){
"use strict";

var ToolDialog = require("./dialog/GetToolDialog");

module.exports = function () {
  var helpDialog = new ToolDialog("textae-control__help", "Help (Keyboard short-cuts)", {
    height: 313,
    width: 523
  }, $("<div>").addClass("textae-tool__key-help"));

  return helpDialog.open;
};


},{"./dialog/GetToolDialog":80}],73:[function(require,module,exports){
"use strict";

var Pallet = function (emitter) {
  return $("<div>").addClass("textae-editor__type-pallet").append($("<table>")).css("position", "fixed").on("click", ".textae-editor__type-pallet__entity-type__label", function () {
    emitter.trigger("type.select", $(this).attr("label"));
  }).on("change", ".textae-editor__type-pallet__entity-type__radio", function () {
    emitter.trigger("default-type.select", $(this).attr("label"));
  }).hide();
},
    rowParts = {
  RadioButton: function (typeContainer, typeName) {
    // The event handler is bound direct,because jQuery detects events of radio buttons directly only.
    var $radioButton = $("<input>").addClass("textae-editor__type-pallet__entity-type__radio").attr({
      type: "radio",
      name: "etype",
      label: typeName
    });

    // Select the radio button if it is default type.
    if (typeName === typeContainer.getDefaultType()) {
      $radioButton.attr({
        title: "default type",
        checked: "checked"
      });
    }
    return $radioButton;
  },
  Link: function (uri) {
    if (uri) {
      return $("<a>").attr({
        href: uri,
        target: "_blank"
      }).append($("<span>").addClass("textae-editor__type-pallet__link"));
    }
  },
  wrapTd: function ($element) {
    if ($element) {
      return $("<td>").append($element);
    } else {
      return $("<td>");
    }
  }
},
    PalletRow = function (typeContainer) {
  var Column1 = _.compose(rowParts.wrapTd, _.partial(rowParts.RadioButton, typeContainer)),
      Column2 = function (typeName) {
    return $("<td>").addClass("textae-editor__type-pallet__entity-type__label").attr("label", typeName).text(typeName);
  },
      Column3 = _.compose(rowParts.wrapTd, rowParts.Link, typeContainer.getUri);

  return typeContainer.getSortedNames().map(function (typeName) {
    var $column1 = new Column1(typeName);
    var $column2 = new Column2(typeName);
    var $column3 = new Column3(typeName);

    return $("<tr>").addClass("textae-editor__type-pallet__entity-type").css({
      "background-color": typeContainer.getColor(typeName)
    }).append([$column1, $column2, $column3]);
  });
};

module.exports = function () {
  var emitter = require("../util/extendBindable")({}),
      $pallet = new Pallet(emitter),
      show = (function () {
    var reuseOldPallet = function ($pallet) {
      var $oldPallet = $(".textae-editor__type-pallet");
      if ($oldPallet.length !== 0) {
        return $oldPallet.find("table").empty().end().css("width", "auto");
      } else {
        // Append the pallet to body to show on top.
        $("body").append($pallet);
        return $pallet;
      }
    },
        appendRows = function (typeContainer, $pallet) {
      return $pallet.find("table").append(new PalletRow(typeContainer)).end();
    },
        setMaxHeight = function ($pallet) {
      // Show the scrollbar-y if the height of the pallet is same witch max-height.
      if ($pallet.outerHeight() + "px" === $pallet.css("max-height")) {
        return $pallet.css("overflow-y", "scroll");
      } else {
        return $pallet.css("overflow-y", "");
      }
    },
        show = function ($pallet, typeContainer, point) {
      if (typeContainer && typeContainer.getSortedNames().length > 0) {
        var fillPallet = _.compose(setMaxHeight, _.partial(appendRows, typeContainer), reuseOldPallet);

        // Move the pallet to mouse.
        fillPallet($pallet).css(point).show();
      }
    };

    return show;
  })();

  return _.extend(emitter, {
    show: _.partial(show, $pallet),
    hide: $pallet.hide.bind($pallet)
  });
};


},{"../util/extendBindable":156}],74:[function(require,module,exports){
"use strict";

var lineHeight = require("../view/lineHeight"),
    jQuerySugar = require("../util/jQuerySugar"),
    GetEditorDialog = require("./dialog/GetEditorDialog"),
    debounce300 = function (func) {
  return _.debounce(func, 300);
},
    sixteenTimes = function (val) {
  return val * 16;
},


// Redraw all editors in tha windows.
redrawAllEditor = function () {
  $(window).trigger("resize");
},
    createContent = function () {
  return jQuerySugar.Div("textae-editor__setting-dialog");
},


// Open the dialog.
open = function ($dialog) {
  return $dialog.open();
},


// Update the checkbox state, because it is updated by the button on control too.
updateEditMode = function (displayInstance, $content) {
  return jQuerySugar.setChecked($content, ".mode", displayInstance.showInstance() ? "checked" : null);
},
    updateLineHeight = function (editor, $content) {
  return jQuerySugar.setValue($content, ".line-height", lineHeight.get(editor));
},
    updateTypeGapValue = function (displayInstance, $content) {
  return jQuerySugar.setValue($content, ".type-gap", displayInstance.getTypeGap);
},
    toTypeGap = function ($content) {
  return $content.find(".type-gap");
},
    updateTypeGapEnable = function (displayInstance, $content) {
  jQuerySugar.enabled(toTypeGap($content), displayInstance.showInstance());
  return $content;
},
    changeMode = function (editor, editMode, displayInstance, $content, checked) {
  if (checked) {
    editMode.toInstance();
  } else {
    editMode.toTerm();
  }
  updateTypeGapEnable(displayInstance, $content);
  updateTypeGapValue(displayInstance, $content);
  updateLineHeight(editor, $content);
},
    SettingDialogLabel = _.partial(jQuerySugar.Label, "textae-editor__setting-dialog__label");

module.exports = function (editor, editMode, displayInstance) {
  var addInstanceRelationView = function ($content) {
    var onModeChanged = debounce300(function () {
      changeMode(editor, editMode, displayInstance, $content, $(this).is(":checked"));
    });

    return $content.append(jQuerySugar.Div().append(new SettingDialogLabel("Instance/Relation View")).append(jQuerySugar.Checkbox("textae-editor__setting-dialog__term-centric-view mode"))).on("click", ".mode", onModeChanged);
  },
      addTypeGap = function ($content) {
    var onTypeGapChange = debounce300(function () {
      displayInstance.changeTypeGap($(this).val());
      updateLineHeight(editor, $content);
    });

    return $content.append(jQuerySugar.Div().append(new SettingDialogLabel("Type Gap")).append(jQuerySugar.Number("textae-editor__setting-dialog__type-gap type-gap").attr({
      step: 1,
      min: 0,
      max: 5
    }))).on("change", ".type-gap", onTypeGapChange);
  },
      addLineHeight = function ($content) {
    var changeLineHeight = _.compose(_.partial(lineHeight.set, editor), sixteenTimes),
        onLineHeightChange = debounce300(function () {
      changeLineHeight($(this).val());
      redrawAllEditor();
    });

    return $content.append(jQuerySugar.Div().append(new SettingDialogLabel("Line Height")).append(jQuerySugar.Number("textae-editor__setting-dialog__line-height line-height").attr({
      step: 1,
      min: 3,
      max: 50
    }))).on("change", ".line-height", onLineHeightChange);
  },
      appendToDialog = function ($content) {
    return new GetEditorDialog(editor)("textae.dialog.setting", "Setting", $content, {
      noCancelButton: true
    });
  };

  // Update values after creating a dialog because the dialog is re-used.
  return _.compose(open, _.partial(updateLineHeight, editor), _.partial(updateTypeGapValue, displayInstance), _.partial(updateTypeGapEnable, displayInstance), _.partial(updateEditMode, displayInstance), appendToDialog, addLineHeight, addTypeGap, addInstanceRelationView, createContent);
};


},{"../util/jQuerySugar":160,"../view/lineHeight":203,"./dialog/GetEditorDialog":79}],75:[function(require,module,exports){
"use strict";

var getAreaIn = function ($parent) {
  var $area = $parent.find(".textae-editor__footer .textae-editor__footer__message");
  if ($area.length === 0) {
    $area = $("<div>").addClass("textae-editor__footer__message");
    var $footer = $("<div>").addClass("textae-editor__footer").append($area);
    $parent.append($footer);
  }

  return $area;
};

module.exports = function (editor) {
  var getAreaInEditor = _.partial(getAreaIn, editor),
      status = function (message) {
    if (message !== "") getAreaInEditor().html("Source: " + message);
  };

  return {
    status: status
  };
};


},{}],76:[function(require,module,exports){
"use strict";

var Dialog = function (id, title, $content) {
  return $("<div>").attr("id", id).attr("title", title).hide().append($content);
},
    OpenCloseMixin = function ($dialog, openOption) {
  return {
    open: function () {
      $dialog.dialog(openOption);
    },
    close: function () {
      $dialog.dialog("close");
    } };
},
    extendDialog = function (openOption, $dialog) {
  return _.extend($dialog, new OpenCloseMixin($dialog, openOption));
},
    appendDialog = function ($dialog) {
  $("body").append($dialog);
  return $dialog;
};

module.exports = function (openOption, id, title, $content) {
  openOption = _.extend({
    resizable: false,
    modal: true
  }, openOption);

  var extendDialogWithOpenOption = _.partial(extendDialog, openOption),
      createAndAppendDialog = _.compose(appendDialog, extendDialogWithOpenOption, Dialog);

  return createAndAppendDialog(id, title, $content);
};


},{}],77:[function(require,module,exports){
"use strict";

var Dialog = require("./Dialog"),
    getDialogId = function (editorId, id) {
  return editorId + "." + id;
},
    defaultOption = {
  width: 550,
  height: 220
};

module.exports = function (editorId, id, title, $content, option) {
  var openOption = _.extend({}, defaultOption, option);

  if (option && option.noCancelButton) {
    openOption.buttons = {};
  } else {
    openOption.buttons = {
      Cancel: function () {
        $(this).dialog("close");
      }
    };
  }

  var $dialog = new Dialog(openOption, getDialogId(editorId, id), title, $content);

  return _.extend($dialog, {
    id: id
  });
};


},{"./Dialog":76}],78:[function(require,module,exports){
"use strict";

var getFromContainer = function (container, id) {
  return container[id];
},
    addToContainer = function (container, id, object) {
  container[id] = object;
  return object;
};

// Cash a div for dialog by self, because $('#dialog_id') cannot find exists div element.
// The first parameter of an createFunction must be id.
// A createFunction must return an object having a parameter 'id'.
module.exports = function (createFunction) {
  var cache = {},
      serachCache = _.partial(getFromContainer, cache),
      addCache = _.partial(addToContainer, cache),
      createAndCache = function (createFunction, params) {
    var object = createFunction.apply(null, params);
    return addCache(object.id, object);
  };

  return function (id, title, $content, options) {
    return serachCache(id) || createAndCache(createFunction, arguments);
  };
};


},{}],79:[function(require,module,exports){
"use strict";

var EditorDialog = require("./EditorDialog"),
    FunctionUseCache = require("./FunctionUseCache");

// Cache instances per editor.
module.exports = function (editor) {
  editor.getDialog = editor.getDialog || new FunctionUseCache(_.partial(EditorDialog, editor.editorId));
  return editor.getDialog;
};


},{"./EditorDialog":77,"./FunctionUseCache":78}],80:[function(require,module,exports){
"use strict";

var ToolDialog = require("./ToolDialog"),
    FunctionUseCache = require("./FunctionUseCache");

module.exports = new FunctionUseCache(ToolDialog);


},{"./FunctionUseCache":78,"./ToolDialog":81}],81:[function(require,module,exports){
"use strict";

var Dialog = require("./Dialog");

module.exports = function (id, title, size, $content) {
  var $dialog = new Dialog(size, id, title, $content);

  return _.extend($dialog, {
    id: id
  });
};


},{"./Dialog":76}],82:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Handlebars = _interopRequire(require("handlebars"));

var hasError = _interopRequire(require("../Reject/hasError"));

var GetEditorDialog = _interopRequire(require("./dialog/GetEditorDialog"));

var source = "\n    <div class=\"textae-editor__valiondate-dialog__content\">\n        <h2>{{name}}</h2>\n        {{#if denotationHasLength}}\n            <table>\n                <caption>Wrong range.</caption>\n                <thead>\n                    <tr>\n                        <th class=\"id\">id</th>\n                        <th class=\"range\">begin</th>\n                        <th class=\"range\">end</th>\n                        <th>obj</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    {{#denotationHasLength}}\n                    <tr>\n                        <td>{{id}}</td>\n                        <td class=\"alert\">{{span.begin}}</td>\n                        <td class=\"alert\">{{span.end}}</td>\n                        <td>{{obj}}</td>\n                    </tr>\n                    {{/denotationHasLength}}\n                </tbody>\n            </table>\n        {{/if}}\n        {{#if denotationInText}}\n            <table>\n                <caption>Out of text.</caption>\n                <thead>\n                    <tr>\n                        <th class=\"id\">id</th>\n                        <th class=\"range\">begin</th>\n                        <th class=\"range\">end</th>\n                        <th>obj</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    {{#denotationInText}}\n                    <tr>\n                        <td>{{id}}</td>\n                        <td class=\"alert\">{{span.begin}}</td>\n                        <td class=\"alert\">{{span.end}}</td>\n                        <td>{{obj}}</td>\n                    </tr>\n                    {{/denotationInText}}\n                </tbody>\n            </table>\n        {{/if}}\n        {{#if denotationInParagraph}}\n            <table>\n                <caption>Spans across paragraphs (newline-delimited).</caption>\n                <thead>\n                    <tr>\n                        <th class=\"id\">id</th>\n                        <th class=\"range\">begin</th>\n                        <th class=\"range\">end</th>\n                        <th>obj</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    {{#denotationInParagraph}}\n                    <tr>\n                        <td>{{id}}</td>\n                        <td class=\"alert\">{{span.begin}}</td>\n                        <td class=\"alert\">{{span.end}}</td>\n                        <td>{{obj}}</td>\n                    </tr>\n                    {{/denotationInParagraph}}\n                </tbody>\n            </table>\n        {{/if}}\n        {{#if referencedItems}}\n            <table>\n                <caption>Referenced items do not exist.</caption>\n                <thead>\n                    <tr>\n                        <th class=\"id\">id</th>\n                        <th class=\"referencedItem\">subj</th>\n                        <th>pred</th>\n                        <th class=\"referencedItem\">obj</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    {{#referencedItems}}\n                    <tr>\n                        <td>{{id}}</td>\n                        <td{{#if alertSubj}} class=\"alert\"{{/if}}>{{subj}}</td>\n                        <td>{{pred}}</td>\n                        <td{{#if alertObj}} class=\"alert\"{{/if}}>{{obj}}</td>\n                    </tr>\n                    {{/referencedItems}}\n                </tbody>\n            </table>\n        {{/if}}\n    </div>",
    mergeMessage = "\n        <div class=\"textae-editor__valiondate-dialog__content\">\n            <h1>Track annatations will be merged to the root anntations.</h1>\n        </div>";

var tepmlate = Handlebars.compile(source);

module.exports = function (editor, rejects) {
  if (!hasError(rejects)) return;

  var $dialog = new GetEditorDialog(editor)("textae.dialog.validation", "The following erronious annotations ignored", $("<div>"), {
    noCancelButton: true,
    height: 450
  });

  updateContent($dialog[0].firstChild, rejects);
  $dialog.open();
};

function updateContent(content, rejects) {
  content.innerHTML = "";

  rejects.map(transformToReferenceObjectError).map(tepmlate).forEach(function (html, index) {
    if (index === 1) {
      content.insertAdjacentHTML("beforeend", mergeMessage);
    }

    content.insertAdjacentHTML("beforeend", html);
  });

  return content;
}

function transformToReferenceObjectError(reject) {
  // Combine rejects for referenced object errer.
  reject.referencedItems = reject.relationObj.map(function (relation) {
    relation.alertObj = true;
    return relation;
  }).concat(reject.relationSubj.map(function (relation) {
    relation.alertSubj = true;
    return relation;
  })).concat(reject.modification.map(function (modification) {
    modification.subj = "-";
    modification.alertObj = true;
    return modification;
  }));

  return reject;
}


},{"../Reject/hasError":62,"./dialog/GetEditorDialog":79,"handlebars":59}],83:[function(require,module,exports){
"use strict";

var TitleDom = function () {
  return $("<span>").addClass("textae-control__title").append($("<a>").attr({
    href: "http://textae.pubannotation.org/",
    target: "_blank"
  }).text("TextAE"));
},
    ButtonDom = function (buttonType, title) {
  return $("<span>").addClass("textae-control__icon").addClass("textae-control__" + buttonType + "-button").attr("title", title);
},
    SeparatorDom = function () {
  return $("<span>").addClass("textae-control__separator");
},
    makeButtons = function ($control, buttonMap) {
  var buttonContainer = {},


  // Make a group of buttons that is headed by the separator.
  icons = _.flatten(buttonMap.map(function (params) {
    var buttons = _.map(params, function (title, buttonType) {
      var button = new ButtonDom(buttonType, title);

      buttonContainer[buttonType] = {
        instance: button,
        eventValue: "textae.control.button." + buttonType.replace(/-/g, "_") + ".click"
      };

      return button;
    });

    return [new SeparatorDom()].concat(buttons);
  }));

  $control.append(new TitleDom()).append($("<span>").append(icons));

  return buttonContainer;
},


// Utility functions to change appearance of bunttons.
cssUtil = {
  enable: function ($button) {
    $button.removeClass("textae-control__icon--disabled");
  },
  disable: function ($button) {
    $button.addClass("textae-control__icon--disabled");
  },
  isDisable: function ($button) {
    return $button.hasClass("textae-control__icon--disabled");
  },
  push: function ($button) {
    $button.addClass("textae-control__icon--pushed");
  },
  unpush: function ($button) {
    $button.removeClass("textae-control__icon--pushed");
  },
  isPushed: function ($button) {
    return $button.hasClass("textae-control__icon--pushed");
  }
},
    setButtonApearanceAndEventHandler = function (button, enable, eventHandler) {
  var event = "click";

  // Set apearance and eventHandler to button.
  if (enable === true) {
    button.off(event).on(event, eventHandler);
    cssUtil.enable(button);
  } else {
    button.off(event);
    cssUtil.disable(button);
  }
},


// A parameter can be spesified by object like { 'buttonName1': true, 'buttonName2': false }.
updateButtons = function (buttonContainer, clickEventHandler, buttonEnables) {
  _.each(buttonEnables, function (enable, buttonName) {
    var button = buttonContainer[buttonName],
        eventHandler = function () {
      clickEventHandler(button.eventValue);
      return false;
    };

    if (button) setButtonApearanceAndEventHandler(button.instance, enable, eventHandler);
  });
};

// The control is a control bar to edit.
// This can controls mulitple instance of editor.
module.exports = function ($control) {
  // This contains buttons and event definitions like as {'buttonName' : { instance: $button, eventValue : 'textae.control.button.read.click' }}
  var buttonContainer = makeButtons($control, [{
    read: "Import [I]",
    write: "Upload [U]"
  }, {
    undo: "Undo [Z]",
    redo: "Redo [A]"
  }, {
    replicate: "Replicate span annotation [R]",
    "replicate-auto": "Auto replicate",
    "boundary-detection": "Boundary Detection [B]",
    "relation-edit-mode": "Relation Edit Mode [F]"
  }, {
    entity: "New entity [E]",
    pallet: "Select label [Q]",
    "change-label": "Change label [W]"
  }, {
    negation: "Negation [X]",
    speculation: "Speculation [S]"
  }, {
    "delete": "Delete [D]",
    copy: "Copy [C]",
    paste: "Paste [V]"
  }, {
    setting: "Setting"
  }, {
    help: "Help [H]"
  }]),
      triggrButtonClickEvent = $control.trigger.bind($control, "textae.control.button.click"),


  // A function to enable/disable button.
  enableButton = _.partial(updateButtons, buttonContainer, triggrButtonClickEvent),


  // Buttons that always eanable.
  alwaysEnables = {
    read: true,
    help: true
  },


  // Update all button state when an instance of textEditor is changed.
  updateAllButtonEnableState = function (enableButtons) {
    // Make buttons in a enableButtons enabled, and other buttons in the buttonContainer disabled.
    enableButton(_.extend({}, buttonContainer, alwaysEnables, enableButtons));
  },


  // Update button push state.
  updateButtonPushState = function (bottonName, isPushed) {
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


},{}],84:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Observable = _interopRequire(require("observ"));

var showVilidationDialog = _interopRequire(require("./component/showVilidationDialog"));

var hasError = _interopRequire(require("./Reject/hasError"));

module.exports = function (annotationData, history, buttonStateHelper, leaveMessage, dataAccessObject) {
  var writable = new Writable();

  bindResetEvent(annotationData, history, writable);
  bindChangeEvent(history, buttonStateHelper, leaveMessage, writable);
  bindEndEvent(dataAccessObject, history, writable);

  writable(function (val) {
    return buttonStateHelper.enabled("write", val);
  });
};

function Writable() {
  var isDataModified = false,
      o = new Observable(false);

  o.forceModified = function (val) {
    o.set(val);
    isDataModified = val;
  };

  o.update = function (val) {
    o.set(isDataModified || val);
  };

  return o;
}

function bindResetEvent(annotationData, history, writable) {
  annotationData.on("all.change", function (annotationData, multitrack, reject) {
    history.reset();

    showVilidationDialog(self, reject);

    if (multitrack) toastr.success("track annotations have been merged to root annotations.");

    if (multitrack || hasError(reject)) {
      writable.forceModified(true);
    } else {
      writable.forceModified(false);
    }
  });
}

function bindChangeEvent(history, buttonStateHelper, leaveMessage, writable) {
  history.bind("change", function (state) {
    //change button state
    buttonStateHelper.enabled("undo", state.hasAnythingToUndo);
    buttonStateHelper.enabled("redo", state.hasAnythingToRedo);

    //change leaveMessage show
    window.onbeforeunload = state.hasAnythingToSave ? function () {
      return leaveMessage;
    } : null;

    writable.update(state.hasAnythingToSave);
  });
}

function bindEndEvent(dataAccessObject, history, writable) {
  dataAccessObject.on("save", function () {
    history.saved();
    writable.forceModified(false);
    toastr.success("annotation saved");
  }).on("save error", function () {
    toastr.error("could not save");
  });
}


},{"./Reject/hasError":62,"./component/showVilidationDialog":82,"observ":60}],85:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var CONFIRM_DISCARD_CHANGE_MESSAGE = "There is a change that has not been saved. If you procceed now, you will lose it.";

var DataAccessObject = _interopRequire(require("./component/DataAccessObject"));

var editingState = _interopRequire(require("./editingState"));

// model manages data objects.
var Model = require("./model/Model"),


// The history of command that providing undo and redo.
History = require("./model/History"),
    SpanConfig = require("./SpanConfig"),
    Command = require("./command"),
    ButtonController = require("./view/ButtonController"),
    TypeContainer = require("./view/TypeContainer"),
    View = require("./view/View"),
    Presenter = require("./presenter/Presenter"),
    Controller = require("./Controller"),
    getParams = require("./getParams"),
    setTypeConfig = function (typeContainer, config) {
  typeContainer.setDefinedEntityTypes(config ? config["entity types"] : []);
  typeContainer.setDefinedRelationTypes(config ? config["relation types"] : []);

  if (config && config.css !== undefined) {
    $("#css_area").html("<link rel=\"stylesheet\" href=\"" + config.css + "\"/>");
  }

  return config;
},
    handle = function (map, key, value) {
  if (map[key]) map[key](value);
},
    StatusBar = require("./component/StatusBar"),
    getStatusBar = function (editor, status_bar) {
  if (status_bar === "on") return new StatusBar(editor);
  return {
    status: function () {}
  };
},
    Observable = require("observ"),
    ajaxAccessor = require("./util/ajaxAccessor");

module.exports = function () {
  var self = this,
      model = new Model(this),
      history = new History(),
      spanConfig = new SpanConfig(),


  // Users can edit model only via commands.
  command = new Command(this, model, history),
      clipBoard = {
    // clipBoard has entity type.
    clipBoard: []
  },
      buttonController = new ButtonController(this, model, clipBoard),
      typeGap = new Observable(-1),
      typeContainer = new TypeContainer(model),
      view = new View(this, model, buttonController, typeGap, typeContainer),
      presenter = new Presenter(this, model, view, command, spanConfig, clipBoard, buttonController, typeGap, typeContainer),


  //handle user input event.
  controller = new Controller(this, presenter, view),
      setSpanAndTypeConfig = function (config) {
    spanConfig.set(config);
    setTypeConfig(typeContainer, config);
  },
      setConfigInAnnotation = function (annotation) {
    spanConfig.reset();
    setSpanAndTypeConfig(annotation.config);

    if (!annotation.config) {
      return "no config";
    }
  },
      resetData = model.annotationData.reset,
      setConfigFromServer = function (config, annotation) {
    spanConfig.reset();

    if (typeof config === "string") {
      ajaxAccessor.getAsync(config, function (configFromServer) {
        setSpanAndTypeConfig(configFromServer);
        resetData(annotation);
      }, function () {
        alert("could not read the span configuration from the location you specified.: " + config);
      });
    } else {
      resetData(annotation);
    }
  },
      setAnnotation = function (config, annotation) {
    var ret = setConfigInAnnotation(annotation);
    if (ret === "no config") {
      setConfigFromServer(config, annotation);
    } else {
      resetData(annotation);
    }
  },
      loadAnnotation = function (statusBar, params, dataAccessObject) {
    var annotation = params.annotation;
    if (annotation) {
      if (annotation.inlineAnnotation) {
        // Set an inline annotation.
        setAnnotation(params.config, JSON.parse(annotation.inlineAnnotation));
        statusBar.status("inline");
      } else if (annotation.url) {
        // Load an annotation from server.
        dataAccessObject.getAnnotationFromServer(annotation.url);
      }
    }
  },
      dataAccessObject = new DataAccessObject(self, CONFIRM_DISCARD_CHANGE_MESSAGE);

  editingState(model.annotationData, history, buttonController.buttonStateHelper, CONFIRM_DISCARD_CHANGE_MESSAGE, dataAccessObject);

  // public funcitons of editor
  this.api = (function (editor) {
    var updateAPIs = function (dataAccessObject) {
      var showAccess = function () {
        dataAccessObject.showAccess(history.hasAnythingToSave());
      },
          showSave = function () {
        dataAccessObject.showSave(model.annotationData.toJson());
      },
          keyApiMap = {
        A: command.redo,
        B: presenter.event.toggleDetectBoundaryMode,
        C: presenter.event.copyEntities,
        D: presenter.event.removeSelectedElements,
        DEL: presenter.event.removeSelectedElements,
        E: presenter.event.createEntity,
        F: presenter.event.toggleRelationEditMode,
        I: showAccess,
        M: presenter.event.toggleRelationEditMode,
        Q: presenter.event.showPallet,
        R: presenter.event.replicate,
        S: presenter.event.speculation,
        U: showSave,
        V: presenter.event.pasteEntities,
        W: presenter.event.newLabel,
        X: presenter.event.negation,
        Y: command.redo,
        Z: command.undo,
        ESC: presenter.event.cancelSelect,
        LEFT: presenter.event.selectLeftSpan,
        RIGHT: presenter.event.selectRightSpan },
          iconApiMap = {
        "textae.control.button.read.click": showAccess,
        "textae.control.button.write.click": showSave,
        "textae.control.button.undo.click": command.undo,
        "textae.control.button.redo.click": command.redo,
        "textae.control.button.replicate.click": presenter.event.replicate,
        "textae.control.button.replicate_auto.click": buttonController.modeAccordingToButton["replicate-auto"].toggle,
        "textae.control.button.boundary_detection.click": presenter.event.toggleDetectBoundaryMode,
        "textae.control.button.relation_edit_mode.click": presenter.event.toggleRelationEditMode,
        "textae.control.button.entity.click": presenter.event.createEntity,
        "textae.control.button.change_label.click": presenter.event.newLabel,
        "textae.control.button.pallet.click": presenter.event.showPallet,
        "textae.control.button.negation.click": presenter.event.negation,
        "textae.control.button.speculation.click": presenter.event.speculation,
        "textae.control.button.delete.click": presenter.event.removeSelectedElements,
        "textae.control.button.copy.click": presenter.event.copyEntities,
        "textae.control.button.paste.click": presenter.event.pasteEntities,
        "textae.control.button.setting.click": presenter.event.showSettingDialog
      };

      // Update APIs
      editor.api = {
        handleKeyInput: _.partial(handle, keyApiMap),
        handleButtonClick: _.partial(handle, iconApiMap),
        redraw: function () {
          console.log(editor.editorId, "redraw");
          view.updateDisplay();
        }
      };
    },
        start = function start(editor) {
      var params = getParams(editor);

      view.init();
      controller.init();
      presenter.init();

      var statusBar = getStatusBar(editor, params.status_bar);

      dataAccessObject.on("load", function (data) {
        setAnnotation(params.config, data.annotation);
        statusBar.status(data.source);
      });

      presenter.setMode(params.mode);

      loadAnnotation(statusBar, params, dataAccessObject);

      updateAPIs(dataAccessObject);
    };

    return {
      start: start
    };
  })(this);

  return this;
};


},{"./Controller":61,"./SpanConfig":64,"./command":69,"./component/DataAccessObject":71,"./component/StatusBar":75,"./editingState":84,"./getParams":86,"./model/History":109,"./model/Model":110,"./presenter/Presenter":126,"./util/ajaxAccessor":153,"./view/ButtonController":164,"./view/TypeContainer":198,"./view/View":200,"observ":60}],86:[function(require,module,exports){
"use strict";

var getUrlParameters = require("./util/getUrlParameters"),
    priorUrl = function (params, editor, name) {
  if (!params[name] && editor.attr(name)) params[name] = editor.attr(name);
},
    priorAttr = function (params, editor, name) {
  if (editor.attr(name)) params[name] = editor.attr(name);
};

module.exports = function (editor) {
  // Read model parameters from url parameters and html attributes.
  var params = getUrlParameters(location.search);

  // 'source' prefer to 'target'
  params.target = editor.attr("source") || editor.attr("target") || params.source || params.target;

  priorAttr(params, editor, "config");
  priorAttr(params, editor, "status_bar");

  // Mode is prior in the url parameter.
  priorUrl(params, editor, "mode");

  // Read Html text and clear it.
  var inlineAnnotation = editor.text();
  editor.empty();

  // Set annotaiton parameters.
  params.annotation = {
    inlineAnnotation: inlineAnnotation,
    url: params.target
  };

  // console.log(params);

  return params;
};


},{"./util/getUrlParameters":157}],87:[function(require,module,exports){
"use strict";

var tool = require("./tool"),
    control = require("./control"),
    editor = require("./editor");

jQuery.fn.textae = (function () {
  return function () {
    if (this.hasClass("textae-editor")) {
      this.each(function () {
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


},{"./control":83,"./editor":85,"./tool":149}],88:[function(require,module,exports){
"use strict";

// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
var idFactory = require("../../../util/idFactory"),
    ModelContainer = require("./ModelContainer"),
    toModel = function (editor, entity) {
  return {
    id: entity.id,
    span: idFactory.makeSpanId(editor, entity.span),
    type: entity.obj };
},
    mappingFunction = function (editor, denotations) {
  denotations = denotations || [];
  return denotations.map(_.partial(toModel, editor));
},
    EntityContainer = function (editor, emitter, relation) {
  var entityContainer = new ModelContainer(emitter, "entity", _.partial(mappingFunction, editor), "T"),
      add = _.compose(entityContainer.add, function (entity) {
    if (entity.span) return entity;
    throw new Error("entity has no span! " + JSON.stringify(entity));
  }),
      assosicatedRelations = function (entityId) {
    return relation.all().filter(function (r) {
      return r.obj === entityId || r.subj === entityId;
    }).map(function (r) {
      return r.id;
    });
  },
      api = _.extend(entityContainer, {
    add: add,
    assosicatedRelations: assosicatedRelations
  });

  return api;
};

module.exports = EntityContainer;


},{"../../../util/idFactory":158,"./ModelContainer":89}],89:[function(require,module,exports){
"use strict";

var getNextId = require("./getNextId"),
    ERROR_MESSAGE = "Set the mappingFunction by the constructor to use the method \"ModelContainer.setSource\".";

module.exports = function (emitter, prefix, mappingFunction, idPrefix) {
  var contaier = {},
      getIds = function () {
    return Object.keys(contaier);
  },
      getNewId = _.partial(getNextId, idPrefix ? idPrefix : prefix.charAt(0).toUpperCase()),
      add = function (model) {
    // Overwrite to revert
    model.id = model.id || getNewId(getIds());
    contaier[model.id] = model;
    return model;
  },
      concat = function (collection) {
    if (!collection) return;

    // Move medols without id behind others, to prevet id duplication generated and exists.
    collection.sort(function (a, b) {
      if (!a.id) return 1;
      if (!b.id) return -1;
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;

      return 0;
    });

    collection.forEach(add);
  },
      get = function (id) {
    return contaier[id];
  },
      all = function () {
    return _.map(contaier, _.identity);
  },
      clear = function () {
    contaier = {};
  };

  return {
    name: prefix,
    addSource: function (source) {
      if (!_.isFunction(mappingFunction)) {
        throw new Error(ERROR_MESSAGE);
      }

      concat(mappingFunction(source));
    },
    add: function (model, doAfter) {
      var newModel = add(model);
      if (_.isFunction(doAfter)) doAfter();

      emitter.emit(prefix + ".add", newModel);
      return newModel;
    },
    get: get,
    all: all,
    some: function () {
      return _.some(contaier);
    },
    types: function () {
      return all().map(function (model) {
        return model.type;
      });
    },
    changeType: function (id, newType) {
      var model = get(id);
      model.type = newType;
      emitter.emit(prefix + ".change", model);
      return model;
    },
    remove: function (id) {
      var model = contaier[id];
      if (model) {
        delete contaier[id];
        emitter.emit(prefix + ".remove", model);
      }
      return model;
    },
    clear: clear
  };
};


},{"./getNextId":92}],90:[function(require,module,exports){
"use strict";

var idFactory = require("../../../util/idFactory"),
    ModelContainer = require("./ModelContainer");

module.exports = function (editor, emitter) {
  var mappingFunction = function (sourceDoc) {
    sourceDoc = sourceDoc || [];
    var textLengthBeforeThisParagraph = 0;

    return sourceDoc.split("\n").map(function (p, index) {
      var ret = {
        id: idFactory.makeParagraphId(editor, index),
        begin: textLengthBeforeThisParagraph,
        end: textLengthBeforeThisParagraph + p.length };

      textLengthBeforeThisParagraph += p.length + 1;
      return ret;
    });
  },
      contaier = new ModelContainer(emitter, "paragraph", mappingFunction),
      api = _.extend(contaier, {
    //get the paragraph that span is belong to.
    getBelongingTo: function (span) {
      var match = contaier.all().filter(function (p) {
        return span.begin >= p.begin && span.end <= p.end;
      });

      if (match.length === 0) {
        throw new Error("span should belong to any paragraph.");
      } else {
        return match[0];
      }
    }
  });

  return api;
};


},{"../../../util/idFactory":158,"./ModelContainer":89}],91:[function(require,module,exports){
"use strict";

var idFactory = require("../../../util/idFactory"),
    ModelContainer = require("./ModelContainer"),
    isChildOf = function (editor, spanContainer, span, maybeParent) {
  if (!maybeParent) return false;

  var id = idFactory.makeSpanId(editor, maybeParent);
  if (!spanContainer.get(id)) throw new Error("maybeParent is removed. " + maybeParent.toStringOnlyThis());

  return maybeParent.begin <= span.begin && span.end <= maybeParent.end;
};

module.exports = function (editor, emitter, paragraph) {
  var toSpanModel = (function () {
    var spanExtension = {
      //for debug. print myself only.
      toStringOnlyThis: function () {
        return "span " + this.begin + ":" + this.end + ":" + emitter.sourceDoc.substring(this.begin, this.end);
      },
      //for debug. print with children.
      toString: function (depth) {
        depth = depth || 1; //default depth is 1

        var childrenString = this.children && this.children.length > 0 ? "\n" + this.children.map(function (child) {
          return new Array(depth + 1).join("\t") + child.toString(depth + 1);
        }).join("\n") : "";

        return this.toStringOnlyThis() + childrenString;
      },
      // A big brother is brother node on a structure at rendered.
      // There is no big brother if the span is first in a paragraph.
      // Warning: parent is set at updateSpanTree, is not exists now.
      getBigBrother: function () {
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
      getTypes: function () {
        var spanId = this.id;

        // Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"] }.
        return emitter.entity.all().filter(function (entity) {
          return spanId === entity.span;
        }).reduce(function (a, b) {
          var typeId = idFactory.makeTypeId(b.span, b.type);

          var type = a.filter(function (type) {
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
      getEntities: function () {
        return _.flatten(this.getTypes().map(function (type) {
          return type.entities;
        }));
      }
    };

    return function (span) {
      return $.extend({}, span, {
        id: idFactory.makeSpanId(editor, span),
        paragraph: paragraph.getBelongingTo(span) }, spanExtension);
    };
  })(),
      isBoundaryCrossingWithOtherSpans = require("../../isBoundaryCrossingWithOtherSpans"),
      mappingFunction = function (denotations) {
    denotations = denotations || [];
    return denotations.map(function (entity) {
      return entity.span;
    }).map(toSpanModel).filter(function (span, index, array) {
      return !isBoundaryCrossingWithOtherSpans(array.slice(0, index - 1), span);
    });
  },
      spanContainer = new ModelContainer(emitter, "span", mappingFunction),
      spanTopLevel = [],
      adopt = function (parent, span) {
    parent.children.push(span);
    span.parent = parent;
  },
      getParet = function (parent, span) {
    if (isChildOf(editor, spanContainer, span, parent)) {
      return parent;
    } else {
      if (parent.parent) {
        return getParet(parent.parent, span);
      } else {
        return null;
      }
    }
  },
      updateSpanTree = function () {
    // Sort id of spans by the position.
    var sortedSpans = spanContainer.all().sort(spanComparator);

    // the spanTree has parent-child structure.
    var spanTree = [];

    sortedSpans.map(function (span, index, array) {
      return $.extend(span, {
        // Reset parent
        parent: null,
        // Reset children
        children: [],
        // Order by position
        left: index !== 0 ? array[index - 1] : null,
        right: index !== array.length - 1 ? array[index + 1] : null });
    }).forEach(function (span) {
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
    spanTree.toString = function () {
      return this.map(function (span) {
        return span.toString();
      }).join("\n");
    };
    // console.log(spanTree.toString());

    spanTopLevel = spanTree;
  },
      spanComparator = function (a, b) {
    return a.begin - b.begin || b.end - a.end;
  },
      api = {

    //expected span is like { "begin": 19, "end": 49 }
    add: function (span) {
      if (span) return spanContainer.add(toSpanModel(span), updateSpanTree);
      throw new Error("span is undefined.");
    },
    addSource: function (spans) {
      spanContainer.addSource(spans);
      updateSpanTree();
    },
    get: function (spanId) {
      return spanContainer.get(spanId);
    },
    all: spanContainer.all,
    range: function (firstId, secondId) {
      var first = spanContainer.get(firstId);
      var second = spanContainer.get(secondId);

      //switch if seconfId before firstId
      if (spanComparator(first, second) > 0) {
        var temp = first;
        first = second;
        second = temp;
      }

      return spanContainer.all().filter(function (span) {
        return first.begin <= span.begin && span.end <= second.end;
      }).map(function (span) {
        return span.id;
      });
    },
    topLevel: function () {
      return spanTopLevel;
    },
    multiEntities: function () {
      return spanContainer.all().filter(function (span) {
        var multiEntitiesTypes = span.getTypes().filter(function (type) {
          return type.entities.length > 1;
        });

        return multiEntitiesTypes.length > 0;
      });
    },
    remove: spanContainer.remove,
    clear: function () {
      spanContainer.clear();
      spanTopLevel = [];
    }
  };

  return api;
};


},{"../../../util/idFactory":158,"../../isBoundaryCrossingWithOtherSpans":114,"./ModelContainer":89}],92:[function(require,module,exports){
"use strict";

var hasPrefix = function (prefix, id) {
  return id[0] === prefix;
},
    withoutPrefix = function (id) {
  return id.slice(1);
},
    getNextId = function (prefix, existsIds) {
  var numbers = existsIds.filter(_.partial(hasPrefix, prefix)).map(withoutPrefix),


  // The Math.max retrun -Infinity when the second argument array is empty.
  max = numbers.length === 0 ? 0 : Math.max.apply(null, numbers),
      nextNumber = max + 1;

  return prefix + nextNumber;
};

module.exports = getNextId;


},{}],93:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var EventEmitter = require("events").EventEmitter;
var ModelContainer = _interopRequire(require("./ModelContainer"));

var ParagraphContainer = _interopRequire(require("./ParagraphContainer"));

var SpanContainer = _interopRequire(require("./SpanContainer"));

var EntityContainer = _interopRequire(require("./EntityContainer"));

module.exports = function (editor) {
  var emitter = new EventEmitter(),
      namespace = new ModelContainer(emitter, "namespace", _.identity),
      paragraph = new ParagraphContainer(editor, emitter),
      span = new SpanContainer(editor, emitter, paragraph),
      relation = new ModelContainer(emitter, "relation", mapRelations),
      entity = new EntityContainer(editor, emitter, relation),
      modification = new ModelContainer(emitter, "modification", _.identity);

  return _.extend(emitter, {
    namespace: namespace,
    sourceDoc: "",
    paragraph: paragraph,
    span: span,
    entity: entity,
    relation: relation,
    modification: modification });
};

function mapRelations(relations) {
  return relations.map(function (r) {
    return {
      id: r.id,
      type: r.pred,
      subj: r.subj,
      obj: r.obj
    };
  });
}


},{"./EntityContainer":88,"./ModelContainer":89,"./ParagraphContainer":90,"./SpanContainer":91,"events":37}],94:[function(require,module,exports){
"use strict";

var setNewData = require("./setNewData"),
    toJson = require("./toJson"),
    Container = require("./Container"),
    clearAnnotationData = function (dataStore) {
  dataStore.span.clear();
  dataStore.entity.clear();
  dataStore.relation.clear();
  dataStore.modification.clear();
  dataStore.paragraph.clear();
},
    AnntationData = function (editor) {
  var originalData,
      dataStore = new Container(editor);

  return _.extend(dataStore, {
    reset: function (annotation) {
      try {
        clearAnnotationData(dataStore);

        if (!annotation.text) throw "read failed.";

        var result = setNewData(dataStore, annotation);

        originalData = annotation;

        dataStore.emit("text.change", {
          sourceDoc: dataStore.sourceDoc,
          paragraphs: dataStore.paragraph.all()
        });

        dataStore.emit("all.change", dataStore, result.multitrack, result.rejects);

        return result.rejects;
      } catch (error) {
        console.error(error, error.stack);
      }
    },
    toJson: function () {
      return JSON.stringify(toJson(originalData, dataStore));
    },
    getModificationOf: function (objectId) {
      return dataStore.modification.all().filter(function (m) {
        return m.obj === objectId;
      });
    }
  });
};

module.exports = AnntationData;


},{"./Container":93,"./setNewData":107,"./toJson":108}],95:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var importSource = _interopRequire(require("./importSource"));

var translateDenotation = _interopRequire(require("./translateDenotation"));

module.exports = function (span, entity, denotations, prefix) {
  importSource([span, entity], function (denotation) {
    return translateDenotation(prefix, denotation);
  }, denotations);
};


},{"./importSource":96,"./translateDenotation":101}],96:[function(require,module,exports){
"use strict";

module.exports = function (targets, translater, source) {
  if (source) {
    source = source.map(translater);
  }

  targets.forEach(function (target) {
    target.addSource(source);
  });
};


},{}],97:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var importSource = _interopRequire(require("./importSource"));

var translateModification = _interopRequire(require("./translateModification"));

module.exports = function (modification, modifications, prefix) {
  importSource([modification], function (modification) {
    return translateModification(prefix, modification);
  }, modifications);
};


},{"./importSource":96,"./translateModification":102}],98:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var importSource = _interopRequire(require("./importSource"));

module.exports = function (destination, source) {
  // Clone source to prevet changing orignal data.
  importSource([destination], function (namespace) {
    return _.extend({}, namespace);
  }, source);
};


},{"./importSource":96}],99:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var importSource = _interopRequire(require("./importSource"));

var translateRelation = _interopRequire(require("./translateRelation"));

module.exports = function (relation, relations, prefix) {
  importSource([relation], function (relation) {
    return translateRelation(prefix, relation);
  }, relations);
};


},{"./importSource":96,"./translateRelation":103}],100:[function(require,module,exports){
"use strict";

module.exports = function (src, prefix) {
  // An id will be generated if id is null.
  // But an undefined is convert to string as 'undefined' when it add to any string.
  return src.id ? prefix + src.id : null;
};


},{}],101:[function(require,module,exports){
"use strict";

var setIdPrefixIfExist = require("./setIdPrefixIfExist");

// Expected denotations is an Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
module.exports = function (prefix, src) {
  prefix = prefix || "";
  return _.extend({}, src, {
    // Do not convert  string unless id.
    id: setIdPrefixIfExist(src, prefix)
  });
};


},{"./setIdPrefixIfExist":100}],102:[function(require,module,exports){
"use strict";

var setIdPrefixIfExist = require("./setIdPrefixIfExist");

// Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
module.exports = function (prefix, src) {
  prefix = prefix || "";
  return _.extend({}, src, {
    id: setIdPrefixIfExist(src, prefix),
    obj: prefix + src.obj
  });
};


},{"./setIdPrefixIfExist":100}],103:[function(require,module,exports){
"use strict";

var setIdPrefixIfExist = require("./setIdPrefixIfExist");

// Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
module.exports = function (prefix, src) {
  prefix = prefix || "";
  return _.extend({}, src, {
    id: setIdPrefixIfExist(src, prefix),
    subj: prefix + src.subj,
    obj: prefix + src.obj
  });
};


},{"./setIdPrefixIfExist":100}],104:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var validateAnnotation = _interopRequire(require("./validateAnnotation"));

var importDenotation = _interopRequire(require("./importAnnotation/denotation"));

var importRelation = _interopRequire(require("./importAnnotation/relation"));

var importModification = _interopRequire(require("./importAnnotation/modification"));

module.exports = function (span, entity, relation, modification, paragraph, text, annotation, prefix) {
  var result = validateAnnotation(text, paragraph, annotation);

  importDenotation(span, entity, result.accept.denotation, prefix);

  importRelation(relation, result.accept.relation, prefix);

  importModification(modification, result.accept.modification, prefix);

  return result.reject;
};


},{"./importAnnotation/denotation":95,"./importAnnotation/modification":97,"./importAnnotation/relation":99,"./validateAnnotation":105}],105:[function(require,module,exports){
"use strict";

var validate = require("./validate"),
    hasLength = function (denotation) {
  return denotation.span.end - denotation.span.begin > 0;
},
    isInText = function (boundary, text) {
  return 0 <= boundary && boundary <= text.length;
},
    isBeginAndEndIn = function (text, denotation) {
  return isInText(denotation.span.begin, text) && isInText(denotation.span.end, text);
},
    isInParagraph = function (paragraph, denotation) {
  return paragraph.all().filter(function (p) {
    return p.begin <= denotation.span.begin && denotation.span.end <= p.end;
  }).length === 1;
},
    isContains = function (opt, data) {
  if (!opt.dictionary) return false;

  return opt.dictionary.filter(function (entry) {
    return entry.id === data[opt.property];
  }).length === 1;
},
    validateAnnotation = function (text, paragraph, annotation) {
  var resultDenotationHasLength = validate(annotation.denotations, hasLength),
      resultDenotationInText = validate(resultDenotationHasLength.accept, isBeginAndEndIn, text),
      resultDenotationInParagraph = validate(resultDenotationInText.accept, isInParagraph, paragraph),
      resultRelationObj = validate(annotation.relations, isContains, {
    property: "obj",
    dictionary: resultDenotationInParagraph.accept
  }),
      resultRelationSubj = validate(resultRelationObj.accept, isContains, {
    property: "subj",
    dictionary: resultDenotationInParagraph.accept
  }),
      resultModification = validate(annotation.modifications, isContains, {
    property: "obj",
    dictionary: _.union(resultDenotationInParagraph.accept, resultRelationSubj.accept)
  });

  return {
    accept: {
      denotation: resultDenotationInParagraph.accept,
      relation: resultRelationSubj.accept,
      modification: resultModification.accept
    },
    reject: {
      denotationHasLength: resultDenotationHasLength.reject,
      denotationInText: resultDenotationInText.reject,
      denotationInParagraph: resultDenotationInParagraph.reject,
      relationObj: resultRelationObj.reject,
      relationSubj: resultRelationSubj.reject,
      modification: resultModification.reject,
      hasError: resultDenotationHasLength.reject.length + resultDenotationInText.reject.length + resultDenotationInParagraph.reject.length + resultRelationObj.reject.length + resultRelationSubj.reject.length + resultModification.reject.length !== 0
    }
  };
};

module.exports = validateAnnotation;


},{"./validate":106}],106:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Reject = _interopRequire(require("../../../../Reject"));

module.exports = function (values, predicate, predicateOption) {
  if (!values) return new Reject();

  predicate = partial(predicate, predicateOption);

  return values.reduce(_.partial(acceptIf, predicate), new Reject());
};

function partial(func, opt) {
  if (!opt) return func;

  return _.partial(func, opt);
}

function acceptIf(predicate, result, target) {
  if (predicate(target)) {
    result.accept.push(target);
  } else {
    result.reject.push(target);
  }

  return result;
}


},{"../../../../Reject":63}],107:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var parseAnnotation = _interopRequire(require("./parseAnnotation"));

var importNamespace = _interopRequire(require("./parseAnnotation/importAnnotation/namespace"));

module.exports = function (dataStore, annotation) {
  parseBaseText(dataStore.paragraph, annotation.text);

  dataStore.sourceDoc = annotation.text;
  dataStore.config = annotation.config;

  return parseDennotation(dataStore, annotation);
};

function parseBaseText(paragraph, sourceDoc) {
  paragraph.addSource(sourceDoc);
}

function parseTracks(span, entity, relation, modification, paragraph, text, annotation) {
  if (!annotation.tracks) return [false, []];

  var tracks = annotation.tracks;
  delete annotation.tracks;

  var rejects = tracks.map(function (track, i) {
    var number = i + 1,
        prefix = "track" + number + "_",
        reject = parseAnnotation(span, entity, relation, modification, paragraph, text, track, prefix);

    reject.name = "Track " + number + " annotations.";
    return reject;
  });

  return [true, rejects];
}

function parseDennotation(dataStore, annotation) {
  var tracks = parseTracks(dataStore.span, dataStore.entity, dataStore.relation, dataStore.modification, dataStore.paragraph, annotation.text, annotation),
      annotationReject = parseAnnotation(dataStore.span, dataStore.entity, dataStore.relation, dataStore.modification, dataStore.paragraph, annotation.text, annotation);

  annotationReject.name = "Root annotations.";

  importNamespace(dataStore.namespace, annotation.namespaces);

  return {
    multitrack: tracks[0],
    rejects: [annotationReject].concat(tracks[1])
  };
}


},{"./parseAnnotation":104,"./parseAnnotation/importAnnotation/namespace":98}],108:[function(require,module,exports){
"use strict";

var toDenotation = function (dataStore) {
  return dataStore.entity.all().filter(function (entity) {
    // Span may be not exists, because crossing spans are not add to the dataStore.
    return dataStore.span.get(entity.span);
  }).map(function (entity) {
    var currentSpan = dataStore.span.get(entity.span);
    return {
      id: entity.id,
      span: {
        begin: currentSpan.begin,
        end: currentSpan.end
      },
      obj: entity.type
    };
  });
},
    toRelation = function (dataStore) {
  return dataStore.relation.all().map(function (r) {
    return {
      id: r.id,
      pred: r.type,
      subj: r.subj,
      obj: r.obj
    };
  });
},
    toJson = function (originalData, dataStore) {
  return _.extend({}, originalData, {
    denotations: toDenotation(dataStore),
    relations: toRelation(dataStore),
    modifications: dataStore.modification.all()
  });
};

module.exports = toJson;


},{}],109:[function(require,module,exports){
"use strict";

// histories of edit to undo and redo.
module.exports = function () {
  var lastSaveIndex = -1,
      lastEditIndex = -1,
      history = [],
      hasAnythingToUndo = function () {
    return lastEditIndex > -1;
  },
      hasAnythingToRedo = function () {
    return lastEditIndex < history.length - 1;
  },
      hasAnythingToSave = function () {
    return lastEditIndex != lastSaveIndex;
  },
      trigger = function () {
    api.trigger("change", {
      hasAnythingToSave: hasAnythingToSave(),
      hasAnythingToUndo: hasAnythingToUndo(),
      hasAnythingToRedo: hasAnythingToRedo()
    });
  };

  var api = require("../util/extendBindable")({
    reset: function () {
      lastSaveIndex = -1;
      lastEditIndex = -1;
      history = [];
      trigger();
    },
    push: function (commands) {
      history.splice(lastEditIndex + 1, history.length - lastEditIndex, commands);
      lastEditIndex++;
      trigger();
    },
    next: function () {
      lastEditIndex++;
      trigger();
      return history[lastEditIndex];
    },
    prev: function () {
      var lastEdit = history[lastEditIndex];
      lastEditIndex--;
      trigger();
      return lastEdit;
    },
    saved: function () {
      lastSaveIndex = lastEditIndex;
      trigger();
    },
    hasAnythingToSave: hasAnythingToSave,
    hasAnythingToUndo: hasAnythingToUndo,
    hasAnythingToRedo: hasAnythingToRedo
  });

  return api;
};


},{"../util/extendBindable":156}],110:[function(require,module,exports){
"use strict";

var AnnotationData = require("./AnnotationData");

module.exports = function (editor) {
  return {
    annotationData: new AnnotationData(editor),
    // A contaier of selection state.
    selectionModel: require("./Selection")(["span", "entity", "relation"])
  };
};


},{"./AnnotationData":94,"./Selection":112}],111:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter;

module.exports = function (kindName) {
  var emitter = new EventEmitter(),
      selected = {},
      triggerChange = function () {
    emitter.emit(kindName + ".change");
  },
      add = function (id) {
    selected[id] = id;
    emitter.emit(kindName + ".add", id);
    triggerChange();
  },
      all = function () {
    return _.toArray(selected);
  },
      has = function (id) {
    return _.contains(selected, id);
  },
      some = function () {
    return _.some(selected);
  },
      single = function () {
    var array = all();
    return array.length === 1 ? array[0] : null;
  },
      remove = function (id) {
    delete selected[id];
    emitter.emit(kindName + ".remove", id);
    triggerChange();
  },
      toggle = function (id) {
    if (has(id)) {
      remove(id);
    } else {
      add(id);
    }
  },
      clear = function () {
    if (!some()) return;

    _.each(all(), remove);
    selected = {};
    triggerChange();
  },
      mixin = {
    name: kindName,
    add: add,
    all: all,
    has: has,
    some: some,
    single: single,
    toggle: toggle,
    remove: remove,
    clear: clear
  },
      api = _.extend(emitter, mixin);

  return api;
};


},{"events":37}],112:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter,
    IdContainer = require("./IdContainer"),
    clearAll = function (containerList) {
  _.each(containerList, function (container) {
    container.clear();
  });
},
    someAll = function (containerList) {
  return containerList.map(function (container) {
    return container.some();
  }).reduce(function (a, b) {
    return a || b;
  });
},
    relayEventsOfEachContainer = function (emitter, containerList) {
  _.each(containerList, function (container) {
    container.on(container.name + ".change", function () {
      emitter.emit(container.name + ".change");
    }).on(container.name + ".add", function (id) {
      emitter.emit(container.name + ".select", id);
    }).on(container.name + ".remove", function (id) {
      emitter.emit(container.name + ".deselect", id);
    });
  });
},
    extendUtilFunctions = function (api, containerList) {
  return _.extend(api, {
    clear: _.partial(clearAll, containerList),
    some: _.partial(someAll, containerList)
  });
};

module.exports = function (kinds) {
  var emitter = new EventEmitter(),
      containerList = kinds.map(IdContainer),
      hash = containerList.reduce(function (a, b) {
    a[b.name] = b;
    return a;
  }, {}),
      api = _.extend(emitter, hash);

  relayEventsOfEachContainer(emitter, containerList);

  return extendUtilFunctions(api, containerList);
};


},{"./IdContainer":111,"events":37}],113:[function(require,module,exports){
"use strict";

module.exports = function (allSpans, candidateSpan) {
  return allSpans.filter(function (existSpan) {
    return existSpan.begin === candidateSpan.begin && existSpan.end === candidateSpan.end;
  }).length > 0;
};


},{}],114:[function(require,module,exports){
"use strict";

// A span its range is coross over with other spans are not able to rendered.
// Because spans are renderd with span tag. Html tags can not be cross over.
module.exports = function (spans, candidateSpan) {
  return spans.filter(function (existSpan) {
    return existSpan.begin < candidateSpan.begin && candidateSpan.begin < existSpan.end && existSpan.end < candidateSpan.end || candidateSpan.begin < existSpan.begin && existSpan.begin < candidateSpan.end && candidateSpan.end < existSpan.end;
  }).length > 0;
};


},{}],115:[function(require,module,exports){
"use strict";

module.exports = function (command, annotationData, selectionModel, clipBoard) {
  var copyEntities = function () {
    // Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
    clipBoard.clipBoard = _.uniq((function getEntitiesFromSelectedSpan() {
      return _.flatten(selectionModel.span.all().map(function (spanId) {
        return annotationData.span.get(spanId).getEntities();
      }));
    })().concat(selectionModel.entity.all())).map(function (entityId) {
      // Map entities to types, because entities may be delete.
      return annotationData.entity.get(entityId).type;
    });
  },
      pasteEntities = function () {
    // Make commands per selected spans from types in clipBoard.
    var commands = _.flatten(selectionModel.span.all().map(function (spanId) {
      return clipBoard.clipBoard.map(function (type) {
        return command.factory.entityCreateCommand({
          span: spanId,
          type: type
        });
      });
    }));

    command.invoke(commands);
  };

  return {
    copyEntities: copyEntities,
    pasteEntities: pasteEntities
  };
};


},{}],116:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter,
    replicate = require("./replicate"),
    createEntityToSelectedSpan = require("./createEntityToSelectedSpan"),
    DefaultEntityHandler = function (command, annotationData, selectionModel, modeAccordingToButton, spanConfig, entity) {
  var emitter = new EventEmitter(),
      replicateImple = function () {
    replicate(command, annotationData, modeAccordingToButton, spanConfig, selectionModel.span.single(), entity);
  },
      createEntityImple = function () {
    createEntityToSelectedSpan(command, selectionModel.span.all(), entity);

    emitter.emit("createEntity");
  };

  return _.extend(emitter, {
    replicate: replicateImple,
    createEntity: createEntityImple
  });
};

module.exports = DefaultEntityHandler;


},{"./createEntityToSelectedSpan":131,"./replicate":132,"events":37}],117:[function(require,module,exports){
"use strict";

var TypeGapCache = function () {
  var seed = {
    instanceHide: 0,
    instanceShow: 2
  },
      api = _.extend({}, seed),
      set = function (mode, val) {
    api[mode] = val;
    return val;
  },
      capitalize = require("../util/capitalize");

  _.each(seed, function (val, key) {
    api["set" + capitalize(key)] = _.partial(set, key);
  });

  return api;
},
    DisplayInstance = function (typeGap, instanceMode) {
  var showInstance = true,
      typeGapCache = new TypeGapCache(),
      updateTypeGap = function () {
    if (showInstance) {
      typeGap.set(typeGapCache.instanceShow);
    } else {
      typeGap.set(typeGapCache.instanceHide);
    }
  },
      setShowInstance = function (val) {
    showInstance = val;
    updateTypeGap();
  };

  instanceMode.on("show", function (argument) {
    setShowInstance(true);
  }).on("hide", function (argument) {
    setShowInstance(false);
  });

  return {
    showInstance: function () {
      return showInstance;
    },
    changeTypeGap: function (val) {
      if (showInstance) {
        typeGapCache.setInstanceShow(val);
      } else {
        typeGapCache.setInstanceHide(val);
      }

      updateTypeGap();
    },
    getTypeGap: function () {
      return typeGap();
    },
    notifyNewInstance: function () {
      if (!showInstance) toastr.success("an instance is created behind.");
    }
  };
};

module.exports = DisplayInstance;


},{"../util/capitalize":154}],118:[function(require,module,exports){
"use strict";

var RemoveCommandsFromSelection = require("./RemoveCommandsFromSelection");

module.exports = function (command, selectionModel, typeEditor) {
  return {
    newLabel: function () {
      if (selectionModel.entity.some() || selectionModel.relation.some()) {
        var newTypeLabel = prompt("Please enter a new label", "");
        if (newTypeLabel) {
          typeEditor.setNewType(newTypeLabel);
        }
      }
    },
    removeSelectedElements: function () {
      var commands = new RemoveCommandsFromSelection(command, selectionModel);
      command.invoke(commands);
    }
  };
};


},{"./RemoveCommandsFromSelection":127}],119:[function(require,module,exports){
"use strict";

module.exports = function (stateMachine) {
  return {
    toTerm: function () {
      stateMachine.setState("Term Contric");
    },
    toInstance: function () {
      stateMachine.setState("Instance / Relation");
    },
    toRelation: function () {
      stateMachine.setState("Relation Edit");
    }
  };
};


},{}],120:[function(require,module,exports){
"use strict";

var Machine = require("emitter-fsm"),
    StateMachine = function () {
  var m = new Machine({
    states: ["Init", "Term Contric", "Instance / Relation", "Relation Edit", "View Term", "View Instance"]
  });

  m.config("View Term", {
    to: {
      only: ["View Instance"]
    }
  });

  m.config("View Instance", {
    to: {
      only: ["View Term"]
    }
  });

  return m;
};

module.exports = StateMachine;


},{"emitter-fsm":35}],121:[function(require,module,exports){
"use strict";

var resetView = function (typeEditor, selectionModel) {
  typeEditor.hideDialogs();
  selectionModel.clear();
},
    Transition = function (typeEditor, selectionModel, viewMode, instanceEvent) {
  var api = {
    toTerm: function () {
      resetView(typeEditor, selectionModel);

      typeEditor.editEntity();
      viewMode.setTerm();
      viewMode.setEditable(true);

      instanceEvent.emit("hide");
    },
    toInstance: function () {
      resetView(typeEditor, selectionModel);

      typeEditor.editEntity();
      viewMode.setInstance();
      viewMode.setEditable(true);

      instanceEvent.emit("show");
    },
    toRelation: function () {
      resetView(typeEditor, selectionModel);

      typeEditor.editRelation();
      viewMode.setRelation();
      viewMode.setEditable(true);

      instanceEvent.emit("show");
    },
    toViewTerm: function () {
      resetView(typeEditor, selectionModel);

      viewMode.setTerm();
      viewMode.setEditable(false);

      instanceEvent.emit("hide");
    },
    toViewInstance: function () {
      resetView(typeEditor, selectionModel);

      viewMode.setInstance();
      viewMode.setEditable(false);

      instanceEvent.emit("show");
    }
  };

  return api;
};

module.exports = Transition;


},{}],122:[function(require,module,exports){
"use strict";

var Selector = require("../../view/Selector"),
    changeCssClass = function (editor, mode) {
  editor.removeClass("textae-editor_term-mode").removeClass("textae-editor_instance-mode").removeClass("textae-editor_relation-mode").addClass("textae-editor_" + mode + "-mode");
};

module.exports = function (editor, model, buttonStateHelper, modeAccordingToButton) {
  var selector = new Selector(editor, model),
      setSettingButtonEnable = _.partial(buttonStateHelper.enabled, "setting", true),
      setControlButtonForRelation = function (isRelation) {
    buttonStateHelper.enabled("replicate-auto", !isRelation);
    buttonStateHelper.enabled("boundary-detection", !isRelation);
    modeAccordingToButton["relation-edit-mode"].value(isRelation);
  },


  // This notify is off at relation-edit-mode.
  entitySelectChanged = _.compose(buttonStateHelper.updateByEntity, selector.entityLabel.update);

  var api = {
    setTerm: function () {
      changeCssClass(editor, "term");
      setSettingButtonEnable();
      setControlButtonForRelation(false);

      model.selectionModel.removeListener("entity.select", entitySelectChanged).removeListener("entity.deselect", entitySelectChanged).removeListener("entity.change", entitySelectChanged).on("entity.select", entitySelectChanged).on("entity.deselect", entitySelectChanged).on("entity.change", buttonStateHelper.updateByEntity);
    },
    setInstance: function () {
      changeCssClass(editor, "instance");
      setSettingButtonEnable();
      setControlButtonForRelation(false);

      model.selectionModel.removeListener("entity.select", entitySelectChanged).removeListener("entity.deselect", entitySelectChanged).removeListener("entity.change", buttonStateHelper.updateByEntity).on("entity.select", entitySelectChanged).on("entity.deselect", entitySelectChanged).on("entity.change", buttonStateHelper.updateByEntity);
    },
    setRelation: function () {
      changeCssClass(editor, "relation");
      setSettingButtonEnable();
      setControlButtonForRelation(true);

      model.selectionModel.removeListener("entity.select", entitySelectChanged).removeListener("entity.deselect", entitySelectChanged).removeListener("entity.change", buttonStateHelper.updateByEntity);
    },
    setEditable: function (isEditable) {
      if (isEditable) {
        editor.addClass("textae-editor_editable");
        buttonStateHelper.enabled("relation-edit-mode", true);
      } else {
        editor.removeClass("textae-editor_editable");
        buttonStateHelper.enabled("replicate-auto", false);
        buttonStateHelper.enabled("boundary-detection", false);
        buttonStateHelper.enabled("relation-edit-mode", false);
      }
    }
  };

  return api;
};


},{"../../view/Selector":197}],123:[function(require,module,exports){
"use strict";

module.exports = function (stateMachine) {
  return {
    toInstance: function () {
      stateMachine.setState("View Instance");
    },
    toTerm: function () {
      stateMachine.setState("View Term");
    },
    toRelation: function () {}
  };
};


},{}],124:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter,
    Machine = require("emitter-fsm"),
    ViewMode = require("./ViewMode"),
    StateMachine = require("./StateMachine"),
    Transition = require("./Transition"),
    ViewModeApi = require("./ViewModeApi"),
    EditModeApi = require("./EditModeApi"),
    setModeApi = function (typeEditor, viewMode, transition, editModeApi, viewModeApi, isEditable) {
  if (isEditable) {
    viewMode.setEditable(true);

    _.extend(transition, editModeApi);
  } else {
    typeEditor.noEdit();
    viewMode.setEditable(false);

    _.extend(transition, viewModeApi);
  }
};

module.exports = function (editor, model, typeEditor, buttonStateHelper, modeAccordingToButton) {
  var viewMode = new ViewMode(editor, model, buttonStateHelper, modeAccordingToButton),
      m = new StateMachine(),
      instanceEvent = new EventEmitter(),
      transition = new Transition(typeEditor, model.selectionModel, viewMode, instanceEvent),
      viewModeApi = new ViewModeApi(m),
      editModeApi = new EditModeApi(m);

  m.on("transition", function (e) {}).on("enter:Term Contric", transition.toTerm).on("enter:Instance / Relation", transition.toInstance).on("enter:Relation Edit", transition.toRelation).on("enter:View Term", transition.toViewTerm).on("enter:View Instance", transition.toViewInstance);

  instanceEvent.init = _.partial(setModeApi, typeEditor, viewMode, instanceEvent, editModeApi, viewModeApi);

  return instanceEvent;
};
// For debug.
// console.log(editor.editorId, 'from:', e.from, ' to:', e.to);


},{"./EditModeApi":119,"./StateMachine":120,"./Transition":121,"./ViewMode":122,"./ViewModeApi":123,"emitter-fsm":35,"events":37}],125:[function(require,module,exports){
"use strict";

var toggleModification = require("./toggleModification");

module.exports = function (command, annotationData, modeAccordingToButton, typeEditor) {
  return {
    negation: function () {
      toggleModification(command, annotationData, modeAccordingToButton, "Negation", typeEditor);
    },
    speculation: function () {
      toggleModification(command, annotationData, modeAccordingToButton, "Speculation", typeEditor);
    }
  };
};


},{"./toggleModification":138}],126:[function(require,module,exports){
"use strict";

var TypeEditor = require("./typeEditor/TypeEditor"),
    EditMode = require("./EditMode"),
    DisplayInstance = require("./DisplayInstance"),
    DefaultEntityHandler = require("./DefaultEntityHandler"),
    ClipBoardHandler = require("./ClipBoardHandler"),
    ModificationHandler = require("./ModificationHandler"),
    EditHandler = require("./EditHandler"),
    ToggleButtonHandler = require("./ToggleButtonHandler"),
    SelectSpanHandler = require("./SelectSpanHandler"),
    SetEditableHandler = require("./SetEditableHandler"),
    SettingDialog = require("../component/SettingDialog");

module.exports = function (editor, model, view, command, spanConfig, clipBoard, buttonController, typeGap, typeContainer) {
  var typeEditor = new TypeEditor(editor, model, spanConfig, command, buttonController.modeAccordingToButton, typeContainer),
      editMode = new EditMode(editor, model, typeEditor, buttonController.buttonStateHelper, buttonController.modeAccordingToButton),
      displayInstance = new DisplayInstance(typeGap, editMode),
      defaultEntityHandler = new DefaultEntityHandler(command, model.annotationData, model.selectionModel, buttonController.modeAccordingToButton, spanConfig, typeContainer.entity),
      clipBoardHandler = new ClipBoardHandler(command, model.annotationData, model.selectionModel, clipBoard),
      modificationHandler = new ModificationHandler(command, model.annotationData, buttonController.modeAccordingToButton, typeEditor),
      editHandler = new EditHandler(command, model.selectionModel, typeEditor),
      toggleButtonHandler = new ToggleButtonHandler(buttonController.modeAccordingToButton, editMode),
      selectSpanHandler = new SelectSpanHandler(model.annotationData, model.selectionModel),
      setEditableHandler = new SetEditableHandler(model.annotationData, editMode),
      showSettingDialog = new SettingDialog(editor, editMode, displayInstance),
      editorSelected = function () {
    typeEditor.hideDialogs();

    // Select this editor.
    editor.eventEmitter.trigger("textae.editor.select");
    buttonController.buttonStateHelper.propagate();
  };

  return {
    init: function () {
      // The jsPlumbConnetion has an original event mecanism.
      // We can only bind the connection directory.
      editor.on("textae.editor.jsPlumbConnection.add", function (event, jsPlumbConnection) {
        jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked);
      });

      defaultEntityHandler.on("createEntity", displayInstance.notifyNewInstance);
    },
    setMode: setEditableHandler.bindSetDefaultEditMode,
    event: {
      editorSelected: editorSelected,
      copyEntities: clipBoardHandler.copyEntities,
      removeSelectedElements: editHandler.removeSelectedElements,
      createEntity: defaultEntityHandler.createEntity,
      showPallet: typeEditor.showPallet,
      replicate: defaultEntityHandler.replicate,
      pasteEntities: clipBoardHandler.pasteEntities,
      newLabel: editHandler.newLabel,
      cancelSelect: typeEditor.cancelSelect,
      selectLeftSpan: selectSpanHandler.selectLeftSpan,
      selectRightSpan: selectSpanHandler.selectRightSpan,
      toggleDetectBoundaryMode: toggleButtonHandler.toggleDetectBoundaryMode,
      toggleRelationEditMode: toggleButtonHandler.toggleRelationEditMode,
      negation: modificationHandler.negation,
      speculation: modificationHandler.speculation,
      showSettingDialog: showSettingDialog
    }
  };
};


},{"../component/SettingDialog":74,"./ClipBoardHandler":115,"./DefaultEntityHandler":116,"./DisplayInstance":117,"./EditHandler":118,"./EditMode":124,"./ModificationHandler":125,"./SelectSpanHandler":128,"./SetEditableHandler":129,"./ToggleButtonHandler":130,"./typeEditor/TypeEditor":144}],127:[function(require,module,exports){
"use strict";

var toRomeveSpanCommands = function (spanIds, command) {
  return spanIds.map(command.factory.spanRemoveCommand);
},
    toRemoveEntityCommands = function (entityIds, command) {
  return command.factory.entityRemoveCommand(entityIds);
},
    toRemoveRelationCommands = function (relationIds, command) {
  return relationIds.map(command.factory.relationRemoveCommand);
},
    getAll = function (command, spanIds, entityIds, relationIds) {
  return [].concat(toRemoveRelationCommands(relationIds, command), toRemoveEntityCommands(entityIds, command), toRomeveSpanCommands(spanIds, command));
},
    RemoveCommandsFromSelection = function (command, selectionModel) {
  var spanIds = _.uniq(selectionModel.span.all()),
      entityIds = _.uniq(selectionModel.entity.all()),
      relationIds = _.uniq(selectionModel.relation.all());

  return getAll(command, spanIds, entityIds, relationIds);
};


module.exports = RemoveCommandsFromSelection;


},{}],128:[function(require,module,exports){
"use strict";

module.exports = function (annotationData, selectionModel) {
  return {
    selectLeftSpan: function () {
      var spanId = selectionModel.span.single();
      if (spanId) {
        var span = annotationData.span.get(spanId);
        selectionModel.clear();
        if (span.left) {
          selectionModel.span.add(span.left.id);
        }
      }
    },
    selectRightSpan: function () {
      var spanId = selectionModel.span.single();
      if (spanId) {
        var span = annotationData.span.get(spanId);
        selectionModel.clear();
        if (span.right) {
          selectionModel.span.add(span.right.id);
        }
      }
    }
  };
};


},{}],129:[function(require,module,exports){
"use strict";

var setDefaultEditMode = require("./setDefaultEditMode");

module.exports = function (annotationData, editMode) {
  return {
    bindSetDefaultEditMode: function (mode) {
      var isEditable = mode === "edit";

      annotationData.on("all.change", function (annotationData) {
        setDefaultEditMode(editMode, isEditable, annotationData);
      });
    }
  };
};


},{"./setDefaultEditMode":133}],130:[function(require,module,exports){
"use strict";

module.exports = function (modeAccordingToButton, editMode) {
  return {
    toggleDetectBoundaryMode: function () {
      modeAccordingToButton["boundary-detection"].toggle();
    },
    toggleRelationEditMode: function () {
      if (modeAccordingToButton["relation-edit-mode"].value()) {
        editMode.toInstance();
      } else {
        editMode.toRelation();
      }
    }
  };
};


},{}],131:[function(require,module,exports){
"use strict";

module.exports = function (command, spans, entity) {
  var commands = spans.map(function (spanId) {
    return command.factory.entityCreateCommand({
      span: spanId,
      type: entity.getDefaultType()
    });
  });

  command.invoke(commands);
};


},{}],132:[function(require,module,exports){
"use strict";

var getDetectBoundaryFunc = function (modeAccordingToButton, spanConfig) {
  if (modeAccordingToButton["boundary-detection"].value()) return spanConfig.isDelimiter;else return null;
},
    replicate = function (command, annotationData, modeAccordingToButton, spanConfig, spanId, entity) {
  var detectBoundaryFunc = getDetectBoundaryFunc(modeAccordingToButton, spanConfig);

  if (spanId) {
    command.invoke([command.factory.spanReplicateCommand(entity.getDefaultType(), annotationData.span.get(spanId), detectBoundaryFunc)]);
  } else {
    alert("You can replicate span annotation when there is only span selected.");
  }
};

module.exports = replicate;


},{}],133:[function(require,module,exports){
"use strict";

var setDefaultEditMode = function (editMode, isEditable, annotationData) {
  editMode.init(isEditable);

  // Change view mode accoding to the annotation data.
  if (annotationData.relation.some() || annotationData.span.multiEntities().length > 0) {
    editMode.toInstance();
  } else {
    editMode.toTerm();
  }
};

module.exports = setDefaultEditMode;


},{}],134:[function(require,module,exports){
"use strict";

var skipBlank = require("./skipBlank");

module.exports = {
  backFromBegin: function (str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter);
  },
  forwardFromEnd: function (str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter);
  },
  forwardFromBegin: function (str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter);
  },
  backFromEnd: function (str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter);
  }
};


},{"./skipBlank":136}],135:[function(require,module,exports){
"use strict";

var skipCharacters = require("./skipCharacters"),
    skipBlank = require("./skipBlank"),
    getPrev = function (str, position) {
  return [str.charAt(position), str.charAt(position - 1)];
},
    getNext = function (str, position) {
  return [str.charAt(position), str.charAt(position + 1)];
},
    backToDelimiter = function (str, position, isDelimiter) {
  return skipCharacters(getPrev, -1, str, position, function (chars) {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).     
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1]);
  });
},
    skipToDelimiter = function (str, position, isDelimiter) {
  return skipCharacters(getNext, 1, str, position, function (chars) {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).     
    // Return false to stop an infinite loop when the character undefined.
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1]);
  });
},
    isNotWord = function (isBlankCharacter, isDelimiter, chars) {
  // The word is (no charactor || blank || delimiter)(!delimiter).
  return chars[0] !== "" && !isBlankCharacter(chars[1]) && !isDelimiter(chars[1]) || isDelimiter(chars[0]);
},
    skipToWord = function (str, position, isWordEdge) {
  return skipCharacters(getPrev, 1, str, position, isWordEdge);
},
    backToWord = function (str, position, isWordEdge) {
  return skipCharacters(getNext, -1, str, position, isWordEdge);
},
    backFromBegin = function (str, beginPosition, spanConfig) {
  var nonEdgePos = skipBlank.forward(str, beginPosition, spanConfig.isBlankCharacter),
      nonDelimPos = backToDelimiter(str, nonEdgePos, spanConfig.isDelimiter);

  return nonDelimPos;
},
    forwardFromEnd = function (str, endPosition, spanConfig) {
  var nonEdgePos = skipBlank.back(str, endPosition, spanConfig.isBlankCharacter),
      nonDelimPos = skipToDelimiter(str, nonEdgePos, spanConfig.isDelimiter);

  return nonDelimPos;
},


// adjust the beginning position of a span for shortening
forwardFromBegin = function (str, beginPosition, spanConfig) {
  var isWordEdge = _.partial(isNotWord, spanConfig.isBlankCharacter, spanConfig.isDelimiter);
  return skipToWord(str, beginPosition, isWordEdge);
},


// adjust the end position of a span for shortening
backFromEnd = function (str, endPosition, spanConfig) {
  var isWordEdge = _.partial(isNotWord, spanConfig.isBlankCharacter, spanConfig.isDelimiter);
  return backToWord(str, endPosition, isWordEdge);
};

module.exports = {
  backFromBegin: backFromBegin,
  forwardFromEnd: forwardFromEnd,
  forwardFromBegin: forwardFromBegin,
  backFromEnd: backFromEnd
};


},{"./skipBlank":136,"./skipCharacters":137}],136:[function(require,module,exports){
"use strict";

var skipCharacters = require("./skipCharacters"),
    getNow = function (str, position) {
  return str.charAt(position);
},
    skipForwardBlank = function (str, position, isBlankCharacter) {
  return skipCharacters(getNow, 1, str, position, isBlankCharacter);
},
    skipBackBlank = function (str, position, isBlankCharacter) {
  return skipCharacters(getNow, -1, str, position, isBlankCharacter);
};

module.exports = {
  forward: skipForwardBlank,
  back: skipBackBlank
};


},{"./skipCharacters":137}],137:[function(require,module,exports){
"use strict";

module.exports = function (getChars, step, str, position, predicate) {
  while (predicate(getChars(str, position))) position += step;

  return position;
};


},{}],138:[function(require,module,exports){
"use strict";

var isModificationType = function (modification, modificationType) {
  return modification.pred === modificationType;
},
    getSpecificModification = function (annotationData, id, modificationType) {
  return annotationData.getModificationOf(id).filter(function (modification) {
    return isModificationType(modification, modificationType);
  });
},
    removeModification = function (command, annotationData, modificationType, typeEditor) {
  return typeEditor.getSelectedIdEditable().map(function (id) {
    var modification = getSpecificModification(annotationData, id, modificationType)[0];
    return command.factory.modificationRemoveCommand(modification.id);
  });
},
    createModification = function (command, annotationData, modificationType, typeEditor) {
  return _.reject(typeEditor.getSelectedIdEditable(), function (id) {
    return getSpecificModification(annotationData, id, modificationType).length > 0;
  }).map(function (id) {
    return command.factory.modificationCreateCommand({
      obj: id,
      pred: modificationType
    });
  });
},
    createCommand = function (command, annotationData, modificationType, typeEditor, has) {
  if (has) {
    return removeModification(command, annotationData, modificationType, typeEditor);
  } else {
    return createModification(command, annotationData, modificationType, typeEditor);
  }
},
    toggleModification = function (command, annotationData, modeAccordingToButton, modificationType, typeEditor) {
  var has = modeAccordingToButton[modificationType.toLowerCase()].value(),
      commands = createCommand(command, annotationData, modificationType, typeEditor, has);
  command.invoke(commands);
};

module.exports = toggleModification;


},{}],139:[function(require,module,exports){
"use strict";

var dismissBrowserSelection = require("./dismissBrowserSelection");

module.exports = function (editor, model, spanConfig, command, modeAccordingToButton, typeContainer) {
  var handler = {
    changeTypeOfSelected: null,
    getSelectedIdEditable: null,
    // The Reference to content to be shown in the pallet.
    typeContainer: null,
    // A Swithing point to change a behavior when relation is clicked.
    jsPlumbConnectionClicked: null
  },
      emitter = require("../../util/extendBindable")({}),
      unbindAllEventhandler = function () {
    return editor.off("mouseup", ".textae-editor__body").off("mouseup", ".textae-editor__span").off("mouseup", ".textae-editor__span_block").off("mouseup", ".textae-editor__type-label").off("mouseup", ".textae-editor__entity-pane").off("mouseup", ".textae-editor__entity");
  },
      changeType = function (getSelectedAndEditable, createChangeTypeCommandFunction, newType) {
    var ids = getSelectedAndEditable();
    if (ids.length > 0) {
      var commands = ids.map(function (id) {
        return createChangeTypeCommandFunction(id, newType);
      });

      command.invoke(commands);
    }
  },
      getSelectionSnapShot = function () {
    var selection = window.getSelection(),
        snapShot = {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset,
      range: selection.getRangeAt(0)
    };

    dismissBrowserSelection();

    // Return the snap shot of the selection.
    return snapShot;
  },
      cancelSelect = function () {
    emitter.trigger("cancel.select");
  },
      noEdit = function () {
    unbindAllEventhandler();

    handler.typeContainer = null;
    handler.changeTypeOfSelected = null;
    handler.getSelectedIdEditable = null;
    handler.jsPlumbConnectionClicked = null;
  },
      editRelation = (function () {
    var entityClickedAtRelationMode = function (e) {
      if (!model.selectionModel.entity.some()) {
        model.selectionModel.clear();
        model.selectionModel.entity.add($(e.target).attr("title"));
      } else {
        // Cannot make a self reference relation.
        var subjectEntityId = model.selectionModel.entity.all()[0];
        var objectEntityId = $(e.target).attr("title");

        if (subjectEntityId === objectEntityId) {
          // Deslect already selected entity.
          model.selectionModel.entity.remove(subjectEntityId);
        } else {
          model.selectionModel.entity.add(objectEntityId);
          _.defer(function () {
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
    selectRelation = function (jsPlumbConnection, event) {
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
        returnFalse = function () {
      return false;
    };

    return function () {
      // Control only entities and relations.
      // Cancel events of relations and theier label.
      // Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
      // And jQuery events are propergated to body click events and cancel select.
      // So multi selection of relations with Ctrl-key is not work.
      unbindAllEventhandler().on("mouseup", ".textae-editor__entity", entityClickedAtRelationMode).on("mouseup", ".textae-editor__relation, .textae-editor__relation__label", returnFalse).on("mouseup", ".textae-editor__body", cancelSelect);

      handler.typeContainer = typeContainer.relation;
      handler.getSelectedIdEditable = model.selectionModel.relation.all;
      handler.changeTypeOfSelected = _.partial(changeType, handler.getSelectedIdEditable, command.factory.relationChangeTypeCommand);

      handler.jsPlumbConnectionClicked = selectRelation;
    };
  })(),
      editEntity = (function () {
    var selectEnd = require("./SelectEnd")(editor, model, command, modeAccordingToButton, typeContainer),
        bodyClicked = function () {
      var selection = window.getSelection();

      // No select
      if (selection.isCollapsed) {
        cancelSelect();
      } else {
        selectEnd.onText({
          spanConfig: spanConfig,
          selection: getSelectionSnapShot()
        });
      }
    },
        selectSpan = (function () {
      var getBlockEntities = function (spanId) {
        return _.flatten(model.annotationData.span.get(spanId).getTypes().filter(function (type) {
          return typeContainer.entity.isBlock(type.name);
        }).map(function (type) {
          return type.entities;
        }));
      },
          operateSpanWithBlockEntities = function (method, spanId) {
        model.selectionModel.span[method](spanId);
        if (editor.find("#" + spanId).hasClass("textae-editor__span--block")) {
          getBlockEntities(spanId).forEach(model.selectionModel.entity[method]);
        }
      },
          selectSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, "add"),
          toggleSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, "toggle");

      return function (event) {
        var firstId = model.selectionModel.span.single(),
            target = event.target,
            id = target.id;

        if (event.shiftKey && firstId) {
          //select reange of spans.
          model.selectionModel.clear();
          model.annotationData.span.range(firstId, id).forEach(function (spanId) {
            selectSpanWithBlockEnities(spanId);
          });
        } else if (event.ctrlKey || event.metaKey) {
          toggleSpanWithBlockEnities(id);
        } else {
          model.selectionModel.clear();
          selectSpanWithBlockEnities(id);
        }
      };
    })(),
        spanClicked = function (event) {
      var selection = window.getSelection();

      // No select
      if (selection.isCollapsed) {
        selectSpan(event);
        return false;
      } else {
        selectEnd.onSpan({
          spanConfig: spanConfig,
          selection: getSelectionSnapShot()
        });
        // Cancel selection of a paragraph.
        // And do non propagate the parent span.
        event.stopPropagation();
      }
    },
        labelOrPaneClicked = function (ctrlKey, $typeLabel, $entities) {
      var selectEntities = function ($entities) {
        $entities.each(function () {
          model.selectionModel.entity.add($(this).attr("title"));
        });
      },
          deselectEntities = function ($entities) {
        $entities.each(function () {
          model.selectionModel.entity.remove($(this).attr("title"));
        });
      };

      dismissBrowserSelection();

      if (ctrlKey) {
        if ($typeLabel.hasClass("ui-selected")) {
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
        typeLabelClicked = function (e) {
      var $typeLabel = $(e.target);
      return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typeLabel, $typeLabel.next().children());
    },
        entityClicked = function (e) {
      dismissBrowserSelection();

      var $target = $(e.target);
      if (e.ctrlKey || e.metaKey) {
        model.selectionModel.entity.toggle($target.attr("title"));
      } else {
        model.selectionModel.clear();
        model.selectionModel.entity.add($target.attr("title"));
      }
      return false;
    },
        entityPaneClicked = function (e) {
      var $typePane = $(e.target);
      return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typePane.prev(), $typePane.children());
    },
        createEntityChangeTypeCommand = function (id, newType) {
      return command.factory.entityChangeTypeCommand(id, newType, typeContainer.entity.isBlock(newType));
    };

    return function () {
      unbindAllEventhandler().on("mouseup", ".textae-editor__body", bodyClicked).on("mouseup", ".textae-editor__span", spanClicked).on("mouseup", ".textae-editor__type-label", typeLabelClicked).on("mouseup", ".textae-editor__entity-pane", entityPaneClicked).on("mouseup", ".textae-editor__entity", entityClicked);

      handler.typeContainer = typeContainer.entity;
      handler.getSelectedIdEditable = model.selectionModel.entity.all;
      handler.changeTypeOfSelected = _.partial(changeType, handler.getSelectedIdEditable, createEntityChangeTypeCommand);

      handler.jsPlumbConnectionClicked = null;
    };
  })();

  return _.extend({
    handler: handler,
    start: {
      noEdit: noEdit,
      editRelation: editRelation,
      editEntity: editEntity
    }
  }, emitter);
};


},{"../../util/extendBindable":156,"./SelectEnd":140,"./dismissBrowserSelection":146}],140:[function(require,module,exports){
"use strict";

var SpanEditor = require("./SpanEditor"),
    selectEndOnText = function (selectionValidater, spanEditor, data) {
  var isValid = selectionValidater.validateOnText(data.spanConfig, data.selection);

  if (isValid) {
    _.compose(spanEditor.expand, spanEditor.create)(data);
  }
},
    selectEndOnSpan = function (selectionValidater, spanEditor, data) {
  var isValid = selectionValidater.validateOnSpan(data.spanConfig, data.selection);

  if (isValid) {
    _.compose(spanEditor.shrink, spanEditor.expand, spanEditor.create)(data);
  }
};

module.exports = function (editor, model, command, modeAccordingToButton, typeContainer) {
  var selectionParser = require("./selectionParser")(editor, model),
      selectionValidater = require("./SelectionValidater")(selectionParser),


  // Initiated by events.
  selectEndOnTextImpl = null,
      selectEndOnSpanImpl = null,
      changeSpanEditorAccordingToButtons = function () {
    var isDetectDelimiterEnable = modeAccordingToButton["boundary-detection"].value(),
        isReplicateAuto = modeAccordingToButton["replicate-auto"].value(),
        spanEditor = new SpanEditor(editor, model, command, typeContainer, isDetectDelimiterEnable, isReplicateAuto);

    selectEndOnTextImpl = _.partial(selectEndOnText, selectionValidater, spanEditor);
    selectEndOnSpanImpl = _.partial(selectEndOnSpan, selectionValidater, spanEditor);
  };

  // Change spanEditor according to the  buttons state.
  changeSpanEditorAccordingToButtons();

  modeAccordingToButton["boundary-detection"].bind("change", changeSpanEditorAccordingToButtons);

  modeAccordingToButton["replicate-auto"].bind("change", changeSpanEditorAccordingToButtons);

  return {
    onText: function (data) {
      if (selectEndOnTextImpl) selectEndOnTextImpl(data);
    },
    onSpan: function (data) {
      if (selectEndOnSpanImpl) selectEndOnSpanImpl(data);
    }
  };
};


},{"./SelectionValidater":141,"./SpanEditor":142,"./selectionParser":148}],141:[function(require,module,exports){
"use strict";

var deferAlert = require("./deferAlert");

module.exports = function (parser) {
  var showAlertIfOtherSpan = function (selection) {
    if (parser.isInSameParagraph(selection)) {
      return true;
    }

    deferAlert("It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.");
    return false;
  },
      commonValidate = function (spanConfig, selection) {
    // This order is not important.
    return showAlertIfOtherSpan(selection) && parser.isAnchrNodeInSpanOrParagraph(selection) && parser.hasCharacters(spanConfig, selection);
  },
      validateOnText = function (spanConfig, selection) {
    // This order is important, because showAlertIfOtherSpan is show alert.
    return parser.isFocusNodeInParagraph(selection) && commonValidate(spanConfig, selection);
  },
      validateOnSpan = function (spanConfig, selection) {
    // This order is important, because showAlertIfOtherSpan is show alert.
    return parser.isFocusNodeInSpan(selection) && commonValidate(spanConfig, selection);
  };

  return {
    validateOnText: validateOnText,
    validateOnSpan: validateOnSpan
  };
};


},{"./deferAlert":145}],142:[function(require,module,exports){
"use strict";

var idFactory = require("../../util/idFactory"),
    moveSpan = function (editor, command, spanId, newSpan) {
  // Do not need move.
  if (spanId === idFactory.makeSpanId(editor, newSpan)) {
    return;
  }

  return [command.factory.spanMoveCommand(spanId, newSpan)];
},
    removeSpan = function (command, spanId) {
  return [command.factory.spanRemoveCommand(spanId)];
},
    isBoundaryCrossingWithOtherSpans = require("../../model/isBoundaryCrossingWithOtherSpans"),
    isAlreadySpaned = require("../../model/isAlreadySpaned"),
    DoCreate = function (model, command, typeContainer, spanManipulater, isDetectDelimiterEnable, isReplicateAuto, data) {
  var BLOCK_THRESHOLD = 100,
      newSpan = spanManipulater.create(data.selection, data.spanConfig);

  // The span cross exists spans.
  if (isBoundaryCrossingWithOtherSpans(model.annotationData.span.all(), newSpan)) {
    return;
  }

  // The span exists already.
  if (isAlreadySpaned(model.annotationData.span.all(), newSpan)) {
    return;
  }

  var commands = [command.factory.spanCreateCommand(typeContainer.entity.getDefaultType(), {
    begin: newSpan.begin,
    end: newSpan.end
  })];

  if (isReplicateAuto && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
    commands.push(command.factory.spanReplicateCommand(typeContainer.entity.getDefaultType(), {
      begin: newSpan.begin,
      end: newSpan.end
    }, isDetectDelimiterEnable ? data.spanConfig.isDelimiter : null));
  }

  command.invoke(commands);
},
    deferAlert = require("./deferAlert"),
    expandSpanToSelection = function (editor, model, command, spanManipulater, spanId, data) {
  var newSpan = spanManipulater.expand(spanId, data.selection, data.spanConfig);

  // The span cross exists spans.
  if (isBoundaryCrossingWithOtherSpans(model.annotationData.span.all(), newSpan)) {
    deferAlert("A span cannot be expanded to make a boundary crossing.");
    return;
  }

  command.invoke(moveSpan(editor, command, spanId, newSpan));
},
    DoExpand = function (model, selectionParser, expandSpanToSelection, data) {
  // If a span is selected, it is able to begin drag a span in the span and expand the span.
  // The focus node should be at one level above the selected node.
  if (selectionParser.isAnchorInSelectedSpan(data.selection)) {
    // cf.
    // 1. one side of a inner span is same with one side of the outside span.
    // 2. Select an outside span.
    // 3. Begin Drug from an inner span to out of an outside span.
    // Expand the selected span.
    expandSpanToSelection(model.selectionModel.span.single(), data);
  } else if (selectionParser.isAnchorOneDownUnderForcus(data.selection)) {
    // To expand the span , belows are needed:
    // 1. The anchorNode is in the span.
    // 2. The foucusNode is out of the span and in the parent of the span.
    expandSpanToSelection(data.selection.anchorNode.parentNode.id, data);
  } else {
    return data;
  }
},
    shrinkSpanToSelection = function (editor, model, command, spanManipulater, spanId, data) {
  var newSpan = spanManipulater.shrink(spanId, data.selection, data.spanConfig);

  // The span cross exists spans.
  if (isBoundaryCrossingWithOtherSpans(model.annotationData.span.all(), newSpan)) {
    deferAlert("A span cannot be shrinked to make a boundary crossing.");
    return;
  }

  var newSpanId = idFactory.makeSpanId(editor, newSpan),
      sameSpan = model.annotationData.span.get(newSpanId);

  command.invoke(newSpan.begin < newSpan.end && !sameSpan ? moveSpan(editor, command, spanId, newSpan) : removeSpan(command, spanId));
},
    DoShrink = function (model, selectionParser, doShrinkSpanToSelection, data) {
  if (selectionParser.isFocusInSelectedSpan(data.selection)) {
    // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
    // The focus node should be at the selected node.
    // cf.
    // 1. Select an inner span.
    // 2. Begin Drug from out of an outside span to the selected span.
    // Shrink the selected span.
    doShrinkSpanToSelection(model.selectionModel.span.single(), data);
  } else if (selectionParser.isForcusOneDownUnderAnchor(data.selection)) {
    // To shrink the span , belows are needed:
    // 1. The anchorNode out of the span and in the parent of the span.
    // 2. The foucusNode is in the span.
    doShrinkSpanToSelection(data.selection.focusNode.parentNode.id, data);
  }
},
    SpanEditor = function (editor, model, command, typeContainer, isDetectDelimiterEnable, isReplicateAuto) {
  var delimiterDetectAdjuster = require("../spanAdjuster/delimiterDetectAdjuster"),
      blankSkipAdjuster = require("../spanAdjuster/blankSkipAdjuster"),
      spanAdjuster = isDetectDelimiterEnable ? delimiterDetectAdjuster : blankSkipAdjuster,
      spanManipulater = require("./SpanManipulater")(model, spanAdjuster),
      selectionParser = require("./selectionParser")(editor, model),
      doCreate = _.partial(DoCreate, model, command, typeContainer, spanManipulater, isDetectDelimiterEnable, isReplicateAuto),
      doExpandSpanToSelection = _.partial(expandSpanToSelection, editor, model, command, spanManipulater),
      doExpand = _.partial(DoExpand, model, selectionParser, doExpandSpanToSelection),
      doShrinkSpanToSelection = _.partial(shrinkSpanToSelection, editor, model, command, spanManipulater),
      doShrink = _.partial(DoShrink, model, selectionParser, doShrinkSpanToSelection),
      processSelectionIf = function (doFunc, predicate, data) {
    if (data && predicate(data.selection)) {
      return doFunc(data);
    }
    return data;
  };

  return {
    create: _.partial(processSelectionIf, doCreate, selectionParser.isInOneParent),
    expand: _.partial(processSelectionIf, doExpand, selectionParser.isAnchrNodeInSpan),
    shrink: _.partial(processSelectionIf, doShrink, selectionParser.isFocusNodeInSpan) };
};

module.exports = SpanEditor;


},{"../../model/isAlreadySpaned":113,"../../model/isBoundaryCrossingWithOtherSpans":114,"../../util/idFactory":158,"../spanAdjuster/blankSkipAdjuster":134,"../spanAdjuster/delimiterDetectAdjuster":135,"./SpanManipulater":143,"./deferAlert":145,"./selectionParser":148}],143:[function(require,module,exports){
"use strict";

module.exports = function (model, spanAdjuster) {
  var selectPosition = require("./selectPosition"),
      createSpan = (function () {
    var toSpanPosition = function (selection, spanConfig) {
      var positions = selectPosition.toPositions(model.annotationData, selection);
      return {
        begin: spanAdjuster.backFromBegin(model.annotationData.sourceDoc, positions.anchorPosition, spanConfig),
        end: spanAdjuster.forwardFromEnd(model.annotationData.sourceDoc, positions.focusPosition - 1, spanConfig) + 1
      };
    };

    return function (selection, spanConfig) {
      model.selectionModel.clear();
      return toSpanPosition(selection, spanConfig);
    };
  })(),
      expandSpan = (function () {
    var getNewSpan = function (spanId, selectionRange, anchorNodeRange, focusPosition, spanConfig) {
      var span = model.annotationData.span.get(spanId);

      if (selectionRange.compareBoundaryPoints(Range.START_TO_START, anchorNodeRange) < 0) {
        // expand to the left
        return {
          begin: spanAdjuster.backFromBegin(model.annotationData.sourceDoc, focusPosition, spanConfig),
          end: span.end
        };
      } else {
        // expand to the right
        return {
          begin: span.begin,
          end: spanAdjuster.forwardFromEnd(model.annotationData.sourceDoc, focusPosition - 1, spanConfig) + 1
        };
      }
    };

    return function (spanId, selection, spanConfig) {
      model.selectionModel.clear();

      var anchorNodeRange = document.createRange();
      anchorNodeRange.selectNode(selection.anchorNode);
      var focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

      return getNewSpan(spanId, selection.range, anchorNodeRange, focusPosition, spanConfig);
    };
  })(),
      shortenSpan = (function () {
    var getNewSpan = function (spanId, selectionRange, focusNodeRange, focusPosition, spanConfig) {
      var span = model.annotationData.span.get(spanId);
      if (selectionRange.compareBoundaryPoints(Range.START_TO_START, focusNodeRange) > 0) {
        // shorten the right boundary
        if (span.begin === focusPosition) return {
          begin: span.begin,
          end: span.begin
        };

        return {
          begin: span.begin,
          end: spanAdjuster.backFromEnd(model.annotationData.sourceDoc, focusPosition - 1, spanConfig) + 1
        };
      } else {
        // shorten the left boundary
        if (span.end === focusPosition) return {
          begin: span.end,
          end: span.end
        };

        return {
          begin: spanAdjuster.forwardFromBegin(model.annotationData.sourceDoc, focusPosition, spanConfig),
          end: span.end
        };
      }
    };

    return function (spanId, selection, spanConfig) {
      model.selectionModel.clear();

      var focusNodeRange = document.createRange();
      focusNodeRange.selectNode(selection.focusNode);
      var focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

      return getNewSpan(spanId, selection.range, focusNodeRange, focusPosition, spanConfig);
    };
  })();

  return {
    create: createSpan,
    expand: expandSpan,
    shrink: shortenSpan
  };
};


},{"./selectPosition":147}],144:[function(require,module,exports){
"use strict";

var dismissBrowserSelection = require("./dismissBrowserSelection");

module.exports = function (editor, model, spanConfig, command, modeAccordingToButton, typeContainer) {
  // will init.
  var elementEditor = require("./ElementEditor")(editor, model, spanConfig, command, modeAccordingToButton, typeContainer),
      pallet = require("../../component/Pallet")(),
      cancelSelect = function () {
    pallet.hide();
    model.selectionModel.clear();
    dismissBrowserSelection();
  },


  // A relation is drawn by a jsPlumbConnection.
  // The EventHandlar for clieck event of jsPlumbConnection.
  jsPlumbConnectionClicked = function (jsPlumbConnection, event) {
    // Check the event is processed already.
    // Because the jsPlumb will call the event handler twice
    // when a label is clicked that of a relation added after the initiation.
    if (elementEditor.handler.jsPlumbConnectionClicked && !event.processedByTextae) {
      elementEditor.handler.jsPlumbConnectionClicked(jsPlumbConnection, event);
    }

    event.processedByTextae = true;
  };

  // Bind events.
  elementEditor.bind("cancel.select", cancelSelect);

  pallet.bind("type.select", function (label) {
    pallet.hide();
    elementEditor.handler.changeTypeOfSelected(label);
  }).bind("default-type.select", function (label) {
    pallet.hide();
    elementEditor.handler.typeContainer.setDefaultType(label);
  });


  return {
    editRelation: elementEditor.start.editRelation,
    editEntity: elementEditor.start.editEntity,
    noEdit: elementEditor.start.noEdit,
    showPallet: function (point) {
      pallet.show(elementEditor.handler.typeContainer, point);
    },
    setNewType: function (newTypeName) {
      elementEditor.handler.changeTypeOfSelected(newTypeName);
    },
    hideDialogs: pallet.hide,
    cancelSelect: cancelSelect,
    jsPlumbConnectionClicked: jsPlumbConnectionClicked,
    getSelectedIdEditable: function () {
      return elementEditor.handler.getSelectedIdEditable && elementEditor.handler.getSelectedIdEditable();
    }
  };
};


},{"../../component/Pallet":73,"./ElementEditor":139,"./dismissBrowserSelection":146}],145:[function(require,module,exports){
"use strict";

module.exports = function (message) {
  // Show synchronous to smooth cancelation of selecton.
  _.defer(_.partial(alert, message));
};


},{}],146:[function(require,module,exports){
"use strict";

module.exports = function () {
  var selection = window.getSelection();
  selection.collapse(document.body, 0);
};


},{}],147:[function(require,module,exports){
"use strict";

var getPosition = function (paragraph, span, node) {
  var $parent = $(node).parent();
  var parentId = $parent.attr("id");

  var pos;
  if ($parent.hasClass("textae-editor__body__text-box__paragraph")) {
    pos = paragraph.get(parentId).begin;
  } else if ($parent.hasClass("textae-editor__span")) {
    pos = span.get(parentId).begin;
  } else {
    throw new Error("Can not get position of a node : " + node + " " + node.data);
  }

  var childNodes = node.parentElement.childNodes;
  for (var i = 0; childNodes[i] != node; i++) {
    // until the focus node
    pos += childNodes[i].nodeName == "#text" ? childNodes[i].nodeValue.length : $("#" + childNodes[i].id).text().length;
  }

  return pos;
},
    getFocusPosition = function (annotationData, selection) {
  var pos = getPosition(annotationData.paragraph, annotationData.span, selection.focusNode);
  return pos += selection.focusOffset;
},
    getAnchorPosition = function (annotationData, selection) {
  var pos = getPosition(annotationData.paragraph, annotationData.span, selection.anchorNode);
  return pos + selection.anchorOffset;
},
    toPositions = function (annotationData, selection) {
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
  getFocusPosition: getFocusPosition };


},{}],148:[function(require,module,exports){
"use strict";

var domUtil = require("../../util/domUtil");

module.exports = function (editor, model) {
  var selectPosition = require("./selectPosition"),


  // A span cannot be created include nonEdgeCharacters only.
  hasCharacters = function (spanConfig, selection) {
    if (!selection) return false;

    var positions = selectPosition.toPositions(model.annotationData, selection),
        selectedString = model.annotationData.sourceDoc.substring(positions.anchorPosition, positions.focusPosition),
        stringWithoutBlankCharacters = spanConfig.removeBlankChractors(selectedString);

    return stringWithoutBlankCharacters.length > 0;
  },
      isInOneParent = function (selection) {
    // A span can be created at the same parent node.
    // The parentElement is expected as a paragraph or a span.
    return selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id;
  },
      getAnchorNodeParent = function (selection) {
    return $(selection.anchorNode.parentNode);
  },
      getFocusNodeParent = function (selection) {
    return $(selection.focusNode.parentNode);
  },
      hasSpan = function ($node) {
    return $node.hasClass("textae-editor__span");
  },
      hasParagraphs = function ($node) {
    return $node.hasClass("textae-editor__body__text-box__paragraph");
  },
      hasSpanOrParagraphs = function ($node) {
    return hasSpan($node) || hasParagraphs($node);
  },
      isAnchrNodeInSpan = _.compose(hasSpan, getAnchorNodeParent),
      isFocusNodeInSpan = _.compose(hasSpan, getFocusNodeParent),
      isFocusNodeInParagraph = _.compose(hasParagraphs, getFocusNodeParent),
      isAnchrNodeInSpanOrParagraph = _.compose(hasSpanOrParagraphs, getAnchorNodeParent),
      isInSameParagraph = (function () {
    var getParagraph = function ($node) {
      if (hasParagraphs($node)) {
        return $node;
      } else if (hasSpan($node)) {
        return getParagraph($node.parent());
      } else {
        return null;
      }
    },
        getParagraphId = function (selection, position) {
      var $parent = $(selection[position + "Node"].parentNode),
          $paragraph = getParagraph($parent);
      return $paragraph && $paragraph.attr("id");
    };

    return function (selection) {
      var anchorParagraphId = getParagraphId(selection, "anchor"),
          focusParagraphId = getParagraphId(selection, "focus");

      return anchorParagraphId === focusParagraphId;
    };
  })(),
      isAnchorOneDownUnderForcus = function (selection) {
    return selection.anchorNode.parentNode.parentNode === selection.focusNode.parentNode;
  },
      isForcusOneDownUnderAnchor = function (selection) {
    return selection.anchorNode.parentNode === selection.focusNode.parentNode.parentNode;
  },
      isInSelectedSpan = function (position) {
    var spanId = model.selectionModel.span.single();
    if (spanId) {
      var selectedSpan = model.annotationData.span.get(spanId);
      return selectedSpan.begin < position && position < selectedSpan.end;
    }
    return false;
  },
      isAnchorInSelectedSpan = function (selection) {
    return isInSelectedSpan(selectPosition.getAnchorPosition(model.annotationData, selection));
  },
      isFocusOnSelectedSpan = function (selection) {
    return selection.focusNode.parentNode.id === model.selectionModel.span.single();
  },
      isFocusInSelectedSpan = function (selection) {
    return isInSelectedSpan(selectPosition.getFocusPosition(model.annotationData, selection));
  },
      isSelectedSpanOneDownUnderFocus = function (selection) {
    var selectedSpanId = model.selectionModel.span.single();
    return domUtil.selector.span.get(selectedSpanId).parent().attr("id") === selection.focusNode.parentNode.id;
  },
      isLongerThanParentSpan = function (selection) {
    var $getAnchorNodeParent = getAnchorNodeParent(selection),
        focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

    if (hasSpan($getAnchorNodeParent) && $getAnchorNodeParent.parent() && hasSpan($getAnchorNodeParent.parent())) {
      var span = model.annotationData.span.get($getAnchorNodeParent.parent().attr("id"));
      if (focusPosition < span.begin || span.end < focusPosition) return true;
    }
  },
      isShorterThanChildSpan = function (selection) {
    var $getFocusNodeParent = getFocusNodeParent(selection),
        anchorPosition = selectPosition.getAnchorPosition(model.annotationData, selection);

    if (hasSpan($getFocusNodeParent) && $getFocusNodeParent.parent() && hasSpan($getFocusNodeParent.parent())) {
      var span = model.annotationData.span.get($getFocusNodeParent.parent().attr("id"));
      if (anchorPosition < span.begin || span.end < anchorPosition) return true;
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
};


},{"../../util/domUtil":155,"./selectPosition":147}],149:[function(require,module,exports){
"use strict";

// Ovserve and record mouse position to return it.
var getMousePoint = (function () {
  var lastMousePoint = {},
      recordMousePoint = function (e) {
    lastMousePoint = {
      top: e.clientY,
      left: e.clientX
    };
  },
      onMousemove = _.debounce(recordMousePoint, 30);

  $("html").on("mousemove", onMousemove);

  return function () {
    return lastMousePoint;
  };
})(),
    KeybordInputConverter = require("./tool/KeybordInputConverter"),


// Observe window-resize event and redraw all editors.
observeWindowResize = function (editors) {
  // Bind resize event
  $(window).on("resize", _.debounce(function () {
    // Redraw all editors per editor.
    editors.forEach(function (editor) {
      console.log(editor.editorId, "redraw");
      _.defer(editor.api.redraw);
    });
  }, 500));
},
    helpDialog = require("./component/HelpDialog")(),
    ControlBar = function () {
  var control = null;
  return {
    setInstance: function (instance) {
      control = instance;
    },
    changeButtonState: function (enableButtons) {
      if (control) {
        control.updateAllButtonEnableState(enableButtons);
      }
    },
    push: function (buttonName, push) {
      if (control) control.updateButtonPushState(buttonName, push);
    }
  };
},
    KeyInputHandler = function (helpDialog, editors) {
  return function (key) {
    if (key === "H") {
      helpDialog();
    } else {
      if (editors.getSelected()) {
        editors.getSelected().api.handleKeyInput(key, getMousePoint());
      }
    }
  };
},
    ControlButtonHandler = function (helpDialog, editors) {
  return function (name) {
    switch (name) {
      case "textae.control.button.help.click":
        helpDialog();
        break;
      default:
        if (editors.getSelected()) {
          editors.getSelected().api.handleButtonClick(name, getMousePoint());
        }
    }
  };
};

// The tool manages interactions between components.
module.exports = (function () {
  var controlBar = new ControlBar(),
      editors = require("./tool/EditorContainer")(),
      handleControlButtonClick = new ControlButtonHandler(helpDialog, editors);

  // Start observation at document ready, because this function may be called before body is loaded.
  $(function () {
    var handleKeyInput = new KeyInputHandler(helpDialog, editors);

    new KeybordInputConverter().on("input", handleKeyInput);
    observeWindowResize(editors);
  });

  return {
    // Register a control to tool.
    setControl: function (instance) {
      instance.on("textae.control.button.click", function () {
        handleControlButtonClick.apply(null, _.rest(arguments));
      });

      controlBar.setInstance(instance);
    },
    // Register editors to tool
    pushEditor: function (editor) {
      editors.push(editor);

      // Add an event emitter to the editer.
      var eventEmitter = require("./util/extendBindable")({}).bind("textae.editor.select", _.partial(editors.select, editor)).bind("textae.control.button.push", function (data) {
        controlBar.push(data.buttonName, data.state);
      }).bind("textae.control.buttons.change", function (enableButtons) {
        if (editor === editors.getSelected()) controlBar.changeButtonState(enableButtons);
      });

      $.extend(editor, {
        editorId: editors.getNewId(),
        eventEmitter: eventEmitter
      });
    },
    // Select the first editor
    selectFirstEditor: function () {
      // Disable all buttons.
      controlBar.changeButtonState();

      editors.selectFirst();
    } };
})();


},{"./component/HelpDialog":72,"./tool/EditorContainer":150,"./tool/KeybordInputConverter":151,"./util/extendBindable":156}],150:[function(require,module,exports){
"use strict";

var switchActiveClass = function (editors, selected) {
  var activeClass = "textae-editor--active";

  // Remove activeClass from others than selected.
  _.reject(editors, function (editor) {
    return editor === selected;
  }).forEach(function (others) {
    others.removeClass(activeClass);
    // console.log('deactive', others.editorId);
  });

  // Add activeClass to the selected.
  selected.addClass(activeClass);
  // console.log('active', selected.editorId);
};

module.exports = function () {
  var editorList = [],
      selected = null,
      select = function (editor) {
    switchActiveClass(editorList, editor);
    selected = editor;
  },


  // A container of editors that is extended from Array.
  editors = {
    push: function (editor) {
      editorList.push(editor);
    },
    getNewId: function () {
      return "editor" + editorList.length;
    },
    getSelected: function () {
      return selected;
    },
    select: select,
    selectFirst: function () {
      select(editorList[0]);
    },
    forEach: editorList.forEach.bind(editorList)
  };

  return editors;
};


},{}],151:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter,


// Declare keyApiMap of control keys
controlKeyEventMap = {
  27: "ESC",
  46: "DEL",
  37: "LEFT",
  39: "RIGHT"
},
    convertKeyEvent = function (keyCode) {
  if (65 <= keyCode && keyCode <= 90) {
    // From a to z, convert 'A' to 'Z'
    return String.fromCharCode(keyCode);
  } else if (controlKeyEventMap[keyCode]) {
    // Control keys, like ESC, DEL ...
    return controlKeyEventMap[keyCode];
  }
},
    getKeyCode = function (e) {
  return e.keyCode;
};

// Observe key-input events and convert events to readable code.
module.exports = function (keyInputHandler) {
  var emitter = new EventEmitter(),
      eventHandler = function (e) {
    var key = convertKeyEvent(getKeyCode(e));
    emitter.emit("input", key);
  },
      onKeyup = eventHandler;

  // Observe key-input
  $(document).on("keyup", function (event) {
    onKeyup(event);
  });

  // Disable/Enable key-input When a jquery-ui dialog is opened/closeed
  $("body").on("dialogopen", ".ui-dialog", function () {
    onKeyup = function () {};
  }).on("dialogclose", ".ui-dialog", function () {
    onKeyup = eventHandler;
  });

  return emitter;
};


},{"events":37}],152:[function(require,module,exports){
"use strict";

var changeCursor = function (editor, action) {
  // Add jQuery Ui dialogs to targets because they are not in the editor.
  editor = editor.add(".ui-dialog, .ui-widget-overlay");
  editor[action + "Class"]("textae-editor--wait");
};

module.exports = function (editor) {
  var wait = _.partial(changeCursor, editor, "add"),
      endWait = _.partial(changeCursor, editor, "remove");

  return {
    startWait: wait,
    endWait: endWait };
};


},{}],153:[function(require,module,exports){
"use strict";

var isEmpty = function (str) {
  return !str || str === "";
},
    getAsync = function (url, dataHandler, failedHandler) {
  if (isEmpty(url)) {
    return;
  }

  $.ajax({
    type: "GET",
    url: url,
    cache: false
  }).done(function (data) {
    if (dataHandler !== undefined) {
      dataHandler(data);
    }
  }).fail(function (res, textStatus, errorThrown) {
    if (failedHandler !== undefined) {
      failedHandler();
    }
  });
},
    post = function (url, data, successHandler, failHandler, finishHandler) {
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
  }).done(successHandler).fail(failHandler).always(finishHandler);
};

module.exports = (function () {
  return {
    getAsync: getAsync,
    post: post
  };
})();


},{}],154:[function(require,module,exports){
"use strict";

module.exports = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};


},{}],155:[function(require,module,exports){
"use strict";

var idFactory = require("../util/idFactory");

module.exports = {
  selector: {
    span: {
      get: function (spanId) {
        return $("#" + spanId);
      }
    },
    entity: {
      get: function (entityId, editor) {
        return $("#" + idFactory.makeEntityDomId(editor, entityId));
      }
    },
    grid: {
      get: function (spanId) {
        return $("#G" + spanId);
      }
    } }
};


},{"../util/idFactory":158}],156:[function(require,module,exports){
"use strict";

// A mixin for the separeted presentation by the observer pattern.
var bindable = function () {
  var callbacks = {};

  return {
    bind: function (event, callback) {
      if (!_.isFunction(callback)) throw new Error("Only a function is bindable!");

      callbacks[event] = callbacks[event] || [];
      callbacks[event].push(callback);
      return this;
    },
    unbind: function (event, callback) {
      if (!callbacks[event]) return this;

      callbacks[event] = _.reject(callbacks[event], function (existsCallback) {
        return existsCallback === callback;
      });
      return this;
    },
    trigger: function (event, data) {
      if (callbacks[event]) {
        callbacks[event].forEach(function (callback) {
          callback(data);
        });
      }
      return data;
    }
  };
};

module.exports = function (obj) {
  return _.extend({}, obj, bindable());
};


},{}],157:[function(require,module,exports){
"use strict";

// Usage sample: getUrlParameters(location.search).
module.exports = function (urlQuery) {
  // Remove ? at top.
  var queryString = urlQuery ? String(urlQuery).replace(/^\?(.*)/, "$1") : "";

  // Convert to array if exists
  var querys = queryString.length > 0 ? queryString.split("&") : [];

  return querys.map(function (param) {
    // Convert string "key=value" to object.
    var vals = param.split("=");
    return {
      key: vals[0],
      val: vals[1]
    };
  }).reduce(function (a, b) {
    // Convert [{key: 'abc', val: '123'},...] to { abc: 123 ,...}
    // Set value true if val is not set.
    a[b.key] = b.val ? b.val : true;
    return a;
  }, {});
};


},{}],158:[function(require,module,exports){
"use strict";

var typeCounter = [],
    makeTypePrefix = function (editorId, prefix) {
  return editorId + "__" + prefix;
},
    makeId = function (editorId, prefix, id) {
  return makeTypePrefix(editorId, prefix) + id;
},
    spanDelimiter = "_";

module.exports = {
  // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
  makeSpanId: function (editor, span) {
    var spanPrefix = makeTypePrefix(editor.editorId, "S");
    return spanPrefix + span.begin + spanDelimiter + span.end;
  },
  // The ID of type has number of type.
  // This IDs are used for id of DOM element and css selector for jQuery.
  // But types are inputed by users and may have `!"#$%&'()*+,./:;<=>?@[\]^`{|}~` which can not be used for css selecor.
  makeTypeId: function (spanId, type) {
    if (typeCounter.indexOf(type) === -1) {
      typeCounter.push(type);
    }
    return spanId + "-" + typeCounter.indexOf(type);
  },
  makeEntityDomId: function (editor, id) {
    return makeId(editor.editorId, "E", id);
  },
  makeParagraphId: function (editor, id) {
    return makeId(editor.editorId, "P", id);
  }
};


},{}],159:[function(require,module,exports){
"use strict";

module.exports = function ($target, enable) {
  if (enable) {
    $target.removeAttr("disabled");
  } else {
    $target.attr("disabled", "disabled");
  }
};


},{}],160:[function(require,module,exports){
"use strict";

var setProp = function (key, $target, className, value) {
  var valueObject = {};

  valueObject[key] = value;
  return $target.find(className).prop(valueObject).end();
};

module.exports = {
  enabled: require("./jQueryEnabled"),
  Div: function (className) {
    return $("<div>").addClass(className);
  },
  Label: function (className, text) {
    return $("<label>").addClass(className).text(text);
  },
  Button: function (label, className) {
    return $("<input type=\"button\" disabled=\"disabled\" />").addClass(className).val(label);
  },
  Checkbox: function (className) {
    return $("<input type=\"checkbox\"/>").addClass(className);
  },
  Number: function (className) {
    return $("<input type=\"number\"/>").addClass(className);
  },
  toLink: function (url) {
    return "<a href=\"" + url + "\">" + url + "</a>";
  },
  getValueFromText: function ($target, className) {
    return $target.find("[type=\"text\"]." + className).val();
  },
  setChecked: _.partial(setProp, "checked"),
  setValue: _.partial(setProp, "value")
};


},{"./jQueryEnabled":159}],161:[function(require,module,exports){
"use strict";

module.exports = function (hash, element) {
  hash[element.name] = element;
  return hash;
};


},{}],162:[function(require,module,exports){
"use strict";

module.exports = {
  isUri: function (type) {
    return String(type).indexOf("http") > -1;
  },
  getUrlMatches: function (type) {
    // The regular-expression to parse URL.
    // See detail:
    // http://someweblog.com/url-regular-expression-javascript-link-shortener/
    var urlRegex = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
    return urlRegex.exec(type);
  }
};


},{}],163:[function(require,module,exports){
"use strict";

var reduce2hash = require("../../util/reduce2hash"),
    extendBindable = require("../../util/extendBindable"),
    Button = function (buttonName) {
  // Button state is true when the button is pushed.
  var emitter = extendBindable({}),
      state = false,
      value = function (newValue) {
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
  propagate = function () {
    emitter.trigger("change", {
      buttonName: buttonName,
      state: state
    });
  };

  return _.extend({
    name: buttonName,
    value: value,
    toggle: toggle,
    propagate: propagate
  }, emitter);
},
    buttonList = ["boundary-detection", "negation", "replicate-auto", "relation-edit-mode", "speculation"],
    propagateStateOf = function (emitter, buttons) {
  buttons.map(function (button) {
    return {
      buttonName: button.name,
      state: button.value()
    };
  }).forEach(function (data) {
    emitter.trigger("change", data);
  });
};

module.exports = function () {
  var emitter = extendBindable({}),
      buttons = buttonList.map(Button),
      propagateStateOfAllButtons = _.partial(propagateStateOf, emitter, buttons),
      buttonHash = buttons.reduce(reduce2hash, {});

  // default pushed;
  buttonHash["boundary-detection"].value(true);

  // Bind events.
  buttons.forEach(function (button) {
    button.bind("change", function (data) {
      emitter.trigger("change", data);
    });
  });

  return _.extend(buttonHash, emitter, {
    propagate: propagateStateOfAllButtons
  });
};


},{"../../util/extendBindable":156,"../../util/reduce2hash":161}],164:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter;


var ButtonEnableStates = function () {
  var states = {},
      set = function (button, enable) {
    states[button] = enable;
  },
      eventEmitter = new EventEmitter(),
      propagate = function () {
    eventEmitter.emit("change", states);
  };

  return _.extend(eventEmitter, {
    set: set,
    propagate: propagate
  });
},
    UpdateButtonState = function (model, buttonEnableStates, clipBoard) {
  // Short cut name
  var s = model.selectionModel,
      doPredicate = function (name) {
    return _.isFunction(name) ? name() : s[name].some();
  },
      and = function () {
    for (var i = 0; i < arguments.length; i++) {
      if (!doPredicate(arguments[i])) return false;
    }

    return true;
  },
      or = function () {
    for (var i = 0; i < arguments.length; i++) {
      if (doPredicate(arguments[i])) return true;
    }

    return false;
  },
      hasCopy = function () {
    return clipBoard.clipBoard.length > 0;
  },
      sOrE = _.partial(or, "span", "entity"),
      eOrR = _.partial(or, "entity", "relation");


  // Check all associated anntation elements.
  // For exapmle, it should be that buttons associate with entitis is enable,
  // when deselect the span after select a span and an entity.
  var predicates = {
    replicate: function () {
      return !!s.span.single();
    },
    entity: s.span.some,
    "delete": s.some, // It works well on relation-edit-mode if relations are deselect brefore an entity is select.
    copy: sOrE,
    paste: _.partial(and, hasCopy, "span"),
    pallet: eOrR,
    "change-label": eOrR,
    negation: eOrR,
    speculation: eOrR
  };

  return function (buttons) {
    buttons.forEach(function (buttonName) {
      buttonEnableStates.set(buttonName, predicates[buttonName]());
    });
  };
},
    UpdateModificationButtons = function (model, modeAccordingToButton) {
  var doesAllModificaionHasSpecified = function (specified, modificationsOfSelectedElement) {
    return modificationsOfSelectedElement.length > 0 && _.every(modificationsOfSelectedElement, function (m) {
      return _.contains(m, specified);
    });
  },
      updateModificationButton = function (specified, modificationsOfSelectedElement) {
    // All modification has specified modification if exits.
    modeAccordingToButton[specified.toLowerCase()].value(doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement));
  };

  return function (selectionModel) {
    var modifications = selectionModel.all().map(function (e) {
      return model.annotationData.getModificationOf(e).map(function (m) {
        return m.pred;
      });
    });

    updateModificationButton("Negation", modifications);
    updateModificationButton("Speculation", modifications);
  };
},
    ButtonStateHelper = function (model, modeAccordingToButton, buttonEnableStates, updateButtonState, updateModificationButtons) {
  var allButtons = ["delete"],
      spanButtons = allButtons.concat(["replicate", "entity", "copy", "paste"]),
      relationButtons = allButtons.concat(["pallet", "change-label", "negation", "speculation"]),
      entityButtons = relationButtons.concat(["copy"]),
      propagate = _.compose(modeAccordingToButton.propagate, buttonEnableStates.propagate),
      propagateAfter = _.partial(_.compose, propagate);

  return {
    propagate: propagate,
    enabled: propagateAfter(buttonEnableStates.set),
    updateBySpan: propagateAfter(_.partial(updateButtonState, spanButtons)),
    updateByEntity: _.compose(propagate, _.partial(updateModificationButtons, model.selectionModel.entity), _.partial(updateButtonState, entityButtons)),
    updateByRelation: _.compose(propagate, _.partial(updateModificationButtons, model.selectionModel.relation), _.partial(updateButtonState, relationButtons))
  };
};

module.exports = function (editor, model, clipBoard) {
  // Save state of push control buttons.
  var modeAccordingToButton = require("./ModeAccordingToButton")(),


  // Save enable/disable state of contorol buttons.
  buttonEnableStates = new ButtonEnableStates(),
      updateButtonState = new UpdateButtonState(model, buttonEnableStates, clipBoard),


  // Change push/unpush of buttons of modifications.
  updateModificationButtons = new UpdateModificationButtons(model, modeAccordingToButton),


  // Helper to update button state.
  buttonStateHelper = new ButtonStateHelper(model, modeAccordingToButton, buttonEnableStates, updateButtonState, updateModificationButtons);

  // Proragate events.
  modeAccordingToButton.bind("change", function (data) {
    editor.eventEmitter.trigger("textae.control.button.push", data);
  });

  buttonEnableStates.on("change", function (data) {
    editor.eventEmitter.trigger("textae.control.buttons.change", data);
  });

  return {
    // Modes accoding to buttons of control.
    modeAccordingToButton: modeAccordingToButton,
    buttonStateHelper: buttonStateHelper };
};


},{"./ModeAccordingToButton":163,"events":37}],165:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var GridLayout = _interopRequire(require("./GridLayout"));

var EventEmitter = require("events").EventEmitter;
module.exports = function (editor, annotationData, typeContainer, arrangePositionAllRelation) {
  var emitter = new EventEmitter(),
      gridLayout = new GridLayout(editor, annotationData, typeContainer),
      update = function (typeGapValue) {
    emitter.emit("render.start", editor);

    // Do asynchronous to change behavior of editor.
    // For example a wait cursor or a disabled control.
    _.defer(function () {
      return gridLayout.arrangePosition(typeGapValue).then(function () {
        return renderLazyRelationAll(annotationData.relation.all());
      }).then(arrangePositionAllRelation).then(function () {
        return emitter.emit("render.end", editor);
      })["catch"](function (error) {
        return console.error(error, error.stack);
      });
    });
  };

  return _.extend(emitter, {
    update: update
  });
};

function renderLazyRelationAll(relations) {
  // Render relations unless rendered.
  return Promise.all(relations.filter(function (connect) {
    return connect.render;
  }).map(function (connect) {
    return connect.render();
  }));
}


},{"./GridLayout":167,"events":37}],166:[function(require,module,exports){
"use strict";

var Cache = function () {
  var cache = {},
      set = function (key, value) {
    cache[key] = value;
    return value;
  },
      get = function (key) {
    return cache[key];
  },
      remove = function (key) {
    delete cache[key];
  },
      clear = function () {
    cache = {};
  };

  return {
    set: set,
    get: get,
    remove: remove,
    clear: clear,
    // To debug.
    keys: function () {
      return Object.keys(cache);
    }
  };
},
    cacheMan = (function () {
  var caches = [],
      add = function (cache) {
    caches.push(cache);
  },
      getFromCache = function (cache, getPositionFunciton, id) {
    return cache.get(id) ? cache.get(id) : cache.set(id, getPositionFunciton(id));
  },
      create = function (func) {
    var cache = new Cache();
    add(cache);
    return _.partial(getFromCache, cache, func);
  },
      clear = function () {
    caches.forEach(function (cache) {
      cache.clear();
    });
  };

  return {
    create: create,
    clear: clear
  };
})(),
    domUtil = require("../util/domUtil"),
    createNewCache = function (editor, entityModel) {
  // The chache for position of grids.
  // This is updated at arrange position of grids.
  // This is referenced at create or move relations.
  var gridPositionCache = _.extend(new Cache(), {
    isGridPrepared: function (entityId) {
      var spanId = entityModel.get(entityId).span;
      return gridPositionCache.get(spanId);
    }
  });

  // The posion of the text-box to calculate span postion;
  var getTextNodeFunc = function () {
    return editor.find(".textae-editor__body__text-box").offset();
  },
      getTextNode = cacheMan.create(getTextNodeFunc),
      getSpanFunc = function (spanId) {
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
      getEntityFunc = function (entityId) {
    var $entity = domUtil.selector.entity.get(entityId, editor);
    if ($entity.length === 0) {
      throw new Error("entity is not rendered : " + entityId);
    }

    var spanId = entityModel.get(entityId).span;
    var gridPosition = gridPositionCache.get(spanId);
    var entityElement = $entity.get(0);
    return {
      top: gridPosition.top + entityElement.offsetTop,
      center: gridPosition.left + entityElement.offsetLeft + $entity.outerWidth() / 2 };
  };

  // The connectCache has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
  // This is refered by render.relation and domUtil.selector.relation.
  var connectCache = new Cache();
  var toConnect = function (relationId) {
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
module.exports = function (editor, entityModel) {
  // The editor has onry one position cache.
  editor.postionCache = editor.postionCache || createNewCache(editor, entityModel);
  return editor.postionCache;
};


},{"../util/domUtil":155}],167:[function(require,module,exports){
"use strict";

var filterVisibleGrid = function (grid) {
  if (grid && grid.hasClass("hidden")) {
    return grid;
  }
},
    showGrid = function (grid) {
  if (grid) {
    grid.removeClass("hidden");
  }
},
    filterMoved = function (oldPosition, newPosition) {
  if (!oldPosition || oldPosition.top !== newPosition.top || oldPosition.left !== newPosition.left) {
    return newPosition;
  } else {
    return null;
  }
},
    doIfSpan = function (func, span) {
  if (span) {
    return func(span.id);
  }
},
    Promise = require("bluebird"),
    getGridPosition = require("./getGridPosition"),
    domUtil = require("../util/domUtil");

// Management position of annotation components.
module.exports = function (editor, annotationData, typeContainer) {
  var domPositionCaChe = require("./DomPositionCache")(editor, annotationData.entity),
      getGridOfSpan = domUtil.selector.grid.get,
      getGrid = _.partial(doIfSpan, getGridOfSpan),
      updatePositionCache = function (span, newPosition) {
    if (newPosition) {
      domPositionCaChe.setGrid(span.id, newPosition);
      return span;
    }
  },
      updateGridPositon = function (span, newPosition) {
    if (newPosition) {
      getGrid(span).css(newPosition);
      return newPosition;
    }
  },
      arrangeGridPosition = function (typeGapValue, span) {
    var getNewPosition = _.partial(getGridPosition, domPositionCaChe.getSpan, getGridOfSpan, typeContainer, typeGapValue),
        moveTheGridIfChange = _.compose(_.partial(updatePositionCache, span), _.partial(updateGridPositon, span), _.partial(filterMoved, domPositionCaChe.getGrid(span.id)), _.partial(getNewPosition)),
        showInvisibleGrid = _.compose(showGrid, filterVisibleGrid, getGrid);

    // The span may be remeved because this functon is call asynchronously.
    if (annotationData.span.get(span.id)) {
      // Move all relations because entities are increased or decreased unless the grid is moved.
      _.compose(showInvisibleGrid, moveTheGridIfChange)(span);
    }
  },
      arrangeGridPositionPromise = function (typeGapValue, span) {
    return new Promise(function (resolve, reject) {
      _.defer(function () {
        try {
          arrangeGridPosition(typeGapValue, span);
          resolve();
        } catch (error) {
          console.error(error, error.stack);
          reject();
        }
      });
    });
  },
      arrangeGridPositionAll = function (typeGapValue) {
    return annotationData.span.all().filter(function (span) {
      // There is at least one type in span that has a grid.
      return span.getTypes().length > 0;
    }).map(function (span) {
      // Cache all span position because alternating between getting offset and setting offset.
      domPositionCaChe.getSpan(span.id);
      return span;
    }).map(_.partial(arrangeGridPositionPromise, typeGapValue));
  },
      arrangePositionAll = function (typeGapValue) {
    domPositionCaChe.reset();
    return Promise.all(arrangeGridPositionAll(typeGapValue));
  };

  return {
    arrangePosition: arrangePositionAll
  };
};


},{"../util/domUtil":155,"./DomPositionCache":166,"./getGridPosition":201,"bluebird":3}],168:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var DomPositionCache = _interopRequire(require("./DomPositionCache"));

module.exports = function (editor, entity) {
  var domPositionCaChe = new DomPositionCache(editor, entity);

  return {
    on: _.partial(processAccosiatedRelation, entity, domPositionCaChe, function (connect) {
      return connect.pointup();
    }),
    off: _.partial(processAccosiatedRelation, entity, domPositionCaChe, function (connect) {
      return connect.pointdown();
    })
  };
};

function processAccosiatedRelation(entity, domPositionCaChe, func, entityId) {
  entity.assosicatedRelations(entityId).map(domPositionCaChe.toConnect).filter(function (connect) {
    return connect.pointup && connect.pointdown;
  }).forEach(func);
}


},{"./DomPositionCache":166}],169:[function(require,module,exports){
"use strict";

// Arrange a position of the pane to center entities when entities width is longer than pane width.
module.exports = function (pane) {
  var paneWidth = pane.outerWidth();
  var entitiesWidth = pane.find(".textae-editor__entity").toArray().map(function (e) {
    return e.offsetWidth;
  }).reduce(function (pv, cv) {
    return pv + cv;
  }, 0);

  pane.css({
    left: entitiesWidth > paneWidth ? (paneWidth - entitiesWidth) / 2 : 0
  });
};


},{}],170:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Selector = _interopRequire(require("../../Selector"));

var createEntityUnlessBlock = _interopRequire(require("./createEntityUnlessBlock"));

var removeEntityElement = _interopRequire(require("./removeEntityElement"));

module.exports = function (editor, model, typeContainer, gridRenderer, modification, emitter, entity) {
  var selector = new Selector(editor, model);

  // Remove an old entity.
  removeEntityElement(editor, model.annotationData, entity);

  // Show a new entity.
  createEntityUnlessBlock(editor, model.annotationData.namespace, typeContainer, gridRenderer, modification, emitter, entity);

  // Re-select a new entity instance.
  if (model.selectionModel.entity.has(entity.id)) {
    selector.entity.select(entity.id);
  }

  return entity;
};


},{"../../Selector":197,"./createEntityUnlessBlock":172,"./removeEntityElement":177}],171:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var idFactory = _interopRequire(require("../../../util/idFactory"));

var getTypeElement = _interopRequire(require("./getTypeElement"));

var arrangePositionOfPane = _interopRequire(require("./arrangePositionOfPane"));

// An entity is a circle on Type that is an endpoint of a relation.
// A span have one grid and a grid can have multi types and a type can have multi entities.
// A grid is only shown when at least one entity is owned by a correspond span.
module.exports = function (editor, namspace, typeContainer, gridRenderer, modification, entity) {
  // Replace null to 'null' if type is null and undefined too.
  entity.type = String(entity.type);

  // Append a new entity to the type
  var pane = getTypeElement(namspace, typeContainer, gridRenderer, entity.span, entity.type).find(".textae-editor__entity-pane").append(createEntityElement(editor, typeContainer, modification, entity));

  arrangePositionOfPane(pane);
};

function createEntityElement(editor, typeContainer, modification, entity) {
  var $entity = $("<div>").attr("id", idFactory.makeEntityDomId(editor, entity.id)).attr("title", entity.id).attr("type", entity.type).addClass("textae-editor__entity").css({
    "border-color": typeContainer.entity.getColor(entity.type)
  });

  // Set css classes for modifications.
  $entity.addClass(modification.getClasses(entity.id));

  return $entity;
}


},{"../../../util/idFactory":158,"./arrangePositionOfPane":169,"./getTypeElement":175}],172:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var create = _interopRequire(require("./create"));

module.exports = function (editor, namespace, typeContainer, gridRenderer, modification, emitter, entity) {
  if (!typeContainer.entity.isBlock(entity.type)) {
    create(editor, namespace, typeContainer, gridRenderer, modification, entity);
  }

  emitter.emit("render", entity);

  return entity;
};


},{"./create":171}],173:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var uri = _interopRequire(require("../../../util/uri"));

// Display short name for URL(http or https);
module.exports = function (type) {
  // For tunning, search the scheme before execute a regular-expression.
  if (uri.isUri(type)) {
    var matches = uri.getUrlMatches(type);

    if (matches) {
      // Order to dispaly.
      // 1. The anchor without #.
      if (matches[9]) return matches[9].slice(1);

      // 2. The file name with the extention.
      if (matches[6]) return matches[6] + (matches[7] || "");

      // 3. The last directory name.
      // Exclude slash only. cf. http://hoge.com/
      if (matches[5] && matches[5].length > 1) return matches[5].split("/").filter(function (s) {
        return s !== "";
      }).pop();

      // 4. The domain name.
      return matches[3];
    }
  }
  return type;
};


},{"../../../util/uri":162}],174:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var idFactory = _interopRequire(require("../../../util/idFactory"));

module.exports = function (spanId, type) {
  return $("#" + idFactory.makeTypeId(spanId, type));
};


},{"../../../util/idFactory":158}],175:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var domUtil = _interopRequire(require("../../../util/domUtil"));

var idFactory = _interopRequire(require("../../../util/idFactory"));

var uri = _interopRequire(require("../../../util/uri"));

var getDisplayName = _interopRequire(require("./getDisplayName"));

var getTypeDom = _interopRequire(require("./getTypeDom"));

//render type unless exists.
module.exports = function (namespace, typeContainer, gridRenderer, spanId, type) {
  var $type = getTypeDom(spanId, type);
  if ($type.length === 0) {
    $type = createEmptyTypeDomElement(namespace, typeContainer, spanId, type);
    getGrid(gridRenderer, spanId).append($type);
  }

  return $type;
};

function getMatchPrefix(namespace, type) {
  var namespaces = namespace.all(),
      matchs = namespaces.filter(function (namespace) {
    return namespace.prefix !== "_base";
  }).filter(function (namespace) {
    return type.indexOf(namespace.prefix + ":") === 0;
  });

  if (matchs.length === 1) return matchs[0];

  return null;
}

function getUri(namespace, typeContainer, type) {
  if (uri.isUri(type)) {
    return type;
  } else if (typeContainer.entity.getUri(type)) {
    return typeContainer.entity.getUri(type);
  } else if (namespace.some()) {
    var match = getMatchPrefix(namespace, type);
    if (match) {
      return match.uri + type.replace(match.prefix + ":", "");
    }

    var base = namespace.all().filter(function (namespace) {
      return namespace.prefix === "_base";
    });
    if (base.length === 1) {
      return base[0].uri + type;
    }
  }

  return null;
}

function setLabelName(typeLabel, namespace, typeContainer, type) {
  var displayName = undefined,
      match = getMatchPrefix(namespace, type);

  if (uri.isUri(type)) {
    displayName = getDisplayName(type);
  } else if (match) {
    displayName = type.replace(match.prefix + ":", "");
  } else {
    displayName = type;
  }

  var child = undefined,
      href = getUri(namespace, typeContainer, type);
  if (href) {
    child = "<a target=\"_blank\"/ href=\"" + href + "\">" + displayName + "</a>";
  } else {
    child = displayName;
  }

  typeLabel.innerHTML = child;
}

// A Type element has an entity_pane elment that has a label and will have entities.
function createEmptyTypeDomElement(namespace, typeContainer, spanId, type) {
  var typeId = idFactory.makeTypeId(spanId, type);

  // The EntityPane will have entities.
  var $entityPane = $("<div>").attr("id", "P-" + typeId).addClass("textae-editor__entity-pane");

  // The label over the span.
  var $typeLabel = $("<div>").addClass("textae-editor__type-label").css({
    "background-color": typeContainer.entity.getColor(type) });

  setLabelName($typeLabel[0], namespace, typeContainer, type);

  return $("<div>").attr("id", typeId).addClass("textae-editor__type").append($typeLabel).append($entityPane); // Set pane after label because pane is over label.
}

function getGrid(gridRenderer, spanId) {
  // Create a grid unless it exists.
  var $grid = domUtil.selector.grid.get(spanId);
  if ($grid.length === 0) {
    return gridRenderer.render(spanId);
  } else {
    return $grid;
  }
}


},{"../../../util/domUtil":155,"../../../util/idFactory":158,"../../../util/uri":162,"./getDisplayName":173,"./getTypeDom":174}],176:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var ModificationRenderer = _interopRequire(require("../ModificationRenderer"));

var getDisplayName = _interopRequire(require("./getDisplayName"));

var EventEmitter = require("events").EventEmitter;
var uri = _interopRequire(require("../../../util/uri"));

var idFactory = _interopRequire(require("../../../util/idFactory"));

var domUtil = _interopRequire(require("../../../util/domUtil"));

var Selector = _interopRequire(require("../../Selector"));

var getTypeDom = _interopRequire(require("./getTypeDom"));

var create = _interopRequire(require("./create"));

var createEntityUnlessBlock = _interopRequire(require("./createEntityUnlessBlock"));

var changeTypeOfExists = _interopRequire(require("./changeTypeOfExists"));

var removeEntityElement = _interopRequire(require("./removeEntityElement"));

module.exports = function (editor, model, typeContainer, gridRenderer) {
  var modification = new ModificationRenderer(model.annotationData),
      emitter = new EventEmitter();

  return _.extend(emitter, {
    render: function (entity) {
      return createEntityUnlessBlock(editor, model.annotationData.namespace, typeContainer, gridRenderer, modification, emitter, entity);
    },
    change: function (entity) {
      return changeTypeOfExists(editor, model, typeContainer, gridRenderer, modification, emitter, entity);
    },
    changeModification: function (entity) {
      return changeModificationOfExists(editor, modification, entity);
    },
    remove: function (entity) {
      return destroy(editor, model, gridRenderer, entity);
    },
    getTypeDom: function (entity) {
      return getTypeDom(entity.span, entity.type);
    }
  });
};

function destroy(editor, model, gridRenderer, entity) {
  if (doesSpanHasNoEntity(model.annotationData, entity.span)) {
    // Destroy a grid when all entities are remove.
    gridRenderer.remove(entity.span);
  } else {
    // Destroy an each entity.
    removeEntityElement(editor, model.annotationData, entity);
  }

  return entity;
}

function changeModificationOfExists(editor, modification, entity) {
  var $entity = domUtil.selector.entity.get(entity.id, editor);
  modification.update($entity, entity.id);
}

function doesSpanHasNoEntity(annotationData, spanId) {
  return annotationData.span.get(spanId).getTypes().length === 0;
}


},{"../../../util/domUtil":155,"../../../util/idFactory":158,"../../../util/uri":162,"../../Selector":197,"../ModificationRenderer":180,"./changeTypeOfExists":170,"./create":171,"./createEntityUnlessBlock":172,"./getDisplayName":173,"./getTypeDom":174,"./removeEntityElement":177,"events":37}],177:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var domUtil = _interopRequire(require("../../../util/domUtil"));

var getTypeDom = _interopRequire(require("./getTypeDom"));

var arrangePositionOfPane = _interopRequire(require("./arrangePositionOfPane"));

module.exports = function (editor, annotationData, entity) {
  // Get old type from Dom, Because the entity may have new type when changing type of the entity.
  var oldType = domUtil.selector.entity.get(entity.id, editor).remove().attr("type");

  // Delete type if no entity.
  if (doesTypeHasNoEntity(annotationData, entity, oldType)) {
    getTypeDom(entity.span, oldType).remove();
  } else {
    // Arrage the position of TypePane, because number of entities decrease.
    arrangePositionOfPane(getTypeDom(entity.span, oldType).find(".textae-editor__entity-pane"));
  }
};

function doesTypeHasNoEntity(annotationData, entity, typeName) {
  return annotationData.span.get(entity.span).getTypes().filter(function (type) {
    return type.name === typeName;
  }).length === 0;
}


},{"../../../util/domUtil":155,"./arrangePositionOfPane":169,"./getTypeDom":174}],178:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var getAnnotationBox = _interopRequire(require("./getAnnotationBox"));

var domUtil = _interopRequire(require("../../util/domUtil"));

module.exports = function (editor, domPositionCache) {
  var container = getAnnotationBox(editor),
      render = _.partial(createGrid, domPositionCache, container),
      destroyGrid = function (spanId) {
    domUtil.selector.grid.get(spanId).remove();
    domPositionCache.gridPositionCache.remove(spanId);
  };

  return {
    render: render,
    remove: destroyGrid
  };
};

function createGrid(domPositionCache, container, spanId) {
  var spanPosition = domPositionCache.getSpan(spanId),
      $grid = $("<div>").attr("id", "G" + spanId).addClass("textae-editor__grid").addClass("hidden").css({
    width: spanPosition.width
  });

  //append to the annotation area.
  container.append($grid);

  return $grid;
}


},{"../../util/domUtil":155,"./getAnnotationBox":190}],179:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var renderSourceDocument = _interopRequire(require("./renderSourceDocument"));

var getAnnotationBox = _interopRequire(require("./getAnnotationBox"));

var RenderAll = _interopRequire(require("./RenderAll"));

var renderModification = _interopRequire(require("./renderModification"));

var EventEmitter = require("events").EventEmitter;
var TypeStyle = _interopRequire(require("../TypeStyle"));

var SpanRenderer = _interopRequire(require("./SpanRenderer"));

var GridRenderer = _interopRequire(require("./GridRenderer"));

var EntityRenderer = _interopRequire(require("./EntityRenderer"));

module.exports = function (domPositionCaChe, relationRenderer, buttonStateHelper, typeGap, editor, model, typeContainer) {
  var emitter = new EventEmitter(),
      gridRenderer = new GridRenderer(editor, domPositionCaChe),
      entityRenderer = new EntityRenderer(editor, model, typeContainer, gridRenderer),
      spanRenderer = new SpanRenderer(editor, model, typeContainer, entityRenderer, gridRenderer);

  entityRenderer.on("render", function (entity) {
    return entityRenderer.getTypeDom(entity).css(new TypeStyle(typeGap()));
  });

  return function (editor, annotationData, selectionModel) {
    var renderAll = new RenderAll(editor, domPositionCaChe, spanRenderer, relationRenderer),
        renderSpanOfEntity = _.compose(spanRenderer.change, function (entity) {
      return annotationData.span.get(entity.span);
    }),
        renderModificationEntityOrRelation = function (modification) {
      renderModification(annotationData, "relation", modification, relationRenderer, buttonStateHelper);
      renderModification(annotationData, "entity", modification, entityRenderer, buttonStateHelper);
    };

    var eventHandlers = [["text.change", function (params) {
      return renderSourceDocument(editor, params.sourceDoc, params.paragraphs);
    }], ["all.change", function (annotationData) {
      renderAll(annotationData);
      selectionModel.clear();
    }], ["span.add", function (span) {
      return spanRenderer.render(span);
    }], ["span.remove", function (span) {
      spanRenderer.remove(span);
      selectionModel.span.remove(modelToId(span));
    }], ["entity.add", function (entity) {
      // Add a now entity with a new grid after the span moved.
      spanRenderer.change(annotationData.span.get(entity.span), domPositionCaChe.reset);
      entityRenderer.render(entity);
    }], ["entity.change", function (entity) {
      entityRenderer.change(entity);
      renderSpanOfEntity(entity);
    }], ["entity.remove", function (entity) {
      entityRenderer.remove(entity);
      renderSpanOfEntity(entity);
      selectionModel.entity.remove(modelToId(entity));
    }], ["relation.add", function (relation) {
      relationRenderer.render(relation);
      emitter.emit("relation.add", relation);
    }], ["relation.change", relationRenderer.change], ["relation.remove", function (relation) {
      relationRenderer.remove(relation);
      selectionModel.relation.remove(modelToId(relation));
    }], ["modification.add", renderModificationEntityOrRelation], ["modification.remove", renderModificationEntityOrRelation]];

    eventHandlers.forEach(function (eventHandler) {
      return bindeToModelEvent(emitter, annotationData, eventHandler[0], eventHandler[1]);
    });

    return emitter;
  };
};

function modelToId(modelElement) {
  return modelElement.id;
}

function bindeToModelEvent(emitter, annotationData, eventName, handler) {
  annotationData.on(eventName, function (param) {
    handler(param);
    emitter.emit(eventName);
  });
}


},{"../TypeStyle":199,"./EntityRenderer":176,"./GridRenderer":178,"./RenderAll":186,"./SpanRenderer":188,"./getAnnotationBox":190,"./renderModification":195,"./renderSourceDocument":196,"events":37}],180:[function(require,module,exports){
"use strict";

var allModificationClasses = "textae-editor__negation textae-editor__speculation";

module.exports = function (annotationData) {
  return {
    getClasses: _.partial(getClasses, annotationData),
    update: _.partial(update, annotationData)
  };
};

function getClasses(annotationData, objectId) {
  return annotationData.getModificationOf(objectId).map(function (m) {
    return "textae-editor__" + m.pred.toLowerCase();
  }).join(" ");
}

function update(annotationData, domElement, objectId) {
  domElement.removeClass(allModificationClasses);
  domElement.addClass(getClasses(annotationData, objectId));
}


},{}],181:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var DomPositionCache = _interopRequire(require("../../DomPositionCache"));

module.exports = function (editor, annotationData, relationId) {
  var domPositionCaChe = new DomPositionCache(editor, annotationData.entity);
  var connect = domPositionCaChe.toConnect(relationId);

  if (!connect) {
    throw "no connect";
  }

  return connect;
};


},{"../../DomPositionCache":166}],182:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Promise = _interopRequire(require("bluebird"));

var Connect = _interopRequire(require("./Connect"));

var determineCurviness = _interopRequire(require("./determineCurviness"));

var jsPlumbArrowOverlayUtil = _interopRequire(require("./jsPlumbArrowOverlayUtil"));

module.exports = function (editor, model, jsPlumbInstance) {
  return new Promise(function (resolve, reject) {
    _.defer(function () {
      try {
        // For tuning
        // var startTime = new Date();

        resetAllCurviness(editor, model.annotationData, model.annotationData.relation.all());
        jsPlumbInstance.repaintEverything();
        reselectAll(editor, model.annotationData, model.selectionModel.relation.all());

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

function reselectAll(editor, annotationData, relationIds) {
  relationIds.map(function (relationId) {
    return new Connect(editor, annotationData, relationId);
  }).filter(function (connect) {
    return connect instanceof jsPlumb.Connection;
  }).forEach(function (connect) {
    return connect.select();
  });
}

function resetAllCurviness(editor, annotationData, relations) {
  relations.map(function (relation) {
    return {
      connect: new Connect(editor, annotationData, relation.id),
      curviness: determineCurviness(editor, annotationData, relation)
    };
  })
  // Set changed values only.
  .filter(function (data) {
    return data.connect.setConnector && data.connect.connector.getCurviness() !== data.curviness;
  }).forEach(function (data) {
    data.connect.setConnector(["Bezier", {
      curviness: data.curviness
    }]);

    // Re-set arrow because it is disappered when setConnector is called.
    jsPlumbArrowOverlayUtil.resetArrows(data.connect);
  });
}


},{"./Connect":181,"./determineCurviness":183,"./jsPlumbArrowOverlayUtil":185,"bluebird":3}],183:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var DomPositionCache = _interopRequire(require("../../DomPositionCache"));

var CURVINESS_PARAMETERS = {
  // curviness parameters
  xrate: 0.6,
  yrate: 0.05,

  // curviness offset
  c_offset: 20 };

module.exports = function (editor, annotationData, relation) {
  var domPositionCaChe = new DomPositionCache(editor, annotationData.entity);

  var anchors = toAnchors(relation);
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
};

function toAnchors(relation) {
  return {
    sourceId: relation.subj,
    targetId: relation.obj
  };
}


},{"../../DomPositionCache":166}],184:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var ModificationRenderer = _interopRequire(require("../ModificationRenderer"));

var getAnnotationBox = _interopRequire(require("../getAnnotationBox"));

var DomPositionCache = _interopRequire(require("../../DomPositionCache"));

var Connect = _interopRequire(require("./Connect"));

var arrangePositionAll = _interopRequire(require("./arrangePositionAll"));

var determineCurviness = _interopRequire(require("./determineCurviness"));

var jsPlumbArrowOverlayUtil = _interopRequire(require("./jsPlumbArrowOverlayUtil"));

var domUtil = _interopRequire(require("../../../util/domUtil"));

var POINTUP_LINE_WIDTH = 3,
    LABEL = {
  cssClass: "textae-editor__relation__label",
  id: "label"
},
    makeJsPlumbInstance = function (container) {
  var newInstance = jsPlumb.getInstance({
    ConnectionsDetachable: false,
    Endpoint: ["Dot", {
      radius: 1
    }]
  });
  newInstance.setRenderMode(newInstance.SVG);
  newInstance.Defaults.Container = container;
  return newInstance;
},
    LabelOverlay = function (connect) {
  // Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
  var labelOverlay = connect.getOverlay(LABEL.id);
  if (!labelOverlay) {
    throw "no label overlay";
  }

  return labelOverlay;
};

module.exports = function (editor, model, typeContainer) {
  // Init a jsPlumb instance.
  var modification = new ModificationRenderer(model.annotationData),
      domPositionCaChe = new DomPositionCache(editor, model.annotationData.entity),
      jsPlumbInstance,
      ConnectorStrokeStyle = (function () {
    var converseHEXinotRGBA = function (color, opacity) {
      var c = color.slice(1),
          r = parseInt(c.substr(0, 2), 16),
          g = parseInt(c.substr(2, 2), 16),
          b = parseInt(c.substr(4, 2), 16);

      return "rgba(" + r + ", " + g + ", " + b + ", 1)";
    };

    return function (relationId) {
      var type = model.annotationData.relation.get(relationId).type,
          colorHex = typeContainer.relation.getColor(type);

      return {
        lineWidth: 1,
        strokeStyle: converseHEXinotRGBA(colorHex, 1)
      };
    };
  })(),


  // Cache a connect instance.
  cache = function (connect) {
    var relationId = connect.relationId;
    var domPositionCaChe = new DomPositionCache(editor, model.annotationData.entity);
    domPositionCaChe.connectCache.set(relationId, connect);

    return connect;
  },
      isGridPrepared = function (relationId) {
    if (!model.annotationData.relation.get(relationId)) return;

    var domPositionCaChe = new DomPositionCache(editor, model.annotationData.entity),
        relation = model.annotationData.relation.get(relationId);

    return domPositionCaChe.gridPositionCache.isGridPrepared(relation.subj) && domPositionCaChe.gridPositionCache.isGridPrepared(relation.obj);
  },
      filterGridExists = function (connect) {
    // The grid may be destroyed when the spans was moved repetitively by undo or redo.
    if (!isGridPrepared(connect.relationId)) {
      return;
    }
    return connect;
  },
      render = (function () {
    var deleteRender = function (relation) {
      delete relation.render;
      return relation;
    },
        createJsPlumbConnect = function (relation) {
      // Make a connect by jsPlumb.
      return jsPlumbInstance.connect({
        source: domUtil.selector.entity.get(relation.subj, editor),
        target: domUtil.selector.entity.get(relation.obj, editor),
        anchors: ["TopCenter", "TopCenter"],
        connector: ["Bezier", {
          curviness: determineCurviness(editor, model.annotationData, relation)
        }],
        paintStyle: new ConnectorStrokeStyle(relation.id),
        parameters: {
          id: relation.id },
        cssClass: "textae-editor__relation",
        overlays: [["Arrow", jsPlumbArrowOverlayUtil.NORMAL_ARROW], ["Label", _.extend({}, LABEL, {
          label: "[" + relation.id + "] " + relation.type,
          cssClass: LABEL.cssClass + " " + modification.getClasses(relation.id)
        })]]
      });
    },
        create = function (relation) {
      return _.extend(createJsPlumbConnect(relation), {
        relationId: relation.id
      });
    },
        extendPointup = (function () {
      var Pointupable = (function () {
        var hoverupLabel = function (connect) {
          new LabelOverlay(connect).addClass("hover");
          return connect;
        },
            hoverdownLabel = function (connect) {
          new LabelOverlay(connect).removeClass("hover");
          return connect;
        },
            selectLabel = function (connect) {
          new LabelOverlay(connect).addClass("ui-selected");
          return connect;
        },
            deselectLabel = function (connect) {
          new LabelOverlay(connect).removeClass("ui-selected");
          return connect;
        },
            hoverupLine = function (connect) {
          connect.addClass("hover");
          return connect;
        },
            hoverdownLine = function (connect) {
          connect.removeClass("hover");
          return connect;
        },
            selectLine = function (connect) {
          connect.addClass("ui-selected");
          return connect;
        },
            deselectLine = function (connect) {
          connect.removeClass("ui-selected");
          return connect;
        },
            hasClass = function (connect, className) {
          return connect.connector.canvas.classList.contains(className);
        },
            unless = function (connect, predicate, func) {
          // Evaluate lazily to use with _.delay.
          return function () {
            if (!predicate(connect)) func(connect);
          };
        },
            pointupLine = function (getStrokeStyle, connect) {
          connect.setPaintStyle(_.extend(getStrokeStyle(), {
            lineWidth: POINTUP_LINE_WIDTH
          }));
          return connect;
        },
            pointdownLine = function (getStrokeStyle, connect) {
          connect.setPaintStyle(getStrokeStyle());
          return connect;
        };

        return function (relationId, connect) {
          var getStrokeStyle = _.partial(ConnectorStrokeStyle, relationId),
              pointupLineColor = _.partial(pointupLine, getStrokeStyle),
              pointdownLineColor = _.partial(pointdownLine, getStrokeStyle),
              unlessSelect = _.partial(unless, connect, function (connect) {
            return hasClass(connect, "ui-selected");
          }),
              unlessDead = _.partial(unless, connect, function (connect) {
            return connect.dead;
          }),
              hoverup = _.compose(hoverupLine, hoverupLabel, pointupLineColor, jsPlumbArrowOverlayUtil.showBigArrow),
              hoverdown = _.compose(hoverdownLine, hoverdownLabel, pointdownLineColor, jsPlumbArrowOverlayUtil.hideBigArrow),
              select = _.compose(selectLine, selectLabel, hoverdownLine, hoverdownLabel, pointupLineColor, jsPlumbArrowOverlayUtil.showBigArrow),
              deselect = _.compose(deselectLine, deselectLabel, pointdownLineColor, jsPlumbArrowOverlayUtil.hideBigArrow);

          return {
            pointup: unlessSelect(hoverup),
            pointdown: unlessSelect(hoverdown),
            select: unlessDead(select),
            deselect: unlessDead(deselect)
          };
        };
      })();

      return function (connect) {
        var relationId = connect.relationId;
        return _.extend(connect, new Pointupable(relationId, connect));
      };
    })(),


    // Set hover action.
    hoverize = (function () {
      var bindHoverAction = function (jsPlumbElement, onMouseOver, onMouseRemove) {
        jsPlumbElement.bind("mouseenter", onMouseOver).bind("mouseexit", onMouseRemove);
      },
          pointup = function (connect) {
        connect.pointup();
      },
          pointdown = function (connect) {
        connect.pointdown();
      },
          toComponent = function (label) {
        return label.component;
      },
          bindConnect = function (connect) {
        bindHoverAction(connect, pointup, pointdown);
        return connect;
      },
          bindLabel = function (connect) {
        bindHoverAction(new LabelOverlay(connect), _.compose(pointup, toComponent), _.compose(pointdown, toComponent));
        return connect;
      };

      return _.compose(bindLabel, bindConnect);
    })(),
        extendApi = (function () {
      // Extend module for jsPlumb.Connection.
      var Api = function (connect) {
        var bindClickAction = function (onClick) {
          this.bind("click", onClick);
          this.getOverlay(LABEL.id).bind("click", function (label, event) {
            onClick(label.component, event);
          });
        };

        return _.extend({
          bindClickAction: bindClickAction
        });
      };

      return function (connect) {
        return _.extend(connect, new Api(connect));
      };
    })(),


    // Notify to controller that a new jsPlumbConnection is added.
    notify = function (connect) {
      editor.trigger("textae.editor.jsPlumbConnection.add", connect);
      return connect;
    };

    return _.compose(cache, notify, extendApi, hoverize, extendPointup, create, deleteRender);
  })(),
      Promise = require("bluebird"),


  // Create a dummy relation when before moving grids after creation grids.
  // Because a jsPlumb error occurs when a relation between same points.
  // And entities of same length spans was same point before moving grids.
  renderLazy = (function () {
    var extendRelationId = function (relation) {
      return _.extend(relation, {
        relationId: relation.id
      });
    },
        renderIfGridExists = function (relation) {
      if (filterGridExists(relation)) render(relation);
    },
        extendDummyApiToCreateRlationWhenGridMoved = function (relation) {
      var render = function () {
        return new Promise(function (resolve, reject) {
          _.defer(function () {
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
  })(),
      changeType = function (relation) {
    var connect = new Connect(editor, model.annotationData, relation.id),
        strokeStyle = new ConnectorStrokeStyle(relation.id);

    // The connect may be an object for lazyRender instead of jsPlumb.Connection.
    // This occurs when changing types and deletes was reverted.
    if (connect instanceof jsPlumb.Connection) {
      if (model.selectionModel.relation.has(relation.id)) {
        // Re-set style of the line and arrow if selected.
        strokeStyle.lineWidth = POINTUP_LINE_WIDTH;
      }
      connect.setPaintStyle(strokeStyle);

      new LabelOverlay(connect).setLabel("[" + relation.id + "] " + relation.type);
    }
  },
      changeJsModification = function (relation) {
    var connect = new Connect(editor, model.annotationData, relation.id);

    // A connect may be an object before it rendered.
    if (connect instanceof jsPlumb.Connection) {
      modification.update(new LabelOverlay(connect), relation.id);
    }
  },
      remove = function (relation) {
    var connect = new Connect(editor, model.annotationData, relation.id);
    jsPlumbInstance.detach(connect);
    domPositionCaChe.connectCache.remove(relation.id);

    // Set the flag dead already to delay selection.
    connect.dead = true;
  },
      init = function (editor) {
    var container = getAnnotationBox(editor);
    jsPlumbInstance = makeJsPlumbInstance(container);

    return function () {
      return arrangePositionAll(editor, model, jsPlumbInstance);
    };
  };

  return {
    init: init,
    reset: function () {
      jsPlumbInstance.reset();
      domPositionCaChe.connectCache.clear();
    },
    render: renderLazy,
    change: changeType,
    changeModification: changeJsModification,
    remove: remove
  };
};


},{"../../../util/domUtil":155,"../../DomPositionCache":166,"../ModificationRenderer":180,"../getAnnotationBox":190,"./Connect":181,"./arrangePositionAll":182,"./determineCurviness":183,"./jsPlumbArrowOverlayUtil":185,"bluebird":3}],185:[function(require,module,exports){
"use strict";

var // Overlay styles for jsPlubm connections.
NORMAL_ARROW = {
  width: 7,
  length: 9,
  location: 1,
  id: "normal-arrow"
},
    HOVER_ARROW = {
  width: 14,
  length: 18,
  location: 1,
  id: "hover-arrow" },
    addArrow = function (id, connect) {
  if (id === NORMAL_ARROW.id) {
    connect.addOverlay(["Arrow", NORMAL_ARROW]);
  } else if (id === HOVER_ARROW.id) {
    connect.addOverlay(["Arrow", HOVER_ARROW]);
  }
  return connect;
},
    addArrows = function (connect, arrows) {
  arrows.forEach(function (id) {
    addArrow(id, connect);
  });
  return arrows;
},
    getArrowIds = function (connect) {
  return connect.getOverlays().filter(function (overlay) {
    return overlay.type === "Arrow";
  }).map(function (arrow) {
    return arrow.id;
  });
},
    hasNormalArrow = function (connect) {
  return connect.getOverlay(NORMAL_ARROW.id);
},
    hasHoverArrow = function (connect) {
  return connect.getOverlay(HOVER_ARROW.id);
},
    removeArrow = function (id, connect) {
  connect.removeOverlay(id);
  return connect;
},
    removeArrows = function (connect, arrows) {
  arrows.forEach(function (id) {
    removeArrow(id, connect);
  });
  return arrows;
},
    resetArrows = function (connect) {
  _.compose(_.partial(addArrows, connect), _.partial(removeArrows, connect), getArrowIds)(connect);
},
    addNormalArrow = _.partial(addArrow, NORMAL_ARROW.id),
    addHoverArrow = _.partial(addArrow, HOVER_ARROW.id),
    removeNormalArrow = _.partial(removeArrow, NORMAL_ARROW.id),
    removeHoverArrow = _.partial(removeArrow, HOVER_ARROW.id),


// Remove a normal arrow and add a new big arrow.
// Because an arrow is out of position if hideOverlay and showOverlay is used.
switchHoverArrow = _.compose(addHoverArrow, removeNormalArrow),
    switchNormalArrow = _.compose(addNormalArrow, removeHoverArrow);

module.exports = {
  NORMAL_ARROW: NORMAL_ARROW,
  resetArrows: resetArrows,
  showBigArrow: function (connect) {
    // Do not add a big arrow twice when a relation has been selected during hover.
    if (hasHoverArrow(connect)) {
      return connect;
    }

    return switchHoverArrow(connect);
  },
  hideBigArrow: function (connect) {
    // Already affected
    if (hasNormalArrow(connect)) return connect;

    return switchNormalArrow(connect);
  }
};


},{}],186:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var getAnnotationBox = _interopRequire(require("./getAnnotationBox"));

module.exports = function (editor, domPositionCaChe, spanRenderer, relationRenderer) {
  return function (annotationData) {
    // Render annotations
    getAnnotationBox(editor).empty();
    domPositionCaChe.gridPositionCache.clear();
    renderAllSpan(annotationData, spanRenderer);

    // Render relations
    renderAllRelation(annotationData, relationRenderer);
  };
};

function renderAllSpan(annotationData, spanRenderer) {
  // For tuning
  // var startTime = new Date();

  annotationData.span.topLevel().forEach(function (span) {
    spanRenderer.render(span);
  });

  // For tuning
  // var endTime = new Date();
  // console.log('render all span : ', endTime.getTime() - startTime.getTime() + 'ms');
}

function renderAllRelation(annotationData, relationRenderer) {
  relationRenderer.reset();
  annotationData.relation.all().forEach(relationRenderer.render);
}


},{"./getAnnotationBox":190}],187:[function(require,module,exports){
"use strict";

var createSpanRange = require("./createSpanRange"),
    getFirstTextNode = require("./getFirstTextNode"),
    createSpanElement = function (span) {
  var element = document.createElement("span");
  element.setAttribute("id", span.id);
  element.setAttribute("title", span.id);
  element.setAttribute("class", "textae-editor__span");
  return element;
},
    domUtil = require("../../util/domUtil"),
    RenderSingleSpan = function (editor) {
  var getFirstTextNodeFromSpan = _.compose(getFirstTextNode, domUtil.selector.span.get),
      getFirstTextNodeFromParagraph = _.compose(getFirstTextNode, function (id) {
    return $("#" + id);
  }),


  // Get the Range to that new span tag insert.
  // This function works well when no child span is rendered.
  getRangeToInsertSpanTag = function (span) {
    // The parent of the bigBrother is same with span, which is a span or the root of spanTree.
    var bigBrother = span.getBigBrother();
    if (bigBrother) {
      // The target text arrounded by span is in a textNode after the bigBrother if bigBrother exists.
      return createSpanRange(document.getElementById(bigBrother.id).nextSibling, bigBrother.end, span);
    } else {
      // The target text arrounded by span is the first child of parent unless bigBrother exists.
      if (span.parent) {
        // The parent is span.
        // This span is first child of span.
        return createSpanRange(getFirstTextNodeFromSpan(span.parent.id), span.parent.begin, span);
      } else {
        // The parent is paragraph
        return createSpanRange(getFirstTextNodeFromParagraph(span.paragraph.id), span.paragraph.begin, span);
      }
    }
  },
      appendSpanElement = function (span, element) {
    getRangeToInsertSpanTag(span).surroundContents(element);

    return span;
  },
      renderSingleSpan = function (span) {
    return appendSpanElement(span, createSpanElement(span));
  };

  return renderSingleSpan;
};

module.exports = RenderSingleSpan;


},{"../../util/domUtil":155,"./createSpanRange":189,"./getFirstTextNode":193}],188:[function(require,module,exports){
"use strict";

var exists = function (span) {
  return document.getElementById(span.id) !== null;
},
    not = function (value) {
  return !value;
},
    hasType = function (span, isBlock) {
  return span.getTypes().map(function (type) {
    return type.name;
  }).filter(isBlock).length > 0;
},
    domUtil = require("../../util/domUtil");

module.exports = function (editor, model, typeContainer, entityRenderer, gridRenderer) {
  var renderSingleSpan = require("./RenderSingleSpan")(editor),
      renderBlockOfSpan = function (span, clearCache) {
    var $span = domUtil.selector.span.get(span.id);

    if (hasType(span, typeContainer.entity.isBlock)) {
      $span.addClass("textae-editor__span--block");
    } else {
      $span.removeClass("textae-editor__span--block");
    }

    if (hasType(span, _.compose(not, typeContainer.entity.isBlock))) {
      if ($span.hasClass("textae-editor__span--wrap")) {
        // The span maybe move.
        $span.removeClass("textae-editor__span--wrap");
        if (clearCache) clearCache();
      }
    } else {
      $span.addClass("textae-editor__span--wrap");
    }

    return span;
  },
      renderEntitiesOfType = function (type) {
    type.entities.forEach(_.compose(entityRenderer.render, model.annotationData.entity.get));
  },
      renderEntitiesOfSpan = function (span) {
    span.getTypes().forEach(renderEntitiesOfType);

    return span;
  },
      destroy = function (span) {
    var spanElement = document.getElementById(span.id),
        parent = spanElement.parentNode;

    // Move the textNode wrapped this span in front of this span.
    while (spanElement.firstChild) {
      parent.insertBefore(spanElement.firstChild, spanElement);
    }

    $(spanElement).remove();
    parent.normalize();

    // Destroy a grid of the span.
    gridRenderer.remove(span.id);
  },
      destroyChildrenSpan = function (span) {
    // Destroy DOM elements of descendant spans.
    var destroySpanRecurcive = function (span) {
      span.children.forEach(function (span) {
        destroySpanRecurcive(span);
      });
      destroy(span);
    };

    // Destroy rendered children.
    span.children.filter(exists).forEach(destroySpanRecurcive);

    return span;
  },
      renderChildresnSpan = function (span) {
    span.children.filter(_.compose(not, exists)).forEach(create);

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


},{"../../util/domUtil":155,"./RenderSingleSpan":187}],189:[function(require,module,exports){
"use strict";

var getPosition = function (span, startOfTextNodeAddSpan) {
  var startPos = span.begin - startOfTextNodeAddSpan,
      endPos = span.end - startOfTextNodeAddSpan;

  return {
    start: startPos,
    end: endPos
  };
},
    validatePosition = function (textNode, start, end) {
  return 0 <= start && end <= textNode.length;
},
    createRange = function (textNode, start, end) {
  var range = document.createRange();
  range.setStart(textNode, start);
  range.setEnd(textNode, end);
  return range;
},
    createSpanRange = function (textNode, startOfTextNodeAddSpan, span) {
  var position = getPosition(span, startOfTextNodeAddSpan);

  if (!validatePosition(textNode, position.start, position.end)) {
    throw new Error("oh my god! I cannot render this span. " + span.toStringOnlyThis() + ", textNode " + textNode.textContent);
  }

  return createRange(textNode, position.start, position.end);
};

// Create the Range to a new span add
module.exports = createSpanRange;


},{}],190:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var getElement = _interopRequire(require("./getElement"));

var getEditorBody = _interopRequire(require("./getEditorBody"));

// Get the display area for denotations and relations.
module.exports = _.compose(_.partial(getElement, "div", "textae-editor__body__annotation-box"), getEditorBody);


},{"./getEditorBody":191,"./getElement":192}],191:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var getElement = _interopRequire(require("./getElement"));

// Make the display area for text, spans, denotations, relations.
module.exports = _.partial(getElement, "div", "textae-editor__body");


},{"./getElement":192}],192:[function(require,module,exports){
"use strict";

module.exports = function (tagName, className, $parent) {
  var $area = $parent.find("." + className);
  if ($area.length === 0) {
    $area = $("<" + tagName + ">").addClass(className);
    $parent.append($area);
  }
  return $area;
};


},{}],193:[function(require,module,exports){
"use strict";

var isTextNode = function () {
  return this.nodeType === 3; //TEXT_NODE
},
    getFirstTextNode = function ($element) {
  return $element.contents().filter(isTextNode).get(0);
};

module.exports = getFirstTextNode;


},{}],194:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var DomPositionCache = _interopRequire(require("../DomPositionCache"));

var Initiator = _interopRequire(require("./Initiator"));

module.exports = function (editor, model, buttonStateHelper, typeContainer, typeGap, relationRenderer) {
  var domPositionCaChe = new DomPositionCache(editor, model.annotationData.entity);

  var api = {
    init: new Initiator(domPositionCaChe, relationRenderer, buttonStateHelper, typeGap, editor, model, typeContainer),
    arrangeRelationPositionAll: relationRenderer.arrangePositionAll,
    renderLazyRelationAll: relationRenderer.renderLazyRelationAll
  };

  return api;
};


},{"../DomPositionCache":166,"./Initiator":179}],195:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var capitalize = _interopRequire(require("../../util/capitalize"));

module.exports = function (annotationData, modelType, modification, renderer, buttonStateHelper) {
  var target = annotationData[modelType].get(modification.obj);

  if (target) {
    renderer.changeModification(target);
    buttonStateHelper["updateBy" + capitalize(modelType)]();
  }
};


},{"../../util/capitalize":154}],196:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var getElement = _interopRequire(require("./getElement"));

var getEditorBody = _interopRequire(require("./getEditorBody"));

var // Get the display area for text and spans.
getTextBox = _.compose(_.partial(getElement, "div", "textae-editor__body__text-box"), getEditorBody),


// the Souce document has multi paragraphs that are splited by '\n'.
createTaggedSourceDoc = function (sourceDoc, paragraphs) {
  //set sroucedoc tagged <p> per line.
  return sourceDoc.split("\n").map(function (content, index) {
    return "<p class=\"textae-editor__body__text-box__paragraph-margin\">" + "<span class=\"textae-editor__body__text-box__paragraph\" id=\"" + paragraphs[index].id + "\" >" + content + "</span></p>";
  }).join("\n");
},
    renderSourceDocument = function (editor, sourceDoc, paragraphs) {
  getTextBox(editor)[0].innerHTML = createTaggedSourceDoc(sourceDoc, paragraphs);
};

module.exports = renderSourceDocument;


},{"./getEditorBody":191,"./getElement":192}],197:[function(require,module,exports){
"use strict";

var selectionClass = require("./selectionClass"),
    domUtil = require("../util/domUtil");

module.exports = function (editor, model) {
  var domPositionCaChe = require("./DomPositionCache")(editor, model.annotationData.entity),
      modify = function (type, handle, id) {
    var $elment = domUtil.selector[type].get(id, editor);
    selectionClass[handle + "Class"]($elment);
  },
      selectSpan = _.partial(modify, "span", "add"),
      deselectSpan = _.partial(modify, "span", "remove"),
      selectEntity = _.partial(modify, "entity", "add"),
      deselectEntity = _.partial(modify, "entity", "remove"),
      selectRelation = function (relationId) {
    var addUiSelectClass = function (connect) {
      if (connect && connect.select) connect.select();
    },
        selectRelation = _.compose(addUiSelectClass, domPositionCaChe.toConnect);

    selectRelation(relationId);
  },
      deselectRelation = function (relationId) {
    var removeUiSelectClass = function (connect) {
      if (connect && connect.deselect) connect.deselect();
    },
        deselectRelation = _.compose(removeUiSelectClass, domPositionCaChe.toConnect);

    deselectRelation(relationId);
  },

  // Select the typeLabel if all entities is selected.
  updateEntityLabel = function (entityId) {
    var $entity = domUtil.selector.entity.get(entityId, editor),
        $typePane = $entity.parent(),
        $typeLabel = $typePane.prev();

    if ($typePane.children().length === $typePane.find(".ui-selected").length) {
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


},{"../util/domUtil":155,"./DomPositionCache":166,"./selectionClass":204}],198:[function(require,module,exports){
"use strict";

var reduce2hash = require("../util/reduce2hash"),
    uri = require("../util/uri"),
    DEFAULT_TYPE = "something",
    TypeContainer = function (getActualTypesFunction, defaultColor) {
  var definedTypes = {},
      defaultType = DEFAULT_TYPE;

  return {
    setDefinedTypes: function (newDefinedTypes) {
      definedTypes = newDefinedTypes;
    },
    getDeinedTypes: function () {
      return _.extend({}, definedTypes);
    },
    setDefaultType: function (name) {
      defaultType = name;
    },
    getDefaultType: function () {
      return defaultType || this.getSortedNames()[0];
    },
    getColor: function (name) {
      return definedTypes[name] && definedTypes[name].color || defaultColor;
    },
    getUri: function (name) {
      return definedTypes[name] && definedTypes[name].uri || uri.getUrlMatches(name) ? name : undefined;
    },
    getSortedNames: function () {
      if (getActualTypesFunction) {
        var typeCount = getActualTypesFunction().concat(Object.keys(definedTypes)).reduce(function (a, b) {
          a[b] = a[b] ? a[b] + 1 : 1;
          return a;
        }, {});

        // Sort by number of types, and by name if numbers are same.
        var typeNames = Object.keys(typeCount);
        typeNames.sort(function (a, b) {
          var diff = typeCount[b] - typeCount[a];
          return diff !== 0 ? diff : a > b ? 1 : b < a ? -1 : 0;
        });

        return typeNames;
      } else {
        return [];
      }
    }
  };
},
    setContainerDefinedTypes = function (container, newDefinedTypes) {
  // expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
  if (newDefinedTypes !== undefined) {
    container.setDefinedTypes(newDefinedTypes.reduce(reduce2hash, {}));
    container.setDefaultType(newDefinedTypes.filter(function (type) {
      return type["default"] === true;
    }).map(function (type) {
      return type.name;
    }).shift() || DEFAULT_TYPE);
  }
};

module.exports = function (model) {
  var entityContainer = _.extend(new TypeContainer(model.annotationData.entity.types, "#77DDDD"), {
    isBlock: function (type) {
      // console.log(type, entityContainer.getDeinedTypes(), entityContainer.getDeinedTypes()[type]);
      var definition = entityContainer.getDeinedTypes()[type];
      return definition && definition.type && definition.type === "block";
    }
  }),
      relationContaier = new TypeContainer(model.annotationData.relation.types, "#555555");

  return {
    entity: entityContainer,
    setDefinedEntityTypes: _.partial(setContainerDefinedTypes, entityContainer),
    relation: relationContaier,
    setDefinedRelationTypes: _.partial(setContainerDefinedTypes, relationContaier)
  };
};


},{"../util/reduce2hash":161,"../util/uri":162}],199:[function(require,module,exports){
"use strict";

module.exports = function (newValue) {
  return {
    height: 18 * newValue + 18 + "px",
    "padding-top": 18 * newValue + "px"
  };
};


},{}],200:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Renderer = _interopRequire(require("./Renderer"));

var lineHeight = _interopRequire(require("./lineHeight"));

var Hover = _interopRequire(require("./Hover"));

var Display = _interopRequire(require("./Display"));

var CursorChanger = _interopRequire(require("../util/CursorChanger"));

var setSelectionModelHandler = _interopRequire(require("./setSelectionModelHandler"));

var TypeStyle = _interopRequire(require("./TypeStyle"));

var RelationRenderer = _interopRequire(require("./Renderer/RelationRenderer"));

module.exports = function (editor, model, buttonController, typeGap, typeContainer) {
  // Render DOM elements conforming with the Model.
  var relationRenderer = new RelationRenderer(editor, model, typeContainer),
      hover = new Hover(editor, model.annotationData.entity);

  setSelectionModelHandler(editor, model, buttonController);

  var api = {
    init: function () {
      var arrangePositionAllRelation = relationRenderer.init(editor),
          display = new Display(editor, model.annotationData, typeContainer, arrangePositionAllRelation);

      setHandlerOnTyapGapEvent(editor, model, typeGap, typeContainer, display);
      setHandlerOnDisplayEvent(editor, display);

      initRenderer(editor, model, display.update, typeGap, typeContainer, buttonController.buttonStateHelper, relationRenderer);

      api.updateDisplay = function () {
        display.update(typeGap());
        lineHeight.reduceBottomSpace(editor);
      };
    },
    hoverRelation: hover
  };

  return api;
};

function initRenderer(editor, model, updateDisplay, typeGap, typeContainer, buttonStateHelper, relationRenderer) {
  var renderer = new Renderer(editor, model, buttonStateHelper, typeContainer, typeGap, relationRenderer),
      debouncedUpdateDisplay = _.debounce(function () {
    return updateDisplay(typeGap());
  }, 100);

  renderer.init(editor, model.annotationData, model.selectionModel).on("change", debouncedUpdateDisplay).on("all.change", debouncedUpdateDisplay).on("text.change", function () {
    return lineHeight.reduceBottomSpace(editor);
  }).on("span.add", debouncedUpdateDisplay).on("span.remove", debouncedUpdateDisplay).on("entity.add", debouncedUpdateDisplay).on("entity.change", debouncedUpdateDisplay).on("entity.remove", debouncedUpdateDisplay).on("relation.add", debouncedUpdateDisplay);
}

function setHandlerOnTyapGapEvent(editor, model, typeGap, typeContainer, display) {
  var setTypeStyle = function (newValue) {
    return editor.find(".textae-editor__type").css(new TypeStyle(newValue));
  };

  typeGap(setTypeStyle);
  typeGap(function (newValue) {
    return lineHeight.setToTypeGap(editor, model, typeContainer, newValue);
  });
  typeGap(display.update);
}

function setHandlerOnDisplayEvent(editor, display) {
  // Set cursor control by view rendering events.
  var cursorChanger = new CursorChanger(editor);

  display.on("render.start", function (editor) {
    // console.log(editor.editorId, 'render.start');
    cursorChanger.startWait();
  }).on("render.end", function (editor) {
    // console.log(editor.editorId, 'render.end');
    cursorChanger.endWait();
  });
}


},{"../util/CursorChanger":152,"./Display":165,"./Hover":168,"./Renderer":194,"./Renderer/RelationRenderer":184,"./TypeStyle":199,"./lineHeight":203,"./setSelectionModelHandler":205}],201:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var getHeightIncludeDescendantGrids = _interopRequire(require("./getHeightIncludeDescendantGrids"));

module.exports = function (getSpan, getGridOfSpan, typeContainer, typeGapValue, span) {
  if (span.children.length === 0) {
    return stickGridOnSpan(getSpan, getGridOfSpan, span);
  } else {
    return pullUpGridOverDescendants(getSpan, typeContainer, typeGapValue, span);
  }
};

function stickGridOnSpan(getSpan, getGridOfSpan, span) {
  var spanPosition = getSpan(span.id);

  return {
    top: spanPosition.top - getGridOfSpan(span.id).outerHeight(),
    left: spanPosition.left
  };
}

function pullUpGridOverDescendants(getSpan, typeContainer, typeGapValue, span) {
  // Culculate the height of the grid include descendant grids, because css style affects slowly.
  var spanPosition = getSpan(span.id),
      descendantsMaxHeight = getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue);

  return {
    top: spanPosition.top - descendantsMaxHeight,
    left: spanPosition.left
  };
}


},{"./getHeightIncludeDescendantGrids":202}],202:[function(require,module,exports){
"use strict";

module.exports = getHeightIncludeDescendantGrids;
function getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue) {
  var descendantsMaxHeight = span.children.length === 0 ? 0 : _.max(span.children.map(function (childSpan) {
    return getHeightIncludeDescendantGrids(childSpan, typeContainer, typeGapValue);
  })),
      gridHeight = span.getTypes().filter(function (type) {
    return !typeContainer.entity.isBlock(type.name);
  }).length * (typeGapValue * 18 + 18);

  return gridHeight + descendantsMaxHeight;
}


},{}],203:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

exports.get = get;
exports.reduceBottomSpace = reduceBottomSpace;
exports.set = set;
exports.setToTypeGap = setToTypeGap;
var TEXT_HEIGHT = 23;
var MARGIN_TOP = 30;
var MINIMUM_HEIGHT = 16 * 4;

var getHeightIncludeDescendantGrids = _interopRequire(require("./getHeightIncludeDescendantGrids"));

function get(editor) {
  return Math.floor(parseInt(editor.find(".textae-editor__body__text-box").css("line-height")) / 16);
}

// Reduce the space under the .textae-editor__body__text-box same as padding-top.
function reduceBottomSpace(editor) {
  var $textBox = editor.find(".textae-editor__body__text-box");

  // The height calculated by auto is exclude the value of the padding top.
  // Rest small space.
  $textBox.css({
    height: "auto"
  }).css({
    height: $textBox.height() + 20
  });
}

function set(editor, heightValue) {
  var $textBox = editor.find(".textae-editor__body__text-box");

  $textBox.css({
    "line-height": heightValue + "px",
    "padding-top": heightValue / 2 + "px"
  });

  reduceBottomSpace(editor);
}

function setToTypeGap(editor, model, typeContainer, typeGapValue) {
  var heightOfType = typeGapValue * 18 + 18,
      maxHeight;

  if (model.annotationData.span.all().length === 0) {
    maxHeight = MINIMUM_HEIGHT;
  } else {
    maxHeight = _.max(model.annotationData.span.all().map(function (span) {
      return getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue);
    }));

    maxHeight += TEXT_HEIGHT + MARGIN_TOP;
  }

  set(editor, maxHeight);
}


},{"./getHeightIncludeDescendantGrids":202}],204:[function(require,module,exports){
"use strict";

// Add or Remove class to indicate selected state.
module.exports = (function () {
  var addClass = function ($target) {
    return $target.addClass("ui-selected");
  },
      removeClass = function ($target) {
    return $target.removeClass("ui-selected");
  };

  return {
    addClass: addClass,
    removeClass: removeClass
  };
})();


},{}],205:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var Selector = _interopRequire(require("./Selector"));

module.exports = function (editor, model, buttonController) {
  var selector = new Selector(editor, model);

  // Because entity.change is off at relation-edit-mode.
  model.selectionModel.on("span.select", selector.span.select).on("span.deselect", selector.span.deselect).on("span.change", buttonController.buttonStateHelper.updateBySpan).on("entity.select", selector.entity.select).on("entity.deselect", selector.entity.deselect).on("relation.select", delay150(selector.relation.select)).on("relation.deselect", delay150(selector.relation.deselect)).on("relation.change", buttonController.buttonStateHelper.updateByRelation);
};

function delay150(func) {
  return _.partial(_.delay, func, 150);
}


},{"./Selector":197}]},{},[87]);

//for module pattern with tail.js
(function(jQuery) { // Application main
	$(function() {
		//setup contorl
		$(".textae-control").textae();

		//setup editor
		$(".textae-editor").textae();
	});
})(jQuery);