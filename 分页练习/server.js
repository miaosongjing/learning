/**
 * Created by Administrator on 2016/10/19 0019.
 */
//引入模块 创建服务  监听端口
var http=require('http'),
    url=require('url'),
    fs=require('fs');
//创建服务
var server1=http.createServer(function (request, response) {
    //1.获取客户端传递的路径(路径名称,文件类型)
    var urlObj=url.parse(request.url,true),//?????????????
        pathname=urlObj.pathname,//文件内容
        query=urlObj.query;//问号传参的内容
    //2.处理静态资源文件
    // 1)针对不同后缀的文件,设定为不同的文件类型
    var reg=/\.([a-zA-Z]+)/i;//注意.
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIME=suffix=='HTML'?'text/html':(suffix==='CSS'?'text/css':'text/javascript');
        //2)读取资源文件,重写响应头,返回客户端
        var conFile='NOT FOUND',
            status=404;
        //console.log(1);
        try{
            conFile=fs.readFileSync('.'+pathname,'utf-8');
            status=200;
            //console.log(2);
        }catch (e){}
        response.writeHead(status,{'content-type':suffixMIME+';charset=utf-8;'});
        response.end(conFile);
        return;
    }
    //3.处理不同的API接口
    //1)读取所有数据,转为json格式对象,注意数据为空的情况
    var allData=fs.readFileSync('./json/userList.json','utf-8');
    allData=allData.length===0?'[]':allData;
    allData=JSON.parse(allData);
    //2)getList请求:返回总页数和指定页码的客户信息(注意转为json格式字符串)
    if(pathname==='/getList'){
        var n=query['page'];
        var result={
            total:Math.ceil(allData.length/10),
            data:[]
        };
        for(var i=(n-1)*10;i<n*10;i++){
            if(i>allData.length-1)break;
            result.data.push(allData[i]);
        }
        response.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        response.end(JSON.stringify(result));
        return;
    }
    //3)getInfo请求:返回id对应的客户信息
    if(pathname=='/getInfo'){
        var customId=query['id'];
        result=null;
        allData.forEach(function (item,index) {
            if(item['id']===customId){
                result=item;
                return false;
            }
        });
        response.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        response.end(JSON.stringify(result));
    }
});

//监听端口
server1.listen(98, function () {
    console.log('listening on 98 port!')
});