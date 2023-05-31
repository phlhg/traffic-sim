import Graph from "../../map/graph";
import { length } from "../../map/utils";
import { factorial, permute } from "../../utils";

export default function worker_bruteforce2(data){

    var opt = Infinity;
    var opt_perm = Graph.from(data.graph)

    console.log(opt_perm)
    return

    var perm_gen = permute(data.cities);
    var perm = perm_gen.next();

    var perm_amount = factorial(data.cities.length);
    var perm_done = 0;

    while(!perm.done){
        var w = length(perm.value);
        
        if(w < opt){
            opt = w;
            opt_perm = perm.value;
            postMessage({
                value: opt_perm,
                score: opt,
                done: false
            });
        }

        perm = perm_gen.next();
        perm_done += 1;

        if(perm_done % 100 == 1){
            postMessage({ progress: perm_done / perm_amount });
        }
    }

    postMessage({ progress: 1 });
    postMessage({ value: opt_perm, score: opt, done: true });

} 