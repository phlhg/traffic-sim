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
     * @returns {boolean} Returns true on success, false otherwise
     */
    setWeight(w){
        this.weight = w;
        this.update();
        return true;
    }

    /** Updates the SVG element */
    update(){
        this.dom.line.style.stroke = `rgba(255,255,255,${255*this.weight})`;
    }

}