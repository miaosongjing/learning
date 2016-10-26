
(function(){
    //解决this和重复问题
    function bind(curEle,eventType,eventFn){
        //1.标准浏览器
        if("addEventListener" in document){
            curEle.addEventListener(eventType,eventFn,false);
            return;
        }
        //2.ie浏览器
        //1)化妆
        var tempFn= function (e) {
            eventFn.call(curEle,e);
        };
        //2)贴照片
        tempFn.photo=eventFn;
        //3)创建数组,作为元素的自定义属性
        //////////////////////////////////////////////////////////////////////////////////
        //var ary=curEle["myBind"+eventType];
        //if(!ary){ary=[];}
        if(!curEle["myBind"+eventType]){
            curEle["myBind"+eventType]=[];
        }// //解决this:给原有的eventFn化妆为tempFn,存储在元素的自定义属性上;因为有多个不同的eventFn,那么就会有多个不同的tempFn,都要存储元素的这个自定义属性上,那么,将这个自定义属性定义为一个数组(为区别事件类型,需要为每一种事件类型创建一个数组curEle["myBind"+eventType]);事件池中存储的是化妆后的tempFn,为了在移除时找到它,设定tempFn.photo=eventFn;
        var ary=curEle["myBind"+eventType];

        //重复问题:在每一次往自定义容器中存储的时候,首先判断之前是否已经存在,如果存在说明重复,那就不需要往自定义属性和事件池中存储
        for(var i=0;i<ary.length;i++){
            if(ary[i].photo==eventFn){return;}
        }
        ary.push(tempFn);
        curEle.attachEvent("on"+eventType,tempFn);////eventFn中的this为window//eventFn.call(curEle)不可以使用的原因:绑定时候立即把fn1执行,把其返回值undefined给onclick;call和apply改变关键字并且方法直接执行,bind方法只改变关键字,函数不执行,但是不兼容
    }
    //标准浏览器和ie6-8浏览器的区别:
    //this问题:标准浏览器中的this是window;ie6-8中,方法执行中的this是window
    //重复问题:标准浏览器的同一个元素的同一个行为绑定同一个方法,但是ie6-8下可以
    //顺序问题:标准浏览器绑定的时候,按照顺序依次把没有添加的方法添加在事件池中(添加前进行判断,如果事件池中已经存在就不在添加);当行为触发的时候,会到事件池中,按照添加的顺序依次执行对应的方法;在ie6-8中,行为触发时,方法执行的顺序和之前绑定的顺序无关联,没有任何规律

    //unbind:移除当前元素绑定的某一个方法
    function unbind(curEle,eventType,eventFn){
        //标准
        if("removeEventListener" in document){
            curEle.removeEventListener(eventType,eventFn,false);
            return;
        }
        //ie
        var ary=curEle["myBind"+eventType];
        //1.判断是否存在,是不是数组,是不是对应的方法
        if(ary&&ary instanceof Array){//避免首先执行unBind时出现报错
            //拿eventFn到curEle["muBind"]这里找化妆后的结果,找到之后在事件池中把换装后的结果移除事件池
            for(var i=0;i<ary.length;i++){
                var cur=ary[i];
                if(cur.photo==eventFn){
                    //2.移除方法并且在数组中删除
                    curEle.detachEvent("on"+eventType,cur);//将自身从事件池中移除
                    ary.splice(i,1);//将自身从对应的数组中移除
                    break;
                }
            }
        }
    }
    //解决顺序问题:不使用浏览器自带的事件池,自拟模拟标准浏览器的事件池实现
//run:解决顺序问题
    //on:创建事件池,把需要给当前元素绑定的方法依次添加在事件池中
    function on(curEle,eventType,eventFn){
        //1.创建数组
        if(!curEle["myEvent"+eventType]){
            curEle["myEvent"+eventType]=[];
        }
        var ary=curEle["myEvent"+eventType];
        //2.将方法添加进数组,如果重复直接返回
        for(var i=0;i<ary.length;i++){if(ary[i]===eventFn){return;}}
        ary.push(eventFn);
        //如果想要在点击的时候执行run方法,需要把run方法添加到浏览器内置的事件池中
        //curEle.addEventListener(eventType,run,false);
        //curEle.attachEvent("on"+eventType,run);//run中的this为window
        //3.为元素绑定run方法
        bind(curEle,eventType,run);//解决this和重复问题
    }
    // run:唯一给当前元素的某个行为在内置事件池中绑定的方法,当行为触发,执行run方法,在run中分别把存储在自己容器中的所有方法执行
    function run(e){
        //1.处理兼容
        e=e||window.event;
        //为了后期每个绑定方法中使用事件对象方便,统一进行事件对象兼容处理
        var flag=e.target?true:false;
        if(!flag){
            e.target=e.srcElement;
            e.pageX=e.clientX+(document.documentElement.scrollLeft|document.body.scrollLeft);
            e.pageY=e.clientY+(document.documentElement.scrollTop|document.body.scrollTop);
            e.stopPropagation= function () {
                e.cancelBubble=true;

            };
            e.preventDefault= function () {
                e.returnValue=false;
            };
        }
        //var ary=curEle["muEvent"+eventType];this为当前元素
        //2.获取自己创建的事件池中的方法,判读是一个方法时,依次执行;不是方法就删除
        var ary=this["myEvent"+e.type];
        for(var i=0;i<ary.length;i++){
            var tempFn=ary[i];
            if(typeof tempFn=="function"){
                tempFn.call(this,e);//在内置的事件池中,绑定的方法执行的时候this是当前要操作的元素,并且浏览器会为其传递事件对象;而在自己创建的容器中存储的所有方法其实都相当于给当前元素绑定的事件,为了和内置的统一,也让其执行的时候this变为当前元素,并且给他传递一个事件对象
            }else{//当前数组项null时,为避免报错,将其移除
                ary.splice(i,1);
                i--;
            }
        }
    }
    //移除
    //off:在自己创建的事件池中移除某个方法
    function off(curEle,eventType,eventFn){
        //1.判断数组存在,遍历数组
        var ary=curEle["myEvent"+eventType];
        if(ary&&ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var cur=ary[i];
                //2.如果是要移除的方法,移除(赋值为null)
                if(cur===eventFn){
                    //ary.splice(i,1);////在执行过程中,移除一些方法,那么存储方法的数组项会减少(每一个函数的索引都变为最新的值),但是run方法执行的时候,继续进行累加,导致部分方法直接跳过
//为了防止数组塌陷,在移除时不能将原有数组中每一个方法的索引改变(数组长度不能改变),所以不能使用slice
                    ary[i]=null;
                    break;
                }
            }
        }
    }
    window.zhufengEvent={
        on:on,
        off:off
    };


})();