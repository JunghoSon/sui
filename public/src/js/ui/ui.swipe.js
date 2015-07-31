/*! ui.swipe.js | jungho.son@emotion.co.kr */

define([
	'jquery',
	'slide',
	'inherit'
],function($, SlideUI, InheritUtil){
	'use strict';

	var SwipeUI = function(scope){
		this._start = {'x':0,'y':0};
		this._amount = {'x':0,'y':0};
		this._pos=0;
		this._ratio = 0.1;
		this._range = 0;
		this._drag = false;
		this._scroll = false;

		SlideUI.call(this,scope);
	};

	SwipeUI.prototype=InheritUtil.get_prototype(SlideUI);
	SwipeUI.prototype.constructor=SwipeUI;

	SwipeUI.prototype.set_event=function(){
		SlideUI.prototype.set_event.call(this);

		var owner=this;

		this._scope.off('touchstart touchmove touchend');

		this._scope.on('touchstart','ul.u_slide_content',function(e){
			if(!owner._flag.slide) owner.touchstart.call(owner,e);

			return false;
		});

		this._scope.on('touchmove','ul.u_slide_content',function(e){
			if(!owner._flag.slide) owner.touchmove.call(owner,e);
			
			return false;
		});

		this._scope.on('touchend','ul.u_slide_content',function(e){
			if(!owner._flag.slide && owner._drag){
				owner._flag.slide=true;
				owner.touchend.call(owner,e);	
			}
			
			return false;
		});
	};

	SwipeUI.prototype.touchstart=function(e){
		if(e.type=='touchstart' && e.originalEvent.touches.length<=1){
			this._start.x=e.pageX || e.originalEvent.touches[0].pageX;
			this._start.y=e.pageY || e.originalEvent.touches[0].pageY;
			this._scroll=false;
			
			if(this._flag.auto) this.stop_autoplay();
		}
	};

	SwipeUI.prototype.touchmove=function(e){
		if(e.type=='touchmove' && e.originalEvent.touches.length<=1){
		    var owner=this;
		    
		    this._amount.x=(e.pageX || e.originalEvent.touches[0].pageX)-this._start.x;
		    this._amount.y=(e.pageY || e.originalEvent.touches[0].pageY)-this._start.y;
		    
		    var x=Math.abs(this._amount.x);
		    var y=Math.abs(this._amount.y);
		    
		    if((x<y && !this._drag) || this._scroll){
		    	this._drag=false;
			    this._scroll=true;
		    }else{
		    	/*if(navigator.userAgent.indexOf("android 4.1")>-1){
					e.stopPropagation();
				} else {
					e.preventDefault();
				}*/
				
		    	this._drag=true;
		        this._scroll=false;
		        
	        	var pos=this._pos+this._amount.x;

		        if(this._is_css){
		        	this._content.css({
	        			'transform':'translate3d('+pos+'px,0,0)',
	        			'-webkit-transform':'translate3d('+pos+'px,0,0)',
	        			'-moz-transform':'translate3d('+pos+'px,0,0)',
	        			'-o-transform':'translate3d('+pos+'px,0,0)',
	        			'-ms-transform':'translate3d('+pos+'px,0,0)'
		        	});
		        }else{
	        		this._content.css({
	        			'left':pos+'px'
	        		});
		        }
		    }
	    }
	};

	SwipeUI.prototype.touchend=function(e){
		if(e.type=='touchend' && e.originalEvent.touches.length<=1){
			if(this._scroll){
				this._drag=false;
				this._flag.slide=false;
				return;	
			}

			var d=this.get_direction();

			if(this._drag){
				this.transition(d);
			}else{
				this._flag.slide=false;
				if(this._flag.auto) this.autoplay();
			}

			this._drag=false;
		}
	};

	SwipeUI.prototype.get_direction=function(){
		var _r=0;

		if(this._range===0) this._range = this._ratio * this._w;
		
		if(this._amount.x>this._range) _r=1; else if(this._amount.x<-this._range) _r=-1;
		
		return _r;
	};

	return SwipeUI;
});