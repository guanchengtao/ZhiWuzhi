<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Adding Event Handlers &mdash; CKeditor Sample</title>
	<meta content="text/html; charset=utf-8" http-equiv="content-type"/>
	<link href="../sample.css" rel="stylesheet" type="text/css"/>
</head>
<body>
	<h1 class="samples">
		CKeditor Sample &mdash; Adding Event Handlers
	</h1>
	<div class="description">
	<p>
		This sample shows how to add event handlers to CKeditor with PHP.
	</p>
	<p>
		A snippet of the configuration code can be seen below; check the source code of this page for
		the full definition:
	</p>
	<pre class="samples">&lt;?php
// Include the CKeditor class.
include("cKeditor/cKeditor.php");

// Create a class instance.
$CKeditor = new CKeditor();

// Path to the CKeditor directory.
$CKeditor->basePath = '/cKeditor/';

// The initial value to be displayed in the editor.
$initialValue = 'This is some sample text.';

// Add event handler, <em>instanceReady</em> is fired when editor is loaded.
$CKeditor-><strong>addEventHandler</strong>('instanceReady', 'function (evt) {
	alert("Loaded editor: " + evt.editor.name);
}');

// Create an editor instance.
$CKeditor->editor("editor1", $initialValue);
</pre>
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
		<label>Editor 1:</label>
<?php

/**
 * Adds a global event, will hide the "Target" tab in the "Link" dialog window in all instances.
 */
function CKeditorHideLinkTargetTab(&$CKeditor) {

	$function = 'function (ev) {
		// TaKe the dialog window name and its definition from the event data.
		var dialogName = ev.data.name;
		var dialogDefinition = ev.data.definition;

		// Check if the definition comes from the "Link" dialog window.
		if ( dialogName == "link" )
			dialogDefinition.removeContents("target")
	}';

	$CKeditor->addGlobalEventHandler('dialogDefinition', $function);
}

/**
 * Adds a global event, will notify about an open dialog window.
 */
function CKeditorNotifyAboutOpenedDialog(&$CKeditor) {
	$function = 'function (evt) {
		alert("Loading a dialog window: " + evt.data.name);
	}';

	$CKeditor->addGlobalEventHandler('dialogDefinition', $function);
}

// Include the CKeditor class.
include("../../cKeditor.php");

// Create a class instance.
$CKeditor = new CKeditor();

// Set a configuration option for all editors.
$CKeditor->config['width'] = 750;

// Path to the CKeditor directory, ideally use an absolute path instead of a relative dir.
//   $CKeditor->basePath = '/cKeditor/'
// If not set, CKeditor will try to detect the correct path.
$CKeditor->basePath = '../../';

// The initial value to be displayed in the editor.
$initialValue = '<p>This is some <strong>sample text</strong>. You are using <a href="http://cKeditor.com/">CKeditor</a>.</p>';

// Event that will be handled only by the first editor.
$CKeditor->addEventHandler('instanceReady', 'function (evt) {
	alert("Loaded editor: " + evt.editor.name);
}');

// Create the first instance.
$CKeditor->editor("editor1", $initialValue);

// Clear event handlers. Instances that will be created later will not have
// the 'instanceReady' listener defined a couple of lines above.
$CKeditor->clearEventHandlers();
?>
		<br />
		<label>Editor 2:</label>
<?php
// Configuration that will only be used by the second editor.
$config['width'] = '600';
$config['toolbar'] = 'Basic';

// Add some global event handlers (for all editors).
CKeditorHideLinkTargetTab($CKeditor);
CKeditorNotifyAboutOpenedDialog($CKeditor);

// Event that will only be handled by the second editor.
// Instead of calling addEventHandler(), events may be passed as an argument.
$events['instanceReady'] = 'function (evt) {
	alert("Loaded second editor: " + evt.editor.name);
}';

// Create the second instance.
$CKeditor->editor("editor2", $initialValue, $config, $events);
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
