/** Object representing an edge on the map */
export default class Edge {

    /**
     * @param {Node} origin - The node at the origin
     * @param {Node} target - The node at the target
     */
    constructor(origin, target){

        /** @property {Node} origin - The node at the origin */
        this.origin = origin;

        /** @property {Node} origin - The node at the traget */
        this.target = target;

        /** @property {number} weight - The weight between 0 and 1 of the edge */
        this.weight = 0;

        /** @property {boolean} active - Indicates if the edge is part of the optimum */
        this.active = false;

        this.dom = {}
        this.setup();

    }

    setup(){
        this.dom.line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        this.dom.line.setAttribute('x1', this.origin.x)
        this.dom.line.setAttribute('y1', this.origin.y)
        this.dom.line.setAttribute('x2', this.target.x)
        this.dom.line.setAttribute('y2', this.target.y)
        this.dom.line.setAttribute('class', 'road')
        this.update();
    }

    /**
     * Get the SVG element for the edge.
     * @returns {SVGElement} The SVG element.
     */
    getHTMLElement(){
        return this.dom.line;
    }

    /**
     * Set the weight of the edge.
     * @param {number} w Weight between 0 and 1
     * @returns {Edge} Returns the edge for chaining
     */
    setWeight(w){
        this.weight = w;
        this.update();
        return this;
    }

    /**
     * Sets the membership of the edge to the optimum
     * @param {boolean} state True if part of the optimum, false otherwise (Default: true)
     * @returns {Edge} Returns the edge for chaining
     */
    setActive(state){
        this.active = state ?? true;
        this.update();
        return this;
    }

    /** Updates the SVG element */
    update(){
        this.dom.line.style.opacity = this.active ? 1 : this.weight;
        this.dom.line.style.strokeWidth = this.active ? 4 : 2;
    }

}