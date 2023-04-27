import { factorial, permute, sleep } from "../utils";

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

    var opt = Infinity;
    var opt_perm = [];

    var perm_gen = permute(e.data.cities)
    var perm = perm_gen.next();

    var perm_amount = factorial(e.data.cities.length);
    var perm_done = 0;

    while(!perm.done){
        var w = calcWeight(perm.value);
        
        if(w < opt){
            opt = w;
            opt_perm = perm.value;
            postMessage({
                value: opt_perm,
                done: false
            });
        }

        perm = perm_gen.next();
        perm_done += 1;

        postMessage({ progress: perm_done / perm_amount });
    }

    postMessage({ progress: 1 });
    postMessage({ value: opt_perm, done: true });

}