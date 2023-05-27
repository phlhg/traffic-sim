import { calculateTraffic, dist } from "../../map/utils";
import Method from "../method"

export default class Test extends Method {

    constructor(...data){

        super(...data);

        this.name = "Test";
        this.description = "Testing traffic modelling"

        this.done = false;

    }

    async run(){

        this.done = true;

        this.app.map.forEdges(e => { 
            e.active = 0; 
            e.weight = 1; 
            e.traffic = 0; 
        }); // Reset all edges

        this.app.map.forNodes(n => {
            let closest = Object.values(this.app.map.nodes).sort((a,b) => { return dist(n,a) - dist(n,b); });
            for(let v of closest.slice(1,4)){ this.app.map.getEdge(n,v).active = 1; this.app.map.getEdge(n,v).width = 10;}
        })


        var fitness = calculateTraffic(this.app.map, 10);
        console.log(fitness)

        this.app.map.update();

    }

    async stop(){
        this.done = true;
    }

}