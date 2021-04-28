# vue3响应式原理解析

- Proxy 对象实现属性监听
- 多层属性嵌套，在访问层属性过程中处理下一级属性
- 默认监听动态添加的属性
- 默认监听属性的删除操作
- 默认监听数组索引和length操作
- 可以作为单独的模块使用



## 核心方法

- reactive/ref/toRefs/computed
- effect
- track
- trigger



# Proxy对象

## Proxy对象的使用

***set 和 deleteProperty 中需要返回布尔类型的值，在严格模式下，如果返回 false 的话会出现 Type Error 的异常***

```javascript
 const target = {
     foo: 'xxx',
     bar: 'yyy'
 }
 // Reflect.getPrototypeOf()
 // Object.getPrototypeOf()
 const proxy = new Proxy(target, {
     get (target, key, receiver) {
         // return target[key]
         return Reflect.get(target, key, receiver)
     },
     set (target, key, value, receiver) {
         // target[key] = value
         return Reflect.set(target, key, value, receiver)
     },
     deleteProperty (target, key) {
         // delete target[key]
         return Reflect.deleteProperty(target, key)
     }
 })

```

定义 `target` 对象 通过proxy 代理 `target`，创建proxy 对象的时候传入的第一个参数为要使用 `Proxy` 包装的目标对象，第二个参数是一个对象，对象中的成员为需要被代理操作的函数，这里的`get` `set` `deletePropery`分别监听对象的访问、赋值、删除操作。`receiver`参数代表当前proxy对象或者继承proxy的对象,`Reflect`是反射的意思，是es6中新增的成员，java和c#中也有反射

## reflect

Reflect这个对象在我的node(v4.4.3)中还没有实现, babel(6.7.7)也没有实现 ,新版本的chrome是支持的， ff比较早就支持Proxy和Reflect了，要让node支持Reflect可以安装[harmony-reflect](https://github.com/tvcutsem/harmony-reflect/ ) ;

　　Reflect不是构造函数， 要使用的时候直接通过Reflect.method()调用， Reflect有的方法和Proxy差不多， 而且多数Reflect方法原生的Object已经重新实现了。

**更加有用的返回值**

- 1 **更加有用的返回值：** Reflect有一些方法和ES5中Object方法一样样的， 比如： Reflect.getOwnPropertyDescriptor和Reflect.defineProperty,  不过, Object.defineProperty(obj, name, desc)执行成功会返回obj， 以及其它原因导致的错误， Reflect.defineProperty只会返回`false`或者`true`来表示对象的属性是否设置上了， 如下代码可以重构：

```js
try {
  Object.defineProperty(obj, name, desc);
  // property defined successfully
} catch (e) {
  // possible failure (and might accidentally catch the wrong exception)
}
```

- 2 **函数操作**，  如果要判断一个obj有定义或者继承了属性name， 在ES5中这样判断：**name in obj** ； 或者删除一个属性 ：**delete obj[name]**,  虽然这些很好用， 很简短， 很明确， 但是要使用的时候也要封装成一个类；

　　有了Reflect， 它帮你封装好了， **Reflect.has(obj, name)**,  **Reflect.deleteProperty(obj, name);**

- 3：**更加可靠的函数式执行方式：** 在ES中， 要执行一个函数f，并给它传一组参数args， 还要绑定this的话， 要这么写：

```js
f.apply(obj, args)
```

　　但是f的apply可能被重新定义成用户自己的apply了，所以还是这样写比较靠谱：

```js
Function.prototype.apply.call(f, obj, args)
```

　　上面这段代码太长了， 而且不好懂， 有了Reflect， 我们可以更短更简洁明了：

```js
Reflect.apply(f, obj, args)
```

- 4 ：**可变参数形式的构造函数：** 想象一下， 你想通过**不确定长度的参数**实例化一个构造函数， 在ES5中， 我们可以使用扩展符号， 可以这么写：

```js
var obj = new F(...args)
```

　　不过在ES5中， 不支持扩展符啊， 所以， 我们只能用F.apply，或者F.call的方式传不同的参数， 可惜F是一个**构造函数**， 这个就坑爹了， 不过有了Reflect， 我们在ES5中能够这么写：



```js
var obj = Reflect.construct(F, args)
```

- 5：**控制访问器或者读取器的this：** 在ES5中， 想要读取一个元素的属性或者设置属性要这样：



```js
var name = ... // get property name as a string
obj[name] // generic property lookup
obj[name] = value // generic property update
```

　　Reflect.get和Reflect.set方法允许我们做同样的事情， 而且他增加了一个额外的参数reciver， 允许我们设置对象的setter和getter的上下**this**：

```js
var name = ... // get property name as a string
Reflect.get(obj, name, wrapper) // if obj[name] is an accessor, it gets run with `this === wrapper`
Reflect.set(obj, name, value, wrapper)
```

　　访问器中不想使用自己的方法，而是想要重定向this到wrapper：

```js
var obj = {
    set foo(value) { return this.bar(); },
    bar: function() {
        alert(1);
    }
};
var wrapper = {
    bar : function() {
        console.log("wrapper");
    }
}
Reflect.set(obj, "foo", "value", wrapper);
```

- 6 ：**避免直接访问 __proto__** ： ES5提供了 Object.getPrototypeOf(obj)，去访问对象的原型， ES6提供也提供了`Reflect.getPrototypeOf(obj)` 和  Reflect.setPrototypeOf(obj, newProto)， 这个是新的方法去**访问**和**设置对象的原型**： 



## Proxy 和 Reflect 中使用的 receiver

 Proxy 中 receiver：Proxy 或者继承 Proxy 的对象

 Reflect 中 receiver：如果 target 对象中设置了 getter，getter 中的 this 指向 receiver

```js
const obj = {
      get foo() {
        console.log(this)
        return this.bar
      }
    }

const proxy = new Proxy(obj, {
    get (target, key, receiver) {
        if (key === 'bar') { 
            return 'value - bar' 
        }
        return Reflect.get(target, key, receiver)
    }
})
console.log(proxy.foo)
```



## 响应式系统原理-reactive

- 接收一个参数,判断参数是否是对象
- 创建拦截器对象handler，设置get/set/deleteProperty
- 返回Proxy对象

1. 创建 `reactive` 函数 接收一个`target`参数 , 判断target是否是对象，如果不是对象直接返回,是对象则转化为proxy对象

```javascript
//判断是否为对象
const isObject = val => val !== null && typeof val === 'object'

export function reactive(target){
   if(!isObject(target)) return target;
    const handler = {
        get(target, key, receiver){},
        set(target, key, value, receiver){},
        deleteProperty(target, key){}
    }
    return new Proxy (target,handler)
}
```

2. 定义get拦截方法，在get中需要收集依赖，返回target中对应key的值，如果key属性对应的值还是对象，需要继续转换为proxy对象

```javascript
//对象则调用reactive继续转换为proxy对象
const convert = target => isObject(target) ? reactive(target) : target
```

```javascript
get(target, key, receiver){
    //收集依赖
    console.log('get', key);
    const result = Reflect.get(target, key, receiver)
    return convert(result)
},
```

3. 定义set拦截方法，如果设置的值与原值不相同才需要设置，set方法需要返回一个布尔值来标识赋值是否成功 赋值成功需要触发更新

```javascript
set(target, key, value, receiver){
    const oldValue = Reflect.get(target, key, receiver)
    let result = true;
    if(oldValue !== value){
        result = Reflect.set(target, key, value, receiver)
        // 触发更新
        console.log('set',key,value)
    }
    return result
},
```

4. 定义delete操作拦截方法

**hanOwnProperty：**Object的`hasOwnProperty()`方法返回一个布尔值，判断对象是否包含特定的自身（非继承）属性。

定义`hasOwn` 函数来判断对象是否有某个key

```javascript
const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (target, key) => hasOwnProperty.call(target, key)
```

先判断对象是否有key，deleteProperty需要返回个布尔值，标识是否删除成功，对象有这个key并且删除成功则需要触发更新

```javascript
deleteProperty(target, key){
    const hasKey = hasOwn(target, key)
    //记录是否删除成功
    const result = Reflect.deleteProperty(target, key)
    if(hasKey && result){
        //触发更新
        console.log("delete", key)
    }
    return result
}
```



## 响应式系统收集依赖

## vue3中依赖收集过程分析

`reactive` 创建响应式数据

`effect ` 和 `wacthEffect `用法一致 ，`wacthEffect `调用 `effect `实现。

`effect ` 接收一个函数作为参数，`effect`中的函数首先会执行一次 当这个函数中引用响应式数据的时候，如果响应式数据发生变化时`effect`中的函数会再次执行 

```javascript
import { reactive, effect } from 'vue'

const product = reactive({
    name: 'iPhone',
    price: 5000,
    count: 3
})
let total = 0
```

内部首先会调用此`箭头函数`，箭头函数中访问了`product`，`product`是`reactive`返回的响应式对象，    访问`product.price`的时候会触发`price`属性的`get方法`，在`get方法`中要**收集依赖**，**收集依赖**的过程就是**存储**这个**属性**和这个**回调函数**。而属性和对象相关，所以在代理对象的`get方法`中，首先会存储**target（目标对象）**  然后是`target对象`的**属性**，这里是`price`,然后把对应的回调函数存储起来，这里是有对应关系的，`目标对象`、`对应属性`、`对应回调函数`  在触发更新的时候根据对象的属性找到函数。 `price `依赖收集完毕之后会继续收集`count`的依赖 会执行`count`对应的get方法 在get方法中需要存储目标对象以及对应的count属性以及对应的函数

```javascript
effect(() => {
    total = product.price * product.count
})
```

在重新赋值的时候，会执行price对应的set方法，在set方法中触发更新，触发更新其实就是找到依赖过程中属性对应的`effect`函数找到这个函数会立即执行

```javascript
product.price = 4000
console.log(total)
```



## 依赖收集图解

在依赖收集的过程中会创造三个集合分别是

- targetMap(new WeakMap)
  - 用来记录目标对象和一个字典使用的类型是`weakMap`
  - key就是目标对象，因为是弱应用所以当目标对象失去引用的时候可以销毁
  - value是depsMap，又是一个字典类型是map ==> depsMap

- depsMap(new Map)
  - key 是目标的属性名称
  - value是一个set集合,set集合中存储的元素不会重复他里面存储的是effect函数 ==> dep

- dep(new Set)
  - value是effect函数因为我们可以多次调用effect函数，在effect中访问同一个属性，这个时候该属性会收集多次依赖对应多个effect函数

通过这个结构可以存储目标对象、目标对象的属性、属性对应的effect函数，一个属性可能对应多个函数，触发更新的时候可以来这个结构中根据目标对象的属性找到effect函数执行

![!\[QQ截图20210218220240\](E:\mywww\study\vue3\image\QQ截图20210218220240.png)][1]



## 实现effect函数

effect接收一个函数作为参数，首先会执行一次callback函数，因为需要让track函数访问到callback所以定义一个`activeEffect`存储callback函数，收集依赖完毕清除`activeEffect`

```javascript
let activeEffect = null
export function effect (callback) {
  activeEffect = callback
  callback() // 访问响应式对象属性，去收集依赖
  activeEffect = null
}
```



## 实现track函数

接收两个参数一个是目标对象( target)一个是要跟踪的属性(key)，要把target存储到targetMap中，因为除了track函数使用之外还有trigger函数需要使用。trigger函数要去targetMap中找到属性对应的 effect函数

- track - 收集依赖
- trigger - 触发更新

***注: wrackMap的键仅是类型Object。不允许将原始数据类型用作键（例如，Symbol不能为WeakMap键） [了解更多关于WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)***

```javascript
let targetMap = new WeakMap()

export function track (target, key) {
  if (!activeEffect) return
  //当前的target就是targetMap的键
  let depsMap = targetMap.get(target)
  /*判断是否找到了depsMap 因为target有可能没有收集过依赖，如果没有收集过依赖则需要创建depsMap，并且要添加到targetMap中
  */
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  //根据属性查找对应的dep对象dep是一个集合
  let dep = depsMap.get(key)
  //如果dep不存在则需要创建新的dep集合并且添加到depsMap中
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  //收集effect依赖
  dep.add(activeEffect)
}
```

除此之外，还需要在代理对象的get方法中调用track函数来收集依赖,target(目标对象),key(属性)

```javascript
 get (target, key, receiver) {
     // 收集依赖
     track(target, key)
     const result = Reflect.get(target, key, receiver)
     return convert(result)
 },
```



## 响应式系统原理-trigger (触发更新)

trigger接收两个函数，分别是目标对象 （target）、跟踪属性（ key）。在trigger函数里要根据target去targetMap中找到depsMap、depsMap里面存储的是属性以及对应的dep集合，dep集合里面存储的就是属性对应的哪些effect函数

```javascript
export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  //判断是否找到depsMap
  if (!depsMap) return
  //根据key找到对应的dep集合 
  const dep = depsMap.get(key)
  //如果有dep集合则遍历dep集合调用effect函数
  if (dep) {
    dep.forEach(effect => {
      effect()
    })
  }
}
```

在赋值(set)和删除(deleteProperty)操作时调用trigger函数触发更新

```javascript
set (target, key, value, receiver) {
    const oldValue = Reflect.get(target, key, receiver)
    let result = true
    if (oldValue !== value) {
        result = Reflect.set(target, key, value, receiver)
        // 触发更新
        trigger(target, key)
    }
    return result
},
deleteProperty (target, key) {
     const hadKey = hasOwn(target, key)
     const result = Reflect.deleteProperty(target, key)
     if (hadKey && result) {
         // 触发更新
         trigger(target, key)
     }
     return result
}
```



## 响应式系统原理-实现ref

- ref 可以把基本数据类型数据，转成响应式数据
- ref返回的对象，重新赋值成对象也是响应式的
- reactive返回的对象，重新赋值丢失响应式
- reactive返回的对象不可以解构

接收一个参数可以是原始值也可以是对象，如果传入的是ref创建的对象直接返回，如果是普通对象，它内部会调用reactive创建响应式对象并创建一个只有value属性的响应式对象返回，如果一个对象中的成员非常多的时候使用ref并不方便因为需要带上value属性，如果只有只有单个数据使用ref非常方便因为可以直接结构返回

```javascript
export function ref (raw) {
  // 判断 raw 是否是ref 创建的对象，如果是的话直接返回
  if (isObject(raw) && raw.__v_isRef) {
    return
  }
  //
  let value = convert(raw)
  const r = {
    //标识是否是ref创建的属性
    __v_isRef: true,
    get value () {
      track(r, 'value')
      return value
    },
    set value (newValue) {
      if (newValue !== value) {
        raw = newValue
        value = convert(raw)
        trigger(r, 'value')
      }
    }
  }
  return r
}
```



## 响应式系统原理-实现toRefs

接收一个reactive函数返回的响应式对象，如果传入的参数不是reactive创建的响应式对象直接返回，把传入对象的所有属性转换为一个类似ref返回的对象，把转换后的属性挂载到一个新的对象上返回

```javascript
export function toRefs (proxy) {
  const ret = proxy instanceof Array ? new Array(proxy.length) : {}

  for (const key in proxy) {
  //调用toProxyRef把所有属性转换为类似ref转换的对象	
    ret[key] = toProxyRef(proxy, key)
  }

  return ret
}
```

定义转换属性函数

```java
function toProxyRef (proxy, key) {
  const r = {
    __v_isRef: true,
    get value () {
      //这里不需要收集依赖因为proxy是响应式对象proxy访问属性的get方法会去收集依赖
      return proxy[key]
    },
    set value (newValue) {
      proxy[key] = newValue
    }
  }
  return r
}
```



##  响应式系统原理-简单实现computed

接收一个有返回值的函数作为参数，这个函数的值就是计算属性的值，并且要监听这个函数内部使用的响应式数据的变化，最后把这个函数执行的结果返回。

```javascript
export function computed (getter) {
  const result = ref()

  effect(() => (result.value = getter()))

  return result
}
```


  [1]: https://typecho.heart.xn--6qq986b3xl/usr/uploads/2021/02/760422893.png