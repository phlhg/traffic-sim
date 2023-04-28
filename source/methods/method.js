export default class Method {

    constructor(wrapper){

        /** @property {MethodWrapper} wrapper - Reference to the method wrapper */
        this.wrapper = wrapper;

        /** @property {App} app - Reference to the App object */
        this.app = this.wrapper.app;

        /** @property {string} name - Name of the method */
        this.name = "[Name]"

        /** @property {string} description - Description of the method */
        this.description = "[Description]"

        /** @property {object} settings -  */
        this.settings = {}

    }

    /**
     * Set the progress of the method
     * @param {*} value - A number between 0 and 1
     */
    setProgress(value){
        this.wrapper.setProgress(value);
    }

    /**
     * Add a score to the history
     * @param {number} value - The value to add as score
     */
    addScore(value){
        this.wrapper.addScore(value);
    }

    /**
     * Add a property to the settings
     * @param {string} name Name of the property
     * @param {Setting} type Class to initialize the property with
     * @param {object} config Object containing additional information
     */
    addSetting(name, type, config){
        this.settings[name] = new type(this.wrapper, config);
    }

    /**
     * Get the value of a settings property
     * @param {string} name Name of the property
     * @returns {*} Returns the value of the property
     */
    getSetting(name){
        return this.settings[name].value;
    }

    /**
     * Internal function to run the method
     * @returns Returns a promise which resolves when the method stopped running.
     */
    async run(){ }

    /**
     * Internal function to stop the method
     * @returns Returns a promise which resolves when the method stopped running.
     */
    async stop(){ }

}


