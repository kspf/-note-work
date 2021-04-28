# ES2015 for...of 循环

- 以后作为遍历所有数据结构的统一方法
- break 可以跳出循环
- 伪数组也可以遍历
- 遍历object 报错 obj is not iterable
- 所有可以用for of 遍历的数据结构都要实现 interable方法

```javascript

```

## ES2015 实现可迭代接口
- 每个for of 都实现了可迭代接口，或者说实现了可迭代接口的才可以用 for of循环

```javascript
//实现可迭代接口

const obj = {
    store: ['foo','bar','baz'],

    [Symbol.iterator]:function(){
        let index = 0;
        const self = this;
        return {
            next:function(){
                const result =  {
                    value: self.store[index],
                    done: index >= self.store.length,//标识循环是否结束
                }
                index++;
                return result;
            }
        }
    }
}

for(let item of obj){
    console.log(item);
    //foo
    //bar
    //baz
}
```

## 迭代器模型
- 对外提供统一遍历接口，让外部不关系内部数据结构是怎么样的

```javascript
// 迭代器模型

//场景： 你我协同开发一个任务清单应用

//我的代码
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
    [Symbol.iterator]:function(){
        const all = [].concat(...this.life,...this.learn,...this.work);
        let index = 0;
        return {
            next:function(){
                return {
                    value: all[index],
                    done: index++ >= all.length
                }
            }
        }

    }
}

//你的代码
//如果依赖于我的数据结构
// for(const item of todos.life){}
// for(const item of todos.learn){}
// for(const item of todos.work){}

for(const item of todos){
    console.log(item);
}
```