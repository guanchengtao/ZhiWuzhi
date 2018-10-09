<%@  codepage="65001" language="VBScript" %>
<% Option Explicit %>
<!-- #INCLUDE file="../../cKeditor.asp" -->
<%

	' You must set "Enable Parent Paths" on your web site
	' in order for the above relative include to work.
	' Or you can use #INCLUDE VIRTUAL="/full path/cKeditor.asp"

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Sample - CKeditor</title>
	<meta content="text/html; charset=utf-8" http-equiv="content-type"/>
	<link href="../sample.css" rel="stylesheet" type="text/css"/>
</head>
<body>
	<h1 class="samples">
		CKeditor Sample
	</h1>
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
	<!-- This <fieldset> holds the HTML that you will usually find in your pages. -->
	<fieldset title="Output">
		<legend>Output</legend>
		<form action="sample_posteddata.asp" method="post">
			<p>
				<label for="editor1">
					Editor 1:</label><br/>
				<textarea cols="80" id="editor1" name="editor1" rows="10">&lt;p&gt;This is some &lt;strong&gt;sample text&lt;/strong&gt;. You are using &lt;a href="http://cKeditor.com/"&gt;CKeditor&lt;/a&gt;.&lt;/p&gt;</textarea>
			</p>
			<p>
				<label for="editor2">
					Editor 2:</label><br/>
				<textarea cols="80" id="editor2" name="editor2" rows="10">&lt;p&gt;This is some &lt;strong&gt;sample text&lt;/strong&gt;. You are using &lt;a href="http://cKeditor.com/"&gt;CKeditor&lt;/a&gt;.&lt;/p&gt;</textarea>
			</p>
			<p>
				<input type="submit" value="Submit"/>
			</p>
		</form>
	</fieldset>
	<div id="footer">
		<hr />
		<p>
			CKeditor - The text editor for Internet - <a class="samples" href="http://cKeditor.com/">http://cKeditor.com</a>
		</p>
		<p id="copy">
			Copyright &copy; 2003-2011, <a class="samples" href="http://cksource.com/">CKSource</a> - Frederico
			Knabben. All rights reserved.
		</p>
	</div>
	<%
	' Create class instance.
	dim editor
	set editor = New CKeditor
	' Path to CKeditor directory, ideally instead of relative dir, use an absolute path:
	'   editor.basePath = "/cKeditor/"
	' If not set, CKeditor will default to /cKeditor/
	editor.basePath = "../../"
	' Replace all textareas with CKeditor.
	editor.replaceAll empty
	%>
</body>
</html>
