import { sleep } from "../../utils";

var degrading_done = false;

const SUBTRACT = 0.000001;

export default async function worker_simpleant_degrade(data){
    if(data.state == 0) { // stop
        degrading_done = true;
    } else if(data.state == 1) { // start
        degrading_done = false;
        let pheromones = data.pheromones;

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