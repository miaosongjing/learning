/**
 * Created by Administrator on 2016/10/7 0007.
 */
function sum(){
    var total=null;
    [].forEach.call(arguments,function(item,index){
        item=Number(item);
        if(isNaN(item)){
            total+=item;
        }
    });
    return total;
}
module.exports={//将该模块中的方法导出
    sum:sum
};