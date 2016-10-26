/**
 * Created by Administrator on 2016/10/19 0019.
 */
function ran(n,m){
    return Math.round(Math.random()*(m-n)+n);
}
//1.定义str1存储姓和名字
var str1='赵钱孙李周吴郑王冯陈楚魏蒋沈韩杨朱秦尤许何吕施张';
var str2='零壹贰叁肆伍陆柒捌玖';
var ary=[];
for(var i=1;i<=98;i++){
    //2.声明一个obj,存储每一个客户信息
    var obj={
        id:i,
        name:str1[ran(0,23)]+str2[ran(0,9)],
        sex:ran(0,1),
        score:ran(50,99)
    };
    //3.将obj放入数组
    ary.push(obj);
}
//4.将创建的信息写入对应文件中
var fs=require('fs');
fs.writeFileSync('./userList.json',JSON.stringify(ary),'utf-8');