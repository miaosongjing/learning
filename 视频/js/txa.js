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
                $nav.css({
                    padding: '.1rem 0',
                    height: '2.22rem'
                });
                isFlag=true;
            });
        }
    }
})();
headerRender.init();
//Ⅲ matchInfo
var matchRenter=(function () {
    var $matchInfo=$('.matchInfo'),
        $matchInfoTemplate=$('#matchInfoTemplate');

    var isTap=false;//记录是否已经点击
    //3.为左右支持绑定点击事件 在数据绑定完成后绑定点击事件 利用事件委托
    function bindEvent(){
        $matchInfo.tap(function (ev) {
            var tar=ev.target,
                tarTag=tar.tagName,//移动端的标签名均为大写
                $tar=$(tar),
                tarP=tar.parentNode,
                $tarP=$tar.parent(),
                tarInn=$tar.html();
            if(tarTag==='SPAN'&&tarP.className==='bottom'&&tar.className!=='type'){
                var $bottom=$matchInfo.children('.bottom'),
                    $bottomLeft=$bottom.children('.home'),
                    $bottomRight=$bottom.children('.away');
                if($bottom.attr('isTap')==='true')return;//已经点击,不再执行
                //1增加数字和背景:点击前都没有bg样式,被点击的对象+1,有bg样式
                $tar.html(parseFloat(tarInn)+1).addClass('bg');
                //2重新计算进度条 左边/(左边+右边)*100+%

                $matchInfo.children('.middle').children('span').css('width',(parseFloat($bottomLeft.html())/(parseFloat($bottomLeft.html())+parseFloat($bottomRight.html())))*100+'%');
            }
            //3告诉服务器支持的是谁 点击左边type=1,右边type=2
            $.ajax({
                url:'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468531&type='+$tar.attr('type'),
                dataType:'jsonp'
            });
            //4同一ip支持一次后不能在支持 刷新页面也不能再点击 使用本地存储
            //1)页面不刷新时,只能点击一次,点击过增加自定义属性
            $bottom.attr('isTap',true);
            //2)刷新时,只能点击一次 点击后使用本地存储isTap和单击的是谁type,页面刷新时从本地获取进行控制(点击时什么都不做,并且有bg样式,在绑定之前就要进行这个操作)
            localStorage.setItem('support',JSON.stringify({'isTap':true,'type':$tar.attr('type')}));

        });



    }
    function bindHTML(matchInfo){
        var $bottom=$matchInfo.children('.bottom'),
            $bottomLeft=$bottom.children('.home'),
            $bottomRight=$bottom.children('.away');

        //Ⅲ-4-2)获取本地存储,判断是否有支持,如果已经支持,不能在点击和增加背景色
        var support=localStorage.getItem('support');
        if(support){
            support=JSON.parse(support);
            if(support.isTap){
                $bottom.attr('isTap',true);//不能再点击
                support.type==1?$bottomLeft.addClass('bg'):$bottomRight.addClass('bg');
            }
        }
        $support.tap(function () {
            if (isTap) return;
            //->点击谁选中谁,并且让里面的数字加1
            isTap = true;
            $(this).addClass('bg').html(parseFloat($(this).html()) + 1);

            //->重新计算进度条的值
            $progress.css('width', ($supportLeft.html() / (parseFloat($supportLeft.html()) + parseFloat($supportRight.html()))) * 100 + '%');

            //->告诉服务器我支持的是谁,传递TYPE=1支持左边,传递TYPE=2支持右边
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1468531&type=' + $(this).attr('type'),
                type: 'get',
                dataType: 'jsonp'
            });

            //->把本次支持的信息记录到本地,下一次控制不能在支持了
            //localStorage.setItem设置值的时候只能是字符串
            localStorage.setItem('support', JSON.stringify({
                isTouch: true,
                supportType: $(this).attr('type')
            }));
        });
        //1.使用ejs绑定数据
        //得到模版内容,通过render方法将模版和数据拼接为结构,再将结构放入容器中
        $matchInfo.html(ejs.render($matchInfoTemplate.html(),{matchInfo:matchInfo}));
        //2.控制进度条 设置定时器是给HTML一定的渲染时间(将模版字符串放入容器到用户看到需要一段加载时间,浏览器渲染又需要一段时间,在浏览器开始渲染时又开始执行控制进度条的代码,可能在渲染的过程中已经计算出支持率的百分比,导致看不到进度条的动画显示;所以,为看到进度条的动画,设置一个定时器)
        window.setTimeout(function () {
            var leftNum=parseFloat(matchInfo.leftSupport),
                rightNum=parseFloat(matchInfo.rightSupport);//加parseFloat()是将字符串转为数字
            $matchInfo.children('.middle').children('span').css('width',(leftNum/(leftNum+rightNum))*100+'%');
            //为什么不能使用延迟?
        },500);
        //3.为左右支持绑定点击事件 在数据绑定完成后绑定点击事件
        bindEvent();




    }

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
                    }
                }
            });

        }
    }

})();
matchRenter.init();
