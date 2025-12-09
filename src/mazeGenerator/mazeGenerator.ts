type Cell = [number, string]
type Maze = Map<number, string>
type Coordinates = [x: number, y: number]

const WIDTH = 39;  // Width of the maze (must be odd).
const HEIGHT = 19;  // Height of the maze (must be odd).
console.assert(WIDTH % 2 == 1 && WIDTH >= 3);
console.assert(HEIGHT % 2 == 1 && HEIGHT >= 3);

// Use these characters for displaying the maze:
// const EMPTY = "&nbsp;";
// const MARK = "@";
// const WALL = "&#9608;";  // Character 9608 is "█"
// const NEWLINE = '<br />';
// const START_TAG = '<pre>';
// const END_TAG = '</pre>';

enum Char {
    EMPTY = ' ',
    MARK = '*',
    WALL = '#',
    NEWLINE = '\n',
    START_TAG = '',
    END_TAG = '',
}

interface UnvisitedNeighbor {
  action(x: number, y: number): Coordinates;
}
class UnvisitedNeighborNorth implements UnvisitedNeighbor {
  private nextX = 0;
  private nextY = 0;
  constructor(private mazeGenerator: MazeGenerator) { }
  action(x: number, y: number): Coordinates {
    this.nextX = x;
    this.nextY = y - 2;
    this.mazeGenerator.maze.set(calculateIndexFromXy(x, y - 1), Char.EMPTY);  // Connecting hallway.
    this.mazeGenerator.hasVisited.push([this.nextX, this.nextY]);  // Mark space as visited.

    return [this.nextX, this.nextY]
  }
}
class UnvisitedNeighborSouth implements UnvisitedNeighbor {
  private nextX = 0;
  private nextY = 0;
  constructor(private mazeGenerator: MazeGenerator) { }
  action(x: number, y: number): Coordinates {
    this.nextX = x;
    this.nextY = y + 2;
    this.mazeGenerator.maze.set(calculateIndexFromXy(x, y + 1), Char.EMPTY);  // Connecting hallway.
    this.mazeGenerator.hasVisited.push([this.nextX, this.nextY]);  // Mark space as visited.

    return [this.nextX, this.nextY]
  }
}
class UnvisitedNeighborEast implements UnvisitedNeighbor {
  private nextX = 0;
  private nextY = 0;
  constructor(private mazeGenerator: MazeGenerator) { }
  action(x: number, y: number): Coordinates {
    this.nextX = x + 2;
    this.nextY = y;
    this.mazeGenerator.maze.set(calculateIndexFromXy(x + 1, y), Char.EMPTY);  // Connecting hallway.
    this.mazeGenerator.hasVisited.push([this.nextX, this.nextY]);  // Mark space as visited.

    return [this.nextX, this.nextY]
  }
}
class UnvisitedNeighborWest implements UnvisitedNeighbor {
  private nextX = 0;
  private nextY = 0;
  constructor(private mazeGenerator: MazeGenerator) { }
  action(x: number, y: number): Coordinates {
    this.nextX = x - 2;
    this.nextY = y;
    this.mazeGenerator.maze.set(calculateIndexFromXy(x - 1, y), Char.EMPTY);  // Connecting hallway.
    this.mazeGenerator.hasVisited.push([this.nextX, this.nextY]);  // Mark space as visited.

    return [this.nextX, this.nextY]
  }
}

function arraysEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

function calculateCoordinatesFromIndex(i: number): Coordinates {
  return [i % WIDTH, Math.floor(i / WIDTH)]
}

function calculateIndexFromXy(x: number, y: number){
  return y * WIDTH + x
}

function createMaze() {
  let maze: Maze = new Map();
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    maze.set(i, Char.WALL); // Every space is a wall at first.
  }
  return maze;
}



export class MazeGenerator{
  maze: Maze = createMaze();
  hasVisited: Array<Coordinates> = [[1, 1]]; // Start by visiting the top left corner.
  generate(): string {
    this.visit(1, 1);
    return this.printMaze();
  }

  getNextUnvisitedNeighbor(length: number) {
    const result = Math.floor(Math.random() * length);
    return result;
}

  visit(x: number, y: number) {
    // "Carve out" empty spaces in the maze at x, y and then
    // recursively move to neighboring unvisited spaces. This
    // function backtracks when the mark has reached a dead end.

    this.maze.set(calculateIndexFromXy(x, y), Char.EMPTY);  // "Carve out" the space at x, y.
    // printMaze(maze, x, y);  // Display the maze as we generate it.
    // document.body.innerHTML += '<br /><br /><br />';

    while (true) {
      // Check which neighboring spaces adjacent to
      // the mark have not been visited already:
      let unvisitedNeighbors: UnvisitedNeighbor[] = [];
      if (this.isNorthNeighborExpectingVisit(y, x)) {
        unvisitedNeighbors.push(new UnvisitedNeighborNorth(this));
      }
      if (this.isSouthNeighborExpectingVisit(y, x)) {
        unvisitedNeighbors.push(new UnvisitedNeighborSouth(this));
      }
      if (this.isWestNeighborExpectingVisit(x, y)) {
        unvisitedNeighbors.push(new UnvisitedNeighborWest(this));
      }
      if (this.isEastNeighborExpectingVisit(x, y)) {
        unvisitedNeighbors.push(new UnvisitedNeighborEast(this));
      }

      if (unvisitedNeighbors.length === 0) {
        // BASE CASE
        // All neighboring spaces have been visited, so this is a
        // dead end. Backtrack to an earlier space:
        return;
      } else {
        // RECURSIVE CASE
        // Randomly pick an unvisited neighbor to visit:
        let nextIntersection = unvisitedNeighbors[
          this.getNextUnvisitedNeighbor(unvisitedNeighbors.length)];
        let [nextX, nextY] = nextIntersection!.action(x, y);
        this.visit(nextX, nextY);  // Recursively visit this space.
      }
    }
  }

  private isEastNeighborExpectingVisit(x: number, y: number) {
    return x < WIDTH - 2 && !this.isNeighborAtVisited([x + 2, y]);
  }

  private isWestNeighborExpectingVisit(x: number, y: number) {
    return x > 1 && !this.isNeighborAtVisited([x - 2, y]);
  }

  private isSouthNeighborExpectingVisit(y: number, x: number) {
    return y < HEIGHT - 2 && !this.isNeighborAtVisited([x, y + 2]);
  }

  private isNorthNeighborExpectingVisit(y: number, x: number) {
    return y > 1 && !this.isNeighborAtVisited([x, y - 2]);
  }

  private isNeighborAtVisited(coordinates: Coordinates) {
    return this.hasVisited.some((c: Coordinates) => arraysEqual(c, coordinates));
  }
  printMaze(markX=0, markY=0) {
    // Displays the maze data structure in the maze argument. The
    // markX and markY arguments are coordinates of the current
    // '@' location of the algorithm as it generates the maze.
    let output: string = Char.START_TAG;
    this.maze.entries().forEach((cell: Cell) => {
      const [x, y] = calculateCoordinatesFromIndex(cell[0])
      if (markX === x && markY === y) {
        output += Char.MARK;    // Display the "@" mark here:
      } else {
        output += this.maze.get(calculateIndexFromXy(x,y)); // Display the wall or empty space:
      }
      if (x === WIDTH - 1) {
        output += Char.NEWLINE;  // Print a newline after printing the row.
      }
    })
    output += Char.END_TAG;
    // document.body.innerHTML += output;
    // const element = document.getElementById("mazeGeneratorApp");
    // if (element) element.innerHTML += output;
    return output;
  }
}


// aMaze.getNextUnvisitedNeighbor = getNextUnvisitedNeighborMock
console.log(new MazeGenerator().generate());