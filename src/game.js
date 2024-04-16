const player = require('./player');

// define constants and variables
const gameboardOne = document.querySelector('.board1');
const gameboardTwo = document.querySelector('.board2');
const gameMessage = document.querySelector('.game-message h3');
const pOneStatus = document.querySelector('.playerOneStatus');
const pTwoStatus = document.querySelector('.playerTwoStatus');
let rotated = false;

// create ship status icons
function initialiseShips(player) {
    // loop through until all ships are placed
    for (let i = 0; i < 5; i++) {
        // place the ships randomly
        const rotated = Math.random() < 0.5 ? true : false; // Unused variable and it also "shadows" variable name on line 9 ***
        while (!player.playerBoard.placeShip(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), player.playerBoard.ships[i], true)) { 
        }
        /* This while loop is hard to read
        For example, I would extract `Math.floor(Math.random() * 10)` to another method so that the method name makes it clear what you're trying to achieve
        */
    }
}

// append a blank grid to the gameboard
function initialiseDOM(boardDiv, player) {
    player.playerBoard.board.forEach((row, x) => {
        // Use _ for unused variables
        row.forEach((square, y) => {
            const squareDiv = document.createElement('div');
            squareDiv.dataset.x = x;
            squareDiv.dataset.y = y;
            squareDiv.classList.add('blank');
            boardDiv.append(squareDiv);
        });
    });
}

// updates the DOM with new classes
function updateDOM(boardDiv, playerDiv, player, visited, hidden) {
    renderShips(playerDiv, player.playerBoard.ships);
    // get all the squares in an array
    const squares = boardDiv.querySelectorAll(`div`);
    squares.forEach((square) => {
        const x = square.dataset.x;
        const y = square.dataset.y;

        if (!visited[x][y]) {
            if (!player.playerBoard.board[x][y] || player.playerBoard.board[x][y] && hidden) {
                square.className = "blank"
            } else {
                square.className = "shipSquare";
            }
        } else {
            if (!player.playerBoard.board[x][y]) {
                square.className = "missSquare";
            } else {
                square.className = "hitShip";
            }
        }
    });
}

// render the statuses of ships on the sides of the game boards
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

// helper function to render the shpis on the side of the game boards
function renderShips(playerDiv, ships) {
    playerDiv.innerHTML = "";
    for (let i = 0; i < ships.length; i++) {
        renderShipStatus(playerDiv, ships[i]);
    }
}

// disable the boards and display the winning message
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

// handles the game logic
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
    gameMessage.textContent = "Place Carrier";

    // render the ship statuses
    renderShips(pOneStatus, players[0].playerBoard.ships);
    renderShips(pTwoStatus, players[1].playerBoard.ships);



    // listen for rotate keypress
    document.addEventListener('keypress', (e) => {
        if (e.key == "r" || e.key == "R") {
            rotated = rotated ? false : true;
        }
    });


    // handle user ipnutting the ship locations
    function handleInput(e) {
        x = parseInt(e.target.dataset.x);
        y = parseInt(e.target.dataset.y);
        const placed = players[0].playerBoard.placeShip(x, y, players[0].playerBoard.ships[shipsPlaced], rotated);
        console.log("placed" + placed + "number of ships placed" + shipsPlaced);

        // if ship is successfully placed, update the DOM
        // check if all ships have been placed, then start the game
        if (placed) {
            shipsPlaced++;

            switch (shipsPlaced) {
                case 0:
                    gameMessage.textContent = 'Place Carrier';
                    break;
                case 1:
                    gameMessage.textContent = 'Place Battleship';
                    break;
                case 2:
                    gameMessage.textContent = 'Place Destoyer';
                    break;
                case 3:
                    gameMessage.textContent = 'Place Submarine';
                    break;
                case 4:
                    gameMessage.textContent = 'Place Patrol Boat';
                    break;
            }
            

            updateDOM(gameboardOne, pOneStatus, players[0], players[0].playerBoard.visited, false);

            if (shipsPlaced == 5) {
                // remove event listeners
                const squares = document.querySelectorAll('.board1 div');
                squares.forEach((square) => {
                    square.removeEventListener('click', handleInput);
                });

                // randomly place the computer ships
                initialiseShips(players[1]);
                //renderDOM(gameboardOne, pOneStatus, players[0], pOneVisited, false);
                updateDOM(gameboardTwo, pTwoStatus, players[1], pTwoVisited, true);
                playRound();
            }
        }
    }

    // render the gameboards
    initialiseDOM(gameboardOne, players[0]);
    initialiseDOM(gameboardTwo, players[1]);

    // add an event listener to the divs
    const squares = document.querySelectorAll('.board1 div');

    // get ship location inputs
    squares.forEach((square) => {
        square.addEventListener('mouseover', (e) => {
            const x = parseInt(e.target.dataset.x);
            const y = parseInt(e.target.dataset.y);
            const shipLength = players[0].playerBoard.ships[shipsPlaced].length;

            if (rotated) {
                for (let i = 0; i < shipLength; i++) {
                    if (x + i < 10) {
                        const adjacentBox = document.querySelector(`[data-x="${x + i}"][data-y="${y}"]`);
                        adjacentBox.classList.add('userInput');
                    }
                }
            } else {
                for (let i = 0; i < shipLength; i++) {
                    if (y + i < 10) {
                        const adjacentBox = document.querySelector(`[data-x="${x}"][data-y="${y + i}"]`);
                        adjacentBox.classList.add('userInput');
                    }
                }
            }

        });
        square.addEventListener('mouseout', (e) => {
            const x = e.target.dataset.x;
            const y = e.target.dataset.y;
            const boxes = gameboardOne.querySelectorAll(`[data-x="${x}"]`);
            boxes.forEach((box) => {
                box.classList.remove('userInput');
            });
            const boxes2 = gameboardOne.querySelectorAll(`[data-y="${y}"]`);
            boxes2.forEach((box) => {
                box.classList.remove('userInput');
            });
        });

        // add an event listener to place ship
        square.addEventListener('click', handleInput);
    });


    // handles the logic to advance the round
    function playRound() {

        // initialise the game message
        gameMessage.textContent = `${activePlayer.name}'s turn`

        // handle the user's click
        function handleClick(e) {
            const x = e.target.dataset.x;
            const y = e.target.dataset.y;
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
                        // check if game has been won
                        if (players[1].playerBoard.shipsSunk == 5) {
                            updateDOM(gameboardTwo, pTwoStatus, players[1], pTwoVisited, true);
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

            // update the gameboard to reflect move
            updateDOM(gameboardTwo, pTwoStatus, players[1], pTwoVisited, true);

            // disable gameboard
            const boxArray2 = document.querySelectorAll('.board2 div');
            boxArray2.forEach((element) => {
                element.classList.add('disabled');
            });

            // switch active player
            activePlayer = activePlayer == players[0] ? players[1] : players[0];

            // start the next round
            setTimeout(() => {
                    playRound();
            },1000);
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
                            updateDOM(gameboardOne, pOneStatus, players[0], pOneVisited, false);
                            endGame(activePlayer);
                            return;
                        }

                    } else {
                        gameMessage.textContent = `It's a hit!`;
                    }
                } else {
                    gameMessage.textContent = 'Miss!';
                }

                updateDOM(gameboardOne, pOneStatus, players[0], pOneVisited, false);
                // disable playerOneGameboard
                const boxArray = document.querySelectorAll('.board2 div');
                boxArray.forEach((box) => {
                    box.classList.add("disabled");
                });

                activePlayer = activePlayer == players[0] ? players[1] : players[0];
                setTimeout(() => {
                    playRound();
                }, 1000);
            }, 2200)
        }
    }
}

/* 
    This should be a class. We have lots of methods/data in this file that should be encapsulated into a class.
    You also have classes for your other "entities", so it would only make sense to make this a class too.

    game() can be separated into many methods IMO. It is way too long and doing many things.
    Just by the method name, it is not 100% clear on what the method achieves, so if I was working on this project
    and I wanted to call .game(), I wouldn't know what it does.

    The event listener, handleInput(), etc... can be moved outside the method. You generally don't want methods inside methods.
    Same thing with handleClick() inside playRound()
    
    A lot of the logic can also be extracted into another method, for example line 191 to 229. You have a comment stating what it does,
    why not extract this into a method with a similar name such as getShipLocationInputs(). This makes your code easier to read
    and easier to test (you can test methods by themselves).


*/



module.exports = game;