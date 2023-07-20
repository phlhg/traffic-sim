import App from "./app"
import Bruteforce from "./methods/bruteforce/bruteforce";
import SimpleAnt from "./methods/simpleant/simpleant";
import Genetic from "./methods/genetic/genetic";
import Routing from "./methods/routing/routing";
import TrafficBruteforce from "./methods/trafficbruteforce/bruteforce2";
import TrafficAnt from "./methods/trafficant/trafficant";
import TrafficGenetic from "./methods/trafficgenetic/genetic2";
import Simulated from "./methods/simulated/simulated";
import TrafficSimulated from "./methods/trafficsimulated/simulated";

document.addEventListener('DOMContentLoaded', () => {

    let app = new App();
    app.run()

    app.controls.addMethod(Bruteforce);
    app.controls.addMethod(SimpleAnt);
    app.controls.addMethod(Genetic)
    app.controls.addMethod(Simulated)
    // app.controls.addMethod(Routing,1);
    app.controls.addMethod(TrafficBruteforce,1);
    app.controls.addMethod(TrafficAnt, 1);
    app.controls.addMethod(TrafficGenetic, 1);
    app.controls.addMethod(TrafficSimulated, 1);
})
