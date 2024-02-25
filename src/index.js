const game = require('./game');
import './style.css';

const newGame = game();

const playerOneBoard = document.querySelector('.board1');
const playerTwoBoard = document.querySelector('.board2');
const pOneArray = newGame.getPlayerOneBoard().board;
const pTwoArray = newGame.getPlayerTwoBoard().board;
const gameMessage = document.querySelector('.game-message h3');
const pOneStatus = document.querySelector('.playerOneStatus'); 
const pTwoStatus = document.querySelector('.playerTwoStatus'); 
let pOneVisited = newGame.getPlayerOneVisited();
let pTwoVisited = newGame.getPlayerTwoVisited();


function renderShips(playerDiv, playerBoard) {
    const shipsArray = playerBoard.ships;
    // make carrier 5 long
    const carrierShell = document.createElement('div');
    carrierShell.className = 'statusShell';

    for (let i = 0; i < playerBoard.ships[0].length; i++) {
        // if sunk
        const numberHits = playerBoard.ships[0].hits;
        const isSunk = playerBoard.ships[0].isSunk();
        console.log(isSunk);
        const statusSquare = document.createElement('div');
        statusSquare.className = 'statusSquare';  

        if (isSunk) {
            statusSquare.classList.add("statusSquareHit");
        } 
        carrierShell.appendChild(statusSquare);
    }

    playerDiv.appendChild(carrierShell);

    // make battleship 4 long
    const battleShipShell = document.createElement('div');
    battleShipShell.className = 'statusShell';

    for (let i = 0; i < playerBoard.ships[1].length; i++) {
        // count number of hits
        const numberHits = playerBoard.ships[1].hits;
        const isSunk = playerBoard.ships[1].isSunk();
        console.log(isSunk);
        const statusSquare = document.createElement('div');
        statusSquare.className = 'statusSquare';  

        if (isSunk) {
            statusSquare.classList.add("statusSquareHit");
        } 
        battleShipShell.appendChild(statusSquare);
    }

    playerDiv.appendChild(battleShipShell);

    // make destroyer 3 long
    const destroyerShell = document.createElement('div');
    destroyerShell.className = 'statusShell';

    for (let i = 0; i < playerBoard.ships[2].length; i++) {
        // count number of hits
        const numberHits = playerBoard.ships[2].hits;
        const isSunk = playerBoard.ships[2].isSunk();
        console.log(isSunk);
        const statusSquare = document.createElement('div');
        statusSquare.className = 'statusSquare';  

        if (isSunk) {
            statusSquare.classList.add("statusSquareHit");
        } 
        destroyerShell.appendChild(statusSquare);
    }

    playerDiv.appendChild(destroyerShell);

    // make submarine 3 long
    const submarineShell = document.createElement('div');
    submarineShell.className = 'statusShell';

    for (let i = 0; i < playerBoard.ships[3].length; i++) {
        // count number of hits
        const numberHits = playerBoard.ships[3].hits;
        const isSunk = playerBoard.ships[3].isSunk();
        console.log(isSunk);
        const statusSquare = document.createElement('div');
        statusSquare.className = 'statusSquare';  

        if (isSunk) {
            statusSquare.classList.add("statusSquareHit");
        } 
        submarineShell.appendChild(statusSquare);
    }

    playerDiv.appendChild(submarineShell);

    // make patrol boat 2 long
    const patrolShell = document.createElement('div');
    patrolShell.className = 'statusShell';

    for (let i = 0; i < playerBoard.ships[4].length; i++) {
        // count number of hits
        const numberHits = playerBoard.ships[4].hits;
        const isSunk = playerBoard.ships[4].isSunk();
        console.log(isSunk);
        const statusSquare = document.createElement('div');
        statusSquare.className = 'statusSquare';  

        if (isSunk) {
            statusSquare.classList.add('statusSquareHit');
        } 
        patrolShell.appendChild(statusSquare);
    }

    playerDiv.appendChild(patrolShell);

    console.log(shipsArray);
}

function renderDOM() {


    // render the status messages
    playerOneBoard.innerHTML = "";
    playerTwoBoard.innerHTML = "";
    pOneStatus.innerHTML = "";
    pTwoStatus.innerHTML = "";

   renderShips(pOneStatus, newGame.getPlayerOneBoard());
   renderShips(pTwoStatus, newGame.getPlayerTwoBoard());

    
    // render current state of player board
    pOneArray.forEach((row, x) => {
        row.forEach((square, y) => {
            const squareDiv = document.createElement('div');

            if (pOneArray[x][y]) {
                // if a ship exists here and hit
                if (pOneVisited[x][y]) {
                    squareDiv.className = "hitShip";
                } else {
                    // if a ship exists and not hit
                    squareDiv.className = "shipSquare";
                }

            } else {
                if (pOneVisited[x][y]) {
                    // if no ship exists here and hit
                    squareDiv.className = "missSquare";
                } else {
                    // if no ship and not hit
                    squareDiv.className = "blank";
                }
            }

            playerOneBoard.appendChild(squareDiv);
        });

    });

    pTwoArray.forEach((row, x) => {
        row.forEach((square, y) => {
            const squareDiv = document.createElement('div');
            squareDiv.dataset.x = x;
            squareDiv.dataset.y = y;
            if (pTwoVisited[x][y]) {
                if (pTwoArray[x][y]) {
                    squareDiv.classList.add('hitShip');
                } else {
                    squareDiv.classList.add('missSquare');
                }
            } else {
                squareDiv.classList.add('blank');
            }
            playerTwoBoard.appendChild(squareDiv);
        });
    });
}

function gameController() {
    gameMessage.textContent = `${newGame.getActivePlayer().name}'s turn`;
    renderDOM();
}

function disableGameboard() {
    const squares = document.querySelectorAll('.board2 div');
    squares.forEach((square)=>{
        square.classList.add('disabled');
    });
}

function handleClick(e) {
    const x = e.target.dataset.x;
    const y = e.target.dataset.y;
    if (pTwoVisited[x][y]) {
        const currentMessage = gameMessage.textContent;
        gameMessage.textContent = "Square already hit!";

        setTimeout(()=>{
            gameMessage.textContent = currentMessage;
        }, 1250);
        return;
    }


    // make the player's move
    newGame.makeMove(x, y);
    renderDOM();

    disableGameboard();
    gameMessage.textContent = `Computer making move...`;
    
    setTimeout(() => {
        newGame.makeCompMove()
        pOneVisited = newGame.getPlayerOneVisited();
        pTwoVisited = newGame.getPlayerTwoVisited();
        renderDOM();
        gameMessage.textContent = `Player's turn`;
    }, 2000);


}

playerTwoBoard.addEventListener("click", handleClick);

gameController();

