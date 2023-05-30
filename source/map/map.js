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

        this.adjustSize();
        this.setEvents();
    }

    setEvents(){

        window.addEventListener("resize", this.adjustSize.bind(this));

        this.dom.svg.addEventListener("click", (e) => {
            let coords = this.translateCoordinates(e.clientX, e.clientY);
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

    }

    /** Resets the map */
    reset(){
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
     * Updates the map with an optional new graph
     * @param {Graph} [graph] - The new graph (optional)
     */
    update(graph){

        this.app.graph = graph ?? this.app.graph

        if(this.app.graph === null){ return; }

        if(Object.keys(this.app.graph.nodes).length > 0){ this.dom.notice.classList.remove("active"); }

        // Update all nodes
        this.app.graph.forNodes(node => {

            // Create node element if does not exist yet
            if(!this.nodes.hasOwnProperty(node.id)){

                this.nodes[node.id] = {
                    main: document.createElementNS("http://www.w3.org/2000/svg", "circle"),
                    title: document.createElementNS("http://www.w3.org/2000/svg", "title")
                }

                this.nodes[node.id].main.setAttribute('class', `city`);
                this.nodes[node.id].main.appendChild(this.nodes[node.id].title);

                this.dom.svg_nodes.appendChild(this.nodes[node.id].main);

            }

            let element = this.nodes[node.id].main;
            let title = this.nodes[node.id].title

            element.setAttribute('cx', node.x)
            element.setAttribute('cy', node.y)

            // TODO: How should cities be scaled depending on the size?
            element.setAttribute('r', 2 + (node.data.size / 1_000_000) * 13)

            title.innerHTML = `Node: ${node.id}\nPopulation: ${node.data.size.toLocaleString('de-CH')}`

        })

        // Remove unused nodes
        let map_nodes = this.app.graph.getNodes().map(n => n.id);
        Object.keys(this.nodes).forEach(nid => {
            if(map_nodes.includes(parseInt(nid))){ return; }
            this.nodes[nid].main.remove();
            delete this.nodes[nid];
        })

        // Update all edges
        this.app.graph.forEdges(edge => {

            let key = `${edge.origin}-${edge.target}`

            // Create edge element if does not exist yet
            if(!this.edges.hasOwnProperty(key)){
                this.edges[key] = {
                    main: document.createElementNS("http://www.w3.org/2000/svg", "path"),
                    title: document.createElementNS("http://www.w3.org/2000/svg", "title")
                }

                this.edges[key].main.setAttribute('class', 'road');
                this.edges[key].main.appendChild(this.edges[key].title);

                this.dom.svg_edges.appendChild(this.edges[key].main);
            }

            let element = this.edges[key].main;
            let title = this.edges[key].title;

            let origin = this.app.graph.getNode(edge.origin);
            let target = this.app.graph.getNode(edge.target);

            let delta = { x: target.x - origin.x,  y: target.y - origin.y }

            if(this.app.problem == 'traffic') {
                element.setAttribute('d', `M ${origin.x} ${origin.y} Q ${origin.x + delta.x/2 + delta.y/8} ${origin.y + delta.y/2 + delta.x/8}, ${target.x} ${target.y}`)
            } else {
                element.setAttribute('d', `M ${origin.x} ${origin.y} L ${target.x} ${target.y}`)
            }

            if(this.app.problem == 'tsp'){
                // TSP
                element.style.opacity = edge.data.weight;
                element.style.display = "block"
                element.style.strokeWidth = 2;
                title.innerHTML = `Weight: ${edge.data.weight}`
            } else if(this.app.problem == 'traffic') {
                element.style.opacity = 1
                element.style.display = edge.active ? "block" : "none";
                // TODO: How should the width grow depending on the amount of traffic?
                element.style.strokeWidth = 0.1 + (edge.data.traffic / 1_000_000) * 8
                title.innerHTML = `N${edge.origin} -> N${edge.target}\nTraffic: ${edge.data.traffic}`
            } else {
                element.style.opacity = edge.active ? 1 : 0;
                element.style.strokeWidth = 1;
                title.innerHTML = ``
            }

        })

        // Remove unused edges
        let map_edges = this.app.graph.getEdges().map(e => `${e.origin}-${e.target}`);
        Object.keys(this.edges).forEach(eid => {
            if(map_edges.includes(eid)){ return; }
            this.edges[eid].main.remove();
            delete this.edges[eid];
        })

    }

}