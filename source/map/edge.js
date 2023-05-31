import { dist } from './utils'

/** Object representing an edge on the graph */
export default class Edge {

    /**
     * @param {Graph} graph - Reference to the graph the edge belongs to
     * @param {number} origin - The id of node at the origin
     * @param {number} target - The id of node at the target
     */
    constructor(graph, origin, target){

        /** @property {Graph} graph - Reference to the graph the edge belongs to */
        this.graph = graph;

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
     * Gets the origin node of the egde.
     * @returns {Node} The origin node
     */
    getOrigin(){
        return this.graph.getNode(this.origin);
    }
    
    /**
     * Gets the target node of the egde.
     * @returns {Node} The target node
     */
    getTarget(){
        return this.graph.getNode(this.target);
    }

    /**
     * Calculates the euclidian distance between the origin and target node.
     * @see {@link dist()}
     * @returns {number} The distance
     */
    distance(){
        return dist(this.getOrigin(), this.getTarget());
    }

    /** 
     * Creats an object without cyclic references from the Edge for storing.
     * @returns {Object} An object containing serialized the data of the edge.
     */
    serialize(){
        let e = Object.assign({}, this);
        delete e.graph;
        return e;
    }

    /**
     * Create an Edge from a serialized one.
     * @param {*} graph - The graph the edge belongs to
     * @param {*} n - The serialized data of the edge
     * @see {@link Edge.prototype.serialize()} to get serialized edge data.
     * @returns {Node} A new edge containing the serialized data
     */
    static from(graph, e){
        let edge = Object.assign(new Edge(), e);
        edge.graph = graph;
        return edge;
    }

}