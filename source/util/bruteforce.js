import {permute, sleep} from './helper'
import Map from "./../map"


export function startbrute(map) {
    let permutations = permute(map.cities)
    console.log("got perms")

    for (let i = 0; i < permutations.length; i++) {
        let c = permutations[i]

        map.drawEdges(c)

        //sleep(10)
    }
    console.log("done")
}