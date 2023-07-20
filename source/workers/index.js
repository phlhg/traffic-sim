import worker_bruteforce from "../methods/bruteforce/worker";
import worker_simpleant from "../methods/simpleant/worker";
import worker_genetic from "../methods/genetic/worker";
import WorkerManager from "./manager";
import worker_traffic_bruteforce from "../methods/trafficbruteforce/worker";
import worker_traffic_simpleant from "../methods/trafficant/worker"
import worker_traffic_genetic from "../methods/trafficgenetic/worker";
import worker_simulated from "../methods/simulated/worker";

const manager = new WorkerManager();

// TSP

// - Bruteforce
manager.add("bruteforce", worker_bruteforce);

// - Simulated Annealing
manager.add("simulated", worker_simulated);

// - Simpleant
manager.add("simpleant", worker_simpleant);

// - Genetic
manager.add("genetic", worker_genetic);

// Traffic

// - Bruteforce
manager.add("traffic_bruteforce", worker_traffic_bruteforce)

// - Simpleant
manager.add("traffic_simpleant", worker_traffic_simpleant)

// - GA
manager.add("traffic_genetic", worker_traffic_genetic)

onmessage = e => {
    manager.call(e.data.handler, e.data.data);
}