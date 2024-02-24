const gameboard = require('./gameboard');

test('Create a new GameBoard', ()=>{
    const newBoard = new gameboard();
    expect(newBoard).toBe();
});


// the board should only allow placing in valid locations
test.only('Place a ship of length 5 at co-ordinates 5,6', ()=>{
    const newBoard = new gameboard();
    expect(newBoard.placeShip(3, 0, '1', 4, false)).toBe(true);

    newBoard.receiveAttack(3,2);

    newBoard.printBoard();

    console.log(' are all ships sunk' + newBoard.allShipsSunk());
});