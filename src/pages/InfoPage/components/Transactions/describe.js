export const strTemplate = (data,temp) => {
    window.datads = data
    const re = new RegExp(/\$\{/g);  
    const result1 = temp.replace(re,"${window.datads.");  
    return eval("`" + result1 + "`");
}