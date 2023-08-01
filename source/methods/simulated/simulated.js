import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting } from "../settings";

export default class Simulated extends Method {

    constructor(...data){

        super(...data);

        this.name = "Simulated Annealing";
        this.description = "Optimize the cycle imitating the cooldown of a material (Annealing)."

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

        this.app.setProblem("tsp")

        this.app.graph.forEdges(e => { 
            e.active = 1; 
            e.data.weight = 1; 
        }); // Reset all edges

        let worker = WorkerManager.get("simulated");

        worker.onmessage = e => {

            if(this.done){ return; }

            if(e.data.hasOwnProperty("progress")){
                this.setProgress(e.data.progress);
                return;
            }
            
            this.app.graph.forEdges(e => { e.data.weight = 0; });

            let perm = e.data.value;
            for(let i = 0; i < perm.length; i++){
                let edge = this.app.graph.getEdge(perm[i].id,perm[(i+1)%perm.length].id);
                edge.data.weight = 1;
            }

            this.addScore(e.data.score);

            if(e.data.done){ this.done = true; }

            this.app.map.update();
        }

        worker.postMessage({
            cities: this.app.graph.getNodes(),
            max_duration: this.getSetting("max_duration"),
            stepsize: this.getSetting("stepsize")
        });

        while(!this.done){ await sleep(100); }

        worker.terminate();

    }

    async stop(){
        this.done = true;
    }

}