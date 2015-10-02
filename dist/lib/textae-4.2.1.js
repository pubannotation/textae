(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":21}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":22}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":23}],4:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":24}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":25}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":26}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":27}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":28}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":29}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":30}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":31}],12:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":32}],13:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],14:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":7}],15:[function(require,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    desc = parent = getter = undefined;
    _again = false;
    if (object === null) object = Function.prototype;

    var desc = _Object$getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/get-own-property-descriptor":8}],16:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":6,"babel-runtime/core-js/object/set-prototype-of":10}],17:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],18:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
};

exports.__esModule = true;
},{}],19:[function(require,module,exports){
"use strict";

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

var _isIterable = require("babel-runtime/core-js/is-iterable")["default"];

exports["default"] = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (_isIterable(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/get-iterator":2,"babel-runtime/core-js/is-iterable":3}],20:[function(require,module,exports){
"use strict";

var _Array$from = require("babel-runtime/core-js/array/from")["default"];

exports["default"] = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return _Array$from(arr);
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/array/from":1}],21:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/$.core').Array.from;
},{"../../modules/$.core":41,"../../modules/es6.array.from":90,"../../modules/es6.string.iterator":100}],22:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":88,"../modules/es6.string.iterator":100,"../modules/web.dom.iterable":103}],23:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');
},{"../modules/core.is-iterable":89,"../modules/es6.string.iterator":100,"../modules/web.dom.iterable":103}],24:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
module.exports = require('../modules/$.core').Map;
},{"../modules/$.core":41,"../modules/es6.map":92,"../modules/es6.object.to-string":97,"../modules/es6.string.iterator":100,"../modules/es7.map.to-json":101,"../modules/web.dom.iterable":103}],25:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/$.core').Object.assign;
},{"../../modules/$.core":41,"../../modules/es6.object.assign":93}],26:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":64}],27:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":64}],28:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":64,"../../modules/es6.object.get-own-property-descriptor":94}],29:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":41,"../../modules/es6.object.keys":95}],30:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":41,"../../modules/es6.object.set-prototype-of":96}],31:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/$.core').Promise;
},{"../modules/$.core":41,"../modules/es6.object.to-string":97,"../modules/es6.promise":98,"../modules/es6.string.iterator":100,"../modules/web.dom.iterable":103}],32:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
require('../modules/es7.set.to-json');
module.exports = require('../modules/$.core').Set;
},{"../modules/$.core":41,"../modules/es6.object.to-string":97,"../modules/es6.set":99,"../modules/es6.string.iterator":100,"../modules/es7.set.to-json":102,"../modules/web.dom.iterable":103}],33:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],34:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":56}],35:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var toObject = require('./$.to-object')
  , IObject  = require('./$.iobject')
  , enumKeys = require('./$.enum-keys');
/* eslint-disable no-unused-vars */
module.exports = Object.assign || function assign(target, source){
/* eslint-enable no-unused-vars */
  var T = toObject(target)
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = IObject(arguments[i++])
      , keys   = enumKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
};
},{"./$.enum-keys":46,"./$.iobject":54,"./$.to-object":83}],36:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":37,"./$.wks":86}],37:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],38:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , ctx          = require('./$.ctx')
  , species      = require('./$.species')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , isExtensible = Object.isExtensible || isObject
  , SUPPORT_DESC = require('./$.support-desc')
  , SIZE         = SUPPORT_DESC ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments[1], 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(SUPPORT_DESC)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    require('./$.iter-define')(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    species(C);
    species(require('./$.core')[NAME]); // for wrapper
  }
};
},{"./$":64,"./$.core":41,"./$.ctx":42,"./$.defined":44,"./$.for-of":48,"./$.has":50,"./$.hide":51,"./$.is-object":56,"./$.iter-define":60,"./$.iter-step":62,"./$.mix":67,"./$.species":74,"./$.strict-new":75,"./$.support-desc":77,"./$.uid":84}],39:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":36,"./$.for-of":48}],40:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , $def       = require('./$.def')
  , hide       = require('./$.hide')
  , BUGGY      = require('./$.iter-buggy')
  , forOf      = require('./$.for-of')
  , strictNew  = require('./$.strict-new');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = require('./$.global')[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!require('./$.support-desc') || typeof C != 'function'
    || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    require('./$.mix')(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      strictNew(target, C, NAME);
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var chain = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return chain ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  require('./$.tag')(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$":64,"./$.def":43,"./$.for-of":48,"./$.global":49,"./$.hide":51,"./$.iter-buggy":57,"./$.mix":67,"./$.strict-new":75,"./$.support-desc":77,"./$.tag":78}],41:[function(require,module,exports){
var core = module.exports = {};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],42:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  } return function(/* ...args */){
      return fn.apply(that, arguments);
    };
};
},{"./$.a-function":33}],43:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , PROTOTYPE = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":41,"./$.global":49}],44:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],45:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":49,"./$.is-object":56}],46:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":64}],47:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],48:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":34,"./$.ctx":42,"./$.is-array-iter":55,"./$.iter-call":58,"./$.to-length":82,"./core.get-iterator-method":87}],49:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var UNDEFINED = 'undefined';
var global = module.exports = typeof window != UNDEFINED && window.Math == Math
  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],50:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],51:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.support-desc') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":64,"./$.property-desc":69,"./$.support-desc":77}],52:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":49}],53:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],54:[function(require,module,exports){
// indexed object, fallback for non-array-like ES3 strings
var cof = require('./$.cof');
module.exports = 0 in Object('z') ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":37}],55:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./$.iterators')
  , ITERATOR  = require('./$.wks')('iterator');
module.exports = function(it){
  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
};
},{"./$.iterators":63,"./$.wks":86}],56:[function(require,module,exports){
// http://jsperf.com/core-js-isobject
module.exports = function(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
};
},{}],57:[function(require,module,exports){
// Safari has buggy iterators w/o `next`
module.exports = 'keys' in [] && !('next' in [].keys());
},{}],58:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":34}],59:[function(require,module,exports){
'use strict';
var $ = require('./$')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: require('./$.property-desc')(1,next)});
  require('./$.tag')(Constructor, NAME + ' Iterator');
};
},{"./$":64,"./$.hide":51,"./$.property-desc":69,"./$.tag":78,"./$.wks":86}],60:[function(require,module,exports){
'use strict';
var LIBRARY         = require('./$.library')
  , $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , hide            = require('./$.hide')
  , has             = require('./$.has')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , Iterators       = require('./$.iterators')
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  require('./$.iter-create')(Constructor, NAME, next);
  var createMethod = function(kind){
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = require('./$').getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    require('./$.tag')(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      keys:    IS_SET            ? _default : createMethod(KEYS),
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * require('./$.iter-buggy'), NAME, methods);
  }
};
},{"./$":64,"./$.def":43,"./$.has":50,"./$.hide":51,"./$.iter-buggy":57,"./$.iter-create":59,"./$.iterators":63,"./$.library":65,"./$.redef":70,"./$.tag":78,"./$.wks":86}],61:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec){
  if(!SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":86}],62:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],63:[function(require,module,exports){
module.exports = {};
},{}],64:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],65:[function(require,module,exports){
module.exports = true;
},{}],66:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    if(domain)domain.enter();
    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
}

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":37,"./$.global":49,"./$.task":79}],67:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":70}],68:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (require('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * require('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":41,"./$.def":43,"./$.fails":47}],69:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],70:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":51}],71:[function(require,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],72:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
    ? function(buggy, set){
        try {
          set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
          set({}, []);
        } catch(e){ buggy = true; }
        return function setPrototypeOf(O, proto){
          check(O, proto);
          if(buggy)O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }()
    : undefined),
  check: check
};
},{"./$":64,"./$.an-object":34,"./$.ctx":42,"./$.is-object":56}],73:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":49}],74:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if(require('./$.support-desc') && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":64,"./$.support-desc":77,"./$.wks":86}],75:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],76:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":44,"./$.to-integer":80}],77:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":47}],78:[function(require,module,exports){
var has  = require('./$.has')
  , hide = require('./$.hide')
  , TAG  = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))hide(it, TAG, tag);
};
},{"./$.has":50,"./$.hide":51,"./$.wks":86}],79:[function(require,module,exports){
'use strict';
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScript){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":37,"./$.ctx":42,"./$.dom-create":45,"./$.global":49,"./$.html":52,"./$.invoke":53}],80:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],81:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":44,"./$.iobject":54}],82:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":80}],83:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":44}],84:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],85:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],86:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || require('./$.uid'))('Symbol.' + name));
};
},{"./$.global":49,"./$.shared":73,"./$.uid":84}],87:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};
},{"./$.classof":36,"./$.core":41,"./$.iterators":63,"./$.wks":86}],88:[function(require,module,exports){
var anObject = require('./$.an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./$.core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./$.an-object":34,"./$.core":41,"./core.get-iterator-method":87}],89:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').isIterable = function(it){
  var O = Object(it);
  return ITERATOR in O || '@@iterator' in O || Iterators.hasOwnProperty(classof(O));
};
},{"./$.classof":36,"./$.core":41,"./$.iterators":63,"./$.wks":86}],90:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $def        = require('./$.def')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, arguments[2], 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      for(result = new C(length = toLength(O.length)); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});
},{"./$.ctx":42,"./$.def":43,"./$.is-array-iter":55,"./$.iter-call":58,"./$.iter-detect":61,"./$.to-length":82,"./$.to-object":83,"./core.get-iterator-method":87}],91:[function(require,module,exports){
'use strict';
var setUnscope = require('./$.unscope')
  , step       = require('./$.iter-step')
  , Iterators  = require('./$.iterators')
  , toIObject  = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$.iter-define":60,"./$.iter-step":62,"./$.iterators":63,"./$.to-iobject":81,"./$.unscope":85}],92:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments[0]); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":40,"./$.collection-strong":38}],93:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":35,"./$.def":43}],94:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":68,"./$.to-iobject":81}],95:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":68,"./$.to-object":83}],96:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":43,"./$.set-proto":72}],97:[function(require,module,exports){

},{}],98:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $def       = require('./$.def')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same')
  , species    = require('./$.species')
  , SPECIES    = require('./$.wks')('species')
  , RECORD     = require('./$.uid')('record')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.support-desc')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var isPromise = function(it){
  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
};
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      asap(function(){
        if(isUnhandled(record.p)){
          if(isNode){
            process.emit('unhandledRejection', value, record.p);
          } else if(global.console && console.error){
            console.error('Unhandled promise rejection', value);
          }
        }
        record.a = undefined;
      });
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    this[RECORD] = record;
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var S = anObject(anObject(this).constructor)[SPECIES];
      var react = {
        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
        fail: typeof onRejected == 'function'  ? onRejected  : false
      };
      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
        react.res = aFunction(res);
        react.rej = aFunction(rej);
      });
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
require('./$.tag')(P, PROMISE);
species(P);
species(Wrapper = require('./$.core')[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new this(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"./$":64,"./$.a-function":33,"./$.an-object":34,"./$.classof":36,"./$.core":41,"./$.ctx":42,"./$.def":43,"./$.for-of":48,"./$.global":49,"./$.is-object":56,"./$.iter-detect":61,"./$.library":65,"./$.microtask":66,"./$.mix":67,"./$.same":71,"./$.set-proto":72,"./$.species":74,"./$.strict-new":75,"./$.support-desc":77,"./$.tag":78,"./$.uid":84,"./$.wks":86}],99:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments[0]); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":40,"./$.collection-strong":38}],100:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":60,"./$.string-at":76}],101:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def');

$def($def.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":39,"./$.def":43}],102:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def');

$def($def.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":39,"./$.def":43}],103:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":63,"./es6.array.iterator":91}],104:[function(require,module,exports){
(function (process,global){
/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2015 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
/**
 * bluebird build version 2.10.0
 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, cancel, using, filter, any, each, timers
*/
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Promise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
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

},{}],2:[function(_dereq_,module,exports){
"use strict";
var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = _dereq_("./schedule.js");
var Queue = _dereq_("./queue.js");
var util = _dereq_("./util.js");

function Async() {
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._trampolineEnabled = true;
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();
    };
    this._schedule =
        schedule.isStatic ? schedule(this.drainQueues) : schedule;
}

Async.prototype.disableTrampolineIfNecessary = function() {
    if (util.hasDevTools) {
        this._trampolineEnabled = false;
    }
};

Async.prototype.enableTrampoline = function() {
    if (!this._trampolineEnabled) {
        this._trampolineEnabled = true;
        this._schedule = function(fn) {
            setTimeout(fn, 0);
        };
    }
};

Async.prototype.haveItemsQueued = function () {
    return this._normalQueue.length() > 0;
};

Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
        arg = fn;
        fn = function () { throw arg; };
    }
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

function AsyncInvokeLater(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncInvoke(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncSettlePromises(promise) {
    this._normalQueue._pushOne(promise);
    this._queueTick();
}

if (!util.hasDevTools) {
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
} else {
    if (schedule.isStatic) {
        schedule = function(fn) { setTimeout(fn, 0); };
    }
    Async.prototype.invokeLater = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvokeLater.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                setTimeout(function() {
                    fn.call(receiver, arg);
                }, 100);
            });
        }
    };

    Async.prototype.invoke = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvoke.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                fn.call(receiver, arg);
            });
        }
    };

    Async.prototype.settlePromises = function(promise) {
        if (this._trampolineEnabled) {
            AsyncSettlePromises.call(this, promise);
        } else {
            this._schedule(function() {
                promise._settlePromises();
            });
        }
    };
}

Async.prototype.invokeFirst = function (fn, receiver, arg) {
    this._normalQueue.unshift(fn, receiver, arg);
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

},{"./queue.js":28,"./schedule.js":31,"./util.js":38}],3:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise) {
var rejectThis = function(_, e) {
    this._reject(e);
};

var targetRejected = function(e, context) {
    context.promiseRejectionQueued = true;
    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
};

var bindingResolved = function(thisArg, context) {
    if (this._isPending()) {
        this._resolveCallback(context.target);
    }
};

var bindingRejected = function(e, context) {
    if (!context.promiseRejectionQueued) this._reject(e);
};

Promise.prototype.bind = function (thisArg) {
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 1);
    var target = this._target();

    ret._setBoundTo(maybePromise);
    if (maybePromise instanceof Promise) {
        var context = {
            promiseRejectionQueued: false,
            promise: ret,
            target: target,
            bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, ret._progress, ret, context);
        maybePromise._then(
            bindingResolved, bindingRejected, ret._progress, ret, context);
    } else {
        ret._resolveCallback(target);
    }
    return ret;
};

Promise.prototype._setBoundTo = function (obj) {
    if (obj !== undefined) {
        this._bitField = this._bitField | 131072;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~131072);
    }
};

Promise.prototype._isBound = function () {
    return (this._bitField & 131072) === 131072;
};

Promise.bind = function (thisArg, value) {
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);

    ret._setBoundTo(maybePromise);
    if (maybePromise instanceof Promise) {
        maybePromise._then(function() {
            ret._resolveCallback(value);
        }, ret._reject, ret._progress, ret, null);
    } else {
        ret._resolveCallback(value);
    }
    return ret;
};
};

},{}],4:[function(_dereq_,module,exports){
"use strict";
var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict() {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
var bluebird = _dereq_("./promise.js")();
bluebird.noConflict = noConflict;
module.exports = bluebird;

},{"./promise.js":23}],5:[function(_dereq_,module,exports){
"use strict";
var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = _dereq_("./util.js");
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

var getMethodCaller;
var getGetter;
if (!true) {
var makeMethodCaller = function (methodName) {
    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
};

var makeGetter = function (propertyName) {
    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
};

var getCompiled = function(name, compiler, cache) {
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
};

getMethodCaller = function(name) {
    return getCompiled(name, makeMethodCaller, callerCache);
};

getGetter = function(name) {
    return getCompiled(name, makeGetter, getterCache);
};
}

function ensureMethod(obj, methodName) {
    var fn;
    if (obj != null) fn = obj[methodName];
    if (typeof fn !== "function") {
        var message = "Object " + util.classString(obj) + " has no method '" +
            util.toString(methodName) + "'";
        throw new Promise.TypeError(message);
    }
    return fn;
}

function caller(obj) {
    var methodName = this.pop();
    var fn = ensureMethod(obj, methodName);
    return fn.apply(obj, this);
}
Promise.prototype.call = function (methodName) {
    var $_len = arguments.length;var args = new Array($_len - 1); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];}
    if (!true) {
        if (canEvaluate) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
                return this._then(
                    maybeCaller, undefined, undefined, args, undefined);
            }
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

},{"./util.js":38}],6:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var errors = _dereq_("./errors.js");
var async = _dereq_("./async.js");
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
    async.enableTrampoline();
    this._setCancellable();
    this._cancellationParent = undefined;
    return this;
};

Promise.prototype.uncancellable = function () {
    var ret = this.then();
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

},{"./async.js":2,"./errors.js":13}],7:[function(_dereq_,module,exports){
"use strict";
module.exports = function() {
var async = _dereq_("./async.js");
var util = _dereq_("./util.js");
var bluebirdFramePattern =
    /[\\\/]bluebird[\\\/]js[\\\/](main|debug|zalgo|instrumented)/;
var stackFramePattern = null;
var formatStack = null;
var indentStackFrames = false;
var warn;

function CapturedTrace(parent) {
    this._parent = parent;
    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
    captureStackTrace(this, CapturedTrace);
    if (length > 32) this.uncycle();
}
util.inherits(CapturedTrace, Error);

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
    var parsed = CapturedTrace.parseStackAndMessage(error);
    var message = parsed.message;
    var stacks = [parsed.stack];

    var trace = this;
    while (trace !== undefined) {
        stacks.push(cleanStack(trace.stack.split("\n")));
        trace = trace._parent;
    }
    removeCommonRoots(stacks);
    removeDuplicateOrEmptyJumps(stacks);
    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
    util.notEnumerableProp(error, "__stackCleaned__", true);
};

function reconstructStack(message, stacks) {
    for (var i = 0; i < stacks.length - 1; ++i) {
        stacks[i].push("From previous event:");
        stacks[i] = stacks[i].join("\n");
    }
    if (i < stacks.length) {
        stacks[i] = stacks[i].join("\n");
    }
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

function cleanStack(stack) {
    var ret = [];
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        var isTraceLine = stackFramePattern.test(line) ||
            "    (No stack trace)" === line;
        var isInternalFrame = isTraceLine && shouldIgnore(line);
        if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
                line = "    " + line;
            }
            ret.push(line);
        }
    }
    return ret;
}

function stackFramesAsArray(error) {
    var stack = error.stack.replace(/\s+$/g, "").split("\n");
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
        }
    }
    if (i > 0) {
        stack = stack.slice(i);
    }
    return stack;
}

CapturedTrace.parseStackAndMessage = function(error) {
    var stack = error.stack;
    var message = error.toString();
    stack = typeof stack === "string" && stack.length > 0
                ? stackFramesAsArray(error) : ["    (No stack trace)"];
    return {
        message: message,
        stack: cleanStack(stack)
    };
};

CapturedTrace.formatAndLogError = function(error, title) {
    if (typeof console !== "undefined") {
        var message;
        if (typeof error === "object" || typeof error === "function") {
            var stack = error.stack;
            message = title + formatStack(stack, error);
        } else {
            message = title + String(error);
        }
        if (typeof warn === "function") {
            warn(message);
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
        CapturedTrace.formatAndLogError(reason, "Unhandled rejection ");
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
            return error.toString();
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
        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
        stackFramePattern = /@/;
        formatStack = v8stackFormatter;
        indentStackFrames = true;
        return function captureStackTrace(o) {
            o.stack = new Error().stack;
        };
    }

    var hasStackAfterThrow;
    try { throw new Error(); }
    catch(e) {
        hasStackAfterThrow = ("stack" in e);
    }
    if (!("stack" in err) && hasStackAfterThrow &&
        typeof Error.stackTraceLimit === "number") {
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        return function captureStackTrace(o) {
            Error.stackTraceLimit = Error.stackTraceLimit + 6;
            try { throw new Error(); }
            catch(e) { o.stack = e.stack; }
            Error.stackTraceLimit = Error.stackTraceLimit - 6;
        };
    }

    formatStack = function(stack, error) {
        if (typeof stack === "string") return stack;

        if ((typeof error === "object" ||
            typeof error === "function") &&
            error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    return null;

})([]);

var fireDomEvent;
var fireGlobalEvent = (function() {
    if (util.isNode) {
        return function(name, reason, promise) {
            if (name === "rejectionHandled") {
                return process.emit(name, promise);
            } else {
                return process.emit(name, reason, promise);
            }
        };
    } else {
        var customEventWorks = false;
        var anyEventWorks = true;
        try {
            var ev = new self.CustomEvent("test");
            customEventWorks = ev instanceof CustomEvent;
        } catch (e) {}
        if (!customEventWorks) {
            try {
                var event = document.createEvent("CustomEvent");
                event.initCustomEvent("testingtheevent", false, true, {});
                self.dispatchEvent(event);
            } catch (e) {
                anyEventWorks = false;
            }
        }
        if (anyEventWorks) {
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
        }

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

if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
    warn = function (message) {
        console.warn(message);
    };
    if (util.isNode && process.stderr.isTTY) {
        warn = function(message) {
            process.stderr.write("\u001b[31m" + message + "\u001b[39m\n");
        };
    } else if (!util.isNode && typeof (new Error().stack) === "string") {
        warn = function(message) {
            console.warn("%c" + message, "color: red");
        };
    }
}

return CapturedTrace;
};

},{"./async.js":2,"./util.js":38}],8:[function(_dereq_,module,exports){
"use strict";
module.exports = function(NEXT_FILTER) {
var util = _dereq_("./util.js");
var errors = _dereq_("./errors.js");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var keys = _dereq_("./es5.js").keys;
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
    var boundTo = promise._boundValue();
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

},{"./errors.js":13,"./es5.js":14,"./util.js":38}],9:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, CapturedTrace, isDebugging) {
var contextStack = [];
function Context() {
    this._trace = new CapturedTrace(peekContext());
}
Context.prototype._pushContext = function () {
    if (!isDebugging()) return;
    if (this._trace !== undefined) {
        contextStack.push(this._trace);
    }
};

Context.prototype._popContext = function () {
    if (!isDebugging()) return;
    if (this._trace !== undefined) {
        contextStack.pop();
    }
};

function createContext() {
    if (isDebugging()) return new Context();
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

return createContext;
};

},{}],10:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, CapturedTrace) {
var getDomain = Promise._getDomain;
var async = _dereq_("./async.js");
var Warning = _dereq_("./errors.js").Warning;
var util = _dereq_("./util.js");
var canAttachTrace = util.canAttachTrace;
var unhandledRejectionHandled;
var possiblyUnhandledRejection;
var debugging = false || (util.isNode &&
                    (!!process.env["BLUEBIRD_DEBUG"] ||
                     process.env["NODE_ENV"] === "development"));

if (util.isNode && process.env["BLUEBIRD_DEBUG"] == 0) debugging = false;

if (debugging) {
    async.disableTrampolineIfNecessary();
}

Promise.prototype._ignoreRejections = function() {
    this._unsetRejectionIsUnhandled();
    this._bitField = this._bitField | 16777216;
};

Promise.prototype._ensurePossibleRejectionHandled = function () {
    if ((this._bitField & 16777216) !== 0) return;
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

Promise.prototype._setUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField | 524288;
};

Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField & (~524288);
};

Promise.prototype._isUnhandledRejectionNotified = function () {
    return (this._bitField & 524288) > 0;
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

Promise.prototype._captureStackTrace = function () {
    if (debugging) {
        this._trace = new CapturedTrace(this._peekContext());
    }
    return this;
};

Promise.prototype._attachExtraTrace = function (error, ignoreSelf) {
    if (debugging && canAttachTrace(error)) {
        var trace = this._trace;
        if (trace !== undefined) {
            if (ignoreSelf) trace = trace._parent;
        }
        if (trace !== undefined) {
            trace.attachExtraTrace(error);
        } else if (!error.__stackCleaned__) {
            var parsed = CapturedTrace.parseStackAndMessage(error);
            util.notEnumerableProp(error, "stack",
                parsed.message + "\n" + parsed.stack.join("\n"));
            util.notEnumerableProp(error, "__stackCleaned__", true);
        }
    }
};

Promise.prototype._warn = function(message) {
    var warning = new Warning(message);
    var ctx = this._peekContext();
    if (ctx) {
        ctx.attachExtraTrace(warning);
    } else {
        var parsed = CapturedTrace.parseStackAndMessage(warning);
        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
    }
    CapturedTrace.formatAndLogError(warning, "");
};

Promise.onPossiblyUnhandledRejection = function (fn) {
    var domain = getDomain();
    possiblyUnhandledRejection =
        typeof fn === "function" ? (domain === null ? fn : domain.bind(fn))
                                 : undefined;
};

Promise.onUnhandledRejectionHandled = function (fn) {
    var domain = getDomain();
    unhandledRejectionHandled =
        typeof fn === "function" ? (domain === null ? fn : domain.bind(fn))
                                 : undefined;
};

Promise.longStackTraces = function () {
    if (async.haveItemsQueued() &&
        debugging === false
   ) {
        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/DT1qyG\u000a");
    }
    debugging = CapturedTrace.isSupported();
    if (debugging) {
        async.disableTrampolineIfNecessary();
    }
};

Promise.hasLongStackTraces = function () {
    return debugging && CapturedTrace.isSupported();
};

if (!CapturedTrace.isSupported()) {
    Promise.longStackTraces = function(){};
    debugging = false;
}

return function() {
    return debugging;
};
};

},{"./async.js":2,"./errors.js":13,"./util.js":38}],11:[function(_dereq_,module,exports){
"use strict";
var util = _dereq_("./util.js");
var isPrimitive = util.isPrimitive;

module.exports = function(Promise) {
var returner = function () {
    return this;
};
var thrower = function () {
    throw this;
};
var returnUndefined = function() {};
var throwUndefined = function() {
    throw undefined;
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
    if (value === undefined) return this.then(returnUndefined);

    if (isPrimitive(value)) {
        return this._then(
            wrapper(value, 2),
            undefined,
            undefined,
            undefined,
            undefined
       );
    } else if (value instanceof Promise) {
        value._ignoreRejections();
    }
    return this._then(returner, undefined, undefined, value, undefined);
};

Promise.prototype["throw"] =
Promise.prototype.thenThrow = function (reason) {
    if (reason === undefined) return this.then(throwUndefined);

    if (isPrimitive(reason)) {
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

},{"./util.js":38}],12:[function(_dereq_,module,exports){
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

},{}],13:[function(_dereq_,module,exports){
"use strict";
var es5 = _dereq_("./es5.js");
var Objectfreeze = es5.freeze;
var util = _dereq_("./util.js");
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
        } else {
            Error.call(this);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var Warning = subError("Warning", "warning");
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

es5.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: false,
    writable: true,
    enumerable: true
});
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
    if (!(this instanceof OperationalError))
        return new OperationalError(message);
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
    AggregateError: errorTypes.AggregateError,
    Warning: Warning
};

},{"./es5.js":14,"./util.js":38}],14:[function(_dereq_,module,exports){
var isES5 = (function(){
    "use strict";
    return this === undefined;
})();

if (isES5) {
    module.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
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

    var ObjectGetDescriptor = function(o, key) {
        return {value: o[key]};
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
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5: isES5,
        propertyIsWritable: function() {
            return true;
        }
    };
}

},{}],15:[function(_dereq_,module,exports){
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

},{}],16:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, NEXT_FILTER, tryConvertToPromise) {
var util = _dereq_("./util.js");
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
    if (isPrimitive(reasonOrValue)) {
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
                    ? handler.call(promise._boundValue())
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
                    ? handler.call(promise._boundValue(), value)
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

},{"./util.js":38}],17:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          apiRejection,
                          INTERNAL,
                          tryConvertToPromise) {
var errors = _dereq_("./errors.js");
var TypeError = errors.TypeError;
var util = _dereq_("./util.js");
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
        return this._promise._rejectCallback(result.e, false, true);
    }

    var value = result.value;
    if (result.done === true) {
        this._promise._resolveCallback(value);
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
    if (typeof generatorFunction !== "function") {
        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/6Vqhm0\u000a");
    }
    var spawn = new PromiseSpawn(generatorFunction, this);
    var ret = spawn.promise();
    spawn._run(Promise.spawn);
    return ret;
};
};

},{"./errors.js":13,"./util.js":38}],18:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, tryConvertToPromise, INTERNAL) {
var util = _dereq_("./util.js");
var canEvaluate = util.canEvaluate;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var reject;

if (!true) {
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
            } else {
                promise._resolveCallback(ret);
            }
        } else {
            this.now = now;
        }
    };

    var reject = function (reason) {
        this._reject(reason);
    };
}
}

Promise.join = function () {
    var last = arguments.length - 1;
    var fn;
    if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        if (!true) {
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
    }
    var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];}
    if (fn) args.pop();
    var ret = new PromiseArray(args).promise();
    return fn !== undefined ? ret.spread(fn) : ret;
};

};

},{"./util.js":38}],19:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL) {
var getDomain = Promise._getDomain;
var async = _dereq_("./async.js");
var util = _dereq_("./util.js");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var PENDING = {};
var EMPTY_ARRAY = [];

function MappingPromiseArray(promises, fn, limit, _filter) {
    this.constructor$(promises);
    this._promise._captureStackTrace();
    var domain = getDomain();
    this._callback = domain === null ? fn : domain.bind(fn);
    this._preservedValues = _filter === INTERNAL
        ? new Array(this.length())
        : null;
    this._limit = limit;
    this._inFlight = 0;
    this._queue = limit >= 1 ? [] : EMPTY_ARRAY;
    async.invoke(init, this, undefined);
}
util.inherits(MappingPromiseArray, PromiseArray);
function init() {this._init$(undefined, -2);}

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
        var receiver = this._promise._boundValue();
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

},{"./async.js":2,"./util.js":38}],20:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var util = _dereq_("./util.js");
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
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
    var value = util.isArray(args)
        ? tryCatch(fn).apply(ctx, args)
        : tryCatch(fn).call(ctx, args);
    ret._popContext();
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === util.errorObj) {
        this._rejectCallback(value.e, false, true);
    } else {
        this._resolveCallback(value, true);
    }
};
};

},{"./util.js":38}],21:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var util = _dereq_("./util.js");
var async = _dereq_("./async.js");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function spreadAdapter(val, nodeback) {
    var promise = this;
    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
    var ret =
        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

function successAdapter(val, nodeback) {
    var promise = this;
    var receiver = promise._boundValue();
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
    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

Promise.prototype.asCallback =
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

},{"./async.js":2,"./util.js":38}],22:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, PromiseArray) {
var util = _dereq_("./util.js");
var async = _dereq_("./async.js");
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

},{"./async.js":2,"./util.js":38}],23:[function(_dereq_,module,exports){
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

var util = _dereq_("./util.js");

var getDomain;
if (util.isNode) {
    getDomain = function() {
        var ret = process.domain;
        if (ret === undefined) ret = null;
        return ret;
    };
} else {
    getDomain = function() {
        return null;
    };
}
util.notEnumerableProp(Promise, "_getDomain", getDomain);

var UNDEFINED_BINDING = {};
var async = _dereq_("./async.js");
var errors = _dereq_("./errors.js");
var TypeError = Promise.TypeError = errors.TypeError;
Promise.RangeError = errors.RangeError;
Promise.CancellationError = errors.CancellationError;
Promise.TimeoutError = errors.TimeoutError;
Promise.OperationalError = errors.OperationalError;
Promise.RejectionError = errors.OperationalError;
Promise.AggregateError = errors.AggregateError;
var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {e: null};
var tryConvertToPromise = _dereq_("./thenables.js")(Promise, INTERNAL);
var PromiseArray =
    _dereq_("./promise_array.js")(Promise, INTERNAL,
                                    tryConvertToPromise, apiRejection);
var CapturedTrace = _dereq_("./captured_trace.js")();
var isDebugging = _dereq_("./debuggability.js")(Promise, CapturedTrace);
 /*jshint unused:false*/
var createContext =
    _dereq_("./context.js")(Promise, CapturedTrace, isDebugging);
var CatchFilter = _dereq_("./catch_filter.js")(NEXT_FILTER);
var PromiseResolver = _dereq_("./promise_resolver.js");
var nodebackForPromise = PromiseResolver._nodebackForPromise;
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
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
    if (resolver !== INTERNAL) this._resolveFromResolver(resolver);
}

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
    if (isDebugging() && arguments.length > 0 &&
        typeof didFulfill !== "function" &&
        typeof didReject !== "function") {
        var msg = ".then() only accepts functions but was passed: " +
                util.classString(didFulfill);
        if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
        }
        this._warn(msg);
    }
    return this._then(didFulfill, didReject, didProgress,
        undefined, undefined);
};

Promise.prototype.done = function (didFulfill, didReject, didProgress) {
    var promise = this._then(didFulfill, didReject, didProgress,
        undefined, undefined);
    promise._setIsFinal();
};

Promise.prototype.spread = function (didFulfill, didReject) {
    return this.all()._then(didFulfill, didReject, undefined, APPLY, undefined);
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
    return new PromiseArray(this).promise();
};

Promise.prototype.error = function (fn) {
    return this.caught(util.originatesFromRejection, fn);
};

Promise.is = function (val) {
    return val instanceof Promise;
};

Promise.fromNode = function(fn) {
    var ret = new Promise(INTERNAL);
    var result = tryCatch(fn)(nodebackForPromise(ret));
    if (result === errorObj) {
        ret._rejectCallback(result.e, true, true);
    }
    return ret;
};

Promise.all = function (promises) {
    return new PromiseArray(promises).promise();
};

Promise.defer = Promise.pending = function () {
    var promise = new Promise(INTERNAL);
    return new PromiseResolver(promise);
};

Promise.cast = function (obj) {
    var ret = tryConvertToPromise(obj);
    if (!(ret instanceof Promise)) {
        var val = ret;
        ret = new Promise(INTERNAL);
        ret._fulfillUnchecked(val);
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

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") throw new TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
    var prev = async._schedule;
    async._schedule = fn;
    return prev;
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

    var callbackIndex = target._addCallbacks(didFulfill,
                                             didReject,
                                             didProgress,
                                             ret,
                                             receiver,
                                             getDomain());

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

Promise.prototype._setIsMigrated = function () {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._unsetIsMigrated = function () {
    this._bitField = this._bitField & (~4194304);
};

Promise.prototype._isMigrated = function () {
    return (this._bitField & 4194304) > 0;
};

Promise.prototype._receiverAt = function (index) {
    var ret = index === 0
        ? this._receiver0
        : this[
            index * 5 - 5 + 4];
    if (ret === UNDEFINED_BINDING) {
        return undefined;
    } else if (ret === undefined && this._isBound()) {
        return this._boundValue();
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

Promise.prototype._boundValue = function() {
    var ret = this._boundTo;
    if (ret !== undefined) {
        if (ret instanceof Promise) {
            if (ret.isFulfilled()) {
                return ret.value();
            } else {
                return undefined;
            }
        }
    }
    return ret;
};

Promise.prototype._migrateCallbacks = function (follower, index) {
    var fulfill = follower._fulfillmentHandlerAt(index);
    var reject = follower._rejectionHandlerAt(index);
    var progress = follower._progressHandlerAt(index);
    var promise = follower._promiseAt(index);
    var receiver = follower._receiverAt(index);
    if (promise instanceof Promise) promise._setIsMigrated();
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, progress, promise, receiver, null);
};

Promise.prototype._addCallbacks = function (
    fulfill,
    reject,
    progress,
    promise,
    receiver,
    domain
) {
    var index = this._length();

    if (index >= 131071 - 5) {
        index = 0;
        this._setLength(0);
    }

    if (index === 0) {
        this._promise0 = promise;
        if (receiver !== undefined) this._receiver0 = receiver;
        if (typeof fulfill === "function" && !this._isCarryingStackTrace()) {
            this._fulfillmentHandler0 =
                domain === null ? fulfill : domain.bind(fulfill);
        }
        if (typeof reject === "function") {
            this._rejectionHandler0 =
                domain === null ? reject : domain.bind(reject);
        }
        if (typeof progress === "function") {
            this._progressHandler0 =
                domain === null ? progress : domain.bind(progress);
        }
    } else {
        var base = index * 5 - 5;
        this[base + 3] = promise;
        this[base + 4] = receiver;
        if (typeof fulfill === "function") {
            this[base + 0] =
                domain === null ? fulfill : domain.bind(fulfill);
        }
        if (typeof reject === "function") {
            this[base + 1] =
                domain === null ? reject : domain.bind(reject);
        }
        if (typeof progress === "function") {
            this[base + 2] =
                domain === null ? progress : domain.bind(progress);
        }
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

Promise.prototype._resolveCallback = function(value, shouldBind) {
    if (this._isFollowingOrFulfilledOrRejected()) return;
    if (value === this)
        return this._rejectCallback(makeSelfResolutionError(), false, true);
    var maybePromise = tryConvertToPromise(value, this);
    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

    var propagationFlags = 1 | (shouldBind ? 4 : 0);
    this._propagateFrom(maybePromise, propagationFlags);
    var promise = maybePromise._target();
    if (promise._isPending()) {
        var len = this._length();
        for (var i = 0; i < len; ++i) {
            promise._migrateCallbacks(this, i);
        }
        this._setFollowing();
        this._setLength(0);
        this._setFollowee(promise);
    } else if (promise._isFulfilled()) {
        this._fulfillUnchecked(promise._value());
    } else {
        this._rejectUnchecked(promise._reason(),
            promise._getCarriedStackTrace());
    }
};

Promise.prototype._rejectCallback =
function(reason, synchronous, shouldNotMarkOriginatingFromRejection) {
    if (!shouldNotMarkOriginatingFromRejection) {
        util.markAsOriginatingFromRejection(reason);
    }
    var trace = util.ensureErrorObject(reason);
    var hasStack = trace === reason;
    this._attachExtraTrace(trace, synchronous ? hasStack : false);
    this._reject(reason, hasStack ? undefined : trace);
};

Promise.prototype._resolveFromResolver = function (resolver) {
    var promise = this;
    this._captureStackTrace();
    this._pushContext();
    var synchronous = true;
    var r = tryCatch(resolver)(function(value) {
        if (promise === null) return;
        promise._resolveCallback(value);
        promise = null;
    }, function (reason) {
        if (promise === null) return;
        promise._rejectCallback(reason, synchronous);
        promise = null;
    });
    synchronous = false;
    this._popContext();

    if (r !== undefined && r === errorObj && promise !== null) {
        promise._rejectCallback(r.e, true, true);
        promise = null;
    }
};

Promise.prototype._settlePromiseFromHandler = function (
    handler, receiver, value, promise
) {
    if (promise._isRejected()) return;
    promise._pushContext();
    var x;
    if (receiver === APPLY && !this._isRejected()) {
        x = tryCatch(handler).apply(this._boundValue(), value);
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
    if ((flags & 4) > 0 && parent._isBound()) {
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
    async.settlePromises(this);
    this._setSettlePromisesQueued();
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

util.notEnumerableProp(Promise,
                       "_makeSelfResolutionError",
                       makeSelfResolutionError);

_dereq_("./progress.js")(Promise, PromiseArray);
_dereq_("./method.js")(Promise, INTERNAL, tryConvertToPromise, apiRejection);
_dereq_("./bind.js")(Promise, INTERNAL, tryConvertToPromise);
_dereq_("./finally.js")(Promise, NEXT_FILTER, tryConvertToPromise);
_dereq_("./direct_resolve.js")(Promise);
_dereq_("./synchronous_inspection.js")(Promise);
_dereq_("./join.js")(Promise, PromiseArray, tryConvertToPromise, INTERNAL);
Promise.Promise = Promise;
_dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL);
_dereq_('./cancel.js')(Promise);
_dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext);
_dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise);
_dereq_('./nodeify.js')(Promise);
_dereq_('./call_get.js')(Promise);
_dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
_dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
_dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL);
_dereq_('./settle.js')(Promise, PromiseArray);
_dereq_('./some.js')(Promise, PromiseArray, apiRejection);
_dereq_('./promisify.js')(Promise, INTERNAL);
_dereq_('./any.js')(Promise);
_dereq_('./each.js')(Promise, INTERNAL);
_dereq_('./timers.js')(Promise, INTERNAL);
_dereq_('./filter.js')(Promise, INTERNAL);
                                                         
    util.toFastProperties(Promise);                                          
    util.toFastProperties(Promise.prototype);                                
    function fillTypes(value) {                                              
        var p = new Promise(INTERNAL);                                       
        p._fulfillmentHandler0 = value;                                      
        p._rejectionHandler0 = value;                                        
        p._progressHandler0 = value;                                         
        p._promise0 = value;                                                 
        p._receiver0 = value;                                                
        p._settledValue = value;                                             
    }                                                                        
    // Complete slack tracking, opt out of field-type tracking and           
    // stabilize map                                                         
    fillTypes({a: 1});                                                       
    fillTypes({b: 2});                                                       
    fillTypes({c: 3});                                                       
    fillTypes(1);                                                            
    fillTypes(function(){});                                                 
    fillTypes(undefined);                                                    
    fillTypes(false);                                                        
    fillTypes(new Promise(INTERNAL));                                        
    CapturedTrace.setBounds(async.firstLineError, util.lastLineError);       
    return Promise;                                                          

};

},{"./any.js":1,"./async.js":2,"./bind.js":3,"./call_get.js":5,"./cancel.js":6,"./captured_trace.js":7,"./catch_filter.js":8,"./context.js":9,"./debuggability.js":10,"./direct_resolve.js":11,"./each.js":12,"./errors.js":13,"./filter.js":15,"./finally.js":16,"./generators.js":17,"./join.js":18,"./map.js":19,"./method.js":20,"./nodeify.js":21,"./progress.js":22,"./promise_array.js":24,"./promise_resolver.js":25,"./promisify.js":26,"./props.js":27,"./race.js":29,"./reduce.js":30,"./settle.js":32,"./some.js":33,"./synchronous_inspection.js":34,"./thenables.js":35,"./timers.js":36,"./using.js":37,"./util.js":38}],24:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise,
    apiRejection) {
var util = _dereq_("./util.js");
var isArray = util.isArray;

function toResolutionValue(val) {
    switch(val) {
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
        this._promise._reject(apiRejection("expecting an array, a promise or a thenable\u000a\u000a    See http://goo.gl/s8MMhc\u000a")._reason());
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
                maybePromise._ignoreRejections();
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

},{"./util.js":38}],25:[function(_dereq_,module,exports){
"use strict";
var util = _dereq_("./util.js");
var maybeWrapAsError = util.maybeWrapAsError;
var errors = _dereq_("./errors.js");
var TimeoutError = errors.TimeoutError;
var OperationalError = errors.OperationalError;
var haveGetters = util.haveGetters;
var es5 = _dereq_("./es5.js");

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

PromiseResolver.prototype.cancel = function (err) {
    this.promise.cancel(err);
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

},{"./errors.js":13,"./es5.js":14,"./util.js":38}],26:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var THIS = {};
var util = _dereq_("./util.js");
var nodebackForPromise = _dereq_("./promise_resolver.js")
    ._nodebackForPromise;
var withAppended = util.withAppended;
var maybeWrapAsError = util.maybeWrapAsError;
var canEvaluate = util.canEvaluate;
var TypeError = _dereq_("./errors").TypeError;
var defaultSuffix = "Async";
var defaultPromisified = {__isPromisified__: true};
var noCopyProps = [
    "arity",    "length",
    "name",
    "arguments",
    "caller",
    "callee",
    "prototype",
    "__isPromisified__"
];
var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

var defaultFilter = function(name) {
    return util.isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        name !== "constructor";
};

function propsFilter(key) {
    return !noCopyPropsPattern.test(key);
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

var escapeIdentRegex = function(str) {
    return str.replace(/([$])/, "\\$");
};

var makeNodePromisifiedEval;
if (!true) {
var switchCaseArgumentOrder = function(likelyArgumentCount) {
    var ret = [likelyArgumentCount];
    var min = Math.max(0, likelyArgumentCount - 1 - 3);
    for(var i = likelyArgumentCount - 1; i >= min; --i) {
        ret.push(i);
    }
    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
        ret.push(i);
    }
    return ret;
};

var argumentSequence = function(argumentCount) {
    return util.filledRange(argumentCount, "_arg", "");
};

var parameterDeclaration = function(parameterCount) {
    return util.filledRange(
        Math.max(parameterCount, 3), "_arg", "");
};

var parameterCount = function(fn) {
    if (typeof fn.length === "number") {
        return Math.max(Math.min(fn.length, 1023 + 1), 0);
    }
    return 0;
};

makeNodePromisifiedEval =
function(callback, receiver, originalName, fn) {
    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

    function generateCallForArgumentCount(count) {
        var args = argumentSequence(count).join(", ");
        var comma = count > 0 ? ", " : "";
        var ret;
        if (shouldProxyThis) {
            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
        } else {
            ret = receiver === undefined
                ? "ret = callback({{args}}, nodeback); break;\n"
                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
        }
        return ret.replace("{{args}}", args).replace(", ", comma);
    }

    function generateArgumentSwitchCase() {
        var ret = "";
        for (var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] +":" +
                generateCallForArgumentCount(argumentOrder[i]);
        }

        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
                                ? "ret = callback.apply(this, args);\n"
                                : "ret = callback.apply(receiver, args);\n"));
        return ret;
    }

    var getFunctionCode = typeof callback === "string"
                                ? ("this != null ? this['"+callback+"'] : fn")
                                : "fn";

    return new Function("Promise",
                        "fn",
                        "receiver",
                        "withAppended",
                        "maybeWrapAsError",
                        "nodebackForPromise",
                        "tryCatch",
                        "errorObj",
                        "notEnumerableProp",
                        "INTERNAL","'use strict';                            \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise);                      \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
        "
        .replace("Parameters", parameterDeclaration(newParameterCount))
        .replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
        .replace("[GetFunctionCode]", getFunctionCode))(
            Promise,
            fn,
            receiver,
            withAppended,
            maybeWrapAsError,
            nodebackForPromise,
            util.tryCatch,
            util.errorObj,
            util.notEnumerableProp,
            INTERNAL
        );
};
}

function makeNodePromisifiedClosure(callback, receiver, _, fn) {
    var defaultThis = (function() {return this;})();
    var method = callback;
    if (typeof method === "string") {
        callback = fn;
    }
    function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        var cb = typeof method === "string" && this !== defaultThis
            ? this[method] : callback;
        var fn = nodebackForPromise(promise);
        try {
            cb.apply(_receiver, withAppended(arguments, fn));
        } catch(e) {
            promise._rejectCallback(maybeWrapAsError(e), true, true);
        }
        return promise;
    }
    util.notEnumerableProp(promisified, "__isPromisified__", true);
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
    var ret = promisify(fn, arguments.length < 2 ? THIS : receiver);
    util.copyDescriptors(fn, ret, propsFilter);
    return ret;
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

    var keys = util.inheritedDataKeys(target);
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


},{"./errors":13,"./promise_resolver.js":25,"./util.js":38}],27:[function(_dereq_,module,exports){
"use strict";
module.exports = function(
    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
var util = _dereq_("./util.js");
var isObject = util.isObject;
var es5 = _dereq_("./es5.js");

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

},{"./es5.js":14,"./util.js":38}],28:[function(_dereq_,module,exports){
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
    var moveItemsCount = (front + length) & (oldCapacity - 1);
    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
};

module.exports = Queue;

},{}],29:[function(_dereq_,module,exports){
"use strict";
module.exports = function(
    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var isArray = _dereq_("./util.js").isArray;

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

},{"./util.js":38}],30:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL) {
var getDomain = Promise._getDomain;
var async = _dereq_("./async.js");
var util = _dereq_("./util.js");
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
    var domain = getDomain();
    this._callback = domain === null ? fn : domain.bind(fn);
    this._accum = accum;
    if (!rejected) async.invoke(init, this, undefined);
}
function init() {
    this._init$(undefined, -5);
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
        valuesPhase = this._valuesPhase = new Array(length);
        for (valuesPhaseIndex=0; valuesPhaseIndex<length; ++valuesPhaseIndex) {
            valuesPhase[valuesPhaseIndex] = 0;
        }
    }
    valuesPhaseIndex = valuesPhase[index];

    if (index === 0 && this._zerothIsAccum) {
        this._accum = value;
        this._gotAccum = gotAccum = true;
        valuesPhase[index] = ((valuesPhaseIndex === 0)
            ? 1 : 2);
    } else if (index === -1) {
        this._accum = value;
        this._gotAccum = gotAccum = true;
    } else {
        if (valuesPhaseIndex === 0) {
            valuesPhase[index] = 1;
        } else {
            valuesPhase[index] = 2;
            this._accum = value;
        }
    }
    if (!gotAccum) return;

    var callback = this._callback;
    var receiver = this._promise._boundValue();
    var ret;

    for (var i = this._reducingIndex; i < length; ++i) {
        valuesPhaseIndex = valuesPhase[i];
        if (valuesPhaseIndex === 2) {
            this._reducingIndex = i + 1;
            continue;
        }
        if (valuesPhaseIndex !== 1) return;
        value = values[i];
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

},{"./async.js":2,"./util.js":38}],31:[function(_dereq_,module,exports){
"use strict";
var schedule;
var util = _dereq_("./util");
var noAsyncScheduler = function() {
    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/m3OTXk\u000a");
};
if (util.isNode && typeof MutationObserver === "undefined") {
    var GlobalSetImmediate = global.setImmediate;
    var ProcessNextTick = process.nextTick;
    schedule = util.isRecentNode
                ? function(fn) { GlobalSetImmediate.call(global, fn); }
                : function(fn) { ProcessNextTick.call(process, fn); };
} else if ((typeof MutationObserver !== "undefined") &&
          !(typeof window !== "undefined" &&
            window.navigator &&
            window.navigator.standalone)) {
    schedule = function(fn) {
        var div = document.createElement("div");
        var observer = new MutationObserver(fn);
        observer.observe(div, {attributes: true});
        return function() { div.classList.toggle("foo"); };
    };
    schedule.isStatic = true;
} else if (typeof setImmediate !== "undefined") {
    schedule = function (fn) {
        setImmediate(fn);
    };
} else if (typeof setTimeout !== "undefined") {
    schedule = function (fn) {
        setTimeout(fn, 0);
    };
} else {
    schedule = noAsyncScheduler;
}
module.exports = schedule;

},{"./util":38}],32:[function(_dereq_,module,exports){
"use strict";
module.exports =
    function(Promise, PromiseArray) {
var PromiseInspection = Promise.PromiseInspection;
var util = _dereq_("./util.js");

function SettledPromiseArray(values) {
    this.constructor$(values);
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

},{"./util.js":38}],33:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, apiRejection) {
var util = _dereq_("./util.js");
var RangeError = _dereq_("./errors.js").RangeError;
var AggregateError = _dereq_("./errors.js").AggregateError;
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

},{"./errors.js":13,"./util.js":38}],34:[function(_dereq_,module,exports){
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
    target._unsetRejectionIsUnhandled();
    return target._settledValue;
};


Promise.PromiseInspection = PromiseInspection;
};

},{}],35:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var util = _dereq_("./util.js");
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
    var ret = promise;
    if (context) context._pushContext();
    promise._captureStackTrace();
    if (context) context._popContext();
    var synchronous = true;
    var result = util.tryCatch(then).call(x,
                                        resolveFromThenable,
                                        rejectFromThenable,
                                        progressFromThenable);
    synchronous = false;
    if (promise && result === errorObj) {
        promise._rejectCallback(result.e, true, true);
        promise = null;
    }

    function resolveFromThenable(value) {
        if (!promise) return;
        promise._resolveCallback(value);
        promise = null;
    }

    function rejectFromThenable(reason) {
        if (!promise) return;
        promise._rejectCallback(reason, synchronous, true);
        promise = null;
    }

    function progressFromThenable(value) {
        if (!promise) return;
        if (typeof promise._progress === "function") {
            promise._progress(value);
        }
    }
    return ret;
}

return tryConvertToPromise;
};

},{"./util.js":38}],36:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var util = _dereq_("./util.js");
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

var afterValue = function(value) { return delay(+this).thenReturn(value); };
var delay = Promise.delay = function (value, ms) {
    if (ms === undefined) {
        ms = value;
        value = undefined;
        var ret = new Promise(INTERNAL);
        setTimeout(function() { ret._fulfill(); }, ms);
        return ret;
    }
    ms = +ms;
    return Promise.resolve(value)._then(afterValue, null, null, ms, undefined);
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
    ms = +ms;
    var ret = this.then().cancellable();
    ret._cancellationParent = this;
    var handle = setTimeout(function timeoutTimeout() {
        afterTimeout(ret, message);
    }, ms);
    return ret._then(successClear, failureClear, undefined, handle, undefined);
};

};

},{"./util.js":38}],37:[function(_dereq_,module,exports){
"use strict";
module.exports = function (Promise, apiRejection, tryConvertToPromise,
    createContext) {
    var TypeError = _dereq_("./errors.js").TypeError;
    var inherits = _dereq_("./util.js").inherits;
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

    function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
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

        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
            input = arguments[0];
            len = input.length;
            spreadArgs = false;
        } else {
            input = arguments;
            len--;
        }
        var resources = new Array(len);
        for (var i = 0; i < len; ++i) {
            var resource = input[i];
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
                    ret = spreadArgs
                        ? fn.apply(undefined, vals) : fn.call(undefined,  vals);
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

},{"./errors.js":13,"./util.js":38}],38:[function(_dereq_,module,exports){
"use strict";
var es5 = _dereq_("./es5.js");
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
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
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


function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";

}

function isObject(value) {
    return !isPrimitive(value);
}

function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;

    return new Error(safeToString(maybeError));
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

function thrower(r) {
    throw r;
}

var inheritedDataKeys = (function() {
    var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
    ];

    var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
            if (excludedPrototypes[i] === val) {
                return true;
            }
        }
        return false;
    };

    if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj) {
            var ret = [];
            var visitedKeys = Object.create(null);
            while (obj != null && !isExcludedProto(obj)) {
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
        var hasProp = {}.hasOwnProperty;
        return function(obj) {
            if (isExcludedProto(obj)) return [];
            var ret = [];

            /*jshint forin:false */
            enumeration: for (var key in obj) {
                if (hasProp.call(obj, key)) {
                    ret.push(key);
                } else {
                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                        if (hasProp.call(excludedPrototypes[i], key)) {
                            continue enumeration;
                        }
                    }
                    ret.push(key);
                }
            }
            return ret;
        };
    }

})();

var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = es5.names(fn.prototype);

            var hasMethods = es5.isES5 && keys.length > 1;
            var hasMethodsOtherThanConstructor = keys.length > 0 &&
                !(keys.length === 1 && keys[0] === "constructor");
            var hasThisAssignmentAndStaticMethods =
                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

            if (hasMethods || hasMethodsOtherThanConstructor ||
                hasThisAssignmentAndStaticMethods) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

function toFastProperties(obj) {
    /*jshint -W027,-W055,-W031*/
    function f() {}
    f.prototype = obj;
    var l = 8;
    while (l--) new f();
    return obj;
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

function classString(obj) {
    return {}.toString.call(obj);
}

function copyDescriptors(from, to, filter) {
    var keys = es5.names(from);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
            try {
                es5.defineProperty(to, key, es5.getDescriptor(from, key));
            } catch (ignore) {}
        }
    }
}

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
    maybeWrapAsError: maybeWrapAsError,
    toFastProperties: toFastProperties,
    filledRange: filledRange,
    toString: safeToString,
    canAttachTrace: canAttachTrace,
    ensureErrorObject: ensureErrorObject,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
    classString: classString,
    copyDescriptors: copyDescriptors,
    hasDevTools: typeof chrome !== "undefined" && chrome &&
                 typeof chrome.loadTimes === "function",
    isNode: typeof process !== "undefined" &&
        classString(process).toLowerCase() === "[object process]"
};
ret.isRecentNode = ret.isNode && (function() {
    var version = process.versions.node.split(".").map(Number);
    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
})();

if (ret.isNode) ret.toFastProperties(process);

try {throw new Error(); } catch (e) {ret.lastLineError = e;}
module.exports = ret;

},{"./es5.js":14}]},{},[4])(4)
});                    ;if (typeof window !== 'undefined' && window !== null) {                               window.P = window.Promise;                                                     } else if (typeof self !== 'undefined' && self !== null) {                             self.P = self.Promise;                                                         }
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":110}],105:[function(require,module,exports){
module.exports = function (string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
}

module.exports.words = function (string) {
  return string.replace(/(^|[^a-zA-Z\u00C0-\u017F'])([a-zA-Z\u00C0-\u017F])/g, function (m) {
    return m.toUpperCase()
  })
}

},{}],106:[function(require,module,exports){
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
},{"events":108}],107:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"dup":97}],108:[function(require,module,exports){
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

},{}],109:[function(require,module,exports){
(function (process){
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

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":110}],110:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
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
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
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
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

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

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],111:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.3.2 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
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
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

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
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
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
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
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
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
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
		'version': '1.3.2',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
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
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
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
},{}],112:[function(require,module,exports){
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

},{}],113:[function(require,module,exports){
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

},{}],114:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":112,"./encode":113}],115:[function(require,module,exports){
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

},{"punycode":111,"querystring":114}],116:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _handlebarsRuntime = require('./handlebars.runtime');

// Compiler imports

var _handlebarsRuntime2 = _interopRequireDefault(_handlebarsRuntime);

var _handlebarsCompilerAst = require('./handlebars/compiler/ast');

var _handlebarsCompilerAst2 = _interopRequireDefault(_handlebarsCompilerAst);

var _handlebarsCompilerBase = require('./handlebars/compiler/base');

var _handlebarsCompilerCompiler = require('./handlebars/compiler/compiler');

var _handlebarsCompilerJavascriptCompiler = require('./handlebars/compiler/javascript-compiler');

var _handlebarsCompilerJavascriptCompiler2 = _interopRequireDefault(_handlebarsCompilerJavascriptCompiler);

var _handlebarsCompilerVisitor = require('./handlebars/compiler/visitor');

var _handlebarsCompilerVisitor2 = _interopRequireDefault(_handlebarsCompilerVisitor);

var _handlebarsNoConflict = require('./handlebars/no-conflict');

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

var _create = _handlebarsRuntime2['default'].create;
function create() {
  var hb = _create();

  hb.compile = function (input, options) {
    return _handlebarsCompilerCompiler.compile(input, options, hb);
  };
  hb.precompile = function (input, options) {
    return _handlebarsCompilerCompiler.precompile(input, options, hb);
  };

  hb.AST = _handlebarsCompilerAst2['default'];
  hb.Compiler = _handlebarsCompilerCompiler.Compiler;
  hb.JavaScriptCompiler = _handlebarsCompilerJavascriptCompiler2['default'];
  hb.Parser = _handlebarsCompilerBase.parser;
  hb.parse = _handlebarsCompilerBase.parse;

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst.Visitor = _handlebarsCompilerVisitor2['default'];

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];


},{"./handlebars.runtime":117,"./handlebars/compiler/ast":119,"./handlebars/compiler/base":120,"./handlebars/compiler/compiler":122,"./handlebars/compiler/javascript-compiler":124,"./handlebars/compiler/visitor":127,"./handlebars/no-conflict":141}],117:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _handlebarsBase = require('./handlebars/base');

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var base = _interopRequireWildcard(_handlebarsBase);

var _handlebarsSafeString = require('./handlebars/safe-string');

var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

var _handlebarsException = require('./handlebars/exception');

var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

var _handlebarsUtils = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_handlebarsUtils);

var _handlebarsRuntime = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_handlebarsRuntime);

var _handlebarsNoConflict = require('./handlebars/no-conflict');

// For compatibility and usage outside of module systems, make the Handlebars object a namespace

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];


},{"./handlebars/base":118,"./handlebars/exception":131,"./handlebars/no-conflict":141,"./handlebars/runtime":142,"./handlebars/safe-string":143,"./handlebars/utils":144}],118:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('./utils');

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _helpers = require('./helpers');

var _decorators = require('./decorators');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var VERSION = '4.0.2';
exports.VERSION = VERSION;
var COMPILER_REVISION = 7;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  _helpers.registerDefaultHelpers(this);
  _decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple helpers');
      }
      _utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (_utils.toString.call(name) === objectType) {
      _utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2['default']('Attempting to register a partial as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple decorators');
      }
      _utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  }
};

var log = _logger2['default'].log;

exports.log = log;
exports.createFrame = _utils.createFrame;
exports.logger = _logger2['default'];


},{"./decorators":129,"./exception":131,"./helpers":132,"./logger":140,"./utils":144}],119:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var AST = {
  // Public API used to evaluate derived attributes regarding AST nodes
  helpers: {
    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    helperExpression: function helperExpression(node) {
      return node.type === 'SubExpression' || (node.type === 'MustacheStatement' || node.type === 'BlockStatement') && !!(node.params && node.params.length || node.hash);
    },

    scopedId: function scopedId(path) {
      return (/^\.|this\b/.test(path.original)
      );
    },

    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    simpleId: function simpleId(path) {
      return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
    }
  }
};

// Must be exported as an object rather than the root of the module as the jison lexer
// must modify the object to operate properly.
exports['default'] = AST;
module.exports = exports['default'];


},{}],120:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.parse = parse;
// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _whitespaceControl = require('./whitespace-control');

var _whitespaceControl2 = _interopRequireDefault(_whitespaceControl);

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _utils = require('../utils');

exports.parser = _parser2['default'];

var yy = {};
_utils.extend(yy, Helpers);

function parse(input, options) {
  // Just return if an already-compiled AST was passed in.
  if (input.type === 'Program') {
    return input;
  }

  _parser2['default'].yy = yy;

  // Altering the shared object here, but this is ok as parser is a sync operation
  yy.locInfo = function (locInfo) {
    return new yy.SourceLocation(options && options.srcName, locInfo);
  };

  var strip = new _whitespaceControl2['default'](options);
  return strip.accept(_parser2['default'].parse(input));
}


},{"../utils":144,"./helpers":123,"./parser":125,"./whitespace-control":128}],121:[function(require,module,exports){
/* global define */
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

var SourceNode = undefined;

try {
  /* istanbul ignore next */
  if (typeof define !== 'function' || !define.amd) {
    // We don't support this in AMD environments. For these environments, we asusme that
    // they are running on the browser and thus have no need for the source-map library.
    var SourceMap = require('source-map');
    SourceNode = SourceMap.SourceNode;
  }
} catch (err) {}
/* NOP */

/* istanbul ignore if: tested but not covered in istanbul due to dist build  */
if (!SourceNode) {
  SourceNode = function (line, column, srcFile, chunks) {
    this.src = '';
    if (chunks) {
      this.add(chunks);
    }
  };
  /* istanbul ignore next */
  SourceNode.prototype = {
    add: function add(chunks) {
      if (_utils.isArray(chunks)) {
        chunks = chunks.join('');
      }
      this.src += chunks;
    },
    prepend: function prepend(chunks) {
      if (_utils.isArray(chunks)) {
        chunks = chunks.join('');
      }
      this.src = chunks + this.src;
    },
    toStringWithSourceMap: function toStringWithSourceMap() {
      return { code: this.toString() };
    },
    toString: function toString() {
      return this.src;
    }
  };
}

function castChunk(chunk, codeGen, loc) {
  if (_utils.isArray(chunk)) {
    var ret = [];

    for (var i = 0, len = chunk.length; i < len; i++) {
      ret.push(codeGen.wrap(chunk[i], loc));
    }
    return ret;
  } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
    // Handle primitives that the SourceNode will throw up on
    return chunk + '';
  }
  return chunk;
}

function CodeGen(srcFile) {
  this.srcFile = srcFile;
  this.source = [];
}

CodeGen.prototype = {
  isEmpty: function isEmpty() {
    return !this.source.length;
  },
  prepend: function prepend(source, loc) {
    this.source.unshift(this.wrap(source, loc));
  },
  push: function push(source, loc) {
    this.source.push(this.wrap(source, loc));
  },

  merge: function merge() {
    var source = this.empty();
    this.each(function (line) {
      source.add(['  ', line, '\n']);
    });
    return source;
  },

  each: function each(iter) {
    for (var i = 0, len = this.source.length; i < len; i++) {
      iter(this.source[i]);
    }
  },

  empty: function empty() {
    var loc = this.currentLocation || { start: {} };
    return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
  },
  wrap: function wrap(chunk) {
    var loc = arguments.length <= 1 || arguments[1] === undefined ? this.currentLocation || { start: {} } : arguments[1];

    if (chunk instanceof SourceNode) {
      return chunk;
    }

    chunk = castChunk(chunk, this, loc);

    return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
  },

  functionCall: function functionCall(fn, type, params) {
    params = this.generateList(params);
    return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
  },

  quotedString: function quotedString(str) {
    return '"' + (str + '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028') // Per Ecma-262 7.3 + 7.8.4
    .replace(/\u2029/g, '\\u2029') + '"';
  },

  objectLiteral: function objectLiteral(obj) {
    var pairs = [];

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var value = castChunk(obj[key], this);
        if (value !== 'undefined') {
          pairs.push([this.quotedString(key), ':', value]);
        }
      }
    }

    var ret = this.generateList(pairs);
    ret.prepend('{');
    ret.add('}');
    return ret;
  },

  generateList: function generateList(entries) {
    var ret = this.empty();

    for (var i = 0, len = entries.length; i < len; i++) {
      if (i) {
        ret.add(',');
      }

      ret.add(castChunk(entries[i], this));
    }

    return ret;
  },

  generateArray: function generateArray(entries) {
    var ret = this.generateList(entries);
    ret.prepend('[');
    ret.add(']');

    return ret;
  }
};

exports['default'] = CodeGen;
module.exports = exports['default'];


},{"../utils":144,"source-map":146}],122:[function(require,module,exports){
/* eslint-disable new-cap */

'use strict';

exports.__esModule = true;
exports.Compiler = Compiler;
exports.precompile = precompile;
exports.compile = compile;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

var _utils = require('../utils');

var _ast = require('./ast');

var _ast2 = _interopRequireDefault(_ast);

var slice = [].slice;

function Compiler() {}

// the foundHelper register will disambiguate helper lookup from finding a
// function in a context. This is necessary for mustache compatibility, which
// requires that context functions in blocks are evaluated by blockHelperMissing,
// and then proceed as if the resulting value was provided to blockHelperMissing.

Compiler.prototype = {
  compiler: Compiler,

  equals: function equals(other) {
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
    for (var i = 0; i < len; i++) {
      if (!this.children[i].equals(other.children[i])) {
        return false;
      }
    }

    return true;
  },

  guid: 0,

  compile: function compile(program, options) {
    this.sourceNode = [];
    this.opcodes = [];
    this.children = [];
    this.options = options;
    this.stringParams = options.stringParams;
    this.trackIds = options.trackIds;

    options.blockParams = options.blockParams || [];

    // These changes will propagate to the other compiler components
    var knownHelpers = options.knownHelpers;
    options.knownHelpers = {
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
      for (var _name in knownHelpers) {
        /* istanbul ignore else */
        if (_name in knownHelpers) {
          options.knownHelpers[_name] = knownHelpers[_name];
        }
      }
    }

    return this.accept(program);
  },

  compileProgram: function compileProgram(program) {
    var childCompiler = new this.compiler(),
        // eslint-disable-line new-cap
    result = childCompiler.compile(program, this.options),
        guid = this.guid++;

    this.usePartial = this.usePartial || result.usePartial;

    this.children[guid] = result;
    this.useDepths = this.useDepths || result.useDepths;

    return guid;
  },

  accept: function accept(node) {
    /* istanbul ignore next: Sanity code */
    if (!this[node.type]) {
      throw new _exception2['default']('Unknown type: ' + node.type, node);
    }

    this.sourceNode.unshift(node);
    var ret = this[node.type](node);
    this.sourceNode.shift();
    return ret;
  },

  Program: function Program(program) {
    this.options.blockParams.unshift(program.blockParams);

    var body = program.body,
        bodyLength = body.length;
    for (var i = 0; i < bodyLength; i++) {
      this.accept(body[i]);
    }

    this.options.blockParams.shift();

    this.isSimple = bodyLength === 1;
    this.blockParams = program.blockParams ? program.blockParams.length : 0;

    return this;
  },

  BlockStatement: function BlockStatement(block) {
    transformLiteralToPath(block);

    var program = block.program,
        inverse = block.inverse;

    program = program && this.compileProgram(program);
    inverse = inverse && this.compileProgram(inverse);

    var type = this.classifySexpr(block);

    if (type === 'helper') {
      this.helperSexpr(block, program, inverse);
    } else if (type === 'simple') {
      this.simpleSexpr(block);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('blockValue', block.path.original);
    } else {
      this.ambiguousSexpr(block, program, inverse);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('ambiguousBlockValue');
    }

    this.opcode('append');
  },

  DecoratorBlock: function DecoratorBlock(decorator) {
    var program = decorator.program && this.compileProgram(decorator.program);
    var params = this.setupFullMustacheParams(decorator, program, undefined),
        path = decorator.path;

    this.useDecorators = true;
    this.opcode('registerDecorator', params.length, path.original);
  },

  PartialStatement: function PartialStatement(partial) {
    this.usePartial = true;

    var program = partial.program;
    if (program) {
      program = this.compileProgram(partial.program);
    }

    var params = partial.params;
    if (params.length > 1) {
      throw new _exception2['default']('Unsupported number of partial arguments: ' + params.length, partial);
    } else if (!params.length) {
      if (this.options.explicitPartialContext) {
        this.opcode('pushLiteral', 'undefined');
      } else {
        params.push({ type: 'PathExpression', parts: [], depth: 0 });
      }
    }

    var partialName = partial.name.original,
        isDynamic = partial.name.type === 'SubExpression';
    if (isDynamic) {
      this.accept(partial.name);
    }

    this.setupFullMustacheParams(partial, program, undefined, true);

    var indent = partial.indent || '';
    if (this.options.preventIndent && indent) {
      this.opcode('appendContent', indent);
      indent = '';
    }

    this.opcode('invokePartial', isDynamic, partialName, indent);
    this.opcode('append');
  },
  PartialBlockStatement: function PartialBlockStatement(partialBlock) {
    this.PartialStatement(partialBlock);
  },

  MustacheStatement: function MustacheStatement(mustache) {
    this.SubExpression(mustache);

    if (mustache.escaped && !this.options.noEscape) {
      this.opcode('appendEscaped');
    } else {
      this.opcode('append');
    }
  },
  Decorator: function Decorator(decorator) {
    this.DecoratorBlock(decorator);
  },

  ContentStatement: function ContentStatement(content) {
    if (content.value) {
      this.opcode('appendContent', content.value);
    }
  },

  CommentStatement: function CommentStatement() {},

  SubExpression: function SubExpression(sexpr) {
    transformLiteralToPath(sexpr);
    var type = this.classifySexpr(sexpr);

    if (type === 'simple') {
      this.simpleSexpr(sexpr);
    } else if (type === 'helper') {
      this.helperSexpr(sexpr);
    } else {
      this.ambiguousSexpr(sexpr);
    }
  },
  ambiguousSexpr: function ambiguousSexpr(sexpr, program, inverse) {
    var path = sexpr.path,
        name = path.parts[0],
        isBlock = program != null || inverse != null;

    this.opcode('getContext', path.depth);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    path.strict = true;
    this.accept(path);

    this.opcode('invokeAmbiguous', name, isBlock);
  },

  simpleSexpr: function simpleSexpr(sexpr) {
    var path = sexpr.path;
    path.strict = true;
    this.accept(path);
    this.opcode('resolvePossibleLambda');
  },

  helperSexpr: function helperSexpr(sexpr, program, inverse) {
    var params = this.setupFullMustacheParams(sexpr, program, inverse),
        path = sexpr.path,
        name = path.parts[0];

    if (this.options.knownHelpers[name]) {
      this.opcode('invokeKnownHelper', params.length, name);
    } else if (this.options.knownHelpersOnly) {
      throw new _exception2['default']('You specified knownHelpersOnly, but used the unknown helper ' + name, sexpr);
    } else {
      path.strict = true;
      path.falsy = true;

      this.accept(path);
      this.opcode('invokeHelper', params.length, path.original, _ast2['default'].helpers.simpleId(path));
    }
  },

  PathExpression: function PathExpression(path) {
    this.addDepth(path.depth);
    this.opcode('getContext', path.depth);

    var name = path.parts[0],
        scoped = _ast2['default'].helpers.scopedId(path),
        blockParamId = !path.depth && !scoped && this.blockParamIndex(name);

    if (blockParamId) {
      this.opcode('lookupBlockParam', blockParamId, path.parts);
    } else if (!name) {
      // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
      this.opcode('pushContext');
    } else if (path.data) {
      this.options.data = true;
      this.opcode('lookupData', path.depth, path.parts, path.strict);
    } else {
      this.opcode('lookupOnContext', path.parts, path.falsy, path.strict, scoped);
    }
  },

  StringLiteral: function StringLiteral(string) {
    this.opcode('pushString', string.value);
  },

  NumberLiteral: function NumberLiteral(number) {
    this.opcode('pushLiteral', number.value);
  },

  BooleanLiteral: function BooleanLiteral(bool) {
    this.opcode('pushLiteral', bool.value);
  },

  UndefinedLiteral: function UndefinedLiteral() {
    this.opcode('pushLiteral', 'undefined');
  },

  NullLiteral: function NullLiteral() {
    this.opcode('pushLiteral', 'null');
  },

  Hash: function Hash(hash) {
    var pairs = hash.pairs,
        i = 0,
        l = pairs.length;

    this.opcode('pushHash');

    for (; i < l; i++) {
      this.pushParam(pairs[i].value);
    }
    while (i--) {
      this.opcode('assignToHash', pairs[i].key);
    }
    this.opcode('popHash');
  },

  // HELPERS
  opcode: function opcode(name) {
    this.opcodes.push({ opcode: name, args: slice.call(arguments, 1), loc: this.sourceNode[0].loc });
  },

  addDepth: function addDepth(depth) {
    if (!depth) {
      return;
    }

    this.useDepths = true;
  },

  classifySexpr: function classifySexpr(sexpr) {
    var isSimple = _ast2['default'].helpers.simpleId(sexpr.path);

    var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    var isHelper = !isBlockParam && _ast2['default'].helpers.helperExpression(sexpr);

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
    var isEligible = !isBlockParam && (isHelper || isSimple);

    // if ambiguous, we can possibly resolve the ambiguity now
    // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
    if (isEligible && !isHelper) {
      var _name2 = sexpr.path.parts[0],
          options = this.options;

      if (options.knownHelpers[_name2]) {
        isHelper = true;
      } else if (options.knownHelpersOnly) {
        isEligible = false;
      }
    }

    if (isHelper) {
      return 'helper';
    } else if (isEligible) {
      return 'ambiguous';
    } else {
      return 'simple';
    }
  },

  pushParams: function pushParams(params) {
    for (var i = 0, l = params.length; i < l; i++) {
      this.pushParam(params[i]);
    }
  },

  pushParam: function pushParam(val) {
    var value = val.value != null ? val.value : val.original || '';

    if (this.stringParams) {
      if (value.replace) {
        value = value.replace(/^(\.?\.\/)*/g, '').replace(/\//g, '.');
      }

      if (val.depth) {
        this.addDepth(val.depth);
      }
      this.opcode('getContext', val.depth || 0);
      this.opcode('pushStringParam', value, val.type);

      if (val.type === 'SubExpression') {
        // SubExpressions get evaluated and passed in
        // in string params mode.
        this.accept(val);
      }
    } else {
      if (this.trackIds) {
        var blockParamIndex = undefined;
        if (val.parts && !_ast2['default'].helpers.scopedId(val) && !val.depth) {
          blockParamIndex = this.blockParamIndex(val.parts[0]);
        }
        if (blockParamIndex) {
          var blockParamChild = val.parts.slice(1).join('.');
          this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
        } else {
          value = val.original || value;
          if (value.replace) {
            value = value.replace(/^this(?:\.|$)/, '').replace(/^\.\//, '').replace(/^\.$/, '');
          }

          this.opcode('pushId', val.type, value);
        }
      }
      this.accept(val);
    }
  },

  setupFullMustacheParams: function setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
    var params = sexpr.params;
    this.pushParams(params);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    if (sexpr.hash) {
      this.accept(sexpr.hash);
    } else {
      this.opcode('emptyHash', omitEmpty);
    }

    return params;
  },

  blockParamIndex: function blockParamIndex(name) {
    for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
      var blockParams = this.options.blockParams[depth],
          param = blockParams && _utils.indexOf(blockParams, name);
      if (blockParams && param >= 0) {
        return [depth, param];
      }
    }
  }
};

function precompile(input, options, env) {
  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
    throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.precompile. You passed ' + input);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  if (options.compat) {
    options.useDepths = true;
  }

  var ast = env.parse(input, options),
      environment = new env.Compiler().compile(ast, options);
  return new env.JavaScriptCompiler().compile(environment, options);
}

function compile(input, options, env) {
  if (options === undefined) options = {};

  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
    throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.compile. You passed ' + input);
  }

  if (!('data' in options)) {
    options.data = true;
  }
  if (options.compat) {
    options.useDepths = true;
  }

  var compiled = undefined;

  function compileInput() {
    var ast = env.parse(input, options),
        environment = new env.Compiler().compile(ast, options),
        templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
    return env.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  function ret(context, execOptions) {
    if (!compiled) {
      compiled = compileInput();
    }
    return compiled.call(this, context, execOptions);
  }
  ret._setup = function (setupOptions) {
    if (!compiled) {
      compiled = compileInput();
    }
    return compiled._setup(setupOptions);
  };
  ret._child = function (i, data, blockParams, depths) {
    if (!compiled) {
      compiled = compileInput();
    }
    return compiled._child(i, data, blockParams, depths);
  };
  return ret;
}

function argEquals(a, b) {
  if (a === b) {
    return true;
  }

  if (_utils.isArray(a) && _utils.isArray(b) && a.length === b.length) {
    for (var i = 0; i < a.length; i++) {
      if (!argEquals(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
}

function transformLiteralToPath(sexpr) {
  if (!sexpr.path.parts) {
    var literal = sexpr.path;
    // Casting to string here to make false and 0 literal values play nicely with the rest
    // of the system.
    sexpr.path = {
      type: 'PathExpression',
      data: false,
      depth: 0,
      parts: [literal.original + ''],
      original: literal.original + '',
      loc: literal.loc
    };
  }
}


},{"../exception":131,"../utils":144,"./ast":119}],123:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.SourceLocation = SourceLocation;
exports.id = id;
exports.stripFlags = stripFlags;
exports.stripComment = stripComment;
exports.preparePath = preparePath;
exports.prepareMustache = prepareMustache;
exports.prepareRawBlock = prepareRawBlock;
exports.prepareBlock = prepareBlock;
exports.prepareProgram = prepareProgram;
exports.preparePartialBlock = preparePartialBlock;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

function validateClose(open, close) {
  close = close.path ? close.path.original : close;

  if (open.path.original !== close) {
    var errorNode = { loc: open.path.loc };

    throw new _exception2['default'](open.path.original + " doesn't match " + close, errorNode);
  }
}

function SourceLocation(source, locInfo) {
  this.source = source;
  this.start = {
    line: locInfo.first_line,
    column: locInfo.first_column
  };
  this.end = {
    line: locInfo.last_line,
    column: locInfo.last_column
  };
}

function id(token) {
  if (/^\[.*\]$/.test(token)) {
    return token.substr(1, token.length - 2);
  } else {
    return token;
  }
}

function stripFlags(open, close) {
  return {
    open: open.charAt(2) === '~',
    close: close.charAt(close.length - 3) === '~'
  };
}

function stripComment(comment) {
  return comment.replace(/^\{\{~?\!-?-?/, '').replace(/-?-?~?\}\}$/, '');
}

function preparePath(data, parts, loc) {
  loc = this.locInfo(loc);

  var original = data ? '@' : '',
      dig = [],
      depth = 0,
      depthString = '';

  for (var i = 0, l = parts.length; i < l; i++) {
    var part = parts[i].part,

    // If we have [] syntax then we do not treat path references as operators,
    // i.e. foo.[this] resolves to approximately context.foo['this']
    isLiteral = parts[i].original !== part;
    original += (parts[i].separator || '') + part;

    if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
      if (dig.length > 0) {
        throw new _exception2['default']('Invalid path: ' + original, { loc: loc });
      } else if (part === '..') {
        depth++;
        depthString += '../';
      }
    } else {
      dig.push(part);
    }
  }

  return {
    type: 'PathExpression',
    data: data,
    depth: depth,
    parts: dig,
    original: original,
    loc: loc
  };
}

function prepareMustache(path, params, hash, open, strip, locInfo) {
  // Must use charAt to support IE pre-10
  var escapeFlag = open.charAt(3) || open.charAt(2),
      escaped = escapeFlag !== '{' && escapeFlag !== '&';

  var decorator = /\*/.test(open);
  return {
    type: decorator ? 'Decorator' : 'MustacheStatement',
    path: path,
    params: params,
    hash: hash,
    escaped: escaped,
    strip: strip,
    loc: this.locInfo(locInfo)
  };
}

function prepareRawBlock(openRawBlock, contents, close, locInfo) {
  validateClose(openRawBlock, close);

  locInfo = this.locInfo(locInfo);
  var program = {
    type: 'Program',
    body: contents,
    strip: {},
    loc: locInfo
  };

  return {
    type: 'BlockStatement',
    path: openRawBlock.path,
    params: openRawBlock.params,
    hash: openRawBlock.hash,
    program: program,
    openStrip: {},
    inverseStrip: {},
    closeStrip: {},
    loc: locInfo
  };
}

function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
  if (close && close.path) {
    validateClose(openBlock, close);
  }

  var decorator = /\*/.test(openBlock.open);

  program.blockParams = openBlock.blockParams;

  var inverse = undefined,
      inverseStrip = undefined;

  if (inverseAndProgram) {
    if (decorator) {
      throw new _exception2['default']('Unexpected inverse block on decorator', inverseAndProgram);
    }

    if (inverseAndProgram.chain) {
      inverseAndProgram.program.body[0].closeStrip = close.strip;
    }

    inverseStrip = inverseAndProgram.strip;
    inverse = inverseAndProgram.program;
  }

  if (inverted) {
    inverted = inverse;
    inverse = program;
    program = inverted;
  }

  return {
    type: decorator ? 'DecoratorBlock' : 'BlockStatement',
    path: openBlock.path,
    params: openBlock.params,
    hash: openBlock.hash,
    program: program,
    inverse: inverse,
    openStrip: openBlock.strip,
    inverseStrip: inverseStrip,
    closeStrip: close && close.strip,
    loc: this.locInfo(locInfo)
  };
}

function prepareProgram(statements, loc) {
  if (!loc && statements.length) {
    var firstLoc = statements[0].loc,
        lastLoc = statements[statements.length - 1].loc;

    /* istanbul ignore else */
    if (firstLoc && lastLoc) {
      loc = {
        source: firstLoc.source,
        start: {
          line: firstLoc.start.line,
          column: firstLoc.start.column
        },
        end: {
          line: lastLoc.end.line,
          column: lastLoc.end.column
        }
      };
    }
  }

  return {
    type: 'Program',
    body: statements,
    strip: {},
    loc: loc
  };
}

function preparePartialBlock(open, program, close, locInfo) {
  validateClose(open, close);

  return {
    type: 'PartialBlockStatement',
    name: open.path,
    params: open.params,
    hash: open.hash,
    program: program,
    openStrip: open.strip,
    closeStrip: close && close.strip,
    loc: this.locInfo(locInfo)
  };
}


},{"../exception":131}],124:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _base = require('../base');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

var _utils = require('../utils');

var _codeGen = require('./code-gen');

var _codeGen2 = _interopRequireDefault(_codeGen);

function Literal(value) {
  this.value = value;
}

function JavaScriptCompiler() {}

JavaScriptCompiler.prototype = {
  // PUBLIC API: You can override these methods in a subclass to provide
  // alternative compiled forms for name lookup and buffering semantics
  nameLookup: function nameLookup(parent, name /* , type*/) {
    if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
      return [parent, '.', name];
    } else {
      return [parent, '[', JSON.stringify(name), ']'];
    }
  },
  depthedLookup: function depthedLookup(name) {
    return [this.aliasable('container.lookup'), '(depths, "', name, '")'];
  },

  compilerInfo: function compilerInfo() {
    var revision = _base.COMPILER_REVISION,
        versions = _base.REVISION_CHANGES[revision];
    return [revision, versions];
  },

  appendToBuffer: function appendToBuffer(source, location, explicit) {
    // Force a source as this simplifies the merge logic.
    if (!_utils.isArray(source)) {
      source = [source];
    }
    source = this.source.wrap(source, location);

    if (this.environment.isSimple) {
      return ['return ', source, ';'];
    } else if (explicit) {
      // This is a case where the buffer operation occurs as a child of another
      // construct, generally braces. We have to explicitly output these buffer
      // operations to ensure that the emitted code goes in the correct location.
      return ['buffer += ', source, ';'];
    } else {
      source.appendToBuffer = true;
      return source;
    }
  },

  initializeBuffer: function initializeBuffer() {
    return this.quotedString('');
  },
  // END PUBLIC API

  compile: function compile(environment, options, context, asObject) {
    this.environment = environment;
    this.options = options;
    this.stringParams = this.options.stringParams;
    this.trackIds = this.options.trackIds;
    this.precompile = !asObject;

    this.name = this.environment.name;
    this.isChild = !!context;
    this.context = context || {
      decorators: [],
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
    this.blockParams = [];

    this.compileChildren(environment, options);

    this.useDepths = this.useDepths || environment.useDepths || environment.useDecorators || this.options.compat;
    this.useBlockParams = this.useBlockParams || environment.useBlockParams;

    var opcodes = environment.opcodes,
        opcode = undefined,
        firstLoc = undefined,
        i = undefined,
        l = undefined;

    for (i = 0, l = opcodes.length; i < l; i++) {
      opcode = opcodes[i];

      this.source.currentLocation = opcode.loc;
      firstLoc = firstLoc || opcode.loc;
      this[opcode.opcode].apply(this, opcode.args);
    }

    // Flush any trailing content that might be pending.
    this.source.currentLocation = firstLoc;
    this.pushSource('');

    /* istanbul ignore next */
    if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
      throw new _exception2['default']('Compile completed with content left on stack');
    }

    if (!this.decorators.isEmpty()) {
      this.useDecorators = true;

      this.decorators.prepend('var decorators = container.decorators;\n');
      this.decorators.push('return fn;');

      if (asObject) {
        this.decorators = Function.apply(this, ['fn', 'props', 'container', 'depth0', 'data', 'blockParams', 'depths', this.decorators.merge()]);
      } else {
        this.decorators.prepend('function(fn, props, container, depth0, data, blockParams, depths) {\n');
        this.decorators.push('}\n');
        this.decorators = this.decorators.merge();
      }
    } else {
      this.decorators = undefined;
    }

    var fn = this.createFunctionContext(asObject);
    if (!this.isChild) {
      var ret = {
        compiler: this.compilerInfo(),
        main: fn
      };

      if (this.decorators) {
        ret.main_d = this.decorators; // eslint-disable-line camelcase
        ret.useDecorators = true;
      }

      var _context = this.context;
      var programs = _context.programs;
      var decorators = _context.decorators;

      for (i = 0, l = programs.length; i < l; i++) {
        if (programs[i]) {
          ret[i] = programs[i];
          if (decorators[i]) {
            ret[i + '_d'] = decorators[i];
            ret.useDecorators = true;
          }
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
      if (this.useBlockParams) {
        ret.useBlockParams = true;
      }
      if (this.options.compat) {
        ret.compat = true;
      }

      if (!asObject) {
        ret.compiler = JSON.stringify(ret.compiler);

        this.source.currentLocation = { start: { line: 1, column: 0 } };
        ret = this.objectLiteral(ret);

        if (options.srcName) {
          ret = ret.toStringWithSourceMap({ file: options.destName });
          ret.map = ret.map && ret.map.toString();
        } else {
          ret = ret.toString();
        }
      } else {
        ret.compilerOptions = this.options;
      }

      return ret;
    } else {
      return fn;
    }
  },

  preamble: function preamble() {
    // track the last context pushed into place to allow skipping the
    // getContext opcode when it would be a noop
    this.lastContext = 0;
    this.source = new _codeGen2['default'](this.options.srcName);
    this.decorators = new _codeGen2['default'](this.options.srcName);
  },

  createFunctionContext: function createFunctionContext(asObject) {
    var varDeclarations = '';

    var locals = this.stackVars.concat(this.registers.list);
    if (locals.length > 0) {
      varDeclarations += ', ' + locals.join(', ');
    }

    // Generate minimizer alias mappings
    //
    // When using true SourceNodes, this will update all references to the given alias
    // as the source nodes are reused in situ. For the non-source node compilation mode,
    // aliases will not be used, but this case is already being run on the client and
    // we aren't concern about minimizing the template size.
    var aliasCount = 0;
    for (var alias in this.aliases) {
      // eslint-disable-line guard-for-in
      var node = this.aliases[alias];

      if (this.aliases.hasOwnProperty(alias) && node.children && node.referenceCount > 1) {
        varDeclarations += ', alias' + ++aliasCount + '=' + alias;
        node.children[0] = 'alias' + aliasCount;
      }
    }

    var params = ['container', 'depth0', 'helpers', 'partials', 'data'];

    if (this.useBlockParams || this.useDepths) {
      params.push('blockParams');
    }
    if (this.useDepths) {
      params.push('depths');
    }

    // Perform a second pass over the output to merge content when possible
    var source = this.mergeSource(varDeclarations);

    if (asObject) {
      params.push(source);

      return Function.apply(this, params);
    } else {
      return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
    }
  },
  mergeSource: function mergeSource(varDeclarations) {
    var isSimple = this.environment.isSimple,
        appendOnly = !this.forceBuffer,
        appendFirst = undefined,
        sourceSeen = undefined,
        bufferStart = undefined,
        bufferEnd = undefined;
    this.source.each(function (line) {
      if (line.appendToBuffer) {
        if (bufferStart) {
          line.prepend('  + ');
        } else {
          bufferStart = line;
        }
        bufferEnd = line;
      } else {
        if (bufferStart) {
          if (!sourceSeen) {
            appendFirst = true;
          } else {
            bufferStart.prepend('buffer += ');
          }
          bufferEnd.add(';');
          bufferStart = bufferEnd = undefined;
        }

        sourceSeen = true;
        if (!isSimple) {
          appendOnly = false;
        }
      }
    });

    if (appendOnly) {
      if (bufferStart) {
        bufferStart.prepend('return ');
        bufferEnd.add(';');
      } else if (!sourceSeen) {
        this.source.push('return "";');
      }
    } else {
      varDeclarations += ', buffer = ' + (appendFirst ? '' : this.initializeBuffer());

      if (bufferStart) {
        bufferStart.prepend('return buffer + ');
        bufferEnd.add(';');
      } else {
        this.source.push('return buffer;');
      }
    }

    if (varDeclarations) {
      this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
    }

    return this.source.merge();
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
  blockValue: function blockValue(name) {
    var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
        params = [this.contextName(0)];
    this.setupHelperArgs(name, 0, params);

    var blockName = this.popStack();
    params.splice(1, 0, blockName);

    this.push(this.source.functionCall(blockHelperMissing, 'call', params));
  },

  // [ambiguousBlockValue]
  //
  // On stack, before: hash, inverse, program, value
  // Compiler value, before: lastHelper=value of last found helper, if any
  // On stack, after, if no lastHelper: same as [blockValue]
  // On stack, after, if lastHelper: value
  ambiguousBlockValue: function ambiguousBlockValue() {
    // We're being a bit cheeky and reusing the options value from the prior exec
    var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
        params = [this.contextName(0)];
    this.setupHelperArgs('', 0, params, true);

    this.flushInline();

    var current = this.topStack();
    params.splice(1, 0, current);

    this.pushSource(['if (!', this.lastHelper, ') { ', current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params), '}']);
  },

  // [appendContent]
  //
  // On stack, before: ...
  // On stack, after: ...
  //
  // Appends the string value of `content` to the current buffer
  appendContent: function appendContent(content) {
    if (this.pendingContent) {
      content = this.pendingContent + content;
    } else {
      this.pendingLocation = this.source.currentLocation;
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
  append: function append() {
    if (this.isInline()) {
      this.replaceStack(function (current) {
        return [' != null ? ', current, ' : ""'];
      });

      this.pushSource(this.appendToBuffer(this.popStack()));
    } else {
      var local = this.popStack();
      this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);
      if (this.environment.isSimple) {
        this.pushSource(['else { ', this.appendToBuffer("''", undefined, true), ' }']);
      }
    }
  },

  // [appendEscaped]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Escape `value` and append it to the buffer
  appendEscaped: function appendEscaped() {
    this.pushSource(this.appendToBuffer([this.aliasable('container.escapeExpression'), '(', this.popStack(), ')']));
  },

  // [getContext]
  //
  // On stack, before: ...
  // On stack, after: ...
  // Compiler value, after: lastContext=depth
  //
  // Set the value of the `lastContext` compiler value to the depth
  getContext: function getContext(depth) {
    this.lastContext = depth;
  },

  // [pushContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext, ...
  //
  // Pushes the value of the current context onto the stack.
  pushContext: function pushContext() {
    this.pushStackLiteral(this.contextName(this.lastContext));
  },

  // [lookupOnContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext[name], ...
  //
  // Looks up the value of `name` on the current context and pushes
  // it onto the stack.
  lookupOnContext: function lookupOnContext(parts, falsy, strict, scoped) {
    var i = 0;

    if (!scoped && this.options.compat && !this.lastContext) {
      // The depthed query is expected to handle the undefined logic for the root level that
      // is implemented below, so we evaluate that directly in compat mode
      this.push(this.depthedLookup(parts[i++]));
    } else {
      this.pushContext();
    }

    this.resolvePath('context', parts, i, falsy, strict);
  },

  // [lookupBlockParam]
  //
  // On stack, before: ...
  // On stack, after: blockParam[name], ...
  //
  // Looks up the value of `parts` on the given block param and pushes
  // it onto the stack.
  lookupBlockParam: function lookupBlockParam(blockParamId, parts) {
    this.useBlockParams = true;

    this.push(['blockParams[', blockParamId[0], '][', blockParamId[1], ']']);
    this.resolvePath('context', parts, 1);
  },

  // [lookupData]
  //
  // On stack, before: ...
  // On stack, after: data, ...
  //
  // Push the data lookup operator
  lookupData: function lookupData(depth, parts, strict) {
    if (!depth) {
      this.pushStackLiteral('data');
    } else {
      this.pushStackLiteral('container.data(data, ' + depth + ')');
    }

    this.resolvePath('data', parts, 0, true, strict);
  },

  resolvePath: function resolvePath(type, parts, i, falsy, strict) {
    // istanbul ignore next

    var _this = this;

    if (this.options.strict || this.options.assumeObjects) {
      this.push(strictLookup(this.options.strict && strict, this, parts, type));
      return;
    }

    var len = parts.length;
    for (; i < len; i++) {
      /* eslint-disable no-loop-func */
      this.replaceStack(function (current) {
        var lookup = _this.nameLookup(current, parts[i], type);
        // We want to ensure that zero and false are handled properly if the context (falsy flag)
        // needs to have the special handling for these values.
        if (!falsy) {
          return [' != null ? ', lookup, ' : ', current];
        } else {
          // Otherwise we can use generic falsy handling
          return [' && ', lookup];
        }
      });
      /* eslint-enable no-loop-func */
    }
  },

  // [resolvePossibleLambda]
  //
  // On stack, before: value, ...
  // On stack, after: resolved value, ...
  //
  // If the `value` is a lambda, replace it on the stack by
  // the return value of the lambda
  resolvePossibleLambda: function resolvePossibleLambda() {
    this.push([this.aliasable('container.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
  },

  // [pushStringParam]
  //
  // On stack, before: ...
  // On stack, after: string, currentContext, ...
  //
  // This opcode is designed for use in string mode, which
  // provides the string value of a parameter along with its
  // depth rather than resolving it immediately.
  pushStringParam: function pushStringParam(string, type) {
    this.pushContext();
    this.pushString(type);

    // If it's a subexpression, the string result
    // will be pushed after this opcode.
    if (type !== 'SubExpression') {
      if (typeof string === 'string') {
        this.pushString(string);
      } else {
        this.pushStackLiteral(string);
      }
    }
  },

  emptyHash: function emptyHash(omitEmpty) {
    if (this.trackIds) {
      this.push('{}'); // hashIds
    }
    if (this.stringParams) {
      this.push('{}'); // hashContexts
      this.push('{}'); // hashTypes
    }
    this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
  },
  pushHash: function pushHash() {
    if (this.hash) {
      this.hashes.push(this.hash);
    }
    this.hash = { values: [], types: [], contexts: [], ids: [] };
  },
  popHash: function popHash() {
    var hash = this.hash;
    this.hash = this.hashes.pop();

    if (this.trackIds) {
      this.push(this.objectLiteral(hash.ids));
    }
    if (this.stringParams) {
      this.push(this.objectLiteral(hash.contexts));
      this.push(this.objectLiteral(hash.types));
    }

    this.push(this.objectLiteral(hash.values));
  },

  // [pushString]
  //
  // On stack, before: ...
  // On stack, after: quotedString(string), ...
  //
  // Push a quoted version of `string` onto the stack
  pushString: function pushString(string) {
    this.pushStackLiteral(this.quotedString(string));
  },

  // [pushLiteral]
  //
  // On stack, before: ...
  // On stack, after: value, ...
  //
  // Pushes a value onto the stack. This operation prevents
  // the compiler from creating a temporary variable to hold
  // it.
  pushLiteral: function pushLiteral(value) {
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
  pushProgram: function pushProgram(guid) {
    if (guid != null) {
      this.pushStackLiteral(this.programExpression(guid));
    } else {
      this.pushStackLiteral(null);
    }
  },

  // [registerDecorator]
  //
  // On stack, before: hash, program, params..., ...
  // On stack, after: ...
  //
  // Pops off the decorator's parameters, invokes the decorator,
  // and inserts the decorator into the decorators list.
  registerDecorator: function registerDecorator(paramSize, name) {
    var foundDecorator = this.nameLookup('decorators', name, 'decorator'),
        options = this.setupHelperArgs(name, paramSize);

    this.decorators.push(['fn = ', this.decorators.functionCall(foundDecorator, '', ['fn', 'props', 'container', options]), ' || fn;']);
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
  invokeHelper: function invokeHelper(paramSize, name, isSimple) {
    var nonHelper = this.popStack(),
        helper = this.setupHelper(paramSize, name),
        simple = isSimple ? [helper.name, ' || '] : '';

    var lookup = ['('].concat(simple, nonHelper);
    if (!this.options.strict) {
      lookup.push(' || ', this.aliasable('helpers.helperMissing'));
    }
    lookup.push(')');

    this.push(this.source.functionCall(lookup, 'call', helper.callParams));
  },

  // [invokeKnownHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // This operation is used when the helper is known to exist,
  // so a `helperMissing` fallback is not required.
  invokeKnownHelper: function invokeKnownHelper(paramSize, name) {
    var helper = this.setupHelper(paramSize, name);
    this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
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
  invokeAmbiguous: function invokeAmbiguous(name, helperCall) {
    this.useRegister('helper');

    var nonHelper = this.popStack();

    this.emptyHash();
    var helper = this.setupHelper(0, name, helperCall);

    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

    var lookup = ['(', '(helper = ', helperName, ' || ', nonHelper, ')'];
    if (!this.options.strict) {
      lookup[0] = '(helper = ';
      lookup.push(' != null ? helper : ', this.aliasable('helpers.helperMissing'));
    }

    this.push(['(', lookup, helper.paramsInit ? ['),(', helper.paramsInit] : [], '),', '(typeof helper === ', this.aliasable('"function"'), ' ? ', this.source.functionCall('helper', 'call', helper.callParams), ' : helper))']);
  },

  // [invokePartial]
  //
  // On stack, before: context, ...
  // On stack after: result of partial invocation
  //
  // This operation pops off a context, invokes a partial with that context,
  // and pushes the result of the invocation back.
  invokePartial: function invokePartial(isDynamic, name, indent) {
    var params = [],
        options = this.setupParams(name, 1, params);

    if (isDynamic) {
      name = this.popStack();
      delete options.name;
    }

    if (indent) {
      options.indent = JSON.stringify(indent);
    }
    options.helpers = 'helpers';
    options.partials = 'partials';
    options.decorators = 'container.decorators';

    if (!isDynamic) {
      params.unshift(this.nameLookup('partials', name, 'partial'));
    } else {
      params.unshift(name);
    }

    if (this.options.compat) {
      options.depths = 'depths';
    }
    options = this.objectLiteral(options);
    params.push(options);

    this.push(this.source.functionCall('container.invokePartial', '', params));
  },

  // [assignToHash]
  //
  // On stack, before: value, ..., hash, ...
  // On stack, after: ..., hash, ...
  //
  // Pops a value off the stack and assigns it to the current hash
  assignToHash: function assignToHash(key) {
    var value = this.popStack(),
        context = undefined,
        type = undefined,
        id = undefined;

    if (this.trackIds) {
      id = this.popStack();
    }
    if (this.stringParams) {
      type = this.popStack();
      context = this.popStack();
    }

    var hash = this.hash;
    if (context) {
      hash.contexts[key] = context;
    }
    if (type) {
      hash.types[key] = type;
    }
    if (id) {
      hash.ids[key] = id;
    }
    hash.values[key] = value;
  },

  pushId: function pushId(type, name, child) {
    if (type === 'BlockParam') {
      this.pushStackLiteral('blockParams[' + name[0] + '].path[' + name[1] + ']' + (child ? ' + ' + JSON.stringify('.' + child) : ''));
    } else if (type === 'PathExpression') {
      this.pushString(name);
    } else if (type === 'SubExpression') {
      this.pushStackLiteral('true');
    } else {
      this.pushStackLiteral('null');
    }
  },

  // HELPERS

  compiler: JavaScriptCompiler,

  compileChildren: function compileChildren(environment, options) {
    var children = environment.children,
        child = undefined,
        compiler = undefined;

    for (var i = 0, l = children.length; i < l; i++) {
      child = children[i];
      compiler = new this.compiler(); // eslint-disable-line new-cap

      var index = this.matchExistingProgram(child);

      if (index == null) {
        this.context.programs.push(''); // Placeholder to prevent name conflicts for nested children
        index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
        this.context.decorators[index] = compiler.decorators;
        this.context.environments[index] = child;

        this.useDepths = this.useDepths || compiler.useDepths;
        this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
      } else {
        child.index = index;
        child.name = 'program' + index;

        this.useDepths = this.useDepths || child.useDepths;
        this.useBlockParams = this.useBlockParams || child.useBlockParams;
      }
    }
  },
  matchExistingProgram: function matchExistingProgram(child) {
    for (var i = 0, len = this.context.environments.length; i < len; i++) {
      var environment = this.context.environments[i];
      if (environment && environment.equals(child)) {
        return i;
      }
    }
  },

  programExpression: function programExpression(guid) {
    var child = this.environment.children[guid],
        programParams = [child.index, 'data', child.blockParams];

    if (this.useBlockParams || this.useDepths) {
      programParams.push('blockParams');
    }
    if (this.useDepths) {
      programParams.push('depths');
    }

    return 'container.program(' + programParams.join(', ') + ')';
  },

  useRegister: function useRegister(name) {
    if (!this.registers[name]) {
      this.registers[name] = true;
      this.registers.list.push(name);
    }
  },

  push: function push(expr) {
    if (!(expr instanceof Literal)) {
      expr = this.source.wrap(expr);
    }

    this.inlineStack.push(expr);
    return expr;
  },

  pushStackLiteral: function pushStackLiteral(item) {
    this.push(new Literal(item));
  },

  pushSource: function pushSource(source) {
    if (this.pendingContent) {
      this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
      this.pendingContent = undefined;
    }

    if (source) {
      this.source.push(source);
    }
  },

  replaceStack: function replaceStack(callback) {
    var prefix = ['('],
        stack = undefined,
        createdStack = undefined,
        usedLiteral = undefined;

    /* istanbul ignore next */
    if (!this.isInline()) {
      throw new _exception2['default']('replaceStack on non-inline');
    }

    // We want to merge the inline statement into the replacement statement via ','
    var top = this.popStack(true);

    if (top instanceof Literal) {
      // Literals do not need to be inlined
      stack = [top.value];
      prefix = ['(', stack];
      usedLiteral = true;
    } else {
      // Get or create the current stack name for use by the inline
      createdStack = true;
      var _name = this.incrStack();

      prefix = ['((', this.push(_name), ' = ', top, ')'];
      stack = this.topStack();
    }

    var item = callback.call(this, stack);

    if (!usedLiteral) {
      this.popStack();
    }
    if (createdStack) {
      this.stackSlot--;
    }
    this.push(prefix.concat(item, ')'));
  },

  incrStack: function incrStack() {
    this.stackSlot++;
    if (this.stackSlot > this.stackVars.length) {
      this.stackVars.push('stack' + this.stackSlot);
    }
    return this.topStackName();
  },
  topStackName: function topStackName() {
    return 'stack' + this.stackSlot;
  },
  flushInline: function flushInline() {
    var inlineStack = this.inlineStack;
    this.inlineStack = [];
    for (var i = 0, len = inlineStack.length; i < len; i++) {
      var entry = inlineStack[i];
      /* istanbul ignore if */
      if (entry instanceof Literal) {
        this.compileStack.push(entry);
      } else {
        var stack = this.incrStack();
        this.pushSource([stack, ' = ', entry, ';']);
        this.compileStack.push(stack);
      }
    }
  },
  isInline: function isInline() {
    return this.inlineStack.length;
  },

  popStack: function popStack(wrapped) {
    var inline = this.isInline(),
        item = (inline ? this.inlineStack : this.compileStack).pop();

    if (!wrapped && item instanceof Literal) {
      return item.value;
    } else {
      if (!inline) {
        /* istanbul ignore next */
        if (!this.stackSlot) {
          throw new _exception2['default']('Invalid stack pop');
        }
        this.stackSlot--;
      }
      return item;
    }
  },

  topStack: function topStack() {
    var stack = this.isInline() ? this.inlineStack : this.compileStack,
        item = stack[stack.length - 1];

    /* istanbul ignore if */
    if (item instanceof Literal) {
      return item.value;
    } else {
      return item;
    }
  },

  contextName: function contextName(context) {
    if (this.useDepths && context) {
      return 'depths[' + context + ']';
    } else {
      return 'depth' + context;
    }
  },

  quotedString: function quotedString(str) {
    return this.source.quotedString(str);
  },

  objectLiteral: function objectLiteral(obj) {
    return this.source.objectLiteral(obj);
  },

  aliasable: function aliasable(name) {
    var ret = this.aliases[name];
    if (ret) {
      ret.referenceCount++;
      return ret;
    }

    ret = this.aliases[name] = this.source.wrap(name);
    ret.aliasable = true;
    ret.referenceCount = 1;

    return ret;
  },

  setupHelper: function setupHelper(paramSize, name, blockHelper) {
    var params = [],
        paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
    var foundHelper = this.nameLookup('helpers', name, 'helper');

    return {
      params: params,
      paramsInit: paramsInit,
      name: foundHelper,
      callParams: [this.contextName(0)].concat(params)
    };
  },

  setupParams: function setupParams(helper, paramSize, params) {
    var options = {},
        contexts = [],
        types = [],
        ids = [],
        objectArgs = !params,
        param = undefined;

    if (objectArgs) {
      params = [];
    }

    options.name = this.quotedString(helper);
    options.hash = this.popStack();

    if (this.trackIds) {
      options.hashIds = this.popStack();
    }
    if (this.stringParams) {
      options.hashTypes = this.popStack();
      options.hashContexts = this.popStack();
    }

    var inverse = this.popStack(),
        program = this.popStack();

    // Avoid setting fn and inverse if neither are set. This allows
    // helpers to do a check for `if (options.fn)`
    if (program || inverse) {
      options.fn = program || 'container.noop';
      options.inverse = inverse || 'container.noop';
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

    if (objectArgs) {
      options.args = this.source.generateArray(params);
    }

    if (this.trackIds) {
      options.ids = this.source.generateArray(ids);
    }
    if (this.stringParams) {
      options.types = this.source.generateArray(types);
      options.contexts = this.source.generateArray(contexts);
    }

    if (this.options.data) {
      options.data = 'data';
    }
    if (this.useBlockParams) {
      options.blockParams = 'blockParams';
    }
    return options;
  },

  setupHelperArgs: function setupHelperArgs(helper, paramSize, params, useRegister) {
    var options = this.setupParams(helper, paramSize, params);
    options = this.objectLiteral(options);
    if (useRegister) {
      this.useRegister('options');
      params.push('options');
      return ['options=', options];
    } else if (params) {
      params.push(options);
      return '';
    } else {
      return options;
    }
  }
};

(function () {
  var reservedWords = ('break else new var' + ' case finally return void' + ' catch for switch while' + ' continue function this with' + ' default if throw' + ' delete in try' + ' do instanceof typeof' + ' abstract enum int short' + ' boolean export interface static' + ' byte extends long super' + ' char final native synchronized' + ' class float package throws' + ' const goto private transient' + ' debugger implements protected volatile' + ' double import public let yield await' + ' null true false').split(' ');

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for (var i = 0, l = reservedWords.length; i < l; i++) {
    compilerWords[reservedWords[i]] = true;
  }
})();

JavaScriptCompiler.isValidJavaScriptVariableName = function (name) {
  return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
};

function strictLookup(requireTerminal, compiler, parts, type) {
  var stack = compiler.popStack(),
      i = 0,
      len = parts.length;
  if (requireTerminal) {
    len--;
  }

  for (; i < len; i++) {
    stack = compiler.nameLookup(stack, parts[i], type);
  }

  if (requireTerminal) {
    return [compiler.aliasable('container.strict'), '(', stack, ', ', compiler.quotedString(parts[i]), ')'];
  } else {
    return stack;
  }
}

exports['default'] = JavaScriptCompiler;
module.exports = exports['default'];


},{"../base":118,"../exception":131,"../utils":144,"./code-gen":121}],125:[function(require,module,exports){
/* istanbul ignore next */
/* Jison generated parser */
"use strict";

var handlebars = (function () {
    var parser = { trace: function trace() {},
        yy: {},
        symbols_: { "error": 2, "root": 3, "program": 4, "EOF": 5, "program_repetition0": 6, "statement": 7, "mustache": 8, "block": 9, "rawBlock": 10, "partial": 11, "partialBlock": 12, "content": 13, "COMMENT": 14, "CONTENT": 15, "openRawBlock": 16, "rawBlock_repetition_plus0": 17, "END_RAW_BLOCK": 18, "OPEN_RAW_BLOCK": 19, "helperName": 20, "openRawBlock_repetition0": 21, "openRawBlock_option0": 22, "CLOSE_RAW_BLOCK": 23, "openBlock": 24, "block_option0": 25, "closeBlock": 26, "openInverse": 27, "block_option1": 28, "OPEN_BLOCK": 29, "openBlock_repetition0": 30, "openBlock_option0": 31, "openBlock_option1": 32, "CLOSE": 33, "OPEN_INVERSE": 34, "openInverse_repetition0": 35, "openInverse_option0": 36, "openInverse_option1": 37, "openInverseChain": 38, "OPEN_INVERSE_CHAIN": 39, "openInverseChain_repetition0": 40, "openInverseChain_option0": 41, "openInverseChain_option1": 42, "inverseAndProgram": 43, "INVERSE": 44, "inverseChain": 45, "inverseChain_option0": 46, "OPEN_ENDBLOCK": 47, "OPEN": 48, "mustache_repetition0": 49, "mustache_option0": 50, "OPEN_UNESCAPED": 51, "mustache_repetition1": 52, "mustache_option1": 53, "CLOSE_UNESCAPED": 54, "OPEN_PARTIAL": 55, "partialName": 56, "partial_repetition0": 57, "partial_option0": 58, "openPartialBlock": 59, "OPEN_PARTIAL_BLOCK": 60, "openPartialBlock_repetition0": 61, "openPartialBlock_option0": 62, "param": 63, "sexpr": 64, "OPEN_SEXPR": 65, "sexpr_repetition0": 66, "sexpr_option0": 67, "CLOSE_SEXPR": 68, "hash": 69, "hash_repetition_plus0": 70, "hashSegment": 71, "ID": 72, "EQUALS": 73, "blockParams": 74, "OPEN_BLOCK_PARAMS": 75, "blockParams_repetition_plus0": 76, "CLOSE_BLOCK_PARAMS": 77, "path": 78, "dataName": 79, "STRING": 80, "NUMBER": 81, "BOOLEAN": 82, "UNDEFINED": 83, "NULL": 84, "DATA": 85, "pathSegments": 86, "SEP": 87, "$accept": 0, "$end": 1 },
        terminals_: { 2: "error", 5: "EOF", 14: "COMMENT", 15: "CONTENT", 18: "END_RAW_BLOCK", 19: "OPEN_RAW_BLOCK", 23: "CLOSE_RAW_BLOCK", 29: "OPEN_BLOCK", 33: "CLOSE", 34: "OPEN_INVERSE", 39: "OPEN_INVERSE_CHAIN", 44: "INVERSE", 47: "OPEN_ENDBLOCK", 48: "OPEN", 51: "OPEN_UNESCAPED", 54: "CLOSE_UNESCAPED", 55: "OPEN_PARTIAL", 60: "OPEN_PARTIAL_BLOCK", 65: "OPEN_SEXPR", 68: "CLOSE_SEXPR", 72: "ID", 73: "EQUALS", 75: "OPEN_BLOCK_PARAMS", 77: "CLOSE_BLOCK_PARAMS", 80: "STRING", 81: "NUMBER", 82: "BOOLEAN", 83: "UNDEFINED", 84: "NULL", 85: "DATA", 87: "SEP" },
        productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 5], [8, 5], [11, 5], [12, 3], [59, 5], [63, 1], [63, 1], [64, 5], [69, 1], [71, 3], [74, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [56, 1], [56, 1], [79, 2], [78, 1], [86, 3], [86, 1], [6, 0], [6, 2], [17, 1], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [49, 0], [49, 2], [50, 0], [50, 1], [52, 0], [52, 2], [53, 0], [53, 1], [57, 0], [57, 2], [58, 0], [58, 1], [61, 0], [61, 2], [62, 0], [62, 1], [66, 0], [66, 2], [67, 0], [67, 1], [70, 1], [70, 2], [76, 1], [76, 2]],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$
        /**/) {

            var $0 = $$.length - 1;
            switch (yystate) {
                case 1:
                    return $$[$0 - 1];
                    break;
                case 2:
                    this.$ = yy.prepareProgram($$[$0]);
                    break;
                case 3:
                    this.$ = $$[$0];
                    break;
                case 4:
                    this.$ = $$[$0];
                    break;
                case 5:
                    this.$ = $$[$0];
                    break;
                case 6:
                    this.$ = $$[$0];
                    break;
                case 7:
                    this.$ = $$[$0];
                    break;
                case 8:
                    this.$ = $$[$0];
                    break;
                case 9:
                    this.$ = {
                        type: 'CommentStatement',
                        value: yy.stripComment($$[$0]),
                        strip: yy.stripFlags($$[$0], $$[$0]),
                        loc: yy.locInfo(this._$)
                    };

                    break;
                case 10:
                    this.$ = {
                        type: 'ContentStatement',
                        original: $$[$0],
                        value: $$[$0],
                        loc: yy.locInfo(this._$)
                    };

                    break;
                case 11:
                    this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
                    break;
                case 12:
                    this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1] };
                    break;
                case 13:
                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
                    break;
                case 14:
                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
                    break;
                case 15:
                    this.$ = { open: $$[$0 - 5], path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
                    break;
                case 16:
                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
                    break;
                case 17:
                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
                    break;
                case 18:
                    this.$ = { strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]), program: $$[$0] };
                    break;
                case 19:
                    var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
                        program = yy.prepareProgram([inverse], $$[$0 - 1].loc);
                    program.chained = true;

                    this.$ = { strip: $$[$0 - 2].strip, program: program, chain: true };

                    break;
                case 20:
                    this.$ = $$[$0];
                    break;
                case 21:
                    this.$ = { path: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 2], $$[$0]) };
                    break;
                case 22:
                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
                    break;
                case 23:
                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
                    break;
                case 24:
                    this.$ = {
                        type: 'PartialStatement',
                        name: $$[$0 - 3],
                        params: $$[$0 - 2],
                        hash: $$[$0 - 1],
                        indent: '',
                        strip: yy.stripFlags($$[$0 - 4], $$[$0]),
                        loc: yy.locInfo(this._$)
                    };

                    break;
                case 25:
                    this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
                    break;
                case 26:
                    this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 4], $$[$0]) };
                    break;
                case 27:
                    this.$ = $$[$0];
                    break;
                case 28:
                    this.$ = $$[$0];
                    break;
                case 29:
                    this.$ = {
                        type: 'SubExpression',
                        path: $$[$0 - 3],
                        params: $$[$0 - 2],
                        hash: $$[$0 - 1],
                        loc: yy.locInfo(this._$)
                    };

                    break;
                case 30:
                    this.$ = { type: 'Hash', pairs: $$[$0], loc: yy.locInfo(this._$) };
                    break;
                case 31:
                    this.$ = { type: 'HashPair', key: yy.id($$[$0 - 2]), value: $$[$0], loc: yy.locInfo(this._$) };
                    break;
                case 32:
                    this.$ = yy.id($$[$0 - 1]);
                    break;
                case 33:
                    this.$ = $$[$0];
                    break;
                case 34:
                    this.$ = $$[$0];
                    break;
                case 35:
                    this.$ = { type: 'StringLiteral', value: $$[$0], original: $$[$0], loc: yy.locInfo(this._$) };
                    break;
                case 36:
                    this.$ = { type: 'NumberLiteral', value: Number($$[$0]), original: Number($$[$0]), loc: yy.locInfo(this._$) };
                    break;
                case 37:
                    this.$ = { type: 'BooleanLiteral', value: $$[$0] === 'true', original: $$[$0] === 'true', loc: yy.locInfo(this._$) };
                    break;
                case 38:
                    this.$ = { type: 'UndefinedLiteral', original: undefined, value: undefined, loc: yy.locInfo(this._$) };
                    break;
                case 39:
                    this.$ = { type: 'NullLiteral', original: null, value: null, loc: yy.locInfo(this._$) };
                    break;
                case 40:
                    this.$ = $$[$0];
                    break;
                case 41:
                    this.$ = $$[$0];
                    break;
                case 42:
                    this.$ = yy.preparePath(true, $$[$0], this._$);
                    break;
                case 43:
                    this.$ = yy.preparePath(false, $$[$0], this._$);
                    break;
                case 44:
                    $$[$0 - 2].push({ part: yy.id($$[$0]), original: $$[$0], separator: $$[$0 - 1] });this.$ = $$[$0 - 2];
                    break;
                case 45:
                    this.$ = [{ part: yy.id($$[$0]), original: $$[$0] }];
                    break;
                case 46:
                    this.$ = [];
                    break;
                case 47:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 48:
                    this.$ = [$$[$0]];
                    break;
                case 49:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 50:
                    this.$ = [];
                    break;
                case 51:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 58:
                    this.$ = [];
                    break;
                case 59:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 64:
                    this.$ = [];
                    break;
                case 65:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 70:
                    this.$ = [];
                    break;
                case 71:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 78:
                    this.$ = [];
                    break;
                case 79:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 82:
                    this.$ = [];
                    break;
                case 83:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 86:
                    this.$ = [];
                    break;
                case 87:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 90:
                    this.$ = [];
                    break;
                case 91:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 94:
                    this.$ = [];
                    break;
                case 95:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 98:
                    this.$ = [$$[$0]];
                    break;
                case 99:
                    $$[$0 - 1].push($$[$0]);
                    break;
                case 100:
                    this.$ = [$$[$0]];
                    break;
                case 101:
                    $$[$0 - 1].push($$[$0]);
                    break;
            }
        },
        table: [{ 3: 1, 4: 2, 5: [2, 46], 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11, 14: [1, 12], 15: [1, 20], 16: 17, 19: [1, 23], 24: 15, 27: 16, 29: [1, 21], 34: [1, 22], 39: [2, 2], 44: [2, 2], 47: [2, 2], 48: [1, 13], 51: [1, 14], 55: [1, 18], 59: 19, 60: [1, 24] }, { 1: [2, 1] }, { 5: [2, 47], 14: [2, 47], 15: [2, 47], 19: [2, 47], 29: [2, 47], 34: [2, 47], 39: [2, 47], 44: [2, 47], 47: [2, 47], 48: [2, 47], 51: [2, 47], 55: [2, 47], 60: [2, 47] }, { 5: [2, 3], 14: [2, 3], 15: [2, 3], 19: [2, 3], 29: [2, 3], 34: [2, 3], 39: [2, 3], 44: [2, 3], 47: [2, 3], 48: [2, 3], 51: [2, 3], 55: [2, 3], 60: [2, 3] }, { 5: [2, 4], 14: [2, 4], 15: [2, 4], 19: [2, 4], 29: [2, 4], 34: [2, 4], 39: [2, 4], 44: [2, 4], 47: [2, 4], 48: [2, 4], 51: [2, 4], 55: [2, 4], 60: [2, 4] }, { 5: [2, 5], 14: [2, 5], 15: [2, 5], 19: [2, 5], 29: [2, 5], 34: [2, 5], 39: [2, 5], 44: [2, 5], 47: [2, 5], 48: [2, 5], 51: [2, 5], 55: [2, 5], 60: [2, 5] }, { 5: [2, 6], 14: [2, 6], 15: [2, 6], 19: [2, 6], 29: [2, 6], 34: [2, 6], 39: [2, 6], 44: [2, 6], 47: [2, 6], 48: [2, 6], 51: [2, 6], 55: [2, 6], 60: [2, 6] }, { 5: [2, 7], 14: [2, 7], 15: [2, 7], 19: [2, 7], 29: [2, 7], 34: [2, 7], 39: [2, 7], 44: [2, 7], 47: [2, 7], 48: [2, 7], 51: [2, 7], 55: [2, 7], 60: [2, 7] }, { 5: [2, 8], 14: [2, 8], 15: [2, 8], 19: [2, 8], 29: [2, 8], 34: [2, 8], 39: [2, 8], 44: [2, 8], 47: [2, 8], 48: [2, 8], 51: [2, 8], 55: [2, 8], 60: [2, 8] }, { 5: [2, 9], 14: [2, 9], 15: [2, 9], 19: [2, 9], 29: [2, 9], 34: [2, 9], 39: [2, 9], 44: [2, 9], 47: [2, 9], 48: [2, 9], 51: [2, 9], 55: [2, 9], 60: [2, 9] }, { 20: 25, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 36, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 37, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 4: 38, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 13: 40, 15: [1, 20], 17: 39 }, { 20: 42, 56: 41, 64: 43, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 45, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 5: [2, 10], 14: [2, 10], 15: [2, 10], 18: [2, 10], 19: [2, 10], 29: [2, 10], 34: [2, 10], 39: [2, 10], 44: [2, 10], 47: [2, 10], 48: [2, 10], 51: [2, 10], 55: [2, 10], 60: [2, 10] }, { 20: 46, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 47, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 48, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 42, 56: 49, 64: 43, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [2, 78], 49: 50, 65: [2, 78], 72: [2, 78], 80: [2, 78], 81: [2, 78], 82: [2, 78], 83: [2, 78], 84: [2, 78], 85: [2, 78] }, { 23: [2, 33], 33: [2, 33], 54: [2, 33], 65: [2, 33], 68: [2, 33], 72: [2, 33], 75: [2, 33], 80: [2, 33], 81: [2, 33], 82: [2, 33], 83: [2, 33], 84: [2, 33], 85: [2, 33] }, { 23: [2, 34], 33: [2, 34], 54: [2, 34], 65: [2, 34], 68: [2, 34], 72: [2, 34], 75: [2, 34], 80: [2, 34], 81: [2, 34], 82: [2, 34], 83: [2, 34], 84: [2, 34], 85: [2, 34] }, { 23: [2, 35], 33: [2, 35], 54: [2, 35], 65: [2, 35], 68: [2, 35], 72: [2, 35], 75: [2, 35], 80: [2, 35], 81: [2, 35], 82: [2, 35], 83: [2, 35], 84: [2, 35], 85: [2, 35] }, { 23: [2, 36], 33: [2, 36], 54: [2, 36], 65: [2, 36], 68: [2, 36], 72: [2, 36], 75: [2, 36], 80: [2, 36], 81: [2, 36], 82: [2, 36], 83: [2, 36], 84: [2, 36], 85: [2, 36] }, { 23: [2, 37], 33: [2, 37], 54: [2, 37], 65: [2, 37], 68: [2, 37], 72: [2, 37], 75: [2, 37], 80: [2, 37], 81: [2, 37], 82: [2, 37], 83: [2, 37], 84: [2, 37], 85: [2, 37] }, { 23: [2, 38], 33: [2, 38], 54: [2, 38], 65: [2, 38], 68: [2, 38], 72: [2, 38], 75: [2, 38], 80: [2, 38], 81: [2, 38], 82: [2, 38], 83: [2, 38], 84: [2, 38], 85: [2, 38] }, { 23: [2, 39], 33: [2, 39], 54: [2, 39], 65: [2, 39], 68: [2, 39], 72: [2, 39], 75: [2, 39], 80: [2, 39], 81: [2, 39], 82: [2, 39], 83: [2, 39], 84: [2, 39], 85: [2, 39] }, { 23: [2, 43], 33: [2, 43], 54: [2, 43], 65: [2, 43], 68: [2, 43], 72: [2, 43], 75: [2, 43], 80: [2, 43], 81: [2, 43], 82: [2, 43], 83: [2, 43], 84: [2, 43], 85: [2, 43], 87: [1, 51] }, { 72: [1, 35], 86: 52 }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 52: 53, 54: [2, 82], 65: [2, 82], 72: [2, 82], 80: [2, 82], 81: [2, 82], 82: [2, 82], 83: [2, 82], 84: [2, 82], 85: [2, 82] }, { 25: 54, 38: 56, 39: [1, 58], 43: 57, 44: [1, 59], 45: 55, 47: [2, 54] }, { 28: 60, 43: 61, 44: [1, 59], 47: [2, 56] }, { 13: 63, 15: [1, 20], 18: [1, 62] }, { 15: [2, 48], 18: [2, 48] }, { 33: [2, 86], 57: 64, 65: [2, 86], 72: [2, 86], 80: [2, 86], 81: [2, 86], 82: [2, 86], 83: [2, 86], 84: [2, 86], 85: [2, 86] }, { 33: [2, 40], 65: [2, 40], 72: [2, 40], 80: [2, 40], 81: [2, 40], 82: [2, 40], 83: [2, 40], 84: [2, 40], 85: [2, 40] }, { 33: [2, 41], 65: [2, 41], 72: [2, 41], 80: [2, 41], 81: [2, 41], 82: [2, 41], 83: [2, 41], 84: [2, 41], 85: [2, 41] }, { 20: 65, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 66, 47: [1, 67] }, { 30: 68, 33: [2, 58], 65: [2, 58], 72: [2, 58], 75: [2, 58], 80: [2, 58], 81: [2, 58], 82: [2, 58], 83: [2, 58], 84: [2, 58], 85: [2, 58] }, { 33: [2, 64], 35: 69, 65: [2, 64], 72: [2, 64], 75: [2, 64], 80: [2, 64], 81: [2, 64], 82: [2, 64], 83: [2, 64], 84: [2, 64], 85: [2, 64] }, { 21: 70, 23: [2, 50], 65: [2, 50], 72: [2, 50], 80: [2, 50], 81: [2, 50], 82: [2, 50], 83: [2, 50], 84: [2, 50], 85: [2, 50] }, { 33: [2, 90], 61: 71, 65: [2, 90], 72: [2, 90], 80: [2, 90], 81: [2, 90], 82: [2, 90], 83: [2, 90], 84: [2, 90], 85: [2, 90] }, { 20: 75, 33: [2, 80], 50: 72, 63: 73, 64: 76, 65: [1, 44], 69: 74, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 72: [1, 80] }, { 23: [2, 42], 33: [2, 42], 54: [2, 42], 65: [2, 42], 68: [2, 42], 72: [2, 42], 75: [2, 42], 80: [2, 42], 81: [2, 42], 82: [2, 42], 83: [2, 42], 84: [2, 42], 85: [2, 42], 87: [1, 51] }, { 20: 75, 53: 81, 54: [2, 84], 63: 82, 64: 76, 65: [1, 44], 69: 83, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 84, 47: [1, 67] }, { 47: [2, 55] }, { 4: 85, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 47: [2, 20] }, { 20: 86, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 87, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 26: 88, 47: [1, 67] }, { 47: [2, 57] }, { 5: [2, 11], 14: [2, 11], 15: [2, 11], 19: [2, 11], 29: [2, 11], 34: [2, 11], 39: [2, 11], 44: [2, 11], 47: [2, 11], 48: [2, 11], 51: [2, 11], 55: [2, 11], 60: [2, 11] }, { 15: [2, 49], 18: [2, 49] }, { 20: 75, 33: [2, 88], 58: 89, 63: 90, 64: 76, 65: [1, 44], 69: 91, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 65: [2, 94], 66: 92, 68: [2, 94], 72: [2, 94], 80: [2, 94], 81: [2, 94], 82: [2, 94], 83: [2, 94], 84: [2, 94], 85: [2, 94] }, { 5: [2, 25], 14: [2, 25], 15: [2, 25], 19: [2, 25], 29: [2, 25], 34: [2, 25], 39: [2, 25], 44: [2, 25], 47: [2, 25], 48: [2, 25], 51: [2, 25], 55: [2, 25], 60: [2, 25] }, { 20: 93, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 31: 94, 33: [2, 60], 63: 95, 64: 76, 65: [1, 44], 69: 96, 70: 77, 71: 78, 72: [1, 79], 75: [2, 60], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 33: [2, 66], 36: 97, 63: 98, 64: 76, 65: [1, 44], 69: 99, 70: 77, 71: 78, 72: [1, 79], 75: [2, 66], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 22: 100, 23: [2, 52], 63: 101, 64: 76, 65: [1, 44], 69: 102, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 33: [2, 92], 62: 103, 63: 104, 64: 76, 65: [1, 44], 69: 105, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 106] }, { 33: [2, 79], 65: [2, 79], 72: [2, 79], 80: [2, 79], 81: [2, 79], 82: [2, 79], 83: [2, 79], 84: [2, 79], 85: [2, 79] }, { 33: [2, 81] }, { 23: [2, 27], 33: [2, 27], 54: [2, 27], 65: [2, 27], 68: [2, 27], 72: [2, 27], 75: [2, 27], 80: [2, 27], 81: [2, 27], 82: [2, 27], 83: [2, 27], 84: [2, 27], 85: [2, 27] }, { 23: [2, 28], 33: [2, 28], 54: [2, 28], 65: [2, 28], 68: [2, 28], 72: [2, 28], 75: [2, 28], 80: [2, 28], 81: [2, 28], 82: [2, 28], 83: [2, 28], 84: [2, 28], 85: [2, 28] }, { 23: [2, 30], 33: [2, 30], 54: [2, 30], 68: [2, 30], 71: 107, 72: [1, 108], 75: [2, 30] }, { 23: [2, 98], 33: [2, 98], 54: [2, 98], 68: [2, 98], 72: [2, 98], 75: [2, 98] }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 73: [1, 109], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 23: [2, 44], 33: [2, 44], 54: [2, 44], 65: [2, 44], 68: [2, 44], 72: [2, 44], 75: [2, 44], 80: [2, 44], 81: [2, 44], 82: [2, 44], 83: [2, 44], 84: [2, 44], 85: [2, 44], 87: [2, 44] }, { 54: [1, 110] }, { 54: [2, 83], 65: [2, 83], 72: [2, 83], 80: [2, 83], 81: [2, 83], 82: [2, 83], 83: [2, 83], 84: [2, 83], 85: [2, 83] }, { 54: [2, 85] }, { 5: [2, 13], 14: [2, 13], 15: [2, 13], 19: [2, 13], 29: [2, 13], 34: [2, 13], 39: [2, 13], 44: [2, 13], 47: [2, 13], 48: [2, 13], 51: [2, 13], 55: [2, 13], 60: [2, 13] }, { 38: 56, 39: [1, 58], 43: 57, 44: [1, 59], 45: 112, 46: 111, 47: [2, 76] }, { 33: [2, 70], 40: 113, 65: [2, 70], 72: [2, 70], 75: [2, 70], 80: [2, 70], 81: [2, 70], 82: [2, 70], 83: [2, 70], 84: [2, 70], 85: [2, 70] }, { 47: [2, 18] }, { 5: [2, 14], 14: [2, 14], 15: [2, 14], 19: [2, 14], 29: [2, 14], 34: [2, 14], 39: [2, 14], 44: [2, 14], 47: [2, 14], 48: [2, 14], 51: [2, 14], 55: [2, 14], 60: [2, 14] }, { 33: [1, 114] }, { 33: [2, 87], 65: [2, 87], 72: [2, 87], 80: [2, 87], 81: [2, 87], 82: [2, 87], 83: [2, 87], 84: [2, 87], 85: [2, 87] }, { 33: [2, 89] }, { 20: 75, 63: 116, 64: 76, 65: [1, 44], 67: 115, 68: [2, 96], 69: 117, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 118] }, { 32: 119, 33: [2, 62], 74: 120, 75: [1, 121] }, { 33: [2, 59], 65: [2, 59], 72: [2, 59], 75: [2, 59], 80: [2, 59], 81: [2, 59], 82: [2, 59], 83: [2, 59], 84: [2, 59], 85: [2, 59] }, { 33: [2, 61], 75: [2, 61] }, { 33: [2, 68], 37: 122, 74: 123, 75: [1, 121] }, { 33: [2, 65], 65: [2, 65], 72: [2, 65], 75: [2, 65], 80: [2, 65], 81: [2, 65], 82: [2, 65], 83: [2, 65], 84: [2, 65], 85: [2, 65] }, { 33: [2, 67], 75: [2, 67] }, { 23: [1, 124] }, { 23: [2, 51], 65: [2, 51], 72: [2, 51], 80: [2, 51], 81: [2, 51], 82: [2, 51], 83: [2, 51], 84: [2, 51], 85: [2, 51] }, { 23: [2, 53] }, { 33: [1, 125] }, { 33: [2, 91], 65: [2, 91], 72: [2, 91], 80: [2, 91], 81: [2, 91], 82: [2, 91], 83: [2, 91], 84: [2, 91], 85: [2, 91] }, { 33: [2, 93] }, { 5: [2, 22], 14: [2, 22], 15: [2, 22], 19: [2, 22], 29: [2, 22], 34: [2, 22], 39: [2, 22], 44: [2, 22], 47: [2, 22], 48: [2, 22], 51: [2, 22], 55: [2, 22], 60: [2, 22] }, { 23: [2, 99], 33: [2, 99], 54: [2, 99], 68: [2, 99], 72: [2, 99], 75: [2, 99] }, { 73: [1, 109] }, { 20: 75, 63: 126, 64: 76, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 23], 14: [2, 23], 15: [2, 23], 19: [2, 23], 29: [2, 23], 34: [2, 23], 39: [2, 23], 44: [2, 23], 47: [2, 23], 48: [2, 23], 51: [2, 23], 55: [2, 23], 60: [2, 23] }, { 47: [2, 19] }, { 47: [2, 77] }, { 20: 75, 33: [2, 72], 41: 127, 63: 128, 64: 76, 65: [1, 44], 69: 129, 70: 77, 71: 78, 72: [1, 79], 75: [2, 72], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 24], 14: [2, 24], 15: [2, 24], 19: [2, 24], 29: [2, 24], 34: [2, 24], 39: [2, 24], 44: [2, 24], 47: [2, 24], 48: [2, 24], 51: [2, 24], 55: [2, 24], 60: [2, 24] }, { 68: [1, 130] }, { 65: [2, 95], 68: [2, 95], 72: [2, 95], 80: [2, 95], 81: [2, 95], 82: [2, 95], 83: [2, 95], 84: [2, 95], 85: [2, 95] }, { 68: [2, 97] }, { 5: [2, 21], 14: [2, 21], 15: [2, 21], 19: [2, 21], 29: [2, 21], 34: [2, 21], 39: [2, 21], 44: [2, 21], 47: [2, 21], 48: [2, 21], 51: [2, 21], 55: [2, 21], 60: [2, 21] }, { 33: [1, 131] }, { 33: [2, 63] }, { 72: [1, 133], 76: 132 }, { 33: [1, 134] }, { 33: [2, 69] }, { 15: [2, 12] }, { 14: [2, 26], 15: [2, 26], 19: [2, 26], 29: [2, 26], 34: [2, 26], 47: [2, 26], 48: [2, 26], 51: [2, 26], 55: [2, 26], 60: [2, 26] }, { 23: [2, 31], 33: [2, 31], 54: [2, 31], 68: [2, 31], 72: [2, 31], 75: [2, 31] }, { 33: [2, 74], 42: 135, 74: 136, 75: [1, 121] }, { 33: [2, 71], 65: [2, 71], 72: [2, 71], 75: [2, 71], 80: [2, 71], 81: [2, 71], 82: [2, 71], 83: [2, 71], 84: [2, 71], 85: [2, 71] }, { 33: [2, 73], 75: [2, 73] }, { 23: [2, 29], 33: [2, 29], 54: [2, 29], 65: [2, 29], 68: [2, 29], 72: [2, 29], 75: [2, 29], 80: [2, 29], 81: [2, 29], 82: [2, 29], 83: [2, 29], 84: [2, 29], 85: [2, 29] }, { 14: [2, 15], 15: [2, 15], 19: [2, 15], 29: [2, 15], 34: [2, 15], 39: [2, 15], 44: [2, 15], 47: [2, 15], 48: [2, 15], 51: [2, 15], 55: [2, 15], 60: [2, 15] }, { 72: [1, 138], 77: [1, 137] }, { 72: [2, 100], 77: [2, 100] }, { 14: [2, 16], 15: [2, 16], 19: [2, 16], 29: [2, 16], 34: [2, 16], 44: [2, 16], 47: [2, 16], 48: [2, 16], 51: [2, 16], 55: [2, 16], 60: [2, 16] }, { 33: [1, 139] }, { 33: [2, 75] }, { 33: [2, 32] }, { 72: [2, 101], 77: [2, 101] }, { 14: [2, 17], 15: [2, 17], 19: [2, 17], 29: [2, 17], 34: [2, 17], 39: [2, 17], 44: [2, 17], 47: [2, 17], 48: [2, 17], 51: [2, 17], 55: [2, 17], 60: [2, 17] }],
        defaultActions: { 4: [2, 1], 55: [2, 55], 57: [2, 20], 61: [2, 57], 74: [2, 81], 83: [2, 85], 87: [2, 18], 91: [2, 89], 102: [2, 53], 105: [2, 93], 111: [2, 19], 112: [2, 77], 117: [2, 97], 120: [2, 63], 123: [2, 69], 124: [2, 12], 136: [2, 75], 137: [2, 32] },
        parseError: function parseError(str, hash) {
            throw new Error(str);
        },
        parse: function parse(input) {
            var self = this,
                stack = [0],
                vstack = [null],
                lstack = [],
                table = this.table,
                yytext = "",
                yylineno = 0,
                yyleng = 0,
                recovering = 0,
                TERROR = 2,
                EOF = 1;
            this.lexer.setInput(input);
            this.lexer.yy = this.yy;
            this.yy.lexer = this.lexer;
            this.yy.parser = this;
            if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
            var yyloc = this.lexer.yylloc;
            lstack.push(yyloc);
            var ranges = this.lexer.options && this.lexer.options.ranges;
            if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
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
            var symbol,
                preErrorSymbol,
                state,
                action,
                a,
                r,
                yyval = {},
                p,
                len,
                newState,
                expected;
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
                        for (p in table[state]) if (this.terminals_[p] && p > 2) {
                            expected.push("'" + this.terminals_[p] + "'");
                        }
                        if (this.lexer.showPosition) {
                            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                        } else {
                            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                        }
                        this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected });
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
                            if (recovering > 0) recovering--;
                        } else {
                            symbol = preErrorSymbol;
                            preErrorSymbol = null;
                        }
                        break;
                    case 2:
                        len = this.productions_[action[1]][1];
                        yyval.$ = vstack[vstack.length - len];
                        yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
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
    var lexer = (function () {
        var lexer = { EOF: 1,
            parseError: function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            },
            setInput: function setInput(input) {
                this._input = input;
                this._more = this._less = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = '';
                this.conditionStack = ['INITIAL'];
                this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
                if (this.options.ranges) this.yylloc.range = [0, 0];
                this.offset = 0;
                return this;
            },
            input: function input() {
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
            unput: function unput(ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);

                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                //this.yyleng -= len;
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);

                if (lines.length - 1) this.yylineno -= lines.length - 1;
                var r = this.yylloc.range;

                this.yylloc = { first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                };

                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                return this;
            },
            more: function more() {
                this._more = true;
                return this;
            },
            less: function less(n) {
                this.unput(this.match.slice(n));
            },
            pastInput: function pastInput() {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
            },
            upcomingInput: function upcomingInput() {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
            },
            showPosition: function showPosition() {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            },
            next: function next() {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) this.done = true;

                var token, match, tempMatch, index, col, lines;
                if (!this._more) {
                    this.yytext = '';
                    this.match = '';
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
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
                    this.yylloc = { first_line: this.yylloc.last_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.last_column,
                        last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length };
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
                    token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                    if (this.done && this._input) this.done = false;
                    if (token) return token;else return;
                }
                if (this._input === "") {
                    return this.EOF;
                } else {
                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), { text: "", token: null, line: this.yylineno });
                }
            },
            lex: function lex() {
                var r = this.next();
                if (typeof r !== 'undefined') {
                    return r;
                } else {
                    return this.lex();
                }
            },
            begin: function begin(condition) {
                this.conditionStack.push(condition);
            },
            popState: function popState() {
                return this.conditionStack.pop();
            },
            _currentRules: function _currentRules() {
                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
            },
            topState: function topState() {
                return this.conditionStack[this.conditionStack.length - 2];
            },
            pushState: function begin(condition) {
                this.begin(condition);
            } };
        lexer.options = {};
        lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START
        /**/) {

            function strip(start, end) {
                return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng - end);
            }

            var YYSTATE = YY_START;
            switch ($avoiding_name_collisions) {
                case 0:
                    if (yy_.yytext.slice(-2) === "\\\\") {
                        strip(0, 1);
                        this.begin("mu");
                    } else if (yy_.yytext.slice(-1) === "\\") {
                        strip(0, 1);
                        this.begin("emu");
                    } else {
                        this.begin("mu");
                    }
                    if (yy_.yytext) return 15;

                    break;
                case 1:
                    return 15;
                    break;
                case 2:
                    this.popState();
                    return 15;

                    break;
                case 3:
                    this.begin('raw');return 15;
                    break;
                case 4:
                    this.popState();
                    // Should be using `this.topState()` below, but it currently
                    // returns the second top instead of the first top. Opened an
                    // issue about it at https://github.com/zaach/jison/issues/291
                    if (this.conditionStack[this.conditionStack.length - 1] === 'raw') {
                        return 15;
                    } else {
                        yy_.yytext = yy_.yytext.substr(5, yy_.yyleng - 9);
                        return 'END_RAW_BLOCK';
                    }

                    break;
                case 5:
                    return 15;
                    break;
                case 6:
                    this.popState();
                    return 14;

                    break;
                case 7:
                    return 65;
                    break;
                case 8:
                    return 68;
                    break;
                case 9:
                    return 19;
                    break;
                case 10:
                    this.popState();
                    this.begin('raw');
                    return 23;

                    break;
                case 11:
                    return 55;
                    break;
                case 12:
                    return 60;
                    break;
                case 13:
                    return 29;
                    break;
                case 14:
                    return 47;
                    break;
                case 15:
                    this.popState();return 44;
                    break;
                case 16:
                    this.popState();return 44;
                    break;
                case 17:
                    return 34;
                    break;
                case 18:
                    return 39;
                    break;
                case 19:
                    return 51;
                    break;
                case 20:
                    return 48;
                    break;
                case 21:
                    this.unput(yy_.yytext);
                    this.popState();
                    this.begin('com');

                    break;
                case 22:
                    this.popState();
                    return 14;

                    break;
                case 23:
                    return 48;
                    break;
                case 24:
                    return 73;
                    break;
                case 25:
                    return 72;
                    break;
                case 26:
                    return 72;
                    break;
                case 27:
                    return 87;
                    break;
                case 28:
                    // ignore whitespace
                    break;
                case 29:
                    this.popState();return 54;
                    break;
                case 30:
                    this.popState();return 33;
                    break;
                case 31:
                    yy_.yytext = strip(1, 2).replace(/\\"/g, '"');return 80;
                    break;
                case 32:
                    yy_.yytext = strip(1, 2).replace(/\\'/g, "'");return 80;
                    break;
                case 33:
                    return 85;
                    break;
                case 34:
                    return 82;
                    break;
                case 35:
                    return 82;
                    break;
                case 36:
                    return 83;
                    break;
                case 37:
                    return 84;
                    break;
                case 38:
                    return 81;
                    break;
                case 39:
                    return 75;
                    break;
                case 40:
                    return 77;
                    break;
                case 41:
                    return 72;
                    break;
                case 42:
                    return 72;
                    break;
                case 43:
                    return 'INVALID';
                    break;
                case 44:
                    return 5;
                    break;
            }
        };
        lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]*?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/];
        lexer.conditions = { "mu": { "rules": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], "inclusive": false }, "emu": { "rules": [2], "inclusive": false }, "com": { "rules": [6], "inclusive": false }, "raw": { "rules": [3, 4, 5], "inclusive": false }, "INITIAL": { "rules": [0, 1, 44], "inclusive": true } };
        return lexer;
    })();
    parser.lexer = lexer;
    function Parser() {
        this.yy = {};
    }Parser.prototype = parser;parser.Parser = Parser;
    return new Parser();
})();exports.__esModule = true;
exports['default'] = handlebars;


},{}],126:[function(require,module,exports){
/* eslint-disable new-cap */
'use strict';

exports.__esModule = true;
exports.print = print;
exports.PrintVisitor = PrintVisitor;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _visitor = require('./visitor');

var _visitor2 = _interopRequireDefault(_visitor);

function print(ast) {
  return new PrintVisitor().accept(ast);
}

function PrintVisitor() {
  this.padding = 0;
}

PrintVisitor.prototype = new _visitor2['default']();

PrintVisitor.prototype.pad = function (string) {
  var out = '';

  for (var i = 0, l = this.padding; i < l; i++) {
    out += '  ';
  }

  out += string + '\n';
  return out;
};

PrintVisitor.prototype.Program = function (program) {
  var out = '',
      body = program.body,
      i = undefined,
      l = undefined;

  if (program.blockParams) {
    var blockParams = 'BLOCK PARAMS: [';
    for (i = 0, l = program.blockParams.length; i < l; i++) {
      blockParams += ' ' + program.blockParams[i];
    }
    blockParams += ' ]';
    out += this.pad(blockParams);
  }

  for (i = 0, l = body.length; i < l; i++) {
    out += this.accept(body[i]);
  }

  this.padding--;

  return out;
};

PrintVisitor.prototype.MustacheStatement = function (mustache) {
  return this.pad('{{ ' + this.SubExpression(mustache) + ' }}');
};
PrintVisitor.prototype.Decorator = function (mustache) {
  return this.pad('{{ DIRECTIVE ' + this.SubExpression(mustache) + ' }}');
};

PrintVisitor.prototype.BlockStatement = PrintVisitor.prototype.DecoratorBlock = function (block) {
  var out = '';

  out += this.pad((block.type === 'DecoratorBlock' ? 'DIRECTIVE ' : '') + 'BLOCK:');
  this.padding++;
  out += this.pad(this.SubExpression(block));
  if (block.program) {
    out += this.pad('PROGRAM:');
    this.padding++;
    out += this.accept(block.program);
    this.padding--;
  }
  if (block.inverse) {
    if (block.program) {
      this.padding++;
    }
    out += this.pad('{{^}}');
    this.padding++;
    out += this.accept(block.inverse);
    this.padding--;
    if (block.program) {
      this.padding--;
    }
  }
  this.padding--;

  return out;
};

PrintVisitor.prototype.PartialStatement = function (partial) {
  var content = 'PARTIAL:' + partial.name.original;
  if (partial.params[0]) {
    content += ' ' + this.accept(partial.params[0]);
  }
  if (partial.hash) {
    content += ' ' + this.accept(partial.hash);
  }
  return this.pad('{{> ' + content + ' }}');
};
PrintVisitor.prototype.PartialBlockStatement = function (partial) {
  var content = 'PARTIAL BLOCK:' + partial.name.original;
  if (partial.params[0]) {
    content += ' ' + this.accept(partial.params[0]);
  }
  if (partial.hash) {
    content += ' ' + this.accept(partial.hash);
  }

  content += ' ' + this.pad('PROGRAM:');
  this.padding++;
  content += this.accept(partial.program);
  this.padding--;

  return this.pad('{{> ' + content + ' }}');
};

PrintVisitor.prototype.ContentStatement = function (content) {
  return this.pad("CONTENT[ '" + content.value + "' ]");
};

PrintVisitor.prototype.CommentStatement = function (comment) {
  return this.pad("{{! '" + comment.value + "' }}");
};

PrintVisitor.prototype.SubExpression = function (sexpr) {
  var params = sexpr.params,
      paramStrings = [],
      hash = undefined;

  for (var i = 0, l = params.length; i < l; i++) {
    paramStrings.push(this.accept(params[i]));
  }

  params = '[' + paramStrings.join(', ') + ']';

  hash = sexpr.hash ? ' ' + this.accept(sexpr.hash) : '';

  return this.accept(sexpr.path) + ' ' + params + hash;
};

PrintVisitor.prototype.PathExpression = function (id) {
  var path = id.parts.join('/');
  return (id.data ? '@' : '') + 'PATH:' + path;
};

PrintVisitor.prototype.StringLiteral = function (string) {
  return '"' + string.value + '"';
};

PrintVisitor.prototype.NumberLiteral = function (number) {
  return 'NUMBER{' + number.value + '}';
};

PrintVisitor.prototype.BooleanLiteral = function (bool) {
  return 'BOOLEAN{' + bool.value + '}';
};

PrintVisitor.prototype.UndefinedLiteral = function () {
  return 'UNDEFINED';
};

PrintVisitor.prototype.NullLiteral = function () {
  return 'NULL';
};

PrintVisitor.prototype.Hash = function (hash) {
  var pairs = hash.pairs,
      joinedPairs = [];

  for (var i = 0, l = pairs.length; i < l; i++) {
    joinedPairs.push(this.accept(pairs[i]));
  }

  return 'HASH{' + joinedPairs.join(', ') + '}';
};
PrintVisitor.prototype.HashPair = function (pair) {
  return pair.key + '=' + this.accept(pair.value);
};
/* eslint-enable new-cap */


},{"./visitor":127}],127:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

function Visitor() {
  this.parents = [];
}

Visitor.prototype = {
  constructor: Visitor,
  mutating: false,

  // Visits a given value. If mutating, will replace the value if necessary.
  acceptKey: function acceptKey(node, name) {
    var value = this.accept(node[name]);
    if (this.mutating) {
      // Hacky sanity check: This may have a few false positives for type for the helper
      // methods but will generally do the right thing without a lot of overhead.
      if (value && !Visitor.prototype[value.type]) {
        throw new _exception2['default']('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
      }
      node[name] = value;
    }
  },

  // Performs an accept operation with added sanity check to ensure
  // required keys are not removed.
  acceptRequired: function acceptRequired(node, name) {
    this.acceptKey(node, name);

    if (!node[name]) {
      throw new _exception2['default'](node.type + ' requires ' + name);
    }
  },

  // Traverses a given array. If mutating, empty respnses will be removed
  // for child elements.
  acceptArray: function acceptArray(array) {
    for (var i = 0, l = array.length; i < l; i++) {
      this.acceptKey(array, i);

      if (!array[i]) {
        array.splice(i, 1);
        i--;
        l--;
      }
    }
  },

  accept: function accept(object) {
    if (!object) {
      return;
    }

    /* istanbul ignore next: Sanity code */
    if (!this[object.type]) {
      throw new _exception2['default']('Unknown type: ' + object.type, object);
    }

    if (this.current) {
      this.parents.unshift(this.current);
    }
    this.current = object;

    var ret = this[object.type](object);

    this.current = this.parents.shift();

    if (!this.mutating || ret) {
      return ret;
    } else if (ret !== false) {
      return object;
    }
  },

  Program: function Program(program) {
    this.acceptArray(program.body);
  },

  MustacheStatement: visitSubExpression,
  Decorator: visitSubExpression,

  BlockStatement: visitBlock,
  DecoratorBlock: visitBlock,

  PartialStatement: visitPartial,
  PartialBlockStatement: function PartialBlockStatement(partial) {
    visitPartial.call(this, partial);

    this.acceptKey(partial, 'program');
  },

  ContentStatement: function ContentStatement() /* content */{},
  CommentStatement: function CommentStatement() /* comment */{},

  SubExpression: visitSubExpression,

  PathExpression: function PathExpression() /* path */{},

  StringLiteral: function StringLiteral() /* string */{},
  NumberLiteral: function NumberLiteral() /* number */{},
  BooleanLiteral: function BooleanLiteral() /* bool */{},
  UndefinedLiteral: function UndefinedLiteral() /* literal */{},
  NullLiteral: function NullLiteral() /* literal */{},

  Hash: function Hash(hash) {
    this.acceptArray(hash.pairs);
  },
  HashPair: function HashPair(pair) {
    this.acceptRequired(pair, 'value');
  }
};

function visitSubExpression(mustache) {
  this.acceptRequired(mustache, 'path');
  this.acceptArray(mustache.params);
  this.acceptKey(mustache, 'hash');
}
function visitBlock(block) {
  visitSubExpression.call(this, block);

  this.acceptKey(block, 'program');
  this.acceptKey(block, 'inverse');
}
function visitPartial(partial) {
  this.acceptRequired(partial, 'name');
  this.acceptArray(partial.params);
  this.acceptKey(partial, 'hash');
}

exports['default'] = Visitor;
module.exports = exports['default'];


},{"../exception":131}],128:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _visitor = require('./visitor');

var _visitor2 = _interopRequireDefault(_visitor);

function WhitespaceControl() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  this.options = options;
}
WhitespaceControl.prototype = new _visitor2['default']();

WhitespaceControl.prototype.Program = function (program) {
  var doStandalone = !this.options.ignoreStandalone;

  var isRoot = !this.isRootSeen;
  this.isRootSeen = true;

  var body = program.body;
  for (var i = 0, l = body.length; i < l; i++) {
    var current = body[i],
        strip = this.accept(current);

    if (!strip) {
      continue;
    }

    var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
        _isNextWhitespace = isNextWhitespace(body, i, isRoot),
        openStandalone = strip.openStandalone && _isPrevWhitespace,
        closeStandalone = strip.closeStandalone && _isNextWhitespace,
        inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

    if (strip.close) {
      omitRight(body, i, true);
    }
    if (strip.open) {
      omitLeft(body, i, true);
    }

    if (doStandalone && inlineStandalone) {
      omitRight(body, i);

      if (omitLeft(body, i)) {
        // If we are on a standalone node, save the indent info for partials
        if (current.type === 'PartialStatement') {
          // Pull out the whitespace from the final line
          current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
        }
      }
    }
    if (doStandalone && openStandalone) {
      omitRight((current.program || current.inverse).body);

      // Strip out the previous content node if it's whitespace only
      omitLeft(body, i);
    }
    if (doStandalone && closeStandalone) {
      // Always strip the next node
      omitRight(body, i);

      omitLeft((current.inverse || current.program).body);
    }
  }

  return program;
};

WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function (block) {
  this.accept(block.program);
  this.accept(block.inverse);

  // Find the inverse program that is involed with whitespace stripping.
  var program = block.program || block.inverse,
      inverse = block.program && block.inverse,
      firstInverse = inverse,
      lastInverse = inverse;

  if (inverse && inverse.chained) {
    firstInverse = inverse.body[0].program;

    // Walk the inverse chain to find the last inverse that is actually in the chain.
    while (lastInverse.chained) {
      lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
    }
  }

  var strip = {
    open: block.openStrip.open,
    close: block.closeStrip.close,

    // Determine the standalone candiacy. Basically flag our content as being possibly standalone
    // so our parent can determine if we actually are standalone
    openStandalone: isNextWhitespace(program.body),
    closeStandalone: isPrevWhitespace((firstInverse || program).body)
  };

  if (block.openStrip.close) {
    omitRight(program.body, null, true);
  }

  if (inverse) {
    var inverseStrip = block.inverseStrip;

    if (inverseStrip.open) {
      omitLeft(program.body, null, true);
    }

    if (inverseStrip.close) {
      omitRight(firstInverse.body, null, true);
    }
    if (block.closeStrip.open) {
      omitLeft(lastInverse.body, null, true);
    }

    // Find standalone else statments
    if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
      omitLeft(program.body);
      omitRight(firstInverse.body);
    }
  } else if (block.closeStrip.open) {
    omitLeft(program.body, null, true);
  }

  return strip;
};

WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function (mustache) {
  return mustache.strip;
};

WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
  /* istanbul ignore next */
  var strip = node.strip || {};
  return {
    inlineStandalone: true,
    open: strip.open,
    close: strip.close
  };
};

function isPrevWhitespace(body, i, isRoot) {
  if (i === undefined) {
    i = body.length;
  }

  // Nodes that end with newlines are considered whitespace (but are special
  // cased for strip operations)
  var prev = body[i - 1],
      sibling = body[i - 2];
  if (!prev) {
    return isRoot;
  }

  if (prev.type === 'ContentStatement') {
    return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
  }
}
function isNextWhitespace(body, i, isRoot) {
  if (i === undefined) {
    i = -1;
  }

  var next = body[i + 1],
      sibling = body[i + 2];
  if (!next) {
    return isRoot;
  }

  if (next.type === 'ContentStatement') {
    return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
  }
}

// Marks the node to the right of the position as omitted.
// I.e. {{foo}}' ' will mark the ' ' node as omitted.
//
// If i is undefined, then the first child will be marked as such.
//
// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
// content is met.
function omitRight(body, i, multiple) {
  var current = body[i == null ? 0 : i + 1];
  if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
    return;
  }

  var original = current.value;
  current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
  current.rightStripped = current.value !== original;
}

// Marks the node to the left of the position as omitted.
// I.e. ' '{{foo}} will mark the ' ' node as omitted.
//
// If i is undefined then the last child will be marked as such.
//
// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
// content is met.
function omitLeft(body, i, multiple) {
  var current = body[i == null ? body.length - 1 : i - 1];
  if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
    return;
  }

  // We omit the last node if it's whitespace only and not preceeded by a non-content node.
  var original = current.value;
  current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
  current.leftStripped = current.value !== original;
  return current.leftStripped;
}

exports['default'] = WhitespaceControl;
module.exports = exports['default'];


},{"./visitor":127}],129:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultDecorators = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _decoratorsInline = require('./decorators/inline');

var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}


},{"./decorators/inline":130}],130:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = _utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];


},{"../utils":144}],131:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  if (loc) {
    this.lineNumber = line;
    this.column = column;
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];


},{}],132:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultHelpers = registerDefaultHelpers;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersBlockHelperMissing = require('./helpers/block-helper-missing');

var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

var _helpersEach = require('./helpers/each');

var _helpersEach2 = _interopRequireDefault(_helpersEach);

var _helpersHelperMissing = require('./helpers/helper-missing');

var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

var _helpersIf = require('./helpers/if');

var _helpersIf2 = _interopRequireDefault(_helpersIf);

var _helpersLog = require('./helpers/log');

var _helpersLog2 = _interopRequireDefault(_helpersLog);

var _helpersLookup = require('./helpers/lookup');

var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

var _helpersWith = require('./helpers/with');

var _helpersWith2 = _interopRequireDefault(_helpersWith);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}


},{"./helpers/block-helper-missing":133,"./helpers/each":134,"./helpers/helper-missing":135,"./helpers/if":136,"./helpers/log":137,"./helpers/lookup":138,"./helpers/with":139}],133:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (_utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];


},{"../utils":144}],134:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      // Don't iterate over undefined values since we can't execute blocks against them
      // in non-strict (js) mode.
      if (context[field] == null) {
        return;
      }

      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (_utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          execIteration(i, i, i === context.length - 1);
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey !== undefined) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];


},{"../exception":131,"../utils":144}],135:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];


},{"../exception":131}],136:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (_utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });
};

module.exports = exports['default'];


},{"../utils":144}],137:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];


},{}],138:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
};

module.exports = exports['default'];


},{}],139:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!_utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: _utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];


},{"../utils":144}],140:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = logger.methodMap.indexOf(level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      if (!console[method]) {
        // eslint-disable-line no-console
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];


},{}],141:[function(require,module,exports){
(function (global){
/* global window */
'use strict';

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
  };
};

module.exports = exports['default'];


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],142:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _base = require('./base');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _base.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context !== options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }
    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = container.merge(options.decorators, env.decorators);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context !== depths[0]) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      partial = options.data['partial-block'];
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop) {
    partialBlock = options.data['partial-block'] = options.fn;

    if (partialBlock.partials) {
      options.partials = Utils.extend({}, options.partials, partialBlock.partials);
    }
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}


},{"./base":118,"./exception":131,"./utils":144}],143:[function(require,module,exports){
// Build out our basic SafeString type
'use strict';

exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];


},{}],144:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

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

var toString = Object.prototype.toString;

// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
exports.toString = toString;
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

// Older IE versions do not directly support indexOf so we must implement our own, sadly.
exports.isArray = isArray;

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}


},{}],145:[function(require,module,exports){
// USAGE:
// var handlebars = require('handlebars');
/* eslint-disable no-var */

// var local = handlebars.create();

var handlebars = require('../dist/cjs/handlebars')['default'];

var printer = require('../dist/cjs/handlebars/compiler/printer');
handlebars.PrintVisitor = printer.PrintVisitor;
handlebars.print = printer.print;

module.exports = handlebars;

// Publish a Node.js require() handler for .handlebars and .hbs files
function extension(module, filename) {
  var fs = require('fs');
  var templateString = fs.readFileSync(filename, 'utf8');
  module.exports = handlebars.compile(templateString);
}
/* istanbul ignore else */
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.handlebars'] = extension;
  require.extensions['.hbs'] = extension;
}

},{"../dist/cjs/handlebars":116,"../dist/cjs/handlebars/compiler/printer":126,"fs":107}],146:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./source-map/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./source-map/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./source-map/source-node').SourceNode;

},{"./source-map/source-map-consumer":153,"./source-map/source-map-generator":154,"./source-map/source-node":155}],147:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');

  /**
   * A data structure which is a combination of an array and a set. Adding a new
   * member is O(1), testing for membership is O(1), and finding the index of an
   * element is O(1). Removing elements from the set is not supported. Only
   * strings are supported for membership.
   */
  function ArraySet() {
    this._array = [];
    this._set = {};
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };

  /**
   * Return how many unique items are in this ArraySet. If duplicates have been
   * added, than those do not count towards the size.
   *
   * @returns Number
   */
  ArraySet.prototype.size = function ArraySet_size() {
    return Object.getOwnPropertyNames(this._set).length;
  };

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var isDuplicate = this.has(aStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set[util.toSetString(aStr)] = idx;
    }
  };

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    return Object.prototype.hasOwnProperty.call(this._set,
                                                util.toSetString(aStr));
  };

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (this.has(aStr)) {
      return this._set[util.toSetString(aStr)];
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error('No element indexed by ' + aIdx);
  };

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };

  exports.ArraySet = ArraySet;

});

},{"./util":156,"amdefine":157}],148:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var base64 = require('./base64');

  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
  // length quantities we use in the source map spec, the first bit is the sign,
  // the next four bits are the actual value, and the 6th bit is the
  // continuation bit. The continuation bit tells us whether there are more
  // digits in this value following this digit.
  //
  //   Continuation
  //   |    Sign
  //   |    |
  //   V    V
  //   101011

  var VLQ_BASE_SHIFT = 5;

  // binary: 100000
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

  // binary: 011111
  var VLQ_BASE_MASK = VLQ_BASE - 1;

  // binary: 100000
  var VLQ_CONTINUATION_BIT = VLQ_BASE;

  /**
   * Converts from a two-complement value to a value where the sign bit is
   * placed in the least significant bit.  For example, as decimals:
   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
   */
  function toVLQSigned(aValue) {
    return aValue < 0
      ? ((-aValue) << 1) + 1
      : (aValue << 1) + 0;
  }

  /**
   * Converts to a two-complement value from a value where the sign bit is
   * placed in the least significant bit.  For example, as decimals:
   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
   */
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative
      ? -shifted
      : shifted;
  }

  /**
   * Returns the base 64 VLQ encoded value.
   */
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;

    var vlq = toVLQSigned(aValue);

    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        // There are still more digits in this value, so we must make sure the
        // continuation bit is marked.
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);

    return encoded;
  };

  /**
   * Decodes the next base 64 VLQ value from the given string and returns the
   * value and the rest of the string via the out parameter.
   */
  exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;

    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }

      digit = base64.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }

      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);

    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };

});

},{"./base64":149,"amdefine":157}],149:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

  /**
   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
   */
  exports.encode = function (number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + aNumber);
  };

  /**
   * Decode a single base 64 character code digit to an integer. Returns -1 on
   * failure.
   */
  exports.decode = function (charCode) {
    var bigA = 65;     // 'A'
    var bigZ = 90;     // 'Z'

    var littleA = 97;  // 'a'
    var littleZ = 122; // 'z'

    var zero = 48;     // '0'
    var nine = 57;     // '9'

    var plus = 43;     // '+'
    var slash = 47;    // '/'

    var littleOffset = 26;
    var numberOffset = 52;

    // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
    if (bigA <= charCode && charCode <= bigZ) {
      return (charCode - bigA);
    }

    // 26 - 51: abcdefghijklmnopqrstuvwxyz
    if (littleA <= charCode && charCode <= littleZ) {
      return (charCode - littleA + littleOffset);
    }

    // 52 - 61: 0123456789
    if (zero <= charCode && charCode <= nine) {
      return (charCode - zero + numberOffset);
    }

    // 62: +
    if (charCode == plus) {
      return 62;
    }

    // 63: /
    if (charCode == slash) {
      return 63;
    }

    // Invalid base64 digit.
    return -1;
  };

});

},{"amdefine":157}],150:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  exports.GREATEST_LOWER_BOUND = 1;
  exports.LEAST_UPPER_BOUND = 2;

  /**
   * Recursive implementation of binary search.
   *
   * @param aLow Indices here and lower do not contain the needle.
   * @param aHigh Indices here and higher do not contain the needle.
   * @param aNeedle The element being searched for.
   * @param aHaystack The non-empty array being searched.
   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
   * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
   *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   */
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the index of
    //      the next-closest element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element than the one we are searching for, so we return -1.
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      // Found the element we are looking for.
      return mid;
    }
    else if (cmp > 0) {
      // Our needle is greater than aHaystack[mid].
      if (aHigh - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
      }

      // The exact needle element was not found in this haystack. Determine if
      // we are in termination case (3) or (2) and return the appropriate thing.
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return aHigh < aHaystack.length ? aHigh : -1;
      } else {
        return mid;
      }
    }
    else {
      // Our needle is less than aHaystack[mid].
      if (mid - aLow > 1) {
        // The element is in the lower half.
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
      }

      // we are in termination case (3) or (2) and return the appropriate thing.
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return mid;
      } else {
        return aLow < 0 ? -1 : aLow;
      }
    }
  }

  /**
   * This is an implementation of binary search which will always try and return
   * the index of the closest element if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param aNeedle The element you are looking for.
   * @param aHaystack The array that is being searched.
   * @param aCompare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
   *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
   */
  exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
    if (aHaystack.length === 0) {
      return -1;
    }

    var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                                aCompare, aBias || exports.GREATEST_LOWER_BOUND);
    if (index < 0) {
      return -1;
    }

    // We have found either the exact element, or the next-closest element than
    // the one we are searching for. However, there may be more than one such
    // element. Make sure we always return the smallest of these.
    while (index - 1 >= 0) {
      if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
        break;
      }
      --index;
    }

    return index;
  };

});

},{"amdefine":157}],151:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');

  /**
   * Determine whether mappingB is after mappingA with respect to generated
   * position.
   */
  function generatedPositionAfter(mappingA, mappingB) {
    // Optimized for most common case
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA ||
           util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }

  /**
   * A data structure to provide a sorted view of accumulated mappings in a
   * performance conscious manner. It trades a neglibable overhead in general
   * case for a large speedup in case of mappings being added in order.
   */
  function MappingList() {
    this._array = [];
    this._sorted = true;
    // Serves as infimum
    this._last = {generatedLine: -1, generatedColumn: 0};
  }

  /**
   * Iterate through internal items. This method takes the same arguments that
   * `Array.prototype.forEach` takes.
   *
   * NOTE: The order of the mappings is NOT guaranteed.
   */
  MappingList.prototype.unsortedForEach =
    function MappingList_forEach(aCallback, aThisArg) {
      this._array.forEach(aCallback, aThisArg);
    };

  /**
   * Add the given source mapping.
   *
   * @param Object aMapping
   */
  MappingList.prototype.add = function MappingList_add(aMapping) {
    var mapping;
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };

  /**
   * Returns the flat, sorted array of mappings. The mappings are sorted by
   * generated position.
   *
   * WARNING: This method returns internal data without copying, for
   * performance. The return value must NOT be mutated, and should be treated as
   * an immutable borrow. If you want to take ownership, you must make your own
   * copy.
   */
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };

  exports.MappingList = MappingList;

});

},{"./util":156,"amdefine":157}],152:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  // It turns out that some (most?) JavaScript engines don't self-host
  // `Array.prototype.sort`. This makes sense because C++ will likely remain
  // faster than JS when doing raw CPU-intensive sorting. However, when using a
  // custom comparator function, calling back and forth between the VM's C++ and
  // JIT'd JS is rather slow *and* loses JIT type information, resulting in
  // worse generated code for the comparator function than would be optimal. In
  // fact, when sorting with a comparator, these costs outweigh the benefits of
  // sorting in C++. By using our own JS-implemented Quick Sort (below), we get
  // a ~3500ms mean speed-up in `bench/bench.html`.

  /**
   * Swap the elements indexed by `x` and `y` in the array `ary`.
   *
   * @param {Array} ary
   *        The array.
   * @param {Number} x
   *        The index of the first item.
   * @param {Number} y
   *        The index of the second item.
   */
  function swap(ary, x, y) {
    var temp = ary[x];
    ary[x] = ary[y];
    ary[y] = temp;
  }

  /**
   * Returns a random integer within the range `low .. high` inclusive.
   *
   * @param {Number} low
   *        The lower bound on the range.
   * @param {Number} high
   *        The upper bound on the range.
   */
  function randomIntInRange(low, high) {
    return Math.round(low + (Math.random() * (high - low)));
  }

  /**
   * The Quick Sort algorithm.
   *
   * @param {Array} ary
   *        An array to sort.
   * @param {function} comparator
   *        Function to use to compare two items.
   * @param {Number} p
   *        Start index of the array
   * @param {Number} r
   *        End index of the array
   */
  function doQuickSort(ary, comparator, p, r) {
    // If our lower bound is less than our upper bound, we (1) partition the
    // array into two pieces and (2) recurse on each half. If it is not, this is
    // the empty array and our base case.

    if (p < r) {
      // (1) Partitioning.
      //
      // The partitioning chooses a pivot between `p` and `r` and moves all
      // elements that are less than or equal to the pivot to the before it, and
      // all the elements that are greater than it after it. The effect is that
      // once partition is done, the pivot is in the exact place it will be when
      // the array is put in sorted order, and it will not need to be moved
      // again. This runs in O(n) time.

      // Always choose a random pivot so that an input array which is reverse
      // sorted does not cause O(n^2) running time.
      var pivotIndex = randomIntInRange(p, r);
      var i = p - 1;

      swap(ary, pivotIndex, r);
      var pivot = ary[r];

      // Immediately after `j` is incremented in this loop, the following hold
      // true:
      //
      //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
      //
      //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
      for (var j = p; j < r; j++) {
        if (comparator(ary[j], pivot) <= 0) {
          i += 1;
          swap(ary, i, j);
        }
      }

      swap(ary, i + 1, j);
      var q = i + 1;

      // (2) Recurse on each half.

      doQuickSort(ary, comparator, p, q - 1);
      doQuickSort(ary, comparator, q + 1, r);
    }
  }

  /**
   * Sort the given array in-place with the given comparator function.
   *
   * @param {Array} ary
   *        An array to sort.
   * @param {function} comparator
   *        Function to use to compare two items.
   */
  exports.quickSort = function (ary, comparator) {
    doQuickSort(ary, comparator, 0, ary.length - 1);
  };

});

},{"amdefine":157}],153:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');
  var binarySearch = require('./binary-search');
  var ArraySet = require('./array-set').ArraySet;
  var base64VLQ = require('./base64-vlq');
  var quickSort = require('./quick-sort').quickSort;

  function SourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    return sourceMap.sections != null
      ? new IndexedSourceMapConsumer(sourceMap)
      : new BasicSourceMapConsumer(sourceMap);
  }

  SourceMapConsumer.fromSourceMap = function(aSourceMap) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
  }

  /**
   * The version of the source mapping spec that we are consuming.
   */
  SourceMapConsumer.prototype._version = 3;

  // `__generatedMappings` and `__originalMappings` are arrays that hold the
  // parsed mapping coordinates from the source map's "mappings" attribute. They
  // are lazily instantiated, accessed via the `_generatedMappings` and
  // `_originalMappings` getters respectively, and we only parse the mappings
  // and create these arrays once queried for a source location. We jump through
  // these hoops because there can be many thousands of mappings, and parsing
  // them is expensive, so we only want to do it if we must.
  //
  // Each object in the arrays is of the form:
  //
  //     {
  //       generatedLine: The line number in the generated code,
  //       generatedColumn: The column number in the generated code,
  //       source: The path to the original source file that generated this
  //               chunk of code,
  //       originalLine: The line number in the original source that
  //                     corresponds to this chunk of generated code,
  //       originalColumn: The column number in the original source that
  //                       corresponds to this chunk of generated code,
  //       name: The name of the original symbol which generated this chunk of
  //             code.
  //     }
  //
  // All properties except for `generatedLine` and `generatedColumn` can be
  // `null`.
  //
  // `_generatedMappings` is ordered by the generated positions.
  //
  // `_originalMappings` is ordered by the original positions.

  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
    get: function () {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__generatedMappings;
    }
  });

  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
    get: function () {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__originalMappings;
    }
  });

  SourceMapConsumer.prototype._charIsMappingSeparator =
    function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
      var c = aStr.charAt(index);
      return c === ";" || c === ",";
    };

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  SourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      throw new Error("Subclasses must implement _parseMappings");
    };

  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;

  SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer.LEAST_UPPER_BOUND = 2;

  /**
   * Iterate over each mapping between an original source/line/column and a
   * generated line/column in this source map.
   *
   * @param Function aCallback
   *        The function that is called with each mapping.
   * @param Object aContext
   *        Optional. If specified, this object will be the value of `this` every
   *        time that `aCallback` is called.
   * @param aOrder
   *        Either `SourceMapConsumer.GENERATED_ORDER` or
   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
   *        iterate over the mappings sorted by the generated file's line/column
   *        order or the original's source/line/column order, respectively. Defaults to
   *        `SourceMapConsumer.GENERATED_ORDER`.
   */
  SourceMapConsumer.prototype.eachMapping =
    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
      var context = aContext || null;
      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

      var mappings;
      switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
      }

      var sourceRoot = this.sourceRoot;
      mappings.map(function (mapping) {
        var source = mapping.source === null ? null : this._sources.at(mapping.source);
        if (source != null && sourceRoot != null) {
          source = util.join(sourceRoot, source);
        }
        return {
          source: source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name === null ? null : this._names.at(mapping.name)
        };
      }, this).forEach(aCallback, context);
    };

  /**
   * Returns all generated line and column information for the original source,
   * line, and column provided. If no column is provided, returns all mappings
   * corresponding to a either the line we are searching for or the next
   * closest line that has any mappings. Otherwise, returns all mappings
   * corresponding to the given line and either the column we are searching for
   * or the next closest column that has any offsets.
   *
   * The only argument is an object with the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: Optional. the column number in the original source.
   *
   * and an array of objects is returned, each with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  SourceMapConsumer.prototype.allGeneratedPositionsFor =
    function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
      var line = util.getArg(aArgs, 'line');

      // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
      // returns the index of the closest mapping less than the needle. By
      // setting needle.originalColumn to 0, we thus find the last mapping for
      // the given line, provided such a mapping exists.
      var needle = {
        source: util.getArg(aArgs, 'source'),
        originalLine: line,
        originalColumn: util.getArg(aArgs, 'column', 0)
      };

      if (this.sourceRoot != null) {
        needle.source = util.relative(this.sourceRoot, needle.source);
      }
      if (!this._sources.has(needle.source)) {
        return [];
      }
      needle.source = this._sources.indexOf(needle.source);

      var mappings = [];

      var index = this._findMapping(needle,
                                    this._originalMappings,
                                    "originalLine",
                                    "originalColumn",
                                    util.compareByOriginalPositions,
                                    binarySearch.LEAST_UPPER_BOUND);
      if (index >= 0) {
        var mapping = this._originalMappings[index];

        if (aArgs.column === undefined) {
          var originalLine = mapping.originalLine;

          // Iterate until either we run out of mappings, or we run into
          // a mapping for a different line than the one we found. Since
          // mappings are sorted, this is guaranteed to find all mappings for
          // the line we found.
          while (mapping && mapping.originalLine === originalLine) {
            mappings.push({
              line: util.getArg(mapping, 'generatedLine', null),
              column: util.getArg(mapping, 'generatedColumn', null),
              lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
            });

            mapping = this._originalMappings[++index];
          }
        } else {
          var originalColumn = mapping.originalColumn;

          // Iterate until either we run out of mappings, or we run into
          // a mapping for a different line than the one we were searching for.
          // Since mappings are sorted, this is guaranteed to find all mappings for
          // the line we are searching for.
          while (mapping &&
                 mapping.originalLine === line &&
                 mapping.originalColumn == originalColumn) {
            mappings.push({
              line: util.getArg(mapping, 'generatedLine', null),
              column: util.getArg(mapping, 'generatedColumn', null),
              lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
            });

            mapping = this._originalMappings[++index];
          }
        }
      }

      return mappings;
    };

  exports.SourceMapConsumer = SourceMapConsumer;

  /**
   * A BasicSourceMapConsumer instance represents a parsed source map which we can
   * query for information about the original file positions by giving it a file
   * position in the generated source.
   *
   * The only parameter is the raw source map (either as a JSON string, or
   * already parsed to an object). According to the spec, source maps have the
   * following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - sources: An array of URLs to the original source files.
   *   - names: An array of identifiers which can be referrenced by individual mappings.
   *   - sourceRoot: Optional. The URL root from which all sources are relative.
   *   - sourcesContent: Optional. An array of contents of the original source files.
   *   - mappings: A string of base64 VLQs which contain the actual mappings.
   *   - file: Optional. The generated file this source map is associated with.
   *
   * Here is an example source map, taken from the source map spec[0]:
   *
   *     {
   *       version : 3,
   *       file: "out.js",
   *       sourceRoot : "",
   *       sources: ["foo.js", "bar.js"],
   *       names: ["src", "maps", "are", "fun"],
   *       mappings: "AA,AB;;ABCDE;"
   *     }
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
   */
  function BasicSourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    var version = util.getArg(sourceMap, 'version');
    var sources = util.getArg(sourceMap, 'sources');
    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
    // requires the array) to play nice here.
    var names = util.getArg(sourceMap, 'names', []);
    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
    var mappings = util.getArg(sourceMap, 'mappings');
    var file = util.getArg(sourceMap, 'file', null);

    // Once again, Sass deviates from the spec and supplies the version as a
    // string rather than a number, so we use loose equality checking here.
    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    sources = sources.map(util.normalize);

    // Pass `true` below to allow duplicate names and sources. While source maps
    // are intended to be compressed and deduplicated, the TypeScript compiler
    // sometimes generates source maps with duplicates in them. See Github issue
    // #72 and bugzil.la/889492.
    this._names = ArraySet.fromArray(names, true);
    this._sources = ArraySet.fromArray(sources, true);

    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this.file = file;
  }

  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

  /**
   * Create a BasicSourceMapConsumer from a SourceMapGenerator.
   *
   * @param SourceMapGenerator aSourceMap
   *        The source map that will be consumed.
   * @returns BasicSourceMapConsumer
   */
  BasicSourceMapConsumer.fromSourceMap =
    function SourceMapConsumer_fromSourceMap(aSourceMap) {
      var smc = Object.create(BasicSourceMapConsumer.prototype);

      var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
      var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
      smc.sourceRoot = aSourceMap._sourceRoot;
      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                              smc.sourceRoot);
      smc.file = aSourceMap._file;

      // Because we are modifying the entries (by converting string sources and
      // names to indices into the sources and names ArraySets), we have to make
      // a copy of the entry or else bad things happen. Shared mutable state
      // strikes again! See github issue #191.

      var generatedMappings = aSourceMap._mappings.toArray().slice();
      var destGeneratedMappings = smc.__generatedMappings = [];
      var destOriginalMappings = smc.__originalMappings = [];

      for (var i = 0, length = generatedMappings.length; i < length; i++) {
        var srcMapping = generatedMappings[i];
        var destMapping = new Mapping;
        destMapping.generatedLine = srcMapping.generatedLine;
        destMapping.generatedColumn = srcMapping.generatedColumn;

        if (srcMapping.source) {
          destMapping.source = sources.indexOf(srcMapping.source);
          destMapping.originalLine = srcMapping.originalLine;
          destMapping.originalColumn = srcMapping.originalColumn;

          if (srcMapping.name) {
            destMapping.name = names.indexOf(srcMapping.name);
          }

          destOriginalMappings.push(destMapping);
        }

        destGeneratedMappings.push(destMapping);
      }

      quickSort(smc.__originalMappings, util.compareByOriginalPositions);

      return smc;
    };

  /**
   * The version of the source mapping spec that we are consuming.
   */
  BasicSourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
    get: function () {
      return this._sources.toArray().map(function (s) {
        return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
      }, this);
    }
  });

  /**
   * Provide the JIT with a nice shape / hidden class.
   */
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  BasicSourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var length = aStr.length;
      var index = 0;
      var cachedSegments = {};
      var temp = {};
      var originalMappings = [];
      var generatedMappings = [];
      var mapping, str, segment, end, value;

      while (index < length) {
        if (aStr.charAt(index) === ';') {
          generatedLine++;
          index++;
          previousGeneratedColumn = 0;
        }
        else if (aStr.charAt(index) === ',') {
          index++;
        }
        else {
          mapping = new Mapping();
          mapping.generatedLine = generatedLine;

          // Because each offset is encoded relative to the previous one,
          // many segments often have the same encoding. We can exploit this
          // fact by caching the parsed variable length fields of each segment,
          // allowing us to avoid a second parse if we encounter the same
          // segment again.
          for (end = index; end < length; end++) {
            if (this._charIsMappingSeparator(aStr, end)) {
              break;
            }
          }
          str = aStr.slice(index, end);

          segment = cachedSegments[str];
          if (segment) {
            index += str.length;
          } else {
            segment = [];
            while (index < end) {
              base64VLQ.decode(aStr, index, temp);
              value = temp.value;
              index = temp.rest;
              segment.push(value);
            }

            if (segment.length === 2) {
              throw new Error('Found a source, but no line and column');
            }

            if (segment.length === 3) {
              throw new Error('Found a source and line, but no column');
            }

            cachedSegments[str] = segment;
          }

          // Generated column.
          mapping.generatedColumn = previousGeneratedColumn + segment[0];
          previousGeneratedColumn = mapping.generatedColumn;

          if (segment.length > 1) {
            // Original source.
            mapping.source = previousSource + segment[1];
            previousSource += segment[1];

            // Original line.
            mapping.originalLine = previousOriginalLine + segment[2];
            previousOriginalLine = mapping.originalLine;
            // Lines are stored 0-based
            mapping.originalLine += 1;

            // Original column.
            mapping.originalColumn = previousOriginalColumn + segment[3];
            previousOriginalColumn = mapping.originalColumn;

            if (segment.length > 4) {
              // Original name.
              mapping.name = previousName + segment[4];
              previousName += segment[4];
            }
          }

          generatedMappings.push(mapping);
          if (typeof mapping.originalLine === 'number') {
            originalMappings.push(mapping);
          }
        }
      }

      quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
      this.__generatedMappings = generatedMappings;

      quickSort(originalMappings, util.compareByOriginalPositions);
      this.__originalMappings = originalMappings;
    };

  /**
   * Find the mapping that best matches the hypothetical "needle" mapping that
   * we are searching for in the given "haystack" of mappings.
   */
  BasicSourceMapConsumer.prototype._findMapping =
    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                           aColumnName, aComparator, aBias) {
      // To return the position we are searching for, we must first find the
      // mapping for the given position and then return the opposite position it
      // points to. Because the mappings are sorted, we can use binary search to
      // find the best mapping.

      if (aNeedle[aLineName] <= 0) {
        throw new TypeError('Line must be greater than or equal to 1, got '
                            + aNeedle[aLineName]);
      }
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError('Column must be greater than or equal to 0, got '
                            + aNeedle[aColumnName]);
      }

      return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
    };

  /**
   * Compute the last column for each generated mapping. The last column is
   * inclusive.
   */
  BasicSourceMapConsumer.prototype.computeColumnSpans =
    function SourceMapConsumer_computeColumnSpans() {
      for (var index = 0; index < this._generatedMappings.length; ++index) {
        var mapping = this._generatedMappings[index];

        // Mappings do not contain a field for the last generated columnt. We
        // can come up with an optimistic estimate, however, by assuming that
        // mappings are contiguous (i.e. given two consecutive mappings, the
        // first mapping ends where the second one starts).
        if (index + 1 < this._generatedMappings.length) {
          var nextMapping = this._generatedMappings[index + 1];

          if (mapping.generatedLine === nextMapping.generatedLine) {
            mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
            continue;
          }
        }

        // The last mapping for each line spans the entire line.
        mapping.lastGeneratedColumn = Infinity;
      }
    };

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.
   *   - column: The column number in the generated source.
   *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
   *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.
   *   - column: The column number in the original source, or null.
   *   - name: The original identifier, or null.
   */
  BasicSourceMapConsumer.prototype.originalPositionFor =
    function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      var index = this._findMapping(
        needle,
        this._generatedMappings,
        "generatedLine",
        "generatedColumn",
        util.compareByGeneratedPositionsDeflated,
        util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
      );

      if (index >= 0) {
        var mapping = this._generatedMappings[index];

        if (mapping.generatedLine === needle.generatedLine) {
          var source = util.getArg(mapping, 'source', null);
          if (source !== null) {
            source = this._sources.at(source);
            if (this.sourceRoot != null) {
              source = util.join(this.sourceRoot, source);
            }
          }
          var name = util.getArg(mapping, 'name', null);
          if (name !== null) {
            name = this._names.at(name);
          }
          return {
            source: source,
            line: util.getArg(mapping, 'originalLine', null),
            column: util.getArg(mapping, 'originalColumn', null),
            name: name
          };
        }
      }

      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };

  /**
   * Return true if we have the source content for every source in the source
   * map, false otherwise.
   */
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
    function BasicSourceMapConsumer_hasContentsOfAllSources() {
      if (!this.sourcesContent) {
        return false;
      }
      return this.sourcesContent.length >= this._sources.size() &&
        !this.sourcesContent.some(function (sc) { return sc == null; });
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * availible.
   */
  BasicSourceMapConsumer.prototype.sourceContentFor =
    function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      if (!this.sourcesContent) {
        return null;
      }

      if (this.sourceRoot != null) {
        aSource = util.relative(this.sourceRoot, aSource);
      }

      if (this._sources.has(aSource)) {
        return this.sourcesContent[this._sources.indexOf(aSource)];
      }

      var url;
      if (this.sourceRoot != null
          && (url = util.urlParse(this.sourceRoot))) {
        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
        // many users. We can help them out when they expect file:// URIs to
        // behave like it would if they were running a local HTTP server. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
        if (url.scheme == "file"
            && this._sources.has(fileUriAbsPath)) {
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
        }

        if ((!url.path || url.path == "/")
            && this._sources.has("/" + aSource)) {
          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
        }
      }

      // This function is used recursively from
      // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
      // don't want to throw if we can't find the source - we just want to
      // return null, so we provide a flag to exit gracefully.
      if (nullOnMissing) {
        return null;
      }
      else {
        throw new Error('"' + aSource + '" is not in the SourceMap.');
      }
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: The column number in the original source.
   *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
   *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  BasicSourceMapConsumer.prototype.generatedPositionFor =
    function SourceMapConsumer_generatedPositionFor(aArgs) {
      var source = util.getArg(aArgs, 'source');
      if (this.sourceRoot != null) {
        source = util.relative(this.sourceRoot, source);
      }
      if (!this._sources.has(source)) {
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      }
      source = this._sources.indexOf(source);

      var needle = {
        source: source,
        originalLine: util.getArg(aArgs, 'line'),
        originalColumn: util.getArg(aArgs, 'column')
      };

      var index = this._findMapping(
        needle,
        this._originalMappings,
        "originalLine",
        "originalColumn",
        util.compareByOriginalPositions,
        util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
      );

      if (index >= 0) {
        var mapping = this._originalMappings[index];

        if (mapping.source === needle.source) {
          return {
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          };
        }
      }

      return {
        line: null,
        column: null,
        lastColumn: null
      };
    };

  exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

  /**
   * An IndexedSourceMapConsumer instance represents a parsed source map which
   * we can query for information. It differs from BasicSourceMapConsumer in
   * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
   * input.
   *
   * The only parameter is a raw source map (either as a JSON string, or already
   * parsed to an object). According to the spec for indexed source maps, they
   * have the following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - file: Optional. The generated file this source map is associated with.
   *   - sections: A list of section definitions.
   *
   * Each value under the "sections" field has two fields:
   *   - offset: The offset into the original specified at which this section
   *       begins to apply, defined as an object with a "line" and "column"
   *       field.
   *   - map: A source map definition. This source map could also be indexed,
   *       but doesn't have to be.
   *
   * Instead of the "map" field, it's also possible to have a "url" field
   * specifying a URL to retrieve a source map from, but that's currently
   * unsupported.
   *
   * Here's an example source map, taken from the source map spec[0], but
   * modified to omit a section which uses the "url" field.
   *
   *  {
   *    version : 3,
   *    file: "app.js",
   *    sections: [{
   *      offset: {line:100, column:10},
   *      map: {
   *        version : 3,
   *        file: "section.js",
   *        sources: ["foo.js", "bar.js"],
   *        names: ["src", "maps", "are", "fun"],
   *        mappings: "AAAA,E;;ABCDE;"
   *      }
   *    }],
   *  }
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
   */
  function IndexedSourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    var version = util.getArg(sourceMap, 'version');
    var sections = util.getArg(sourceMap, 'sections');

    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    this._sources = new ArraySet();
    this._names = new ArraySet();

    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function (s) {
      if (s.url) {
        // The url field will require support for asynchronicity.
        // See https://github.com/mozilla/source-map/issues/16
        throw new Error('Support for url field in sections not implemented.');
      }
      var offset = util.getArg(s, 'offset');
      var offsetLine = util.getArg(offset, 'line');
      var offsetColumn = util.getArg(offset, 'column');

      if (offsetLine < lastOffset.line ||
          (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
        throw new Error('Section offsets must be ordered and non-overlapping.');
      }
      lastOffset = offset;

      return {
        generatedOffset: {
          // The offset fields are 0-based, but we use 1-based indices when
          // encoding/decoding from VLQ.
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer(util.getArg(s, 'map'))
      }
    });
  }

  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

  /**
   * The version of the source mapping spec that we are consuming.
   */
  IndexedSourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
    get: function () {
      var sources = [];
      for (var i = 0; i < this._sections.length; i++) {
        for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
          sources.push(this._sections[i].consumer.sources[j]);
        }
      };
      return sources;
    }
  });

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.
   *   - column: The column number in the generated source.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.
   *   - column: The column number in the original source, or null.
   *   - name: The original identifier, or null.
   */
  IndexedSourceMapConsumer.prototype.originalPositionFor =
    function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      // Find the section containing the generated position we're trying to map
      // to an original position.
      var sectionIndex = binarySearch.search(needle, this._sections,
        function(needle, section) {
          var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
          if (cmp) {
            return cmp;
          }

          return (needle.generatedColumn -
                  section.generatedOffset.generatedColumn);
        });
      var section = this._sections[sectionIndex];

      if (!section) {
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      }

      return section.consumer.originalPositionFor({
        line: needle.generatedLine -
          (section.generatedOffset.generatedLine - 1),
        column: needle.generatedColumn -
          (section.generatedOffset.generatedLine === needle.generatedLine
           ? section.generatedOffset.generatedColumn - 1
           : 0),
        bias: aArgs.bias
      });
    };

  /**
   * Return true if we have the source content for every source in the source
   * map, false otherwise.
   */
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
    function IndexedSourceMapConsumer_hasContentsOfAllSources() {
      return this._sections.every(function (s) {
        return s.consumer.hasContentsOfAllSources();
      });
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * available.
   */
  IndexedSourceMapConsumer.prototype.sourceContentFor =
    function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];

        var content = section.consumer.sourceContentFor(aSource, true);
        if (content) {
          return content;
        }
      }
      if (nullOnMissing) {
        return null;
      }
      else {
        throw new Error('"' + aSource + '" is not in the SourceMap.');
      }
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: The column number in the original source.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  IndexedSourceMapConsumer.prototype.generatedPositionFor =
    function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];

        // Only consider this section if the requested source is in the list of
        // sources of the consumer.
        if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
          continue;
        }
        var generatedPosition = section.consumer.generatedPositionFor(aArgs);
        if (generatedPosition) {
          var ret = {
            line: generatedPosition.line +
              (section.generatedOffset.generatedLine - 1),
            column: generatedPosition.column +
              (section.generatedOffset.generatedLine === generatedPosition.line
               ? section.generatedOffset.generatedColumn - 1
               : 0)
          };
          return ret;
        }
      }

      return {
        line: null,
        column: null
      };
    };

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  IndexedSourceMapConsumer.prototype._parseMappings =
    function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      this.__generatedMappings = [];
      this.__originalMappings = [];
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];
        var sectionMappings = section.consumer._generatedMappings;
        for (var j = 0; j < sectionMappings.length; j++) {
          var mapping = sectionMappings[i];

          var source = section.consumer._sources.at(mapping.source);
          if (section.consumer.sourceRoot !== null) {
            source = util.join(section.consumer.sourceRoot, source);
          }
          this._sources.add(source);
          source = this._sources.indexOf(source);

          var name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);

          // The mappings coming from the consumer for the section have
          // generated positions relative to the start of the section, so we
          // need to offset them to be relative to the start of the concatenated
          // generated file.
          var adjustedMapping = {
            source: source,
            generatedLine: mapping.generatedLine +
              (section.generatedOffset.generatedLine - 1),
            generatedColumn: mapping.column +
              (section.generatedOffset.generatedLine === mapping.generatedLine)
              ? section.generatedOffset.generatedColumn - 1
              : 0,
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name: name
          };

          this.__generatedMappings.push(adjustedMapping);
          if (typeof adjustedMapping.originalLine === 'number') {
            this.__originalMappings.push(adjustedMapping);
          }
        };
      };

      quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
      quickSort(this.__originalMappings, util.compareByOriginalPositions);
    };

  exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

});

},{"./array-set":147,"./base64-vlq":148,"./binary-search":150,"./quick-sort":152,"./util":156,"amdefine":157}],154:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var base64VLQ = require('./base64-vlq');
  var util = require('./util');
  var ArraySet = require('./array-set').ArraySet;
  var MappingList = require('./mapping-list').MappingList;

  /**
   * An instance of the SourceMapGenerator represents a source map which is
   * being built incrementally. You may pass an object with the following
   * properties:
   *
   *   - file: The filename of the generated source.
   *   - sourceRoot: A root for all relative URLs in this source map.
   */
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, 'file', null);
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }

  SourceMapGenerator.prototype._version = 3;

  /**
   * Creates a new SourceMapGenerator based on a SourceMapConsumer
   *
   * @param aSourceMapConsumer The SourceMap.
   */
  SourceMapGenerator.fromSourceMap =
    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator({
        file: aSourceMapConsumer.file,
        sourceRoot: sourceRoot
      });
      aSourceMapConsumer.eachMapping(function (mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };

        if (mapping.source != null) {
          newMapping.source = mapping.source;
          if (sourceRoot != null) {
            newMapping.source = util.relative(sourceRoot, newMapping.source);
          }

          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };

          if (mapping.name != null) {
            newMapping.name = mapping.name;
          }
        }

        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };

  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */
  SourceMapGenerator.prototype.addMapping =
    function SourceMapGenerator_addMapping(aArgs) {
      var generated = util.getArg(aArgs, 'generated');
      var original = util.getArg(aArgs, 'original', null);
      var source = util.getArg(aArgs, 'source', null);
      var name = util.getArg(aArgs, 'name', null);

      if (!this._skipValidation) {
        this._validateMapping(generated, original, source, name);
      }

      if (source != null && !this._sources.has(source)) {
        this._sources.add(source);
      }

      if (name != null && !this._names.has(name)) {
        this._names.add(name);
      }

      this._mappings.add({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source: source,
        name: name
      });
    };

  /**
   * Set the source content for a source file.
   */
  SourceMapGenerator.prototype.setSourceContent =
    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot != null) {
        source = util.relative(this._sourceRoot, source);
      }

      if (aSourceContent != null) {
        // Add the source content to the _sourcesContents map.
        // Create a new _sourcesContents map if the property is null.
        if (!this._sourcesContents) {
          this._sourcesContents = {};
        }
        this._sourcesContents[util.toSetString(source)] = aSourceContent;
      } else if (this._sourcesContents) {
        // Remove the source file from the _sourcesContents map.
        // If the _sourcesContents map is empty, set the property to null.
        delete this._sourcesContents[util.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };

  /**
   * Applies the mappings of a sub-source-map for a specific source file to the
   * source map being generated. Each mapping to the supplied source file is
   * rewritten using the supplied source map. Note: The resolution for the
   * resulting mappings is the minimium of this map and the supplied map.
   *
   * @param aSourceMapConsumer The source map to be applied.
   * @param aSourceFile Optional. The filename of the source file.
   *        If omitted, SourceMapConsumer's file property will be used.
   * @param aSourceMapPath Optional. The dirname of the path to the source map
   *        to be applied. If relative, it is relative to the SourceMapConsumer.
   *        This parameter is needed when the two source maps aren't in the same
   *        directory, and the source map to be applied contains relative source
   *        paths. If so, those relative source paths need to be rewritten
   *        relative to the SourceMapGenerator.
   */
  SourceMapGenerator.prototype.applySourceMap =
    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      var sourceFile = aSourceFile;
      // If aSourceFile is omitted, we will use the file property of the SourceMap
      if (aSourceFile == null) {
        if (aSourceMapConsumer.file == null) {
          throw new Error(
            'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
            'or the source map\'s "file" property. Both were omitted.'
          );
        }
        sourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      // Make "sourceFile" relative if an absolute Url is passed.
      if (sourceRoot != null) {
        sourceFile = util.relative(sourceRoot, sourceFile);
      }
      // Applying the SourceMap can add and remove items from the sources and
      // the names array.
      var newSources = new ArraySet();
      var newNames = new ArraySet();

      // Find mappings for the "sourceFile"
      this._mappings.unsortedForEach(function (mapping) {
        if (mapping.source === sourceFile && mapping.originalLine != null) {
          // Check if it can be mapped by the source map, then update the mapping.
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source != null) {
            // Copy mapping
            mapping.source = original.source;
            if (aSourceMapPath != null) {
              mapping.source = util.join(aSourceMapPath, mapping.source)
            }
            if (sourceRoot != null) {
              mapping.source = util.relative(sourceRoot, mapping.source);
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name != null) {
              mapping.name = original.name;
            }
          }
        }

        var source = mapping.source;
        if (source != null && !newSources.has(source)) {
          newSources.add(source);
        }

        var name = mapping.name;
        if (name != null && !newNames.has(name)) {
          newNames.add(name);
        }

      }, this);
      this._sources = newSources;
      this._names = newNames;

      // Copy sourcesContents of applied map.
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aSourceMapPath != null) {
            sourceFile = util.join(aSourceMapPath, sourceFile);
          }
          if (sourceRoot != null) {
            sourceFile = util.relative(sourceRoot, sourceFile);
          }
          this.setSourceContent(sourceFile, content);
        }
      }, this);
    };

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */
  SourceMapGenerator.prototype._validateMapping =
    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                aName) {
      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
          && aGenerated.line > 0 && aGenerated.column >= 0
          && !aOriginal && !aSource && !aName) {
        // Case 1.
        return;
      }
      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
               && aGenerated.line > 0 && aGenerated.column >= 0
               && aOriginal.line > 0 && aOriginal.column >= 0
               && aSource) {
        // Cases 2 and 3.
        return;
      }
      else {
        throw new Error('Invalid mapping: ' + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */
  SourceMapGenerator.prototype._serializeMappings =
    function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = '';
      var mapping;

      var mappings = this._mappings.toArray();
      for (var i = 0, len = mappings.length; i < len; i++) {
        mapping = mappings[i];

        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            result += ';';
            previousGeneratedLine++;
          }
        }
        else {
          if (i > 0) {
            if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
              continue;
            }
            result += ',';
          }
        }

        result += base64VLQ.encode(mapping.generatedColumn
                                   - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;

        if (mapping.source != null) {
          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
                                     - previousSource);
          previousSource = this._sources.indexOf(mapping.source);

          // lines are stored 0-based in SourceMap spec version 3
          result += base64VLQ.encode(mapping.originalLine - 1
                                     - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;

          result += base64VLQ.encode(mapping.originalColumn
                                     - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;

          if (mapping.name != null) {
            result += base64VLQ.encode(this._names.indexOf(mapping.name)
                                       - previousName);
            previousName = this._names.indexOf(mapping.name);
          }
        }
      }

      return result;
    };

  SourceMapGenerator.prototype._generateSourcesContent =
    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function (source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot != null) {
          source = util.relative(aSourceRoot, source);
        }
        var key = util.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
                                                    key)
          ? this._sourcesContents[key]
          : null;
      }, this);
    };

  /**
   * Externalize the source map.
   */
  SourceMapGenerator.prototype.toJSON =
    function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._file != null) {
        map.file = this._file;
      }
      if (this._sourceRoot != null) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }

      return map;
    };

  /**
   * Render the source map being generated to a string.
   */
  SourceMapGenerator.prototype.toString =
    function SourceMapGenerator_toString() {
      return JSON.stringify(this.toJSON());
    };

  exports.SourceMapGenerator = SourceMapGenerator;

});

},{"./array-set":147,"./base64-vlq":148,"./mapping-list":151,"./util":156,"amdefine":157}],155:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
  var util = require('./util');

  // Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
  // operating systems these days (capturing the result).
  var REGEX_NEWLINE = /(\r?\n)/;

  // Newline character code for charCodeAt() comparisons
  var NEWLINE_CODE = 10;

  // Private symbol for identifying `SourceNode`s when multiple versions of
  // the source-map library are loaded. This MUST NOT CHANGE across
  // versions!
  var isSourceNode = "$$$isSourceNode$$$";

  /**
   * SourceNodes provide a way to abstract over interpolating/concatenating
   * snippets of generated JavaScript source code while maintaining the line and
   * column information associated with the original source code.
   *
   * @param aLine The original line number.
   * @param aColumn The original column number.
   * @param aSource The original source's filename.
   * @param aChunks Optional. An array of strings which are snippets of
   *        generated JS, or other SourceNodes.
   * @param aName The original identifier.
   */
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null) this.add(aChunks);
  }

  /**
   * Creates a SourceNode from generated code and a SourceMapConsumer.
   *
   * @param aGeneratedCode The generated code
   * @param aSourceMapConsumer The SourceMap for the generated code
   * @param aRelativePath Optional. The path that relative sources in the
   *        SourceMapConsumer should be relative to.
   */
  SourceNode.fromStringWithSourceMap =
    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
      // The SourceNode we want to fill with the generated code
      // and the SourceMap
      var node = new SourceNode();

      // All even indices of this array are one line of the generated code,
      // while all odd indices are the newlines between two adjacent lines
      // (since `REGEX_NEWLINE` captures its match).
      // Processed fragments are removed from this array, by calling `shiftNextLine`.
      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
      var shiftNextLine = function() {
        var lineContents = remainingLines.shift();
        // The last line of a file might not have a newline.
        var newLine = remainingLines.shift() || "";
        return lineContents + newLine;
      };

      // We need to remember the position of "remainingLines"
      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

      // The generate SourceNodes we need a code range.
      // To extract it current and last mapping is used.
      // Here we store the last mapping.
      var lastMapping = null;

      aSourceMapConsumer.eachMapping(function (mapping) {
        if (lastMapping !== null) {
          // We add the code from "lastMapping" to "mapping":
          // First check if there is a new line in between.
          if (lastGeneratedLine < mapping.generatedLine) {
            var code = "";
            // Associate first line with "lastMapping"
            addMappingWithCode(lastMapping, shiftNextLine());
            lastGeneratedLine++;
            lastGeneratedColumn = 0;
            // The remaining code is added without mapping
          } else {
            // There is no new line in between.
            // Associate the code between "lastGeneratedColumn" and
            // "mapping.generatedColumn" with "lastMapping"
            var nextLine = remainingLines[0];
            var code = nextLine.substr(0, mapping.generatedColumn -
                                          lastGeneratedColumn);
            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                                lastGeneratedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
            addMappingWithCode(lastMapping, code);
            // No more remaining code, continue
            lastMapping = mapping;
            return;
          }
        }
        // We add the generated code until the first mapping
        // to the SourceNode without any mapping.
        // Each line is added as separate string.
        while (lastGeneratedLine < mapping.generatedLine) {
          node.add(shiftNextLine());
          lastGeneratedLine++;
        }
        if (lastGeneratedColumn < mapping.generatedColumn) {
          var nextLine = remainingLines[0];
          node.add(nextLine.substr(0, mapping.generatedColumn));
          remainingLines[0] = nextLine.substr(mapping.generatedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
        }
        lastMapping = mapping;
      }, this);
      // We have processed all mappings.
      if (remainingLines.length > 0) {
        if (lastMapping) {
          // Associate the remaining code in the current line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
        }
        // and add the remaining lines without any mapping
        node.add(remainingLines.join(""));
      }

      // Copy sourcesContent into SourceNode
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aRelativePath != null) {
            sourceFile = util.join(aRelativePath, sourceFile);
          }
          node.setSourceContent(sourceFile, content);
        }
      });

      return node;

      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === undefined) {
          node.add(code);
        } else {
          var source = aRelativePath
            ? util.join(aRelativePath, mapping.source)
            : mapping.source;
          node.add(new SourceNode(mapping.originalLine,
                                  mapping.originalColumn,
                                  source,
                                  code,
                                  mapping.name));
        }
      }
    };

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function (chunk) {
        this.add(chunk);
      }, this);
    }
    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length-1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    }
    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      }
      else {
        if (chunk !== '') {
          aFn(chunk, { source: this.source,
                       line: this.line,
                       column: this.column,
                       name: this.name });
        }
      }
    }
  };

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len-1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    }
    else if (typeof lastChild === 'string') {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    }
    else {
      this.children.push(''.replace(aPattern, aReplacement));
    }
    return this;
  };

  /**
   * Set the source content for a source file. This will be added to the SourceMapGenerator
   * in the sourcesContent field.
   *
   * @param aSourceFile The filename of the source file
   * @param aSourceContent The content of the source file
   */
  SourceNode.prototype.setSourceContent =
    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };

  /**
   * Walk over the tree of SourceNodes. The walking function is called for each
   * source file content and is passed the filename and source content.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walkSourceContents =
    function SourceNode_walkSourceContents(aFn) {
      for (var i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i][isSourceNode]) {
          this.children[i].walkSourceContents(aFn);
        }
      }

      var sources = Object.keys(this.sourceContents);
      for (var i = 0, len = sources.length; i < len; i++) {
        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
      }
    };

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function (chunk) {
      str += chunk;
    });
    return str;
  };

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function (chunk, original) {
      generated.code += chunk;
      if (original.source !== null
          && original.line !== null
          && original.column !== null) {
        if(lastOriginalSource !== original.source
           || lastOriginalLine !== original.line
           || lastOriginalColumn !== original.column
           || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (var idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          // Mappings end at eol
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function (sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });

    return { code: generated.code, map: map };
  };

  exports.SourceNode = SourceNode;

});

},{"./source-map-generator":154,"./util":156,"amdefine":157}],156:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  /**
   * This is a helper function for getting values from parameter/options
   * objects.
   *
   * @param args The object we are extracting values from
   * @param name The name of the property we are getting.
   * @param defaultValue An optional value to return if the property is missing
   * from the object. If this is not specified and the property is missing, an
   * error will be thrown.
   */
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;

  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;

  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports.urlParse = urlParse;

  function urlGenerate(aParsedUrl) {
    var url = '';
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ':';
    }
    url += '//';
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + '@';
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports.urlGenerate = urlGenerate;

  /**
   * Normalizes a path, or the path portion of a URL:
   *
   * - Replaces consequtive slashes with one slash.
   * - Removes unnecessary '.' parts.
   * - Removes unnecessary '<dir>/..' parts.
   *
   * Based on code in the Node.js 'path' core module.
   *
   * @param aPath The path or url to normalize.
   */
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute = (path.charAt(0) === '/');

    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === '.') {
        parts.splice(i, 1);
      } else if (part === '..') {
        up++;
      } else if (up > 0) {
        if (part === '') {
          // The first part is blank if the path is absolute. Trying to go
          // above the root is a no-op. Therefore we can remove all '..' parts
          // directly after the root.
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join('/');

    if (path === '') {
      path = isAbsolute ? '/' : '.';
    }

    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports.normalize = normalize;

  /**
   * Joins two paths/URLs.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be joined with the root.
   *
   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
   *   first.
   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
   *   is updated with the result and aRoot is returned. Otherwise the result
   *   is returned.
   *   - If aPath is absolute, the result is aPath.
   *   - Otherwise the two paths are joined with a slash.
   * - Joining for example 'http://' and 'www.example.com' is also supported.
   */
  function join(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || '/';
    }

    // `join(foo, '//www.example.org')`
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }

    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }

    // `join('http://', 'www.example.com')`
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }

    var joined = aPath.charAt(0) === '/'
      ? aPath
      : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports.join = join;

  /**
   * Make a path relative to a URL or another path.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be made relative to aRoot.
   */
  function relative(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }

    aRoot = aRoot.replace(/\/$/, '');

    // It is possible for the path to be above the root. In this case, simply
    // checking whether the root is a prefix of the path won't work. Instead, we
    // need to remove components from the root one by one, until either we find
    // a prefix that fits, or we run out of components to remove.
    var level = 0;
    while (aPath.indexOf(aRoot + '/') !== 0) {
      var index = aRoot.lastIndexOf("/");
      if (index < 0) {
        return aPath;
      }

      // If the only part of the root that is left is the scheme (i.e. http://,
      // file:///, etc.), one or more slashes (/), or simply nothing at all, we
      // have exhausted all components, so the path is not relative to the root.
      aRoot = aRoot.slice(0, index);
      if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
        return aPath;
      }

      ++level;
    }

    // Make sure we add a "../" for each component we removed from the root.
    return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
  }
  exports.relative = relative;

  /**
   * Because behavior goes wacky when you set `__proto__` on objects, we
   * have to prefix all the strings in our set with an arbitrary character.
   *
   * See https://github.com/mozilla/source-map/pull/31 and
   * https://github.com/mozilla/source-map/issues/30
   *
   * @param String aStr
   */
  function toSetString(aStr) {
    return '$' + aStr;
  }
  exports.toSetString = toSetString;

  function fromSetString(aStr) {
    return aStr.substr(1);
  }
  exports.fromSetString = fromSetString;

  /**
   * Comparator between two mappings where the original positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same original source/line/column, but different generated
   * line and column the same. Useful when searching for a mapping with a
   * stubbed out mapping.
   */
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp = mappingA.source - mappingB.source;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }

    return mappingA.name - mappingB.name;
  };
  exports.compareByOriginalPositions = compareByOriginalPositions;

  /**
   * Comparator between two mappings with deflated source and name indices where
   * the generated positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same generated line and column, but different
   * source/name/original line and column the same. Useful when searching for a
   * mapping with a stubbed out mapping.
   */
  function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp;
    }

    cmp = mappingA.source - mappingB.source;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }

    return mappingA.name - mappingB.name;
  };
  exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

  function strcmp(aStr1, aStr2) {
    if (aStr1 === aStr2) {
      return 0;
    }

    if (aStr1 > aStr2) {
      return 1;
    }

    return -1;
  }

  /**
   * Comparator between two mappings with inflated source and name strings where
   * the generated positions are compared.
   */
  function compareByGeneratedPositionsInflated(mappingA, mappingB) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }

    return strcmp(mappingA.name, mappingB.name);
  };
  exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

});

},{"amdefine":157}],157:[function(require,module,exports){
(function (process,__filename){
/** vim: et:ts=4:sw=4:sts=4
 * @license amdefine 1.0.0 Copyright (c) 2011-2015, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/amdefine for details
 */

/*jslint node: true */
/*global module, process */
'use strict';

/**
 * Creates a define for node.
 * @param {Object} module the "module" object that is defined by Node for the
 * current module.
 * @param {Function} [requireFn]. Node's require function for the current module.
 * It only needs to be passed in Node versions before 0.5, when module.require
 * did not exist.
 * @returns {Function} a define function that is usable for the current node
 * module.
 */
function amdefine(module, requireFn) {
    'use strict';
    var defineCache = {},
        loaderCache = {},
        alreadyCalled = false,
        path = require('path'),
        makeRequire, stringRequire;

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots(ary) {
        var i, part;
        for (i = 0; ary[i]; i+= 1) {
            part = ary[i];
            if (part === '.') {
                ary.splice(i, 1);
                i -= 1;
            } else if (part === '..') {
                if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                    //End of the line. Keep at least one non-dot
                    //path segment at the front so it can be mapped
                    //correctly to disk. Otherwise, there is likely
                    //no path mapping for a path starting with '..'.
                    //This can still fail, but catches the most reasonable
                    //uses of ..
                    break;
                } else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }

    function normalize(name, baseName) {
        var baseParts;

        //Adjust any relative paths.
        if (name && name.charAt(0) === '.') {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                baseParts = baseName.split('/');
                baseParts = baseParts.slice(0, baseParts.length - 1);
                baseParts = baseParts.concat(name.split('/'));
                trimDots(baseParts);
                name = baseParts.join('/');
            }
        }

        return name;
    }

    /**
     * Create the normalize() function passed to a loader plugin's
     * normalize method.
     */
    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(id) {
        function load(value) {
            loaderCache[id] = value;
        }

        load.fromText = function (id, text) {
            //This one is difficult because the text can/probably uses
            //define, and any relative paths and requires should be relative
            //to that id was it would be found on disk. But this would require
            //bootstrapping a module/require fairly deeply from node core.
            //Not sure how best to go about that yet.
            throw new Error('amdefine does not implement load.fromText');
        };

        return load;
    }

    makeRequire = function (systemRequire, exports, module, relId) {
        function amdRequire(deps, callback) {
            if (typeof deps === 'string') {
                //Synchronous, single module require('')
                return stringRequire(systemRequire, exports, module, deps, relId);
            } else {
                //Array of dependencies with a callback.

                //Convert the dependencies to modules.
                deps = deps.map(function (depName) {
                    return stringRequire(systemRequire, exports, module, depName, relId);
                });

                //Wait for next tick to call back the require call.
                if (callback) {
                    process.nextTick(function () {
                        callback.apply(null, deps);
                    });
                }
            }
        }

        amdRequire.toUrl = function (filePath) {
            if (filePath.indexOf('.') === 0) {
                return normalize(filePath, path.dirname(module.filename));
            } else {
                return filePath;
            }
        };

        return amdRequire;
    };

    //Favor explicit value, passed in if the module wants to support Node 0.4.
    requireFn = requireFn || function req() {
        return module.require.apply(module, arguments);
    };

    function runFactory(id, deps, factory) {
        var r, e, m, result;

        if (id) {
            e = loaderCache[id] = {};
            m = {
                id: id,
                uri: __filename,
                exports: e
            };
            r = makeRequire(requireFn, e, m, id);
        } else {
            //Only support one define call per file
            if (alreadyCalled) {
                throw new Error('amdefine with no module ID cannot be called more than once per file.');
            }
            alreadyCalled = true;

            //Use the real variables from node
            //Use module.exports for exports, since
            //the exports in here is amdefine exports.
            e = module.exports;
            m = module;
            r = makeRequire(requireFn, e, m, module.id);
        }

        //If there are dependencies, they are strings, so need
        //to convert them to dependency values.
        if (deps) {
            deps = deps.map(function (depName) {
                return r(depName);
            });
        }

        //Call the factory with the right dependencies.
        if (typeof factory === 'function') {
            result = factory.apply(m.exports, deps);
        } else {
            result = factory;
        }

        if (result !== undefined) {
            m.exports = result;
            if (id) {
                loaderCache[id] = m.exports;
            }
        }
    }

    stringRequire = function (systemRequire, exports, module, id, relId) {
        //Split the ID by a ! so that
        var index = id.indexOf('!'),
            originalId = id,
            prefix, plugin;

        if (index === -1) {
            id = normalize(id, relId);

            //Straight module lookup. If it is one of the special dependencies,
            //deal with it, otherwise, delegate to node.
            if (id === 'require') {
                return makeRequire(systemRequire, exports, module, relId);
            } else if (id === 'exports') {
                return exports;
            } else if (id === 'module') {
                return module;
            } else if (loaderCache.hasOwnProperty(id)) {
                return loaderCache[id];
            } else if (defineCache[id]) {
                runFactory.apply(null, defineCache[id]);
                return loaderCache[id];
            } else {
                if(systemRequire) {
                    return systemRequire(originalId);
                } else {
                    throw new Error('No module with ID: ' + id);
                }
            }
        } else {
            //There is a plugin in play.
            prefix = id.substring(0, index);
            id = id.substring(index + 1, id.length);

            plugin = stringRequire(systemRequire, exports, module, prefix, relId);

            if (plugin.normalize) {
                id = plugin.normalize(id, makeNormalize(relId));
            } else {
                //Normalize the ID normally.
                id = normalize(id, relId);
            }

            if (loaderCache[id]) {
                return loaderCache[id];
            } else {
                plugin.load(id, makeRequire(systemRequire, exports, module, relId), makeLoad(id), {});

                return loaderCache[id];
            }
        }
    };

    //Create a define function specific to the module asking for amdefine.
    function define(id, deps, factory) {
        if (Array.isArray(id)) {
            factory = deps;
            deps = id;
            id = undefined;
        } else if (typeof id !== 'string') {
            factory = id;
            id = deps = undefined;
        }

        if (deps && !Array.isArray(deps)) {
            factory = deps;
            deps = undefined;
        }

        if (!deps) {
            deps = ['require', 'exports', 'module'];
        }

        //Set up properties for this module. If an ID, then use
        //internal cache. If no ID, then use the external variables
        //for this node module.
        if (id) {
            //Put the module in deep freeze until there is a
            //require call for it.
            defineCache[id] = [id, deps, factory];
        } else {
            runFactory(id, deps, factory);
        }
    }

    //define.require, which has access to all the values in the
    //cache. Useful for AMD modules that all have IDs in the file,
    //but need to finally export a value to node based on one of those
    //IDs.
    define.require = function (id) {
        if (loaderCache[id]) {
            return loaderCache[id];
        }

        if (defineCache[id]) {
            runFactory.apply(null, defineCache[id]);
            return loaderCache[id];
        }
    };

    define.amd = {};

    return define;
}

module.exports = amdefine;

}).call(this,require('_process'),"/node_modules/handlebars/node_modules/source-map/node_modules/amdefine/amdefine.js")
},{"_process":110,"path":109}],158:[function(require,module,exports){
module.exports = not

function not(f) {
    return negation

    function negation() {
        return !f.apply(this, arguments)
    }
}

},{}],159:[function(require,module,exports){
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

},{}],160:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _utilReduce2hash = require('../../util/reduce2hash');

var _utilReduce2hash2 = _interopRequireDefault(_utilReduce2hash);

var buttonList = ['view', 'term', 'relation', 'simple', 'boundary-detection', 'negation', 'replicate-auto', 'speculation'];

exports['default'] = function () {
  var emitter = new _events.EventEmitter(),
      buttons = buttonList.map(Button),
      propagateStateOfAllButtons = function propagateStateOfAllButtons() {
    return propagateStateOf(emitter, buttons);
  },
      buttonHash = buttons.reduce(_utilReduce2hash2['default'], {});

  // default pushed;
  buttonHash['boundary-detection'].value(true);

  // Bind events.
  buttons.forEach(function (button) {
    button.on('change', function (data) {
      return emitter.emit('change', data);
    });
  });

  return _.extend(emitter, buttonHash, {
    propagate: propagateStateOfAllButtons
  });
};

function Button(buttonName) {
  // Button state is true when the button is pushed.
  var emitter = new _events.EventEmitter(),
      state = false,
      value = function value(newValue) {
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
  propagate = function propagate() {
    return emitter.emit('change', {
      buttonName: buttonName,
      state: state
    });
  };

  return _.extend(emitter, {
    name: buttonName,
    value: value,
    toggle: toggle,
    propagate: propagate
  });
}

function propagateStateOf(emitter, buttons) {
  buttons.map(toData).forEach(function (data) {
    return emitter.emit('change', data);
  });
}

function toData(button) {
  return {
    buttonName: button.name,
    state: button.value()
  };
}
module.exports = exports['default'];

},{"../../util/reduce2hash":372,"babel-runtime/helpers/interop-require-default":17,"events":108}],161:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _events = require('events');

var _ModeAccordingToButton = require('./ModeAccordingToButton');

var _ModeAccordingToButton2 = _interopRequireDefault(_ModeAccordingToButton);

var ButtonEnableStates = function ButtonEnableStates() {
  var states = {},
      set = function set(button, enable) {
    states[button] = enable;
  },
      eventEmitter = new _events.EventEmitter(),
      propagate = function propagate() {
    eventEmitter.emit('change', states);
  };

  return _.extend(eventEmitter, {
    set: set,
    propagate: propagate
  });
},
    UpdateButtonState = function UpdateButtonState(model, buttonEnableStates, clipBoard) {
  // Short cut name
  var s = model.selectionModel,
      doPredicate = function doPredicate(name) {
    return _.isFunction(name) ? name() : s[name].some();
  },
      and = function and() {
    for (var i = 0; i < arguments.length; i++) {
      if (!doPredicate(arguments[i])) return false;
    }

    return true;
  },
      or = function or() {
    for (var i = 0; i < arguments.length; i++) {
      if (doPredicate(arguments[i])) return true;
    }

    return false;
  },
      hasCopy = function hasCopy() {
    return clipBoard.clipBoard.length > 0;
  },
      sOrE = _.partial(or, 'span', 'entity'),
      eOrR = _.partial(or, 'entity', 'relation');

  // Check all associated anntation elements.
  // For exapmle, it should be that buttons associate with entitis is enable,
  // when deselect the span after select a span and an entity.
  var predicates = {
    replicate: function replicate() {
      return Boolean(s.span.single());
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

  return function (buttons) {
    buttons.forEach(function (buttonName) {
      buttonEnableStates.set(buttonName, predicates[buttonName]());
    });
  };
},
    UpdateModificationButtons = function UpdateModificationButtons(model, modeAccordingToButton) {
  var doesAllModificaionHasSpecified = function doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement) {
    return modificationsOfSelectedElement.length > 0 && _.every(modificationsOfSelectedElement, function (m) {
      return _.contains(m, specified);
    });
  },
      updateModificationButton = function updateModificationButton(specified, modificationsOfSelectedElement) {
    // All modification has specified modification if exits.
    modeAccordingToButton[specified.toLowerCase()].value(doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement));
  };

  return function (selectionModel) {
    var modifications = selectionModel.all().map(function (e) {
      return model.annotationData.getModificationOf(e).map(function (m) {
        return m.pred;
      });
    });

    updateModificationButton('Negation', modifications);
    updateModificationButton('Speculation', modifications);
  };
},
    ButtonStateHelper = function ButtonStateHelper(model, modeAccordingToButton, buttonEnableStates, updateButtonState, updateModificationButtons) {
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
    updateByEntity: _.compose(propagate, _.partial(updateModificationButtons, model.selectionModel.entity), _.partial(updateButtonState, entityButtons)),
    updateByRelation: _.compose(propagate, _.partial(updateModificationButtons, model.selectionModel.relation), _.partial(updateButtonState, relationButtons))
  };
};

module.exports = function (editor, model, clipBoard) {
  // Save state of push control buttons.
  var modeAccordingToButton = new _ModeAccordingToButton2['default'](),

  // Save enable/disable state of contorol buttons.
  buttonEnableStates = new ButtonEnableStates(),
      updateButtonState = new UpdateButtonState(model, buttonEnableStates, clipBoard),

  // Change push/unpush of buttons of modifications.
  updateModificationButtons = new UpdateModificationButtons(model, modeAccordingToButton),

  // Helper to update button state.
  buttonStateHelper = new ButtonStateHelper(model, modeAccordingToButton, buttonEnableStates, updateButtonState, updateModificationButtons);

  // Proragate events.
  modeAccordingToButton.on('change', function (data) {
    editor.eventEmitter.emit('textae.control.button.push', data);
  });

  buttonEnableStates.on('change', function (data) {
    editor.eventEmitter.emit('textae.control.buttons.change', data);
  });

  return {
    // Modes accoding to buttons of control.
    modeAccordingToButton: modeAccordingToButton,
    buttonStateHelper: buttonStateHelper
  };
};

},{"./ModeAccordingToButton":160,"babel-runtime/helpers/interop-require-default":17,"events":108}],162:[function(require,module,exports){
// Maintainance a state of which the save button is able to be push.

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _observ = require("observ");

var _observ2 = _interopRequireDefault(_observ);

exports["default"] = function () {
  var isDataModified = false,
      o = new _observ2["default"](false);

  o.forceModified = function (val) {
    o.set(val);
    isDataModified = val;
  };

  o.update = function (val) {
    o.set(isDataModified || val);
  };

  return o;
};

module.exports = exports["default"];

},{"babel-runtime/helpers/interop-require-default":17,"observ":159}],163:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _events = require('events');

var _utilAjaxAccessor = require('../util/ajaxAccessor');

var ajaxAccessor = _interopRequireWildcard(_utilAjaxAccessor);

var _utilCursorChanger = require('../util/CursorChanger');

var _utilCursorChanger2 = _interopRequireDefault(_utilCursorChanger);

var _dialogGetEditorDialog = require('./dialog/GetEditorDialog');

var _dialogGetEditorDialog2 = _interopRequireDefault(_dialogGetEditorDialog);

var _jQuerySugar = require('./jQuerySugar');

var _jQuerySugar2 = _interopRequireDefault(_jQuerySugar);

var bindEvent = function bindEvent($target, event, func) {
  $target.on(event, func);
},
    bindCloseEvent = function bindCloseEvent($dialog) {
  bindEvent($dialog, 'dialog.close', function () {
    $dialog.close();
  });
  return $dialog;
};

// A sub component to save and load data.
module.exports = function (editor, confirmDiscardChangeMessage) {
  var dataSourceUrl = '',
      cursorChanger = new _utilCursorChanger2['default'](editor),
      getAnnotationFromServer = function getAnnotationFromServer(urlToJson) {
    cursorChanger.startWait();
    ajaxAccessor.getAsync(urlToJson, function getAnnotationFromServerSuccess(annotation) {
      api.emit('load', {
        annotation: annotation,
        source: _jQuerySugar2['default'].toLink(_url2['default'].resolve(location.href, urlToJson))
      });
      dataSourceUrl = urlToJson;
    }, function () {
      cursorChanger.endWait();
      toastr.error("Could not load the target.");
    });
  },

  // load/saveDialog
  loadSaveDialog = (function () {
    var extendOpenWithUrl = function extendOpenWithUrl($dialog) {
      // Do not set twice.
      if (!$dialog.openAndSetParam) {
        $dialog.openAndSetParam = _.compose($dialog.open.bind($dialog), function (params) {
          // Display dataSourceUrl.
          this.find('[type="text"].url').val(dataSourceUrl).trigger('input');

          $dialog.params = params;
        });
      }

      return $dialog;
    },
        getDialog = _.compose(extendOpenWithUrl, bindCloseEvent, new _dialogGetEditorDialog2['default'](editor)),
        label = {
      URL: 'URL',
      LOCAL: 'Local'
    },
        getLoadDialog = function getLoadDialog(editorId) {
      var getAnnotationFromFile = function getAnnotationFromFile(file) {
        var firstFile = file.files[0],
            reader = new FileReader();

        reader.onload = function () {
          var annotation = JSON.parse(this.result);
          api.emit('load', {
            annotation: annotation,
            source: firstFile.name + '(local file)'
          });
        };
        reader.readAsText(firstFile);
      },
          RowDiv = _.partial(_jQuerySugar2['default'].Div, 'textae-editor__load-dialog__row'),
          RowLabel = _.partial(_jQuerySugar2['default'].Label, 'textae-editor__load-dialog__label'),
          OpenButton = _.partial(_jQuerySugar2['default'].Button, 'Open'),
          isUserComfirm = function isUserComfirm() {
        // The params was set hasAnythingToSave.
        return !$dialog.params || window.confirm(confirmDiscardChangeMessage);
      },
          $buttonUrl = new OpenButton('url'),
          $buttonLocal = new OpenButton('local'),
          $content = $('<div>').append(new RowDiv().append(new RowLabel(label.URL), $('<input type="text" class="textae-editor__load-dialog__file-name url" />'), $buttonUrl)).on('input', '[type="text"].url', function () {
        _jQuerySugar2['default'].enabled($buttonUrl, this.value);
      }).on('click', '[type="button"].url', function () {
        if (isUserComfirm()) {
          getAnnotationFromServer(_jQuerySugar2['default'].getValueFromText($content, 'url'));
        }

        $content.trigger('dialog.close');
      }).append(new RowDiv().append(new RowLabel(label.LOCAL), $('<input class="textae-editor__load-dialog__file" type="file" />'), $buttonLocal)).on('change', '[type="file"]', function () {
        _jQuerySugar2['default'].enabled($buttonLocal, this.files.length > 0);
      }).on('click', '[type="button"].local', function () {
        if (isUserComfirm()) {
          getAnnotationFromFile($content.find('[type="file"]')[0]);
        }

        $content.trigger('dialog.close');
      });

      // Capture the local variable by inner funcitons.
      var $dialog = getDialog('textae.dialog.load', 'Load Annotations', $content);

      return $dialog;
    },
        getSaveDialog = function getSaveDialog(editorId) {
      var showSaveSuccess = function showSaveSuccess() {
        api.emit('save');
        cursorChanger.endWait();
      },
          showSaveError = function showSaveError() {
        api.emit('save error');
        cursorChanger.endWait();
      },
          saveAnnotationToServer = function saveAnnotationToServer(url, jsonData) {
        cursorChanger.startWait();
        ajaxAccessor.post(url, jsonData, showSaveSuccess, showSaveError, function () {
          cursorChanger.endWait();
        });
      },
          createDownloadPath = function createDownloadPath(contents) {
        var blob = new Blob([contents], {
          type: 'application/json'
        });
        return URL.createObjectURL(blob);
      },
          getFilename = function getFilename() {
        var $fileInput = getLoadDialog(editorId).find("input[type='file']"),
            file = $fileInput.prop('files')[0];

        return file ? file.name : 'annotations.json';
      },
          RowDiv = _.partial(_jQuerySugar2['default'].Div, 'textae-editor__save-dialog__row'),
          RowLabel = _.partial(_jQuerySugar2['default'].Label, 'textae-editor__save-dialog__label'),
          $saveButton = new _jQuerySugar2['default'].Button('Save', 'url'),
          $content = $('<div>').append(new RowDiv().append(new RowLabel(label.URL), $('<input type="text" class="textae-editor__save-dialog__server-file-name url" />'), $saveButton)).on('input', 'input.url', function () {
        _jQuerySugar2['default'].enabled($saveButton, this.value);
      }).on('click', '[type="button"].url', function () {
        saveAnnotationToServer(_jQuerySugar2['default'].getValueFromText($content, 'url'), $dialog.params);
        $content.trigger('dialog.close');
      }).append(new RowDiv().append(new RowLabel(label.LOCAL), $('<input type="text" class="textae-editor__save-dialog__local-file-name local">'), $('<a class="download" href="#">Download</a>'))).on('click', 'a.download', function () {
        var downloadPath = createDownloadPath($dialog.params);
        $(this).attr('href', downloadPath).attr('download', _jQuerySugar2['default'].getValueFromText($content, 'local'));
        api.emit('save');
        $content.trigger('dialog.close');
      }).append(new RowDiv().append(new RowLabel(), $('<a class="viewsource" href="#">Click to see the json source in a new window.</a>'))).on('click', 'a.viewsource', function (e) {
        var downloadPath = createDownloadPath($dialog.params);
        window.open(downloadPath, '_blank');
        api.emit('save');
        $content.trigger('dialog.close');
        return false;
      });

      var $dialog = getDialog('textae.dialog.save', 'Save Annotations', $content);

      // Set the filename when the dialog is opened.
      $dialog.on('dialogopen', function () {
        var filename = getFilename();
        $dialog.find('[type="text"].local').val(filename);
      });

      return $dialog;
    };

    return {
      showLoad: function showLoad(editorId, hasAnythingToSave) {
        getLoadDialog(editorId).openAndSetParam(hasAnythingToSave);
      },
      showSave: function showSave(editorId, jsonData) {
        getSaveDialog(editorId).openAndSetParam(jsonData);
      }
    };
  })();

  var api = _.extend(new _events.EventEmitter(), {
    getAnnotationFromServer: getAnnotationFromServer,
    showAccess: _.partial(loadSaveDialog.showLoad, editor.editorId),
    showSave: _.partial(loadSaveDialog.showSave, editor.editorId)
  });

  return api;
};

},{"../util/CursorChanger":370,"../util/ajaxAccessor":371,"./dialog/GetEditorDialog":178,"./jQuerySugar":182,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/interop-require-wildcard":18,"events":108,"url":115}],164:[function(require,module,exports){
'use strict';

var ToolDialog = require('./dialog/GetToolDialog');

module.exports = function () {
  var helpDialog = new ToolDialog('textae-control__help', 'Help (Keyboard short-cuts)', {
    height: 313,
    width: 523
  }, $('<div>').addClass('textae-tool__key-help'));

  return helpDialog.open;
};

},{"./dialog/GetToolDialog":179}],165:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (selectType, selectDefaultType) {
  var $pallet = $('<div>').addClass("textae-editor__type-pallet").append($('<table>')).css('position', 'fixed');

  $pallet.on('click', '.textae-editor__type-pallet__entity-type__label', function () {
    $pallet.hide();
    selectType($(this).attr('label'));
  }).on('change', '.textae-editor__type-pallet__entity-type__radio', function () {
    $pallet.hide();
    selectDefaultType($(this).attr('label'));
  }).hide();

  return $pallet;
};

module.exports = exports['default'];

},{}],166:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var html = '\n{{#each this}}\n<tr class="textae-editor__type-pallet__entity-type" style="background-color: {{color}};">\n  <td>\n    <input class="textae-editor__type-pallet__entity-type__radio" type="radio" name="etype" label="{{typeName}}" {{#if defaultType}}title="default type" checked="checked"{{/if}}>\n  </td>\n  <td class="textae-editor__type-pallet__entity-type__label" label="{{typeName}}">\n    {{typeName}}\n  </td>\n  <td>\n    {{#if uri}}\n    <a href="{{uri}}" target="_blank"><span class="textae-editor__type-pallet__link"></span></a>\n    {{/if}}\n  </td>\n</tr>\n{{/each}}\n';

var tepmlate = _handlebars2['default'].compile(html);

exports['default'] = function (typeContainer) {
  var types = typeContainer.getSortedNames().map(function (typeName) {
    return {
      typeName: typeName,
      defaultType: typeName === typeContainer.getDefaultType(),
      uri: typeContainer.getUri(typeName),
      color: typeContainer.getColor(typeName)
    };
  });

  return $(tepmlate(types));
};

module.exports = exports['default'];

},{"babel-runtime/helpers/interop-require-default":17,"handlebars":145}],167:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _Row = require('./Row');

var _Row2 = _interopRequireDefault(_Row);

exports['default'] = function (selectType, selectDefaultType) {
  var $pallet = new _Component2['default'](selectType, selectDefaultType);

  return {
    show: (function (_show) {
      function show(_x, _x2) {
        return _show.apply(this, arguments);
      }

      show.toString = function () {
        return _show.toString();
      };

      return show;
    })(function (typeContainer, point) {
      return show($pallet, typeContainer, point);
    }),
    hide: function hide() {
      return $pallet.hide();
    }
  };
};

function show($pallet, typeContainer, point) {
  if (typeContainer && typeContainer.getSortedNames().length > 0) {
    $pallet = reuseOldPallet($pallet);
    $pallet = appendRows(typeContainer, $pallet);
    $pallet = setMaxHeight($pallet);

    // Move the pallet to mouse.
    $pallet.css(point).show();
  }
}

function reuseOldPallet($pallet) {
  var $oldPallet = $('.textae-editor__type-pallet');

  if ($oldPallet.length !== 0) {
    return $oldPallet.find('table').empty().end().css('width', 'auto');
  } else {
    // Append the pallet to body to show on top.
    $("body").append($pallet);
    return $pallet;
  }
}

function appendRows(typeContainer, $pallet) {
  return $pallet.find("table").append(new _Row2['default'](typeContainer)).end();
}

function setMaxHeight($pallet) {
  // Show the scrollbar-y if the height of the pallet is same witch max-height.
  if ($pallet.outerHeight() + 'px' === $pallet.css('max-height')) {
    return $pallet.css('overflow-y', 'scroll');
  } else {
    return $pallet.css('overflow-y', '');
  }
}
module.exports = exports['default'];

},{"./Component":165,"./Row":166,"babel-runtime/helpers/interop-require-default":17}],168:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _editorViewLineHeight = require('../../editor/View/lineHeight');

var lineHeight = _interopRequireWildcard(_editorViewLineHeight);

var _updateLineHeight = require('./updateLineHeight');

var _updateLineHeight2 = _interopRequireDefault(_updateLineHeight);

var _updateTypeGapEnable = require('./updateTypeGapEnable');

var _updateTypeGapEnable2 = _interopRequireDefault(_updateTypeGapEnable);

var _updateTypeGapValue = require('./updateTypeGapValue');

var _updateTypeGapValue2 = _interopRequireDefault(_updateTypeGapValue);

var CONTENT = '\n    <div class="textae-editor__setting-dialog">\n        <div>\n            <label class="textae-editor__setting-dialog__label">Type Gap</label>\n            <input type="number" class="textae-editor__setting-dialog__type-gap type-gap" step="1" min="0" max="5">\n        </div>\n        <div>\n            <label class="textae-editor__setting-dialog__label">Line Height</label>\n            <input type="number" class="textae-editor__setting-dialog__line-height line-height" step="1" min="50" max="500">\n            px\n        </div>\n    </div>\n';

exports['default'] = function (editor, displayInstance) {
    var $content = $(CONTENT);

    bind($content, editor, displayInstance);

    return $content;
};

function bind($content, editor, displayInstance) {
    bindChangeTypeGap($content, editor, displayInstance);

    bindChangeLineHeight($content, editor);
}

function bindChangeTypeGap($content, editor, displayInstance) {
    var onTypeGapChange = debounce300(function (e) {
        displayInstance.changeTypeGap(e.target.value);
        (0, _updateLineHeight2['default'])(editor, $content);
    });

    return $content.on('change', '.type-gap', onTypeGapChange);
}

function bindChangeLineHeight($content, editor) {
    var onLineHeightChange = debounce300(function (e) {
        lineHeight.set(editor[0], e.target.value);
        redrawAllEditor();
    });

    return $content.on('change', '.line-height', onLineHeightChange);
}

// Redraw all editors in tha windows.
function redrawAllEditor() {
    $(window).trigger('resize');
}

function debounce300(func) {
    return _.debounce(func, 300);
}

function sixteenTimes(val) {
    return val * 16;
}
module.exports = exports['default'];

},{"../../editor/View/lineHeight":348,"./updateLineHeight":171,"./updateTypeGapEnable":172,"./updateTypeGapValue":173,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/interop-require-wildcard":18}],169:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _dialogGetEditorDialog = require('../dialog/GetEditorDialog');

var _dialogGetEditorDialog2 = _interopRequireDefault(_dialogGetEditorDialog);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _update = require('./update');

var _update2 = _interopRequireDefault(_update);

exports['default'] = function (editor, displayInstance) {
  // Update values after creating a dialog because the dialog is re-used.
  var $content = (0, _create2['default'])(editor, displayInstance),
      $dialog = appendToDialog($content, editor);

  return function () {
    (0, _update2['default'])($dialog, editor, displayInstance);
    return $dialog.open();
  };
};

function appendToDialog($content, editor) {
  return new _dialogGetEditorDialog2['default'](editor)('textae.dialog.setting', 'Setting', $content, {
    noCancelButton: true
  });
}
module.exports = exports['default'];

},{"../dialog/GetEditorDialog":178,"./create":168,"./update":170,"babel-runtime/helpers/interop-require-default":17}],170:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _jQuerySugar = require('../jQuerySugar');

var _jQuerySugar2 = _interopRequireDefault(_jQuerySugar);

var _updateLineHeight = require('./updateLineHeight');

var _updateLineHeight2 = _interopRequireDefault(_updateLineHeight);

var _updateTypeGapEnable = require('./updateTypeGapEnable');

var _updateTypeGapEnable2 = _interopRequireDefault(_updateTypeGapEnable);

var _updateTypeGapValue = require('./updateTypeGapValue');

var _updateTypeGapValue2 = _interopRequireDefault(_updateTypeGapValue);

exports['default'] = function ($dialog, editor, displayInstance) {
    (0, _updateTypeGapEnable2['default'])(displayInstance, $dialog);
    (0, _updateTypeGapValue2['default'])(displayInstance, $dialog);
    (0, _updateLineHeight2['default'])(editor, $dialog);
};

module.exports = exports['default'];

},{"../jQuerySugar":182,"./updateLineHeight":171,"./updateTypeGapEnable":172,"./updateTypeGapValue":173,"babel-runtime/helpers/interop-require-default":17}],171:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _editorViewLineHeight = require('../../editor/View/lineHeight');

var lineHeight = _interopRequireWildcard(_editorViewLineHeight);

var _jQuerySugar = require('../jQuerySugar');

var _jQuerySugar2 = _interopRequireDefault(_jQuerySugar);

exports['default'] = function (editor, $dialog) {
  return _jQuerySugar2['default'].setValue($dialog, '.line-height', lineHeight.get(editor[0]));
};

module.exports = exports['default'];

},{"../../editor/View/lineHeight":348,"../jQuerySugar":182,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/interop-require-wildcard":18}],172:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _jQuerySugar = require('../jQuerySugar');

var _jQuerySugar2 = _interopRequireDefault(_jQuerySugar);

exports['default'] = function (displayInstance, $dialog) {
  _jQuerySugar2['default'].enabled(toTypeGap($dialog), displayInstance.showInstance());
  return $dialog;
};

function toTypeGap($content) {
  return $content.find('.type-gap');
}
module.exports = exports['default'];

},{"../jQuerySugar":182,"babel-runtime/helpers/interop-require-default":17}],173:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _jQuerySugar = require('../jQuerySugar');

var _jQuerySugar2 = _interopRequireDefault(_jQuerySugar);

exports['default'] = function (displayInstance, $dialog) {
  return _jQuerySugar2['default'].setValue($dialog, '.type-gap', displayInstance.getTypeGap);
};

module.exports = exports['default'];

},{"../jQuerySugar":182,"babel-runtime/helpers/interop-require-default":17}],174:[function(require,module,exports){
'use strict';

var getAreaIn = function getAreaIn($parent) {
  var $area = $parent.find('.textae-editor__footer .textae-editor__footer__message');
  if ($area.length === 0) {
    $area = $('<div>').addClass('textae-editor__footer__message');
    var $footer = $('<div>').addClass('textae-editor__footer').append($area);
    $parent.append($footer);
  }

  return $area;
};

module.exports = function (editor) {
  var getAreaInEditor = _.partial(getAreaIn, editor),
      status = function status(message) {
    if (message !== '') getAreaInEditor().html('Source: ' + message);
  };

  return {
    status: status
  };
};

},{}],175:[function(require,module,exports){
'use strict';

var Dialog = function Dialog(id, title, $content) {
  return $('<div>').attr('id', id).attr('title', title).hide().append($content);
},
    OpenCloseMixin = function OpenCloseMixin($dialog, openOption) {
  return {
    open: function open() {
      $dialog.dialog(openOption);
    },
    close: function close() {
      $dialog.dialog('close');
    }
  };
},
    extendDialog = function extendDialog(openOption, $dialog) {
  return _.extend($dialog, new OpenCloseMixin($dialog, openOption));
},
    appendDialog = function appendDialog($dialog) {
  $('body').append($dialog);
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

},{}],176:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _Dialog = require('./Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var getDialogId = function getDialogId(editorId, id) {
  return editorId + '.' + id;
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
      Cancel: function Cancel() {
        $(this).dialog('close');
      }
    };
  }

  var $dialog = new _Dialog2['default'](openOption, getDialogId(editorId, id), title, $content);

  return _.extend($dialog, {
    id: id
  });
};

},{"./Dialog":175,"babel-runtime/helpers/interop-require-default":17}],177:[function(require,module,exports){
"use strict";

var _toConsumableArray = require("babel-runtime/helpers/to-consumable-array")["default"];

var getFromContainer = function getFromContainer(container, id) {
  return container[id];
},
    addToContainer = function addToContainer(container, id, object) {
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
      createAndCache = function createAndCache(createFunction, params) {
    var object = createFunction.apply(undefined, _toConsumableArray(params));
    return addCache(object.id, object);
  };

  return function (id, title, $content, options) {
    return serachCache(id) || createAndCache(createFunction, arguments);
  };
};

},{"babel-runtime/helpers/to-consumable-array":20}],178:[function(require,module,exports){
'use strict';

var EditorDialog = require('./EditorDialog'),
    FunctionUseCache = require('./FunctionUseCache');

// Cache instances per editor.
module.exports = function (editor) {
  editor.getDialog = editor.getDialog || new FunctionUseCache(_.partial(EditorDialog, editor.editorId));
  return editor.getDialog;
};

},{"./EditorDialog":176,"./FunctionUseCache":177}],179:[function(require,module,exports){
'use strict';

var ToolDialog = require('./ToolDialog'),
    FunctionUseCache = require('./FunctionUseCache');

module.exports = new FunctionUseCache(ToolDialog);

},{"./FunctionUseCache":177,"./ToolDialog":180}],180:[function(require,module,exports){
'use strict';

var Dialog = require('./Dialog');

module.exports = function (id, title, size, $content) {
  var $dialog = new Dialog(size, id, title, $content);

  return _.extend($dialog, {
    id: id
  });
};

},{"./Dialog":175}],181:[function(require,module,exports){
'use strict';

module.exports = function ($target, enable) {
  if (enable) {
    $target.removeAttr('disabled');
  } else {
    $target.attr('disabled', 'disabled');
  }
};

},{}],182:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _jQueryEnabled = require('./jQueryEnabled');

var _jQueryEnabled2 = _interopRequireDefault(_jQueryEnabled);

var setProp = function setProp(key, $target, className, value) {
  var valueObject = {};

  valueObject[key] = value;
  return $target.find(className).prop(valueObject).end();
};

module.exports = {
  enabled: _jQueryEnabled2['default'],
  Div: function Div(className) {
    return $('<div>').addClass(className);
  },
  Label: function Label(className, text) {
    return $('<label>').addClass(className).text(text);
  },
  Button: function Button(label, className) {
    return $('<input type="button" disabled="disabled" />').addClass(className).val(label);
  },
  Checkbox: function Checkbox(className) {
    return $('<input type="checkbox"/>').addClass(className);
  },
  Number: function Number(className) {
    return $('<input type="number"/>').addClass(className);
  },
  toLink: function toLink(url) {
    return '<a href="' + url + '">' + url + '</a>';
  },
  getValueFromText: function getValueFromText($target, className) {
    return $target.find('[type="text"].' + className).val();
  },
  setChecked: _.partial(setProp, 'checked'),
  setValue: _.partial(setProp, 'value')
};

},{"./jQueryEnabled":181,"babel-runtime/helpers/interop-require-default":17}],183:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _editorModelAnnotationDataParseAnnotationValidateAnnotation = require('../editor/Model/AnnotationData/parseAnnotation/validateAnnotation');

var _dialogGetEditorDialog = require('./dialog/GetEditorDialog');

var _dialogGetEditorDialog2 = _interopRequireDefault(_dialogGetEditorDialog);

var source = '\n    <div class="textae-editor__valiondate-dialog__content">\n        <h2>{{name}}</h2>\n        {{#if denotationHasLength}}\n            <table>\n                <caption>Wrong range.</caption>\n                <thead>\n                    <tr>\n                        <th class="id">id</th>\n                        <th class="range">begin</th>\n                        <th class="range">end</th>\n                        <th>obj</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    {{#denotationHasLength}}\n                    <tr>\n                        <td>{{id}}</td>\n                        <td class="alert">{{span.begin}}</td>\n                        <td class="alert">{{span.end}}</td>\n                        <td>{{obj}}</td>\n                    </tr>\n                    {{/denotationHasLength}}\n                </tbody>\n            </table>\n        {{/if}}\n        {{#if denotationInText}}\n            <table>\n                <caption>Out of text.</caption>\n                <thead>\n                    <tr>\n                        <th class="id">id</th>\n                        <th class="range">begin</th>\n                        <th class="range">end</th>\n                        <th>obj</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    {{#denotationInText}}\n                    <tr>\n                        <td>{{id}}</td>\n                        <td class="alert">{{span.begin}}</td>\n                        <td class="alert">{{span.end}}</td>\n                        <td>{{obj}}</td>\n                    </tr>\n                    {{/denotationInText}}\n                </tbody>\n            </table>\n        {{/if}}\n        {{#if denotationIsNotCrossing}}\n            <table>\n                <caption>Spans with boundary-cross.</caption>\n                <thead>\n                    <tr>\n                        <th class="id">id</th>\n                        <th class="range">begin</th>\n                        <th class="range">end</th>\n                        <th>obj</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    {{#denotationIsNotCrossing}}\n                    <tr>\n                        <td>{{id}}</td>\n                        <td class="alert">{{span.begin}}</td>\n                        <td class="alert">{{span.end}}</td>\n                        <td>{{obj}}</td>\n                    </tr>\n                    {{/denotationIsNotCrossing}}\n                </tbody>\n            </table>\n        {{/if}}\n        {{#if denotationInParagraph}}\n            <table>\n                <caption>Spans across paragraphs (newline-delimited).</caption>\n                <thead>\n                    <tr>\n                        <th class="id">id</th>\n                        <th class="range">begin</th>\n                        <th class="range">end</th>\n                        <th>obj</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    {{#denotationInParagraph}}\n                    <tr>\n                        <td>{{id}}</td>\n                        <td class="alert">{{span.begin}}</td>\n                        <td class="alert">{{span.end}}</td>\n                        <td>{{obj}}</td>\n                    </tr>\n                    {{/denotationInParagraph}}\n                </tbody>\n            </table>\n        {{/if}}\n        {{#if referencedItems}}\n            <table>\n                <caption>Referenced items do not exist.</caption>\n                <thead>\n                    <tr>\n                        <th class="id">id</th>\n                        <th class="referencedItem">subj</th>\n                        <th>pred</th>\n                        <th class="referencedItem">obj</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    {{#referencedItems}}\n                    <tr>\n                        <td>{{id}}</td>\n                        <td{{#if alertSubj}} class="alert"{{/if}}>{{subj}}</td>\n                        <td>{{pred}}</td>\n                        <td{{#if alertObj}} class="alert"{{/if}}>{{obj}}</td>\n                    </tr>\n                    {{/referencedItems}}\n                </tbody>\n            </table>\n        {{/if}}\n    </div>',
    mergeMessage = '\n        <div class="textae-editor__valiondate-dialog__content">\n            <h1>Track annatations will be merged to the root anntations.</h1>\n        </div>';

var tepmlate = _handlebars2['default'].compile(source);

exports['default'] = function (editor, rejects) {
    if (!(0, _editorModelAnnotationDataParseAnnotationValidateAnnotation.hasError)(rejects)) return;

    var $dialog = new _dialogGetEditorDialog2['default'](editor)('textae.dialog.validation', 'The following erroneous annotations ignored', $('<div>'), {
        noCancelButton: true,
        height: 450
    });

    updateContent($dialog[0].firstChild, rejects);
    $dialog.open();
};

function updateContent(content, rejects) {
    content.innerHTML = '';

    rejects.map(transformToReferenceObjectError).map(tepmlate).forEach(function (html, index) {
        if (index === 1) {
            content.insertAdjacentHTML('beforeend', mergeMessage);
        }

        content.insertAdjacentHTML('beforeend', html);
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
        modification.subj = '-';
        modification.alertObj = true;
        return modification;
    }));

    return reject;
}
module.exports = exports['default'];

},{"../editor/Model/AnnotationData/parseAnnotation/validateAnnotation":218,"./dialog/GetEditorDialog":178,"babel-runtime/helpers/interop-require-default":17,"handlebars":145}],184:[function(require,module,exports){
module.exports={
    "buttonGroup": [{
        "list": [{
            "type": "read",
            "title": "Import [I]"
        }, {
            "type": "write",
            "title": "Upload [U]"
        }]
    }, {
        "list": [{
            "type": "view",
            "title": "View Mode"
        }, {
            "type": "term",
            "title": "Term Edit Mode"
        }, {
            "type": "relation",
            "title": "Relation Edit Mode"
        }]
    }, {
        "list": [{
            "type": "simple",
            "title": "Simple View"
        }, {
            "type": "line-height",
            "title": "Adjust LineHeight"
        }]
    }, {
        "list": [{
            "type": "undo",
            "title": "Undo [Z]"
        }, {
            "type": "redo",
            "title": "Redo [A]"
        }]
    }, {
        "list": [{
            "type": "replicate",
            "title": "Replicate span annotation [R]"
        }, {
            "type": "replicate-auto",
            "title": "Auto replicate"
        }, {
            "type": "boundary-detection",
            "title": "Boundary Detection [B]"
        }]
    }, {
        "list": [{
            "type": "entity",
            "title": "New entity [E]"
        }, {
            "type": "pallet",
            "title": "Select label [Q]"
        }, {
            "type": "change-label",
            "title": "Change label [W]"
        }]
    }, {
        "list": [{
            "type": "negation",
            "title": "Negation [X]"
        }, {
            "type": "speculation",
            "title": "Speculation [S]"
        }]
    }, {
        "list": [{
            "type": "delete",
            "title": "Delete [D]"
        }, {
            "type": "copy",
            "title": "Copy [C]"
        }, {
            "type": "paste",
            "title": "Paste [V]"
        }]
    }, {
        "list": [{
            "type": "setting",
            "title": "Setting"
        }]
    }, {
        "list": [{
            "type": "help",
            "title": "Help [H]"
        }]
    }]
}

},{}],185:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.enable = enable;
exports.disable = disable;
exports.push = push;
exports.unpush = unpush;

var _toButtonClass = require('./toButtonClass');

var _toButtonClass2 = _interopRequireDefault(_toButtonClass);

// Utility functions to change appearance of bunttons.

function enable($control, buttonType) {
  find($control, buttonType).removeClass('textae-control__icon--disabled');
}

function disable($control, buttonType) {
  find($control, buttonType).addClass('textae-control__icon--disabled');
}

function push($control, buttonType) {
  find($control, buttonType).addClass('textae-control__icon--pushed');
}

function unpush($control, buttonType) {
  find($control, buttonType).removeClass('textae-control__icon--pushed');
}

function find($control, buttonType) {
  return $control.find((0, _toButtonClass2['default'])(buttonType));
}

},{"./toButtonClass":188,"babel-runtime/helpers/interop-require-default":17}],186:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _buttonMap = require('./buttonMap');

var _buttonMap2 = _interopRequireDefault(_buttonMap);

var _makeButtons = require('./makeButtons');

var _makeButtons2 = _interopRequireDefault(_makeButtons);

var _toButtonList = require('./toButtonList');

var _toButtonList2 = _interopRequireDefault(_toButtonList);

var _iconCssUtil = require('./iconCssUtil');

var cssUtil = _interopRequireWildcard(_iconCssUtil);

var _updateButtons = require('./updateButtons');

var _updateButtons2 = _interopRequireDefault(_updateButtons);

// Buttons that always eanable.
var ALWAYS_ENABLES = {
  read: true,
  help: true
};

// The control is a control bar to edit.
// This can controls mulitple instance of editor.

exports['default'] = function ($control) {
  var buttonList = (0, _toButtonList2['default'])(_buttonMap2['default']);

  (0, _makeButtons2['default'])($control, _buttonMap2['default']);

  // Public API
  $control.updateAllButtonEnableState = function (enableButtons) {
    return updateAllButtonEnableState($control, buttonList, enableButtons);
  };
  $control.updateButtonPushState = function (buttonType, isPushed) {
    return updateButtonPushState($control, buttonType, isPushed);
  };

  return $control;
};

function updateAllButtonEnableState($control, buttonList, enableButtons) {
  // Make buttons in a enableButtons enabled, and other buttons in the buttonList disabled.
  var enables = _.extend({}, buttonList, ALWAYS_ENABLES, enableButtons);

  // A function to enable/disable button.
  (0, _updateButtons2['default'])($control, buttonList, enables);
}

function updateButtonPushState($control, buttonType, isPushed) {
  if (isPushed) {
    cssUtil.push($control, buttonType);
  } else {
    cssUtil.unpush($control, buttonType);
  }
}
module.exports = exports['default'];

},{"./buttonMap":184,"./iconCssUtil":185,"./makeButtons":187,"./toButtonList":189,"./updateButtons":190,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/interop-require-wildcard":18}],187:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

// Make a group of buttons that is headed by the separator.
var source = '\n    <span class="textae-control__title">\n        <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>\n    </span>\n    {{#buttonGroup}}\n    <span class="textae-control__separator"></span>\n        {{#list}}\n    <span class="textae-control__icon textae-control__{{type}}-button" title="{{title}}"></span>\n        {{/list}}\n    {{/buttonGroup}}\n    ';

var tepmlate = _handlebars2['default'].compile(source);

exports['default'] = function ($control, buttonMap) {
    $control[0].innerHTML = tepmlate(buttonMap);
};

module.exports = exports['default'];

},{"babel-runtime/helpers/interop-require-default":17,"handlebars":145}],188:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (buttonType) {
  return ".textae-control__" + buttonType + "-button";
};

module.exports = exports["default"];

},{}],189:[function(require,module,exports){
// Return {read: 1, write: 1, undo: 1, redo: 1, replicate: 1…}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (buttonMap) {
  return buttonMap.buttonGroup.reduce(function (hash, group) {
    return group.list.reduce(function (hash, button) {
      // Trick for merge outer parametr to enable or disable buttons
      hash[button.type] = 1;
      return hash;
    }, hash);
  }, {});
};

module.exports = exports["default"];

},{}],190:[function(require,module,exports){
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _iconCssUtil = require('./iconCssUtil');

var cssUtil = _interopRequireWildcard(_iconCssUtil);

var _toButtonClass = require('./toButtonClass');

var _toButtonClass2 = _interopRequireDefault(_toButtonClass);

var EVENT = 'click';

// A parameter can be spesified by object like { 'buttonType1': true, 'buttonType2': false }.

exports['default'] = function ($control, buttonList, buttonEnables) {
  _Object$keys(buttonEnables).filter(function (buttonType) {
    return buttonList[buttonType];
  }).forEach(function (buttonType) {
    return setButtonApearanceAndEventHandler($control, buttonType, buttonEnables[buttonType]);
  });
};

function enableButton($control, buttonType) {
  var eventHandler = function eventHandler() {
    $control.trigger('textae.control.button.click', 'textae.control.button.' + buttonType.replace(/-/g, '_') + '.click');
    return false;
  };

  $control.off(EVENT, (0, _toButtonClass2['default'])(buttonType)).on(EVENT, (0, _toButtonClass2['default'])(buttonType), eventHandler);

  cssUtil.enable($control, buttonType);
}

function disableButton($control, buttonType) {
  $control.off(EVENT, (0, _toButtonClass2['default'])(buttonType));

  cssUtil.disable($control, buttonType);
}

function setButtonApearanceAndEventHandler($control, buttonType, enable) {
  // Set apearance and eventHandler to button.
  if (enable === true) {
    enableButton($control, buttonType);
  } else {
    disableButton($control, buttonType);
  }
}
module.exports = exports['default'];

},{"./iconCssUtil":185,"./toButtonClass":188,"babel-runtime/core-js/object/keys":9,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/interop-require-wildcard":18}],191:[function(require,module,exports){
'use strict';

var _Map = require('babel-runtime/core-js/map')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (command, presenter, dataAccessObject, history, annotationData, buttonController, view, updateLineHeight) {
  var keyApiMap = new KeyApiMap(command, presenter, dataAccessObject, history, annotationData),
      iconApiMap = new IconApiMap(command, presenter, dataAccessObject, history, annotationData, buttonController, updateLineHeight);

  // Update APIs
  return {
    handleKeyInput: function handleKeyInput(key, value) {
      return handle(keyApiMap, key, value);
    },
    handleButtonClick: function handleButtonClick(key, value) {
      return handle(iconApiMap, key, value);
    },
    redraw: function redraw() {
      return view.updateDisplay();
    }
  };
};

function handle(map, key, value) {
  if (map.has(key)) map.get(key)(value);
}

function KeyApiMap(command, presenter, dataAccessObject, history, annotationData) {
  var showAccess = function showAccess() {
    return dataAccessObject.showAccess(history.hasAnythingToSave());
  },
      showSave = function showSave() {
    return dataAccessObject.showSave(annotationData.toJson());
  };

  return new _Map([['A', command.redo], ['B', presenter.event.toggleDetectBoundaryMode], ['C', presenter.event.copyEntities], ['D', presenter.event.removeSelectedElements], ['DEL', presenter.event.removeSelectedElements], ['E', presenter.event.createEntity], ['F', presenter.event.toggleInstaceRelation], ['I', showAccess], ['M', presenter.event.toggleInstaceRelation], ['Q', presenter.event.showPallet], ['R', presenter.event.replicate], ['S', presenter.event.speculation], ['U', showSave], ['V', presenter.event.pasteEntities], ['W', presenter.event.changeLabel], ['X', presenter.event.negation], ['Y', command.redo], ['Z', command.undo], ['ESC', presenter.event.cancelSelect], ['LEFT', presenter.event.selectLeft], ['RIGHT', presenter.event.selectRight], ['UP', presenter.event.selectUp], ['DOWN', presenter.event.selectDown]]);
}

function IconApiMap(command, presenter, dataAccessObject, history, annotationData, buttonController, updateLineHeight) {
  var showAccess = function showAccess() {
    return dataAccessObject.showAccess(history.hasAnythingToSave());
  },
      showSave = function showSave() {
    return dataAccessObject.showSave(annotationData.toJson());
  };

  return new _Map([['textae.control.button.view.click', presenter.event.toViewMode], ['textae.control.button.term.click', presenter.event.toTermMode], ['textae.control.button.relation.click', presenter.event.toRelationMode], ['textae.control.button.simple.click', presenter.event.toggleSimpleMode], ['textae.control.button.read.click', showAccess], ['textae.control.button.write.click', showSave], ['textae.control.button.undo.click', command.undo], ['textae.control.button.redo.click', command.redo], ['textae.control.button.replicate.click', presenter.event.replicate], ['textae.control.button.replicate_auto.click', buttonController.modeAccordingToButton['replicate-auto'].toggle], ['textae.control.button.boundary_detection.click', presenter.event.toggleDetectBoundaryMode], ['textae.control.button.entity.click', presenter.event.createEntity], ['textae.control.button.change_label.click', presenter.event.changeLabel], ['textae.control.button.pallet.click', presenter.event.showPallet], ['textae.control.button.negation.click', presenter.event.negation], ['textae.control.button.speculation.click', presenter.event.speculation], ['textae.control.button.delete.click', presenter.event.removeSelectedElements], ['textae.control.button.copy.click', presenter.event.copyEntities], ['textae.control.button.paste.click', presenter.event.pasteEntities], ['textae.control.button.setting.click', presenter.event.showSettingDialog], ['textae.control.button.line_height.click', updateLineHeight]]);
}
module.exports = exports['default'];

},{"babel-runtime/core-js/map":4}],192:[function(require,module,exports){
'use strict';

module.exports = function (message, object) {
  // For debug
  if (object) {
    console.log('[command.invoke]', message, object);
  } else {
    console.log('[command.invoke]', message);
  }
};

},{}],193:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _commandLog = require('./commandLog');

var _commandLog2 = _interopRequireDefault(_commandLog);

var Command = (function () {
  function Command(execute) {
    _classCallCheck(this, Command);

    this.execute = execute;
  }

  _createClass(Command, [{
    key: 'execute',
    value: function execute() {}
  }, {
    key: 'revert',
    value: function revert() {}
  }]);

  return Command;
})();

var CreateCommand = (function (_Command) {
  _inherits(CreateCommand, _Command);

  function CreateCommand(model, modelType, isSelectable, newModel) {
    _classCallCheck(this, CreateCommand);

    _get(Object.getPrototypeOf(CreateCommand.prototype), 'constructor', this).call(this, function () {
      newModel = model.annotationData[modelType].add(newModel);

      if (isSelectable) selectNewModel(model.selectionModel, modelType, newModel);

      // Set revert
      this.revert = function () {
        return new RemoveCommand(model, modelType, newModel.id);
      };

      (0, _commandLog2['default'])('create a new ' + modelType + ': ', newModel);

      return newModel;
    });
  }

  return CreateCommand;
})(Command);

var RemoveCommand = (function (_Command2) {
  _inherits(RemoveCommand, _Command2);

  function RemoveCommand(model, modelType, id) {
    _classCallCheck(this, RemoveCommand);

    _get(Object.getPrototypeOf(RemoveCommand.prototype), 'constructor', this).call(this, function () {
      // Update model
      var oloModel = model.annotationData[modelType].remove(id);

      if (oloModel) {
        // Set revert
        this.revert = function () {
          return new CreateCommand(model, modelType, false, oloModel);
        };

        (0, _commandLog2['default'])('remove a ' + modelType + ': ', oloModel);
      } else {
        // Do not revert unless an object was removed.
        this.revert = function () {
          return {
            execute: function execute() {}
          };
        };
        (0, _commandLog2['default'])('already removed ' + modelType + ': ', id);
      }
    });
  }

  return RemoveCommand;
})(Command);

var ChangeTypeCommand = (function (_Command3) {
  _inherits(ChangeTypeCommand, _Command3);

  function ChangeTypeCommand(model, modelType, id, newType) {
    _classCallCheck(this, ChangeTypeCommand);

    _get(Object.getPrototypeOf(ChangeTypeCommand.prototype), 'constructor', this).call(this, function () {
      var oldType = model.annotationData[modelType].get(id).type;

      // Update model
      var targetModel = model.annotationData[modelType].changeType(id, newType);

      // Set revert
      this.revert = function () {
        return new ChangeTypeCommand(model, modelType, id, oldType);
      };

      (0, _commandLog2['default'])('change type of a ' + modelType + '. oldtype:' + oldType + ' ' + modelType + ':', targetModel);
    });
  }

  return ChangeTypeCommand;
})(Command);

var debugLog = _commandLog2['default'];

exports.debugLog = debugLog;
exports.CreateCommand = CreateCommand;
exports.RemoveCommand = RemoveCommand;
exports.ChangeTypeCommand = ChangeTypeCommand;

function selectNewModel(selectionModel, modelType, newModel) {
  if (selectionModel[modelType]) {
    selectionModel[modelType].add(newModel.id);
  }
}

},{"./commandLog":192,"babel-runtime/helpers/class-call-check":13,"babel-runtime/helpers/create-class":14,"babel-runtime/helpers/get":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/interop-require-default":17}],194:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _invokeCommand = require('./invokeCommand');

var _invokeCommand2 = _interopRequireDefault(_invokeCommand);

var _commandLog = require('./commandLog');

var _commandLog2 = _interopRequireDefault(_commandLog);

var setRevertAndLog = (function () {
  var log = function log(prefix, param) {
    (0, _commandLog2['default'])(prefix + param.commandType + ' a ' + param.modelType + ': ' + param.id);
  },
      doneLog = _.partial(log, ''),
      revertLog = _.partial(log, 'revert '),
      RevertFunction = function RevertFunction(subCommands, logParam) {
    var toRevert = function toRevert(command) {
      return command.revert();
    },
        execute = function execute(command) {
      command.execute();
    },
        revertedCommand = {
      execute: function execute() {
        _invokeCommand2['default'].invokeRevert(subCommands);
        revertLog(logParam);
      }
    };

    return function () {
      return revertedCommand;
    };
  },
      setRevert = function setRevert(modelType, command, commandType, id, subCommands) {
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
    executeCompositCommand = function executeCompositCommand(modelType, command, commandType, id, subCommands) {
  _invokeCommand2['default'].invoke(subCommands);
  setRevertAndLog(modelType, command, commandType, id, subCommands);
};

module.exports = executeCompositCommand;

},{"./commandLog":192,"./invokeCommand":197,"babel-runtime/helpers/interop-require-default":17}],195:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _not = require('not');

var _not2 = _interopRequireDefault(_not);

var _ModelIsAlreadySpaned = require('../Model/isAlreadySpaned');

var _ModelIsAlreadySpaned2 = _interopRequireDefault(_ModelIsAlreadySpaned);

var _ModelAnnotationDataParseAnnotationValidateAnnotation = require('../Model/AnnotationData/parseAnnotation/validateAnnotation');

// Check replications are word or not if spanConfig is set.

exports['default'] = function (dataStore, originSpan, detectBoundaryFunc) {
  var allSpans = dataStore.span.all(),
      wordFilter = detectBoundaryFunc ? _.partial(isWord, dataStore.sourceDoc, detectBoundaryFunc) : _.identity;

  return getSpansTheirStringIsSameWith(dataStore.sourceDoc, originSpan).filter(function (span) {
    return(
      // The candidateSpan is a same span when begin is same.
      // Because string of each others are same. End of them are same too.
      span.begin !== originSpan.begin
    );
  }).filter(wordFilter).filter((0, _not2['default'])(_.partial(_ModelIsAlreadySpaned2['default'], allSpans))).filter((0, _not2['default'])(_.partial(_ModelAnnotationDataParseAnnotationValidateAnnotation.isBoundaryCrossingWithOtherSpans, allSpans)));
};

// Get spans their stirng is same with the originSpan from sourceDoc.
function getSpansTheirStringIsSameWith(sourceDoc, originSpan) {
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
}

// The preceding charactor and the following of a word charactor are delimiter.
// For example, 't' ,a part of 'that', is not same with an origin span when it is 't'.
function isWord(sourceDoc, detectBoundaryFunc, candidateSpan) {
  var precedingChar = sourceDoc.charAt(candidateSpan.begin - 1),
      followingChar = sourceDoc.charAt(candidateSpan.end);

  return detectBoundaryFunc(precedingChar) && detectBoundaryFunc(followingChar);
}
module.exports = exports['default'];

},{"../Model/AnnotationData/parseAnnotation/validateAnnotation":218,"../Model/isAlreadySpaned":231,"babel-runtime/helpers/interop-require-default":17,"not":158}],196:[function(require,module,exports){
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _commandTemplate = require('./commandTemplate');

var invokeCommand = require('./invokeCommand'),
    executeCompositCommand = require('./executeCompositCommand'),
    getReplicationSpans = require('./getReplicationSpans'),
    idFactory = require('../idFactory');

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
module.exports = function (editor, model, history) {
  var spanCreateCommand = function spanCreateCommand(span) {
    return new _commandTemplate.CreateCommand(model, 'span', true, span);
  },
      entityCreateCommand = function entityCreateCommand(entity) {
    return new _commandTemplate.CreateCommand(model, 'entity', true, entity);
  },
      spanAndDefaultEntryCreateCommand = function spanAndDefaultEntryCreateCommand(type, span) {
    var id = idFactory.makeSpanId(editor, span),
        createSpan = spanCreateCommand(span),
        createEntity = entityCreateCommand({
      span: id,
      type: type
    }),
        subCommands = [createSpan, createEntity];

    return {
      execute: function execute() {
        executeCompositCommand('span', this, 'create', id, subCommands);
      }
    };
  },
      spanReplicateCommand = function spanReplicateCommand(type, span, detectBoundaryFunc) {
    var createSpan = _.partial(spanAndDefaultEntryCreateCommand, type),
        subCommands = getReplicationSpans(model.annotationData, span, detectBoundaryFunc).map(createSpan);

    return {
      execute: function execute() {
        executeCompositCommand('span', this, 'replicate', span.id, subCommands);
      }
    };
  },

  // The relaitonId is optional set only when revert of the relationRemoveCommand.
  // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
  relationCreateCommand = function relationCreateCommand(relation) {
    return new _commandTemplate.CreateCommand(model, 'relation', false, relation);
  },
      relationCreateAndSelectCommand = function relationCreateAndSelectCommand(relation) {
    return new _commandTemplate.CreateCommand(model, 'relation', true, relation);
  },
      modificationRemoveCommand = function modificationRemoveCommand(modification) {
    return new _commandTemplate.RemoveCommand(model, 'modification', modification);
  },
      relationRemoveCommand = function relationRemoveCommand(relation) {
    return new _commandTemplate.RemoveCommand(model, 'relation', relation);
  },
      relationAndAssociatesRemoveCommand = function relationAndAssociatesRemoveCommand(id) {
    var removeRelation = relationRemoveCommand(id),
        removeModification = model.annotationData.getModificationOf(id).map(function (modification) {
      return modification.id;
    }).map(function (id) {
      return modificationRemoveCommand(id);
    }),
        subCommands = removeModification.concat(removeRelation);

    return {
      execute: function execute() {
        executeCompositCommand('relation', this, 'remove', id, subCommands);
      }
    };
  },
      entityRemoveCommand = function entityRemoveCommand(entity) {
    return new _commandTemplate.RemoveCommand(model, 'entity', entity);
  },
      entityAndAssociatesRemoveCommand = function entityAndAssociatesRemoveCommand(id) {
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
      execute: function execute() {
        executeCompositCommand('entity', this, 'remove', id, subCommands);
      }
    };
  },
      spanRemoveCommand = function spanRemoveCommand(id) {
    var removeSpan = new _commandTemplate.RemoveCommand(model, 'span', id),
        removeEntity = _.flatten(model.annotationData.span.get(id).getTypes().map(function (type) {
      return type.entities.map(function (entityId) {
        return entityAndAssociatesRemoveCommand(entityId);
      });
    })),
        subCommands = removeEntity.concat(removeSpan);

    return {
      execute: function execute() {
        executeCompositCommand('span', this, 'remove', id, subCommands);
      }
    };
  },
      toEntityPerSpan = function toEntityPerSpan(ids) {
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
      entityRemoveAndSpanRemeveIfNoEntityRestCommand = function entityRemoveAndSpanRemeveIfNoEntityRestCommand(ids) {
    var entityPerSpan = toEntityPerSpan(ids);

    return _.flatten(_Object$keys(entityPerSpan).map(function (spanId) {
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
      entityChangeTypeRemoveRelationCommand = function entityChangeTypeRemoveRelationCommand(id, newType, isRemoveRelations) {
    // isRemoveRelations is set true when newType is block.
    var changeType = new _commandTemplate.ChangeTypeCommand(model, 'entity', id, newType),
        subCommands = isRemoveRelations ? model.annotationData.entity.assosicatedRelations(id).map(function (id) {
      return relationRemoveCommand(id);
    }).concat(changeType) : [changeType];

    return {
      execute: function execute() {
        executeCompositCommand('entity', this, 'change', id, subCommands);
      }
    };
  },
      spanMoveCommand = function spanMoveCommand(spanId, newSpan) {
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

          subCommands = subCommands.concat(d.entity.assosicatedRelations(id).map(d.relation.get).map(function (relation) {
            return relationCreateCommand(relation);
          }));
        });
      });
    }

    return {
      execute: function execute() {
        executeCompositCommand('span', this, 'move', spanId, subCommands);
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
    relationChangeTypeCommand: function relationChangeTypeCommand(id, newType) {
      return new _commandTemplate.ChangeTypeCommand(model, 'relation', id, newType);
    },
    modificationCreateCommand: function modificationCreateCommand(modification) {
      return new _commandTemplate.CreateCommand(model, 'modification', false, modification);
    },
    modificationRemoveCommand: modificationRemoveCommand
  };

  return {
    invoke: function invoke(commands) {
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
    redo: function redo() {
      if (history.hasAnythingToRedo()) {
        model.selectionModel.clear();
        invokeCommand.invoke(history.next());
      }
    },
    factory: factory
  };
};

},{"../idFactory":356,"./commandTemplate":193,"./executeCompositCommand":194,"./getReplicationSpans":195,"./invokeCommand":197,"babel-runtime/core-js/object/keys":9}],197:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var invoke = function invoke(commands) {
  commands.forEach(function (command) {
    command.execute();
  });
},
    RevertCommands = function RevertCommands(commands) {
  commands = _Object$create(commands);
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

},{"babel-runtime/core-js/object/create":6}],198:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

// histories of edit to undo and redo.

exports['default'] = function () {
  var lastSaveIndex = -1,
      lastEditIndex = -1,
      history = [],
      hasAnythingToUndo = function hasAnythingToUndo() {
    return lastEditIndex > -1;
  },
      hasAnythingToRedo = function hasAnythingToRedo() {
    return lastEditIndex < history.length - 1;
  },
      hasAnythingToSave = function hasAnythingToSave() {
    return lastEditIndex !== lastSaveIndex;
  },
      emitter = new _events.EventEmitter(),
      trigger = function trigger() {
    emitter.emit('change', {
      hasAnythingToSave: hasAnythingToSave(),
      hasAnythingToUndo: hasAnythingToUndo(),
      hasAnythingToRedo: hasAnythingToRedo()
    });
  };

  return _.extend(emitter, {
    reset: function reset() {
      lastSaveIndex = -1;
      lastEditIndex = -1;
      history = [];
      trigger();
    },
    push: function push(commands) {
      history.splice(lastEditIndex + 1, history.length - lastEditIndex, commands);
      lastEditIndex++;
      trigger();
    },
    next: function next() {
      lastEditIndex++;
      trigger();
      return history[lastEditIndex];
    },
    prev: function prev() {
      var lastEdit = history[lastEditIndex];
      lastEditIndex--;
      trigger();
      return lastEdit;
    },
    saved: function saved() {
      lastSaveIndex = lastEditIndex;
      trigger();
    },
    hasAnythingToSave: hasAnythingToSave,
    hasAnythingToUndo: hasAnythingToUndo,
    hasAnythingToRedo: hasAnythingToRedo
  });
};

module.exports = exports['default'];

},{"events":108}],199:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _idFactory = require('../../../idFactory');

var _idFactory2 = _interopRequireDefault(_idFactory);

var _ModelContainer = require('./ModelContainer');

var _ModelContainer2 = _interopRequireDefault(_ModelContainer);

// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
var toModel = function toModel(editor, entity) {
  return {
    id: entity.id,
    span: _idFactory2['default'].makeSpanId(editor, entity.span),
    type: entity.obj
  };
},
    mappingFunction = function mappingFunction(editor, denotations) {
  denotations = denotations || [];
  return denotations.map(_.partial(toModel, editor));
},
    EntityContainer = function EntityContainer(editor, emitter, relation) {
  var entityContainer = new _ModelContainer2['default'](emitter, 'entity', _.partial(mappingFunction, editor), 'T'),
      add = _.compose(entityContainer.add, function (entity) {
    if (entity.span) return entity;
    throw new Error('entity has no span! ' + JSON.stringify(entity));
  }),
      assosicatedRelations = function assosicatedRelations(entityId) {
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

},{"../../../idFactory":356,"./ModelContainer":200,"babel-runtime/helpers/interop-require-default":17}],200:[function(require,module,exports){
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _getNextId = require('./getNextId');

var _getNextId2 = _interopRequireDefault(_getNextId);

var ERROR_MESSAGE = 'Set the mappingFunction by the constructor to use the method "ModelContainer.setSource".';

module.exports = function (emitter, prefix, mappingFunction, idPrefix) {
  var contaier = {},
      getIds = function getIds() {
    return _Object$keys(contaier);
  },
      getNewId = _.partial(_getNextId2['default'], idPrefix ? idPrefix : prefix.charAt(0).toUpperCase()),
      _add = function _add(model) {
    // Overwrite to revert
    model.id = model.id || getNewId(getIds());
    contaier[model.id] = model;
    return model;
  },
      concat = function concat(collection) {
    if (!collection) return;

    // Move medols without id behind others, to prevet id duplication generated and exists.
    collection.sort(function (a, b) {
      if (!a.id) return 1;
      if (!b.id) return -1;
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;

      return 0;
    });

    collection.forEach(_add);
  },
      get = function get(id) {
    return contaier[id];
  },
      all = function all() {
    return _.map(contaier, _.identity);
  },
      clear = function clear() {
    contaier = {};
  };

  return {
    name: prefix,
    addSource: function addSource(source) {
      if (!_.isFunction(mappingFunction)) {
        throw new Error(ERROR_MESSAGE);
      }

      concat(mappingFunction(source));
    },
    // The doAfter is avoked before a event emitted.
    add: function add(model, doAfter) {
      var newModel = _add(model);
      if (_.isFunction(doAfter)) doAfter();

      emitter.emit(prefix + '.add', newModel);
      return newModel;
    },
    get: get,
    all: all,
    some: function some() {
      return _.some(contaier);
    },
    types: function types() {
      return all().map(function (model) {
        return model.type;
      });
    },
    changeType: function changeType(id, newType) {
      var model = get(id);
      model.type = newType;
      emitter.emit(prefix + '.change', model);
      return model;
    },
    remove: function remove(id) {
      var model = contaier[id];
      if (model) {
        delete contaier[id];
        emitter.emit(prefix + '.remove', model);
      }
      return model;
    },
    clear: clear
  };
};

},{"./getNextId":203,"babel-runtime/core-js/object/keys":9,"babel-runtime/helpers/interop-require-default":17}],201:[function(require,module,exports){
'use strict';

var idFactory = require('../../../idFactory'),
    ModelContainer = require('./ModelContainer');

module.exports = function (editor, emitter) {
  var mappingFunction = function mappingFunction(sourceDoc) {
    sourceDoc = sourceDoc || [];
    var textLengthBeforeThisParagraph = 0;

    return sourceDoc.split("\n").map(function (p, index) {
      var ret = {
        id: idFactory.makeParagraphId(editor, index),
        begin: textLengthBeforeThisParagraph,
        end: textLengthBeforeThisParagraph + p.length,
        text: p,
        order: index
      };

      textLengthBeforeThisParagraph += p.length + 1;
      return ret;
    });
  },
      contaier = new ModelContainer(emitter, 'paragraph', mappingFunction),
      originAll = contaier.all,
      api = _.extend(contaier, {
    // get the paragraph that span is belong to.
    getBelongingTo: function getBelongingTo(span) {
      var match = contaier.all().filter(function (p) {
        return span.begin >= p.begin && span.end <= p.end;
      });

      if (match.length === 0) {
        throw new Error('span should belong to any paragraph.');
      } else {
        return match[0];
      }
    },
    all: function all() {
      var paragraphs = originAll();

      // The order is important to render.
      paragraphs.sort(function (a, b) {
        if (a.order < b.order) {
          return -1;
        }

        if (a.order > b.order) {
          return 1;
        }

        return 0;
      });

      return paragraphs;
    }
  });

  return api;
};

},{"../../../idFactory":356,"./ModelContainer":200}],202:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _idFactory = require('../../../idFactory');

var _idFactory2 = _interopRequireDefault(_idFactory);

var _ModelContainer = require('./ModelContainer');

var _ModelContainer2 = _interopRequireDefault(_ModelContainer);

var _parseAnnotationValidateAnnotation = require('../parseAnnotation/validateAnnotation');

exports['default'] = function (editor, emitter, paragraph) {
  var toSpanModel = (function () {
    var spanExtension = {
      // for debug. print myself only.
      toStringOnlyThis: (function (_toStringOnlyThis) {
        function toStringOnlyThis() {
          return _toStringOnlyThis.apply(this, arguments);
        }

        toStringOnlyThis.toString = function () {
          return _toStringOnlyThis.toString();
        };

        return toStringOnlyThis;
      })(function () {
        return toStringOnlyThis(this, emitter);
      }),
      // for debug. print with children.
      toString: function toString(depth) {
        depth = depth || 1; // default depth is 1

        var childrenString = this.children && this.children.length > 0 ? "\n" + this.children.map(function (child) {
          return new Array(depth + 1).join("\t") + child.toString(depth + 1);
        }).join("\n") : "";

        return this.toStringOnlyThis() + childrenString;
      },
      // Get online for update is not grantieed.
      getTypes: function getTypes() {
        var spanId = this.id;

        // Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"] }.
        return emitter.entity.all().filter(function (entity) {
          return spanId === entity.span;
        }).reduce(function (a, b) {
          var typeId = _idFactory2['default'].makeTypeId(b.span, b.type);

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
      getEntities: function getEntities() {
        return _.flatten(this.getTypes().map(function (type) {
          return type.entities;
        }));
      }
    };

    return function (span) {
      return $.extend({}, span, {
        id: _idFactory2['default'].makeSpanId(editor, span),
        paragraph: paragraph.getBelongingTo(span)
      }, spanExtension);
    };
  })(),
      mappingFunction = function mappingFunction(denotations) {
    denotations = denotations || [];
    return denotations.map(function (entity) {
      return entity.span;
    }).map(toSpanModel).filter(function (span, index, array) {
      return !(0, _parseAnnotationValidateAnnotation.isBoundaryCrossingWithOtherSpans)(array.slice(0, index - 1), span);
    });
  },
      spanContainer = new _ModelContainer2['default'](emitter, 'span', mappingFunction),
      spanTopLevel = [],
      adopt = function adopt(parent, span) {
    parent.children.push(span);
    span.parent = parent;
  },
      getParet = function getParet(_x, _x2) {
    var _again = true;

    _function: while (_again) {
      var parent = _x,
          span = _x2;
      _again = false;

      if (isChildOf(editor, spanContainer, span, parent)) {
        return parent;
      } else if (parent.parent) {
        _x = parent.parent;
        _x2 = span;
        _again = true;
        continue _function;
      } else {
        return null;
      }
    }
  },
      updateSpanTree = function updateSpanTree() {
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
        right: index !== array.length - 1 ? array[index + 1] : null
      });
    }).forEach(function (span) {
      if (span.left) {
        var _parent = getParet(span.left, span);
        if (_parent) {
          adopt(_parent, span);
        } else {
          spanTree.push(span);
        }
      } else {
        spanTree.push(span);
      }
    });

    // this for debug.
    spanTree.toString = function () {
      return this.map(function (span) {
        return span.toString();
      }).join("\n");
    };

    //  console.log(spanTree.toString())

    spanTopLevel = spanTree;
  },
      spanComparator = function spanComparator(a, b) {
    return a.begin - b.begin || b.end - a.end;
  },
      api = {

    // expected span is like { "begin": 19, "end": 49 }
    add: function add(span) {
      if (span) return spanContainer.add(toSpanModel(span), updateSpanTree);
      throw new Error('span is undefined.');
    },
    addSource: function addSource(spans) {
      spanContainer.addSource(spans);
      updateSpanTree();
    },
    get: function get(spanId) {
      return spanContainer.get(spanId);
    },
    all: spanContainer.all,
    range: function range(firstId, secondId) {
      var first = spanContainer.get(firstId);
      var second = spanContainer.get(secondId);

      // switch if seconfId before firstId
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
    topLevel: function topLevel() {
      return spanTopLevel;
    },
    multiEntities: function multiEntities() {
      return spanContainer.all().filter(function (span) {
        var multiEntitiesTypes = span.getTypes().filter(function (type) {
          return type.entities.length > 1;
        });

        return multiEntitiesTypes.length > 0;
      });
    },
    remove: function remove(id) {
      var span = spanContainer.remove(id);
      updateSpanTree();
      return span;
    },
    clear: function clear() {
      spanContainer.clear();
      spanTopLevel = [];
    }
  };

  return api;
};

function isChildOf(editor, spanContainer, span, maybeParent) {
  if (!maybeParent) return false;

  var id = _idFactory2['default'].makeSpanId(editor, maybeParent);
  if (!spanContainer.get(id)) throw new Error('maybeParent is removed. ' + maybeParent.toStringOnlyThis());

  return maybeParent.begin <= span.begin && span.end <= maybeParent.end;
}

function toStringOnlyThis(span, emitter) {
  return "span " + span.begin + ":" + span.end + ":" + emitter.sourceDoc.substring(span.begin, span.end);
}
module.exports = exports['default'];

},{"../../../idFactory":356,"../parseAnnotation/validateAnnotation":218,"./ModelContainer":200,"babel-runtime/helpers/interop-require-default":17}],203:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (prefix, existsIds) {
  var numbers = existsIds.filter(function (id) {
    return hasPrefix(prefix, id);
  }).map(withoutPrefix),

  // The Math.max retrun -Infinity when the second argument array is empty.
  max = numbers.length === 0 ? 0 : Math.max.apply(null, numbers),
      nextNumber = max + 1;

  return prefix + nextNumber;
};

function hasPrefix(prefix, id) {
  // Exclude an id have other than prefix and number, for example 'T1a'.
  var reg = new RegExp(prefix + "\\d+$");

  return reg.test(id);
}

function withoutPrefix(id) {
  return id.slice(1);
}
module.exports = exports["default"];

},{}],204:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _ModelContainer = require('./ModelContainer');

var _ModelContainer2 = _interopRequireDefault(_ModelContainer);

var _ParagraphContainer = require('./ParagraphContainer');

var _ParagraphContainer2 = _interopRequireDefault(_ParagraphContainer);

var _SpanContainer = require('./SpanContainer');

var _SpanContainer2 = _interopRequireDefault(_SpanContainer);

var _EntityContainer = require('./EntityContainer');

var _EntityContainer2 = _interopRequireDefault(_EntityContainer);

exports['default'] = function (editor) {
  var emitter = new _events.EventEmitter(),
      namespace = new _ModelContainer2['default'](emitter, 'namespace', _.identity),
      paragraph = new _ParagraphContainer2['default'](editor, emitter),
      span = new _SpanContainer2['default'](editor, emitter, paragraph),
      relation = new _ModelContainer2['default'](emitter, 'relation', mapRelations),
      entity = new _EntityContainer2['default'](editor, emitter, relation),
      modification = new _ModelContainer2['default'](emitter, 'modification', _.identity);

  return _.extend(emitter, {
    namespace: namespace,
    sourceDoc: '',
    paragraph: paragraph,
    span: span,
    entity: entity,
    relation: relation,
    modification: modification
  });
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
module.exports = exports['default'];

},{"./EntityContainer":199,"./ModelContainer":200,"./ParagraphContainer":201,"./SpanContainer":202,"babel-runtime/helpers/interop-require-default":17,"events":108}],205:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _setNewData = require('./setNewData');

var _setNewData2 = _interopRequireDefault(_setNewData);

var _toJson2 = require('./toJson');

var _toJson3 = _interopRequireDefault(_toJson2);

var _Container = require('./Container');

var _Container2 = _interopRequireDefault(_Container);

var clearAnnotationData = function clearAnnotationData(dataStore) {
  dataStore.span.clear();
  dataStore.entity.clear();
  dataStore.relation.clear();
  dataStore.modification.clear();
  dataStore.paragraph.clear();
},
    AnntationData = function AnntationData(editor) {
  var originalData,
      dataStore = new _Container2['default'](editor);

  return _.extend(dataStore, {
    reset: function reset(annotation) {
      try {
        clearAnnotationData(dataStore);

        if (!annotation.text) throw new Error('read failed.');

        var result = (0, _setNewData2['default'])(dataStore, annotation);

        originalData = annotation;

        dataStore.emit('paragraph.change', dataStore.paragraph.all());

        dataStore.emit('all.change', dataStore, result.multitrack, result.rejects);

        return result.rejects;
      } catch (error) {
        console.error(error, error.stack);
      }
    },
    toJson: function toJson() {
      return JSON.stringify((0, _toJson3['default'])(originalData, dataStore));
    },
    getModificationOf: function getModificationOf(objectId) {
      return dataStore.modification.all().filter(function (m) {
        return m.obj === objectId;
      });
    }
  });
};

module.exports = AnntationData;

},{"./Container":204,"./setNewData":226,"./toJson":227,"babel-runtime/helpers/interop-require-default":17}],206:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _importSource = require('./importSource');

var _importSource2 = _interopRequireDefault(_importSource);

var _translateDenotation = require('./translateDenotation');

var _translateDenotation2 = _interopRequireDefault(_translateDenotation);

exports['default'] = function (span, entity, denotations, prefix) {
    (0, _importSource2['default'])([span, entity], function (denotation) {
        return (0, _translateDenotation2['default'])(prefix, denotation);
    }, denotations);
};

module.exports = exports['default'];

},{"./importSource":207,"./translateDenotation":212,"babel-runtime/helpers/interop-require-default":17}],207:[function(require,module,exports){
"use strict";

module.exports = function (targets, translater, source) {
  if (source) {
    source = source.map(translater);
  }

  targets.forEach(function (target) {
    target.addSource(source);
  });
};

},{}],208:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _importSource = require('./importSource');

var _importSource2 = _interopRequireDefault(_importSource);

var _translateModification = require('./translateModification');

var _translateModification2 = _interopRequireDefault(_translateModification);

exports['default'] = function (modification, modifications, prefix) {
    (0, _importSource2['default'])([modification], function (modification) {
        return (0, _translateModification2['default'])(prefix, modification);
    }, modifications);
};

module.exports = exports['default'];

},{"./importSource":207,"./translateModification":213,"babel-runtime/helpers/interop-require-default":17}],209:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _importSource = require('./importSource');

var _importSource2 = _interopRequireDefault(_importSource);

exports['default'] = function (destination, source) {
  // Clone source to prevet changing orignal data.
  (0, _importSource2['default'])([destination], function (namespace) {
    return _.extend({}, namespace);
  }, source);
};

module.exports = exports['default'];

},{"./importSource":207,"babel-runtime/helpers/interop-require-default":17}],210:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _importSource = require('./importSource');

var _importSource2 = _interopRequireDefault(_importSource);

var _translateRelation = require('./translateRelation');

var _translateRelation2 = _interopRequireDefault(_translateRelation);

exports['default'] = function (relation, relations, prefix) {
    (0, _importSource2['default'])([relation], function (relation) {
        return (0, _translateRelation2['default'])(prefix, relation);
    }, relations);
};

module.exports = exports['default'];

},{"./importSource":207,"./translateRelation":214,"babel-runtime/helpers/interop-require-default":17}],211:[function(require,module,exports){
"use strict";

module.exports = function (src, prefix) {
  // An id will be generated if id is null.
  // But an undefined is convert to string as 'undefined' when it add to any string.
  return src.id ? prefix + src.id : null;
};

},{}],212:[function(require,module,exports){
'use strict';

var setIdPrefixIfExist = require('./setIdPrefixIfExist');

// Expected denotations is an Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
module.exports = function (prefix, src) {
  prefix = prefix || '';
  return _.extend({}, src, {
    // Do not convert  string unless id.
    id: setIdPrefixIfExist(src, prefix)
  });
};

},{"./setIdPrefixIfExist":211}],213:[function(require,module,exports){
'use strict';

var setIdPrefixIfExist = require('./setIdPrefixIfExist');

// Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
module.exports = function (prefix, src) {
  prefix = prefix || '';
  return _.extend({}, src, {
    id: setIdPrefixIfExist(src, prefix),
    obj: prefix + src.obj
  });
};

},{"./setIdPrefixIfExist":211}],214:[function(require,module,exports){
'use strict';

var setIdPrefixIfExist = require('./setIdPrefixIfExist');

// Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
module.exports = function (prefix, src) {
  prefix = prefix || '';
  return _.extend({}, src, {
    id: setIdPrefixIfExist(src, prefix),
    subj: prefix + src.subj,
    obj: prefix + src.obj
  });
};

},{"./setIdPrefixIfExist":211}],215:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _validateAnnotation = require('./validateAnnotation');

var _validateAnnotation2 = _interopRequireDefault(_validateAnnotation);

var _importAnnotationDenotation = require('./importAnnotation/denotation');

var _importAnnotationDenotation2 = _interopRequireDefault(_importAnnotationDenotation);

var _importAnnotationRelation = require('./importAnnotation/relation');

var _importAnnotationRelation2 = _interopRequireDefault(_importAnnotationRelation);

var _importAnnotationModification = require('./importAnnotation/modification');

var _importAnnotationModification2 = _interopRequireDefault(_importAnnotationModification);

exports['default'] = function (span, entity, relation, modification, paragraph, text, annotation, prefix) {
    var result = (0, _validateAnnotation2['default'])(text, paragraph, annotation);

    (0, _importAnnotationDenotation2['default'])(span, entity, result.accept.denotation, prefix);

    (0, _importAnnotationRelation2['default'])(relation, result.accept.relation, prefix);

    (0, _importAnnotationModification2['default'])(modification, result.accept.modification, prefix);

    return result.reject;
};

module.exports = exports['default'];

},{"./importAnnotation/denotation":206,"./importAnnotation/modification":208,"./importAnnotation/relation":210,"./validateAnnotation":218,"babel-runtime/helpers/interop-require-default":17}],216:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (rejects) {
    return rejects.reduce(function (result, reject) {
        return result || reject.hasError;
    }, false);
};

module.exports = exports["default"];

},{}],217:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (reject) {
  return {
    accept: [],
    reject: reject ? reject : []
  };
};

module.exports = exports["default"];

},{}],218:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _RejectHasError = require('./Reject/hasError');

var _RejectHasError2 = _interopRequireDefault(_RejectHasError);

var _isBoundaryCrossingWithOtherSpans = require('./isBoundaryCrossingWithOtherSpans');

var _isBoundaryCrossingWithOtherSpans2 = _interopRequireDefault(_isBoundaryCrossingWithOtherSpans);

exports['default'] = _main2['default'];
exports.hasError = _RejectHasError2['default'];
exports.isBoundaryCrossingWithOtherSpans = _isBoundaryCrossingWithOtherSpans2['default'];

},{"./Reject/hasError":216,"./isBoundaryCrossingWithOtherSpans":219,"./main":221,"babel-runtime/helpers/interop-require-default":17}],219:[function(require,module,exports){
// A span its range is coross over with other spans are not able to rendered.
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (spans, candidateSpan) {
  return spans.filter(function (existSpan) {
    return isBoundaryCrossing(candidateSpan, existSpan);
  }).length > 0;
};

function isBoundaryCrossing(candidateSpan, existSpan) {
  var isStartOfCandidateSpanBetweenExistsSpan = existSpan.begin < candidateSpan.begin && candidateSpan.begin < existSpan.end && existSpan.end < candidateSpan.end,
      isEndOfCandidateSpanBetweenExistSpan = candidateSpan.begin < existSpan.begin && existSpan.begin < candidateSpan.end && candidateSpan.end < existSpan.end;

  return isStartOfCandidateSpanBetweenExistsSpan || isEndOfCandidateSpanBetweenExistSpan;
}
module.exports = exports["default"];
// Because spans are renderd with span tag. Html tags can not be cross over.

},{}],220:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (data, opt) {
  if (!opt.dictionary) return false;

  return opt.dictionary.filter(function (entry) {
    return entry.id === data[opt.property];
  }).length === 1;
};

module.exports = exports["default"];

},{}],221:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _validateDenotation = require('./validateDenotation');

var _validateDenotation2 = _interopRequireDefault(_validateDenotation);

var _validateRelation = require('./validateRelation');

var _validateRelation2 = _interopRequireDefault(_validateRelation);

var _validateModificatian = require('./validateModificatian');

var _validateModificatian2 = _interopRequireDefault(_validateModificatian);

exports['default'] = function (text, paragraph, annotation) {
  var resultDenotation = (0, _validateDenotation2['default'])(text, paragraph, annotation.denotations),
      resultRelation = (0, _validateRelation2['default'])(resultDenotation.accept, annotation.relations),
      resultModification = (0, _validateModificatian2['default'])(resultDenotation.accept, resultRelation.accept, annotation.modifications);

  return {
    accept: {
      denotation: resultDenotation.accept,
      relation: resultRelation.accept,
      modification: resultModification.accept
    },
    reject: {
      denotationHasLength: resultDenotation.reject.hasLength,
      denotationInText: resultDenotation.reject.inText,
      denotationInParagraph: resultDenotation.reject.inParagraph,
      denotationIsNotCrossing: resultDenotation.reject.isNotCrossing,
      relationObj: resultRelation.reject.obj,
      relationSubj: resultRelation.reject.subj,
      modification: resultModification.reject.modification,
      hasError: resultDenotation.hasError || resultRelation.hasError || resultModification.hasError
    }
  };
};

module.exports = exports['default'];

},{"./validateDenotation":223,"./validateModificatian":224,"./validateRelation":225,"babel-runtime/helpers/interop-require-default":17}],222:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Reject = require('./Reject');

var _Reject2 = _interopRequireDefault(_Reject);

exports['default'] = function (values, predicate, predicateOption) {
  if (!values) return new _Reject2['default']();

  return values.reduce(function (result, target, index, array) {
    return acceptIf(predicate, predicateOption, result, target, index, array);
  }, new _Reject2['default']());
};

function acceptIf(predicate, predicateOption, result, target, index, array) {
  if (predicate(target, predicateOption, index, array)) {
    result.accept.push(target);
  } else {
    result.reject.push(target);
  }

  return result;
}
module.exports = exports['default'];

},{"./Reject":217,"babel-runtime/helpers/interop-require-default":17}],223:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _isBoundaryCrossingWithOtherSpans = require('./isBoundaryCrossingWithOtherSpans');

var _isBoundaryCrossingWithOtherSpans2 = _interopRequireDefault(_isBoundaryCrossingWithOtherSpans);

exports['default'] = function (text, paragraph, denotations) {
  var resultHasLength = (0, _validate2['default'])(denotations, hasLength),
      resultInText = (0, _validate2['default'])(resultHasLength.accept, isBeginAndEndIn, text),
      resultInParagraph = (0, _validate2['default'])(resultInText.accept, isInParagraph, paragraph),
      resultIsNotCrossing = (0, _validate2['default'])(resultInParagraph.accept, function (denotation, opt, index, array) {
    var others = array.slice(0, index).map(function (d) {
      return d.span;
    }),
        isInvalid = (0, _isBoundaryCrossingWithOtherSpans2['default'])(others, denotation.span);

    return !isInvalid;
  }),
      errorCount = resultHasLength.reject.length + resultInText.reject.length + resultInParagraph.reject.length + resultIsNotCrossing.reject.length;

  return {
    accept: resultIsNotCrossing.accept,
    reject: {
      hasLength: resultHasLength.reject,
      inText: resultInText.reject,
      inParagraph: resultInParagraph.reject,
      isNotCrossing: resultIsNotCrossing.reject
    },
    hasError: errorCount !== 0
  };
};

function hasLength(denotation) {
  return denotation.span.end - denotation.span.begin > 0;
}

function isInText(boundary, text) {
  return 0 <= boundary && boundary <= text.length;
}

function isBeginAndEndIn(denotation, text) {
  return isInText(denotation.span.begin, text) && isInText(denotation.span.end, text);
}

function isInParagraph(denotation, paragraph) {
  return paragraph.all().filter(function (p) {
    return p.begin <= denotation.span.begin && denotation.span.end <= p.end;
  }).length === 1;
}
module.exports = exports['default'];

},{"./isBoundaryCrossingWithOtherSpans":219,"./validate":222,"babel-runtime/helpers/interop-require-default":17}],224:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _isContains = require('./isContains');

var _isContains2 = _interopRequireDefault(_isContains);

exports['default'] = function (denotations, relations, modifications) {
  var resultModification = (0, _validate2['default'])(modifications, _isContains2['default'], {
    property: 'obj',
    dictionary: _.union(denotations, relations)
  });

  return {
    accept: resultModification.accept,
    reject: {
      modification: resultModification.reject,
      hasError: resultModification.reject.length !== 0
    }
  };
};

module.exports = exports['default'];

},{"./isContains":220,"./validate":222,"babel-runtime/helpers/interop-require-default":17}],225:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _isContains = require('./isContains');

var _isContains2 = _interopRequireDefault(_isContains);

exports['default'] = function (denotations, relations) {
  var resultRelationObj = (0, _validate2['default'])(relations, _isContains2['default'], {
    property: 'obj',
    dictionary: denotations
  }),
      resultRelationSubj = (0, _validate2['default'])(resultRelationObj.accept, _isContains2['default'], {
    property: 'subj',
    dictionary: denotations
  }),
      errorCount = resultRelationObj.reject.length + resultRelationSubj.reject.length;

  return {
    accept: resultRelationSubj.accept,
    reject: {
      obj: resultRelationObj.reject,
      subj: resultRelationSubj.reject,
      hasError: errorCount !== 0
    }
  };
};

module.exports = exports['default'];

},{"./isContains":220,"./validate":222,"babel-runtime/helpers/interop-require-default":17}],226:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _parseAnnotation = require('./parseAnnotation');

var _parseAnnotation2 = _interopRequireDefault(_parseAnnotation);

var _parseAnnotationImportAnnotationNamespace = require('./parseAnnotation/importAnnotation/namespace');

var _parseAnnotationImportAnnotationNamespace2 = _interopRequireDefault(_parseAnnotationImportAnnotationNamespace);

exports['default'] = function (dataStore, annotation) {
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
        prefix = 'track' + number + '_',
        reject = (0, _parseAnnotation2['default'])(span, entity, relation, modification, paragraph, text, track, prefix);

    reject.name = 'Track ' + number + ' annotations.';
    return reject;
  });

  return [true, rejects];
}

function parseDennotation(dataStore, annotation) {
  var tracks = parseTracks(dataStore.span, dataStore.entity, dataStore.relation, dataStore.modification, dataStore.paragraph, annotation.text, annotation),
      annotationReject = (0, _parseAnnotation2['default'])(dataStore.span, dataStore.entity, dataStore.relation, dataStore.modification, dataStore.paragraph, annotation.text, annotation);

  annotationReject.name = 'Root annotations.';

  (0, _parseAnnotationImportAnnotationNamespace2['default'])(dataStore.namespace, annotation.namespaces);

  return {
    multitrack: tracks[0],
    rejects: [annotationReject].concat(tracks[1])
  };
}
module.exports = exports['default'];

},{"./parseAnnotation":215,"./parseAnnotation/importAnnotation/namespace":209,"babel-runtime/helpers/interop-require-default":17}],227:[function(require,module,exports){
"use strict";

var toDenotation = function toDenotation(dataStore) {
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
    toRelation = function toRelation(dataStore) {
  return dataStore.relation.all().map(function (r) {
    return {
      id: r.id,
      pred: r.type,
      subj: r.subj,
      obj: r.obj
    };
  });
},
    toJson = function toJson(originalData, dataStore) {
  return _.extend({}, originalData, {
    denotations: toDenotation(dataStore),
    relations: toRelation(dataStore),
    modifications: dataStore.modification.all()
  });
};

module.exports = toJson;

},{}],228:[function(require,module,exports){
'use strict';

var _Set = require('babel-runtime/core-js/set')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (emitter, kindName) {
  var selected = new _Set();

  return {
    add: (function (_add) {
      function add(_x) {
        return _add.apply(this, arguments);
      }

      add.toString = function () {
        return _add.toString();
      };

      return add;
    })(function (id) {
      return add(selected, emitter, kindName, id);
    }),
    all: function all() {
      return _Array$from(selected.values());
    },
    has: function has(id) {
      return selected.has(id);
    },
    some: function some() {
      return selected.size > 0;
    },
    single: (function (_single) {
      function single() {
        return _single.apply(this, arguments);
      }

      single.toString = function () {
        return _single.toString();
      };

      return single;
    })(function () {
      return single(selected);
    }),
    toggle: (function (_toggle) {
      function toggle(_x2) {
        return _toggle.apply(this, arguments);
      }

      toggle.toString = function () {
        return _toggle.toString();
      };

      return toggle;
    })(function (id) {
      return toggle(selected, emitter, kindName, id);
    }),
    remove: (function (_remove) {
      function remove(_x3) {
        return _remove.apply(this, arguments);
      }

      remove.toString = function () {
        return _remove.toString();
      };

      return remove;
    })(function (id) {
      return remove(selected, emitter, kindName, id);
    }),
    clear: (function (_clear) {
      function clear() {
        return _clear.apply(this, arguments);
      }

      clear.toString = function () {
        return _clear.toString();
      };

      return clear;
    })(function () {
      return clear(selected, emitter, kindName);
    })
  };
};

function triggerChange(emitter, kindName) {
  emitter.emit(kindName + '.change');
}

function add(selected, emitter, kindName, id) {
  if (id.forEach) {
    id.forEach(function (id) {
      selected.add(id);
      emitter.emit(kindName + '.select', id);
      triggerChange(emitter, kindName);
    });
  }

  selected.add(id);
  emitter.emit(kindName + '.select', id);
  triggerChange(emitter, kindName);
}

function single(selected) {
  return selected.size === 1 ? selected.values().next().value : null;
}

function toggle(selected, emitter, kindName, id) {
  if (selected.has(id)) {
    remove(selected, emitter, kindName, id);
  } else {
    add(selected, emitter, kindName, id);
  }
}

function remove(selected, emitter, kindName, id) {
  selected['delete'](id);
  emitter.emit(kindName + '.deselect', id);
  triggerChange(emitter, kindName);
}

function clear(selected, emitter, kindName) {
  if (selected.size === 0) return;

  selected.forEach(function (id) {
    return remove(selected, emitter, kindName, id);
  });
  triggerChange(emitter, kindName);
}
module.exports = exports['default'];

},{"babel-runtime/core-js/array/from":1,"babel-runtime/core-js/set":12}],229:[function(require,module,exports){
'use strict';

var _Map = require('babel-runtime/core-js/map')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _IdContainer = require('./IdContainer');

var _IdContainer2 = _interopRequireDefault(_IdContainer);

exports['default'] = function (kinds) {
  var emitter = new _events.EventEmitter(),
      map = new _Map(kinds.map(function (kindName) {
    return [kindName, new _IdContainer2['default'](emitter, kindName)];
  })),
      hash = {};

  map.forEach(function (container, name) {
    hash[name] = container;
  });

  return _Object$assign(emitter, hash, {
    clear: function clear() {
      return map.forEach(function (c) {
        return c.clear();
      });
    },
    some: function some() {
      return someAll(map);
    }
  });
};

function someAll(map) {
  var ret = false;
  map.forEach(function (c) {
    return ret = ret || c.some();
  });
  return ret;
}
module.exports = exports['default'];

},{"./IdContainer":228,"babel-runtime/core-js/map":4,"babel-runtime/core-js/object/assign":5,"babel-runtime/helpers/interop-require-default":17,"events":108}],230:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _AnnotationData = require('./AnnotationData');

var _AnnotationData2 = _interopRequireDefault(_AnnotationData);

var _Selection = require('./Selection');

var _Selection2 = _interopRequireDefault(_Selection);

exports['default'] = function (editor) {
  return {
    annotationData: new _AnnotationData2['default'](editor),
    // A contaier of selection state.
    selectionModel: new _Selection2['default'](['span', 'entity', 'relation'])
  };
};

module.exports = exports['default'];

},{"./AnnotationData":205,"./Selection":229,"babel-runtime/helpers/interop-require-default":17}],231:[function(require,module,exports){
"use strict";

module.exports = function (allSpans, candidateSpan) {
  return allSpans.filter(function (existSpan) {
    return existSpan.begin === candidateSpan.begin && existSpan.end === candidateSpan.end;
  }).length > 0;
};

},{}],232:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var SEED = {
  instanceHide: 0,
  instanceShow: 2
};

exports['default'] = function () {
  var api = _.extend({}, SEED),
      set = function set(mode, val) {
    return updateHash(api, mode, val);
  };

  _.each(SEED, function (val, key) {
    api['set' + (0, _capitalize2['default'])(key)] = function (val) {
      return set(key, val);
    };
  });

  return api;
};

function updateHash(hash, key, val) {
  hash[key] = val;
  return val;
}
module.exports = exports['default'];

},{"babel-runtime/helpers/interop-require-default":17,"capitalize":105}],233:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _TypeGapCache = require('./TypeGapCache');

var _TypeGapCache2 = _interopRequireDefault(_TypeGapCache);

var _EditModeEvent = require('../EditMode/event');

var _EditModeEvent2 = _interopRequireDefault(_EditModeEvent);

exports['default'] = function (typeGap, editMode) {
  var _showInstance = true,
      typeGapCache = new _TypeGapCache2['default']();

  editMode.on(_EditModeEvent2['default'].SHOW, function (argument) {
    _showInstance = true;
    updateTypeGap(_showInstance, typeGap, typeGapCache);
  }).on(_EditModeEvent2['default'].HIDE, function (argument) {
    _showInstance = false;
    updateTypeGap(_showInstance, typeGap, typeGapCache);
  });

  return {
    showInstance: function showInstance() {
      return _showInstance;
    },
    changeTypeGap: (function (_changeTypeGap) {
      function changeTypeGap(_x) {
        return _changeTypeGap.apply(this, arguments);
      }

      changeTypeGap.toString = function () {
        return _changeTypeGap.toString();
      };

      return changeTypeGap;
    })(function (val) {
      return changeTypeGap(_showInstance, typeGap, typeGapCache, val);
    }),
    getTypeGap: function getTypeGap() {
      return typeGap();
    },
    notifyNewInstance: function notifyNewInstance() {
      if (!_showInstance) toastr.success("an instance is created behind.");
    }
  };
};

function changeTypeGap(showInstance, typeGap, typeGapCache, value) {
  if (showInstance) {
    typeGapCache.setInstanceShow(value);
  } else {
    typeGapCache.setInstanceHide(value);
  }

  updateTypeGap(showInstance, typeGap, typeGapCache);
}

function updateTypeGap(showInstance, typeGap, typeGapCache) {
  if (showInstance) {
    typeGap.set(typeGapCache.instanceShow);
  } else {
    typeGap.set(typeGapCache.instanceHide);
  }
}
module.exports = exports['default'];

},{"../EditMode/event":240,"./TypeGapCache":232,"babel-runtime/helpers/interop-require-default":17}],234:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emitterFsm = require('emitter-fsm');

var _emitterFsm2 = _interopRequireDefault(_emitterFsm);

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

exports['default'] = function () {
  var m = new _emitterFsm2['default']({
    states: [_state2['default'].INIT, _state2['default'].TERM, _state2['default'].INSTANCE, _state2['default'].RELATION, _state2['default'].VIEW_TERM, _state2['default'].VIEW_INSTANCE]
  });

  m.config(_state2['default'].INIT, {
    to: {
      exclude: [_state2['default'].RELATION]
    }
  });

  m.config(_state2['default'].TERM, {
    from: {
      exclude: [_state2['default'].VIEW_INSTANCE]
    },
    to: {
      exclude: [_state2['default'].INIT, _state2['default'].VIEW_INSTANCE]
    }
  });

  m.config(_state2['default'].INSTANCE, {
    from: {
      exclude: [_state2['default'].VIEW_TERM]
    },
    to: {
      exclude: [_state2['default'].INIT, _state2['default'].VIEW_TERM]
    }
  });

  m.config(_state2['default'].RELATION, {
    from: {
      exclude: [_state2['default'].INIT]
    },
    to: {
      exclude: [_state2['default'].INIT, _state2['default'].VIEW_TERM]
    }
  });

  m.config(_state2['default'].VIEW_TERM, {
    from: {
      exclude: [_state2['default'].INSTANCE, _state2['default'].RELATION]
    },
    to: {
      exclude: [_state2['default'].INIT, _state2['default'].INSTANCE]
    }
  });

  m.config(_state2['default'].VIEW_INSTANCE, {
    from: {
      exclude: [_state2['default'].TERM]
    },
    to: {
      exclude: [_state2['default'].INIT, _state2['default'].TERM]
    }
  });

  return m;
};

module.exports = exports['default'];

},{"./state":244,"babel-runtime/helpers/interop-require-default":17,"emitter-fsm":106}],235:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _setEditableStyle = require('./setEditableStyle');

var _setEditableStyle2 = _interopRequireDefault(_setEditableStyle);

var _ViewMode = require('./ViewMode');

var _ViewMode2 = _interopRequireDefault(_ViewMode);

var _resetView = require('./resetView');

var _resetView2 = _interopRequireDefault(_resetView);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var TERM = 'term',
    INSTANCE = 'instance',
    RELATION = 'relation';

exports['default'] = function (editor, model, typeEditor, buttonStateHelper) {
  var viewMode = new _ViewMode2['default'](editor, model, buttonStateHelper),
      emitter = new _events.EventEmitter(),
      api = {
    toTerm: function toTerm() {
      emitter.emit(_event2['default'].HIDE);
      emitter.emit(_event2['default'].CHANGE, true, TERM);

      typeEditor.editEntity();
      viewMode.setTerm();
      (0, _setEditableStyle2['default'])(editor, buttonStateHelper, true);
    },
    toInstance: function toInstance() {
      emitter.emit(_event2['default'].SHOW);
      emitter.emit(_event2['default'].CHANGE, true, INSTANCE);

      typeEditor.editEntity();
      viewMode.setInstance();
      (0, _setEditableStyle2['default'])(editor, buttonStateHelper, true);
    },
    toRelation: function toRelation() {
      emitter.emit(_event2['default'].SHOW);
      emitter.emit(_event2['default'].CHANGE, true, RELATION);

      typeEditor.editRelation();
      viewMode.setRelation();
      (0, _setEditableStyle2['default'])(editor, buttonStateHelper, true);
    },
    toViewTerm: function toViewTerm() {
      emitter.emit(_event2['default'].HIDE);
      emitter.emit(_event2['default'].CHANGE, false, TERM);

      typeEditor.noEdit();
      viewMode.setTerm();
      (0, _setEditableStyle2['default'])(editor, buttonStateHelper, false);
    },
    toViewInstance: function toViewInstance() {
      emitter.emit(_event2['default'].SHOW);
      emitter.emit(_event2['default'].CHANGE, false, INSTANCE);

      typeEditor.noEdit();
      viewMode.setInstance();
      (0, _setEditableStyle2['default'])(editor, buttonStateHelper, false);
    }
  };

  return _.extend(emitter, api);
};

module.exports = exports['default'];

},{"./ViewMode":237,"./event":240,"./resetView":242,"./setEditableStyle":243,"babel-runtime/helpers/interop-require-default":17,"events":108}],236:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

var _isSimple = require('../isSimple');

var _isSimple2 = _interopRequireDefault(_isSimple);

exports['default'] = function (stateMachine, annotationData) {
  return {
    // For an intiation transition on an annotations data loaded.
    toTerm: function toTerm() {
      return stateMachine.setState(_state2['default'].TERM);
    },
    toInstance: function toInstance() {
      return stateMachine.setState(_state2['default'].INSTANCE);
    },
    toViewTerm: function toViewTerm() {
      return stateMachine.setState(_state2['default'].VIEW_TERM);
    },
    toViewInstance: function toViewInstance() {
      return stateMachine.setState(_state2['default'].VIEW_INSTANCE);
    },
    // For buttan actions.
    pushView: (function (_pushView) {
      function pushView() {
        return _pushView.apply(this, arguments);
      }

      pushView.toString = function () {
        return _pushView.toString();
      };

      return pushView;
    })(function () {
      return pushView(stateMachine);
    }),
    pushTerm: (function (_pushTerm) {
      function pushTerm() {
        return _pushTerm.apply(this, arguments);
      }

      pushTerm.toString = function () {
        return _pushTerm.toString();
      };

      return pushTerm;
    })(function () {
      return pushTerm(stateMachine, annotationData);
    }),
    pushRelation: function pushRelation() {
      return stateMachine.setState(_state2['default'].RELATION);
    },
    pushSimple: (function (_pushSimple) {
      function pushSimple() {
        return _pushSimple.apply(this, arguments);
      }

      pushSimple.toString = function () {
        return _pushSimple.toString();
      };

      return pushSimple;
    })(function () {
      return pushSimple(stateMachine);
    }),
    upSimple: (function (_upSimple) {
      function upSimple() {
        return _upSimple.apply(this, arguments);
      }

      upSimple.toString = function () {
        return _upSimple.toString();
      };

      return upSimple;
    })(function () {
      return upSimple(stateMachine);
    }),
    // For key input of F or M.
    toggleInstaceRelation: (function (_toggleInstaceRelation) {
      function toggleInstaceRelation() {
        return _toggleInstaceRelation.apply(this, arguments);
      }

      toggleInstaceRelation.toString = function () {
        return _toggleInstaceRelation.toString();
      };

      return toggleInstaceRelation;
    })(function () {
      return toggleInstaceRelation(stateMachine, annotationData);
    })
  };
};

function pushView(stateMachine) {
  switch (stateMachine.currentState) {
    case _state2['default'].TERM:
      stateMachine.setState(_state2['default'].VIEW_TERM);
      break;
    case _state2['default'].INSTANCE:
    case _state2['default'].RELATION:
      stateMachine.setState(_state2['default'].VIEW_INSTANCE);
      break;
    default:
    // Do nothig.
  }
}

function pushTerm(stateMachine, annotationData) {
  switch (stateMachine.currentState) {
    case _state2['default'].RELATION:
      toEditStateAccordingToAnntationData(stateMachine, annotationData);
      break;
    case _state2['default'].VIEW_INSTANCE:
      stateMachine.setState(_state2['default'].INSTANCE);
      break;
    case _state2['default'].VIEW_TERM:
      stateMachine.setState(_state2['default'].TERM);
      break;
    default:
    // Do nothig.
  }
}

function pushSimple(stateMachine) {
  switch (stateMachine.currentState) {
    case _state2['default'].INSTANCE:
      stateMachine.setState(_state2['default'].TERM);
      break;
    case _state2['default'].VIEW_INSTANCE:
      stateMachine.setState(_state2['default'].VIEW_TERM);
      break;
    default:
      throw new Error('Invalid state: ' + stateMachine.currentState);
  }
}

function upSimple(stateMachine) {
  switch (stateMachine.currentState) {
    case _state2['default'].TERM:
      stateMachine.setState(_state2['default'].INSTANCE);
      break;
    case _state2['default'].VIEW_TERM:
      stateMachine.setState(_state2['default'].VIEW_INSTANCE);
      break;
    default:
      throw new Error('Invalid state: ' + stateMachine.currentState);
  }
}

function toggleInstaceRelation(stateMachine, annotationData) {
  switch (stateMachine.currentState) {
    case _state2['default'].INSTANCE:
      stateMachine.setState(_state2['default'].RELATION);
      break;
    case _state2['default'].RELATION:
      toEditStateAccordingToAnntationData(stateMachine, annotationData);
      break;
    default:
    // Do nothig.
  }
}

function toEditStateAccordingToAnntationData(stateMachine, annotationData) {
  if ((0, _isSimple2['default'])(annotationData)) {
    stateMachine.setState(_state2['default'].TERM);
  } else {
    stateMachine.setState(_state2['default'].INSTANCE);
  }
}
module.exports = exports['default'];

},{"../isSimple":284,"./state":244,"babel-runtime/helpers/interop-require-default":17}],237:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ViewSelector = require('../../View/Selector');

var _ViewSelector2 = _interopRequireDefault(_ViewSelector);

exports['default'] = function (editor, model, buttonStateHelper) {
  var selector = new _ViewSelector2['default'](editor, model),

  // This notify is off at relation-edit-mode.
  entitySelectChanged = _.compose(buttonStateHelper.updateByEntity, selector.entityLabel.update);

  var api = {
    setTerm: function setTerm() {
      changeCssClass(editor, 'term');
      removeListeners(model.selectionModel, entitySelectChanged, buttonStateHelper);

      model.selectionModel.on('entity.select', entitySelectChanged).on('entity.deselect', entitySelectChanged).on('entity.change', buttonStateHelper.updateByEntity);
    },
    setInstance: function setInstance() {
      changeCssClass(editor, 'instance');
      removeListeners(model.selectionModel, entitySelectChanged, buttonStateHelper);

      model.selectionModel.on('entity.select', entitySelectChanged).on('entity.deselect', entitySelectChanged).on('entity.change', buttonStateHelper.updateByEntity);
    },
    setRelation: function setRelation() {
      changeCssClass(editor, 'relation');
      removeListeners(model.selectionModel, entitySelectChanged, buttonStateHelper);
    }
  };

  return api;
};

function changeCssClass(editor, mode) {
  editor.removeClass('textae-editor_term-mode').removeClass('textae-editor_instance-mode').removeClass('textae-editor_relation-mode').addClass('textae-editor_' + mode + '-mode');
}

function removeListeners(selectionModel, entitySelectChanged, buttonStateHelper) {
  selectionModel.removeListener('entity.select', entitySelectChanged).removeListener('entity.deselect', entitySelectChanged).removeListener('entity.change', entitySelectChanged).removeListener('entity.change', buttonStateHelper.updateByEntity);
}
module.exports = exports['default'];

},{"../../View/Selector":341,"babel-runtime/helpers/interop-require-default":17}],238:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _StateMachine = require('./StateMachine');

var _StateMachine2 = _interopRequireDefault(_StateMachine);

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

exports['default'] = function (transition) {
  var stateMachine = new _StateMachine2['default']();

  stateMachine.on('transition', function (e) {
    // For debug.
    // console.log(editor.editorId, 'from:', e.from, ' to:', e.to);
  }).on(toEnterEvent(_state2['default'].TERM), transition.toTerm).on(toEnterEvent(_state2['default'].INSTANCE), transition.toInstance).on(toEnterEvent(_state2['default'].RELATION), transition.toRelation).on(toEnterEvent(_state2['default'].VIEW_TERM), transition.toViewTerm).on(toEnterEvent(_state2['default'].VIEW_INSTANCE), transition.toViewInstance);

  return stateMachine;
};

function toEnterEvent(state) {
  return 'enter:' + state;
}
module.exports = exports['default'];

},{"./StateMachine":234,"./state":244,"babel-runtime/helpers/interop-require-default":17}],239:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (buttonStateHelper) {
  buttonStateHelper.enabled('view', true);
  buttonStateHelper.enabled('term', true);
  buttonStateHelper.enabled('relation', true);
  buttonStateHelper.enabled('simple', true);
  buttonStateHelper.enabled('setting', true);
};

module.exports = exports['default'];

},{}],240:[function(require,module,exports){
module.exports={
    "SHOW": "showInstance",
    "HIDE": "hideInstance",
    "CHANGE": "change"
}

},{}],241:[function(require,module,exports){
'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _Transition = require('./Transition');

var _Transition2 = _interopRequireDefault(_Transition);

var _bindTransition = require('./bindTransition');

var _bindTransition2 = _interopRequireDefault(_bindTransition);

var _resetView = require('./resetView');

var _resetView2 = _interopRequireDefault(_resetView);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _Trigger = require('./Trigger');

var _Trigger2 = _interopRequireDefault(_Trigger);

var _enableButtonHasAnnotation = require('./enableButtonHasAnnotation');

var _enableButtonHasAnnotation2 = _interopRequireDefault(_enableButtonHasAnnotation);

exports['default'] = function (editor, model, typeEditor, buttonStateHelper) {
  var emitter = new _events.EventEmitter(),
      transition = new _Transition2['default'](editor, model, typeEditor, buttonStateHelper),
      stateMachine = (0, _bindTransition2['default'])(transition),
      trigger = new _Trigger2['default'](stateMachine, model.annotationData);

  stateMachine.once('transition', function () {
    return (0, _enableButtonHasAnnotation2['default'])(buttonStateHelper);
  });

  transition.on(_event2['default'].SHOW, function () {
    return emitter.emit(_event2['default'].SHOW);
  }).on(_event2['default'].HIDE, function () {
    return emitter.emit(_event2['default'].HIDE);
  }).on(_event2['default'].CHANGE, function () {
    return (0, _resetView2['default'])(typeEditor, model.selectionModel);
  }).on(_event2['default'].CHANGE, function (editable, mode) {
    return emitter.emit(_event2['default'].CHANGE, editable, mode);
  });

  _Object$assign(emitter, trigger);

  return emitter;
};

module.exports = exports['default'];

},{"./Transition":235,"./Trigger":236,"./bindTransition":238,"./enableButtonHasAnnotation":239,"./event":240,"./resetView":242,"babel-runtime/core-js/object/assign":5,"babel-runtime/helpers/interop-require-default":17,"events":108}],242:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (typeEditor, selectionModel) {
  typeEditor.hideDialogs();
  selectionModel.clear();
};

module.exports = exports["default"];

},{}],243:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (editor, buttonStateHelper, isEditable) {
  if (isEditable) {
    editor.addClass('textae-editor_editable');
  } else {
    editor.removeClass('textae-editor_editable');
  }
};

module.exports = exports['default'];

},{}],244:[function(require,module,exports){
module.exports={
    "INIT": "Init",
    "TERM": "Term Centric",
    "INSTANCE": "Instance / Relation",
    "RELATION": "Relation Edit",
    "VIEW_TERM": "View Term",
    "VIEW_INSTANCE": "View Instance"
}

},{}],245:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (editor, annotationData, selectionModel, typeContainer) {
  var getBlockEntities = function getBlockEntities(spanId) {
    return _.flatten(annotationData.span.get(spanId).getTypes().filter(function (type) {
      return typeContainer.entity.isBlock(type.name);
    }).map(function (type) {
      return type.entities;
    }));
  },
      operateSpanWithBlockEntities = function operateSpanWithBlockEntities(method, spanId) {
    selectionModel.span[method](spanId);
    if (editor.find('#' + spanId).hasClass('textae-editor__span--block')) {
      getBlockEntities(spanId).forEach(selectionModel.entity[method]);
    }
  },
      selectSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'add'),
      toggleSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'toggle');

  return function (event) {
    var firstId = selectionModel.span.single(),
        target = event.target,
        id = target.id;

    if (event.shiftKey && firstId) {
      // select reange of spans.
      selectionModel.clear();
      annotationData.span.range(firstId, id).forEach(function (spanId) {
        selectSpanWithBlockEnities(spanId);
      });
    } else if (event.ctrlKey || event.metaKey) {
      toggleSpanWithBlockEnities(id);
    } else {
      selectionModel.clear();
      selectSpanWithBlockEnities(id);
    }
  };
};

module.exports = exports['default'];

},{}],246:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getSelectionSnapShot = require('./getSelectionSnapShot');

var _getSelectionSnapShot2 = _interopRequireDefault(_getSelectionSnapShot);

exports['default'] = function (cancelSelect, selectEnd, spanConfig) {
  var selection = window.getSelection();

  // No select
  if (selection.isCollapsed) {
    cancelSelect();
  } else {
    selectEnd.onText({
      spanConfig: spanConfig,
      selection: (0, _getSelectionSnapShot2['default'])()
    });
  }
};

module.exports = exports['default'];

},{"./getSelectionSnapShot":249,"babel-runtime/helpers/interop-require-default":17}],247:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _dismissBrowserSelection = require('../../dismissBrowserSelection');

var _dismissBrowserSelection2 = _interopRequireDefault(_dismissBrowserSelection);

exports['default'] = function (selectionModel, e) {
  (0, _dismissBrowserSelection2['default'])();

  if (e.ctrlKey || e.metaKey) {
    selectionModel.entity.toggle(e.target.title);
  } else {
    selectionModel.clear();
    selectionModel.entity.add(e.target.title);
  }
  return false;
};

module.exports = exports['default'];

},{"../../dismissBrowserSelection":264,"babel-runtime/helpers/interop-require-default":17}],248:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _selectEntities = require('./selectEntities');

var _selectEntities2 = _interopRequireDefault(_selectEntities);

exports['default'] = function (selectionModel, e) {
  var typeLabel = e.target.previousElementSibling,
      entities = e.target.children;

  return (0, _selectEntities2['default'])(selectionModel, e.ctrlKey || e.metaKey, typeLabel, entities);
};

module.exports = exports['default'];

},{"./selectEntities":251,"babel-runtime/helpers/interop-require-default":17}],249:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _dismissBrowserSelection = require('../../dismissBrowserSelection');

var _dismissBrowserSelection2 = _interopRequireDefault(_dismissBrowserSelection);

exports['default'] = function () {
  var selection = window.getSelection(),
      snapShot = {
    anchorNode: selection.anchorNode,
    anchorOffset: selection.anchorOffset,
    focusNode: selection.focusNode,
    focusOffset: selection.focusOffset,
    range: selection.getRangeAt(0)
  };

  (0, _dismissBrowserSelection2['default'])();

  // Return the snap shot of the selection.
  return snapShot;
};

module.exports = exports['default'];

},{"../../dismissBrowserSelection":264,"babel-runtime/helpers/interop-require-default":17}],250:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _SelectEnd = require('../../SelectEnd');

var _SelectEnd2 = _interopRequireDefault(_SelectEnd);

var _unbindAllEventhandler = require('../unbindAllEventhandler');

var _unbindAllEventhandler2 = _interopRequireDefault(_unbindAllEventhandler);

var _changeTypeIfSelected = require('../changeTypeIfSelected');

var _changeTypeIfSelected2 = _interopRequireDefault(_changeTypeIfSelected);

var _spanClicked = require('./spanClicked');

var _spanClicked2 = _interopRequireDefault(_spanClicked);

var _SelectSpan = require('./SelectSpan');

var _SelectSpan2 = _interopRequireDefault(_SelectSpan);

var _bodyClicked = require('./bodyClicked');

var _bodyClicked2 = _interopRequireDefault(_bodyClicked);

var _typeLabelClicked = require('./typeLabelClicked');

var _typeLabelClicked2 = _interopRequireDefault(_typeLabelClicked);

var _entityClicked = require('./entityClicked');

var _entityClicked2 = _interopRequireDefault(_entityClicked);

var _entityPaneClicked = require('./entityPaneClicked');

var _entityPaneClicked2 = _interopRequireDefault(_entityPaneClicked);

exports['default'] = function (editor, model, command, modeAccordingToButton, typeContainer, spanConfig, cancelSelect) {
  var selectEnd = new _SelectEnd2['default'](editor, model, command, modeAccordingToButton, typeContainer),
      selectSpan = new _SelectSpan2['default'](editor, model.annotationData, model.selectionModel, typeContainer),
      selectionModel = model.selectionModel,
      bind = function bind() {
    editor.on('mouseup', '.textae-editor__body', function () {
      return (0, _bodyClicked2['default'])(cancelSelect, selectEnd, spanConfig);
    }).on('mouseup', '.textae-editor__span', function (e) {
      return (0, _spanClicked2['default'])(spanConfig, selectEnd, selectSpan, e);
    }).on('mouseup', '.textae-editor__type-label', function (e) {
      return (0, _typeLabelClicked2['default'])(selectionModel, e);
    }).on('mouseup', '.textae-editor__entity-pane', function (e) {
      return (0, _entityPaneClicked2['default'])(selectionModel, e);
    }).on('mouseup', '.textae-editor__entity', function (e) {
      return (0, _entityClicked2['default'])(selectionModel, e);
    });
  },
      getSelectedIdEditable = selectionModel.entity.all,
      handler = {
    changeTypeOfSelected: function changeTypeOfSelected(newType) {
      return (0, _changeTypeIfSelected2['default'])(command, getSelectedIdEditable, function (id, newType) {
        return command.factory.entityChangeTypeCommand(id, newType, typeContainer.entity.isBlock(newType));
      }, newType);
    },
    getSelectedIdEditable: getSelectedIdEditable,
    getSelectedType: function getSelectedType() {
      var id = selectionModel.entity.single();

      if (id) return model.annotationData.entity.get(id).type;else return '';
    },
    typeContainer: typeContainer.entity,
    jsPlumbConnectionClicked: null
  };

  return function () {
    return [bind, handler];
  };
};

module.exports = exports['default'];

},{"../../SelectEnd":258,"../changeTypeIfSelected":255,"../unbindAllEventhandler":257,"./SelectSpan":245,"./bodyClicked":246,"./entityClicked":247,"./entityPaneClicked":248,"./spanClicked":252,"./typeLabelClicked":253,"babel-runtime/helpers/interop-require-default":17}],251:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _dismissBrowserSelection = require('../../dismissBrowserSelection');

var _dismissBrowserSelection2 = _interopRequireDefault(_dismissBrowserSelection);

exports['default'] = function (selectionModel, ctrlKey, typeLabel, entities) {
  (0, _dismissBrowserSelection2['default'])();

  if (ctrlKey) {
    if (typeLabel.classList.contains('ui-selected')) {
      deselect(selectionModel, entities);
    } else {
      select(selectionModel, entities);
    }
  } else {
    selectionModel.clear();
    select(selectionModel, entities);
  }
  return false;

  function select(selectionModel, entities) {
    Array.prototype.forEach.call(entities, function (entity) {
      return selectionModel.entity.add(entity.title);
    });
  }

  function deselect(selectionModel, entities) {
    Array.prototype.forEach.call(entities, function (entity) {
      return selectionModel.entity.remove(entity.title);
    });
  }
};

module.exports = exports['default'];

},{"../../dismissBrowserSelection":264,"babel-runtime/helpers/interop-require-default":17}],252:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getSelectionSnapShot = require('./getSelectionSnapShot');

var _getSelectionSnapShot2 = _interopRequireDefault(_getSelectionSnapShot);

exports['default'] = function (spanConfig, selectEnd, selectSpan, event) {
  var selection = window.getSelection();

  // No select
  if (selection.isCollapsed) {
    selectSpan(event);
    return false;
  } else {
    selectEnd.onSpan({
      spanConfig: spanConfig,
      selection: (0, _getSelectionSnapShot2['default'])()
    });
    // Cancel selection of a paragraph.
    // And do non propagate the parent span.
    event.stopPropagation();
  }
};

module.exports = exports['default'];

},{"./getSelectionSnapShot":249,"babel-runtime/helpers/interop-require-default":17}],253:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _dismissBrowserSelection = require('../../dismissBrowserSelection');

var _dismissBrowserSelection2 = _interopRequireDefault(_dismissBrowserSelection);

var _selectEntities = require('./selectEntities');

var _selectEntities2 = _interopRequireDefault(_selectEntities);

exports['default'] = function (selectionModel, e) {
  var typeLabel = e.target,
      entities = e.target.nextElementSibling.children;

  return (0, _selectEntities2['default'])(selectionModel, e.ctrlKey || e.metaKey, typeLabel, entities);
};

module.exports = exports['default'];

},{"../../dismissBrowserSelection":264,"./selectEntities":251,"babel-runtime/helpers/interop-require-default":17}],254:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _dismissBrowserSelection = require('../dismissBrowserSelection');

var _dismissBrowserSelection2 = _interopRequireDefault(_dismissBrowserSelection);

var _changeTypeIfSelected = require('./changeTypeIfSelected');

var _changeTypeIfSelected2 = _interopRequireDefault(_changeTypeIfSelected);

var _unbindAllEventhandler = require('./unbindAllEventhandler');

var _unbindAllEventhandler2 = _interopRequireDefault(_unbindAllEventhandler);

exports['default'] = function (editor, selectionModel, annotationData, command, typeContainer, cancelSelect) {
  // Control only entities and relations.
  // Cancel events of relations and theier label.
  // Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
  // And jQuery events are propergated to body click events and cancel select.
  // So multi selection of relations with Ctrl-key is not work.
  var bind = function bind() {
    editor.on('mouseup', '.textae-editor__entity', function (e) {
      return entityClickedAtRelationMode(selectionModel, command, typeContainer, e);
    }).on('mouseup', '.textae-editor__relation, .textae-editor__relation__label', returnFalse).on('mouseup', '.textae-editor__body', cancelSelect);
  },
      getSelectedIdEditable = selectionModel.relation.all,
      handler = {
    changeTypeOfSelected: function changeTypeOfSelected(newType) {
      return (0, _changeTypeIfSelected2['default'])(command, getSelectedIdEditable, command.factory.relationChangeTypeCommand, newType);
    },
    getSelectedIdEditable: selectionModel.relation.all,
    getSelectedType: function getSelectedType() {
      var id = selectionModel.relation.single();

      if (id) return annotationData.relation.get(id).type;else return '';
    },
    typeContainer: typeContainer.relation,
    jsPlumbConnectionClicked: function jsPlumbConnectionClicked(jsPlumbConnection, event) {
      return selectRelation(selectionModel, jsPlumbConnection, event);
    }
  };

  return function () {
    return [bind, handler];
  };
};

function entityClickedAtRelationMode(selectionModel, command, typeContainer, e) {
  if (!selectionModel.entity.some()) {
    selectionModel.clear();
    selectionModel.entity.add($(e.target).attr('title'));
  } else {
    selectObjectEntity(selectionModel, command, typeContainer, e);
  }
  return false;
}

function returnFalse() {
  return false;
}

// Select or deselect relation.
// This function is expected to be called when Relation-Edit-Mode.
function selectRelation(selectionModel, jsPlumbConnection, event) {
  var relationId = jsPlumbConnection.getParameter("id");

  if (event.ctrlKey || event.metaKey) {
    selectionModel.relation.toggle(relationId);
  } else if (selectionModel.relation.single() !== relationId) {
    // Select only self
    selectionModel.clear();
    selectionModel.relation.add(relationId);
  }
}

function selectObjectEntity(selectionModel, command, typeContainer, e) {
  // Cannot make a self reference relation.
  var subjectEntityId = selectionModel.entity.all()[0],
      objectEntityId = $(e.target).attr('title');

  if (subjectEntityId === objectEntityId) {
    // Deslect already selected entity.
    selectionModel.entity.remove(subjectEntityId);
  } else {
    selectionModel.entity.add(objectEntityId);
    _.defer(function () {
      command.invoke([command.factory.relationCreateCommand({
        subj: subjectEntityId,
        obj: objectEntityId,
        type: typeContainer.relation.getDefaultType()
      })]);

      if (e.ctrlKey || e.metaKey) {
        // Remaining selection of the subject entity.
        selectionModel.entity.remove(objectEntityId);
      } else if (e.shiftKey) {
        (0, _dismissBrowserSelection2['default'])();
        selectionModel.entity.remove(subjectEntityId);
        selectionModel.entity.add(objectEntityId);
        return false;
      } else {
        selectionModel.entity.remove(subjectEntityId);
        selectionModel.entity.remove(objectEntityId);
      }
    });
  }
}
module.exports = exports['default'];

},{"../dismissBrowserSelection":264,"./changeTypeIfSelected":255,"./unbindAllEventhandler":257,"babel-runtime/helpers/interop-require-default":17}],255:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (command, getSelectedAndEditable, createChangeTypeCommandFunction, newType) {
  var ids = getSelectedAndEditable();
  if (ids.length > 0) {
    var commands = ids.map(function (id) {
      return createChangeTypeCommandFunction(id, newType);
    });

    command.invoke(commands);
  }
};

module.exports = exports["default"];

},{}],256:[function(require,module,exports){
'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _EditRelation = require('./EditRelation');

var _EditRelation2 = _interopRequireDefault(_EditRelation);

var _EditEntity = require('./EditEntity');

var _EditEntity2 = _interopRequireDefault(_EditEntity);

var _unbindAllEventhandler = require('./unbindAllEventhandler');

var _unbindAllEventhandler2 = _interopRequireDefault(_unbindAllEventhandler);

var DEFAULT_HANDLER = {
  changeTypeOfSelected: null,
  getSelectedIdEditable: returnEmptyArray,
  getSelectedType: null,
  // The Reference to content to be shown in the pallet.
  typeContainer: null,
  // A Swithing point to change a behavior when relation is clicked.
  jsPlumbConnectionClicked: null
};

// Provide handlers to edit elements according to an edit mode.

exports['default'] = function (editor, model, spanConfig, command, modeAccordingToButton, typeContainer, canselHandler) {
  var handler = _Object$assign({}, DEFAULT_HANDLER),
      _noEdit = function _noEdit() {
    return [function () {}, DEFAULT_HANDLER];
  },
      _editRelation = new _EditRelation2['default'](editor, model.selectionModel, model.annotationData, command, typeContainer, canselHandler),
      _editEntity = new _EditEntity2['default'](editor, model, command, modeAccordingToButton, typeContainer, spanConfig, canselHandler);

  return {
    handler: handler,
    start: {
      noEdit: function noEdit() {
        var newState = _noEdit();
        transit(editor, handler, newState);
      },
      editRelation: function editRelation() {
        var newState = _editRelation();
        transit(editor, handler, newState);
      },
      editEntity: function editEntity() {
        var newState = _editEntity();
        transit(editor, handler, newState);
      }
    }
  };
};

function transit(editor, handler, newState) {
  (0, _unbindAllEventhandler2['default'])(editor);
  newState[0]();
  _Object$assign(handler, newState[1]);
}

function returnEmptyArray() {
  return [];
}
module.exports = exports['default'];

},{"./EditEntity":250,"./EditRelation":254,"./unbindAllEventhandler":257,"babel-runtime/core-js/object/assign":5,"babel-runtime/helpers/interop-require-default":17}],257:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function (editor) {
    return editor.off('mouseup', '.textae-editor__body').off('mouseup', '.textae-editor__span').off('mouseup', '.textae-editor__span_block').off('mouseup', '.textae-editor__type-label').off('mouseup', '.textae-editor__entity-pane').off('mouseup', '.textae-editor__entity');
};

module.exports = exports['default'];

},{}],258:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _SelectionParser = require('./SelectionParser');

var _SelectionParser2 = _interopRequireDefault(_SelectionParser);

var _SelectionValidater = require('./SelectionValidater');

var _SelectionValidater2 = _interopRequireDefault(_SelectionValidater);

var _SpanEditor = require('./SpanEditor');

var _SpanEditor2 = _interopRequireDefault(_SpanEditor);

var selectEndOnText = function selectEndOnText(selectionValidater, spanEditor, data) {
  var isValid = selectionValidater.validateOnText(data.spanConfig, data.selection);

  if (isValid) {
    _.compose(spanEditor.expand, spanEditor.create)(data);
  }
},
    selectEndOnSpan = function selectEndOnSpan(selectionValidater, spanEditor, data) {
  var isValid = selectionValidater.validateOnSpan(data.spanConfig, data.selection);

  if (isValid) {
    _.compose(spanEditor.shrink, spanEditor.expand, spanEditor.create)(data);
  }
};

module.exports = function (editor, model, command, modeAccordingToButton, typeContainer) {
  var selectionParser = new _SelectionParser2['default'](editor, model),
      selectionValidater = new _SelectionValidater2['default'](selectionParser),

  // Initiated by events.
  selectEndOnTextImpl = null,
      selectEndOnSpanImpl = null,
      changeSpanEditorAccordingToButtons = function changeSpanEditorAccordingToButtons() {
    var isDetectDelimiterEnable = modeAccordingToButton['boundary-detection'].value(),
        isReplicateAuto = modeAccordingToButton['replicate-auto'].value(),
        spanEditor = new _SpanEditor2['default'](editor, model, command, typeContainer, isDetectDelimiterEnable, isReplicateAuto);

    selectEndOnTextImpl = _.partial(selectEndOnText, selectionValidater, spanEditor);
    selectEndOnSpanImpl = _.partial(selectEndOnSpan, selectionValidater, spanEditor);
  };

  // Change spanEditor according to the  buttons state.
  changeSpanEditorAccordingToButtons();

  modeAccordingToButton['boundary-detection'].on('change', changeSpanEditorAccordingToButtons);

  modeAccordingToButton['replicate-auto'].on('change', changeSpanEditorAccordingToButtons);

  return {
    onText: function onText(data) {
      if (selectEndOnTextImpl) selectEndOnTextImpl(data);
    },
    onSpan: function onSpan(data) {
      if (selectEndOnSpanImpl) selectEndOnSpanImpl(data);
    }
  };
};

},{"./SelectionParser":259,"./SelectionValidater":260,"./SpanEditor":261,"babel-runtime/helpers/interop-require-default":17}],259:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _selectPosition = require('./selectPosition');

var _selectPosition2 = _interopRequireDefault(_selectPosition);

module.exports = function (editor, model) {
  // A span cannot be created include nonEdgeCharacters only.
  var hasCharacters = function hasCharacters(spanConfig, selection) {
    if (!selection) return false;

    var positions = _selectPosition2['default'].toPositions(model.annotationData, selection),
        selectedString = model.annotationData.sourceDoc.substring(positions.anchorPosition, positions.focusPosition),
        stringWithoutBlankCharacters = spanConfig.removeBlankChractors(selectedString);

    return stringWithoutBlankCharacters.length > 0;
  },
      isInOneParent = function isInOneParent(selection) {
    // A span can be created at the same parent node.
    // The parentElement is expected as a paragraph or a span.
    return selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id;
  },
      getAnchorNodeParent = function getAnchorNodeParent(selection) {
    return $(selection.anchorNode.parentNode);
  },
      getFocusNodeParent = function getFocusNodeParent(selection) {
    return $(selection.focusNode.parentNode);
  },
      hasSpan = function hasSpan($node) {
    return $node.hasClass('textae-editor__span');
  },
      hasParagraphs = function hasParagraphs($node) {
    return $node.hasClass('textae-editor__body__text-box__paragraph');
  },
      hasSpanOrParagraphs = function hasSpanOrParagraphs($node) {
    return hasSpan($node) || hasParagraphs($node);
  },
      isAnchrNodeInSpan = _.compose(hasSpan, getAnchorNodeParent),
      isFocusNodeInSpan = _.compose(hasSpan, getFocusNodeParent),
      isFocusNodeInParagraph = _.compose(hasParagraphs, getFocusNodeParent),
      isAnchrNodeInSpanOrParagraph = _.compose(hasSpanOrParagraphs, getAnchorNodeParent),
      isInSameParagraph = (function () {
    var getParagraph = function getParagraph(_x) {
      var _again = true;

      _function: while (_again) {
        var $node = _x;
        _again = false;

        if (hasParagraphs($node)) {
          return $node;
        } else if (hasSpan($node)) {
          _x = $node.parent();
          _again = true;
          continue _function;
        } else {
          return null;
        }
      }
    },
        getParagraphId = function getParagraphId(selection, position) {
      var $parent = $(selection[position + 'Node'].parentNode),
          $paragraph = getParagraph($parent);
      return $paragraph && $paragraph.attr('id');
    };

    return function (selection) {
      var anchorParagraphId = getParagraphId(selection, 'anchor'),
          focusParagraphId = getParagraphId(selection, 'focus');

      return anchorParagraphId === focusParagraphId;
    };
  })(),
      isAnchorOneDownUnderForcus = function isAnchorOneDownUnderForcus(selection) {
    return selection.anchorNode.parentNode.parentNode === selection.focusNode.parentNode;
  },
      isForcusOneDownUnderAnchor = function isForcusOneDownUnderAnchor(selection) {
    return selection.anchorNode.parentNode === selection.focusNode.parentNode.parentNode;
  },
      isInSelectedSpan = function isInSelectedSpan(position) {
    var spanId = model.selectionModel.span.single();
    if (spanId) {
      var selectedSpan = model.annotationData.span.get(spanId);
      return selectedSpan.begin < position && position < selectedSpan.end;
    }
    return false;
  },
      isAnchorInSelectedSpan = function isAnchorInSelectedSpan(selection) {
    return isInSelectedSpan(_selectPosition2['default'].getAnchorPosition(model.annotationData, selection));
  },
      isFocusOnSelectedSpan = function isFocusOnSelectedSpan(selection) {
    return selection.focusNode.parentNode.id === model.selectionModel.span.single();
  },
      isFocusInSelectedSpan = function isFocusInSelectedSpan(selection) {
    return isInSelectedSpan(_selectPosition2['default'].getFocusPosition(model.annotationData, selection));
  },
      isLongerThanParentSpan = function isLongerThanParentSpan(selection) {
    var $getAnchorNodeParent = getAnchorNodeParent(selection),
        focusPosition = _selectPosition2['default'].getFocusPosition(model.annotationData, selection);

    if (hasSpan($getAnchorNodeParent) && $getAnchorNodeParent.parent() && hasSpan($getAnchorNodeParent.parent())) {
      var span = model.annotationData.span.get($getAnchorNodeParent.parent().attr('id'));
      if (focusPosition < span.begin || span.end < focusPosition) return true;
    }
  },
      isShorterThanChildSpan = function isShorterThanChildSpan(selection) {
    var $getFocusNodeParent = getFocusNodeParent(selection),
        anchorPosition = _selectPosition2['default'].getAnchorPosition(model.annotationData, selection);

    if (hasSpan($getFocusNodeParent) && $getFocusNodeParent.parent() && hasSpan($getFocusNodeParent.parent())) {
      var span = model.annotationData.span.get($getFocusNodeParent.parent().attr('id'));
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
    isLongerThanParentSpan: isLongerThanParentSpan,
    isShorterThanChildSpan: isShorterThanChildSpan
  };
};

},{"./selectPosition":266,"babel-runtime/helpers/interop-require-default":17}],260:[function(require,module,exports){
'use strict';

var deferAlert = require('./deferAlert');

module.exports = function (parser) {
  var showAlertIfOtherSpan = function showAlertIfOtherSpan(selection) {
    if (parser.isInSameParagraph(selection)) {
      return true;
    }

    deferAlert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
    return false;
  },
      commonValidate = function commonValidate(spanConfig, selection) {
    // This order is not important.
    return showAlertIfOtherSpan(selection) && parser.isAnchrNodeInSpanOrParagraph(selection) && parser.hasCharacters(spanConfig, selection);
  },
      validateOnText = function validateOnText(spanConfig, selection) {
    // This order is important, because showAlertIfOtherSpan is show alert.
    return parser.isFocusNodeInParagraph(selection) && commonValidate(spanConfig, selection);
  },
      validateOnSpan = function validateOnSpan(spanConfig, selection) {
    // This order is important, because showAlertIfOtherSpan is show alert.
    return parser.isFocusNodeInSpan(selection) && commonValidate(spanConfig, selection);
  };

  return {
    validateOnText: validateOnText,
    validateOnSpan: validateOnSpan
  };
};

},{"./deferAlert":263}],261:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _idFactory = require('../../idFactory');

var _idFactory2 = _interopRequireDefault(_idFactory);

var _ModelAnnotationDataParseAnnotationValidateAnnotation = require('../../Model/AnnotationData/parseAnnotation/validateAnnotation');

var _ModelIsAlreadySpaned = require('../../Model/isAlreadySpaned');

var _ModelIsAlreadySpaned2 = _interopRequireDefault(_ModelIsAlreadySpaned);

var _deferAlert = require('./deferAlert');

var _deferAlert2 = _interopRequireDefault(_deferAlert);

var _spanAdjusterDelimiterDetectAdjuster = require('../spanAdjuster/delimiterDetectAdjuster');

var _spanAdjusterDelimiterDetectAdjuster2 = _interopRequireDefault(_spanAdjusterDelimiterDetectAdjuster);

var _spanAdjusterBlankSkipAdjuster = require('../spanAdjuster/blankSkipAdjuster');

var _spanAdjusterBlankSkipAdjuster2 = _interopRequireDefault(_spanAdjusterBlankSkipAdjuster);

var _SpanManipulater = require('./SpanManipulater');

var _SpanManipulater2 = _interopRequireDefault(_SpanManipulater);

var _SelectionParser = require('./SelectionParser');

var _SelectionParser2 = _interopRequireDefault(_SelectionParser);

exports['default'] = function (editor, model, command, typeContainer, isDetectDelimiterEnable, isReplicateAuto) {
  var spanAdjuster = isDetectDelimiterEnable ? _spanAdjusterDelimiterDetectAdjuster2['default'] : _spanAdjusterBlankSkipAdjuster2['default'],
      spanManipulater = new _SpanManipulater2['default'](model, spanAdjuster),
      selectionParser = new _SelectionParser2['default'](editor, model),
      doCreate = _.partial(DoCreate, model, command, typeContainer, spanManipulater, isDetectDelimiterEnable, isReplicateAuto),
      doExpandSpanToSelection = _.partial(expandSpanToSelection, editor, model, command, spanManipulater),
      doExpand = _.partial(DoExpand, model, selectionParser, doExpandSpanToSelection),
      doShrinkSpanToSelection = _.partial(shrinkSpanToSelection, editor, model, command, spanManipulater),
      doShrink = _.partial(DoShrink, model, selectionParser, doShrinkSpanToSelection);

  return {
    create: _.partial(processSelectionIf, doCreate, selectionParser.isInOneParent),
    expand: _.partial(processSelectionIf, doExpand, selectionParser.isAnchrNodeInSpan),
    shrink: _.partial(processSelectionIf, doShrink, selectionParser.isFocusNodeInSpan)
  };
};

function processSelectionIf(doFunc, predicate, data) {
  if (data && predicate(data.selection)) {
    return doFunc(data);
  }
  return data;
}

function moveSpan(editor, command, spanId, newSpan) {
  // Do not need move.
  if (spanId === _idFactory2['default'].makeSpanId(editor, newSpan)) {
    return undefined;
  }

  return [command.factory.spanMoveCommand(spanId, newSpan)];
}

function removeSpan(command, spanId) {
  return [command.factory.spanRemoveCommand(spanId)];
}

function DoCreate(model, command, typeContainer, spanManipulater, isDetectDelimiterEnable, isReplicateAuto, data) {
  var BLOCK_THRESHOLD = 100,
      newSpan = spanManipulater.create(data.selection, data.spanConfig);

  // The span cross exists spans.
  if ((0, _ModelAnnotationDataParseAnnotationValidateAnnotation.isBoundaryCrossingWithOtherSpans)(model.annotationData.span.all(), newSpan)) {
    return;
  }

  // The span exists already.
  if ((0, _ModelIsAlreadySpaned2['default'])(model.annotationData.span.all(), newSpan)) {
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
}

function expandSpanToSelection(editor, model, command, spanManipulater, spanId, data) {
  var newSpan = spanManipulater.expand(spanId, data.selection, data.spanConfig);

  // The span cross exists spans.
  if ((0, _ModelAnnotationDataParseAnnotationValidateAnnotation.isBoundaryCrossingWithOtherSpans)(model.annotationData.span.all(), newSpan)) {
    (0, _deferAlert2['default'])('A span cannot be expanded to make a boundary crossing.');
    return;
  }

  command.invoke(moveSpan(editor, command, spanId, newSpan));
}

function DoExpand(model, selectionParser, expandSpanToSelection, data) {
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
}

function shrinkSpanToSelection(editor, model, command, spanManipulater, spanId, data) {
  var newSpan = spanManipulater.shrink(spanId, data.selection, data.spanConfig);

  // The span cross exists spans.
  if ((0, _ModelAnnotationDataParseAnnotationValidateAnnotation.isBoundaryCrossingWithOtherSpans)(model.annotationData.span.all(), newSpan)) {
    (0, _deferAlert2['default'])('A span cannot be shrinked to make a boundary crossing.');
    return;
  }

  var newSpanId = _idFactory2['default'].makeSpanId(editor, newSpan),
      sameSpan = model.annotationData.span.get(newSpanId);

  command.invoke(newSpan.begin < newSpan.end && !sameSpan ? moveSpan(editor, command, spanId, newSpan) : removeSpan(command, spanId));
}

function DoShrink(model, selectionParser, doShrinkSpanToSelection, data) {
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
}
module.exports = exports['default'];

},{"../../Model/AnnotationData/parseAnnotation/validateAnnotation":218,"../../Model/isAlreadySpaned":231,"../../idFactory":356,"../spanAdjuster/blankSkipAdjuster":290,"../spanAdjuster/delimiterDetectAdjuster":291,"./SelectionParser":259,"./SpanManipulater":262,"./deferAlert":263,"babel-runtime/helpers/interop-require-default":17}],262:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _selectPosition = require('./selectPosition');

var _selectPosition2 = _interopRequireDefault(_selectPosition);

module.exports = function (model, spanAdjuster) {
  var createSpan = (function () {
    var toSpanPosition = function toSpanPosition(selection, spanConfig) {
      var positions = _selectPosition2['default'].toPositions(model.annotationData, selection);
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
    var getNewSpan = function getNewSpan(spanId, selectionRange, anchorNodeRange, focusPosition, spanConfig) {
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
      var focusPosition = _selectPosition2['default'].getFocusPosition(model.annotationData, selection);

      return getNewSpan(spanId, selection.range, anchorNodeRange, focusPosition, spanConfig);
    };
  })(),
      shortenSpan = (function () {
    var getNewSpan = function getNewSpan(spanId, selectionRange, focusNodeRange, focusPosition, spanConfig) {
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
      var focusPosition = _selectPosition2['default'].getFocusPosition(model.annotationData, selection);

      return getNewSpan(spanId, selection.range, focusNodeRange, focusPosition, spanConfig);
    };
  })();

  return {
    create: createSpan,
    expand: expandSpan,
    shrink: shortenSpan
  };
};

},{"./selectPosition":266,"babel-runtime/helpers/interop-require-default":17}],263:[function(require,module,exports){
"use strict";

module.exports = function (message) {
  // Show synchronous to smooth cancelation of selecton.
  _.defer(_.partial(alert, message));
};

},{}],264:[function(require,module,exports){
"use strict";

module.exports = function () {
  var selection = window.getSelection();
  selection.collapse(document.body, 0);
};

},{}],265:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _componentPallet = require('../../../component/Pallet');

var _componentPallet2 = _interopRequireDefault(_componentPallet);

var _dismissBrowserSelection = require('./dismissBrowserSelection');

var _dismissBrowserSelection2 = _interopRequireDefault(_dismissBrowserSelection);

var _ElementEditor = require('./ElementEditor');

var _ElementEditor2 = _interopRequireDefault(_ElementEditor);

exports['default'] = function (editor, model, spanConfig, command, modeAccordingToButton, typeContainer) {
  // will init.
  var elementEditor = new _ElementEditor2['default'](editor, model, spanConfig, command, modeAccordingToButton, typeContainer, function () {
    return cancelSelect(pallet, model.selectionModel);
  }),
      pallet = new _componentPallet2['default'](function (label) {
    return elementEditor.handler.changeTypeOfSelected(label);
  }, function (label) {
    return elementEditor.handler.typeContainer.setDefaultType(label);
  });

  return {
    editRelation: elementEditor.start.editRelation,
    editEntity: elementEditor.start.editEntity,
    noEdit: elementEditor.start.noEdit,
    showPallet: function showPallet(point) {
      return pallet.show(elementEditor.handler.typeContainer, point.point);
    },
    getTypeOfSelected: function getTypeOfSelected() {
      return elementEditor.handler.getSelectedType();
    },
    changeTypeOfSelected: function changeTypeOfSelected(newType) {
      return elementEditor.handler.changeTypeOfSelected(newType);
    },
    hideDialogs: pallet.hide,
    cancelSelect: (function (_cancelSelect) {
      function cancelSelect() {
        return _cancelSelect.apply(this, arguments);
      }

      cancelSelect.toString = function () {
        return _cancelSelect.toString();
      };

      return cancelSelect;
    })(function () {
      return cancelSelect(pallet, model.selectionModel);
    }),
    jsPlumbConnectionClicked: (function (_jsPlumbConnectionClicked) {
      function jsPlumbConnectionClicked(_x, _x2) {
        return _jsPlumbConnectionClicked.apply(this, arguments);
      }

      jsPlumbConnectionClicked.toString = function () {
        return _jsPlumbConnectionClicked.toString();
      };

      return jsPlumbConnectionClicked;
    })(function (jsPlumbConnection, event) {
      return jsPlumbConnectionClicked(elementEditor, jsPlumbConnection, event);
    }),
    getSelectedIdEditable: function getSelectedIdEditable() {
      return elementEditor.handler.getSelectedIdEditable();
    }
  };
};

function cancelSelect(pallet, selectionModel) {
  pallet.hide();
  selectionModel.clear();
  (0, _dismissBrowserSelection2['default'])();
}

// A relation is drawn by a jsPlumbConnection.
// The EventHandlar for clieck event of jsPlumbConnection.
function jsPlumbConnectionClicked(elementEditor, jsPlumbConnection, event) {
  // Check the event is processed already.
  // Because the jsPlumb will call the event handler twice
  // when a label is clicked that of a relation added after the initiation.
  if (elementEditor.handler.jsPlumbConnectionClicked && !event.processedByTextae) {
    elementEditor.handler.jsPlumbConnectionClicked(jsPlumbConnection, event);
  }

  event.processedByTextae = true;
}
module.exports = exports['default'];

},{"../../../component/Pallet":167,"./ElementEditor":256,"./dismissBrowserSelection":264,"babel-runtime/helpers/interop-require-default":17}],266:[function(require,module,exports){
"use strict";

var getPosition = function getPosition(paragraph, span, node) {
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
  for (var i = 0; childNodes[i] !== node; i++) {
    // until the focus node
    pos += childNodes[i].nodeName === "#text" ? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
  }

  return pos;
},
    getFocusPosition = function getFocusPosition(annotationData, selection) {
  var pos = getPosition(annotationData.paragraph, annotationData.span, selection.focusNode);
  pos += selection.focusOffset;
  return pos;
},
    getAnchorPosition = function getAnchorPosition(annotationData, selection) {
  var pos = getPosition(annotationData.paragraph, annotationData.span, selection.anchorNode);
  return pos + selection.anchorOffset;
},
    toPositions = function toPositions(annotationData, selection) {
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
  getFocusPosition: getFocusPosition
};

},{}],267:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _setButtonState = require('./setButtonState');

var _setButtonState2 = _interopRequireDefault(_setButtonState);

exports['default'] = function (writable, editMode, buttonController) {
  var latestWritableState = false,
      editModeEditable = false;

  writable(function (val) {
    latestWritableState = val;
    buttonController.buttonStateHelper.enabled("write", val && editModeEditable);
  });

  editMode.on('change', function (editable, mode) {
    return (0, _setButtonState2['default'])(buttonController, editable, mode);
  }).on('change', function (editable, mode) {
    // Enable the save button only at edit mode.
    editModeEditable = editable;

    if (editable) {
      buttonController.buttonStateHelper.enabled("write", latestWritableState);
    } else {
      buttonController.buttonStateHelper.enabled("write", false);
    }
  });
};

module.exports = exports['default'];

},{"./setButtonState":285,"babel-runtime/helpers/interop-require-default":17}],268:[function(require,module,exports){
"use strict";

module.exports = function (command, annotationData, selectionModel, clipBoard) {
  var copyEntities = function copyEntities() {
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
      pasteEntities = function pasteEntities() {
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

},{}],269:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _events = require('events');

var _replicate = require('./replicate');

var _replicate2 = _interopRequireDefault(_replicate);

var _createEntityToSelectedSpan = require('./createEntityToSelectedSpan');

var _createEntityToSelectedSpan2 = _interopRequireDefault(_createEntityToSelectedSpan);

var DefaultEntityHandler = function DefaultEntityHandler(command, annotationData, selectionModel, modeAccordingToButton, spanConfig, entity) {
  var emitter = new _events.EventEmitter(),
      replicateImple = function replicateImple() {
    (0, _replicate2['default'])(command, annotationData, modeAccordingToButton, spanConfig, selectionModel.span.single(), entity);
  },
      createEntityImple = function createEntityImple() {
    (0, _createEntityToSelectedSpan2['default'])(command, selectionModel.span.all(), entity);

    emitter.emit('createEntity');
  };

  return _.extend(emitter, {
    replicate: replicateImple,
    createEntity: createEntityImple
  });
};

module.exports = DefaultEntityHandler;

},{"./createEntityToSelectedSpan":278,"./replicate":281,"babel-runtime/helpers/interop-require-default":17,"events":108}],270:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (editMode) {
  return {
    toViewMode: editMode.pushView,
    toTermMode: editMode.pushTerm,
    toRelationMode: editMode.pushRelation
  };
};

module.exports = exports["default"];

},{}],271:[function(require,module,exports){
'use strict';

var toggleModification = require('./toggleModification');

module.exports = function (command, annotationData, modeAccordingToButton, typeEditor) {
  return {
    negation: function negation() {
      toggleModification(command, annotationData, modeAccordingToButton, 'Negation', typeEditor);
    },
    speculation: function speculation() {
      toggleModification(command, annotationData, modeAccordingToButton, 'Speculation', typeEditor);
    }
  };
};

},{"./toggleModification":282}],272:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _selectSpan = require('./selectSpan');

var _selectEntityLabel = require('./selectEntityLabel');

var _selectEntityLabel2 = _interopRequireDefault(_selectEntityLabel);

var _selectEntity = require('./selectEntity');

var _selectEntity2 = _interopRequireDefault(_selectEntity);

var _getNextElement = require('../../../getNextElement');

var _getEntityDom = require('../../../getEntityDom');

var _getEntityDom2 = _interopRequireDefault(_getEntityDom);

var SPAN_CLASS = 'textae-editor__span',
    GRID_CLASS = 'textae-editor__grid',
    LABEL_CLASS = 'textae-editor__type-label',
    TYPE_CLASS = 'textae-editor__type',
    ENTINY_CLASS = 'textae-editor__entity';

exports['default'] = function (editor, selectionModel) {
  var editorDom = editor[0];

  return {
    selectLeft: (function (_selectLeft) {
      function selectLeft(_x) {
        return _selectLeft.apply(this, arguments);
      }

      selectLeft.toString = function () {
        return _selectLeft.toString();
      };

      return selectLeft;
    })(function (option) {
      return selectLeft(editorDom, selectionModel, option.shiftKey);
    }),
    selectRight: (function (_selectRight) {
      function selectRight(_x2) {
        return _selectRight.apply(this, arguments);
      }

      selectRight.toString = function () {
        return _selectRight.toString();
      };

      return selectRight;
    })(function (option) {
      return selectRight(editorDom, selectionModel, option.shiftKey);
    }),
    selectUp: function selectUp() {
      return selectUpperLayer(editorDom, selectionModel);
    },
    selectDown: function selectDown() {
      return selectLowerLayer(editorDom, selectionModel);
    },
    selectLeftFunc: (function (_selectLeftFunc) {
      function selectLeftFunc() {
        return _selectLeftFunc.apply(this, arguments);
      }

      selectLeftFunc.toString = function () {
        return _selectLeftFunc.toString();
      };

      return selectLeftFunc;
    })(function () {
      return selectLeftFunc(editorDom, selectionModel);
    }),
    selectRightFunc: (function (_selectRightFunc) {
      function selectRightFunc() {
        return _selectRightFunc.apply(this, arguments);
      }

      selectRightFunc.toString = function () {
        return _selectRightFunc.toString();
      };

      return selectRightFunc;
    })(function () {
      return selectRightFunc(editorDom, selectionModel);
    })
  };
};

function selectLeft(editorDom, selectionModel, shiftKey) {
  var selectNext = selectLeftFunc(editorDom, selectionModel, shiftKey);
  selectNext();
}

function selectRight(editorDom, selectionModel, shiftKey) {
  var selectNext = selectRightFunc(editorDom, selectionModel, shiftKey);
  selectNext();
}

function selectUpperLayer(editorDom, selectionModel) {
  // When one span is selected.
  var spanId = selectionModel.span.single();
  if (spanId) {
    selectFirstEntityLabelOfSpan(selectionModel, spanId);
    return;
  }

  // When one entity label is selected.
  var labels = selectSelected(editorDom, LABEL_CLASS);
  if (labels.length === 1) {
    selectFirstEntityOfEntityLabel(selectionModel, labels[0]);
    return;
  }
}

function selectLowerLayer(editorDom, selectionModel) {
  // When one entity label is selected.
  var labels = selectSelected(editorDom, LABEL_CLASS);
  if (labels.length === 1) {
    selectSpanOfEntityLabel(selectionModel, labels[0]);
    return;
  }

  // When one entity is selected.
  var selectedEnities = selectSelected(editorDom, ENTINY_CLASS);
  if (selectedEnities.length === 1) {
    selectLabelOfEntity(selectionModel, selectedEnities[0]);
    return;
  }
}

function selectLeftFunc(editorDom, selectionModel, shiftKey) {
  var getNextFunc = function getNextFunc(selected) {
    return (0, _getNextElement.getLeftElement)(editorDom, selected[0]);
  };

  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc);
}

function selectRightFunc(editorDom, selectionModel, shiftKey) {
  var getNextFunc = function getNextFunc(selected) {
    return (0, _getNextElement.getRightElement)(editorDom, selected[selected.length - 1]);
  };

  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc);
}

function selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc) {
  var or = function or(className, func, next) {
    return selectOr(editorDom, className, func, selectionModel, shiftKey, next, getNextFunc);
  };

  var selectNext = or(SPAN_CLASS, _selectSpan.selectSpan, function () {
    return or(LABEL_CLASS, _selectEntityLabel2['default'], function () {
      return or(ENTINY_CLASS, _selectEntity2['default']);
    });
  });

  return selectNext;
}

function selectOr(editorDom, className, selectFunc, selectionModel, shiftKey, next, getNextFunc) {
  var selected = selectSelected(editorDom, className);

  if (selected.length) {
    var _ret = (function () {
      var nextElement = getNextFunc(selected);
      return {
        v: function () {
          return selectFunc(selectionModel, nextElement, shiftKey);
        }
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  } else {
    return next ? next() : function () {};
  }
}

function selectSelected(dom, className) {
  return dom.querySelectorAll('.' + className + '.ui-selected');
}

function selectFirstEntityLabelOfSpan(selectionModel, spanId) {
  var grid = document.querySelector('#G' + spanId);

  // Block span has no grid.
  if (grid) {
    var type = grid.querySelector('.' + TYPE_CLASS),
        label = type.querySelector('.' + LABEL_CLASS);

    (0, _selectEntityLabel2['default'])(selectionModel, label);
  }
}

function selectFirstEntityOfEntityLabel(selectionModel, label) {
  var pane = label.nextElementSibling;

  (0, _selectEntity2['default'])(selectionModel, pane.children[0]);
}

function selectSpanOfEntityLabel(selectionModel, label) {
  console.assert(label, 'A label MUST exists.');

  var spanId = label.closest('.' + GRID_CLASS).id.substring(1);
  (0, _selectSpan.selectSingleSpanById)(selectionModel, spanId);
}

function selectLabelOfEntity(selectionModel, entity) {
  console.assert(entity, 'An entity MUST exists.');

  (0, _selectEntityLabel2['default'])(selectionModel, entity.parentNode.previousElementSibling);
}
module.exports = exports['default'];

},{"../../../getEntityDom":352,"../../../getNextElement":353,"./selectEntity":273,"./selectEntityLabel":274,"./selectSpan":275,"babel-runtime/helpers/interop-require-default":17}],273:[function(require,module,exports){
/**
 * Select entity.
 * @param {object} selectionModel - this is the selectionModel.
 * @param {string} dom - dom of entity to select or array of ids of entities.
 * @param {bool} isMulti - select multi elements.
 * @return {undefined}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (selectionModel, dom, isMulti) {
  console.assert(selectionModel, 'selectionModel MUST exists.');

  // A entity may be null when the first or the last entity is selected at the Relation Edit Mode.
  if (dom) {
    if (!isMulti) selectionModel.clear();

    selectionModel.entity.add(dom.title);
  }
};

module.exports = exports['default'];

},{}],274:[function(require,module,exports){
'use strict';

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = selectEntityLabel;

var _selectEntity = require('./selectEntity');

var _selectEntity2 = _interopRequireDefault(_selectEntity);

function selectEntityLabel(selectionModel, dom, isMulti) {
  console.assert(selectionModel, 'selectionModel MUST exists');

  if (dom) {
    var pane = dom.nextElementSibling,
        allEntityOflabels = pane.children;

    if (!isMulti) selectionModel.clear();

    selectionModel.entity.add(_Array$from(allEntityOflabels).map(function (dom) {
      return dom.title;
    }));
  }
}

module.exports = exports['default'];

},{"./selectEntity":273,"babel-runtime/core-js/array/from":1,"babel-runtime/helpers/interop-require-default":17}],275:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.selectSpan = selectSpan;
exports.selectSingleSpanById = selectSingleSpanById;

function selectSpan(selectionModel, dom, isMulti) {
  console.assert(selectionModel, 'selectionModel MUST not undefined.');

  if (dom) {
    if (isMulti) {
      selectionModel.span.add(dom.id);
    } else {
      selectSingleSpanById(selectionModel, dom.id);
    }
  }
}

function selectSingleSpanById(selectionModel, spanId) {
  console.assert(selectionModel, 'selectionModel MUST not undefined.');

  if (spanId) {
    selectionModel.clear();
    selectionModel.span.add(spanId);
  }
}

},{}],276:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (modeAccordingToButton, editMode) {
  return {
    toggleSimpleMode: (function (_toggleSimpleMode) {
      function toggleSimpleMode() {
        return _toggleSimpleMode.apply(this, arguments);
      }

      toggleSimpleMode.toString = function () {
        return _toggleSimpleMode.toString();
      };

      return toggleSimpleMode;
    })(function () {
      return toggleSimpleMode(modeAccordingToButton, editMode);
    }),
    toggleDetectBoundaryMode: (function (_toggleDetectBoundaryMode) {
      function toggleDetectBoundaryMode() {
        return _toggleDetectBoundaryMode.apply(this, arguments);
      }

      toggleDetectBoundaryMode.toString = function () {
        return _toggleDetectBoundaryMode.toString();
      };

      return toggleDetectBoundaryMode;
    })(function () {
      return toggleDetectBoundaryMode(modeAccordingToButton);
    }),
    toggleInstaceRelation: (function (_toggleInstaceRelation) {
      function toggleInstaceRelation() {
        return _toggleInstaceRelation.apply(this, arguments);
      }

      toggleInstaceRelation.toString = function () {
        return _toggleInstaceRelation.toString();
      };

      return toggleInstaceRelation;
    })(function () {
      return toggleInstaceRelation(editMode);
    })
  };
};

function toggleSimpleMode(modeAccordingToButton, editMode) {
  if (modeAccordingToButton.simple.value()) {
    editMode.upSimple();
  } else {
    editMode.pushSimple();
  }
}

function toggleDetectBoundaryMode(modeAccordingToButton) {
  modeAccordingToButton['boundary-detection'].toggle();
}

function toggleInstaceRelation(editMode) {
  editMode.toggleInstaceRelation();
}
module.exports = exports['default'];

},{}],277:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (typeEditor) {
  if (typeEditor.getSelectedIdEditable().length > 0) {
    var currentType = typeEditor.getTypeOfSelected();

    var newType = prompt('Please enter a new label', currentType);
    if (newType) {
      typeEditor.changeTypeOfSelected(newType);
    }
  }
};

module.exports = exports['default'];

},{}],278:[function(require,module,exports){
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

},{}],279:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (command, selectionModel) {
  var spanIds = selectionModel.span.all(),
      entityIds = selectionModel.entity.all(),
      relationIds = selectionModel.relation.all();

  return getAll(command, spanIds, entityIds, relationIds);
};

function getAll(command, spanIds, entityIds, relationIds) {
  return [].concat(toRemoveRelationCommands(relationIds, command), toRemoveEntityCommands(entityIds, command), toRomeveSpanCommands(spanIds, command));
}

function toRomeveSpanCommands(spanIds, command) {
  return spanIds.map(command.factory.spanRemoveCommand);
}

function toRemoveEntityCommands(entityIds, command) {
  return command.factory.entityRemoveCommand(entityIds);
}

function toRemoveRelationCommands(relationIds, command) {
  return relationIds.map(command.factory.relationRemoveCommand);
}
module.exports = exports["default"];

},{}],280:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _RemoveCommandsFromSelection = require('./RemoveCommandsFromSelection');

var _RemoveCommandsFromSelection2 = _interopRequireDefault(_RemoveCommandsFromSelection);

exports['default'] = function (command, selectionModel, selectHandler) {
  var selectNext = selectHandler.selectRightFunc(),
      commands = new _RemoveCommandsFromSelection2['default'](command, selectionModel);

  command.invoke(commands);
  selectNext();
};

module.exports = exports['default'];

},{"./RemoveCommandsFromSelection":279,"babel-runtime/helpers/interop-require-default":17}],281:[function(require,module,exports){
'use strict';

var getDetectBoundaryFunc = function getDetectBoundaryFunc(modeAccordingToButton, spanConfig) {
  if (modeAccordingToButton['boundary-detection'].value()) return spanConfig.isDelimiter;else return null;
},
    replicate = function replicate(command, annotationData, modeAccordingToButton, spanConfig, spanId, entity) {
  var detectBoundaryFunc = getDetectBoundaryFunc(modeAccordingToButton, spanConfig);

  if (spanId) {
    command.invoke([command.factory.spanReplicateCommand(entity.getDefaultType(), annotationData.span.get(spanId), detectBoundaryFunc)]);
  } else {
    alert('You can replicate span annotation when there is only span selected.');
  }
};

module.exports = replicate;

},{}],282:[function(require,module,exports){
"use strict";

var isModificationType = function isModificationType(modification, modificationType) {
  return modification.pred === modificationType;
},
    getSpecificModification = function getSpecificModification(annotationData, id, modificationType) {
  return annotationData.getModificationOf(id).filter(function (modification) {
    return isModificationType(modification, modificationType);
  });
},
    removeModification = function removeModification(command, annotationData, modificationType, typeEditor) {
  return typeEditor.getSelectedIdEditable().map(function (id) {
    var modification = getSpecificModification(annotationData, id, modificationType)[0];
    return command.factory.modificationRemoveCommand(modification.id);
  });
},
    createModification = function createModification(command, annotationData, modificationType, typeEditor) {
  return _.reject(typeEditor.getSelectedIdEditable(), function (id) {
    return getSpecificModification(annotationData, id, modificationType).length > 0;
  }).map(function (id) {
    return command.factory.modificationCreateCommand({
      obj: id,
      pred: modificationType
    });
  });
},
    createCommand = function createCommand(command, annotationData, modificationType, typeEditor, has) {
  if (has) {
    return removeModification(command, annotationData, modificationType, typeEditor);
  } else {
    return createModification(command, annotationData, modificationType, typeEditor);
  }
},
    toggleModification = function toggleModification(command, annotationData, modeAccordingToButton, modificationType, typeEditor) {
  var has = modeAccordingToButton[modificationType.toLowerCase()].value(),
      commands = createCommand(command, annotationData, modificationType, typeEditor, has);
  command.invoke(commands);
};

module.exports = toggleModification;

},{}],283:[function(require,module,exports){
'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _componentSettingDialog = require('../../component/SettingDialog');

var _componentSettingDialog2 = _interopRequireDefault(_componentSettingDialog);

var _TypeEditor = require('./TypeEditor');

var _TypeEditor2 = _interopRequireDefault(_TypeEditor);

var _EditMode = require('./EditMode');

var _EditMode2 = _interopRequireDefault(_EditMode);

var _DisplayInstance = require('./DisplayInstance');

var _DisplayInstance2 = _interopRequireDefault(_DisplayInstance);

var _setDefaultEditability = require('./setDefaultEditability');

var _setDefaultEditability2 = _interopRequireDefault(_setDefaultEditability);

var _handlersChangeLabelHandler = require('./handlers/changeLabelHandler');

var _handlersChangeLabelHandler2 = _interopRequireDefault(_handlersChangeLabelHandler);

var _handlersClipBoardHandler = require('./handlers/ClipBoardHandler');

var _handlersClipBoardHandler2 = _interopRequireDefault(_handlersClipBoardHandler);

var _handlersDefaultEntityHandler = require('./handlers/DefaultEntityHandler');

var _handlersDefaultEntityHandler2 = _interopRequireDefault(_handlersDefaultEntityHandler);

var _handlersRemoveSelectedElements = require('./handlers/removeSelectedElements');

var _handlersRemoveSelectedElements2 = _interopRequireDefault(_handlersRemoveSelectedElements);

var _handlersModificationHandler = require('./handlers/ModificationHandler');

var _handlersModificationHandler2 = _interopRequireDefault(_handlersModificationHandler);

var _handlersSelectHandler = require('./handlers/SelectHandler');

var _handlersSelectHandler2 = _interopRequireDefault(_handlersSelectHandler);

var _handlersToggleButtonHandler = require('./handlers/ToggleButtonHandler');

var _handlersToggleButtonHandler2 = _interopRequireDefault(_handlersToggleButtonHandler);

var _handlersModeButtonHandlers = require('./handlers/ModeButtonHandlers');

var _handlersModeButtonHandlers2 = _interopRequireDefault(_handlersModeButtonHandlers);

var _enableSaveButtorAtEditable = require('./enableSaveButtorAtEditable');

var _enableSaveButtorAtEditable2 = _interopRequireDefault(_enableSaveButtorAtEditable);

exports['default'] = function (editor, model, view, command, spanConfig, clipBoard, buttonController, typeGap, typeContainer, writable) {
  var typeEditor = new _TypeEditor2['default'](editor, model, spanConfig, command, buttonController.modeAccordingToButton, typeContainer),
      editMode = new _EditMode2['default'](editor, model, typeEditor, buttonController.buttonStateHelper),
      displayInstance = new _DisplayInstance2['default'](typeGap, editMode),
      defaultEntityHandler = new _handlersDefaultEntityHandler2['default'](command, model.annotationData, model.selectionModel, buttonController.modeAccordingToButton, spanConfig, typeContainer.entity),
      clipBoardHandler = new _handlersClipBoardHandler2['default'](command, model.annotationData, model.selectionModel, clipBoard),
      modificationHandler = new _handlersModificationHandler2['default'](command, model.annotationData, buttonController.modeAccordingToButton, typeEditor),
      toggleButtonHandler = new _handlersToggleButtonHandler2['default'](buttonController.modeAccordingToButton, editMode),
      modeButtonHandlers = new _handlersModeButtonHandlers2['default'](editMode),
      selectHandler = new _handlersSelectHandler2['default'](editor, model.selectionModel),
      showSettingDialog = new _componentSettingDialog2['default'](editor, displayInstance),
      editorSelected = function editorSelected() {
    typeEditor.hideDialogs();

    // Select this editor.
    editor.eventEmitter.emit('textae.editor.select');
    buttonController.buttonStateHelper.propagate();
  },
      event = {
    editorSelected: editorSelected,
    copyEntities: clipBoardHandler.copyEntities,
    removeSelectedElements: function removeSelectedElements() {
      return (0, _handlersRemoveSelectedElements2['default'])(command, model.selectionModel, selectHandler);
    },
    createEntity: defaultEntityHandler.createEntity,
    showPallet: typeEditor.showPallet,
    replicate: defaultEntityHandler.replicate,
    pasteEntities: clipBoardHandler.pasteEntities,
    changeLabel: function changeLabel() {
      return (0, _handlersChangeLabelHandler2['default'])(typeEditor);
    },
    cancelSelect: typeEditor.cancelSelect,
    negation: modificationHandler.negation,
    speculation: modificationHandler.speculation,
    showSettingDialog: showSettingDialog
  };

  _Object$assign(event, selectHandler);
  _Object$assign(event, toggleButtonHandler);
  _Object$assign(event, modeButtonHandlers);

  (0, _enableSaveButtorAtEditable2['default'])(writable, editMode, buttonController);

  return {
    init: function init(mode) {
      // The jsPlumbConnetion has an original event mecanism.
      // We can only bind the connection directory.
      editor.on('textae.editor.jsPlumbConnection.add', function (event, jsPlumbConnection) {
        jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked);
      });

      defaultEntityHandler.on('createEntity', displayInstance.notifyNewInstance);
      (0, _setDefaultEditability2['default'])(model.annotationData, editMode, writable, mode);
    },
    event: event
  };
};

module.exports = exports['default'];

},{"../../component/SettingDialog":169,"./DisplayInstance":233,"./EditMode":241,"./TypeEditor":265,"./enableSaveButtorAtEditable":267,"./handlers/ClipBoardHandler":268,"./handlers/DefaultEntityHandler":269,"./handlers/ModeButtonHandlers":270,"./handlers/ModificationHandler":271,"./handlers/SelectHandler":272,"./handlers/ToggleButtonHandler":276,"./handlers/changeLabelHandler":277,"./handlers/removeSelectedElements":280,"./setDefaultEditability":287,"babel-runtime/core-js/object/assign":5,"babel-runtime/helpers/interop-require-default":17}],284:[function(require,module,exports){
// Change view mode accoding to the annotation data.
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (annotationData) {
  return !annotationData.relation.some() && annotationData.span.multiEntities().length === 0;
};

module.exports = exports["default"];

},{}],285:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = setButtonState;

function setButtonState(buttonController, editable, mode) {
  buttonController.modeAccordingToButton.view.value(isView(editable));
  buttonController.modeAccordingToButton.term.value(isTerm(editable, mode));
  buttonController.modeAccordingToButton.relation.value(isRelation(mode));
  buttonController.modeAccordingToButton.simple.value(isSimple(mode));
  buttonController.buttonStateHelper.enabled('simple', !isRelation(mode));
  buttonController.buttonStateHelper.enabled('replicate-auto', isSpanEdit(editable, mode));
  buttonController.buttonStateHelper.enabled('boundary-detection', isSpanEdit(editable, mode));
  buttonController.buttonStateHelper.enabled('line-height', editable);
}

function isView(editable) {
  return !editable;
}

function isTerm(editable, mode) {
  return editable && (mode === 'term' || mode === 'instance');
}

function isRelation(mode) {
  return mode === 'relation';
}

function isSimple(mode) {
  return mode === 'term';
}

function isSpanEdit(editable, mode) {
  return editable && mode !== 'relation';
}
module.exports = exports['default'];

},{}],286:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.forEditable = forEditable;
exports.forView = forView;

var _isSimple = require('../isSimple');

var _isSimple2 = _interopRequireDefault(_isSimple);

function forEditable(editMode, annotationData) {
  if ((0, _isSimple2['default'])(annotationData)) {
    editMode.toTerm();
  } else {
    editMode.toInstance();
  }
}

function forView(editMode, annotationData) {
  if ((0, _isSimple2['default'])(annotationData)) {
    editMode.toViewTerm();
  } else {
    editMode.toViewInstance();
  }
}

},{"../isSimple":284,"babel-runtime/helpers/interop-require-default":17}],287:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _changeView = require('./changeView');

var changeView = _interopRequireWildcard(_changeView);

var _showLoadNoticeForEditableMode = require('./showLoadNoticeForEditableMode');

var _showLoadNoticeForEditableMode2 = _interopRequireDefault(_showLoadNoticeForEditableMode);

var _updateWritable = require('./updateWritable');

var _updateWritable2 = _interopRequireDefault(_updateWritable);

exports['default'] = function (annotationData, editMode, writable, mode) {
  annotationData.on('all.change', function (annotationData, multitrack, reject) {
    return (0, _updateWritable2['default'])(multitrack, reject, writable);
  });

  var editable = mode === 'edit';
  if (editable) {
    var showForEdit = function showForEdit(annotationData, multitrack, reject) {
      return (0, _showLoadNoticeForEditableMode2['default'])(multitrack);
    };

    annotationData.on('all.change', showForEdit).on('all.change', function (annotationData) {
      return changeView.forEditable(editMode, annotationData);
    });
  } else {
    annotationData.on('all.change', function (annotationData) {
      return changeView.forView(editMode, annotationData);
    });
  }
};

module.exports = exports['default'];

},{"./changeView":286,"./showLoadNoticeForEditableMode":288,"./updateWritable":289,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/interop-require-wildcard":18}],288:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (multitrack) {
  if (multitrack) {
    toastr.success("track annotations have been merged to root annotations.");
  }
};

module.exports = exports["default"];

},{}],289:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ModelAnnotationDataParseAnnotationValidateAnnotation = require('../../Model/AnnotationData/parseAnnotation/validateAnnotation');

exports['default'] = function (multitrack, reject, writable) {
  writable.forceModified(false);

  if (multitrack) {
    writable.forceModified(true);
  }

  if ((0, _ModelAnnotationDataParseAnnotationValidateAnnotation.hasError)(reject)) {
    writable.forceModified(true);
  }
};

module.exports = exports['default'];

},{"../../Model/AnnotationData/parseAnnotation/validateAnnotation":218}],290:[function(require,module,exports){
'use strict';

var skipBlank = require('./skipBlank');

module.exports = {
  backFromBegin: function backFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter);
  },
  forwardFromEnd: function forwardFromEnd(str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter);
  },
  forwardFromBegin: function forwardFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter);
  },
  backFromEnd: function backFromEnd(str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter);
  }
};

},{"./skipBlank":292}],291:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _skipCharacters = require('./skipCharacters');

var _skipCharacters2 = _interopRequireDefault(_skipCharacters);

var _skipBlank = require('./skipBlank');

var _skipBlank2 = _interopRequireDefault(_skipBlank);

var getPrev = function getPrev(str, position) {
  return [str.charAt(position), str.charAt(position - 1)];
},
    getNext = function getNext(str, position) {
  return [str.charAt(position), str.charAt(position + 1)];
},
    backToDelimiter = function backToDelimiter(str, position, isDelimiter) {
  return (0, _skipCharacters2['default'])(getPrev, -1, str, position, function (chars) {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1]);
  });
},
    skipToDelimiter = function skipToDelimiter(str, position, isDelimiter) {
  return (0, _skipCharacters2['default'])(getNext, 1, str, position, function (chars) {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
    // Return false to stop an infinite loop when the character undefined.
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1]);
  });
},
    isNotWord = function isNotWord(isBlankCharacter, isDelimiter, chars) {
  // The word is (no charactor || blank || delimiter)(!delimiter).
  return chars[0] !== '' && !isBlankCharacter(chars[1]) && !isDelimiter(chars[1]) || isDelimiter(chars[0]);
},
    skipToWord = function skipToWord(str, position, isWordEdge) {
  return (0, _skipCharacters2['default'])(getPrev, 1, str, position, isWordEdge);
},
    backToWord = function backToWord(str, position, isWordEdge) {
  return (0, _skipCharacters2['default'])(getNext, -1, str, position, isWordEdge);
},
    backFromBegin = function backFromBegin(str, beginPosition, spanConfig) {
  var nonEdgePos = _skipBlank2['default'].forward(str, beginPosition, spanConfig.isBlankCharacter),
      nonDelimPos = backToDelimiter(str, nonEdgePos, spanConfig.isDelimiter);

  return nonDelimPos;
},
    forwardFromEnd = function forwardFromEnd(str, endPosition, spanConfig) {
  var nonEdgePos = _skipBlank2['default'].back(str, endPosition, spanConfig.isBlankCharacter),
      nonDelimPos = skipToDelimiter(str, nonEdgePos, spanConfig.isDelimiter);

  return nonDelimPos;
},

// adjust the beginning position of a span for shortening
forwardFromBegin = function forwardFromBegin(str, beginPosition, spanConfig) {
  var isWordEdge = _.partial(isNotWord, spanConfig.isBlankCharacter, spanConfig.isDelimiter);
  return skipToWord(str, beginPosition, isWordEdge);
},

// adjust the end position of a span for shortening
backFromEnd = function backFromEnd(str, endPosition, spanConfig) {
  var isWordEdge = _.partial(isNotWord, spanConfig.isBlankCharacter, spanConfig.isDelimiter);
  return backToWord(str, endPosition, isWordEdge);
};

module.exports = {
  backFromBegin: backFromBegin,
  forwardFromEnd: forwardFromEnd,
  forwardFromBegin: forwardFromBegin,
  backFromEnd: backFromEnd
};

},{"./skipBlank":292,"./skipCharacters":293,"babel-runtime/helpers/interop-require-default":17}],292:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _skipCharacters = require('./skipCharacters');

var _skipCharacters2 = _interopRequireDefault(_skipCharacters);

var getNow = function getNow(str, position) {
  return str.charAt(position);
},
    skipForwardBlank = function skipForwardBlank(str, position, isBlankCharacter) {
  return (0, _skipCharacters2['default'])(getNow, 1, str, position, isBlankCharacter);
},
    skipBackBlank = function skipBackBlank(str, position, isBlankCharacter) {
  return (0, _skipCharacters2['default'])(getNow, -1, str, position, isBlankCharacter);
};

module.exports = {
  forward: skipForwardBlank,
  back: skipBackBlank
};

},{"./skipCharacters":293,"babel-runtime/helpers/interop-require-default":17}],293:[function(require,module,exports){
"use strict";

module.exports = function (getChars, step, str, position, predicate) {
  while (predicate(getChars(str, position))) position += step;

  return position;
};

},{}],294:[function(require,module,exports){
"use strict";

var defaults = {
  "delimiter characters": [" ", ".", "!", "?", ",", ":", ";", "-", "/", "&", "(", ")", "{", "}", "[", "]", "+", "*", "\\", "\"", "'", "\n", "–"],
  "non-edge characters": [" ", "\n"]
};

module.exports = function () {
  var delimiterCharacters = [],
      blankCharacters = [],
      set = function set(config) {
    var settings = _.extend({}, defaults, config);

    delimiterCharacters = settings['delimiter characters'];
    blankCharacters = settings['non-edge characters'];
    return config;
  },
      reset = _.partial(set, defaults),
      isDelimiter = function isDelimiter(char) {
    if (delimiterCharacters.indexOf('ANY') >= 0) {
      return 1;
    }
    return delimiterCharacters.indexOf(char) >= 0;
  },
      isBlankCharacter = function isBlankCharacter(char) {
    return blankCharacters.indexOf(char) >= 0;
  },
      removeBlankChractors = function removeBlankChractors(str) {
    blankCharacters.forEach(function (char) {
      str = str.replace(char, '');
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

},{}],295:[function(require,module,exports){
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _utilReduce2hash = require('../../util/reduce2hash');

var _utilReduce2hash2 = _interopRequireDefault(_utilReduce2hash);

var _uri = require('../uri');

var _uri2 = _interopRequireDefault(_uri);

var DEFAULT_TYPE = 'something',
    TypeContainer = function TypeContainer(getActualTypesFunction, defaultColor) {
  var definedTypes = {},
      defaultType = DEFAULT_TYPE;

  return {
    setDefinedTypes: function setDefinedTypes(newDefinedTypes) {
      definedTypes = newDefinedTypes;
    },
    getDeinedTypes: function getDeinedTypes() {
      return _.extend({}, definedTypes);
    },
    setDefaultType: function setDefaultType(name) {
      defaultType = name;
    },
    getDefaultType: function getDefaultType() {
      return defaultType || this.getSortedNames()[0];
    },
    getColor: function getColor(name) {
      return definedTypes[name] && definedTypes[name].color || defaultColor;
    },
    getUri: function getUri(name) {
      return definedTypes[name] && definedTypes[name].uri || _uri2['default'].getUrlMatches(name) ? name : undefined;
    },
    getSortedNames: function getSortedNames() {
      if (getActualTypesFunction) {
        var typeCount = getActualTypesFunction().concat(_Object$keys(definedTypes)).reduce(function (a, b) {
          a[b] = a[b] ? a[b] + 1 : 1;
          return a;
        }, {});

        // Sort by number of types, and by name if numbers are same.
        var typeNames = _Object$keys(typeCount);
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
    setContainerDefinedTypes = function setContainerDefinedTypes(container, newDefinedTypes) {
  // expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
  if (newDefinedTypes !== undefined) {
    container.setDefinedTypes(newDefinedTypes.reduce(_utilReduce2hash2['default'], {}));
    container.setDefaultType(newDefinedTypes.filter(function (type) {
      return type['default'] === true;
    }).map(function (type) {
      return type.name;
    }).shift() || DEFAULT_TYPE);
  }
};

module.exports = function (model) {
  var entityContainer = _.extend(new TypeContainer(model.annotationData.entity.types, '#77DDDD'), {
    isBlock: function isBlock(type) {
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

},{"../../util/reduce2hash":372,"../uri":360,"babel-runtime/core-js/object/keys":9,"babel-runtime/helpers/interop-require-default":17}],296:[function(require,module,exports){
'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _GridLayout = require('./GridLayout');

var _GridLayout2 = _interopRequireDefault(_GridLayout);

var _events = require('events');

exports['default'] = function (editor, annotationData, typeContainer, arrangePositionAllRelation) {
  var emitter = new _events.EventEmitter(),
      gridLayout = new _GridLayout2['default'](editor, annotationData, typeContainer),
      update = function update(typeGapValue) {
    emitter.emit('render.start', editor);

    // Do asynchronous to change behavior of editor.
    // For example a wait cursor or a disabled control.
    _.defer(function () {
      return gridLayout.arrangePosition(typeGapValue).then(function () {
        return renderLazyRelationAll(annotationData.relation.all());
      }).then(arrangePositionAllRelation).then(function () {
        return emitter.emit('render.end', editor);
      })['catch'](function (error) {
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
  return _Promise.all(relations.filter(function (connect) {
    return connect.render;
  }).map(function (connect) {
    return connect.render();
  }));
}
module.exports = exports['default'];

},{"./GridLayout":302,"babel-runtime/core-js/promise":11,"babel-runtime/helpers/interop-require-default":17,"events":108}],297:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _LesserMap = require('./LesserMap');

var _LesserMap2 = _interopRequireDefault(_LesserMap);

exports['default'] = function () {
  var caches = [],
      factory = function factory(getter) {
    return create(caches, getter);
  };

  factory.clearAllCache = function () {
    return clearAll(caches);
  };
  return factory;
};

function create(caches, getter) {
  var map = new _LesserMap2['default']();

  add(caches, map);
  return function (id) {
    return getFromCache(map, getter, id);
  };
}

function add(caches, cache) {
  caches.push(cache);
}

function getFromCache(cache, getter, id) {
  if (!cache.has(id)) {
    cache.set(id, getter(id));
  }

  return cache.get(id);
}

function clearAll(caches) {
  caches.forEach(function (cache) {
    return cache.clear();
  });
}
module.exports = exports['default'];

},{"./LesserMap":299,"babel-runtime/helpers/interop-require-default":17}],298:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _LesserMap = require('./LesserMap');

var _LesserMap2 = _interopRequireDefault(_LesserMap);

exports['default'] = function (entityModel) {
  // The chache for position of grids.
  // This is updated at arrange position of grids.
  // This is referenced at create or move relations.
  var map = new _LesserMap2['default']();

  return _.extend(map, {
    isGridPrepared: (function (_isGridPrepared) {
      function isGridPrepared(_x) {
        return _isGridPrepared.apply(this, arguments);
      }

      isGridPrepared.toString = function () {
        return _isGridPrepared.toString();
      };

      return isGridPrepared;
    })(function (entityId) {
      return isGridPrepared(entityModel, map, entityId);
    })
  });
};

function isGridPrepared(entityModel, map, entityId) {
  var spanId = entityModel.get(entityId).span;
  return map.get(spanId);
}
module.exports = exports['default'];

},{"./LesserMap":299,"babel-runtime/helpers/interop-require-default":17}],299:[function(require,module,exports){
'use strict';

var _Map = require('babel-runtime/core-js/map')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var publicApis = ['set', 'get', 'has', 'keys', 'delete', 'clear'];

exports['default'] = function () {
  var m = new _Map(),
      api = publicApis.reduce(function (api, name) {
    api[name] = _Map.prototype[name].bind(m);
    return api;
  }, {});

  return api;
};

module.exports = exports['default'];

},{"babel-runtime/core-js/map":4}],300:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CachedGetterFactory = require('./CachedGetterFactory');

var _CachedGetterFactory2 = _interopRequireDefault(_CachedGetterFactory);

var _getEntityDom = require('../../getEntityDom');

var _getEntityDom2 = _interopRequireDefault(_getEntityDom);

var factory = new _CachedGetterFactory2['default']();

exports['default'] = function (editor, entityModel, gridPositionCache) {
  // The cache for span positions.
  // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
  // This cache is big effective for the initiation, and little effective for resize.
  var cachedGetSpan = factory(function (spanId) {
    return getSpan(editor, spanId);
  }),
      cachedGetEntity = factory(function (entityId) {
    return getEntity(editor, entityModel, gridPositionCache, entityId);
  });

  return {
    reset: factory.clearAllCache,
    getSpan: cachedGetSpan,
    getEntity: cachedGetEntity
  };
};

function getSpan(editor, spanId) {
  var span = editor[0].querySelector('#' + spanId);
  if (!span) {
    throw new Error("span is not renderd : " + spanId);
  }

  // An element.offsetTop and element.offsetLeft does not work in the Firefox,
  // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
  var spanBox = span.getBoundingClientRect(),
      textBox = span.offsetParent.offsetParent.getBoundingClientRect();

  return {
    top: spanBox.top - textBox.top,
    left: spanBox.left - textBox.left,
    width: span.offsetWidth,
    height: span.offsetHeight,
    center: span.offsetLeft + span.offsetWidth / 2
  };
}

function getEntity(editor, entityModel, gridPositionCache, entityId) {
  var entity = (0, _getEntityDom2['default'])(editor[0], entityId);
  if (!entity) {
    throw new Error("entity is not rendered : " + entityId);
  }

  var spanId = entityModel.get(entityId).span,
      gridPosition = gridPositionCache.get(spanId);

  return {
    top: gridPosition.top + entity.offsetTop,
    center: gridPosition.left + entity.offsetLeft + entity.offsetWidth / 2
  };
}
module.exports = exports['default'];

},{"../../getEntityDom":352,"./CachedGetterFactory":297,"babel-runtime/helpers/interop-require-default":17}],301:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _GridPosition = require('./GridPosition');

var _GridPosition2 = _interopRequireDefault(_GridPosition);

var _SpanAndEntityPosition = require('./SpanAndEntityPosition');

var _SpanAndEntityPosition2 = _interopRequireDefault(_SpanAndEntityPosition);

var _LesserMap = require('./LesserMap');

var _LesserMap2 = _interopRequireDefault(_LesserMap);

// Utility functions for get positions of DOM elemnts.

exports['default'] = function (editor, entityModel) {
  // The editor has onry one position cache.
  editor.postionCache = editor.postionCache || create(editor, entityModel);
  return editor.postionCache;
};

function create(editor, entityModel) {
  var gridPosition = new _GridPosition2['default'](entityModel),
      spanAndEntityPosition = new _SpanAndEntityPosition2['default'](editor, entityModel, gridPosition),
      grid = new GridApi(gridPosition),
      relation = new RelationApi();

  return _.extend(spanAndEntityPosition, grid, relation);
}

function GridApi(gridPosition) {
  return {
    gridPositionCache: gridPosition,
    getGrid: gridPosition.get,
    setGrid: gridPosition.set
  };
}

function RelationApi() {
  var newCache = new _LesserMap2['default'](),

  // The connectCache has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
  api = {
    connectCache: newCache,
    toConnect: function toConnect(relationId) {
      return newCache.get(relationId);
    }
  };

  return api;
}
module.exports = exports['default'];

},{"./GridPosition":298,"./LesserMap":299,"./SpanAndEntityPosition":300,"babel-runtime/helpers/interop-require-default":17}],302:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _DomPositionCache = require('./DomPositionCache');

var _DomPositionCache2 = _interopRequireDefault(_DomPositionCache);

var _getGridPosition = require('./getGridPosition');

var _getGridPosition2 = _interopRequireDefault(_getGridPosition);

var filterVisibleGrid = function filterVisibleGrid(grid) {
  if (grid && grid.hasClass('hidden')) {
    return grid;
  }
},
    showGrid = function showGrid(grid) {
  if (grid) {
    grid.removeClass('hidden');
  }
},
    filterMoved = function filterMoved(oldPosition, newPosition) {
  if (!oldPosition || oldPosition.top !== newPosition.top || oldPosition.left !== newPosition.left) {
    return newPosition;
  } else {
    return null;
  }
},
    doIfSpan = function doIfSpan(func, span) {
  if (span) {
    return func(span.id);
  }
};

// Management position of annotation components.
module.exports = function (editor, annotationData, typeContainer) {
  var domPositionCaChe = new _DomPositionCache2['default'](editor, annotationData.entity),
      getGridOfSpan = function getGridOfSpan(spanId) {
    return $(document.querySelector('#G' + spanId));
  },
      getGrid = _.partial(doIfSpan, getGridOfSpan),
      updatePositionCache = function updatePositionCache(span, newPosition) {
    if (newPosition) {
      domPositionCaChe.setGrid(span.id, newPosition);
      return span;
    }
  },
      updateGridPositon = function updateGridPositon(span, newPosition) {
    if (newPosition) {
      getGrid(span).css(newPosition);
      return newPosition;
    }
  },
      arrangeGridPosition = function arrangeGridPosition(typeGapValue, span) {
    var getNewPosition = _.partial(_getGridPosition2['default'], domPositionCaChe.getSpan, getGridOfSpan, typeContainer, typeGapValue),
        moveTheGridIfChange = _.compose(_.partial(updatePositionCache, span), _.partial(updateGridPositon, span), _.partial(filterMoved, domPositionCaChe.getGrid(span.id)), _.partial(getNewPosition)),
        showInvisibleGrid = _.compose(showGrid, filterVisibleGrid, getGrid);

    // The span may be remeved because this functon is call asynchronously.
    if (annotationData.span.get(span.id)) {
      // Move all relations because entities are increased or decreased unless the grid is moved.
      _.compose(showInvisibleGrid, moveTheGridIfChange)(span);
    }
  },
      arrangeGridPositionPromise = function arrangeGridPositionPromise(typeGapValue, span) {
    return new _bluebird2['default'](function (resolve, reject) {
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
      arrangeGridPositionAll = function arrangeGridPositionAll(typeGapValue) {
    return annotationData.span.all().filter(function (span) {
      // There is at least one type in span that has a grid.
      return span.getTypes().length > 0;
    }).map(function (span) {
      // Cache all span position because alternating between getting offset and setting offset.
      domPositionCaChe.getSpan(span.id);
      return span;
    }).map(_.partial(arrangeGridPositionPromise, typeGapValue));
  },
      arrangePositionAll = function arrangePositionAll(typeGapValue) {
    domPositionCaChe.reset();
    return _bluebird2['default'].all(arrangeGridPositionAll(typeGapValue));
  };

  return {
    arrangePosition: arrangePositionAll
  };
};

},{"./DomPositionCache":301,"./getGridPosition":344,"babel-runtime/helpers/interop-require-default":17,"bluebird":104}],303:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _DomPositionCache = require('./DomPositionCache');

var _DomPositionCache2 = _interopRequireDefault(_DomPositionCache);

exports['default'] = function (editor, entity) {
    var domPositionCaChe = new _DomPositionCache2['default'](editor, entity);

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
module.exports = exports['default'];

},{"./DomPositionCache":301,"babel-runtime/helpers/interop-require-default":17}],304:[function(require,module,exports){
// Arrange a position of the pane to center entities when entities width is longer than pane width.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (pane) {
  var paneWidth = pane.offsetWidth,
      widthOfentities = Array.prototype.map.call(pane.children, function (e) {
    return e.offsetWidth;
  }).reduce(function (sum, width) {
    return sum + width;
  }, 0);

  if (widthOfentities > paneWidth) {
    pane.style.left = (paneWidth - widthOfentities) / 2 + 'px';
  } else {
    pane.style.left = null;
  }
};

module.exports = exports['default'];

},{}],305:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _Selector = require('../../Selector');

var _Selector2 = _interopRequireDefault(_Selector);

var _createEntityUnlessBlock = require('./createEntityUnlessBlock');

var _createEntityUnlessBlock2 = _interopRequireDefault(_createEntityUnlessBlock);

var _removeEntityElement = require('./removeEntityElement');

var _removeEntityElement2 = _interopRequireDefault(_removeEntityElement);

exports['default'] = function (editor, model, typeContainer, gridRenderer, modification, entity) {
    var selector = new _Selector2['default'](editor, model);

    // Remove an old entity.
    (0, _removeEntityElement2['default'])(editor, model.annotationData, entity);

    // Show a new entity.
    (0, _createEntityUnlessBlock2['default'])(editor, model.annotationData.namespace, typeContainer, gridRenderer, modification, entity);

    // Re-select a new entity instance.
    if (model.selectionModel.entity.has(entity.id)) {
        selector.entity.select(entity.id);
        selector.entityLabel.update(entity.id);
    }
};

module.exports = exports['default'];

},{"../../Selector":341,"./createEntityUnlessBlock":308,"./removeEntityElement":312,"babel-runtime/helpers/interop-require-default":17}],306:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _idFactory = require('../../../idFactory');

var _idFactory2 = _interopRequireDefault(_idFactory);

var _getTypeElement = require('./getTypeElement');

var _getTypeElement2 = _interopRequireDefault(_getTypeElement);

var _arrangePositionOfPane = require('./arrangePositionOfPane');

var _arrangePositionOfPane2 = _interopRequireDefault(_arrangePositionOfPane);

var _createEntityElement = require('./createEntityElement');

var _createEntityElement2 = _interopRequireDefault(_createEntityElement);

// An entity is a circle on Type that is an endpoint of a relation.
// A span have one grid and a grid can have multi types and a type can have multi entities.
// A grid is only shown when at least one entity is owned by a correspond span.

exports['default'] = function (editor, namspace, typeContainer, gridRenderer, modification, entity) {
  // Replace null to 'null' if type is null and undefined too.
  entity.type = String(entity.type);

  // Append a new entity to the type
  var $pane = (0, _getTypeElement2['default'])(namspace, typeContainer, gridRenderer, entity.span, entity.type).find('.textae-editor__entity-pane'),
      entityDomId = _idFactory2['default'].makeEntityDomId(editor, entity.id);

  if ($pane.find('#' + entityDomId).length === 0) {
    $pane.append((0, _createEntityElement2['default'])(editor, typeContainer, modification, entity));
    (0, _arrangePositionOfPane2['default'])($pane[0]);
  }
};

module.exports = exports['default'];

},{"../../../idFactory":356,"./arrangePositionOfPane":304,"./createEntityElement":307,"./getTypeElement":310,"babel-runtime/helpers/interop-require-default":17}],307:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createEntityElement;

var _idFactory = require('../../../idFactory');

var _idFactory2 = _interopRequireDefault(_idFactory);

var _getTypeElement = require('./getTypeElement');

var _getTypeElement2 = _interopRequireDefault(_getTypeElement);

function createEntityElement(editor, typeContainer, modification, entity) {
  var element = document.createElement('div');

  element.setAttribute('id', _idFactory2['default'].makeEntityDomId(editor, entity.id));
  element.setAttribute('title', entity.id);
  element.setAttribute('type', entity.type);
  element.classList.add('textae-editor__entity');

  element.style.borderColor = typeContainer.entity.getColor(entity.type);

  // Set css classes for modifications.
  modification.getClasses(entity.id).forEach(function (c) {
    element.classList.add(c);
  });

  return element;
}

module.exports = exports['default'];

},{"../../../idFactory":356,"./getTypeElement":310,"babel-runtime/helpers/interop-require-default":17}],308:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

exports['default'] = function (editor, namespace, typeContainer, gridRenderer, modification, entity) {
  if (!typeContainer.entity.isBlock(entity.type)) {
    (0, _create2['default'])(editor, namespace, typeContainer, gridRenderer, modification, entity);
  }
};

module.exports = exports['default'];

},{"./create":306,"babel-runtime/helpers/interop-require-default":17}],309:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uri = require('../../../uri');

var _uri2 = _interopRequireDefault(_uri);

// Display short name for URL(http or https);

exports['default'] = function (type) {
  // For tunning, search the scheme before execute a regular-expression.
  if (_uri2['default'].isUri(type)) {
    var matches = _uri2['default'].getUrlMatches(type);

    if (matches) {
      // Order to dispaly.
      // 1. The anchor without #.
      if (matches[9]) return matches[9].slice(1);

      // 2. The file name with the extention.
      if (matches[6]) return matches[6] + (matches[7] || '');

      // 3. The last directory name.
      // Exclude slash only. cf. http://hoge.com/
      if (matches[5] && matches[5].length > 1) return matches[5].split('/').filter(function (s) {
        return s !== '';
      }).pop();

      // 4. The domain name.
      return matches[3];
    }
  }
  return type;
};

module.exports = exports['default'];

},{"../../../uri":360,"babel-runtime/helpers/interop-require-default":17}],310:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _idFactory = require('../../../idFactory');

var _idFactory2 = _interopRequireDefault(_idFactory);

var _uri = require('../../../uri');

var _uri2 = _interopRequireDefault(_uri);

var _getDisplayName = require('./getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _getTypeDom = require('../getTypeDom');

var _getTypeDom2 = _interopRequireDefault(_getTypeDom);

// render type unless exists.

exports['default'] = function (namespace, typeContainer, gridRenderer, spanId, type) {
  var $type = (0, _getTypeDom2['default'])(spanId, type);
  if ($type.length === 0) {
    $type = createEmptyTypeDomElement(namespace, typeContainer, spanId, type);
    getGrid(gridRenderer, spanId).appendChild($type[0]);
  }

  return $type;
};

function getMatchPrefix(namespace, type) {
  var namespaces = namespace.all(),
      matchs = namespaces.filter(function (namespace) {
    return namespace.prefix !== '_base';
  }).filter(function (namespace) {
    return type.indexOf(namespace.prefix + ':') === 0;
  });

  if (matchs.length === 1) return matchs[0];

  return null;
}

function getUri(namespace, typeContainer, type) {
  if (_uri2['default'].isUri(type)) {
    return type;
  } else if (typeContainer.entity.getUri(type)) {
    return typeContainer.entity.getUri(type);
  } else if (namespace.some()) {
    var match = getMatchPrefix(namespace, type);
    if (match) {
      return match.uri + type.replace(match.prefix + ':', '');
    }

    var base = namespace.all().filter(function (namespace) {
      return namespace.prefix === '_base';
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

  if (_uri2['default'].isUri(type)) {
    displayName = (0, _getDisplayName2['default'])(type);
  } else if (match) {
    displayName = type.replace(match.prefix + ':', '');
  } else {
    displayName = type;
  }

  var child = undefined,
      href = getUri(namespace, typeContainer, type);

  if (href) {
    child = '<a target="_blank"/ href="' + href + '">' + displayName + '</a>';
  } else {
    child = displayName;
  }

  typeLabel.innerHTML = child;
}

// A Type element has an entity_pane elment that has a label and will have entities.
function createEmptyTypeDomElement(namespace, typeContainer, spanId, type) {
  var typeId = _idFactory2['default'].makeTypeId(spanId, type);

  // The EntityPane will have entities.
  var $entityPane = $('<div>').attr('id', 'P-' + typeId).addClass('textae-editor__entity-pane');

  // The label over the span.
  var $typeLabel = $('<div>').addClass('textae-editor__type-label').css({
    'background-color': typeContainer.entity.getColor(type)
  });

  $typeLabel[0].setAttribute('tabindex', 0);

  setLabelName($typeLabel[0], namespace, typeContainer, type);

  return $('<div>').attr('id', typeId).addClass('textae-editor__type').append($typeLabel).append($entityPane); // Set pane after label because pane is over label.
}

// Create a grid unless it exists.
function getGrid(gridRenderer, spanId) {
  var grid = document.querySelector('#G' + spanId);

  return grid || gridRenderer.render(spanId);
}
module.exports = exports['default'];

},{"../../../idFactory":356,"../../../uri":360,"../getTypeDom":336,"./getDisplayName":309,"babel-runtime/helpers/interop-require-default":17}],311:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ModificationRenderer = require('../ModificationRenderer');

var _ModificationRenderer2 = _interopRequireDefault(_ModificationRenderer);

var _getDisplayName = require('./getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _uri = require('../../../uri');

var _uri2 = _interopRequireDefault(_uri);

var _idFactory = require('../../../idFactory');

var _idFactory2 = _interopRequireDefault(_idFactory);

var _getEntityDom = require('../../../getEntityDom');

var _getEntityDom2 = _interopRequireDefault(_getEntityDom);

var _Selector = require('../../Selector');

var _Selector2 = _interopRequireDefault(_Selector);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _createEntityUnlessBlock = require('./createEntityUnlessBlock');

var _createEntityUnlessBlock2 = _interopRequireDefault(_createEntityUnlessBlock);

var _changeTypeOfExists = require('./changeTypeOfExists');

var _changeTypeOfExists2 = _interopRequireDefault(_changeTypeOfExists);

var _removeEntityElement = require('./removeEntityElement');

var _removeEntityElement2 = _interopRequireDefault(_removeEntityElement);

exports['default'] = function (editor, model, typeContainer, gridRenderer, renderEntityHandler) {
  var modification = new _ModificationRenderer2['default'](model.annotationData);

  return {
    render: function render(entity) {
      (0, _createEntityUnlessBlock2['default'])(editor, model.annotationData.namespace, typeContainer, gridRenderer, modification, entity);
      renderEntityHandler(entity);
    },
    change: function change(entity) {
      (0, _changeTypeOfExists2['default'])(editor, model, typeContainer, gridRenderer, modification, entity);
      renderEntityHandler(entity);
    },
    changeModification: function changeModification(entity) {
      return changeModificationOfExists(editor, modification, entity);
    },
    remove: function remove(entity) {
      return destroy(editor, model, gridRenderer, entity);
    }
  };
};

function destroy(editor, model, gridRenderer, entity) {
  if (doesSpanHasNoEntity(model.annotationData, entity.span)) {
    // Destroy a grid when all entities are remove.
    gridRenderer.remove(entity.span);
  } else {
    // Destroy an each entity.
    (0, _removeEntityElement2['default'])(editor, model.annotationData, entity);
  }

  return entity;
}

function changeModificationOfExists(editor, modification, entity) {
  var $entity = $((0, _getEntityDom2['default'])(editor[0], entity.id));
  modification.update($entity, entity.id);
}

function doesSpanHasNoEntity(annotationData, spanId) {
  return annotationData.span.get(spanId).getTypes().length === 0;
}
module.exports = exports['default'];

},{"../../../getEntityDom":352,"../../../idFactory":356,"../../../uri":360,"../../Selector":341,"../ModificationRenderer":315,"./changeTypeOfExists":305,"./create":306,"./createEntityUnlessBlock":308,"./getDisplayName":309,"./removeEntityElement":312,"babel-runtime/helpers/interop-require-default":17}],312:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getEntityDom = require('../../../getEntityDom');

var _getEntityDom2 = _interopRequireDefault(_getEntityDom);

var _arrangePositionOfPane = require('./arrangePositionOfPane');

var _arrangePositionOfPane2 = _interopRequireDefault(_arrangePositionOfPane);

exports['default'] = function (editor, annotationData, entity) {
  var entityDom = (0, _getEntityDom2['default'])(editor[0], entity.id);

  // The entity is removed already.
  if (!entityDom) {
    return;
  }

  var paneDom = entityDom.parentNode;
  entityDom.remove();

  if (paneDom.children.length) {
    // Arrage the position of TypePane, because number of entities decrease.
    (0, _arrangePositionOfPane2['default'])(paneDom);
  } else {
    var typeDom = paneDom.parentNode,
        gridDom = typeDom.parentNode;

    // Remove type unlese entity.
    typeDom.remove();

    // Remove grid unless type.
    if (!gridDom.children.length) {
      gridDom.remove();
    }
  }
};

module.exports = exports['default'];

},{"../../../getEntityDom":352,"./arrangePositionOfPane":304,"babel-runtime/helpers/interop-require-default":17}],313:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getAnnotationBox = require('./getAnnotationBox');

var _getAnnotationBox2 = _interopRequireDefault(_getAnnotationBox);

var _getNextElement = require('../../getNextElement');

exports['default'] = function (editor, domPositionCache) {
  var container = (0, _getAnnotationBox2['default'])(editor);

  return {
    render: function render(spanId) {
      return createGrid(editor[0], domPositionCache, container[0], spanId);
    },
    remove: function remove(spanId) {
      var grid = document.querySelector('#G' + spanId);

      if (grid) grid.parentNode.removeChild(grid);

      domPositionCache.gridPositionCache['delete'](spanId);
    }
  };
};

function createGrid(editorDom, domPositionCache, container, spanId) {
  var spanPosition = domPositionCache.getSpan(spanId),
      element = document.createElement('div');

  element.setAttribute('id', 'G' + spanId);
  element.classList.add('textae-editor__grid');
  element.classList.add('hidden');
  element.style.width = spanPosition.width + 'px';

  var rightSpan = (0, _getNextElement.getRightElement)(editorDom, document.querySelector('#' + spanId));
  if (rightSpan) {
    container.insertBefore(element, document.querySelector('#G' + rightSpan.id));
  } else {
    // append to the annotation area.
    container.appendChild(element);
  }

  return element;
}
module.exports = exports['default'];

},{"../../getNextElement":353,"./getAnnotationBox":333,"babel-runtime/helpers/interop-require-default":17}],314:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _renderParagraph = require('./renderParagraph');

var _renderParagraph2 = _interopRequireDefault(_renderParagraph);

var _getAnnotationBox = require('./getAnnotationBox');

var _getAnnotationBox2 = _interopRequireDefault(_getAnnotationBox);

var _RenderAll = require('./RenderAll');

var _RenderAll2 = _interopRequireDefault(_RenderAll);

var _renderModification = require('./renderModification');

var _renderModification2 = _interopRequireDefault(_renderModification);

var _events = require('events');

var _TypeStyle = require('../TypeStyle');

var _TypeStyle2 = _interopRequireDefault(_TypeStyle);

var _SpanRenderer = require('./SpanRenderer');

var _SpanRenderer2 = _interopRequireDefault(_SpanRenderer);

var _GridRenderer = require('./GridRenderer');

var _GridRenderer2 = _interopRequireDefault(_GridRenderer);

var _EntityRenderer = require('./EntityRenderer');

var _EntityRenderer2 = _interopRequireDefault(_EntityRenderer);

var _getTypeDom = require('./getTypeDom');

var _getTypeDom2 = _interopRequireDefault(_getTypeDom);

exports['default'] = function (domPositionCaChe, relationRenderer, buttonStateHelper, typeGap, editor, model, typeContainer) {
  var emitter = new _events.EventEmitter(),
      gridRenderer = new _GridRenderer2['default'](editor, domPositionCaChe),
      renderEntityHandler = function renderEntityHandler(entity) {
    return (0, _getTypeDom2['default'])(entity.span, entity.type).css(new _TypeStyle2['default'](typeGap()));
  },
      entityRenderer = new _EntityRenderer2['default'](editor, model, typeContainer, gridRenderer, renderEntityHandler),
      spanRenderer = new _SpanRenderer2['default'](model.annotationData, typeContainer.entity.isBlock, entityRenderer.render);

  return function (editor, annotationData, selectionModel) {
    var renderAll = new _RenderAll2['default'](editor, domPositionCaChe, spanRenderer, relationRenderer),
        chongeSpanOfEntity = function chongeSpanOfEntity(entity) {
      // Change css class of the span according to the type is block or not.
      var span = annotationData.span.get(entity.span);
      return spanRenderer.change(span);
    },
        renderModificationEntityOrRelation = function renderModificationEntityOrRelation(modification) {
      (0, _renderModification2['default'])(annotationData, 'relation', modification, relationRenderer, buttonStateHelper);
      (0, _renderModification2['default'])(annotationData, 'entity', modification, entityRenderer, buttonStateHelper);
    };

    var eventHandlers = [['all.change', function (annotationData) {
      renderAll(annotationData);
      selectionModel.clear();
    }], ['paragraph.change', function (paragraphs) {
      return (0, _renderParagraph2['default'])(editor, paragraphs);
    }], ['span.add', spanRenderer.render], ['span.remove', function (span) {
      spanRenderer.remove(span);
      gridRenderer.remove(span.id);
      selectionModel.span.remove(modelToId(span));
    }], ['entity.add', function (entity) {
      // Add a now entity with a new grid after the span moved.
      chongeSpanOfEntity(entity);
      entityRenderer.render(entity);
    }], ['entity.change', function (entity) {
      entityRenderer.change(entity);
      chongeSpanOfEntity(entity);
    }], ['entity.remove', function (entity) {
      entityRenderer.remove(entity);
      chongeSpanOfEntity(entity);
      selectionModel.entity.remove(modelToId(entity));
    }], ['relation.add', function (relation) {
      relationRenderer.render(relation);
      emitter.emit('relation.add', relation);
    }], ['relation.change', relationRenderer.change], ['relation.remove', function (relation) {
      relationRenderer.remove(relation);
      selectionModel.relation.remove(modelToId(relation));
    }], ['modification.add', renderModificationEntityOrRelation], ['modification.remove', renderModificationEntityOrRelation]];

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
module.exports = exports['default'];

},{"../TypeStyle":343,"./EntityRenderer":311,"./GridRenderer":313,"./RenderAll":321,"./SpanRenderer":329,"./getAnnotationBox":333,"./getTypeDom":336,"./renderModification":338,"./renderParagraph":339,"babel-runtime/helpers/interop-require-default":17,"events":108}],315:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var allModificationClasses = 'textae-editor__negation textae-editor__speculation';

exports['default'] = function (annotationData) {
  return {
    getClasses: _.partial(getClasses, annotationData),
    update: _.partial(update, annotationData)
  };
};

function getClasses(annotationData, objectId) {
  return annotationData.getModificationOf(objectId).map(function (m) {
    return 'textae-editor__' + m.pred.toLowerCase();
  });
}

function update(annotationData, domElement, objectId) {
  domElement.removeClass(allModificationClasses);
  domElement.addClass(getClasses(annotationData, objectId).join(" "));
}
module.exports = exports['default'];

},{}],316:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _DomPositionCache = require('../../DomPositionCache');

var _DomPositionCache2 = _interopRequireDefault(_DomPositionCache);

exports['default'] = function (editor, annotationData, relationId) {
  var domPositionCaChe = new _DomPositionCache2['default'](editor, annotationData.entity);
  var connect = domPositionCaChe.toConnect(relationId);

  if (!connect) {
    throw new Error('no connect for id: ' + relationId);
  }

  return connect;
};

module.exports = exports['default'];

},{"../../DomPositionCache":301,"babel-runtime/helpers/interop-require-default":17}],317:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Connect = require('./Connect');

var _Connect2 = _interopRequireDefault(_Connect);

var _determineCurviness = require('./determineCurviness');

var _determineCurviness2 = _interopRequireDefault(_determineCurviness);

var _jsPlumbArrowOverlayUtil = require('./jsPlumbArrowOverlayUtil');

var _jsPlumbArrowOverlayUtil2 = _interopRequireDefault(_jsPlumbArrowOverlayUtil);

exports['default'] = function (editor, model, jsPlumbInstance) {
  return new _bluebird2['default'](function (resolve, reject) {
    _.defer(function () {
      try {
        // For tuning
        // var startTime = new Date();

        // Extract relations removed, because relation dom is not synchro with the model.
        var relations = model.annotationData.relation.all().filter(function (r) {
          return !r.removed;
        });

        resetAllCurviness(editor, model.annotationData, relations);
        jsPlumbInstance.repaintEverything();
        reselectAll(editor, model.annotationData, model.selectionModel.relation.all());

        // For tuning
        // var endTime = new Date();
        // console.log(editor.editorId, 'arrangePositionAll : ', endTime.getTime() - startTime.getTime() + 'ms');

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

function reselectAll(editor, annotationData, relationIds) {
  relationIds.map(function (relationId) {
    return new _Connect2['default'](editor, annotationData, relationId);
  }).filter(function (connect) {
    return connect instanceof jsPlumb.Connection;
  }).forEach(function (connect) {
    return connect.select();
  });
}

function resetAllCurviness(editor, annotationData, relations) {
  relations.map(function (relation) {
    return {
      connect: new _Connect2['default'](editor, annotationData, relation.id),
      curviness: (0, _determineCurviness2['default'])(editor, annotationData, relation)
    };
  })
  // Set changed values only.
  .filter(function (data) {
    return data.connect.setConnector && data.connect.connector.getCurviness() !== data.curviness;
  }).forEach(function (data) {
    data.connect.setConnector(['Bezier', {
      curviness: data.curviness
    }]);

    // Re-set arrow because it is disappered when setConnector is called.
    _jsPlumbArrowOverlayUtil2['default'].resetArrows(data.connect);
  });
}
module.exports = exports['default'];

},{"./Connect":316,"./determineCurviness":318,"./jsPlumbArrowOverlayUtil":320,"babel-runtime/helpers/interop-require-default":17,"bluebird":104}],318:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _DomPositionCache = require('../../DomPositionCache');

var _DomPositionCache2 = _interopRequireDefault(_DomPositionCache);

var CURVINESS_PARAMETERS = {
  // curviness parameters
  xrate: 0.6,
  yrate: 0.05,

  // curviness offset
  offset: 20
};

exports['default'] = function (editor, annotationData, relation) {
  var domPositionCaChe = new _DomPositionCache2['default'](editor, annotationData.entity);

  var anchors = toAnchors(relation);
  var sourcePosition = domPositionCaChe.getEntity(anchors.sourceId);
  var targetPosition = domPositionCaChe.getEntity(anchors.targetId);

  var sourceX = sourcePosition.center;
  var targetX = targetPosition.center;

  var sourceY = sourcePosition.top;
  var targetY = targetPosition.top;

  var xdiff = Math.abs(sourceX - targetX);
  var ydiff = Math.abs(sourceY - targetY);
  var curviness = xdiff * CURVINESS_PARAMETERS.xrate + ydiff * CURVINESS_PARAMETERS.yrate + CURVINESS_PARAMETERS.offset;
  curviness /= 2.4;

  return curviness;
};

function toAnchors(relation) {
  return {
    sourceId: relation.subj,
    targetId: relation.obj
  };
}
module.exports = exports['default'];

},{"../../DomPositionCache":301,"babel-runtime/helpers/interop-require-default":17}],319:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ModificationRenderer = require('../ModificationRenderer');

var _ModificationRenderer2 = _interopRequireDefault(_ModificationRenderer);

var _getAnnotationBox = require('../getAnnotationBox');

var _getAnnotationBox2 = _interopRequireDefault(_getAnnotationBox);

var _DomPositionCache = require('../../DomPositionCache');

var _DomPositionCache2 = _interopRequireDefault(_DomPositionCache);

var _Connect = require('./Connect');

var _Connect2 = _interopRequireDefault(_Connect);

var _arrangePositionAll = require('./arrangePositionAll');

var _arrangePositionAll2 = _interopRequireDefault(_arrangePositionAll);

var _determineCurviness = require('./determineCurviness');

var _determineCurviness2 = _interopRequireDefault(_determineCurviness);

var _jsPlumbArrowOverlayUtil = require('./jsPlumbArrowOverlayUtil');

var _jsPlumbArrowOverlayUtil2 = _interopRequireDefault(_jsPlumbArrowOverlayUtil);

var _getEntityDom = require('../../../getEntityDom');

var _getEntityDom2 = _interopRequireDefault(_getEntityDom);

var POINTUP_LINE_WIDTH = 3,
    LABEL = {
  cssClass: 'textae-editor__relation__label',
  id: 'label'
},
    makeJsPlumbInstance = function makeJsPlumbInstance(container) {
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
    LabelOverlay = function LabelOverlay(connect) {
  // Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
  var labelOverlay = connect.getOverlay(LABEL.id);
  if (!labelOverlay) {
    throw new Error('no label overlay');
  }

  return labelOverlay;
};

module.exports = function (editor, model, typeContainer) {
  // Init a jsPlumb instance.
  var modification = new _ModificationRenderer2['default'](model.annotationData),
      domPositionCaChe = new _DomPositionCache2['default'](editor, model.annotationData.entity),
      jsPlumbInstance,
      ConnectorStrokeStyle = (function () {
    var converseHEXinotRGBA = function converseHEXinotRGBA(color, opacity) {
      var c = color.slice(1),
          r = parseInt(c.substr(0, 2), 16),
          g = parseInt(c.substr(2, 2), 16),
          b = parseInt(c.substr(4, 2), 16);

      return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
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
  cache = function cache(connect) {
    var relationId = connect.relationId;
    var domPositionCaChe = new _DomPositionCache2['default'](editor, model.annotationData.entity);
    domPositionCaChe.connectCache.set(relationId, connect);

    return connect;
  },
      isGridPrepared = function isGridPrepared(relationId) {
    if (!model.annotationData.relation.get(relationId)) return undefined;

    var domPositionCaChe = new _DomPositionCache2['default'](editor, model.annotationData.entity),
        relation = model.annotationData.relation.get(relationId);

    return domPositionCaChe.gridPositionCache.isGridPrepared(relation.subj) && domPositionCaChe.gridPositionCache.isGridPrepared(relation.obj);
  },
      filterGridExists = function filterGridExists(connect) {
    // The grid may be destroyed when the spans was moved repetitively by undo or redo.
    if (!isGridPrepared(connect.relationId)) {
      return undefined;
    }
    return connect;
  },
      render = (function () {
    var deleteRender = function deleteRender(relation) {
      delete relation.render;
      return relation;
    },
        createJsPlumbConnect = function createJsPlumbConnect(relation) {
      // Make a connect by jsPlumb.
      return jsPlumbInstance.connect({
        source: $((0, _getEntityDom2['default'])(editor[0], relation.subj)),
        target: $((0, _getEntityDom2['default'])(editor[0], relation.obj)),
        anchors: ['TopCenter', "TopCenter"],
        connector: ['Bezier', {
          curviness: (0, _determineCurviness2['default'])(editor, model.annotationData, relation)
        }],
        paintStyle: new ConnectorStrokeStyle(relation.id),
        parameters: {
          id: relation.id
        },
        cssClass: 'textae-editor__relation',
        overlays: [['Arrow', _jsPlumbArrowOverlayUtil2['default'].NORMAL_ARROW], ['Label', _.extend({}, LABEL, {
          label: '[' + relation.id + '] ' + relation.type,
          cssClass: LABEL.cssClass + ' ' + modification.getClasses(relation.id).join(' ')
        })]]
      });
    },
        create = function create(relation) {
      return _.extend(createJsPlumbConnect(relation), {
        relationId: relation.id
      });
    },
        extendPointup = (function () {
      var Pointupable = (function () {
        var hoverupLabel = function hoverupLabel(connect) {
          new LabelOverlay(connect).addClass('hover');
          return connect;
        },
            hoverdownLabel = function hoverdownLabel(connect) {
          new LabelOverlay(connect).removeClass('hover');
          return connect;
        },
            selectLabel = function selectLabel(connect) {
          new LabelOverlay(connect).addClass('ui-selected');
          return connect;
        },
            deselectLabel = function deselectLabel(connect) {
          new LabelOverlay(connect).removeClass('ui-selected');
          return connect;
        },
            hoverupLine = function hoverupLine(connect) {
          connect.addClass('hover');
          return connect;
        },
            hoverdownLine = function hoverdownLine(connect) {
          connect.removeClass('hover');
          return connect;
        },
            selectLine = function selectLine(connect) {
          connect.addClass('ui-selected');
          return connect;
        },
            deselectLine = function deselectLine(connect) {
          connect.removeClass('ui-selected');
          return connect;
        },
            hasClass = function hasClass(connect, className) {
          return connect.connector.canvas.classList.contains(className);
        },
            unless = function unless(connect, predicate, func) {
          // Evaluate lazily to use with _.delay.
          return function () {
            if (!predicate(connect)) func(connect);
          };
        },
            pointupLine = function pointupLine(getStrokeStyle, connect) {
          connect.setPaintStyle(_.extend(getStrokeStyle(), {
            lineWidth: POINTUP_LINE_WIDTH
          }));
          return connect;
        },
            pointdownLine = function pointdownLine(getStrokeStyle, connect) {
          connect.setPaintStyle(getStrokeStyle());
          return connect;
        };

        return function (relationId, connect) {
          var getStrokeStyle = _.partial(ConnectorStrokeStyle, relationId),
              pointupLineColor = _.partial(pointupLine, getStrokeStyle),
              pointdownLineColor = _.partial(pointdownLine, getStrokeStyle),
              unlessSelect = _.partial(unless, connect, function (connect) {
            return hasClass(connect, 'ui-selected');
          }),
              unlessDead = _.partial(unless, connect, function (connect) {
            return connect.dead;
          }),
              hoverup = _.compose(hoverupLine, hoverupLabel, pointupLineColor, _jsPlumbArrowOverlayUtil2['default'].showBigArrow),
              hoverdown = _.compose(hoverdownLine, hoverdownLabel, pointdownLineColor, _jsPlumbArrowOverlayUtil2['default'].hideBigArrow),
              select = _.compose(selectLine, selectLabel, hoverdownLine, hoverdownLabel, pointupLineColor, _jsPlumbArrowOverlayUtil2['default'].showBigArrow),
              deselect = _.compose(deselectLine, deselectLabel, pointdownLineColor, _jsPlumbArrowOverlayUtil2['default'].hideBigArrow);

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
      var bindHoverAction = function bindHoverAction(jsPlumbElement, onMouseOver, onMouseRemove) {
        jsPlumbElement.bind('mouseenter', onMouseOver).bind('mouseexit', onMouseRemove);
      },
          pointup = function pointup(connect) {
        connect.pointup();
      },
          pointdown = function pointdown(connect) {
        connect.pointdown();
      },
          toComponent = function toComponent(label) {
        return label.component;
      },
          bindConnect = function bindConnect(connect) {
        bindHoverAction(connect, pointup, pointdown);
        return connect;
      },
          bindLabel = function bindLabel(connect) {
        bindHoverAction(new LabelOverlay(connect), _.compose(pointup, toComponent), _.compose(pointdown, toComponent));
        return connect;
      };

      return _.compose(bindLabel, bindConnect);
    })(),
        extendApi = (function () {
      // Extend module for jsPlumb.Connection.
      var Api = function Api(connect) {
        var bindClickAction = function bindClickAction(onClick) {
          this.bind('click', onClick);
          this.getOverlay(LABEL.id).bind('click', function (label, event) {
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
    notify = function notify(connect) {
      editor.trigger('textae.editor.jsPlumbConnection.add', connect);
      return connect;
    };

    return _.compose(cache, notify, extendApi, hoverize, extendPointup, create, deleteRender);
  })(),

  // Create a dummy relation when before moving grids after creation grids.
  // Because a jsPlumb error occurs when a relation between same points.
  // And entities of same length spans was same point before moving grids.
  renderLazy = (function () {
    var extendRelationId = function extendRelationId(relation) {
      return _.extend(relation, {
        relationId: relation.id
      });
    },
        renderIfGridExists = function renderIfGridExists(relation) {
      if (filterGridExists(relation)) render(relation);
    },
        extendDummyApiToCreateRlationWhenGridMoved = function extendDummyApiToCreateRlationWhenGridMoved(relation) {
      var render = function render() {
        return new _bluebird2['default'](function (resolve, reject) {
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
      changeType = function changeType(relation) {
    var connect = new _Connect2['default'](editor, model.annotationData, relation.id),
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
      changeJsModification = function changeJsModification(relation) {
    var connect = new _Connect2['default'](editor, model.annotationData, relation.id);

    // A connect may be an object before it rendered.
    if (connect instanceof jsPlumb.Connection) {
      modification.update(new LabelOverlay(connect), relation.id);
    }
  },
      remove = function remove(relation) {
    var connect = new _Connect2['default'](editor, model.annotationData, relation.id);
    jsPlumbInstance.detach(connect);
    domPositionCaChe.connectCache['delete'](relation.id);

    // Set the flag dead already to delay selection.
    connect.dead = true;

    // Set a flag to extract relations from target to move relations asynchronously.
    relation.removed = true;
  },
      init = function init(editor) {
    var container = (0, _getAnnotationBox2['default'])(editor);
    jsPlumbInstance = makeJsPlumbInstance(container);

    return function () {
      return (0, _arrangePositionAll2['default'])(editor, model, jsPlumbInstance);
    };
  };

  return {
    init: init,
    reset: function reset() {
      jsPlumbInstance.reset();
      domPositionCaChe.connectCache.clear();
    },
    render: renderLazy,
    change: changeType,
    changeModification: changeJsModification,
    remove: remove
  };
};

},{"../../../getEntityDom":352,"../../DomPositionCache":301,"../ModificationRenderer":315,"../getAnnotationBox":333,"./Connect":316,"./arrangePositionAll":317,"./determineCurviness":318,"./jsPlumbArrowOverlayUtil":320,"babel-runtime/helpers/interop-require-default":17,"bluebird":104}],320:[function(require,module,exports){
'use strict';

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
  id: 'hover-arrow'
},
    addArrow = function addArrow(id, connect) {
  if (id === NORMAL_ARROW.id) {
    connect.addOverlay(['Arrow', NORMAL_ARROW]);
  } else if (id === HOVER_ARROW.id) {
    connect.addOverlay(['Arrow', HOVER_ARROW]);
  }
  return connect;
},
    addArrows = function addArrows(connect, arrows) {
  arrows.forEach(function (id) {
    addArrow(id, connect);
  });
  return arrows;
},
    getArrowIds = function getArrowIds(connect) {
  return connect.getOverlays().filter(function (overlay) {
    return overlay.type === 'Arrow';
  }).map(function (arrow) {
    return arrow.id;
  });
},
    hasNormalArrow = function hasNormalArrow(connect) {
  return connect.getOverlay(NORMAL_ARROW.id);
},
    hasHoverArrow = function hasHoverArrow(connect) {
  return connect.getOverlay(HOVER_ARROW.id);
},
    removeArrow = function removeArrow(id, connect) {
  connect.removeOverlay(id);
  return connect;
},
    removeArrows = function removeArrows(connect, arrows) {
  arrows.forEach(function (id) {
    removeArrow(id, connect);
  });
  return arrows;
},
    resetArrows = function resetArrows(connect) {
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
  showBigArrow: function showBigArrow(connect) {
    // Do not add a big arrow twice when a relation has been selected during hover.
    if (hasHoverArrow(connect)) {
      return connect;
    }

    return switchHoverArrow(connect);
  },
  hideBigArrow: function hideBigArrow(connect) {
    // Already affected
    if (hasNormalArrow(connect)) return connect;

    return switchNormalArrow(connect);
  }
};

},{}],321:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getAnnotationBox = require('./getAnnotationBox');

var _getAnnotationBox2 = _interopRequireDefault(_getAnnotationBox);

exports['default'] = function (editor, domPositionCaChe, spanRenderer, relationRenderer) {
  return function (annotationData) {
    // Render annotations
    (0, _getAnnotationBox2['default'])(editor).empty();
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
module.exports = exports['default'];

},{"./getAnnotationBox":333,"babel-runtime/helpers/interop-require-default":17}],322:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _getBigBrother = require('./getBigBrother');

var _getBigBrother2 = _interopRequireDefault(_getBigBrother);

var _renderSingleSpan = require('./renderSingleSpan');

var _renderSingleSpan2 = _interopRequireDefault(_renderSingleSpan);

var _renderClassOfSpan = require('./renderClassOfSpan');

var _renderClassOfSpan2 = _interopRequireDefault(_renderClassOfSpan);

var _renderEntitiesOfSpan = require('./renderEntitiesOfSpan');

var _renderEntitiesOfSpan2 = _interopRequireDefault(_renderEntitiesOfSpan);

var _destroyChildrenSpan = require('./destroyChildrenSpan');

var _destroyChildrenSpan2 = _interopRequireDefault(_destroyChildrenSpan);

exports['default'] = create;

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
function create(span, annotationData, isBlockFunc, renderEntityFunc) {
    (0, _destroyChildrenSpan2['default'])(span);

    var bigBrother = (0, _getBigBrother2['default'])(span, annotationData.span.topLevel());
    (0, _renderSingleSpan2['default'])(span, bigBrother);

    (0, _renderClassOfSpan2['default'])(span, isBlockFunc);

    (0, _renderEntitiesOfSpan2['default'])(span, annotationData.entity.get, renderEntityFunc);

    renderChildresnSpan(span, function (span) {
        return create(span, annotationData, isBlockFunc, renderEntityFunc);
    });
}

function renderChildresnSpan(span, create) {
    span.children.forEach(create);

    return span;
}
module.exports = exports['default'];

},{"./destroyChildrenSpan":327,"./getBigBrother":328,"./renderClassOfSpan":330,"./renderEntitiesOfSpan":331,"./renderSingleSpan":332,"babel-runtime/helpers/interop-require-default":17}],323:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (textNode, offset) {
  var range = document.createRange();
  range.setStart(textNode, offset.start);
  range.setEnd(textNode, offset.end);
  return range;
};

module.exports = exports["default"];

},{}],324:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (span) {
  var element = document.createElement('span');
  element.setAttribute('id', span.id);
  element.setAttribute('title', span.id);
  element.setAttribute('class', 'textae-editor__span');
  element.setAttribute('tabindex', 0);
  return element;
};

module.exports = exports['default'];

},{}],325:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createRange = require('./createRange');

var _createRange2 = _interopRequireDefault(_createRange);

exports['default'] = function (textNode, startOfTextNode, span) {
  var offset = getOffset(span, startOfTextNode);

  if (!validateOffset(textNode, offset)) {
    throw new Error('oh my god! I cannot render this span. ' + span.toStringOnlyThis() + ', textNode ' + textNode.textContent);
  }

  return (0, _createRange2['default'])(textNode, offset);
};

function getOffset(span, startOfTextNode) {
  var startOffset = span.begin - startOfTextNode,
      endOffset = span.end - startOfTextNode;

  return {
    start: startOffset,
    end: endOffset
  };
}

function validateOffset(textNode, offset) {
  return 0 <= offset.start && offset.end <= textNode.length;
}
module.exports = exports['default'];

},{"./createRange":323,"babel-runtime/helpers/interop-require-default":17}],326:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (spanId) {
  var spanElement = document.querySelector('#' + spanId),
      parent = spanElement.parentNode;

  // Move the textNode wrapped this span in front of this span.
  while (spanElement.firstChild) {
    parent.insertBefore(spanElement.firstChild, spanElement);
  }

  parent.removeChild(spanElement);
  parent.normalize();
};

module.exports = exports['default'];

},{}],327:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _destroy = require('./destroy');

var _destroy2 = _interopRequireDefault(_destroy);

exports['default'] = function (span) {
  // Destroy rendered children.
  span.children.filter(exists).forEach(destroySpanRecurcive);

  return span;
};

function exists(span) {
  return document.querySelector('#' + span.id) !== null;
}

// Destroy DOM elements of descendant spans.
function destroySpanRecurcive(span) {
  span.children.forEach(function (span) {
    destroySpanRecurcive(span);
  });
  (0, _destroy2['default'])(span.id);
}
module.exports = exports['default'];

},{"./destroy":326,"babel-runtime/helpers/interop-require-default":17}],328:[function(require,module,exports){
// A big brother is brother node on a structure at rendered.
// There is no big brother if the span is first in a paragraph.
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (span, topLevelSpans) {
  var index = undefined;
  if (span.parent) {
    index = span.parent.children.indexOf(span);
    return index === 0 ? null : span.parent.children[index - 1];
  } else {
    index = topLevelSpans.indexOf(span);
    return index === 0 || topLevelSpans[index - 1].paragraph !== span.paragraph ? null : topLevelSpans[index - 1];
  }
};

module.exports = exports["default"];
// Warning: parent is set at updateSpanTree, is not exists now.

},{}],329:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _destroy = require('./destroy');

var _destroy2 = _interopRequireDefault(_destroy);

var _renderClassOfSpan = require('./renderClassOfSpan');

var _renderClassOfSpan2 = _interopRequireDefault(_renderClassOfSpan);

exports['default'] = function (annotationData, isBlockFunc, renderEntityFunc) {
  return {
    render: function render(span) {
      return (0, _create2['default'])(span, annotationData, isBlockFunc, renderEntityFunc);
    },
    remove: function remove(span) {
      return (0, _destroy2['default'])(span.id);
    },
    change: function change(span) {
      return (0, _renderClassOfSpan2['default'])(span, isBlockFunc);
    }
  };
};

module.exports = exports['default'];

},{"./create":322,"./destroy":326,"./renderClassOfSpan":330,"babel-runtime/helpers/interop-require-default":17}],330:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _not = require('not');

var _not2 = _interopRequireDefault(_not);

var BLOCK = 'textae-editor__span--block',
    WRAP = 'textae-editor__span--wrap';

exports['default'] = function (span, isBlockFunc) {
  var spanElement = document.querySelector('#' + span.id);

  if (hasType(span, isBlockFunc)) {
    spanElement.classList.add(BLOCK);
  } else {
    spanElement.classList.remove(BLOCK);
  }

  if (hasType(span, (0, _not2['default'])(isBlockFunc))) {
    if (spanElement.classList.contains(WRAP)) {
      spanElement.classList.remove(WRAP);
    }
  } else {
    spanElement.classList.add(WRAP);
  }
};

function hasType(span, isBlockFunc) {
  return span.getTypes().map(function (type) {
    return type.name;
  }).filter(isBlockFunc).length > 0;
}
module.exports = exports['default'];

},{"babel-runtime/helpers/interop-require-default":17,"not":158}],331:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (span, entityIdToModelFunc, renderEntityFunc) {
    span.getTypes().forEach(function (type) {
        return renderEntitiesOfType(type, entityIdToModelFunc, renderEntityFunc);
    });
};

function renderEntitiesOfType(type, entityIdToModelFunc, renderEntityFunc) {
    type.entities.map(entityIdToModelFunc).forEach(renderEntityFunc);
}
module.exports = exports["default"];

},{}],332:[function(require,module,exports){
'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createSpanElement = require('./createSpanElement');

var _createSpanElement2 = _interopRequireDefault(_createSpanElement);

var _createSpanRange = require('./createSpanRange');

var _createSpanRange2 = _interopRequireDefault(_createSpanRange);

exports['default'] = function (span, bigBrother) {
  var targetRange = cerateRangeToSpan(span, bigBrother),
      spanElement = (0, _createSpanElement2['default'])(span);

  targetRange.surroundContents(spanElement);
};

// Get the Range to that new span tag insert.
// This function works well when no child span is rendered.
function cerateRangeToSpan(span, bigBrother) {
  var targetTextNode = undefined,
      startOfTextNode = undefined;

  // The parent of the bigBrother is same with of span, which is a span or the root of spanTree.
  if (bigBrother) {
    var _getTextNodeFromBigBrother = getTextNodeFromBigBrother(bigBrother);

    // The target text arrounded by span is in a textNode after the bigBrother if bigBrother exists.

    var _getTextNodeFromBigBrother2 = _slicedToArray(_getTextNodeFromBigBrother, 2);

    targetTextNode = _getTextNodeFromBigBrother2[0];
    startOfTextNode = _getTextNodeFromBigBrother2[1];
  } else {
    var _getTextNodeFromParent = getTextNodeFromParent(span);

    // The target text arrounded by span is the first child of parent unless bigBrother exists.

    var _getTextNodeFromParent2 = _slicedToArray(_getTextNodeFromParent, 2);

    targetTextNode = _getTextNodeFromParent2[0];
    startOfTextNode = _getTextNodeFromParent2[1];
  }

  if (!targetTextNode) throw new Error('The textNode on to create a span is not found. ' + span.toStringOnlyThis());

  return (0, _createSpanRange2['default'])(targetTextNode, startOfTextNode, span);
}

function getTextNodeFromBigBrother(bigBrother) {
  return [document.querySelector('#' + bigBrother.id).nextSibling, bigBrother.end];
}

function getTextNodeFromParent(span) {
  var parentModel = getParentModel(span);

  return [document.querySelector('#' + parentModel.id).firstChild, parentModel.begin];
}

function getParentModel(span) {
  if (span.parent) {
    // This span is first child of parent span.
    return span.parent;
  } else {
    // The parentElement is paragraph unless parent.
    return span.paragraph;
  }
}
module.exports = exports['default'];

},{"./createSpanElement":324,"./createSpanRange":325,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/sliced-to-array":19}],333:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _getElement = require('./getElement');

var _getElement2 = _interopRequireDefault(_getElement);

var _getEditorBody = require('./getEditorBody');

var _getEditorBody2 = _interopRequireDefault(_getEditorBody);

// Get the display area for denotations and relations.
exports['default'] = _.compose(_.partial(_getElement2['default'], 'div', 'textae-editor__body__annotation-box'), _getEditorBody2['default']);
module.exports = exports['default'];

},{"./getEditorBody":334,"./getElement":335,"babel-runtime/helpers/interop-require-default":17}],334:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getElement = require('./getElement');

var _getElement2 = _interopRequireDefault(_getElement);

// Make the display area for text, spans, denotations, relations.
exports['default'] = _.partial(_getElement2['default'], 'div', 'textae-editor__body');
module.exports = exports['default'];

},{"./getElement":335,"babel-runtime/helpers/interop-require-default":17}],335:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (tagName, className, $parent) {
  var $area = $parent.find('.' + className);
  if ($area.length === 0) {
    $area = $('<' + tagName + '>').addClass(className);
    $parent.append($area);
  }
  return $area;
};

module.exports = exports['default'];

},{}],336:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _idFactory = require('../../idFactory');

var _idFactory2 = _interopRequireDefault(_idFactory);

exports['default'] = function (spanId, type) {
  return $('#' + _idFactory2['default'].makeTypeId(spanId, type));
};

module.exports = exports['default'];

},{"../../idFactory":356,"babel-runtime/helpers/interop-require-default":17}],337:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _DomPositionCache = require('../DomPositionCache');

var _DomPositionCache2 = _interopRequireDefault(_DomPositionCache);

var _Initiator = require('./Initiator');

var _Initiator2 = _interopRequireDefault(_Initiator);

module.exports = function (editor, model, buttonStateHelper, typeContainer, typeGap, relationRenderer) {
  var domPositionCaChe = new _DomPositionCache2['default'](editor, model.annotationData.entity);

  var api = {
    init: new _Initiator2['default'](domPositionCaChe, relationRenderer, buttonStateHelper, typeGap, editor, model, typeContainer),
    arrangeRelationPositionAll: relationRenderer.arrangePositionAll,
    renderLazyRelationAll: relationRenderer.renderLazyRelationAll
  };

  return api;
};

},{"../DomPositionCache":301,"./Initiator":314,"babel-runtime/helpers/interop-require-default":17}],338:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _capitalize = require('capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

exports['default'] = function (annotationData, modelType, modification, renderer, buttonStateHelper) {
  var target = annotationData[modelType].get(modification.obj);

  if (target) {
    renderer.changeModification(target);
    buttonStateHelper['updateBy' + (0, _capitalize2['default'])(modelType)]();
  }
};

module.exports = exports['default'];

},{"babel-runtime/helpers/interop-require-default":17,"capitalize":105}],339:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _getTextBox = require('../getTextBox');

var _getTextBox2 = _interopRequireDefault(_getTextBox);

var _getElement = require('./getElement');

var _getElement2 = _interopRequireDefault(_getElement);

var _getEditorBody = require('./getEditorBody');

var _getEditorBody2 = _interopRequireDefault(_getEditorBody);

var source = '\n{{#paragraphs}}\n<p class="textae-editor__body__text-box__paragraph-margin">\n    <span class="textae-editor__body__text-box__paragraph" id="{{id}}">{{text}}</span>\n</p>\n{{/paragraphs}}\n';

var tepmlate = _handlebars2['default'].compile(source);

exports['default'] = function (editor, paragraphs) {
  (0, _getTextBox2['default'])(editor[0]).innerHTML = createTaggedSourceDoc(paragraphs);
};

// the Souce document has multi paragraphs that are splited by '\n'.
function createTaggedSourceDoc(paragraphs) {
  return tepmlate({
    paragraphs: paragraphs
  });
}
module.exports = exports['default'];

},{"../getTextBox":346,"./getEditorBody":334,"./getElement":335,"babel-runtime/helpers/interop-require-default":17,"handlebars":145}],340:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (domPositionCache, relationId) {
  var connect = domPositionCache.toConnect(relationId);

  removeUiSelectClass(connect);
};

function removeUiSelectClass(connect) {
  if (connect && connect.deselect) connect.deselect();
}
module.exports = exports["default"];

},{}],341:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _idFactory = require('../../idFactory');

var _idFactory2 = _interopRequireDefault(_idFactory);

var _DomPositionCache = require('../DomPositionCache');

var _DomPositionCache2 = _interopRequireDefault(_DomPositionCache);

var _selectRelation = require('./selectRelation');

var _selectRelation2 = _interopRequireDefault(_selectRelation);

var _deselectRelation = require('./deselectRelation');

var _deselectRelation2 = _interopRequireDefault(_deselectRelation);

var _getEntityDom = require('../../getEntityDom');

var _getEntityDom2 = _interopRequireDefault(_getEntityDom);

var SELECTED = 'ui-selected';

exports['default'] = function (editor, model) {
  var domPositionCache = new _DomPositionCache2['default'](editor, model.annotationData.entity);

  return {
    span: {
      select: function select(id) {
        var el = getSpanDom(id);
        modifyStyle(el, 'add');
        el.focus();
      },
      deselect: function deselect(id) {
        var el = getSpanDom(id);

        // A dom does not exist when it is deleted.
        if (el) {
          modifyStyle(el, 'remove');
          el.blur();
        }
      }
    },
    entity: {
      select: function select(id) {
        var el = (0, _getEntityDom2['default'])(editor[0], id);

        // Entities of block span hos no dom elements.
        if (el) {
          modifyStyle(el, 'add');

          // focus label
          el.parentNode.previousElementSibling.focus();
        }
      },
      deselect: function deselect(id) {
        var el = (0, _getEntityDom2['default'])(editor[0], id);

        // Entities of block span hos no dom elements.
        // A dom does not exist when it is deleted.
        if (el) {
          modifyStyle(el, 'remove');

          // blur label
          el.parentNode.previousElementSibling.blur();
        }
      }
    },
    relation: {
      select: function select(id) {
        return (0, _selectRelation2['default'])(domPositionCache, id);
      },
      deselect: function deselect(id) {
        return (0, _deselectRelation2['default'])(domPositionCache, id);
      }
    },
    entityLabel: {
      update: function update(id) {
        return updateEntityLabel(editor, id);
      }
    }
  };
};

// Select the typeLabel if all entities is selected.
function updateEntityLabel(editor, entityId) {
  var entity = (0, _getEntityDom2['default'])(editor[0], entityId);

  // Entities of block span hos no dom elements.
  if (entity) {
    var typePane = entity.parentNode,
        typeLabel = typePane.previousElementSibling;

    if (typePane.children.length === typePane.querySelectorAll('.' + SELECTED).length) {
      typeLabel.classList.add(SELECTED);
      typePane.classList.add(SELECTED);
    } else {
      typeLabel.classList.remove(SELECTED);
      typePane.classList.remove(SELECTED);
    }
  }
}

function getSpanDom(id) {
  return document.querySelector('#' + id);
}

function modifyStyle(element, handle) {
  element.classList[handle](SELECTED);
}
module.exports = exports['default'];

},{"../../getEntityDom":352,"../../idFactory":356,"../DomPositionCache":301,"./deselectRelation":340,"./selectRelation":342,"babel-runtime/helpers/interop-require-default":17}],342:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (domPositionCache, relationId) {
  var connect = domPositionCache.toConnect(relationId);

  addUiSelectClass(connect);
};

function addUiSelectClass(connect) {
  if (connect && connect.select) connect.select();
}
module.exports = exports["default"];

},{}],343:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (newValue) {
  return {
    height: 18 * newValue + 18 + 'px',
    'padding-top': 18 * newValue + 'px'
  };
};

module.exports = exports['default'];

},{}],344:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getHeightIncludeDescendantGrids = require('./getHeightIncludeDescendantGrids');

var _getHeightIncludeDescendantGrids2 = _interopRequireDefault(_getHeightIncludeDescendantGrids);

exports['default'] = function (getSpan, getGridOfSpan, typeContainer, typeGapValue, span) {
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
      descendantsMaxHeight = (0, _getHeightIncludeDescendantGrids2['default'])(span, typeContainer, typeGapValue);

  return {
    top: spanPosition.top - descendantsMaxHeight,
    left: spanPosition.left
  };
}
module.exports = exports['default'];

},{"./getHeightIncludeDescendantGrids":345,"babel-runtime/helpers/interop-require-default":17}],345:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getHeightIncludeDescendantGrids;

function getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue) {
  var descendantsMaxHeight = span.children.length === 0 ? 0 : _.max(span.children.map(function (childSpan) {
    return getHeightIncludeDescendantGrids(childSpan, typeContainer, typeGapValue);
  })),
      gridHeight = span.getTypes().filter(function (type) {
    return !typeContainer.entity.isBlock(type.name);
  }).length * (typeGapValue * 18 + 18);

  return gridHeight + descendantsMaxHeight;
}

module.exports = exports["default"];

},{}],346:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getTextBox;

function getTextBox(editor) {
  return editor.querySelector('.textae-editor__body__text-box');
}

module.exports = exports['default'];

},{}],347:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _lineHeight = require('./lineHeight');

var lineHeight = _interopRequireWildcard(_lineHeight);

var _Hover = require('./Hover');

var _Hover2 = _interopRequireDefault(_Hover);

var _Display = require('./Display');

var _Display2 = _interopRequireDefault(_Display);

var _utilCursorChanger = require('../../util/CursorChanger');

var _utilCursorChanger2 = _interopRequireDefault(_utilCursorChanger);

var _setSelectionModelHandler = require('./setSelectionModelHandler');

var _setSelectionModelHandler2 = _interopRequireDefault(_setSelectionModelHandler);

var _TypeStyle = require('./TypeStyle');

var _TypeStyle2 = _interopRequireDefault(_TypeStyle);

var _RendererRelationRenderer = require('./Renderer/RelationRenderer');

var _RendererRelationRenderer2 = _interopRequireDefault(_RendererRelationRenderer);

var BODY = '\n<div class="textae-editor__body">\n    <div class="textae-editor__body__annotation-box"></div>\n    <div class="textae-editor__body__text-box"></div>\n</div>\n';

exports['default'] = function (editor, model) {
  var hover = new _Hover2['default'](editor, model.annotationData.entity);

  var api = {
    init: function init(editor, buttonController, typeGap, typeContainer) {
      (0, _setSelectionModelHandler2['default'])(editor, model, buttonController);

      editor[0].innerHTML = BODY;

      var relationRenderer = new _RendererRelationRenderer2['default'](editor, model, typeContainer);
      var arrangePositionAllRelation = relationRenderer.init(editor),
          display = new _Display2['default'](editor, model.annotationData, typeContainer, arrangePositionAllRelation);

      setHandlerOnTyapGapEvent(editor, model, typeGap, typeContainer, display);
      setHandlerOnDisplayEvent(editor, display);

      initRenderer(editor, model, display.update, typeGap, typeContainer, buttonController.buttonStateHelper, relationRenderer);

      api.updateDisplay = function () {
        display.update(typeGap());
        lineHeight.reduceBottomSpace(editor[0]);
      };
    },
    hoverRelation: hover
  };

  return api;
};

function initRenderer(editor, model, updateDisplay, typeGap, typeContainer, buttonStateHelper, relationRenderer) {
  var renderer = new _Renderer2['default'](editor, model, buttonStateHelper, typeContainer, typeGap, relationRenderer),
      debouncedUpdateDisplay = _.debounce(function () {
    return updateDisplay(typeGap());
  }, 100);

  renderer.init(editor, model.annotationData, model.selectionModel).on('change', debouncedUpdateDisplay).on('all.change', debouncedUpdateDisplay).on('paragraph.change', function () {
    return lineHeight.reduceBottomSpace(editor[0]);
  }).on('span.add', debouncedUpdateDisplay).on('span.remove', debouncedUpdateDisplay).on('entity.add', debouncedUpdateDisplay).on('entity.change', debouncedUpdateDisplay).on('entity.remove', debouncedUpdateDisplay).on('relation.add', debouncedUpdateDisplay);
}

function setHandlerOnTyapGapEvent(editor, model, typeGap, typeContainer, display) {
  var setTypeStyle = function setTypeStyle(newValue) {
    return editor.find('.textae-editor__type').css(new _TypeStyle2['default'](newValue));
  };

  typeGap(setTypeStyle);
  typeGap(function (newValue) {
    return lineHeight.setToTypeGap(editor[0], model.annotationData, typeContainer, newValue);
  });
  typeGap(display.update);
}

function setHandlerOnDisplayEvent(editor, display) {
  // Set cursor control by view rendering events.
  var cursorChanger = new _utilCursorChanger2['default'](editor);

  display.on('render.start', function (editor) {
    // console.log(editor.editorId, 'render.start');
    cursorChanger.startWait();
  }).on('render.end', function (editor) {
    // console.log(editor.editorId, 'render.end');
    cursorChanger.endWait();
  });
}
module.exports = exports['default'];

},{"../../util/CursorChanger":370,"./Display":296,"./Hover":303,"./Renderer":337,"./Renderer/RelationRenderer":319,"./TypeStyle":343,"./lineHeight":348,"./setSelectionModelHandler":349,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/interop-require-wildcard":18}],348:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.get = get;
exports.reduceBottomSpace = reduceBottomSpace;
exports.set = set;
exports.setToTypeGap = setToTypeGap;

var _getHeightIncludeDescendantGrids = require('./getHeightIncludeDescendantGrids');

var _getHeightIncludeDescendantGrids2 = _interopRequireDefault(_getHeightIncludeDescendantGrids);

var _getTextBox = require('./getTextBox');

var _getTextBox2 = _interopRequireDefault(_getTextBox);

var TEXT_HEIGHT = 23;
var MARGIN_TOP = 30;
var MINIMUM_HEIGHT = 41;

function get(editor) {
  var textBox = (0, _getTextBox2['default'])(editor),
      style = window.getComputedStyle(textBox);

  return pixelToInt(style.lineHeight);
}

// Reduce the space under the .textae-editor__body__text-box same as padding-top.

function reduceBottomSpace(editor) {
  var textBox = (0, _getTextBox2['default'])(editor),
      style = window.getComputedStyle(textBox);

  // The height calculated by auto is exclude the value of the padding top.
  // Rest small space.
  textBox.style.height = 'auto';
  textBox.style.height = textBox.offsetHeight - pixelToInt(style.paddingTop) + 20 + 'px';
}

function set(editor, heightValue) {
  var textBox = (0, _getTextBox2['default'])(editor);

  textBox.style.lineHeight = heightValue + 'px';
  textBox.style.paddingTop = heightValue / 2 + 'px';

  suppressScrollJump(textBox, heightValue);

  reduceBottomSpace(editor);
}

function setToTypeGap(editor, annotationData, typeContainer, typeGapValue) {
  var heightOfType = typeGapValue * 18 + 18,
      maxHeight = undefined;

  if (annotationData.span.all().length === 0) {
    var style = window.getComputedStyle(editor),
        n = pixelToInt(style.lineHeight);

    if (style.lineHeight === 'normal') {
      maxHeight = MINIMUM_HEIGHT;
    } else {
      maxHeight = n;
    }
  } else {
    maxHeight = _.max(annotationData.span.all().map(function (span) {
      return (0, _getHeightIncludeDescendantGrids2['default'])(span, typeContainer, typeGapValue);
    }));

    maxHeight += TEXT_HEIGHT + MARGIN_TOP;
  }

  set(editor, maxHeight);
}

function suppressScrollJump(textBox, heightValue) {
  var beforeLineHeight = textBox.style.lineHeight,
      b = pixelToInt(beforeLineHeight);

  if (b) {
    window.scroll(window.scrollX, window.scrollY * heightValue / b);
  }
}

function pixelToInt(str) {
  return str === '' ? 0 : parseInt(str, 10);
}

},{"./getHeightIncludeDescendantGrids":345,"./getTextBox":346,"babel-runtime/helpers/interop-require-default":17}],349:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Selector = require('./Selector');

var _Selector2 = _interopRequireDefault(_Selector);

exports['default'] = function (editor, model, buttonController) {
  var selector = new _Selector2['default'](editor, model);

  // Because entity.change is off at relation-edit-mode.
  model.selectionModel.on('span.select', selector.span.select).on('span.deselect', selector.span.deselect).on('span.change', buttonController.buttonStateHelper.updateBySpan).on('entity.select', selector.entity.select).on('entity.deselect', selector.entity.deselect).on('relation.select', delay150(selector.relation.select)).on('relation.deselect', delay150(selector.relation.deselect)).on('relation.change', buttonController.buttonStateHelper.updateByRelation);
};

function delay150(func) {
  return _.partial(_.delay, func, 150);
}
module.exports = exports['default'];

},{"./Selector":341,"babel-runtime/helpers/interop-require-default":17}],350:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (editor, presenter, view) {
  editor.on('mousedown', function (e) {
    if (e.shiftKey) {
      return false;
    }
  })
  // Prevent a selection of a type by the double-click.
  .on('mousedown', '.textae-editor__type', function () {
    return false;
  }).on('mousedown', '.textae-editor__body__text-box__paragraph-margin', function (e) {
    // Prevent a selection of a margin of a paragraph by the double-click.
    if (e.target.className === 'textae-editor__body__text-box__paragraph-margin') return false;
  }).on('mouseup', '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', presenter.event.editorSelected).on('mouseenter', '.textae-editor__entity', function (e) {
    return view.hoverRelation.on($(e.target).attr('title'));
  }).on('mouseleave', '.textae-editor__entity', function (e) {
    return view.hoverRelation.off($(e.target).attr('title'));
  });
};

module.exports = exports['default'];

},{}],351:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ViewLineHeight = require('./View/lineHeight');

var lineHeight = _interopRequireWildcard(_ViewLineHeight);

exports['default'] = function (editor, annotationData, typeContainer, typeGap, view) {
  lineHeight.setToTypeGap(editor[0], annotationData, typeContainer, typeGap());
  view.updateDisplay();
};

module.exports = exports['default'];

},{"./View/lineHeight":348,"babel-runtime/helpers/interop-require-wildcard":18}],352:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (editor, entityId) {
  return editor.querySelector("[title=\"" + entityId + "\"]");
};

module.exports = exports["default"];

},{}],353:[function(require,module,exports){
'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getLeftElement = getLeftElement;
exports.getRightElement = getRightElement;

function getLeftElement(editorDom, element) {
  console.assert(element, 'element MUST exists.');

  var _getElements = getElements(editorDom, element);

  var _getElements2 = _slicedToArray(_getElements, 2);

  var all = _getElements2[0];
  var index = _getElements2[1];

  if (index > 0) {
    return all[index - 1];
  }
}

function getRightElement(editorDom, element) {
  console.assert(element, 'element MUST exists.');

  var _getElements3 = getElements(editorDom, element);

  var _getElements32 = _slicedToArray(_getElements3, 2);

  var all = _getElements32[0];
  var index = _getElements32[1];

  if (all.length - index > 1) {
    return all[index + 1];
  }
}

function getElements(editorDom, element) {
  var className = _Array$from(element.classList).filter(function (name) {
    return name.indexOf('textae-editor__') === 0;
  })[0],
      all = editorDom.querySelectorAll('.' + className),
      index = _Array$from(all).indexOf(element);

  return [all, index];
}

},{"babel-runtime/core-js/array/from":1,"babel-runtime/helpers/sliced-to-array":19}],354:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _getUrlParameters = require('./getUrlParameters');

var _getUrlParameters2 = _interopRequireDefault(_getUrlParameters);

var priorUrl = function priorUrl(params, editor, name) {
  if (!params[name] && editor.attr(name)) params[name] = editor.attr(name);
},
    priorAttr = function priorAttr(params, editor, name) {
  if (editor.attr(name)) params[name] = editor.attr(name);
};

module.exports = function (editor) {
  // Read model parameters from url parameters and html attributes.
  var params = (0, _getUrlParameters2['default'])(location.search);

  // 'source' prefer to 'target'
  params.target = editor.attr('source') || editor.attr('target') || params.source || params.target;

  priorAttr(params, editor, 'config');
  priorAttr(params, editor, 'status_bar');

  // Mode is prior in the url parameter.
  priorUrl(params, editor, 'mode');

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

},{"./getUrlParameters":355,"babel-runtime/helpers/interop-require-default":17}],355:[function(require,module,exports){
// Usage sample: getUrlParameters(location.search).
'use strict';

module.exports = function (urlQuery) {
  // Remove ? at top.
  var queryString = urlQuery ? String(urlQuery).replace(/^\?(.*)/, '$1') : '';

  // Convert to array if exists
  var querys = queryString.length > 0 ? queryString.split('&') : [];

  return querys.map(function (param) {
    // Convert string "key=value" to object.
    var vals = param.split('=');
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

},{}],356:[function(require,module,exports){
'use strict';

var typeCounter = [],
    makeTypePrefix = function makeTypePrefix(editorId, prefix) {
  return editorId + '__' + prefix;
},
    makeId = function makeId(editorId, prefix, id) {
  return makeTypePrefix(editorId, prefix) + id;
},
    spanDelimiter = '_';

module.exports = {
  // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
  makeSpanId: function makeSpanId(editor, span) {
    var spanPrefix = makeTypePrefix(editor.editorId, 'S');
    return spanPrefix + span.begin + spanDelimiter + span.end;
  },
  // The ID of type has number of type.
  // This IDs are used for id of DOM element and css selector for jQuery.
  // But types are inputed by users and may have `!"#$%&'()*+,./:;<=>?@[\]^`{|}~` which can not be used for css selecor.
  makeTypeId: function makeTypeId(spanId, type) {
    if (typeCounter.indexOf(type) === -1) {
      typeCounter.push(type);
    }
    return spanId + '-' + typeCounter.indexOf(type);
  },
  makeEntityDomId: function makeEntityDomId(editor, id) {
    // Exclude : and . from a dom id to use for ID selector.
    return makeId(editor.editorId, 'E', id.replace(/[:¥.]/g, ''));
  },
  makeParagraphId: function makeParagraphId(editor, id) {
    return makeId(editor.editorId, 'P', id);
  }
};

},{}],357:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _observ = require('observ');

var _observ2 = _interopRequireDefault(_observ);

var _componentDataAccessObject = require('../component/DataAccessObject');

var _componentDataAccessObject2 = _interopRequireDefault(_componentDataAccessObject);

var _buttonModelButtonController = require('../buttonModel/ButtonController');

var _buttonModelButtonController2 = _interopRequireDefault(_buttonModelButtonController);

var _buttonModelWritable = require('../buttonModel/Writable');

var _buttonModelWritable2 = _interopRequireDefault(_buttonModelWritable);

// model manages data objects.

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

// The history of command that providing undo and redo.

var _History = require('./History');

var _History2 = _interopRequireDefault(_History);

var _observe = require('./observe');

var observe = _interopRequireWildcard(_observe);

var _start2 = require('./start');

var _start3 = _interopRequireDefault(_start2);

var CONFIRM_DISCARD_CHANGE_MESSAGE = 'There is a change that has not been saved. If you procceed now, you will lose it.';

exports['default'] = function () {
  var model = new _Model2['default'](this),
      history = new _History2['default'](),
      clipBoard = {
    // clipBoard has entity type.
    clipBoard: []
  },
      buttonController = new _buttonModelButtonController2['default'](this, model, clipBoard),
      dataAccessObject = new _componentDataAccessObject2['default'](this, CONFIRM_DISCARD_CHANGE_MESSAGE);

  var writable = new _buttonModelWritable2['default']();

  observe.observeModelChange(model.annotationData, history, writable);
  observe.observeHistorfChange(history, buttonController.buttonStateHelper, CONFIRM_DISCARD_CHANGE_MESSAGE, writable);
  observe.observeDataSave(dataAccessObject, history, writable);

  // public funcitons of editor
  this.api = {
    start: function start(editor) {
      return (0, _start3['default'])(editor, dataAccessObject, history, buttonController, model, clipBoard, writable);
    }
  };

  return this;
};

module.exports = exports['default'];

},{"../buttonModel/ButtonController":161,"../buttonModel/Writable":162,"../component/DataAccessObject":163,"./History":198,"./Model":230,"./observe":358,"./start":359,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/interop-require-wildcard":18,"observ":159}],358:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.observeModelChange = observeModelChange;
exports.observeHistorfChange = observeHistorfChange;
exports.observeDataSave = observeDataSave;

var _componentShowVilidationDialog = require('../component/showVilidationDialog');

var _componentShowVilidationDialog2 = _interopRequireDefault(_componentShowVilidationDialog);

function observeModelChange(annotationData, history, writable) {
  annotationData.on('all.change', function (annotationData, multitrack, reject) {
    history.reset();
    (0, _componentShowVilidationDialog2['default'])(self, reject);
  });
}

function observeHistorfChange(history, buttonStateHelper, leaveMessage, writable) {
  history.on('change', function (state) {
    // change button state
    buttonStateHelper.enabled("undo", state.hasAnythingToUndo);
    buttonStateHelper.enabled("redo", state.hasAnythingToRedo);

    // change leaveMessage show
    window.onbeforeunload = state.hasAnythingToSave ? function () {
      return leaveMessage;
    } : null;

    writable.update(state.hasAnythingToSave);
  });
}

function observeDataSave(dataAccessObject, history, writable) {
  dataAccessObject.on('save', function () {
    history.saved();
    writable.forceModified(false);
    toastr.success("annotation saved");
  }).on('save error', function () {
    toastr.error("could not save");
  });
}

},{"../component/showVilidationDialog":183,"babel-runtime/helpers/interop-require-default":17}],359:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _observ = require('observ');

var _observ2 = _interopRequireDefault(_observ);

var _utilAjaxAccessor = require('../util/ajaxAccessor');

var ajaxAccessor = _interopRequireWildcard(_utilAjaxAccessor);

var _componentStatusBar = require('../component/StatusBar');

var _componentStatusBar2 = _interopRequireDefault(_componentStatusBar);

var _getParams = require('./getParams');

var _getParams2 = _interopRequireDefault(_getParams);

var _SpanConfig = require('./SpanConfig');

var _SpanConfig2 = _interopRequireDefault(_SpanConfig);

var _Command = require('./Command');

var _Command2 = _interopRequireDefault(_Command);

var _TypeContainer = require('./TypeContainer');

var _TypeContainer2 = _interopRequireDefault(_TypeContainer);

var _View = require('./View');

var _View2 = _interopRequireDefault(_View);

var _Presenter = require('./Presenter');

var _Presenter2 = _interopRequireDefault(_Presenter);

var _bindMouseEvent = require('./bindMouseEvent');

var _bindMouseEvent2 = _interopRequireDefault(_bindMouseEvent);

var _APIs = require('./APIs');

var _APIs2 = _interopRequireDefault(_APIs);

var _calculateLineHeight = require('./calculateLineHeight');

var _calculateLineHeight2 = _interopRequireDefault(_calculateLineHeight);

exports['default'] = function (editor, dataAccessObject, history, buttonController, model, clipBoard, writable) {
  var params = (0, _getParams2['default'])(editor),
      spanConfig = new _SpanConfig2['default'](),

  // Users can edit model only via commands.
  command = new _Command2['default'](editor, model, history),
      typeGap = new _observ2['default'](-1),
      typeContainer = new _TypeContainer2['default'](model),
      view = new _View2['default'](editor, model),
      presenter = new _Presenter2['default'](editor, model, view, command, spanConfig, clipBoard, buttonController, typeGap, typeContainer, writable);

  view.init(editor, buttonController, typeGap, typeContainer, writable);
  (0, _bindMouseEvent2['default'])(editor, presenter, view);
  presenter.init(params.mode);

  var statusBar = getStatusBar(editor, params.status_bar);

  dataAccessObject.on('load', function (data) {
    setAnnotation(spanConfig, typeContainer, model.annotationData, params.config, data.annotation);
    statusBar.status(data.source);
  });

  loadAnnotation(spanConfig, typeContainer, model.annotationData, statusBar, params, dataAccessObject);

  var updateLineHeight = function updateLineHeight() {
    return (0, _calculateLineHeight2['default'])(editor, model.annotationData, typeContainer, typeGap, view);
  };

  editor.api = new _APIs2['default'](command, presenter, dataAccessObject, history, model.annotationData, buttonController, view, updateLineHeight);
};

function loadAnnotation(spanConfig, typeContainer, annotationData, statusBar, params, dataAccessObject) {
  var annotation = params.annotation;

  if (annotation) {
    if (annotation.inlineAnnotation) {
      // Set an inline annotation.
      setAnnotation(spanConfig, typeContainer, annotationData, params.config, JSON.parse(annotation.inlineAnnotation));
      statusBar.status('inline');
    } else if (annotation.url) {
      // Load an annotation from server.
      dataAccessObject.getAnnotationFromServer(annotation.url);
    }
  }
}

function setAnnotation(spanConfig, typeContainer, annotationData, config, annotation) {
  var ret = setConfigInAnnotation(spanConfig, typeContainer, annotation);

  if (ret === 'no config') {
    setConfigFromServer(spanConfig, typeContainer, annotationData, config, annotation);
  } else {
    annotationData.reset(annotation);
  }
}

function setConfigInAnnotation(spanConfig, typeContainer, annotation) {
  spanConfig.reset();
  setSpanAndTypeConfig(spanConfig, typeContainer, annotation.config);

  if (!annotation.config) {
    return 'no config';
  }
}

function setConfigFromServer(spanConfig, typeContainer, annotationData, config, annotation) {
  spanConfig.reset();

  if (typeof config === 'string') {
    ajaxAccessor.getAsync(config, function (configFromServer) {
      setSpanAndTypeConfig(spanConfig, typeContainer, configFromServer);
      annotationData.reset(annotation);
    }, function () {
      return alert('could not read the span configuration from the location you specified.: ' + config);
    });
  } else {
    annotationData.reset(annotation);
  }
}

function setSpanAndTypeConfig(spanConfig, typeContainer, config) {
  spanConfig.set(config);
  setTypeConfig(typeContainer, config);
}

function setTypeConfig(typeContainer, config) {
  typeContainer.setDefinedEntityTypes(config ? config['entity types'] : []);
  typeContainer.setDefinedRelationTypes(config ? config['relation types'] : []);

  if (config && config.css !== undefined) {
    $('#css_area').html('<link rel="stylesheet" href="' + config.css + '"/>');
  }

  return config;
}

function getStatusBar(editor, statusBar) {
  if (statusBar === 'on') return new _componentStatusBar2['default'](editor);
  return {
    status: function status() {}
  };
}
module.exports = exports['default'];

},{"../component/StatusBar":174,"../util/ajaxAccessor":371,"./APIs":191,"./Command":196,"./Presenter":283,"./SpanConfig":294,"./TypeContainer":295,"./View":347,"./bindMouseEvent":350,"./calculateLineHeight":351,"./getParams":354,"babel-runtime/helpers/interop-require-default":17,"babel-runtime/helpers/interop-require-wildcard":18,"observ":159}],360:[function(require,module,exports){
'use strict';

module.exports = {
  isUri: function isUri(type) {
    return String(type).indexOf('http') > -1;
  },
  getUrlMatches: function getUrlMatches(type) {
    // The regular-expression to parse URL.
    // See detail:
    // http://someweblog.com/url-regular-expression-javascript-link-shortener/
    var urlRegex = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
    return urlRegex.exec(type);
  }
};

},{}],361:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _tool = require('./tool');

var _tool2 = _interopRequireDefault(_tool);

var _control = require('./control');

var _control2 = _interopRequireDefault(_control);

var _editor = require('./editor');

var _editor2 = _interopRequireDefault(_editor);

var tool = new _tool2['default']();

jQuery.fn.textae = (function () {
  return function () {
    if (this.hasClass("textae-editor")) {
      this.each(function () {
        var e = $(this);
        tool.pushEditor(e);
        _editor2['default'].apply(e);
        e.api.start(e);
        return e;
      });
      tool.selectFirstEditor();
    } else if (this.hasClass("textae-control")) {
      var c = (0, _control2['default'])(this);
      tool.setControl(c);
      return c;
    }
  };
})();

},{"./control":186,"./editor":357,"./tool":368,"babel-runtime/helpers/interop-require-default":17}],362:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getMousePoint = require('./getMousePoint');

var _getMousePoint2 = _interopRequireDefault(_getMousePoint);

exports['default'] = function (helpDialog, editors) {
  return function (name) {
    switch (name) {
      case 'textae.control.button.help.click':
        helpDialog();
        break;
      default:
        if (editors.getSelected()) {
          editors.getSelected().api.handleButtonClick(name, {
            point: (0, _getMousePoint2['default'])()
          });
        }
    }
  };
};

module.exports = exports['default'];

},{"./getMousePoint":367,"babel-runtime/helpers/interop-require-default":17}],363:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var ACTIVE_CLASS = 'textae-editor--active';

// The editor is extended jQuery object.

exports['default'] = function () {
  var editorList = [],
      selected = null,
      _select = function _select(editorList, editor) {
    switchActiveClass(editorList, editor);
    selected = editor;
  };

  return {
    push: function push(editor) {
      return editorList.push(editor);
    },
    getNewId: function getNewId() {
      return 'editor' + editorList.length;
    },
    getSelected: function getSelected() {
      return selected;
    },
    select: function select(editor) {
      return _select(editorList, editor);
    },
    selectFirst: function selectFirst() {
      return _select(editorList, editorList[0]);
    },
    forEach: editorList.forEach.bind(editorList)
  };
};

function switchActiveClass(editors, selected) {
  // Remove ACTIVE_CLASS from others than selected.
  editors.filter(function (editor) {
    return editor !== selected;
  }).map(function (other) {
    return other[0];
  }).forEach(function (elemet) {
    elemet.classList.remove(ACTIVE_CLASS);
  });

  // Add ACTIVE_CLASS to the selected.
  selected[0].classList.add(ACTIVE_CLASS);
}
module.exports = exports['default'];

},{}],364:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getKeyCode = require('./getKeyCode');

var _getKeyCode2 = _interopRequireDefault(_getKeyCode);

var _convertKeyEvent = require('./convertKeyEvent');

var _convertKeyEvent2 = _interopRequireDefault(_convertKeyEvent);

var _getMousePoint = require('./getMousePoint');

var _getMousePoint2 = _interopRequireDefault(_getMousePoint);

exports['default'] = function (helpDialog, editors) {
  return function (e) {
    var key = (0, _convertKeyEvent2['default'])((0, _getKeyCode2['default'])(e));

    if (key === 'H') {
      helpDialog();
    } else if (editors.getSelected()) {
      editors.getSelected().api.handleKeyInput(key, {
        point: (0, _getMousePoint2['default'])(),
        shiftKey: e.shiftKey
      });
    }
  };
};

module.exports = exports['default'];

},{"./convertKeyEvent":365,"./getKeyCode":366,"./getMousePoint":367,"babel-runtime/helpers/interop-require-default":17}],365:[function(require,module,exports){
'use strict';

var _Map = require('babel-runtime/core-js/map')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = convertKeyEvent;
var controlKeyEventMap = new _Map([[27, 'ESC'], [37, 'LEFT'], [38, 'UP'], [39, 'RIGHT'], [40, 'DOWN'], [46, 'DEL']]);

function convertKeyEvent(keyCode) {
  if (65 <= keyCode && keyCode <= 90) {
    // From a to z, convert 'A' to 'Z'
    return String.fromCharCode(keyCode);
  } else if (controlKeyEventMap.has(keyCode)) {
    // Control keys, like ESC, DEL ...
    return controlKeyEventMap.get(keyCode);
  }
}

module.exports = exports['default'];

},{"babel-runtime/core-js/map":4}],366:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (e) {
  return e.keyCode;
};

module.exports = exports["default"];

},{}],367:[function(require,module,exports){
// Ovserve and record mouse position to return it.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var lastMousePoint = {};

document.querySelector('html').addEventListener('mousemove', function (e) {
  lastMousePoint.top = e.clientY;
  lastMousePoint.left = e.clientX;
});

exports['default'] = function () {
  return lastMousePoint;
};

module.exports = exports['default'];

},{}],368:[function(require,module,exports){
'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _EditorContainer = require('./EditorContainer');

var _EditorContainer2 = _interopRequireDefault(_EditorContainer);

var _ControlButtonHandler = require('./ControlButtonHandler');

var _ControlButtonHandler2 = _interopRequireDefault(_ControlButtonHandler);

var _KeyInputHandler = require('./KeyInputHandler');

var _KeyInputHandler2 = _interopRequireDefault(_KeyInputHandler);

var _observeKeyWithoutDialog = require('./observeKeyWithoutDialog');

var _observeKeyWithoutDialog2 = _interopRequireDefault(_observeKeyWithoutDialog);

var _componentHelpDialog = require('../component/HelpDialog');

var _componentHelpDialog2 = _interopRequireDefault(_componentHelpDialog);

var helpDialog = new _componentHelpDialog2['default']();

// The tool manages interactions between components.

exports['default'] = function () {
  var controlBar = new ControlBar(),
      editors = new _EditorContainer2['default'](),
      handleControlButtonClick = new _ControlButtonHandler2['default'](helpDialog, editors);

  // Start observation at document ready, because this function may be called before body is loaded.
  window.addEventListener('load', function () {
    var handleKeyInput = new _KeyInputHandler2['default'](helpDialog, editors);

    (0, _observeKeyWithoutDialog2['default'])(handleKeyInput);
    redrawOnResize(editors);
  });

  return {
    // Register a control to tool.
    setControl: function setControl(instance) {
      // Use arguments later than first.
      // Because the first argmest of event handlers of the jQuery event is jQuery event object.
      instance.on('textae.control.button.click', function (e) {
        for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }

        return handleControlButtonClick.apply(undefined, rest);
      });

      controlBar.setInstance(instance);
    },
    // Register editors to tool
    pushEditor: function pushEditor(editor) {
      editors.push(editor);

      // Add an event emitter to the editer.
      var emitter = new _events.EventEmitter().on('textae.editor.select', function () {
        return editors.select(editor);
      }).on('textae.control.button.push', function (data) {
        if (editor === editors.getSelected()) controlBar.push(data.buttonName, data.state);
      }).on('textae.control.buttons.change', function (enableButtons) {
        if (editor === editors.getSelected()) controlBar.changeButtonState(enableButtons);
      });

      _Object$assign(editor, {
        editorId: editors.getNewId(),
        eventEmitter: emitter
      });
    },
    // Select the first editor
    selectFirstEditor: function selectFirstEditor() {
      // Disable all buttons.
      controlBar.changeButtonState();
      editors.selectFirst();
    }
  };
};

function ControlBar() {
  var control = null;

  return {
    setInstance: function setInstance(instance) {
      return control = instance;
    },
    changeButtonState: function changeButtonState(enableButtons) {
      if (control) {
        control.updateAllButtonEnableState(enableButtons);
      }
    },
    push: function push(buttonName, _push) {
      if (control) control.updateButtonPushState(buttonName, _push);
    }
  };
}

// Observe window-resize event and redraw all editors.
function redrawOnResize(editors) {
  // Bind resize event
  window.addEventListener('resize', _.debounce(function () {
    // Redraw all editors per editor.
    editors.forEach(function (editor) {
      return window.requestAnimationFrame(editor.api.redraw);
    });
  }, 500));
}
module.exports = exports['default'];

},{"../component/HelpDialog":164,"./ControlButtonHandler":362,"./EditorContainer":363,"./KeyInputHandler":364,"./observeKeyWithoutDialog":369,"babel-runtime/core-js/object/assign":5,"babel-runtime/helpers/interop-require-default":17,"events":108}],369:[function(require,module,exports){
// Observe key-input events and convert events to readable code.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (keyInputHandler) {
  var noop = function noop() {},
      onKeyup = keyInputHandler; // Overwrite by the noop when daialogs are opened.

  // Observe key-input
  document.addEventListener('keyup', function (event) {
    return onKeyup(event);
  });

  // Disable/Enable key-input When a jquery-ui dialog is opened/closeed
  $('body').on('dialogopen', '.ui-dialog', function () {
    return onKeyup = noop;
  }).on('dialogclose', '.ui-dialog', function () {
    return onKeyup = keyInputHandler;
  });
};

module.exports = exports['default'];

},{}],370:[function(require,module,exports){
'use strict';

var changeCursor = function changeCursor(editor, action) {
  // Add jQuery Ui dialogs to targets because they are not in the editor.
  editor = editor.add('.ui-dialog, .ui-widget-overlay');
  editor[action + 'Class']('textae-editor--wait');
};

module.exports = function (editor) {
  var wait = _.partial(changeCursor, editor, 'add'),
      endWait = _.partial(changeCursor, editor, 'remove');

  return {
    startWait: wait,
    endWait: endWait
  };
};

},{}],371:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAsync = getAsync;
exports.post = post;

function getAsync(url, dataHandler, failedHandler) {
  if (isEmpty(url)) {
    return;
  }

  var opt = {
    type: "GET",
    url: url,
    cache: false,
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(opt).done(function (data) {
    if (dataHandler !== undefined) {
      dataHandler(data);
    }
  }).fail(function (res, textStatus, errorThrown) {
    if (failedHandler !== undefined) {
      failedHandler();
    }
  });
}

function post(url, data, successHandler, failHandler, finishHandler) {
  if (isEmpty(url)) {
    return;
  }

  console.log("POST data", data);

  var opt = {
    type: "post",
    url: url,
    contentType: "application/json",
    data: data,
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    }
  };

  $.ajax(opt).done(successHandler).fail(failHandler).always(finishHandler);
}

function isEmpty(str) {
  return !str || str === "";
}

},{}],372:[function(require,module,exports){
"use strict";

module.exports = function (hash, element) {
  hash[element.name] = element;
  return hash;
};

},{}]},{},[361]);

// for module pattern with tail.js
(function(jQuery) { // Application main
  $(function() { // setup contorl
    $(".textae-control").textae()

    // setup editor
    $(".textae-editor").textae()
  })
})(jQuery)
