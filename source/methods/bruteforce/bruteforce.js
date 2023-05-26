import { sleep } from "../../utils";
import Message from "../../utils/message";
import WorkerManager from "../../workers/manager";
import Method from "../method"

export default class Bruteforce extends Method {

    constructor(...data){

        super(...data);

        this.name = "Bruteforce";
        this.description = "Naive approach to solving the Travelling Salesmen Problem by simply iterating over all possible paths and selecting the path with minimal cost."

        this.done = false;

    }

    async run(){

        if(Object.values(this.app.map.nodes).length > 9){ Message.warning("Bruteforce with more than 9 cities will take some time"); }

        this.done = false;

        this.app.map.forEdges(e => { 
            e.active = 0; 
            e.weight = 0; 
            e.traffic = 2000; 
        }); // Reset all edges

        let worker = WorkerManager.get("bruteforce");

        worker.onmessage = e => {

            if(this.done){ return; }

            if(e.data.hasOwnProperty("progress")){
                this.setProgress(e.data.progress);
                return;
            }
            
            this.app.map.forEdges(e => { e.weight = 0; e.active=0});

            let perm = e.data.value;
            for(let i = 0; i < perm.length; i++){
                let edge = this.app.map.getEdge(perm[i],perm[(i+1)%perm.length]);
                edge.weight = 1;
                edge.active = 1;
            }
            
            this.app.map.update();

            this.addScore(e.data.score);

            if(e.data.done){ this.done = true; }
        }

        worker.postMessage({
            cities: Object.values(this.app.map.nodes).map(n => n.getObj())
        });

        while(!this.done){ await sleep(100); }

        worker.terminate();

    }

    async stop(){
        this.done = true;
    }

}