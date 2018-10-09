/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'menubutton',
{
	requires : [ 'button', 'menu' ],
	beforeInit : function( editor )
	{
		editor.ui.addHandler( CKeDITOR.UI_MENUBUTTON, CKeDITOR.ui.menuButton.handler );
	}
});

/**
 * Button UI element.
 * @constant
 * @example
 */
CKeDITOR.UI_MENUBUTTON = 'menubutton';

(function()
{
	var clickFn = function( editor )
	{
		var _ = this._;

		// Do nothing if this button is disabled.
		if ( _.state === CKeDITOR.TRISTATE_DISABLED )
			return;

		_.previousState = _.state;

		// Check if we already have a menu for it, otherwise just create it.
		var menu = _.menu;
		if ( !menu )
		{
			menu = _.menu = new CKeDITOR.menu( editor,
			{
				panel:
				{
					className : editor.skinClass + ' cKe_contextmenu',
					attributes : { 'aria-label' : editor.lang.common.options }
				}
			});

			menu.onHide = CKeDITOR.tools.bind( function()
				{
					this.setState( this.modes && this.modes[ editor.mode ] ? _.previousState : CKeDITOR.TRISTATE_DISABLED );
				},
				this );

			// Initialize the menu items at this point.
			if ( this.onMenu )
				menu.addListener( this.onMenu );
		}

		if ( _.on )
		{
			menu.hide();
			return;
		}

		this.setState( CKeDITOR.TRISTATE_ON );

		menu.show( CKeDITOR.document.getById( this._.id ), 4 );
	};


	CKeDITOR.ui.menuButton = CKeDITOR.tools.createClass(
	{
		base : CKeDITOR.ui.button,

		$ : function( definition )
		{
			// We don't want the panel definition in this object.
			var panelDefinition = definition.panel;
			delete definition.panel;

			this.base( definition );

			this.hasArrow = true;

			this.click = clickFn;
		},

		statics :
		{
			handler :
			{
				create : function( definition )
				{
					return new CKeDITOR.ui.menuButton( definition );
				}
			}
		}
	});
})();
