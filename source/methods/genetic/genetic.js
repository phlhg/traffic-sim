import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting, BooleanSetting } from "../settings";

export default class Genetic extends Method {

    constructor(...data) {
        super(...data);

        this.worker = null;

        this.name = "GeneticAlgorithm";
        this.description = "Path optimization using a variation of genetic algorithm";

        this.addSetting("population", SliderSetting, { 
            name: "Population",
            min: 1, max: 100, value: 10
        });

        this.addSetting("generations", SliderSetting, {
            name: "How many generations",
            min: 1, max: 5000, value: 1000, step: 1
        })

        this.addSetting("mutation", SliderSetting, {
            name: "Mutation Probability",
            min: 0, max: 1, value: 0.2, step: 0.01,
        })

        this.addSetting("crossover", BooleanSetting, {
            name: "Enable Crossover", 
            value: false
        })
        
        this.addSetting("max_duration", SliderSetting, {
            name: "Time limit",
            min: 0.5, max: 60, value: 5, step: 0.1,
            formatter: v => { return `${v.toFixed(1)}s`}
        })

        this.done = false;

    }

    async run() {

        this.done = false;

        this.app.setProblem("tsp")

        this.app.graph.forEdges(e => { 
            e.active = 0; 
            e.data.weight = 0; 
            e.data.traffic = 2000; 
        }); // Reset all edges

        this.worker = WorkerManager.get("genetic");

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {

            if(this.done){ return; }

            let perm = e.data.value;
            this.addScore(e.data.score);

            this.app.graph.forEdges(e => { e.data.weight = 0; e.active=0});
            for(let i = 0; i < perm.length; i++) {
                let edge = this.app.graph.getEdge(perm[i].id,perm[(i+1)%perm.length].id)
                edge.data.weight = 1;
                edge.active = 1;
            }

            if(e.data.done) { this.done = true; }

            this.app.map.update();
        }

        // Start worker by posting the message with the cities
        this.worker.postMessage({
            // make copy of cities to prevent user writing into it during execution
            cities: this.app.graph.getNodes(),
            population: this.getSetting("population"),
            generations: this.getSetting("generations"),
            mutation: this.getSetting("mutation"),
            crossover: this.getSetting("crossover"),
            max_duration: this.getSetting("max_duration"),

        });

        let start_time = Date.now();
        let time_limit = this.getSetting("max_duration") * 1000;

        while(!this.done) { 
            await sleep(100); 
            if(Date.now() - start_time >= time_limit){ this.done = true; }
        }

        this.worker.terminate();
        this.worker = null;
    }

    async stop() {
        this.done = true;
    }


}
