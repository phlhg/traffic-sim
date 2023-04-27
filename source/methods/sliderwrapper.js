import MethodWrapper from "./wrapper";

export default class SliderMethodWrapper extends MethodWrapper {

    setup(){

        this.dom.wrapper = document.createElement('div');
        this.dom.wrapper.classList.add("method");

        this.dom.wrapper.innerHTML = `
            <strong>${this.method.name}</strong>
            <span class="description">${this.method.description}</span>
            <div class="progress" data-progress=""></div>
            <div>
                <div class="button">Run</div>
                <div class="slidecontainer">
                    <input type="range" min="1" max="100" value="1" id="slider">
                </div>
            </div>
        `;

        this.dom.button = this.dom.wrapper.querySelector(".button");
        this.dom.progress = this.dom.wrapper.querySelector(".progress");
        this.dom.slider = this.dom.wrapper.querySelector(".slidecontainer").firstChild.nextSibling;

        console.log(this.dom.slider)

        this.dom.button.onclick = () => { this.method.toggle(); }
        this.dom.slider.oninput = () => { this.method.slider(this.dom.slider.value); }

        this.method.onupdate = this.update.bind(this);

    }


    update(){
        this.dom.progress.style.setProperty("--progress",`${this.method.progress*100}%`);
        this.dom.button.classList.toggle("running", this.method.running);
    }
}