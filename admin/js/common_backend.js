var scrollFunc = function(e) {
	e = e || window.event;
	if(e.wheelDelta && event.ctrlKey) {
		event.returnValue = false;
	} else if(e.detail) {
		event.returnValue = false;
	}
}
if(document.addEventListener) {
	document.addEventListener('DOMMouseScroll', scrollFunc, false);
}
window.onmousewheel = document.onmousewheel = scrollFunc;

function changeTab(ele){
	$(ele).click(function(){
		$(this).parent().parent().find(ele).removeClass('active');
		$(this).addClass('active');
	});
}



function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
function setPage(){
	var page = parseInt(GetQueryString("page"));
	
	$('.pagination li').eq(page).addClass('active').siblings().removeClass('active');
}

// 校验所有必填项是否为空
function checkMustFill(ele){
	var status = false;
	$(ele).each(function(index){
		var _this = $(this);
		if(!_this.val()){
			return false;
		}
		if(index === $(ele).length-1){
			status = true;
		}
	});
	return status;
}


// 弹出提示框
if($('.tip-wrapper').is(':visible')){
	$('.modal-tip').modal('show');
}




// 多选表格
function CheckTable(ele){
	this.parentEle = $(ele),
	this.btn_select = this.parentEle.find('.iconfont'),
	this.btn_select_all = this.parentEle.find('#selectAll'),
	this.init();
}
CheckTable.prototype = {
	init: function(){
		var _this = this;
		this.btn_select.click(function(){
			var $this = $(this);
			$this.hasClass('icon-weixuan') ? $this.addClass('icon-xuanze').removeClass('icon-weixuan') : $this.addClass('icon-weixuan').removeClass('icon-xuanze')
		
			if($this.hasClass('icon-weixuan')){
				_this.btn_select_all.addClass('icon-weixuan').removeClass('icon-xuanze')
			}
		});
		this.btn_select_all.click(function(){
			if($(this).hasClass('icon-weixuan')){
				$('.ui-table-tr .icon-xuanze').trigger('click');
			}else{
				$('.ui-table-tr .icon-weixuan').trigger('click');
			}
		});
	}
}

function checkTable(){
	$('.ui-table .iconfont').click(function(){
		var _this = $(this);
		_this.hasClass('icon-weixuan') ? _this.addClass('icon-xuanze').removeClass('icon-weixuan') : _this.addClass('icon-weixuan').removeClass('icon-xuanze')
	
		if(_this.hasClass('icon-weixuan')){
			$('#selectAll').addClass('icon-weixuan').removeClass('icon-xuanze')
		}
	
	});
	
	$('#selectAll').click(function(){
		var _this = $(this);
		if($(this).hasClass('icon-weixuan')){
			$('.ui-table-tr .icon-xuanze').trigger('click');
		}else{
			$('.ui-table-tr .icon-weixuan').trigger('click');
			
		}
	});
}


// 上传照片
var upLoadImg = function(e){
	console.log(e)
	var _this = $(e).parent();
	var $c = _this.find('input[type=file]')[0];
	var file = $c.files[0],reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
    	_this.find('img').attr('src',e.target.result);
    	var $targetEle = _this.find('input:hidden').eq(1);
    	$targetEle.val(e.target.result);
    	console.log($targetEle.val())
	};
};
			
			
// 区域滚动
$.zUI = $.zUI || {};
$.zUI.emptyFn = function(){};
$.zUI.asWidget = [];
$.zUI.addWidget = function(sName,oSefDef){
	$.zUI.asWidget.push(sName);
	var w = $.zUI[sName] = $.zUI[sName] || {};
	var sPrefix = "zUI" + sName
	w.sFlagName = sPrefix;
	w.sEventName = sPrefix + "Event";
	w.sOptsName = sPrefix + "Opts";
	w.__creator = $.zUI.emptyFn;
	w.__destroyer = $.zUI.emptyFn;
	$.extend(w,oSefDef);
	w.fn = function(ele,opts){
		var jqEle = $(ele);
		jqEle.data(w.sOptsName,$.extend({},w.defaults,opts));
		if(jqEle.data(w.sFlagName)){
			return;
		}
		jqEle.data(w.sFlagName,true);
		w.__creator(ele);
		jqEle.on(jqEle.data(w.sEventName));
	};
	w.unfn = function(ele){
		w.__destroyer(ele);
		var jqEle = $(ele);
		if(jqEle.data(w.sFlagName)){
			jqEle.off(jqEle.data(w.sEventName));
			jqEle.data(w.sFlagName,false);
		}
	}
}
$.zUI.addWidget("draggable",{
	defaults:{
		bOffsetParentBoundary:false,
		oBoundary:null,
		fnComputePosition:null
	},
	__creator:function(ele){
		var jqEle = $(ele);
		jqEle.data($.zUI.draggable.sEventName,{
		mousedown:function(ev){
		var jqThis = $(this);
		var opts = jqThis.data($.zUI.draggable.sOptsName);
		
		jqThis.trigger("draggable.start");
		var iOffsetX = ev.pageX - this.offsetLeft;
		var iOffsetY = ev.pageY - this.offsetTop;
		
		function fnMouseMove (ev) {
			var oPos = {};
			if(opts.fnComputePosition){
				oPos = opts.fnComputePosition(ev,iOffsetX,iOffsetY);
			}else{
				oPos.iLeft = ev.pageX - iOffsetX;
				oPos.iTop = ev.pageY - iOffsetY;
			}
			
			var oBoundary = opts.oBoundary;
			if(opts.bOffsetParentBoundary){//如果以offsetParent作为边界
				var eParent = jqThis.offsetParent()[0];
				oBoundary = {};
				oBoundary.iMinLeft = 0;
				oBoundary.iMinTop = 0;
				oBoundary.iMaxLeft = eParent.clientWidth - jqThis.outerWidth();
				oBoundary.iMaxTop = eParent.clientHeight - jqThis.outerHeight();
			}
		
			if(oBoundary){//如果存在oBoundary，将oBoundary作为边界
				oPos.iLeft = oPos.iLeft < oBoundary.iMinLeft ? oBoundary.iMinLeft : oPos.iLeft;
				oPos.iLeft = oPos.iLeft > oBoundary.iMaxLeft ? oBoundary.iMaxLeft : oPos.iLeft;
				oPos.iTop = oPos.iTop < oBoundary.iMinTop ? oBoundary.iMinTop : oPos.iTop;
				oPos.iTop = oPos.iTop > oBoundary.iMaxTop ? oBoundary.iMaxTop : oPos.iTop;
			}
			
			jqThis.css({left:oPos.iLeft,top:oPos.iTop});
			ev.preventDefault();
			jqThis.trigger("draggable.move");
		}
		
		var oEvent = {
			mousemove:fnMouseMove,
			mouseup:function(){
				$(document).off(oEvent);
				jqThis.trigger("draggable.stop");
			}
		};
		
		$(document).on(oEvent);
	}});
	}
});
$.zUI.addWidget("panel",{
	defaults : {
			iWheelStep:16,
			sBoxClassName:"zUIpanelScrollBox",
			sBarClassName:"zUIpanelScrollBar"
	},
	__creator:function(ele){
		var jqThis = $(ele);
		if(jqThis.css("position") === "static"){
			jqThis.css("position","relative");
		}
		jqThis.css("overflow","hidden");
		
		var jqChild = jqThis.children(":first");
		if(jqChild.length){
			jqChild.css({top:0,position:"absolute"});
		}else{
			return;
		}
		
		var opts = jqThis.data($.zUI.panel.sOptsName);
		//创建滚动框
		var jqScrollBox = $("<div style='position:absolute;line-height:0;'></div>");
		jqScrollBox.addClass(opts.sBoxClassName);
		//创建滚动条
		var jqScrollBar= $("<div style='position:absolute;line-height:0;'></div>");
		jqScrollBar.addClass(opts.sBarClassName);
		jqScrollBox.appendTo(jqThis);
		jqScrollBar.appendTo(jqThis);
		
		
		
		opts.iTop = parseInt(jqScrollBox.css("top"));
		opts.iWidth = jqScrollBar.width();
		opts.iRight = parseInt(jqScrollBox.css("right"));
		
		//添加拖拽触发自定义函数
		jqScrollBar.on("draggable.move",function(){
			var opts = jqThis.data($.zUI.panel.sOptsName);
			fnScrollContent(jqScrollBox,jqScrollBar,jqThis,jqChild,opts.iTop,0);
		});
		
	    //事件对象
		var oEvent ={
			mouseenter:function(){
				fnFreshScroll();
				jqScrollBox.css("display","block");
				jqScrollBar.css("display","block");
			},
			mouseleave:function(){
				jqScrollBox.css("display","block");
				jqScrollBar.css("display","block");
			}
		};
		
		var sMouseWheel = "mousewheel";
		if(!("onmousewheel" in document)){
			sMouseWheel = "DOMMouseScroll";
		}
		oEvent[sMouseWheel] = function(ev){
			var opts = jqThis.data($.zUI.panel.sOptsName);
			var iWheelDelta = 1;
			ev.preventDefault();
			ev = ev.originalEvent;
			if(ev.wheelDelta){
					iWheelDelta = ev.wheelDelta/120;
			}else{
					iWheelDelta = -ev.detail/3;
			}
			var iMinTop = jqThis.innerHeight() - jqChild.outerHeight();
			//外面比里面高，不需要响应滚动
			if(iMinTop>0){
				jqChild.css("top",0);
				return;
			}
			var iTop = parseInt(jqChild.css("top"));
			var iTop = iTop + opts.iWheelStep*iWheelDelta;
			iTop = iTop > 0 ? 0 : iTop;
			iTop = iTop < iMinTop ? iMinTop : iTop;
			jqChild.css("top",iTop);
			fnScrollContent(jqThis,jqChild,jqScrollBox,jqScrollBar,0,opts.iTop);
		}
		//记录添加事件
		jqThis.data($.zUI.panel.sEventName,oEvent);
		//跟随滚动函数
		function fnScrollContent(jqWrapper,jqContent,jqFollowWrapper,jqFlollowContent,iOffset1,iOffset2){
			var opts = jqThis.data($.zUI.panel.sOptsName);
			var rate = (parseInt(jqContent.css("top"))-iOffset1)/(jqContent.outerHeight()-jqWrapper.innerHeight())//卷起的比率
			var iTop = (jqFlollowContent.outerHeight()-jqFollowWrapper.innerHeight())*rate + iOffset2;
			jqFlollowContent.css("top",iTop);
		}
	
		//刷新滚动条
		function fnFreshScroll(){

			var opts = jqThis.data($.zUI.panel.sOptsName);
			var iScrollBoxHeight = jqThis.innerHeight()-2*opts.iTop;
			var iRate = jqThis.innerHeight()/jqChild.outerHeight();
			var iScrollBarHeight = iScrollBarHeight = Math.round(iRate*iScrollBoxHeight);
			//如果比率大于等于1，不需要滚动条,自然也不需要添加拖拽事件
			if(iRate >= 1){
				jqScrollBox.css("height",0);
				jqScrollBar.css("height",0);
				return;
			}
			jqScrollBox.css("height",iScrollBoxHeight);
			jqScrollBar.css("height",iScrollBarHeight);
			//计算拖拽边界，添加拖拽事件
			var oBoundary = {iMinTop:opts.iTop};
			oBoundary.iMaxTop = iScrollBoxHeight - Math.round(iRate*iScrollBoxHeight)+opts.iTop;
			oBoundary.iMinLeft = jqThis.innerWidth() - opts.iWidth - opts.iRight;
			oBoundary.iMaxLeft = oBoundary.iMinLeft;
			fnScrollContent(jqThis,jqChild,jqScrollBox,jqScrollBar,0,opts.iTop);
			jqScrollBar.draggable({oBoundary:oBoundary});
		}
	},
		__destroyer:function(ele){
			var jqEle = $(ele);
			if(jqEle.data($.zUI.panel.sFlagName)){
				var opts = jqEle.data($.zUI.panel.sOptsName);
				jqEle.children("."+opts.sBoxClassName).remove();
				jqEle.children("."+opts.sBarClassName).remove();
			}
	}
});

$.each($.zUI.asWidget,function(i,widget){
	unWidget = "un"+widget;
	var w = {};
	w[widget] = function(args){
			this.each(function(){
			$.zUI[widget].fn(this,args);
		});
		return this;
	};
	w[unWidget] = function(){
			this.each(function(){
			$.zUI[widget].unfn(this);
		});
		return this;
	}
	$.fn.extend(w);
});


var Mask = function() {
	this.btn = ["取消", "确定"],
	this.open = function(html){
		$("body").append(html);
		$("html,body").css("overflow", "hidden");
	},
	this.close = function() {
		$(".mask").off().remove();
		$("html,body").css("overflow", "initial");
	}
};
Mask.prototype.alert = function(msg, time, callback) {
	var _this = this;
	var timer = null;
	var html = '<div class="mask"><div class="mask-bg"></div><div class="mask-container">' + msg + '</div></div>'
	_this.open(html);
	$(".mask").click(function(ev) {
		clearTimeout(timer);
		_this.close();
	});
	$(".mask-container").click(function(ev) {
		ev.stopPropagation()
	});
	if(time && time > 0) {
		timer = setTimeout(function() {
			_this.close();
			callback && callback();
			clearTimeout(timer);
		}, time * 1000);
	}
};
var Mask = new Mask();
