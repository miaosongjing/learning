/**
 * Created by Administrator on 2016/10/8 0008.
 */
//1 引入内置模块
var http=require("http"),
    url=require("url"),
    fs=require("fs");
//2.创建服务
var server1=http.createServer(function (request,reponse) {//当客户端向80端口发送请求时,触发此回调函数
    //request:存储请求信息
    // reponse:提供一系列方法供服务器端项客户端返回内容
    //4.获取客户端请求的url地址,并且把地址进行解析
    var obj=url.parse(request.url,true),//parse将客户端传递的url解析,true-以键值对的方式存储
        pathname=obj.pathname,//请求资源文件的路径和名称
        query=obj.query;//客户端问号传递过来的所有参数值,
    //5.判断请求的是否为index.html
    //统一处理资源文件请求
    var reg=/\.([a-zA-Z]+)/i;
    if(reg.test(pathname)){//匹配成功的话就是资源文件
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIME='text/plain';
        switch(suffix){
            case 'HTML':
                suffixMIME='text/html';
                break;
            case 'CSS':
                suffixMIME='text/css';
                break;
            case 'JS':
                suffixMIME='text/javascript';
                break;
        }
        try{
            var conFile=fs.readFileSync('.'+pathname,'utf8');
            response.writeHead(200,{"content-type":suffixMIME+";charset=utf-8;"});
            response.end(conFile);
        }catch(e){
            response.writeHead(404,{"content-type":"text/plain;charset=utf-8;"});
            response.end('Not Found!');
        }
    }
    //jsonp的处理
    if(pathname=='/getAll'){
        //1.接受客户端传递的函数名
        var fnName=query("callback");//规定传递函数名时使用callback
        //2.准备数据
        var con=fs.readFileSync("./custom.json","utf-8");
        //3.返回给客户端的内容
        reponse.writeHead(200,{'content-type':'text/javascript;charset=utf-8;'});//注意:告诉客户端这是js文件,从而按照js格式进行解析
        reponse.end(fnName+'('+con+')');
    }
    //if(pathname==='/index.html'){
    //    //1)得到源代码
    //    var conFile=fs.readFileSync('./index.html','utf8');
    //    //3)重写响应头信息,告诉客户端返回的源代码的格式
    //    reponse.writeHead(200,{"content-type":"text/html;charset=utf-8"});
    //    //2)返回客户端
    //    reponse.end(conFile);//返回
    //}
    //if(pathname==='/css/test.css'){
    //     conFile=fs.readFileSync('./css/test.css','utf8');
    //    reponse.writeHead(200,{"content-type":"text/css;charset=utf-8"});
    //    reponse.end(conFile);
    //}
});
//3.给服务监听端口
server1.listen(80, function () {
    console.log('server is success,listening on 80 port!');
});