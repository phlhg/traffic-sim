import Graph from "../../map/graph";
import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting } from "../settings";

function *p(arr, acc, depth){
    if(depth < 1 || arr.length < 1){ 
        yield { remaining: arr, prefix: acc }; 
    } else {
        yield* p(arr.slice(1), acc, depth - 1);
        yield* p(arr.slice(1), acc.concat([arr[0]]), depth - 1);
    }
}

export default class TrafficBruteforce extends Method {

    constructor(...data){

        super(...data);

        this.name = "Bruteforce";
        this.description = "Naive approach to the Traffic Problem by iterating over all possible permutations and selecting the best."

        this.addSetting("num_workers", SliderSetting, {
            name: "Number of Workers",
            min: 0, max: 6, value: 3, 
            formatter: v => { return `${Math.pow(2, v)}`}
        })

        this.done = [];

    }

    async run(){

        this.done = false;

        this.app.problem = "traffic"

        this.app.graph.forEdges(e => { 
            e.active = true; 
            e.data.width = 0;
            e.data.weight = 0; 
            e.data.traffic = 0; 
        }); // Reset all edges

        let opt_score = Infinity;

        let edges = this.app.graph.getEdges().map(e => [e.origin, e.target]);
        let pool = Array.from(p(edges, [], this.getSetting("num_workers")));

        let workers = pool.map(i => { return WorkerManager.get("traffic_bruteforce") });
        let progress = workers.map(i => 0);
        this.done = workers.map(i => false);

        for(let i = 0; i < workers.length; i++){
            workers[i].onmessage = e => {

                if(this.done.length < 1 || this.done[i] || (e.data.done ?? false)){ 
                    this.done[i] = true; 
                    progress[i] = 1;
                    this.setProgress(progress.reduce((a,b) => a+b, 0) / progress.length);
                    return; 
                }

                if(e.data.hasOwnProperty("progress")){
                    progress[i] = e.data.progress;
                    this.setProgress(progress.reduce((a,b) => a+b, 0) / progress.length);
                    return;
                }

                if(e.data.score >= opt_score){ return; }
                opt_score = e.data.score;

                this.addScore(e.data.score);

                let graph = Graph.from(e.data.graph);
                this.app.map.update(graph);
                
            }
        }

        for(let i = 0; i < workers.length; i++){
            workers[i].postMessage({
                worker_id: i,
                graph: this.app.graph.serialize(),
                edges_prefix: pool[i].prefix,
                edges_remain: pool[i].remaining
            })
        }

        while(!this.done.reduce((a,b) => a && b, true)){ await sleep(100); }

        this.setProgress(1);

        workers.forEach(w => { w.terminate(); })

    }

    async stop(){
        this.done = [];
    }

}