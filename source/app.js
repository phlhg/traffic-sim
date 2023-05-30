import Controls from "./controls";
import Graph from "./map/graph";
import Map from "./map/map";

export default class App {

    constructor(){}

    run(){

        this.graph = new Graph();
        this.problem = "tsp";

        this.map = new Map(this, document.querySelector('.map'));
        this.map.update();

        this.controls = new Controls(this, document.querySelector('.controls'));

    }

}