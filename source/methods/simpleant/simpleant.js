import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting } from "../settings";

export default class SimpleAnt extends Method {

    constructor(...data) {
        super(...data);

        this.worker = null;

        this.name = "Ant Colony";
        this.description = "Optimize the cycle using ants collaborating by leaving pheromones on the edges.";

        this.addSetting("num_ants", SliderSetting, { 
            name: "Ants",
            min: 1, max: 250, value: 10
        });

        this.addSetting("max_duration", SliderSetting, {
            name: "Time limit",
            min: 0.5, max: 60, value: 5, step: 0.1,
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

        this.app.setProblem("tsp");

        this.worker = WorkerManager.get("simpleant");

        this.app.graph.forEdges(e => { 
            e.active = true; 
            e.data.weight = 0;
        }); // Reset all edges

        let perm = null;

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {
            if(this.done){ return; }

            let pheromones = e.data.pheromones;
            let pheromax = Math.max(...Object.values(pheromones));

            // Set weights from pheromones
            this.app.graph.forEdges(e => { e.data.weight = 0; });
            Object.keys(pheromones).forEach(p => {
                let pp = p.split(',');
                this.app.graph.getEdge(pp[0],pp[1]).data.weight = (e.data.pheromones[p] / pheromax) * 0.8;
            }); 

            if(e.data.hasOwnProperty("progress")){ this.setProgress(e.data.progress); }
            if(e.data.hasOwnProperty("score")){ this.addScore(e.data.score); }
            
            perm = e.data.value ?? perm;

            if(perm === null){ this.app.map.update(); return; }

            // Clear pheromones if done
            if(e.data.done) {
                this.app.graph.forEdges(e => { e.data.weight = 0; }); 
                this.done = true; 
            }

            // Set weight of active permutation to 1
            for(let i = 0; i < perm.length; i++) {
                this.app.graph.getEdge(perm[i].id,perm[(i+1)%perm.length].id).data.weight = 1;
            }

            this.app.map.update();
        }

        // Start worker by posting the message with the cities
        this.worker.postMessage({
            // make copy of cities to prevent user writing into it during execution
            cities: this.app.graph.getNodes(),
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
