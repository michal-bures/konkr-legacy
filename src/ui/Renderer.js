import log from 'loglevel';
import expect from 'expect';
import { OrderedMap } from 'lib/util';

const HEX_WIDTH = 32;
const HEX_HEIGHT = 37;
const HEX_EDGE_SIZE = Math.floor(HEX_HEIGHT/2);
const OFFSET_TOP = 10;
const OFFSET_LEFT = 10 + Math.floor(HEX_WIDTH/2);

const LINE_HEIGHT = Math.floor(HEX_HEIGHT * 3/4);

function convertToWorldCoordinates(x,y) {
    return {
        x: OFFSET_LEFT + x * HEX_WIDTH,
        y: OFFSET_TOP + y * LINE_HEIGHT
    };
}


function LandSprites(spec) {
    const {game, grid, regions} = spec;
    
    //public
    let landSprites = Object.freeze({
        highlightTiles,
        get group() { return group; }
    });

    //private
    let group = game.add.group(),
        tileToSprite = {},
        highlightedTiles = [];

    class LandSprite extends Phaser.Sprite {
        constructor(tile) {
            const {x,y} = convertToWorldCoordinates(tile.position.x, tile.position.y);
            super(game, x, y, 'hex');
            this.frame=regions.factionOf(tile) || 0;
            //log.debug(`Hex sprite for ${tile} created at ${x}:${y}`);
            /*
            var style = { font: "12px Courier New", fill: "white", align: "center"};
            this.label = game.add.text(HEX_WIDTH/2,HEX_HEIGHT/2,tile.id, style);
            this.label.alpha=0.5;
            this.label.lineSpacing = -6;
            this.label.anchor.set(0.5,0.5);
            this.addChild(this.label);*/
            
        }
    }

    //initialization
    grid.forEach((hex) => {
        var sprite = new LandSprite(hex);
        group.add(sprite);
        tileToSprite[hex.id] = sprite;
    });

    //implementation

    function highlightTiles(tiles) {
        return;
        highlightedTiles.forEach((tileSprite) => {
            if (tileSprite) tileSprite.frame = 0;
        });
        highlightedTiles = tiles.map((tile) => tile && tileToSprite[tile.id]);
        highlightedTiles.forEach((tileSprite) => {
            if (tileSprite) tileSprite.frame = 1;
        });
    }



    return landSprites;
}



const PAWN_OFFSET_TOP = -13;

class Pawns {
    constructor({game, log, pawns}) {
        expect(game).toExist();
        expect(pawns).toExist();    

        this.game = game;
        this.group = game.add.group();
        this.pawns = pawns;
        this.pawnToSprite = {};
        this.pawns.forEach((pawn) => {
            var sprite = new PawnSprite({game},pawn);
            this.group.add(sprite);
            this.pawnToSprite[pawn.id] = sprite;
        });        
    }
}

class PawnSprite extends Phaser.Sprite {
    constructor({game},pawn) {
        const {x,y} = convertToWorldCoordinates(pawn.hex.position.x, pawn.hex.position.y);
        super(game, x, y+PAWN_OFFSET_TOP, 'pawn');
        this.frame=pawn.pawnType.ordinal;
        this.pawn=pawn;
        
/*        var style = { font: "10px Courier New", fill: "white", align: "center"};
        this.label = game.add.text(HEX_WIDTH/2,HEX_HEIGHT/2,tile.id, style);
        this.label.lineSpacing = -6;
        this.label.anchor.set(0.5,0.5);
        this.addChild(this.label);*/
        
    }
}


class DebugInfo {
    constructor({game}) {
        this.game = game;
        this.items = new OrderedMap();
    }

    set(key,value) {
        this.items.push(key,value);
    }

    render() {
        let y = 32;
        this.items.forEach((key, value) => {
            this.game.debug.text(key + ": " + value,32,y);
            y +=32;
        });
    }
}

export { LandSprites, Pawns, DebugInfo, HEX_WIDTH, HEX_HEIGHT, LINE_HEIGHT };