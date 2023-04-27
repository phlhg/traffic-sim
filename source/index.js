import App from "./app"
import Bruteforce from "./methods/bruteforce";
import SimpleAnt from "./methods/simpleant";

document.addEventListener('DOMContentLoaded', () => {

    let app = new App();
    app.run()

    app.controls.addMethod(Bruteforce);
    app.controls.addMethod(SimpleAnt);
})
