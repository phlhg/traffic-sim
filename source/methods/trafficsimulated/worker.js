import { length } from "../../map/utils";
import { calculateTraffic, isConnected } from "../../map/utils";
import Graph from "../../map/graph";


function swap(graph, step, size) {
    
    var newgraph = Graph.from(graph.serialize())
    for (let i = 0; i < step || ! isConnected(newgraph); i++) {
        let k = Math.floor(Math.random() * size)
        let l = k
        while (l==k)
            l = Math.floor(Math.random() * size)

        let edge = newgraph.edges[k][l]
        edge.active = !edge.active

    }
    return newgraph

}

export default function worker_traffic_simulated(data){

    var TIME_LIMIT = data.max_duration * 1000;
    var stepsize = data.stepsize;

    var opt = Infinity;
    var graph = Graph.from(data.graph);
    var SIZE = graph.getNodes().length
    
    graph = swap(graph, SIZE*SIZE/2, SIZE)

    var opt_graph = graph

    let start_time = new Date().getTime();

    while(true) {
        // Check that we still have time to do another round
        let cur_time = new Date().getTime();
        let T = cur_time - start_time;
        if(T >= TIME_LIMIT) {
            console.log("TIMELIMIT DONE")
            break;
        }

        let newgraph = swap(graph, stepsize, SIZE)

        var score = calculateTraffic(newgraph, Infinity);
            
        if(score < opt){
            opt = score;
            graph = newgraph
            opt_graph = newgraph;

            postMessage({
                graph: graph.serialize(),
                score: opt,
                done: false
            });

        }
        else {

            let probability = Math.E ** (- Math.abs(score - opt) / T)
            
            // with increasing T it gets less likely
            if (Math.random() > probability) {
                graph = newgraph
            }
        }

    }

    postMessage({ progress: 1 });
    postMessage({ graph: opt_graph.serialize(), score: opt, done: true });

} 