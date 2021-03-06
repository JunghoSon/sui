/*! controller.slide.js | jungho.son@emotion.co.kr */

define([
	'require',
	'jquery',
	'mustache',
	'ui.slide'
],function(require, $, Mustache, SlideUI){
	'use strict';

	var SlideController = function(app, parent_controller){
		this._app = app;
		this._parent_controller = parent_controller;
		this._slide = null;

		this.init();
	};

	SlideController.prototype = {
		init:function(){
			this.set_slide();
		},

		set_slide:function(){
			var owner = this,
				template = this._parent_controller._template.slide;

			this._app.ajax_request('/js/asset/slide_info.json',this,function(data){
				$('.u_item').empty().append(Mustache.render(template,data));
				
				owner._slide = new SlideUI($('.u_slide'));
			});

		}
	};

	return SlideController;
});