/**
 * Created by Administrator on 2016/9/18 0018.
 */
/**
 * bind:处理DOM2级事件绑定的兼容性问题
 * @param curEle:要绑定事件的元素
 * @param eventType:绑定的事件类型
 * @param eventFn:要绑定的方法
 */
function bind(curEle,eventType,eventFn){
    if(document.addEventListener){
        curEle.addEventListener(eventType,eventFn,false);
        return;
    }
    //解决this:给原有的eventFn化妆为tempFn,存储在元素的自定义属性上;因为有多个不同的eventFn,那么就会有多个不同的tempFn,都要存储元素的这个自定义属性上,那么,将这个自定义属性定义为一个数组(为区别事件类型,需要为每一种事件类型创建一个数组curEle["myBind"+eventType]);事件池中存储的是化妆后的tempFn,为了在移除时找到它,设定tempFn.photo=eventFn;
    var tempFn= function (e) {
        eventFn.call(curEle,e);
    };
    tempFn.photo=eventFn;
    if(!curEle["myBind"+eventType]){//判断元素该自定义属性是否已经存在,不存在就创建一个;因为存储多个方法,所以让它的值为数组
        curEle["myBind"+eventType]=[];
    }
    //解决存储问题:在往自定义数组中添加前,判断当前包装后的函数是否已经存在,存在的话不用重新添加
    var ary=curEle["myBind"+eventType];
    for(var i=0;i<ary.length;i++){
        var cur=ary[i];
        if(cur.photo===eventFn){return;}
    }

    ary.push(tempFn);
    curEle.attachEvent("on"+eventType,tempFn);//eventFn中的this为window//eventFn.call(curEle)不可以使用的原因:绑定时候立即把fn1执行,把其返回值undefined给onclick;call和apply改变关键字并且方法直接执行,bind方法只改变关键字,函数不执行,但是不兼容
}
function unbind(curEle,eventType,eventFn){
    if(document.removeEventListener){
        curEle.removeEventListener(eventType,eventFn,false);
        return;
    }
    //拿eventFn到curEle["muBind"]这里找化妆后的结果,找到之后在事件池中把换装后的结果移除事件池
    var ary=curEle["myBind"+eventType];
    for(var i=0;i<ary.length;i++){
        var cur=ary[i];
        if(cur.photo==eventFn){
            ary.splice(i,1);//将自身从对应的数组中移除
            curEle.detachEvent("on"+eventType,cur);//将自身从事件池中移除
            break;
        }
    }
}
//解决顺序问题:不使用浏览器自带的事件池,自拟模拟标准浏览器的事件池实现
//on:创建事件池,把需要给当前元素绑定的方法依次添加在事件池中
function on(curEle,eventType,eventFn){
    if(!curEle["myEvent"+eventType]){
        curEle["myEvent"+eventType]=[];
    }
    var ary=curEle["myEvent"+eventType];
    for(var i=0;i<ary.length;i++){
        if(ary[i]===eventFn){
            return;
        }
    }
    ary.push(eventFn);
    //为当前元素绑定run方法
    bind(curEle,eventType,run);//执行on时,给当前元素绑定点击行为,点击时执行run方法:run方法中的this为当前元素,浏览器为run传递一个MouseEvent事件对象
}
//off:在自己创建的事件池中移除某个方法
function off(curEle,eventType,eventFn){
    var ary=curEle["myEvent"+eventType];
    for(var i=0;i<ary.length;i++){
        var cur=ary[i];
        if(cur==eventFn){
            ary.splice(i,1);
        }
    }
}
//run:给当前元素的点击行为绑定此方法,在run方法中,根据方法存储的顺序将方法执行
function run(e){
    e=e||window.event;
    var flag=e.target?true:false;//ie6-8下不兼容e.target,得到的flag为false
    //解决兼容性问题
    if(!flag){
        e.target=e.srcElement;
        e.pageX=e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft);
        e.pageY=e.clientX+(document.documentElement.scrollTop||document.body.scrollTop);
        e.preventDefault= function () {
            e.returnValue=false;
        };
        e.stopPropagation= function () {
            e.cancelBubble=true;
        }
    }
    //获取自己创建的事件池中的方法,并且依次执行
    var ary=this["myEvent"+e.type];
    for(var i=0;i<ary.length;i++){
        var tempFn=ary[i];
        tempFn.call(this,e);
    }
}