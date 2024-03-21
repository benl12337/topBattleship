const player = require('./player');

const gameboardOne = document.querySelector('.board1');
const gameboardTwo = document.querySelector('.board2');
const gameMessage = document.querySelector('.game-message h3');
const pOneStatus = document.querySelector('.playerOneStatus');
const pTwoStatus = document.querySelector('.playerTwoStatus');

let rotated = false;

document.addEventListener('keypress', (e) => {
    if (e.key == "r" || e.key == "R") {
        rotated = rotated ? false : true;
        console.log(rotated);
    }
});

function initialiseShips(player) {
    // loop through until all ships are placed
    for (let i = 0; i < 5; i++) {
        // place the ships randomly
        const rotated = Math.random() < 0.5 ? true : false;
        while (!player.playerBoard.placeShip(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), player.playerBoard.ships[i], true)) {
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
    let shipsPlaced = 0;
    const pOneArray = players[0].playerBoard.board;
    const pOneVisited = players[0].playerBoard.visited;
    const pTwoArray = players[1].playerBoard.board;
    const pTwoVisited = players[1].playerBoard.visited;
    gameMessage.textContent = "Press 'r' to rotate";


    // handle the user input
    function handleInput(e) {

        x = parseInt(e.target.dataset.x);
        y = parseInt(e.target.dataset.y);
        console.log(players[0]);
        const placed = players[0].playerBoard.placeShip(x, y, players[0].playerBoard.ships[shipsPlaced], rotated);
        console.log("placed: ", placed);
        // if ship is successfully placed
        if (placed) {
            console.log('ship placed');
            players[0].playerBoard.printBoard();
            if (shipsPlaced == 4) {
                // remove event listeners
                const squares = document.querySelectorAll('.board1 div');
                squares.forEach((square) => {
                    square.removeEventListener('click', handleInput);
                });

                // start game
                initialiseShips(players[1]);
                renderDOM(gameboardOne, pOneStatus, players[0], pOneVisited, false);
                renderDOM(gameboardTwo, pTwoStatus, players[1], pTwoVisited, true);
                playRound();
            }
            shipsPlaced++;
        }
    }

    // render the gameboards
    renderDOM(gameboardOne, pOneStatus, players[0], pOneVisited, false);
    renderDOM(gameboardTwo, pTwoStatus, players[1], pTwoVisited, true);

    // add an event listener to the divs
    const squares = document.querySelectorAll('.board1 div');
    let test = 0;

    squares.forEach((square) => {
        square.addEventListener('mouseover', (e) => {
            const x = parseInt(e.target.dataset.x);
            const y = parseInt(e.target.dataset.y);
            const shipLength = players[0].playerBoard.ships[shipsPlaced].length;

            if (rotated) {
                console.log("HI");
                for (let i = 0; i < shipLength; i++) {
                    if (x + i < 10) {
                        const adjacentBox = document.querySelector(`[data-x="${x+i}"][data-y="${y}"]`);
                        console.log(" The adjacent box is" + adjacentBox);
                        adjacentBox.classList.add('userInput');
                    }
                }
            } else {
                console.log("TEA");
                for (let i = 0; i < shipLength; i++) {
                    if (y + i < 10) {
                        const adjacentBox = document.querySelector(`[data-x="${x}"][data-y="${y+i}"]`);
                        console.log(" The adjacent box is" + adjacentBox);
                        console.log(adjacentBox);
                        adjacentBox.classList.add('userInput');
                    }
                }
            }

        });
        square.addEventListener('mouseout', (e) => {
            const x = e.target.dataset.x;
            const y = e.target.dataset.y;
            const boxes = document.querySelectorAll(`.board1 [data-x="${x}"]`);
            boxes.forEach((box) => {
                box.classList.remove('userInput');
            });
            const boxes2 = document.querySelectorAll(`.board1 [data-y="${y}"]`);
            boxes2.forEach((box) => {
                box.classList.remove('userInput');
            });
        });
        square.addEventListener('click', handleInput);
    });






    function playRound() {

        // handle the user's click
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


        // handle the user turn
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
}



module.exports = game;