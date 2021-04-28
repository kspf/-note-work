# 柯里化
- 当一个函数有多个参数的时候先传递一部分参数调用它（这部分参数以后永远不变）
- 然后返回一个新的函数接收剩余参数，返回结果
```javascript
//科里化演示
function checkAge (age){
    let min = 18;
    return age >= min;
}

//普通的纯函数
function checkAge (min,age){
    return age >= min;
}

console.log(checkAge(18,25))
console.log(checkAge(18,26))
console.log(checkAge(18,27))
console.log(checkAge(18,28))
console.log(checkAge(24,29))
console.log(checkAge(24,29))

function checkAge (min){
    return function(age){
        return age >= min;
    }
}


let checkAge18 = checkAge(18);
let checkAge20 = checkAge(20);

console.log(checkAge18(20));
console.log(checkAge20(24));


//es6写法
let checkAgeEs6 = min => (age => age >= min); 

let checkAgeEs618 = checkAgeEs6(18);
let checkAgeEs620 = checkAgeEs6(20);

console.log(checkAgeEs618(20));
console.log(checkAgeEs620(24));

//当函数有多个参数的时候改造为使用一个函数传入部分参数并让这个函数返回新的函数，新的函数接收剩余参数并返回处理结果

```
tips: 当函数有多个参数的时候改造为使用一个函数传入部分参数并让这个函数返回新的函数，新的函数接收剩余参数并返回处理结果. 

## lodash中的柯里化方法
- curry(function)
	- 功能： 创建一个函数，该函数接收一个或多个function的参数，如果function所需要的参数都被提供则执行function 返回执行的结果，否则继续返回该函数并等待接收剩余参数
	- 参数： 需要柯里化的函数
	- 返回值： 柯里化后的函数
```javascript 
	//lodash 中的 curry 基本使用
const _ = require("lodash");

//一个参数叫一元函数 2个叫二元函数 3个叫三元函数
function getSum(a,b,c) { 
    return a + b + c;
}

//柯里化把多元函数 转化为一元函数

//curry
const curried = _.curry(getSum);

console.log(curried(1)(2)(3));
console.log(curried(1)(2,3));
console.log(curried(1,2)(3));


//柯里化案例

//案例1 判断一个字符串中有没有空白字符 
''.match(/\s+/g);
//匹配所有数组
''.match(/\d+/g);
//普通
function match(reg,str){
    return str.match(reg);
}
//柯里化
const curryMatch = _.curry(function(reg,str){
    return str.match(reg);
});

const haveSpace = curryMatch(/\s+/g);
const haveNumber = curryMatch(/\d+/g);

console.log(haveSpace(" 1 2 3 4 5 6"))
console.log(haveNumber(" 1 2 3 4 5 6"))

//查找数组中空白字符元素

const filter = _.curry(function(func,array){
    return array.filter(func);
})

const findSpace = filter(haveSpace);

//es6写法
const filterEs6 = _.curry((func,array) => array.filter(func));

const findSpaceES6 = filter(haveSpace);

console.log(findSpace(['aaaabbbb','a b']));//[ 'a b' ]
console.log(findSpaceES6(['aaaab bbb','a b']));//[ 'aaaab bbb', 'a b' ]
```

## 柯里化原理
一个  柯里化的函数首先会接受一些参数，接受了这些参数之后，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值
```javascript 
//科里化演示
function checkAge (age){
    let min = 18;
    return age >= min;
}

//普通的纯函数
function checkAge (min,age){
    return age >= min;
}

console.log(checkAge(18,25))
console.log(checkAge(18,26))
console.log(checkAge(18,27))
console.log(checkAge(18,28))
console.log(checkAge(24,29))
console.log(checkAge(24,29))

function checkAge (min){
    return function(age){
        return age >= min;
    }
}


let checkAge18 = checkAge(18);
let checkAge20 = checkAge(20);

console.log(checkAge18(20));
console.log(checkAge20(24));


//es6写法
let checkAgeEs6 = min => (age => age >= min); 

let checkAgeEs618 = checkAgeEs6(18);
let checkAgeEs620 = checkAgeEs6(20);

console.log(checkAgeEs618(20));
console.log(checkAgeEs620(24));

//当函数有多个参数的时候改造为使用一个函数传入部分参数并让这个函数返回新的函数，新的函数接收剩余参数并返回处理结果
```

## lodash中的科里化
```javascript
//lodash 中的 curry 基本使用
const _ = require("lodash");

//一个参数叫一元函数 2个叫二元函数 3个叫三元函数
function getSum(a,b,c) { 
    return a + b + c;
}

//柯里化把多元函数 转化为一元函数

//curry
const curried = _.curry(getSum);

console.log(curried(1)(2)(3));
console.log(curried(1)(2,3));
console.log(curried(1,2)(3));


//柯里化案例

//案例1 判断一个字符串中有没有空白字符 
''.match(/\s+/g);
//匹配所有数组
''.match(/\d+/g);
//普通
function match(reg,str){
    return str.match(reg);
}
//柯里化
const curryMatch = _.curry(function(reg,str){
    return str.match(reg);
});

const haveSpace = curryMatch(/\s+/g);
const haveNumber = curryMatch(/\d+/g);

console.log(haveSpace(" 1 2 3 4 5 6"))
console.log(haveNumber(" 1 2 3 4 5 6"))

//查找数组中空白字符元素

const filter = _.curry(function(func,array){
    return array.filter(func);
})

const findSpace = filter(haveSpace);

//es6写法
const filterEs6 = _.curry((func,array) => array.filter(func));

const findSpaceES6 = filter(haveSpace);

console.log(findSpace(['aaaabbbb','a b']));//[ 'a b' ]
console.log(findSpaceES6(['aaaab bbb','a b']));//[ 'aaaab bbb', 'a b' ]
```

##  柯里化原理模拟
```javascript
function curry (func) {
    return function curriedFn(...args) {
      // 判断实参和形参的个数 函数.length 这种写法获取函数参数长度
      //如果实参的参数少于形参的长度则返回一个函数继续接受参数
      //形成闭包保留args 参数依次叠加 直到 大于或等于形参 不满足条件 调用 func(...args)
      if (args.length < func.length) {
        return function (...args2) {
          return curriedFn(...args.concat(args2))
        }
      }
      //如果函数的实参和形参个数相同直接调用需要柯里化函数并返回结果
      return func(...args)
    }
}
```


## 柯里化总结：
- 柯里化可以让我们给一个函数传递较少的参数得到一个已经记住了某些固定参数的新函数
- 这是一种对函数参数的'缓存'
- 让函数变的更灵活，让函数的粒度更小
- 可以把多元函数转换成一元函数，可以组合使用函数产生强大的功能