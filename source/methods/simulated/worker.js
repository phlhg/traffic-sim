import { length } from "../../map/utils";

function swap(path, step) {
    var newpath = [... path]
    for (let i = 0; i < step; i++) {
        let k = Math.floor(Math.random() * path.length)
        let l = Math.floor(Math.random() * path.length)

        let blub = newpath[k];
        newpath[k] = newpath[l];
        newpath[l] = blub
    }
    return newpath

}

export default function worker_bruteforce(data){

    var TIME_LIMIT = data.max_duration * 1000;
    var stepsize = data.stepsize;

    var opt = Infinity;
    var perm = Array.from(data.cities);
    
    perm = swap(perm, perm.length/2)
    var opt_perm = perm

    let start_time = new Date().getTime();

    while(true) {
        // Check that we still have time to do another round
        let cur_time = new Date().getTime();
        let T = cur_time - start_time;
        if(T >= TIME_LIMIT) {
            console.log("TIMELIMIT DONE")
            break;
        }

        let newperm = swap(perm, stepsize)


        var score = length(newperm);
            
        if(score < opt){
            opt = score;
            opt_perm = perm;

            postMessage({
                value: perm,
                score: opt,
                done: false
            });

            perm = newperm
        }
        else {

            let probability = Math.E ** (- Math.abs(score - opt) / T)
            
            // with increasing T it gets less likely
            if (Math.random() > probability) {
                perm = newperm
            }
        }

    }

    postMessage({ progress: 1 });
    postMessage({ value: opt_perm, score: opt, done: true });

} 