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

  // Convert maze data to grid while keeping start/goal nodes clear
  const mazeGrid = mazeData.map((row, rowIndex) =>
    row.split("").map((cell, cellIndex) => {
      const isStart = cellIndex === startNode.x && rowIndex === startNode.y;
      const isGoal = cellIndex === goalNode.x && rowIndex === goalNode.y;
      return {
        x: cellIndex,
        y: rowIndex,
        wall: cell === "#" && !isStart && !isGoal, // Ensure start/goal aren't walls
      };
    })
  );

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
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

//Function to generate maze
document.getElementById("generateMazeBtn")?.addEventListener("click", () => {
  const randomizerInput = document.getElementById(
    "randomizer-percentage"
  ) as HTMLInputElement;
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
        const startXInput = document.querySelector(
          ".startx"
        ) as HTMLInputElement;
        const startYInput = document.querySelector(
          ".starty"
        ) as HTMLInputElement;
        const goalXInput = document.querySelector(".goalx") as HTMLInputElement;
        const goalYInput = document.querySelector(".goaly") as HTMLInputElement;

        // Ensure string input to parseInt using 'toString()'
        const startX = parseInt(startXInput.value?.toString() ?? "0");
        const startY = parseInt(startYInput.value?.toString() ?? "0");
        const goalX = parseInt(goalXInput.value?.toString() ?? "0");
        const goalY = parseInt(goalYInput.value?.toString() ?? "0");

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
  x: number;
  y: number;
  wall: boolean; // Add the 'wall' property to the Node interface
}

//Manhattan Distance
const heuristicManhattan = (source: Node, target: Node) => {
  return Math.abs(source.x - target.x) + Math.abs(source.y - target.y);
};

//Euclidean Distance
const heuristicEuclidean = (source: Node, target: Node) => {
  return Math.sqrt(
    Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)
  );
};

// Chebyshev Distance
const heuristicChebyshev = (source: Node, target: Node) => {
  return Math.max(Math.abs(source.x - target.x), Math.abs(source.y - target.y));
};

// Octile Distance
const heuristicOctile = (source: Node, target: Node) => {
  const dx = Math.abs(source.x - target.x);
  const dy = Math.abs(source.y - target.y);
  const minDelta = Math.min(dx, dy);
  const maxDelta = Math.max(dx, dy);
  return minDelta * Math.SQRT2 + (maxDelta - minDelta);
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
    .map(({ x: dx, y: dy }) => {
      const nextX = currentNode.x + dx;
      const nextY = currentNode.y + dy;
      const node = getNode(nextX, nextY);
      if (node && !node.wall) {
        return {
          x: nextX,
          y: nextY,
          wall: false,
          previous: currentNode,
          totalCost: (currentNode.totalCost || 0) + 1,
          heuristic: heuristicEuclidean(
            { x: nextX, y: nextY, wall: false },
            goalNode
          ),
        } as Node;
      }
      return null;
    })
    .filter((node): node is Node => !!node);

  return successorNodes;
};

//Successors for proposed algo
const propsuccessors = (currentNode: Node, goalNode: Node): Node[] => {
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

  const propsuccessorNodes = adjacent
    .map(({ x: dx, y: dy }) => {
      const nextX = currentNode.x + dx;
      const nextY = currentNode.y + dy;
      const node = getNode(nextX, nextY);
      if (node && !node.wall) {
        return {
          x: nextX,
          y: nextY,
          wall: false,
          previous: currentNode,
          totalCost: (currentNode.totalCost || 0) + 1,
          heuristic: heuristicOctile(
            { x: nextX, y: nextY, wall: false },
            goalNode
          ),
        } as Node;
      }
      return null;
    })
    .filter((node): node is Node => !!node);

  return propsuccessorNodes;
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

//Function to get the path from start to goal node
const getPath = (node: Node): Node[] => {
  return node.previous
    ? [{ ...node }, ...getPath(node.previous)]
    : [{ ...node }];
};

//Check if next node is worse or not
const isWorseDuplicate = (source: Node, target: Node) => {
  return isSameLocation(source, target) && !isNodeBetter(source, target);
};

//Trad GBFS Algo
const tradGBFS = async (startNode: Node, goalNode: Node): Promise<string> => {
  let startTime: number | undefined; // Declare startTime as number or undefined
  startTime = performance.now(); // Initialize startTime when the algorithm starts

  const openList: Node[] = [startNode];
  const closedList: Node[] = [];
  let visitedNodesCounter = 0;

  while (openList.length > 0) {
    // Step 3: Remove the node with the lowest heuristic value from the open list
    openList.sort(
      (a, b) =>
        heuristicEuclidean(a, goalNode) - heuristicEuclidean(b, goalNode)
    );
    const currentNode = openList.shift();

    if (!currentNode) break;

    // Step 4: Move the current node to the closed list
    closedList.push(currentNode);

    // Step 5: Check if the current node is the goal node
    if (isSameLocation(currentNode, goalNode)) {
      // Path found, update UI and return path
      
      const endTime = performance.now(); // Capture end time when the goal is found
      const duration = endTime - startTime; // Calculate duration in milliseconds
      const minutes = Math.floor(duration / 1000 / 60)
        .toString()
        .padStart(2, "0"); // Convert to minutes and format
      const seconds = Math.floor((duration / 1000) % 60)
        .toString()
        .padStart(2, "0"); // Get remaining seconds and format
      const milliseconds = Math.floor(duration % 1000)
        .toString()
        .padStart(3, "0"); // Correctly get full milliseconds in three digits

      // For consistency and if you only need two digits for milliseconds, consider using only the first two digits
      // However, displaying full milliseconds (three digits) is more common for precise timing
      const displayMilliseconds = milliseconds.substring(0, 2); // Taking first two digits for MM:SS.mm format if desired

      const foundPath = getPath(currentNode);
      const pathLengthInput = document.getElementById("path-length");
      const pathTimeInput = document.getElementById("path-time"); // Get the path-time input element

      if (
        pathLengthInput instanceof HTMLInputElement &&
        pathTimeInput instanceof HTMLInputElement
      ) {
        pathLengthInput.value = foundPath.length.toString(); // Update the path length value
        pathTimeInput.value = `${minutes}:${seconds}.${displayMilliseconds}`; // Update the path time value in MM:SS.mm format
      }

      paintCells(
        foundPath.filter(
          (node) =>
            !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
        ),
        "yellow"
      );
      updateVisitedNodesInput(visitedNodesCounter);
      return `Found path with length ${foundPath.length}`;
    }

    // Step 6: Generate and add successors to the open list
    const successorNodes = successors(currentNode, goalNode);

    for (const successor of successorNodes) {
      if (
        ![...openList, ...closedList].some((node) =>
          isWorseDuplicate(successor, node)
        )
      ) {
        openList.push(successor);
        visitedNodesCounter++;
      }
    }

    // Visualize exploration
    paintCells(
      closedList.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "#00f"
    );
    paintCells(
      openList.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "pink"
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
  }


  // No path found
  return "Path not found";
};

//Prop GBFS Algo
// const propGBFS = async (startNode: Node, goalNode: Node): Promise<string> => {
//   let startTime: number | undefined; // Declare startTime as number or undefined
//   startTime = performance.now(); // Initialize startTime when the algorithm starts

//   const openList: Node[] = [startNode];
//   const closedList: Node[] = [];
//   let visitedNodesCounter = 0;

//   while (openList.length > 0) {
//       // Step 3: Remove the node with the lowest total cost + heuristic value from the open list
//       openList.sort(
//           (a, b) => (a.totalCost || 0) + a.heuristic! - (b.totalCost || 0) - b.heuristic!
//       );

//       const currentNode = openList.shift();

//       if (!currentNode) break;

//       // Step 4: Move the current node to the closed list
//       closedList.push(currentNode);

//       // Step 5: Check if the current node is the goal node
//       if (isSameLocation(currentNode, goalNode)) {
//           // Path found
//           updateVisitedNodesInput(visitedNodesCounter);
//           const endTime = performance.now();
//           const duration = endTime - startTime;
//           const minutes = Math.floor(duration / 1000 / 60)
//               .toString()
//               .padStart(2, "0"); // Convert to minutes and format
//           const seconds = Math.floor((duration / 1000) % 60)
//               .toString()
//               .padStart(2, "0"); // Get remaining seconds and format
//           const milliseconds = Math.floor(duration % 1000)
//               .toString()
//               .padStart(3, "0"); // Correctly get full milliseconds in three digits

//           // For consistency and if you only need two digits for milliseconds, consider using only the first two digits
//           // However, displaying full milliseconds (three digits) is more common for precise timing
//           const displayMilliseconds = milliseconds.substring(0, 2); // Taking first two digits for MM:SS.mm format if desired

//           const foundPath = getPath(currentNode);
//           const pathLengthInput = document.getElementById("path-length");
//           const pathTimeInput = document.getElementById("path-time"); // Get the path-time input element

//           if (
//               pathLengthInput instanceof HTMLInputElement &&
//               pathTimeInput instanceof HTMLInputElement
//           ) {
//               pathLengthInput.value = foundPath.length.toString(); // Update the path length value
//               pathTimeInput.value = `${minutes}:${seconds}.${displayMilliseconds}`; // Update the path time value in MM:SS.mm format
//           }

//           paintCells(
//               foundPath.filter(
//                   (node) =>
//                       !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
//               ),
//               "yellow"
//           );
//           return `Found path with length ${foundPath.length}`;
//       }

//       // Step 6: Generate and add successors to the open list using Jump Point Search (JPS)
//       const successorNodes = propsuccessors(currentNode, goalNode);

//       for (const successor of successorNodes) {
//           if (
//               ![...openList, ...closedList].some((node) =>
//                   isWorseDuplicate(successor, node)
//               )
//           ) {
//               openList.push(successor);
//               visitedNodesCounter++;
//           }
//       }

//       // Visualize exploration
//       paintCells(
//           closedList.filter(
//               (node) =>
//                   !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
//           ),
//           "#00f"
//       );
//       paintCells(
//           openList.filter(
//               (node) =>
//                   !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
//           ),
//           "pink"
//       );

//       await new Promise((resolve) => setTimeout(resolve, 0));
//   }

//   // No path found
//   updateVisitedNodesInput(visitedNodesCounter);
//   return "Path not found";
// };

const propGBFS = async (startNode: Node, goalNode: Node): Promise<string> => {
  let startTime: number | undefined; // Declare startTime as number or undefined
  startTime = performance.now(); // Initialize startTime when the algorithm starts

  const openList: Node[] = [startNode];
  const closedList: Node[] = [];
  let visitedNodesCounter = 0;

  const backwardOpenList: Node[] = [goalNode];
  const backwardClosedList: Node[] = [];

  let forwardPathFound = false;
  let backwardPathFound = false;

  let forwardPath: Node[] = [];
  let backwardPath: Node[] = [];

  while (openList.length > 0 && backwardOpenList.length > 0) {
    // Step 3: Remove the node with the lowest total cost + heuristic value from the open list
    openList.sort(
      (a, b) =>
        (a.totalCost || 0) + a.heuristic! - (b.totalCost || 0) - b.heuristic!
    );
    backwardOpenList.sort(
      (a, b) =>
        (a.totalCost || 0) + a.heuristic! - (b.totalCost || 0) - b.heuristic!
    );

    const forwardCurrentNode = openList.shift();
    const backwardCurrentNode = backwardOpenList.shift();

    if (!forwardCurrentNode || !backwardCurrentNode) break;

    // Step 4: Move the current node to the closed list
    closedList.push(forwardCurrentNode);
    backwardClosedList.push(backwardCurrentNode);

    // Step 5: Check if the current node is the goal node
    if (isSameLocation(forwardCurrentNode, goalNode)) {
      forwardPathFound = true;
      forwardPath = getPath(forwardCurrentNode);
    }

    if (isSameLocation(backwardCurrentNode, startNode)) {
      backwardPathFound = true;
      backwardPath = getPath(backwardCurrentNode).reverse();
    }

    if (forwardPathFound && backwardPathFound) {
      // Compare the lengths of the two paths
      if (forwardPath.length <= backwardPath.length) {
        // Path found
        const endTime = performance.now();
        const duration = endTime - startTime;
        const minutes = Math.floor(duration / 1000 / 60)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor((duration / 1000) % 60)
          .toString()
          .padStart(2, "0");
        const milliseconds = Math.floor(duration % 1000)
          .toString()
          .padStart(3, "0");
        const displayMilliseconds = milliseconds.substring(0, 2);

        const foundPath = forwardPath;

        const pathLengthInput = document.getElementById("path-length");
        const pathTimeInput = document.getElementById("path-time");

        if (
          pathLengthInput instanceof HTMLInputElement &&
          pathTimeInput instanceof HTMLInputElement
        ) {
          pathLengthInput.value = foundPath.length.toString();
          pathTimeInput.value = `${minutes}:${seconds}.${displayMilliseconds}`;
        }

        paintCells(
          foundPath.filter(
            (node) =>
              !isSameLocation(node, startNode) &&
              !isSameLocation(node, goalNode)
          ),
          "yellow"
        );
        updateVisitedNodesInput(visitedNodesCounter);
        return `Found path with length ${foundPath.length}`;
      } else {
        // Path found
        const endTime = performance.now();
        const duration = endTime - startTime;
        const minutes = Math.floor(duration / 1000 / 60)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor((duration / 1000) % 60)
          .toString()
          .padStart(2, "0");
        const milliseconds = Math.floor(duration % 1000)
          .toString()
          .padStart(3, "0");
        const displayMilliseconds = milliseconds.substring(0, 2);

        const foundPath = backwardPath;

        const pathLengthInput = document.getElementById("path-length");
        const pathTimeInput = document.getElementById("path-time");

        if (
          pathLengthInput instanceof HTMLInputElement &&
          pathTimeInput instanceof HTMLInputElement
        ) {
          pathLengthInput.value = foundPath.length.toString();
          pathTimeInput.value = `${minutes}:${seconds}.${displayMilliseconds}`;
        }

        paintCells(
          foundPath.filter(
            (node) =>
              !isSameLocation(node, startNode) &&
              !isSameLocation(node, goalNode)
          ),
          "yellow"
        );
        
        return `Found path with length ${foundPath.length}`;
      }
    }

    // Step 6: Generate and add successors to the open list using Jump Point Search (JPS)
    const forwardSuccessorNodes = propsuccessors(forwardCurrentNode, goalNode);
    const backwardSuccessorNodes = propsuccessors(
      backwardCurrentNode,
      startNode
    );

    for (const successor of forwardSuccessorNodes) {
      if (
        ![...openList, ...closedList].some((node) =>
          isWorseDuplicate(successor, node)
        )
      ) {
        openList.push(successor);
        visitedNodesCounter++;
      }
    }

    for (const successor of backwardSuccessorNodes) {
      if (
        ![...backwardOpenList, ...backwardClosedList].some((node) =>
          isWorseDuplicate(successor, node)
        )
      ) {
        backwardOpenList.push(successor);
        visitedNodesCounter++;
      }
    }

    // Visualize exploration
    paintCells(
      closedList.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "#00f"
    );
    paintCells(
      openList.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "pink"
    );

    paintCells(
      backwardClosedList.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "#00f"
    );
    paintCells(
      backwardOpenList.filter(
        (node) =>
          !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
      ),
      "pink"
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  // No path found
  return "Path not found";
};

//Stock Algo
const pathFind = async (startNode: Cell, goalNode: Cell): Promise<string> => {
  const openList = [startNode];
  const closedList: Cell[] = [];
  //for counting visted explored nodes and successor nodes
  let visitedNodesCounter = 0;
  let thisNode;
  try {
    do {
      thisNode = openList.shift();

      // Have we reached the goal
      if (isSameLocation(thisNode, goalNode)) {
        updateVisitedNodesInput(visitedNodesCounter);
        const endTime = performance.now(); // Capture end time when the goal is found
        const duration = endTime - startTime; // Calculate duration in milliseconds
        const minutes = Math.floor(duration / 1000 / 60)
          .toString()
          .padStart(2, "0"); // Convert to minutes and format
        const seconds = Math.floor((duration / 1000) % 60)
          .toString()
          .padStart(2, "0"); // Get remaining seconds and format
        const milliseconds = Math.floor(duration % 1000)
          .toString()
          .padStart(3, "0"); // Correctly get full milliseconds in three digits

        // For consistency and if you only need two digits for milliseconds, consider using only the first two digits
        // However, displaying full milliseconds (three digits) is more common for precise timing
        const displayMilliseconds = milliseconds.substring(0, 2); // Taking first two digits for MM:SS.mm format if desired

        const foundPath = getPath(thisNode);
        const pathLengthInput = document.getElementById("path-length");
        const pathTimeInput = document.getElementById("path-time"); // Get the path-time input element

        if (
          pathLengthInput instanceof HTMLInputElement &&
          pathTimeInput instanceof HTMLInputElement
        ) {
          pathLengthInput.value = foundPath.length.toString(); // Update the path length value
          pathTimeInput.value = `${minutes}:${seconds}.${displayMilliseconds}`; // Update the path time value in MM:SS.mm format
        }

        // Repaint the path cells
        paintCells(
          foundPath.filter(
            (node) =>
              !isSameLocation(node, startNode) &&
              !isSameLocation(node, goalNode)
          ),
          "yellow"
        );

        return `Found path with length ${foundPath.length}`;
      }
      // Mark as explored
      closedList.push({ ...thisNode });
      visitedNodesCounter++;

      const successorNodes = successors(thisNode, goalNode);

      successorNodes.forEach((suc) => {
        if (
          [...closedList, ...openList].some((exploredNode) =>
            isWorseDuplicate(suc, exploredNode)
          )
        )
          return;

        for (let i = 0; i < openList.length; i++) {
          if (isNodeBetter(suc, openList[i])) {
            openList.splice(i, 0, suc);
            return;
          }
        }
        openList.push(suc);
        visitedNodesCounter++;
      });

      paintCells(
        closedList.filter(
          (node) =>
            !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
        ),
        "#00f"
      );
      paintCells(
        openList.filter(
          (node) =>
            !isSameLocation(node, startNode) && !isSameLocation(node, goalNode)
        ),
        "pink"
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    } while (openList.length > 0 && openList.length < 10000);
    return `Path not found`;
  } catch (error) {
    if (error.message === "Goal node is blocked by walls") {
      console.error(error.message); // Log the error for debugging
      return "Path to goal node is blocked by walls"; // Return a specific message
    } else {
      throw error; // Re-throw other errors
    }
  }
};

//Function to count visited nodes
function updateVisitedNodesInput(count: number) {
  const visitedNodesInput = document.getElementById("visited-nodes");
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
    pathLengthInput.value = ""; // Set to empty or default value
  }

  // Clear 'visited-nodes' input
  const visitedNodesInput = document.getElementById("visited-nodes");
  if (visitedNodesInput instanceof HTMLInputElement) {
    visitedNodesInput.value = ""; // Set to empty or default value
  }
  // Clear 'path-time' input
  const pathTimeInput = document.getElementById("path-time");
  if (pathTimeInput instanceof HTMLInputElement) {
    pathTimeInput.value = ""; // Set to empty or default value
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

  startNode = { x: 1, y: 1, wall: false }; // Reset to default or choose a method to clear
  goalNode = { x: 119, y: 59, wall: false }; // Reset to default or choose a method to clear
  // Repaint the start and goal nodes in their default or new positions
  paintCells([startNode], "green");
  paintCells([goalNode], "red");

  //to reset the node coordinate values in the site
  const startNodeInputX = document.querySelector(".startx") as HTMLInputElement;
  const startNodeInputY = document.querySelector(".starty") as HTMLInputElement;
  const goalNodeInputX = document.querySelector(".goalx") as HTMLInputElement;
  const goalNodeInputY = document.querySelector(".goaly") as HTMLInputElement;

  startNodeInputX.value = "1";
  startNodeInputY.value = "1";
  goalNodeInputX.value = "119";
  goalNodeInputY.value = "59";

  // Optionally, reset the maze to an empty or initial state
  // This would depend on how you want to manage the maze's lifecycle
  // For instance, you might regenerate a new maze or simply clear the current one
  // maze.splice(0, maze.length); // If you want to clear the maze array
  generateAndRenderMaze(0); // If you want to regenerate a new maze with 0% walls

  // Reset start and goal nodes to default positions or clear them

  // Clear any output or results displayed to the user
  const output = document.getElementById("output");
  if (output) {
    output.innerText = ""; // Clear any text
  }

  // Clear path length display if applicable
  const pathLengthInput = document.getElementById("path-length");
  if (pathLengthInput instanceof HTMLInputElement) {
    pathLengthInput.value = ""; // Clear the displayed path length
  }
  // Clear 'visited-nodes' input
  const visitedNodesInput = document.getElementById("visited-nodes");
  if (visitedNodesInput instanceof HTMLInputElement) {
    visitedNodesInput.value = ""; // Set to empty or default value
  }
  // Clear 'path-time' input
  const pathTimeInput = document.getElementById("path-time");
  if (pathTimeInput instanceof HTMLInputElement) {
    pathTimeInput.value = ""; // Set to empty or default value
  }
}

//For HTML Interactions
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("find-path").addEventListener("click", function () {
      // Clear 'path-length' input
  const pathLengthInput = document.getElementById("path-length");
  if (pathLengthInput instanceof HTMLInputElement) {
    pathLengthInput.value = ""; // Set to empty or default value
  }

  // Clear 'visited-nodes' input
  const visitedNodesInput = document.getElementById("visited-nodes");
  if (visitedNodesInput instanceof HTMLInputElement) {
    visitedNodesInput.value = ""; // Set to empty or default value
  }
  // Clear 'path-time' input
  const pathTimeInput = document.getElementById("path-time");
  if (pathTimeInput instanceof HTMLInputElement) {
    pathTimeInput.value = ""; // Set to empty or default value
  }
    startTime = performance.now();
    const algorithmSelector = document.querySelector(
      ".drpdwnAlgo"
    ) as HTMLSelectElement;
    const selectedAlgorithm = algorithmSelector.value;

    if (selectedAlgorithm === "stockAlgo") {
      //clear yung path na nagawa
      const paths = maze.flat().filter(({ wall }) => !wall);
      paintCells(paths, "#fff");
      paintCells([startNode], "green");
      paintCells([goalNode], "red");

      pathFind(startNode, goalNode).then((result) => {
        const output = document.getElementById("output");
        if (output) {
          output.innerText = result;
        }
      });
    } else if (selectedAlgorithm === "propGBFS") {
      const paths = maze.flat().filter(({ wall }) => !wall);
      paintCells(paths, "#fff");
      paintCells([startNode], "green");
      paintCells([goalNode], "red");

      propGBFS(startNode, goalNode).then((result) => {
        const output = document.getElementById("output");
        if (output) {
          output.innerText = result;
        }
      });
    } else if (selectedAlgorithm === "tradGBFS") {
      const paths = maze.flat().filter(({ wall }) => !wall);
      paintCells(paths, "#fff");
      paintCells([startNode], "green");
      paintCells([goalNode], "red");

      tradGBFS(startNode, goalNode).then((result) => {
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
