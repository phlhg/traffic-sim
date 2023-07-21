export default class WorkerWrapper {

    constructor(handler){

        this.handler = handler;
        this.onmessage = (e) => {}

        this.worker = new Worker(`/js/worker.js?nocache=${Date.now()}`);
        this.worker.onmessage = e => { this.onmessage(e); }

    }

    postMessage(data){
        this.worker.postMessage({
            "handler": this.handler,
            "data": data
        })
    }

    terminate(){
        this.worker.terminate();
    }

    static get(handler){
        return new MWorker(handler);
    }

}