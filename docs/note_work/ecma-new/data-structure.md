# ES2015 数据结构（类型）

## set数据结构（类型）
- 成员不允许重复
```javascript
const s = new Set();

console.log(s);

s.add(1).add(2).add(3).add(4).add(5).add(1);

console.log(s);
console.log(s.size)//相当于数组length
console.log(s.has(3));
console.log(s.delete(1));
console.log(s);

s.clear();

console.log(s);


//数组去重
let arr = [1,2,3,4,3,1,23,4,5,6,7,31,31,1,2,3,4];
arr = [...new Set(arr)];
console.log(arr);
```

## ES2015 map
- 可以用任意类型的数据作为key 而对象只能用字符串
- 用get和set方法赋值与取值
```javascript
const obj = {};
obj[true] = 'value';
obj[123] = 'value';
obj[{a:1}] = 'value';

console.log(Reflect.ownKeys(obj));//[ '123', 'true', '[object Object]' ]
console.log(obj['[object Object]']);//value


const obj2 = new Map();
let key1 = {a:1};
let key2 = 12;
let key3 = [1,2,3,4];


obj2.set(key1,1);
obj2.set(key2,2);
obj2.set(key3,3);

console.log(obj2.get(key1));
console.log(obj2.get(key2));
console.log(obj2.get(key3));


console.log(obj2)
```

##  ES2015 Symbol
- ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。
- 接受一个参数为Symbl的描述
- 最大的用法是用来定义对象的唯一属性名
- for in 循环拿不到Symbol属性名 
- object.keys 也获取不到Symbol 属性
- JSON.stringify() 会忽略Symbol定义的属性
- Object.getOwnPropertySymbols();可以获取到所有Symbols属性
- Symbol.toStringTag是一个内置symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型，通常只有内置的Object.prototype.toString()方法采取读取这个标签并把它包含在自己的返回值里。

```javascript 
const cache = {};


cache[Symbol()] = "张三";
cache[Symbol()] = "李四";

console.log(cache);

for(var key in cache){
    console.log(key);
}


const keyB = Symbol();

cache[keyB] = "9999";

console.log(cache);

//创建有描述的Symbol
cache[Symbol("张三的xxx")] = "张三的xxx";//Symbol的描述为 Symbol(张三的xxx)
cache[Symbol("李四的xxx")] = "李四的xxx";//Symbol的描述为 Symbol(李四的xxx)

console.log(cache);



//Symbol补充

const key1 = Symbol.for('key1');
const key2 = Symbol.for('key1');

console.log(key1 === key2); //true

Object.getOwnPropertySymbols(cache);

// Symbol.toStringTag是一个内置symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型，通常只有内置的Object.prototype.toString()方法采取读取这个标签并把它包含在自己的返回值里。
const obj = {
    [Symbol.toStringTag]:"这是个神马东西",
}

console.log(obj.toString()); // [object 这是个神马东西]
```