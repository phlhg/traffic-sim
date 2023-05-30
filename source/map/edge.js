/** Object representing an edge on the graph */
export default class Edge {

    /**
     * @param {number} origin - The id of node at the origin
     * @param {number} target - The id of node at the target
     */
    constructor(origin, target){

        /** @property {number} origin - The id of the node at the origin */
        this.origin = origin;

        /** @property {number} origin - The id of node at the traget */
        this.target = target;

        /** @property {number} weight - The weight between 0 and 1 of the edge */
        this.weight = 0;

        /** @property {number} traffic - Amount of traffic flowing trough the edge */
        this.traffic = 0;

        /** @property {number} width - Amount of traffic the edge is able to handle */
        this.width = 0;

        /** @property {boolean} active - Indicates if the egde can be used */
        this.active = false;
        
    }

    /**
     * Set the weight of the edge.
     * @param {number} w Weight between 0 and 1
     * @returns {Edge} Returns the edge for chaining
     */
    setWeight(w){
        this.weight = w;
        return this;
    }

    /**
     * Sets the membership of the edge to the optimum
     * @param {boolean} state True if part of the optimum, false otherwise (Default: true)
     * @returns {Edge} Returns the edge for chaining
     */
    setActive(state){
        this.active = state ?? true;
        return this;
    }

    /** 
     * Clones the edge
     * @returns {Edge} Returns a new clone of the edge
     */
    clone(){
        return Object.assign(new Edge(), this);
    }

}