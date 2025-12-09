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

enum NeighborToThe {
    NORTH = 'n',
    SOUTH = 's',
    EAST = 'e',
    WEST = 'w',
}


// Create the filled-in maze data structure to start:


function getXyFromIndex(i: number){
  return [i % WIDTH, Math.floor(i / WIDTH)]
}

function getIndexFromXy(x: number, y: number){
  return y * WIDTH + x
}

function createMaze() {
  let maze: Maze = new Map();
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    maze.set(i, Char.WALL); // Every space is a wall at first.
  }
  return maze;
}


function printMaze(maze: Maze, markX=0, markY=0) {
    // Displays the maze data structure in the maze argument. The
    // markX and markY arguments are coordinates of the current
    // '@' location of the algorithm as it generates the maze.
    let output: string = Char.START_TAG;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (markX === x && markY === y) {
                // Display the "@" mark here:
                output += Char.MARK;
            } else {
                // Display the wall or empty space:
                output += maze.get(getIndexFromXy(x,y));
            }
        }
        output += Char.NEWLINE;  // Print a newline after printing the row.
    }
    output += Char.END_TAG;
    // document.body.innerHTML += output;
    // const element = document.getElementById("mazeGeneratorApp");
    // if (element) element.innerHTML += output;
    return output;
}


export class MazeGenerator{
  maze: Maze = createMaze();
  hasVisited: Array<Coordinates> = [[1, 1]]; // Start by visiting the top left corner.
  generate(): string {
    this.visit(1, 1);
    return printMaze(this.maze);
  }

  getNextUnvisitedNeighbor(length: number) {
    const result = Math.floor(Math.random() * length);
    return result;
}

  visit(x: number, y: number) {
    // "Carve out" empty spaces in the maze at x, y and then
    // recursively move to neighboring unvisited spaces. This
    // function backtracks when the mark has reached a dead end.

    this.maze.set(getIndexFromXy(x, y), Char.EMPTY);  // "Carve out" the space at x, y.
    // printMaze(maze, x, y);  // Display the maze as we generate it.
    // document.body.innerHTML += '<br /><br /><br />';

    while (true) {
      // Check which neighboring spaces adjacent to
      // the mark have not been visited already:
      let unvisitedNeighbors = [];
      if (y > 1 && !this.isNeighborAtVisited([x, y - 2])) {
        unvisitedNeighbors.push(NeighborToThe.NORTH);
      }
      if (y < HEIGHT - 2 && !this.isNeighborAtVisited([x, y + 2])) {
        unvisitedNeighbors.push(NeighborToThe.SOUTH);
      }
      if (x > 1 && !this.isNeighborAtVisited([x - 2, y])) {
        unvisitedNeighbors.push(NeighborToThe.WEST);
      }
      if (x < WIDTH - 2 && !this.isNeighborAtVisited([x + 2, y])) {
        unvisitedNeighbors.push(NeighborToThe.EAST);
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

        // Move the mark to the unvisited neighboring spaces:
        let nextX = 0, nextY = 0;
        if (nextIntersection === NeighborToThe.NORTH) {
          nextX = x;
          nextY = y - 2;
          this.maze.set(getIndexFromXy(x, y - 1), Char.EMPTY);  // Connecting hallway.
        } else if (nextIntersection === NeighborToThe.SOUTH) {
          nextX = x;
          nextY = y + 2;
          this.maze.set(getIndexFromXy(x, y + 1), Char.EMPTY);  // Connecting hallway.
        } else if (nextIntersection === NeighborToThe.WEST) {
          nextX = x - 2;
          nextY = y;
          this.maze.set(getIndexFromXy(x - 1, y), Char.EMPTY);  // Connecting hallway.
        } else if (nextIntersection === NeighborToThe.EAST) {
          nextX = x + 2;
          nextY = y;
          this.maze.set(getIndexFromXy(x + 1, y), Char.EMPTY);  // Connecting hallway.
        }
        this.hasVisited.push([nextX, nextY]);  // Mark space as visited.
        this.visit(nextX, nextY);  // Recursively visit this space.
      }
    }
  }

  private isNeighborAtVisited(coordinates: Coordinates) {
    return JSON.stringify(this.hasVisited).includes(JSON.stringify(coordinates));
  }
}


// aMaze.getNextUnvisitedNeighbor = getNextUnvisitedNeighborMock
console.log(new MazeGenerator().generate());