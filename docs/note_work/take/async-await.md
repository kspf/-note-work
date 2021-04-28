# async/await 语法糖

- await 必须在 async 声明函数下使用
```javascript
async function  main (){
    try{
        let one = await ajax("./package.json");
        console.log(one);
        let two = await ajax("./package.json");
        console.log(two);
        let three = await ajax("./package.json");
        console.log(three);
    }
    catch(err){
        console.log(err);
    }
}

```