<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Replace Selected Textarea Elements &mdash; CKeditor Sample</title>
	<meta content="text/html; charset=utf-8" http-equiv="content-type"/>
	<link href="../sample.css" rel="stylesheet" type="text/css"/>
</head>
<body>
	<h1 class="samples">
		CKeditor Sample &mdash;  Replace Selected Textarea Elements Using PHP Code
	</h1>
	<div class="description">
	<p>
		This sample shows how to replace a selected <code>&lt;textarea&gt;</code> element
		with a CKeditor instance by using PHP code.
	</p>
	<p>
		To replace a <code>&lt;textarea&gt;</code> element, place the following call at any point
		after the <code>&lt;textarea&gt;</code> element:
	</p>
	<pre class="samples">
&lt;?php
// Include the CKeditor class.
include_once "cKeditor/cKeditor.php";

// Create a class instance.
$CKeditor = new CKeditor();

// Path to the CKeditor directory.
$CKeditor->basePath = '/cKeditor/';

// Replace a textarea element with an id (or name) of "textarea_id".
$CKeditor->replace("textarea_id");
?&gt;</pre>
	<p>
		Note that <code><em>textarea_id</em></code> in the code above is the <code>id</code> attribute of
		the <code>&lt;textarea&gt;</code> element to be replaced.
	</p>
	</div>
	<!-- This <div> holds alert messages to be display in the sample page. -->
	<div id="alerts">
		<noscript>
			<p>
				<strong>CKeditor requires JavaScript to run</strong>. In a browser with no JavaScript
				support, liKe yours, you should still see the contents (HTML data) and you should
				be able to edit it normally, without a rich editor interface.
			</p>
		</noscript>
	</div>
	<form action="../sample_posteddata.php" method="post">
		<p>
			<label for="editor1">
				Editor 1:</label>
			<textarea cols="80" id="editor1" name="editor1" rows="10">&lt;p&gt;This is some &lt;strong&gt;sample text&lt;/strong&gt;. You are using &lt;a href="http://cKeditor.com/"&gt;CKeditor&lt;/a&gt;.&lt;/p&gt;</textarea>
		</p>
		<p>
			<input type="submit" value="Submit"/>
		</p>
	</form>
	<div id="footer">
		<hr />
		<p>
			CKeditor - The text editor for the Internet - <a class="samples" href="http://cKeditor.com/">http://cKeditor.com</a>
		</p>
		<p id="copy">
			Copyright &copy; 2003-2011, <a class="samples" href="http://cksource.com/">CKSource</a> - Frederico
			Knabben. All rights reserved.
		</p>
	</div>
	<?php
	// Include the CKeditor class.
	include_once "../../cKeditor.php";
	// Create a class instance.
	$CKeditor = new CKeditor();
	// Path to the CKeditor directory, ideally use an absolute path instead of a relative dir.
	//   $CKeditor->basePath = '/cKeditor/'
	// If not set, CKeditor will try to detect the correct path.
	$CKeditor->basePath = '../../';
	// Replace a textarea element with an id (or name) of "editor1".
	$CKeditor->replace("editor1");
	?>
</body>
</html>
