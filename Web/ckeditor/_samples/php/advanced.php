<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Setting Configuration Options &mdash; CKeditor Sample</title>
	<meta content="text/html; charset=utf-8" http-equiv="content-type"/>
	<link href="../sample.css" rel="stylesheet" type="text/css"/>
</head>
<body>
	<h1 class="samples">
		CKeditor Sample &mdash; Setting Configuration Options
	</h1>
	<p>
		This sample shows how to insert a CKeditor instance with custom configuration options.
	</p>
	<p>
		To set configuration options, use the <a class="samples" href="http://docs.cksource.com/cKeditor_api/symbols/CKeDITOR.config.html"><code>config</code></a> property. To set the attributes of a <code>&lt;textarea&gt;</code> element (which is displayed instead of CKeditor in unsupported browsers), use the <code>textareaAttributes</code> property.
	</p>
	<pre class="samples">
&lt;?php
// Include the CKeditor class.
include_once "cKeditor/cKeditor.php";

// Create a class instance.
$CKeditor = new CKeditor();

// Path to the CKeditor directory.
$CKeditor->basePath = '/cKeditor/';

// Set global configuration (used by every instance of CKeditor).
$CKeditor-><strong>config['width']</strong> = 600;

// Change default textarea attributes.
$CKeditor-><strong>textareaAttributes</strong> = array("cols" => 80, "rows" => 10);

// The initial value to be displayed in the editor.
$initialValue = 'This is some sample text.';

// Create the first instance.
$CKeditor->editor("textarea_id", $initialValue);
?&gt;</pre>
	<p>
		Note that <code><em>textarea_id</em></code> in the code above is the <code>name</code> attribute of
		the <code>&lt;textarea&gt;</code> element to be created.
	</p>

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
			<label>Editor 1:</label>
<?php
// Include the CKeditor class.
include("../../cKeditor.php");

// Create a class instance.
$CKeditor = new CKeditor();

// Do not print the code directly to the browser, return it instead.
$CKeditor->returnOutput = true;

// Path to the CKeditor directory, ideally use an absolute path instead of a relative dir.
//   $CKeditor->basePath = '/cKeditor/'
// If not set, CKeditor will try to detect the correct path.
$CKeditor->basePath = '../../';

// Set global configuration (will be used by all instances of CKeditor).
$CKeditor->config['width'] = 600;

// Change default textarea attributes.
$CKeditor->textareaAttributes = array("cols" => 80, "rows" => 10);

// The initial value to be displayed in the editor.
$initialValue = '<p>This is some <strong>sample text</strong>. You are using <a href="http://cKeditor.com/">CKeditor</a>.</p>';

// Create the first instance.
$code = $CKeditor->editor("editor1", $initialValue);

echo $code;
?>
				<br />
				<label>Editor 2:</label>
<?php
// Configuration that will only be used by the second editor.
$config['toolbar'] = array(
	array( 'Source', '-', 'Bold', 'Italic', 'Underline', 'StriKe' ),
	array( 'Image', 'Link', 'Unlink', 'Anchor' )
);

$config['skin'] = 'v2';

// Create the second instance.
echo $CKeditor->editor("editor2", $initialValue, $config);
?>
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
</body>
</html>
