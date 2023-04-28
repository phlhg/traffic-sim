/**
 * Calculate the euclidian length of a path 
 * @param {Node[]} path - An array of nodes
 * @returns {number} - The lenght of the path
 */
export function length(path){
    var len = 0;
    for(let i = 0; i < path.length; i++){
        let a = path[i];
        let b = path[(i+1)%path.length]
        len += Math.sqrt(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2));
    }
    return len;
}
