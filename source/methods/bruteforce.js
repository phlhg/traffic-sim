import { permute, sleep } from "../utils";
import Message from "../utils/message";
import Method from "./method"

function calcWeight(path){

    var weight = 0;
    for(let i = 0; i < path.length; i++){
        let a = path[i];
        let b = path[(i+1)%path.length]
        weight += Math.sqrt(
            Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2)
        );
    }

    return weight;

}

export default class Bruteforce extends Method {

    constructor(...data){

        super(...data);

        this.name = "Bruteforce";
        this.description = "Naive approach to solving the Travelling Salesmen Problem by simply iterating over all possible paths and selecting the path with minimal cost."

    }


    async run(){

        if(this.app.map.cities.length > 10){
            // TODO: Try to mitigate with Web Workers?
            Message.warning("Bruteforce shouldn't be used with more than 10 cities, since it could crash the browser.");
            return; 
        }

        if(this.running){ return; }
        this.running = true;

        var opt = Infinity;
        var opt_perm = [];
    
        var perm_gen = permute([...this.app.map.cities])
        var perm = perm_gen.next();
    
        while(!perm.done){
            var w = calcWeight(perm.value);
    
            if(w < opt){
                opt = w;
                opt_perm = perm.value;
    
                this.app.map.roads = [];
                for(let i = 0; i < opt_perm.length; i++){
                    this.app.map.addRoad(opt_perm[i],opt_perm[(i+1)%opt_perm.length])
                }
                
                this.app.map.draw();
    
                await sleep(100);
            }
    
            perm = perm_gen.next();
        }

        this.running = false;

    }

}