const DIFFICULTY = 40;  // How many random slides a puzzle starts with.
const SIZE = 4;  // The board is SIZE x SIZE spaces.

const BLANK = 0;
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";

type Board =  number[];
type Move = typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT;


function displayBoard(board: Board) {
    // Display the tiles stored in `board` on the screen.
    // document.write("<pre>");
    let output = '';
    for (let y = 0; y < SIZE; y++) {  // Iterate over each row.
        for (let x = 0; x < SIZE; x++) {  // Iterate over each column.
            if (board[y * SIZE + x] == BLANK) {
                // document.write('__ ');  // Display blank tile.
                output += '__ ';
            } else {
                // document.write(board[y * SIZE + x].toString().padStart(2) + " ");
                output += board[y * SIZE + x]!.toString().padStart(2) + " ";
            }
        }
        // document.write("<br />");  // Print a newline at the end of the row.
        output += "\n";
    }
    console.log(output)
}


function getNewBoard() {
    // Return a list that represents a new tile puzzle.
    let board = [];
    for (let i = 1; i < SIZE * SIZE; i++) {
        board.push(i);
    }
    board.push(BLANK);
    return board;
}


function findBlankSpace(board: Board): [number, number] | void {
    // Return an [x, y] array of the blank space's location.
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            if (board[y * SIZE + x] === BLANK) {
                return [x, y];
            }
        }
    }
}


function makeMove(board: Board, move: Move) {
    // Modify `board` in place to carry out the slide in `move`.
    let bx, by;
    [bx, by] = findBlankSpace(board) as [number, number];
    let blankIndex = by * SIZE + bx;

    let tileIndex: number = -1;
    if (move === UP) {
        tileIndex = (by + 1) * SIZE + bx;
    } else if (move === LEFT) {
        tileIndex = by * SIZE + (bx + 1);
    } else if (move === DOWN) {
        tileIndex = (by - 1) * SIZE + bx;
    } else if (move === RIGHT) {
        tileIndex = by * SIZE + (bx - 1);
    }

    // Swap the tiles at blankIndex and tileIndex:
    [board[blankIndex], board[tileIndex]] = [(board[tileIndex] as number), (board[blankIndex] as number)];
}


function undoMove(board: Board, move: Move) {
    // Do the opposite move of `move` to undo it on `board`.
    if (move === UP) {
        makeMove(board, DOWN);
    } else if (move === DOWN) {
        makeMove(board, UP);
    } else if (move === LEFT) {
        makeMove(board, RIGHT);
    } else if (move === RIGHT) {
        makeMove(board, LEFT);
    }
}


function getValidMoves(board: Board, prevMove?: Move): Move[] {
    // Returns a list of the valid moves to make on this board. If
    // prevMove is provided, do not include the move that would undo it.

    let blankx, blanky;
    [blankx, blanky] = findBlankSpace(board) as [number, number];

    let validMoves: Move[] = [];
    if (blanky != SIZE - 1 && prevMove != DOWN) {
        // Blank space is not on the bottom row.
        validMoves.push(UP);
    }
    if (blankx != SIZE - 1 && prevMove != RIGHT) {
        // Blank space is not on the right column.
        validMoves.push(LEFT);
    }
    if (blanky != 0 && prevMove != UP) {
        // Blank space is not on the top row.
        validMoves.push(DOWN);
    }
    if (blankx != 0 && prevMove != LEFT) {
        // Blank space is not on the left column.
        validMoves.push(RIGHT);
    }
    return validMoves;
}


function getNewPuzzle() {
    // Get a new puzzle by making random slides from the solved state.
    let board = getNewBoard();
    for (let i = 0; i < DIFFICULTY; i++) {
        let validMoves = getValidMoves(board);
        makeMove(board, (validMoves[Math.floor(Math.random() * validMoves.length)] as Move));
    }
    return board;
}

export function solve(board: Board, maxMoves: number) {
    // Attempt to solve the puzzle in `board` in at most `maxMoves`
    // moves. Returns true if solved, otherwise false.
    console.log("Attempting to solve in at most " + maxMoves + " moves...\n");
    let solutionMoves: Array<Move> = [];  // A list of UP, DOWN, LEFT, RIGHT values.
    let solved = attemptMove(board, solutionMoves, maxMoves, null as unknown as Move);

    if (solved) {
        displayBoard(board);
        for (let move of solutionMoves) {
            console.log("Move " + move + "\n");
            makeMove(board, move);
            console.log("\n");  // Print a newline.
            displayBoard(board);
            console.log("\n");  // Print a newline.
        }
        console.log("Solved in " + solutionMoves.length + " moves:\n");
        console.log(solutionMoves.join(", ") + "\n");
        return true;  // Puzzle was solved.
    } else {
        return false;  // Unable to solve in maxMoves moves.
    }
}


function attemptMove(board: Board, movesMade: Move[], movesRemaining: number, prevMove: Move) {
    // A recursive function that attempts all possible moves on `board`
    // until it finds a solution or reaches the `maxMoves` limit.
    // Returns true if a solution was found, in which case `movesMade`
    // contains the series of moves to solve the puzzle. Returns false
    // if `movesRemaining` is less than 0.

    if (movesRemaining < 0) {
        // BASE CASE - Ran out of moves.
        return false;
    }

    if (JSON.stringify(board) == SOLVED_BOARD) {
        // BASE CASE - Solved the puzzle.
        return true;
    }

    // RECURSIVE CASE - Attempt each of the valid moves:
    for (let move of getValidMoves(board, prevMove)) {
        // Make the move:
        makeMove(board, move);
        movesMade.push(move);

        if (attemptMove(board, movesMade, movesRemaining - 1, move)) {
            // If the puzzle is solved, return True:
            undoMove(board, move);  // Reset to the original puzzle.
            return true;
        }

        // Undo the move to set up for the next move:
        undoMove(board, move);
        movesMade.pop();  // Remove the last move since it was undone.
    }
    return false;  // BASE CASE - Unable to find a solution.
}


// Start the program:
const SOLVED_BOARD = JSON.stringify(getNewBoard());
console.log("SOLVED_BOARD: \n" + SOLVED_BOARD + "\n");
let puzzleBoard = getNewPuzzle();
console.log("PUZZLE:\n", JSON.stringify(puzzleBoard));
displayBoard(puzzleBoard);
let startTime = Date.now();

let maxMoves = 10;
while (true) {
    if (solve(puzzleBoard, maxMoves)) {
        break;  // Break out of the loop when a solution is found.
    }
    maxMoves += 1;
}
console.log("Run in " + Math.round((Date.now() - startTime) / 100) / 10 + " seconds.\n");

