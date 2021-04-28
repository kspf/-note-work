# 纯函数概念
- 纯函数：相同的输入永远会得到相同的输出，而且没有任何可观察的副作用
	- 纯函数类似数学中的函数（用来描述输入和输出之间的关系），y=（x）	 
- lodash 是一个纯函数的功能库，提供了对数组、数字、对象、字符串、函数等操作的一些方法
- 数组中的slice 和splice 分别是：纯函数和不纯的函数
	- slice 返回数组中指定部分，不会改变原数组
	- splice 对数组操作并返回该数组，会改变原数组
- 函数式编程中不会保留计算中间的结果，所以变量是不可变的（无状态）
- 我们可以把一个函数执行结果交给另一个函数去处理

tips: 相同的输入永远得到相同输出，即为不管调用好多次 只要参数一样 返回结果一样

## lodash
- 基础方法
```javascript 
//演示 loash
//first last toUpper reverse each includes find findIndex
const _ = require("lodash");


const array = ['jack', 'tom', 'lucy', 'kate'];

console.log(_.first(array));//jack
console.log(_.last(array));//kate

console.log(_.toUpper(_.first(array)));//JACK

console.log(_.reverse(array));//[ 'kate', 'lucy', 'tom', 'jack' ] //改变原数组

const r = _.each(array,(item,index)=>{
    console.log(item,index);
});

console.log(r);//[ 'kate', 'lucy', 'tom', 'jack' ] 应为上面翻转了数组
```
## 纯函数的好处
- 可缓存
	- 因为纯函数对相同输入始终有相同的结果，所以可以吧函数的结果缓存起来 
- 自己模拟一个memoize函数
```javascript 
//记忆函数
const _ = require("lodash");


function getArea (r) {
    //打印一句话看看执行没有
    console.log("执行了，此时r为",r);
    return Math.PI * r * r
}


let getAreakeep = _.memoize(getArea);


console.log('第一次',getAreakeep(5)); // out1 - 执行了，此时r为 5, out2 第一次 78.53981633974483
console.log('第二次',getAreakeep(5));//第二次 78.53981633974483
console.log('第三次',getAreakeep(5));//第三次 78.53981633974483
console.log('第四次',getAreakeep(5));//第四次 78.53981633974483
console.log('第五次',getAreakeep(5));//第五次 78.53981633974483

//由此可以看出 在传入相同参数的情况下 只有第一次调用时调用了获取结果函数 此后都是取得缓存中的值

//自己思路

function keep(fn){
    const obj = {};

    return function(num){
        if(!obj[num]){
            obj[num] = fn(num);
        }
        return obj[num]
    }
}
//测试
let getAreakeepMy = keep(getArea);

console.log(getAreakeepMy(10));
console.log(getAreakeepMy(10));
console.log(getAreakeepMy(10));
console.log(getAreakeepMy(10));
console.log(getAreakeepMy(10));


//老师
function memoize (f){
    let cache = {};
    return function (){
        let key = JSON.stringify(arguments);
        cache[key] = cache[key] || f.apply(f,arguments);
        return cache[key];
    }
}

//测试
let getAreakeepTeacher = memoize(getArea);


console.log(getAreakeepTeacher(20));
console.log(getAreakeepTeacher(20));
console.log(getAreakeepTeacher(20));
console.log(getAreakeepTeacher(20));
console.log(getAreakeepTeacher(20));
```
- 可测试 
	- 纯函数让测试更方便 
- 并行处理
	- 多线程环境下并行操作共享的内存数据很可能会出现意外情况
	- 纯函数不需要访问共享的内存数据，所以在并行环境下可以任意运行纯函数
tips：[ web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker) 可以开启新线程 es6

## 纯函数副作用
- 让一个函数变得不纯（依赖外部的一个可变值），纯函数根据相同的输入返回相同的输出，如果函数依赖于外部的状态就无法保证相同输入，就会带来副作用
- 副作用来源：
	- 配置文件
	- 数据库
	- 获取用户的输入
	- .....
所有的外部交互都有可能带来副作用，副作用也使得方法通用性下降不适合扩展和可重用性 安全隐患给程序带来不确定性，但是副作用不可能完全禁止，尽量可能控制他们在可控范围内发生