/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.dialog.add( 'smiley', function( editor )
{
	var config = editor.config,
		lang = editor.lang.smiley,
		images = config.smiley_images,
		columns = config.smiley_columns || 8,
		i;

	/**
	 * Simulate "this" of a dialog for non-dialog events.
	 * @type {CKeDITOR.dialog}
	 */
	var dialog;
	var onClick = function( evt )
	{
		var target = evt.data.getTarget(),
			targetName = target.getName();

		if ( targetName == 'a' )
			target = target.getChild( 0 );
		else if ( targetName != 'img' )
			return;

		var src = target.getAttribute( 'cKe_src' ),
			title = target.getAttribute( 'title' );

		var img = editor.document.createElement( 'img',
			{
				attributes :
				{
					src : src,
					'data-cKe-saved-src' : src,
					title : title,
					alt : title,
					width : target.$.width,
					height : target.$.height
				}
			});

		editor.insertElement( img );

		dialog.hide();
		evt.data.preventDefault();
	};

	var onKeydown = CKeDITOR.tools.addFunction( function( ev, element )
	{
		ev = new CKeDITOR.dom.event( ev );
		element = new CKeDITOR.dom.element( element );
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
				}
				ev.preventDefault();
				break;
			// DOWN-ARROW
			case 40 :
				// relative is TR
				if ( ( relative = element.getParent().getParent().getNext() ) )
				{
					nodeToMove = relative.getChild( [element.getParent().getIndex(), 0] );
					if ( nodeToMove )
						nodeToMove.focus();
				}
				ev.preventDefault();
				break;
			// ENTER
			// SPACE
			case 32 :
				onClick( { data: ev } );
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
					nodeToMove.focus();
					ev.preventDefault(true);
				}
				// relative is TR
				else if ( ( relative = element.getParent().getParent().getNext() ) )
				{
					nodeToMove = relative.getChild( [0, 0] );
					if ( nodeToMove )
						nodeToMove.focus();
					ev.preventDefault(true);
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
					ev.preventDefault(true);
				}
				// relative is TR
				else if ( ( relative = element.getParent().getParent().getPrevious() ) )
				{
					nodeToMove = relative.getLast().getChild( 0 );
					nodeToMove.focus();
					ev.preventDefault(true);
				}
				break;
			default :
				// Do not stop not handled events.
				return;
		}
	});

	// Build the HTML for the smiley images table.
	var labelId = CKeDITOR.tools.getNextId() + '_smiley_emtions_label';
	var html =
	[
		'<div>' +
		'<span id="' + labelId + '" class="cKe_voice_label">' + lang.options +'</span>',
		'<table role="listbox" aria-labelledby="' + labelId + '" style="width:100%;height:100%" cellspacing="2" cellpadding="2"',
		CKeDITOR.env.ie && CKeDITOR.env.quirks ? ' style="position:absolute;"' : '',
		'><tbody>'
	];

	var size = images.length;
	for ( i = 0 ; i < size ; i++ )
	{
		if ( i % columns === 0 )
			html.push( '<tr>' );

		var smileyLabelId = 'cKe_smile_label_' + i + '_' + CKeDITOR.tools.getNextNumber();
		html.push(
			'<td class="cKe_dark_background cKe_centered" style="vertical-align: middle;">' +
				'<a href="javascript:void(0)" role="option"',
					' aria-posinset="' + ( i +1 ) + '"',
					' aria-setsize="' + size + '"',
					' aria-labelledby="' + smileyLabelId + '"',
					' class="cKe_smile cKe_hand" tabindex="-1" onKeydown="CKeDITOR.tools.callFunction( ', onKeydown, ', event, this );">',
					'<img class="cKe_hand" title="', config.smiley_descriptions[i], '"' +
						' cKe_src="', CKeDITOR.tools.htmlEncode( config.smiley_path + images[ i ] ), '" alt="', config.smiley_descriptions[i], '"',
						' src="', CKeDITOR.tools.htmlEncode( config.smiley_path + images[ i ] ), '"',
						// IE BUG: Below is a workaround to an IE image loading bug to ensure the image sizes are correct.
						( CKeDITOR.env.ie ? ' onload="this.setAttribute(\'width\', 2); this.removeAttribute(\'width\');" ' : '' ),
					'>' +
					'<span id="' + smileyLabelId + '" class="cKe_voice_label">' +config.smiley_descriptions[ i ]  + '</span>' +
				'</a>',
 			'</td>' );

		if ( i % columns == columns - 1 )
			html.push( '</tr>' );
	}

	if ( i < columns - 1 )
	{
		for ( ; i < columns - 1 ; i++ )
			html.push( '<td></td>' );
		html.push( '</tr>' );
	}

	html.push( '</tbody></table></div>' );

	var smileySelector =
	{
		type : 'html',
		id : 'smileySelector',
		html : html.join( '' ),
		onLoad : function( event )
		{
			dialog = event.sender;
		},
		focus : function()
		{
			var self = this;
			// IE need a while to move the focus (#6539).
			setTimeout( function ()
			{
				var firstSmile = self.getElement().getElementsByTag( 'a' ).getItem( 0 );
				firstSmile.focus();
			}, 0 );
		},
		onClick : onClick,
		style : 'width: 100%; border-collapse: separate;'
	};

	return {
		title : editor.lang.smiley.title,
		minWidth : 270,
		minHeight : 120,
		contents : [
			{
				id : 'tab1',
				label : '',
				title : '',
				expand : true,
				padding : 0,
				elements : [
						smileySelector
					]
			}
		],
		buttons : [ CKeDITOR.dialog.cancelButton ]
	};
} );
