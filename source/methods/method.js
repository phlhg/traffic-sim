export default class Method {

    constructor(app){

        this.app = app;

        this.name = "[Name]"
        this.description = "[Description]"

        this.onupdate = () => {} 

        this.running = false;

        this.progress = 0;
        this.scores = [];

    }

    /** 
     * Set the running status of the method
     * @param {boolean} running - Indicates if the method is running
     */
    setRunning(running){
        this.running = running;
        this.onupdate();
    }

    /**
     * Set the progress of the method
     * @param {*} value - A number between 0 and 1
     */
    setProgress(value){
        this.progress = value;
        this.onupdate();
    }

    /** Reset the progress of the method to zero */
    resetProgress(){
        this.setProgress(0);
    }

    /**
     * Add a score to the history
     * @param {number} value - The value to add as score
     */
    addScore(value){
        this.scores.push([Date.now(), value]);
        this.onupdate();
    }

    /** Reset the score history */
    resetScore(){
        this.scores = [];
        this.onupdate();
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

        this.setRunning(true);
        this.setProgress(0);
        this.resetScore()

        await this.__run();

        this.resetProgress();
        this.setRunning(false);

        return true;
    }

    /** 
     * Stops the method
     * @returns Returns a promise containing a bool with true for success and false for failure
     */
    async stop(){
        if(!this.running){ return false; }

        await this.__stop();

        this.resetProgress();
        this.setRunning(false);

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


