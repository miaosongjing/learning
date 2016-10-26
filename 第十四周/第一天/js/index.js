/**
 * Created by Administrator on 2016/10/19 0019.
 */
//3--4 基于string.prototype扩展字符串的方法
~function (pro) {
    function queryURLParameter(){
        //获取问号传参
        var reg=/([^?=&#]+)=([^?=&#]+)/g,
            obj={};
        this.replace(reg, function () {
            obj[arguments[1]]=arguments[2];
        });
        //获取哈希值
        reg=/#([^?=&#]+)/;
        if(reg.test(this)){
            obj['HASH']=reg.exec(this)[1];
        }
        return obj;
    }
    //格式化时间字符串
    function formatTime(template){
        template=template||'{0}年{1}月{2}日{3}时{4}分{5}秒';//时间格式
        var ary=this.match(/\d+/g);
        template=template.replace(/\{(\d+)\}/g, function () {
           var n=arguments[1],
               res=ary[n]||'00';
            res.length<2?res='0'+res:null;

            return res;

        });
        return template;

    }

    pro.queryURLParameter=queryURLParameter;
    pro.formatTime=formatTime;
}(String.prototype);
//var str='2016-6-25 12:25:32';
//console.log(str.formatTime());
//计算content区域的高度
~function () {
    var $header=$('#header'),
        $content=$('#content'),
        $menu=$('#menu');
    computedHeight();
    function computedHeight(){
        var winH=document.documentElement.clientHeight||document.body.clientHeight;
        var tarH=winH-$header.outerHeight()-40;
        $content.css('height',tarH);
        $menu.css('height',tarH-2);

    }
    //window.onresize当浏览器的窗口大小发生改变时,触发的事件
    $(window).on('resize',computedHeight);
}();
//MENU RENDER
var menuRender=(function () {
    var $menu=$('#menu'),
        $menuList=$menu.find('a'),//获取menu下所有的a
        menuIScroll=null;


    //实现menu区域的局部滚动
    function scrollFn(){
        //1.实现menu区域的局部滚动
        menuIScroll=new IScroll('#menu',{
            bounce:false,
            scrollbars:true,
            mouseWheel:true,
            fadeScrollbars:true
        });
    }
    //实现hash值对应的a选中
    function hashFn(){
        //3.每一次加载页面的时候,首先检查url地址栏后面是否有哈希值:存在让哈希值对应的a有选中的样式;不存在,让第一个a有选中的样式
        var urlObj=window.location.href.queryURLParameter(),
            hash=urlObj['HASH']||'nba',//逻辑运算符
            $curMenu=$menuList.filter('[href="#'+hash+'"]');//filter在当前集合中过滤,children在子集中查找,find在后代中查找   JQ中提供属性选择器
        $curMenu.length===0?$curMenu=$menuList.eq(0):null;//如果没有获取到,默认第一个  //[0],eq(0),get(0)区别:都是获取集合中的第一项,但[0]/get(0)获取的是原生js对象;eq(0)获取的是JQ对象
        $curMenu.addClass('bg');

        menuIScroll.scrollToElement($curMenu[0],0);//menuIScroll.scrollToElement($curMenu[0],300);//使当前的iscroll滚动到某一个具体元素的位置(这个具体的元素需要是一个js对象)
        ////////////////左侧menu和右侧calendar的关联/////////////////////
        //控制右侧日期区域显示对应的时间
        calendarRender.init($curMenu.attr('data-id'));
    }
    //给menu区域的a绑定点击事件
    function bindEvent(){
        //2.给menu区域的每一个A绑定点击事件
        $menuList.on('click', function () {
            //1.控制当前url的末尾添加哈希值,重新加载页面时使哈希值对应的a有对应的样式=>不需要js处理,通过锚点定位,让每一个a的href+#xx
            //2.让当前点击的a有选中样式,其余的a没有
            //this为点击的a
            //方法一:
            //$(this).addClass('bg').parent().siblings().children('a').removeClass('bg');
            //方法二:性能好
            var _this=this;
            $menuList.each(function (index, item) {
                //each方法中的this是item
                if(this===_this){//当前a为点击的a
                    $(this).addClass('bg');
                    return;
                }
                $(this).removeClass('bg');
            });

            //控制右侧的内容跟着哈希值改变
            calendarRender.init($(this).attr('data-id'));
        });
    }
    return {
        init: function () {
            scrollFn();
            hashFn();
            bindEvent();
        }
    }
})();
//CALENDAR Render  ////////////在menuRendar中绑定这个模块的方法
var calendarRender=(function () {
    var $calendar=$('#calendar'),
        $wrapper=$calendar.find('.wrapper'),
        $link=null,
        $btnLeft=$calendar.find('.btnLeft'),
        $btnRight=$calendar.find('.btnRight');
    var minL=0,maxL=0;


    //1)制定一张计划表
    var calendarPlan=$.Callbacks();
    //2)add:在计划表中添加方法;remove:从计划表中移除方法;fire通知计划表表中的方法执行
    //Ⅰ数据绑定
    calendarPlan.add(function (today,data) {
        //数据绑定-->字符串拼接/EJS模版引擎
        //1-1 获取模版中的内容
        var $calendarTemplate=$('#calendarTemplate'),
            templateText=$calendarTemplate.html();//获取模版中的内容
        //1-2准备数据,并返回
        var res=ejs.render(templateText,{calendarData:data});//calendarData是自己传的数据名字
        //1-3数据绑定,并计算宽度
        $wrapper.html(res).css('width',data.length*110);

        //2-1获取a
        $link=$wrapper.children('a');
        minL=(data.length-7)*110*-1;
    });
    //Ⅱ初始定位在今天日期的位置
    calendarPlan.add(function (today,data) {
        //2-2获取所有的a,在a中找到今天/最近的一天
        //在html中用自定数属性存日期
        //在所有的A中获取代表今天日期的a,
        var $curLink=$link.filter('[data-time="'+today+'"]');
        //如果不存在,说明今天日期没有比赛,就找距离今天最近的后一天
        if($curLink.length===0){
            //循环所有日期,找到比它大的第一个就是最近的一天:获取每一个a中的日期,去掉日期中间的-,两个日期进行相减
            today=today.replace(/-/g,'');
            $link.each(function (index, item) {
                var itemTime=$(item).attr('data-time');
                itemTime=itemTime.replace(/-/g,'');
                if(itemTime-today>0){
                    $curLink=$(item);
                    return false;
                }
            });
        }
        //如果没有找到最近的,默认选中最后一项
        if($curLink.length===0){
            $curLink=$link.eq($link.length-1);
        }
        //2-3 将今天/最近的一天定位在中间位置  left=-当前索引*110+330
        var curL=-$curLink.index()*110+330;
        curL=curL<minL?minL:(curL>maxL?maxL:curL);
        $curLink.addClass('bg');
        $wrapper.css('left',curL);
        //2-4 获取当时展示的七个a对应的起始日期和结束日期,并且通过这个日期,让下面的数据动态的展示  通过wrapper的left值

    });
    //Ⅲ点击左右按钮切换日期
    calendarPlan.add(function (today,data) {

        $btnLeft.on('click',temp);
        $btnRight.on('click',temp);
        function temp(){
            var curL=parseFloat($wrapper.css('left'));
            curL%110!=0?curL=Math.round(curL/110)*110:null;//动画过程中执行下次动画,可能left的值不是110de倍数
            $(this).hasClass('btnLeft')?curL+=770:curL-=770;
            curL=curL<minL?minL:(curL>maxL?maxL:curL);
            $wrapper.stop().animate({
                left:curL
            },300,'linear', function () {//动画完成后作的事情
                //1.把第一个选中
                var firstIndex=Math.abs(curL/110),
                    lastIndex =firstIndex+6;
                $link.eq(firstIndex).addClass('bg').siblings().removeClass('bg');
                //2-4 获取当时展示的七个a对应的起始日期和结束日期,并且通过这个日期,让下面的数据动态的展示  通过wrapper的left值



            });
        }
    });




    return {
        init: function (columnId) {//columnId:指定赛事的id
            columnId=columnId||100000;
        //从服务器获取需要展示的日期数据
            $.ajax({
                url:'http://matchweb.sports.qq.com/kbs/calendar?callback=calendar&columnId='+columnId,
                type:'GET',
                dataType:'jsonp',
                jsonpCallback:'calendar',
                success: function (result) {
                    if(result&&result['code']===0){
                        //1.数据解析(重构)
                        var data=result['data'],
                            today=data['today'];
                            data=data['data'];
                        //2.绑定数据,今天的日期选中,在七个正中间,如果今天没有,让最近的日期选中;
                        //做了一件事引起很多很多事情,利用订阅发布者模式-->指定计划,将计划放在一个容器中,该执行时利用fire
                        calendarPlan.fire(today,data);//通知计划中的方法执行
                    }
                }
            });
        }
    }
})();
menuRender.init();

//html css
//局部滚动
//点击事件


//头部-->左侧-->通过id调用以右侧展示
