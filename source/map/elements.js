export class NodeElement {

    constructor(map, id){
        this.app = map.app;
        this.map = map;

        this.id = id;
        this.dragging = false;

        this.dom = {};
        this.setup();
    }

    setup(){
        this.dom.root = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.dom.title = document.createElementNS("http://www.w3.org/2000/svg", "title");

        this.dom.root.classList.add(`city`);
        this.dom.root.appendChild(this.dom.title);

        this.dom.root.onclick = e => { e.stopPropagation(); }

        this.dom.root.onmousedown = e => {
            this.dragging = true;
            this.dom.root.classList.add(`dragging`);
            e.stopPropagation();
        }

        this.dom.root.onmousemove = e => {
            if(!this.dragging){ return; }
            let coords = this.map.translateCoordinates(e.clientX, e.clientY);
            let node = this.app.graph.getNode(this.id);
            node.x = coords.x;
            node.y = coords.y;
            this.map.update();
            e.stopPropagation();
        }

        this.dom.root.onmouseup = e => {
            this.dragging = false;
            this.dom.root.classList.remove(`dragging`);
            e.stopPropagation();
        }

        this.dom.root.onmouseleave = this.dom.root.onmouseup;

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
            this.dom.root.style.opacity = edge.active ? 1 : 0;
            this.dom.root.style.strokeWidth = 0.01 + 15 * edge.data.traffic / maxTraffic;
            this.dom.title.innerHTML = `Traffic: ${edge.data.traffic}`
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