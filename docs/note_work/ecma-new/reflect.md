# ES2015 Reflect
- 属于一个静态类，不可构造
- 静态方法
    -  apply(target, thisArgument, argumentsList): 对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 Function.-  prototype.apply() 功能类似。
    -  construct(target, argumentsList[, newTarget]): 对构造函数进行 new 操作，相当于执行 new target(...args)。
    -  defineProperty(target, propertyKey, attributes): 和 Object.defineProperty() 类似。如果设置成功就会返回 true
    -  deleteProperty(target, propertyKey): 作为函数的delete操作符，相当于执行 delete target[name]。
    -  get(target, propertyKey[, receiver]): 获取对象身上某个属性的值，类似于 target[name]。
    -  getOwnPropertyDescriptor(target, propertyKey): 类似于 Object.getOwnPropertyDescriptor()。如果对象中存在该属性，则返回对应的属性描述符,  否则返回 undefined.
    -  getPrototypeOf(target): 类似于 Object.getPrototypeOf()。
    -  has(target, propertyKey): 判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。
    -  isExtensible(target): 类似于 Object.isExtensible().
    -  ownKeys(target): 返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受enumerable影响).
    -  preventExtensions(target): 类似于 Object.preventExtensions()。返回一个Boolean。
    -  set(target, propertyKey, value[, receiver]): 将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。
    -  setPrototypeOf(target, prototype): 设置对象原型的函数. 返回一个 Boolean， 如果更新成功，则返回true。
```javascript
//提供了统一的方式来操作对象
const duck = {
    name: 'Maurice',
    color: 'white',
    greeting: function() {
        console.log(`Quaaaack! My name is ${this.name}`);
    }
}

console.log(Reflect.has(duck, 'color'));// true
console.log(Reflect.has(duck, 'haircut'));// false

const obj = {
    name:"张三",
    age:20,
}

const proxy = new Proxy(obj,{
    get(target, property){
        return Reflect.get(target,property);
    }
})

console.log(obj.name);

const obj1 = {
    name: "李四",
    age: 90
}

console.log('name' in obj1);
console.log(delete obj1.name);
console.log(Object.keys(obj1));

console.log(Reflect.has(obj,"name"))
console.log(Reflect.deleteProperty(obj,"name"));
console.log(Reflect.ownKeys(obj));
```