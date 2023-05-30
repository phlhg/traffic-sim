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
 * Get the shortest paths between two nodes
 * @param {Graph} graph - The graph object
 * @param {Node} origin - The start of the path
 * @param {number} limit - Maximal amount of iterations
 * @returns {Object.<number, Nodes[]>} - An object containing the shortest path for each node reached below the limit
 */
export function shortestPaths(graph, source, limit){

    limit = limit ?? Infinity;

    let queue = [];
    let distance = {};
    let previous = {};
    let nodes_done = [];

    graph.forNodes(n => {
        distance[n.id] = Infinity;
        previous[n.id] = null;
        queue.push(n.id);
    });

    distance[source] = 0;

    // dijkstra with limit
    while(queue.length > 0 && nodes_done.length < limit){
        // Get node with smallest distance in queue and remove it from queue
        queue = queue.sort((a,b) => { return distance[a] - distance[b]; })
        let u = graph.getNode(queue.shift());

        // Iterate over all neighbours still in queue
        for(let v of graph.getNeighbours(u.id).map(i => graph.getNode(i))){
            let d = distance[u.id] + dist(u,v);
            if(d >= distance[v.id]){ continue } // Check if new distance is smaller
            distance[v.id] = d;
            previous[v.id] = u.id;
        }

        nodes_done.push(u.id);

    }

    // Generate paths from previous
    let paths = {}
    for(let nid of nodes_done){

        if(nid == source){ continue; } // Don't include path to source

        paths[nid] = [];
        let last = nid

        while(previous[last] !== null){
            paths[nid].push(last);
            last = previous[last];
        }

        paths[nid].push(source)
        paths[nid].reverse();

    }

    return paths;

}

/**
 * Calculates the traffic on each ACTIVE edge inplace
 * @param {Graph} graph - A graph object
 * @param {number} limit - The maximal amount of djikstra iterations 
 * @param {number} CONST_EDGE_COST - The cost an edge costs
 * @param {number} CONST_FAILURE_COST - The cost for STAU
 * @returns {number} sum - Returns the fitness function
 */
export function calculateTraffic(graph, limit, CONST_EDGE_COST=1, CONST_FAILURE_COST=10){

    // reset traffic
    graph.forEdges(e => { e.traffic = 0; })

    // iterate over all nodes
    for(let source of graph.getNodes()){

        // sum up all endpoints sizes of cities and calculate fraction of
        // source city given this population sum
        let paths = shortestPaths(graph, source.id, limit);
        let population = Object.keys(paths).map(id => graph.getNode(id).data.size).reduce((a,b) => a + b);
        let fraction = source.data.size / population; 

        for(let target_id of Object.keys(paths)){

            let target = graph.getNode(target_id);
            let path = paths[target_id];

            for(let i = 0; i < path.length - 1; i++){
                let edge = graph.getEdge(path[i], path[i+1])
                edge.traffic += (target.data.size * fraction) 
            }
        }
    }
    
    var sum = 0

    graph.forEdges( e => {
        if(!e.active) { return }
        let distance = dist(graph.getNode(e.origin), graph.getNode(e.target))
        sum += CONST_EDGE_COST + e.width*distance/100 + e.traffic/10000
        
        // check if street is enough for traffic
        let t = graph.getNode(e.target).data.size
        let o = graph.getNode(e.origin).data.size
        if (e.traffic > (t+o)*e.width)
            sum += CONST_FAILURE_COST

    });

    return sum;

}

