/**
 * Created by Administrator on 2016/9/13 0013.
 */
;(function ($) {//将外面的$拿进来
    function banner(/*id,*/url,interval){
        //1 获取对象
        var $banner=$(this/*"#"+id*/);
        var $bannerInner=$banner.find(".bannerInner");
        var $focusList=$banner.find(".focusList");
        var $left=$banner.children(".left");
        var $right=$banner.children(".right");
        var $imgs=null;
        var $lis=null;//jq获取的是一个jq实例,如果是页面已经存在的元素,那么可以获取.如果不存在,即使通过数据绑定方式重新添加,也不会像原生一样通过dom映射关系不用重新获取
//ps:jq中不存在的元素不要提前获取,等帮绑定数据之后在重新获取
//2 获取数据
        var data=null;
        url=url;
        interval=interval||2000;
        ;(function  getData() {
            $.ajax({
                type:"get",
                url:url+"?_="+new Date().getTime(),
                async :false,
                dataType:"json",
                success: function (res) {
                    //res就是获取的数据
                    data=res;
                }
            });
        })();
//3 绑定数据
        ;(function bindData() {
            var str="",str1="";
            $.each(data, function (index, item) {
                str+='<div><img src="" realSrc="'+item.src+'"/></div>';
                str1+=index==0?'<li class="bg"></li>':'<li></li>';
            });
            $bannerInner.html(str);
            $focusList.html(str1);

        })();
        $imgs=$bannerInner.find("img");
        $lis=$focusList.find("li");
//4 延迟加载
        ;(function () {
            //循环每张图片
            $imgs.each(function (index,item) {
                var tempImg=new Image;
                //tempImg.src=imgs[i].getAttribute("realSrc");  prop设置内置属性
                $(tempImg).prop("src",$(item).attr("realSrc")).on("load", function () {
                    $(item).prop("src",this.src).css("display","block");
                });
                //第一张显示
                if(index==0){
                    //item的父级zindex设置,清除上次动画,opacity动画为1
                    $(item).parent().css("zIndex",1).stop().animate({opacity:1},300);
                }
            });
        })();
//5 轮播
        var step=0,timer=null;
        timer=window.setInterval(autoMove,interval);
        function autoMove(){
            if(step==data.length-1){
                step=-1;
            }
            step++;
            setBanner();

        }
//设置图片显示
        function setBanner(){
            $.each($imgs, function (index, item) {
                if(index==step){
                    $(this)/*item*/.parent().css("zIndex",1).stop().animate({opacity:1},500, function () {
                        $(item).parent().siblings().css("opacity",0);
                    });
                }else{
                    $(item).parent().css("zIndex",0)
                }
            });
            $.each($lis, function (index, item) {
                index==step?$(item).addClass("bg"):$(item).removeClass("bg");
            });
        }
//鼠标事件
        $banner.on("mouseover", function () {
            window.clearInterval(timer);
            $left.css("display","block");
            $right.css("display","block");
        }).on("mouseout", function () {
            timer=window.setInterval(autoMove,interval);
            $left.css("display","none");
            $right.css("display","none");
        });

//焦点点击
        ;(function bindEventForLis() {
            $.each($lis, function () {
                $(this).on("click", function () {
                    step=$(this).index();
                    setBanner();
                })
            })
        })();
//按钮事件
        $left.on("click", function () {
            step==0?step=data.length:null;
            step--;
            setBanner();
        });
        $right.on("click",autoMove);
    }
    //$.extend({
    //    banner:banner
    //});
    $.fn.extend({
        banner:banner
    });

})(jQuery);//$是一个函数,也是一个类


