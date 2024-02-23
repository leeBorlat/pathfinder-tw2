import { generateRandomMazeWithBorder } from "./generateMaze";
import { maze, paintCells } from "./grid";

// Add an event listener to the Generate Maze button
document.getElementById('generateMazeBtn')?.addEventListener('click', () => {
  // Parameters for maze generation - these could be dynamic or static
  const width = 120; // including the borders
  const height = 60; // including the borders
  const wallPercentage = 30; // 30% of the inner maze will be walls

  // Generate a new maze
  const mazeString = generateRandomMazeWithBorder(width, height, wallPercentage);

  // Split the maze string into an array of strings, each representing a row in the maze
  const mazeData = mazeString.split("\n");

  // Convert the maze string data into a grid of cells
  const mazeGrid = mazeData.map((row, rowIndex) => {
    return row.split("").map((cell, cellIndex) => ({
      x: cellIndex,
      y: rowIndex,
      wall: cell === "#",
    }));
  });

  // Clear the canvas before drawing the new maze
  const canvas = <HTMLCanvasElement>document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);

  // Paint the newly generated maze
  const walls = mazeGrid.flat().filter(({ wall }) => wall);
  const paths = mazeGrid.flat().filter(({ wall }) => !wall);

  paintCells(walls, "#000");
  paintCells(paths, "#fff");
});
