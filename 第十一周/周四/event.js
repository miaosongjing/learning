/**
 * Created by Administrator on 2016/9/18 0018.
 */


function on(curEle,eventType,eventFn){//负责挖程序池,并且把需要绑定的方法保存在事件池
    //使on方法
    //凡事自定义事件,都让事件类型以"self"开头
    if(/^self/.test(type)){
        if(!ele["aSelf"+type]){
            ele["aSelf"+type]=[];
        }
        var a=ele["aSelf"+type];
        for(var i=0;i<a.length;i++){
            if(a[i]==fn)return;
        }
        a.push(fn);//这里不用attachEvent,也不用写
        return;
    }
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
        return ;
    }


    if(!ele["aEvent"+type]){
        ele["aEvent"+type]=[];
        ele.attachEvent("on"+type,function(){run.call(ele)});
    }
    var a=ele["aEvent"+type];
    for(var i=0;i<a.length;i++){
        if(a[i]==fn)return;
    }
    a.push(fn);
   }
//执行(通知)绑定在自定义事件上的方法
function selfRun(selfType,e){//参数:自定义事件的类型,系统的事件对象
    //原理:通过selfType找到对应的数组,然后遍历执行数组里的方法
    var a=this["aSelf"+selfType];
    for(var i=0;i<a.length;i++){
        if(a&&a.length){
            a[i].call(this,e);
        }else{
            a.splice(i,1);
            i--;
        }
    }
}
function off(ele,type,fn){//将对应的方法从程序池中移除
    if(/^self/.test(type)){
        var a=ele["aSelf"+type];
        if(a&&a.length){
            for(var i=0;i<a.length;i++){
                if(a[i]==fn){
                    a[i]=null;
                    break;
                }
            }
        }
        return;
    }
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
        return;
    }
    var a=ele["aEvent"+type];
    if(a&&a.length){
        for(var i=0;i<a.length;i++){
            if(a[i]==fn){
                a[i]=null;
                //a.splice(i,1);
                //i--;
                break;
            }
        }
    }

}

//run:给当前元素的点击行为绑定此方法,在run方法中,根据方法存储的顺序将方法执行
function run(){
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
on(ele,"selfdragend",fly);
on(ele,"selfdragend",drop);
function fly(){
    var that=this;
    this.speed*=0.98;
    var maxRight=(document.documentElement.clientWidth||document.body.clientWidth)-this.offsetWidth;
    var currentX=this.offsetLeft+this.speed;
    if(currentX<=0){//左边界判断:越过左边界时,停在左边界,且反方向
        this.style.left=0;
        this.speed*=-1;
    }else if(currentX>=maxRight){//右边界判断
        this.style.left=maxRight+'px';
        this.speed*=-1;
    }else{
        this.style.left=currentX+'px';
    }
    if(Math.abs(this.speed)>=0.5){
        this.flyTimer=window.setTimeout(processThis(fly,this),17);
    }
}
function drop(){
    if(this.dropSpeed){
        this.dropSpeed+=9;
    }else{
        this.dropSpeed=9;
    }
    this.dropSpeed*=.98;
    var maxBottom=(document.documentElement.clientHeight||document.body.clientHeight)-this.offsetHeight;
    var currentY=this.offsetTop+this.dropSpeed;
    if(currentY>=maxBottom){
        this.style.top=maxBottom+"px";
        this.dropSpeed*=-1;
        this.flag++;//标识属性,用来记录多少次到达边界的属性
    }else{
        this.style.top=currentY+"px";
        this.flag=0;
    }
    if(this.flag<2){
        this.dropTimer=window.setTimeout(processThis(drop,this),20);
    }
}
function down(e){//拖拽开始-->准备拖拽--用"selfdragstart"表示这个阶段  注意this都是指向被拖拽的元素,这是由事件的原则决定的-->用好this,有利于降低程序的耦合度
    //盒子/鼠标的原始位置
    this.x=this.offsetLeft;
    this.y=this.offsetTop;
    this.mx= e.pageX;
    this.my= e.pageY;
    if(this.setCapture){
        this.setCapture();//处理dom元素丢失鼠标焦点的问题  在ie和fireFox支持,chrome不支持
        on(this,"mousemove",move);
        on(this,"mouseup",up);
    }else{
        //解决this问题:方法一
        //function processThis(fn,obj){}解决this指向
        this.MOVE=move.bind(this);
        this.UP=up.bind(this);
        //让一个方法在使用时,功能不变,this关键字强制指向某个对象
        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP);

//            方法二:
//            var that=this;
//            this.MOVE= function (e) {
//                this.move(that,e);
//            };
//            this.UP= function (e) {
//                this.up(that,e);
//            };
//            方法三:
//            this.MO VE=move.bind(this);
//            this.UP=up.bind(this);
    }
    e.preventDefault();
    selfRun.call(this,"selfdrag1",e);//selfRun的运行被称之为通知,当这个主行为执行的时候,去遍历执行"selfdragstart"为区分符的数组;特别强调的是,selfRun的第一个参数是什么,就规定代表down方法的事件类型是什么
}
function move(e){//拖拽进行--"seldragging
    this.style.left=e.pageX-(this.mx-this.x)+"px";
    this.style.top=e.pageY-(this.my-this.y)+"px";
    selfRun.call(this,"selfdrag2",e);
    //得到fly动画所需的速度:单位时间内产生距离,这里的单位时间是浏览器的反应时间
//        this.speed=这次鼠标位置-上一次鼠标位置

}
function up(e){//拖拽结束
    if(this.releaseCapture){
        this.releaseCapture();//处理dom元素丢失鼠标焦点的问题  在ie和fireFox支持,chrome不支持
        off(this,"mousemove",move);
        off(this,"mouseup",move);
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }
    selfRun(this,"selfdrag3",e);
}
//    function on(ele,type,fn){
//        if(ele.addEventListener){
//            ele.addEventListener(type,fn,false);
//            return;
//        }
//        //for:ie
//        if(!ele["aEvent"+type]){
//            ele["aEvent"+type]=[];
//            ele.attachEvent("on"+type,function () {run.call(ele);});
//        }
//        var a=ele["aEvent"+type];
//        for(var i=0;i< a.length;i++){if(a[i]==fn)return;}
//        a.push(fn);
//    }
//    function run(){
//        var e=window.event;
//        var type= e.type;
//        if(!e.target){
//            e.target= e.srcElement;
//            e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
//            e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
//            e.stopPropagation= function () {e.cancelBubble=true;};
//            e.preventDefault= function () {e.returnValue=false;};
//        }
//        var a=this["aEvent"+type];
//        if(a&& a.length){
//            for(var i=0;i< a.length;i++){
//                if(typeof a[i]=="function"){
//                    a[i].call(this,e);//方法执行时this指向被绑定的DOM元素
//                    //a[i]();this为数组a
//                }else{
//                    a.splice(i,1);//对应off中的数组塌陷
//                    i--;
//                }
//            }
//        }
//    }
//    function off(ele,type,fn){
//        var a=ele["aEvent"+type];
//        if(a&& a.length){
//            for(var i=0;i< a.length;i++){
//                if(a[i]==fn){
//                    a[i]=null;
//                    break;
//                }
//            }
//        }
//    }
function processThis(fn,obj){
    return function (e) {fn.call(obj,e);}
}
function clearEffect(){
    clearTimeout(this.flyTimer);
    clearTimeout(this.dropTimer);
}
function getSpeed(e){
    if(this.prevPosi){//当有上一次时
        this.speed= e.pageX-this.prevPosi;
        this.prevPosi= e.pageX;//不断更新上一次位置

    }else{//如果没有上一次,就将当前的位置进行赋值
        this.prevPosi= e.pageX;
    }
}