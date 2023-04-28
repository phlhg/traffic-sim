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

    async __run(){

        if(Object.values(this.app.map.nodes).length > 9){ Message.warning("Bruteforce with more than 9 cities will take some time"); }

        this.done = false;

        let worker = WorkerManager.get("bruteforce");

        worker.onmessage = e => {

            if(e.data.hasOwnProperty("progress")){
                this.setProgress(e.data.progress);
                return;
            }

            let perm = e.data.value;

            this.app.map.resetEdges();
            for(let i = 0; i < perm.length; i++){
                this.app.map.setEdge(perm[i],perm[(i+1)%perm.length])
            }

            if(e.data.done){ this.done = true; }
        }

        worker.postMessage({
            cities: Object.values(this.app.map.nodes).map(n => n.getObj())
        });

        while(!this.done){ await sleep(100); }

        worker.terminate();

    }

    async __stop(){
        this.done = true;
    }

}