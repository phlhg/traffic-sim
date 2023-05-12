import worker_bruteforce from "../methods/bruteforce/worker";
import worker_simpleant from "../methods/simpleant/worker";
import worker_genetic from "../methods/genetic/worker";
import WorkerManager from "./manager";

const manager = new WorkerManager();

// Bruteforce
manager.add("bruteforce", worker_bruteforce);

// Simpleant
manager.add("simpleant", worker_simpleant);

// Genetic
manager.add("genetic", worker_genetic);

onmessage = e => {
    manager.call(e.data.handler, e.data.data);
}