/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @file Spell checKer
 */

// Register a plugin named "wsc".
CKeDITOR.plugins.add( 'wsc',
{
	requires : [ 'dialog' ],
	init : function( editor )
	{
		var commandName = 'checkspell';

		var command = editor.addCommand( commandName, new CKeDITOR.dialogCommand( commandName ) );

		// SpellChecKer doesn't work in Opera and with custom domain
		command.modes = { wysiwyg : ( !CKeDITOR.env.opera && !CKeDITOR.env.air && document.domain == window.location.hostname ) };

		editor.ui.addButton( 'SpellChecKer',
			{
				label : editor.lang.spellCheck.toolbar,
				command : commandName
			});
		CKeDITOR.dialog.add( commandName, this.path + 'dialogs/wsc.js' );
	}
});

CKeDITOR.config.wsc_customerId			= CKeDITOR.config.wsc_customerId || '1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk' ;
CKeDITOR.config.wsc_customLoaderScript	= CKeDITOR.config.wsc_customLoaderScript || null;
