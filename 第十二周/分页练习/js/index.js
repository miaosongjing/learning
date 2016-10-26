/**
 * Created by Administrator on 2016/10/19 0019.
 */
var pageRender=(function () {
    var box=document.getElementById('box'),
        list=document.getElementById('list'),
        pageNum=document.getElementById('pageNum'),
        pageInp=document.getElementById('pageInp');
    var total=0,page=1;
    ////////////////////////////////////
    function bindHTML(){
        //2.绑定数据
        function fn(result){
            if(!result)return;
            total=parseInt(result['total']);
            var data=result['data'];
            var str='';
            //    1)list区域的数据绑定
            for(var i=0;i<data.length;i++){
                var curData=data[i];
                str+='<li data-id="'+curData['id']+'">';
                str+='<span>'+curData['id']+'</span>';
                str+='<span>'+curData['name']+'</span>';
                str+='<span>'+(curData['sex']=='1'?'女':'男')+'</span>';
                str+='<span>'+curData['score']+'</span>';
                str+='</li>'
            }
            list.innerHTML=str;
            //2)pageNum区域
            str='';
            for(var k=1;k<=total;k++){
                if(k===page){
                    str+='<li class="bg">'+k+'</li>';
                    continue;
                }
                str+='<li>'+k+'</li>';
            }
            pageNum.innerHTML=str;
            //3)pageInp区域
            pageInp.value=page;
        }
        //1.发送ajax请求
        ajax({
            url:'/getList?page='+page,
            dataType:'JSON',
            type:'GET',
            success:fn
        });
    }
    //////////////////////////////////////
    function bindEvent(e){
        e=e||window.event;
        var tar=e.target||e.srcElement,
            tarTag=tar.tagName.toUpperCase(),
            tarInn=tar.innerHTML;
        //事件源:list>span  跳转详细页 通过id传递把当前客户的信息绑定
        if(tarTag==='SPAN'&&tar.parentNode.parentNode.id==='list'){
            window.open('detail.html?id='+tar.parentNode.getAttribute('data-id'));
            return;
        }
        //page>span
        if(tarTag==='SPAN'&&tar.parentNode.className==='page'){
            if(tarInn=='FIRST'){
                if(page===1)return;
                page=1;
            }
            if(tarInn==='PREV'){
                if(page===1)return;
                page--;
            }
            if(tarInn==='NEXT'){
                if(page===total)return;
                page++;
            }
            if(tarInn==='LAST'){
                if(page===total)return;
                page=total;
            }
            bindHTML();
        }
        //pageNum>li  注意数字的处理
        if(tarTag==='LI'&&tar.parentNode.id==='pageNum'){
            if(page===parseInt(tarInn))return;
            page=parseInt(tarInn);
            bindHTML();
        }
    }
    return {
        init:function (){
            bindHTML();
            box.onclick=bindEvent;
            /////////////////////////////////
            //文本框按下键盘事件
            pageInp.onkeyup= function (e) {
                e=e||window.event;
                if(e.keyCode===13){
                    var val=Math.round(this.value);
                    if(isNaN(val)){
                        this.value=page;
                        return;
                    }
                    val<1?val=1:null;
                    val>total?val=total:null;
                    page=val;
                    bindHTML();
                }
            }
        }
    };
})();
pageRender.init();