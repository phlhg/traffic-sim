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
        let node = new Node(id, x, y, { size: size ?? 1000 });

        this.edges[id] = {};
        this.nodes[id] = node;

        Object.keys(this.nodes).map(i => parseInt(i)).forEach(n => {
            if(n == id){ return; }
            this.edges[n][id] = new Edge(n, id);
            this.edges[id][n] = new Edge(id, n);
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
                edges.push(list[id2]);
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
        if(!this.edges.hasOwnProperty(a) || !this.edges[a].hasOwnProperty(b)){ 
            console.error(`Graph: Edge ${a} -> ${b} does not exist!`);
            return null; 
        }
        return this.edges[a][b];
    }

    /** 
     * Returns the list of ids from neighbouring nodes
     * @param {number} nid The id of the node for which one wants to know the neighbours
     * @returns {number[]} The list of ids from neighbouring nodes - Returns an empty list if node has no neighbours or does not exists
     */
    getNeighbours(nid){
        if(!this.edges.hasOwnProperty(nid)){ return []; }
        return Object.keys(this.edges[nid]).filter(id => { return this.edges[nid][id].active })
    }

    /**
     * Creates a deep clone of the graph
     * @returns {Graph} Returns a new (deep) clone of the graph
     */
    clone(){

        let graph = new Graph();

        this.forNodes(node => { 
            graph.nodes[node.id] = node.clone(); 
            graph.edges[node.id] = {};
        })

        this.forEdges(edge => { 
            let clonedEdge = edge.clone();
            graph.edges[edge.origin][edge.target] = clonedEdge;
            graph.edges[edge.target][edge.origin] = clonedEdge;
        })

        return graph;

    }

}