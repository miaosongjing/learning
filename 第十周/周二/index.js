/**
 * Created by Administrator on 2016/9/13 0013.
 */
;(function ($) {//�������$�ý���
    function banner(/*id,*/url,interval){
        //1 ��ȡ����
        var $banner=$(this/*"#"+id*/);
        var $bannerInner=$banner.find(".bannerInner");
        var $focusList=$banner.find(".focusList");
        var $left=$banner.children(".left");
        var $right=$banner.children(".right");
        var $imgs=null;
        var $lis=null;//jq��ȡ����һ��jqʵ��,�����ҳ���Ѿ����ڵ�Ԫ��,��ô���Ի�ȡ.���������,��ʹͨ�����ݰ󶨷�ʽ�������,Ҳ������ԭ��һ��ͨ��domӳ���ϵ�������»�ȡ
//ps:jq�в����ڵ�Ԫ�ز�Ҫ��ǰ��ȡ,�Ȱ������֮�������»�ȡ
//2 ��ȡ����
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
                    //res���ǻ�ȡ������
                    data=res;
                }
            });
        })();
//3 ������
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
//4 �ӳټ���
        ;(function () {
            //ѭ��ÿ��ͼƬ
            $imgs.each(function (index,item) {
                var tempImg=new Image;
                //tempImg.src=imgs[i].getAttribute("realSrc");  prop������������
                $(tempImg).prop("src",$(item).attr("realSrc")).on("load", function () {
                    $(item).prop("src",this.src).css("display","block");
                });
                //��һ����ʾ
                if(index==0){
                    //item�ĸ���zindex����,����ϴζ���,opacity����Ϊ1
                    $(item).parent().css("zIndex",1).stop().animate({opacity:1},300);
                }
            });
        })();
//5 �ֲ�
        var step=0,timer=null;
        timer=window.setInterval(autoMove,interval);
        function autoMove(){
            if(step==data.length-1){
                step=-1;
            }
            step++;
            setBanner();

        }
//����ͼƬ��ʾ
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
//����¼�
        $banner.on("mouseover", function () {
            window.clearInterval(timer);
            $left.css("display","block");
            $right.css("display","block");
        }).on("mouseout", function () {
            timer=window.setInterval(autoMove,interval);
            $left.css("display","none");
            $right.css("display","none");
        });

//������
        ;(function bindEventForLis() {
            $.each($lis, function () {
                $(this).on("click", function () {
                    step=$(this).index();
                    setBanner();
                })
            })
        })();
//��ť�¼�
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

})(jQuery);//$��һ������,Ҳ��һ����


