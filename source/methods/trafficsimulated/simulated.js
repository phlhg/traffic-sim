import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting } from "../settings";
import Graph from "../../map/graph"

export default class TrafficSimulated extends Method {

    constructor(...data){

        super(...data);

        this.name = "Simulated Annealing";
        this.description = "Simulated Annealing approach to solving the Traveling Salesmen Problem."

        this.done = false;        
        
        this.addSetting("max_duration", SliderSetting, {
            name: "Time limit",
            min: 0.5, max: 60, value: 5, step: 0.1,
            formatter: v => { return `${v.toFixed(1)}s`}
        })

        this.addSetting("stepsize", SliderSetting, {
            name: "Stepsize",
            min: 1, max: 60, value: 5, step: 1,
            formatter: v => { return `${v.toFixed(1)} swaps`}
        })
    }

    async run(){

        this.done = false;

        this.app.problem = "traffic"

        this.app.graph.forEdges(e => { 
            e.active = true; 
            e.data.width = 0;
            e.data.weight = 0; 
            e.data.traffic = 0; 
        }); // Reset all edges

        let worker = WorkerManager.get("traffic_simulated");
        let opt_score = Infinity;

        worker.onmessage = e => {

            if(this.done){ return; }

            if (opt_score > e.data.score) {
                let graph = Graph.from(e.data.graph);
                this.addScore(e.data.score);
                this.app.map.update(graph);
                opt_score = e.data.score;
            }

            if(e.data.done) { this.done = true; }

        }

        worker.postMessage({
            graph: this.app.graph.serialize(),
            max_duration: this.getSetting("max_duration"),
            stepsize: this.getSetting("stepsize")
        });

        while(!this.done){ await sleep(100); }

        worker.terminate();
        this.worker = null;

    }

    async stop(){
        this.done = true;
    }

}