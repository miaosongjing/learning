
var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    var reg = /\.([a-zA-Z]+)/i;//注意正则匹配时的\.
    if (reg.test(pathname)) {
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
        var conFile = 'NOT FOUND',
            status = 404;
        try {
            conFile = fs.readFileSync('.' + pathname, 'utf-8');
            status = 200;
        } catch (e) {

        }
        response.writeHead(status, {'content-type': suffixMIME + ';charset=utf-8;'});
        response.end(conFile);
        return;
    }
    var allData = fs.readFileSync('./json/student.json', 'utf-8');
    allData = allData.length == 0 ? '[]' : allData;
    allData = JSON.parse(allData);//转为JSON格式对象

    if (pathname == '/getList') {
        var n = query['n'];
        var result = {
            total: Math.ceil(allData.length / 10),
            data: []
        };
        for (var i = (n - 1) * 10; i < n * 10 - 1; i++) {
            if (i > allData.length - 1)break;
            result.data.push(allData[i]);
        }
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify(result));
        return;
    }
    if (pathname == '/getInfo') {
        var customId = query['id'];
        result = null;
        allData.forEach(function (item, index) {
            if (item['id'] == customId) {
                result = item;
                return false;
            }
        });
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify(result));
    }
});
server1.listen(99, function () {
    console.log('server is success,listening on 80 port!');
});