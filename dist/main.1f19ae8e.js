// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
const TYPES = {
  string: 'String',
  number: 'Number',
  expression: 'Expression'
};
const EXPRESSIONS = {
  cin: 'cin',
  cout: 'cout'
};

class AST {
  constructor() {
    this.global = Object.create(null);
    this.stack = new Array();
  }

  addVol(vol) {
    this.global[vol.name] = vol;
  }

  addAction(action) {
    this.stack.push(action);
  }

}

class Terminal {
  getInput() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let value;

        while (!value) {
          value = prompt('Write value');
        }

        resolve(value);
      }, 500);
    });
  }

}

class Exceptions {
  static typeError({
    value,
    type
  }) {
    throw new TypeError(`Cannot set value ${value} of type ${type}`);
  }

  static primitiveAssignError({
    type
  }) {
    throw new Error(`Cannot set value of primitive type ${type}`);
  }

  static referenceError({
    name
  }) {
    throw new ReferenceError(`${name} is not defined`);
  }

}

class Primitive {
  constructor({
    name,
    type,
    value
  }) {
    this._name = name;
    this._type = type;
    this._value = value;

    if (!type) {
      this.defineType();
    }
  }

  set value(val) {
    if (this._type === TYPES.string) {
      this._value = String(val);
    } else if (this._type === TYPES.number && Number(val)) {
      this._value = Number(val);
    } else {
      Exceptions.typeError({
        value: val,
        type: this._type
      });
    }
  }

  set name(name) {
    this._name = name;
  }

  set type(type) {
    this._type = type;
  }

  get value() {
    return this._value;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  defineType() {
    if (String(this.value).charAt(0) === '"') {
      this.type = TYPES.string;
    } else if (!isNaN(this.value)) {
      this.type = TYPES.number;
    }
  }

}

const ast = new AST();
const terminal = new Terminal();

function excludeSpaces(program) {
  return program.trim();
}

function parseExpression(program) {
  let match, expr;
  program = excludeSpaces(program);

  if (match = /^vol\s*(\w+)\s*=\s*(\d+)\b/.exec(program)) {
    expr = new Primitive({
      type: TYPES.number,
      name: match[1],
      value: Number(match[2])
    });
    ast.addVol(expr);
  } else if (match = /^vol\s*(\w+)\s*=\s*"(\w+?)"/.exec(program)) {
    expr = new Primitive({
      type: TYPES.string,
      name: match[1],
      value: match[2]
    });
    ast.addVol(expr);
  } else {
    match = parseAction(program);
  }

  let remainProgram = program.slice(match[0].length);

  if (remainProgram.length) {
    parseExpression(remainProgram);
  }

  return ast;
}

function parseAction(program) {
  let match, expr;
  program = excludeSpaces(program);

  if (match = /^c\.(out|in)\((.+)\)/.exec(program)) {
    expr = {
      type: TYPES.expression,
      args: parseArguments(match[2]),
      kind: 'c' + match[1]
    };
    ast.addAction(expr);
  } else {
    throw SyntaxError(`Unexpected syntax ${program}`);
  }

  return match;
}

function parseArguments(program) {
  let args = program.split(',').map(defineArgument);
  return args;
}

function defineArgument(val) {
  let arg = {};
  let value = val.trim();

  if (String(value).charAt(0) === '"') {
    arg = new Primitive({
      value: String(value).replace(/\"/g, '')
    });
  } else if (!isNaN(value)) {
    arg = new Primitive({
      value: Number(value)
    });
  } else {
    arg = new Primitive({
      name: value
    }); // Remove actions with ast
  }

  return arg;
}

async function interpret(ast) {
  if (!ast.stack.length) return;
  console.log('stack', ast.stack);

  for (const action of ast.stack) {
    if (action.type === TYPES.expression) {
      const args = evaluate(action.args);
      await topScope[action.kind](action, args);
    }
  }
}

function evaluate(args) {
  return args.map(arg => ast.global[arg.name]);
}

const topScope = Object.create(null);

topScope.cin = async function (action, args) {
  if (!args) throw SyntaxError(`Invalid number of arguments - ${args.length}`);
  let i = 0;

  while (i < args.length) {
    let inputVal = await terminal.getInput();
    let arg = args[i];
    console.log('<< ', arg.name);

    if (arg.name) {
      ast.global[arg.name].value = inputVal; // Remove actions with ast
    } else {
      Exceptions.primitiveAssignError({
        type: arg.type
      });
    }

    i++;
  }

  console.log(ast);
  return action;
};

topScope.cout = async function (action, args) {
  if (!args) throw SyntaxError(`Invalid number of arguments - ${args.length}`);
  let i = 0;

  while (i < args.length) {
    let arg = args[i];

    if (arg !== null && arg !== void 0 && arg.name) {
      console.log('>> ', arg.value);
    } else {
      Exceptions.referenceError({
        name: arg.name
      });
    }

    i++;
  }

  console.log(ast);
  return action;
}; // let expression = `
//   vol i = "asd"
//   vol b = 1231
// `


let expression = `
  vol i = "asd"
  vol b=1231
  c.in(i)
  c.out(i, b)
  c.out(c)
`;
parseExpression(expression);
interpret(ast);
/*
  vol i = 0
  vol x = 10

  c.out(x) // simple print of varriable
  c.in(i) // you should to write smth in console to define "i"

  loop:i;i<x;i++:{
    doSmth
  }

  shaqo root(a, b){
    vol sum = a + b
    return res
  }
*/
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55375" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map