/*--基于String.prototype扩展字符串处理的常用方法--*/
~function (pro) {
    function queryURLParameter() {
        var reg = /([^?=&#]+)=([^?=&#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });

        reg = /#([^?=&#]+)/;
        if (reg.test(this)) {
            obj['HASH'] = reg.exec(this)[1];
        }
        return obj;
    }

    function formatTime(template) {
        template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var ary = this.match(/\d+/g);
        template = template.replace(/\{(\d+)\}/g, function () {
            var n = arguments[1],
                res = ary[n] || '00';
            res.length < 2 ? res = '0' + res : null;
            return res;
        });
        return template;
    }

    pro.queryURLParameter = queryURLParameter;
    pro.formatTime = formatTime;
}(String.prototype);


/*--计算CONTENT区域的高度--*/
~function () {
    var $header = $('#header'),
        $content = $('#content'),
        $menu = $('#menu');

    computedHeight();
    function computedHeight() {
        var winH = document.documentElement.clientHeight || document.body.clientHeight;
        var tarH = winH - $header.outerHeight() - 40;
        $content.css('height', tarH);
        $menu.css('height', tarH - 2);
    }

    $(window).on('resize', computedHeight);
}();

/*--MENU RENDER--*/
var menuRender = (function () {
    var $menu = $('#menu'),
        $menuList = $menu.find('a'),
        menuIScroll = null;

    //->scrollFn:实现MENU区域的局部滚动
    function scrollFn() {
        menuIScroll = new IScroll('#menu', {
            bounce: false,
            scrollbars: true,
            mouseWheel: true,
            fadeScrollbars: true
        });
    }

    //->hashFn:让HASH值对应的A选中
    function hashFn() {
        var urlObj = window.location.href.queryURLParameter(),
            hash = urlObj['HASH'] || 'nba',
            $curMenu = $menuList.filter("[href='#" + hash + "']");
        $curMenu.length === 0 ? $curMenu = $menuList.eq(0) : null;
        $curMenu.addClass('bg');
        menuIScroll.scrollToElement($curMenu[0], 0);

        //->控制右侧日期区域显示对应的时间
        calendarRender.init($curMenu.attr('data-id'));
    }

    //->bindEvent:给MENU区域的每一个A绑定点击事件
    function bindEvent() {
        $menuList.on('click', function () {
            var _this = this;
            $menuList.each(function (index, item) {
                if (this === _this) {
                    $(this).addClass('bg');
                    return;
                }
                $(this).removeClass('bg');
            });

            //->控制右侧的内容跟着点击而改变
            calendarRender.init($(this).attr('data-id'));
        });
    }

    return {
        init: function () {
            scrollFn();
            hashFn();
            bindEvent();
        }
    }
})();

/*--CALENDAR RENDER--*/
var calendarRender = (function () {
    var calendarPlain = $.Callbacks();//->制定一张计划表,add增加需要执行的方法,remove移除某一个不需要执行的方法,fire通知计划表中的方法执行
    var $calendar = $('#calendar'),
        $wrapper = $calendar.find('.wrapper'),
        $link = null,
        $btnLeft = $calendar.find('.btnLeft'),
        $btnRight = $calendar.find('.btnRight');
    var minL = 0, maxL = 0;

    //->数据绑定
    calendarPlain.add(function (today, data) {
        var $calendarTemplate = $('#calendarTemplate'),
            templateText = $calendarTemplate.html();
        var res = ejs.render(templateText, {calendarData: data});
        $wrapper.html(res).css('width', data.length * 110);
        $link = $wrapper.children('a');
        minL = (data.length - 7) * 110 * -1;
    });

    //->初始定位到今天日期的位置
    calendarPlain.add(function (today, data) {
        today = '2017-12-31';

        var $curLink = $link.filter("[data-time='" + today + "']");//->在所有的A中获取到代表今天日期的那一个A,如果不存在,说明今天日期没有比赛,我们需要找距离今天最近的后一天(和所有的A一项项的比较,遇到的第一个比今天日期大的就是我们想要的)
        if ($curLink.length === 0) {
            today = today.replace(/-/g, '');
            $link.each(function (index, item) {
                var itemTime = $(item).attr('data-time');
                itemTime = itemTime.replace(/-/g, '');
                if (itemTime - today > 0) {
                    $curLink = $(item);
                    return false;
                }
            });
        }

        //->比较完成一圈后,依然没有找到,我们就选中最后一项即可
        if ($curLink.length === 0) {
            $curLink = $link.eq($link.length - 1);
        }

        var curL = -$curLink.index() * 110 + 330;
        curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
        $curLink.addClass('bg');
        $wrapper.css('left', curL);

        //->定位好后,我们需要获取当前展示的这个七个A对应的起始日期和结束日期,并且通过这个日期,让下面的数据动态的展示
    });

    //->点击左右两个按钮切换日期
    calendarPlain.add(function (today, data) {
        $btnLeft.on('click', temp);
        $btnRight.on('click', temp);
        function temp() {
            var curL = parseFloat($wrapper.css('left'));
            curL % 110 !== 0 ? curL = Math.round(curL / 110) * 110 : null;
            $(this).hasClass('btnLeft') ? curL += 770 : curL -= 770;
            curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
            $wrapper.stop().animate({
                left: curL
            }, 300, 'linear', function () {
                //->动画完成做的事情:把第一个选中
                var firstIndex = Math.abs(curL / 110),
                    lastIndex = firstIndex + 6;
                $link.eq(firstIndex).addClass('bg').siblings().removeClass('bg');
                //->定位好后,我们需要获取当前展示的这个七个A对应的起始日期和结束日期,并且通过这个日期,让下面的数据动态的展示
                
            });
        }
    });

    return {
        init: function (columnId) {
            columnId = columnId || 100000;

            //->从腾讯的服务器获取到需要展示的日期数据
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/calendar?columnId=' + columnId,
                type: 'get',
                dataType: 'jsonp',
                jsonpCallback: 'calendar',
                success: function (result) {
                    if (result && result['code'] == 0) {
                        //->数据解析/数据重构
                        var data = result['data'],
                            today = data['today'];
                        data = data['data'];

                        //->开始处理具体的业务逻辑
                        calendarPlain.fire(today, data);
                    }
                }
            });
        }
    }
})();

menuRender.init();

