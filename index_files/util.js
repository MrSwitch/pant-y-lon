/**
 * JavaScript Document
 * @require JQuery
 * @author Andrew Dodson
 * @company Knarly.com
 */
if ( typeof console == "undefined" ){
	var console = {log:function(){}}
}

if(document.getElementById('notice').style.display !== 'none'){
	$('#notice').hide().slideDown('slow');
}

jQuery.fn.extend({
  scrollTo : function(speed, options, easing ) {
	options = options || {};
    return this.each(function() {
      $('html,body').animate({scrollTop: (typeof(options.scrollTop) !== 'undefined' ? options.scrollTop : $(this).offset().top-parseInt($(this).css('marginTop'))), scrollLeft:(typeof(options.scrollLeft) !== 'undefined' ? options.scrollLeft : $(this).offset().left )}, speed, easing);
    });
  },
  modalOpen : function(c, d) { // uri|html, data
  	var d = (d || {})
		,c = (c || null)
		,m = {
		w:d.width||null,
		h:d.height||null,
		open:function(c){
			$('body').append('<div class="modal-overlay"></div><div class="modal-window" style="width:' + this.w + 'px;height:' + this.h + 'px;margin-top:-' + (this.h / 2) + 'px;margin-left:-' + (this.w / 2) + 'px;">'+c+'</div>');
		},
		events:function(){
			$('.modal-window').append('<a class=\"close-window\"></a>');
			this.h = Math.min($(".modal-window")[0].scrollHeight+20,(document.innerHeight||document.documentElement.clientHeight) -100);
			this.w = Math.min($(".modal-window")[0].scrollWidth+20, (document.innerWidth||document.documentElement.clientWidth) -50);
			$(".modal-window").animate({marginTop:-(this.h/2)+'px', height:this.h+'px',marginLeft:-(this.w/2)+'px',width:this.w+'px'},300);
			this.close();
		},
		close:function(){
			$(".close-window,.modal-overlay").click(function(){$(".modal-window,.modal-overlay").remove();});
		}
	};
	// make sure there is not already a modal window.
	m.close();
	if(c===null){
		m.open('');
		// append contents
		this.each(function() {
		  $(this).clone(true).appendTo('.modal-window');
		});
		m.events();
	}
	else if( c.match(/^(\/|https?\:\/\/)/) ){
		m.open('<div class="modal-loading"></div>');
		jQuery.ajaxSetup({ cache: true });
		$('div.modal-window').load(c, function(html){
			var t;
			if(t=html.match(/<title>(.*)<\/title>/)){
				$('.modal-window').prepend('<h1>'+t[1]+'</h1>');
			}
			// does the page have any events to find?
			if(	$('form.kscript_xform', this).length ){
				// load the form script
				jQuery.ajaxSetup({ cache: true });
				jQuery.getScript(KSCRIPT+'xform.js', function(){
					// todo: instigate the method... albeit at the moment xform is self running.
					// this is bad because it'll reapply actions to existing forms.
				});
				jQuery.ajaxSetup({ cache: false });
			}
			m.events();
		});
		jQuery.ajaxSetup({ cache: false });
	}
	else {
		m.open(c);
		m.events();
	}
  }
});


/**
 *  jQuery.observeHashChange (Version: 1.0)
 *
 *  http://finnlabs.github.com/jquery.observehashchange/
 *
 *  Copyright (c) 2009, Gregor Schmidt, Finn GmbH
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a
 *  copy of this software and associated documentation files (the "Software"),
 *  to deal in the Software without restriction, including without limitation
 *  the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *  and/or sell copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 **/

(function($){$.fn.hashchange=function(fn){$(window).bind("jQuery.hashchange",fn);return this;};$.observeHashChange=function(options){var opts=$.extend({},$.observeHashChange.defaults,options);if(isHashChangeEventSupported()){nativeVersion();}
else{setIntervalVersion(opts);}};var locationHash=null;var functionStore=null;var interval=0;$.observeHashChange.defaults={interval:200};function isHashChangeEventSupported(){return typeof window.onhashchange!=='undefined';}
function nativeVersion(){locationHash=document.location.hash;window.onhashchange=onhashchangeHandler;}
function onhashchangeHandler(e,data){var oldHash=locationHash;locationHash=document.location.hash;$(window).trigger("jQuery.hashchange",{before:oldHash,after:locationHash});}
function setIntervalVersion(opts){if(locationHash==null){locationHash=document.location.hash;}
if(functionStore!=null){clearInterval(functionStore);}
if(interval!=opts.interval){functionStore=setInterval(checkLocationHash,opts.interval);interval=opts.interval;}}
function checkLocationHash(){if(locationHash!=document.location.hash){var oldHash=locationHash;locationHash=document.location.hash;$(window).trigger("jQuery.hashchange",{before:oldHash,after:locationHash});}}
$.observeHashChange();})(jQuery);



/**
 * Add links for the tags
 */
$(document).ready(function(){

	// Add modal events to a.modal elements
	$('a.modal').click(function(){
		$().modalOpen(this.href + ' #main-content > *', {width:300, height:150});
		return false;
	});
	
	/**
	 * Do we want to add the flag event to the class?
	 */
	$('.flag.dataset div.depth_1').each(function(){
		// add flag
		var div = this;
		$('<a class="flag" title="Is there something wrong with this post?">flag</a>').appendTo(this).click(function(){
			$().modalOpen('/contact?title=FLAGGED&text='+ encodeURIComponent("<p>Please explain the issue here</p>" + $(div).html()) + ' #main-content > *', {width:300, height:150});
			return false;
		})
	});

	$('.list div.tag.depth_2').each(function(){
		if(this.innerHTML.length==0){
			return;
		}
		var a = this.innerHTML.split(/[,\s]+/),s=[],x=null;
		for(var i=0;i<=a.length;i++){if(a.hasOwnProperty(i)){
			s.push('<a class="tag" title="'+a[i]+'" href="'+window.location.pathname+'?tag='+encodeURIComponent(a[i])+'">'+encodeURI(a[i])+'<\/a>');
		}}
		$(this).html(s.join(' '));
	});
});