# ES2015 对象字面量的增强
- 计算属性名 定义对象key的时候加上[]，可以动态定义对象名 [] 
```javascript
const name = "张三";


const obj = {
    foo: "123",
    name, //es6
    method1:function () {  },
    methodEs6(){},
    [1+2+3+5]: ()=>{
        console.log(123);
    }
}
obj[11]();// console.log 123;
```