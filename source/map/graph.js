import Edge from './edge';
import Node from './node'

/** Object representing a graph with nodes and edges */
export default class Graph {

    constructor(){
        this.nodes = {};
        this.edges = [];
    }

    /** Clears the graph */
    clear() {
        this.nodes = {}
        this.edges = []
    }

    /**
     * Adds a new node to the graph.
     * @param {number} x The internal x-coordinate of the new node
     * @param {number} y The internal y-coordinate of the new node
     * @param {number} [size] The size of the new node (otpional)
     * @returns {Node} The object of the new node
     */
    addNode(x, y, size){
        let id = Object.keys(this.nodes).length;
        let node = new Node(this, id, x, y);
        node.data.size = size ?? 1000;

        this.edges[id] = {};
        this.nodes[id] = node;

        Object.keys(this.nodes).map(i => parseInt(i)).forEach(n => {
            if(n == id){ return; }
            let edge = new Edge(this, n, id);
            this.edges[n][id] = edge;
            this.edges[id][n] = edge;
        });

        return node;
    }

    /** 
     * Get all nodes contained in the graph 
     * @returns {Node[]} An array of nodes
    */
    getNodes(){
        return Object.values(this.nodes);
    }

    /** 
     * Get all edges contained in the graph 
     * @returns {Edge[]} An array of edges
    */
    getEdges(){
        let edges = [];
        Object.keys(this.edges).forEach(id1 => {
            let list = this.edges[id1];
            Object.keys(list).forEach(id2 => {
                if(id1 >= id2){ return; }
                edges.push(this.edges[id1][id2]);
            })
        })
        return edges;
    }

    /** 
     * Runs a function over all edges
     * @param {Function} process - Function, which takes an edge as an argument
     */
    forEdges(process){
        this.getEdges().forEach(e => process(e))
    }

    /** 
     * Runs a function over all nodes
     * @param {Function} process - Function, which takes a node as an argument
     */
    forNodes(process){
        this.getNodes().forEach(n => process(n))
    }

    /** 
     * Get the node corresponding to an id
     * @param {number} id - Id of the node
     * @returns {Node?} The object for the node if it exists, otherwise null
     */
    getNode(id){
        if(!(id in Object.keys(this.nodes))){ return null; }
        return this.nodes[id]
    }

    /** Returns the edge between two nodes
     * @param {number} a Id of the first node
     * @param {number} b Id of the second node
     * @returns {Edge?} The object for the edge if it exists, otherwise null
     */
    getEdge(a,b){
        let c = a < b ? a : b;
        let d = a < b ? b : a;
        if(!this.edges.hasOwnProperty(c) || !this.edges[c].hasOwnProperty(d)){ 
            console.error(`Graph: Edge ${c} <-> ${d} does not exist!`);
            return null; 
        }
        return this.edges[c][d];
    }

    /** 
     * Get all edges from a node 
     * @param {number} nid Id of the node
     * @returns {Edge[]} An array of edges
    */
    getEdgesFrom(nid){
        if(!this.edges.hasOwnProperty(nid)){ return []; }
        return Object.values(this.edges[nid]).filter(e => e.active);
    }

    /** 
     * Returns the list of ids from neighbouring nodes
     * @param {number} nid The id of the node for which one wants to know the neighbours
     * @returns {number[]} The list of ids from neighbouring nodes - Returns an empty list if node has no neighbours or does not exists
     */
    getNeighbours(nid){
        return this.getEdgesFrom(nid).map(e => { return e.target == nid ? e.origin : e.target })
    }

    /** 
     * Creats an object without cyclic references from the Graph for storing.
     * @returns {Object} An object containing serialized the data of the Graph.
     */
    serialize(){
        let g = { nodes: [], edges: [] }
        this.forNodes(node => { g.nodes.push(node.serialize()) });
        this.forEdges(edge => { g.edges.push(edge.serialize()) });
        return g;
    }

    /**
     * Create a graph from a serialized one.
     * @param {object} g - The serialized data of the graph
     * @see {@link Graph.prototype.serialize()} to get serialized graph data.
     * @returns {Node} A new Graph containing the serialized data
     */
    static from(g){

        let graph = new Graph();

        g.nodes.forEach(n => {
            let node = Node.from(graph, n); 
            graph.nodes[node.id] = node;
            graph.edges[node.id] = {}
        })

        g.edges.forEach(e => {
            let edge = Edge.from(graph, e);
            graph.edges[edge.origin][edge.target] = edge;
            graph.edges[edge.target][edge.origin] = edge;
        })

        return graph;

    }

    /**
     * Creates a deep clone of the graph
     * @returns {Graph} Returns a new (deep) clone of the graph
     */
    clone(){
        return Graph.from(this.serialize());
    }

}