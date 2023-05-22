import App from "./app"
import Bruteforce from "./methods/bruteforce/bruteforce";
import SimpleAnt from "./methods/simpleant/simpleant";
import Genetic from "./methods/genetic/genetic";

document.addEventListener('DOMContentLoaded', () => {

    let app = new App();
    app.run()

    app.controls.addMethod(Bruteforce);
    app.controls.addMethod(SimpleAnt);
    app.controls.addMethod(Genetic)
    app.controls.addMethod(Genetic,1)
})
