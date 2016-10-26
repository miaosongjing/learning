/**
 * Created by Administrator on 2016/10/6 0006.
 */
var less=require("less");
var fs=require("fs");
less.render(fs.readFileSync("./11.less","utf-8"),{compress:true},function(error,output){
    fs.writeFileSync("./11.less",output.css,"utf-8")
});
//console.log("zhuzhu");