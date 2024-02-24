const gameboard = require('./gameboard');

module.exports = class player {
    constructor(name) {
        this.name = name;
        this.playerBoard = new gameboard();
    }

    makeMove(x, y, enemy) {
        // return true if successful, false if not
        return enemy.playerBoard.receiveAttack(x, y);
    }

    makeAIMove(enemy) {
        // end loop when a move is successful
        while(!this.makeMove(Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),  enemy)) {
        }
    }
}


