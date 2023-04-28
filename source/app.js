import Controls from "./controls";
import Map from "./map/map";

export default class App {

    constructor(){}

    run(){

        this.map = new Map(this, document.querySelector('.map'));
        this.controls = new Controls(this, document.querySelector('.controls'));

    }

}