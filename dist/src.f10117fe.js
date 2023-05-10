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
})({"src/classes.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Water = exports.Dirt = exports.Plant = exports.Zebra = exports.Lion = exports.Animal = exports.Cell = void 0;
var Cell = /** @class */function () {
  function Cell(_a) {
    var x = _a.x,
      y = _a.y,
      contents = _a.contents;
    this.contents = contents;
    this.isObstacle = contents.some(function (content) {
      return content.isObstacle;
    });
    this.x = x;
    this.y = y;
  }
  Cell.prototype.updateContents = function (contents) {
    this.contents = contents;
  };
  Cell.prototype.getNearestCellIndexes = function () {
    return [[this.x - 1, this.y], [this.x + 1, this.y], [this.x, this.y - 1], [this.x, this.y + 1]];
  };
  return Cell;
}();
exports.Cell = Cell;
var Animal = /** @class */function () {
  function Animal() {
    this.speed = 1;
    this.age = "adult";
    this.health = 10;
    this.thirstLevel = 0;
    this.hungerLevel = 0;
    this.reproductiveUrge = 0;
    this.isObstacle = true;
    this.deceased = false;
  }
  Animal.prototype.getGreatestDesire = function () {
    var wantsToReproduce = this.reproductiveUrge > this.thirstLevel && this.reproductiveUrge > this.hungerLevel && this.hungerLevel <= 5 && this.thirstLevel <= 5;
    var wantsToEat = this.hungerLevel !== 0 && this.hungerLevel > this.thirstLevel;
    var wantsToDrink = this.thirstLevel !== 0 && this.thirstLevel >= this.hungerLevel;
    if (wantsToReproduce) {
      return "looking for mate";
    } else if (wantsToEat) {
      return "looking for food";
    } else if (wantsToDrink) {
      return "looking for water";
    }
  };
  Animal.prototype.increaseDesires = function () {
    this.hungerLevel++;
    this.thirstLevel++;
    this.reproductiveUrge++;
  };
  Animal.prototype.eat = function () {
    // could update this method to take in a food source with varying nutritionalValue
    if (this.health < 10) {
      this.health++;
    }
    if (this.hungerLevel > 0) {
      this.hungerLevel = this.hungerLevel - 3;
    }
  };
  Animal.prototype.loseHealth = function (healthToLose) {
    this.health = this.health - healthToLose;
    if (this.health <= 0) {
      this.deceased = true;
    }
  };
  return Animal;
}();
exports.Animal = Animal;
var Lion = /** @class */function (_super) {
  __extends(Lion, _super);
  function Lion() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.type = "lion";
    _this.icon = "🦁";
    return _this;
  }
  return Lion;
}(Animal);
exports.Lion = Lion;
var Zebra = /** @class */function (_super) {
  __extends(Zebra, _super);
  function Zebra() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.type = "zebra";
    _this.icon = "🦓";
    return _this;
  }
  return Zebra;
}(Animal);
exports.Zebra = Zebra;
var Plant = /** @class */function () {
  function Plant(type) {
    this.type = type;
    this.nutritionalValue = 50;
    this.isObstacle = type === "tree";
  }
  return Plant;
}();
exports.Plant = Plant;
var Dirt = /** @class */function () {
  function Dirt() {
    this.type = "dirt";
    this.isObstacle = false;
    this.willBecomePlant = false;
  }
  Dirt.prototype.turnIntoPlant = function () {
    this.willBecomePlant = true;
  };
  return Dirt;
}();
exports.Dirt = Dirt;
var Water = /** @class */function () {
  function Water() {
    this.type = "water";
    this.amount = Infinity;
    this.isObstacle = true;
  }
  return Water;
}();
exports.Water = Water;
},{}],"src/createInitialBoard.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInitialBoard = void 0;
var classes_1 = require("./classes");
function populateBoard(_a) {
  var boardState = _a.boardState,
    boardSize = _a.boardSize,
    elementCount = _a.elementCount,
    elementType = _a.elementType;
  console.log("Populating board with " + elementCount + " " + elementType);
  for (var elementsCreated = 0; elementsCreated < elementCount; elementsCreated++) {
    var randomCellX = chance.integer({
      min: 0,
      max: boardSize - 1
    });
    var randomCellY = chance.integer({
      min: 0,
      max: boardSize - 1
    });
    var randomCellContents = boardState[randomCellX][randomCellY].contents;
    var cellContainsOnlyDirt = randomCellContents.length === 1;
    if (cellContainsOnlyDirt) {
      switch (elementType) {
        case "lion":
          randomCellContents.push(new classes_1.Lion());
          break;
        case "zebra":
          randomCellContents.push(new classes_1.Zebra());
          break;
        case "tree":
          randomCellContents.push(new classes_1.Plant("tree"));
          break;
        case "grass":
          randomCellContents.push(new classes_1.Plant("grass"));
          break;
        case "water":
          // first remove the dirt to replace it with water
          randomCellContents.pop();
          randomCellContents.push(new classes_1.Water());
      }
    }
  }
}
// Initialize the board with dirt, then populate it with plants, animals and water
function createInitialBoard(_a) {
  var _b = _a.boardSize,
    boardSize = _b === void 0 ? 20 : _b,
    _c = _a.resourceDensity,
    resourceDensity = _c === void 0 ? "low" : _c,
    _d = _a.treeCount,
    treeCount = _d === void 0 ? 1 : _d,
    _e = _a.zebraCount,
    zebraCount = _e === void 0 ? 1 : _e,
    _f = _a.lionCount,
    lionCount = _f === void 0 ? 1 : _f;
  // Throw error if user tries to create too many elements.
  if (treeCount + zebraCount + lionCount > boardSize * boardSize) {
    throw new RangeError("Number of animals and plants exceeds bopard size! Please increase board size or lower number of animals and plants.");
  }
  // Create a 2D array of cells that represents the board
  var boardState = [];
  // Loop over each row in the board
  for (var rowNumber = 0; rowNumber < boardSize; rowNumber++) {
    var newRow = [];
    // Loop over each column in the row and initialize each cell to just contain dirt
    for (var columnNumber = 0; columnNumber < boardSize; columnNumber++) {
      var ground = new classes_1.Dirt();
      var contents = [ground];
      var cell = new classes_1.Cell({
        x: rowNumber,
        y: columnNumber,
        contents: contents
      });
      newRow.push(cell);
    }
    boardState.push(newRow);
  }
  // Now that every cell contains dirt, randomly insert plants, animals and water
  var grassAndWaterCount = resourceDensity === "high" ? Math.round(boardSize / 2) : resourceDensity === "medium" ? Math.round(boardSize / 4) : Math.round(boardSize / 6);
  var elementsToCreate = [{
    type: "tree",
    count: treeCount
  }, {
    type: "zebra",
    count: zebraCount
  }, {
    type: "lion",
    count: lionCount
  }, {
    type: "grass",
    count: grassAndWaterCount
  }, {
    type: "water",
    count: grassAndWaterCount
  }];
  elementsToCreate.forEach(function (element) {
    populateBoard({
      boardState: boardState,
      boardSize: boardSize,
      elementType: element.type,
      elementCount: element.count
    });
  });
  return boardState;
}
exports.createInitialBoard = createInitialBoard;
},{"./classes":"src/classes.ts"}],"src/renderBoard.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderBoard = void 0;
function renderBoard(_a) {
  var board = _a.board,
    boardState = _a.boardState;
  console.log("Rendering Board State: ", boardState);
  // Clear the board so we don't end up creating new boards every iteration
  // NAIVE and SLOW approach since we tear down every div and rebuild from scratch
  board.innerHTML = "";
  // Loop through every row
  boardState.forEach(function (row) {
    // Create an HTML Div element to hold each cell in an individual row
    var gridRow = document.createElement("div");
    gridRow.className = "row";
    board.appendChild(gridRow);
    // Loop through every cell in the current row
    row.forEach(function (cell) {
      // Create an HTML Div element reprensenting each cell and it's contents
      var gridCell = document.createElement("div");
      gridCell.classList.add("cell");
      cell.contents.forEach(function (content) {
        switch (content.type) {
          case "grass":
            gridCell.innerHTML = "🌱";
            break;
          case "tree":
            gridCell.innerHTML = "🌳";
            break;
          case "water":
            gridCell.classList.add("water");
            break;
          case "lion":
            gridCell.innerHTML = "🦁";
            break;
          case "zebra":
            gridCell.innerHTML = "🦓";
            break;
          // Dirt is the default
          default:
            gridCell.classList.add("dirt");
        }
      });
      gridRow.appendChild(gridCell);
    });
  });
}
exports.renderBoard = renderBoard;
},{}],"src/beginGameLoop.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beginGameLoop = void 0;
var classes_1 = require("./classes");
var renderBoard_1 = require("./renderBoard");
// function created by chatgpt and updated with a criteria function
function findNearestCell(x, y, array, criteria) {
  var minDistance = Number.MAX_VALUE;
  var nearestElement = null;
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array[i].length; j++) {
      if (array[i][j] && criteria(array[i][j])) {
        // only check for elements matching criteria such as "call contains water"
        var distance = Math.sqrt(Math.pow(i - x, 2) + Math.pow(j - y, 2)); // calculate Euclidean distance
        if (distance < minDistance) {
          minDistance = distance;
          nearestElement = array[i][j];
        }
      }
    }
  }
  return nearestElement;
}
function beginGameLoop(_a) {
  var initialBoardState = _a.initialBoardState,
    board = _a.board;
  var boardState = initialBoardState;
  (0, renderBoard_1.renderBoard)({
    boardState: boardState,
    board: board
  });
  // -----------------------------------------------------
  var gameLoop = setInterval(function () {
    console.log("ROUND BEGINNING");
    boardState.forEach(function (row) {
      row.forEach(function (cell) {
        var cellContainsSomething = cell.contents.length > 1;
        if (cellContainsSomething) {
          cell.contents.forEach(function (element) {
            if (element instanceof classes_1.Animal) {
              console.log("Calculating " + element.type + " Desires");
              // increase hunger, thirst and reproductive urge
              element.increaseDesires();
              // get animals greatest desire to determine what they should move towards
              var desire = element.getGreatestDesire();
              console.log(element.type + "'s greatest desire: " + desire);
              switch (desire) {
                case "looking for water":
                  var nearestDesire = findNearestCell(cell.x, cell.y, boardState, function (cell) {
                    return cell.contents.some(function (element) {
                      return element instanceof classes_1.Water;
                    });
                  });
                  // Check if animal is already next to their greatest desire
                  if ((Math.abs(nearestDesire.x - cell.x) === 1 || nearestDesire.x === cell.x) && (Math.abs(nearestDesire.y - cell.y) === 1 || nearestDesire.y === cell.y)) {
                    break;
                  }
                  var newXValue = cell.x > nearestDesire.x ? cell.x - 1 : cell.x < nearestDesire.x ? cell.x + 1 : cell.x;
                  var newYValue = cell.y > nearestDesire.y ? cell.y - 1 : cell.y < nearestDesire.y ? cell.y + 1 : cell.y;
                  var availableCell = null;
                  // Look for a non-obstacle cell that is adjacent to the current position of the moving animal
                  var adjacentCells = [[cell.x - 1, cell.y], [cell.x + 1, cell.y], [cell.x, cell.y - 1], [cell.x, cell.y + 1], [cell.x + 1, cell.y + 1], [cell.x - 1, cell.y - 1], [cell.x + 1, cell.y - 1], [cell.x - 1, cell.y + 1]];
                  for (var _i = 0, adjacentCells_1 = adjacentCells; _i < adjacentCells_1.length; _i++) {
                    var _a = adjacentCells_1[_i],
                      x = _a[0],
                      y = _a[1];
                    if (x >= 0 && x < boardState.length && y >= 0 && y < boardState[0].length && !boardState[x][y].contents.some(function (element) {
                      return element.isObstacle;
                    })) {
                      availableCell = boardState[x][y];
                      break;
                    }
                  }
                  // If no obstacle, move along the optimal path towards nearestDesire
                  if (!boardState[newXValue][newYValue].contents.some(function (element) {
                    return element.isObstacle;
                  })) {
                    var movingAnimal = boardState[cell.x][cell.y].contents.pop();
                    boardState[newXValue][newYValue].contents.push(movingAnimal);
                    // if obstacle, choose the first available cell with no obstacle
                  } else if (availableCell) {
                    var movingAnimal = boardState[cell.x][cell.y].contents.pop();
                    availableCell.contents.push(movingAnimal);
                  } else {
                    // if no open spaces and no optimal path available, don't do anything.
                  }
                  break;
              }
            }
          });
        }
      });
    });
    // Now that we have updated the board state we need to re-render it!
    (0, renderBoard_1.renderBoard)({
      boardState: boardState,
      board: board
    });
  }, 3000);
  // ---------------------- CREATE GAME CONTROLS ----------------------
  window.addEventListener("keyup", function (event) {
    if (event.key === "Escape") {
      clearInterval(gameLoop);
    }
  });
}
exports.beginGameLoop = beginGameLoop;
},{"./classes":"src/classes.ts","./renderBoard":"src/renderBoard.ts"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }
  return bundleURL;
}
function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }
  return '/';
}
function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');
function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }
  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }
    cssTimeout = null;
  }, 50);
}
module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createInitialBoard_1 = require("./createInitialBoard");
var beginGameLoop_1 = require("./beginGameLoop");
require("./styles.css");
// The board is the actual HTML we want to render. Not to be mistaken for the board state which is Cell[][]
var board = document.getElementById("board");
try {
  // The board state is the JavaScript object representing each cell and it's contents.
  var initialBoardState = (0, createInitialBoard_1.createInitialBoard)({
    boardSize: 15,
    lionCount: 3,
    zebraCount: 5,
    resourceDensity: "low"
  });
  (0, beginGameLoop_1.beginGameLoop)({
    initialBoardState: initialBoardState,
    board: board
  });
} catch (error) {
  alert(error);
}
},{"./createInitialBoard":"src/createInitialBoard.ts","./beginGameLoop":"src/beginGameLoop.ts","./styles.css":"src/styles.css"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40191" + '/');
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
      });

      // Enable HMR for CSS by default.
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map