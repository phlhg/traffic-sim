import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting } from "../settings";

export default class SimpleAnt extends Method {

    constructor(...data) {
        super(...data);

        this.worker = null;

        this.name = "SimpleAnts";
        this.description = "Simple ANT implementation";

        this.addSetting("num_ants", SliderSetting, { 
            name: "Ants",
            min: 1, max: 100, value: 10
        });

        this.addSetting("max_duration", SliderSetting, {
            name: "Time limit",
            min: 1, max: 60, value: 10, step: 1,
            formatter: v => { return `${v}s`}
        })

        this.addSetting("amount_subtract", SliderSetting, {
            name: "Pheromone degradation",
            min: -20, max: 3, value: -7, step: 1,
            formatter: v => { return v == 0 ? `1` : `10<sup>${v}</sup>`}
        })

        this.done = false;

    }

    async run() {

        let cities = Object.values(this.app.map.nodes).map(n => n.getObj());

        this.done = false;

        this.worker = WorkerManager.get("simpleant");

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {

            if(e.data.hasOwnProperty("progress")){
                this.setProgress(e.data.progress);

                this.app.map.resetWeights();
                Object.keys(e.data.pheromones).forEach(p => {
                    let pp = p.split(',');
                    this.app.map.getEdge({ id: parseInt(pp[0]) },{ id: parseInt(pp[1]) }).setWeight(e.data.pheromones[p]);
                });

                return;
            }

            
            let perm = e.data.value;
            this.addScore(e.data.score);

            this.app.map.resetOptimum();
            for(let i = 0; i < perm.length; i++) {
                this.app.map.getEdge(perm[i],perm[(i+1)%perm.length]).setActive();
            }

            if(e.data.done) { 
                let perm = e.data.value;
                this.app.map.resetOptimum();
                this.app.map.resetWeights();
                for(let i = 0; i < perm.length; i++) {
                    this.app.map.getEdge(perm[i],perm[(i+1)%perm.length]).setActive().setWeight(1);
                }
                this.done = true; 
            }
        }

        // Start worker by posting the message with the cities
        this.worker.postMessage({
            // make copy of cities to prevent user writing into it during execution
            cities: [...cities],
            num_ants: this.getSetting("num_ants"),
            max_duration: this.getSetting("max_duration"),
            amount_subtract: Math.pow(10,this.getSetting("amount_subtract"))
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
