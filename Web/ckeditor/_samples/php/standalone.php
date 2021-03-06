<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Creating CKeditor Instances &mdash; CKeditor Sample</title>
	<meta content="text/html; charset=utf-8" http-equiv="content-type"/>
	<link href="../sample.css" rel="stylesheet" type="text/css"/>
</head>
<body>
	<h1 class="samples">
		CKeditor Sample &mdash; Creating CKeditor Instances
	</h1>
	<div class="description">
	<p>
		This sample shows how to create a CKeditor instance with PHP.
	</p>
	<pre class="samples">
&lt;?php
include_once "cKeditor/cKeditor.php";

// Create a class instance.
$CKeditor = new CKeditor();

// Path to the CKeditor directory.
$CKeditor->basePath = '/cKeditor/';

// Create a textarea element and attach CKeditor to it.
$CKeditor->editor("textarea_id", "This is some sample text");
?&gt;</pre>
	<p>
		Note that <code><em>textarea_id</em></code> in the code above is the <code>id</code> and <code>name</code> attribute of
		the <code>&lt;textarea&gt;</code> element that will be created.
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
	<!-- This <fieldset> holds the HTML code that you will usually find in your pages. -->
	<form action="../sample_posteddata.php" method="post">
		<p>
			<label for="editor1">
				Editor 1:</label>
		</p>
		<p>
		<?php
			// Include the CKeditor class.
			include_once "../../cKeditor.php";
			// The initial value to be displayed in the editor.
			$initialValue = '<p>This is some <strong>sample text</strong>.</p>';
			// Create a class instance.
			$CKeditor = new CKeditor();
			// Path to the CKeditor directory, ideally use an absolute path instead of a relative dir.
			//   $CKeditor->basePath = '/cKeditor/'
			// If not set, CKeditor will try to detect the correct path.
			$CKeditor->basePath = '../../';
			// Create a textarea element and attach CKeditor to it.
			$CKeditor->editor("editor1", $initialValue);
		?>
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
</body>
</html>
