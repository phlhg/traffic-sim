/** Object representing a node on the graph */
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

    }

    /**
     * Clones the node
     * @returns {Node} Returns a new clone of the node
     */
    clone(){ 
        return Object.assign(new Node(), this); 
    }

}