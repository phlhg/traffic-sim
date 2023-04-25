
export function permute(inputArr) {
    
    function* p(bef, ina) {
        if (ina.length == 0) {
            yield bef
        }
        for (let i = 0; i < ina.length; i++) {
            let rest = ina.splice(i, 1)

            yield* p(bef.concat(rest), ina)

            ina.splice(i, 0, rest[0])
        }
    }

    return p([], inputArr)
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}