export default class Editor {

    constructor(map){
        this.app = map.app;
        this.map = map;
        this.id = null;
        
        this.dom = {}
        this.dom.root = document.createElement("div");
        this.dom.root.classList.add("editor");
        this.dom.root.innerHTML = `
            <div class="delete"><span class="material-symbols-outlined">delete</span></div>
            <span class="title">Node X</span>
            <span class="desc"></span>
            <label>
                <span>Population X</span>
                <input type="range"/>
            </label>`

        this.dom.delete = this.dom.root.querySelector(".delete");
        this.dom.title = this.dom.root.querySelector(".title");
        this.dom.description = this.dom.root.querySelector(".desc");
        this.dom.label = this.dom.root.querySelector("label > span");
        this.dom.input = this.dom.root.querySelector("input");

        this.dom.input.min = 1;
        this.dom.input.max = 1_000_000;
        this.dom.input.step = 1;

        this.dom.input.onchange = e => {
            if(this.id === null){ return; }
            let node = this.app.graph.getNode(this.id);
            node.data.size = parseInt(this.dom.input.value);
            this.update();
            this.map.update();
        }

        this.dom.input.oninput = this.dom.input.onchange;

        this.dom.delete.onclick = e => {
            if(this.id === null){ return; }
            this.app.graph.removeNode(this.id);
            this.map.update(this.app.graph);
            this.hide();
        }

    }

    show(id){
        this.id = id;
        this.update();
        this.dom.root.classList.add("active");
    }

    update(){
        if(this.id === null){ return; }

        let node = this.app.graph.getNode(this.id);
        let coordinates = this.map.getDocumentCoordinates(node.x, node.y + 15);

        this.dom.root.style.left = `${coordinates.x}px`
        this.dom.root.style.top = `${coordinates.y}px`

        this.dom.title.innerHTML = `Node ${node.id}`
        this.dom.label.innerHTML = `Population: ${node.data.size.toLocaleString('de-CH')}`
        this.dom.input.value = node.data.size;
    }

    hide(){
        this.id = null;
        this.dom.root.classList.remove("active");
    }

    get(){
        return this.dom.root;
    }

}