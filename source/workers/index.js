import worker_bruteforce from "../methods/bruteforce/worker";
import worker_simpleant from "../methods/simpleant/worker";
import worker_genetic from "../methods/genetic/worker";
import WorkerManager from "./manager";
import worker_bruteforce2 from "../methods/bruteforce2/worker";

const manager = new WorkerManager();

// TSP

// - Bruteforce
manager.add("bruteforce", worker_bruteforce);

// - Simpleant
manager.add("simpleant", worker_simpleant);

// - Genetic
manager.add("genetic", worker_genetic);

// Traffic

// - Bruteforce
manager.add("bruteforce2", worker_bruteforce2)

onmessage = e => {
    manager.call(e.data.handler, e.data.data);
}