import Map from "./map"
import {startbrute} from './util/bruteforce'

document.addEventListener('DOMContentLoaded', () => {


    let map = new Map(document.querySelector('svg'))
    map.adjustSize()

    window.addEventListener("resize", () => { map.adjustSize() })

    map.dom.svg.addEventListener("click", (e) => {
        map.addCity(e.clientX, e.clientY)
        map.draw()
    })

    var btn_c = document.getElementById("clear");
    var btn_brute = document.getElementById("brute");

    btn_c.addEventListener("click", () => { map.clear(); map.draw()})
    btn_brute.addEventListener("click", () => { startbrute(map) })




})