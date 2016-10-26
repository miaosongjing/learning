/**
 * Created by Administrator on 2016/9/13 0013.
 */
;(function (jQuery) {

        function banner(ajaxUrl,interval) {
            var $banner=$(this);//创面重复获取
            var $bannerInner=$banner.children(".bannerInner"),
                $bannerTip=$banner.children(".bannerTip");
            var $bannerLeft=$banner.children(".bannerLeft"),
                $bannerRight=$banner.children(".bannerRight");
            var $divList=null, $imgList=null,$oLis=null;
            //1.ajax读取数据
            var jsonData=null;
            $.ajax({
                url:ajaxUrl+"?_="+Math.random(),//清除get缓存
                type:"get",
                dataType:"json",
                async:false,//当前请求是同步的
                success: function (data) {
                    jsonData=data;
                }
            });
            //2.数据绑定
            bindData();
            function bindData(){
                var str="",str2="";
                $.each(jsonData, function (index, item) {//获取的jsonData是jq格式的,可以使用each来遍历;each是遍历数组/对象/类数组
                    str+='<div><img src="" trueImg="'+item["src"]+'"/></div>';
                    str2+=index==0?'<li class="bg"></li>':'<li></li>';
                });
                $bannerInner.html(str);
                $bannerTip.html(str2);
                //通过jq选择器获取到的jq集合不存在dom的映射机制,之前获取到的集合,之后在页面中html结构改变了,集合中的内容不会跟着自动发生变化(js获取的元素集合有dom映射机制)
                //绑定数据完成后获取需要的集合
                $divList=$bannerInner.children("div");
                $imgList=$bannerInner.find("img");
                $oLis=$bannerTip.children("li");
            }
            //3.实现图片延迟加载
            window.setTimeout(lazyImg,500);
            function lazyImg(){
                $imgList.each(function (index, item) {
                    var _this=this;
                    var oImg=new Image;
                    oImg.src=$(_this).attr("trueImg");//$(this)->$(item)
                    $(oImg).on("load", function () {
                        $(_this).prop("src",this.src).css("display","block");
                    });
                });
                //$divList.eq(0).css("zIndex",1).fadeIn(300);//fadeIn先让display为block,再让opacity从1直接到0再渐变为1
                $divList.eq(0).css("zIndex",1).animate({opacity:1},300);
            }
            //4.自动轮播
            interval=interval||3000;
            var step=0,autoTimer=null;
            autoTimer=window.setInterval(autoMove,interval);
            function autoMove(){
                if(step==jsonData.length-1){step=-1;}
                step++;
                changeBanner();
            }
            //轮播图切换
            function changeBanner(){
                //图片切换
                var $curDiv=$divList.eq(step);
                $curDiv.css("zIndex",1).siblings().css("zIndex",0);
                $curDiv.animate({opacity:1},300, function () {
                    $(this).siblings().css("opacity",0); //内置遍历系统
                });
                //焦点对齐
                var $curLi=$oLis.eq(step);
                $curLi.addClass("bg").siblings().removeClass("bg");
            }
            //5.控制左右按钮和自动轮播的开始和暂停
            $banner.on("mouseover", function () {
                window.clearInterval(autoTimer);
                $bannerLeft.css("display","block");
                $bannerRight.css("display","block");
            }).on("mouseout", function () {
                autoTimer=window.setInterval(autoMove,interval);
                $bannerLeft.css("display","none");
                $bannerRight.css("display","none");
            });
            //6焦点切换
            $oLis.on("click", function () {
                step=$(this).index();
                changeBanner();
            });
            //7左右切换
            $bannerRight.on("click",autoMove);
            $bannerLeft.on("click", function () {
                if(step==0){
                    step=jsonData.length;
                }
                step--;
                changeBanner();
            });
        }
        //扩展jq插件
        jQuery.fn.extend({
            banner: banner
        });
    }
)(jQuery);

