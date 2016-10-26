/**
 * Created by Administrator on 2016/10/11 0011.
 */
var http=require('http'),
    url=require('url'),
    fs=require('fs');
var server1=http.createServer(function (req,res) {
   var obj=url.parse(req.url,true),
       pathname=obj.pathname,
       query=obj.query;
    //如果是'/getAll'
    if(pathname=='/getAll'){
        var callback=query['callback'];//获取客户端传递的函数名
        var data={
            name:'zf',
            age:8
        };
        var str=callback+'('+JSON.stringify(data)+')';
        res.writeHead(200,{'content-type':'text/javascript;charset:utf-8'});
        res.end(str);
    }
});
server1.listen(86, function () {
    console.log('server is success,listening on 86 port!');
});