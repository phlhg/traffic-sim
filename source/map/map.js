import Edge from './edge';
import Node from './node'

export default class Map {

    constructor(app,wrapper){
        this.app = app;

        this.dom = {}
        this.dom.wrapper = wrapper;

        this.dom.wrapper.innerHTML = `
            <div class="actions">
                <span class="material-symbols-outlined random" title="Add new cities randomly" >shuffle</span>
                <span class="material-symbols-outlined clear" title="Clear map and remove all cities" >delete</span>
            </div>
            <svg viewBox="0 0 1000 1000" >
                <g class="edges"></g>
                <g class="nodes"></g>
            </svg>
            <span class="notice active">Click to add cities</span>
        `

        this.dom.svg = this.dom.wrapper.querySelector("svg");
        this.dom.notice = this.dom.wrapper.querySelector(".notice");
        this.dom.svg_nodes = this.dom.svg.querySelector(".nodes");
        this.dom.svg_edges = this.dom.svg.querySelector(".edges");

        this.dom.actions = this.dom.wrapper.querySelector(".actions");
        this.dom.action_random = this.dom.actions.querySelector(".random");
        this.dom.action_clear = this.dom.actions.querySelector(".clear");

        this.nodes = {};
        this.edges = [];

        this.size = 0;
        this.scale = 1;
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
            e.preventDefault();
        })

        this.dom.svg.addEventListener("wheel", e => {
            this.zoom(e.deltaY < 0 ? -1 : 1);
            e.preventDefault();
        });

        this.dom.action_clear.addEventListener("click", async e => {
            await this.app.controls.stopMethods();
            this.clear()
            e.preventDefault();
        })

        this.dom.action_random_interval = -1;

        this.dom.action_random.onmousedown = async e => {
            clearInterval(this.dom.action_random_interval);
            this.addRandom(1);
            this.dom.action_random_interval = setInterval(() => { this.addRandom(1); },200)
        }
        this.dom.action_random.ontouchstart = this.dom.action_random.onmousedown;

        this.dom.action_random.onmouseup = async e => {
            clearInterval(this.dom.action_random_interval);
        }
        this.dom.action_random.ontouchend = this.dom.action_random.onmouseup;
        this.dom.action_random.ontouchcancel = this.dom.action_random.onmouseup;

    }

    /** Clears & resets the map */
    clear() {
        this.nodes = {}
        this.edges = []
        this.dom.svg_nodes.innerHTML = '';
        this.dom.svg_edges.innerHTML = '';
        this.scale = 1;
        this.adjustSize();
        this.dom.notice.classList.add("active");
    }

    addRandom(n){
        for(let i = 0; i < n; i++){
            this.addNode(Math.random() * 1000 - 500, Math.random() * 1000 - 500)
        }
    }

    /** Adjusts the map viewport to the current window size */
    adjustSize(){
        let rect = this.dom.svg.getBoundingClientRect();

        this.size = Math.min(rect.width, rect.height) * (1200 / Math.pow(rect.width * rect.height,0.5)) * this.scale;

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

    zoom(direction){
        if(Object.values(this.nodes).length <= 0){ return; }
        this.scale = this.scale * (direction < 0 ? 0.8 : 1.25);
        this.scale = Math.max(0.2, this.scale);
        this.scale = Math.min(2, this.scale);
        this.adjustSize();
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
        let node = new Node(id, x, y, { size: Math.round(100 + Math.random() * 1_000_000) });
        this.dom.svg_nodes.appendChild(node.getHTMLElement());

        this.edges[id] = {};

        Object.values(this.nodes).forEach(n => {
            let edge = new Edge(n, node);
            this.edges[n.id][id] = edge;
            this.edges[id][n.id] = edge;
            this.dom.svg_edges.appendChild(edge.getHTMLElement());
        });

        this.nodes[id] = node;

        this.dom.notice.classList.remove("active");

        return node;
    }

    update(){
        this.forEdges(e => { e.update() });
    }

    /**
     * Runs a function over all edges
     * @param {Function} fn - Function, which takes an edge as an argument
     */
    forEdges(callback){
        Object.keys(this.edges).forEach(id1 => {
            let list = this.edges[id1];
            Object.keys(list).forEach(id2 => {
                if(id1 >= id2){ return; }
                let edge = this.edges[id1][id2]; 
                callback(edge);
            })
        })
    }

    /**
     * Runs a function over all nodes
     * @param {Function} fn - Function, which takes a node as an argument
     */
    forNodes(fn){
        Object.values(this.nodes).forEach(n => { fn(n); })
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
            console.error(`Map: Edge ${c.id} <-> ${d.id} does not exist!`);
            return null; 
        }
        return this.edges[c.id][d.id];
    }

    /**
     * Returns the neighbouring nodes
     * @param {Node} node The node for which one wants to know the neighbours
     * @returns {Node[]} The list of neighbouring nodes - Returns an empty list if node has no neighbours or does not exists
     */
    getNeighbours(node){
        if(!this.edges.hasOwnProperty(node.id)){ return []; }
        return Object.keys(this.edges[node.id]).filter(id => {
            return this.edges[node.id][id].active
        }).map(id => {
            return this.nodes[id]
        });
    }

}