const player = require('./player');

test.only("Create a new player", ()=>{
    const newPlayer = new player('Ben');
    const enemyPlayer = new player('Enemy');

    console.log('Making a move on enemy');
    newPlayer.makeMove(3, 0, enemyPlayer);

});