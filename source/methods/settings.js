class Setting {

    constructor(wrapper, conf){
        this.wrapper = wrapper;
        this.app = this.wrapper.app;

        this.conf = conf ?? {}
        this.conf.name = this.conf.name ?? "Unknown Property";
        this.value = this.conf.value ?? null;

        this.dom = {}
        this.dom.wrapper = document.createElement("label");

        this.setup();
    }

    setup(){ }

    getHTMLElement(){ return this.dom.wrapper; }

}


export class NumberSetting extends Setting {

    constructor(wrapper, conf){
        super(wrapper, Object.assign({
            min: 1, max: 10, step: 1, value: 1
        }, conf))
    }

    setup(){

        this.dom.wrapper.innerHTML = `<span>${this.conf.name}</span><input type="number" />`

        this.dom.input = this.dom.wrapper.querySelector("input");
        this.dom.input.min = this.conf.min;
        this.dom.input.max = this.conf.max;
        this.dom.input.step = this.conf.step;
        this.dom.input.value = this.value; 

        this.dom.input.onchange = e => {
            let v = Math.round(this.dom.input.value / this.conf.step) * this.conf.step;
            this.value = Math.min(this.conf.max, Math.max(this.conf.min, v.toFixed(8)));
            this.dom.input.value = this.value;
        }
    }

}

export class SliderSetting extends NumberSetting {


    setup(){

        this.dom.wrapper.innerHTML = `<span></span><input type="range" />`

        this.conf.formatter = this.conf.formatter ?? (v => { return v });

        this.dom.name = this.dom.wrapper.querySelector("span");
        this.dom.name.innerHTML = `${this.conf.name}: ${this.conf.formatter(this.value)}`

        this.dom.input = this.dom.wrapper.querySelector("input");
        this.dom.input.min = this.conf.min;
        this.dom.input.max = this.conf.max;
        this.dom.input.step = this.conf.step;
        this.dom.input.value = this.value; 

        this.dom.input.onchange = e => {
            let v = Math.round(this.dom.input.value / this.conf.step) * this.conf.step;
            this.value = Math.min(this.conf.max, Math.max(this.conf.min, v.toFixed(8)));
            this.dom.input.value = this.value;
            this.dom.name.innerHTML = `${this.conf.name}: ${this.conf.formatter(this.value)}`
        }
    }

}

export class BooleanSetting extends Setting {

    setup(){

        this.dom.wrapper.innerHTML = `<input type="checkbox" /><span>${this.conf.name}</span>`
        this.dom.wrapper.classList.add("checkbox");

        this.dom.input = this.dom.wrapper.querySelector("input");
        this.dom.input.checked = this.checked; 

        this.dom.input.onchange = e => {
            this.value = this.dom.input.checked;
        }

    }
}