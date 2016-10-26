/**
 * Created by Administrator on 2016/9/17 0017.
 */
function on(ele,eventType,fn){//添加
    //for:标准
    if(ele.addEventListener){
        ele.addEventListener(eventType,fn,false);
        return;
    }
    //for:ie6-8
    //1.如果数组不存在,创建一个数组
    if(!ele["myEvent"+eventType]){
        ele["myEvent"+eventType]=[];
        //4.将最终的run方法绑定给元素--不同的事件类型,每种类型只需要绑定一次
        ele.attachEvent("on"+eventType,function (){//注意处理this  只需绑定一次,就不需要考虑执行的顺序
            run.call(ele);//run作为事件绑定的方法,注意在修改this时传递e
        });
    }
    var a=ele["myEvent"+eventType];
    //2.避免重复绑定
    for(var i=0;i<a.length;i++){
        if(a[i]===fn){
            return;
        }
    }
    //3.将fn加入数组
    a.push(fn);
}
function off(ele,eventType,fn){//移除
    //for:标准
    if(ele.removeEventListener){
        ele.removeEventListener(ele,eventType,fn);
        return;
    }
    //for:ie6-8
    var a=ele["myEvent"+eventType];
    if(a){//避免执行时,出现不存在的方法    off(oDiv,"haha",fn)
        for(var i=0;i<a.length;i++){
            if(a[i]===fn){
                a[i]=null;//避免数组塌陷
                break;
            }
        }
    }
}
function run(e){//找到数组,按照顺序执行
    e=window.event;
    var a=this["myEvent"+e.type];
    if(a){//只要存在a,必然为ie;因为标准浏览器不会创建自定义数组
        //1.处理兼容
        e.target=e.srcElement;
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
        e.preventDefault= function () {
            e.returnValue=false;
        };
        e.stopPropagation= function () {
            e.cancelBubble=true;
        };
        //2.循环执行方法
        for(var i=0;i<a.length;i++){
            var curFn=a[i];
            if(typeof curFn=="function"){
                //是一个函数时执行
                curFn.call(this,e);
            }else{
                //不是一个函数时,删除(因为被移除时赋值为null)
                a.splice(i,1);
                i--;
            }
        }
    }
 }