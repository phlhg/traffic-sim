import { sleep } from "../utils";

export default class Method {

    constructor(app){

        this.app = app;

        this.name = "Abstract Method"
        this.description = "Since this is an abstract method there is no concrete description."

        this.running = false;

    }

    getHTMLElement(){
        let e = document.createElement('div');
        e.classList.add("method");

        e.innerHTML = `
            <strong>${this.name}</strong>
            <span class="description">${this.description}</span>
            <div class="button">Run</div>
        `;

        let btn = e.querySelector(".button");

        btn.onclick = () => {
            btn.classList.toggle("running", !this.running);
            this.toggle().finally(() => {
                btn.classList.toggle("running", this.running);
            });
        };

        return e;
    }

    async run(){
        if(this.running){ return; }
        this.running = true;
        await sleep(1000);
        this.running = false;
    }

    async stop(){
        if(!this.running){ return; }
        this.running = false;
    }

    async toggle(){
        if(this.running){
            await this.stop();
        } else {
            await this.run();
        }
    }

}


