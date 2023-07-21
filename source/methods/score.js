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
            <div class="export" title="Run method a selected amount of times and export data for each run">
                <select></select>
                <span class="material-symbols-outlined">download</span>
            </div>
            <svg viewBox="0 0 500 100">
                <path d=""/>
            </svg>
        `
        
        this.dom.export_btn = this.dom.root.querySelector(".export > span");
        this.dom.export_select = this.dom.root.querySelector(".export > select");

        [1,2,5,10,15,20,50,100].forEach(n => {
            let o = document.createElement("option");
            o.value = n;
            o.innerText = `${n}x`
            this.dom.export_select.appendChild(o);
        })

        this.dom.svg = this.dom.root.querySelector("svg")
        this.dom.path = this.dom.root.querySelector("svg > path")

        this.dom.path.style.fill = "none";
        this.dom.path.style.stroke = "#fff";
        this.dom.path.style.strokeWidth = "1";
        this.dom.path.style.strokeLinecap = "round";

        let callback = (amount, accumulator) => {

            if(this.scores.length > 0){
                let start = this.scores[0].time
                accumulator.push([...this.scores].map(item => { return [item.time-start, item.value]; }));
            }

            if(amount > 1){
                this.wrapper.run(callback.bind(this, amount - 1, accumulator));
            } else {
                let a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([JSON.stringify(accumulator, null, 2)], { type: 'application/json' }));

                let s = new Date();
                a.setAttribute("download", `${s.getFullYear()}-${dd(s.getMonth()+1)}-${dd(s.getDate())}-${dd(s.getHours())+dd(s.getMinutes())+dd(s.getSeconds())}-data.json`)

                a.click();
            }
        }

        this.dom.export_btn.onclick = e => {
            callback.bind(this, this.dom.export_select.value, [])()
        }

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

    }

    add(value){
        this.scores.push(new ScoreItem(value));
        this.update();
    }

    reset(){
        this.scores = [];
        this.update();
    }

    download(){
        if(this.scores.length < 1){ return; }
        let start = this.scores[0].time

        let a = document.createElement("a");
        let content = this.scores.map(item => { return `${item.time-start},${item.value}\n` }).join("")
        a.href = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));

        let s = new Date(start);
        a.setAttribute("download", `${s.getFullYear()}-${dd(s.getMonth()+1)}-${dd(s.getDate())}-${dd(s.getHours())+dd(s.getMinutes())+dd(s.getSeconds())+dd(s.getMilliseconds())}-data.csv`)

        a.click();
    }

    getHTMLElement(){
        return this.dom.root;
    }

}

function dd(n){
    return ("0"+n).slice(-2)
}