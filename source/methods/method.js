import { sleep } from "../utils";

export default class Method {

    constructor(app){

        this.app = app;

        this.name = "[Name]"
        this.description = "[Description]"

        this.promise = null;

        this.dom = {}
        this.running = false;
        this.progress = 0;

    }

    /** Sets up the HTML element */
    setup(){

        this.dom.wrapper = document.createElement('div');
        this.dom.wrapper.classList.add("method");

        this.dom.wrapper.innerHTML = `
            <strong>${this.name}</strong>
            <span class="description">${this.description}</span>
            <div class="progress" data-progress=""></div>
            <div class="button">Run</div>
        `;

        this.dom.button = this.dom.wrapper.querySelector(".button");
        this.dom.progress = this.dom.wrapper.querySelector(".progress");

        this.dom.button.onclick = this.toggle.bind(this);

    }

    /** Returns the HTML element for the list */
    getHTMLElement(){
        return this.dom.wrapper;
    }


    /**
     * Set the progress of the method
     * @param {*} value - A number between 0 and 1
     */
    setProgress(value){
        this.progress = value;
        this.dom.progress.style.setProperty("--progress",`${value*100}%`);
    }

    /** Reset the progress of the method to zero */
    resetProgress(){
        return this.setProgress(0);
    }

    /**
     * Internal function to run the method
     * @returns Returns a promise which resolves when the method stopped running.
     */
    async __run(){ }

    /**
     * Internal function to stop the method
     * @returns Returns a promise which resolves when the method stopped running.
     */
    async __stop(){ }

    /** 
     * Runs the method
     * @returns Returns a promise containing a bool with true for success and false for failure
     */
    async run(){
        if(this.running){ return false; }

        await this.app.controls.stopMethods();

        this.running = true;
        this.setProgress(0);

        this.dom.button.classList.add("running");

        await this.__run();

        this.dom.button.classList.remove("running");
        this.resetProgress();
        this.running = false;

        return true;
    }

    /** 
     * Stops the method
     * @returns Returns a promise containing a bool with true for success and false for failure
     */
    async stop(){
        if(!this.running){ return false; }

        await this.__stop();

        this.dom.button.classList.remove("running");
        this.resetProgress();
        this.running = false;

        return true;
    }

    /** 
     * Toggles the method between running and stopped 
     * @returns Returns a promise containing a bool with true for success and false for failure.
    */
    async toggle(){
        return (this.running ? await this.stop() : await this.run());
    }

}


