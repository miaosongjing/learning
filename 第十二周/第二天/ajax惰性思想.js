/**
 * Created by Administrator on 2016/10/7 0007.
 */
(function (){
    // createXHR:创建ajax对象 兼容所有浏览器
    function createXHR(){
        var xhr=null,
            flag=false,
            ary=[
                function () {
                    return new XMLHttpRequest();
                },
                function () {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                },
                function () {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                },
                function () {
                    return new ActiveXObject('Msxml3.XMLHTTP');
                }
            ];
        for(var i=0,len=ary.length;i<len;i++){
            var curFn=ary[i];
            try{//本次循环获取的方法执行没有出现错误,说明此方法是我想要的,下次直接执行这个小方法即可,这就需要把createXHR重写为小方法;完成后不需要判断下面的,直接退出循环即可
                xhr=curFn();
                createXHR=curFn;
                flag=true;
                break;
            }catch(e) {//本次循环获取的方法执行出现错误,继续执行下次循环

            }
        }
        if(!flag){//当四个方法都不执行
            throw new Error("your browser is not support ajax,please change your browser,try again!");
        }
        return xhr;
    }
//ajax:实现ajax请求的公共方法,当一个方法传递的参数值过多,而且不固定时,使用对象统一传值法(把需要传递的参数值先放在一个对象中,一起传递)
    function ajax(options){
        //1.参数初始化:用传递进来的值替换默认的值
        var _default={
            url:"",//请求地址
            type:"get",//请求方式
            dataType:"json",//设置请求回的内容格式  "json"就是JSON格式的对象  "txt"就是JSON格式的字符串
            async:true,//请求是同步还是异步
            data:null,//放在请求主体中内容  //GET 请求data不传值,POST请求时传值.传的值是JSON字符串
            getHead:null,//当readyState=2时执行的回调方法
            success:null////当readyState=4时执行的回调方法
        };
        //2.使用用户自己传递进来的值覆盖默认值
        for(var key in options){
            if(options.hasOwnProperty(key)){//只遍历私有
                _default[key]=options[key];
            }
        }
        //3.处理ajax请求操作
        //1)如果是get请求,需要在URL的末尾添加随机数,清除缓存
        if(_default.type.toUpperCase()==="GET"){
            _default.url.indexOf("?")>=0?_default.url+="&":_default.url+="?";//url中没有?时加?,有时加&
            _default.url+="_="+Math.random();//添加随机数
        }
        //2)send ajax
        var xhr=createXHR();
        xhr.open(_default.type,_default.url,_default.async);
        xhr.onreadystatechange= function () {
            if(/^(2|3)\d{2}$/.test(xhr.status)){
                //想要在readystate===2是时做一些操作,需要保证ajax为异步请求
                if(xhr.readyState===2){
                    if(typeof _default.getHead=="function"){
                        _default.getHead.call(xhr);
                    }
                }
                if(xhr.readyState===4){
                    var val=xhr.responseText;
                    _default.dataType=_default.dataType.toUpperCase();
                    switch (_default.dataType){
                        case 'XML':
                            val=xhr.responseXML;
                            break;
                        case 'JSON':
                            val='JSON' in window?JSON.parse(val):eval('('+val+')');
                            break;
                    }
                    _default.success&&_default.success.call(xhr,val);
                }
            }
            if(/^(4|5)\d{2}$/.test(xhr.status)){
                _default.error&&_default.error.call(xhr,xhr.responseText);
            }
        };
        xhr.send(_default.data);
    }
    window.ajax=ajax;
})();
ajax({
    url:'data.txt',
    type:'get',
    dataType:'json',
    async:false,
    getHead: function () {
        //this->xhr当前的AJAX对象
    },
    success: function (data) {
        //this->xhr当前的AJAX对象
        //data:从服务器获取的主体内容
    }
});


