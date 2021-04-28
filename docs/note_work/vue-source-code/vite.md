# vite

- vite 是一个面向现代浏览器的一个更轻、更快的web应用开发工具
- 它基于ECMAScript标准原生模块系统 (ES Modules)实现
- 为了解决webpack dev server冷启动时间过长，另外webpack hmr热更新反应慢的问题
- 使用vite创建的项目就是普通的vue3的应用，相比vue cli的项目少了许多配置文件和依赖

## vite项目依赖

vite创建的项目开发依赖非常简单只有vite和@vue/compiler-sfc 

- vite 
- @vue/compiler-sfc
  - 用来编译.vue结尾的单文件组件vue2使用的是vue-template-compiler
  - vite只支持vue3，通过配置模板可以支持其他框架

## 基础使用

- vite server
  - 开启一个用于开发的web服务器启动服务器的时候不需要编译所有文件启动速度非常的快
- vite build

vite

运行vite serve 的时候不需要打包直接开启一个web服务器，当浏览器请求服务器例如请求一个单文件组件，这个时候在服务器端编译单文件组件，然后把编译的结果返回给浏览器，注意这里的编译时在服务器端另外模块的处理是在请求到服务器端处理的。vite利用现代浏览器原生支持的es module模块化的特性省略了对模块的打包对需要编译的文件，例如单文件组件样式模块等， vite采用即时编译。也就是说只有具体请求某个模块的时候，才会在服务端编译该文件。这种好处体现在按需编译，速度会更快

![vite serve.png][1]

vue-cli

运行 vue-cli-service serve 的时候内部会使用webpack首先去打包所有的模块，如果模块较多打包的速度会非常慢，把打包的结果存储到内存中，然后才会开启web服务器，浏览器请求web服务器把内存中打包的结果返回给浏览器，像webpack这类的工具他的做法是将所有的模块提前编译打包到bundle里。随着项目越来越大打包的bundle也越来越大打包的熟读自然越来越慢

![vue cli service.png][2]



## HMR

- vite HMR
  - 立即编译当前所有修改文件
- webpack HMR 
  - 会自动以这个文件为入口重写build一次，所有涉及到的依赖也都会被加载一遍



## build

打包命令 ： vite build，采用rollup打包，最终还是会把文件打包到一起。对于代码切割的需求，vite采用原生动态导入功能实现的，所以打包结果只支持现代浏览器，不过有Polyfill

- vite build
  - rollup
  - Dynamic import
    - Polyfill



## 打包or不打包

随着vite的出现，到底要不要打包呢？

- 使用webpack打包的两个原因
  - 浏览器环境并不支持模块化
    - 现代浏览器基本都支持了
  - 零散的模块文件会产生大量的http请求
    - http2已经解决，可以复用链接



## 浏览器对es module 支持现状

![vite 支持.png][3]



vite 创建的项目基本不需要额外配置

- typescript - 内置支持
- less/sass/stylus/postcss-内置支持(需要单独安装)
- JSX
- web assembly
  - WebAssembly 是一种可以使用非 JavaScript 编程语言编写代码并且能在浏览器上运行的技术方案

## vite 特性

- 快速冷启动
- 模块热更新
- 按需编译
- 开箱即用



## vite 实现原理



## vite核心功能

- 静态web服务器
- 编译单文件组件
  - 拦截浏览器不识别的模块，并处理
- HMR （热更新）



## vite实现原理-静态web服务器

引入koa 开启静态服务器，返回index.html页面

```javascript
#!/usr/bin/env node
const Koa = require('koa')
const send = require('koa-send')
// 1. 静态文件服务器
app.use(async (ctx, next) => {
  await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html' })
  await next()
})
app.listen(3000)
console.log('Server running @ http://localhost:3000')
```

npm link ，在vue3项目中测试上面开发的vite工具，发现控制台报错使用import导入的时候要求相对路径



## Vite 实现原理-修改第三方模块的路径

处理请求第三方模块问题

- 加载第三方模块的import 路径改变为node_modules下面的模块
- 请求node_modules的模块加载node_modules中的文件

>  修改第三方模块的路径

```javascript
const streamToString = stream => new Promise((resolve, reject) => {
  const chunks = []
  //监听到读取数据存储到chunks数组
  stream.on('data', chunk => chunks.push(chunk))
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  stream.on('error', reject)
})

app.use(async (ctx, next) => {
  if (ctx.type === 'application/javascript') {
    const contents = await streamToString(ctx.body)
    // import vue from 'vue'
    // import App from './App.vue'
    ctx.body = contents
      .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
      .replace(/process\.env\.NODE_ENV/g, '"development"')
  }
})
```



## Vite 实现原理-加载第三方模块

```javascript
app.use(async (ctx, next) => {
  // ctx.path --> /@modules/vue
  if (ctx.path.startsWith('/@modules/')) {
    const moduleName = ctx.path.substr(10)
    const pkgPath = path.join(process.cwd(), 'node_modules', moduleName, 'package.json')
    const pkg = require(pkgPath)
    ctx.path = path.join('/node_modules', moduleName, pkg.module)
  }
  await next()
})
```



## Vite 实现原理-编译单文件组件

浏览器不能加载.vue组件和css样式只能处理js。vite 处理单文件组件发起两次请求，第一次处理为组件选项，第二次把.vue文件编译为render函数。处理在静态服务之后修改第三方模块路径之前

```javascript
const { Readable } = require('stream')
const stringToStream = text => {
  const stream = new Readable()
  stream.push(text)
  stream.push(null)
  return stream
}
// 4. 处理单文件组件
app.use(async (ctx, next) => {
  if (ctx.path.endsWith('.vue')) {
    const contents = await streamToString(ctx.body)
    const { descriptor } = compilerSFC.parse(contents)
    let code
    if (!ctx.query.type) {
      code = descriptor.script.content
      // console.log(code)
      code = code.replace(/export\s+default\s+/g, 'const __script = ')
      code += `
      import { render as __render } from "${ctx.path}?type=template"
      __script.render = __render
      export default __script
      `
    } else if (ctx.query.type === 'template') {
      const templateRender = compilerSFC.compileTemplate({ source: descriptor.template.content })
      code = templateRender.code
    }
    ctx.type = 'application/javascript'
    ctx.body = stringToStream(code)
  }
  await next()
})
```



> 全部代码，只处理单文件组件

```javascript
#!/usr/bin/env node
const path = require('path')
const { Readable } = require('stream')
const Koa = require('koa')
const send = require('koa-send')
const compilerSFC = require('@vue/compiler-sfc')
import xxx from '2132132'


compone: () => import(123123)

const app = new Koa()

const streamToString = stream => new Promise((resolve, reject) => {
  const chunks = []
  stream.on('data', chunk => chunks.push(chunk))
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  stream.on('error', reject)
})

const stringToStream = text => {
  const stream = new Readable()
  stream.push(text)
  stream.push(null)
  return stream
}

// 3. 加载第三方模块
app.use(async (ctx, next) => {
  // ctx.path --> /@modules/vue
  if (ctx.path.startsWith('/@modules/')) {
    const moduleName = ctx.path.substr(10)
    const pkgPath = path.join(process.cwd(), 'node_modules', moduleName, 'package.json')
    const pkg = require(pkgPath)
    ctx.path = path.join('/node_modules', moduleName, pkg.module)
  }
  await next()
})

// 1. 静态文件服务器
app.use(async (ctx, next) => {
  await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html' })
  await next()
})

// 4. 处理单文件组件
app.use(async (ctx, next) => {
  if (ctx.path.endsWith('.vue')) {
    const contents = await streamToString(ctx.body)
    const { descriptor } = compilerSFC.parse(contents)
    let code
    if (!ctx.query.type) {
      code = descriptor.script.content
      // console.log(code)
      code = code.replace(/export\s+default\s+/g, 'const __script = ')
      code += `
      import { render as __render } from "${ctx.path}?type=template"
      __script.render = __render
      export default __script
      `
    } else if (ctx.query.type === 'template') {
      const templateRender = compilerSFC.compileTemplate({ source: descriptor.template.content })
      code = templateRender.code
    }
    ctx.type = 'application/javascript'
    ctx.body = stringToStream(code)
  }
  await next()
})

// 2. 修改第三方模块的路径
app.use(async (ctx, next) => {
  if (ctx.type === 'application/javascript') {
    const contents = await streamToString(ctx.body)
    // import vue from 'vue'
    // import App from './App.vue'
    ctx.body = contents
      .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
      .replace(/process\.env\.NODE_ENV/g, '"development"')
  }
})

app.listen(3000)
console.log('Server running @ http://localhost:3000')
```


  [1]: https://typecho.heart.xn--6qq986b3xl/usr/uploads/2021/03/3645092891.png
  [2]: https://typecho.heart.xn--6qq986b3xl/usr/uploads/2021/03/2946696864.png
  [3]: https://typecho.heart.xn--6qq986b3xl/usr/uploads/2021/03/1263401404.png