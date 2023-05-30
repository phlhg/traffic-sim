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

        this.app.problem = "traffic";

        this.app.graph.forEdges(e => { 
            e.active = false; 
            e.width = 10;
            e.traffic = 0; 
        }); // Reset all edges

        this.app.graph.forNodes(n => {
            let closest = this.app.graph.getNodes().sort((a,b) => { return dist(n,a) - dist(n,b); });
            for(let v of closest.slice(1,4)){ this.app.graph.getEdge(n.id,v.id).active = true; } 
        })

        var fitness = calculateTraffic(this.app.graph, 10);
        console.log(fitness)

        this.app.map.update();

    }

    async stop(){
        this.done = true;
    }

}