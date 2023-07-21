import { sleep } from "../../utils";
import WorkerManager from "../../workers/manager";
import Method from "../method"
import { SliderSetting, BooleanSetting } from "../settings";
import Graph from "../../map/graph";

export default class TrafficGenetic extends Method {

    constructor(...data) {
        super(...data);

        this.worker = null;

        this.name = "GeneticAlgorithm";
        this.description = "Traffic optimization using a variation of genetic algorithm";

        this.addSetting("population", SliderSetting, { 
            name: "Population",
            min: 1, max: 2500, value: 100
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

        this.done = false;

    }

    async run() {

        this.done = false;

        this.app.setProblem("traffic");

        this.app.graph.forEdges(e => { 
            e.active = true; 
            e.data.width = 0;
            e.data.weight = 0; 
            e.data.traffic = 0; 
        }); // Reset all edges

        this.worker = WorkerManager.get("traffic_genetic");
        let opt_score = Infinity;

        // callback function, "status", e.g the current permutation
        this.worker.onmessage = e => {

            if(this.done){ return; }

            if (opt_score > e.data.score) {
                let graph = Graph.from(e.data.graph);
                this.addScore(e.data.score);
                this.app.map.update(graph);
                opt_score = e.data.score;
            }

            if(e.data.done) { this.done = true; }

        }

        // Start worker by posting the message with the cities
        this.worker.postMessage({
            // make copy of cities to prevent user writing into it during execution
            graph: this.app.graph.serialize(),
            population: this.getSetting("population"),
            generations: this.getSetting("generations"),
            mutation: this.getSetting("mutation"),
            crossover: this.getSetting("crossover")
        });

        while(!this.done) { await sleep(100); }

        this.worker.terminate();
        this.worker = null;
    }

    async stop() {
        this.done = true;
    }

}
