/**
 * Created by Administrator on 2016/10/8 0008.
 */

//单例模式封装项目需求
var indexRender=(function () {
    var customList = document.getElementById("customList");
    //bindHTML:数据绑定
    function bindHTML(data) {
        var str = '';
        for (var i = 0, len = data.length; i < len; i++) {
            var curData = data[i];
            str += '<li>';
            str += '<span class="w50">' + curData.id + '</span>';
            str += '<span class="w150">' + curData.name + '</span>';
            str += '<span class="w50">' + curData.age + '</span>';
            str += '<span class="w200">' + curData.phone + '</span>';
            str += '<span class="w200">' + curData.address + '</span>';
            str += '<span class="w150 control">';
            //点击修改时,跳转到detail页,把客户的id存储在元素的自定义属性上,将id传递,使得在详细页知道修改的是哪个客户的信息
            str += '<a href="detail.html?id=' + curData.id + '">修改</a>';
            //数据绑定时,把客户的id存储在元素的自定义属性上,在后面的操作中,如果需要客户的id,直接在自定义属性上获取即可(自定义属性思想)
            str += '<a href="javascript:;" data-id="' + curData.id + '">删除</a>';
            str += '</span>';
            str += '</li>';
        }
        customList.innerHTML = str;
    }
    //bindDelete:绑定删除事件:利用事件委托
    function bindDelete() {
        customList.onclick = function (e) {
            e = e || window.event;
            //1.获取事件源和事件源的标签名
            var tar = e.target || e.srcElement,
                tarTag = tar.tagName.toUpperCase();
            //2.是a标签并且a标签的内容是删除
            if (tarTag === "A" && tar.innerHTML === "删除") {
                //3.获取事件源的id:// 对容器中的某个元素操作,当进行数据绑定的时候已经知道客户的ID,想获取元素的id,使用自定义属性---自定义属性思想(选项卡)
                var customId = tar.getAttribute('data-id');
                //4.弹出提示框
                var flag = window.confirm('您确定要删除编号为' + customId + '的客户信息吗?');//确认和取消提示框 执行这个方法会有返回值,为true--确定,false--点击取消
                //5.发送ajax请求,删除对应客户信息
                if (flag) {
                    ajax({
                        url: '/removeInfo?id=' + customId,
                        type: 'GET',
                        dataType: 'JSON',
                        success: function (result) {
                            if (result && result['code'] == 0) {
                                customList.removeChild(tar.parentNode.parentNode);
                            }
                        }
                    });
                }
            }
        }
    }
    return {
        //当前模块的入口,当前入口中完成初始化和第一步要做的事情
        init: function () {
            //1.获取数据
            ajax({
                url: '/getList',
                type: 'GET',
                dataType: 'JSON',
                success: function (result) {
                    if (result && result['code'] == 0) {
                        var data = result['data'];
                        //2.数据绑定
                        bindHTML(data);
                        //3.绑定事件
                        bindDelete();
                    }
                }
            });
        }
    }
})();
indexRender.init();

