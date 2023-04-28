import worker_bruteforce from "../methods/bruteforce/worker";
import worker_simpleant from "../methods/simpleant/worker";
import WorkerManager from "./manager";

const manager = new WorkerManager();

// Bruteforce
manager.add("bruteforce", worker_bruteforce);

// Simpleant
manager.add("simpleant", worker_simpleant);

onmessage = e => {
    manager.call(e.data.handler, e.data.data);
}