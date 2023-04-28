import Edge from './edge';
import Node from './node'

export default class Map {

    constructor(app,wrapper){
        this.app = app;

        this.dom = {}
        this.dom.wrapper = wrapper;
        this.dom.svg = wrapper.querySelector("svg");
        this.dom.notice = wrapper.querySelector(".notice");
        this.dom.notice.classList.add("active");

        this.dom.svg.innerHTML = `<g class="edges"></g><g class="nodes"></g>`
        this.dom.svg_nodes = this.dom.svg.querySelector(".nodes");
        this.dom.svg_edges = this.dom.svg.querySelector(".edges");

        this.nodes = {};
        this.edges = [];

        this.size = 1200;
        this.pos = {}
        this.pos.width = this.size;
        this.pos.height = this.size;
        this.pos.left = - this.pos.width / 2
        this.pos.top = - this.pos.height / 2

        this.adjustSize();
        this.setEvents();
        this.clear();
    }

    setEvents(){

        window.addEventListener("resize", this.adjustSize.bind(this));

        this.dom.svg.addEventListener("click", (e) => {
            let coords = this.translateCoordinates(e.clientX, e.clientY);
            this.addNode(coords.x, coords.y);
        })

    }

    /** Clears & resets the map */
    clear() {
        this.nodes = {}
        this.edges = []
        this.dom.svg_nodes.innerHTML = '';
        this.dom.svg_edges.innerHTML = '';
        this.dom.notice.classList.add("active");
    }

    /** Adjusts the map viewport to the current window size */
    adjustSize(){
        let rect = this.dom.svg.getBoundingClientRect();

        this.size = Math.min(rect.width, rect.height) * (1200 / Math.pow(rect.width * rect.height,0.5));

        if(rect.width > rect.height){
            this.pos.width = this.size * (rect.width / rect.height);
            this.pos.height = this.size;
        } else {
            this.pos.width = this.size;
            this.pos.height = this.size * (rect.height / rect.width);
        }

        this.pos.left = - this.pos.width / 2
        this.pos.top = - this.pos.height / 2

        this.dom.svg.setAttribute('viewBox', `${this.pos.left} ${this.pos.top} ${this.pos.width} ${this.pos.height}`)
    }

    /**
     * Transform the document coordinates to internal coordinates
     * @param {number} x The document x-coordinate (e.g. `e.clientX`)
     * @param {number} y The document x-coordinate (e.g. `e.clientY`)
     * @returns {object} An object containing the internal x & y coordinates
     */
    translateCoordinates(x,y){
        let rect = this.dom.svg.getBoundingClientRect();
        return {
            x: (x - rect.left) / rect.width * this.pos.width + this.pos.left, 
            y: (y - rect.top) / rect.height * this.pos.height + this.pos.top
        }
    }

    /**
     * Adds a new node to the map.
     * @param {number} x The internal x-coordinate of the new node
     * @param {number} y The internal y-coordinate of the new node
     * @returns {Node} The object of the new node
     */
    addNode(x, y){
        let id = Object.keys(this.nodes).length;
        let node = new Node(id, x, y);
        this.dom.svg_nodes.appendChild(node.getHTMLElement());

        Object.values(this.nodes).forEach(n => {
            let edge = new Edge(n, node);
            this.edges[n.id][id] = edge;
            this.dom.svg_edges.appendChild(edge.getHTMLElement());
        });
        
        this.nodes[id] = node;
        this.edges[id] = {};

        this.dom.notice.classList.remove("active");

        return node;
    }
    
    /** Resets the weight of all edges to zero */
    resetEdges(){
        Object.values(this.edges).forEach(list => {
            Object.values(list).forEach(e => { e.setWeight(0); })
        })
    }

    /**
     * Returns the edge between two nodes
     * @param {Node} a The first node
     * @param {Node} b The second node
     * @returns {Edge?} The object for the edge if it exists - null otherwise
     */
    getEdge(a,b){
        let c = a.id < b.id ? a : b;
        let d = a.id < b.id ? b : a;
        if(!this.edges.hasOwnProperty(c.id) || !this.edges[c.id].hasOwnProperty(d.id)){ 
            console.warn(`Map: Edge ${c.id} -> ${d.id} does not exist!`);
            return null; 
        }
        return this.edges[c.id][d.id];
    }
    
    /**
     * Set the weight of an edge between two nodes
     * @param {Node} a The first node
     * @param {Node} b The second node
     * @param {number} [w=1] A weight between 0 and 1
     * @return {boolean} Returns true on success, false otherwise
     */
    setEdge(a,b,w){
        let e = this.getEdge(a,b);
        if(e == null){ return false; }
        return e.setWeight(w ?? 1);
    }

    /**
     * Reset the weight of an edge between two nodes to zero
     * @param {Node} a The first node
     * @param {Node} b The second node
     * @return {boolean} Returns true on success, false otherwise
     */
    unsetEdge(a,b){
        let e = this.getEdge(a,b);
        if(e == null){ return false; }
        return e.setWeight(0);
    }

}