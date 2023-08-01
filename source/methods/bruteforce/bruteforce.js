import { sleep } from "../../utils";
import Message from "../../utils/message";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting, BooleanSetting } from "../settings";

export default class Bruteforce extends Method {

    constructor(...data){

        super(...data);

        this.name = "Bruteforce";
        this.description = "Naive approach - Iterate over all possible cycles and select the one with minimal cost."

        this.addSetting("max_duration", SliderSetting, {
            name: "Time limit",
            min: 0.5, max: 60, value: 5, step: 0.1,
            formatter: v => { return `${v.toFixed(1)}s`}
        })
    
        this.done = false;

    }

    async run(){

        if(this.app.graph.getNodes().length > 9){ Message.warning("Bruteforce with more than 9 cities will take some time"); }

        this.done = false;

        this.app.setProblem("tsp");

        this.app.graph.forEdges(e => { 
            e.active = 1; 
            e.data.weight = 1; 
        }); // Reset all edges

        let worker = WorkerManager.get("bruteforce");

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
        });

        while(!this.done){ await sleep(100); }

        worker.terminate();

    }

    async stop(){
        this.done = true;
    }

}