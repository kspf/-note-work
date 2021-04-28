# 什么是高阶函数
-  高阶函数
	- 可以把函数作为参数传递给另一个函数
	- 可以把函数作为另一个函数的返回结果
-  函数作为参数

```javascript
	//实现forEach函数
    function forEach(array,fn){
    	for(var i=0;i < array.length;i++){
    		fn(array[i]);
    	}
    }
    //实现filter
    function filter(array,fn){
    	let temp = [];
    	for(var i=0;i < array.length;i++){
    		if(fn(array[i])) temp.push(array(i));
    	}
    	return temp;
    }
```
tips: 函数作为参数可以让函数更灵活，无需考虑函数内部实现

## 高阶函数-函数作为返回值

```javascript 
	//基本语法:
	function makeFn (){
		let msg = "函数作为返回值基本语法"
		return function(){
			console.log(msg)		
		}
	}
	//模拟once函数 只让函数执行一次 例子：支付的时候只执行一次
	function once(fn){
		//控制fn只执行一次
		let done = false;
		return function(){
			if(!done){
				done = true;
				return fn.apply(this,arguments);
			}
		}
	}
	//测试once
	let pay = once(function(money){
		console.log(`支付：${money}RMB`);
	})
	
	pay(5) //执行
	pay(6) //不执行
	pay(7) //不执行
	pay(8) //不执行
	
```

## 高阶函数的意义
- 抽象可以帮助我们屏蔽细节，只需关注我们的目标
- 高阶函数是用来抽象通用的问题

## 常用的高阶函数
- forEach 方法用于调用数组的每个元素，并将元素传递给回调函数
- map 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。
- filter 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素
- every 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）
- some 方法用于检测数组中的元素是否满足指定条件（函数提供）
- find/findIndex  方法返回通过测试（函数内判断）的数组的第一个元素的值
- reduce 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值
- sort 方法用于对数组的元素进行排序
- ......
```javascript 
	//实现map方法
	const map= function (array,fn) {
		let temp = [];
		for(let i=0;i<array.length;i++){
			temp.push(fn(array[i]));
		}
		return temp;
	}
	//测试
	var arr1 = [1,2,3,4,5];
	map(arr1,function(item){return item * item}); // [1, 4, 9, 16, 25]
	
	//实现every方法
	const every = function(array,fn){
		let condition = true;
		for(var value of array){
			condition = fn(value);
			if(!condition) break;
		}
		return condition;
	}
	//测试
	var arr2 = [1,2,3,4,5,6];
	every(a1,item=>item < 10);//true
	every(a1,item=>item > 5);//false
	
	//实现some方法
	const some = function(array,fn){
		let condition = false;
		for(var value of array){
			condition = fn(value);
			if(condition) break;
		}
		return condition;
	}
	
	var arr3 = [1,3,5,7,9];
	some(arr3, item=>item % 2===0); //false
	var arr4 = [1,2,3,4,5];
	some(arr4, item=>item % 2===0);//true
```