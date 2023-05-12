import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting } from "../settings";

export default class Genetic extends Method {

    constructor(...data) {
        super(...data);

        this.worker = null;

        this.name = "GeneticAlgorithm";
        this.description = "Path optimization using a variation of genetic algorithm";

        this.addSetting("population", SliderSetting, { 
            name: "Population",
            min: 1, max: 250, value: 10
        });

        this.addSetting("generations", SliderSetting, {
            name: "How many generations",
            min: 1, max: 2000, value: 100, step: 1
        })

        this.addSetting("mutation", SliderSetting, {
            name: "Mutation Probability",
            min: 0, max: 1, value: 0.2, step: 0.01,
        })

        this.done = false;

    }

    async run() {

        let cities = Object.values(this.app.map.nodes).map(n => n.getObj());

        this.done = false;

        this.worker = WorkerManager.get("genetic");

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {

            if(this.done){ return; }

            if(e.data.hasOwnProperty("progress")){
                this.setProgress(e.data.progress);

                this.app.map.resetWeights();
                Object.keys(e.data.pheromones).forEach(p => {
                    let pp = p.split(',');
                    this.app.map.getEdge({ id: parseInt(pp[0]) },{ id: parseInt(pp[1]) })?.setWeight(e.data.pheromones[p]);
                });

                return;
            }

            
            let perm = e.data.value;
            this.addScore(e.data.score);

            this.app.map.resetOptimum();
            for(let i = 0; i < perm.length; i++) {
                this.app.map.getEdge(perm[i],perm[(i+1)%perm.length])?.setActive();
            }

            if(e.data.done) { 
                let perm = e.data.value;
                this.app.map.resetOptimum();
                this.app.map.resetWeights();
                for(let i = 0; i < perm.length; i++) {
                    this.app.map.getEdge(perm[i],perm[(i+1)%perm.length])?.setActive().setWeight(1);
                }
                this.done = true; 
            }
        }

        // Start worker by posting the message with the cities
        this.worker.postMessage({
            // make copy of cities to prevent user writing into it during execution
            cities: [...cities],
            population: this.getSetting("population"),
            generations: this.getSetting("generations"),
            mutation: this.getSetting("mutation")
        });

        while(!this.done) { await sleep(100); }

        // TODO: make this.worker an array of workers
        this.worker.terminate();
        this.worker = null;
    }

    async stop() {
        this.done = true;
    }

    slider(val) {
        this.NUM_ANTS = val
        console.log("val", val)
    }

}
