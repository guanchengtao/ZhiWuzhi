<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Replace All Textarea Elements &mdash; CKeditor Sample</title>
	<meta content="text/html; charset=utf-8" http-equiv="content-type"/>
	<link href="../sample.css" rel="stylesheet" type="text/css"/>
</head>
<body>
	<h1 class="samples">
		CKeditor Sample &mdash; Replace All Textarea Elements Using PHP Code
	</h1>
	<div class="description">
	<p>
		This sample shows how to replace all <code>&lt;textarea&gt;</code> elements
		with CKeditor by using PHP code.
	</p>
	<p>
		To replace all <code>&lt;textarea&gt;</code> elements, place the following call at any point
		after the last <code>&lt;textarea&gt;</code> element:
	</p>
	<pre class="samples">
&lt;?php
// Include the CKeditor class.
include("cKeditor/cKeditor.php");

// Create a class instance.
$CKeditor = new CKeditor();

// Path to the CKeditor directory.
$CKeditor->basePath = '/cKeditor/';

// Replace all textarea elements with CKeditor.
$CKeditor->replaceAll();
?&gt;</pre>
	</div>
	<!-- This <div> holds alert messages to be displayed in the sample page. -->
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
			<label for="editor2">
				Editor 2:</label>
			<textarea cols="80" id="editor2" name="editor2" rows="10">&lt;p&gt;This is some &lt;strong&gt;sample text&lt;/strong&gt;. You are using &lt;a href="http://cKeditor.com/"&gt;CKeditor&lt;/a&gt;.&lt;/p&gt;</textarea>
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
	include("../../cKeditor.php");
	// Create a class instance.
	$CKeditor = new CKeditor();
	// Path to the CKeditor directory, ideally use an absolute path instead of a relative dir.
	//   $CKeditor->basePath = '/cKeditor/'
	// If not set, CKeditor will try to detect the correct path.
	$CKeditor->basePath = '../../';
	// Replace all textarea elements with CKeditor.
	$CKeditor->replaceAll();
	?>
</body>
</html>
