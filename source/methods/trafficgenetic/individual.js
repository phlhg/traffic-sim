import { calculateTraffic, isConnected } from "../../map/utils";
import Graph from "../../map/graph";

export default class Individual {
    constructor(graph, prbl) {

        this.graph = Graph.from(graph);
        this.cities = Array.from(this.graph.getNodes()).length
        //console.log(path.length)
        this.mut_prbl = 0.75;
        this.mutate()

        this.mut_prbl = prbl

        while (!isConnected(this.graph))
            this.mutate()
        this.fitness = calculateTraffic(this.graph, Infinity)


    }

    /**
     * An edge is randomly chosen and is flipped from active to !active
     * 
     * Updates:
     * @param this.graph and @param this.fitness
     */
    mutate() {
        
        if (Math.random() < this.mut_prbl) {
            let i = Math.floor(Math.random() * this.cities)
            let j = Math.floor(Math.random() * this.cities)

            if (i == j) {
                j = (j+1)%this.cities
            }

            let edge = this.graph.edges[i][j]

            edge.active = !edge.active

            // to allow for bigger mutations
            // maybe should limit depth
            this.mutate()
        }

    }

    /**
     * Given two individuals copies some edges from ind2 to ind1 
     * while ensuring connectivity
     * 
     * @param {*} ind1 
     * @param {*} ind2 
     */
    static crossover(ind1, ind2) {
        let fitness2 = calculateTraffic(ind1.graph, Infinity)
        let edges1 = ind1.graph.getEdges();
        let edges2 = ind2.graph.getEdges();
        for (let i = 0; i < Array.from(edges1).length; i++) {
            let edge1 = edges1[i]
            let edge2 = edges2[i]

            if (Math.random() < 0.5) {
                edge1.active = edge2.active
                edge1.data = {... edge2.data}
            }
        }
        while(!isConnected(ind1.graph)) {
            ind1.mutate()
        }
        ind1.fitness = calculateTraffic(ind1.graph, Infinity)
    }

}