

class Map {

    constructor(svg, window, document){
        this.dom = {}
        this.dom.svg = svg

        this.document = document
        this.window = window

        this.cities = []
    }

    adjustSize(){
        this.dom.svg.setAttribute('viewBox', `0 0 ${this.window.innerWidth} ${this.window.innerHeight}`)
    }

    addCity(x, y){
        this.cities.push(new City(x, y, 500 + Math.round(Math.random() * Math.pow(10,6))))
        return this.cities[this.cities.length - 1]
    }

    draw(){
        logg();

        this.dom.svg.innerHTML = '' // Clear svg

        console.log("Hello")

        let indices = Array.from(Array(this.cities.length).keys())
        console.log(indices)



        // Place roads

        /*
        for(let i = 0; i < this.cities.length; i++){
            let a = this.cities[i]

            let closest = Array.from(Array(this.cities.length).keys()).sort((i,j) => {
                let d1 = Math.sqrt(Math.pow(a.x - this.cities[i].x, 2) + Math.pow(a.y - this.cities[i].y, 2))
                let d2 = Math.sqrt(Math.pow(a.x - this.cities[j].x, 2) + Math.pow(a.y - this.cities[j].y, 2))
                return d1 - d2
            })

            closest.slice(1, 4).forEach(j => {
                let b = this.cities[j]
                let l = document.createElementNS("http://www.w3.org/2000/svg", "line")
                l.setAttribute('x1', a.x)
                l.setAttribute('y1', a.y)
                l.setAttribute('x2', b.x)
                l.setAttribute('y2', b.y)
                l.setAttribute('class', 'road')
                this.dom.svg.appendChild(l)
            })

        }
        */

        // Place cities
        for(let i = 0; i < this.cities.length; i++){
            let city = this.cities[i]
            let c = this.document.createElementNS("http://www.w3.org/2000/svg", "circle")
            c.setAttribute('cx', city.x)
            c.setAttribute('cy', city.y)
            c.setAttribute('r', 1 + 2*Math.log(city.size / 1000))
            c.setAttribute('class', 'city')
            let t = this.document.createElementNS("http://www.w3.org/2000/svg", "title")
            t.innerHTML = `Population: ${city.size.toLocaleString()}`
            c.appendChild(t)
            this.dom.svg.appendChild(c)
        }

    }

}

class City {

    constructor(x, y, size){
        this.x = x
        this.y = y
        this.size = size
    }

}