
export function permute(inputArr) {
    let res = []
    
    function p(bef, ina) {
        if (ina.length == 0) {
            res.push(bef)
        }
        for (let i = 0; i < ina.length; i++) {
            let rest = ina.splice(i, 1)

            p(bef.concat(rest), ina)

            ina.splice(i, 0, rest[0])
        }
    }

    p([], inputArr)
  
    return res
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}