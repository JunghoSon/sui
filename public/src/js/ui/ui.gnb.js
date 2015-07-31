/*! ui.slide.js | jungho.son@emotion.co.kr */

define([
	'jquery'
],function($){
	'use strict';

	var GnbUI = function(scope){
		this._scope = scope;

		this.init();
	};

	GnbUI.prototype={

		//INITAILIZE
		init:function(){
			console.log('init!!');
		}
	};

	return GnbUI;
});