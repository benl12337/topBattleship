const player = require('./player');

function initialiseShips(player) {
    // loop through until all ships are placed
    for (let i = 0; i < 5; i++) {
        // let the user place ship successfully
        const rotated = Math.random() < 0.5 ? true : false;
        while (!player.playerBoard.placeShip(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), player.playerBoard.ships[i], rotated)) {

        }
    }
}

function game() {

    // initialise player1 and AI (and their gameboards will be initialised as well)
    const players = [new player('Player'), new player('Computer')];
    let activePlayer = players[0];

    // automatically place the ships for each player on their boards
    initialiseShips(players[0]);
    players[0].playerBoard.printBoard();
    initialiseShips(players[1]);
    players[1].playerBoard.printBoard();


    // loop the game until one of the boards is fully sunken
    const getPlayerOneBoard = () => players[0].playerBoard.board;
    const getPlayerOneVisited = () => players[0].playerBoard.visited;
    const getPlayerTwoBoard = () => players[1].playerBoard.board;
    const getPlayerTwoVisited = () => players[1].playerBoard.visited;

    const makeMove = (x,y,)=>{
        if (players[0].makeMove(x,y,players[1])) {
            activePlayer = activePlayer == players[0] ? players[1] : players[0];
            return true;
        } 
        return false;
    }

    const makeCompMove = ()=>{
        players[1].makeAIMove(players[0]);

    };

    const getActivePlayer = ()=> activePlayer;



    /* player1.playerBoard.printBoard();
    console.log("\n");
    player2.playerBoard.printBoard();
    player1.playerBoard.allShipsSunk() ? console.log(`${player2.name} WINS!!`) : console.log(`${player1.name} WINS!!!`);
    console.log(player1.name + " " +  player1.playerBoard.shipsSunk + " ships sunk");
    console.log(player2.name + " " +  player2.playerBoard.shipsSunk + " ships sunk"); */

    return { getPlayerOneBoard, getPlayerOneVisited, getPlayerTwoBoard, getPlayerTwoVisited, makeMove, makeCompMove, getActivePlayer }
}

module.exports = game;