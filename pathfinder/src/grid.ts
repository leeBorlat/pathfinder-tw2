import { mazeData } from "./mazeData";
// import { mapData } from "./mapData";

interface Cell {
  x: number;
  y: number;
  wall: boolean;
}

// const map = mapData.map((row, rowIndex) => {
//   return row.split("").map((cell, cellIndex) => ({
//     x: cellIndex,
//     y: rowIndex,
//     wall: cell === "#",
//   }));
// });

const maze = mazeData.map((row, rowIndex) => {
  return row.split("").map((cell, cellIndex) => ({
    x: cellIndex,
    y: rowIndex,
    wall: cell === "#",
  }));
});

const cellSize = 15;
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = maze[0].length * cellSize;
canvas.height = maze.length * cellSize;
const context = canvas.getContext("2d");

const paintCells = (cells: Cell[], fillStyle: string) => {
  context.fillStyle = fillStyle;
  cells.forEach((cell) => {
    context.fillRect(
      cell.x * cellSize,
      cell.y * cellSize,
      cellSize - 1,
      cellSize - 1
    );
  });
};
export { Cell, maze, paintCells }; // Export the Cell interface
