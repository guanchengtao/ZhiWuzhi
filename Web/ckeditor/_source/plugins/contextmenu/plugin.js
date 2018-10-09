/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'contextmenu',
{
	requires : [ 'menu' ],

	// MaKe sure the base class (CKeDITOR.menu) is loaded before it (#3318).
	onLoad : function()
	{
		CKeDITOR.plugins.contextMenu = CKeDITOR.tools.createClass(
		{
			base : CKeDITOR.menu,

			$ : function( editor )
			{
				this.base.call( this, editor,
				{
					panel:
					{
						className : editor.skinClass + ' cKe_contextmenu',
						attributes :
						{
							'aria-label' : editor.lang.contextmenu.options
						}
					}
				});
			},

			proto :
			{
				addTarget : function( element, nativeContextMenuOnCtrl )
				{
					// Opera doesn't support 'contextmenu' event, we have duo approaches employed here:
					// 1. Inherit the 'button override' hack we introduced in v2 (#4530), while this require the Opera browser
					//  option 'Allow script to detect context menu/right click events' to be always turned on.
					// 2. Considering the fact that ctrl/meta Key is not been occupied
					//  for multiple range selecting (liKe Gecko), we use this Key
					//  combination as a fallback for triggering context-menu. (#4530)
					if ( CKeDITOR.env.opera && !( 'oncontextmenu' in document.body ))
					{
						var contextMenuOverrideButton;
						element.on( 'mousedown', function( evt )
						{
							evt = evt.data;
							if ( evt.$.button != 2 )
							{
								if ( evt.getKeystroKe() == CKeDITOR.CTRL + 1 )
									element.fire( 'contextmenu', evt );
								return;
							}

							if ( nativeContextMenuOnCtrl
								 && ( CKeDITOR.env.mac ? evt.$.metaKey : evt.$.ctrlKey ) )
								return;

							var target = evt.getTarget();

							if ( !contextMenuOverrideButton )
							{
								var ownerDoc =  target.getDocument();
								contextMenuOverrideButton = ownerDoc.createElement( 'input' ) ;
								contextMenuOverrideButton.$.type = 'button' ;
								ownerDoc.getBody().append( contextMenuOverrideButton ) ;
							}

							contextMenuOverrideButton.setAttribute( 'style', 'position:absolute;top:' + ( evt.$.clientY - 2 ) +
								'px;left:' + ( evt.$.clientX - 2 ) +
								'px;width:5px;height:5px;opacity:0.01' );

						} );

						element.on( 'mouseup', function ( evt )
						{
							if ( contextMenuOverrideButton )
							{
								contextMenuOverrideButton.remove();
								contextMenuOverrideButton = undefined;
								// Simulate 'contextmenu' event.
								element.fire( 'contextmenu', evt.data );
							}
						} );
					}

					element.on( 'contextmenu', function( event )
						{
							var domEvent = event.data;

							if ( nativeContextMenuOnCtrl &&
								 // Safari on Windows always show 'ctrlKey' as true in 'contextmenu' event,
								// which maKe this property unreliable. (#4826)
								 ( CKeDITOR.env.webkit ? holdCtrlKey : ( CKeDITOR.env.mac ? domEvent.$.metaKey : domEvent.$.ctrlKey ) ) )
								return;


							// Cancel the browser context menu.
							domEvent.preventDefault();

							var offsetParent = domEvent.getTarget().getDocument().getDocumentElement(),
								offsetX = domEvent.$.clientX,
								offsetY = domEvent.$.clientY;

							CKeDITOR.tools.setTimeout( function()
								{
									this.open( offsetParent, null, offsetX, offsetY );
								},
								0, this );
						},
						this );

					if ( CKeDITOR.env.opera )
					{
						// 'contextmenu' event triggered by Windows menu Key is unpreventable,
						// cancel the Key event itself. (#6534)
						element.on( 'Keypress' , function ( evt )
						{
							var domEvent = evt.data;

							if ( domEvent.$.KeyCode === 0 )
								domEvent.preventDefault();
						});
					}

					if ( CKeDITOR.env.webkit )
					{
						var holdCtrlKey,
							onKeyDown = function( event )
							{
								holdCtrlKey = CKeDITOR.env.mac ? event.data.$.metaKey : event.data.$.ctrlKey ;
							},
							resetOnKeyUp = function()
							{
								holdCtrlKey = 0;
							};

						element.on( 'Keydown', onKeyDown );
						element.on( 'Keyup', resetOnKeyUp );
						element.on( 'contextmenu', resetOnKeyUp );
					}
				},

				open : function( offsetParent, corner, offsetX, offsetY )
				{
					this.editor.focus();
					offsetParent = offsetParent || CKeDITOR.document.getDocumentElement();
					this.show( offsetParent, corner, offsetX, offsetY );
				}
			}
		});
	},

	beforeInit : function( editor )
	{
		editor.contextMenu = new CKeDITOR.plugins.contextMenu( editor );

		editor.addCommand( 'contextMenu',
			{
				exec : function()
					{
						editor.contextMenu.open( editor.document.getBody() );
					}
			});
	}
});

/**
 * Whether to show the browser native context menu when the CTRL or the
 * META (Mac) Key is pressed while opening the context menu.
 * @name CKeDITOR.config.browserContextMenuOnCtrl
 * @since 3.0.2
 * @type Boolean
 * @default true
 * @example
 * config.browserContextMenuOnCtrl = false;
 */
