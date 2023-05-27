import App from "./app"
import Bruteforce from "./methods/bruteforce/bruteforce";
import Bruteforce2 from "./methods/bruteforce2/bruteforce2";
import SimpleAnt from "./methods/simpleant/simpleant";
import Genetic from "./methods/genetic/genetic";
import Test from "./methods/test/test";

document.addEventListener('DOMContentLoaded', () => {

    let app = new App();
    app.run()

    app.controls.addMethod(Bruteforce);
    app.controls.addMethod(SimpleAnt);
    app.controls.addMethod(Genetic)
    app.controls.addMethod(Test,1);
    app.controls.addMethod(Bruteforce2,1);
})
