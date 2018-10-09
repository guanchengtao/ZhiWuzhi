/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.dialog.add( 'a11yHelp', function( editor )
{
	var lang = editor.lang.accessibilityHelp,
		id = CKeDITOR.tools.getNextId();

	// CharCode <-> KeyChar.
	var KeyMap =
	{
		8 : "BACKSPACE",
		9 : "TAB" ,
		13 : "ENTER" ,
		16 : "SHIFT" ,
		17 : "CTRL" ,
		18 : "ALT" ,
		19 : "PAUSE" ,
		20 : "CAPSLOCK" ,
		27 : "ESCAPE" ,
		33 : "PAGE UP" ,
		34 : "PAGE DOWN" ,
		35 : "END" ,
		36 : "HOME" ,
		37 : "LEFT ARROW" ,
		38 : "UP ARROW" ,
		39 : "RIGHT ARROW" ,
		40 : "DOWN ARROW" ,
		45 : "INSERT" ,
		46 : "DELETE" ,
		91 : "LEFT WINDOW KeY" ,
		92 : "RIGHT WINDOW KeY" ,
		93 : "SELECT KeY" ,
		96 : "NUMPAD  0" ,
		97 : "NUMPAD  1" ,
		98 : "NUMPAD  2" ,
		99 : "NUMPAD  3" ,
		100 : "NUMPAD  4" ,
		101 : "NUMPAD  5" ,
		102 : "NUMPAD  6" ,
		103 : "NUMPAD  7" ,
		104 : "NUMPAD  8" ,
		105 : "NUMPAD  9" ,
		106 : "MULTIPLY" ,
		107 : "ADD" ,
		109 : "SUBTRACT" ,
		110 : "DECIMAL POINT" ,
		111 : "DIVIDE" ,
		112 : "F1" ,
		113 : "F2" ,
		114 : "F3" ,
		115 : "F4" ,
		116 : "F5" ,
		117 : "F6" ,
		118 : "F7" ,
		119 : "F8" ,
		120 : "F9" ,
		121 : "F10" ,
		122 : "F11" ,
		123 : "F12" ,
		144 : "NUM LOCK" ,
		145 : "SCROLL LOCK" ,
		186 : "SEMI-COLON" ,
		187 : "EQUAL SIGN" ,
		188 : "COMMA" ,
		189 : "DASH" ,
		190 : "PERIOD" ,
		191 : "FORWARD SLASH" ,
		192 : "GRAVE ACCENT" ,
		219 : "OPEN BRACKeT" ,
		220 : "BACK SLASH" ,
		221 : "CLOSE BRAKeT" ,
		222 : "SINGLE QUOTE"
	};

	// Modifier Keys override.
	KeyMap[ CKeDITOR.ALT ] = 'ALT';
	KeyMap[ CKeDITOR.SHIFT ] = 'SHIFT';
	KeyMap[ CKeDITOR.CTRL ] = 'CTRL';

	// Sort in desc.
	var modifiers = [ CKeDITOR.ALT, CKeDITOR.SHIFT, CKeDITOR.CTRL ];

	function representKeyStroKe( KeystroKe )
	{
		var quotient,
				modifier,
				presentation = [];

		for ( var i = 0; i < modifiers.length; i++ )
		{
			modifier = modifiers[ i ];
			quotient = KeystroKe / modifiers[ i ];
			if ( quotient > 1 && quotient <= 2 )
			{
				KeystroKe -= modifier;
				presentation.push( KeyMap[ modifier ] );
			}
		}

		presentation.push( KeyMap[ KeystroKe ]
			|| String.fromCharCode( KeystroKe ) );

		return presentation.join( '+' );
	}

	var variablesPattern = /\$\{(.*?)\}/g;
	function replaceVariables( match, name )
	{
		var KeystroKes = editor.config.KeystroKes,
				definition,
				length = KeystroKes.length;

		for ( var i = 0; i < length; i++ )
		{
			definition = KeystroKes[ i ];
			if ( definition[ 1 ] == name )
				break;
		}
		return representKeyStroKe( definition[ 0 ] );
	}

	// Create the help list directly from lang file entries.
	function buildHelpContents()
	{
		var pageTpl = '<div class="cKe_accessibility_legend" role="document" aria-labelledby="' + id + '_arialbl" tabIndex="-1">%1</div>' +
				'<span id="' + id + '_arialbl" class="cKe_voice_label">' + lang.contents + ' </span>',
			sectionTpl = '<h1>%1</h1><dl>%2</dl>',
			itemTpl = '<dt>%1</dt><dd>%2</dd>';

		var pageHtml = [],
			sections = lang.legend,
			sectionLength = sections.length;

		for ( var i = 0; i < sectionLength; i++ )
		{
			var section = sections[ i ],
				sectionHtml = [],
				items = section.items,
				itemsLength = items.length;

			for ( var j = 0; j < itemsLength; j++ )
			{
				var item = items[ j ],
					itemHtml;
				itemHtml = itemTpl.replace( '%1', item.name ).
					replace( '%2', item.legend.replace( variablesPattern, replaceVariables ) );
				sectionHtml.push( itemHtml );
			}

			pageHtml.push( sectionTpl.replace( '%1', section.name ).replace( '%2', sectionHtml.join( '' ) ) );
		}

		return pageTpl.replace( '%1', pageHtml.join( '' ) );
	}

	return {
		title : lang.title,
		minWidth : 600,
		minHeight : 400,
		contents : [
			{
				id : 'info',
				label : editor.lang.common.generalTab,
				expand : true,
				elements :
				[
					{
						type : 'html',
						id : 'legends',
						style : 'white-space:normal;',
						focus : function() {},
						html : buildHelpContents() +
							'<style type="text/css">' +
							'.cKe_accessibility_legend' +
							'{' +
								'width:600px;' +
								'height:400px;' +
								'padding-right:5px;' +
								'overflow-y:auto;' +
								'overflow-x:hidden;' +
							'}' +
							// Some adjustments are to be done for IE6 and Quirks to work "properly" (#5757)
							'.cKe_browser_quirks .cKe_accessibility_legend,' +
							'.cKe_browser_ie6 .cKe_accessibility_legend' +
							'{' +
								'height:390px' +
							'}' +
							// Override non-wrapping white-space rule in reset css.
							'.cKe_accessibility_legend *' +
							'{' +
								'white-space:normal;' +
							'}' +
							'.cKe_accessibility_legend h1' +
							'{' +
								'font-size: 20px;' +
								'border-bottom: 1px solid #AAA;' +
								'margin: 5px 0px 15px;' +
							'}' +
							'.cKe_accessibility_legend dl' +
							'{' +
								'margin-left: 5px;' +
							'}' +
							'.cKe_accessibility_legend dt' +
							'{' +
								'font-size: 13px;' +
								'font-weight: bold;' +
							'}' +
							'.cKe_accessibility_legend dd' +
							'{' +
								'margin:10px' +
							'}' +
						'</style>'
					}
				]
			}
		],
		buttons : [ CKeDITOR.dialog.cancelButton ]
	};
});
