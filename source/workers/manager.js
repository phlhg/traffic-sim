import WorkerWrapper from "./wrapper";

export default class WorkerManager {

    constructor(){
        this.handlers = {}
    }

    add(name, callback){
        this.handlers[name] = callback;
    }

    exists(name){
        return this.handlers.hasOwnProperty(name);
    }

    call(name, data){
        if(!this.exists(name)){ console.error(`Unknown worker handler ${name}`); return; }
        this.handlers[name](data); 
    }

    static get(name){
        return new WorkerWrapper(name);
    }

}