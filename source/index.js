import Map from "./map"

document.addEventListener('DOMContentLoaded', () => {

    let map = new Map(document.querySelector('svg'))
    map.adjustSize()

    window.addEventListener("resize", () => { map.adjustSize() })

    map.dom.svg.addEventListener("click", (e) => {
        map.addCity(e.clientX, e.clientY)
        map.draw()
    })

})