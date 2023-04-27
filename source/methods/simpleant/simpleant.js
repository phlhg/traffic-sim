import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"

export default class SimpleAnt extends Method {

    constructor(...data) {
        super(...data);

        this.worker = null;

        this.name = "SimpleAnts";
        this.description = "Simple ANT implementation";

        this.done = false;

    }

    async __run() {

        let cities = this.app.map.cities;
        let pheromone_map = {};

        this.done = false;

        this.worker = WorkerManager.get("simpleant");
        this.degrade_worker = WorkerManager.get("simpleant-degrade");

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {
            let perm = e.data.value;
            this.app.map.roads = [];
            for(let i = 0; i < perm.length; i++) {
                this.app.map.addRoad(perm[i],perm[(i+1)%perm.length])
            }
            this.app.map.draw();
            

            if(e.data.done) {
                this.done = true;
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

        while(!this.done) { await sleep(100); }

        // TODO: make this.worker an array of workers
        this.worker.terminate();
        this.worker = null;

        this.degrade_worker.terminate();
        this.degrade_worker = null;
    }

    async __stop() {
        this.done = true;
    }

}
