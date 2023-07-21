import Editor from "./editor";
import { EdgeElement, NodeElement } from "./elements";
import Graph from "./graph";

export default class Map {

    constructor(app, wrapper){

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
        this.edges = {};

        this.size = 0;
        this.scale = 1;
        this.pos = {}
        this.pos.width = this.size;
        this.pos.height = this.size;
        this.pos.left = - this.pos.width / 2
        this.pos.top = - this.pos.height / 2

        this.dragging = {};
        this.dragging.id = null;
        this.dragging.init_x = 0;
        this.dragging.init_y = 0;

        this.editor = new Editor(this);
        this.dom.wrapper.appendChild(this.editor.get())

        this.adjustSize();
        this.setEvents();
    }

    setEvents(){

        window.addEventListener("resize", this.adjustSize.bind(this));

        this.dom.svg.addEventListener("mousedown", (e) => {
            if(this.editor.id !== null){ this.editor.hide(); return; }
            let coords = this.getMapCoordinates(e.clientX, e.clientY);
            this.app.graph.addNode(coords.x, coords.y, Math.round(100 + Math.random() * 1_000_000));
            this.update();
            e.preventDefault();
        })

        this.dom.svg.addEventListener("wheel", e => {
            this.zoom(e.deltaY < 0 ? -1 : 1);
            e.preventDefault();
        });

        this.dom.action_clear.addEventListener("click", async e => {
            await this.app.controls.stopMethods();
            this.reset();
            e.preventDefault();
        })

        this.dom.action_random_interval = -1;

        this.dom.action_random.onmousedown = async e => {
            clearInterval(this.dom.action_random_interval);
            this.app.graph.addNode(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.round(100 + Math.random() * 1_000_000))
            this.update();
            this.dom.action_random_interval = setInterval(() => { 
                this.app.graph.addNode(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.round(100 + Math.random() * 1_000_000)) 
                this.update()
            },200)
        }
        this.dom.action_random.ontouchstart = this.dom.action_random.onmousedown;

        this.dom.action_random.onmouseup = async e => {
            clearInterval(this.dom.action_random_interval);
        }
        
        this.dom.action_random.ontouchend = this.dom.action_random.onmouseup;
        this.dom.action_random.ontouchcancel = this.dom.action_random.onmouseup;

        // Dragging

        this.dom.svg.onmousemove = e => {
            if(this.dragging.id == null){ return; }
            let coords = this.getMapCoordinates(e.clientX, e.clientY);
            let node = this.app.graph.getNode(this.dragging.id);
            node.x = coords.x;
            node.y = coords.y;
            this.update();
            e.stopPropagation();
        }

        this.dom.svg.onmouseup = e => {
            if(this.dragging.id == null){ return; }
            let dist = Math.sqrt(Math.pow(e.clientX - this.dragging.init_x, 2) + Math.pow(e.clientY - this.dragging.init_y, 2));
            if(dist <= 20){ this.editor.show(this.dragging.id); }
            this.nodes[this.dragging.id].dom.root.classList.remove(`dragging`);
            this.dragging.id = null;
            e.stopPropagation();
        }

        this.dom.svg.onmouseleave = this.dom.svg.onmouseup;

    }

    /** Resets the map */
    reset(){
        this.editor.hide();
        this.update(new Graph());
        this.scale = 1;
        this.adjustSize();
        this.dom.notice.classList.add("active");
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

        this.editor.update();
    }

    zoom(direction){
        if(Object.values(this.nodes).length <= 0){ return; }
        this.scale = this.scale * (direction < 0 ? 0.8 : 1.25);
        this.scale = Math.max(0.2, this.scale);
        this.scale = Math.min(2, this.scale);
        this.adjustSize();
    }

    /**
     * Transform the document coordinates to map coordinates
     * @param {number} x The document x-coordinate (e.g. `e.clientX`)
     * @param {number} y The document x-coordinate (e.g. `e.clientY`)
     * @returns {object} An object containing the internal x & y coordinates
     */
    getMapCoordinates(x,y){
        let rect = this.dom.svg.getBoundingClientRect();
        return {
            x: (x - rect.left) / rect.width * this.pos.width + this.pos.left, 
            y: (y - rect.top) / rect.height * this.pos.height + this.pos.top
        }
    }

    /**
     * Transform the map coordinates to document coordinates
     * @param {number} x The map x-coordinate (e.g. `node.x`)
     * @param {number} y The map x-coordinate (e.g. `node.y`)
     * @returns {object} An object containing the internal x & y coordinates
     */
    getDocumentCoordinates(x,y){
        let rect = this.dom.svg.getBoundingClientRect();
        return {
            x: (x - this.pos.left) / this.pos.width * rect.width + rect.left,
            y: (y - this.pos.top) / this.pos.height * rect.height + rect.top
        }
    }

    /**
     * Updates the map with an optional new graph
     * @param {Graph} [graph] - The new graph (optional)
     */
    update(graph){

        this.app.graph = graph ?? this.app.graph

        localStorage.setItem("graph", JSON.stringify(this.app.graph.serialize()))

        if(this.app.graph === null){ return; }

        this.dom.notice.classList.toggle("active", this.app.graph.getNodes().length <= 0);

        let maxSize = Math.max(...this.app.graph.getNodes().map(n => n.data.size));

        // Update all nodes
        this.app.graph.forNodes(node => {

            // Create node element if does not exist yet
            if(!this.nodes.hasOwnProperty(node.id)){
                this.nodes[node.id] = new NodeElement(this, node.id);
                this.dom.svg_nodes.appendChild(this.nodes[node.id].get());
            }

            this.nodes[node.id].update(maxSize);

        })

        // Remove unused nodes
        let map_nodes = this.app.graph.getNodes().map(n => n.id);
        Object.keys(this.nodes).forEach(nid => {
            if(map_nodes.includes(parseInt(nid))){ return; }
            this.nodes[nid].remove();
            delete this.nodes[nid];
        })

        let maxTraffic = Math.max(...this.app.graph.getEdges().map(e => e.data.traffic));

        // Update all edges
        this.app.graph.forEdges(edge => {

            let key = `${edge.origin}-${edge.target}`

            // Create edge element if does not exist yet
            if(!this.edges.hasOwnProperty(key)){
                this.edges[key] = new EdgeElement(this, edge.origin, edge.target)
                this.dom.svg_edges.appendChild(this.edges[key].get());
            }

            this.edges[key].update(maxTraffic);

        })

        // Remove unused edges
        let map_edges = this.app.graph.getEdges().map(e => `${e.origin}-${e.target}`);
        Object.keys(this.edges).forEach(eid => {
            if(map_edges.includes(eid)){ return; }
            this.edges[eid].remove();
            delete this.edges[eid];
        })

    }

}