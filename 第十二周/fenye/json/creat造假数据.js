
//创建虚假数据----内部测试
var str1='赵钱孙李周吴郑王冯陈楚魏蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜';
var str2='一二三四五六七八九壹贰叁肆伍陆柒捌玖';
var ary=[];
//2.随机数方法
function getRandom(n,m){
    return Math.round(Math.random()*(m-n)+n);
}
for(var i=1;i<=99;i++){
    //1.每次循环创建一个对象,把每个对象放入数组
    var obj={
        //2.为每个obj添加属性名和属性值
        //id
        id:i,
        //分数
        score:getRandom(50,99),
        //名字
        name:str1[getRandom(0,31)]+str2[getRandom(0,17)]+str2[getRandom(0,17)],
        //性别
        sex:getRandom(0,1)

    };
    ary.push(obj);
}
//3.数据写入
var fs=require('fs');
fs.writeFileSync('./student.json',JSON.stringify(ary),'utf-8');