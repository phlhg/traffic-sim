import MethodWrapper from "./methods/wrapper";

export default class Controls {

    constructor(app, wrapper){

        this.app = app;
        this.methods = [];

        this.dom = {}
        this.dom.wrapper = wrapper;

        this.dom.wrapper.innerHTML = `
            <div class="buttonSelect selected"><strong>TSP</strong></div>
            <div class="buttonSelect"><strong>Traffic planning</strong></div>
            <div class="content"></div>
        `

        this.dom.content = this.dom.wrapper.querySelector('.content');

        this.tsp = []
        this.traffic = []

        this.dom.buttons = Array.from(this.dom.wrapper.querySelectorAll(".buttonSelect"));
        this.dom.buttons.forEach(element => {
            element.onclick = () => {
                this.dom.buttons.forEach(button => {
                    button.className="buttonSelect"
                })
                element.className="buttonSelect selected"

                this.updateContent()
            }
        });
    }
    updateContent() {
        this.dom.buttons.forEach(button => {
            if (button.className == "buttonSelect selected") {
                if (button.innerHTML.includes("TSP")) {
                    this.dom.content.innerHTML = ""
                    this.tsp.forEach(obj => {
                        this.dom.content.append(obj.getHTMLElement());
                    })
                }
                else if (button.innerHTML.includes("Traffic")) {
                    this.dom.content.innerHTML = ""
                    this.traffic.forEach(obj => {
                        this.dom.content.append(obj.getHTMLElement());
                    })
                }
            }
        })

    }

    addMethod(m,buttonId=0){
        let method = new MethodWrapper(this.app,m);
        this.methods.push(method);
        switch(buttonId){
            case 0:
                this.tsp.push(method)
                break
            case 1:
                this.traffic.push(method)
                break
        }
        this.updateContent()
        return method;
    }

    stopMethods(){
        return Promise.all(this.methods.map(m => m.stop()));
    }

}