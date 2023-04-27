import { permute, sleep } from "../utils";
import Message from "../utils/message";
import Method from "./method"

export default class SimpleAnt extends Method {

    constructor(...data) {
        super(...data);

        this.worker = null;

        this.name = "SimpleAnts";
        this.description = "Simple ANT implementation";
    }


    async run() {
        if(this.running) {
            return; 
        }
        this.running = true;

        let cities = this.app.map.cities;
        let pheromone_map = {};

        this.worker = new Worker('/js/workers/simpleant.js');
        this.degrade_worker = new Worker('/js/workers/simpleant_degrade.js');

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {
            let perm = e.data.value;
            this.app.map.roads = [];
            for(let i = 0; i < perm.length; i++) {
                this.app.map.addRoad(perm[i],perm[(i+1)%perm.length])
            }
            this.app.map.draw();
            

            if(e.data.done) {
                this.running = false;
                this.degrade_worker.postMessage({
                    state:0
                });
            }
        }

        // Start worker by posting the message with the cities
        this.worker.postMessage({
            // make copy of cities to prevent user writing into it during execution
            cities: [...this.app.map.cities], 
            // Shared pheromones
            pheromones: pheromone_map
        });
        // This is only needed once, to degrade the pheromones over time
        this.degrade_worker.postMessage({
            pheromones: pheromone_map,
            state: 1
        });

        while(this.running) { 
            await sleep(100); 
        }

        // TODO: make this.worker an array of workers
        this.worker.terminate();
        this.worker = null;

        this.degrade_worker.terminate();
        this.degrade_worker = null;
    }

    async stop() {
        if(!this.running) {
            return; 
        }
        this.running = false;
    }

}
