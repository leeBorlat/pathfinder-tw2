"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paintCells = exports.maze = void 0;
var mazeData_1 = require("./mazeData");
var maze = mazeData_1.mazeData.map(function (row, rowIndex) {
  return row.split("").map(function (cell, cellIndex) {
    return {
      x: cellIndex,
      y: rowIndex,
      wall: cell === "#",
    };
  });
});
exports.maze = maze;
var cellSize = 15.5;
var canvas = document.getElementById("canvas");
canvas.width = maze[0].length * cellSize;
canvas.height = maze.length * cellSize;
var context = canvas.getContext("2d");
var paintCells = function (cells, fillStyle) {
  context.fillStyle = fillStyle;
  cells.forEach(function (cell) {
    context.fillRect(
      cell.x * cellSize + 1,
      cell.y * cellSize + 1,
      cellSize - 2,
      cellSize - 2
    );
  });
};
exports.paintCells = paintCells;
