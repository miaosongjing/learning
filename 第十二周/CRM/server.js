/**
 * Created by Administrator on 2016/10/9 0009.
 */
var http = require('http'),
    url = require('url'),
    fs = require('fs');
//1.创建服务
var server1=http.createServer(function (req, res) {
    //4.解析客户端的URL请求地址
    var urlObj=url.parse(req.url,true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];
    //5.静态资源文件请求的处理
    var reg=/\.([a-zA-Z]+)/i;
    //1)如果是静态资源文件
    if(reg.test(pathname)){
        //2)处理文件后缀名和文件类型
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIME='text/plain';
        switch (suffix){
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
        }
        //3)定义返回文件和状态码,设定默认值
        var conFile = 'file is not found!',
            status = 404;
        try {
            //4)获取请求文件原代码(浏览器默认向服务器发送一个没有用ico文件,将其过滤),设定状态码
            conFile = fs.readFileSync('.' + pathname, 'utf8');
            status = 200;
        } catch (e) {
            suffixMIME = 'text/plain';
        }
        //5)重写响应头信息,指定状态码和内容类型/编码格式
        res.writeHead(status, {'content-type': suffixMIME + ';charset=utf-8;'});
        //6)结束,将源文件返回
        res.end(conFile);
        return;
    }
    //6.根据API接口文档处理API接口(地址和功能)
    //定义变量
    var con=null,
        result=null,
        customPath='./json/custom.json',
        customId=null;

    //获取custom.json文件中的内容都得到(要求为json格式对象)
    //1)获取所有客户信息(为json格式字符串)
    con=fs.readFileSync(customPath,'utf-8');
    //2)con处理:当custom.json中没有客户信息时,con为"",JSON.parse('')会报错,让其等于'[]'
    con=con.length===0?'[]':con;
    //3)//将json格式字符串转为json格式对象
    con=JSON.parse(con);
    result = {code: 1, msg: 'error', data: null};
    //Ⅰ获取所有的客户信息
    if(pathname==="/getList"){
        //1)按照API文档中的规范准备返回给客户端的数据
        if(con.length>0){//成功
            result={
                code:0,
                msg:"成功",
                 data:con
            };
        }
        //2)重写响应头信息:不重写会导致中文乱码和浏览器不识别,因为一些浏览器不能把返回的数据格式识别,认为它是文本,重写响应头信息是告诉浏览器返回文件的格式
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        //3)返回源代码,注意将json格式对象转为json格式字符串
        res.end(JSON.stringify(result));
        return;
    }
    //Ⅱ获取指定的客户信息(根据传递的客户id)
    if(pathname==="/getInfo"){
        //1)获取客户端传递的ID,客户端传参使用问号传参的方式,query中保存问号传参中的内容,并且以对象键值对方式保存
        customId=query['id'];
        //2)循环custom.json中的数据的每一项,找到id对应的数据
        con.forEach(function (item, index) {
            if(item['id']==customId){
            //3)成功
                result={
                    code:0,
                    msg:"成功",
                    data:item
                }
                return false;
            }
        });
        //4)重写响应头信息:
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        //5)返回源代码
        res.end(JSON.stringify(result));
        return;
    }
    //Ⅲ 删除指定客户信息(根据传递的客户id)
    if(pathname==="/removeInfo"){
        //1)获取客户端传递的ID
        customId=query['id'];
        //2)循环custom.json中的数据的每一项,找到id对应的数据,从数组中删除,flag变true
        con.forEach(function (item, index) {
            if(item['id']==customId){
                //数组中删除
                con.splice(index,1);
                fs.writeFileSync(customPath,JSON.stringify(con),'utf-8');
                result={
                    code:0,
                    msg:"删除成功"
                };
                return false;
            }
        });
        //4)重写响应头信息:
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        //8)返回源代码
        res.end(JSON.stringify(result));
        return;
    }
    //Ⅳ增加客户信息:在NODE中获取客户端请求主体中的内容,我们使用request.on('data')和request.on('end')两个事件处理
    if(pathname==="/addInfo"){
        //1)获取客户端通过请求主体传递内容
        var str='';
        req.on('data', function (chunk) {//data:服务器端一点点接收客户端主体传递的内容;接收一点,回调函数执行一次;回调函数实现接收一点,储存一点;chunk为每次接收的一点
            str+=chunk;
        });
        req.on('end', function () {//end:已经全部接收
            //2)什么都没有传,str为空
            if(str.length==0){
                res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
                res.end(JSON.stringify(result));
                return;
            }
            //3)传有内容,将str转为json格式字符串, 在现有data中追加一个id(con最后一项id+1)
            var data=JSON.parse(str);
            data['id']=con.length===0?1:parseFloat(con[con.length-1]['id'])+1;
            //4)将新增加的这项放在数组中
            con.push(data);
            //5)将con写入文件
            fs.writeFileSync(customPath,JSON.stringify(con),"utf-8");
            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify({
                code:0,
                msg:'增加成功!'
            }));
        });
        return;
    }
    //Ⅴ 修改指定客户信息:post请求
    if(pathname==="/updateInfo"){
       str='';
        //1)获取主体内容
        req.on('data', function (chunk) {
            str+=chunk;
        });
        req.on('end', function () {
            //2)str没有传值
            if(str.length==0){
                //返回失败
                res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
                res.end(JSON.stringify(result));
                return;
            }
            //3)str传值
            //将str转为对象
            var data=JSON.parse(str);
            //循环con,通过id找到对应项,用修改的内容进行替换
            con.forEach(function (item, index) {
                if (data['id'] == item['id']) {
                    con[index]=data;
                    //最新的con重新写入
                    fs.writeFileSync(customPath,JSON.stringify(con),'utf-8');
                    //result重新赋值
                    result={
                        code:0,
                        msg:'修改成功!'
                    };
                    return false;
                }
            });
            //4)重写相应头和返回源文件
                res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
                res.end(JSON.stringify(result));
        });
        return;
    }
    //Ⅵ 如果请求的地址不是上述任何一个,则提示不存在
    res.writeHead(404,{'content-type':'text/plain;charset=utf-8;'});
    res.end('请求的数据接口都不存在!');
});
//2.监听一个端口
server1.listen(81, function () {
    console.log("server is success,listening on 81 port!");
});
//找到当前文件所在的文件夹,打开dos命令窗口,执行