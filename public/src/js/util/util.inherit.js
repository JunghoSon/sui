/*! util.inherit.js | jungho.son@emotion.co.kr */

define(function(){
	var InheritUtil={
		'get_prototype':function(parent){
			var F=function(){};
			F.prototype=parent.prototype;

			return new F();
		}
	};

	return InheritUtil;
});