/**
 * Created by Administrator on 2016/10/8 0008.
 */
~function (pro) {
    ////////////////////////////////////////////////////////////////////////
    //把url地址问号后面的参数值,并以对象键值对的方式保存
    function queryURLParameter(){
        var reg=/([^?&=#]+)=([^?&=#]+)/g,
            obj={};
        this.replace(reg, function () {
            obj[arguments[1]]= arguments[2];
        });
        return obj;
    }
    pro.queryURLParameter=queryURLParameter;
}(String.prototype);
var detailRender=(function () {
    var submit=document.getElementById('submit'),
        userName=document.getElementById('userName'),
        userAge=document.getElementById('userAge'),
        userPhone=document.getElementById('userPhone'),
        userAddress=document.getElementById('userAddress');

    var customId=null,
        isUpdate=false;
    //绑定要提交的点击事件:修改/增加
    function bindEvent(){
        submit.onclick= function () {
            //Ⅰ.修改
            if(isUpdate){
                var data='{"id":'+customId+',"name":"'+userName.value+'","age":'+userAge.value+',"phone":"'+userPhone.value+'","address":"'+userAddress.value+'"}';
                ajax({
                    url: '/updateInfo',
                    type: 'POST',
                    dataType: 'JSON',
                    data: data,
                    success: function (result) {
                        if (result && result.code === 0) {
                            window.location.href = "index.html";
                        }
                    }
                });
                return;
            }
            //Ⅱ.增加
            //1.获取四个文本框中内容,准备好要发送给服务器的数据
            data='{"name":"'+userName.value+'","age":'+userAge.value+',"phone":"'+userPhone.value+'","address":"'+userAddress.value+'"}';
            //2.把获取的数据传递给服务器:发送AJAX请求,请求成功后,根据服务器返回的结果进行处理:如果增加成功回到首页,失败时给用户一个提示
            ajax({
                url:'/addInfo',
                type:'POST',
                dataType:'JSON',
                data:data,
                success: function (result) {
                    if(result&&result.code===0){
                        //js中实现页面跳转window.location.href="xxx"; 在新窗口打开也买呢window.open("xxx")
                        window.location.href="index.html";
                    }
                }

            });
        }
    }
    return {
        init: function () {
            //修改
            //进入页面先获取URL地址栏中的参数信息,如果有ID就是修改,并且需要知道修改的是哪个客户( window.location.href获取浏览器地址栏的URL)queryURLParameter解析url
            //1.获取url并解析
            var obj=window.location.href.queryURLParameter();
            //2.id存在,为修改
            if(typeof obj['id']!='undefined'){
                //
                isUpdate=true;
                customId=obj['id'];

                //如果是修改,首先需要把客户的信息获取到,然后把信息存储到页面对应的文本框中
                ajax({
                    url:'/getInfo?id='+customId,
                    type:'GET',
                    dataType:'JSON',
                    success: function (result) {
                        if(result&&result.code===0){
                           var data=result['data'];
                            userName.value=data['name'];
                            userAge.value=data['age'];
                            userPhone.value=data['phone'];
                            userAddress.value=data['address'];
                        }
                    }
                });
            }

            //绑定提交的点击事件
            bindEvent();
        }
    }
})();
detailRender.init();

