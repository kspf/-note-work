# ES2015函数参数默认值and箭头函数

## ES2015 参数默认值
- 注意默认值参数必须写在最后 不然默认值无法正常工作
```javascript
function get(is){
    is =  is === undefined ? true : is;
    console.log("ojbk");
    console.log(is);
}

get(false);

//es2015

function biu(is = true){
    console.log(is);
}

biu(231132);
```

## 剩余参数
- 利用...剩余操作符 接收从当前位置之后的所有参数
- 只能出现在形参的最后一位，并且只能出现一次
```javascript
//剩余参数
function foo (...ags){
    console.log(ags);
}


foo(1,2,3,4,5,6,7,8,9,10)
```

## 展开数组
```javascript 
const arr = [1,2,3,4,5,6,7,8,9];

console.log.apply(console,arr);

console.log(...arr);
```

## 箭头函数
- 箭头函数不绑定this
- 箭头函数没有prototype属性
- 箭头函数不能用作生成器
- 箭头函数不能使用new操作符
- 不绑定arguments
- 通过call、apply调用箭头函数时，第一个参数会被忽略 箭头函数中若用了this，这个this指向包裹箭头函数的第一个普通函数的 this
- 箭头函数可以省去return 关键字 没有{}符号时直接return  有时需要用()包裹取来
```javascript
function add (n1,n2){
    return n1+n2;
}


const add1 = (n1,n2) => n1+n2;

//注意 有了代码块 如果需要返回值 需要些return关键字
const add2 = (n1,n2) => {
    return n1+n2;
}



let isArguments  = ()=>{
    //箭头函数中没有arguments 
    // console.log(arguments);//浏览器环境  arguments is not defined 
    //箭头函数没有绑定this
    // console.log(this);//会向前寻找到第一个包裹箭头函数的普通函数的this
}
isArguments(1,2,3,4,5,6,7,8,9);

//箭头函数没有prototype属性
console.log(isArguments.prototype) //undefined
//箭头函数不能使用new操作符
new isArguments() // isArguments is not a constructor
```

## ES2015箭头函数与this
- 箭头函数不会改变this指向 在箭头函数中使用this会寻找第一个包裹箭头函数的普通函数的this
```javascript
const obj = {
    name:"张三",
    log:function(){
        console.log(`他是谁：${this.name}`);
    },
    arrowLog: ()=>{
        console.log(`箭头函数打印 this.name = ${this.name}`);
    },
    saveThis: function(){
        console.log("这个函数的this为obj");


        setTimeout(()=>{
            console.log(this.name);
        },1000)
    }
}

obj.log(); //他是谁：张三
obj.arrowLog(); //箭头函数打印 this.name = undefined
obj.saveThis();//箭头函数不会改变this指向 在箭头函数中使用this会寻找第一个包裹箭头函数的普通函数的this
```