# vue3.0

- 源码组织方式的变化
  - 采用ts重写
  - 独立的功能模块提取到单独的包中
  - 90%的api兼容Vue2.x
- Composition API
  - 组合api
  - 解决vue2.x options api 开发大型项目不好拆分和重用的问题
- 性能提升
  - 重写响应式
  - 重写虚拟dom
  - 提升两到三倍
- Vite
  - 不需要打包直接运行项目



- 源码组织方式
  - 源码采用typescript重写
  - 使用monorepo管理项目结构
    - 每个模块都可以单独发布测试使用



##  packages  结构

```javascript
packages
│   compiler-core  ------ 与平台无关的编译器
│   compiler-dom   ------ 浏览器平台下的编译器
│   compiler-sfc   ------ 单文件组件的编译器  依赖于 core dom
|   compiler-ssr   ------ 服务端渲染的编译器  依赖于 dom
|   reactivity     ------ 响应式系统可以单独使用
|   runtime-core   ------ 和平台无关的运行时
|   runtime-dom    ------ 浏览器的运行时 处理原生dom的api事件等
|   runtime-test   ------ 专门为测试编写的轻量级的运行时 渲染出来的dom数是js对象 可以运行在所有的js环						  境里 用来测试渲染是否正确  
|   server-renderer ----- 服务端渲染
|   shared         ------ vue内部使用的公共的api
|	size-check     ------ 私有的包不会发布npm 检查包的大小
|   template-explorer --- 浏览器运行的实时编译组件 输出render函数
|   vue            ------ 构建完整版的vue 依赖于 compiler rentime
global.d.ts
```



## 不同构建版本

不再构建 umd 模块的方式 因为umd代码冗余

在packags/vue/dist 文件夹中存放了vue3的所有构建版本

## cjs 

> commonjs 方式 完整版的vue

- vue.cjs.js     开发版本
- vue.cjs.prod.js    生产版本 代码压缩过

## global 

> 都可以在浏览器中通过script直接引入使用 引入之后会创建一个全局的vue对象 

- 完整版
  - vue.global.js  开发版本
  - bue.global.prod.js  生产版本 代码压缩过
- 运行时
  - vue.runtime.global.js    开发版本
  - vue.runtime.global.prod.js  生产版本 代码压缩过

## browser 

> 都包含esm，浏览器原生模块化方式  script type="module" 方式引入

- 完整版
  - vue.esm-browser.js
  - vue.esm-browser.prod.js
- 运行版本
  - vue.runtime.ems-browser.js
  - vue.runtime.esm-browser.prod.js

## bundler

> 没有打包所有代码 配合打包工具使用 esm 方式

- 完整版 内部导入了 runtime compiler
  - vue.esm-bundle.js
- 运行时 vue最小版本
  - vue.runtime.ems-bundler.js





## Composition API 设计动机

- [RFC (Request For Comments)](https://github.com/vuejs/rfcs)
- [Composition API RFC](https://v3.vuejs.org/guide/composition-api-introduction.html)



## Options API 

- 包含一个描述组件选项(data、methods、props等)的对象
- Options API 开发复杂组件，同一个功能逻辑的代码被拆分到不同选项中

##  composition API

- vue.js 3.0 新增的一组API
- 一组基于函数的API
- 可以灵活的组件组件的逻辑

## Options API 和 composition API 对比

![!\[optionsApi vs compoition api \](D:\setting\桌面\optionsApi vs compoition api .png)][1]

相比 options api ， composition api 把功能整合到一个函数 只需要在 setup 时直接获取 只需要关注功能函数



![img](https://img2020.cnblogs.com/blog/1161361/202102/1161361-20210203191859382-111855115.png)

同一色块代表同一功能

- options api 相同的功能代码被拆分到不同位置 不方便提取复用代码

- composition api 相同的功能代码在同一位置 方便代码提取复用代码
- composition api 提供了基于函数的api 可以更灵活的组织组件逻辑

- vue3 中 options api 和 composition api 都可以使用



##  vue3 性能提升

## 响应式系统升级

-  vue 2.x 中响应式系统的核心 defineProperty
  - 初始化时遍历data中的成员 转化为get set 如果是对象需要递归处理 不管使用与否都需要在初始化时处理
  - 监听不到属性的删除
- vue 3.x 中使用Proxy 对象重写响应式系统
  - 可以监听动态新增的属性
  - 可以监听删除的属性
  - 可以监听数组的索引和length属性
- proxy 比 definePropery 性能要高

## 编译优化

- vue 2 中 通过标记静态根节点，优化diff过程
- vue 3 中 标记和提升所有的静态根节点， diff的时只需要通过对比动态节点内容
  - fragments（升级 vetur 插件）
  - 静态提升
  - Patch flag
  - 缓存事件处理函数

## 源码体积优化

- vue 3 中移除了一些不常用的API 
  - 例如 inline-template、filter等
- Tree-shaking
  - 不会使用的api不会打包进入 vue核心文件会打入



## Vtie（法语 快的意思）

ES Module

- 现代浏览器都支持 es module 
- 通过下面方式加载
  - `<script type ="module" src="..."></script>`

- 支持模块的script 默认延迟加载
  -  类似于script标签设置 defer 
  - 在文档解析完成后，触发DOMContentLoaded事件前执行



## vite vs Vue-Cl

- vite 在开发模式下不需要打包可以直接运行
- vue-cli 开发模式下必须对项目打包才可以运行

- Vite 在生产环境下使用Rollup打包
  - 基于es Module的方式打包
- vue-cli 使用webpack打包
- vite 特点
  - 快速冷启动
  - 按需编译
  - 模块热更新

## vite创建项目

- vite 创建项目
  - `npm init vite-app <项目名>`
- 基于模板创建项目 可以支持其他框架 --template 加 框架名
  - `npm init vite-app --template react `

vite 拦截.vue 的请求  转换为js文件 把响应头改为  `Content-Type: application/javascript; charset=UTF-8`  





## composition api

- createApp 
  - 创建vue对象

```javascript
 import { createApp } from 'vue'
 const app = createApp({
 	.....
 })
```



- setup() composition API 入口

  - 第一个参数props
  - 第二个参数 context是一个对象 有三个成员: attrs, emit, slots
  - 在props 解析完毕 组件实例被创建之前执行的 无法通过this来访问组件实例 this指向 undefined
  - 必须return 一个对象
  - 响应式对象不能解构

```javascript
   import { createApp } from 'vue'
   const app = createApp({
    setup () {
    	return {
    		....
    	}
    }
   	.....
   })
```

  



- reactive api
  - 把一个对象转换为响应式对象这个对象的嵌套对象也会转换为响应式对象
  - 返回代理对象也就是响应式对象

```javascript
   import { createApp, reactive } from 'vue'
   const app = createApp({
    setup () {
    	return {
    		....
    	}
    }
   })
```



## 生命周期钩子函数

setup中调用生命周期狗子函数 需要在函数前面加 `on` 并且首字母大写

- beforeCreate  
  - setup在这里执行
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted  
- errorCaptured
- renderTracked  render函数被重新调用时触发  首次会触发
- renderTriggered   首次不触发

```javascript
 import { createApp, reactive, onMounted, onUnmounted} from 'vue'
   const app = createApp({
    setup () {
        
        
      onMounted(() => {
        ......
      })

      onUnmounted(() => {
        ......
      })
        
      return {
          ......
      }
    }
   })
```



## reactive/ toRefs/ref

都是创建响应式

## reactive 创建的响应式的对象  不能解构 ***function***

reactive 创建的响应式的对象  代理对象解构的时候 相当于复制一份值 重新赋值的时候不会触发代理对象的get set 所以不能解构

## toRefs ***function***

把对象的每一个属性都转换成响应式对象 ， toRefs 要求传入的对象必须是一个响应式对象，内部会创建一个新的对象遍历传入对象的所有属性，把所有的属性值都转换为响应式对象，挂载到新创建的对象上 返回这个新对象，她内部会为代理对象的每一个属性创建一个带有value的对象 该对象是响应式的 value具有get set ，get获取代理对象的值   set设置代理对象的值

- 模板中使用可以省略value  
- 代码中使用不能省略value

## ref ***function***

把基本数据类型转换为响应式对象

ref返回一个响应式对象 具有value属性 value属性为设置的值

基本数据类型保存的是一个值 

```javascript
 import { createApp, ref } from './node_modules/vue/dist/vue.esm-browser.js'
    
    function useCount () {
      const count = ref(0)
      return {
        count,
        increase: () => {
          count.value++
        }
      }
    }

    createApp({
      setup () {
        return {
          ...useCount()
        }        
      }
    }).mount('#app')
```



## computed 计算属性

- 第一种方法
  - `watch(() => count.value + 1)`
- 第二种方法
  - 传入一个对象具有get set方法

```javascript
import { createApp, reactive, computed } from './node_modules/vue/dist/vue.esm-browser.js'
    const data = [
      { text: '看书', completed: false },
      { text: '敲代码', completed: false },
      { text: '约会', completed: true }
    ]

    createApp({
      setup () {
        const todos = reactive(data)

        const activeCount = computed(() => {
          return todos.filter(item => !item.completed).length
        })

        return {
          activeCount,
          push: () => {
            todos.push({
              text: '开会',
              completed: false
            })
          }
        }
      }
    }).mount('#app')
```



## watch 监听器

- watch的三个函数
  - 第一个参数: 要监听的数据
  - 第二个参数：监听到数据变化后执行的函数，这个函数有两个参数分别是新值与旧值
  - 第三个参数：选项对象，deep(深度监听)和immediate (立即执行)

- watch的返回值
  - 取消监听的函数

```javascript
 import { createApp, ref, watch } from './node_modules/vue/dist/vue.esm-browser.js'

    createApp({
      setup () {
        const question = ref('')
        const answer = ref('')

        watch(question, async (newValue, oldValue) => {
          const response = await fetch('https://www.yesno.wtf/api')
          const data = await response.json()
          answer.value = data.answer
        })

        return {
          question,
          answer
        }
      }
    }).mount('#app')
```



##  watchEffect

- 是watch函数的简化版本，也用来监视数据的变化
- 接受一个函数作为参数，监听函数内响应试数据的变化
- 返回的函数执行之后将取消监视

```javascript
import { createApp, ref, watchEffect } from './node_modules/vue/dist/vue.esm-browser.js'

    createApp({
      setup () {
        const count = ref(0)
        const stop = watchEffect(() => {
          console.log(count.value)
        })

        return {
          count,
          stop,
          increase: () => {
            count.value++
          }
        }
      }
    }).mount('#app')
```


  [1]: https://typecho.heart.xn--6qq986b3xl/usr/uploads/2021/02/954540656.png