import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { NumberSetting } from "../settings";

export default class SimpleAnt extends Method {

    constructor(...data) {
        super(...data);

        this.worker = null;

        this.name = "SimpleAnts";
        this.description = "Simple ANT implementation";

        this.addSetting("num_ants", NumberSetting, { 
            name: "Number of Ants",
            min: 1, max: 100, value: 10
        });

        this.addSetting("max_duration", NumberSetting, {
            name: "Time limit in seconds",
            min: 1, max: 60, value: 10, step: 1
        })

        this.done = false;

    }

    async run() {

        let cities = Object.values(this.app.map.nodes).map(n => n.getObj());

        this.done = false;

        this.worker = WorkerManager.get("simpleant");

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {
            let perm = e.data.value;

            this.app.map.resetEdges();
            for(let i = 0; i < perm.length; i++) {
                this.app.map.setEdge(perm[i],perm[(i+1)%perm.length])
            }

            if(e.data.done) { this.done = true; }
        }

        // Start worker by posting the message with the cities
        this.worker.postMessage({
            // make copy of cities to prevent user writing into it during execution
            cities: [...cities],
            num_ants: this.getSetting("num_ants"),
            max_duration: this.getSetting("max_duration")
        });

        while(!this.done) { await sleep(100); }

        // TODO: make this.worker an array of workers
        this.worker.terminate();
        this.worker = null;
    }

    async stop() {
        this.done = true;
    }

}
