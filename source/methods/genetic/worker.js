import { length } from "../../map/utils";
import {permute, sleep} from "../../utils"
import Individual from "./individual";

export default function worker_genetic(data) {
    var cities = data.cities;
    // Max time to run one worker in milliseconds
    var GENERATIONS = data.generations;
    var CROSSOVER = data.crossover

    var TIME_LIMIT = data.max_duration * 1000;

    // create population
    let pop = [];
    
    var perm_gen = permute(data.cities);
    var perm = perm_gen.next();
    
    let start_time = new Date().getTime();
    
    // everyone gets the same path to start
    // otherwise we run into errors with popsize > perms(path)
    for (let i = 0; i < data.population; i++) {
        pop.push(new Individual(perm.value, data.mutation, cities))
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
                Individual.crossover(pop[i], pop[index], perm_gen.length)
        }

        // mutate all 
        for (let i = 1; i < data.population; i++) {
            pop[i].mutate()
        }

        // sort and find best
        pop.sort((a, b) => (a.fitness > b.fitness)? 1 : -1)

        postMessage({
            value: pop[0].path,
            score: pop[0].fitness,
            done: false
        });

    }

    postMessage({
        value: pop[0].path,
        score: pop[0].fitness,
        done: true
    });

}
