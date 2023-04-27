import { permute, sleep } from "../utils";
import Message from "../utils/message";
import Method from "./method"

export default class Bruteforce extends Method {

    constructor(...data){

        super(...data);

        this.name = "Bruteforce";
        this.description = "Naive approach to solving the Travelling Salesmen Problem by simply iterating over all possible paths and selecting the path with minimal cost."

        this.done = false;
        this.worker = null;

    }

    async __run(){

        if(this.app.map.cities.length > 9){ Message.warning("Bruteforce with more than 9 cities will take some time"); }

        this.done = false;

        this.worker = new Worker('/js/workers/bruteforce.js');

        this.worker.onmessage = e => {

            if(e.data.hasOwnProperty("progress")){
                this.setProgress(e.data.progress);
                return;
            }

            let perm = e.data.value;

            this.app.map.roads = [];
            for(let i = 0; i < perm.length; i++){
                this.app.map.addRoad(perm[i],perm[(i+1)%perm.length])
            }
            this.app.map.draw();

            if(e.data.done){ this.done = true; }
        }

        this.worker.postMessage({cities: [...this.app.map.cities]});

        while(!this.done){ await sleep(100); }

        this.worker.terminate();
        this.worker = null;

    }

    async __stop(){
        this.done = true;
    }

}