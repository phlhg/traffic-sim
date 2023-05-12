import { length } from "../../map/utils";

export default class Individual {
    constructor(path, prbl) {

        //console.log(path.length)
        this.cities = path.length;
        this.path = [...path];
        this.mut_prbl = 0.75;
        this.mutate()

        this.mut_prbl = prbl
        this.fitness = length(path)

        this.crossSize = Math.floor(this.cities/2)

    }

    /**
     * Simply swaps to random indices by a certain probability and reevaluates 
     * the fitness value. The function is called recursively to allow for more 
     * mutations.
     * 
     * Updates:
     * @param this.path and @param this.fitness
     */
    mutate() {
        
        if (Math.random() < this.mut_prbl) {
            let i = Math.floor(Math.random() * this.cities)
            let j = Math.floor(Math.random() * this.cities)

            let temp = this.path[i]
            this.path[i] = this.path[j]
            this.path[j] = temp

            this.fitness = length(this.path)

            // to allow for bigger mutations
            // maybe should limit depth
            this.mutate()
        }
    }

    /**
     * Given two individuals copies a pathsegment from ind2 to ind1 
     * 
     * @param {*} ind1 
     * @param {*} ind2 
     */
    static crossover(ind1, ind2) {
        let i = Math.floor(Math.random() * this.cities)
        let j = i + Math.floor(Math.random() * this.crossSize)


        // we prbl should first align the sequence but it aint working
        /*
        while (ind1.path[i] != ind2.path[i]) {
            a = ind1.path.shift()
            ind1.path.push(a)
        }
        */    
        
        // insert path segment
        var before = []
        for (let size = 0; size < j; size++) {
            before.push(ind1.path[(size+i)%this.cities])
            ind1.path[(size+i) % this.cities] = ind2.path[(size+i) % this.cities]
        }

        // fix stuff
        for (let index = 0; index < this.cities; index++) {

            /**
             * make sure duplicates are removed - could prbl handle this better
             */
            if (index < i || i + j <= index) {
                for (let size = 0; size < j; size ++) {
                    if (ind1.path[(size+i) % this.cities] == ind1.path[index]) {
                        ind1.path[index] = before[(size+i)% this.cities]
                    }
                }

            }
        }

        ind1.fitness = length(ind1.path)

        // add another sequence if small and lucky
        if (Math.random() < 0.75 && j < this.cities* 0.1) {
            this.crossover(ind1, ind2)
        }
    }

}