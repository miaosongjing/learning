/**
 * Created by Administrator on 2016/10/9 0009.
 */
//服务器端
    //1.导入内置模块
var http=require('http'),
    fs=require('fs'),
    url=require('url');
//2.创建服务
var server1=http.createServer(function (request, response) {
    //1)请求路径解析,得到请求资源路径和名称,和问号后的参数
    var obj=url.parse(request.url,true),
        pathname=obj.pathname,
        query=obj.query;
    //2)静态资源文件的处理
    //找到请求的资源文件,获取文件,重写相应头,返回文件
    var reg=/\.([a-zA-Z]+)/i;
    if(reg.test(pathname)){//请求的是一个资源文件
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIME='text/plain';
        switch (suffix){
            case 'HTML':
                suffixMIME='text/html';
                break;
            case 'CSS':
                suffixMIME='text/css';
                break;
            case 'JS':
                suffixMIME='text/javascript';
                break;
            case 'JSON':
                suffixMIME='application/json';
                break;
        }
        try{
            var conFile=fs.readFileSync('.'+pathname,'utf8');
            response.writeHead(200,{'content-type':suffixMIME+':charset:utf-8'});
            response.end(conFile);
        }catch(e){
            response.writeHead(404,{'content-type':'text/plain:charset:utf-8'});
            response.end('Not Found!');
        }
    }
    //API
    var result={
        code:1,
        msg:'ERROR',
        data:null
    };
    //将客户信息,转为json格式
    var conData=fs.readFileSync('./json/custom.json','utf-8');
    conData.length===0?conData='[]':null;//避免json.parse转化空字符串使报错
    conData=JSON.parse(conData);
    //获取全部客户信息
    if(pathname==="/getAllList"){
        if(conData.length>0){
            result={
                code:0,
                msg:'SUCCESS',
                data:conData
            };
        }
        response.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        response.end(JSON.stringify(result));
        return;
    }
    //获取制定的客户信息
    if(pathname==='/getInfo'){
        //1)获取传递过来id
        var custonId=query['id'];
        //2)在所有数据中找到对应id的数据,返回
        conData.forEach(function (item, index) {
            if(item['id']==id){
                result={
                    code:0,
                    msg:'SUCCESS',
                    data:item
                }
                //3)找到对应数据后,结束循环
                return false;//结束forEach循环
            }
        });
        response.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        response.end(JSON.stringify(result));
        return;
    }
    //增加用户信息
    if(pathname='/addInfo'){
        //1)获取客户端传递进来信息(post时,从请求主体中获取)
        var str='';
        request.on('data', function (chunk) {
            str+=chunk;//一点点存储获取的信息
        });
        request.on('end', function () {
            var data=JSON.parse(str);//转为json格式
            //2)给传递进来的内容自动分配id(递进),客户id=原来所有内容最后一项的id+1
            data['id']=conData.length==0?1:parseInt(conData[conData.length-1]['id'])+1;//如果没有客户为1,有的话进行递进累加
            //3)将传递的数据存放在总数据,把最新的总数据写入文件
            conData.push(data);
            fs.readFileSync('./json/cuetom.json',JSON.stringify(conData),'utf-8');
            //4)
            result={
                code:0,
                msg:'SUCCESS'
            };
            response.writeHead(200,{'content-type':'application/json;charset=utf-8'});
            response.end(JSON.stringify(result));
            return;
        });
        //修改:把客户端传递的信息获取,到所有的数据找对应id,数据替换...


    }
});
//3.监听端口
server1.listen(5678, function () {
    console.log('server is  success,listening on 5678 port!');
});