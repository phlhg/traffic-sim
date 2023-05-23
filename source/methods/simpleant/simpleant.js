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
            min: 1, max: 250, value: 10
        });

        this.addSetting("max_duration", SliderSetting, {
            name: "Time limit",
            min: 0.5, max: 60, value: 10, step: 0.1,
            formatter: v => { return `${v.toFixed(1)}s`}
        })

        this.addSetting("amount_subtract", SliderSetting, {
            name: "Pheromone degradation",
            min: -20, max: 3, value: -7, step: 0.1,
            formatter: v => { return v == 0 ? `1` : `10<sup>${v}</sup>`}
        })

        this.done = false;

    }

    async run() {

        this.done = false;

        this.worker = WorkerManager.get("simpleant");

        this.app.map.forEdges(e => { 
            e.active = 1; 
            e.weight = 0; 
            e.traffic = 2000; 
        }); // Reset all edges

        let perm = null;

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {

            if(this.done){ return; }

            if(e.data.hasOwnProperty("progress")){
                this.setProgress(e.data.progress);
            } else {
                perm = e.data.value;
                this.addScore(e.data.score);
            }

            let max = Math.max(...Object.values(e.data.pheromones)); // normalize pheromones with maximum

            this.app.map.forEdges(e => { e.weight = 0; });
            Object.keys(e.data.pheromones).forEach(p => {
                let pp = p.split(',');
                let edge = this.app.map.getEdge({ id: parseInt(pp[0]) },{ id: parseInt(pp[1]) })
                edge.weight = (e.data.pheromones[p] / max) * 0.6;
            });

            if(e.data?.done) {
                this.app.map.forEdges(e => { e.weight = 0; }); 
                this.done = true; 
            }
            
            for(let i = 0; i < perm.length; i++) {
                this.app.map.getEdge(perm[i],perm[(i+1)%perm.length]).weight = 1;
            }
            this.app.map.update();
        }

        // Start worker by posting the message with the cities
        this.worker.postMessage({
            // make copy of cities to prevent user writing into it during execution
            cities: Object.values(this.app.map.nodes).map(n => n.getObj()),
            num_ants: this.getSetting("num_ants"),
            max_duration: this.getSetting("max_duration"),
            amount_subtract: Math.pow(10,this.getSetting("amount_subtract"))
        });

        while(!this.done) { await sleep(100); }

        this.worker.terminate();
        this.worker = null;
    }

    async stop() {
        this.done = true;
    }

}
