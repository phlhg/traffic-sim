import City from './city'

export default class Map {

    constructor(wrapper){
        this.dom = {}
        this.dom.wrapper = wrapper;
        this.dom.svg = wrapper.querySelector("svg");
        this.dom.notice = wrapper.querySelector(".notice");
        this.dom.notice.classList.add("active");

        this.cities = []
        this.roads = []

        this.clear()
    }

    clear() {
        this.cities = []
        this.roads = []
        this.draw();
        this.dom.notice.classList.add("active");
    }

    adjustSize(){
        let rect = this.dom.svg.getBoundingClientRect();
        this.dom.svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`)
    }

    addCity(x, y){
        this.cities.push(new City(x, y, 500 + Math.round(Math.random() * Math.pow(10,6))))
        this.dom.notice.classList.remove("active");
        return this.cities[this.cities.length - 1]
    }

    addRoad(a,b){
        this.roads.push([a,b]);
        this.roads.push([b,a]);
    }

    draw(){
        
        this.dom.svg.innerHTML = '' // Clear svg

        // Place roads
        for(let i = 0; i < this.roads.length; i++){

            let a = this.roads[i][0];
            let b = this.roads[i][1];

            if(a.id > b.id){

                let l = document.createElementNS("http://www.w3.org/2000/svg", "line")
                l.setAttribute('x1', a.x)
                l.setAttribute('y1', a.y)
                l.setAttribute('x2', b.x)
                l.setAttribute('y2', b.y)
                l.setAttribute('class', 'road')
                this.dom.svg.appendChild(l)

            }

        }

        // Place cities
        for(let i = 0; i < this.cities.length; i++){

            let city = this.cities[i]

            let c = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            c.setAttribute('cx', city.x)
            c.setAttribute('cy', city.y)
            c.setAttribute('r', 1 + 2*Math.log(city.size / 1000))
            c.setAttribute('class', 'city')

            let t = document.createElementNS("http://www.w3.org/2000/svg", "title")
            t.innerHTML = `Population: ${city.size.toLocaleString()}`
            c.appendChild(t)

            this.dom.svg.appendChild(c)
        }

    }

}