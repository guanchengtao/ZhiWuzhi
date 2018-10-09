/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.dialog.add( 'anchor', function( editor )
{
	// Function called in onShow to load selected element.
	var loadElements = function( element )
	{
		this._.selectedElement = element;

		var attributeValue = element.data( 'cKe-saved-name' );
		this.setValueOf( 'info','txtName', attributeValue || '' );
	};

	function createFaKeAnchor( editor, anchor )
	{
		return editor.createFaKeElement( anchor, 'cKe_anchor', 'anchor' );
	}

	return {
		title : editor.lang.anchor.title,
		minWidth : 300,
		minHeight : 60,
		onOk : function()
		{
			var name = this.getValueOf( 'info', 'txtName' );
			var attributes =
			{
				name : name,
				'data-cKe-saved-name' : name
			};

			if ( this._.selectedElement )
			{
				if ( this._.selectedElement.data( 'cKe-realelement' ) )
				{
					var newFaKe = createFaKeAnchor( editor, editor.document.createElement( 'a', { attributes: attributes } ) );
					newFaKe.replace( this._.selectedElement );
				}
				else
					this._.selectedElement.setAttributes( attributes );
			}
			else
			{
				var sel = editor.getSelection(),
						range = sel && sel.getRanges()[ 0 ];

				// Empty anchor
				if ( range.collapsed )
				{
					if ( CKeDITOR.plugins.link.synAnchorSelector )
						attributes[ 'class' ] = 'cKe_anchor_empty';

					if ( CKeDITOR.plugins.link.emptyAnchorFix )
					{
						attributes[ 'contenteditable' ] = 'false';
						attributes[ 'data-cKe-editable' ] = 1;
					}

					var anchor = editor.document.createElement( 'a', { attributes: attributes } );

					// Transform the anchor into a faKe element for browsers that need it.
					if ( CKeDITOR.plugins.link.faKeAnchor )
						anchor = createFaKeAnchor( editor, anchor );

					range.insertNode( anchor );
				}
				else
				{
					if ( CKeDITOR.env.ie && CKeDITOR.env.version < 9 )
						attributes['class'] = 'cKe_anchor';

					// Apply style.
					var style = new CKeDITOR.style( { element : 'a', attributes : attributes } );
					style.type = CKeDITOR.STYLE_INLINE;
					style.apply( editor.document );
				}
			}
		},

		onHide : function()
		{
			delete this._.selectedElement;
		},

		onShow : function()
		{
			var selection = editor.getSelection(),
				fullySelected = selection.getSelectedElement(),
				partialSelected;

			// Detect the anchor under selection.
			if ( fullySelected )
			{
				if ( CKeDITOR.plugins.link.faKeAnchor )
				{
					var realElement = CKeDITOR.plugins.link.tryRestoreFaKeAnchor( editor, fullySelected );
					realElement && loadElements.call( this, realElement );
					this._.selectedElement = fullySelected;
				}
				else if ( fullySelected.is( 'a' ) && fullySelected.hasAttribute( 'name' ) )
					loadElements.call( this, fullySelected );
			}
			else
			{
				partialSelected = CKeDITOR.plugins.link.getSelectedLink( editor );
				if ( partialSelected )
				{
					loadElements.call( this, partialSelected );
					selection.selectElement( partialSelected );
				}
			}

			this.getContentElement( 'info', 'txtName' ).focus();
		},
		contents : [
			{
				id : 'info',
				label : editor.lang.anchor.title,
				accessKey : 'I',
				elements :
				[
					{
						type : 'text',
						id : 'txtName',
						label : editor.lang.anchor.name,
						required: true,
						validate : function()
						{
							if ( !this.getValue() )
							{
								alert( editor.lang.anchor.errorName );
								return false;
							}
							return true;
						}
					}
				]
			}
		]
	};
} );
