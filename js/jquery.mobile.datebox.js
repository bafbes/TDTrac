/*
* jQuery Mobile Framework : plugin to provide an android-like datepicker.
* Copyright (c) JTSage
* CC 3.0 Attribution.  May be relicensed without permission or notifcation.
*/
(function($, undefined ) {
$.widget( "mobile.datebox", $.mobile.widget, {
	options: {
		theme: null,
		disabled: false,
		pickPageTheme: 'b',
		buttonTheme: 'a',
	},
	_create: function(){

		var self = this,
			o = this.options,
			input = this.element,
			theme = o.theme;
			
		themeclass = " ui-body-" + theme;
		$('label[for='+input.attr('id')+']').addClass('ui-input-text');
		input.addClass('ui-body-'+ o.theme);
		
		var focusedEl = input;

		if( input.is('[type="datebox"],[data-type="datebox"]') ){
			
			$(this).data('date', new Date());
			
			focusedEl = input.wrap('<div class="ui-input-search ui-input-datebox ui-shadow-inset ui-btn-corner-all ui-btn-shadow'+ themeclass +'"></div>').parent();
			input.removeClass('ui-corner-all ui-shadow-inset ' + themeclass)
			
			var clearbtn = $('<a href="#" class="ui-input-clear" title="date picker">date picker</a>')
				.tap(function( e ){ /* clicked the button! */
					inputOffset = focusedEl.offset()
					pickWinHeight = pickPage.outerHeight();
					pickWinWidth = pickPage.innerWidth();
					pickWinTop = inputOffset.top - ( pickWinHeight / 2);
					if ( pickWinTop < 1 ) {
						pickWinTop = 0;
					}
					pickWinLeft = inputOffset.left + ( focusedEl.outerWidth() / 2) - ( pickWinWidth / 2);
					pickPage.css('position', 'absolute').css('top', pickWinTop).css('left', pickWinLeft).fadeIn('slow');
					input.focus();
					input.trigger('change'); 
					e.preventDefault();
				})
				.appendTo(focusedEl)
				.buttonMarkup({icon: 'grid', iconpos: 'notext', corners:true, shadow:true});

			focusedEl.parent().tap(function() {
				input.focus();
			});
			input
				.focus(function(){
					focusedEl.addClass('ui-focus');
					input.removeClass('ui-focus');
				})
				.blur(function(){
					focusedEl.removeClass('ui-focus');
					input.removeClass('ui-focus');
				})
				.change(function() {
					if ( input.val() != '' ) {
						$(self).data("date", new Date(input.val()));
					} else {
						$(self).data("date", new Date());
					}
					updateMe();
				});
				
				
			function updateMe() {
				pickPageDate.find('h4').html($(self).data("date").toLocaleDateString());
				pickMonth.val($(self).data("date").getMonth() + 1);
				pickDay.val($(self).data("date").getDate());
				pickYear.val($(self).data("date").getFullYear());
			};
			
			function isInt(s) {
				return (s.toString().search(/^[0-9]+$/) == 0);
			}

			var pickPage = $("<div data-role='page' data-theme='" + o.pickPageTheme + "' class='ui-datebox-container'>" +
							"<div data-role='header' data-backbtn='false' data-theme='a'>" +
								"<a href=\"#\" data-icon='delete' data-iconpos='notext'>Cancel</a> <div class='ui-title'>Choose Date</div>"+
							"</div>"+
							"<div data-role='content'></div>"+
						"</div>")
						.appendTo( $.mobile.pageContainer )
						.page(),
						
				pickPageContent = pickPage.find( ".ui-content" ),
				pickPageClose = pickPage.find( ".ui-header a");
				
			pickPageClose.click(function(e) {
				pickPage.fadeOut('fast');
				input.focus();
			});
			
			pickPage.width('300px');
			
			var pickPageDate = $("<div class='ui-datebox-date'><h4>"+$(this).data("date").toLocaleDateString()+"</h4></div>").appendTo(pickPageContent);
			
			var pickPagePlus = $("<div class='ui-datebox-controls'></div>").appendTo(pickPageContent);
			
			$("<div class='ui-datebox-button' title='Next Month'><a href='#'></a></div>")
				.appendTo(pickPagePlus).buttonMarkup({theme: o.buttonTheme, icon: 'plus', iconpos: 'bottom', corners:true, shadow:true})
				.click(function() {
					$(self).data("date").setMonth($(self).data("date").getMonth() + 1);
					updateMe();
				});
			
			$("<div class='ui-datebox-button' title='Next Day'><a href='#'></a></div>")
				.appendTo(pickPagePlus).buttonMarkup({theme: o.buttonTheme, icon: 'plus', iconpos: 'bottom', corners:true, shadow:true})
				.click(function() {
					$(self).data("date").setDate($(self).data("date").getDate() + 1);
					updateMe();
				});
			
			$("<div class='ui-datebox-button' title='Next Year'><a href='#'></a></div>")
				.appendTo(pickPagePlus).buttonMarkup({theme: o.buttonTheme, icon: 'plus', iconpos: 'bottom', corners:true, shadow:true})
				.click(function() {
					$(self).data("date").setYear($(self).data("date").getFullYear() + 1);
					updateMe();
				});
				
			var pickPageInput = $("<div class='ui-datebox-input'></div>").appendTo(pickPageContent);
			
			var pickMonth = 	$("<input type='text' />").appendTo(pickPageInput)
				.keyup(function() {
					if ( $(this).val() != '' && isInt($(this).val()) ) {
						$(self).data("date").setMonth(parseInt($(this).val())-1);
						updateMe();
					}
				});
				
			var pickDay = 		$("<input type='text' />").appendTo(pickPageInput)
				.keyup(function() {
					if ( $(this).val() != '' && isInt($(this).val()) ) {
						$(self).data("date").setDate(parseInt($(this).val()));
						updateMe();
					}
				});
				
			var pickYear = 		$("<input type='text' />").appendTo(pickPageInput)
				.keyup(function() {
					if ( $(this).val() != '' && isInt($(this).val()) ) {
						$(self).data("date").setYear(parseInt($(this).val()));
						updateMe();
					}
				});
			
			var pickPageMinus = $("<div class='ui-datebox-controls'></div>").appendTo(pickPageContent);
			
			$("<div class='ui-datebox-button' title='Previous Month'><a href='#'></a></div>")
				.appendTo(pickPageMinus).buttonMarkup({theme: o.buttonTheme, icon: 'minus', iconpos: 'top', corners:true, shadow:true})
				.click(function() {
					$(self).data("date").setMonth($(self).data("date").getMonth() - 1);
					updateMe();
				});
			
			$("<div class='ui-datebox-button' title='Previous Day'><a href='#'></a></div>")
				.appendTo(pickPageMinus).buttonMarkup({theme: o.buttonTheme, icon: 'minus', iconpos: 'top', corners:true, shadow:true})
				.click(function() {
					$(self).data("date").setDate($(self).data("date").getDate() - 1);
					updateMe();
				});
			
			$("<div class='ui-datebox-button' title='Previous Year'><a href='#'></a></div>")
				.appendTo(pickPageMinus).buttonMarkup({theme: o.buttonTheme, icon: 'minus', iconpos: 'top', corners:true, shadow:true})
				.click(function() {
					$(self).data("date").setYear($(self).data("date").getFullYear() - 1);
					updateMe();
				});
			
			var pickPageSet = $("<div class='ui-datebox-controls'></div>").appendTo(pickPageContent);
			
			$("<a href='#'>Set Date</a>")
				.appendTo(pickPageSet).buttonMarkup({theme: o.pickPageTheme, icon: 'check', iconpos: 'left', corners:true, shadow:true})
				.click(function() {
					input.val($(self).data("date").toLocaleDateString());
					pickPage.fadeOut('fast');
					input.blur();
				});
					
			pickPage.css('minHeight', '0px');
			
		}
	},
	    
	disable: function(){
		( this.element.attr("disabled",true).is('[type="datebox"],[data-type="datebox"]') ? this.element.parent() : this.element ).addClass("ui-disabled");
	},
	
	enable: function(){
		( this.element.attr("disabled", false).is('[type="datebox"],[data-type="datebox"]') ? this.element.parent() : this.element ).removeClass("ui-disabled");
	}

	
	});
})( jQuery );
