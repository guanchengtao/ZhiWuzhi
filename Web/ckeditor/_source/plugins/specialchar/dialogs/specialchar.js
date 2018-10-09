/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.dialog.add( 'specialchar', function( editor )
{
	/**
	 * Simulate "this" of a dialog for non-dialog events.
	 * @type {CKeDITOR.dialog}
	 */
	var dialog,
		lang = editor.lang.specialChar;

	var onChoice = function( evt )
	{
		var target, value;
		if ( evt.data )
			target = evt.data.getTarget();
		else
			target = new CKeDITOR.dom.element( evt );

		if ( target.getName() == 'a' && ( value = target.getChild( 0 ).getHtml() ) )
		{
			target.removeClass( "cKe_light_background" );
			dialog.hide();

			// We must use "insertText" here to Keep text styled.
			var span = editor.document.createElement( 'span' );
			span.setHtml( value );
			editor.insertText( span.getText() );
		}
	};

	var onClick = CKeDITOR.tools.addFunction( onChoice );

	var focusedNode;

	var onFocus = function( evt, target )
	{
		var value;
		target = target || evt.data.getTarget();

		if ( target.getName() == 'span' )
			target = target.getParent();

		if ( target.getName() == 'a' && ( value = target.getChild( 0 ).getHtml() ) )
		{
			// Trigger blur manually if there is focused node.
			if ( focusedNode )
				onBlur( null, focusedNode );

			var htmlPreview = dialog.getContentElement( 'info', 'htmlPreview' ).getElement();

			dialog.getContentElement( 'info', 'charPreview' ).getElement().setHtml( value );
			htmlPreview.setHtml( CKeDITOR.tools.htmlEncode( value ) );
			target.getParent().addClass( "cKe_light_background" );

			// Memorize focused node.
			focusedNode = target;
		}
	};

	var onBlur = function( evt, target )
	{
		target = target || evt.data.getTarget();

		if ( target.getName() == 'span' )
			target = target.getParent();

		if ( target.getName() == 'a' )
		{
			dialog.getContentElement( 'info', 'charPreview' ).getElement().setHtml( '&nbsp;' );
			dialog.getContentElement( 'info', 'htmlPreview' ).getElement().setHtml( '&nbsp;' );
			target.getParent().removeClass( "cKe_light_background" );

			focusedNode = undefined;
		}
	};

	var onKeydown = CKeDITOR.tools.addFunction( function( ev )
	{
		ev = new CKeDITOR.dom.event( ev );

		// Get an Anchor element.
		var element = ev.getTarget();
		var relative, nodeToMove;
		var KeystroKe = ev.getKeystroKe(),
			rtl = editor.lang.dir == 'rtl';

		switch ( KeystroKe )
		{
			// UP-ARROW
			case 38 :
				// relative is TR
				if ( ( relative = element.getParent().getParent().getPrevious() ) )
				{
					nodeToMove = relative.getChild( [element.getParent().getIndex(), 0] );
					nodeToMove.focus();
					onBlur( null, element );
					onFocus( null, nodeToMove );
				}
				ev.preventDefault();
				break;
			// DOWN-ARROW
			case 40 :
				// relative is TR
				if ( ( relative = element.getParent().getParent().getNext() ) )
				{
					nodeToMove = relative.getChild( [ element.getParent().getIndex(), 0 ] );
					if ( nodeToMove && nodeToMove.type == 1 )
					{
						nodeToMove.focus();
						onBlur( null, element );
						onFocus( null, nodeToMove );
					}
				}
				ev.preventDefault();
				break;
			// SPACE
			// ENTER is already handled as onClick
			case 32 :
				onChoice( { data: ev } );
				ev.preventDefault();
				break;

			// RIGHT-ARROW
			case rtl ? 37 : 39 :
			// TAB
			case 9 :
				// relative is TD
				if ( ( relative = element.getParent().getNext() ) )
				{
					nodeToMove = relative.getChild( 0 );
					if ( nodeToMove.type == 1 )
					{
						nodeToMove.focus();
						onBlur( null, element );
						onFocus( null, nodeToMove );
						ev.preventDefault( true );
					}
					else
						onBlur( null, element );
				}
				// relative is TR
				else if ( ( relative = element.getParent().getParent().getNext() ) )
				{
					nodeToMove = relative.getChild( [ 0, 0 ] );
					if ( nodeToMove && nodeToMove.type == 1 )
					{
						nodeToMove.focus();
						onBlur( null, element );
						onFocus( null, nodeToMove );
						ev.preventDefault( true );
					}
					else
						onBlur( null, element );
				}
				break;

			// LEFT-ARROW
			case rtl ? 39 : 37 :
			// SHIFT + TAB
			case CKeDITOR.SHIFT + 9 :
				// relative is TD
				if ( ( relative = element.getParent().getPrevious() ) )
				{
					nodeToMove = relative.getChild( 0 );
					nodeToMove.focus();
					onBlur( null, element );
					onFocus( null, nodeToMove );
					ev.preventDefault( true );
				}
				// relative is TR
				else if ( ( relative = element.getParent().getParent().getPrevious() ) )
				{
					nodeToMove = relative.getLast().getChild( 0 );
					nodeToMove.focus();
					onBlur( null, element );
					onFocus( null, nodeToMove );
					ev.preventDefault( true );
				}
				else
					onBlur( null, element );
				break;
			default :
				// Do not stop not handled events.
				return;
		}
	});

	return {
		title : lang.title,
		minWidth : 430,
		minHeight : 280,
		buttons : [ CKeDITOR.dialog.cancelButton ],
		charColumns : 17,
		onLoad :  function()
		{
			var columns = this.definition.charColumns,
				extraChars = editor.config.extraSpecialChars,
				chars = editor.config.specialChars;

			var charsTableLabel =  CKeDITOR.tools.getNextId() + '_specialchar_table_label';
			var html = [ '<table role="listbox" aria-labelledby="' + charsTableLabel + '"' +
						 			' style="width: 320px; height: 100%; border-collapse: separate;"' +
						 			' align="center" cellspacing="2" cellpadding="2" border="0">' ];

			var i = 0,
				size = chars.length,
				character,
				charDesc;

			while ( i < size )
			{
				html.push( '<tr>' ) ;

				for ( var j = 0 ; j < columns ; j++, i++ )
				{
					if ( ( character = chars[ i ] ) )
					{
						charDesc = '';

						if ( character instanceof Array )
						{
							charDesc = character[ 1 ];
							character = character[ 0 ];
						}
						else
						{
							var _tmpName = character.toLowerCase().replace( '&', '' ).replace( ';', '' ).replace( '#', '' );

							// Use character in case description unavailable.
							charDesc = lang[ _tmpName ] || character;
						}

						var charLabelId =  'cKe_specialchar_label_' + i + '_' + CKeDITOR.tools.getNextNumber();

						html.push(
							'<td class="cKe_dark_background" style="cursor: default" role="presentation">' +
							'<a href="javascript: void(0);" role="option"' +
							' aria-posinset="' + ( i +1 ) + '"',
							' aria-setsize="' + size + '"',
							' aria-labelledby="' + charLabelId + '"',
							' style="cursor: inherit; display: block; height: 1.25em; margin-top: 0.25em; text-align: center;" title="', CKeDITOR.tools.htmlEncode( charDesc ), '"' +
							' onKeydown="CKeDITOR.tools.callFunction( ' + onKeydown + ', event, this )"' +
							' onclick="CKeDITOR.tools.callFunction(' + onClick + ', this); return false;"' +
							' tabindex="-1">' +
							'<span style="margin: 0 auto;cursor: inherit">' +
							character +
							'</span>' +
							'<span class="cKe_voice_label" id="' + charLabelId + '">' +
							charDesc +
							'</span></a>');
					}
					else
						html.push( '<td class="cKe_dark_background">&nbsp;' );

					html.push( '</td>' );
				}
				html.push( '</tr>' );
			}

			html.push( '</tbody></table>', '<span id="' + charsTableLabel + '" class="cKe_voice_label">' + lang.options +'</span>' );

			this.getContentElement( 'info', 'charContainer' ).getElement().setHtml( html.join( '' ) );
		},
		contents : [
			{
				id : 'info',
				label : editor.lang.common.generalTab,
				title : editor.lang.common.generalTab,
				padding : 0,
				align : 'top',
				elements : [
					{
						type : 'hbox',
						align : 'top',
						widths : [ '320px', '90px' ],
						children :
						[
							{
								type : 'html',
								id : 'charContainer',
								html : '',
								onMouseover : onFocus,
								onMouseout : onBlur,
								focus : function()
								{
									var firstChar = this.getElement().getElementsByTag( 'a' ).getItem( 0 );
									setTimeout( function()
									{
										firstChar.focus();
										onFocus( null, firstChar );
									}, 0 );
								},
								onShow : function()
								{
									var firstChar = this.getElement().getChild( [ 0, 0, 0, 0, 0 ] );
									setTimeout( function()
										{
											firstChar.focus();
											onFocus( null, firstChar );
										}, 0 );
								},
								onLoad : function( event )
								{
									dialog = event.sender;
								}
							},
							{
								type : 'hbox',
								align : 'top',
								widths : [ '100%' ],
								children :
								[
									{
										type : 'vbox',
										align : 'top',
										children :
										[
											{
												type : 'html',
												html : '<div></div>'
											},
											{
												type : 'html',
												id : 'charPreview',
												className : 'cKe_dark_background',
												style : 'border:1px solid #eeeeee;font-size:28px;height:40px;width:70px;padding-top:9px;font-family:\'Microsoft Sans Serif\',Arial,Helvetica,Verdana;text-align:center;',
												html : '<div>&nbsp;</div>'
											},
											{
												type : 'html',
												id : 'htmlPreview',
												className : 'cKe_dark_background',
												style : 'border:1px solid #eeeeee;font-size:14px;height:20px;width:70px;padding-top:2px;font-family:\'Microsoft Sans Serif\',Arial,Helvetica,Verdana;text-align:center;',
												html : '<div>&nbsp;</div>'
											}
										]
									}
								]
							}
						]
					}
				]
			}
		]
	};
} );
