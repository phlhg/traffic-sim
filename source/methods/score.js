class ScoreItem {

    constructor(value){
        this.value = value;
        this.time = Date.now();
    }

}

export default class Score {

    constructor(wrapper){

        this.wrapper = wrapper;
        this.app = this.wrapper.app;

        this.scores = []

        this.dom = {}
        this.setup();

    }

    setup(){
        this.dom.svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        this.dom.svg.setAttribute('viewBox', `0 0 500 100`);
        this.dom.svg.classList.add("empty");

        this.dom.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.dom.path.setAttribute("d","");
        this.dom.path.style.fill = "none";
        this.dom.path.style.stroke = "#fff";
        this.dom.path.style.strokeWidth = "1";
        this.dom.path.style.strokeLinecap = "round";
        this.dom.svg.appendChild(this.dom.path);

    }

    
    update(){

        if(this.scores.length <= 1){ 
            this.dom.path.setAttribute("d", "");
            this.dom.svg.classList.add("empty");
            return; 
        }

        console.log(this.scores);

        this.dom.svg.classList.remove("empty");
        
        let max = Math.max(...this.scores.map(s => { return s.value }))
        let min = Math.min(...this.scores.map(s => { return s.value }))

        let end = this.wrapper.timeEnd >= 0 ? this.wrapper.timeEnd : Date.now();
        let start = this.scores[0].time;

        let scalingX = end - start > 0 ? 500 / (end - start) : 0;
        let scalingY = max - min > 0 ? 100 / (max - min) : 0;

        var d = `M ${(this.scores[0].time - start)*scalingX} ${(max - this.scores[0].value)*scalingY} `;

        for(let i = 1; i < this.scores.length; i++){
            d += `L ${(this.scores[i].time - start)*scalingX} ${(max - this.scores[i-1].value)*scalingY} `
            d += `L ${(this.scores[i].time - start)*scalingX} ${(max - this.scores[i].value)*scalingY} `
        }

        d += `L ${(end - start)*scalingX} ${(max - this.scores[this.scores.length-1].value)*scalingY}`

        this.dom.path.setAttribute("d", d);

    }

    add(value){
        this.scores.push(new ScoreItem(value));
        this.update();
    }

    reset(){
        this.scores = [];
        this.update();
    }


    getHTMLElement(){
        return this.dom.svg;
    }



}