# ES2015 object新增方法

##  ES2015 Object.assign
- 将多个源对象中的属性复制到另一个目标对象中，如果源对象与目标对象有相同的方法，源对象方法会覆盖目标对象方法
- 返回值为目标对象
- 可以用来复制对象 Object.assign({},需要复制的对象)
```javascript 
//
let sourcel = {
    a:1,
    b:2,
    c:3
}

let source2 = {
    a:111,
    b:222,
    c:333
}

let target = {
    a:999,
    b:888,
}

let res = Object.assign(target,source2,sourcel);
console.log(res);// { a: 1, b: 2, c: 3 }
console.log(res === target); // true

let res2 = Object.assign({},sourcel);

console.log(res2);//{ a: 1, b: 2, c: 3 }
console.log(res2 === sourcel); false;
```

##  ES2015 Object.is
- 判断两个值是否相等
- 参数 Object.is(value,value);
 - value 被比较的第一个值
 - value 被比较的第二个值
- 返回值
 - 一个布尔类型标示两个参数是否相等
```javascript
console.log(0 == false); //true
console.log(0 === false);//false
console.log(+0 === -0);//true
console.log(NaN === NaN);//false
console.log(Object.is(NaN,NaN)) //true
```