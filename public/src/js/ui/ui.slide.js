/*! ui.slide.js | jungho.son@emotion.co.kr */

define([
	'jquery'
],function($){
	'use strict';

	var SlideUI = function(scope){
		this._scope = scope;
		this._container = null;
		this._content = null;
		this._slides = null;
		this._navigate=null;
		this._target = {'prev' : null, 'current' : null, 'next' : null};
		this._case = false;
		this._w = 0;
		this._h = 0;
		this._length = 0;
		this._current = 0;
		this._current_navigate = null;
		this._flag = {'slide' : false, 'auto' : false};
		this._transition = {'speed' : '400' , 'time' : 4000};
		this._is_css = false;
		this._interval = null;

		this.init();
	};

	SlideUI.prototype={

		//INITAILIZE
		init:function(){
			this.set_scope();
			this.set_container();
			this.set_content();
			this.set_slides();
			this.set_navigate();
			this.set_event();
		},

		//SETTER
		set_scope:function(){
			var auto = this._scope.attr('data-auto').toUpperCase();
			if(typeof auto !== 'undefined' && auto === 'Y') this._flag.auto = true;

			this._w = this._scope.width();
			this._h = this._scope.height();

			this._is_css = this.get_css();
		},

		set_container:function(){
			this._container = this._scope.find('div.u_slide_container');
			
			this._container.css({
				'position':'relative',
				'width':'100%',
				'overflow':'hidden'
			});

			if(!this._is_css) this._container.height(this._h);
		},

		set_content:function(){
			this._content = this._container.find('ul.u_slide_content');
			this._slides = this._content.children();
			this._length = this._slides.length;

			if(this._length === 2) this.set_slides_more();

			this._content.css({
				'position':'relative',
				'left':0,
				'top':0,
				'width':(this._w * this._length) + 'px'
			});
			
			if(!this._is_css){
				this._content.css({'position':'absolute'})
							 .height(this._h);
			}

			this.set_content_position();
		},

		set_slides:function(){
			var owner = this,
				x = owner._w,
				y = owner._h;

			this._slides.each(function(a){
				if(owner._is_css){
					$(this).css({
						'position':'relative',
						'left':-(x*a)+'px',
						'float':'left',
						'width':x+'px'
					});

				}else{
					$(this).css({
						'position':'absolute',
						'left':0,
						'top':y+'px',
						'width':x+'px'
					});
				}
			});
			
			this.set_slides_target();
			if(this._flag.auto) this.autoplay();
		},

		set_navigate:function(){
			var owner=this;

			this._navigate=this._scope.find('div.u_slide_navigate > a');

			this._navigate.each(function(a){
				$(this).data({'cnt':a});

				if(a===owner._current) owner.active_navigate($(this));
			});
		},

		set_event:function(){
			var owner=this;

			this._scope.off('click');

			this._scope.on('click','a.u_slide_prev',function(e){
				if(!owner._flag.slide) owner.transition(1);

				return false;
			});

			this._scope.on('click','a.u_slide_next',function(e){
				if(!owner._flag.slide) owner.transition(-1);

				return false;
			});
			
			this._scope.on('click','div.u_slide_navigate > a',function(e){
				if(!owner._flag.slide){
					var dir = 0;
					var current = (owner._case) ? owner._current % 2 : owner._current;
					if(current > $(this).data('cnt')) dir = 1; else if(current < $(this).data('cnt')) dir = -1;
					
					owner.transition(dir, $(this).data('cnt'));
				}

				return false;
			});
		},

		set_content_position:function(){
			if(this._is_css){
				this._content.css({
					'transition':'0ms' ,
					'transform':'translate3d(0,0,0)',
					'-webkit-transition':'0ms',
					'-webkit-transform':'translate3d(0,0,0)',
					'-moz-transition':'0ms',
					'-moz-transform':'translate3d(0,0,0)',
					'-o-transition':'0ms',
					'-o-transform':'translate3d(0,0,0)',
					'-ms-transition':'0ms',
					'-ms-transform':'translate3d(0,0,0)'
				});
			}else{
				this._content.css({
					'left':0
				});
			}
		},

		set_slides_more:function(){
			this._case=true;
				
			this._content.append(this._slides.eq(0).clone(true));
			this._content.append(this._slides.eq(1).clone(true));
			
			this._slides = this._content.children();
			this._length = this._slides.length;
		},

		set_slides_target:function(){
			var owner = this,
				target = owner._target,
				current = this._current;

			this._slides.each(function(a){
				var type = '',
					position=null;

				if(a === owner.get_index(current - 1)){
					type = 'prev';
					target.prev = $(this);
				}else if(a === current){
					type = 'current';
					target.current = $(this);
				}else if(a === owner.get_index(current + 1)){
					type = 'next';
					target.next = $(this);
				}else{
					type = 'etc';
				}
				
				position=owner.get_slides_position(type);
				owner.set_slides_position(owner._slides.eq(a),position);
			});
		},

		set_slides_navigate:function(index){
			var owner = this,
				current = this._current,
				target = null,
				x=this._w,
				y=this._h,
				position={'x' : 0, 'y' : y};

			if(index < current){
				target = this._target.prev;
				this.set_slides_position(target, position);
				
				position.x = -x;
				position.y = 0;
			}else if(index > current){
				target = this._target.next;
				this.set_slides_position(target, position);
				
				position.x = x;
				position.y = 0;
			}else{
				return;
			}
			
			target = this._slides.eq(index);
			this.set_slides_position(target, position);
		},

		set_slides_position:function(target, position){
			if(this._is_css){
				target.css({
					'transform':'translate3d(' + position.x + 'px,' + position.y + 'px,0)',
					'-webkit-transform':'translate3d(' + position.x + 'px,' + position.y + 'px,0)',
					'-moz-transform':'translate3d(' + position.x + 'px,' + position.y + 'px,0)',
					'-o-transform':'translate3d(' + position.x + 'px,' + position.y + 'px,0)',
					'-ms-transform':'translate3d(' + position.x + 'px,' + position.y + 'px,0)'
				});
			}else{
				target.css({
					'left' : position.x + 'px',
					'top' : position.y + 'px'
				});
			}
		},

		set_current:function(d){
			switch(d){
		    	case -1:
		    		this._current+=1;
		    		
		    		if(this._current>this._length-1) this._current=0;
		    		break;
		    		
		    	case 1:
		    		this._current-=1;
		    		
		    		if(this._current<0) this._current=this._length-1;
		    		break;
		    		
		    	default:
		    }

		    if(this._case) this._current %= 2;
		},

		//GETTER
		get_css:function(){
			var f=document.createElement('swipe');
			var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
			
			for(var i in props){
				if (f.style[ props[i] ] !== undefined) return true;
				return false;
			}
		},

		get_index:function(index){
			return (this._length + (index % this._length)) % this._length;
		},

		get_slides_position:function(type){
			var position={'x' : 0, 'y' : 0},
				x=this._w,
				y=this._h;

			switch(type){
				case 'prev':
					position.x = -x;
					position.y = 0;
					break;

				case 'current':
					break;

				case 'next':
					position.x=x;
					position.y=0;
					break;
				
				default:
					position.x=0;
					position.y=y;
			}

			return position;
		},

		//OPERATION

		transition:function(dir,cnt){
			var owner=this;

			if(owner._flag.auto) owner.stop_autoplay();
			this._flag.slide=true;

			if(typeof cnt!=='undefined'){
				if(this._current===cnt){
					this._flag.slide=false;
					if(this._flag.auto) this.autoplay();
					return;
				}
				
				this.set_slides_navigate(cnt);
				this._current=cnt;
			}else{
				this.set_current(dir);
			}
			
			this.sliding(dir);

			if(this._current_navigate) this.deActive_navigate(this._current_navigate);
			this.active_navigate(this._navigate.eq(this._current));
		},

		sliding:function(dir){
			var owner = this,
				content = this._content,
				pos = this._w*dir,
				speed = this._transition.speed;
			
			if(this._is_css){
				content.css({
					'transition' : speed + 'ms',
					'transform' : 'translate3d(' + pos + 'px,0,0)',
					'-webkit-transition' : speed + 'ms',
					'-webkit-transform':'translate3d(' + pos + 'px,0,0)',
					'-moz-transition' : speed + 'ms',
					'-moz-transform' : 'translate3d(' + pos + 'px,0,0)',
					'-o-transition' : speed + 'ms',
					'-o-transform' : 'translate3d(' + pos + 'px,0,0)',
					'-ms-transition' : speed + 'ms',
					'-ms-transform' : 'translate3d(' + pos + 'px,0,0)'
				})
				.on({
					'webkitTransitionEnd msTransitionEnd oTransitionEnd otransitionend transitionend':function(){
						owner.finish_sliding(dir);
						
						$(this).off('webkitTransitionEnd msTransitionEnd oTransitionEnd otransitionend transitionend');
					}
				});
			}else{
				content.stop().animate({'left' : pos + 'px'},speed,function(e){
					owner.finish_sliding(dir);
				});
			}
		},

		finish_sliding:function(dir){
			var owner=this,
				flag=this._flag,
				length=this._length;

			if(dir!==0) this.set_slides_target();
			
			this.set_content_position();
			flag.slide=false;
			if(flag.auto) this.autoplay();
		},

		active_navigate:function(item){
			item.addClass('on');
			this._current_navigate=item;
		},

		deActive_navigate:function(item){
			item.removeClass('on');
		},

		autoplay:function(){
			var owner=this;

			if(this._interval!==null){
				clearInterval(this._interval);
				this._interval=null;
			}
			
			this._interval=setInterval(function(){
				owner.transition(-1);
			},owner._transition.time);
		},
		
		stop_autoplay:function(){
			var owner=this;
			
			if(this._interval!==null){
				clearInterval(owner._interval);
				this._interval=null;
			}
		}
	};

	return SlideUI;
});