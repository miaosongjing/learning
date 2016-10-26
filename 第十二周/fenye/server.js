
var http=require('http'),
    url=require('url'),
    fs=require('fs');
var server1=http.createServer(function (req, res) {
   var urlObj=url.parse(req.url,true),
       pathname=urlObj.pathname,
       query=urlObj.query;
    //1.静态资源文件的处理:服务器接受到具体请求的文件后把文件中的原代码返回
    var reg=/\.(HTML|CSS|JS|ICO)/i;
   if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIME=suffix==='HTML'?'text/html':(suffix=='CSS'?'text/css':'text/javascript');
        try{
            res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8;'});
            res.end(fs.readFileSync('.'+pathname,'utf-8'));//注意.
        }catch(e) {
            res.writeHead(404);
            res.end('NOT FOUND!');
        }
    }
    //2.API接口文档规定的数据请求处理
    //1)获取所有内容
    var data = fs.readFileSync('./json/student.json', 'utf-8');
    data = data.length == 0 ? '[]' : data;
    data = JSON.parse(data);
    if(pathname=='/getList'){
        //2)得到n,把第n页的数据返回
        var n=query['n'],
            ary=[];//3)创建一个空数组存放需要的内容
        //4)获取需要的数据
        for(var i=(n-1)*10;i<n*10;i++){
            //5)边界处理:大于最大索引时,不用再存储--最后一页
            if(i>data.length-1){break;}
            ary.push(data[i]);
        }

        //6)重写响应头,按照api要求返回
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify({
            code:0,
            msg:'success',
            total:Math.ceil(data.length/10),
            data:ary
        }));
        return;
    }
//2)获取指定信息
    if(pathname=='/getInfo'){
        //得到id
        var studentId=query['id'],
            obj=null;
        //获取指定信息和信息不存在
        for(i=0;i<data.length;i++){
            if(data[i]['id']==studentId){obj=data[i];}
        }
        var result={code:1, msg:'error', data:null};
        if(obj){
            result={
                code:0,
                msg:'success',
                data:obj
            };
        }
        //6)重写响应头,按照api要求返回
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }
    //3)请求接口不存在
    res.writeHead(404);
    res.end('request api url is not found!');


});
server1.listen(88, function () {
    console.log('server is success,listening on 88 port!')
});