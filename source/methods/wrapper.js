export default class MethodWrapper {

    constructor(app,method){

        this.app = app;
        this.method = new method(this.app);

        this.dom = {}

        this.setup();

    }

    setup(){

        this.dom.wrapper = document.createElement('div');
        this.dom.wrapper.classList.add("method");

        this.dom.wrapper.innerHTML = `
            <strong>${this.method.name}</strong>
            <span class="description">${this.method.description}</span>
            <div class="progress" data-progress=""></div>
            <div class="button">Run</div>
        `;

        this.dom.button = this.dom.wrapper.querySelector(".button");
        this.dom.progress = this.dom.wrapper.querySelector(".progress");

        this.dom.button.onclick = () => { this.method.toggle(); }

        this.method.onupdate = this.update.bind(this);

    }

    update(){
        this.dom.progress.style.setProperty("--progress",`${this.method.progress*100}%`);
        this.dom.button.classList.toggle("running", this.method.running);
    }

    getHTMLElement(){
        return this.dom.wrapper;
    }

}