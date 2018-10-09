/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

if ( !CKeDITOR.editor )
{
	/**
	 * No element is linKed to the editor instance.
	 * @constant
	 * @example
	 */
	CKeDITOR.ELEMENT_MODE_NONE = 0;

	/**
	 * The element is to be replaced by the editor instance.
	 * @constant
	 * @example
	 */
	CKeDITOR.ELEMENT_MODE_REPLACE = 1;

	/**
	 * The editor is to be created inside the element.
	 * @constant
	 * @example
	 */
	CKeDITOR.ELEMENT_MODE_APPENDTO = 2;

	/**
	 * Creates an editor class instance. This constructor should be rarely
	 * used, in favor of the {@link CKeDITOR} editor creation functions.
	 * @ class Represents an editor instance.
	 * @param {Object} instanceConfig Configuration values for this specific
	 *		instance.
	 * @param {CKeDITOR.dom.element} [element] The element linKed to this
	 *		instance.
	 * @param {Number} [mode] The mode in which the element is linKed to this
	 *		instance. See {@link #elementMode}.
	 * @param {String} [data] Since 3.3. Initial value for the instance.
	 * @augments CKeDITOR.event
	 * @example
	 */
	CKeDITOR.editor = function( instanceConfig, element, mode, data )
	{
		this._ =
		{
			// Save the config to be processed later by the full core code.
			instanceConfig : instanceConfig,
			element : element,
			data : data
		};

		/**
		 * The mode in which the {@link #element} is linKed to this editor
		 * instance. It can be any of the following values:
		 * <ul>
		 * <li>{@link CKeDITOR.ELEMENT_MODE_NONE}: No element is linKed to the
		 *		editor instance.</li>
		 * <li>{@link CKeDITOR.ELEMENT_MODE_REPLACE}: The element is to be
		 *		replaced by the editor instance.</li>
		 * <li>{@link CKeDITOR.ELEMENT_MODE_APPENDTO}: The editor is to be
		 *		created inside the element.</li>
		 * </ul>
		 * @name CKeDITOR.editor.prototype.elementMode
		 * @type Number
		 * @example
		 * var editor = CKeDITOR.replace( 'editor1' );
		 * alert( <b>editor.elementMode</b> );  "1"
		 */
		this.elementMode = mode || CKeDITOR.ELEMENT_MODE_NONE;

		// Call the CKeDITOR.event constructor to initialize this instance.
		CKeDITOR.event.call( this );

		this._init();
	};

	/**
	 * Replaces a &lt;textarea&gt; or a DOM element (DIV) with a CKeditor
	 * instance. For textareas, the initial value in the editor will be the
	 * textarea value. For DOM elements, their innerHTML will be used
	 * instead. We recommend using TEXTAREA and DIV elements only. Do not use
	 * this function directly. Use {@link CKeDITOR.replace} instead.
	 * @param {Object|String} elementOrIdOrName The DOM element (textarea), its
	 *		ID or name.
	 * @param {Object} [config] The specific configurations to apply to this
	 *		editor instance. Configurations set here will override global CKeditor
	 *		settings.
	 * @returns {CKeDITOR.editor} The editor instance created.
	 * @example
	 */
	CKeDITOR.editor.replace = function( elementOrIdOrName, config )
	{
		var element = elementOrIdOrName;

		if ( typeof element != 'object' )
		{
			// Look for the element by id. We accept any kind of element here.
			element = document.getElementById( elementOrIdOrName );

			// Elements that should go into head are unacceptable (#6791).
			if ( element && element.tagName.toLowerCase() in {style:1,script:1,base:1,link:1,meta:1,title:1} )
				element = null;

			// If not found, look for elements by name. In this case we accept only
			// textareas.
			if ( !element )
			{
				var i = 0,
					textareasByName	= document.getElementsByName( elementOrIdOrName );

				while ( ( element = textareasByName[ i++ ] ) && element.tagName.toLowerCase() != 'textarea' )
				{ /*jsl:pass*/ }
			}

			if ( !element )
				throw '[CKeDITOR.editor.replace] The element with id or name "' + elementOrIdOrName + '" was not found.';
		}

		// Do not replace the textarea right now, just hide it. The effective
		// replacement will be done by the _init function.
		element.style.visibility = 'hidden';

		// Create the editor instance.
		return new CKeDITOR.editor( config, element, CKeDITOR.ELEMENT_MODE_REPLACE );
	};

	/**
	 * Creates a new editor instance inside a specific DOM element. Do not use
	 * this function directly. Use {@link CKeDITOR.appendTo} instead.
	 * @param {Object|String} elementOrId The DOM element or its ID.
	 * @param {Object} [config] The specific configurations to apply to this
	 *		editor instance. Configurations set here will override global CKeditor
	 *		settings.
	 * @param {String} [data] Since 3.3. Initial value for the instance.
	 * @returns {CKeDITOR.editor} The editor instance created.
	 * @example
	 */
	CKeDITOR.editor.appendTo = function( elementOrId, config, data )
	{
		var element = elementOrId;
		if ( typeof element != 'object' )
		{
			element = document.getElementById( elementOrId );

			if ( !element )
				throw '[CKeDITOR.editor.appendTo] The element with id "' + elementOrId + '" was not found.';
		}

		// Create the editor instance.
		return new CKeDITOR.editor( config, element, CKeDITOR.ELEMENT_MODE_APPENDTO, data );
	};

	CKeDITOR.editor.prototype =
	{
		/**
		 * Initializes the editor instance. This function will be overriden by the
		 * full CKeDITOR.editor implementation (editor.js).
		 * @private
		 */
		_init : function()
		{
			var pending = CKeDITOR.editor._pending || ( CKeDITOR.editor._pending = [] );
			pending.push( this );
		},

		// Both fire and fireOnce will always pass this editor instance as the
		// "editor" param in CKeDITOR.event.fire. So, we override it to do that
		// automaticaly.

		/** @ignore */
		fire : function( eventName, data )
		{
			return CKeDITOR.event.prototype.fire.call( this, eventName, data, this );
		},

		/** @ignore */
		fireOnce : function( eventName, data )
		{
			return CKeDITOR.event.prototype.fireOnce.call( this, eventName, data, this );
		}
	};

	// "Inherit" (copy actually) from CKeDITOR.event.
	CKeDITOR.event.implementOn( CKeDITOR.editor.prototype, true );
}
