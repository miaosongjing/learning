/**
 * Created by Administrator on 2016/10/11 0011.
 */
    //写成单例模式的标准样式
    //获取数据,实现首页数据绑定
var pageRender=(function (){
    var box=document.getElementById('box'),//事件委托
        list=document.getElementById('list'),//添加li
        pageName=document.getElementById('pageName'),//添加li
        pageInp=document.getElementById('pageInp');//添加内容
    var total=0,//总页数 便于添加pagename时使用
        page=1;//当前页码  选中页添加特殊样式
    //bindHTM 从服务器获取指定页码的数据,实现数据绑定
    function bindHTML(){
        //2.数据绑定
        var fn= function (result) {
            if(!result)return;
            total=parseInt(result['total']);
            var data=result['data'];
            //1)LIST区域数据绑定
            var str='';
            for(var i=0,len=data.length;i<len;i++){
                var curData=data[i];
                str+='<li data-id="'+curData['id']+'">';//添加自定义属性记录id值,便于点击时跳转到指定页面,显示其详细信息
                str+='<span>'+curData['id']+'</span>';
                str+='<span>'+curData['name']+'</span>';
                str+='<span>'+(curData['sex']==1?'女':'男')+'</span>';
                str+='<span>'+curData['score']+'</span>';
                str+='</li>';
            }
            list.innerHTML=str;
            //2)PAGE NAME
            str='';
            for(var k=1;k<=total;k++){//k从1开始
                if(k===page){//是选中页时,添加classbg
                    str+='<li class="bg">'+k+'</li>';
                    continue;
                }
                str+='<li>'+k+'</li>';
            }
            pageName.innerHTML=str;
            //3)PAGE INP
            pageInp.value=page;
        };
        //1.向服务器发送请求,获取指定的数据
        ajax({
            url:'/getList?page='+page,
            type:'GET',
            dataType:'JSON',
            success: fn
        });
    }
    //bindEvent 用事件委托处理盒子中的各种点击事件
    function bindEvent(ev){
        ev=ev||window.event;
        var tar=ev.target||ev.srcElement,
            tarTag=tar.tagName.toUpperCase(),
            tarInn=tar.innerHTML;
        //事件源分为三种
        //1.list>span:跳转到详细页,把当前客户的ID传递给详细页//id绑定在自定义属性上
        if(tarTag==='SPAN'&&tar.parentNode.parentNode.id==='list'){
            window.open('detail.html?id='+tar.parentNode.getAttribute('data-id'));
            return;
        }
        //2.page>span:计算最新page,重新绑定数据
        if(tarTag==='SPAN'&&tar.parentNode.className==='page'){
            //计算最新page
            if(tarInn==='FIRST'){//第一个
                if(page===1)return;
                page=1;
            }
            if(tarInn==='PREV'){//上一个
                if(page===1)return;
                page--;
            }
            if(tarInn==='NEXT'){//下一个
                if(page===total)return;
                page++;
            }
            if(tarInn==='LAST'){//最后一个
                if(page===total)return;
                page=total;
            }
            //重新绑定数据
            bindHTML();
        }
        //3.pageNum>li:最新的page为点击的按钮,重新绑定数据
        if(tarTag==='LI'&&tar.parentNode.id==='pageName'){
            if(page===parseInt(tarInn))return;
            page=parseInt(tarInn);
            bindHTML();
        }
    }
    return {
        init: function () {
            //Ⅰ加载页面,绑定数据,展示第一页
            bindHTML();
            //Ⅱ 使用事件委托处理盒子中的各种点击事件
            box.onclick= bindEvent;
            //Ⅲ 文本框按下键盘事件处理
            pageInp.onkeyup= function (ev) {
                ev=ev||window.event;
                if(ev.keyCode===13){//enter键
                    var val=Math.round(this.value);
                    //1.如果输入的不是有效数字,还是当前页
                    if(isNaN(val)){
                        this.value=page;
                        return;
                    }
                    //2.如果输入的值小于1或大于total
                    val<1?val=1:null;
                    val>total?val=total:null;
                    page=val;
                    bindHTML();
                }
            }
        }
    }
})();
pageRender.init();
