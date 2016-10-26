/**
 * auther: tianxi, qq:   wechat: tel: fed:   email
 */
;(function (){
    /**
     * 动画
     * @param ele 要运动的元素
     * @param target 要运动的终点
     * @param duration 在多长时间内完成运动
     * @param effect  动画运动的效果
     *     1)如果传进来的是一个数字:0->Linear 1->"Quad-easeOut" 2->"Back-easeOut"
     *      2)如果传递进来的是一个数组,animate(ele,target,duration,['Quad','easeOut'],callback)->zhufengEffect.Quad.easeOut
     *      3)如果不传默认使用zhufengEffect.Linear
     * @param callback 运动结束之后要执行函数
     */
    function animate(ele,target,duration,effect,callback){

        var zhufengEffect = {
            //匀速
            Linear: function (t, b, c, d) {
                return c * t / d + b;
            },
            //指数衰减的反弹缓动
            Bounce: {
                easeIn: function (t, b, c, d) {
                    return c - zhufengEffect.Bounce.easeOut(d - t, 0, c, d) + b;
                },
                easeOut: function (t, b, c, d) {
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                    }
                },
                easeInOut: function (t, b, c, d) {
                    if (t < d / 2) {
                        return zhufengEffect.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                    }
                    return zhufengEffect.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            },
            //二次方的缓动
            Quad: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * t * t + b;
                    }
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                }
            },
            //三次方的缓动
            Cubic: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * t * t * t + b;
                    }
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                }
            },
            //四次方的缓动
            Quart: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * t * t * t * t + b;
                    }
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                }
            },
            //五次方的缓动
            Quint: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return c / 2 * t * t * t * t * t + b;
                    }
                    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                }
            },
            //正弦曲线的缓动
            Sine: {
                easeIn: function (t, b, c, d) {
                    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                },
                easeInOut: function (t, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                }
            },
            //指数曲线的缓动
            Expo: {
                easeIn: function (t, b, c, d) {
                    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                },
                easeOut: function (t, b, c, d) {
                    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                }
            },
            //圆形曲线的缓动
            Circ: {
                easeIn: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) {
                        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                    }
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                }
            },
            //超过范围的三次方缓动
            Back: {
                easeIn: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                },
                easeOut: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                },
                easeInOut: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t /= d / 2) < 1) {
                        return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                    }
                    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                }
            },
            //指数衰减的正弦曲线缓动
            Elastic: {
                easeIn: function (t, b, c, d, a, p) {
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    var s;
                    !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                },
                easeOut: function (t, b, c, d, a, p) {
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    var s;
                    !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                    return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
                },
                easeInOut: function (t, b, c, d, a, p) {
                    if (t == 0) return b;
                    if ((t /= d / 2) == 2) return b + c;
                    if (!p) p = d * (.3 * 1.5);
                    var s;
                    !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                }
            }
        };
        //处理需要的动画效果
        var defaultEffect = zhufengEffect.Linear; //默认的匀速效果，如果参数传指定的效果值那么就使用参数值
        if(typeof effect == 'number'){
            switch (effect){
                case 1:
                    defaultEffect = zhufengEffect.Bounce.easeIn;
                    break;
                case 2:
                    defaultEffect = zhufengEffect.Back.easeInOut;
                    break;
                case 3:
                    defaultEffect = zhufengEffect.Elastic.easeInOut;
                    break;
            }
        }else if(Object.prototype.toString.call(effect) == '[object Array]'){
            defaultEffect = zhufengEffect[effect[0]][effect[1]];
        }else if(typeof effect == 'function'){ //第四个参数如果是一个函数，说明是传给callback当作回调函数
         callback = effect; //把这个值赋值给第五个参数
        }
        //Ⅰ声明变量
        var time= 0,begin={},change={},interval=10;
        //Ⅱ为begin和change赋值:target和begin\change内存的元素样式属性相同,有对应关系,可通过for遍历为begin和change赋值
        for(var key in target){
            begin[key]=utils.css(ele,key);
            change[key]=target[key]-begin[key];
        }
        //Ⅳ 清除定时器:只要运动的元素有自定义属性保存,定时器在下一次执行时就要把上一次的清除,无论是否到达终点
        ele.timer && window.clearInterval(ele.timer);
        //Ⅲ设置定时器
        ele.timer=window.setInterval(function () {
            //1.时间累加
            time+=interval;
            //3到达终点
            if(time>=duration){
                //1)清除定时器
                window.clearInterval(ele.timer);
                //2)设置终点值
                utils.css(ele,target);
                //3)终点后执行的内容
                if(typeof callback=="function"){
                    callback.call(ele);//到达终点传入回调函数,把回调函数中的this修改成运动的那个元素
                }
                //4)返回
                return;
            }
            //2没有达到目标,分别获取每一个方向的当前位置,给当前元素设置样式
            for(var key in change){
                if(change.hasOwnProperty(key)){ //在当前这个属性上有变化
                    var val = defaultEffect(time,begin[key],change[key],duration);
                    utils.css(ele,key,val);
                }
            }
        },interval);
    }

    window.animate = animate;

})();

