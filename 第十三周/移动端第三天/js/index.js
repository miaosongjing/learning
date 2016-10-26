/**
 * Created by Administrator on 2016/10/15 0015.
 */
//HTML5写法
var prev=document.querySelector('.prev'),
    next=document.querySelector('.next'),
    slides=document.querySelectorAll('.slide');
var index=0;//记录初始显示banner的索引
prev.addEventListener('click',fn,false);
next.addEventListener('click',fn,false);
function fn(){
    //1.初始化
    [].forEach.call(slides, function (item,index) {
        if(/slideCur/.test(item.className)){
            index=index;//把当前显示的slide的索引保存,在它的基础上进行加减
        }
        item.style.display='none';
        item.classList.remove('slideCur');
    });
    //2.处理切换:
    // 获取自定义属性的值,判断时prev还是next按钮;通过index,切换图片
    var btn=this.dataset.name;
    if(btn==='prev'){
        index=index==0?slides.length-1:index-1;
    }else if(btn==='next'){
        index=index==slides.length-1?0:index+1;
    }
    slides[index].style.display='block';
    //设置定时器:display属性和transition一起设置时,会让过渡动画失效
    window.setTimeout(function(){
        slides[index].classList.add("slideCur");/*增加类名*/
    },100);
}