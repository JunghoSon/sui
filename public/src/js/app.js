/*! app.js | jungho.son@emotion.co.kr */

(function(){
	'use strict';

	require.config({
		baseUrl:'/js/',

		urlArgs:'cb='+new Date().getTime(),

		paths:{
			//controller

			//library
			'jquery':'libs/jquery-1.11.3.min',
			'mustache':'libs/mustache.min',

			//manager
			'controller.common':'controller/controller.common.min',
			'controller.main':'controller/controller.main.min',
			'controller.slide':'controller/controller.slide.min',

			//plug-in

			//template
			'tmpl':'tmpl/template.min',

			//util
			'inherit':'util/util.inherit.min',
			'validation':'util/util.validation.min',

			//ui
			'ui.gnb':'ui/ui.gnb.min',
			'ui.slide':'ui/ui.slide.min',
			'ui.swipe':'ui/ui.swipe.min'
		},

		map:{},

		shim:{
			'jquery.easing':['jquery'],
			'jquery.mousewheel':['jquery']
		}
	});

	var app={
		controller:null,
		media:null,

		init:function(){
			var owner = this;
			
			require(['jquery'],function($){
				owner.set_hash();
				owner.set_controller();
			});
		},

		set_hash:function(){
			var hash = this.get_hash();

			require(['validation'],function(ValidationUtil){
				if(ValidationUtil.is_empty_string(hash[0])) window.location.hash='main';
			});
		},

		set_controller:function(){
			var owner = this;

			require(['controller.common'],function(CommonController){
				owner.controller = new CommonController(owner);
			});
		},

		get_hash:function(){
			return window.location.hash.replace('#','').split('/');
		},

		ajax_request:function(url, target, fnc, query, method){
			var u = url + '?cb=' + new Date().getTime();
			var m = method || 'GET';
			var q = query || null;

			$.ajax({
				'url'      : u,
				'method'   : m,
				'data'     : q,
				'dataType' :'json',
				'success'  :function(data, textStatus, xhr){
					if(typeof fnc === 'function') fnc.call(target,data);
				},
				'error'    :function(error, textStatus, xhr){
					throw new Error(error);
				}
			});
		}
	};

	app.init();
})();



