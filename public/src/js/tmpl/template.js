/*! template.js | jungho.son@emotion.co.kr */

define(function(){
	'use strict';
	
	var Template = {
		menu:[
			'<ul class="gnb">',
				'{{#MENU}}',
					'<li>',
						'<a href="#">{{NAME}}</a>',
						'<ul class="sub">',
							'{{#CHILD}}',
								'<li>',
									'<a href="#{{HASH}}">{{NAME}}</a>',
								'</li>',
							'{{/CHILD}}',
						'</ul>',
					'</li>',
				'{{/MENU}}',
			'</ul>'
		].join(''),

		slide:[
			'<section class="item-info">',
				'<h2>{{INFO.TITLE}}</h2>',
				'<P>{{INFO.TEXT}}</P>',
				'<p class="padd-top-25"><a href="" class="button-type1">view code</a></p>',
			'</section>',
			'<hr />',
			'<section class="item-main">',
				'<div class="u_slide" data-auto="y">',
					'<div class="u_slide_container">',
						'<ul class="u_slide_content">',
							'{{#CONTENT}}',
								'<li style="background-image:url({{IMG}})"><p>{{TEXT}}</p></li>',
							'{{/CONTENT}}',
						'</ul>',
					'</div>',
					'<a href="#" class="u_slide_prev">prev</a>',
					'<a href="#" class="u_slide_next">next</a>',
					'<div class="u_slide_navigate">',
						'{{#CONTENT}}',
							'<a href="#">{{TEXT}}</a>',
						'{{/CONTENT}}',
					'</div>',
				'</div>',
			'</section>'
		].join('')
	};

	return Template;
});