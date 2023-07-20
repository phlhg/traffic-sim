import Graph from "../../map/graph";
import { calculateTraffic, isConnected } from "../../map/utils";


function getRandom(graph, pheromones) {

    do {

        let pheromax = Math.max(...Object.values(pheromones));
        let pheromin = Math.min(...Object.values(pheromones));

        graph.forEdges(edge => { 
            if(pheromones.hasOwnProperty(edge.id)){
                edge.active = (pheromones[edge.id] - pheromin) / (pheromax - pheromin) * 0.5 + 0.25 > Math.random();
            } else {
                edge.active = 0.5 > Math.random();
            }
        });
        
    } while(!isConnected(graph))

    // Graph is guaranteed to be connected now

    return graph;

}

export default function worker_traffic_simpleant(data) {
    
    var graph = Graph.from(data.graph);
    // Max time to run one worker in milliseconds
    var TIME_LIMIT = data.max_duration * 1000;
    // Number of ants per worker
    var NUM_ANTS = data.num_ants;
    // Amount to subtract from pheromones per iteration
    var SUBTRACT = data.amount_subtract;

    let pheromones = {};

    let best_graph = null;
    let best_score = Infinity;

    // create some ants, all starting at a random city
    let ants = [];
    for(let i = 0; i < NUM_ANTS; i++) {
        ants[i] = { graph: graph.clone() };
    }

    let start_time = new Date().getTime();
    let iteration = 0;

    while(true) {

        // Check that we still have time to do another round
        let cur_time = new Date().getTime();
        if(cur_time - start_time >= TIME_LIMIT) {
            console.log("TIMELIMIT DONE");
            break;
        }

        // Go through our ants
        for(let i = 0; i < NUM_ANTS; i++) {

            let next_graph = getRandom(ants[i].graph, pheromones);

            // Calculate score => shorter path == better
            let next_score = calculateTraffic(next_graph, Infinity);
            let next_iscore = 1 / next_score;

            // Update pheromone path
            next_graph.forEdges(edge => {
                pheromones[edge.id] = (pheromones[edge.id] ?? 0) + (edge.active ? 1 : 0) * next_iscore * edge.data.traffic;
            })

            if(next_score < best_score){
                best_score = next_score;
                best_graph = next_graph.clone();

                let pheromax = Math.max(...Object.values(pheromones));
                let pheromin = Math.min(...Object.values(pheromones));

                best_graph.forEdges(edge => { edge.data.weight = (pheromones[edge.id] - pheromin) / (pheromax - pheromin); });

                postMessage({
                    graph: best_graph.serialize(),
                    score: best_score,
                    pheromones: pheromones,
                    done: false
                });
            }

        }

        for(let i in pheromones) {
            if(pheromones[i] >= SUBTRACT){
                pheromones[i] -= SUBTRACT;
            }
        }

        iteration += 1;

        if(iteration % 100 == 1){
            postMessage({ 
                progress: (cur_time - start_time) / TIME_LIMIT,
                pheromones: pheromones 
            });
        }

    }

    postMessage({ 
        progress: 1,
        pheromones: pheromones 
    });

    best_graph.forEdges(edge => { edge.data.weight = 0; });

    postMessage({
        graph: best_graph.serialize(),
        score: best_score,
        pheromones: pheromones,
        done: true
    });

    console.log("worker done")
}
