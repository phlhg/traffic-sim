import { permute, sleep } from "../utils";
import Message from "../utils/message";
import Method from "./method"

export default class Bruteforce extends Method {

    constructor(...data){

        super(...data);

        this.worker = null;

        this.name = "Bruteforce";
        this.description = "Naive approach to solving the Travelling Salesmen Problem by simply iterating over all possible paths and selecting the path with minimal cost."

    }


    async run(){

        let m = null;

        if(this.app.map.cities.length > 10){
            m = Message.warning("Bruteforce with more than 10 cities will take some time", -1);
            //return; 
        }

        if(this.running){ return; }
        this.running = true;

        this.worker = new Worker('/js/workers/bruteforce.js');

        this.worker.onmessage = e => {
            let perm = e.data.value;
            this.app.map.roads = [];
            for(let i = 0; i < perm.length; i++){
                this.app.map.addRoad(perm[i],perm[(i+1)%perm.length])
            }
            this.app.map.draw();

            if(e.data.done){ this.running = false; }
        }

        this.worker.postMessage({cities: [...this.app.map.cities]});

        while(this.running){ await sleep(100); }

        this.worker.terminate();
        this.worker = null;

        if(m !== null){ m.hide(); }

    }

    async stop(){

        if(!this.running){ return; }
        this.running = false;
        
    }

}