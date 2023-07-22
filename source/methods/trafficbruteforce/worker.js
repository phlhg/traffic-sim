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

export default function worker_traffic_bruteforce(data){
    var TIME_LIMIT = data.max_duration * 1000;

    let start_time = new Date().getTime();

    let graph = Graph.from(data.graph);
    let worker_id = data.worker_id;

    let edges_prefix = data.edges_prefix;
    let edges_remain = data.edges_remain;

    let opt = Infinity;

    let perm_gen = p(edges_remain, edges_prefix);
    let perm = perm_gen.next();
    
    let progress_max = Math.floor(Math.pow(2, edges_remain.length));
    let progress_cnt = 0;

    progress_cnt += worker_id;

    while(!perm.done){

        let cur_time = new Date().getTime();
        let T = cur_time - start_time;
        if(T >= TIME_LIMIT) {
            console.log("TIMELIMIT DONE")
            break;
        }

        graph.forEdges(e => { e.active = false; })
        perm.value.forEach(e => { graph.getEdge(e[0],e[1]).active = true; })

        if(isConnected(graph)){ // Enforce point-to-point connectivity

            let w = calculateTraffic(graph, Infinity);

            if(w < opt){
                opt = w;
                postMessage({ graph: graph.serialize(), score: opt });
            }

        }

        perm = perm_gen.next();

        progress_cnt++;

        if(progress_cnt % 100 == 0){ 
            postMessage({ progress: Math.min(1, progress_cnt / progress_max)});
        }

    }

    postMessage({ done: true });

} 