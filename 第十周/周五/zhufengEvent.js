
(function(){
    //���this���ظ�����
    function bind(curEle,eventType,eventFn){
        //1.��׼�����
        if("addEventListener" in document){
            curEle.addEventListener(eventType,eventFn,false);
            return;
        }
        //2.ie�����
        //1)��ױ
        var tempFn= function (e) {
            eventFn.call(curEle,e);
        };
        //2)����Ƭ
        tempFn.photo=eventFn;
        //3)��������,��ΪԪ�ص��Զ�������
        //////////////////////////////////////////////////////////////////////////////////
        //var ary=curEle["myBind"+eventType];
        //if(!ary){ary=[];}
        if(!curEle["myBind"+eventType]){
            curEle["myBind"+eventType]=[];
        }// //���this:��ԭ�е�eventFn��ױΪtempFn,�洢��Ԫ�ص��Զ���������;��Ϊ�ж����ͬ��eventFn,��ô�ͻ��ж����ͬ��tempFn,��Ҫ�洢Ԫ�ص�����Զ���������,��ô,������Զ������Զ���Ϊһ������(Ϊ�����¼�����,��ҪΪÿһ���¼����ʹ���һ������curEle["myBind"+eventType]);�¼����д洢���ǻ�ױ���tempFn,Ϊ�����Ƴ�ʱ�ҵ���,�趨tempFn.photo=eventFn;
        var ary=curEle["myBind"+eventType];

        //�ظ�����:��ÿһ�����Զ��������д洢��ʱ��,�����ж�֮ǰ�Ƿ��Ѿ�����,�������˵���ظ�,�ǾͲ���Ҫ���Զ������Ժ��¼����д洢
        for(var i=0;i<ary.length;i++){
            if(ary[i].photo==eventFn){return;}
        }
        ary.push(tempFn);
        curEle.attachEvent("on"+eventType,tempFn);////eventFn�е�thisΪwindow//eventFn.call(curEle)������ʹ�õ�ԭ��:��ʱ��������fn1ִ��,���䷵��ֵundefined��onclick;call��apply�ı�ؼ��ֲ��ҷ���ֱ��ִ��,bind����ֻ�ı�ؼ���,������ִ��,���ǲ�����
    }
    //��׼�������ie6-8�����������:
    //this����:��׼������е�this��window;ie6-8��,����ִ���е�this��window
    //�ظ�����:��׼�������ͬһ��Ԫ�ص�ͬһ����Ϊ��ͬһ������,����ie6-8�¿���
    //˳������:��׼������󶨵�ʱ��,����˳�����ΰ�û����ӵķ���������¼�����(���ǰ�����ж�,����¼������Ѿ����ھͲ������);����Ϊ������ʱ��,�ᵽ�¼�����,������ӵ�˳������ִ�ж�Ӧ�ķ���;��ie6-8��,��Ϊ����ʱ,����ִ�е�˳���֮ǰ�󶨵�˳���޹���,û���κι���

    //unbind:�Ƴ���ǰԪ�ذ󶨵�ĳһ������
    function unbind(curEle,eventType,eventFn){
        //��׼
        if("removeEventListener" in document){
            curEle.removeEventListener(eventType,eventFn,false);
            return;
        }
        //ie
        var ary=curEle["myBind"+eventType];
        //1.�ж��Ƿ����,�ǲ�������,�ǲ��Ƕ�Ӧ�ķ���
        if(ary&&ary instanceof Array){//��������ִ��unBindʱ���ֱ���
            //��eventFn��curEle["muBind"]�����һ�ױ��Ľ��,�ҵ�֮�����¼����аѻ�װ��Ľ���Ƴ��¼���
            for(var i=0;i<ary.length;i++){
                var cur=ary[i];
                if(cur.photo==eventFn){
                    //2.�Ƴ�����������������ɾ��
                    curEle.detachEvent("on"+eventType,cur);//��������¼������Ƴ�
                    ary.splice(i,1);//������Ӷ�Ӧ���������Ƴ�
                    break;
                }
            }
        }
    }
    //���˳������:��ʹ��������Դ����¼���,����ģ���׼��������¼���ʵ��
//run:���˳������
    //on:�����¼���,����Ҫ����ǰԪ�ذ󶨵ķ�������������¼�����
    function on(curEle,eventType,eventFn){
        //1.��������
        if(!curEle["myEvent"+eventType]){
            curEle["myEvent"+eventType]=[];
        }
        var ary=curEle["myEvent"+eventType];
        //2.��������ӽ�����,����ظ�ֱ�ӷ���
        for(var i=0;i<ary.length;i++){if(ary[i]===eventFn){return;}}
        ary.push(eventFn);
        //�����Ҫ�ڵ����ʱ��ִ��run����,��Ҫ��run������ӵ���������õ��¼�����
        //curEle.addEventListener(eventType,run,false);
        //curEle.attachEvent("on"+eventType,run);//run�е�thisΪwindow
        //3.ΪԪ�ذ�run����
        bind(curEle,eventType,run);//���this���ظ�����
    }
    // run:Ψһ����ǰԪ�ص�ĳ����Ϊ�������¼����а󶨵ķ���,����Ϊ����,ִ��run����,��run�зֱ�Ѵ洢���Լ������е����з���ִ��
    function run(e){
        //1.�������
        e=e||window.event;
        //Ϊ�˺���ÿ���󶨷�����ʹ���¼����󷽱�,ͳһ�����¼�������ݴ���
        var flag=e.target?true:false;
        if(!flag){
            e.target=e.srcElement;
            e.pageX=e.clientX+(document.documentElement.scrollLeft|document.body.scrollLeft);
            e.pageY=e.clientY+(document.documentElement.scrollTop|document.body.scrollTop);
            e.stopPropagation= function () {
                e.cancelBubble=true;

            };
            e.preventDefault= function () {
                e.returnValue=false;
            };
        }
        //var ary=curEle["muEvent"+eventType];thisΪ��ǰԪ��
        //2.��ȡ�Լ��������¼����еķ���,�ж���һ������ʱ,����ִ��;���Ƿ�����ɾ��
        var ary=this["myEvent"+e.type];
        for(var i=0;i<ary.length;i++){
            var tempFn=ary[i];
            if(typeof tempFn=="function"){
                tempFn.call(this,e);//�����õ��¼�����,�󶨵ķ���ִ�е�ʱ��this�ǵ�ǰҪ������Ԫ��,�����������Ϊ�䴫���¼�����;�����Լ������������д洢�����з�����ʵ���൱�ڸ���ǰԪ�ذ󶨵��¼�,Ϊ�˺����õ�ͳһ,Ҳ����ִ�е�ʱ��this��Ϊ��ǰԪ��,���Ҹ�������һ���¼�����
            }else{//��ǰ������nullʱ,Ϊ���ⱨ��,�����Ƴ�
                ary.splice(i,1);
                i--;
            }
        }
    }
    //�Ƴ�
    //off:���Լ��������¼������Ƴ�ĳ������
    function off(curEle,eventType,eventFn){
        //1.�ж��������,��������
        var ary=curEle["myEvent"+eventType];
        if(ary&&ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var cur=ary[i];
                //2.�����Ҫ�Ƴ��ķ���,�Ƴ�(��ֵΪnull)
                if(cur===eventFn){
                    //ary.splice(i,1);////��ִ�й�����,�Ƴ�һЩ����,��ô�洢����������������(ÿһ����������������Ϊ���µ�ֵ),����run����ִ�е�ʱ��,���������ۼ�,���²��ַ���ֱ������
//Ϊ�˷�ֹ��������,���Ƴ�ʱ���ܽ�ԭ��������ÿһ�������������ı�(���鳤�Ȳ��ܸı�),���Բ���ʹ��slice
                    ary[i]=null;
                    break;
                }
            }
        }
    }
    window.zhufengEvent={
        on:on,
        off:off
    };


})();