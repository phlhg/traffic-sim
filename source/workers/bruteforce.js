import { permute, sleep } from "../utils";

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

onmessage = async e => {

    console.log("Received");

    var opt = Infinity;
    var opt_perm = [];

    var perm_gen = permute(e.data.cities)
    var perm = perm_gen.next();

    while(!perm.done){
        var w = calcWeight(perm.value);

        if(w < opt){
            opt = w;
            opt_perm = perm.value;
            postMessage({
                value: opt_perm,
                done: false
            });
            await sleep(100);
        }

        perm = perm_gen.next();
    }

    postMessage({
        value: opt_perm,
        done: true
    });

    console.log("Done");

}