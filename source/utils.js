function* p(arr, acc){

    if(arr.length < 1){ yield acc; }

    for(let i = 0; i < arr.length; i++){
        yield* p(
            arr.slice(0, i).concat(arr.slice(i+1)), // arr without element at pos i
            acc.concat([arr[i]])
        )
    }

}

export function permute(arr){
    return p(arr,[])
}

export function factorial(n){
    if(n <= 1){ return 1; }
    return n * factorial(n-1);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}