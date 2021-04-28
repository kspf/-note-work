# 函数组合

- 纯函数和柯里化容易引起洋葱代码
- 函数组合可以让我们把细粒度的函数重新组合生成一个新的函数
- 函数组合并没有减少洋葱代码，只是封装了洋葱代码 
- 函数组合执行顺序从右到左
- 满足结合律既可以把g和h组合 还可以把f和g组合，结果都是一样的

```javascript 
const _ = require("lodash");

const reverse = arr => arr.reverse()
const first = arr => arr[0]
const toUpper = s => s.toUpperCase()
  
const lastToupper = _.flowRight(toUpper, first, reverse) 

console.log(lastToupper(['one', 'two', 'three']))
  
// 模拟 lodash 中的 flowRight
function compose (...args) {
  return function (value) {
    return args.reverse().reduce(function (acc, fn) {
        console.log(fn)
      return fn(acc)
    }, value)
  }
}
const composeEs6 = (...args) => value => args.reverse().reduce((acc, fn) => fn(acc), value)
const f = composeEs6(toUpper, first, reverse)
console.log(f(['one', 'two', 'three']))
//结合律
```