# 为什么要学习函数式编程
- 方便测试、方便并行处理
- 函数式编程可以抛弃this
- 函数式编程收到越来越多的关注
- 有很多库可以帮助我们进行函数式开发：[lodash](https://www.lodashjs.com/) 、[underscore](http://underscorejs.org/) 、[ramda](https://ramda.cn/[)

## 什么是函数式编程
函数式编程(Functional Programming FP)  FP是编程规范式之一
- 面向对象编程思维方式 ：把现实世界中的事物抽象成程序世界中的类和对象，通过封装继承多态来演示事物事件的联系

- 函数式编程思维方式： 把现实世界中的事物和事物之间的联系抽象到程序世界（对运算过程进行抽象）

  - 函数式编程中的函数不是程序中的函数(方法)，而是数学中的函数即映射关系
  - 相同的输入始终要得到相同的输出
  - 函数式编程用来描述数据(函数)之间的映射
```javascript 
	//非函数式
	var num1 = 1;
	var num2 = 2;
	var num3 = num1 + num2;
	console.log(num3);
	//函数式
	function add (n1,n2){
		return n1 + n2
	}
	var sum = add(2,3);
	console.log(sum);
```

tips:  函数式编程好处就是可以重用代码
## 函数式一等公民
First-class Function
- 函数可以存储在变量中
- 函数作为参数
- 函数作为返回值

```javascript 
	//把函数赋值给变量
	var fn = function(){};
```

  [1]: http://typecho.heart.xn--6qq986b3xl/usr/uploads/2020/10/4279911729.jpg