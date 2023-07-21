import Controls from "./controls";
import Graph from "./map/graph";
import Map from "./map/map";

export default class App {

    constructor(){}

    run(){

        this.graph = new Graph();
        this.problem = localStorage.getItem("problem") ?? "tsp";

        if(localStorage.getItem("graph") !== null){
            // Load graph from previous session
            this.graph = Graph.from(JSON.parse(localStorage.getItem("graph")));
        }

        this.map = new Map(this, document.querySelector('.map'));
        this.map.update();

        this.controls = new Controls(this, document.querySelector('.controls'));

    }

    setProblem(p){
        this.problem = p;
        localStorage.setItem("problem", this.problem);
    }

}