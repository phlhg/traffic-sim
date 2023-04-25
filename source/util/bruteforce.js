import {permute, sleep} from './helper'

var running = false;

function calcWeight(path){

    var weight = 0;

    for(let i = 0; i < path.length; i++){
        let a = path[i];
        let b = path[(i+1)%path.length]
        weight += Math.sqrt(
            Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2)
        );
    }

    return weight;

}

export async function startbrute(map) {

    if(running){ return; }
    running = true;

    var opt = Infinity;
    var opt_perm = [];

    var perm_gen = permute([...map.cities])
    var perm = perm_gen.next();

    while(!perm.done){
        var w = calcWeight(perm.value);

        if(w < opt){
            opt = w;
            opt_perm = perm.value;

            map.roads = [];
            for(let i = 0; i < opt_perm.length; i++){
                map.addRoad(opt_perm[i],opt_perm[(i+1)%opt_perm.length])
            }
            
            map.draw();

            await sleep(100);
        }

        perm = perm_gen.next();
    }

    console.log("Done")
    running = false;

}