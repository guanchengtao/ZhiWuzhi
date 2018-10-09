﻿/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{
	var meta =
	{
		editorFocus : false,
		modes : { wysiwyg:1, source:1 }
	};

	var blurCommand =
		{
			exec : function( editor )
			{
				editor.container.focusNext( true, editor.tabIndex );
			}
		};

	var blurBackCommand =
		{
			exec : function( editor )
			{
				editor.container.focusPrevious( true, editor.tabIndex );
			}
		};

	function selectNextCellCommand( backward )
	{
		return {
			editorFocus : false,
			canUndo : false,
			modes : { wysiwyg : 1 },
			exec : function( editor )
			{
				if ( editor.focusManager.hasFocus )
				{
					var sel = editor.getSelection(),
						ancestor = sel.getCommonAncestor(),
						cell;

					if ( ( cell = ( ancestor.getAscendant( 'td', true ) || ancestor.getAscendant( 'th', true ) ) ) )
					{
						var resultRange = new CKeDITOR.dom.range( editor.document ),
								next = CKeDITOR.tools.tryThese( function()
								{
									var row = cell.getParent(),
											next = row.$.cells[ cell.$.cellIndex + ( backward ? - 1 : 1 ) ];

									// Invalid any empty value.
									next.parentNode.parentNode;
									return next;
								},
								function()
								{
									var row = cell.getParent(),
											table = row.getAscendant( 'table' ),
											nextRow = table.$.rows[ row.$.rowIndex + ( backward ? - 1 : 1 ) ];

									return nextRow.cells[ backward? nextRow.cells.length -1 : 0 ];
								});

						// Clone one more row at the end of table and select the first newly established cell.
						if ( ! ( next || backward ) )
						{
							var table = cell.getAscendant( 'table' ).$,
									cells = cell.getParent().$.cells;

							var newRow = new CKeDITOR.dom.element( table.insertRow( -1 ), editor.document );

							for ( var i = 0, count = cells.length ; i < count; i++ )
							{
								var newCell = newRow.append( new CKeDITOR.dom.element(
										cells[ i ], editor.document ).clone( false, false ) );
								!CKeDITOR.env.ie && newCell.appendBogus();
							}

							resultRange.moveToElementEditStart( newRow );
						}
						else if ( next )
						{
							next = new CKeDITOR.dom.element( next );
							resultRange.moveToElementEditStart( next );
							// Avoid selecting empty block maKes the cursor blind.
							if ( !( resultRange.checkStartOfBlock() && resultRange.checKendOfBlock() ) )
								resultRange.selectNodeContents( next );
						}
						else
							return true;

						resultRange.select( true );
						return true;
					}
				}
				return false;
			}
		};
	}

	CKeDITOR.plugins.add( 'tab',
	{
		requires : [ 'KeystroKes' ],

		init : function( editor )
		{
			var tabTools = editor.config.enableTabKeyTools !== false,
				tabSpaces = editor.config.tabSpaces || 0,
				tabText = '';

			while ( tabSpaces-- )
				tabText += '\xa0';

			if ( tabText )
			{
				editor.on( 'Key', function( ev )
					{
						if ( ev.data.KeyCode == 9 )	// TAB
						{
							editor.insertHtml( tabText );
							ev.cancel();
						}
					});
			}

			if ( tabTools )
			{
				editor.on( 'Key', function( ev )
				{
					if ( ev.data.KeyCode == 9 && editor.execCommand( 'selectNextCell' ) ||	// TAB
							ev.data.KeyCode == ( CKeDITOR.SHIFT + 9 ) && editor.execCommand( 'selectPreviousCell' ) )	// SHIFT+TAB
						ev.cancel();
				});
			}

			if ( CKeDITOR.env.webkit || CKeDITOR.env.gecko )
			{
				editor.on( 'Key', function( ev )
					{
						var KeyCode = ev.data.KeyCode;

						if ( KeyCode == 9 && !tabText )				// TAB
						{
							ev.cancel();
							editor.execCommand( 'blur' );
						}

						if ( KeyCode == ( CKeDITOR.SHIFT + 9 ) )	// SHIFT+TAB
						{
							editor.execCommand( 'blurBack' );
							ev.cancel();
						}
					});
			}

			editor.addCommand( 'blur', CKeDITOR.tools.extend( blurCommand, meta ) );
			editor.addCommand( 'blurBack', CKeDITOR.tools.extend( blurBackCommand, meta ) );
			editor.addCommand( 'selectNextCell', selectNextCellCommand() );
			editor.addCommand( 'selectPreviousCell', selectNextCellCommand( true ) );
		}
	});
})();

/**
 * Moves the UI focus to the element following this element in the tabindex
 * order.
 * @example
 * var element = CKeDITOR.document.getById( 'example' );
 * element.focusNext();
 */
CKeDITOR.dom.element.prototype.focusNext = function( ignoreChildren, indexToUse )
{
	var $ = this.$,
		curTabIndex = ( indexToUse === undefined ? this.getTabIndex() : indexToUse ),
		passedCurrent, enteredCurrent,
		elected, electedTabIndex,
		element, elementTabIndex;

	if ( curTabIndex <= 0 )
	{
		// If this element has tabindex <= 0 then we must simply look for any
		// element following it containing tabindex=0.

		element = this.getNextSourceNode( ignoreChildren, CKeDITOR.NODE_ELEMENT );

		while ( element )
		{
			if ( element.isVisible() && element.getTabIndex() === 0 )
			{
				elected = element;
				break;
			}

			element = element.getNextSourceNode( false, CKeDITOR.NODE_ELEMENT );
		}
	}
	else
	{
		// If this element has tabindex > 0 then we must look for:
		//		1. An element following this element with the same tabindex.
		//		2. The first element in source other with the lowest tabindex
		//		   that is higher than this element tabindex.
		//		3. The first element with tabindex=0.

		element = this.getDocument().getBody().getFirst();

		while ( ( element = element.getNextSourceNode( false, CKeDITOR.NODE_ELEMENT ) ) )
		{
			if ( !passedCurrent )
			{
				if ( !enteredCurrent && element.equals( this ) )
				{
					enteredCurrent = true;

					// Ignore this element, if required.
					if ( ignoreChildren )
					{
						if ( !( element = element.getNextSourceNode( true, CKeDITOR.NODE_ELEMENT ) ) )
							break;
						passedCurrent = 1;
					}
				}
				else if ( enteredCurrent && !this.contains( element ) )
					passedCurrent = 1;
			}

			if ( !element.isVisible() || ( elementTabIndex = element.getTabIndex() ) < 0 )
				continue;

			if ( passedCurrent && elementTabIndex == curTabIndex )
			{
				elected = element;
				break;
			}

			if ( elementTabIndex > curTabIndex && ( !elected || !electedTabIndex || elementTabIndex < electedTabIndex ) )
			{
				elected = element;
				electedTabIndex = elementTabIndex;
			}
			else if ( !elected && elementTabIndex === 0 )
			{
				elected = element;
				electedTabIndex = elementTabIndex;
			}
		}
	}

	if ( elected )
		elected.focus();
};

/**
 * Moves the UI focus to the element before this element in the tabindex order.
 * @example
 * var element = CKeDITOR.document.getById( 'example' );
 * element.focusPrevious();
 */
CKeDITOR.dom.element.prototype.focusPrevious = function( ignoreChildren, indexToUse )
{
	var $ = this.$,
		curTabIndex = ( indexToUse === undefined ? this.getTabIndex() : indexToUse ),
		passedCurrent, enteredCurrent,
		elected,
		electedTabIndex = 0,
		elementTabIndex;

	var element = this.getDocument().getBody().getLast();

	while ( ( element = element.getPreviousSourceNode( false, CKeDITOR.NODE_ELEMENT ) ) )
	{
		if ( !passedCurrent )
		{
			if ( !enteredCurrent && element.equals( this ) )
			{
				enteredCurrent = true;

				// Ignore this element, if required.
				if ( ignoreChildren )
				{
					if ( !( element = element.getPreviousSourceNode( true, CKeDITOR.NODE_ELEMENT ) ) )
						break;
					passedCurrent = 1;
				}
			}
			else if ( enteredCurrent && !this.contains( element ) )
				passedCurrent = 1;
		}

		if ( !element.isVisible() || ( elementTabIndex = element.getTabIndex() ) < 0 )
			continue;

		if ( curTabIndex <= 0 )
		{
			// If this element has tabindex <= 0 then we must look for:
			//		1. An element before this one containing tabindex=0.
			//		2. The last element with the highest tabindex.

			if ( passedCurrent && elementTabIndex === 0 )
			{
				elected = element;
				break;
			}

			if ( elementTabIndex > electedTabIndex )
			{
				elected = element;
				electedTabIndex = elementTabIndex;
			}
		}
		else
		{
			// If this element has tabindex > 0 we must look for:
			//		1. An element preceeding this one, with the same tabindex.
			//		2. The last element in source other with the highest tabindex
			//		   that is lower than this element tabindex.

			if ( passedCurrent && elementTabIndex == curTabIndex )
			{
				elected = element;
				break;
			}

			if ( elementTabIndex < curTabIndex && ( !elected || elementTabIndex > electedTabIndex ) )
			{
				elected = element;
				electedTabIndex = elementTabIndex;
			}
		}
	}

	if ( elected )
		elected.focus();
};

/**
 * Intructs the editor to add a number of spaces (&amp;nbsp;) to the text when
 * hitting the TAB Key. If set to zero, the TAB Key will be used to move the
 * cursor focus to the next element in the page, out of the editor focus.
 * @name CKeDITOR.config.tabSpaces
 * @type Number
 * @default 0
 * @example
 * config.tabSpaces = 4;
 */

/**
 * Allow context-sensitive tab Key behaviors, including the following scenarios:
 * <h5>When selection is anchored inside <b>table cells</b>:</h5>
 * <ul>
 * 		<li>If TAB is pressed, select the contents of the "next" cell. If in the last cell in the table, add a new row to it and focus its first cell.</li>
 * 		<li>If SHIFT+TAB is pressed, select the contents of the "previous" cell. Do nothing when it's in the first cell.</li>
 * </ul>
 * @name CKeDITOR.config.enableTabKeyTools
 * @type Boolean
 * @default true
 * @example
 * config.enableTabKeyTools = false;
 */

// If the TAB Key is not supposed to be enabled for navigation, the following
// settings could be used alternatively:
// config.KeystroKes.push(
//	[ CKeDITOR.ALT + 38 /*Arrow Up*/, 'selectPreviousCell' ],
//	[ CKeDITOR.ALT + 40 /*Arrow Down*/, 'selectNextCell' ]
// );
