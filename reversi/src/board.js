// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  const grid = [...Array(8)].map(el => Array(8));
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");
  return grid;
}


/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
    let a, b;
    [a, b] = pos
    if (a > 8 || b > 8 || a < 0 || b < 0) {return false;}
    else {return true;}
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  let a, b;
  [a, b] = pos;
  if (this.isValidPos(pos)) {
    if (this.grid[a][b] === undefined) {
      return undefined;
    }
    else {return this.grid[a][b];}
  }
  else {
    throw new Error('Not valid pos!');
  }
};



/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if(this.getPiece(pos) === undefined){
    return undefined;
  }
  else {
   return this.getPiece(pos).color === color;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let a, b;
  [a, b] = pos;
  return this.grid[a][b] !== undefined 
   
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  
  // const newPos = pos.map((v, i) => {v+ dir[i]});
  // let a, b;
  let [x, y] = pos;
  let [dx, dy] = dir;
  let newPos = [x + dx, y + dy];
  let [a,b] = newPos;
  
  if (!piecesToFlip) {
    piecesToFlip = [];
  };
  // debugger

  if(!this.isValidPos(newPos)) {
    return [];
  }
  if (!this.isOccupied(newPos)) {
    return [];
  }
  
  if(this.grid[a][b].color === color) {
    return piecesToFlip;
  }

  if (this.grid[a][b].color !== color) {
    piecesToFlip.push(newPos); 
    
    return this._positionsToFlip(newPos, color, dir, piecesToFlip);
  }


};

// b = new Board
// console.log(b.isOccupied([5, 5]))
// console.log(b.isOccupied([3, 4]))

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if(!this.isValidPos(pos)) {
    return false;
  }

  if(this.isOccupied(pos)) {
    return false;
  }
  const up = this._positionsToFlip(pos, color, [0,1]); 
  const down = this._positionsToFlip(pos, color, [0,-1]); 
  const right = this._positionsToFlip(pos, color, [1,0]); 
  const left = this._positionsToFlip(pos, color, [-1,0]);
  const diagupright = this._positionsToFlip(pos, color, [1,1]);
  const diagdownright = this._positionsToFlip(pos, color, [1,-1]);
  const diagupleft = this._positionsToFlip(pos, color, [-1,1]);
  const diagdownleft = this._positionsToFlip(pos, color, [-1,-1]);
  
  const moves = up.concat(down, right, left, diagdownleft, diagdownright, diagupleft, diagupright);
  if(moves.length === 0) {
    return false;
  }

  else{
    return true;
  }
  
  
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if(!this.validMove(pos, color)){
    throw new Error('Invalid move!');
  }

  const up = this._positionsToFlip(pos, color, [0,1]); 
  const down = this._positionsToFlip(pos, color, [0,-1]); 
  const right = this._positionsToFlip(pos, color, [1,0]); 
  const left = this._positionsToFlip(pos, color, [-1,0]);
  const diagupright = this._positionsToFlip(pos, color, [1,1]);
  const diagdownright = this._positionsToFlip(pos, color, [1,-1]);
  const diagupleft = this._positionsToFlip(pos, color, [-1,1]);
  const diagdownleft = this._positionsToFlip(pos, color, [-1,-1]);

  
  const moves = up.concat(down, right, left, diagdownleft, diagdownright, diagupleft, diagupright);
  let [a,b] = pos;
  this.grid[a][b] = new Piece(color);
  
  moves.forEach( (move) => {let [a,b] = move;
    this.grid[a][b].flip();})
  
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  const newArr = [];
  for (i = 0; i < this.grid.length - 1; i++) {
    for (j = 0; j < this.grid.length; j++) {
        const pos = [i, j];
        if (this.validMove(pos, color)) {
          

          newArr.push(pos);
        }
      }
    }
  return newArr;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE