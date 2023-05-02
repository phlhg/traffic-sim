import MethodWrapper from "./methods/wrapper";

export default class Controls {

    constructor(app, wrapper){

        this.app = app;
        this.methods = [];

        this.dom = {}
        this.dom.wrapper = wrapper;

        this.dom.wrapper.innerHTML = `
            <header><strong>ACO</strong> Traffic Optimizer</header>
            <div class="content"></div>
        `

        this.dom.content = this.dom.wrapper.querySelector('.content');
    }

    addMethod(m){
        let method = new MethodWrapper(this.app,m);
        this.methods.push(method);
        this.dom.content.append(method.getHTMLElement());
        return method;
    }

    stopMethods(){
        return Promise.all(this.methods.map(m => m.stop()));
    }

}