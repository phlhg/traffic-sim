import { length } from "../../map/utils";
import { factorial, permute } from "../../utils";

export default function worker_bruteforce(data){

    var opt = Infinity;
    var opt_perm = [];

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

        postMessage({ progress: perm_done / perm_amount });
    }

    postMessage({ progress: 1 });
    postMessage({ value: opt_perm, score: opt, done: true });

} 