/**
 * Created by Administrator on 2016/10/25 0025.
 */
//公共方法
~function (pro) {
    //获取url地址中的参数值和哈希值
    function queryURLParameter(){
        var obj={},
            reg=/([^&#?=]+)=([^&#?=]+)/g;
        this.replace(reg, function () {
            obj[arguments[1]]=arguments[2];
        });

        reg=/#([^&#?=]+)/;
        if(reg.test(this)){
            obj['hash']=reg.exec(this)[1];
        }
        return obj;
    }
    //格式化时间字符串
    function formatTime(template){
        template=template||'{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var ary=this.match(/\d+/g);
        return template.replace(/\{(\d)\}/g,function () {
                var index=arguments[1],
                    content=ary[index];
                content=content||'00';
                return content;
            });

    }
    pro.queryURLParameter=queryURLParameter;
    pro.formatTime=formatTime;
}(String.prototype);

//Ⅰ rem
~function () {
    var desW=640,
        winW=document.documentElement.clientWidth||document.body.clientWidth;
    if(winW>desW){
        document.getElementById('main').style.width=desW+'px';
        return;
    }
    document.documentElement.style.fontSize=winW/desW*100+'px';
}();

//Ⅱ header
var headerRender=(function(){
    var $header=$('.header'),
        $menu=$header.find('.menu'),
        $nav=$header.children('.nav');
    var isFlag=false;//默认开始隐藏

    return {
        init: function () {
            //1 点击menu,如果隐藏就显示nav,如果显示就隐藏
            $menu.tap(function () {
                //2)如果已经显示,再点击隐藏nav
                if(isFlag){
                    //为解决收起时的抖动,在height变为0后再使padding变为0;所以,在收起时设置定时器监听,定时器时间为动画时间,动画结束(height为0)后,执行padding为0操作
                    var timer=window.setTimeout(function () {
                        $nav.css({
                            padding: 0
                        });
                        window.clearTimeout(timer);
                    },300);
                    $nav.css({
                        height: 0
                    });
                    isFlag=false;
                    return;
                }
                //1)点击显示nav 通过自定义属性进行查看nav是显示还是隐藏
                isFlag=true;
                $nav.css({
                    padding: '.1rem 0',
                    height: '2.22rem'
                });
            });
        }
    }
})();
headerRender.init();
//Ⅲ matchInfo
var matchRenter=(function () {
    var $matchInfo=$('.matchInfo'),
        $matchInfoTemplate=$('#matchInfoTemplate'),
        $progress=null;
    var isTap=false;//记录是否已经点击
    //3.为左右支持绑定点击事件 在数据绑定完成后绑定点击事件 利用事件委托
    function bindEvent(matchInfo){
        var $support=$matchInfo.find('.support'),
            $supportLeft=$support.eq(0),
            $supportRight=$support.eq(1);
        //3-1获取本地存储,判断是否有支持,如果已经支持,不能在点击和增加背景色
        var supportStorage = localStorage.getItem('support');
        if (supportStorage) {
            supportStorage = JSON.parse(supportStorage);
            supportStorage.type == 1 ? $supportLeft.addClass('bg') : $supportRight.addClass('bg');
            return;
        }
        //3-2绑定点击事件:注意绑定事件的对象为左右按钮
        $support.tap(function (ev) {
            var tar=ev.target,
                tarTag=tar.tagName;//移动端的标签名均为大写
            if(tarTag==='SPAN'&&tar.parentNode.className==='bottom'&&tar.className!=='type'){
                if(isTap)return;//已经点击,不再执行
                //1)增加数字和背景:点击前都没有bg样式,被点击的对象+1,有bg样式
                $(this).addClass('bg').html(parseFloat($(this).html())+1);
                //2)重新计算进度条 左边/(左边+右边)*100+%
                $progress.css('width',(parseFloat($supportLeft.html())/(parseFloat($supportLeft.html())+parseFloat($supportRight.html())))*100+'%');
            }
            //3)告诉服务器支持的是谁 点击左边type=1,右边type=2
            $.ajax({
                url:'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468531&type='+$(this).attr('type'),
                dataType:'jsonp'
            });
            //4)同一ip支持一次后不能在支持 刷新页面也不能再点击 使用本地存储
            //4)-1页面不刷新时,只能点击一次,点击过增加自定义属性
            isTap=true;
            //4)-2刷新时,只能点击一次 点击后使用本地存储isTap和单击的是谁type,页面刷新时从本地获取进行控制(点击时什么都不做,并且有bg样式,在绑定之前就要进行这个操作)
            localStorage.setItem('support',JSON.stringify({
                'isTap':true,
                'type':$(this).attr('type')
            }));
        });
    }
    function bindHTML(matchInfo){
        //1.使用ejs绑定数据
        //得到模版内容,通过render方法将模版和数据拼接为结构,再将结构放入容器中
        $matchInfo.html(ejs.render($matchInfoTemplate.html(),{matchInfo:matchInfo}));
        //2.控制进度条 设置定时器是给HTML一定的渲染时间(将模版字符串放入容器到用户看到需要一段加载时间,浏览器渲染又需要一段时间,在浏览器开始渲染时又开始执行控制进度条的代码,可能在渲染的过程中已经计算出支持率的百分比,导致看不到进度条的动画显示;所以,为看到进度条的动画,设置一个定时器)
        $progress=$matchInfo.children('.middle').children('span');//在数据绑定后才能获取 /*///////////////////////////////////////////////注意*/已经var过不能在重新声明,否则会被覆盖
        window.setTimeout(function () {
            var leftNum=parseFloat(matchInfo.leftSupport),
                rightNum=parseFloat(matchInfo.rightSupport);//加parseFloat()是将字符串转为数字
            $progress.css('width',(leftNum/(leftNum+rightNum))*100+'%');
            ////////////////////////////////
            //为什么不能使用延迟?
        },500);

    }
//////////////////////////////////////////
    return {
        init: function () {
            //1.获取数据
            $.ajax({
                url:'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468531',
                dataType:'jsonp',
                success: function (result) {
                    if(result&&result[0]==0){
                        //1)数据重构
                        result=result[1];
                        var matchInfo=result['matchInfo'];
                        matchInfo['leftSupport']=result['leftSupport'];
                        matchInfo['rightSupport']=result['rightSupport'];
                        //2)绑定数据
                        bindHTML(matchInfo);
                        //3)为左右支持绑定点击事件 在数据绑定完成后绑定点击事件
                        bindEvent(matchInfo);
                    }
                }
            });

        }
    }

})();
matchRenter.init();
//////////////////////////////////////////////////////
//Ⅳ matchList
var matchListRender=(function (){
    var $matchList=$('.matchList'),
        $matchListUl=$matchList.children('ul'),
        $matchListTemplate=$('#matchListTemplate');

    function bindHTML(matchList){
        //1.绑定数据 计算ul的宽度
        $matchListUl.html(ejs.render($matchListTemplate.html(),{matchList:matchList})).css('width',matchList.length*2.4+0.3+'rem');//多加0.3为了看到最后一个元素
        //2.实现局部滚动
        new IScroll('.matchList', {
            scrollX:true,
            scrollY:false
        });
    }
    return {
        init: function () {
            $.ajax({
                url:'http://matchweb.sports.qq.com/html/matchStatV37?mid=100002:2365',
                dataType:'jsonp',
                success: function (result) {

                    if(result&&result[0]==0){
                        //1)数据重构
                        result=result[1]['stats'];
                        var matchList=null;
                        $.each(result,function (index,item) {

                            if(item['type']==='9'){//resultzhong 存储的内容是字符串........................................
                                matchList=item['list'];
                                return false;
                            }
                        });
                        //2)绑定数据
                        bindHTML(matchList);
                    }
                }
            });
        }
    }
})();
matchListRender.init();
//Ⅴ less编译
//在dos命令窗口执行 lessc tx.less tx.css -x
//编译后将引入的两个less文件删除,引入压缩后的css文件