/**
 * Initializes the Piece with its color.
 */
function Piece (color) {
    this.color = color;
}

/**
 * Returns the color opposite the current piece.
 */
Piece.prototype.oppColor = function () {
    debugger
    if(this.color === "black"){
        return "white";
    }
    else{
        return "black";
    }
};
test = new Piece("black") 
console.log(test.color)
console.log(test.oppColor)
/**
 * Changes the piece's color to the opposite color.
 */
Piece.prototype.flip = function () {
    this.color = oppColor
      
};

/**
 * Returns a string representation of the piece
 * based on its color.
 */
Piece.prototype.toString = function () {
};

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
    module.exports = Piece;
}
// DON'T TOUCH THIS CODE