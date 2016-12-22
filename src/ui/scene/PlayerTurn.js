import Scene from './Scene';

function PlayerTurn(spec){

    let { pawnSprites, landSprites, players } = spec;

    return new Scene(spec, { 
        name: 'PLAYER_TURN',
        uiElements: {
            landSprites:true,
            regionBorders:true,
            selRegionHighlight:true,
            pawnSprites:true,
            gridOverlays:true,
            hexSelectionProxy:true,
            messages:true,
            uiRegionPanel:true,
            nextTurnButton:true
        },
        bindSignals: {
            pawns: {
                onCreated,
                onDestroyed,
            },
            regions: {
                onHexesChangedOwner: landSprites.refreshHexes
            }    
        },
        regionSelectFilter: (region) => {
            return players.activePlayer.controls(region);
        }

    });

    function onCreated(pawn) {
        let p = pawnSprites.getOrCreate(pawn.hex, pawn.pawnType);
        p.fadeIn();
    }
    function onDestroyed(pawn) {
        pawnSprites.destroySprite(pawn.hex);
    }

}

export default PlayerTurn;