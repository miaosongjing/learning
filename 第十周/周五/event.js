/**
 * Created by Administrator on 2016/9/16 0016.
 */
//div.addEventListener("click", function () {
//
//},false);
//div.attachEvent("onclick",fn);
/**
 *
 * @param ele 要绑定事件的元素
 * @param eventType  事件类型
 * @param fn  绑定的函数
 */
function bind(ele,eventType,fn){//处理dom2事件绑定的兼容性
    //for:标准浏览器
    if(ele.addEventListener){
        ele.addEventListener(eventType,fn,false);
        return;
    }
    //for:ie6-8
    //第一步:定义自定义变量tempFn转换attachEvent中fn里的this(不转换都是window)--修改this的常用方法
    //tempFn为处理过this的函数
    var tempFn= function () {
        fn.call(ele);
    };
    //第二步:dom0 级一个事件只能绑定一个函数,不需要移除;dom2级事件可以绑定多个函数,需要移除;由于事件池中的内容可写不可读,所以需要为tempFn添加自定义属性origin记录tempFn之前是谁;把每个tempFn存放在定义的数组"myBind"+eventType(伪造的事件池)中;通过tempFn的origin确定本身fn是移除的fn后,移除对应的tempFn(myBind区分原生属性,eventType区分不同的事件类型,实现不同的事件之间使用不同的数组)
    tempFn.origin=fn;//添加自定义属性,记录它的本身
    if(!ele["myBind"+eventType]){
        ele["myBind"+eventType]=[];
    }
    var a=ele["myBind"+eventType];//为操作简便
    //第三步:避免重复绑定->通过tempFn的origin判断tempFn是否相同
    for(var i=0;i<a.length;i++){
        if(a[i].origin==fn){
            return;//如果曾经绑定,不需要更新数组,也不需要添加到事件池中
        }
    }
    a.push(tempFn);//把已经添加origin的函数tempFn添加在对应事件类型的ele的自定义属性的数组中==>这个数组是为了在移除事件找到自己原来是谁
    ele.attachEvent("on"+eventType,/*fn*/tempFn);//fn中的this为window,时时注意this的传递和修改->第一步,不能使用匿名函数来转为this是因为在移除时找不到这个函数
}

function unBind(ele,eventType,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(eventType,fn,false);
        return;
    }
    //for ie6-8
    var a=ele["myBind"+eventType];
    for(var i=0;i<a.length;i++){//从tempFn中挑选出属性origin的值为fn的利用detachEvent方法移除对应的tempFn
        var tempFn=a[i];
        if(tempFn.origin==fn){
            //从事件池中解绑
            ele.detachEvent("on"+eventType,tempFn);
            //从数组中删除tempFn
            a.splice(i,1);
            break;
        }
    }
    ele.detachEvent("on"+eventType,tempFn.origin)

}

//绑定多个函数时,执行时有顺序问题->自定义数组,将要绑定的函数按照顺序添加;通过自定义函数run按照顺序执行自定义数组中的函数;最后元素只执行run

//解决顺序问题
// on方法-把要绑定的函数放入不同的自定义数组中
function on(ele,eventType,fn){
    //1.把要绑定的函数放入不同的自定义数组
    if(!ele["myEvent"+eventType]){
        ele["myEvent"+eventType]=[];
    }
    var a=ele["myEvent"+eventType];
    //3.避免重复绑定
    for(var i=0;i<a.length;i++){
        if(a[i]==fn){
            return;
        }
    }
    a.push(fn);
    //2.将run方法绑定
    bind(ele,eventType,run);
}
//off方法->移除
function off(ele,eventType,fn){
    var a=ele["myEvent"+eventType];
    for(var i=0;i<a.length;i++){
        if(a[i]==fn){
            //a.splice(i,1); break;//保证a中的fn没有重复,但是这样在on中调用off时会出现数组塌陷,被移除的函数自始至终都不会执行;所以将其赋值为null;在循环执行时,判断是不是函数
            a[i]=null;

        }
    }
}
//run方法->按照顺序执行自定义数组中的方法
function run(e){
    e=e||window.event;
    //3.处理e的兼容问题
    var isLowIE=!e.target;//->true:ie6-8  当事件对象e存在时,作为浏览器判断方法
    if(isLowIE){
        e.target=e.srcElement;
        e.pageX=(document.documentElement.scrollLeft+e.clientX)||(document.body.scrollLeft+e.clientX);
        e.pageY=(document.documentElement.scrollTop+e.clientY)||(document.body.scrollTop+e.clientY);
        e.stopPropagation= function () {
            e.cancelBubble=true;
        };
        e.preventDefault= function () {
            e.returnValue=false;
        };
    }
    //1.对不同的行为,run方法要找到对应的行为数组 ele["myEvent"+eventType]  ele->this->e.target eventType->e.type
    //因为run方法在对象的事件中执行,可以利用e
    var a=this["myEvent"+e.type];
    //2.按照顺序执行
    for(var i=0;i<a.length;i++){
        var fn=a[i];
        //数组a中的项由于off方法可能为null,所以在函数执行前进行判断
        if(typeof fn=="function"){//是函数
            fn.call(this,e);//最终给ele绑定的是fn,所以需要把run中的e传给fn,但是e有许多兼容问题
        }else{//是null,删除null -->这一步可以不写
            a.splice(i,1);
            i--;

        }

    }
}
