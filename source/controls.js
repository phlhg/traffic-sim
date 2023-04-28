import MethodWrapper from "./methods/wrapper";

export default class Controls {

    constructor(app, wrapper){

        this.app = app;
        this.methods = [];

        this.dom = {}
        this.dom.wrapper = wrapper;
        this.dom.content = wrapper.querySelector('.content');
        this.dom.clear = wrapper.querySelector('.clear-button');

        this.dom.clear.addEventListener("click", async e => {
            await this.stopMethods();
            this.app.map.clear();
        })

    }

    addMethod(m){
        let method = new MethodWrapper(this.app,m);
        this.methods.push(method);
        this.dom.content.append(method.getHTMLElement());
        return method;
    }

    stopMethods(){
        return Promise.all(this.methods.map(m => m.method.stop()));
    }

}