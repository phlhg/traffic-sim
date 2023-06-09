import { length } from "../../map/utils";

function getRandomUnvisited(cities, visited, pheromones) {
    // Make sure we have at least one unvisited city
    if(cities.length <= visited.length) {
        return undefined;
    }

    let start_id = visited[visited.length - 1].id;
    let current_x = visited[visited.length - 1].x;
    let current_y = visited[visited.length - 1].y;

    // Find all unvisited places
    let unvisited = [];
    for(let i = 0; i < cities.length; i++) {
        let is_visited = false;
        for(let j = 0; j < visited.length; j++) {
            if(visited[j].x == cities[i].x &&
                visited[j].y == cities[i].y) {
                is_visited = true;
            }
        }
        if(!is_visited) {
            unvisited.push({...cities[i]});
        }
    }

    // Weighting
    // => first calculate desirability based on distance
    let desirability = [];
    let total_desirability = 0.0;
    for(let i = 0; i < unvisited.length; i++) {
        let distance = Math.sqrt(
            Math.pow(unvisited[i].x - current_x, 2) + 
            Math.pow(unvisited[i].y - current_y, 2));
        
        // This power sets how much we prefer shorter paths
        let d = Math.pow(1.0 / distance, 2);
        // This adds the pheromone preference
        d += Math.pow(pheromones[[start_id, unvisited[i].id]] ?? 0, 6);
        d *= 1000;

        desirability.push(d);
        total_desirability += d; 
    }

    let chosen = Math.random() * total_desirability;
    for(let i = 0; i < unvisited.length; i++) {
        chosen -= desirability[i];
        if(chosen <= 0) {
            return unvisited[i];
        }
    }

    return undefined;
}

export default function worker_simpleant(data) {
    
    var cities = data.cities;
    // Max time to run one worker in milliseconds
    var TIME_LIMIT = data.max_duration * 1000;
    // Number of ants per worker
    var NUM_ANTS = data.num_ants;
    // Amount to subtract from pheromones per iteration
    var SUBTRACT = data.amount_subtract;

    let pheromones = {};

    let best_path = [];
    let best_score = Infinity;

    // create some ants, all starting at a random city
    let ants = [];
    for(let i = 0; i < NUM_ANTS; i++) {
        let starting_city = cities[Math.floor(Math.random() * cities.length)];
        ants.push({
            visited: [{...starting_city}]
        });
    }

    let last_complete = [];
    // Get the time in milliseconds
    let start_time = new Date().getTime();
    let iteration = 0;
    while(true) {
        // Check that we still have time to do another round
        let cur_time = new Date().getTime();
        if(cur_time - start_time >= TIME_LIMIT) {
            console.log("TIMELIMIT DONE")
            break;
        }

        // Go through our ants
        for(let i = 0; i < NUM_ANTS; i++) {
            let next = getRandomUnvisited(cities, ants[i].visited, pheromones);
            if(next == undefined) {
                let path = ants[i].visited;
                last_complete = [...path];
                // Calculate score => shorter path == better
                let path_len = length(path);
                let path_score = 1.0 / length(path);
                // Update pheromone path
                for(let j = 0; j < path.length; j++) {
                    let a = path[j];
                    let b = path[(j+1)%path.length];

                    pheromones[[a.id, b.id]] = (pheromones[[a.id, b.id]] ?? 0) + path_score;
                }

                if(i == 0 && path_len < best_score) {
                    best_path = path;
                    best_score = path_len
                    postMessage({
                        value: best_path,
                        score: best_score,
                        pheromones: pheromones,
                        done: false
                    });
                }

                let starting_city = cities[Math.floor(Math.random() * cities.length)];
                ants[i].visited = [{...starting_city}];
            } else {
                ants[i].visited.push(next);
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

    postMessage({
        value: best_path,
        score: best_score,
        pheromones: pheromones,
        done: true
    });
    console.log("worker done")
}
