/**
 * Created by Administrator on 2016/10/22 0022.
 */
//rem
(function () {
    document.documentElement.style.fontSize=document.documentElement.clientWidth/640*100+'px';
})();
//页面中如果使用touchMove的原生事件,需要把浏览器默认的行为阻止 百度浏览器的touchMove把当前的页面关闭,qq浏览器进行页面切换
$(document).on('touchmove touchstart touchend', function (ev) {
    ev.preventDefault();//阻止事件的默认行为
});
//banner
var bannerRender=(function () {
    var $banner=$('.banner'),
        $wrapper=$banner.children('.wrapper'),
        $slideList=$wrapper.children('.slide'),
        $imgList=$wrapper.find('img'),
        $tipList=$banner.children('.tip').find('li');
    var winW=document.documentElement.clientWidth,
        minL=0,
        maxL=0;
    var step=1,//存储展示的为第几张图片
        count=0,//图片总数
        followTimer=null;//监听用定时器
    //1.延迟加载 当前图片和左右相邻的两张延迟下载  pc端延迟加载将真实图片的地址赋值给自定义属性,这里使用data-src

    function lazyImg(){
        var $cur=$slideList.eq(step);
        //1.获取当前要加载的对象集合
        var $tar=$cur.add($cur.prev()).add($cur.next());//向现有集合中添加一个元素  每次只能增加一个  上一个哥哥 下一个弟弟
        //2.添加图片
        $tar.each(function (index, item) {
            //1)获取img
            var $img=$(item).children('img');
            //2)创建新的图片,把真实图片的地址赋值给它的src,如果加载成功,将真实图片地址赋值个真实图片,将图片显示;如果加载过,下载就不在加载

            if($img.attr('isLoad')==='true')return;// attr存储或获取的属性值都是字符串,如果当前图片已经加载过,就不需要重新的加载
            var oImg=new Image;
            oImg.src=$img.attr('data-src');
            oImg.onload= function () {
                $img.attr({
                    src:this.src,
                    isLoad:true
                }).css('display','block');
                //临时清空
                oImg=null;
            }
        });

    }
    //3.公共方法
    //3-1是否滑动的公共方法:水平/垂直偏移>30px
    function isSwipe(strX,strY,endX,endY){
        return Math.abs(endX-strX)>30||Math.abs(endY>strY)>30;
    }
    //3-2 判断滑动方向的公共方法:水平和垂直的偏移比较确定是水平还是垂直,根据偏移大于还是小于0确定是向左/上还是右/下
    function swipeDir(strX,strY,endX,endY){
        return Math.abs(endX-strX)>=Math.abs(endY-strY)?(endX-strX>0?'right':'left'):(endY-strY>0?'down':'up');
    }
    //2.控制滑动 touchstart/touchmove/touchend
    //2-1//touchStart时,记录手指/盒子坐标
    function dragStart(ev){
        var point=ev.touches[0];//toches存储所有手指的信息
        $wrapper.attr({
           strL:parseFloat($wrapper.css('left')),//JQ和Zepto通过css获取的样式值都带有单位
            strX:point.clientX,//手指的位置
            strY:point.clientY,
            isMove:false,//是否发生滑动 存的值为字符串,比较是也需要是字符串
            dir:null,//滑动方向
            changeX:null//x轴的偏移距离
        });
    }
    //2-2touchMove时,获取手指最新值,用最新值-起始值=偏移;touchEnd时,手指已经离开,无法获取手指位置,所以,需要在touchMove时记录手指位置
    function dragIng(ev){
        var point=ev.touches[0];
        var endX=point.clientX,
            endY=point.clientY,
            strX=parseFloat($wrapper.attr('strX')),//获取的结果是字符串,需要parseFloat取数字
            strY=parseFloat($wrapper.attr('strY')),
            strL=parseFloat($wrapper.attr('strL')),
            chaneX=endX-strX;
        //1)确定是否发生滑动和滑动的方向
        var isMove=isSwipe(strX,strY,endX,endY),
            dir=swipeDir(strX,strY,endX,endY);
        //2)发生滑动,对左右方向(通过正则获取方向)进行不同处理
        if(isMove&&/(left|right)/i.test(dir)){
            //补齐自定义属性
            $wrapper.attr({
                isMove:true,
                dir:dir,
                changeX:chaneX
            });
            //设置$wrapper的left值(原来的left+偏移),注意边界判断
            var curL=strL+chaneX;
            curL=curL>maxL?maxL:(curL<minL?minL:curL);
            $wrapper[0].style.webkittTransitionDuration='0s';//在滑动过程中没有动画
            $wrapper.css('left',curL);
        }
    }
    //2-3当changeX>屏幕一半时才切换到下一张图片(防止用户误操作),并且使图片运动到目标位置;设置定时器,
    function dragEnd(ev){
        var isMove=$wrapper.attr('isMove'),
            dir=$wrapper.attr('dir'),
            changeX=parseFloat($wrapper.attr('changeX'));
        //1)发生滑动,对左右方向(通过正则获取方向)进行不同处理
        if(isMove&&/(left|right)/i.test(dir)){
            //2)当changeX>屏幕一半时,根据左/右滑切换到下一张
            if(Math.abs(changeX)>=winW/2){
                if(dir==='left'){
                    step++;
                }else{
                    step--;
                }
            }
            //3)使下一张图片从当前位置运动到目标位置  (运动:animate或css3动画),延迟加载

            $wrapper[0].style.webkitTransitionDuration='.2s';//[0]转换为原生js 注意动画是在手指离开屏幕后,在滑动过程中不需要有动画
            $wrapper.css('left',-step*winW);
            //4)动画运动过程中,监听一个定时器:动画运动完成,判断当前是否运动到边界;如果到达边界,让图片回到自己真实位置(前后两张是添加的) 实现焦点对齐
            window.clearTimeout(followTimer);//防止之前还有
            followTimer=window.setTimeout(function () {
                //到达边界值
                if(step===0||step===count-1){
                    $wrapper[0].style.webkitTransitionDuration='0s';//立马运动
                    step=step===0?count-2:1;
                    $wrapper.css('left',-step*winW);
                }
                lazyImg();//向左时的延迟加载
                //实现焦点对齐,在延迟加载时,改变step,通过当前索引使图片有选中样式
                $tipList.removeClass('bg');
                $tipList.eq(step-1).addClass('bg');
                window.clearTimeout(followTimer);//事情结束后,清除
            },200);



        }
    }
    return {
        init: function () {
            count=$slideList.length;
            minL=-(count-1)*winW;//设定最小值进行滑动时计算的边界
            $wrapper.css('width',count*winW);
            $slideList.css('width',winW);
            //初始化之后进行延迟加载
            lazyImg();
            //控制滑动 控制的是wrapper,滑动的是banner left变大向左走  右滑向左走,left值越大(为负);左滑向右走,left值越小(负值)
            $banner.on('touchstart',dragStart).on('touchmove',dragIng).on('touchend',dragEnd);


        }
    }
})();
bannerRender.init();