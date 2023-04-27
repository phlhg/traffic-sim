import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"

export default class SimpleAnt extends Method {

    constructor(...data) {
        super(...data);

        this.worker = null;

        this.name = "SimpleAnts";
        this.description = "Simple ANT implementation";
        this.NUM_ANTS = 0
        this.done = false;

    }

    async __run() {

        let cities = Object.values(this.app.map.nodes).map(n => n.getObj());
        let pheromone_map = {};
        let NUM_ANTS = this.NUM_ANTS

        this.done = false;

        this.worker = WorkerManager.get("simpleant");
        this.degrade_worker = WorkerManager.get("simpleant-degrade");

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {
            let perm = e.data.value;

            this.app.map.resetEdges();
            for(let i = 0; i < perm.length; i++) {
                this.app.map.setEdge(perm[i],perm[(i+1)%perm.length])
            }

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
            cities: [...cities], 
            // Shared pheromones
            pheromones: pheromone_map,
            NUM_ANTS: NUM_ANTS
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

    slider(val) {
        this.NUM_ANTS = val
        console.log("val", val)
    }

}
