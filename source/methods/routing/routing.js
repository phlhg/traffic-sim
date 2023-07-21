import { calculateTraffic, dist } from "../../map/utils";
import Method from "../method"
import { SliderSetting } from "../settings";

export default class Routing extends Method {

    constructor(...data){

        super(...data);

        this.name = "Routing";
        this.description = "Connects close cities and calculates the traffic to visualize used the routing."

        this.addSetting("sp_limit", SliderSetting, {
            name: "Shortest Path Limit",
            min: 2, max: 101, value: 10, step: 1,
            formatter: v => { return v == 101 ? `None` : `${v}`}
        })

        this.addSetting("connectivity", SliderSetting, {
            name: "Connectivity",
            min: 2, max: 20, value: 4, step: 1,
        })

        this.done = false;

    }

    async run(){

        this.done = true;

        this.app.setProblem("traffic");

        this.app.graph.forEdges(e => { 
            e.active = false; 
            e.data.width = 10;
            e.data.traffic = 0; 
        }); // Reset all edges

        this.app.graph.forNodes(n => {
            let closest = this.app.graph.getNodes().sort((a,b) => { return dist(n,a) - dist(n,b); });
            for(let v of closest.slice(1,this.getSetting("connectivity"))){ this.app.graph.getEdge(n.id,v.id).active = true; } 
        })

        let limit = this.getSetting("sp_limit") == 101 ? Infinity : this.getSetting("sp_limit");
        var fitness = calculateTraffic(this.app.graph, limit);
        console.log(fitness)

        this.app.map.update();

    }

    async stop(){
        this.done = true;
    }

}