/**
 * Calculate the euclidian distance between two nodes
 * @param {*} a - The first node
 * @param {*} b - The second node
 * @returns {number} - The distance between the nodes
 */
export function dist(a, b){
    return Math.sqrt(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2));
}


/**
 * Calculate the euclidian length of a path 
 * @param {Node[]} path - An array of nodes
 * @returns {number} - The lenght of the path
 */
export function length(path){
    var len = 0;
    for(let i = 0; i < path.length; i++){
        len += dist(path[i], path[(i+1)%path.length])
    }
    return len;
}

/**
 * Get the shorttest path between two nodes
 * @param {Map} map - The map object
 * @param {Node} origin - The start of the path
 * @param {number} limit - Maximal amount of iterations
 * @returns {Object.<number, Nodes[]>} - An object containing the shortest path for each node reached below the limit
 */
export function shortestPaths(map, source, limit){

    limit = limit ?? Infinity;

    let queue = [];
    let distance = {};
    let previous = {};
    let nodes_done = [];

    Object.entries(map.nodes).forEach(n => {
        distance[n.id] = Infinity;
        previous[n.id] = null;
        queue.push(n);
    });

    state[source.id].distance = 0;

    while(queue.length > 0 && nodes_done.length < limit){
        // Get node with smallest distance in queue and remove it from queue
        queue = queue.sort(a,b => { return distance[a.id] - distance[b.id]; })
        let u = this.nodes[queue.shift()];

        // Iterate over all neighbours still in queue
        for(let v in map.getNeighbours(u)){
            if(!queue.includes(v.id)){ continue; }
            let e = map.getEdge(u, v);
            let d = distance[u.id] + e.distance;
            if(d < distance[v.id]){ // Check if new distance is smaller
                distance[v.id] = d;
                previous[v.id] = u;
            }
        }

        nodes_done.push(u);

    }

    // Generate paths from previous
    let paths = {}
    for(let node in nodes_done){

        paths[node.id] = [];
        let last = node

        while(previous[last.id] != null){
            paths[node.id].push(last);
            last = previous[last.id];
        }

        paths[node.id].push(source)
        paths[node.id].reverse();

    }

    return paths;

}
