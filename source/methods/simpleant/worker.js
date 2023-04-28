import { length } from "../../map/utils";

// Number of ants per worker
const NUM_ANTS = 10;
// Max time to run one worker in milliseconds
const TIME_LIMIT = 10_000;

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
    let cities = data.cities;
    let pheromones = data.pheromones;

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
    while(true) {
        // Check that we still have time to do another round
        let cur_time = new Date().getTime();
        if(cur_time - start_time >= TIME_LIMIT) {
            break;
        }

        // Go through our ants
        for(let i = 0; i < NUM_ANTS; i++) {
            let next = getRandomUnvisited(cities, ants[i].visited, pheromones);
            if(next == undefined) {
                let path = ants[i].visited;
                last_complete = [...path];
                // Calculate score => shorter path == better
                let path_score = 1.0 / length(path);
                // Update pheromone path
                for(let j = 0; j < path.length; j++) {
                    let a = path[j];
                    let b = path[(j+1)%path.length];

                    pheromones[[a.id, b.id]] = (pheromones[[a.id, b.id]] ?? 0) + path_score;
                }

                if(i == 0) {
                    postMessage({
                        value: path,
                        done: false
                    });
                }

                let starting_city = cities[Math.floor(Math.random() * cities.length)];
                ants[i].visited = [{...starting_city}];
            } else {
                ants[i].visited.push(next);
            }
        }
    }

    postMessage({
        value: ants[0].visited,
        done: true
    });
}
