const ship = require('./ship');

module.exports = class gameboard {
    constructor() {
        this.board = this.createBoard(0);
        this.visited = this.createBoard(false);
        this.ships = [
            new ship("Carrier", 5),
            new ship("Battleship", 4),
            new ship("Destroyer", 3),
            new ship("Submarine", 3),
            new ship("Patrol Boat", 2)
        ];
        this.shipsSunk = 0;
    }

    // create the board array and push value onto each square
    createBoard(value) {
        const boardArray = [];
        for (let i = 0; i < 10; i++) {
            boardArray[i] = [];
            for (let j = 0; j < 10; j++) {
                boardArray[i].push(value);
            }
        }
        return boardArray;
    }

    /* IMO this function breaks "Single Responsibility Principle" a function should only do one thing,
        here this function does at least 2 things. It checks bounds and also places the ship.
        So to a caller of a function, I'm not sure if this function checks if a ship can be placed OR it places my ship OR both

        I'd create a new function for the coordinate checking and have that function called BEFORE I call placeShip()
    */
    placeShip(x, y, ship, rotated) {
        // check if x and y are in bounds
        if (x == null || y == null) return false;
        if (x < 0 || x > 9 || y < 0 || y > 9) return false;

        // if ship is vertical
        if (rotated) {
            // check if any boats are in the way, also check if out of bounds
            for (let i = 0; i < ship.length; i++) {

                // if out of bounds
                if (x + i > 9) return false;
                let currRow = x + i;

                // create a loop to check surrounding squares
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        // if within bounds of the board
                        if (currRow + j >= 0 && currRow + j < 10 && y + k >= 0 && y + k < 10) {
                            if (this.board[currRow + j][y + k]) return false;

                        }
                    }
                }
            }
        } else {
            // if ship is horizontal
            // check if any boats are in the way, also check if out of bounds
            for (let i = 0; i < ship.length; i++) {
                // if out of bounds
                if (y + i > 9) return false;


                let currCol = y + i;

                // create a loop to check surrounding squares
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        // if within bounds of the board
                        if (x + j >= 0 && x + j < 10 && currCol + k >= 0 && currCol + k < 10) {
                            if (this.board[x + j][currCol + k]) return false;
                        }
                    }
                }
            }
        }

        // ship can be placed. mark the ship's location and return true
        for (let i = 0; i < ship.length; i++) {
            if (rotated) {
                this.board[x + i][y] = ship;
            } else {
                this.board[x][y + i] = ship;
            }
        }
        return true;
    }

    receiveAttack(x, y) {
        // check if out of bounds or visited
        if (x < 0 || x > 9 || y < 0 || y > 9) return false;
        if (this.visited[x][y]) {
            //console.log('visited!!');
            return false;
        };

        // if it hits a ship
        if (this.board[x][y]) {
            this.board[x][y].hit();
            console.log(`Hit ${this.board[x][y].name} at ${x}, ${y}!`);
            if (this.board[x][y].isSunk()) {
                this.shipsSunk += 1;
            }
        } else {
            // do something
            console.log(`Hit Water! at ${x}, ${y}`);
        }
        // add to previous list
        this.visited[x][y] = true;
        return true;
    }

    printBoard() {
        console.log("  0123456789");
        for (let i = 0; i < this.board.length; i++) {

            let newString = i + " ";
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j]) {
                    // if unvisited ship
                    newString += this.board[i][j].name.split("")[0];
                } else {
                    // if unvisited
                    newString += "_";
                }
            }
            console.log(newString);
        }
    }

    allShipsSunk() {
        return this.shipsSunk == 5;
    }
}
