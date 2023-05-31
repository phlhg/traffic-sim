/** Object representing a node on the graph */
export default class Node {

    /**
     * @param {Graph} graph - Reference of the graph the node belongs to
     * @param {number} id - The unique id of the node
     * @param {number} x - The x coordinate of the node
     * @param {number} y - The y coordinate of the node
     * @param {object} data - Additional data of the node 
     */
    constructor(graph, id, x, y){

        /** @property {Graph} graph - Reference of the graph the node belongs to */
        this.graph = graph;

        /** @property {number} id - The unique id of the node */
        this.id = id;

        /** @property {number} x - The x coordinate of the node */
        this.x = x

        /** @property {number} y - The y coordinate of the node */
        this.y = y

        /** @property {object} data - Additional data of the node */
        this.data = {}

        /** @property {number} data.size - Size of the city */
        this.data.size = 1000

    }

    /** 
     * Get all edges of the node
     * @returns {Edge[]} An array of edges
    */
    getEdges(){
        return this.graph.getEdges(this.id);
    }

    /** 
     * Returns the list of ids from neighbouring nodes
     * @returns {number[]} The list of ids from neighbouring nodes - Returns an empty list if node has no neighbours or does not exists
     */
    getNeighbours(){
        return this.graph.getNeighbours(this.id);
    }

    /** 
     * Creats an object without cyclic references from the node for storing.
     * @returns {Object} An object containing serialized the data of the node.
     */
    serialize(){
        let n = Object.assign({}, this);
        delete n.graph;
        return n;
    }

    /**
     * Create a node from a serialized one
     * @param {*} graph - The graph the node belongs to
     * @param {*} n - The serialized data of the node
     * @see {@link Node.prototype.serialize()} to get serialized node data.
     * @returns {Node} A new node containing the serialized data
     */
    static from(graph, n){
        let node = Object.assign(new Node(), n);
        node.graph = graph;
        return node;
    }

}