# VirtualDOM 及 Diff 算法



> 什么是VirtualDOM，
>
> 它是如何提升dom对象操作性能的，
>
> 如何创建VirtualDOM对象，
>
> 如何将VirtualDOM对象转换为真实DOM对象，
>
> 如何对比VirtualDOM从而找出差异部分实现最小化DOM更新
>
> 如何渲染函数组件和类组件
>
> 如何调用类组件的生命周期函数
>
> 在组件中如何通过ref属性获取元素或组件的实例对象



## 1. jsx 到底是什么?



使用react就一定会写JSX，JSX到底是什么呢？ 他是一种javaScript语法的扩展

，react使用它来描述用户界面长什么样子。虽然看起来非常像HTML，但它确实是javaScript。但在React执行代码之前，babel会对将JSX编译为react API.

```react
<div className="container">sh
  <h3>Hello React</h3>
  <p>React is great </p>
</div>
```

上面的代码会被babel编译为下面

```react
React.createElement(
  "div",
  {
    className: "container"
  },
  React.createElement("h3", null, "Hello React"),
  React.createElement("p", null, "React is great")
);
```

React.createElement  第一个参数是节点类型(string)，第二个参数是节点属性(object)，从第三个参数开始表示该节点的子节点。React.createElement作用就是创建VirtualDOM对象的，virtualDOM对象就是javascript对象，使用javascript对象来描述DOM对象信息的一种方式，React.createElement的返回值就是VirtualDOM。



> 我们写JSX 会先被转换为 React.createElement 的调用，方法在调用后会返回VirtualDOM对象，然后react再将VirtualDOM对象转换为真实DOM对象,最终将真实DOM显示在页面中



从两种语法对比来看，JSX 语法的出现是为了让 React 开发人员编写用户界面代码更加轻松。

[Babel REPL](https://babeljs.io/repl)



## 2. VirtualDOM 介绍

## 2.1 在现代 web 应用程序中使用 JavaScript 操作 DOM 是必不可少的，但遗憾的是它比其他大多数 JavaScript 操作要慢的多。

大多数 JavaScript 框架对于 DOM 的更新远远超过其必须进行的更新，从而使得这种缓慢操作变得更糟。

例如假设你有包含十个项目的列表，你仅仅更改了列表中的第一项，大多数 JavaScript 框架会重建整个列表，这比必要的工作要多十倍。

更新效率低下已经成为严重问题，为了解决这个问题，React 普及了一种叫做 Virtual DOM 的东西，Virtual DOM 出现的目的就是为了提高 JavaScript 操作 DOM 对象的效率。



## 2.2 什么是 Virtual DOM



在 React 中，每个 DOM 对象都有一个对应的 Virtual DOM 对象，它是 DOM 对象的 JavaScript 对象表现形式，其实就是使用 JavaScript 对象来描述 DOM 对象信息，比如 DOM 对象的类型是什么，它身上有哪些属性，它拥有哪些子元素。

可以把 Virtual DOM 对象理解为 DOM 对象的副本，但是它不能直接显示在屏幕上。

```react
<div className="container">
  <h3>Hello React</h3>
  <p>React is great </p>
</div>
```

**VirtualDOM怎么描述DOM对象呢?**

- type（string）   

  表示节点的类型信息

- props   (object)

  表示节点的属性信息

- children   (array)

  表示节点的子节点信息

```react
{
  type: "div",
  props: { className: "container" },
  children: [
    {
      type: "h3",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "Hello React"
          }
        }
      ]
    },
    {
      type: "p",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "React is great"
          }
        }
      ]
    }
  ]
}
```



##  3. Virtual DOM 如何提升效率



精准找出发生变化的 DOM 对象，只更新发生变化的部分。

在 React 第一次创建 DOM 对象后，会为每个 DOM 对象创建其对应的 Virtual DOM 对象，在 DOM 对象发生更新之前，React 会先更新所有的 Virtual DOM 对象，然后 React 会将更新后的 Virtual DOM 和 更新前的 Virtual DOM 进行比较，从而找出发生变化的部分，React 会将发生变化的部分更新到真实的 DOM 对象中，React 仅更新必要更新的部分。

Virtual DOM 对象的更新和比较仅发生在内存中，不会在视图中渲染任何内容，所以这一部分的性能损耗成本是微不足道的。

<img src="/images/virtualdom/1.png" style="margin: 20px 0;width: 80%"/>

```react
<div id="container">
	<p>Hello React</p>
</div>
```

```react
<div id="container">
	<p>Hello Angular</p>
</div>
```

```react
const before = {
  type: "div",
  props: { id: "container" },
  children: [
    {
      type: "p",
      props: null,
      children: [
        { type: "text", props: { textContent: "Hello React" } }
      ]
    }
  ]
}
```

```react
const after = {
  type: "div",
  props: { id: "container" },
  children: [
    {
      type: "p",
      props: null,
      children: [
        { type: "text", props: { textContent: "Hello Angular" } }
      ]
    }
  ]
}
```



## 创建Virtual对象

在 React 代码执行前，JSX 会被 Babel 转换为 React.createElement 方法的调用，在调用 createElemet 方法时会传入元素的类型，元素的属性，以及元素的子元素，createElement 方法的返回值为构建好的 Virtual DOM 对象。



>  问题： 我们实现一个精简版的`react`这个精简版的`react` 我们命名为`TinyReact`，也就是说我们实现的`createElement`方法要被添加到tinyReact对象当中，所以代码执行的时候，我们希望执行的是`TinyReact.createElement`。babel会转换为`react.createElement`，怎么解决这个问题呢？
>
> 我们只需要告诉babel 在转换的时候转换为TinyReact.createElement，两种方法：
>
> 1.页面顶部添加注解
>
> `/** @jsx TinyReact.createElement  */ `
>
> 2.在项目的`.babelrc` 配置文件中配置
>
> ```json
> {
>     "presets": [
>         "@babel/preset-env",
>         [
>             "@babel/preset-react",
>             {
>                 "pragma": "TinyReact.createElement"
>             }
>         ]
>     ]
> }
> ```





## 实现精简版react



[实现模板地址](https://gitee.com/menotwo/study-notes/tree/master/React%20%E6%A1%86%E6%9E%B6%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/React%20%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86%E8%A7%A3%E5%AF%86%E5%8F%8A%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/code/tiny-react-template-temp)

> 目录结构
>
> ├── src
> │     ├──index.html
> │     ├──TinyReact
> │     ├──index.js
> ├── .babelrc
> ├── package.json
> ├── webpack.config.js



## 1. 在TinyReact文件中创建createElement.js 文件 实现基础createElement方法

```javascript
/**
 * @name createElement
 * @param {string} type  元素的类型
 * @param {object} props 元素的属性
 * @param {array} children 元素的子元素
 * 
 * */ 

export default function createElement(type, props, ...children){
    // 返回虚拟dom
    return {
        type,
        props,
        children,
    }
}
```

## 2. 在TinyReact文件夹下index.js 文件中导入createElement方法，导出一个对象包含createElement方法，这个对象就是 TinyReact 对象

```javascript
import createElement from './createElement'

export default {
    createElement
}
```

## 4. 在src下面index.js中添加一下代码 通过console.log方法去输入virtualDOM的返回值

```jsx

import TinyReact from './TinyReact'
    

const virtualDOM = (
    <div className="container">
        <h1>你好 Tiny React</h1>
        <h2>(编码必杀技)</h2>
        <div>
            嵌套1 <div>嵌套 1.1</div>
        </div>
        <h3>(观察: 这个将会被改变)</h3>
        {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
        {2 == 2 && <div>2</div>}
        <span>这是一段内容</span>
        <button onClick={() => alert("你好")}>点击我</button>
        <h3>这个将会被删除</h3>
        2, 3
    </div>
)
console.log(virtualDOM)
```

输出结果:

<img src="/images/console.png" alt="输出内容" />

> 在src文件下index.js 文件中， 我们准备了一段jsx代码 接下来我们去引入了TinyReact对象，当前jsx元素都会转换成TinyReact.createElement的方法，接着在代码执行的时候会去调用createElement方法，在调用createElement方法的时候返回了一个virtualDOM对象。所以在这个地方我们才可以输出代码执行得结果这就是我们当前实现的最简单的一个virtualDOM对象。



现在我们实现的virtual对象还是有一点问题，我们先来看第一个问题

1. 文本节点问题，现在文本节点是以文本字符串方式存储在virtualDOM对象当中，这不符合我们的要求我们的要求是即使是一个文本节点也应该以对象来展示。如何来解决这个问题呢，其实也很简单我们只需要去循环children数组，如果是文本节点我们就去替换为文本节点对象

2. 在src/index.js 文件中 有这样一段代码`{2 == 1 && <div>如果2和1相等渲染当前内容</div>}`模板的值为布尔值，这个节点实际上是不显示的，我们这里布尔值被当做文本节点处理了, 我们要把virtualDOM当中的 null、false、true都抛出去，因为这些内容是不在页面中显示的

3. 在react中可以通过组件的.props.children 拿到组件的子节点



修改后的createElement方法：

```javascript
/**
 * @name createElement
 * @param {string} type  元素的类型
 * @param {object} props 元素的属性
 * @param {array} children 元素的子元素
 * 
 * */ 

export default function createElement(type, props, ...children){
    // 在对children操作之前我们先需要对数组进行拷贝 利用数组concat方法进行拷贝
    const childrenElements = [].concat(children).reduce((result, child) => {
        // 筛选出不需要显示的逻辑节点
        if (child !== false && child !== true && child != null) {
            if(child instanceof Object){
                result.push(child)
            }else {
                // 我们需要用createElement 去处理文本节点 并且返回处理后的结果
                result.push(createElement('text',{textConent: child}))
            }
        }
        return result
    }, [])
    // 返回虚拟dom
    return {
        type,
        props: Object.assign({children: childrenElements}, props),
        children: childrenElements,
    }
}
```



## 5. 把虚拟dom转换为真实dom，在src/TinyReact下创建render.js，实现render方法

1. 创建`render` 方法，我们需要考虑是否有旧的节点，`render`是框架向外部提供的一个方法，在方`render`法中还是要调用另一个方法作比对，这个方法我们命名为 `diff`

```javascript
import diff from './diff'

export default function render (virtualDOM, container, oldDOM) {
    // 对比新旧dom方法
    diff(virtualDOM, container, oldDOM)
}
```

2. 在` src/TinyReact `下创建`diff.js` 文件 实现`diff`方法，在`diff`中第一个我们要做的事情就是判断`oldDOM` 是否存在，如果不存在的情况下 直接把`virtualDOM` 转换为真实DOM，在转换dom的时候我们需要判断当前传递给`render` 方法的是普通dom对象还是组件形式的dom对象，我们创建一个`mountElement`方法来处理这种情况

```javascript
import mountElement from './mountElement'

export default function diff (virtualDOM, container, oldDOM){
    // 判断oldDOM是否存在
    if(!oldDOM) {
        mountElement(virtualDOM, container)
    }
}
```

3. 在`src/TinyReact` 下创建 `mountElement.js`， 实现`mountElement`方法，我们现在只考虑普通元素的情况

```javascript
import mountNativeElement from './mountNatvieElement'

export default function mountElement (virtualDOM, container){
    // Component Vs NativeElement
    mountNativeElement(virtualDOM, container)
}
```

4. 在`src/TinyReact `下创建`mountNativeElement.js` 文件,实现普通元素转换为真实`dom`方法，引入`mountElement`方法处理子节点转换

```javascript
import mountElement from "./mountElement"

export default function mountNativeElement (virtualDOM, container) {
    let newElement = null
    if(virtualDOM.type === 'text') {
        // 文本节点
        newElement = document.createTextNode(virtualDOM.props.textConent)
    }else{
        // 元素节点
        newElement = document.createElement(virtualDOM.type)
    }

    // 递归创建子节点
    console.log(virtualDOM)
    virtualDOM.children.forEach(child => {
        // 为什么不直接用 mountNativeElement 来转换呢？ 因为不确定子节点是否是组件节点或元素节点
        mountElement(child, newElement)
    })

    // 将转换后的 dom 对象 放置在页面中
    container.appendChild(newElement)
}
```

5. 在`src/index.html`中添加id 为 root 的元素， 在`src/index.js` 中使用render方法渲染到root节点中

>  index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TinyReact</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```



> index.js

```jsx

import TinyReact from './TinyReact'
    
const root = document.querySelector('#root')

const virtualDOM = (
    <div className="container">
        <h1>你好 Tiny React</h1>
        <h2>(编码必杀技)</h2>
        <div>
            嵌套1 <div>嵌套 1.1</div>
        </div>
        <h3>(观察: 这个将会被改变)</h3>
        {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
        {2 == 2 && <div>2</div>}
        <span>这是一段内容</span>
        <button onClick={() => alert("你好")}>点击我</button>
        <h3>这个将会被删除</h3>
        2, 3
    </div>
)

TinyReact.render(virtualDOM,root)

console.log(virtualDOM)
```

6. 创建 `src/TinyReact/createDOMElement.js` 文件，把虚拟元素dom 转换真实dom操作封装到 `createDOMElement`方法中，在 `src/TinyReact/mountNativeElement.js` 引入`createDOMElement` 方法

```javascript
import mountElement from './mountElement'

export default function createDOMElement (virtualDOM){
    let newElement = null

    if(virtualDOM.type === 'text') {
        // 文本节点
        newElement = document.createTextNode(virtualDOM.props.textConent)
    }else{
        // 元素节点
        newElement = document.createElement(virtualDOM.type)
    }

    // 递归创建子节点
    virtualDOM.children.forEach(child => {
        // 为什么不直接用 mountNativeElement 来转换呢？ 因为不确定子节点是否是组件节点或元素节点
        mountElement(child, newElement)
    })

    return newElement 
}
```

## 6. 为DOM 对象中添加属性

1. 创建`src/TinyReact/updateNodeElement.js`文件，在`src\TinyReact\createDOMElement.js` 中节点转换完毕执行`updateNodeElement(newElement, virtualDOM)`

```javascript
export default function updateNodeElement (newElement, virtualDOM) {
    // 获取节点对应的属性对象
    const newProps = virtualDOM.props

    Object.keys(newProps).forEach(propsName => {
        const newPropsValue = newProps[propsName]
        // 判断是否为事件属性 onClick -> click 
        if(propsName.slice(0, 2) === 'on') {
            // 事件名称
            const eventName = propsName.toLowerCase().slice(0, 2)
            // 为元素添加事件
            newElement.addEventListener(eventName, newPropsValue)
        
        }else if (propsName === 'value' || propsName === 'checked') { // 判断是否为 value 和 checked 
            newElement[propsName] = newPropsValue
        
        }else if (propsName !== 'children') {
            if (propsName === 'className'){
                newElement.setAttribute('class', newPropsValue)
            }else {
                //普通属性
                newElement.setAttribute(propsName, newPropsValue)
            }
        }
    })
}
```



## 7. 组件渲染之区分函数组件和类组件

1. 创建`src/TinyReact/isFunciton.js` 文件，导出一个同名方法， 使用这个方法区分 组件和普通dom元素，调用此方法的时候接收一个参数，这个参数就是virtualDOM

```javascript
export default function isFunciton (virtualDOM) {
    return virtualDOM && typeof virtualDOM.type === 'function'
}
```

2. 创建 `src/TinyReact/mountComponent.js` 文件，使用这个方法来处理组件。组件分为类组件和函数组件，所以方法还得细分 

```java
import isFuncitonComponent from './isFunctionComponent'

export default function mountComponent (virtualDOM, container) {
    // 判断组件是类组件还是函数组件
    if (isFuncitonComponent(virtualDOM)) {
        console.log('函数组件')
    }
}
```

3. 创建`src/TinyReact/isFuncitonComponent.js`  来区分类组件还是函数组件

```javascript
import isFunciton from './isFunction'

export default function isFuncitonComponent (virtualDOM) {
    const type = virtualDOM.type
    // 如果type 存在 如果 type是一个函数 并且 type没有render方法 认定为是一个函数组件
    return ( 
        type && isFunciton(virtualDOM) && !(type.prototype && type.prototype.render)
    )
}
```



## 8. 组件渲染之函数组件 `src/TinyReact/mountComponent.js`

```js
import isFunciton from './isFunction'
import isFuncitonComponent from './isFunctionComponent'
import mountNativeElement from './mountNatvieElement'

export default function mountComponent (virtualDOM, container) {
    let nextVirtualDOM = null
    // 判断组件是类组件还是函数组件
    if (isFuncitonComponent(virtualDOM)) {
        console.log('函数组件')
        nextVirtualDOM = buildFunctionComponent(virtualDOM)
    }

    //判断处理后的组件是否还是函数组件，直到没有函数组件才挂载到页面中
    if(isFunciton(nextVirtualDOM)){
        mountComponent(nextVirtualDOM, container)
    } else {
        // 挂载到页面中
        mountNativeElement(nextVirtualDOM, container)
    }
}

function buildFunctionComponent (virtualDOM) {
    return virtualDOM.type(virtualDOM.props)
}
```



## 9. 渲染类组件

1. 新建`src/TinyReact/Component.js` 类，挂载到TinyReact上

2. 创建类组件渲染方法 `src/TinyReact/mountComponent.js`

```javascript
// 判断组件是类组件还是函数组件
if (isFuncitonComponent(virtualDOM)) {
    // console.log('函数组件')
    // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
}else{
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM)
}


function buildClassComponent (virtualDOM) {
    const component = new virtualDOM.type()
    const nextVirtualDOM = component.render()
    return nextVirtualDOM
}
```

测试：  src/index.js 中添加以下代码测试

```jsx
class Alert extends TinyReact.Component {
    render () {
        return <div>hello react</div>
    }
}

TinyReact.render(<Alert></Alert>,root)
```



## 10. 组件渲染之类组件 props 处理

1. 在Component 类中

```javascript
export default class Component {
    constructor (props) {
        this.props = props
    }
}
```

2. 在buildClassComponent 方法里 创建实例的时候传入 props

```javascript
function buildClassComponent (virtualDOM) {
    const component = new virtualDOM.type(virtualDOM.props || {})
    const nextVirtualDOM = component.render()
    return nextVirtualDOM
}
```

3. 在类组件中增加 constructor 调用父类的构造函数

```jsx


class Alert extends TinyReact.Component {
    constructor(props){
        super(props)
    }
    render () {
        return <div>
            
            
            {this.props.name}
            {this.props.age}
        </div>
    }
}

TinyReact.render(<Alert name="张三" age={20}></Alert>,root)
```



## 11. React 设计原理解密及核心源码解读> 更新 DOM 元素之 VirtualDOM 对比

这两段jsx代码，在页面一上来的时候把第一段jsx代码渲染到页面中，接着延迟两秒之后，将第二段jsx代码渲染页面中替换第一段jsx代码，这两段代码节点相同，节点属性，节点内容不同

```jsx
const virtualDOM = (
    <div className="container">
        <h1>你好 Tiny React</h1>
        <h2 data-test="test">(编码必杀技)</h2>
        <div>
            嵌套1 <div>嵌套 1.1</div>
        </div>
        <h3>(观察: 这个将会被改变)</h3>
        {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
        {2 == 2 && <div>2</div>}
        <span>这是一段内容</span>
        <button onClick={() => alert("你好")}>点击我</button>
        <h3>这个将会被删除</h3>
        2, 3 <input type="text" value="123"></input>
    </div>
)

const modifyDOM = (
    <div className="container">
        <h1>你好 Tiny React</h1>
        <h2 data-test="test123">(编码必杀技)</h2>
        <div>
            嵌套1 <div>嵌套 1.1</div>
        </div>
        <h3>(观察: 这个将会被改变)</h3>
        {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
        {2 == 2 && <div>2</div>}
        <span>这是一段内容</span>
        <button onClick={() => alert("你好!!!!")}>点击我</button>
        <h3>这个将会被删除</h3>
        2, 3 <input type="text" value="123"></input>
    </div>
)

TinyReact.render(virtualDOM,root)   


setTimeout( () => {
    TinyReact.render(modifyDOM,root)   
}, 2000)
```

> 要实现更新页面中的dom元素，我们要实现virtualDOM对比，要把新的virtualDOM 和 旧的virtualDOM 对比从而找出差异部分，从而实现最小化更新
>
> 在进行 Virtual DOM 比对时，需要用到更新后的 Virtual DOM 和更新前的 Virtual DOM，更新后的 Virtual DOM 目前我们可以通过 render 方法进行传递，现在的问题是更新前的 Virtual DOM 要如何获取呢？
>
> 对于更新前的 Virtual DOM，对应的其实就是已经在页面中显示的真实 DOM 对象。既然是这样，那么我们在创建真实DOM对象时，就可以将 Virtual DOM 添加到真实 DOM 对象的属性中。在进行 Virtual DOM 对比之前，就可以通过真实 DOM 对象获取其对应的 Virtual DOM 对象了，其实就是通过render方法的第三个参数获取的，container.firstChild。
>
> 在创建真实 DOM 对象时为其添加对应的 Virtual DOM 对象

```javascript
// mountElement.js   
import mountElement from "./mountElement"

export default function mountNativeElement(virtualDOM, container) {
  // 将 Virtual DOM 挂载到真实 DOM 对象的属性中 方便在对比时获取其 Virtual DOM
  newElement._virtualDOM = virtualDOM
}
```

> 如何来对比节点属性呢，需要用新的节点属性对象和旧的节点属性对象对比，把对比后的差异部分更新到节点上



## 12. 节点类型不相同的情况)

> 节点类型不一样就没有比对的必要了，直接用新的dom替换旧的dom

```javascript
import createDOMElement from './createDOMElement'
import mountElement from './mountElement'
import updateNodeElement from './updateNodeElement'
import updateTextNode from './updateTextNode'

export default function diff (virtualDOM, container, oldDOM){
    const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
    // 判断oldDOM是否存在
    if(!oldDOM) {
        mountElement(virtualDOM, container)

        // 节点类型不想等 并且需要把 virtualDOM 是组件的情况排除
    } else if (virtualDOM.type !== oldVirtualDOM.type && typeof virtualDOM.type !== 'function'){
        // 不相等的情况下不需要比对，直接生成新的dom并替换
        const newElement = createDOMElement(virtualDOM)
        oldDOM.parentNode.replaceChild(newElement, oldDOM)
    } else if(oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
        if(virtualDOM.type == 'text'){  
            // 更新内容
            updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
        } else {
            // 更新元素属性
            updateNodeElement(oldDOM,virtualDOM,oldVirtualDOM)
        }


        virtualDOM.children.forEach((child, i) => {
            diff(child, oldDOM, oldDOM.childNodes[i])
        })
    }
}
```


当对比的元素节点类型不同时，就不需要继续对比了，直接使用新的 Virtual DOM 创建 DOM 对象，用新的 DOM 对象直接替换旧的 DOM 对象。当前这种情况要将组件刨除，组件要被单独处理。

```react
// diff.js
else if (
  // 如果 Virtual DOM 类型不一样
  virtualDOM.type !== oldVirtualDOM.type &&
  // 并且 Virtual DOM 不是组件 因为组件要单独进行处理
  typeof virtualDOM.type !== "function"
) {
  // 根据 Virtual DOM 创建真实 DOM 元素
  const newDOMElement = createDOMElement(virtualDOM)
  // 用创建出来的真实 DOM 元素 替换旧的 DOM 元素
  oldDOM.parentNode.replaceChild(newDOMElement, oldDOM)
} 
```

## 13 删除节点

删除节点发生在节点更新以后并且发生在同一个父节点下的所有子节点身上。

在节点更新完成以后，如果旧节点对象的数量多于新 VirtualDOM 节点的数量，就说明有节点需要被删除。

<img src="/images/5.png" width="40%" align="left"/>

```react
// 获取就节点的数量
let oldChildNodes = oldDOM.childNodes
// 如果旧节点的数量多于要渲染的新节点的长度
if (oldChildNodes.length > virtualDOM.children.length) {
  for (
    let i = oldChildNodes.length - 1;
    i > virtualDOM.children.length - 1;
    i--
  ) {
    oldDOM.removeChild(oldChildNodes[i])
  }
}
```

## 14 类组件状态更新

以下代码是要更新状态的类组件，在类组件的 state 对象中有默认的 title 状态，点击 change title 按钮调用 handleChange 方法，在 handleChange 方法中调用 this.setState 方法更改 title 的状态值。

```react
class Alert extends TinyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "default title"
    }
    // 更改 handleChange 方法中的 this 指向 让 this 指向类实例对象
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange() {
    // 调用父类中的 setState 方法更改状态
    this.setState({
      title: "changed title"
    })
  }
  render() {
    return (
      <div>
        <h2>{this.state.title}</h2>
        <p>{this.props.message}</p>
        <button onClick={this.handleChange}>change title</button>
      </div>
    )
  }
}
```

setState 方法是定义在父类 Component 中的，该方法的作用是更改子类的 state，产生一个全新的 state 对象。

```react
// Component.js
export default class Component {
  constructor(props) {
    this.props = props
  }
  setState (state) {
    // setState 方法被子类调用 此处this指向子类实例对象
    // 所以改变的是子类的 state 对象
    this.state = Object.assign({}, this.state, state)
  }
}
```

现在子类已经可以调用父类的 setState 方法更改状态值了，当组件的 state 对象发生更改时，要调用 render 方法更新组件视图。

在更新组件之前，要使用更新的 Virtual DOM 对象和未更新的 Virtual DOM 进行对比找出更新的部分，达到 DOM 最小化操作的目的。

在 setState 方法中可以通过调用 this.render 方法获取更新后的 Virtual DOM，由于 setState 方法被子类调用，this 指向子类，所以此处调用的是子类的 render 方法。

```react
// Component.js
setState(state) {
  // setState 方法被子类调用 此处this指向子类
  // 所以改变的是子类的 state
  this.state = Object.assign({}, this.state, state)
  // 通过调用 render 方法获取最新的 Virtual DOM
  let virtualDOM = this.render()
}
```

要实现对比，还需要获取未更新前的 Virtual DOM，按照之前的经验，我们可以从 DOM 对象中获取其对应的 Virtual  DOM 对象，未更新前的 DOM 对象实际上就是现在在页面中显示的 DOM 对象，我们只要能获取到这个 DOM 对象就可以获取到其对应的 Virtual DOM 对象了。

页面中的 DOM 对象要怎样获取呢？页面中的 DOM 对象是通过 mountNativeElement 方法挂载到页面中的，所以我们只需要在这个方法中调用 Component 类中的方法就可以将 DOM 对象保存在 Component 类中了。在子类调用 setState 方法的时候，在 setState 方法中再调用另一个获取 DOM 对象的方法就可以获取到之前保存的 DOM 对象了。

```react
// Component.js
// 保存 DOM 对象的方法
setDOM(dom) {
  this._dom = dom
}
// 获取 DOM 对象的方法
getDOM() {
  return this._dom
}
```

接下来我们要研究一下在 mountNativeElement 方法中如何才能调用到 setDOM 方法，要调用 setDOM 方法，必须要得到类的实例对象，所以目前的问题就是如何在 mountNativeElement 方法中得到类的实例对象，这个类指的不是Component类，因为我们在代码中并不是直接实例化的Component类，而是实例化的它的子类，由于子类继承了父类，所以在子类的实例对象中也是可以调用到 setDOM 方法的。

mountNativeElement 方法接收最新的 Virtual DOM 对象，如果这个 Virtual DOM 对象是类组件产生的，在产生这个 Virtual DOM 对象时一定会先得到这个类的实例对象，然后再调用实例对象下面的 render 方法进行获取。我们可以在那个时候将类组件实例对象添加到 Virtual DOM 对象的属性中，而这个 Virtual DOM 对象最终会传递给 mountNativeElement  方法，这样我们就可以在 mountNativeElement 方法中获取到组件的实例对象了，既然类组件的实例对象获取到了，我们就可以调用 setDOM 方法了。

在 buildClassComponent 方法中为 Virtual DOM 对象添加 component 属性， 值为类组件的实例对象。

```react
function buildClassComponent(virtualDOM) {
  const component = new virtualDOM.type(virtualDOM.props)
  const nextVirtualDOM = component.render()
  nextVirtualDOM.component = component
  return nextVirtualDOM
}
```

在 mountNativeElement 方法中获取组件实例对象，通过实例调用调用 setDOM 方法保存 DOM 对象，方便在对比时通过它获取它的 Virtual DOM 对象

```react
export default function mountNativeElement(virtualDOM, container) {
  // 获取组件实例对象
  const component = virtualDOM.component
  // 如果组件实例对象存在
  if (component) {
    // 保存 DOM 对象
    component.setDOM(newElement)
  }
}
```

接下来在 setState 方法中就可以调用 getDOM 方法获取 DOM 对象了

```react
setState(state) {
  this.state = Object.assign({}, this.state, state)
  let virtualDOM = this.render()
  // 获取页面中正在显示的 DOM 对象 通过它可以获取其对象的 Virtual DOM 对象
  let oldDOM = this.getDOM()
}
```

现在更新前的 Virtual DOM 对象和更新后的 Virtual DOM 对象就都已经获取到了，接下来还要获取到真实 DOM 对象父级容器对象，因为在调用 diff 方法进行对比的时候需要用到

```react
setState(state) {
  this.state = Object.assign({}, this.state, state)
  let virtualDOM = this.render()
  let oldDOM = this.getDOM()
  // 获取真实 DOM 对象父级容器对象
  let container = oldDOM.parentNode
}
```

接下来就可以调用 diff 方法进行比对了，比对后会按照我们之前写好的逻辑进行 DOM 对象更新，我们就可以在页面中看到效果了

```react
setState(state) {
    this.state = Object.assign({}, this.state, state)
    let virtualDOM = this.render()
    let oldDOM = this.getDOM()
    let container = oldDOM.parentNode
    // 比对
    diff(virtualDOM, container, oldDOM)
  }
```

## 15 组件更新

在 diff 方法中判断要更新的 Virtual DOM 是否是组件。

如果是组件再判断要更新的组件和未更新前的组件是否是同一个组件，如果不是同一个组件就不需要做组件更新操作，直接调用 mountElement 方法将组件返回的 Virtual DOM 添加到页面中。

如果是同一个组件，就执行更新组件操作，其实就是将最新的 props 传递到组件中，再调用组件的render方法获取组件返回的最新的 Virtual DOM 对象，再将 Virtual DOM 对象传递给 diff 方法，让 diff 方法找出差异，从而将差异更新到真实 DOM 对象中。

在更新组件的过程中还要在不同阶段调用其不同的组件生命周期函数。

在 diff 方法中判断要更新的 Virtual DOM 是否是组件，如果是组件又分为多种情况，新增 diffComponent 方法进行处理

```react
else if (typeof virtualDOM.type === "function") {
  // 要更新的是组件
  // 1) 组件本身的 virtualDOM 对象 通过它可以获取到组件最新的 props
  // 2) 要更新的组件的实例对象 通过它可以调用组件的生命周期函数 可以更新组件的 props 属性 可以获取到组件返回的最新的 Virtual DOM
  // 3) 要更新的 DOM 象 在更新组件时 需要在已有DOM对象的身上进行修改 实现DOM最小化操作 获取旧的 Virtual DOM 对象
  // 4) 如果要更新的组件和旧组件不是同一个组件 要直接将组件返回的 Virtual DOM 显示在页面中 此时需要 container 做为父级容器
  diffComponent(virtualDOM, oldComponent, oldDOM, container)
}
```

在 diffComponent 方法中判断要更新的组件是未更新前的组件是否是同一个组件

```react
// diffComponent.js
export default function diffComponent(virtualDOM, oldComponent, oldDOM, container) {
  // 判断要更新的组件和未更新的组件是否是同一个组件 只需要确定两者使用的是否是同一个构造函数就可以了
  if (isSameComponent(virtualDOM, oldComponent)) {
    // 属同一个组件 做组件更新  
  } else {
    // 不是同一个组件 直接将组件内容显示在页面中
  }
}
// virtualDOM.type 更新后的组件构造函数
// oldComponent.constructor 未更新前的组件构造函数
// 两者等价就表示是同一组件
function isSameComponent(virtualDOM, oldComponent) {
  return oldComponent && virtualDOM.type === oldComponent.constructor
}
```

如果不是同一个组件的话，就不需要执行更新组件的操作，直接将组件内容显示在页面中，替换原有内容

```react
// diffComponent.js
else {
  // 不是同一个组件 直接将组件内容显示在页面中
  // 这里为 mountElement 方法新增了一个参数 oldDOM 
  // 作用是在将 DOM 对象插入到页面前 将页面中已存在的 DOM 对象删除 否则无论是旧DOM对象还是新DOM对象都会显示在页面中
  mountElement(virtualDOM, container, oldDOM)
}
```

在 mountNativeElement 方法中删除原有的旧 DOM 对象

```javascript
// mountNavtiveElement.js
export default function mountNativeElement(virtualDOM, container, oldDOM) {
 // 如果旧的DOM对象存在 删除
  if (oldDOM) {
    unmount(oldDOM)
  }
}
```

```react
// unmount.js
export default function unmount(node) {
  node.remove()
}
```

如果是同一个组件的话，需要执行组件更新操作，需要调用组件生命周期函数

先在 Component 类中添加生命周期函数，子类要使用的话直接覆盖就可以

```react
// Component.js
export default class Component {
  // 生命周期函数
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps != this.props || nextState != this.state
  }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, preState) {}
  componentWillUnmount() {}
}
```

新建 updateComponent 方法用于更新组件操作，并在 if 成立后调用

```react
// diffComponent.js
if (isSameComponent(virtualDOM, oldComponent)) {
  // 属同一个组件 做组件更新
  updateComponent(virtualDOM, oldComponent, oldDOM, container)
}
```

在 updateComponent 方法中调用组件的生命周期函数，更新组件获取最新 Virtual DOM，最终调用 diff 方法进行更新

```react
import diff from "./diff"

export default function updateComponent(
  virtualDOM,
  oldComponent,
  oldDOM,
  container
) {
  // 生命周期函数
  oldComponent.componentWillReceiveProps(virtualDOM.props)
  if (
    // 调用 shouldComponentUpdate 生命周期函数判断是否要执行更新操作
    oldComponent.shouldComponentUpdate(virtualDOM.props)
  ) {
    // 将未更新的 props 保存一份
    let prevProps = oldComponent.props
    // 生命周期函数
    oldComponent.componentWillUpdate(virtualDOM.props)
    // 更新组件的 props 属性 updateProps 方法定义在 Component 类型
    oldComponent.updateProps(virtualDOM.props)
    // 因为组件的 props 已经更新 所以调用 render 方法获取最新的 Virtual DOM
    const nextVirtualDOM = oldComponent.render()
    // 将组件实例对象挂载到 Virtual DOM 身上
    nextVirtualDOM.component = oldComponent
    // 调用diff方法更新视图
    diff(nextVirtualDOM, container, oldDOM)
    // 生命周期函数
    oldComponent.componentDidUpdate(prevProps)
  }
}
```

```react
// Component.js
export default class Component {
  updateProps(props) {
    this.props = props
  }
}
```

## 16 ref 属性

为节点添加 ref 属性可以获取到这个节点的 DOM 对象，比如在 DemoRef 类中，为 input 元素添加了 ref 属性，目的是获取 input DOM 元素对象，在点击按钮时获取用户在文本框中输入的内容

```react
class DemoRef extends TinyReact.Component {
  handle() {
    let value = this.input.value
    console.log(value)
  }
  render() {
    return (
      <div>
        <input type="text" ref={input => (this.input = input)} />
        <button onClick={this.handle.bind(this)}>按钮</button>
      </div>
    )
  }
}
```

实现思路是在创建节点时判断其 Virtual DOM 对象中是否有 ref 属性，如果有就调用 ref 属性中所存储的方法并且将创建出来的DOM对象作为参数传递给 ref 方法，这样在渲染组件节点的时候就可以拿到元素对象并将元素对象存储为组件属性了。

```react
// createDOMElement.js
if (virtualDOM.props && virtualDOM.props.ref) {
  virtualDOM.props.ref(newElement)
}
```

在类组件的身上也可以添加 ref 属性，目的是获取组件的实例对象，比如下列代码中，在 DemoRef 组件中渲染了 Alert 组件，在 Alert 组件中添加了 ref 属性，目的是在 DemoRef 组件中获取 Alert 组件实例对象。

```react
class DemoRef extends TinyReact.Component {
  handle() {
    let value = this.input.value
    console.log(value)
    console.log(this.alert)
  }
  componentDidMount() {
    console.log("componentDidMount")
  }
  render() {
    return (
      <div>
        <input type="text" ref={input => (this.input = input)} />
        <button onClick={this.handle.bind(this)}>按钮</button>
        <Alert ref={alert => (this.alert = alert)} />
      </div>
    )
  }
}
```

实现思路是在 mountComponent 方法中，如果判断了当前处理的是类组件，就通过类组件返回的 Virtual DOM 对象中获取组件实例对象，判断组件实例对象中的 props 属性中是否存在 ref 属性，如果存在就调用 ref 方法并且将组件实例对象传递给 ref 方法。

```react
// mountComponent.js
let component = null
  if (isFunctionalComponent(virtualDOM)) {}
	else {
    // 类组件
    nextVirtualDOM = buildStatefulComponent(virtualDOM)
    // 获取组件实例对象
    component = nextVirtualDOM.component
  }
	// 如果组件实例对象存在的话
	if (component) {
   	// 判断组件实例对象身上是否有 props 属性 props 属性中是否有 ref 属性
    if (component.props && component.props.ref) {
      // 调用 ref 方法并传递组件实例对象
      component.props.ref(component)
    }
  }

```

代码走到这，顺便处理一下组件挂载完成的生命周期函数

```react
// 如果组件实例对象存在的话
if (component) {
  component.componentDidMount()
}
```

## 17 key 属性

在 React 中，渲染列表数据时通常会在被渲染的列表元素上添加 key 属性，key 属性就是数据的唯一标识，帮助 React 识别哪些数据被修改或者删除了，从而达到 DOM 最小化操作的目的。

key 属性不需要全局唯一，但是在同一个父节点下的兄弟节点之间必须是唯一的。

也就是说，在比对同一个父节点下类型相同的子节点时需要用到 key 属性。

## 18.1 节点对比

实现思路是在两个元素进行比对时，如果类型相同，就循环旧的 DOM 对象的子元素，查看其身上是否有key 属性，如果有就将这个子元素的 DOM 对象存储在一个 JavaScript 对象中，接着循环要渲染的 Virtual DOM 对象的子元素，在循环过程中获取到这个子元素的 key 属性，然后使用这个 key 属性到 JavaScript 对象中查找 DOM 对象，如果能够找到就说明这个元素是已经存在的，是不需要重新渲染的。如果通过key属性找不到这个元素，就说明这个元素是新增的是需要渲染的。

```react
// diff.js
else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
  // 将拥有key属性的元素放入 keyedElements 对象中
  let keyedElements = {}
  for (let i = 0, len = oldDOM.childNodes.length; i < len; i++) {
    let domElement = oldDOM.childNodes[i]
    if (domElement.nodeType === 1) {
      let key = domElement.getAttribute("key")
      if (key) {
        keyedElements[key] = domElement
      }
    }
  }
}
```

```react
// diff.js
// 看一看是否有找到了拥有 key 属性的元素
let hasNoKey = Object.keys(keyedElements).length === 0

// 如果没有找到拥有 key 属性的元素 就按照索引进行比较
if (hasNoKey) {
  // 递归对比 Virtual DOM 的子元素
  virtualDOM.children.forEach((child, i) => {
    diff(child, oldDOM, oldDOM.childNodes[i])
  })
} else {
  // 使用key属性进行元素比较
  virtualDOM.children.forEach((child, i) => {
    // 获取要进行比对的元素的 key 属性
    let key = child.props.key
    // 如果 key 属性存在
    if (key) {
      // 到已存在的 DOM 元素对象中查找对应的 DOM 元素
      let domElement = keyedElements[key]
      // 如果找到元素就说明该元素已经存在 不需要重新渲染
      if (domElement) {
        // 虽然 DOM 元素不需要重新渲染 但是不能确定元素的位置就一定没有发生变化
        // 所以还要查看一下元素的位置
        // 看一下 oldDOM 对应的(i)子元素和 domElement 是否是同一个元素 如果不是就说明元素位置发生了变化
        if (oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
          // 元素位置发生了变化
          // 将 domElement 插入到当前元素位置的前面 oldDOM.childNodes[i] 就是当前位置
          // domElement 就被放入了当前位置
          oldDOM.insertBefore(domElement, oldDOM.childNodes[i])
        }
      } else {
        mountElement(child, oldDOM, oldDOM.childNodes[i])
      }
    }
  })
}
```

```react
// mountNativeElement.js
if (oldDOM) {
  container.insertBefore(newElement, oldDOM)
} else {
  // 将转换之后的DOM对象放置在页面中
  container.appendChild(newElement)
}
```

## 18.2 节点卸载

在比对节点的过程中，如果旧节点的数量多于要渲染的新节点的数量就说明有节点被删除了，继续判断 keyedElements 对象中是否有元素，如果没有就使用索引方式删除，如果有就要使用 key 属性比对的方式进行删除。

实现思路是循环旧节点，在循环旧节点的过程中获取旧节点对应的 key 属性，然后根据 key 属性在新节点中查找这个旧节点，如果找到就说明这个节点没有被删除，如果没有找到，就说明节点被删除了，调用卸载节点的方法卸载节点即可。

```react
// 获取就节点的数量
let oldChildNodes = oldDOM.childNodes
// 如果旧节点的数量多于要渲染的新节点的长度
if (oldChildNodes.length > virtualDOM.children.length) {
  if (hasNoKey) {
    for (
      let i = oldChildNodes.length - 1;
      i >= virtualDOM.children.length;
      i--
    ) {
      oldDOM.removeChild(oldChildNodes[i])
    }
  } else {
    for (let i = 0; i < oldChildNodes.length; i++) {
      let oldChild = oldChildNodes[i]
      let oldChildKey = oldChild._virtualDOM.props.key
      let found = false
      for (let n = 0; n < virtualDOM.children.length; n++) {
        if (oldChildKey === virtualDOM.children[n].props.key) {
          found = true
          break
        }
      }
      if (!found) {
        unmount(oldChild)
        i--
      }
    }
  }
}
```

卸载节点并不是说将节点直接删除就可以了，还需要考虑以下几种情况

1. 如果要删除的节点是文本节点的话可以直接删除
2. 如果要删除的节点由组件生成，需要调用组件卸载生命周期函数
3. 如果要删除的节点中包含了其他组件生成的节点，需要调用其他组件的卸载生命周期函数
4. 如果要删除的节点身上有 ref 属性，还需要删除通过 ref 属性传递给组件的 DOM 节点对象
5. 如果要删除的节点身上有事件，需要删除事件对应的事件处理函数

```react
export default function unmount(dom) {
  // 获取节点对应的 virtualDOM 对象
  const virtualDOM = dom._virtualDOM
  // 如果要删除的节点时文本
  if (virtualDOM.type === "text") {
    // 直接删除节点
    dom.remove()
    // 阻止程序向下运行
    return
  }
  // 查看节点是否由组件生成
  let component = virtualDOM.component
  // 如果由组件生成
  if (component) {
    // 调用组件卸载生命周期函数
    component.componentWillUnmount()
  }
  
  // 如果节点具有 ref 属性 通过再次调用 ref 方法 将传递给组件的DOM对象删除
  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(null)
  }

  // 事件处理
  Object.keys(virtualDOM.props).forEach(propName => {
    if (propName.slice(0, 2) === "on") {
      const eventName = propName.toLowerCase().slice(2)
      const eventHandler = virtualDOM.props[propName]
      dom.removeEventListener(eventName, eventHandler)
    }
  })
	
  // 递归删除子节点
  if (dom.childNodes.length > 0) {
    for (let i = 0; i < dom.childNodes.length; i++) {
      unmount(dom.childNodes[i])
      i--
    }
  }
  	
  dom.remove()
}

```

