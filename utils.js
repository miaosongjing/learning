var utils=(function () {
    var isStanderBrowser="getComputedStyle" in window;
    function listToArray (likeAry) {
        try{
            return Array.prototype.slice.call(likeAry,0);
        }catch(e){
            var ary=[];
            for(var i=0;i<likeAry.length;i++){
                ary[ary.length]=likeAry[i];
            }
            return ary;
        }
    }
    //获取随机数
    function getRandom(n, m) {
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {//如果是非有效数字,返回0-1之间的随机数
            return Math.random();
        }
        if (n > m) {
            var temp = n;
            n = m;
            m = temp;
        }
        return Math.round(Math.random() * (m - n) + n);
    }
    function hasPublicProperty(obj, prop) {
        return prop in obj && !(obj.hasOwnProperty(prop));
    }
    //将json格式的字符串转为json格式的对象,使用eval时在前后拼接一个小括号
    function jsonParse(jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }
    function offset(curEle){
        var totalLeft=null,totalTop=null,par=curEle.offsetParent;
        //1累加自身
        totalLeft+=curEle.offsetLeft;
        totalTop=curEle.offsetTop;
        //2.只要没有找到body,就把父级参照物的边框和偏移进行累加
        while(par){
            //不是ie8,累加边框
            if(navigator.userAgent.indexOf("MSIE8.0")===-1){
                //累计父级参照物的边框
                totalLeft+=par.clientLeft;
                totalTop+=par.clientTop;
            }
            totalLeft+=par.offsetLeft;
            totalTop+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:totalLeft,top:totalTop};
    }
    //win 设置浏览器盒子模型
    function win(attr, val) {
        if (typeof val != "undefined") {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    }

    //获取元素上一个哥哥元素节点
    //首先获取当前元素的上一个哥哥元素节点,判断是否为元素节点,不是的话,基于当前的继续找上面的哥哥节点...一直找到哥哥元素节点为止,如果没有哥哥元素节点,返回null
    function prev(ele) {//ele.previousSibling没有返回null
        if(isStanderBrowser){
            return ele.previousElementSibling;
        }
        var pre=ele.previousSibling;
        while(pre&&pre.nodeType!=1){
            pre=pre.previousSibling;
        }
        return pre;
    }
    function prevAll(ele) {
        //获取上一个哥哥元素节点
        var pre=this.prev(ele);
        var ary=[];
        while(pre){
            ary.unshift(pre);
            pre=this.prev(pre);
        }
        return ary;
    }
    //获取下一个弟弟元素节点
    function next(ele) {
        if(isStanderBrowser){return ele.nextElementSibling;}
        var next=ele.nextSibling;
        while(next&&next.nodeType!=1){
            next=next.nextSibling;
        }
        return next;
    }
    //获取所有弟弟元素节点
    function nextAll(ele) {
        var next=this.next(ele);
        var ary=[];
        while(next){
            ary.push(next);
            next=this.next(next);
        }
        return ary;
    }
    //获取所有的子元素节点/子元素中的tagName元素
    function children(ele,tagName) {
        var ary=[];
        if(isStanderBrowser){
            //标准浏览器可以直接使用children,但是这样获取的是一个类数组,为保持一致,需要转为数组
            ary=listToArray(ele.children);
        }else{
            var nodeList=ele.childNodes;//获取所有的子节点
            //将所有子节点中找到元素子节点,通过nodeType进行判断
            for(var i=0;i<nodeList.length;i++) {
                var curNode = nodeList[i];
                if (curNode.nodeType == 1) {
                    ary.push(curNode);
                }
            }
        }
        if(typeof tagName=="string"){//tagName传值,并且是一个字符串
            for(var j=0;j<ary.length;j++){
                var curEle=ary[j];
                //如果不是没目标元素,就删除
                if(curEle.nodeName.toLowerCase()!=tagName.toLowerCase()){
                    ary.splice(j,1);
                    j--;
                }
            }
        }
        return ary;
    }
    //获取相邻的兄弟节点
    function sibling(ele) {
        var ary=[];
        var pre=utils.prev(ele);
        var next=utils.next(ele);
        pre?ary.push(pre):void 0;
        next?ary.push(next):void 0;
        return ary;
    }
    //获取所有哥哥和弟弟元素节点
    function siblings(ele) {
        return this.prevAll(ele).concat(this.nextAll(ele));
    }
    //获取当前元素的索引--所有哥哥元素集合的长度
    function index(ele) {
        return this.prevAll(ele).length;
    }
    //获取第一个子元素节点
    function firstEleChild(ele) {
        if(isStanderBrowser){
            return ele.firstElementChild;
        }
        var chs=this.children(ele);
        return chs.length>0?chs[0]:null;
    }
    //获取最后一个子元素节点
    function lastEleChild(ele) {
        if(isStanderBrowser){
            return ele.lastElementChild;
        }
        var chs=this.children(ele);
        return chs.length>0?chs[chs.length-1]:null;
    }
    //向容器末尾添加
    function append(newEle, container) {
        container.appendChild(newEle);
    }
    //向容器的开头添加  相当于把新元素添加在第一个元素的前面,如果第一个不存在,就添加在末尾
    function prepend(newEle,container) {
        var firstChild=this.firstEleChild(container);
        //r如果第一个存在就插入在它的前面,不存在就直接用appendChild
        firstChild?container.insertBefore(newEle,firstChild):container.appendChild(newEle);
    }
    //把新元素插在旧元素的前面
    function insertBefore(newEle,oldEle) {
        oldEle.parentNode.insertBefore(newEle,oldEle);
    }
    //把新元素插在旧元素的后面
    //相当于追加到oldEle弟弟元素的前面
    function insertAfter(newEle, oldEle) {
        var next=this.next(oldEle);
        var parent=oldEle.parentNode;
        //弟弟存在就插入弟弟前面,不存在就直接appendChild
        next?parent.insertBefore(newEle,next):parent.appendChild(newEle);
    }
    ////////////////////////////////////////////////////////////////////////
    //验证当前元素中是否包含className这个样式名
    function hasClass(ele, strClass) {
        //去掉传进来的strClass的首尾空格
        strClass=strClass.replace(/(^ +| +$)/g,""); //" c1 "  " c1"   "c1  "  "c1"
        //利用传进来的strClass组成的正则验证ele.className是否有某个strClass
        var reg=new RegExp("(^| +)"+strClass+"( +|$)");//"c1  c2  c3" 或"c2  c3  c1"或"c2  c1  c3"
        return reg.test(ele.className);
    }
    //给元素添加class
    function addClass(ele,strClass) {
        //去开头和结尾的空格
        strClass=strClass.replace(/(^ +| +$)/g,"");
        //按照一到多个空格拆分为数组中的每一项, 防止传进来的是多个样式类名
        var strClassAry=strClass.split(/ +/);
        //循环数组,一项项的进行验证添加
        for(var i=0;i<strClassAry.length;i++){
            var curClass=strClassAry[i];
            //如果没有这个类名,进行添加
            if(!this.hasClass(ele,curClass)){
                ele.className+=" "+curClass;//className间用空格隔开
            }
        }
    }
    //给元素移除class
    function removeClass(ele,strClass) {
        //按照一到多个空格拆分为数组中的每一项, 防止传进来的是多个样式类名
        var strClassAry=strClass.replace(/(^ +| +$)/,"").split(/ +/);
        //循环数组,一项项的进行验证移除(用" "替换)
        for(var i=0;i<strClassAry.length;i++){
            var curClass=strClassAry[i];
            if(this.hasClass(ele,curClass)){
                // "c1  c2  c3" ==>"c1 c1"或"c2  c1  c3"
                // 如果是'',可能导致剩下的两个类名连在一起"c1  c2  c3" ==>"c1c1"
                var reg=new RegExp("(^| +)"+curClass+"( +|$)","g");
                ele.className=ele.className.replace(reg," ");//
            }
        }
    }
    //通过元素的样式类名获取一组元素集合  getElesByClass jquery中没有这个方法,但是jquery的一部分选择器是基于这个方法的原理实现
    function getElesByClass(strClass, context){
        //1.context如果传值,就在context范围内获取,不传值为document
        context = context || document;
        //支持原生
        if(isStanderBrowser){
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        //2.将strClass首尾空格都去掉,按照中间的空格进行拆分
        var strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/);
        var ary = [];
        //3.获取context中所有的元素标签,循环这些标签,获取每一个标签的className样式类名
        var nodeList = context.getElementsByTagName("*");
        //4.遍历的所有的标签
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            //5.判断curNode.className是否包含strClassAry中的每一个,如果都包含,就是要获取的结果;否则就不是
            var isOk = true;//假设curNode符合所有的样式
            //1)循环strClassAry
            for (var j = 0; j < strClassAry.length; j++) {
                var reg = new RegExp("(^| +)" +strClassAry[j]+ "( +|$)");
                //2)只要标签不包含某一个样式类名,就说明这个这个元素className不符合strClass的要求,跳出循环
                if (!reg.test(curNode.className)) {
                    isOk = false;
                    break;
                }
            }
            //3)如果标签和所有样式类名比较的结果为true,说明当前标签包含所有的样式
            isOk?ary.push(curNode):null;
        }
        return ary;
    }
    ///////////////////////////////////////////////////////////////////////
    //获取元素样式
    function getCss(attr) {//当前元素用this来代替
        var val=null;
        if(isStanderBrowser){
            val=window.getComputedStyle(this,null)[attr];
        }else{
            if(attr=="opacity"){
                val=this.currentStyle["filter"];
                reg=/^alpha\(opcity=(\d+(\.\d+)?)\)$/;
                val=reg.test(val)?reg.exec(val)[1]/100:1;
            }else{
                val=this.currentStyle[attr];
            }
        }
        var reg=/^-?\d+(\.\d+)?(px|pt|rem|em|deg)?$/;
        return reg.test(val)?parseFloat(val):val;
    }
    function setCss(attr,val) {//this替换当前元素
        if(attr=="opacity"){
            this.style.opacity=val;
            this.style.filter="alpha(opacity="+val*100+")";
            return;
        }
        if(attr=="float"){
            this.style.cssFloat=val;
            this.style.styleFloat=val;
            return;
        }
        var reg=/^(width|height|top|left|bottom|right|(margin|padding)(Left|Top|Bottom|Right)?)$/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val+="px";
            }
        }
        this.style[attr]=val;
    }
    //function setGroupCss(curEle,options){
    //    //通过检测options的数据类型,如果不是一个对象,则不能进行批量设置
    //    options=options||0;//当options没有传参时,为undefined,undefined和null没有toString,会报错
    //    //if(Object.prototype.toString.call(obj)!=="[object Object]"){//options是一个对象,所以可以进行替换
    //    if(options.toString()!=="[object Object]"){
    //        return;
    //    }
    //    //遍历对象中每一项,调用setCss方法一个个的进行设置
    //    for(var key in options){
    //        if(options.hasOwnProperty(key)){//进行判断,for in循环会遍历对象私有和公有的属性,但是这里我们只需要私有的
    //            this.setCss(this,key,options[key]);
    //        }
    //    }
    //}
    function setGroupCss(options) {
    //this替换当前元素
        //是不是对象的判断在css中已经判断过,穿进来的肯定是一个对象
        //options=options||[];//避免报错 undefined.toString();//报错 null.toString();//报错  undefined和null没有toString
        //if(options.toString()=="[object Object]"){////判断option是一个对象
            for(var key in options){//为元素有的属性设置对应的值
                if(options.hasOwnProperty(key)){
                    setCss.call(this,key,options[key]);//call实现this为当前元素
                }
            }
    }
    //获取/单独设置/批量设置元素的样式
    //utils.css(box,{"width":200,"height":50})//批量设置
    //utils.css(box,"width",200)//单独设置
    //utils.css(box,"width")//获取
    //function css(curEle){//第二个参数可能是一个值/对象/
    //    var argTwo=arguments[1];
    //    //第二个参数如果是一个字符串,很有可能是获取样式(因为还需要判断是否存在第三个参数,如果存在,是单独设置属性值),不是就是批量设置
    //    if(typeof argTwo=="string"){
    //        var argThree=arguments[2];
    //        if(!argThree){//第三个参数不存在 是获取
    //            //return this.getCss(curEle,argTwo);
    //            return this.getCss.apply(this,arguments);
    //        }
    //        //第三个参数存在,则为单独设置
    //        //this.setCss(curEle,argTwo,argThree);
    //        this.setCss.apply(this,arguments);
    //        return;
    //    }
    //    argTwo=argTwo||0;//如果第二
    //    if(argTwo.toString()=="[object Object]"){
    //        //批量设置
    //        this.setGroupCss.apply(this,arguments);
    //    }
    //}
    function css(ele){
        var argsAry=listToArray(arguments).slice(1);
        //var argsAry=Array.prototype.slice.call(arguments,1);
        var secondParam=arguments[1];
        //var thirdParam=arguments[2];
        //1.参数个数不同区分getCss()和setCss()
        if(typeof secondParam=="string"){//说明第二个参数是字符串,有可能是getCSS/setCss,就看第三个参数
            //getCss()

            if(typeof arguments[2]=="undefined"){//说明没有第三个参数
                //if(!arguments[2]){//不能用这种方法,传入的第三个参数可能是0
                //return getCss.call(ele,secondParam);
                return getCss.apply(ele,argsAry);
            }
            //setCss()
            setCss.apply(ele,argsAry);
            return;
        }
        //2.参数类型不同区分getCss()和setGroupCss()判断第二个参数是否为对象
        secondParam=secondParam||[];//避免报错
        if(secondParam.toString()=="[object Object]"){//第二个参数是一个对象
            setGroupCss.apply(ele,argsAry);
        }
    }
    return {
        listToArray:listToArray,
        getRandom:getRandom,
        hasPublicProperty:hasPublicProperty,
        jsonParse:jsonParse,
        offset: offset,
        win: win,
        prev: prev,
        prevAll: prevAll,
        next: next,
        nextAll:nextAll,
        children: children,
        sibling: sibling,
        siblings:siblings,
        index:index,
        firstEleChild: firstEleChild,
        lastEleChild:lastEleChild,
        append:append,
        prepend:prepend,
        insertBefore:insertBefore,
        insertAfter:insertAfter,
        hasClass:hasClass,
        addClass:addClass,
        removeClass: removeClass,
        getElesByClass: getElesByClass,
        getCss: getCss,
        setCss:setCss,
        setGroupCss: setGroupCss,
        css:css



    };





})();

