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

function renderShipStatus(playerDiv, ship) {
    const shell = document.createElement('div');
    shell.className = 'statusShell';

    for (let i = 0; i < ship.length; i++) {
        const numberHits = ship.hits;
        const statusSquare = document.createElement('div');
        statusSquare.className = 'statusSquare';  

        if (ship.isSunk()) {
            statusSquare.classList.add("statusSquareHit");
        } 
        shell.appendChild(statusSquare);
    }
    playerDiv.append(shell);
}

function renderShips(playerDiv, playerBoard) {
    const shipsArray = playerBoard.ships;
    for (let i = 0; i < shipsArray.length; i++) {
        renderShipStatus(playerDiv,shipsArray[i]);
    }
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

