exports.getDate = () => { //or use named arrow fns 
const date = new Date();
    
    const options = {
        weekday : "long" ,
        day : "numeric" ,
        month : "long"
    }
    
    return date.toLocaleDateString("en-IN" ,options )
    
}


exports.getDay = () => { //or use named arrow fns 
const date = new Date();
    
    const options = {
        weekday : "long"
    }
    
    return date.toLocaleDateString("ben-IN" ,options )
    
}
//console.log(module.exports);
