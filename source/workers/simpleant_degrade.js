import { sleep } from "../utils";

var degrading_done = false;

const SUBTRACT = 0.000001;

onmessage = async e => {
    if(e.data.state == 0) { // stop
        degrading_done = true;
    } else if(e.data.state == 1) { // start
        degrading_done = false;
        let pheromones = e.data.pheromones;

        while(!degrading_done) {
            for(let i in pheromones) {
                if(pheromones[i] >= SUBTRACT) {
                    pheromones[i] -= SUBTRACT;
                }
            }
            await sleep(100);
        }
    }
}
