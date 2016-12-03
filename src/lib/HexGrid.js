import log from 'loglevel';
import expect from 'expect';

// A coordinates in the hexagonal grid.
// automatically converts between three coordinate systems
// - ordinal: (index, rowrowSize) position of hex in a 1D array organized by rows
// - axial: (r,c) coordinates in hex map (r = row, c = column (column axis on hex grid goes down and sligthly left))
// - spatial: (x,y) coordinates on screen
class GridPoint {
    // index = index in single-dimensional row-major array of hexes
    // rowSize = number of hexes per row in the array
    constructor({x,y,r,c,index,rowSize}) {
        expect(rowSize).toBeA('number');
        if (x !== undefined && y !== undefined) {
            this._axial = { r: 2*(y-x), c: y};
        } else if (r !== undefined && c !== undefined) {
            this._axial = { r: r };
        } else if (index !== undefined && rowSize !== undefined) {
            this._index = index;
        } else {
            log.error('Invalid coordinates specification for creating a GridPoint ',{x:x,y:y,r:r,c:c,index:index,rowSize:rowSize});
        }
        this._rowSize = rowSize;
    }

    // Index in array of all gridpoints on map
    get index() {
        if (this._index === undefined) {
            this._index = this.r * this._rowSize + this.c - Math.floor(this.r/2);
        }
        return this._index;
    }

    // Axial coordinates in hexagonal grid
    get axial() {
        if (this._axial === undefined) {
            let r = Math.floor(this._index / this._rowSize);
            this._axial = {r: r, c:Math.floor(this._index  % this._rowSize + Math.floor(r/2))};
        }
        return this._axial;
    }


    // row in hexagonal grid
    get r() {
        return this.axial.r;
    }

    // "column" (line going down and left) in the hexagonal grid
    get c() {
        return this.axial.c;
    }

    // horizontal coordinate for display
    get x() {
        return this.c - this.r/2;
    }

    // vertical coordinate for display
    get y() {
        return this.r;
    }

    toString() {
        return(`[GridPoint ${this.index} (${this.r},${this.c})]`);
    }

}
window.GridPoint = GridPoint; //TODO:REMOVE

class HexGrid {

    constructor(width, height) {
        this.hexes = [];
        this.width = width;
        this.height = height;
        this.upperBound = width * height;

        this.fillWith(null);
    }

    fillWith(value) {
        if (typeof value == 'function') {
            for (let i = 0; i < this.upperBound; ++i) {
                this.hexes[i] = value(new GridPoint({index: i, rowSize: this.width}));
            }
        } else {
            for (let i = 0; i < this.upperBound; ++i) {
                this.hexes[i] = value;
            }
        }
    }

    // point = GridPoint instance
    getHexByAxial(r,c) {
        if (c >= this.width - 0.5 + r/2 || c - r/2 <= -1) return undefined;
        if (r >= this.height) return undefined;
        const i = r * this.width + c - Math.floor(r/2);
        return this.hexes[i];
    }

    map(fn) {
        var self = this;
        return this.hexes.map(function(hex, index) {
            fn(hex, new GridPoint({index: index, rowSize: self.width}));
        });
    }

    dump() {
        let str = "";
        for (let r = 0; r < this.height; ++r) {
            for (let c = 0; c < this.width; ++c) {
                str+=(this.hexes[r*this.height+c]===null?" ":"X");
            }
            str += "\n";
        }
        return str;
    }

    static test() {
        let grid = new HexGrid(4,6);
        log.debug("4x6 world");
        grid.map(function(hex,p) {
            log.debug("Visited hex #" + p);
        });
    }
}

export { HexGrid };
