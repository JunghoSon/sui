/*! controller.main.js | jungho.son@emotion.co.kr */

define([
	'require',
	'jquery',
	'mustache'
],function(require, $, Mustache){
	'use strict';

	var MainController = function(parent){
		this._parent = parent;

		this.init();
	};

	MainController.prototype = {
		init:function(){
			
		}
	};

	return MainController;
});