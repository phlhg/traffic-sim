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

        /** @property {boolean} active - Indicates if the egde can be used */
        this.active = false;

        /** @property {object} data - Object containing addtional data about the edge */
        this.data = {}

        /** @property {number} data.weight - The weight between 0 and 1 of the edge */
        this.data.weight = 0;

        /** @property {number} data.traffic - Amount of traffic flowing trough the edge */
        this.data.traffic = 0;

        /** @property {number} data.width - Amount of traffic the edge is able to handle */
        this.data.width = 0;
        
    }

    /** 
     * Clones the edge
     * @returns {Edge} Returns a new clone of the edge
     */
    clone(){
        return Object.assign(new Edge(), this);
    }

}