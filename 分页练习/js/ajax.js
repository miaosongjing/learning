/**
 * Created by Administrator on 2016/10/19 0019.
 */
//定义ajax方法,参数options为一个对象
function ajax(options){
    //1.为options设定默认值,如果传参,用传递的参数代替默认值
    var _default={
        url:null,
        type:'GET',
        dataType:'TXT',
        async:true,
        data:null,
        success:null,
        error:null
    };
    for(var key in options){
        if(options.hasOwnProperty(key)){
            _default[key]=options[key];
        }
    }
    //2.处理ajax请求操作:创建一个ajax对象,打开路径(get请求强制清除缓存),监听状态(2|3开头时,成功或时报),发送
    var xhr=new XMLHttpRequest;
    if(_default.type.toUpperCase()=='GET'){
        _default.url+=_default.url.indexOf('?')==-1?'?':'&';
        _default.url+='_='+Math.random();
    }
    xhr.open(_default.type,_default.url,_default.async);
    xhr.onreadystatechange = function () {
        //1)以2|3开头,监听成功,不同类型的内容(xml,json)处理,然后执行success
        if(/^(2|3)\d{2}$/.test(xhr.status)){
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
                _default.success&&_default.success.call(xhr,text);
            }
        }
        //2.以4|5开头,执行error
        if(/^(4|5)\d{2}$/.test(xhr.status)) {
            _default.error && _default.error.call(xhr, xhr.responseText);
        }
    };
    xhr.send(_default.data);
}