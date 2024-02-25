// import { generateRandomMazeWithBorder } from "./generateMaze";
// import { paintCells, maze, Cell } from "./grid"; // Import the Cell interface

// let startNode = { x: 1, y: 1, wall: false }; // Default start node position
// let goalNode = { x: 118, y: 58, wall: false }; // Default goal node position

// // Function to generate and render maze based on wall percentage
// function generateAndRenderMaze(wallPercentage: number) {
//   const width = 120; // including the borders
//   const height = 60; // including the borders

//   const mazeString = generateRandomMazeWithBorder(
//     width,
//     height,
//     wallPercentage
//   );
//   const mazeData = mazeString.split("\n");
//   const mazeGrid = mazeData.map((row, rowIndex) =>
//     row.split("").map((cell, cellIndex) => ({
//       x: cellIndex,
//       y: rowIndex,
//       wall: cell === "#",
//     }))
//   );

//   const canvas = <HTMLCanvasElement>document.getElementById("canvas");
//   const context = canvas.getContext("2d");
//   context?.clearRect(0, 0, canvas.width, canvas.height);

//   const walls = mazeGrid.flat().filter(({ wall }) => wall);
//   const paths = mazeGrid.flat().filter(({ wall }) => !wall);

//   paintCells(walls, "#000");
//   paintCells(paths, "#fff");
//   paintCells([startNode], "green");
//   paintCells([goalNode], "red");

//   // Update the maze array
//   maze.splice(0, maze.length, ...mazeGrid);
// }

// document.addEventListener("DOMContentLoaded", () => {
//   generateAndRenderMaze(0);
// });

// document.getElementById("generateMazeBtn")?.addEventListener("click", () => {
//   const randomizerInput = <HTMLInputElement>(
//     document.getElementById("randomizer-percentage")
//   );
//   const wallPercentage = randomizerInput.value
//     ? parseInt(randomizerInput.value)
//     : 30;
//   generateAndRenderMaze(wallPercentage);
// });

// document
//   .querySelectorAll(".startx, .starty, .goalx, .goaly")
//   .forEach((element) => {
//     element.addEventListener("keypress", (event) => {
//       if ((event as KeyboardEvent).key === "Enter") {
//         const startX = parseInt(
//           (<HTMLInputElement>document.querySelector(".startx")).value
//         );
//         const startY = parseInt(
//           (<HTMLInputElement>document.querySelector(".starty")).value
//         );
//         const goalX = parseInt(
//           (<HTMLInputElement>document.querySelector(".goalx")).value
//         );
//         const goalY = parseInt(
//           (<HTMLInputElement>document.querySelector(".goaly")).value
//         );

//         // Check if start and goal positions are valid and not walls
//         if (
//           startX >= 1 &&
//           startX <= 120 &&
//           startY >= 1 &&
//           startY <= 60 &&
//           goalX >= 1 &&
//           goalX <= 120 &&
//           goalY >= 1 &&
//           goalY <= 60 &&
//           (startX !== goalX || startY !== goalY) &&
//           !maze[startY][startX].wall && // Check if the start node is not a wall
//           !maze[goalY][goalX].wall // Check if the goal node is not a wall
//         ) {
//           startNode = { x: startX, y: startY, wall: false };
//           goalNode = { x: goalX, y: goalY, wall: false };

//           // Only repaint start and goal nodes
//           paintCells([startNode], "green");
//           paintCells([goalNode], "red");
//           console.log(startNode);
//           console.log(goalNode);
//         } else {
//           alert(
//             "Invalid input. x should be between 1 and 120, y should be between 1 and 60, start and goal nodes should not be the same, and should not be on a wall."
//           );
//         }
//       }
//     });
//   });
import { generateRandomMazeWithBorder } from "./generateMaze";
import { paintCells, maze, Cell } from "./grid"; // Import the Cell interface

let startNode = { x: 1, y: 1, wall: false }; // Default start node position
let goalNode = { x: 118, y: 58, wall: false }; // Default goal node position
let prevStartNode: Cell | null = null; // Previous start node position
let prevGoalNode: Cell | null = null; // Previous goal node position

// Function to generate and render maze based on wall percentage
function generateAndRenderMaze(wallPercentage: number) {
  const width = 120; // including the borders
  const height = 60; // including the borders

  const mazeString = generateRandomMazeWithBorder(
    width,
    height,
    wallPercentage
  );
  const mazeData = mazeString.split("\n");
  const mazeGrid = mazeData.map((row, rowIndex) =>
    row.split("").map((cell, cellIndex) => ({
      x: cellIndex,
      y: rowIndex,
      wall: cell === "#",
    }))
  );

  const canvas = <HTMLCanvasElement>document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);

  const walls = mazeGrid.flat().filter(({ wall }) => wall);
  const paths = mazeGrid.flat().filter(({ wall }) => !wall);

  paintCells(walls, "#000");
  paintCells(paths, "#fff");
  paintCells([startNode], "green");
  paintCells([goalNode], "red");

  // Update the maze array
  maze.splice(0, maze.length, ...mazeGrid);
}

document.addEventListener("DOMContentLoaded", () => {
  generateAndRenderMaze(0);
});

document.getElementById("generateMazeBtn")?.addEventListener("click", () => {
  const randomizerInput = <HTMLInputElement>(
    document.getElementById("randomizer-percentage")
  );
  const wallPercentage = randomizerInput.value
    ? parseInt(randomizerInput.value)
    : 30;
  generateAndRenderMaze(wallPercentage);
});

document
  .querySelectorAll(".startx, .starty, .goalx, .goaly")
  .forEach((element) => {
    element.addEventListener("keypress", (event) => {
      if ((event as KeyboardEvent).key === "Enter") {
        const startX = parseInt(
          (<HTMLInputElement>document.querySelector(".startx")).value
        );
        const startY = parseInt(
          (<HTMLInputElement>document.querySelector(".starty")).value
        );
        const goalX = parseInt(
          (<HTMLInputElement>document.querySelector(".goalx")).value
        );
        const goalY = parseInt(
          (<HTMLInputElement>document.querySelector(".goaly")).value
        );

        // Check if start and goal positions are valid and not walls
        if (
          startX >= 1 &&
          startX <= 120 &&
          startY >= 1 &&
          startY <= 60 &&
          goalX >= 1 &&
          goalX <= 120 &&
          goalY >= 1 &&
          goalY <= 60 &&
          (startX !== goalX || startY !== goalY) &&
          !maze[startY][startX].wall && // Check if the start node is not a wall
          !maze[goalY][goalX].wall // Check if the goal node is not a wall
        ) {
          // Store the previous start and goal nodes
          prevStartNode = startNode;
          prevGoalNode = goalNode;

          startNode = { x: startX, y: startY, wall: false };
          goalNode = { x: goalX, y: goalY, wall: false };

          // Repaint the previous start and goal nodes to white
          if (prevStartNode) {
            paintCells([prevStartNode], "#fff");
          }
          if (prevGoalNode) {
            paintCells([prevGoalNode], "#fff");
          }

          // Repaint the new start and goal nodes
          paintCells([startNode], "green");
          paintCells([goalNode], "red");

          console.log(startNode);
          console.log(goalNode);
        } else {
          alert(
            "Invalid input. x should be between 1 and 120, y should be between 1 and 60, start and goal nodes should not be the same, and should not be on a wall."
          );
        }
      }
    });
  });
