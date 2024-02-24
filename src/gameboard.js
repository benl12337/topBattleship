const ship = require('./ship');

module.exports = class gameboard {
    constructor() {
        this.board = this.createBoard(null);
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

    // create the board array and push null onto each one
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

    placeShip(x, y, ship, rotated) {
        // check if x and y are in bounds
        if (x < 0 || x > 9 || y < 0 || y > 9) return false;

        // if ship is vertical
        if (rotated) {
            // check if any boats are in the way, also check if out of bounds
            for (let i = 0; i < ship.length; i++) {
                if (x + i > 9) return false;
                if (this.board[x + i][y]) return false;
            }
        } else {
            // if ship is horizontal
            // check if any boats are in the way, also check if out of bounds
            for (let i = 0; i < ship.length; i++) {
                if (y + i > 9) return false;
                if (this.board[x][y + i]) return false;
            }
        }

        // ship can be placed. mark the ship's location and return true
        for (let i = 0; i < ship.length; i++) {
            if (rotated) {
                this.board[x + i][y] = ship.name;
            } else {
                this.board[x][y + i] = ship.name;
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
        if (this.board[x][y] != null) {
            this.ships.forEach((currShip) => {
                if (this.board[x][y] == currShip.name) {
                    // record a hit
                    currShip.hit();
                    console.log(`Hit ${currShip.name} at ${x}, ${y}!`);

                    // check if ship sunk
                    if (currShip.isSunk()) {
                        // do something
                        this.shipsSunk += 1;
                        console.log(`${currShip.name} sunk!!`);
                    }
                }
            });
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
            
            let newString = "" + i + " ";
            for (let j = 0; j < this.board.length; j++) {
                if (this.visited[i][j] && this.board[i][j]) {
                    // if visited
                    newString += "x";
                } else if (this.board[i][j]) {
                    // if unvisited ship
                    newString += this.board[i][j].split("")[0];
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
