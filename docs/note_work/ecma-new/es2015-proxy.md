# ES2015 Proxy
- Proxy 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。
- 语法
 - const p = new Proxy(target, handler)
- 参数
 - target: 需要代理的目标对象
 - handler: 代理的处理对象
  - getPrototypeOf: Object.getPrototypeOf 方法的捕捉器。
  - setPrototypeOf: Object.setPrototypeOf 方法的捕捉器。
  - isExtensible: Object.isExtensible 方法的捕捉器。
  - preventExtensions: Object.preventExtensions 方法的捕捉器。
  - getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor 方法的捕捉器。
  - defineProperty: Object.defineProperty 方法的捕捉器。
  - has: in 操作符的捕捉器。
  - get: 属性读取操作的捕捉器。
  - set: 属性设置操作的捕捉器。
  - deleteProperty: delete 操作符的捕捉器。
  - ownKeys: Object.getOwnPropertyNames 方法和 Object.getOwnPropertySymbols 方法的捕捉器。
  - apply: 函数调用操作的捕捉器。
  - construct: new 操作符的捕捉器。
```javascript 
//Proxy对象
const person = {
    name:"张三",
    age:18
}

const personProxy = new Proxy(person,{
    get(target,property){
        // return 100;
        console.log('获取了getter属性');
        return property in target ? target[property] : 'default';
    },
    set(target,property,value){
        if(property === "age"){
            if(!Number.isInteger(value)){
                throw new TypeError(`设置age的${value}必须为数字`);
            }
        }
        target[property] = value;
    }
})
console.log(personProxy.name);  
// personProxy.age = "20";//报错 必须为数字
personProxy.age = 20;
console.log(personProxy.age); //20
```

## ES2015 Proxy 对比 defineProperty
- 更强大 defineProperty只能监听到get set方法 proxy能够监听更多
- 监视数组(自动推算下标)

```javascript
//Proxy对象 vs Object.defineProperty
const person = {
    name:"张三",
    age:18
}
//监听对象删除属性方法
const watchPerson = new Proxy(person,{
    deleteProperty (target,property){
        console.log(target,property);

        delete target[property];
    }
})

delete watchPerson.name;

console.log(person);



//监视数组
const list = [];
const watchList = new Proxy(list,{
    set(target,property,value){
        console.log(target,property,value);
        target[property] = value;

        return true; //表示设置成功
    }
})

watchList.push(1);
```