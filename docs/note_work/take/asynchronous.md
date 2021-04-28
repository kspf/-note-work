# javascript 异步编程

## 概述
- 采用单线程模式工作的原因： 避免多线dom操作同步问题，javascript的执行环境中负责执行代码的线程只有一个
## 内容概要
- 同步模式和异步模式
- 事件循环和消息队列
- 异步编程的几种方式
- Promise 异步方案、宏任务/微任务队列
- Generator异步方案、async/await语法糖

### 同步模式（synchronous）
- 复杂运算耗时较多时阻塞后面代码执行

### 异步模式（）
- 耗时任务用异步模式去处理  用回调函数
- 代码执行顺序混乱
- 异步同步说的是执行代码的线程是单线程

```javascript 
    console.log('global begin')
    setTimeout(function timer1 () {
        console.log('timer1 invoke')
    }, 1800)
    setTimeout(function timer2 () {
        console.log('timer2 invoke')
        setTimeout(function inner () {
            console.log('inner invoke')
        }, 1000)
    }, 1000)
    console.log('global end')
```
### 回调函数
- 所有异步编程方案的根基