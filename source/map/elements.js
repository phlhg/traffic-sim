export class NodeElement {

    constructor(map, id){
        this.app = map.app;
        this.map = map;

        this.id = id;

        this.dom = {};
        this.setup();
    }

    setup(){
        this.dom.root = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.dom.title = document.createElementNS("http://www.w3.org/2000/svg", "title");

        this.dom.root.classList.add(`city`);
        this.dom.root.appendChild(this.dom.title);

        this.dom.root.onmousedown = e => {
            this.map.dragging.id = this.id;
            this.map.dragging.init_x = e.clientX;
            this.map.dragging.init_y = e.clientY;
            this.dom.root.classList.add(`dragging`);
            this.map.editor.hide();
            e.stopPropagation();
        }

    }

    update(maxSize){

        let node = this.app.graph.getNode(this.id);

        this.dom.root.setAttribute('cx', node.x)
        this.dom.root.setAttribute('cy', node.y)

        this.dom.root.setAttribute('r', 3 + 12 * (node.data.size / maxSize))

        this.dom.title.innerHTML = `Node: ${node.id}\nPopulation: ${node.data.size.toLocaleString('de-CH')}`

    }

    remove(){
        this.dom.root.remove();
    }

    get(){
        return this.dom.root;
    }

}

export class EdgeElement {

    constructor(map, origin, target){
        this.app = map.app;
        this.map = map;

        this.origin = origin;
        this.target = target;

        this.dom = {}
        this.setup();
    }

    setup(){
        this.dom.root = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.dom.title = document.createElementNS("http://www.w3.org/2000/svg", "title");

        this.dom.root.setAttribute('class', 'road');
        this.dom.root.appendChild(this.dom.title);
    }

    update(maxTraffic){

        let edge = this.app.graph.getEdge(this.origin, this.target);
        let origin = edge.getOrigin();
        let target = edge.getTarget();

        this.dom.root.setAttribute('x1', origin.x)
        this.dom.root.setAttribute('y1', origin.y)
        this.dom.root.setAttribute('x2', target.x)
        this.dom.root.setAttribute('y2', target.y)

        if(this.app.problem == 'tsp'){
            // TSP
            this.dom.root.style.opacity = edge.data.weight;
            this.dom.root.style.strokeWidth = 2;
            this.dom.title.innerHTML = `Weight: ${edge.data.weight}`
        } else if(this.app.problem == 'traffic') {
            this.dom.root.style.opacity = edge.active ? 1 : edge.data.weight;
            this.dom.root.style.strokeWidth = 2 + 15 * edge.data.traffic / maxTraffic;
            this.dom.root.style.strokeDasharray = edge.data.weight > 0 && edge.data.traffic == 0 ? 4 : 0;
            this.dom.root.style.strokeDashoffset = edge.data.weight > 0 && edge.data.traffic == 0 ? 4 : 0;
            this.dom.title.innerHTML = `Traffic: ${edge.data.traffic.toLocaleString()}`
        } else {
            this.dom.root.style.opacity = edge.active ? 1 : 0;
            this.dom.root.style.strokeWidth = 1;
            this.dom.title.innerHTML = ``
        }

    }

    remove(){
        this.dom.root.remove();
    }

    get(){
        return this.dom.root;
    }

}