"use strict";
// import { mazeData } from "./mazeData";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paintCells = exports.maze = void 0;
// interface Cell {
//   x: number;
//   y: number;
//   wall: boolean;
// }
// const maze = mazeData.map((row, rowIndex) => {
//   return row.split("").map((cell, cellIndex) => ({
//     x: cellIndex,
//     y: rowIndex,
//     wall: cell === "#",
//   }));
// });
// const cellSize = 15.5;
// const canvas = <HTMLCanvasElement>document.getElementById("canvas");
// canvas.width = maze[0].length * cellSize;
// canvas.height = maze.length * cellSize;
// const context = canvas.getContext("2d");
// const paintCells = (cells: Cell[], fillStyle: string) => {
//   context.fillStyle = fillStyle;
//   cells.forEach((cell) => {
//     context.fillRect(
//       cell.x * cellSize + 1,
//       cell.y * cellSize + 1,
//       cellSize - 2,
//       cellSize - 2
//     );
//   });
// };
// export { maze, paintCells };
var mazeData_1 = require("./mazeData");
var maze = mazeData_1.mazeData.map(function (row, rowIndex) {
    return row.split("").map(function (cell, cellIndex) { return ({
        x: cellIndex,
        y: rowIndex,
        wall: cell === "#",
    }); });
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
        context.fillRect(cell.x * cellSize + 1, cell.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });
};
exports.paintCells = paintCells;
// Wrap the drawing logic in a function
var drawMaze = function () {
    // Example: paint all cells as walls to start
    // You would replace this with your actual drawing logic
    paintCells(maze.flat().filter(function (cell) { return cell.wall; }), 'black');
};
// Listen for button click to trigger the drawing
document.getElementById('randomBtn').addEventListener('click', drawMaze);
