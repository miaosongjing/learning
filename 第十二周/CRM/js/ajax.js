/**
 * Created by Administrator on 2016/10/8 0008.
 */
/**
 * ajax:封装的一个简易的ajax库
 * @param options:[object] 需要配置的参数信息都存储在这个对象中
 */
function ajax(options){
    //1.参数初始化:用传递进来的值替换默认的值
    var _default={
        url:null,
        type:'GET',
        dataType:'TXT',//TXT/XML/JSON
        async:true,
        data:null,//GET 请求data不传值,POST请求时传值.传的值是JSON字符串
        success:null,
        error:null
    };
    for(var key in options){
        if(options.hasOwnProperty(key)){
            _default[key]=options[key];
        }
    }
    //2.处理ajax请求操作
    var xhr=new XMLHttpRequest;
    //1)如果是get请求,清除缓存
    if(_default.type.toUpperCase()==="GET"){
        _default.url+=_default.url.indexOf('?')===-1?'?':'&';
        _default.url+='_='+Math.random();
    }
    xhr.open(_default.type,_default.url,_default.async);
    xhr.onreadystatechange= function () {
        if(/^(2|3)\d{2}$/.test(xhr.status)){
            //返回内容类型的处理
            if(xhr.readyState==4){
                var text=xhr.responseText;
                _default.dataType=_default.dataType.toUpperCase();
                switch (_default.dataType){
                    case 'XML':
                        text=xhr.responseXML;
                        break;
                    case 'JSON':
                        text='JSON' in window?JSON.parse(text):eval('('+text+')');
                        break;
                }
                //执行success
                _default.success&&_default.success.call(xhr,text);
            }

        }
        if(/^(4|5)\d{2}$/.test(xhr.status)){
            _default.error&&_default.error.call(xhr,xhr.responseText);
        }
    };
    xhr.send(_default.data);
}