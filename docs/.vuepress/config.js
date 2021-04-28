module.exports = {
    head: [ // 设置 favor.ico，html/head 标题中添加 style 标签
        [
            'link', {
                rel: 'icon',
                href: `favicon.ico`
            }
        ]
    ],
    title: '小马哥的日常生活', // 设置网站标题
    description: '抓紧时间做我喜欢的事',
    base: '/', //默认路径
    activeHeaderLinks: true, // 默认值：true
    sidebarDepth: 4,
    themeConfig: { // 主题设置
        nav: [{ // 右上导航航条 docs/.vuepress 文件夹下
            text: '主页',
            link: '/'
        }, {
            text: '笔记',
            items: [
                {
                    text: 'JavaScript 深度剖析',
                    link: '/note_work/take/'
                },
                {
                    text: 'ECMAScript 新特性',
                    link: '/note_work/ecma-new/'
                },
                {
                    text: 'Vue.js 框架源码与进阶',
                    link: '/note_work/vue-source-code/'
                },
                {
                    text: 'React 框架原理与实战',
                    link: '/note_work/react-principle/'
                },
            ]
        }],
        sidebar: {
            // javascript 深度刨析
            '/note_work/take/': [
                '',
                'higher-order-function',   /* 高阶函数 */
                'closure',   /* 闭包 */
                'holomorphic-function',   /* 纯函数 */
                'currying', /** 柯里化 */
                'function-group', /** 函数组合 */
                'asynchronous', /** javascript 异步编程 */
                'generator', /** generator 异步方案 */
                'async-await', /** async/await 语法糖 */
                'promise', /** promose源码解析 */
            ],
            '/note_work/ecma-new/': [
                '',
                'let-block', /**  ES2015 let 与块级作用域 */
                'array-deconstruction', /** ES2015 数组的解构 */
                'arrow-function', /** ES2015函数参数默认值and箭头函数 */
                'es2015-literal', /** ES2015 object新增方法 */
                'object', /** ES2015 object新增方法 */
                'es2015-proxy', /** ES2015 Proxy => (Object.defineproperty); */
                'reflect', /** ES2015 Reflect */
                'es2015-class', /**  es2015 class */
                'data-structure', /** ES2015 数据结构（类型） */
                'es2015-for-of', /** ES2015 for...of 循环 */
                'generator',
                'es2016', /** es2016 */
                'es2017', /** es2017 */
                'markdown', /** markdown基础语法 */
            ],
            '/note_work/vue-source-code/':[
                '',
                'vuex-flow', /** Vuex 数据流管理 */
                'ssr-service', /** 服务端渲染基础 */
                'nuxtjs', /** nuxtjs 基础 */
                'nuxt', /** nuxt-综合案例 */
                'vue3', /** vue3 */
                'vue-responsive', /** vue3响应式原理 */
                'vite', /** vite */
            ],
            '/note_work/react-principle/': [
                '',/** react基础回顾 */
                'react-vrtualdom', /** VirtualDOM 及 Diff 算法 */
            ]
        }
    }
}