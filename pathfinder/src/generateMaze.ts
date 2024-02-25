export function generateRandomMazeWithBorder(
  width: number,
  height: number,
  wallPercentage: number
): string {
  if (wallPercentage < 0 || wallPercentage > 100) {
    console.error("Percent must be from 0 to 100");
    return;
  }

  // Initialize maze with spaces, leaving the outer edges as walls
  const maze = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) =>
      x === 0 || x === width - 1 || y === 0 || y === height - 1 ? "#" : " "
    )
  );

  const innerWidth = width - 2; // Adjusting for walls
  const innerHeight = height - 2; // Adjusting for walls
  const totalInnerCells = innerWidth * innerHeight;
  let wallCount = Math.floor(totalInnerCells * (wallPercentage / 100));

  while (wallCount > 0) {
    // Random positions for walls inside the border
    const x = Math.floor(Math.random() * innerWidth) + 1; // +1 to avoid the border
    const y = Math.floor(Math.random() * innerHeight) + 1; // +1 to avoid the border
    if (maze[y][x] === " ") {
      maze[y][x] = "#";
      wallCount--;
    }
  }

  // Convert maze array to string representation.
  return maze.map((row) => row.join("")).join("\n");
}

const width = 121; // including the borders
const height = 61; // including the borders
const wallPercentage = 0; // 0% of the inner maze will be walls

export const mazeString = generateRandomMazeWithBorder(
  width,
  height,
  wallPercentage
);
console.log(mazeString);
