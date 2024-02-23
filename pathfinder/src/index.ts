// import { generateRandomMazeWithBorder } from "./generateMaze";
// import { maze, paintCells } from "./grid";

// // Add an event listener to the Generate Maze button
// document.getElementById('generateMazeBtn')?.addEventListener('click', () => {
//   // Parameters for maze generation - these could be dynamic or static
//   const width = 120; // including the borders
//   const height = 60; // including the borders
//   // Retrieve the randomizer percentage value from the input
//   const randomizerInput = <HTMLInputElement>document.getElementById("randomizer-percentage");
//   const wallPercentage = randomizerInput.value ? parseInt(randomizerInput.value) : 30; // Default to 30 if no input
  
//   // Generate a new maze using the dynamic wallPercentage
//   const mazeString = generateRandomMazeWithBorder(width, height, wallPercentage);


//   // Split the maze string into an array of strings, each representing a row in the maze
//   const mazeData = mazeString.split("\n");

//   // Convert the maze string data into a grid of cells
//   const mazeGrid = mazeData.map((row, rowIndex) => {
//     return row.split("").map((cell, cellIndex) => ({
//       x: cellIndex,
//       y: rowIndex,
//       wall: cell === "#",
//     }));
//   });

//   // Clear the canvas before drawing the new maze
//   const canvas = <HTMLCanvasElement>document.getElementById("canvas");
//   const context = canvas.getContext("2d");
//   context?.clearRect(0, 0, canvas.width, canvas.height);

//   // Paint the newly generated maze
//   const walls = mazeGrid.flat().filter(({ wall }) => wall);
//   const paths = mazeGrid.flat().filter(({ wall }) => !wall);

//   paintCells(walls, "#000");
//   paintCells(paths, "#fff");
// });
import { generateRandomMazeWithBorder } from "./generateMaze";
import { paintCells } from "./grid";

// Function to generate and render maze based on wall percentage
function generateAndRenderMaze(wallPercentage: number) {
  const width = 120; // including the borders
  const height = 60; // including the borders

  // Generate a new maze using the specified wallPercentage
  const mazeString = generateRandomMazeWithBorder(width, height, wallPercentage);

  // Split the maze string into an array of strings, each representing a row in the maze
  const mazeData = mazeString.split("\n");

  // Convert the maze string data into a grid of cells
  const mazeGrid = mazeData.map((row, rowIndex) =>
    row.split("").map((cell, cellIndex) => ({
      x: cellIndex,
      y: rowIndex,
      wall: cell === "#",
    }))
  );

  // Clear the canvas before drawing the new maze
  const canvas = <HTMLCanvasElement>document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);

  // Paint the newly generated maze
  const walls = mazeGrid.flat().filter(({ wall }) => wall);
  const paths = mazeGrid.flat().filter(({ wall }) => !wall);

  paintCells(walls, "#000");
  paintCells(paths, "#fff");
}

// Initial render of the maze with 0% walls
document.addEventListener("DOMContentLoaded", (event) => {
  generateAndRenderMaze(0); // Start with a maze that has 0% wall percentage
});

// Add an event listener to the Generate Maze button
document.getElementById("generateMazeBtn")?.addEventListener("click", () => {
  // Retrieve the randomizer percentage value from the input
  const randomizerInput = <HTMLInputElement>document.getElementById("randomizer-percentage");
  const wallPercentage = randomizerInput.value ? parseInt(randomizerInput.value) : 30; // Default to 30 if no input

  // Generate and render a new maze using the dynamic wallPercentage
  generateAndRenderMaze(wallPercentage);
});
