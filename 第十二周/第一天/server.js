/**
 * Created by Administrator on 2016/10/7 0007.
 */
//引入内置三个模块
var http=require("http"),
    url=require("url"),
    fs=require("fs");
//1.创建一个服务
var server1=http.createServer(function (req, res) {
    //3.解析客户端请求资源文件的目录名称和传递给当前服务器的数据内容
    var urlObj=url.parse(req.url,true),
        pathname=urlObj["pathname"],
        query=urlObj["query"];
    //4.获取请求文件的源代码,返回客户端和try-catch容错处理(防止客户端请求的资源文件不存在导致服务终止和报错)
    //处理静态资源文件的请求(如html css js):有的浏览器不能识别请求文件的MIME类型,导致请求回文件后不能正常渲染=="前端路由":根据客户端请求文件路径不同,返回不同的内容
    var reg=/\.(HTML|JS|CSS|JSON|TXT|ICO)/i;//请求的文件类型
    if(reg.test(pathname)){
        //获取请求资源文件的后缀名
        var suffix=reg.exec(pathname)[1].toUpperCase();
        //根据请求文件的后缀名获取当前文件的MIME类型
        var suffixMIME="text/plain";//默认为文本txt的MIME类型
        switch (suffix){
            case "HTML":
                suffixMIME="text/html";
                break;
            case "CSS":
                suffixMIME="text/css";
                break;
            case "JS":
                suffixMIME="text/javascript";
                break;
            case "JSON":
                suffixMIME="application/json";
                break;
            case "ICO":
                suffixMIME="application/octet-stream";
                break;
        }
        try{
            //Ⅰ按照指定的目录读取文件内容或代码(读取的内容都是字符串格式)
            var conFile=fs.readFileSync("."+pathname,"utf-8");

            //Ⅱ重写响应头信息:告诉客户端浏览器返回文件的MIME类型,并且指定返回的内容格式是UTF-8编码的,避免乱码
            res.writeHead(200,{"content-type":suffixMIME+";charset=utf-8;"});
            // 服务端向客户端返回的内容也是字符串
            //Ⅲ将读取内容返回
            res.end(conFile);
        }catch(e){
        res.writeHead(404,{"content-type":"text/plain;charset=utf-8;"});
            res.end("request file is not find!");
        }

    };
    //MIME类型:每一种资源文件都有自己的标识类型;HTML文件--"text/html" CSS文件--"text/css"
    //浏览器按照文件的MIME类型进行渲染

});
//2.为当前服务配置端口
server1.listen(80, function () {
    console.log("server is success,listening on 80 port!");
});
//node执行
//客户端发送请求


