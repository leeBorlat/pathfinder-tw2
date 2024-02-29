import { generateRandomMazeWithBorder } from "./generateMaze";
import { Cell, maze, paintCells } from "./grid"; // Import the Cell interface

let startNode = { x: 1, y: 1, wall: false }; // Default start node position
let goalNode = { x: 119, y: 59, wall: false }; // Default goal node position
let prevStartNode: Cell | null = null; // Previous start node position
let prevGoalNode: Cell | null = null; // Previous goal node position
let startTime: number | undefined; // Declare startTime as number or undefined

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
  if (x < 0 || x >= maze[0].length || y < 0 || y >= maze.length) {
    // Out of bounds
    return null;
  }
  return { ...maze[y][x] };
};

interface Node extends Cell {
  previous?: Node;
  totalCost?: number;
  heuristic?: number;
}

const heuristicManhattan = (source: Node, target: Node) => {
  return Math.abs(source.x - target.x) + Math.abs(source.y - target.y);
};

const heuristicEuclidean = (source: Node, target: Node) => {
  return Math.sqrt(
    Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)
  );
};

const successors = (currentNode: Node, goalNode: Node): Node[] => {
  const adjacent = [
    { x: 0, y: -1 }, //Up
    { x: 0, y: 1 }, //Down
    { x: -1, y: 0 }, //Left
    { x: 1, y: 0 }, //Right
    { x: -1, y: -1 }, // Up-Left
    { x: 1, y: -1 }, // Up-Right
    { x: -1, y: 1 }, // Down-Left
    { x: 1, y: 1 }, // Down-Right
  ];

  const successorNodes = adjacent
    .map((node) => getNode(currentNode.x + node.x, currentNode.y + node.y))
    .filter((node) => node !== null)
    .filter(({ wall }) => !wall);

  return successorNodes.map((successor) => ({
    ...successor,
    previous: currentNode,
    totalCost: (currentNode.totalCost || 0) + 1,
    heuristic: heuristicManhattan(successor, goalNode),
  }));
};

const isSameLocation = (source: Cell, target: Cell) => {
  return source.x === target.x && source.y === target.y;
};

const isNodeBetter = (source: Node, target: Node) => {
  return (
    source.totalCost + source.heuristic < target.totalCost + target.heuristic ||
    (source.totalCost + source.heuristic ===
      target.totalCost + target.heuristic &&
      source.heuristic < target.heuristic)
  );
};

const getPath = (node: Node): Node[] => {
  return node.previous
    ? [{ ...node }, ...getPath(node.previous)]
    : [{ ...node }];
};

//Check if next node is worse or not
const isWorseDuplicate = (source: Node, target: Node) => {
  return isSameLocation(source, target) && !isNodeBetter(source, target);
};

//Stock Algo
const pathFind = async (startNode: Cell, goalNode: Cell): Promise<string> => {
  const fringe = [startNode];
  const explored: Cell[] = [];
  //for counting visted explored nodes and successor nodes
  let visitedNodesCounter = 0;
  let thisNode;

  do {

    thisNode = fringe.shift();
    
    // Have we reached the goal
    if (isSameLocation(thisNode, goalNode)) {
      updateVisitedNodesInput(visitedNodesCounter);
      const endTime = performance.now(); // Capture end time when the goal is found
      const duration = (endTime - startTime); // Calculate duration in milliseconds
      const minutes = Math.floor((duration / 1000) / 60).toString().padStart(2, '0'); // Convert to minutes and format
      const seconds = Math.floor((duration / 1000) % 60).toString().padStart(2, '0'); // Get remaining seconds and format
      const milliseconds = Math.floor(duration % 1000).toString().padStart(3, '0'); // Correctly get full milliseconds in three digits
    
      // For consistency and if you only need two digits for milliseconds, consider using only the first two digits
      // However, displaying full milliseconds (three digits) is more common for precise timing
      const displayMilliseconds = milliseconds.substring(0, 2); // Taking first two digits for MM:SS.mm format if desired
    
      const foundPath = getPath(thisNode);
      const pathLengthInput = document.getElementById("path-length");
      const pathTimeInput = document.getElementById("path-time"); // Get the path-time input element
      
      if (pathLengthInput instanceof HTMLInputElement && pathTimeInput instanceof HTMLInputElement) {
        pathLengthInput.value = foundPath.length.toString(); // Update the path length value
        pathTimeInput.value = `${minutes}:${seconds}.${displayMilliseconds}`; // Update the path time value in MM:SS.mm format
      }
    
    // Repaint the path cells
      paintCells(
        foundPath.filter(
          (node) =>
            !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
        ),
        "yellow"
      );

      return `Found path with length ${foundPath.length}`;
    }
    // Mark as explored
    explored.push({ ...thisNode });
    visitedNodesCounter++;

    const successorNodes = successors(thisNode, goalNode);

    successorNodes.forEach((suc) => {
      if (
        [...explored, ...fringe].some((exploredNode) =>
          isWorseDuplicate(suc, exploredNode)
        )
      )
        return;

      for (let i = 0; i < fringe.length; i++) {
        if (isNodeBetter(suc, fringe[i])) {
          fringe.splice(i, 0, suc);
          return;
        }
      }
      fringe.push(suc);
      visitedNodesCounter++;
    });

    paintCells(
      explored.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "#00f"
    );
    paintCells(
      fringe.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "pink"
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
  } while (fringe.length > 0 && fringe.length < 1000000);

  updateVisitedNodesInput(visitedNodesCounter);
  return `Path not found`;
};

//Trad GBFS Algo
const greedyBestFirstSearch = async (
  startNode: Cell,
  goalNode: Cell
): Promise<string> => {
  const fringe = [startNode];
  const explored: Cell[] = [];
  //for counting visted explored nodes and successor nodes
  let visitedNodesCounter = 0;
  let thisNode;
  while (fringe.length > 0) {
    
    fringe.sort(
      (a, b) =>
        heuristicEuclidean(a, goalNode) - heuristicEuclidean(b, goalNode)
    );
    thisNode = fringe.shift();

    // Have we reached the goal
      if (isSameLocation(thisNode, goalNode)) {
      updateVisitedNodesInput(visitedNodesCounter);
      const endTime = performance.now(); // Capture end time when the goal is found
      const duration = (endTime - startTime); // Calculate duration in milliseconds
      const minutes = Math.floor((duration / 1000) / 60).toString().padStart(2, '0'); // Convert to minutes and format
      const seconds = Math.floor((duration / 1000) % 60).toString().padStart(2, '0'); // Get remaining seconds and format
      const milliseconds = Math.floor(duration % 1000).toString().padStart(3, '0'); // Correctly get full milliseconds in three digits
    
      // For consistency and if you only need two digits for milliseconds, consider using only the first two digits
      // However, displaying full milliseconds (three digits) is more common for precise timing
      const displayMilliseconds = milliseconds.substring(0, 2); // Taking first two digits for MM:SS.mm format if desired
    
      const foundPath = getPath(thisNode);
      const pathLengthInput = document.getElementById("path-length");
      const pathTimeInput = document.getElementById("path-time"); // Get the path-time input element
      
      if (pathLengthInput instanceof HTMLInputElement && pathTimeInput instanceof HTMLInputElement) {
        pathLengthInput.value = foundPath.length.toString(); // Update the path length value
        pathTimeInput.value = `${minutes}:${seconds}.${displayMilliseconds}`; // Update the path time value in MM:SS.mm format
      }
      // Repaint the path cells
      paintCells(
        foundPath.filter(
          (node) =>
            !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
        ),
        "yellow"
      );

      return `Found path with length ${foundPath.length}`;
    }
    // Mark as explored
    explored.push({ ...thisNode });
    visitedNodesCounter++;

    const successorNodes = successors(thisNode, goalNode);

    successorNodes.forEach((suc) => {
      if (
        [...explored, ...fringe].some((exploredNode) =>
          isWorseDuplicate(suc, exploredNode)
        )
      )
        return;

      fringe.push(suc);
      visitedNodesCounter++;
    });

    paintCells(
      explored.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "#00f"
    );
    paintCells(
      fringe.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "pink"
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  updateVisitedNodesInput(visitedNodesCounter);
  return `Path not found`;
};

//Function to count visited nodes
function updateVisitedNodesInput(count: number) {
  const visitedNodesInput = document.getElementById('visited-nodes');
  if (visitedNodesInput instanceof HTMLInputElement) {
    visitedNodesInput.value = count.toString();
  }
}
//Function to Reset path
function resetPath() {
  const canvas = <HTMLCanvasElement>document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Clear the canvas
  context?.clearRect(0, 0, canvas.width, canvas.height);

    // Clear 'path-length' input
    const pathLengthInput = document.getElementById("path-length");
    if (pathLengthInput instanceof HTMLInputElement) {
      pathLengthInput.value = ''; // Set to empty or default value
    }
  
    // Clear 'visited-nodes' input
    const visitedNodesInput = document.getElementById("visited-nodes");
    if (visitedNodesInput instanceof HTMLInputElement) {
      visitedNodesInput.value = ''; // Set to empty or default value
    }
    // Clear 'path-time' input
    const pathTimeInput = document.getElementById("path-time");
    if (pathTimeInput instanceof HTMLInputElement) {
      pathTimeInput.value = ''; // Set to empty or default value
    }
  // Repaint the maze walls and paths
  const walls = maze.flat().filter(({ wall }) => wall);
  const paths = maze.flat().filter(({ wall }) => !wall);

  paintCells(walls, "#000");
  paintCells(paths, "#fff");

  // Repaint the start and goal nodes
  paintCells([startNode], "green");
  paintCells([goalNode], "red");

  // Reset the explored and fringe cells
  paintCells(
    maze
      .flat()
      .filter(
        ({ wall }) =>
          !wall &&
          !isSameLocation(startNode, { x: 1, y: 1, wall: false }) &&
          !isSameLocation(goalNode, { x: 119, y: 59, wall: false })
      ),
    "#fff"
  );
}

//Function to Clear everything in the Canvas
function clearAll() {
  // Clear the canvas visually
  const canvas = <HTMLCanvasElement>document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);
  

  // Optionally, reset the maze to an empty or initial state
  // This would depend on how you want to manage the maze's lifecycle
  // For instance, you might regenerate a new maze or simply clear the current one
  // maze.splice(0, maze.length); // If you want to clear the maze array
  generateAndRenderMaze(0); // If you want to regenerate a new maze with 0% walls

  // Reset start and goal nodes to default positions or clear them
  startNode = { x: 1, y: 1, wall: false }; // Reset to default or choose a method to clear
  goalNode = { x: 119, y: 59, wall: false }; // Reset to default or choose a method to clear
  // Repaint the start and goal nodes in their default or new positions
  paintCells([startNode], "green");
  paintCells([goalNode], "red");

  // Clear any output or results displayed to the user
  const output = document.getElementById("output");
  if (output) {
    output.innerText = ''; // Clear any text
  }

  // Clear path length display if applicable
  const pathLengthInput = document.getElementById("path-length");
  if (pathLengthInput instanceof HTMLInputElement) {
    pathLengthInput.value = ''; // Clear the displayed path length
  }
  // Clear 'visited-nodes' input
  const visitedNodesInput = document.getElementById("visited-nodes");
    if (visitedNodesInput instanceof HTMLInputElement) {
      visitedNodesInput.value = ''; // Set to empty or default value
    }
  // Clear 'path-time' input
  const pathTimeInput = document.getElementById("path-time");
  if (pathTimeInput instanceof HTMLInputElement) {
    pathTimeInput.value = ''; // Set to empty or default value
  }
}


//For HTML Interactions
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("find-path").addEventListener("click", function () {
    startTime = performance.now();
    const algorithmSelector = document.querySelector(
      ".drpdwnAlgo"
    ) as HTMLSelectElement;
    const selectedAlgorithm = algorithmSelector.value;

    if (selectedAlgorithm === "optimalPath") {
      pathFind(startNode, goalNode).then((result) => {
        const output = document.getElementById("output");
        if (output) {
          output.innerText = result;
        }
      });
    } else if (selectedAlgorithm === "tradGBFS") {
      greedyBestFirstSearch(startNode, goalNode).then((result) => {
        const output = document.getElementById("output");
        if (output) {
          output.innerText = result;
        }
      });
    } else {
      alert("Please select an option to run the pathfinding algorithm.");
    }
  });

  document.getElementById("reset-path").addEventListener("click", () => {
    resetPath();
  });

  document.getElementById("clear-button").addEventListener("click", () => {
    clearAll();
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
