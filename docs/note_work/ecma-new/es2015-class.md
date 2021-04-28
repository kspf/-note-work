# es2015 class
- class 关键字创建类
- 实例方法
- 静态方法 关键字 static 创建类的静态方法
- 子类中super关键字指向父类

```javascript
function person (name){
    this.name = name;
}
person.prototype.say = function () {
    console.log(`my name is ${this.name}`);
}


class es6Person{
    constructor(name){
        this.name = name;
    }
    say () {
        console.log(`my name is ${this.name}`);
    }

    //静态方法 关键字 static
    static create (name) {
        return new es6Person(name);
    }
}

let p = new es6Person("张三");

//es2015 继承
class student extends es6Person {
    constructor(name,number){
        super(name);
        this.number = number;
    }
    hello(){
        super.say();
        console.log(`my number in ${this.number}`);
    }
}

let tom = new student("tom",100);

tom.hello();
```