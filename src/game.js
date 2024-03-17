const player = require('./player');

const gameboardOne = document.querySelector('.board1');
const gameboardTwo = document.querySelector('.board2');
const gameMessage = document.querySelector('.game-message h3');
const pOneStatus = document.querySelector('.playerOneStatus');
const pTwoStatus = document.querySelector('.playerTwoStatus');


function initialiseShips(player, automated) {
    // loop through until all ships are placed
    for (let i = 0; i < 5; i++) {
        // place the ships randomly
        if (automated) {
            const rotated = Math.random() < 0.5 ? true : false;
            while (!player.playerBoard.placeShip(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), player.playerBoard.ships[i], rotated)) {
                console.log("attempt");
            }
        } else {
            // logic to let the user input their own board
        }
    }
}

function renderDOM(boardDiv, playerDiv, player, visited, hidden) {
    boardDiv.innerHTML = "";

    renderShips(playerDiv, player.playerBoard.ships);

    player.playerBoard.board.forEach((row, x) => {
        row.forEach((square, y) => {
            const squareDiv = document.createElement('div');

            // needs to be blank squares with datasets
            squareDiv.dataset.x = x;
            squareDiv.dataset.y = y;
            if (!visited[x][y]) {
                if (!square || square && hidden) {
                    squareDiv.className = "blank"
                } else {
                    squareDiv.className = "shipSquare";
                }
            } else {
                if (!square) {
                    squareDiv.className = "missSquare";
                } else {
                    squareDiv.className = "hitShip";
                    4
                }
            }
            boardDiv.appendChild(squareDiv);
        })
    });
}

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

function renderShips(playerDiv, ships) {
    playerDiv.innerHTML = "";
    for (let i = 0; i < ships.length; i++) {
        renderShipStatus(playerDiv, ships[i]);
    }
}

function endGame(activePlayer) {
    gameMessage.textContent = `${activePlayer.name} wins!`;

    // disable both boards
    const playerOneArray = document.querySelectorAll('.board1 div');
    const playerTwoArray = document.querySelectorAll('.board2 div');

    playerOneArray.forEach((box) => {
        box.classList.add('disabled');
    });

    playerTwoArray.forEach((box) => {
        box.classList.add('disabled');
    });
}

function game() {

    // initialise player1 and AI (their gameboards will be initialised as well)
    const players = [new player('Player'), new player('Computer')];
    let activePlayer = players[0];
    let gameWon = false;

    // render the divs
    const pOneArray = players[0].playerBoard.board;
    const pOneVisited = players[0].playerBoard.visited;
    const pTwoArray = players[1].playerBoard.board;
    const pTwoVisited = players[1].playerBoard.visited;


    console.log(pOneArray);
    console.log(pTwoArray);

    // render the gameboards
    renderDOM(gameboardOne, pOneStatus, players[0], pOneVisited, false);
    renderDOM(gameboardTwo, pTwoStatus, players[1], pTwoVisited, true);


    // automatically place the ships for each player on their boards
    // console.log('taking user input');
    initialiseShips(players[0], true);
    // console.log('user input done');
    initialiseShips(players[1], true);

    renderDOM(gameboardOne, pOneStatus, players[0], pOneVisited, false);
    renderDOM(gameboardTwo, pTwoStatus, players[1], pTwoVisited, true);


    // take turns going
    // player goes first

    function playRound() {

        function handleClick(e) {
            const x = e.target.dataset.x;
            const y = e.target.dataset.y;
            console.log(x, y);
            if (players[1].playerBoard.visited[x][y]) {
                gameMessage.textContent = "Square already hit!";
                return;
            }
            const boxArray = document.querySelectorAll('.board2 div');
            boxArray.forEach((box) => {
                box.removeEventListener('click', handleClick);
            });

            // make the attack
            players[0].makeMove(x, y, players[1]);

            // if it's a hit, check if a ship was hit
            if (players[1].playerBoard.board[x][y]) {
                // check if sunk
                if (players[1].playerBoard.board[x][y]) {
                    if (players[1].playerBoard.board[x][y].isSunk()) {
                        console.log(players[1].playerBoard.shipsSunk);
                        // check if game has been won
                        if (players[1].playerBoard.shipsSunk == 5) {
                            renderDOM(gameboardTwo, pTwoStatus, players[1], pTwoVisited, true);
                            endGame(activePlayer);
                            return;
                        } else {
                            gameMessage.textContent = `${players[1].playerBoard.board[x][y].name} sunk!`;
                        }

                    } else {
                        gameMessage.textContent = `It was a hit!`;
                    }
                }
            } else {
                gameMessage.textContent = 'Miss!';
            }

            renderDOM(gameboardTwo, pTwoStatus, players[1], pTwoVisited, true);
            const boxArray2 = document.querySelectorAll('.board2 div');
            boxArray2.forEach((element) => {
                element.classList.add('disabled');
            });
            activePlayer = activePlayer == players[0] ? players[1] : players[0];
            playRound();
        }


        // user turn
        if (activePlayer == players[0]) {
            // add event listeners to the gameboard
            const boxArray = document.querySelectorAll('.board2 div');
            boxArray.forEach((box) => {
                box.classList.remove("disabled");
                box.addEventListener('click', handleClick);
            });
        } else {
            // computer turn
            setTimeout(() => {
                gameMessage.textContent = "Computer making move...";
            }, 900);
            setTimeout(() => {
                let x = Math.floor(Math.random() * 10);
                let y = Math.floor(Math.random() * 10);

                while (!players[1].makeMove(x, y, players[0])) {
                    x = Math.floor(Math.random() * 10);
                    y = Math.floor(Math.random() * 10);
                }

                if (players[0].playerBoard.board[x][y]) {
                    if (players[0].playerBoard.board[x][y].isSunk()) {
                        gameMessage.textContent = `${players[0].playerBoard.board[x][y].name} sunk!`;
                        // if ship sunken, check if computer wins
                        if (players[0].playerBoard.shipsSunk == 5) {
                            renderDOM(gameboardOne, pOneStatus, players[0], pOneVisited, false);
                            endGame(activePlayer);
                            return;
                        }

                    } else {
                        gameMessage.textContent = `It's a hit!`;
                    }
                } else {
                    gameMessage.textContent = 'Miss!';
                }

                renderDOM(gameboardOne, pOneStatus, players[0], pOneVisited, false);
                // disable playerOneGameboard
                const boxArray = document.querySelectorAll('.board2 div');
                boxArray.forEach((box) => {
                    box.classList.add("disabled");
                });

                activePlayer = activePlayer == players[0] ? players[1] : players[0];
                playRound();
            }, 2200)
        }
    }

    playRound();

}



module.exports = game;