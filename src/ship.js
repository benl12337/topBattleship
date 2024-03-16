module.exports =  class ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.hits = 0;
    }

    hit() {
        this.hits++;
        console.log(this.hits, this.length);
    }

    isSunk() {
        return (this.hits == this.length);
    }
};

