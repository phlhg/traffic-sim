import App from "./app"
import Bruteforce from "./methods/bruteforce";

document.addEventListener('DOMContentLoaded', () => {

    let app = new App();
    app.run()

    app.controls.addMethod(Bruteforce);

})