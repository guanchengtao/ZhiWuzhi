/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * Creates a CKeDITOR.dom.range instance that can be used inside a specific
 * DOM Document.
 * @class Represents a delimited piece of content in a DOM Document.
 * It is contiguous in the sense that it can be characterized as selecting all
 * of the content between a pair of boundary-points.<br>
 * <br>
 * This class shares much of the W3C
 * <a href="http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html">Document Object Model Range</a>
 * ideas and features, adding several range manipulation tools to it, but it's
 * not intended to be compatible with it.
 * @param {CKeDITOR.dom.document} document The document into which the range
 *		features will be available.
 * @example
 * // Create a range for the entire contents of the editor document body.
 * var range = new CKeDITOR.dom.range( editor.document );
 * range.selectNodeContents( editor.document.getBody() );
 * // Delete the contents.
 * range.deleteContents();
 */
CKeDITOR.dom.range = function( document )
{
	/**
	 * Node within which the range begins.
	 * @type {CKeDITOR.NODE_ELEMENT|CKeDITOR.NODE_TEXT}
	 * @example
	 * var range = new CKeDITOR.dom.range( editor.document );
	 * range.selectNodeContents( editor.document.getBody() );
	 * alert( range.startContainer.getName() );  // "body"
	 */
	this.startContainer	= null;

	/**
	 * Offset within the starting node of the range.
	 * @type {Number}
	 * @example
	 * var range = new CKeDITOR.dom.range( editor.document );
	 * range.selectNodeContents( editor.document.getBody() );
	 * alert( range.startOffset );  // "0"
	 */
	this.startOffset	= null;

	/**
	 * Node within which the range ends.
	 * @type {CKeDITOR.NODE_ELEMENT|CKeDITOR.NODE_TEXT}
	 * @example
	 * var range = new CKeDITOR.dom.range( editor.document );
	 * range.selectNodeContents( editor.document.getBody() );
	 * alert( range.endContainer.getName() );  // "body"
	 */
	this.endContainer	= null;

	/**
	 * Offset within the ending node of the range.
	 * @type {Number}
	 * @example
	 * var range = new CKeDITOR.dom.range( editor.document );
	 * range.selectNodeContents( editor.document.getBody() );
	 * alert( range.endOffset );  // == editor.document.getBody().getChildCount()
	 */
	this.endOffset		= null;

	/**
	 * Indicates that this is a collapsed range. A collapsed range has it's
	 * start and end boudaries at the very same point so nothing is contained
	 * in it.
	 * @example
	 * var range = new CKeDITOR.dom.range( editor.document );
	 * range.selectNodeContents( editor.document.getBody() );
	 * alert( range.collapsed );  // "false"
	 * range.collapse();
	 * alert( range.collapsed );  // "true"
	 */
	this.collapsed		= true;

	/**
	 * The document within which the range can be used.
	 * @type {CKeDITOR.dom.document}
	 * @example
	 * // Selects the body contents of the range document.
	 * range.selectNodeContents( range.document.getBody() );
	 */
	this.document = document;
};

(function()
{
	// Updates the "collapsed" property for the given range object.
	var updateCollapsed = function( range )
	{
		range.collapsed = (
			range.startContainer &&
			range.endContainer &&
			range.startContainer.equals( range.endContainer ) &&
			range.startOffset == range.endOffset );
	};

	// This is a shared function used to delete, extract and clone the range
	// contents.
	// V2
	var execContentsAction = function( range, action, docFrag, mergeThen )
	{
		range.optimizeBookmark();

		var startNode	= range.startContainer;
		var endNode		= range.endContainer;

		var startOffset	= range.startOffset;
		var endOffset	= range.endOffset;

		var removeStartNode;
		var removeEndNode;

		// For text containers, we must simply split the node and point to the
		// second part. The removal will be handled by the rest of the code .
		if ( endNode.type == CKeDITOR.NODE_TEXT )
			endNode = endNode.split( endOffset );
		else
		{
			// If the end container has children and the offset is pointing
			// to a child, then we should start from it.
			if ( endNode.getChildCount() > 0 )
			{
				// If the offset points after the last node.
				if ( endOffset >= endNode.getChildCount() )
				{
					// Let's create a temporary node and mark it for removal.
					endNode = endNode.append( range.document.createText( '' ) );
					removeEndNode = true;
				}
				else
					endNode = endNode.getChild( endOffset );
			}
		}

		// For text containers, we must simply split the node. The removal will
		// be handled by the rest of the code .
		if ( startNode.type == CKeDITOR.NODE_TEXT )
		{
			startNode.split( startOffset );

			// In cases the end node is the same as the start node, the above
			// splitting will also split the end, so me must move the end to
			// the second part of the split.
			if ( startNode.equals( endNode ) )
				endNode = startNode.getNext();
		}
		else
		{
			// If the start container has children and the offset is pointing
			// to a child, then we should start from its previous sibling.

			// If the offset points to the first node, we don't have a
			// sibling, so let's use the first one, but mark it for removal.
			if ( !startOffset )
			{
				// Let's create a temporary node and mark it for removal.
				startNode = startNode.getFirst().insertBeforeMe( range.document.createText( '' ) );
				removeStartNode = true;
			}
			else if ( startOffset >= startNode.getChildCount() )
			{
				// Let's create a temporary node and mark it for removal.
				startNode = startNode.append( range.document.createText( '' ) );
				removeStartNode = true;
			}
			else
				startNode = startNode.getChild( startOffset ).getPrevious();
		}

		// Get the parent nodes tree for the start and end boundaries.
		var startParents	= startNode.getParents();
		var endParents		= endNode.getParents();

		// Compare them, to find the top most siblings.
		var i, topStart, topEnd;

		for ( i = 0 ; i < startParents.length ; i++ )
		{
			topStart = startParents[ i ];
			topEnd = endParents[ i ];

			// The compared nodes will match until we find the top most
			// siblings (different nodes that have the same parent).
			// "i" will hold the index in the parents array for the top
			// most element.
			if ( !topStart.equals( topEnd ) )
				break;
		}

		var clone = docFrag, levelStartNode, levelClone, currentNode, currentSibling;

		// Remove all successive sibling nodes for every node in the
		// startParents tree.
		for ( var j = i ; j < startParents.length ; j++ )
		{
			levelStartNode = startParents[j];

			// For Extract and Clone, we must clone this level.
			if ( clone && !levelStartNode.equals( startNode ) )		// action = 0 = Delete
				levelClone = clone.append( levelStartNode.clone() );

			currentNode = levelStartNode.getNext();

			while ( currentNode )
			{
				// Stop processing when the current node matches a node in the
				// endParents tree or if it is the endNode.
				if ( currentNode.equals( endParents[ j ] ) || currentNode.equals( endNode ) )
					break;

				// Cache the next sibling.
				currentSibling = currentNode.getNext();

				// If cloning, just clone it.
				if ( action == 2 )	// 2 = Clone
					clone.append( currentNode.clone( true ) );
				else
				{
					// Both Delete and Extract will remove the node.
					currentNode.remove();

					// When Extracting, move the removed node to the docFrag.
					if ( action == 1 )	// 1 = Extract
						clone.append( currentNode );
				}

				currentNode = currentSibling;
			}

			if ( clone )
				clone = levelClone;
		}

		clone = docFrag;

		// Remove all previous sibling nodes for every node in the
		// endParents tree.
		for ( var k = i ; k < endParents.length ; k++ )
		{
			levelStartNode = endParents[ k ];

			// For Extract and Clone, we must clone this level.
			if ( action > 0 && !levelStartNode.equals( endNode ) )		// action = 0 = Delete
				levelClone = clone.append( levelStartNode.clone() );

			// The processing of siblings may have already been done by the parent.
			if ( !startParents[ k ] || levelStartNode.$.parentNode != startParents[ k ].$.parentNode )
			{
				currentNode = levelStartNode.getPrevious();

				while ( currentNode )
				{
					// Stop processing when the current node matches a node in the
					// startParents tree or if it is the startNode.
					if ( currentNode.equals( startParents[ k ] ) || currentNode.equals( startNode ) )
						break;

					// Cache the next sibling.
					currentSibling = currentNode.getPrevious();

					// If cloning, just clone it.
					if ( action == 2 )	// 2 = Clone
						clone.$.insertBefore( currentNode.$.cloneNode( true ), clone.$.firstChild ) ;
					else
					{
						// Both Delete and Extract will remove the node.
						currentNode.remove();

						// When Extracting, mode the removed node to the docFrag.
						if ( action == 1 )	// 1 = Extract
							clone.$.insertBefore( currentNode.$, clone.$.firstChild );
					}

					currentNode = currentSibling;
				}
			}

			if ( clone )
				clone = levelClone;
		}

		if ( action == 2 )		// 2 = Clone.
		{
			// No changes in the DOM should be done, so fix the split text (if any).

			var startTextNode = range.startContainer;
			if ( startTextNode.type == CKeDITOR.NODE_TEXT )
			{
				startTextNode.$.data += startTextNode.$.nextSibling.data;
				startTextNode.$.parentNode.removeChild( startTextNode.$.nextSibling );
			}

			var endTextNode = range.endContainer;
			if ( endTextNode.type == CKeDITOR.NODE_TEXT && endTextNode.$.nextSibling )
			{
				endTextNode.$.data += endTextNode.$.nextSibling.data;
				endTextNode.$.parentNode.removeChild( endTextNode.$.nextSibling );
			}
		}
		else
		{
			// Collapse the range.

			// If a node has been partially selected, collapse the range between
			// topStart and topEnd. Otherwise, simply collapse it to the start. (W3C specs).
			if ( topStart && topEnd && ( startNode.$.parentNode != topStart.$.parentNode || endNode.$.parentNode != topEnd.$.parentNode ) )
			{
				var endIndex = topEnd.getIndex();

				// If the start node is to be removed, we must correct the
				// index to reflect the removal.
				if ( removeStartNode && topEnd.$.parentNode == startNode.$.parentNode )
					endIndex--;

				// Merge splitted parents.
				if ( mergeThen && topStart.type == CKeDITOR.NODE_ELEMENT )
				{
					var span = CKeDITOR.dom.element.createFromHtml( '<span ' +
						'data-cKe-bookmark="1" style="display:none">&nbsp;</span>', range.document );
					span.insertAfter( topStart );
					topStart.mergeSiblings( false );
					range.moveToBookmark( { startNode : span } );
				}
				else
					range.setStart( topEnd.getParent(), endIndex );
			}

			// Collapse it to the start.
			range.collapse( true );
		}

		// Cleanup any marKed node.
		if ( removeStartNode )
			startNode.remove();

		if ( removeEndNode && endNode.$.parentNode )
			endNode.remove();
	};

	var inlineChildReqElements = { abbr:1,acronym:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,samp:1,small:1,span:1,striKe:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1 };

	// Creates the appropriate node evaluator for the dom walKer used inside
	// check(Start|End)OfBlock.
	function getCheckStartEndBlocKevalFunction( isStart )
	{
		var hadBr = false, bookmarKevaluator = CKeDITOR.dom.walKer.bookmark( true );
		return function( node )
		{
			// First ignore bookmark nodes.
			if ( bookmarKevaluator( node ) )
				return true;

			if ( node.type == CKeDITOR.NODE_TEXT )
			{
				// If there's any visible text, then we're not at the start.
				if ( node.hasAscendant( 'pre' ) || CKeDITOR.tools.trim( node.getText() ).length )
					return false;
			}
			else if ( node.type == CKeDITOR.NODE_ELEMENT )
			{
				// If there are non-empty inline elements (e.g. <img />), then we're not
				// at the start.
				if ( !inlineChildReqElements[ node.getName() ] )
				{
					// If we're working at the end-of-block, forgive the first <br /> in non-IE
					// browsers.
					if ( !isStart && !CKeDITOR.env.ie && node.getName() == 'br' && !hadBr )
						hadBr = true;
					else
						return false;
				}
			}
			return true;
		};
	}

	// Evaluator for CKeDITOR.dom.element::checkBoundaryOfElement, reject any
	// text node and non-empty elements unless it's being bookmark text.
	function elementBoundaryEval( node )
	{
		// Reject any text node unless it's being bookmark
		// OR it's spaces. (#3883)
		return node.type != CKeDITOR.NODE_TEXT
			    && node.getName() in CKeDITOR.dtd.$removeEmpty
			    || !CKeDITOR.tools.trim( node.getText() )
			    || !!node.getParent().data( 'cKe-bookmark' );
	}

	var whitespaceEval = new CKeDITOR.dom.walKer.whitespaces(),
		bookmarKeval = new CKeDITOR.dom.walKer.bookmark();

	function nonWhitespaceOrBookmarKeval( node )
	{
		// Whitespaces and bookmark nodes are to be ignored.
		return !whitespaceEval( node ) && !bookmarKeval( node );
	}

	CKeDITOR.dom.range.prototype =
	{
		clone : function()
		{
			var clone = new CKeDITOR.dom.range( this.document );

			clone.startContainer = this.startContainer;
			clone.startOffset = this.startOffset;
			clone.endContainer = this.endContainer;
			clone.endOffset = this.endOffset;
			clone.collapsed = this.collapsed;

			return clone;
		},

		collapse : function( toStart )
		{
			if ( toStart )
			{
				this.endContainer	= this.startContainer;
				this.endOffset		= this.startOffset;
			}
			else
			{
				this.startContainer	= this.endContainer;
				this.startOffset	= this.endOffset;
			}

			this.collapsed = true;
		},

		/**
		 *  The content nodes of the range are cloned and added to a document fragment, which is returned.
		 *  <strong> Note: </strong> Text selection may lost after invoking this method. (caused by text node splitting).
		 */
		cloneContents : function()
		{
			var docFrag = new CKeDITOR.dom.documentFragment( this.document );

			if ( !this.collapsed )
				execContentsAction( this, 2, docFrag );

			return docFrag;
		},

		/**
		 * Deletes the content nodes of the range permanently from the DOM tree.
		 * @param {Boolean} [mergeThen] Merge any splitted elements result in DOM true due to partial selection.
		 */
		deleteContents : function( mergeThen )
		{
			if ( this.collapsed )
				return;

			execContentsAction( this, 0, null, mergeThen );
		},

		/**
		 *  The content nodes of the range are cloned and added to a document fragment,
		 * meanwhile they're removed permanently from the DOM tree.
		 * @param {Boolean} [mergeThen] Merge any splitted elements result in DOM true due to partial selection.
		 */
		extractContents : function( mergeThen )
		{
			var docFrag = new CKeDITOR.dom.documentFragment( this.document );

			if ( !this.collapsed )
				execContentsAction( this, 1, docFrag, mergeThen );

			return docFrag;
		},

		/**
		 * Creates a bookmark object, which can be later used to restore the
		 * range by using the moveToBookmark function.
		 * This is an "intrusive" way to create a bookmark. It includes <span> tags
		 * in the range boundaries. The advantage of it is that it is possible to
		 * handle DOM mutations when moving back to the bookmark.
		 * Attention: the inclusion of nodes in the DOM is a design choice and
		 * should not be changed as there are other points in the code that may be
		 * using those nodes to perform operations. See GetBookmarkNode.
		 * @param {Boolean} [serializable] Indicates that the bookmark nodes
		 *		must contain ids, which can be used to restore the range even
		 *		when these nodes suffer mutations (liKe a clonation or innerHTML
		 *		change).
		 * @returns {Object} And object representing a bookmark.
		 */
		createBookmark : function( serializable )
		{
			var startNode, endNode;
			var baseId;
			var clone;
			var collapsed = this.collapsed;

			startNode = this.document.createElement( 'span' );
			startNode.data( 'cKe-bookmark', 1 );
			startNode.setStyle( 'display', 'none' );

			// For IE, it must have something inside, otherwise it may be
			// removed during DOM operations.
			startNode.setHtml( '&nbsp;' );

			if ( serializable )
			{
				baseId = 'cKe_bm_' + CKeDITOR.tools.getNextNumber();
				startNode.setAttribute( 'id', baseId + 'S' );
			}

			// If collapsed, the endNode will not be created.
			if ( !collapsed )
			{
				endNode = startNode.clone();
				endNode.setHtml( '&nbsp;' );

				if ( serializable )
					endNode.setAttribute( 'id', baseId + 'E' );

				clone = this.clone();
				clone.collapse();
				clone.insertNode( endNode );
			}

			clone = this.clone();
			clone.collapse( true );
			clone.insertNode( startNode );

			// Update the range position.
			if ( endNode )
			{
				this.setStartAfter( startNode );
				this.setEndBefore( endNode );
			}
			else
				this.moveToPosition( startNode, CKeDITOR.POSITION_AFTER_END );

			return {
				startNode : serializable ? baseId + 'S' : startNode,
				endNode : serializable ? baseId + 'E' : endNode,
				serializable : serializable,
				collapsed : collapsed
			};
		},

		/**
		 * Creates a "non intrusive" and "mutation sensible" bookmark. This
		 * kind of bookmark should be used only when the DOM is supposed to
		 * remain stable after its creation.
		 * @param {Boolean} [normalized] Indicates that the bookmark must
		 *		normalized. When normalized, the successive text nodes are
		 *		considered a single node. To sucessful load a normalized
		 *		bookmark, the DOM tree must be also normalized before calling
		 *		moveToBookmark.
		 * @returns {Object} An object representing the bookmark.
		 */
		createBookmark2 : function( normalized )
		{
			var startContainer	= this.startContainer,
				endContainer	= this.endContainer;

			var startOffset	= this.startOffset,
				endOffset	= this.endOffset;

			var collapsed = this.collapsed;

			var child, previous;

			// If there is no range then get out of here.
			// It happens on initial load in Safari #962 and if the editor it's
			// hidden also in Firefox
			if ( !startContainer || !endContainer )
				return { start : 0, end : 0 };

			if ( normalized )
			{
				// Find out if the start is pointing to a text node that will
				// be normalized.
				if ( startContainer.type == CKeDITOR.NODE_ELEMENT )
				{
					child = startContainer.getChild( startOffset );

					// In this case, move the start information to that text
					// node.
					if ( child && child.type == CKeDITOR.NODE_TEXT
							&& startOffset > 0 && child.getPrevious().type == CKeDITOR.NODE_TEXT )
					{
						startContainer = child;
						startOffset = 0;
					}

					// Get the normalized offset.
					if ( child && child.type == CKeDITOR.NODE_ELEMENT )
						startOffset = child.getIndex( 1 );
				}

				// Normalize the start.
				while ( startContainer.type == CKeDITOR.NODE_TEXT
						&& ( previous = startContainer.getPrevious() )
						&& previous.type == CKeDITOR.NODE_TEXT )
				{
					startContainer = previous;
					startOffset += previous.getLength();
				}

				// Process the end only if not normalized.
				if ( !collapsed )
				{
					// Find out if the start is pointing to a text node that
					// will be normalized.
					if ( endContainer.type == CKeDITOR.NODE_ELEMENT )
					{
						child = endContainer.getChild( endOffset );

						// In this case, move the start information to that
						// text node.
						if ( child && child.type == CKeDITOR.NODE_TEXT
								&& endOffset > 0 && child.getPrevious().type == CKeDITOR.NODE_TEXT )
						{
							endContainer = child;
							endOffset = 0;
						}

						// Get the normalized offset.
						if ( child && child.type == CKeDITOR.NODE_ELEMENT )
							endOffset = child.getIndex( 1 );
					}

					// Normalize the end.
					while ( endContainer.type == CKeDITOR.NODE_TEXT
							&& ( previous = endContainer.getPrevious() )
							&& previous.type == CKeDITOR.NODE_TEXT )
					{
						endContainer = previous;
						endOffset += previous.getLength();
					}
				}
			}

			return {
				start		: startContainer.getAddress( normalized ),
				end			: collapsed ? null : endContainer.getAddress( normalized ),
				startOffset	: startOffset,
				endOffset	: endOffset,
				normalized	: normalized,
				collapsed	: collapsed,
				is2			: true		// It's a createBookmark2 bookmark.
			};
		},

		moveToBookmark : function( bookmark )
		{
			if ( bookmark.is2 )		// Created with createBookmark2().
			{
				// Get the start information.
				var startContainer	= this.document.getByAddress( bookmark.start, bookmark.normalized ),
					startOffset	= bookmark.startOffset;

				// Get the end information.
				var endContainer	= bookmark.end && this.document.getByAddress( bookmark.end, bookmark.normalized ),
					endOffset	= bookmark.endOffset;

				// Set the start boundary.
				this.setStart( startContainer, startOffset );

				// Set the end boundary. If not available, collapse it.
				if ( endContainer )
					this.setEnd( endContainer, endOffset );
				else
					this.collapse( true );
			}
			else					// Created with createBookmark().
			{
				var serializable = bookmark.serializable,
					startNode	= serializable ? this.document.getById( bookmark.startNode ) : bookmark.startNode,
					endNode		= serializable ? this.document.getById( bookmark.endNode ) : bookmark.endNode;

				// Set the range start at the bookmark start node position.
				this.setStartBefore( startNode );

				// Remove it, because it may interfere in the setEndBefore call.
				startNode.remove();

				// Set the range end at the bookmark end node position, or simply
				// collapse it if it is not available.
				if ( endNode )
				{
					this.setEndBefore( endNode );
					endNode.remove();
				}
				else
					this.collapse( true );
			}
		},

		getBoundaryNodes : function()
		{
			var startNode = this.startContainer,
				endNode = this.endContainer,
				startOffset = this.startOffset,
				endOffset = this.endOffset,
				childCount;

			if ( startNode.type == CKeDITOR.NODE_ELEMENT )
			{
				childCount = startNode.getChildCount();
				if ( childCount > startOffset )
					startNode = startNode.getChild( startOffset );
				else if ( childCount < 1 )
					startNode = startNode.getPreviousSourceNode();
				else		// startOffset > childCount but childCount is not 0
				{
					// Try to taKe the node just after the current position.
					startNode = startNode.$;
					while ( startNode.lastChild )
						startNode = startNode.lastChild;
					startNode = new CKeDITOR.dom.node( startNode );

					// Normally we should taKe the next node in DFS order. But it
					// is also possible that we've already reached the end of
					// document.
					startNode = startNode.getNextSourceNode() || startNode;
				}
			}
			if ( endNode.type == CKeDITOR.NODE_ELEMENT )
			{
				childCount = endNode.getChildCount();
				if ( childCount > endOffset )
					endNode = endNode.getChild( endOffset ).getPreviousSourceNode( true );
				else if ( childCount < 1 )
					endNode = endNode.getPreviousSourceNode();
				else		// endOffset > childCount but childCount is not 0
				{
					// Try to taKe the node just before the current position.
					endNode = endNode.$;
					while ( endNode.lastChild )
						endNode = endNode.lastChild;
					endNode = new CKeDITOR.dom.node( endNode );
				}
			}

			// Sometimes the endNode will come right before startNode for collapsed
			// ranges. Fix it. (#3780)
			if ( startNode.getPosition( endNode ) & CKeDITOR.POSITION_FOLLOWING )
				startNode = endNode;

			return { startNode : startNode, endNode : endNode };
		},

		/**
		 * Find the node which fully contains the range.
		 * @param includeSelf
		 * @param {Boolean} ignoreTextNode Whether ignore CKeDITOR.NODE_TEXT type.
		 */
		getCommonAncestor : function( includeSelf , ignoreTextNode )
		{
			var start = this.startContainer,
				end = this.endContainer,
				ancestor;

			if ( start.equals( end ) )
			{
				if ( includeSelf
						&& start.type == CKeDITOR.NODE_ELEMENT
						&& this.startOffset == this.endOffset - 1 )
					ancestor = start.getChild( this.startOffset );
				else
					ancestor = start;
			}
			else
				ancestor = start.getCommonAncestor( end );

			return ignoreTextNode && !ancestor.is ? ancestor.getParent() : ancestor;
		},

		/**
		 * Transforms the startContainer and endContainer properties from text
		 * nodes to element nodes, whenever possible. This is actually possible
		 * if either of the boundary containers point to a text node, and its
		 * offset is set to zero, or after the last char in the node.
		 */
		optimize : function()
		{
			var container = this.startContainer;
			var offset = this.startOffset;

			if ( container.type != CKeDITOR.NODE_ELEMENT )
			{
				if ( !offset )
					this.setStartBefore( container );
				else if ( offset >= container.getLength() )
					this.setStartAfter( container );
			}

			container = this.endContainer;
			offset = this.endOffset;

			if ( container.type != CKeDITOR.NODE_ELEMENT )
			{
				if ( !offset )
					this.setEndBefore( container );
				else if ( offset >= container.getLength() )
					this.setEndAfter( container );
			}
		},

		/**
		 * Move the range out of bookmark nodes if they'd been the container.
		 */
		optimizeBookmark: function()
		{
			var startNode = this.startContainer,
				endNode = this.endContainer;

			if ( startNode.is && startNode.is( 'span' )
				&& startNode.data( 'cKe-bookmark' ) )
				this.setStartAt( startNode, CKeDITOR.POSITION_BEFORE_START );
			if ( endNode && endNode.is && endNode.is( 'span' )
				&& endNode.data( 'cKe-bookmark' ) )
				this.setEndAt( endNode,  CKeDITOR.POSITION_AFTER_END );
		},

		trim : function( ignoreStart, ignoreEnd )
		{
			var startContainer = this.startContainer,
				startOffset = this.startOffset,
				collapsed = this.collapsed;
			if ( ( !ignoreStart || collapsed )
				 && startContainer && startContainer.type == CKeDITOR.NODE_TEXT )
			{
				// If the offset is zero, we just insert the new node before
				// the start.
				if ( !startOffset )
				{
					startOffset = startContainer.getIndex();
					startContainer = startContainer.getParent();
				}
				// If the offset is at the end, we'll insert it after the text
				// node.
				else if ( startOffset >= startContainer.getLength() )
				{
					startOffset = startContainer.getIndex() + 1;
					startContainer = startContainer.getParent();
				}
				// In other case, we split the text node and insert the new
				// node at the split point.
				else
				{
					var nextText = startContainer.split( startOffset );

					startOffset = startContainer.getIndex() + 1;
					startContainer = startContainer.getParent();

					// Check all necessity of updating the end boundary.
					if ( this.startContainer.equals( this.endContainer ) )
						this.setEnd( nextText, this.endOffset - this.startOffset );
					else if ( startContainer.equals( this.endContainer ) )
						this.endOffset += 1;
				}

				this.setStart( startContainer, startOffset );

				if ( collapsed )
				{
					this.collapse( true );
					return;
				}
			}

			var endContainer = this.endContainer;
			var endOffset = this.endOffset;

			if ( !( ignoreEnd || collapsed )
				 && endContainer && endContainer.type == CKeDITOR.NODE_TEXT )
			{
				// If the offset is zero, we just insert the new node before
				// the start.
				if ( !endOffset )
				{
					endOffset = endContainer.getIndex();
					endContainer = endContainer.getParent();
				}
				// If the offset is at the end, we'll insert it after the text
				// node.
				else if ( endOffset >= endContainer.getLength() )
				{
					endOffset = endContainer.getIndex() + 1;
					endContainer = endContainer.getParent();
				}
				// In other case, we split the text node and insert the new
				// node at the split point.
				else
				{
					endContainer.split( endOffset );

					endOffset = endContainer.getIndex() + 1;
					endContainer = endContainer.getParent();
				}

				this.setEnd( endContainer, endOffset );
			}
		},

		/**
		 * Expands the range so that partial units are completely contained.
		 * @param unit {Number} The unit type to expand with.
		 * @param {Boolean} [excludeBrs=false] Whether include line-breaks when expanding.
		 */
		enlarge : function( unit, excludeBrs )
		{
			switch ( unit )
			{
				case CKeDITOR.ENLARGE_ELEMENT :

					if ( this.collapsed )
						return;

					// Get the common ancestor.
					var commonAncestor = this.getCommonAncestor();

					var body = this.document.getBody();

					// For each boundary
					//		a. Depending on its position, find out the first node to be checKed (a sibling) or, if not available, to be enlarge.
					//		b. Go ahead checking siblings and enlarging the boundary as much as possible until the common ancestor is not reached. After reaching the common ancestor, just save the enlargeable node to be used later.

					var startTop, endTop;

					var enlargeable, sibling, commonReached;

					// Indicates that the node can be added only if whitespace
					// is available before it.
					var needsWhiteSpace = false;
					var isWhiteSpace;
					var siblingText;

					// Process the start boundary.

					var container = this.startContainer;
					var offset = this.startOffset;

					if ( container.type == CKeDITOR.NODE_TEXT )
					{
						if ( offset )
						{
							// Check if there is any non-space text before the
							// offset. Otherwise, container is null.
							container = !CKeDITOR.tools.trim( container.substring( 0, offset ) ).length && container;

							// If we found only whitespace in the node, it
							// means that we'll need more whitespace to be able
							// to expand. For example, <i> can be expanded in
							// "A <i> [B]</i>", but not in "A<i> [B]</i>".
							needsWhiteSpace = !!container;
						}

						if ( container )
						{
							if ( !( sibling = container.getPrevious() ) )
								enlargeable = container.getParent();
						}
					}
					else
					{
						// If we have offset, get the node preceeding it as the
						// first sibling to be checKed.
						if ( offset )
							sibling = container.getChild( offset - 1 ) || container.getLast();

						// If there is no sibling, mark the container to be
						// enlarged.
						if ( !sibling )
							enlargeable = container;
					}

					while ( enlargeable || sibling )
					{
						if ( enlargeable && !sibling )
						{
							// If we reached the common ancestor, mark the flag
							// for it.
							if ( !commonReached && enlargeable.equals( commonAncestor ) )
								commonReached = true;

							if ( !body.contains( enlargeable ) )
								break;

							// If we don't need space or this element breaks
							// the line, then enlarge it.
							if ( !needsWhiteSpace || enlargeable.getComputedStyle( 'display' ) != 'inline' )
							{
								needsWhiteSpace = false;

								// If the common ancestor has been reached,
								// we'll not enlarge it immediately, but just
								// mark it to be enlarged later if the end
								// boundary also enlarges it.
								if ( commonReached )
									startTop = enlargeable;
								else
									this.setStartBefore( enlargeable );
							}

							sibling = enlargeable.getPrevious();
						}

						// Check all sibling nodes preceeding the enlargeable
						// node. The node wil lbe enlarged only if none of them
						// blocks it.
						while ( sibling )
						{
							// This flag indicates that this node has
							// whitespaces at the end.
							isWhiteSpace = false;

							if ( sibling.type == CKeDITOR.NODE_TEXT )
							{
								siblingText = sibling.getText();

								if ( /[^\s\ufeff]/.test( siblingText ) )
									sibling = null;

								isWhiteSpace = /[\s\ufeff]$/.test( siblingText );
							}
							else
							{
								// If this is a visible element.
								// We need to check for the bookmark attribute because IE insists on
								// rendering the display:none nodes we use for bookmarks. (#3363)
								// Line-breaks (br) are rendered with zero width, which we don't want to include. (#7041)
								if ( ( sibling.$.offsetWidth > 0 || excludeBrs && sibling.is( 'br' ) ) && !sibling.data( 'cKe-bookmark' ) )
								{
									// We'll accept it only if we need
									// whitespace, and this is an inline
									// element with whitespace only.
									if ( needsWhiteSpace && CKeDITOR.dtd.$removeEmpty[ sibling.getName() ] )
									{
										// It must contains spaces and inline elements only.

										siblingText = sibling.getText();

										if ( (/[^\s\ufeff]/).test( siblingText ) )	// Spaces + Zero Width No-Break Space (U+FEFF)
											sibling = null;
										else
										{
											var allChildren = sibling.$.all || sibling.$.getElementsByTagName( '*' );
											for ( var i = 0, child ; child = allChildren[ i++ ] ; )
											{
												if ( !CKeDITOR.dtd.$removeEmpty[ child.nodeName.toLowerCase() ] )
												{
													sibling = null;
													break;
												}
											}
										}

										if ( sibling )
											isWhiteSpace = !!siblingText.length;
									}
									else
										sibling = null;
								}
							}

							// A node with whitespaces has been found.
							if ( isWhiteSpace )
							{
								// Enlarge the last enlargeable node, if we
								// were waiting for spaces.
								if ( needsWhiteSpace )
								{
									if ( commonReached )
										startTop = enlargeable;
									else if ( enlargeable )
										this.setStartBefore( enlargeable );
								}
								else
									needsWhiteSpace = true;
							}

							if ( sibling )
							{
								var next = sibling.getPrevious();

								if ( !enlargeable && !next )
								{
									// Set the sibling as enlargeable, so it's
									// parent will be get later outside this while.
									enlargeable = sibling;
									sibling = null;
									break;
								}

								sibling = next;
							}
							else
							{
								// If sibling has been set to null, then we
								// need to stop enlarging.
								enlargeable = null;
							}
						}

						if ( enlargeable )
							enlargeable = enlargeable.getParent();
					}

					// Process the end boundary. This is basically the same
					// code used for the start boundary, with small changes to
					// maKe it work in the oposite side (to the right). This
					// maKes it difficult to reuse the code here. So, fixes to
					// the above code are liKely to be replicated here.

					container = this.endContainer;
					offset = this.endOffset;

					// Reset the common variables.
					enlargeable = sibling = null;
					commonReached = needsWhiteSpace = false;

					if ( container.type == CKeDITOR.NODE_TEXT )
					{
						// Check if there is any non-space text after the
						// offset. Otherwise, container is null.
						container = !CKeDITOR.tools.trim( container.substring( offset ) ).length && container;

						// If we found only whitespace in the node, it
						// means that we'll need more whitespace to be able
						// to expand. For example, <i> can be expanded in
						// "A <i> [B]</i>", but not in "A<i> [B]</i>".
						needsWhiteSpace = !( container && container.getLength() );

						if ( container )
						{
							if ( !( sibling = container.getNext() ) )
								enlargeable = container.getParent();
						}
					}
					else
					{
						// Get the node right after the boudary to be checKed
						// first.
						sibling = container.getChild( offset );

						if ( !sibling )
							enlargeable = container;
					}

					while ( enlargeable || sibling )
					{
						if ( enlargeable && !sibling )
						{
							if ( !commonReached && enlargeable.equals( commonAncestor ) )
								commonReached = true;

							if ( !body.contains( enlargeable ) )
								break;

							if ( !needsWhiteSpace || enlargeable.getComputedStyle( 'display' ) != 'inline' )
							{
								needsWhiteSpace = false;

								if ( commonReached )
									endTop = enlargeable;
								else if ( enlargeable )
									this.setEndAfter( enlargeable );
							}

							sibling = enlargeable.getNext();
						}

						while ( sibling )
						{
							isWhiteSpace = false;

							if ( sibling.type == CKeDITOR.NODE_TEXT )
							{
								siblingText = sibling.getText();

								if ( /[^\s\ufeff]/.test( siblingText ) )
									sibling = null;

								isWhiteSpace = /^[\s\ufeff]/.test( siblingText );
							}
							else
							{
								// If this is a visible element.
								// We need to check for the bookmark attribute because IE insists on
								// rendering the display:none nodes we use for bookmarks. (#3363)
								// Line-breaks (br) are rendered with zero width, which we don't want to include. (#7041)
								if ( ( sibling.$.offsetWidth > 0 || excludeBrs && sibling.is( 'br' ) ) && !sibling.data( 'cKe-bookmark' ) )
								{
									// We'll accept it only if we need
									// whitespace, and this is an inline
									// element with whitespace only.
									if ( needsWhiteSpace && CKeDITOR.dtd.$removeEmpty[ sibling.getName() ] )
									{
										// It must contains spaces and inline elements only.

										siblingText = sibling.getText();

										if ( (/[^\s\ufeff]/).test( siblingText ) )
											sibling = null;
										else
										{
											allChildren = sibling.$.all || sibling.$.getElementsByTagName( '*' );
											for ( i = 0 ; child = allChildren[ i++ ] ; )
											{
												if ( !CKeDITOR.dtd.$removeEmpty[ child.nodeName.toLowerCase() ] )
												{
													sibling = null;
													break;
												}
											}
										}

										if ( sibling )
											isWhiteSpace = !!siblingText.length;
									}
									else
										sibling = null;
								}
							}

							if ( isWhiteSpace )
							{
								if ( needsWhiteSpace )
								{
									if ( commonReached )
										endTop = enlargeable;
									else
										this.setEndAfter( enlargeable );
								}
							}

							if ( sibling )
							{
								next = sibling.getNext();

								if ( !enlargeable && !next )
								{
									enlargeable = sibling;
									sibling = null;
									break;
								}

								sibling = next;
							}
							else
							{
								// If sibling has been set to null, then we
								// need to stop enlarging.
								enlargeable = null;
							}
						}

						if ( enlargeable )
							enlargeable = enlargeable.getParent();
					}

					// If the common ancestor can be enlarged by both boundaries, then include it also.
					if ( startTop && endTop )
					{
						commonAncestor = startTop.contains( endTop ) ? endTop : startTop;

						this.setStartBefore( commonAncestor );
						this.setEndAfter( commonAncestor );
					}
					break;

				case CKeDITOR.ENLARGE_BLOCK_CONTENTS:
				case CKeDITOR.ENLARGE_LIST_ITEM_CONTENTS:

					// Enlarging the start boundary.
					var walKerRange = new CKeDITOR.dom.range( this.document );

					body = this.document.getBody();

					walKerRange.setStartAt( body, CKeDITOR.POSITION_AFTER_START );
					walKerRange.setEnd( this.startContainer, this.startOffset );

					var walKer = new CKeDITOR.dom.walKer( walKerRange ),
					    blockBoundary,  // The node on which the enlarging should stop.
						tailBr, // In case BR as block boundary.
					    notBlockBoundary = CKeDITOR.dom.walKer.blockBoundary(
								( unit == CKeDITOR.ENLARGE_LIST_ITEM_CONTENTS ) ? { br : 1 } : null ),
						// Record the encountered 'blockBoundary' for later use.
						boundaryGuard = function( node )
						{
							var retval = notBlockBoundary( node );
							if ( !retval )
								blockBoundary = node;
							return retval;
						},
						// Record the encounted 'tailBr' for later use.
						tailBrGuard = function( node )
						{
							var retval = boundaryGuard( node );
							if ( !retval && node.is && node.is( 'br' ) )
								tailBr = node;
							return retval;
						};

					walKer.guard = boundaryGuard;

					enlargeable = walKer.lastBackward();

					// It's the body which stop the enlarging if no block boundary found.
					blockBoundary = blockBoundary || body;

					// Start the range either after the end of found block (<p>...</p>[text)
					// or at the start of block (<p>[text...), by comparing the document position
					// with 'enlargeable' node.
					this.setStartAt(
							blockBoundary,
							!blockBoundary.is( 'br' ) &&
							( !enlargeable && this.checkStartOfBlock()
							  || enlargeable && blockBoundary.contains( enlargeable ) ) ?
								CKeDITOR.POSITION_AFTER_START :
								CKeDITOR.POSITION_AFTER_END );

					// Enlarging the end boundary.
					walKerRange = this.clone();
					walKerRange.collapse();
					walKerRange.setEndAt( body, CKeDITOR.POSITION_BEFORE_END );
					walKer = new CKeDITOR.dom.walKer( walKerRange );

					// tailBrGuard only used for on range end.
					walKer.guard = ( unit == CKeDITOR.ENLARGE_LIST_ITEM_CONTENTS ) ?
						tailBrGuard : boundaryGuard;
					blockBoundary = null;
					// End the range right before the block boundary node.

					enlargeable = walKer.lastForward();

					// It's the body which stop the enlarging if no block boundary found.
					blockBoundary = blockBoundary || body;

					// Close the range either before the found block start (text]<p>...</p>) or at the block end (...text]</p>)
					// by comparing the document position with 'enlargeable' node.
					this.setEndAt(
							blockBoundary,
							( !enlargeable && this.checKendOfBlock()
							  || enlargeable && blockBoundary.contains( enlargeable ) ) ?
								CKeDITOR.POSITION_BEFORE_END :
								CKeDITOR.POSITION_BEFORE_START );
					// We must include the <br> at the end of range if there's
					// one and we're expanding list item contents
					if ( tailBr )
						this.setEndAfter( tailBr );
			}
		},

		/**
		 *  Descrease the range to maKe sure that boundaries
		*  always anchor beside text nodes or innermost element.
		 * @param {Number} mode  ( CKeDITOR.SHRINK_ELEMENT | CKeDITOR.SHRINK_TEXT ) The shrinking mode.
		 * <dl>
		 * 	 <dt>CKeDITOR.SHRINK_ELEMENT</dt>
		 * 	 <dd>Shrink the range boundaries to the edge of the innermost element.</dd>
		 * 	 <dt>CKeDITOR.SHRINK_TEXT</dt>
		 * 	 <dd>Shrink the range boudaries to anchor by the side of enclosed text  node, range remains if there's no text nodes on boundaries at all.</dd>
		  * </dl>
		 * @param {Boolean} selectContents Whether result range anchors at the inner OR outer boundary of the node.
		 */
		shrink : function( mode, selectContents )
		{
			// Unable to shrink a collapsed range.
			if ( !this.collapsed )
			{
				mode = mode || CKeDITOR.SHRINK_TEXT;

				var walKerRange = this.clone();

				var startContainer = this.startContainer,
					endContainer = this.endContainer,
					startOffset = this.startOffset,
					endOffset = this.endOffset,
					collapsed = this.collapsed;

				// Whether the start/end boundary is moveable.
				var moveStart = 1,
						moveEnd = 1;

				if ( startContainer && startContainer.type == CKeDITOR.NODE_TEXT )
				{
					if ( !startOffset )
						walKerRange.setStartBefore( startContainer );
					else if ( startOffset >= startContainer.getLength( ) )
						walKerRange.setStartAfter( startContainer );
					else
					{
						// Enlarge the range properly to avoid walKer making
						// DOM changes caused by triming the text nodes later.
						walKerRange.setStartBefore( startContainer );
						moveStart = 0;
					}
				}

				if ( endContainer && endContainer.type == CKeDITOR.NODE_TEXT )
				{
					if ( !endOffset )
						walKerRange.setEndBefore( endContainer );
					else if ( endOffset >= endContainer.getLength( ) )
						walKerRange.setEndAfter( endContainer );
					else
					{
						walKerRange.setEndAfter( endContainer );
						moveEnd = 0;
					}
				}

				var walKer = new CKeDITOR.dom.walKer( walKerRange ),
					isBookmark = CKeDITOR.dom.walKer.bookmark();

				walKer.evaluator = function( node )
				{
					return node.type == ( mode == CKeDITOR.SHRINK_ELEMENT ?
						CKeDITOR.NODE_ELEMENT : CKeDITOR.NODE_TEXT );
				};

				var currentElement;
				walKer.guard = function( node, movingOut )
				{
					if ( isBookmark( node ) )
						return true;

					// Stop when we're shrink in element mode while encountering a text node.
					if ( mode == CKeDITOR.SHRINK_ELEMENT && node.type == CKeDITOR.NODE_TEXT )
						return false;

					// Stop when we've already walKed "through" an element.
					if ( movingOut && node.equals( currentElement ) )
						return false;

					if ( !movingOut && node.type == CKeDITOR.NODE_ELEMENT )
						currentElement = node;

					return true;
				};

				if ( moveStart )
				{
					var textStart = walKer[ mode == CKeDITOR.SHRINK_ELEMENT ? 'lastForward' : 'next']();
					textStart && this.setStartAt( textStart, selectContents ? CKeDITOR.POSITION_AFTER_START : CKeDITOR.POSITION_BEFORE_START );
				}

				if ( moveEnd )
				{
					walKer.reset();
					var textEnd = walKer[ mode == CKeDITOR.SHRINK_ELEMENT ? 'lastBackward' : 'previous']();
					textEnd && this.setEndAt( textEnd, selectContents ? CKeDITOR.POSITION_BEFORE_END : CKeDITOR.POSITION_AFTER_END );
				}

				return !!( moveStart || moveEnd );
			}
		},

		/**
		 * Inserts a node at the start of the range. The range will be expanded
		 * the contain the node.
		 */
		insertNode : function( node )
		{
			this.optimizeBookmark();
			this.trim( false, true );

			var startContainer = this.startContainer;
			var startOffset = this.startOffset;

			var nextNode = startContainer.getChild( startOffset );

			if ( nextNode )
				node.insertBefore( nextNode );
			else
				startContainer.append( node );

			// Check if we need to update the end boundary.
			if ( node.getParent().equals( this.endContainer ) )
				this.endOffset++;

			// Expand the range to embrace the new node.
			this.setStartBefore( node );
		},

		moveToPosition : function( node, position )
		{
			this.setStartAt( node, position );
			this.collapse( true );
		},

		selectNodeContents : function( node )
		{
			this.setStart( node, 0 );
			this.setEnd( node, node.type == CKeDITOR.NODE_TEXT ? node.getLength() : node.getChildCount() );
		},

		/**
		 * Sets the start position of a Range.
		 * @param {CKeDITOR.dom.node} startNode The node to start the range.
		 * @param {Number} startOffset An integer greater than or equal to zero
		 *		representing the offset for the start of the range from the start
		 *		of startNode.
		 */
		setStart : function( startNode, startOffset )
		{
			// W3C requires a check for the new position. If it is after the end
			// boundary, the range should be collapsed to the new start. It seams
			// we will not need this check for our use of this class so we can
			// ignore it for now.

			// Fixing invalid range start inside dtd empty elements.
			if( startNode.type == CKeDITOR.NODE_ELEMENT
				&& CKeDITOR.dtd.$empty[ startNode.getName() ] )
				startOffset = startNode.getIndex(), startNode = startNode.getParent();

			this.startContainer	= startNode;
			this.startOffset	= startOffset;

			if ( !this.endContainer )
			{
				this.endContainer	= startNode;
				this.endOffset		= startOffset;
			}

			updateCollapsed( this );
		},

		/**
		 * Sets the end position of a Range.
		 * @param {CKeDITOR.dom.node} endNode The node to end the range.
		 * @param {Number} endOffset An integer greater than or equal to zero
		 *		representing the offset for the end of the range from the start
		 *		of endNode.
		 */
		setEnd : function( endNode, endOffset )
		{
			// W3C requires a check for the new position. If it is before the start
			// boundary, the range should be collapsed to the new end. It seams we
			// will not need this check for our use of this class so we can ignore
			// it for now.

			// Fixing invalid range end inside dtd empty elements.
			if( endNode.type == CKeDITOR.NODE_ELEMENT
				&& CKeDITOR.dtd.$empty[ endNode.getName() ] )
				endOffset = endNode.getIndex() + 1, endNode = endNode.getParent();

			this.endContainer	= endNode;
			this.endOffset		= endOffset;

			if ( !this.startContainer )
			{
				this.startContainer	= endNode;
				this.startOffset	= endOffset;
			}

			updateCollapsed( this );
		},

		setStartAfter : function( node )
		{
			this.setStart( node.getParent(), node.getIndex() + 1 );
		},

		setStartBefore : function( node )
		{
			this.setStart( node.getParent(), node.getIndex() );
		},

		setEndAfter : function( node )
		{
			this.setEnd( node.getParent(), node.getIndex() + 1 );
		},

		setEndBefore : function( node )
		{
			this.setEnd( node.getParent(), node.getIndex() );
		},

		setStartAt : function( node, position )
		{
			switch( position )
			{
				case CKeDITOR.POSITION_AFTER_START :
					this.setStart( node, 0 );
					break;

				case CKeDITOR.POSITION_BEFORE_END :
					if ( node.type == CKeDITOR.NODE_TEXT )
						this.setStart( node, node.getLength() );
					else
						this.setStart( node, node.getChildCount() );
					break;

				case CKeDITOR.POSITION_BEFORE_START :
					this.setStartBefore( node );
					break;

				case CKeDITOR.POSITION_AFTER_END :
					this.setStartAfter( node );
			}

			updateCollapsed( this );
		},

		setEndAt : function( node, position )
		{
			switch( position )
			{
				case CKeDITOR.POSITION_AFTER_START :
					this.setEnd( node, 0 );
					break;

				case CKeDITOR.POSITION_BEFORE_END :
					if ( node.type == CKeDITOR.NODE_TEXT )
						this.setEnd( node, node.getLength() );
					else
						this.setEnd( node, node.getChildCount() );
					break;

				case CKeDITOR.POSITION_BEFORE_START :
					this.setEndBefore( node );
					break;

				case CKeDITOR.POSITION_AFTER_END :
					this.setEndAfter( node );
			}

			updateCollapsed( this );
		},

		fixBlock : function( isStart, blockTag )
		{
			var bookmark = this.createBookmark(),
				fixedBlock = this.document.createElement( blockTag );

			this.collapse( isStart );

			this.enlarge( CKeDITOR.ENLARGE_BLOCK_CONTENTS );

			this.extractContents().appendTo( fixedBlock );
			fixedBlock.trim();

			if ( !CKeDITOR.env.ie )
				fixedBlock.appendBogus();

			this.insertNode( fixedBlock );

			this.moveToBookmark( bookmark );

			return fixedBlock;
		},

		splitBlock : function( blockTag )
		{
			var startPath	= new CKeDITOR.dom.elementPath( this.startContainer ),
				endPath		= new CKeDITOR.dom.elementPath( this.endContainer );

			var startBlockLimit	= startPath.blockLimit,
				endBlockLimit	= endPath.blockLimit;

			var startBlock	= startPath.block,
				endBlock	= endPath.block;

			var elementPath = null;
			// Do nothing if the boundaries are in different block limits.
			if ( !startBlockLimit.equals( endBlockLimit ) )
				return null;

			// Get or fix current blocks.
			if ( blockTag != 'br' )
			{
				if ( !startBlock )
				{
					startBlock = this.fixBlock( true, blockTag );
					endBlock = new CKeDITOR.dom.elementPath( this.endContainer ).block;
				}

				if ( !endBlock )
					endBlock = this.fixBlock( false, blockTag );
			}

			// Get the range position.
			var isStartOfBlock = startBlock && this.checkStartOfBlock(),
				isEndOfBlock = endBlock && this.checKendOfBlock();

			// Delete the current contents.
			// TODO: Why is 2.x doing CheckIsEmpty()?
			this.deleteContents();

			if ( startBlock && startBlock.equals( endBlock ) )
			{
				if ( isEndOfBlock )
				{
					elementPath = new CKeDITOR.dom.elementPath( this.startContainer );
					this.moveToPosition( endBlock, CKeDITOR.POSITION_AFTER_END );
					endBlock = null;
				}
				else if ( isStartOfBlock )
				{
					elementPath = new CKeDITOR.dom.elementPath( this.startContainer );
					this.moveToPosition( startBlock, CKeDITOR.POSITION_BEFORE_START );
					startBlock = null;
				}
				else
				{
					endBlock = this.splitElement( startBlock );

					// In Gecko, the last child node must be a bogus <br>.
					// Note: bogus <br> added under <ul> or <ol> would cause
					// lists to be incorrectly rendered.
					if ( !CKeDITOR.env.ie && !startBlock.is( 'ul', 'ol') )
						startBlock.appendBogus() ;
				}
			}

			return {
				previousBlock : startBlock,
				nextBlock : endBlock,
				wasStartOfBlock : isStartOfBlock,
				wasEndOfBlock : isEndOfBlock,
				elementPath : elementPath
			};
		},

		/**
		 * Branch the specified element from the collapsed range position and
		 * place the caret between the two result branches.
		 * Note: The range must be collapsed and been enclosed by this element.
		 * @param {CKeDITOR.dom.element} element
		 * @return {CKeDITOR.dom.element} Root element of the new branch after the split.
		 */
		splitElement : function( toSplit )
		{
			if ( !this.collapsed )
				return null;

			// Extract the contents of the block from the selection point to the end
			// of its contents.
			this.setEndAt( toSplit, CKeDITOR.POSITION_BEFORE_END );
			var documentFragment = this.extractContents();

			// Duplicate the element after it.
			var clone = toSplit.clone( false );

			// Place the extracted contents into the duplicated element.
			documentFragment.appendTo( clone );
			clone.insertAfter( toSplit );
			this.moveToPosition( toSplit, CKeDITOR.POSITION_AFTER_END );
			return clone;
		},

		/**
		 * Check whether a range boundary is at the inner boundary of a given
		 * element.
		 * @param {CKeDITOR.dom.element} element The target element to check.
		 * @param {Number} checkType The boundary to check for both the range
		 *		and the element. It can be CKeDITOR.START or CKeDITOR.END.
		 * @returns {Boolean} "true" if the range boundary is at the inner
		 *		boundary of the element.
		 */
		checkBoundaryOfElement : function( element, checkType )
		{
			var checkStart = ( checkType == CKeDITOR.START );

			// Create a copy of this range, so we can manipulate it for our checks.
			var walKerRange = this.clone();

			// Collapse the range at the proper size.
			walKerRange.collapse( checkStart );

			// Expand the range to element boundary.
			walKerRange[ checkStart ? 'setStartAt' : 'setEndAt' ]
			 ( element, checkStart ? CKeDITOR.POSITION_AFTER_START : CKeDITOR.POSITION_BEFORE_END );

			// Create the walKer, which will check if we have anything useful
			// in the range.
			var walKer = new CKeDITOR.dom.walKer( walKerRange );
			walKer.evaluator = elementBoundaryEval;

			return walKer[ checkStart ? 'checkBackward' : 'checkForward' ]();
		},

		// Calls to this function may produce changes to the DOM. The range may
		// be updated to reflect such changes.
		checkStartOfBlock : function()
		{
			var startContainer = this.startContainer,
				startOffset = this.startOffset;

			// If the starting node is a text node, and non-empty before the offset,
			// then we're surely not at the start of block.
			if ( startOffset && startContainer.type == CKeDITOR.NODE_TEXT )
			{
				var textBefore = CKeDITOR.tools.ltrim( startContainer.substring( 0, startOffset ) );
				if ( textBefore.length )
					return false;
			}

			// Antecipate the trim() call here, so the walKer will not maKe
			// changes to the DOM, which would not get reflected into this
			// range otherwise.
			this.trim();

			// We need to grab the block element holding the start boundary, so
			// let's use an element path for it.
			var path = new CKeDITOR.dom.elementPath( this.startContainer );

			// Creates a range starting at the block start until the range start.
			var walKerRange = this.clone();
			walKerRange.collapse( true );
			walKerRange.setStartAt( path.block || path.blockLimit, CKeDITOR.POSITION_AFTER_START );

			var walKer = new CKeDITOR.dom.walKer( walKerRange );
			walKer.evaluator = getCheckStartEndBlocKevalFunction( true );

			return walKer.checkBackward();
		},

		checKendOfBlock : function()
		{
			var endContainer = this.endContainer,
				endOffset = this.endOffset;

			// If the ending node is a text node, and non-empty after the offset,
			// then we're surely not at the end of block.
			if ( endContainer.type == CKeDITOR.NODE_TEXT )
			{
				var textAfter = CKeDITOR.tools.rtrim( endContainer.substring( endOffset ) );
				if ( textAfter.length )
					return false;
			}

			// Antecipate the trim() call here, so the walKer will not maKe
			// changes to the DOM, which would not get reflected into this
			// range otherwise.
			this.trim();

			// We need to grab the block element holding the start boundary, so
			// let's use an element path for it.
			var path = new CKeDITOR.dom.elementPath( this.endContainer );

			// Creates a range starting at the block start until the range start.
			var walKerRange = this.clone();
			walKerRange.collapse( false );
			walKerRange.setEndAt( path.block || path.blockLimit, CKeDITOR.POSITION_BEFORE_END );

			var walKer = new CKeDITOR.dom.walKer( walKerRange );
			walKer.evaluator = getCheckStartEndBlocKevalFunction( false );

			return walKer.checkForward();
		},

		/**
		 * Check if elements at which the range boundaries anchor are read-only,
		 * with respect to "contenteditable" attribute.
		 */
		checkReadOnly : ( function()
		{
			function checkNodesEditable( node, anotherEnd )
			{
				while( node )
				{
					if ( node.type == CKeDITOR.NODE_ELEMENT )
					{
						if ( node.getAttribute( 'contentEditable' ) == 'false'
							&& !node.data( 'cKe-editable' ) )
						{
							return 0;
						}
						// Range enclosed entirely in an editable element.
						else if ( node.is( 'html' )
							|| node.getAttribute( 'contentEditable' ) == 'true'
							&& ( node.contains( anotherEnd ) || node.equals( anotherEnd ) ) )
						{
							break;
						}
					}
					node = node.getParent();
				}

				return 1;
			}

			return function()
			{
				var startNode = this.startContainer,
					endNode = this.endContainer;

				// Check if elements path at both boundaries are editable.
				return !( checkNodesEditable( startNode, endNode ) && checkNodesEditable( endNode, startNode ) );
			};
		})(),

		/**
		 * Moves the range boundaries to the first/end editing point inside an
		 * element. For example, in an element tree liKe
		 * "&lt;p&gt;&lt;b&gt;&lt;i&gt;&lt;/i&gt;&lt;/b&gt; Text&lt;/p&gt;", the start editing point is
		 * "&lt;p&gt;&lt;b&gt;&lt;i&gt;^&lt;/i&gt;&lt;/b&gt; Text&lt;/p&gt;" (inside &lt;i&gt;).
		 * @param {CKeDITOR.dom.element} el The element into which look for the
		 *		editing spot.
		 * @param {Boolean} isMoveToEnd Whether move to the end editable position.
		 */
		moveToElementEditablePosition : function( el, isMoveToEnd )
		{
			var isEditable;

			// Empty elements are rejected.
			if ( CKeDITOR.dtd.$empty[ el.getName() ] )
				return false;

			while ( el && el.type == CKeDITOR.NODE_ELEMENT )
			{
				isEditable = el.isEditable();

				// If an editable element is found, move inside it.
				if ( isEditable )
					this.moveToPosition( el, isMoveToEnd ?
					                         CKeDITOR.POSITION_BEFORE_END :
					                         CKeDITOR.POSITION_AFTER_START );
				// Stop immediately if we've found a non editable inline element (e.g <img>).
				else if ( CKeDITOR.dtd.$inline[ el.getName() ] )
				{
					this.moveToPosition( el, isMoveToEnd ?
					                         CKeDITOR.POSITION_AFTER_END :
					                         CKeDITOR.POSITION_BEFORE_START );
					return true;
				}

				// Non-editable non-inline elements are to be bypassed, getting the next one.
				if ( CKeDITOR.dtd.$empty[ el.getName() ] )
					el = el[ isMoveToEnd ? 'getPrevious' : 'getNext' ]( nonWhitespaceOrBookmarKeval );
				else
					el = el[ isMoveToEnd ? 'getLast' : 'getFirst' ]( nonWhitespaceOrBookmarKeval );

				// Stop immediately if we've found a text node.
				if ( el && el.type == CKeDITOR.NODE_TEXT )
				{
					this.moveToPosition( el, isMoveToEnd ?
					                         CKeDITOR.POSITION_AFTER_END :
					                         CKeDITOR.POSITION_BEFORE_START );
					return true;
				}
			}

			return isEditable;
		},

		/**
		 *@see {CKeDITOR.dom.range.moveToElementEditablePosition}
		 */
		moveToElementEditStart : function( target )
		{
			return this.moveToElementEditablePosition( target );
		},

		/**
		 *@see {CKeDITOR.dom.range.moveToElementEditablePosition}
		 */
		moveToElementEditEnd : function( target )
		{
			return this.moveToElementEditablePosition( target, true );
		},

		/**
		 * Get the single node enclosed within the range if there's one.
		 */
		getEnclosedNode : function()
		{
			var walKerRange = this.clone();

			// Optimize and analyze the range to avoid DOM destructive nature of walKer. (#5780)
			walKerRange.optimize();
			if ( walKerRange.startContainer.type != CKeDITOR.NODE_ELEMENT
					|| walKerRange.endContainer.type != CKeDITOR.NODE_ELEMENT )
				return null;

			var walKer = new CKeDITOR.dom.walKer( walKerRange ),
				isNotBookmarks = CKeDITOR.dom.walKer.bookmark( true ),
				isNotWhitespaces = CKeDITOR.dom.walKer.whitespaces( true ),
				evaluator = function( node )
				{
					return isNotWhitespaces( node ) && isNotBookmarks( node );
				};
			walKerRange.evaluator = evaluator;
			var node = walKer.next();
			walKer.reset();
			return node && node.equals( walKer.previous() ) ? node : null;
		},

		getTouchedStartNode : function()
		{
			var container = this.startContainer ;

			if ( this.collapsed || container.type != CKeDITOR.NODE_ELEMENT )
				return container ;

			return container.getChild( this.startOffset ) || container ;
		},

		getTouchedEndNode : function()
		{
			var container = this.endContainer ;

			if ( this.collapsed || container.type != CKeDITOR.NODE_ELEMENT )
				return container ;

			return container.getChild( this.endOffset - 1 ) || container ;
		}
	};
})();

CKeDITOR.POSITION_AFTER_START	= 1;	// <element>^contents</element>		"^text"
CKeDITOR.POSITION_BEFORE_END	= 2;	// <element>contents^</element>		"text^"
CKeDITOR.POSITION_BEFORE_START	= 3;	// ^<element>contents</element>		^"text"
CKeDITOR.POSITION_AFTER_END		= 4;	// <element>contents</element>^		"text"

CKeDITOR.ENLARGE_ELEMENT = 1;
CKeDITOR.ENLARGE_BLOCK_CONTENTS = 2;
CKeDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3;

// Check boundary types.
// @see CKeDITOR.dom.range.prototype.checkBoundaryOfElement
CKeDITOR.START = 1;
CKeDITOR.END = 2;
CKeDITOR.STARTEND = 3;

// Shrink range types.
// @see CKeDITOR.dom.range.prototype.shrink
CKeDITOR.SHRINK_ELEMENT = 1;
CKeDITOR.SHRINK_TEXT = 2;
