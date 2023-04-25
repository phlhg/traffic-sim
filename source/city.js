class City {

    constructor(x, y, size){
        this.id = City.counter++;
        this.x = x
        this.y = y
        this.size = size
    }

}

City.counter = 0;

export default City;