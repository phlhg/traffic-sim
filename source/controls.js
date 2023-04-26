export default class Controls {

    constructor(app, wrapper){

        this.app = app;
        this.methods = [];

        this.dom = {}
        this.dom.wrapper = wrapper;
        this.dom.content = wrapper.querySelector('.content');
        this.dom.clear = wrapper.querySelector('.clear-button');

        this.dom.clear.addEventListener("click", e => {
            this.app.map.clear();
        })

    }

    addMethod(c){
        let method = new c(this.app);
        this.methods.push(method);
        this.dom.content.append(method.getHTMLElement());
        return method;
    }

}