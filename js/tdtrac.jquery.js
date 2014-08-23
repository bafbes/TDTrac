function infobox(text, head) { //v4 CONTROL INFOBOX CONTENT
	var element = "<div style='min-width: 400px' data-theme='a'>" +
		"<a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow ui-btn-a " + 
		"ui-icon-delete ui-btn-icon-notext ui-btn-left'>Close</a>" +
		(( typeof(head) === "undefined" ) ?
			"" :
			"<div data-role='header'><h1>" + head + "</h1></div>" 
		) +
		"<div data-role='content' class='ui-content'>" + text + "</div>" +
		"</div>";
		
	$(element).enhanceWithin().alertbox();
} // END INFOBOX CONTENT

(function($) {
	var closeButton = "<a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow " + 
		"ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-left'>Close</a>";
		
	$("html").on("pageinit", function() { // v4 BEGIN: Running in test mode?
		testMode = ($( "#tdtracconfig" ).attr("data-testmode") == 1 ) ? true : false;
		baseHREF = $( "#tdtracconfig" ).attr( "data-base" );
	}); // END: Check test Mode
	
	$(document).on("click", ".help-link", function(e,p) { // v4 BEGIN: Show Help Text
		var self = $(this),
			base = $(this).attr( "data-base" ),
			subact = $(this).attr( "data-sub" ),
			body = "",
			full = "<div data-theme='a' style='min-width: 400px'>";
			
		$.getJSON(
			baseHREF + "json/help/base:" + base + "/sub:" + subact + "/id:0/", 
			function(data) {
				self.removeClass( "ui-btn-active" );
				if ( data.success === true ) {
					console.log(data);
					for ( x = 0; x < data.helpbody.length; ++x ) {
						if ( data.helpbody[x][1] === null ) {
							body += "<li>" + data.helpbody[x][0] + "</li>";
						} else {
							body += "<li><p><strong>" + data.helpbody[x][0] + "</strong>: " +
								data.helpbody[x][1] + "</p></li>";
						} 
					}
				
					full += closeButton + "<div data-role='header'><h1>" + data.helptitle +
						"</h1></div><div class='ui-content'><ul data-role='listview'>" + body +
						"</ul></div></div>";
					
					$(full).enhanceWithin().popup().popup( "open" );
				
				} else {
					infobox("Help failed to load", "Error");
				}
			}
		);
	}); // END: Show Help Text
	
	$('#hoursview').on('datebox', function(e,p) { // BEGIN: Hours calender view handler
		if ( p.method === 'offset' && p.type === 'm' ) {
			$.mobile.showPageLoadingMsg();
			var xxx = window.location.pathname,
				umonth = xxx.match(/month:(\d+)/),
				uyear = xxx.match(/year:(\d+)/),
				id = xxx.match(/id:(\d+)/),
				which = xxx.match(/type:(\w+)\//),
				newurl = baseHREF+'hours/view/type:'+which[1]+'/id:'+id[1];
			
			month = parseInt(umonth[1], 10);
			year = parseInt(uyear[1], 10);
			
			if ( p.amount < 0 ) {
				if ( (month - 1) < 1 ) {
					month = 12; year = year - 1;
				} else {
					month = month - 1;
				}
			} else {
				if ( (month + 1) > 12 ) {
					month = 1; year = year + 1;
				} else {
					month = month + 1;
				}
			}
			
			$.mobile.changePage(newurl+'/year:'+year+'/month:'+month+'/', { reloadPage: true, transition: 'none'});
		} else if ( p.method === 'set' ) {
			var info = $('.ui-page-active #hours-data').find('[data-date='+p.value+']'),
				first = $('.ui-page-active').children('.ui-content'),
				lines = '';
			
			if ( info.length > 0 ) {
				thisDate = $(info[0]).attr('data-date');
				thisType = $(info[0]).attr('data-type');
				
				for ( x=0; x<info.length; x++ ) {
					lines = lines + '<li data-theme="' + (($(info[x]).attr('data-submitted') == 0)?'e':'c') + '">'
							+ '<a href="#"><strong>' + $(info[x]).attr('data-show') + ':</strong> '
							+ $(info[x]).attr('data-worked')
							+ '<p style="margin-top:0">' + $(info[x]).attr('data-note') + '</p>'
							+ '<p class="ui-li-count">$' + $(info[x]).attr('data-amount') + '</p></a>'
							+ '<a href="'+baseHREF+'hours/edit/id:' + $(info[x]).attr('data-recid') + '/">Edit</a></li>';
				}
				$('<div>').popupwrapper({
					displayMode: 'blank',
					closeButton: 'right',
					content:
                    	'<div data-role="header" data-theme="a" style="min-width: 350px" class="ui-corner-top ui-bar-a">'+
                        	'<h2 class="ui-title">' + thisType + ' Worked For :: ' + thisDate + '</h2>'+
	                    '</div>'+
    	                '<div data-role="content" data-theme="d" class="ui-corner-bottom ui-content">' +
        	                '<ul data-role="listview" data-theme="c">' + lines + '</ul>' +
            	        '</div>'
				});
			}
		}
	}); // END: Hours calender view handler
	
	$( "html" ).ajaxComplete(function(e,xhr,settings) { // BEGINv4: Test Mode Ajax Debug
		//* DEBUG ALL JSON BASED AJAX /
		if ( testMode === true && settings.url.search("json") > -1 ) {
			console.log(xhr.responseText);
		}
	}); // END: Test Mode Ajax Debug
	
	$(document).on("submit", "form", function(e) { // v4 FORM HANDLEING
		$.mobile.loading("show");
		e.preventDefault();
		
		var formdata = $(this).serialize(),
			formurl = $(this).attr( "action" ),
			ready = false,
			needed = [];
		
		$( ".ui-page-active [data-require=1]" ).each(function () {
			if ( $(this).val() == "" ) { 
				needed.push( $( "[for=" + $(this).attr( "id" ) + "]" ).text() );
			}
		});
		
		if ( needed.length > 0 ) {
			$.mobile.loading("hide");
			infobox("These fields are required:<br />'"+needed.join("', '")+"'", "Error");
		} else {
			ready = true;
		}
		
		if ( ready ) {
			$.ajax({
				type: "POST",
				url: formurl,
				data: formdata,
				success: 
					function(dta) {
						if ( testMode === true ) { console.log(dta); }
						if ( dta.success === true ) {
							$.mobile.changePage(
								dta.location, 
								{ 
									reloadPage: true,
									type: "post",
									data: {"infobox": dta.msg},
									transition:"slide"
								}
							);
						} else {
							$.mobile.loading("hide");
							infobox(dta.msg,"Error");
						}
				},
				dataType: "json"});
		}
		
	}); // END FORM HANDLING
	
	$(document).on("click", ".ajax-email", function(e) { // BEGIN: E-Mail Function
		$.mobile.loading( "show" );
		e.preventDefault();
		
		var linkurl = "",
			o = $(this).data( "email" );

		switch(o.action) {
			case "todo":
				linkurl = baseHREF + "json/email/base:todo/id:" + o.id + "/type:" + o.type + "/";
				break;
			case "budget":
				linkurl = baseHREF + "json/email/base:budget/id:" + o.id + "/";
				break;
			case "hours":
				linkurl = baseHREF + "json/email/base:hours/type:unpaid/id:0/";
				break;
		}
		
		if ( linkurl !== "" ) {
			$.getJSON(linkurl, function(data) {
				$.mobile.loading( "hide" );
				if ( data.success === true ) {
					infobox( "E-Mail Sent (" + o.action + ")", "Success" );
				} else {
					infobox( "E-Mail Send Failed!", "Error" );
				}
			});
		}
	}); // END: E-Mail Function
	
	$('#hours-delete').on( 'vclick', function(e) {  // BEGIN: Delete Hours
		e.preventDefault();
		var linkie = this,
			xxx = window.location.pathname,
			id = xxx.match(/id:(\d+)/);
			first = $('.ui-page-active').children('.ui-content');
			
		$('<div>').popupwrapper({
			displayMode: 'button', 
			headerText: 'DELETE!',
			headerMinWidth: '300px',
			subTitle : 'Delete Hours Item #'+id[1]+'?',
			buttons : {
				'Yes, Delete' : function () {
					$.getJSON(baseHREF+"json/delete/base:hours/id:"+id[1]+"/", function(dta) {
						if ( dta.success === true ) {
							$.mobile.changePage(dta.location, { reloadPage: true, type: 'post', data: {'infobox': 'Hours Item Deleted'}, transition:'slide'});
						} else {
							infobox("Hours Delete Failed!");
						}
					}); },
				'Cancel': { 'click': function () { return true; }, icon: 'delete' }
			}
		});
	}); // END: Delete Hours
	
	$(document).on("vclick", ".todo-done", function(e) {  // BEGIN: Mark Todo Done
		e.preventDefault();
		var linkie = this,
			linkpar = $(this).parent();
			
		if ( ! $(this).data( "done" ) ) {
			$("<div>").mdialog({
				useMenuMode: true,
				menuHeaderText: "MARK?",
				menuMinWidth: "300px",
				menuSubtitle: "Mark Todo Item #" + $(this).data( "recid" ) + " Done?",
				buttons : {
					"Yes, Mark Done" : function () {
						$.getJSON(
							baseHREF + "json/mark/base:todo/json:1/id:" + $(linkie).data("recid") + "/",
							function(data) {
								if ( data.success === true ) {
									linkpar.insertAfter( "#todo-list-done" );
									linkpar.find( "span.ui-li-count" ).html( "done" );
									linkpar.find(".todo-menu")
										.removeClass("ui-btn-e")
										.removeClass("ui-btn-a")
										.addClass("ui-btn-c");
									var count = $( "#todo-list-header" ).find( ".ui-li-count" );
									count.text( count.text() - 1 );
									infobox(
										"Todo Item #" + $(linkie).data( "recid" ) + " Marked Done",
										"Success"
									);
								} else {
									infobox(
										"Todo Item #" + $(linkie).data( "recid" ) + " Mark Failed!",
										"Error"
									);
								}
								$(linkie).data( "done", 1 );
							}
						); },
					"Cancel": { click: function () { return true; }, icon: "delete" }
				}
			});
		}
	}); // END: Mark Todo Done
	
	$(document).on("vclick", ".todo-menu", function(e) {  // BEGINv4: Todo Menu
		e.preventDefault();
		var linkie = this,
			linkpar = $(this).parent();
		if ( ! $(this).data( "done" ) ) {
			$( "<div>" ).mdialog({
				useMenuMode: true,
				menuHeaderText: "To-Do",
				menuMinWidth: "300px",
				menuSubtitle : "Todo Item #" + $(this).data( "recid" ),
				buttons : (($(this).data( "edit" ))?{
					"Edit" : {
						click: function() {
							$.mobile.changePage(
								baseHREF + "todo/edit/id:" + $(linkie).data("recid") + "/"
							); 
						},
						icon: "edit",
						close: false
					},
					"Delete" : {
						click: function() {
							$.getJSON(
								baseHREF + "json/delete/base:todo/id:" + $(linkie).data("recid") + "/",
								function(data) {
									if ( data.success === true ) {
										linkpar.find( "h3" ).html( "--Removed--");
										linkpar.find( "span.ui-li-count" ).html( "deleted" );
										if ( ! linkpar.find( ".todo-done" ).data( "done" ) ) {
											var count = $( "#todo-list-header" ).find( ".ui-li-count" );
											count.text( count.text() - 1 );
										}
										linkpar.find( ".todo-done" ).data( "done", 1 );
										infobox( "Todo Item #" + $(linkie).data("recid") + " Deleted" );
									} else {
										infobox( "Todo Item #" + $(linkie).data("recid") + " Delete Failed!" );
									}
									$(linkie).data( "done", 1 );
								}
							);
						},
						icon: "recycle"
					},
					"Cancel" : function () { return true; }
				}:{ "Cancel" : function () { return true; }})
			}); 
		}
	}); // END: Todo Menu
	
	$('.hours-clear').on('vclick', function (e) { // BEGIN: Clear Hours
		e.preventDefault();
		var linkie = this;
		if ( ! $(this).data('done') ) {
			$('<div>').popupwrapper({
				displayMode: 'button',
				headerText: 'CLEAR?',
				headerMinWidth: '350px',
				subTitle: 'Clear Hours For User #'+$(linkie).data('recid')+'?',
				buttons: { 
					'Yes, Clear' : function () {
						$.getJSON(baseHREF+"json/clear/base:hours/id:"+$(linkie).data('recid')+"/", function(data) {
							if ( data.success === true ) {
								$(linkie).parent().find('p:first').html('--Submitted--');
								$(linkie).parent().find('span.ui-li-count').html('-0-');
								infobox("Hours Cleared");
							} else {
								infobox("Hours Clear Failed!");
							}
							$(linkie).data('done', 1);
						}); },
					'Cancel' : {click: function () { return true; }, icon: 'delete' }
				}
			});
		}
	}); // END: Clear Hours
	
	$('.hours-mark').on('vclick', function (e) { // BEGIN: Mark Hours
		e.preventDefault();
		var linkie = this;
		if ( ! $(this).data('done') ) {
			$('<div>').popupwrapper({
				displayMode: 'button',
				headerText: 'MARK?',
				headerMinWidth: '350px',
				subTitle: 'Mark Hours Finished?',
				buttons: { 
					'Yes, Clear' : function () {
						$.getJSON(baseHREF+"json/mark/base:hours/id:"+$(linkie).data('recid')+"/", function(data) {
							if ( data.success === true ) {
								$(linkie).parent().find('.ui-btn-up-b').removeClass('ui-btn-up-b').addClass('ui-btn-up-c');
								$(linkie).parent().removeClass('ui-btn-up-b').addClass('ui-btn-up-c');
								$(linkie).parent().find('.pending').html('');
								infobox("Hours Marked");
							} else {
								infobox("Hours Mark Failed!");
							}
							$(linkie).data('done', 1);
						}); },
					'Cancel' : { click:function () { return true; }, icon: 'delete' }
				}
			});
		}
	}); // END: Mark Hours
	
	$(document).on("vclick", ".msg-delete", function (e) { // BEGIN: Delete Message
		e.preventDefault();
		var linkie = this;
		if ( ! $(this).data( "done" ) ) {
			$( "<div>" ).mdialog({
				useMenuMode: true,
				menuHeaderText: "DELETE!",
				menuMinWidth: "350px",
				menuSubtitle: "Delete Message #" + $(linkie).data( "recid" ) + "?",
				buttons: { 
					"Yes, Delete" : function () {
						$.getJSON(
							baseHREF + "json/delete/base:msg/id:" + $(linkie).data("recid") + "/",
							function(data) {
								if ( data.success === true ) {
									$(linkie).parent().find("h3").html("--Removed--");
									infobox(
										"Message #" + $(linkie).data("recid") + " Deleted",
										"Success"
									);
								} else {
									infobox(
										"Message #" + $(linkie).data("recid") + " Delete Failed!",
										"Error"
									);
								}
								$(linkie).data( "done", 1 );
							}
						); },
					"Cancel" : { 
						click: function () { return true; },
						icon: "delete"
					}
				}
			});
		}
	}); // END: Delete Message
	
	$(document).on("click", "#mailClear", function(e) { // BEGINv4: Message Clear
		$.mobile.loading("show");
		e.preventDefault();
		
		$.getJSON( baseHREF + "json/clear/base:msg/id:0", function(dta) {
			if ( dta.success === true ) {
				$.mobile.changePage(
					dta.location, 
					{ 
						reloadPage: true,
						type: "post",
						data: {"infobox": dta.msg},
						transition:"slide"
					}
				);
			} else {
				$.mobile.loading("hide");
				infobox( dta.msg, "Error" );
			}
		});
		
	}); // END: Message Clear
	
	$(document).on("vclick", ".show-menu", function (e) { // BEGINv4: Show Menu
		e.preventDefault();
		var linkie = this;
		if ( ! $(this).data( "done" ) ) {
			$("<div>").mdialog({
				useMenuMode: true,
				menuHeaderText: "SHOW",
				menuMinWidth: "350px",
				meunSubtitle: "Show #" + $(this).data( "recid" ),
				buttons : (($(this).data( "admin" ))?{
					"Edit" : {
						click : function() { 
							$.mobile.changePage(
								baseHREF + "shows/edit/id:" + $(linkie).data( "recid" ) + "/"
							);
						},
						icon : "edit",
						close: false
					},
					"Delete" : {
						click :function () {
							$.getJSON(
								baseHREF + "json/delete/base:show/id:" + $(linkie).data("recid") + "/",
								function(data) {
									if ( data.success === true ) {
										$(linkie).find( "h3" ).html( "--Deleted--" );
										infobox(
											"Show #" + $(linkie).data( "recid" ) + " Deleted",
											"Success"
										);
									} else {
										infobox(
											"Show #" + $(linkie).data( "recid" ) + " Delete Failed!",
											"Error"
										);
									}
									$(linkie).data( "done", 1 );
								}
							);
						},
						icon : "recycle"
					},
					"Cancel" : function () { return true; }
				}:{ "Cancel" : function () { return true; } } )
			});
		}
	}); // END: Show Menu
	
	$(document).on("vclick", ".budg-menu", function (e) { // BEGINv4: Budget Menu
		e.preventDefault();
		var linkie = this,
			linkpar = $(this).parent();
			
		if ( ! $(this).data( "done" ) ) {
			$("<div>").mdialog({
				useMenuMode: true,
				menuHeaderText: "BUDGET",
				menuMinWidth: "350px",
				menuSubtitle: "Budget Item #" + $(this).data( "recid" ),
				buttons : ( ( $(this).data( "edit") ) ? {
					"View Detail" : {
						click: function() {
							$.mobile.changePage(
								baseHREF + "budget/item/id:" + $(linkie).data( "recid" ) + "/" 
							);
						},
						icon: "action",
						close: false
					},
					"Edit" : {
						click: function() {
							$.mobile.changePage(
								baseHREF + "budget/edit/id:" + $(linkie).data( "recid" ) + "/"
							);
						},
						icon: "edit",
						close: false
					},
					"Delete" : {
						click: function() {
							$.getJSON(
								baseHREF + "json/delete/base:budget/id:" + $(linkie).data("recid") + "/",
								function(data) {
									if ( data.success === true ) {
										linkpar.find( "h3" ).html( "--Removed--" );
										linkpar.find( "span.ui-li-count" ).html( "deleted" );
										linkpar.find( ".todo-done" ).data( "done", 1 );
										infobox(
											"Budget Item #" + $(linkie).data( "recid") + " Deleted",
											"Success"
										);
									} else {
										infobox(
											"Budget Item #" + $(linkie).data("recid") + " Delete Failed!",
											"Error"
										);
									}
									$(linkie).data("done", 1);
							});
						},
						icon: "recycle"
					},
					"Cancel" : {
						icon: "delete",
						click: function () { return true; }
					}
				}:{
					"View" : {
						click: function() {
							$.mobile.changePage(
								baseHREF + "budget/view/id:" + $(linkie).data("recid") + "/"
							);
						},
						icon: "action",
						close: false
					},
					"Cancel" : {
						icon: "delete",
						click: function () { return true; }
					}
				})
			}); 
		}
	}); // END: Budget Menu
	
	// BEGIN : Recpt Functions
	$('.rcptrot').on('vclick', function (e) { 
		var self = this;
			date = new Date();
		
		$(self).removeClass('ui-btn-active');
		infobox("Reciept Rotating...");
		$.getJSON(baseHREF+"rcpt.php?imgid="+$(self).data('id')+"&rotate="+$(self).data('rot')+"&save", function(data) {
			if ( data.success === true ) {
				$('#rcptimg').attr('src', baseHREF+'rcpt.php?imgid='+$(self).data('id')+'&rand='+parseInt(date.getTime()/1000));
				infobox("Reciept Saved");
			} else {
				infobox("Reciept Save Failed :"+data.msg);
			}
		});
	}); // END Rcpt Func
	
	$(document).on("click", ".group-add", function(e) { // BEGINv4: Group Add
		e.preventDefault();
		var linkie = this;
		$("<div>").mdialog({
			useMenuMode: true,
			menuHeaderText: "NEW",
			menuMinWidth: "350px",
			menuSubtitle: "Add this group?",
			menuInputList: [{
				id: "newGRP",
				title: "Group Name",
				type: "text",
			}],
			buttons: {
				"Add" : {
					click : function(e,a) {
						newGROUP = a[1];
						if (newGROUP !== "") {
							$.mobile.loading("show");
							$.getJSON(
								baseHREF+"json/adm/base:admin/sub:savegroup/id:0/newname:" + newGROUP + "/",
								function(dta) {
									if ( dta.success === true ) {
										$.mobile.changePage(
											dta.location, 
											{
												reloadPage: true,
												transition: "pop",
												changeHash: "false",
												type: "post",
												data: {infobox: dta.msg}
											}
										);
									} else {
										$.mobile.loading("hide");
										infobox( "Add Failed: " + dta.msg );
									}
								}
							);
						}
					},
					icon : "plus",
					close: false
				},
				"Cancel" : {
					icon: "delete",
					click: function () { return true; }
				}
			}
		});
	}); // END : Group Add
	
	$(document).on("vclick", ".group-menu", function(e) {  // BEGIN: Group Menu
		e.preventDefault();
		var linkie = this;
		$("<div>").mdialog({
			useMenuMode: true,
			menuHeaderText: "GROUP",
			menuMinWidth: "350px",
			menuInputList: ( ( $(this).data('id') > 1 ) ?
				[{
					id: "grpNAME",
					title: "New Name",
					type: "text"
				}] :
				false
			),
			menuSubtitle: "Group #" + $(this).data( "id" ),
			buttons : ($(this).data("id") > 1 ) ? 
				{
					"Rename" : {
						click: function(e,a) {
							newNAME = a[1];
							if (newNAME !== "") {
								$.mobile.loading("show");
								$.getJSON(
									baseHREF + "json/adm/base:admin/sub:savegroup/id:" + $(linkie).data("id") + "/newname:" + newNAME + "/",
									function(dta) {
										if ( dta.success === true ) {
											$.mobile.changePage(
												dta.location, 
												{
													reloadPage: true,
													transition: "pop",
													changeHash: false,
													type: "post",
													data: {infobox: dta.msg}
												}
											);
										} else {
											$.mobile.loading("hide");
											infobox( "Rename Failed: " + dta.msg, "Error");
										}
									}
								);
							}
						},
						icon: "edit"
					},
					"Change Perms" : {
						click: function() { 
							$.mobile.changePage(
								baseHREF + "admin/permsedit/id:" + $(linkie).data("id") + "/"
							);
						},
						icon: "action",
						close: false
					},
					"Delete" : {
						click: function() {
							$.mobile.loading("show");
							$.getJSON(
								baseHREF + "json/adm/base:admin/sub:deletegroup/id:" + $(linkie).data("id") + "/",
								function(dta) {
									if ( dta.success === true ) {
										$.mobile.changePage(
											dta.location,
											{
												reloadPage: true,
												transition: "pop",
												changeHash: false,
												type: "post",
												data: {infobox: dta.msg}
											}
										);
									} else {
										$.mobile.loading("hide");
										infobox( "Delete Failed: " + dta.msg, "Error");
									}
								}
							);
						},
						icon: "recycle"
					},
					"Cancel" : {
						icon: "delete",
						click: function () { return true; }
					}
				} : {
					"Change Perms" : {
						click: function() { 
							$.mobile.changePage(
								baseHREF+"admin/permsedit/id:" + $(linkie).data("id") + "/"
							);
						},
						icon: "action"
					},
					"Cancel" : {
						icon: "delete",
						click: function () { return true; }
					}
				}
		}); 
	}); // END: Group Menu
	
	$(document).on("vclick", ".user-menu", function(e) {  // BEGINv4: User Menu
		e.preventDefault();
		var linkie = this;
		$("<div>").mdialog({
			useMenuMode: true,
			menuHeaderText: "USER",
			menuMinWidth: "350px",
			menuSubtitle: "User #" + $(this).data( "recid" ),
			buttons : {
				"Edit" : {
					icon : "edit",
					click : function() {
						$.mobile.changePage(
							baseHREF + "admin/useredit/id:" + $(linkie).data("recid") + "/"
						);
					},
					close: false
				},
				"Toggle Active" : {
					icon : "check",
					click : function() {
						$.getJSON(
							baseHREF + "json/adm/base:admin/sub:toggle/switch:active/id:" + $(linkie).data("recid") + "/",
							function(dta) {
								if ( dta.success === true ) {
									infobox(dta.msg);
									if ( dta.newval === 1 ) {
										$(linkie).find(".u-act")
											.attr("src", baseHREF + "images/perm-ya.png");
									} else {
										$(linkie).find(".u-act")
											.attr("src", baseHREF + "images/perm-no.png");
									}
								} else {
									infobox("Toggle Failed: " + dta.msg);
								}
							}
						);
					}
				},
				"Toggle On Payroll" : {
					icon : "check",
					click : function() {
						$.getJSON(
							baseHREF + "json/adm/base:admin/sub:toggle/switch:payroll/id:" + $(linkie).data("recid") + "/",
							function(dta) {
								if ( dta.success === true ) {
									infobox(dta.msg);
									if ( dta.newval === 1 ) {
										$(linkie).find(".u-pay")
											.attr("src", baseHREF + "images/perm-ya.png");
									} else {
										$(linkie).find(".u-pay")
											.attr("src", baseHREF + "images/perm-no.png");
									}
								} else {
									infobox("Toggle Failed: " + dta.msg);
								}
							}
						);
					}
				},
				"Toggle Only Own Hours": {
					icon : "check",
					click : function() {
						$.getJSON(
							baseHREF + "json/adm/base:admin/sub:toggle/switch:limithours/id:" + $(linkie).data("recid") + "/",
							function(dta) {
								if ( dta.success === true ) {
									infobox(dta.msg);
									if ( dta.newval === 1 ) {
										$(linkie).find(".u-own")
											.attr("src", baseHREF + "images/perm-ya.png");
									} else {
										$(linkie).find(".u-own")
											.attr("src", baseHREF + "images/perm-no.png");
									}
								} else {
									infobox( "Toggle Failed: " + dta.msg );
								}
							});
					}
				},
				"Toggle Notify" : {
					icon : "check",
					click : function() {
						$.getJSON(
							baseHREF + "json/adm/base:admin/sub:toggle/switch:notify/id:" + $(linkie).data( "recid") + "/",
							function(dta) {
								if ( dta.success === true ) {
									infobox(dta.msg);
									if ( dta.newval === 1 ) {
										$(linkie).find(".u-not")
											.attr("src", baseHREF + "images/perm-ya.png");
									} else {
										$(linkie).find(".u-not")
											.attr("src", baseHREF + "images/perm-no.png");
									}
								} else {
									infobox("Toggle Failed: "+dta.msg);
								}
							}
						);
					}
				},
				"Cancel" : { 
					icon: "delete",
					click: function() { return true; }
				}
			}
		});
	}); // End User Menu
	
	$(document).on("change", "select", function(e) { // BEGINv4: Add Dropdown Option
		var self = this;

		$(self).find(":selected").each(function() {
			if ( $(this).data("addoption") === true ) {
				$("<div>").mdialog({
					useMenuMode: true,
					menuHeaderText: "ADD",
					menuMinWidth: "350px",
					menuSubtitle: "Add new item...",
					menuInputList: [{
						id: "newOPT",
						title: "New Option",
						type: "text"
					}],
					buttons : {
						"Yes, Add" : function (e,a) { 
							thisopt = a[1];
							$("<option value='" + thisopt + "' selected='selected'>" + thisopt + "</option>").appendTo($(self));
							$(self).selectmenu("refresh");
							return true;
						},
						"Cancel" : { 
							icon: "delete",
							click: function () { return true; }
						}
					}
				});
			}
		});
	}); // END : Add Dropdown Option
	
}) ( jQuery );
