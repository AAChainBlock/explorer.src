export const formartBalance = (array) =>{
    let result = {}
    if(array != undefined){
        array.forEach((items,index) => {
            let item = assetsCoin( items.balance )
            result[item.unit] = items
        });
    }
    return result
}

export const assetsCoin = (str) =>{
    
    if(typeof str == "string"){
        return {
            flt: parseFloat(str),
            unit: str.substring(str.length-1) === "Y" ? str.substring(str.length - 4) : str.substring(str.length - 3),
            comb: str 
        }
    }else {
        return {}
    }
}