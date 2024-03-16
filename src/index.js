const game = require('./game');
import './style.css';

/*
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

function gameController() {
   // gameMessage.textContent = `${newGame.getActivePlayer().name}'s turn`;
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

gameController();*/

game();


