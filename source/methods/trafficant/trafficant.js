import Graph from "../../map/graph";
import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting } from "../settings";

export default class TrafficAnt extends Method {

    constructor(...data){

        super(...data);

        this.name = "Ant Colony";
        this.description = "Implementation of the Ant Conolony Optimizer"

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

        this.app.problem = "traffic"

        this.worker = WorkerManager.get("traffic_simpleant");

        this.app.graph.forEdges(e => { 
            e.active = true; 
            e.data.width = 0;
            e.data.weight = 0; 
            e.data.traffic = 0; 
        }); // Reset all edges

        let opt_score = Infinity;

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {

            if(this.done || (e.data.done ?? false)){
                this.app.graph.forEdges(e => { e.data.weight = 0; }); 
                this.done = true;  
                return; 
            }

            if(e.data.hasOwnProperty("progress")){ 
                this.setProgress(e.data.progress); 
                return;
            }

            //if(e.data.score >= opt_score){ return; }
            opt_score = e.data.score;

            this.addScore(e.data.score);

            let graph = Graph.from(e.data.graph);
            this.app.map.update(graph);
        }

        // Start worker by posting the message with the cities
        this.worker.postMessage({
            graph: this.app.graph.serialize(),
            num_ants: this.getSetting("num_ants"),
            max_duration: this.getSetting("max_duration"),
            amount_subtract: Math.pow(10,this.getSetting("amount_subtract"))
        });

        while(!this.done) { await sleep(100); }

        this.setProgress(1);

        this.app.graph.forEdges(e => { e.data.weight = 0; })
        this.app.map.update();

        this.worker.terminate();
        this.worker = null;
    }

    async stop() {
        this.done = true;
    }

}