"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mazeString = exports.generateRandomMazeWithBorder = void 0;
function generateRandomMazeWithBorder(width, height, wallPercentage) {
    if (wallPercentage < 0 || wallPercentage > 100) {
        console.error("Percent must be from 0 to 100");
        return;
    }
    // Initialize maze with spaces, leaving the outer edges as walls
    var maze = Array.from({ length: height }, function (_, y) {
        return Array.from({ length: width }, function (_, x) {
            return x === 0 || x === width - 1 || y === 0 || y === height - 1 ? "#" : " ";
        });
    });
    var innerWidth = width - 2; // Adjusting for walls
    var innerHeight = height - 2; // Adjusting for walls
    var totalInnerCells = innerWidth * innerHeight;
    var wallCount = Math.floor(totalInnerCells * (wallPercentage / 100));
    while (wallCount > 0) {
        // Random positions for walls inside the border
        var x = Math.floor(Math.random() * innerWidth) + 1; // +1 to avoid the border
        var y = Math.floor(Math.random() * innerHeight) + 1; // +1 to avoid the border
        if (maze[y][x] === " ") {
            maze[y][x] = "#";
            wallCount--;
        }
    }
    // Convert maze array to string representation.
    return maze.map(function (row) { return row.join(""); }).join("\n");
}
exports.generateRandomMazeWithBorder = generateRandomMazeWithBorder;
var width = 120; // including the borders
var height = 60; // including the borders
var wallPercentage = 30; // 30% of the inner maze will be walls
exports.mazeString = generateRandomMazeWithBorder(width, height, wallPercentage);
console.log(exports.mazeString);
