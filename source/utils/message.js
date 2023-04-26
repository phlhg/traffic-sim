class Message {

    constructor(type, content, duration){

        let icons = {
            "error": "error",
            "info": "info",
            "warning": "warning"
        }

        this.type = type;
        this.icon = icons.hasOwnProperty(type) ? icons[type] : "info";
        this.content = content;
        this.duration = duration;

        this.dom = {}

        this.create();

    }

    create(){
        this.dom.wrapper = document.createElement("div");
        this.dom.wrapper.classList.add("message", this.type);
        this.dom.wrapper.innerHTML = `<span class="material-symbols-outlined">${this.icon}</span>${this.content}`;
        document.body.appendChild(this.dom.wrapper);
    }

    show(){
        setTimeout(() => {
            this.dom.wrapper.classList.add("active");
        },100);

        if(this.duration >= 0){ setTimeout(this.hide.bind(this), 100 + this.duration); }
    }

    hide(){
        this.dom.wrapper.classList.remove("active");
        setTimeout(this.remove.bind(this), 500);
    }

    remove(){
        this.dom.wrapper.remove();
    }

}

Message.error = function(content, duration){
    let m = new Message("error", content, duration ?? 5*1000);
    m.show();
    return m;
}

Message.warning = function(content, duration){
    let m = new Message("warning", content, duration ?? 5*1000);
    m.show();
    return m;
}

Message.info = function(content, duration){
    let m = new Message("info", content, duration ?? 5*1000);
    m.show();
    return m;
}

export default Message;