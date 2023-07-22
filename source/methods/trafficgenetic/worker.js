import Individual from "./individual";
import Graph from "../../map/graph"
import { calculateTraffic, isConnected } from "../../map/utils";

export default function worker_traffic_genetic(data) {

    // Max time to run one worker in milliseconds
    var GENERATIONS = data.generations;
    var CROSSOVER = data.crossover
    var TIME_LIMIT = data.max_duration * 1000;

    // create population
    let pop = [];
    
    let start_time = new Date().getTime();

    // everyone gets the same path to start
    // otherwise we run into errors with popsize > perms(path)
    for (let i = 0; i < data.population; i++) {
        pop.push(new Individual(data.graph, data.mutation))
    }

    pop.sort((a, b) => (a.fitness > b.fitness)? 1 : -1)

    for (let i = 0; i < GENERATIONS; i++) {

        let cur_time = new Date().getTime();
        let T = cur_time - start_time;
        if(T >= TIME_LIMIT) {
            console.log("TIMELIMIT DONE")
            break;
        }

        /**
         * for each individual choose one of the best individuals and cross them
         * to create a new individual
         */
        for (let i = 1; i < data.population; i++) {
            let index = i;
            while (index == i)
                index = Math.floor(Math.random() * data.population/4);

            if (CROSSOVER) 
                Individual.crossover(pop[i], pop[index])
            
        }

        // mutate all 
        for (let i = 1; i < data.population; i++) {
            pop[i].mutate()

            while(!isConnected(pop[i].graph))
                pop[i].mutate()
            
            pop[i].fitness = calculateTraffic(pop[i].graph)

        }

        // sort and find best
        pop.sort((a, b) => (a.fitness > b.fitness)? 1 : -1)

        postMessage({
            graph: pop[0].graph.serialize(),
            score: pop[0].fitness,
            done: false
        });

    }

    postMessage({
        graph: pop[0].graph.serialize(),
        score: pop[0].fitness,
        done: true
    });

}
