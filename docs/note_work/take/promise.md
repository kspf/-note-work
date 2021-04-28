# 手写promise 源码

## promise类核心逻辑实现
- promise是一个类在执行这个类的时候 需要传递一个执行器进去 执行器会立即执行
- 三个状态分别为： （状态不可改变）
	- 成功（fulfilled）
	- 等待（pending）pending=> fulfilled ||  pending=>rejected
	- 失败（rejected）
- resolve reject改变状态
	- resolve => fulfilled
	- reject => rejected

- then方法内部就是判断状态、如果状态为成功则调用成功方法 、如果失败则调用失败方法
- then成功回调有一个参数 表示成功之后的值 then失败回调有一个参数 表示失败后的原因
```javascript
const PENDING = "pending"; //等待
const PULFILLED = "pulfilled"; //成功
const REJECTED = "rejected";//失败

class myPromise{
    constructor(executr){
        executr(this.resolve,this.reject);
    }
    //成功之后的值
    value = undefined;
    //失败之后的原因
    reason = undefined;
    // Promise状态
    status = PENDING;

    //修改成功状态
    resolve = value =>{
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = PULFILLED;
        //设置成功后的值
        this.value = value;
    }
    //修改状态失败
    reject = value => {
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = REJECTED;
        //设置失败后的原因
        this.reason = value;
    }
    then = (successCallback,failCallback)=>{
        if(this.status == PULFILLED){
            successCallback(this.value);
        }else if(this.status == REJECTED){
            failCallback(this.reason);
        }
    }
}


//测试
let test1 = new myPromise((resolve,reject)=>{
    resolve("成功");
    reject("失败");
}).then(value=>{
    console.log(value);
},error=>{
    console.log(error);
})


```

## 加入异步逻辑
- 等待时将成功和失败回调存储起来
- 再更改成功或失败回调的时候再去调用成功或者失败回调
```javascript
	const PENDING = "pending"; //等待
const PULFILLED = "pulfilled"; //成功
const REJECTED = "rejected";//失败

class myPromise{
    constructor(executr){
        executr(this.resolve,this.reject);
    }
    //成功之后的值
    value = undefined;
    //失败之后的原因
    reason = undefined;
    // Promise状态
    status = PENDING;
    //成功回调
    successCallback = undefined;
    //失败回调
    failCallback = undefined;
    //修改成功状态
    resolve = value =>{
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = PULFILLED;
        //设置成功后的值
        this.value = value;

        this.successCallback && this.successCallback(value);
    }
    //修改状态失败
    reject = value => {
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = REJECTED;
        //设置失败后的原因
        this.reason = value;

        this.failCallback && this.failCallback(value);
    }
    then = (successCallback,failCallback)=>{
        if(this.status == PULFILLED){
            successCallback(this.value);
        }else if(this.status == REJECTED){
            failCallback(this.reason);
        }else{
            //等待
            //将成功回调和失败回调存储起来
            this.successCallback = successCallback;
            this.failCallback = failCallback;
        }
    }
}


//测试
let test1 = new myPromise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("成功");
    },1000);
    // reject("失败");
}).then(value=>{
    console.log(value);
},error=>{
    console.log(error);
})

```

## 实现then方法多次调用
- 在有多个then方法的时候需要把每个then的回调存起来 在成功或者失败时循环调用每个回调
```javascript
const PENDING = "pending"; //等待
const PULFILLED = "pulfilled"; //成功
const REJECTED = "rejected";//失败

class myPromise{
    constructor(executr){
        executr(this.resolve,this.reject);
    }
    //成功之后的值
    value = undefined;
    //失败之后的原因
    reason = undefined;
    // Promise状态
    status = PENDING;
    //成功回调
    successCallback = [];
    //失败回调
    failCallback = [];
    //修改成功状态
    resolve = value =>{
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = PULFILLED;
        //设置成功后的值
        this.value = value;

        //this.successCallback && this.successCallback(value);
        while(this.successCallback.length){
            this.successCallback.shift()(value);
        }
    }
    //修改状态失败
    reject = value => {
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = REJECTED;
        //设置失败后的原因
        this.reason = value;

        //this.failCallback && this.failCallback(value);
        while(this.failCallback.length){
            this.failCallback.shift()(value);
        }
    }
    then = (successCallback,failCallback)=>{
        if(this.status == PULFILLED){
            successCallback(this.value);
        }else if(this.status == REJECTED){
            failCallback(this.reason);
        }else{
            //等待
            //将成功回调和失败回调存储起来
            this.successCallback.push(successCallback);
            this.failCallback.push(failCallback);
        }
    }
}
```
## 实现then方法的链式调用
- then方法返回promise对象实现链式调用
tips:  只是同步成功状态
```javascript
const PENDING = "pending"; //等待
const PULFILLED = "pulfilled"; //成功
const REJECTED = "rejected";//失败

class myPromise{
    constructor(executr){
        executr(this.resolve,this.reject);
    }
    //成功之后的值
    value = undefined;
    //失败之后的原因
    reason = undefined;
    // Promise状态
    status = PENDING;
    //成功回调
    successCallback = [];
    //失败回调
    failCallback = [];
    //修改成功状态
    resolve = value =>{
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = PULFILLED;
        //设置成功后的值
        this.value = value;

        //this.successCallback && this.successCallback(value);
        while(this.successCallback.length){
            this.successCallback.shift()(value);
        }
    }
    //修改状态失败
    reject = value => {
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = REJECTED;
        //设置失败后的原因
        this.reason = value;

        //this.failCallback && this.failCallback(value);
        while(this.failCallback.length){
            this.failCallback.shift()(value);
        }
    }
    then = (successCallback,failCallback)=>{
        let promise2 = new myPromise((reslove,reject)=>{
            if(this.status == PULFILLED){
                let x = successCallback(this.value);
                reslove(x);
            }else if(this.status == REJECTED){
                failCallback(this.reason);
            }else{
                //等待
                //将成功回调和失败回调存储起来
                this.successCallback.push(successCallback);
                this.failCallback.push(failCallback);
            }
        });
        return promise2;
    }
}


//测试
let test1 = new myPromise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("成功");
    },1000);
    // resolve("成功");
    // reject("失败");
    // setTimeout(()=>{
    //     reject("失败");
    // },1000)
    
}).then(res=>{
    console.log(res);
    return 100;
}).then(res=>{
    console.log(res);
})

```
## promise 链式调用识别 promise 对象自返回
- 在状态改变时判断时判断then返回的promise 是否与成功回调返回的promise对象相等
tips: 只是同步成功状态判断
```javascript
const PENDING = "pending"; //等待
const PULFILLED = "pulfilled"; //成功
const REJECTED = "rejected";//失败

class myPromise{
    constructor(executr){
        executr(this.resolve,this.reject);
    }
    //成功之后的值
    value = undefined;
    //失败之后的原因
    reason = undefined;
    // Promise状态
    status = PENDING;
    //成功回调
    successCallback = [];
    //失败回调
    failCallback = [];
    //修改成功状态
    resolve = value =>{
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = PULFILLED;
        //设置成功后的值
        this.value = value;

        //this.successCallback && this.successCallback(value);
        while(this.successCallback.length){
            this.successCallback.shift()(value);
        }
    }
    //修改状态失败
    reject = value => {
        //如果状态不是等待直接退出函数
        if(this.status != PENDING) return;
        this.status = REJECTED;
        //设置失败后的原因
        this.reason = value;

        //this.failCallback && this.failCallback(value);
        while(this.failCallback.length){
            this.failCallback.shift()(value);
        }
    }
    then = (successCallback,failCallback)=>{
        let promise2 = new myPromise((reslove,reject)=>{
            if(this.status == PULFILLED){
                //异步 为了能够获取到 promise2
                setTimeout(()=>{
                    let x = successCallback(this.value);
                    //判断x是普通值还是promise对象
                    //如果是普通值直接调用resolve
                    //如果是promise对象，查看promise对象返回的结果
                    //在根据promise对象返回的结果 决定调用resolve 还是reject
                    resolvePromise(promise2,x,reslove,reject);
                },0);
            }else if(this.status == REJECTED){
                failCallback(this.reason);
            }else{
                //等待
                //将成功回调和失败回调存储起来
                this.successCallback.push(successCallback);
                this.failCallback.push(failCallback);
            }
        });
        return promise2;
    }
}
function resolvePromise (promise2,x,resolve,reject){
    //判断返回
    if(promise2 === x){
        return reject(new TypeError("promise对象被循环调用"))
    }
    //判断是否是promise对象
    if(x instanceof myPromise) {
        x.then(value=> resolve(value),err=>reject(err));
        //简写
        x.then(resolve,reject);
    }else{
        resolve(x);
    }
}

```
## 捕获错误及 then 链式调用其他状态代码补充
- try/catch捕获错误
```javascript
const PENDING = "pending"; //等待
const PULFILLED = "pulfilled"; //成功
const REJECTED = "rejected";//失败

class myPromise{
    constructor(executr){
        try{
            executr(this.resolve,this.reject);
        }
        catch(err){
            this.reject(err);
        }
    }
    //成功之后的值
    value = undefined;
    //失败之后的原因
    reason = undefined;
    // Promise状态
    status = PENDING;
    //成功回调
    successCallback = [];
    //失败回调
    failCallback = [];
    //修改成功状态
    resolve = value =>{
        //如果状态不是等待直接退出函数
        if(this.status !== PENDING) return;
        this.status = PULFILLED;
        //设置成功后的值
        this.value = value;

        //this.successCallback && this.successCallback(value);
        while(this.successCallback.length){
            this.successCallback.shift()();
        }
    }
    //修改状态失败
    reject = value => {
        //如果状态不是等待直接退出函数
        if(this.status !== PENDING) return;
        this.status = REJECTED;
        //设置失败后的原因
        this.reason = value;

        //this.failCallback && this.failCallback(value);
        while(this.failCallback.length){
            this.failCallback.shift()();
        }
    }
    then = (successCallback,failCallback)=>{
        let promise2 = new myPromise((reslove,reject)=>{
            if(this.status == PULFILLED){
                //异步 为了能够获取到 promise2
                setTimeout(()=>{
                   try{
                        let x = successCallback(this.value);
                        //判断x是普通值还是promise对象
                        //如果是普通值直接调用resolve
                        //如果是promise对象，查看promise对象返回的结果
                        //在根据promise对象返回的结果 决定调用resolve 还是reject
                        resolvePromise(promise2,x,reslove,reject);
                   }
                   catch(err){
                        reject(err);
                   }
                },0);
            }else if(this.status == REJECTED){
                setTimeout(()=>{
                    try{
                        let x = failCallback(this.reason);
                        //判断x是普通值还是promise对象
                        //如果是普通值直接调用resolve
                        //如果是promise对象，查看promise对象返回的结果
                        //在根据promise对象返回的结果 决定调用resolve 还是reject
                        resolvePromise(promise2,x,reslove,reject);
                    }
                    catch(err){
                        reject(err);
                    }
                 },0);
            }else{
                //等待
                //将成功回调和失败回调存储起来
                this.successCallback.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = successCallback(this.value);
                            //判断x是普通值还是promise对象
                            //如果是普通值直接调用resolve
                            //如果是promise对象，查看promise对象返回的结果
                            //在根据promise对象返回的结果 决定调用resolve 还是reject
                            resolvePromise(promise2,x,reslove,reject);
                        }
                        catch(err){
                            reject(err);
                        }
                    },0)
                });
                this.failCallback.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = failCallback(this.reason);
                            //判断x是普通值还是promise对象
                            //如果是普通值直接调用resolve
                            //如果是promise对象，查看promise对象返回的结果
                            //在根据promise对象返回的结果 决定调用resolve 还是reject
                            resolvePromise(promise2,x,reslove,reject);
                        }
                        catch(err){
                            reject(err);
                        }
                    },0)
                });
            }
        });
        return promise2;
    }
}
function resolvePromise (promise2,x,reslove,reject){
    //判断返回
    if(promise2 === x){
        return reject(new TypeError("promise对象被循环调用"))
    }
    //判断是否是promise对象
    if(x instanceof myPromise) {
        // x.then(value=> resolve(value),err=>reject(err));
        //简写
        x.then(reslove,reject);
    }else{
        reslove(x);
    }
}
```
## 将then的参数变为可选参数
- 判断then参数是否传入没有传入则补一个函数
```javascript
	const PENDING = "pending"; //等待
const PULFILLED = "pulfilled"; //成功
const REJECTED = "rejected";//失败

class myPromise{
    constructor(executr){
        try{
            executr(this.resolve,this.reject);
        }
        catch(err){
            this.reject(err);
        }
    }
    //成功之后的值
    value = undefined;
    //失败之后的原因
    reason = undefined;
    // Promise状态
    status = PENDING;
    //成功回调
    successCallback = [];
    //失败回调
    failCallback = [];
    //修改成功状态
    resolve = value =>{
        //如果状态不是等待直接退出函数
        if(this.status !== PENDING) return;
        this.status = PULFILLED;
        //设置成功后的值
        this.value = value;

        //this.successCallback && this.successCallback(value);
        while(this.successCallback.length){
            this.successCallback.shift()();
        }
    }
    //修改状态失败
    reject = value => {
        //如果状态不是等待直接退出函数
        if(this.status !== PENDING) return;
        this.status = REJECTED;
        //设置失败后的原因
        this.reason = value;

        //this.failCallback && this.failCallback(value);
        while(this.failCallback.length){
            this.failCallback.shift()();
        }
    }
    then = (successCallback,failCallback)=>{
        
        successCallback = successCallback ? successCallback : value=>value;
        failCallback = failCallback ? failCallback : err=> {throw err};

        let promise2 = new myPromise((reslove,reject)=>{
            if(this.status == PULFILLED){
                //异步 为了能够获取到 promise2
                setTimeout(()=>{
                   try{
                        let x = successCallback(this.value);
                        //判断x是普通值还是promise对象
                        //如果是普通值直接调用resolve
                        //如果是promise对象，查看promise对象返回的结果
                        //在根据promise对象返回的结果 决定调用resolve 还是reject
                        resolvePromise(promise2,x,reslove,reject);
                   }
                   catch(err){
                        reject(err);
                   }
                },0);
            }else if(this.status == REJECTED){
                setTimeout(()=>{
                    try{
                        let x = failCallback(this.reason);
                        //判断x是普通值还是promise对象
                        //如果是普通值直接调用resolve
                        //如果是promise对象，查看promise对象返回的结果
                        //在根据promise对象返回的结果 决定调用resolve 还是reject
                        resolvePromise(promise2,x,reslove,reject);
                    }
                    catch(err){
                        reject(err);
                    }
                 },0);
            }else{
                //等待
                //将成功回调和失败回调存储起来
                this.successCallback.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = successCallback(this.value);
                            //判断x是普通值还是promise对象
                            //如果是普通值直接调用resolve
                            //如果是promise对象，查看promise对象返回的结果
                            //在根据promise对象返回的结果 决定调用resolve 还是reject
                            resolvePromise(promise2,x,reslove,reject);
                        }
                        catch(err){
                            reject(err);
                        }
                    },0)
                });
                this.failCallback.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = failCallback(this.reason);
                            //判断x是普通值还是promise对象
                            //如果是普通值直接调用resolve
                            //如果是promise对象，查看promise对象返回的结果
                            //在根据promise对象返回的结果 决定调用resolve 还是reject
                            resolvePromise(promise2,x,reslove,reject);
                        }
                        catch(err){
                            reject(err);
                        }
                    },0)
                });
            }
        });
        return promise2;
    }
}
function resolvePromise (promise2,x,reslove,reject){
    //判断返回
    if(promise2 === x){
        return reject(new TypeError("promise对象被循环调用"))
    }
    //判断是否是promise对象
    if(x instanceof myPromise) {
        // x.then(value=> resolve(value),err=>reject(err));
        //简写
        x.then(reslove,reject);
    }else{
        reslove(x);
    }
}
```

## 实现promise all方法
- 注意需要在所有promise异步执行之后调用reslove
```javascript
static all (array){
        //结果数组
        let result = [];
        let index = 0;
        
        return new myPromise((reslove,reject)=>{
            function addData (i,value){
                result[i] = value;
                index++;
                if(index === array.length){
                    reslove(result);
                }
            }
            for(let i=0;i<array.length;i++){
                let current = array[i];
                if(current instanceof myPromise){
                    //promise对象
                    current.then(value=>{
                        addData(i,value)
                    },err=>{
                        reject(err)
                    });
                }else{
                    //普通值
                    addData(i,current);
                }
            }
        })
    }
```
## resolve 
```javascript
 static resolve(data){
        if(data instanceof myPromise){
            return data;
        }else{
            return new myPromise((resolve,reject)=>{
                resolve(data);
            })
        }
    }
```

## finally

```javascript
 finally(callback){
        return this.then(value=>{
            return myPromise.resolve(callback()).then(()=> value)
        },err=>{
            return myPromise.resolve(callback()).then(()=> {throw err}) 
        })
    }
```

## catch 方法
```javascript
    catch(failCallback){
        return  this.then(undefined,failCallback)
    }
```