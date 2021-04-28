# 服务端渲染基础


**spa 应用技术栈 `angular` ` react` `vue`**

- 优点
  - 用户体验好
  - 开发效率高
  - 渲染性能好
  - 可维护性好
- 缺点
  - 首屏渲染时间长
    - 使用js在客户端生成html，用户需要等待客户端js解析完才能生成页面
  - 不利于SEO
    - 搜索引擎抓取网站html文件的时候没有内容



## 借鉴了传统的服务端渲染

![image-20201220202656292.png][1]

客户端激活为spa

![image-20201220202722463.png][2]





## 同构应用

- 通过服务端渲染首屏直出，解决spa应用首屏渲染慢已经不利于seo问题
- 通过客户端渲染接管页面交互得到更好的用户体验
- 这种方式通常称之为现代化的服务端渲染，也叫同构渲染-
- 这种方式构建的应用成为服务端应用或者同构应用





## 相关概念

- 什么是渲染
- 传统的服务端渲染
- 客户端渲染
- 现代化的服务端渲染（同构渲染）





## 什么是渲染

![image-20201220203204011.png][3]

渲染： 把【数据】+【模板】拼接到一起

本质： 字符串的解析替换

需要关注： 在哪里渲染？





## 传统的服务端渲染

早期的web页面渲染都是在服务端进行的

流程图：

![image-20201220203451047.png][4]





## 通过nodejs演示传统服务端渲染模式

- nodejs

```javascript
const express = require("express");
const fs = require("fs");
const template = require("art-template");
const app = express();



app.get("/", (req , res)=>{
    // 1.获取页面模板
    const templateStr = fs.readFileSync("./index.html", "utf-8");
    console.log(templateStr)
    // 获取数据
    const data =  fs.readFileSync("./data.json", "utf-8");
    // 渲染演示这是怎么搞的
    const html = template.render(templateStr, JSON.parse(data));
    // 渲染结果发送给哭护短
    res.send(html);
});

app.listen(3000,()=>{console.log("开始了")})
```



- html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
</head>
<body>
    {{ data }}



    <ul>
        {{ each list }}
        <li>{{ $value }}</li>
        {{ /each}}
    </ul>
</body>
</html>
```

- 数据

```json
{
    "data":"这是数据",
    "title": "这是title",
    "list":[
        "这是第1个",
        "这是第2个",
        "这是第3个",
        "这是第4个",
        "这是第5个",
        "这是第6个"
    ]
}
```



**这种方式缺点:**

- 前后端代码完全耦合在一起，不利于开发和维护
- 前端没有足够发挥空间
- 服务端压力大
- 用户体验一般

如果应用没有很复杂这种方式完全可取







## 客户端渲染

`ajax`是的客户端动态获取数据成为可能

服务端渲染工作来到客户端

**客户端渲染流程：**

![image-20201220211312221.png][5]



**缺点：**

- 首屏渲染慢

- 不利于SEO



## 为什么首屏渲染慢

单页应用最少三次http请求周期

1.  html文件请求
2. js对应的请求
3. 动态数据的请求

  

## 为什么不利于seo

- 搜索引擎需要知道你的网站里面有什么
- 通过程序获取网页内容

**模拟搜索引擎**

```javascript
const https = require("https");
https.get("https://testwrongbook.ys100.com/", res => {
    let data ="";

    res.on("data", chunk => {
        data += chunk;
    })

    res.on("end", () => {
        console.log(data);
    })
})
```

**返回结果**

```html
<!DOCTYPE html><html lang=en><head><script src=/config.js></script><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=viewport content="width=devled.ice-width,initial-scale=1,maximum-scale=1,user-scalable=0"><link rel=icon href=/favicon.ico><title>yswrongbook</title><script src=https://cdn.bootcdn.net/ajax/libs/vConsole/3.3.4/vconsole.min.js></script><link href=/js/chunk-01c7d5bd.13a96526.js rel=prefetch><link href=/js/chunk-0a9fbd9b.91586cab.js rel=prefetch><link href=/js/chunk-0e78f884.c4cadb58.js rel=prefetch><link href=/js/chunk-19719ce0.be351711.js rel=prefetch><link href=/js/chunk-1ebad4ef.0438e97d.js rel=prefetch><link href=/js/chunk-1f05069f.691a270f.js rel=prefetch><link href=/js/chunk-3808959a.2e265fce.js rel=prefetch><link href=/js/chunk-45d766e2.4cffc803.js rel=prefetch><link href=/js/chunk-48074086.2f1db839.js rel=prefetch><link href=/js/chunk-4d8f5664.b3daaab9.js rel=prefetch><link href=/js/chunk-4daa424c.051b7b48.js rel=prefetch><link href=/js/chunk-536901db.c8d36a6d.js rel=prefetch><link href=/js/chunk-5a6f628d.1447fb58.js rel=prefetch><link href=/js/chunk-5b26eb3e.d8cab2c5.js rel=prefetch><link href=/js/chunk-5e171aa6.f8f6d058.js rel=prefetch><link href=/js/chunk-7e80a721.91eeccfd.js rel=prefetch><link href=/js/chunk-962633ec.b92bae96.js rel=prefetch><link href=/js/chunk-be71ac9a.8097f892.js rel=prefetch><link href=/js/chunk-e178e3b4.08dfa86d.js rel=prefetch><link href=/js/chunk-fe7a5040.613ef96f.js rel=prefetch><link href=/js/app.132edaea.js rel=preload as=script><link href=/js/chunk-vendors.a35f9318.js rel=preload as=script></head><body><noscript><strong>We're sorry but yswrongbook doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript><div id=app></div><script src=/js/chunk-vendors.a35f9318.js></script><script src=/js/app.132edaea.js></script></body></html>
```

任何地址都返回结果如上没法做seo







## 现代化服务端渲染

**优点： **
- 基于React、Vue等框架，客户端渲染和服务端渲染的结合
  - 服务端执行一次，用于基于实现服务端渲染（首屏直出）
  - 在客户端再执行一次，用于接管页面交互
- 核心结婚SEO和首屏渲染慢的问题
- 拥有传统服务端渲染的有点，也有客户端渲染的优点

**渲染流程图：**

![image-20201220214455746.png][6]



**如何实现同构渲染？**

- 使用Vue、React等框架的官方解决方案
  - 优点： 有助于理解原理
  - 缺点： 需要搭建环境、比较麻烦
- 使用第三方解决方案
  - React生态的Next.js
  - Vue生态的Nuxt.js





## 通过Nuxt体验同构渲染

- 初始化项目`npm init`
- 安装Nuxt.js `npm install nuxt --save`
- 创建pages文件夹
- 创建index.vue文件

- 安装axios  `npm install axios --save`
- 编写页面内容（注意请求路径需要完整因为服务端渲染请求地址/会映射到80端口）

```vue
<template>
    <div>
        <h1>hello word</h1>
        <p>{{ data }}</p>
    </div>
</template>

<script>
import axios from "axios"
export default {
    name: "index",
    // Nuxt中特殊提供的一个钩子函数，专门用于获取页面服务渲染出来的数据
    async asyncData(){
        const {data} = await axios({
            method: 'GET',
            url: "http://127.0.0.1:3000/data.json"
        });
        return data;
    }
}
</script>


<style scoped>

</style>
```

- 创建static文件创建data.json 文件模拟接口测试
- 访问测试
  - html携带了数据渲染后的html内容



## 同构渲染应用的问题
- 开发条件有限
  - 浏览器特定的代码只能在某些生命周期狗子函数中使用
  - 一些外部扩展库可能需要特殊处理才能在服务端渲染应用中运行
  - 不能在服务端渲染期间操作DOM
  - ........
  - 某些代码操作需要区分运行环境

- 涉及构建和部署的要求更多

|      | 客户端渲染                | 同构渲染                |
| ---- | ------------------------- | ----------------------- |
| 构建 | 仅构建客户端应用即可      | 需要构建两个端          |
| 部署 | 可以部署在任意web服务器中 | 只能部署在nodejs server |

- 更多的服务端负载	
  - 在node中渲染完整的应用程序，相比仅仅只提供静态文件的服务器 需要大量占用cpu资源
  - 如果应用在高流量环境下使用，需要准备相应的服务器复杂
  - 需要更多的服务端优化工作处理
  - ........

**服务端渲染使用建议**

- 首屏渲染速度是否真的重要？
- 是否真的需要SEO？


  [1]: http://typecho.heart.xn--6qq986b3xl/usr/uploads/2020/12/3410484345.png
  [2]: http://typecho.heart.xn--6qq986b3xl/usr/uploads/2020/12/476988816.png
  [3]: http://typecho.heart.xn--6qq986b3xl/usr/uploads/2020/12/69458809.png
  [4]: http://typecho.heart.xn--6qq986b3xl/usr/uploads/2020/12/1906842682.png
  [5]: http://typecho.heart.xn--6qq986b3xl/usr/uploads/2020/12/4074123239.png
  [6]: http://typecho.heart.xn--6qq986b3xl/usr/uploads/2020/12/2694484501.png