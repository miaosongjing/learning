/**
 * Created by Administrator on 2016/10/11 0011.
 */
    //在文本框输入/获取焦点 有内容时,随时发送请求,获取数据后把相关匹配内容绑定在列表中;没有隐藏
    //文本框失去焦点,列表隐藏
    //点击列表中某个内容,内容显示在文本框中,列表消失
var searchRender=(function () {
    var $searchInp=$('#searchInp');
    var $searchList=$('#searchList');
    function inpEven(){
        var val=$(this).val();//val方法:获取文本框中内容
        //1.没有内容 ul隐藏
        if(val.length==0){
            $searchList.stop().slideUp(100);
            return;
        }
        //2.有输入内容
        //1)发送请求
        $.ajax({
            url:'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd='+val,
            type:'get',
            dataType:'jsonp',
            jsonp:'cb',
            jsonpCallback:'search',
            success: function (result) {
                //2)请求成功:获取推荐结果,有时列表展示,没有列表收起
                if(!result)return;
                var data=result['s'];//获取推荐结果
                if(data.length==0){//没有推荐内容
                    $searchList.stop().slideUp(100);
                    return;
                }
                //有推荐内容:绑定li,展开ul
                var str='';
                $.each(data, function (index, item) {//each循环数组和类数组
                   if(index>3)return false;
                    str+='<li>'+item+'</li>';
                });
                $searchList.html(str).stop().slideDown(100);//html方法:实现数据绑定
            }
        });
    }


    return {
        init: function () {
        //Ⅰ 文本框获取焦点和输入内容:判断文本框中是否有内容:有,绑定数据;没有,隐藏展示框
            $searchInp.on('focus keyup', inpEven);//focus获取焦点  keyup输入内容

            //Ⅱ 事件委托处理:点击不同位置,实现不同操作(事件委托):点击文本框,什么都不做;点击ul>li,隐藏ul和把li中的内容赋值在文本框;其他区域,隐藏ul
            $('body').on('click', function (ev) {
                var tar = ev.target,
                    tarTag = tar.tagName.toUpperCase();
                //INPUT
                if (tarTag === "INPUT" && tar.id == "searchInp")return;
                //LI
                if (tarTag === "LI" && tar.parentNode.id == "searchList") {
                    $searchInp.val(tar.innerHTML);
                    $searchList.stop().slideUp(100);
                    return;
                }
                //OTHER
                $searchList.stop().slideUp(100);
            });
        }
    }
})();
searchRender.init();