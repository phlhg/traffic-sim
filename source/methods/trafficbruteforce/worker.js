import Graph from "../../map/graph";
import { calculateTraffic, isConnected } from "../../map/utils";

function* p(arr, acc){
    if(arr.length < 1){ 
        yield acc; 
    } else {
        yield* p(arr.slice(1), acc)
        yield* p(arr.slice(1), acc.concat([arr[0]]))
    }
}

function permute(arr){ return p(arr,[]) }

export default function worker_traffic_bruteforce(data){

    let graph = Graph.from(data.graph);
    let worker_cnt = data.worker_cnt;
    let worker_id = data.worker_id;

    let opt = Infinity;

    let edges = graph.getEdges().map(e => [e.origin, e.target]);

    let perm_gen = permute(edges);
    let perm = perm_gen.next();
    
    let progress_max = Math.floor(Math.pow(2, edges.length) / worker_cnt);
    let progress_cnt = 0;

    for(let i = 0; i < worker_id; i++){ perm = perm_gen.next(); } // Skip permutations handled by other workers

    progress_cnt += worker_id;

    while(!perm.done){

        graph.forEdges(e => { e.active = false; })
        perm.value.forEach(e => { graph.getEdge(e[0],e[1]).active = true; })

        if(isConnected(graph)){ // Enforce point-to-point connectivity

            let w = calculateTraffic(graph, Infinity);

            if(w < opt){
                opt = w;
                postMessage({ graph: graph.serialize(), score: opt });
            }

        }

        for(let i = 0; i < worker_cnt; i++){ perm = perm_gen.next(); } // Skip permutations handled by other workers

        progress_cnt++;

        if(progress_cnt % 100 == worker_id){
            postMessage({ progress: Math.min(1, progress_cnt / progress_max)});
        }

    }

    postMessage({ done: true });

} 