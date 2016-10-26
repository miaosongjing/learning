/**
 * Created by Administrator on 2016/10/11 0011.
 */
//创建虚假数据----内部测试
function ran(n,m){//获取随机数
    return Math.round(Math.random()*(m-n)+n);
}
var str1='赵钱孙李周吴郑王冯陈楚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜';//0--31
var str2='aoeywubpmfdt';//0--11
var ary=[];
for(var i=1;i<=98;i++){
    var obj={
        id:i,
        name:str1[ran(0,31)]+str2[ran(0,11)],
        sex:ran(0,1),
        score:ran(0,100)
    };
    ary.push(obj);
}
//数据写入
var fs=require('fs');
fs.writeFileSync('./userList.json',JSON.stringify(ary),'utf-8');