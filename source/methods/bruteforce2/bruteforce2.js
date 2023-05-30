import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import { SliderSetting, BooleanSetting } from "../settings";
import Method from "../method"

export default class Bruteforce2 extends Method {

    constructor(...data){

        super(...data);

        this.name = "Bruteforce";
        this.description = "Naive approach to solving the Travelling Salesmen Problem by simply iterating over all possible paths and selecting the path with minimal cost."

        this.addSetting("max_duration", SliderSetting, {
            name: "Time limit",
            min: 0.5, max: 60, value: 5, step: 0.1,
            formatter: v => { return `${v.toFixed(1)}s`}
        })

        this.done = false;

    }

    async run(){

        this.done = false;

        this.app.problem = "traffic"

        this.app.graph.forEdges(e => { 
            e.active = false; 
            e.width = 0
            e.weight = 0; 
            e.traffic = 0; 
        }); // Reset all edges

        let worker = WorkerManager.get("bruteforce2");

        worker.onmessage = e => {

            if(this.done){ return; }

            if(e.data.hasOwnProperty("progress")){
                this.setProgress(e.data.progress);
                return;
            }
            
            this.app.graph.forEdges(e => { e.width = 0; e.active=0});

            let perm = e.data.value;
            for(let i = 0; i < perm.length; i++){
                //let edge = this.app.graph.getEdge(perm[i],perm[(i+1)%perm.length]);
                //edge.weight = 1;
                //edge.active = 1;
            }
            
            this.app.map.update();

            this.addScore(e.data.score);

            if(e.data.done){ this.done = true; }
        }

        worker.postMessage({
            graph: this.app.graph,
            max_duration: this.getSetting("max_duration"),
        });

        while(!this.done){ await sleep(100); }

        worker.terminate();

    }

    async stop(){
        this.done = true;
    }

}