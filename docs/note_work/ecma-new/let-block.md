# ES2015 let 与块级作用域
- 指代码成员能够起作用的范围，2015之前只有两种作用域  全局作用域 ， 函数作用域 ，15新增了块级作用域
    - 全局作用域
    - 函数作用域
    - 块级作用域 => 代码中的{}符号  
- let不会变量提升，为什么不用var 而是用 let 如果直接升级var 很多以前的项目就会出现问题
- let不会在全局对象里新建一个属性

```javascript

if(true){
    var foo = "zce";
}
console.log(foo);

if(true){
    let boo = "bbbb";
}

console.log(boo);//ReferenceError: boo is not defined

for(var i=0;i<3;i++){
    for(var i=0;i<3;i++){
        console.log(i);
    }
    console.log("内层循环结束")
}
/** 
 * console.log
0
1
2
内层循环结束
 * 
*/

for(let i=0;i<3;i++){
    for(let i=0;i<3;i++){
        console.log(i);
    }
    console.log("内层循环结束")
}

/** 
 * console.log
0
1
2
内层循环结束
0
1
2
内层循环结束
0
1
2
内层循环结束
 * 
*/


//for的作用域有两层嵌套作用域
for(let i=0;i< 3;i++){
    let i= "foo";
    console.log(i);
}
//理解for循环作用域 
let i = 0;
if(i < 3){
    let i = "foo";
}
i++
if(i < 3){
    let i = "foo";
}
i++
if(i < 3){
    let i = "foo";
}
i++

//let不会在全局对象里新建一个属性
var bb = "123"
this.bb // "123"
let cc = "456"
this.cc //undefined
```

## const 常量 
- 在let 的基础上多了一个只读，声明时必须赋值，不允许指向新的内存地址
- 最佳实践：
    - 不用var
    - 主用const
    - 配合let

```javascript
const name = "zhangsan";

// name = "lisi";//报错常量不允许重新指向内存地址

const obj = {};

obj['data'] = 1; //成功只是修改了obj成员 没有修改obj指向  不会报错

console.log(obj);
```