/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview The default editing block plugin, which holds the editing area
 *		and source view.
 */

(function()
{
	// This is a semaphore used to avoid recursive calls between
	// the following data handling functions.
	var isHandlingData;

	CKeDITOR.plugins.add( 'editingblock',
	{
		init : function( editor )
		{
			if ( !editor.config.editingBlock )
				return;

			editor.on( 'themeSpace', function( event )
				{
					if ( event.data.space == 'contents' )
						event.data.html += '<br>';
				});

			editor.on( 'themeLoaded', function()
				{
					editor.fireOnce( 'editingBlockReady' );
				});

			editor.on( 'uiReady', function()
				{
					editor.setMode( editor.config.startupMode );
				});

			editor.on( 'afterSetData', function()
				{
					if ( !isHandlingData )
					{
						function setData()
						{
							isHandlingData = true;
							editor.getMode().loadData( editor.getData() );
							isHandlingData = false;
						}

						if ( editor.mode )
							setData();
						else
						{
							editor.on( 'mode', function()
								{
									if ( editor.mode )
									{
										setData();
										editor.removeListener( 'mode', arguments.callee );
									}
								});
						}
					}
				});

			editor.on( 'beforeGetData', function()
				{
					if ( !isHandlingData && editor.mode )
					{
						isHandlingData = true;
						editor.setData( editor.getMode().getData(), null, 1 );
						isHandlingData = false;
					}
				});

			editor.on( 'getSnapshot', function( event )
				{
					if ( editor.mode )
						event.data = editor.getMode().getSnapshotData();
				});

			editor.on( 'loadSnapshot', function( event )
				{
					if ( editor.mode )
						editor.getMode().loadSnapshotData( event.data );
				});

			// For the first "mode" call, we'll also fire the "instanceReady"
			// event.
			editor.on( 'mode', function( event )
				{
					// Do that once only.
					event.removeListener();

					// Redirect the focus into editor for webkit. (#5713)
					CKeDITOR.env.webkit && editor.container.on( 'focus', function()
						{
							editor.focus();
						});

					if ( editor.config.startupFocus )
						editor.focus();

					// Fire instanceReady for both the editor and CKeDITOR, but
					// defer this until the whole execution has completed
					// to guarantee the editor is fully responsible.
					setTimeout( function(){
						editor.fireOnce( 'instanceReady' );
						CKeDITOR.fire( 'instanceReady', null, editor );
					}, 0 );
				});

			editor.on( 'destroy', function ()
			{
				// ->		currentMode.unload( holderElement );
				if ( this.mode )
					this._.modes[ this.mode ].unload( this.getThemeSpace( 'contents' ) );
			});
		}
	});

	/**
	 * The current editing mode. An editing mode is basically a viewport for
	 * editing or content viewing. By default the possible values for this
	 * property are "wysiwyg" and "source".
	 * @type String
	 * @example
	 * alert( CKeDITOR.instances.editor1.mode );  // "wysiwyg" (e.g.)
	 */
	CKeDITOR.editor.prototype.mode = '';

	/**
	 * Registers an editing mode. This function is to be used mainly by plugins.
	 * @param {String} mode The mode name.
	 * @param {Object} modeEditor The mode editor definition.
	 * @example
	 */
	CKeDITOR.editor.prototype.addMode = function( mode, modeEditor )
	{
		modeEditor.name = mode;
		( this._.modes || ( this._.modes = {} ) )[ mode ] = modeEditor;
	};

	/**
	 * Sets the current editing mode in this editor instance.
	 * @param {String} mode A registered mode name.
	 * @example
	 * // Switch to "source" view.
	 * CKeDITOR.instances.editor1.setMode( 'source' );
	 */
	CKeDITOR.editor.prototype.setMode = function( mode )
	{
		this.fire( 'beforeSetMode', { newMode : mode } );

		var data,
			holderElement = this.getThemeSpace( 'contents' ),
			isDirty = this.checkDirty();

		// Unload the previous mode.
		if ( this.mode )
		{
			if ( mode == this.mode )
				return;

			this.fire( 'beforeModeUnload' );

			var currentMode = this.getMode();
			data = currentMode.getData();
			currentMode.unload( holderElement );
			this.mode = '';
		}

		holderElement.setHtml( '' );

		// Load required mode.
		var modeEditor = this.getMode( mode );
		if ( !modeEditor )
			throw '[CKeDITOR.editor.setMode] Unknown mode "' + mode + '".';

		if ( !isDirty )
		{
			this.on( 'mode', function()
				{
					this.resetDirty();
					this.removeListener( 'mode', arguments.callee );
				});
		}

		modeEditor.load( holderElement, ( typeof data ) != 'string'  ? this.getData() : data);
	};

	/**
	 * Gets the current or any of the objects that represent the editing
	 * area modes. The two most common editing modes are "wysiwyg" and "source".
	 * @param {String} [mode] The mode to be retrieved. If not specified, the
	 *		current one is returned.
	 */
	CKeDITOR.editor.prototype.getMode = function( mode )
	{
		return this._.modes && this._.modes[ mode || this.mode ];
	};

	/**
	 * Moves the selection focus to the editing are space in the editor.
	 */
	CKeDITOR.editor.prototype.focus = function()
	{
		this.forceNextSelectionCheck();
		var mode = this.getMode();
		if ( mode )
			mode.focus();
	};
})();

/**
 * The mode to load at the editor startup. It depends on the plugins
 * loaded. By default, the "wysiwyg" and "source" modes are available.
 * @type String
 * @default 'wysiwyg'
 * @example
 * config.startupMode = 'source';
 */
CKeDITOR.config.startupMode = 'wysiwyg';

/**
 * Sets whether the editor should have the focus when the page loads.
 * @name CKeDITOR.config.startupFocus
 * @type Boolean
 * @default false
 * @example
 * config.startupFocus = true;
 */

/**
 * Whether to render or not the editing block area in the editor interface.
 * @type Boolean
 * @default true
 * @example
 * config.editingBlock = false;
 */
CKeDITOR.config.editingBlock = true;

/**
 * Fired when a CKeDITOR instance is created, fully initialized and ready for interaction.
 * @name CKeDITOR#instanceReady
 * @event
 * @param {CKeDITOR.editor} editor The editor instance that has been created.
 */

/**
 * Fired when the CKeDITOR instance is created, fully initialized and ready for interaction.
 * @name CKeDITOR.editor#instanceReady
 * @event
 */

/**
 * Fired before changing the editing mode.
 * @name CKeDITOR.editor#beforeModeUnload
 * @event
 */

 /**
 * Fired before the editor mode is set.
 * @name CKeDITOR.editor#beforeSetMode
 * @event
 * @since 3.5.3
 * @param {String} newMode The name of the mode which is about to be set.
 */
