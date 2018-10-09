/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * A lightweight representation of an HTML DOM structure.
 * @constructor
 * @example
 */
CKeDITOR.htmlParser.fragment = function()
{
	/**
	 * The nodes contained in the root of this fragment.
	 * @type Array
	 * @example
	 * var fragment = CKeDITOR.htmlParser.fragment.fromHtml( '<b>Sample</b> Text' );
	 * alert( fragment.children.length );  "2"
	 */
	this.children = [];

	/**
	 * Get the fragment parent. Should always be null.
	 * @type Object
	 * @default null
	 * @example
	 */
	this.parent = null;

	/** @private */
	this._ =
	{
		isBlockLiKe : true,
		hasInlineStarted : false
	};
};

(function()
{
	// Block-level elements whose internal structure should be respected during
	// parser fixing.
	var nonBreakingBlocks = CKeDITOR.tools.extend( { table:1,ul:1,ol:1,dl:1 }, CKeDITOR.dtd.table, CKeDITOR.dtd.ul, CKeDITOR.dtd.ol, CKeDITOR.dtd.dl );

	var listBlocks = { ol:1, ul:1 };

	// Dtd of the fragment element, basically it accept anything except for intermediate structure, e.g. orphan <li>.
	var rootDtd = CKeDITOR.tools.extend( {}, { html: 1 }, CKeDITOR.dtd.html, CKeDITOR.dtd.body, CKeDITOR.dtd.head, { style:1,script:1 } );

	/**
	 * Creates a {@link CKeDITOR.htmlParser.fragment} from an HTML string.
	 * @param {String} fragmentHtml The HTML to be parsed, filling the fragment.
	 * @param {Number} [fixForBody=false] Wrap body with specified element if needed.
	 * @param {CKeDITOR.htmlParser.element} contextNode Parse the html as the content of this element.
	 * @returns CKeDITOR.htmlParser.fragment The fragment created.
	 * @example
	 * var fragment = CKeDITOR.htmlParser.fragment.fromHtml( '<b>Sample</b> Text' );
	 * alert( fragment.children[0].name );  "b"
	 * alert( fragment.children[1].value );  " Text"
	 */
	CKeDITOR.htmlParser.fragment.fromHtml = function( fragmentHtml, fixForBody, contextNode )
	{
		var parser = new CKeDITOR.htmlParser(),
			fragment = contextNode || new CKeDITOR.htmlParser.fragment(),
			pendingInline = [],
			pendingBRs = [],
			currentNode = fragment,
		    // Indicate we're inside a <pre> element, spaces should be touched differently.
			inPre = false;

		function checkPending( newTagName )
		{
			var pendingBRsSent;

			if ( pendingInline.length > 0 )
			{
				for ( var i = 0 ; i < pendingInline.length ; i++ )
				{
					var pendingElement = pendingInline[ i ],
						pendingName = pendingElement.name,
						pendingDtd = CKeDITOR.dtd[ pendingName ],
						currentDtd = currentNode.name && CKeDITOR.dtd[ currentNode.name ];

					if ( ( !currentDtd || currentDtd[ pendingName ] ) && ( !newTagName || !pendingDtd || pendingDtd[ newTagName ] || !CKeDITOR.dtd[ newTagName ] ) )
					{
						if ( !pendingBRsSent )
						{
							sendPendingBRs();
							pendingBRsSent = 1;
						}

						// Get a clone for the pending element.
						pendingElement = pendingElement.clone();

						// Add it to the current node and maKe it the current,
						// so the new element will be added inside of it.
						pendingElement.parent = currentNode;
						currentNode = pendingElement;

						// Remove the pending element (back the index by one
						// to properly process the next entry).
						pendingInline.splice( i, 1 );
						i--;
					}
				}
			}
		}

		function sendPendingBRs()
		{
			while ( pendingBRs.length )
				currentNode.add( pendingBRs.shift() );
		}

		/*
		* Beside of simply append specified element to target, this function also taKes
		* care of other dirty lifts liKe forcing block in body, trimming spaces at
		* the block boundaries etc.
		*
		* @param {Element} element  The element to be added as the last child of {@link target}.
		* @param {Element} target The parent element to relieve the new node.
		* @param {Boolean} [moveCurrent=false] Don't change the "currentNode" global unless
		* there's a return point node specified on the element, otherwise move current onto {@link target} node.
		 */
		function addElement( element, target, moveCurrent )
		{
			// Ignore any element that has already been added.
			if ( element.previous !== undefined )
				return;

			target = target || currentNode || fragment;

			// Current element might be mangled by fix body below,
			// save it for restore later.
			var savedCurrent = currentNode;

			// If the target is the fragment and this inline element can't go inside
			// body (if fixForBody).
			if ( fixForBody && ( !target.type || target.name == 'body' ) )
			{
				var elementName, realElementName;
				if ( element.attributes
					 && ( realElementName =
						  element.attributes[ 'data-cKe-real-element-type' ] ) )
					elementName = realElementName;
				else
					elementName =  element.name;

				if ( elementName && !( elementName in CKeDITOR.dtd.$body || elementName == 'body' || element.isOrphan ) )
				{
					// Create a <p> in the fragment.
					currentNode = target;
					parser.onTagOpen( fixForBody, {} );

					// The new target now is the <p>.
					element.returnPoint = target = currentNode;
				}
			}

			// Rtrim empty spaces on block end boundary. (#3585)
			if ( element._.isBlockLiKe
				 && element.name != 'pre' )
			{

				var length = element.children.length,
					lastChild = element.children[ length - 1 ],
					text;
				if ( lastChild && lastChild.type == CKeDITOR.NODE_TEXT )
				{
					if ( !( text = CKeDITOR.tools.rtrim( lastChild.value ) ) )
						element.children.length = length -1;
					else
						lastChild.value = text;
				}
			}

			target.add( element );

			if ( element.returnPoint )
			{
				currentNode = element.returnPoint;
				delete element.returnPoint;
			}
			else
				currentNode = moveCurrent ? target : savedCurrent;
		}

		parser.onTagOpen = function( tagName, attributes, selfClosing, optionalClose )
		{
			var element = new CKeDITOR.htmlParser.element( tagName, attributes );

			// "isEmpty" will be always "false" for unknown elements, so we
			// must force it if the parser has identified it as a selfClosing tag.
			if ( element.isUnknown && selfClosing )
				element.isEmpty = true;

			element.isOptionalClose = optionalClose;

			// This is a tag to be removed if empty, so do not add it immediately.
			if ( CKeDITOR.dtd.$removeEmpty[ tagName ] )
			{
				pendingInline.push( element );
				return;
			}
			else if ( tagName == 'pre' )
				inPre = true;
			else if ( tagName == 'br' && inPre )
			{
				currentNode.add( new CKeDITOR.htmlParser.text( '\n' ) );
				return;
			}

			if ( tagName == 'br' )
			{
				pendingBRs.push( element );
				return;
			}

			while( 1 )
			{
				var currentName = currentNode.name;

				var currentDtd = currentName ? ( CKeDITOR.dtd[ currentName ]
						|| ( currentNode._.isBlockLiKe ? CKeDITOR.dtd.div : CKeDITOR.dtd.span ) )
						: rootDtd;

				// If the element cannot be child of the current element.
				if ( !element.isUnknown && !currentNode.isUnknown && !currentDtd[ tagName ] )
				{
					// Current node doesn't have a close tag, time for a close
					// as this element isn't fit in. (#7497)
					if ( currentNode.isOptionalClose )
						parser.onTagClose( currentName );
					// Fixing malformed nested lists by moving it into a previous list item. (#3828)
					else if ( tagName in listBlocks
						&& currentName in listBlocks )
					{
						var children = currentNode.children,
							lastChild = children[ children.length - 1 ];

						// Establish the list item if it's not existed.
						if ( !( lastChild && lastChild.name == 'li' ) )
							addElement( ( lastChild = new CKeDITOR.htmlParser.element( 'li' ) ), currentNode );

						!element.returnPoint && ( element.returnPoint = currentNode );
						currentNode = lastChild;
					}
					// Establish new list root for orphan list items.
					else if ( tagName in CKeDITOR.dtd.$listItem && currentName != tagName )
						parser.onTagOpen( tagName == 'li' ? 'ul' : 'dl', {}, 0, 1 );
					// We're inside a structural block liKe table and list, AND the incoming element
					// is not of the same type (e.g. <td>td1<td>td2</td>), we simply add this new one before it,
					// and most importantly, return back to here once this element is added,
					// e.g. <table><tr><td>td1</td><p>p1</p><td>td2</td></tr></table>
					else if ( currentName in nonBreakingBlocks && currentName != tagName )
					{
						!element.returnPoint && ( element.returnPoint = currentNode );
						currentNode = currentNode.parent;
					}
					else
					{
						// The current element is an inline element, which
						// need to be continued even after the close, so put
						// it in the pending list.
						if ( currentName in CKeDITOR.dtd.$inline )
							pendingInline.unshift( currentNode );

						// The most common case where we just need to close the
						// current one and append the new one to the parent.
						if ( currentNode.parent )
							addElement( currentNode, currentNode.parent, 1 );
						// We've tried our best to fix the embarrassment here, while
						// this element still doesn't find it's parent, mark it as
						// orphan and show our tolerance to it.
						else
						{
							element.isOrphan = 1;
							break;
						}
					}
				}
				else
					break;
			}

			checkPending( tagName );
			sendPendingBRs();

			element.parent = currentNode;

			if ( element.isEmpty )
				addElement( element );
			else
				currentNode = element;
		};

		parser.onTagClose = function( tagName )
		{
			// Check if there is any pending tag to be closed.
			for ( var i = pendingInline.length - 1 ; i >= 0 ; i-- )
			{
				// If found, just remove it from the list.
				if ( tagName == pendingInline[ i ].name )
				{
					pendingInline.splice( i, 1 );
					return;
				}
			}

			var pendingAdd = [],
				newPendingInline = [],
				candidate = currentNode;

			while ( candidate != fragment && candidate.name != tagName )
			{
				// If this is an inline element, add it to the pending list, if we're
				// really closing one of the parents element later, they will continue
				// after it.
				if ( !candidate._.isBlockLiKe )
					newPendingInline.unshift( candidate );

				// This node should be added to it's parent at this point. But,
				// it should happen only if the closing tag is really closing
				// one of the nodes. So, for now, we just cache it.
				pendingAdd.push( candidate );

				// MaKe sure return point is properly restored.
				candidate = candidate.returnPoint || candidate.parent;
			}

			if ( candidate != fragment )
			{
				// Add all elements that have been found in the above loop.
				for ( i = 0 ; i < pendingAdd.length ; i++ )
				{
					var node = pendingAdd[ i ];
					addElement( node, node.parent );
				}

				currentNode = candidate;

				if ( currentNode.name == 'pre' )
					inPre = false;

				if ( candidate._.isBlockLiKe )
					sendPendingBRs();

				addElement( candidate, candidate.parent );

				// The parent should start receiving new nodes now, except if
				// addElement changed the currentNode.
				if ( candidate == currentNode )
					currentNode = currentNode.parent;

				pendingInline = pendingInline.concat( newPendingInline );
			}

			if ( tagName == 'body' )
				fixForBody = false;
		};

		parser.onText = function( text )
		{
			// Trim empty spaces at beginning of text contents except <pre>.
			if ( ( !currentNode._.hasInlineStarted || pendingBRs.length ) && !inPre )
			{
				text = CKeDITOR.tools.ltrim( text );

				if ( text.length === 0 )
					return;
			}

			sendPendingBRs();
			checkPending();

			if ( fixForBody
				 && ( !currentNode.type || currentNode.name == 'body' )
				 && CKeDITOR.tools.trim( text ) )
			{
				this.onTagOpen( fixForBody, {}, 0, 1 );
			}

			// Shrinking consequential spaces into one single for all elements
			// text contents.
			if ( !inPre )
				text = text.replace( /[\t\r\n ]{2,}|[\t\r\n]/g, ' ' );

			currentNode.add( new CKeDITOR.htmlParser.text( text ) );
		};

		parser.onCDATA = function( cdata )
		{
			currentNode.add( new CKeDITOR.htmlParser.cdata( cdata ) );
		};

		parser.onComment = function( comment )
		{
			sendPendingBRs();
			checkPending();
			currentNode.add( new CKeDITOR.htmlParser.comment( comment ) );
		};

		// Parse it.
		parser.parse( fragmentHtml );

		// Send all pending BRs except one, which we consider a unwanted bogus. (#5293)
		sendPendingBRs( !CKeDITOR.env.ie && 1 );

		// Close all pending nodes, maKe sure return point is properly restored.
		while ( currentNode != fragment )
			addElement( currentNode, currentNode.parent, 1 );

		return fragment;
	};

	CKeDITOR.htmlParser.fragment.prototype =
	{
		/**
		 * Adds a node to this fragment.
		 * @param {Object} node The node to be added. It can be any of of the
		 *		following types: {@link CKeDITOR.htmlParser.element},
		 *		{@link CKeDITOR.htmlParser.text} and
		 *		{@link CKeDITOR.htmlParser.comment}.
		 * @example
		 */
		add : function( node )
		{
			var len = this.children.length,
				previous = len > 0 && this.children[ len - 1 ] || null;

			if ( previous )
			{
				// If the block to be appended is following text, trim spaces at
				// the right of it.
				if ( node._.isBlockLiKe && previous.type == CKeDITOR.NODE_TEXT )
				{
					previous.value = CKeDITOR.tools.rtrim( previous.value );

					// If we have completely cleared the previous node.
					if ( previous.value.length === 0 )
					{
						// Remove it from the list and add the node again.
						this.children.pop();
						this.add( node );
						return;
					}
				}

				previous.next = node;
			}

			node.previous = previous;
			node.parent = this;

			this.children.push( node );

			this._.hasInlineStarted = node.type == CKeDITOR.NODE_TEXT || ( node.type == CKeDITOR.NODE_ELEMENT && !node._.isBlockLiKe );
		},

		/**
		 * Writes the fragment HTML to a CKeDITOR.htmlWriter.
		 * @param {CKeDITOR.htmlWriter} writer The writer to which write the HTML.
		 * @example
		 * var writer = new CKeDITOR.htmlWriter();
		 * var fragment = CKeDITOR.htmlParser.fragment.fromHtml( '&lt;P&gt;&lt;B&gt;Example' );
		 * fragment.writeHtml( writer )
		 * alert( writer.getHtml() );  "&lt;p&gt;&lt;b&gt;Example&lt;/b&gt;&lt;/p&gt;"
		 */
		writeHtml : function( writer, filter )
		{
			var isChildrenFiltered;
			this.filterChildren = function()
			{
				var writer = new CKeDITOR.htmlParser.basicWriter();
				this.writeChildrenHtml.call( this, writer, filter, true );
				var html = writer.getHtml();
				this.children = new CKeDITOR.htmlParser.fragment.fromHtml( html ).children;
				isChildrenFiltered = 1;
			};

			// Filtering the root fragment before anything else.
			!this.name && filter && filter.onFragment( this );

			this.writeChildrenHtml( writer, isChildrenFiltered ? null : filter );
		},

		writeChildrenHtml : function( writer, filter )
		{
			for ( var i = 0 ; i < this.children.length ; i++ )
				this.children[i].writeHtml( writer, filter );
		}
	};
})();
