import City from './city'

export default class Map {

    constructor(wrapper){
        this.dom = {}
        this.dom.wrapper = wrapper;
        this.dom.svg = wrapper.querySelector("svg");
        this.dom.notice = wrapper.querySelector(".notice");

        this.dom.notice.classList.add("active");

        this.cities = []
        this.best = 99999999999
        this.bestseq = []
    }

    clear() {
        this.cities = []
        this.best = 99999999999
        this.bestseq = []
        this.dom.notice.classList.add("active");
    }

    adjustSize(){
        let rect = this.dom.svg.getBoundingClientRect();
        this.dom.svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`)
    }

    addCity(x, y){
        this.cities.push(new City(x, y, 500 + Math.round(Math.random() * Math.pow(10,6))))
        this.best = 999999999999
        this.bestseq = []
        this.dom.notice.classList.remove("active");
        return this.cities[this.cities.length - 1]
    }

    draw(){
        

        this.dom.svg.innerHTML = '' // Clear svg

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

    drawEdges(c){
        // simply connect the cities
        var sum = 0;
        for(var i = 0; i < c.length; i++){
            var a = c[i];
            var b = c[(i+1)%c.length];
            var d = c[(i-1+c.length)%c.length];

            [b, d].forEach(el => {
                let d1 = Math.sqrt(Math.pow(a.x - el.x, 2) + Math.pow(a.y - el.y, 2))
                sum += d1
            });
        }

        if (sum < this.best) {
            this.best = sum;
            this.bestseq = c;

            this.dom.svg.innerHTML = '' // Clear svg
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
            
            for(var i = 0; i < this.bestseq.length; i++){
                var a = c[i];
                var b = c[(i+1)%c.length];
                var d = c[(i-1+c.length)%c.length];

                [b, d].forEach(el => {
                    let l = document.createElementNS("http://www.w3.org/2000/svg", "line")
                    l.setAttribute('x1', a.x)
                    l.setAttribute('y1', a.y)
                    l.setAttribute('x2', el.x)
                    l.setAttribute('y2', el.y)
                    l.setAttribute('class', 'road')
                    this.dom.svg.appendChild(l)
                });
            }
        }
    }

}