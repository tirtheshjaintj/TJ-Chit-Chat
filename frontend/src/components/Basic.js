let obj={
    age:200
};

let newObj=Object.assign({},obj);
obj.age=1000;
console.log(newObj);