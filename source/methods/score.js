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

        this.dom.root = document.createElement("div");
        this.dom.root.classList.add("score-container");
        this.dom.root.classList.add("empty");

        this.dom.root.innerHTML = `
            <a><span class="material-symbols-outlined">download</span></a>
            <svg viewBox="0 0 500 100">
                <path d=""/>
            </svg>
        `

        this.dom.download = this.dom.root.querySelector("a");
        this.dom.svg = this.dom.root.querySelector("svg")
        this.dom.path = this.dom.root.querySelector("svg > path")

        this.dom.path.style.fill = "none";
        this.dom.path.style.stroke = "#fff";
        this.dom.path.style.strokeWidth = "1";
        this.dom.path.style.strokeLinecap = "round";

    }

    
    update(){

        if(this.scores.length <= 1){ 
            this.dom.path.setAttribute("d", "");
            this.dom.root.classList.add("empty");
            return; 
        }

        this.dom.root.classList.remove("empty");
        
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

        let content = this.scores.map(item => { return `${item.time-start},${item.value}\n` }).join("")
        this.dom.download.href = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));

        let s = new Date(start);
        this.dom.download.setAttribute("download", `${s.getFullYear()}-${dd(s.getMonth()+1)}-${dd(s.getDate())}-${dd(s.getHours())+dd(s.getMinutes())+dd(s.getSeconds())}-data.csv`)
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
        return this.dom.root;
    }

}

function dd(n){
    return ("0"+n).slice(-2)
}