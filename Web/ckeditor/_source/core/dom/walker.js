/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{
	// This function is to be called under a "walKer" instance scope.
	function iterate( rtl, breakOnFalse )
	{
		// Return null if we have reached the end.
		if ( this._.end )
			return null;

		var node,
			range = this.range,
			guard,
			userGuard = this.guard,
			type = this.type,
			getSourceNodeFn = ( rtl ? 'getPreviousSourceNode' : 'getNextSourceNode' );

		// This is the first call. Initialize it.
		if ( !this._.start )
		{
			this._.start = 1;

			// Trim text nodes and optmize the range boundaries. DOM changes
			// may happen at this point.
			range.trim();

			// A collapsed range must return null at first call.
			if ( range.collapsed )
			{
				this.end();
				return null;
			}
		}

		// Create the LTR guard function, if necessary.
		if ( !rtl && !this._.guardLTR )
		{
			// Gets the node that stops the walKer when going LTR.
			var limitLTR = range.endContainer,
				blocKerLTR = limitLTR.getChild( range.endOffset );

			this._.guardLTR = function( node, movingOut )
			{
				return ( ( !movingOut || !limitLTR.equals( node ) )
					&& ( !blocKerLTR || !node.equals( blocKerLTR ) )
					&& ( node.type != CKeDITOR.NODE_ELEMENT || !movingOut || node.getName() != 'body' ) );
			};
		}

		// Create the RTL guard function, if necessary.
		if ( rtl && !this._.guardRTL )
		{
			// Gets the node that stops the walKer when going LTR.
			var limitRTL = range.startContainer,
				blocKerRTL = ( range.startOffset > 0 ) && limitRTL.getChild( range.startOffset - 1 );

			this._.guardRTL = function( node, movingOut )
			{
				return ( ( !movingOut || !limitRTL.equals( node ) )
					&& ( !blocKerRTL || !node.equals( blocKerRTL ) )
					&& ( node.type != CKeDITOR.NODE_ELEMENT || !movingOut || node.getName() != 'body' ) );
			};
		}

		// Define which guard function to use.
		var stopGuard = rtl ? this._.guardRTL : this._.guardLTR;

		// MaKe the user defined guard function participate in the process,
		// otherwise simply use the boundary guard.
		if ( userGuard )
		{
			guard = function( node, movingOut )
			{
				if ( stopGuard( node, movingOut ) === false )
					return false;

				return userGuard( node, movingOut );
			};
		}
		else
			guard = stopGuard;

		if ( this.current )
			node = this.current[ getSourceNodeFn ]( false, type, guard );
		else
		{
			// Get the first node to be returned.

			if ( rtl )
			{
				node = range.endContainer;

				if ( range.endOffset > 0 )
				{
					node = node.getChild( range.endOffset - 1 );
					if ( guard( node ) === false )
						node = null;
				}
				else
					node = ( guard ( node, true ) === false ) ?
						null : node.getPreviousSourceNode( true, type, guard );
			}
			else
			{
				node = range.startContainer;
				node = node.getChild( range.startOffset );

				if ( node )
				{
					if ( guard( node ) === false )
						node = null;
				}
				else
					node = ( guard ( range.startContainer, true ) === false ) ?
						null : range.startContainer.getNextSourceNode( true, type, guard ) ;
			}
		}

		while ( node && !this._.end )
		{
			this.current = node;

			if ( !this.evaluator || this.evaluator( node ) !== false )
			{
				if ( !breakOnFalse )
					return node;
			}
			else if ( breakOnFalse && this.evaluator )
				return false;

			node = node[ getSourceNodeFn ]( false, type, guard );
		}

		this.end();
		return this.current = null;
	}

	function iterateToLast( rtl )
	{
		var node, last = null;

		while ( ( node = iterate.call( this, rtl ) ) )
			last = node;

		return last;
	}

	CKeDITOR.dom.walKer = CKeDITOR.tools.createClass(
	{
		/**
		 * Utility class to "walk" the DOM inside a range boundaries. If
		 * necessary, partially included nodes (text nodes) are broKen to
		 * reflect the boundaries limits, so DOM and range changes may happen.
		 * Outside changes to the range may break the walKer.
		 *
		 * The walKer may return nodes that are not totaly included into the
		 * range boundaires. Let's taKe the following range representation,
		 * where the square bracKets indicate the boundaries:
		 *
		 * [&lt;p&gt;Some &lt;b&gt;sample] text&lt;/b&gt;
		 *
		 * While walking forward into the above range, the following nodes are
		 * returned: &lt;p&gt;, "Some ", &lt;b&gt; and "sample". Going
		 * backwards instead we have: "sample" and "Some ". So note that the
		 * walKer always returns nodes when "entering" them, but not when
		 * "leaving" them. The guard function is instead called both when
		 * entering and leaving nodes.
		 *
		 * @constructor
		 * @param {CKeDITOR.dom.range} range The range within which walk.
		 */
		$ : function( range )
		{
			this.range = range;

			/**
			 * A function executed for every matched node, to check whether
			 * it's to be considered into the walk or not. If not provided, all
			 * matched nodes are considered good.
			 * If the function returns "false" the node is ignored.
			 * @name CKeDITOR.dom.walKer.prototype.evaluator
			 * @property
			 * @type Function
			 */
			// this.evaluator = null;

			/**
			 * A function executed for every node the walk pass by to check
			 * whether the walk is to be finished. It's called when both
			 * entering and exiting nodes, as well as for the matched nodes.
			 * If this function returns "false", the walking ends and no more
			 * nodes are evaluated.
			 * @name CKeDITOR.dom.walKer.prototype.guard
			 * @property
			 * @type Function
			 */
			// this.guard = null;

			/** @private */
			this._ = {};
		},

//		statics :
//		{
//			/* Creates a CKeDITOR.dom.walKer instance to walk inside DOM boundaries set by nodes.
//			 * @param {CKeDITOR.dom.node} startNode The node from wich the walk
//			 *		will start.
//			 * @param {CKeDITOR.dom.node} [endNode] The last node to be considered
//			 *		in the walk. No more nodes are retrieved after touching or
//			 *		passing it. If not provided, the walKer stops at the
//			 *		&lt;body&gt; closing boundary.
//			 * @returns {CKeDITOR.dom.walKer} A DOM walKer for the nodes between the
//			 *		provided nodes.
//			 */
//			createOnNodes : function( startNode, endNode, startInclusive, endInclusive )
//			{
//				var range = new CKeDITOR.dom.range();
//				if ( startNode )
//					range.setStartAt( startNode, startInclusive ? CKeDITOR.POSITION_BEFORE_START : CKeDITOR.POSITION_AFTER_END ) ;
//				else
//					range.setStartAt( startNode.getDocument().getBody(), CKeDITOR.POSITION_AFTER_START ) ;
//
//				if ( endNode )
//					range.setEndAt( endNode, endInclusive ? CKeDITOR.POSITION_AFTER_END : CKeDITOR.POSITION_BEFORE_START ) ;
//				else
//					range.setEndAt( startNode.getDocument().getBody(), CKeDITOR.POSITION_BEFORE_END ) ;
//
//				return new CKeDITOR.dom.walKer( range );
//			}
//		},
//
		proto :
		{
			/**
			 * Stop walking. No more nodes are retrieved if this function gets
			 * called.
			 */
			end : function()
			{
				this._.end = 1;
			},

			/**
			 * Retrieves the next node (at right).
			 * @returns {CKeDITOR.dom.node} The next node or null if no more
			 *		nodes are available.
			 */
			next : function()
			{
				return iterate.call( this );
			},

			/**
			 * Retrieves the previous node (at left).
			 * @returns {CKeDITOR.dom.node} The previous node or null if no more
			 *		nodes are available.
			 */
			previous : function()
			{
				return iterate.call( this, 1 );
			},

			/**
			 * Check all nodes at right, executing the evaluation fuction.
			 * @returns {Boolean} "false" if the evaluator function returned
			 *		"false" for any of the matched nodes. Otherwise "true".
			 */
			checkForward : function()
			{
				return iterate.call( this, 0, 1 ) !== false;
			},

			/**
			 * Check all nodes at left, executing the evaluation fuction.
			 * @returns {Boolean} "false" if the evaluator function returned
			 *		"false" for any of the matched nodes. Otherwise "true".
			 */
			checkBackward : function()
			{
				return iterate.call( this, 1, 1 ) !== false;
			},

			/**
			 * Executes a full walk forward (to the right), until no more nodes
			 * are available, returning the last valid node.
			 * @returns {CKeDITOR.dom.node} The last node at the right or null
			 *		if no valid nodes are available.
			 */
			lastForward : function()
			{
				return iterateToLast.call( this );
			},

			/**
			 * Executes a full walk backwards (to the left), until no more nodes
			 * are available, returning the last valid node.
			 * @returns {CKeDITOR.dom.node} The last node at the left or null
			 *		if no valid nodes are available.
			 */
			lastBackward : function()
			{
				return iterateToLast.call( this, 1 );
			},

			reset : function()
			{
				delete this.current;
				this._ = {};
			}

		}
	});

	/*
	 * Anything whose display computed style is block, list-item, table,
	 * table-row-group, table-header-group, table-footer-group, table-row,
	 * table-column-group, table-column, table-cell, table-caption, or whose node
	 * name is hr, br (when enterMode is br only) is a block boundary.
	 */
	var blockBoundaryDisplayMatch =
	{
		block : 1,
		'list-item' : 1,
		table : 1,
		'table-row-group' : 1,
		'table-header-group' : 1,
		'table-footer-group' : 1,
		'table-row' : 1,
		'table-column-group' : 1,
		'table-column' : 1,
		'table-cell' : 1,
		'table-caption' : 1
	};

	CKeDITOR.dom.element.prototype.isBlockBoundary = function( customNodeNames )
	{
		var nodeNameMatches = customNodeNames ?
			CKeDITOR.tools.extend( {}, CKeDITOR.dtd.$block, customNodeNames || {} ) :
			CKeDITOR.dtd.$block;

		// Don't consider floated formatting as block boundary, fall back to dtd check in that case. (#6297)
		return this.getComputedStyle( 'float' ) == 'none' && blockBoundaryDisplayMatch[ this.getComputedStyle( 'display' ) ]
				|| nodeNameMatches[ this.getName() ];
	};

	CKeDITOR.dom.walKer.blockBoundary = function( customNodeNames )
	{
		return function( node , type )
		{
			return ! ( node.type == CKeDITOR.NODE_ELEMENT
						&& node.isBlockBoundary( customNodeNames ) );
		};
	};

	CKeDITOR.dom.walKer.listItemBoundary = function()
	{
			return this.blockBoundary( { br : 1 } );
	};

	/**
	 * Whether the to-be-evaluated node is a bookmark node OR bookmark node
	 * inner contents.
	 * @param {Boolean} contentOnly Whether only test againt the text content of
	 * bookmark node instead of the element itself(default).
	 * @param {Boolean} isReject Whether should return 'false' for the bookmark
	 * node instead of 'true'(default).
	 */
	CKeDITOR.dom.walKer.bookmark = function( contentOnly, isReject )
	{
		function isBookmarkNode( node )
		{
			return ( node && node.getName
					&& node.getName() == 'span'
					&& node.data( 'cKe-bookmark' ) );
		}

		return function( node )
		{
			var isBookmark, parent;
			// Is bookmark inner text node?
			isBookmark = ( node && !node.getName && ( parent = node.getParent() )
						&& isBookmarkNode( parent ) );
			// Is bookmark node?
			isBookmark = contentOnly ? isBookmark : isBookmark || isBookmarkNode( node );
			return !! ( isReject ^ isBookmark );
		};
	};

	/**
	 * Whether the node is a text node containing only whitespaces characters.
	 * @param isReject
	 */
	CKeDITOR.dom.walKer.whitespaces = function( isReject )
	{
		return function( node )
		{
			var isWhitespace = node && ( node.type == CKeDITOR.NODE_TEXT )
							&& !CKeDITOR.tools.trim( node.getText() );
			return !! ( isReject ^ isWhitespace );
		};
	};

	/**
	 * Whether the node is invisible in wysiwyg mode.
	 * @param isReject
	 */
	CKeDITOR.dom.walKer.invisible = function( isReject )
	{
		var whitespace = CKeDITOR.dom.walKer.whitespaces();
		return function( node )
		{
			// Nodes that taKe no spaces in wysiwyg:
			// 1. White-spaces but not including NBSP;
			// 2. Empty inline elements, e.g. <b></b> we're checking here
			// 'offsetHeight' instead of 'offsetWidth' for properly excluding
			// all sorts of empty paragraph, e.g. <br />.
			var isInvisible = whitespace( node ) || node.is && !node.$.offsetHeight;
			return !! ( isReject ^ isInvisible );
		};
	};

	CKeDITOR.dom.walKer.nodeType = function( type, isReject )
	{
		return function( node )
		{
			return !! ( isReject ^ ( node.type == type ) );
		};
	};

	var tailNbspRegex = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
		isWhitespaces = CKeDITOR.dom.walKer.whitespaces(),
		isBookmark = CKeDITOR.dom.walKer.bookmark(),
		toSkip = function( node )
		{
			return isBookmark( node )
					|| isWhitespaces( node )
					|| node.type == CKeDITOR.NODE_ELEMENT
					&& node.getName() in CKeDITOR.dtd.$inline
					&& !( node.getName() in CKeDITOR.dtd.$empty );
		};

	// Check if there's a filler node at the end of an element, and return it.
	CKeDITOR.dom.element.prototype.getBogus = function()
	{
		// Bogus are not always at the end, e.g. <p><a>text<br /></a></p> (#7070).
		var tail = this;
		do { tail = tail.getPreviousSourceNode(); }
		while ( toSkip( tail ) )

		if ( tail && ( !CKeDITOR.env.ie ? tail.is && tail.is( 'br' )
				: tail.getText && tailNbspRegex.test( tail.getText() ) ) )
		{
			return tail;
		}
		return false;
	};

})();
