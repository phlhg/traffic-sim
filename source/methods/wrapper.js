export default class MethodWrapper {

    constructor(app,method){

        this.app = app;
        this.method = new method(this);

        this.dom = {}
        this.interval = -1;

        // Status
        this.running = false;
        this.progress = 0;

        this.scores = [];

        this.timeStart = -1;
        this.timeEnd = -1;

        this.setup();

    }

    setup(){

        this.dom.wrapper = document.createElement('div');
        this.dom.wrapper.classList.add("method");

        this.dom.wrapper.innerHTML = `
            <strong>${this.method.name}</strong>
            <span class="description">${this.method.description}</span>
            <div class="progress" data-progress=""></div>
            <div class="time"></div>
            <div class="button">Run</div>
        `;

        this.dom.button = this.dom.wrapper.querySelector(".button");
        this.dom.progress = this.dom.wrapper.querySelector(".progress");
        this.dom.time = this.dom.wrapper.querySelector(".time");

        this.dom.button.onclick = () => { this.toggle(); }

    }

    update(){
        this.dom.progress.style.setProperty("--progress",`${this.progress*100}%`);
        this.dom.button.classList.toggle("running", this.running);
        this.updateTime();
    }

    updateTime(){
        if(this.timeStart < 0){ this.dom.time.innerText = ''; return; }
        let secs = (this.timeEnd >= 0 ? this.timeEnd - this.timeStart : Date.now() - this.timeStart) / 1000;
        this.dom.time.innerText = `${(Math.round(secs*100)/100).toFixed(2)}s`
    }

    getHTMLElement(){
        return this.dom.wrapper;
    }

    /**
     * Set the progress of the method
     * @param {*} value - A number between 0 and 1
     */
    setProgress(value){
        this.progress = value;
        this.update();
    }
    
    /**
     * Add a score to the history
     * @param {number} value - The value to add as score
     */
    addScore(value){
        this.scores.push([Date.now(), value]);
        this.update();
    }

    /** 
     * Runs the method
     * @returns Returns a promise containing a bool with true for success and false for failure
     */
    async run(){
        if(this.running){ return false; }

        await this.app.controls.stopMethods();

        this.running = true;
        this.progress = 0;
        this.scores = [];

        this.timeStart = Date.now();
        this.timeEnd = -1;

        this.interval = setInterval(this.updateTime.bind(this),100);
        this.update();

        await this.method.run();

        this.timeEnd = Date.now();
        this.progress = 0;
        this.running = false;

        clearInterval(this.interval);
        this.interval = null;

        this.update();

        return true;
    }

    /** 
     * Stops the method
     * @returns Returns a promise containing a bool with true for success and false for failure
     */
    async stop(){
        if(!this.running){ return false; }

        await this.method.stop();

        this.timeEnd = -1;
        this.timeStart = -1;
        this.progress = 0;
        this.running = false;

        clearInterval(this.interval);
        this.interval = null;

        this.update();

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