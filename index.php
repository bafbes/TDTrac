<?php
/**
 * TDTrac Main Program
 * 
 * Contains main program logic.
 * @package tdtrac
 * @version 2.0.0
 * @author J.T.Sage <jtsage@gmail.com>
 */
ob_start(); session_start(); 

## PROGRAM DETAILS. DO NOT EDIT UNLESS YOU KNOW WHAT YOU ARE DOING
$TDTRAC_VERSION = "2.0.0";
$TDTRAC_DBVER = "1.3.1";
$SITE_SCRIPT = array('');

/** Site Confiuration File */
require_once("config.php");
/** Function, Library and Module loader */
require_once("lib/functions-load.php");

if ( !file_exists(".htaccess") ) { $TDTRAC_SITE .= "index.php?action="; }

$user = new tdtrac_user();

$rawaction = preg_split("/\//", $_REQUEST['action']);

if ( !isset($rawaction[0]) || $rawaction[0] == "" ) {
	$action['module'] = 'index';
} else { 
	$action['module'] = $rawaction[0];
}
if ( !isset($rawaction[1]) || preg_match("/:/", $rawaction[1]) || $rawaction[1] == "" ) {
	$action['action'] = 'index';
} else {
	$action['action'] = $rawaction[1];
}
foreach ( $rawaction as $maybevar ) {
	if ( preg_match("/:/", $maybevar) ) {
		$goodvar = preg_split("/:/", $maybevar);
		$action[$goodvar[0]] = $goodvar[1];
	}
}

if ( !$user->loggedin ) {
	switch( $action['action'] ) {
		case "login":
			$user->login();
			break;
		case "forgot":
			if ( $_SERVER['REQUEST_METHOD'] == "POST" ) {
				email_pwsend();
			} else {
				makePage($user->password_form(), 'Forgotten Password');
			} break;
		default:
			makePage($user->login_form(), 'Please Login');
			break;
	}
} else {
	switch ($action['module']) {
		case "user":
			switch( $action['action'] ) {
				case "logout":
					$user->logout();
					thrower("User Logged Out", '');
				case "password":
					if ( $user->username == "guest" ) { thrower("You Cannot Change Your Password"); }
					if ( $_SERVER['REQUEST_METHOD'] == "POST" ) {
						$user->changepass();
					} else {
						makePage($user->changepass_form(), 'Change Password');
					} break;
				default:
					thrower(false, ''); 
			}
		case "todo":
			$todo = new tdtrac_todo($user, $action);
			$todo->output();
			break;
		case "shows":
			$shows = new tdtrac_shows($user, $action);
			$shows->output();
			break;
		case "hours":
			$hours = new tdtrac_hours($user, $action);
			$hours->output();
			break;
		case "mail":
			$mail = new tdtrac_mail($user, $action);
			$mail->output();
			break;
		case "admin":
			$admin = new tdtrac_admin($user, $action);
			$admin->output();
			break;
		case "budget":
			$budget = new tdtrac_budget($user, $action);
			$budget->output();
			break;
		default: 
			$html[] = mail_check();
			$html[] = reciept_check();
			$html[] = todo_check();
			$html[] = "<br /><br /><div style=\"float: left; min-height: 400px; width: 48%\">";
			// Budget & Payroll
			$budg = new tdtrac_budget($user, $action);
			$hour = new tdtrac_hours($user, $action);
			$html = array_merge($html, $budg->index(), $hour->index());
			
			$html[] = "<br /><br /><br /><br /><br /><br /></div><div style=\"width: 48%; float: right;\">";
			// Shows, Todo & Admin
			$show = new tdtrac_shows($user, $action);
			$todo = new tdtrac_todo($user, $action);
			$admn = new tdtrac_admin($user, $action);
			
			$html = array_merge($html, $show->index(), $todo->index(), $admn->index());
			
			$html[] = "</div>";
			makePage($html, 'TD Tracking Made Easy');
			break;
	}
}
?>
