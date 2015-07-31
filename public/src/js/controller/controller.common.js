/*! controller.common.js | jungho.son@emotion.co.kr */

define([
	'require',
	'jquery',
	'mustache'
],function(require, $, Mustache){
	'use strict';

	var CommonController = function(app){
		this._app = app;
		this._nav = null;
		this._child_controller = null;
		this._template = null;

		this.init();
	};

	CommonController.prototype = {
		init:function(){
			var owner = this;
			
			require(['tmpl'],function(Template){
				owner._template = Template;
				owner.set_nav();
				owner.set_controller();
				owner.set_event();
			});
		},

		set_nav:function(){
			var owner = this,
				app = this._app;

			app.ajax_request('/js/asset/menu.json', this, function(data){
				$('nav').empty().append(Mustache.render(owner._template.menu,data));

				require(['ui.gnb'],function(GnbUI){
					owner._nav = new GnbUI($('.u_gnb'));
				});
			});
		},

		set_controller:function(){
			var owner = this,
				controller = ['controller.', this.get_controllor()].join('');

			require([controller],function(Controller){
				owner._child_controller = new Controller(owner._app, owner);
			});
		},

		set_event:function(){
			var owner=this;

			$(window).on('hashchange',function(){
				owner.set_controller();

				return false;
			});
		},

		get_controllor:function(){
			var hash=this._app.get_hash();

			if(hash.length===1){
				return hash[0];
			}else{
				return hash[1];
			}
		}
	};

	return CommonController;
});