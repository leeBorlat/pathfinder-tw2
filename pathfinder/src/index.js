"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var generateMaze_1 = require("./generateMaze");
var grid_1 = require("./grid"); // Import the Cell interface
var startNode = { x: 1, y: 1, wall: false }; // Default start node position
var goalNode = { x: 119, y: 59, wall: false }; // Default goal node position
var prevStartNode = null; // Previous start node position
var prevGoalNode = null; // Previous goal node position
// Function to generate and render maze based on wall percentage
function generateAndRenderMaze(wallPercentage) {
  var width = 121; // including the borders
  var height = 61; // including the borders
  var mazeString = (0, generateMaze_1.generateRandomMazeWithBorder)(
    width,
    height,
    wallPercentage
  );
  var mazeData = mazeString.split("\n");
  var mazeGrid = mazeData.map(function (row, rowIndex) {
    return row.split("").map(function (cell, cellIndex) {
      return {
        x: cellIndex,
        y: rowIndex,
        wall: cell === "#",
      };
    });
  });
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context === null || context === void 0
    ? void 0
    : context.clearRect(0, 0, canvas.width, canvas.height);
  var walls = mazeGrid.flat().filter(function (_a) {
    var wall = _a.wall;
    return wall;
  });
  var paths = mazeGrid.flat().filter(function (_a) {
    var wall = _a.wall;
    return !wall;
  });
  (0, grid_1.paintCells)(walls, "#000");
  (0, grid_1.paintCells)(paths, "#fff");
  (0, grid_1.paintCells)([startNode], "green");
  (0, grid_1.paintCells)([goalNode], "red");
  // Update the maze array
  grid_1.maze.splice.apply(
    grid_1.maze,
    __spreadArray([0, grid_1.maze.length], mazeGrid, false)
  );
}
// Function to update the start and goal node positions
function updateStartAndGoalNodes(startX, startY, goalX, goalY) {
  // Check if start and goal positions are valid and not walls
  if (
    startX >= 1 &&
    startX <= 119 &&
    startY >= 1 &&
    startY <= 59 &&
    goalX >= 1 &&
    goalX <= 119 &&
    goalY >= 1 &&
    goalY <= 59 &&
    (startX !== goalX || startY !== goalY) &&
    !grid_1.maze[startY][startX].wall && // Check if the start node is not a wall
    !grid_1.maze[goalY][goalX].wall // Check if the goal node is not a wall
  ) {
    // Store the previous start and goal nodes
    prevStartNode = startNode;
    prevGoalNode = goalNode;
    // Update the start and goal node positions
    startNode = { x: startX, y: startY, wall: false };
    goalNode = { x: goalX, y: goalY, wall: false };
    // Update the maze array to reflect the new positions
    grid_1.maze[startNode.y][startNode.x] = startNode;
    grid_1.maze[goalNode.y][goalNode.x] = goalNode;
    // Repaint the previous start and goal nodes to white
    if (prevStartNode) {
      (0, grid_1.paintCells)([prevStartNode], "#fff");
    }
    if (prevGoalNode) {
      (0, grid_1.paintCells)([prevGoalNode], "#fff");
    }
    // Repaint the new start and goal nodes
    (0, grid_1.paintCells)([startNode], "green");
    (0, grid_1.paintCells)([goalNode], "red");
    console.log(startNode);
    console.log(goalNode);
  } else {
    alert(
      "Invalid input. x should be between 1 and 120, y should be between 1 and 60, start and goal nodes should not be the same, and should not be on a wall."
    );
  }
}
document.addEventListener("DOMContentLoaded", function () {
  generateAndRenderMaze(0);
});
(_a = document.getElementById("generateMazeBtn")) === null || _a === void 0
  ? void 0
  : _a.addEventListener("click", function () {
      var randomizerInput = document.getElementById("randomizer-percentage");
      var wallPercentage = randomizerInput.value
        ? parseInt(randomizerInput.value)
        : 30;
      generateAndRenderMaze(wallPercentage);
    });
document
  .querySelectorAll(".startx, .starty, .goalx, .goaly")
  .forEach(function (element) {
    element.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        var startX = parseInt(document.querySelector(".startx").value);
        var startY = parseInt(document.querySelector(".starty").value);
        var goalX = parseInt(document.querySelector(".goalx").value);
        var goalY = parseInt(document.querySelector(".goaly").value);
        // Update the positions of startNode and goalNode
        updateStartAndGoalNodes(startX, startY, goalX, goalY);
      }
    });
  });
var getNode = function (x, y) {
  if (x < 0 || x >= grid_1.maze[0].length || y < 0 || y >= grid_1.maze.length) {
    // Out of bounds
    return null;
  }
  return __assign({}, grid_1.maze[y][x]);
};
var heuristicManhattan = function (source, target) {
  return Math.abs(source.x - target.x) + Math.abs(source.y - target.y);
};
var successors = function (currentNode, goalNode) {
  var adjacent = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];
  var successorNodes = adjacent
    .map(function (node) {
      return getNode(currentNode.x + node.x, currentNode.y + node.y);
    })
    .filter(function (node) {
      return node !== null;
    })
    .filter(function (_a) {
      var wall = _a.wall;
      return !wall;
    });
  return successorNodes.map(function (successor) {
    return __assign(__assign({}, successor), {
      previous: currentNode,
      totalCost: (currentNode.totalCost || 0) + 1,
      heuristic: heuristicManhattan(successor, goalNode),
    });
  });
};
var isSameLocation = function (source, target) {
  return source.x === target.x && source.y === target.y;
};
var isNodeBetter = function (source, target) {
  return (
    source.totalCost + source.heuristic < target.totalCost + target.heuristic ||
    (source.totalCost + source.heuristic ===
      target.totalCost + target.heuristic &&
      source.heuristic < target.heuristic)
  );
};
var getPath = function (node) {
  return node.previous
    ? __spreadArray([__assign({}, node)], getPath(node.previous), true)
    : [__assign({}, node)];
};
var isWorseDuplicate = function (source, target) {
  return isSameLocation(source, target) && !isNodeBetter(source, target);
};
var pathFind = function (startNode, goalNode) {
  return __awaiter(void 0, void 0, void 0, function () {
    var fringe, explored, thisNode, foundPath, pathLengthInput, successorNodes;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          fringe = [startNode];
          explored = [];
          _a.label = 1;
        case 1:
          thisNode = fringe.shift();
          // Have we reached the goal
          if (isSameLocation(thisNode, goalNode)) {
            foundPath = getPath(thisNode);
            pathLengthInput = document.getElementById("path-length");
            if (pathLengthInput instanceof HTMLInputElement) {
              // Type guard to ensure it's an input element
              pathLengthInput.value = foundPath.length.toString(); // Correctly update the value
            }
            // Repaint the path cells
            (0, grid_1.paintCells)(
              foundPath.filter(function (node) {
                return (
                  !isSameLocation(node, startNode) &&
                  !isSameLocation(node, goalNode)
                );
              }),
              "yellow"
            );
            return [
              2 /*return*/,
              "Found path with length ".concat(foundPath.length),
            ];
          }
          // Mark as explored
          explored.push(__assign({}, thisNode));
          successorNodes = successors(thisNode, goalNode);
          successorNodes.forEach(function (suc) {
            if (
              __spreadArray(
                __spreadArray([], explored, true),
                fringe,
                true
              ).some(function (exploredNode) {
                return isWorseDuplicate(suc, exploredNode);
              })
            )
              return;
            for (var i = 0; i < fringe.length; i++) {
              if (isNodeBetter(suc, fringe[i])) {
                fringe.splice(i, 0, suc);
                return;
              }
            }
            fringe.push(suc);
          });
          (0, grid_1.paintCells)(
            explored.filter(function (node) {
              return (
                !isSameLocation(node, startNode) &&
                !isSameLocation(node, goalNode)
              );
            }),
            "#00f"
          );
          (0, grid_1.paintCells)(
            fringe.filter(function (node) {
              return (
                !isSameLocation(node, startNode) &&
                !isSameLocation(node, goalNode)
              );
            }),
            "pink"
          );
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              return setTimeout(resolve, 0);
            }),
          ];
        case 2:
          _a.sent();
          _a.label = 3;
        case 3:
          if (fringe.length > 0 && fringe.length < 1000000)
            return [3 /*break*/, 1];
          _a.label = 4;
        case 4:
          return [2 /*return*/, "Path not found"];
      }
    });
  });
};
var greedyBestFirstSearch = function (startNode, goalNode) {
  return __awaiter(void 0, void 0, void 0, function () {
    var fringe, explored, thisNode, foundPath, pathLengthInput, successorNodes;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          fringe = [startNode];
          explored = [];
          _a.label = 1;
        case 1:
          if (!(fringe.length > 0)) return [3 /*break*/, 3];
          thisNode = fringe.shift();
          // Have we reached the goal
          if (isSameLocation(thisNode, goalNode)) {
            foundPath = getPath(thisNode);
            pathLengthInput = document.getElementById("path-length");
            if (pathLengthInput instanceof HTMLInputElement) {
              // Type guard to ensure it's an input element
              pathLengthInput.value = foundPath.length.toString(); // Correctly update the value
            }
            // Repaint the path cells
            (0, grid_1.paintCells)(
              foundPath.filter(function (node) {
                return (
                  !isSameLocation(node, startNode) &&
                  !isSameLocation(node, goalNode)
                );
              }),
              "yellow"
            );
            return [
              2 /*return*/,
              "Found path with length ".concat(foundPath.length),
            ];
          }
          // Mark as explored
          explored.push(__assign({}, thisNode));
          successorNodes = successors(thisNode, goalNode);
          successorNodes.forEach(function (suc) {
            if (
              __spreadArray(
                __spreadArray([], explored, true),
                fringe,
                true
              ).some(function (exploredNode) {
                return isWorseDuplicate(suc, exploredNode);
              })
            )
              return;
            for (var i = 0; i < fringe.length; i++) {
              if (isNodeBetter(suc, fringe[i])) {
                fringe.splice(i, 0, suc);
                return;
              }
            }
            fringe.push(suc);
          });
          (0, grid_1.paintCells)(
            explored.filter(function (node) {
              return (
                !isSameLocation(node, startNode) &&
                !isSameLocation(node, goalNode)
              );
            }),
            "#00f"
          );
          (0, grid_1.paintCells)(
            fringe.filter(function (node) {
              return (
                !isSameLocation(node, startNode) &&
                !isSameLocation(node, goalNode)
              );
            }),
            "pink"
          );
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              return setTimeout(resolve, 0);
            }),
          ];
        case 2:
          _a.sent();
          return [3 /*break*/, 1];
        case 3:
          return [2 /*return*/, "Path not found"];
      }
    });
  });
};
function resetPath() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  // Clear the canvas
  context === null || context === void 0
    ? void 0
    : context.clearRect(0, 0, canvas.width, canvas.height);
  // Repaint the maze walls and paths
  var walls = grid_1.maze.flat().filter(function (_a) {
    var wall = _a.wall;
    return wall;
  });
  var paths = grid_1.maze.flat().filter(function (_a) {
    var wall = _a.wall;
    return !wall;
  });
  (0, grid_1.paintCells)(walls, "#000");
  (0, grid_1.paintCells)(paths, "#fff");
  // Repaint the start and goal nodes
  (0, grid_1.paintCells)([startNode], "green");
  (0, grid_1.paintCells)([goalNode], "red");
  // Reset the explored and fringe cells
  (0, grid_1.paintCells)(
    grid_1.maze.flat().filter(function (_a) {
      var wall = _a.wall;
      return (
        !wall &&
        !isSameLocation(startNode, { x: 1, y: 1, wall: false }) &&
        !isSameLocation(goalNode, { x: 119, y: 59, wall: false })
      );
    }),
    "#fff"
  );
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("find-path").addEventListener("click", function () {
    var algorithmSelector = document.querySelector(".drpdwnAlgo");
    var selectedAlgorithm = algorithmSelector.value;
    if (selectedAlgorithm === "optimalPath") {
      pathFind(startNode, goalNode).then(function (result) {
        var output = document.getElementById("output");
        if (output) {
          output.innerText = result;
        }
      });
    } else if (selectedAlgorithm === "tradGBFS") {
      greedyBestFirstSearch(startNode, goalNode).then(function (result) {
        var output = document.getElementById("output");
        if (output) {
          output.innerText = result;
        }
      });
    } else {
      alert("Please select an option to run the pathfinding algorithm.");
    }
  });
  document.getElementById("resetBtn").addEventListener("click", function () {
    resetPath();
  });
});
//The Random Coder template code for pathfinding
// const newLocal = pathFind(
//   { x: 1, y: 1, wall: false },
//   { x: 2, y: 4, wall: false }
// ).then((result) => {
//   const output = document.getElementById("output");
//   output.innerText = result;
// }
// );
// document.getElementById("find-path").addEventListener("click", function () {
//   pathFind(startNode, goalNode).then((result) => {
//     const output = document.getElementById("output");
//     if (output) {
//       output.innerText = result;
//     }
//   });
// });
