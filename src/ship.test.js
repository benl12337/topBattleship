const ship = require('./ship');

test.only('Hitting Test', () => {
    const newShip = new ship(5, 0);
    newShip.hit();
    newShip.hit();
    newShip.hit();
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBe(true);
});


