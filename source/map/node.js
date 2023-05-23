/** Object representing a node on the map */
export default class Node {

    /**
     * @param {number} id - The unique id of the node
     * @param {number} x - The x coordinate of the node
     * @param {number} y - The y coordinate of the node
     * @param {object} data - Additional data of the node 
     */
    constructor(id, x, y, data){

        /** @property {number} id - The unique id of the node */
        this.id = id;

        /** @property {number} x - The x coordinate of the node */
        this.x = x

        /** @property {number} y - The y coordinate of the node */
        this.y = y

        /** @property {object} data - Additional data of the node */
        this.data = data ?? {}

        /** @property {number} data.size - Size of the city */
        this.data.size = this.data.size ?? 100

        this.dom = {}
        this.setup();
    }

    setup(){
        this.dom.node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.dom.node.setAttribute('cx', this.x)
        this.dom.node.setAttribute('cy', this.y)
        // TODO: How should cities be scaled depending on the size?
        this.dom.node.setAttribute('r', this.data.size / 10)
        this.dom.node.setAttribute('class', `city`)

        this.dom.title = document.createElementNS("http://www.w3.org/2000/svg", "title")
        this.dom.title.innerHTML = `Node: ${this.id}`
        this.dom.node.appendChild(this.dom.title)
    }

    /**
     * Get the SVG element for the node.
     * @returns {SVGElement} The SVG element.
     */
    getHTMLElement(){
        return this.dom.node;
    }

    /** 
     * Returns a summary object of the node 
     * @returns {Object} An object containg id, x and y
     */
    getObj(){
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            data: this.data
        }
    }

}