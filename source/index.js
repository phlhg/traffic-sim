import Map from "./map"
import {startbrute} from './util/bruteforce'

document.addEventListener('DOMContentLoaded', () => {


    let map = new Map(document.querySelector('.map'))
    map.adjustSize()

    window.addEventListener("resize", () => { map.adjustSize() })

    map.dom.svg.addEventListener("click", (e) => {
        let rect = e.target.getBoundingClientRect();
        map.addCity(e.clientX - rect.left, e.clientY - rect.top)
        map.draw()
    })

    var btn_c = document.getElementById("clear");
    var btn_brute = document.getElementById("brute");

    btn_c.addEventListener("click", () => { map.clear(); map.draw()})
    btn_brute.addEventListener("click", () => { startbrute(map) })




})