<?php
/**
 * TDTrac Header
 * 
 * Contains site header.
 * @package tdtrac
 * @version 2.0.0
 * @since 1.4.0
 * @author J.T.Sage <jtsage@gmail.com>
 */
/** Library: Help Text */
require_once("helpnodes.php");

/**
 * Master makePage Function
 * 
 * @param array Body Contents
 * @param string Page Title
 * @return void
 */
function makePage($body = '', $title = '') {
	if (!is_array($body) ) {
		$body = preg_split("/\n/", $body);
	}
	$html = makeHeader($title);
	foreach( $body as $fixme ) {
		$html[] = "\t\t\t{$fixme}";
	}
	$html = array_merge($html, makeFooter($title));
	ob_clean(); //Hackish method to clear any extra lines / echos before html starts
	foreach ($html as $line) {
		echo $line . "\n";
	}
}

/** 
 * Make page header
 * 
 * @param string Page Title
 * @global string Program Version
 * @global string Company Name
 * @global string Base HREF
 * @global object User object
 * @global array Link for Right Side of Header
 * @global bool Make back link say CANCEL
 * @global bool Make back link say CLOSE
 * @return array Formatted HTML
 */
function makeHeader($title = '') {
	GLOBAL $TDTRAC_VERSION, $TDTRAC_CPNY, $TDTRAC_SITE, $HEAD_LINK, $CANCEL, $CLOSE, $action;

	$html = array();
	$html[] = '<!DOCTYPE html>';
	$html[] = '<html lang="en">';
	$html[] = '<head>';
	$html[] = '	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />';
	$html[] = "	<title>TDTrac{$TDTRAC_CPNY}:v{$TDTRAC_VERSION} - {$title}</title>";
	$html[] = '	<!--[if lt IE 9]>';
	$html[] = '		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>';
	$html[] = '	<![endif]-->';
	$html[] = '	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.css" />';
	$html[] = '	<link type="text/css" href="http://dev.jtsage.com/cdn/datebox/latest/jquery.mobile.datebox.css" rel="stylesheet" /> ';
	$html[] = '	<link type="text/css" href="/css/tdtheme.css" rel="stylesheet" /> ';
	$html[] = '	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>';
	$html[] = '	<script type="text/javascript">';
	$html[] = "		$(document).bind('mobileinit', function(){ $.mobile.page.prototype.options.degradeInputs.date = 'text'; });";
	$html[] = '	</script>';
	$html[] = '	<script type="text/javascript" src="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.js"></script>';
	$html[] = '	<script type="text/javascript" src="http://dev.jtsage.com/cdn/datebox/latest/jquery.mobile.datebox.js"></script>';
	$html[] = '	<script type="text/javascript" src="'.$TDTRAC_SITE.'js/tdtrac.jquery.js"></script>';
	$html[] = "</head>\n\n<body>";
	$pageid = ( $action['module'] == 'help' ) ? "help-{$action['action']}-{$action['oper']}" : "{$action['module']}-{$action['action']}";
	$html[] = "	<div data-role=\"page\" data-theme=\"a\" data-id=\"{$pageid}\">";
	
	$html[] = "		<div data-role=\"header\">";
	if ( $CANCEL ) { $html[] = "			<a href='#' data-icon='delete' data-rel='back'>Cancel</a>";	}
	if ( $CLOSE )  { $html[] = "			<a href='#' data-icon='arrow-d' data-rel='back'>Close</a>";	}
	$html[] = "			<h1>TDTrac::{$title}</h1>";
	if ( count($HEAD_LINK) == 3 ) {
		$html[] = "			<a href=\"{$HEAD_LINK[0]}\" data-icon=\"{$HEAD_LINK[1]}\" class=\"ui-btn-right\">{$HEAD_LINK[2]}</a>";
	}
	$html[] = "		</div><div id='infobox' data-backbtn='false' data-role='header' data-theme='d'><h2>".(($_SEVER['REQUEST_METHOD'] = "POST" && isset($_REQUEST['infobox']))?$_REQUEST['infobox']:"&nbsp;")."</h2></div>";
	if ( $_SEVER['REQUEST_METHOD'] = "POST" && isset($_REQUEST['infobox']) ) {
		$html[] = "		<script type='text/javascript'>setTimeout(\"$('.ui-page-active #infobox h2').fadeTo(300, .01, function() { $(this).html('&nbsp;').fadeTo(1000,1); });\", 9000);</script>";
	}
	unset($_SESSION['infodata']);
	
	$html[] = "		<div data-role=\"content\" data-theme=\"c\">";
	
	return $html;
}

/**
 * Make page footer
 * 
 * @param string Page Title
 * @global array Dashboard block as appropriate
 * @global array Parsed Query String
 * @global array Help Text
 * @return array Formatted HTML
 */
function makeFooter($title = '') {
	global $SITE_BLOCK, $action;
	$html[] = "		</div>";
	$html[] = "		<div data-role=\"footer\" data-theme=\"a\">";
	$html[] = "			<div data-role=\"navbar\"><ul>";
	$html[] = "				<li><a href=\"/\" data-direction='reverse' data-icon=\"home\">Home</a></li>";
	$html[] = "				<li><a href=\"/help/{$action['module']}/oper:{$action['action']}/\" data-transition=\"slideup\" data-icon=\"info\">Help</a></li>";
	$html[] = "				<li><a href=\"/user/logout/\" rel='external' data-transition=\"slidedown\" data-icon=\"alert\">Logout</a></li>";
	$html[] = "			</ul></div>";
	$html[] = "			<h3>&copy; 2008-".date('Y')." JTSage. All rights reserved. <a href=\"http://tdtrac.com/\" title=\"TDTrac Homepage\">TDTrac Homepage</a></h3>";
	$html[] = "		</div>\n\t</div>";
	$html[] = "\n</body>\n</html>";
	return $html;
}
?>
