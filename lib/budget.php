<?php
function budget_addform() {
	GLOBAL $db, $MYSQL_PREFIX, $TDTRAC_SITE;
	$html  = "<h2>Add Budget Expense</h2>\n";
	$html .= "<div id=\"genform\"><form method=\"post\" action=\"{$TDTRAC_SITE}add-budget\" name=\"form1\">\n";
	$html .= "<div class=\"frmele\" title=\"Show to charge against\">Show: <select tabindex=\"1\" style=\"width: 25em;\" name=\"showid\">\n";
	$sql = "SELECT showname, showid FROM {$MYSQL_PREFIX}shows WHERE closed = 0 ORDER BY created DESC;";
	$result = mysql_query($sql, $db);
	while ( $row = mysql_fetch_array($result) ) {
		$html .= "<option value=\"{$row['showid']}\">{$row['showname']}</option>\n";
	}
	$html .= "</select></div>";
	$html .= "<div class=\"frmele\" title=\"Date of charge\">Date: <input type=\"text\" size=\"22\" name=\"date\" id=\"date\" style=\"margin-right: 2px\" />\n";
        $html .= "<a href=\"#\" onClick=\"tdt_show_calendar(".(date(n)-1).",".date(Y).",'pickcal','date')\">[cal]</a>\n";
        $html .= " <a href=\"#\" onClick=\"document.forms['form1'].date.value='".date("Y-m-d")."'\">[today]</a></div>\n";
        $html .= "<div class=\"frmele\" id=\"pickcal\"></div>\n";


	$html .= "<div class=\"frmele\" title=\"New Vendor for charge, or select below\">New Vendor: <input type=\"text\" size=\"35\" name=\"vendornew\" /></div>\n";
	$html .= "<div class=\"frmele\" title=\"Exisiting Vendor for charge (Takes Presedence)\">Old Vendor: <select style=\"width: 25em\" name=\"vendor\" />\n";
	$html .= "<option value=\"--NEW--\">^--NEW</option>\n";
        $sql = "SELECT vendor FROM `{$MYSQL_PREFIX}budget` GROUP BY vendor ORDER BY COUNT(vendor) DESC, vendor ASC";
        $result = mysql_query($sql, $db);
        while ( $row = mysql_fetch_array($result) ) {
                $html .= "<option value=\"{$row['vendor']}\">{$row['vendor']}</option>\n";
        }
	$html .= "</select></div>\n";
        $html .= "<div class=\"frmele\" title=\"New Category for charge, or select below\">New Category: <input type=\"text\" size=\"35\" name=\"categorynew\" /></div>\n";
        $html .= "<div class=\"frmele\" title=\"Exisiting Category for charge (Takes Presedence)\">Old Category: <select style=\"width: 25em\" name=\"category\" />\n";
        $html .= "<option value=\"--NEW--\">^--NEW</option>\n";
        $sql = "SELECT category FROM `{$MYSQL_PREFIX}budget` GROUP BY category ORDER BY COUNT(category) DESC, category ASC";
        $result = mysql_query($sql, $db);
        while ( $row = mysql_fetch_array($result) ) {
                $html .= "<option value=\"{$row['category']}\">{$row['category']}</option>\n";
        }
        $html .= "</select></div>\n";
	$html .= "<div class=\"frmele\" title=\"Description of charge\">Description: <input type=\"text\" size=\"35\" name=\"dscr\" /></div>\n";
	$html .= "<div class=\"frmele\" title=\"Amount of charge, without dollar sign\">Price: $<input type=\"text\" size=\"34\" name=\"price\" /></div>\n";
	$html .= "<div class=\"frmele\" title=\"Amount of tax, if paid, without dollar sign\">Tax: $<input type=\"text\" size=\"34\" name=\"tax\" /></div>\n";
        $html .= "<div class=\"frmele\">Pending Payment: <input type=\"checkbox\" name=\"pending\" value=\"y\"/></div>";
        $html .= "<div class=\"frmele\">Reimbursable Charge: <input type=\"checkbox\" name=\"needrepay\" value=\"y\"/></div>";
        $html .= "<div class=\"frmele\">Reimbursment Recieved: <input type=\"checkbox\" name=\"gotrepay\" value=\"y\"/></div>";
	$html .= "<div class=\"frmele\"><input type=\"submit\" value=\"Add Expense\" /></div></form></div>\n";
	return $html;
}

function budget_editform($id) {
	GLOBAL $db, $MYSQL_PREFIX, $TDTRAC_SITE;
	$html  = "<h2>Edit Budget Expense</h2>\n";
	$html .= "<div id=\"genform\"><form method=\"post\" action=\"{$TDTRAC_SITE}edit-budget\" name=\"form1\">\n";
	$html .= "<div class=\"frmele\">Show: <select tabindex=\"1\" style=\"width: 25em;\" name=\"showid\">\n";
	$sql = "SELECT showname, {$MYSQL_PREFIX}budget.* FROM {$MYSQL_PREFIX}shows, {$MYSQL_PREFIX}budget WHERE {$MYSQL_PREFIX}budget.id = {$id} AND {$MYSQL_PREFIX}budget.showid = {$MYSQL_PREFIX}shows.showid LIMIT 1;";
	$result = mysql_query($sql, $db);
	$row = mysql_fetch_array($result);
	$html .= "<option value=\"{$row['showid']}\">{$row['showname']}</option>\n";
	$html .= "</select></div>";
	$html .= "<div class=\"frmele\">Date: <input type=\"text\" size=\"18\" name=\"date\" id=\"date\" style=\"margin-right: 2px\" value=\"{$row['date']}\" />\n";
        $html .= "<a href=\"#\" onClick=\"tdt_show_calendar(".(date(n)-1).",".date(Y).",'pickcal','date')\">[calendar popup]</a></div>\n";
        $html .= "<div class=\"frmele\" id=\"pickcal\"></div>\n";


	$html .= "<div class=\"frmele\">New Vendor: <input type=\"text\" size=\"35\" name=\"vendornew\" value=\"{$row['vendor']}\"/></div>\n";
	$html .= "<div class=\"frmele\">Old Vendor: <select style=\"width: 25em\" name=\"vendor\" />\n";
	$html .= "<option value=\"--NEW--\">^--NEW</option>\n";
        $sql = "SELECT vendor FROM `{$MYSQL_PREFIX}budget` GROUP BY vendor ORDER BY COUNT(vendor) DESC, vendor ASC";
        $result2 = mysql_query($sql, $db);
        while ( $row2 = mysql_fetch_array($result2) ) {
                $html .= "<option value=\"{$row2['vendor']}\">{$row2['vendor']}</option>\n";
        }
	$html .= "</select></div>\n";
        $html .= "<div class=\"frmele\">New Category: <input type=\"text\" size=\"35\" name=\"categorynew\" value=\"{$row['category']}\"/></div>\n";
        $html .= "<div class=\"frmele\">Old Category: <select style=\"width: 25em\" name=\"category\" />\n";
        $html .= "<option value=\"--NEW--\">^--NEW</option>\n";
        $sql = "SELECT category FROM `{$MYSQL_PREFIX}budget` GROUP BY category ORDER BY COUNT(category) DESC, category ASC";
        $result2 = mysql_query($sql, $db);
        while ( $row2 = mysql_fetch_array($result2) ) {
                $html .= "<option value=\"{$row2['category']}\">{$row2['category']}</option>\n";
        }
        $html .= "</select></div>\n";
	$html .= "<div class=\"frmele\">Description: <input type=\"text\" size=\"35\" name=\"dscr\" value=\"{$row['dscr']}\" /></div>\n";
	$html .= "<div class=\"frmele\">Price: $<input type=\"text\" size=\"34\" name=\"price\" value=\"{$row['price']}\" /></div>\n";
	$html .= "<div class=\"frmele\">Tax: $<input type=\"text\" size=\"34\" name=\"tax\" value=\"{$row['tax']}\" /></div>\n";
        $html .= "<div class=\"frmele\">Pending Payment: <input type=\"checkbox\" name=\"pending\" value=\"y\" ".(($row['pending'] == 1) ? "checked=\"checked\"" : "")."/></div>";
        $html .= "<div class=\"frmele\">Reimbursable Charge: <input type=\"checkbox\" name=\"needrepay\" value=\"y\" ".(($row['needrepay'] == 1) ? "checked=\"checked\"" : "")."/></div>";
        $html .= "<div class=\"frmele\">Reimbursment Recieved: <input type=\"checkbox\" name=\"gotrepay\" value=\"y\" ".(($row['gotrepay'] == 1) ? "checked=\"checked\"" : "")."/></div>";
	$html .= "<input type=\"hidden\" name=\"id\" value=\"{$id}\" />\n";
	$html .= "<div class=\"frmele\"><input type=\"submit\" value=\"Commit\" /></div></form></div>\n";
	return $html;
}

function budget_delform($id) {
	GLOBAL $db, $MYSQL_PREFIX, $TDTRAC_SITE;
	$html  = "<h2>Remove Budget Expense</h2>\n";
	$html .= "<div id=\"genform\"><form method=\"post\" action=\"{$TDTRAC_SITE}del-budget\" name=\"form1\">\n";
	$html .= "<div class=\"frmele\">Show: <select tabindex=\"1\" style=\"width: 25em;\" name=\"showid\" disabled=\"disabled\" >\n";
	$sql = "SELECT showname, {$MYSQL_PREFIX}budget.* FROM {$MYSQL_PREFIX}shows, {$MYSQL_PREFIX}budget WHERE {$MYSQL_PREFIX}budget.id = {$id} AND {$MYSQL_PREFIX}budget.showid = {$MYSQL_PREFIX}shows.showid LIMIT 1;";
	$result = mysql_query($sql, $db);
	$row = mysql_fetch_array($result);
	$html .= "<option value=\"{$row['showid']}\">{$row['showname']}</option>\n";
	$html .= "</select></div>";
	$html .= "<div class=\"frmele\">Date: <input type=\"text\" size=\"18\" name=\"date\" id=\"date\" style=\"margin-right: 2px\" value=\"{$row['date']}\" disabled=\"disabled\" />\n";
	$html .= "<a href=\"#\">[calendar popup]</a></div>\n";
	$html .= "<div class=\"frmele\">Vendor: <input type=\"text\" size=\"35\" name=\"vendornew\" value=\"{$row['vendor']}\" disabled=\"disabled\" /></div>\n";
	$html .= "<div class=\"frmele\">Category: <input type=\"text\" size=\"35\" name=\"categorynew\" value=\"{$row['category']}\" disabled=\"disabled\" /></div>\n";
	$html .= "<div class=\"frmele\">Description: <input type=\"text\" size=\"35\" name=\"dscr\" value=\"{$row['dscr']}\" disabled=\"disabled\" /></div>\n";
	$html .= "<div class=\"frmele\">Price: $<input type=\"text\" size=\"34\" name=\"price\" value=\"{$row['price']}\" disabled=\"disabled\" /></div>\n";
	$html .= "<div class=\"frmele\">Tax: $<input type=\"text\" size=\"34\" name=\"tax\" value=\"{$row['tax']}\" disabled=\"disabled\" /></div>\n";
        $html .= "<div class=\"frmele\">Pending Payment: <input type=\"checkbox\" name=\"pending\" value=\"y\" ".(($row['pending'] == 1) ? "checked=\"checked\"" : "")." disabled=\"disabled\"/></div>";
        $html .= "<div class=\"frmele\">Reimbursable Charge: <input type=\"checkbox\" name=\"needrepay\" value=\"y\" ".(($row['needrepay'] == 1) ? "checked=\"checked\"" : "")." disabled=\"disabled\"/></div>";
        $html .= "<div class=\"frmele\">Reimbursment Recieved: <input type=\"checkbox\" name=\"gotrepay\" value=\"y\" ".(($row['gotrepay'] == 1) ? "checked=\"checked\"" : "")." disabled=\"disabled\"/></div>";
	$html .= "<input type=\"hidden\" name=\"id\" value=\"{$id}\" />\n";
	$html .= "<div class=\"frmele\"><input type=\"submit\" value=\"Confirm Delete\" /></div></form></div>\n";
	return $html;
}

function budget_add() {
	GLOBAL $db, $MYSQL_PREFIX;
	$taxxed = ( $_REQUEST['tax'] > 0 ) ? $_REQUEST['tax'] : 0;
	$sql  = "INSERT INTO {$MYSQL_PREFIX}budget ( showid, price, tax, vendor, category, dscr, date, pending, needrepay, gotrepay ) VALUES ( {$_REQUEST['showid']} , '{$_REQUEST['price']}' , '{$taxxed}' , ";
        if ( ($_REQUEST['vendor'] == "--NEW--") && !($_REQUEST['vendornew'] == "") ) {
		$sql .= "'{$_REQUEST['vendornew']}' , ";
	} else { $sql .= "'{$_REQUEST['vendor']}' , "; }
        if ( ($_REQUEST['category'] == "--NEW--") && !($_REQUEST['categorynew'] == "") ) {
                $sql .= "'{$_REQUEST['categorynew']}' , ";
        } else { $sql .= "'{$_REQUEST['category']}' , "; }
	$sql .= "'{$_REQUEST['dscr']}' , '{$_REQUEST['date']}' , ".(($_REQUEST['pending'] == "y") ? "1" : "0")." , ".(($_REQUEST['needrepay'] == "y") ? "1" : "0")." , ".(($_REQUEST['gotrepay'] == "y") ? "1" : "0")." )";
	$result = mysql_query($sql, $db);
	thrower("Expense Added");
}

function budget_edit_do($id) {
	GLOBAL $db, $MYSQL_PREFIX;
	$sql  = "UPDATE {$MYSQL_PREFIX}budget SET price = '{$_REQUEST['price']}' , tax = '{$_REQUEST['tax']}' , vendor = ";
        if ( ($_REQUEST['vendor'] == "--NEW--") && !($_REQUEST['vendornew'] == "") ) {
                $sql .= "'{$_REQUEST['vendornew']}' , ";
        } else { $sql .= "'{$_REQUEST['vendor']}' , "; }
	$sql .= "category =";
        if ( ($_REQUEST['category'] == "--NEW--") && !($_REQUEST['categorynew'] == "") ) {
                $sql .= "'{$_REQUEST['categorynew']}' , ";
        } else { $sql .= "'{$_REQUEST['category']}' , "; }
        $sql .= "dscr = '{$_REQUEST['dscr']}' , date = '{$_REQUEST['date']}'";
        $sql .= " , pending = ".(($_REQUEST['pending'] == "y") ? "1" : "0");
        $sql .= " , needrepay = ".(($_REQUEST['needrepay'] == "y") ? "1" : "0");
        $sql .= " , gotrepay = ".(($_REQUEST['gotrepay'] == "y") ? "1" : "0");
        $sql .= " WHERE id = {$id}";
	$result = mysql_query($sql, $db);
	thrower("Expense #{$id} Updated");
}

function budget_del_do($id) {
	GLOBAL $db, $MYSQL_PREFIX;
	$sql = "DELETE FROM {$MYSQL_PREFIX}budget WHERE id = {$id}";
	$result = mysql_query($sql, $db);
	thrower("Expense #{$id} Removed");
}

function budget_viewselect() {
	GLOBAL $db, $MYSQL_PREFIX, $TDTRAC_SITE;
	$sql = "SELECT showid, showname FROM {$MYSQL_PREFIX}shows ORDER BY created DESC";
	$result = mysql_query($sql, $db);
	$html  = "<h2>View Budget</h2>";
	$html .= "<div id=\"genform\"><form method=\"post\" action=\"{$TDTRAC_SITE}view-budget\">\n";
	$html .= "<div class=\"frmele\"><select style=\"width: 25em\" name=\"showid\">\n";
	while ( $row = mysql_fetch_array($result) ) {
		$html .= "<option value=\"{$row['showid']}\">{$row['showname']}</option>\n";
	}
	$html .= "</select></div>\n";
	$html .= "<div class=\"frmele\"><input type=\"submit\" value=\"View Selected\" /></div></form></div>\n";
	return $html;
}
function budget_view_special($onlytype) {
        GLOBAL $db, $MYSQL_PREFIX;
        $sql = "SELECT showid FROM {$MYSQL_PREFIX}shows WHERE closed = 0 ORDER BY showid DESC";
        $rest = mysql_query($sql, $db);
        $newhtml = "";
        if ( $onlytype == 1 ) { $newhtml .= "<h2>Pending Payment Budget Items</h2>\n"; }
        if ( $onlytype == 2 ) { $newhtml .= "<h2>All Reimbursment Budget Items</h2>\n"; }
        if ( $onlytype == 3 ) { $newhtml .= "<h2>Reimbursment Paid Budget Items</h2>\n"; }
        if ( $onlytype == 4 ) { $newhtml .= "<h2>Reimbursment UNPaid Budget Items</h2>\n"; }
        while ( $row = mysql_fetch_array($rest) ) {
                $newhtml .= budget_view($row['showid'], $onlytype);
        }
        return $newhtml;
}

function budget_view($showid, $onlytype) {
	GLOBAL $db, $user_name, $MYSQL_PREFIX, $TDTRAC_DAYRATE, $TDTRAC_PAYRATE, $TDTRAC_SITE;
        if ( $onlytype == 0 ) { $sqlwhere = ""; }
        if ( $onlytype == 1 ) { $sqlwhere = " AND pending = 1"; }
        if ( $onlytype == 2 ) { $sqlwhere = " AND needrepay = 1"; }
        if ( $onlytype == 3 ) { $sqlwhere = " AND gotrepay = 1"; }
        if ( $onlytype == 4 ) { $sqlwhere = " AND needrepay = 1 AND gotrepay = 0"; }
        $sql = "SELECT * FROM {$MYSQL_PREFIX}shows WHERE showid = {$showid}";
        $editshow = perms_checkperm($user_name, "editshow");
	$editbudget = perms_checkperm($user_name, "editbudget"); 
        $result = mysql_query($sql, $db); 
        $html = "";
        $row = mysql_fetch_array($result);
        $html .= "<h2>{$row['showname']}</h2><p><ul>\n";
        $html .= $editshow ? "<div style=\"float: right\">[<a href=\"{$TDTRAC_SITE}edit-show&id={$row['showid']}\">Edit</a>]</div>\n" : "";
        $html .= "<li><strong>Company</strong>: {$row['company']}</li>\n";
        $html .= "<li><strong>Venue</strong>: {$row['venue']}</li>\n";
        $html .= "<li><strong>Dates</strong>: {$row['dates']}</li>\n";
        $html .= "</ul></p>\n";

	$sql = "SELECT * FROM {$MYSQL_PREFIX}budget WHERE showid = {$showid}{$sqlwhere} ORDER BY category ASC, date ASC, vendor ASC";
	$result = mysql_query($sql, $db); $intr = 0; $tot = 0; $tottax = 0;
        if ( mysql_num_rows($result) < 1 ) { return $html; }
        if ( $onlytype == 0 ) {
        	$html .= "<h2>Materials Expenses</h2><br />";
                $html .= "<div style=\"float: right\">[<a href=\"{$TDTRAC_SITE}email-budget&id={$row['showid']}\">E-Mail To Self</a>]</div>\n";
        }
        $html .= "<table id=\"budget\">\n";
	$html .= "<tr><th>Date</th><th>Vendor</th><th>Category</th><th>Description</th><th>Price</th><th>Tax</th>";
	$html .= "<th>Pending</th><th>Reimpurse</th>\n";
	$html .= $editbudget ? "<th>Edit</th>" : "";
	$html .= $editbudget ? "<th>Del</th>" : "";
        $html .= "</tr>\n";
	$last = "";
	while ( $row = mysql_fetch_array($result) ) {
		if ( $last != "" && $last != $row['category'] ) {
			$html .= "<tr style=\"background-color: #DDCCDD\"><td></td><td></td><td>{$last}</td><td style=\"text-align: center\">-=- SUB-TOTAL -=-</td><td style=\"text-align: right\">$" . number_format($subtot, 2) . "</td><td style=\"text-align: right\">$".number_format($subtax,2)."</td></tr>\n"; $subtot = 0; $subtax = 0;
		} 
		$intr++;
		$html .= "<tr".((($intr % 2) == 0 ) ? " class=\"odd\"" : "")."><td>{$row['date']}</td><td>{$row['vendor']}</td><td>{$row['category']}</td><td>{$row['dscr']}</td><td style=\"text-align: right\">$";
                $tottax += $row['tax']; $subtax += $row['tax'];
                $tot += $row['price']; $subtot += $row['price'];
		$html .= number_format($row['price'], 2);
		$html .= "</td><td style=\"text-align: right\">$";
                $html .= number_format($row['tax'], 2);
                $html .= "</td><td style=\"text-align: center\">" . (($row['pending'] == 1) ? "YES" : "NO") . "</td>";
                $html .= "<td style=\"text-align: center\">" . (($row['needrepay'] == 1) ? (($row['gotrepay'] == 1) ? "PAID" : "UNPAID") : "N/A") . "</td>";
		$html .= $editbudget ? "<td style=\"text-align: center\"><a href=\"{$TDTRAC_SITE}edit-budget&id={$row['id']}\">[-]</a></td>" : "";
		$html .= $editbudget ? "<td style=\"text-align: center\"><a href=\"{$TDTRAC_SITE}del-budget&id={$row['id']}\">[x]</a></td>" : "";
		$html .= "</tr>\n";
		$last = $row['category'];
	}
	$html .= "<tr style=\"background-color: #DDCCDD\"><td></td><td></td><td>{$last}</td><td style=\"text-align: center\">-=- SUB-TOTAL -=-</td><td style=\"text-align: right\">$" . number_format($subtot, 2) . "</td><td style=\"text-align: right\">$".number_format($subtax,2)."</td></tr>\n";
	$html .= "<tr style=\"background-color: #FFCCFF\"><td></td><td></td><td></td><td style=\"text-align: center\">-=- TOTAL -=-</td><td style=\"text-align: right\">$" . number_format($tot, 2) . "</td><td style=\"text-align: right\">$".number_format($tottax,2)."</td></tr>\n";
	$html .= "</table>\n";
        if ( $onlytype > 0 ) { return $html; }
	$html .= "<h2>Payroll Expenses</h2><table id=\"budget\">\n";
	$html .= "<tr><th>Employee</th><th>".(($TDTRAC_DAYRATE)?"Days":"Hours")." Worked</th><th>Price</th></tr>\n";
	$sql = "SELECT SUM(worked) as days, payrate, CONCAT(first, ' ', last) as name FROM {$MYSQL_PREFIX}users u, {$MYSQL_PREFIX}hours h WHERE u.userid = h.userid AND h.showid = {$showid} GROUP BY h.userid ORDER BY last ASC";
	$result = mysql_query($sql, $db);
	$tot = 0; $intr = 0; $mtot = 0;
	while ( $row = mysql_fetch_array($result) ) {
		$intr++;
		$tot += $row['days'];
		$mtot += $row['days'] * $row['payrate'];
		$html .= "<tr".((($intr % 2) == 0 ) ? " class=\"odd\"" : "")."><td>{$row['name']}</td><td>{$row['days']}</td><td style=\"text-align: right\">$" . number_format($row['days'] * $row['payrate'], 2) . "</td></tr>\n";
	}
	$html .= "<tr style=\"background-color: #FFCCFF\"><td></td><td>{$tot}</td><td style=\"text-align: right\">$" . number_format($mtot, 2) . "</td></tr>\n";
	$html .= "</table>\n";
        return $html;

}

?>
