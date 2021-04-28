# generator 异步方案

```javascript
	//生成器函数
function * foo (){
    try{
        let data =  yield 'foo';
        //yield 暂停函数执行
        console.log(data);
    }
    catch(err){
        console.log(err)
    }
}
const generator = foo();

console.log(generator);
//每调用一次next 方法 都会执行函数到下一个yield
const result = generator.next(); 

console.log(result);

//传入一个参数 将作为yield的返回值
// const result1 = generator.next("yyyy");

//对生成器继续执行并抛出一个异常  可以用try catch 捕获到这个异常
generator.throw(new Error('errr'))

// console.log(result1);


//递归执行
function * main (){
    try{
        let one = yield ajax("./package.json");
        console.log(one);
        let two = yield ajax("./package.json");
        console.log(two);
        let three = yield ajax("./package.json");
        console.log(three);
    }
    catch(err){

    }
}

const g = main();

function handleResult(result){
    if(result.done) return;
    result.value.then(data => {
        handleResult(g.next(data));
    },error=>{
        g.throw(error);
    })
}

handleResult(g.next())


//实现co
function co (generator){
    let g = generator();

    function handleResult(result){
        if(result.done) return;
        result.value.then(data => {
            handleResult(g.next(data));
        },error=>{
            g.throw(error);
        })
    }
    
    handleResult(g.next())
}

co(main);
```