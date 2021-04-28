# 闭包



## 闭包(Closure):
函数和其周围状态(词法环境)的引用捆绑在一起形成闭包，可以在另一个作用域中调用另一个函数的内部函数并访问到该函数的作用域中的成员
## 闭包的本质： 
函数在执行的时候会放到一个执行栈上当函数执行完毕之后会从执行栈上移除，`但是堆上的作用域成员因为被外部应用不能释放`，因此内部函数依然可以访问外部函数的成员

```javascript  
    //闭包
    function f1(){
    	let data = 1;
    }
    f1();//f1执行 data会被释放掉
    
	function fn (){
		let data = 1;
		return function(num){
			data+= num;
			return (data);
		}
	}
	var add = fn();//fn执行 data不会被释放
	add(1);
	
	//案例1. 经常求数字的平方
	//例  Math.pow(4,2);
	//    Math.pow(6,2);
	function mackPower(power){
		return function(number){
			return Math.pow(number,power);
		}
	}
	//求平方
	let power2 = mackPower(2);
	//求三次方
	let power3 = mackPower(3);
	console.log(power2(5));
	console.log(power2(6));
	console.log(power3(7));
	

	//案例2 求员工工资 员工工资 = 基本工资+绩效工资 同级别绩效工资相同 绩效工资浮动
	//员工1 级别1 基本工资12000 绩效工资300
	//员工2 级别2 基本工资15000 绩效工资200
	//员工3 级别2 基本工资15000 绩效工资100
	function makeSalary(base){
		return function(performance){
			return base + performance;
		}
	}
	//等级1
	let salaryLevel1 = makeSalary(12000);
	//等级2
	let salaryLevel2 = makeSalary(15000);
	//员工1
	salaryLevel1(300);//12300
	//员工2
	salaryLevel2(200);//15200
	//员工3
	salaryLevel2(100);//15100

```