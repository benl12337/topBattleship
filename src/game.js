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

function renderDOM(boardDiv, array, visited, hidden) {
    boardDiv.innerHTML = "";

    array.forEach((row, x) => {
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
    renderDOM(gameboardOne, pOneArray, pOneVisited);
    renderDOM(gameboardTwo, pTwoArray, pTwoVisited, true);


    // automatically place the ships for each player on their boards
    // console.log('taking user input');
    initialiseShips(players[0], true);
    // console.log('user input done');
    initialiseShips(players[1], true);

    renderDOM(gameboardOne, pOneArray, pOneVisited, false);
    renderDOM(gameboardTwo, pTwoArray, pTwoVisited, true);


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
                gameMessage.textContent = "It's a hit!"
                console.log(players[1].playerBoard.board[x][y]);
                // check if sunk
                if (players[1].playerBoard.board[x][y]) {
                    if (players[1].playerBoard.board[x][y].isSunk()) {
                        gameMessage.textContent = `${players[1].playerBoard.board[x][y].name} sunk!`;
                    } else {
                        gameMessage.textContent = `It was a hit!`;

                    }
                }
            }

            renderDOM(gameboardTwo, pTwoArray, pTwoVisited, true);

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
            players[1].makeAIMove(players[0]);
            renderDOM(gameboardOne, pOneArray, pOneVisited, false);
            // disable playerOneGameboard
            const boxArray = document.querySelectorAll('.board2 div');
            boxArray.forEach((box) => {
                box.classList.add("disabled");
            });
            activePlayer = activePlayer == players[0] ? players[1] : players[0];
            playRound();
        }
    }

    playRound();

}



module.exports = game;