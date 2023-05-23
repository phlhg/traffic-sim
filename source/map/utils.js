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

    Object.values(map.nodes).forEach(n => {
        distance[n.id] = Infinity;
        previous[n.id] = null;
        queue.push(n);
    });

    distance[source.id] = 0;

    while(queue.length > 0){ //nodes_done.length < limit){
        // Get node with smallest distance in queue and remove it from queue
        queue = queue.sort((a,b) => { return distance[a.id] - distance[b.id]; })
        let u = queue.shift();

        // Iterate over all neighbours still in queue
        for(let v of map.getNeighbours(u)){
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
    for(let node of nodes_done){

        if(node.id == source.id){ continue; } // Don't include path to source

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

/**
 * Calculates the traffic on each edge inplace
 * @param {Map} map - A map object
 * @param {number} limit - The maximal amount of djikstra iterations 
 * @returns {Map} - Returns the map object with calculated traffic
 */
export function calculateTraffic(map, limit){

    map.forEdges(e => { e.traffic = 0; })

    for(let source of Object.values(map.nodes)){

        let paths = shortestPaths(map, source, limit);
        let population = Object.keys(paths).map(id => map.nodes[id].data.size).reduce((a,b) => a + b);
        let fraction = source.data.size / population; 

        for(let target_id of Object.keys(paths)){

            let target = map.nodes[target_id];
            let path = paths[target_id];

            for(let i = 0; i < path.length - 1; i++){
                let edge = map.getEdge(path[i], path[i+1])
                edge.traffic += target.data.size * fraction;
            }

        }

        map.update();

    }

    return map;

}

