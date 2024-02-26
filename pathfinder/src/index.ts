import { generateRandomMazeWithBorder } from "./generateMaze";
import { Cell, maze, paintCells } from "./grid"; // Import the Cell interface

let startNode = { x: 1, y: 1, wall: false }; // Default start node position
let goalNode = { x: 119, y: 59, wall: false }; // Default goal node position
let prevStartNode: Cell | null = null; // Previous start node position
let prevGoalNode: Cell | null = null; // Previous goal node position

// Function to generate and render maze based on wall percentage
function generateAndRenderMaze(wallPercentage: number) {
  const width = 121; // including the borders
  const height = 61; // including the borders

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

// Function to update the start and goal node positions
function updateStartAndGoalNodes(
  startX: number,
  startY: number,
  goalX: number,
  goalY: number
) {
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
    !maze[startY][startX].wall && // Check if the start node is not a wall
    !maze[goalY][goalX].wall // Check if the goal node is not a wall
  ) {
    // Store the previous start and goal nodes
    prevStartNode = startNode;
    prevGoalNode = goalNode;

    // Update the start and goal node positions
    startNode = { x: startX, y: startY, wall: false };
    goalNode = { x: goalX, y: goalY, wall: false };

    // Update the maze array to reflect the new positions
    maze[startNode.y][startNode.x] = startNode;
    maze[goalNode.y][goalNode.x] = goalNode;

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

        // Update the positions of startNode and goalNode
        updateStartAndGoalNodes(startX, startY, goalX, goalY);
      }
    });
  });

const getNode = (x: number, y: number) => {
  if (x < 0 || x >= maze[0].length || y< 0 || y >= maze.length) {
    // Out of bounds
    return null;
  }
  return { ...maze[y][x] };
};

interface Node extends Cell {
  previous?: Node;
}

const successors = (currentNode: Cell): Node[] => {

  const adjacent = [
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: -1, y: 0},
    {x: 1, y: 0},
  ];
  const successorNodes = adjacent
    .map((node) => getNode(currentNode.x + node.x, currentNode.y + node.y))
    .filter(node => node !== null)
    .filter (({ wall }) => !wall);
  return successorNodes.map(successor => ({
    ...successor,
    previous: currentNode,
  }));
};

const isSameLocation = (source: Cell, target: Cell) => {
  return source.x === target.x && source.y === target.y;
};

const getPath = (node: Node) : Node[]  => {
  return node.previous
  ?  [{ ...node }, ...getPath(node.previous)]
  :  [{ ...node}];
};

const pathFind = async(startNode: Cell, goalNode: Cell): Promise<string>=> {
  
  const fringe = [startNode];
  const explored: Cell[] = [];
  let thisNode;

  do {
    thisNode = fringe.shift();

    //Have we reached the goal
    if (isSameLocation(thisNode, goalNode)){
      const foundPath = getPath(thisNode);
      const pathLengthInput = document.getElementById("path-length");
      if (pathLengthInput instanceof HTMLInputElement) { // Type guard to ensure it's an input element
        pathLengthInput.value = foundPath.length.toString(); // Correctly update the value
      }
      return `Found path with length ${foundPath.length}`;
    }
    // Mark as explored
    explored.push({...thisNode });

    const successorNodes = successors(thisNode);

    successorNodes.forEach((suc) => {
      if([...explored,...fringe].some(exploredNode => isSameLocation(suc, exploredNode)))
        return;
      fringe.push(suc);
    });

    paintCells(explored.filter(node => !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)), "#00f");
    paintCells(fringe.filter(node => !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)), "pink");
    paintCells((getPath(thisNode)).filter(node => !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)), "yellow");
    await new Promise((resolve) => setTimeout(resolve, 0));
  } while (fringe.length > 0 && fringe.length < 1000000);

  return `Path not found`;
};


//The Random Coder template code for pathfinding
// const newLocal = pathFind(
//   { x: 1, y: 1, wall: false },
//   { x: 2, y: 4, wall: false }
// ).then((result) => {
//   const output = document.getElementById("output");
//   output.innerText = result;
// }
// );
document.getElementById("find-path").addEventListener("click", function() {
  pathFind(startNode, goalNode).then((result) => {
    const output = document.getElementById("output");
    if (output) {
      output.innerText = result;
    }
  });
});

