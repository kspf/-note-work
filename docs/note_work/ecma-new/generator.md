# ES2015 生成器应用
```javascript
//生成器应用


//案例1： 发号器
function * createIdMaker (){
    let id = 1;
    while (true){
        yield id++;
    }    
}

const idMaker = createIdMaker();

console.log(idMaker.next().value)
console.log(idMaker.next().value)
console.log(idMaker.next().value)
console.log(idMaker.next().value)
console.log(idMaker.next().value)
console.log(idMaker.next().value)
console.log(idMaker.next().value)
console.log(idMaker.next().value)
console.log(idMaker.next().value)
console.log(idMaker.next().value)

//使用生成器函数实现可迭代接口
const todos = {
    life:['吃饭','睡觉','打豆豆'],
    learn:['语文','数学','英语','历史'],
    work:['喝茶','努力搬砖'],
    each:function(callback){
        const all = [].concat(...this.life,...this.learn,...this.work);
        for(const item of all){
            callback(item);
        }
    },
    [Symbol.iterator]:function *(){
        const all = [].concat(...this.life,...this.learn,...this.work);
        for(const item of all ){
            yield item;
        }
    }
}


for(const item of todos){
    console.log(item);
}
```