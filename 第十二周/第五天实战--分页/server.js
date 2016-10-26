/**
 * Created by Administrator on 2016/10/11 0011.
 */
//导入内置模块,创建服务,监听端口--如果请求的是静态资源文件,需要把资源文件中的原代码返回
//处理获取制定页数数据的接口
//处理获取指定用户信息的接口
var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    //1.处理静态资源文件
    var reg = /\.([a-zA-Z]+)/i;
    if (reg.test(pathname)) {//如果是静态资源文件
        //1)处理文件类型
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix) {
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
        //2)获取源文件
        var conFile = 'NOT FOUND',
            status = 404;
        try {
            //读取文件
            conFile = fs.readFileSync('.' + pathname, 'utf-8');
            status = 200;
        } catch (e) {

        }
        response.writeHead(status, {'content-type': suffixMIME + ';charset=utf-8;'});
        response.end(conFile);
        return;
    }
    //2.处理API接口


    //获取全部数据
    var allData = fs.readFileSync('./json/userList.json', 'utf-8');
    allData = allData.length == 0 ? '[]' : allData;
    allData = JSON.parse(allData);//转为JSON格式对象

    //Ⅰ 获取指定页
    //获取客户端传递的page
    // page    userList
    // 1        0---9
    // 2       10---19
    // n        (n-1)*10--n*10
    // 9        90---97,注意超过最大索引时,结束循环
    //在全部的用户信息中,获取page对应的数据
    //计算总页数:总数据/10,然后向上取整
    //数据返回客户端
    if (pathname == '/getList') {
        //1)获取客户端传递的page值
        var n = query['page'];
        //2)从全部中获取page对应的数据
        var result = {
            //3)计算总页数
            total: Math.ceil(allData.length / 10),
            data: []
        };
        for (var i = (n - 1) * 10; i < n * 10 - 1; i++) {
            if (i > allData.length - 1)break;
            result.data.push(allData[i]);
        }
        //4)数据返回客户端
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify(result));
        return;
    }
    //Ⅱ 获取指定信息
    //获取客户端传递的用户id
    //把所有数据中id匹配的客户信息找到
    //把找到的客户返回
    if (pathname == '/getInfo') {
        var customId = query['id'];
        result = null;
        allData.forEach(function (item, index) {
            if (item['id'] == customId) {
                result = item;
                return false;//结束循环
            }
        });
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify(result));
    }
});
server1.listen(99, function () {
    console.log('server is success,listening on 80 port!');
});