/**
 * Created by Administrator on 2016/9/18 0018.
 */
//如何封装
//1.思想转变:面向过程:实现当前元素的效果
//          -->面向对象:把要操作的对象当作一个类处理
//2.类和实例:实例上存储私有的要操作的元素和值-->
// this.element:要拖拽的元素
// this.x:鼠标按下时鼠标相对元素this.element的偏移量
//3.构造函数的封装:1)把方法定义在原型上,例如拖拽中onmousedown/onmousemove/onmouseup
//                 2)公有方法和函数:onmousemove操作实例上的私有属性,this.element为要拖拽的元素,也就是公有方法要操作的那个元素.实例就是起到保存和媒介作用,即能调用公有方法又能调用私有属性
//                 3)处理this:保证this为当前实例,只有它才能找到要操作的属性和方法

/**
 * 定义一个叫做drag的类
 * @param ele 要拖拽的元素
 * @constructor
 */
function Drag(ele){
    this.element=ele;//把要拖拽的元素保存在实例私有的属性上,在公有方法中只要保证公有方法中的this是实例,就能通过this.element找到要拖拽的元素
    this.x=null;//私有的x记录鼠标点击时,鼠标距离要拖拽的元素的偏移量;此时还没有,设置为null
    this.y=null;
    //给鼠标绑定onmousedown事件是必须要操作的,可以放在构造函数中,因为直接在new Drag创建实例的过程中会默认的执行代码
    var _this=this;//这个this一定为实例
    this.DOWN= function (e) {//这个方法是真正绑定给mousedown事件的,所以事件对象只在DOWN中,但是在down方法中需要使用事件对象e,所以需要传给down
        _this.down.call(_this,e);
    };
    this.MOVE= function (e) {_this.move.call(_this,e);};
    this.UP= function (e) {_this.up.call(_this,e);};
    on(this.element,"mousedown",/*this.down*/this.DOWN);//this.down(原型上的down)方法中的this为this.element(要拖拽的元素),但是我们要保证原型上的this为实例,所以需要包装函数处理this问题;这个函数在up时要被移除,为了保证在移除能够被获取,将这个函数保存在实例的私有属性上(如果是匿名函数,移除时找不到)
    //on(this.element,"mouseup",this.UP);
}
//定义三个公有函数
Drag.prototype.down= function (e) {
    //公有方法中的this为实例
    //1.计算鼠标相对于this.element的相对偏移
    this.x=e.clientX-this.element.offsetLeft;
    this.y=e.clientY-this.element.offsetTop;
    //2.判断是否能建立盒子与鼠标联系,能的话将事件绑定给元素,不能绑定给document
    if(this.element.setCapture){//ie+firefox
        this.element.setCapture();
        on(this.element,"mousemove",this.MOVE);//绑定事件会更改this,所以绑定已经调整过this的MOVE/UP
        on(this.element,"mouseup",this.UP);
    }else{//chrome
        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP);
    }
    /*e.preventDefault?*/e.preventDefault()/*:(e.returnValue=false)*/;
};
Drag.prototype.move= function (e) {
    //this.element是要操作的元素
    this.element.style.left=e.clientX-this.x+"px";
    this.element.style.top=e.clientY-this.y+"px";

};
Drag.prototype.up= function (e) {
    if(this.element.releaseCapture){
        this.element.releaseCapture();
        off(this.element,"mousemove",this.MOVE);
        off(this.element,"mouseup",this.UP);
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }
};