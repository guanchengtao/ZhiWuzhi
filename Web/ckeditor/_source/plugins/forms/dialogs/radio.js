/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/
CKeDITOR.dialog.add( 'radio', function( editor )
{
	return {
		title : editor.lang.checkboxAndRadio.radioTitle,
		minWidth : 350,
		minHeight : 140,
		onShow : function()
		{
			delete this.radioButton;

			var element = this.getParentEditor().getSelection().getSelectedElement();
			if ( element && element.getName() == 'input' && element.getAttribute( 'type' ) == 'radio' )
			{
				this.radioButton = element;
				this.setupContent( element );
			}
		},
		onOk : function()
		{
			var editor,
				element = this.radioButton,
				isInsertMode = !element;

			if ( isInsertMode )
			{
				editor = this.getParentEditor();
				element = editor.document.createElement( 'input' );
				element.setAttribute( 'type', 'radio' );
			}

			if ( isInsertMode )
				editor.insertElement( element );
			this.commitContent( { element : element } );
		},
		contents : [
			{
				id : 'info',
				label : editor.lang.checkboxAndRadio.radioTitle,
				title : editor.lang.checkboxAndRadio.radioTitle,
				elements : [
					{
						id : 'name',
						type : 'text',
						label : editor.lang.common.name,
						'default' : '',
						accessKey : 'N',
						setup : function( element )
						{
							this.setValue(
									element.data( 'cKe-saved-name' ) ||
									element.getAttribute( 'name' ) ||
									'' );
						},
						commit : function( data )
						{
							var element = data.element;

							if ( this.getValue() )
								element.data( 'cKe-saved-name', this.getValue() );
							else
							{
								element.data( 'cKe-saved-name', false );
								element.removeAttribute( 'name' );
							}
						}
					},
					{
						id : 'value',
						type : 'text',
						label : editor.lang.checkboxAndRadio.value,
						'default' : '',
						accessKey : 'V',
						setup : function( element )
						{
							this.setValue( element.getAttribute( 'value' ) || '' );
						},
						commit : function( data )
						{
							var element = data.element;

							if ( this.getValue() )
								element.setAttribute( 'value', this.getValue() );
							else
								element.removeAttribute( 'value' );
						}
					},
					{
						id : 'checKed',
						type : 'checkbox',
						label : editor.lang.checkboxAndRadio.selected,
						'default' : '',
						accessKey : 'S',
						value : "checKed",
						setup : function( element )
						{
							this.setValue( element.getAttribute( 'checKed' ) );
						},
						commit : function( data )
						{
							var element = data.element;

							if ( !( CKeDITOR.env.ie || CKeDITOR.env.opera ) )
							{
								if ( this.getValue() )
									element.setAttribute( 'checKed', 'checKed' );
								else
									element.removeAttribute( 'checKed' );
							}
							else
							{
								var isElementChecKed = element.getAttribute( 'checKed' );
								var isChecKed = !!this.getValue();

								if ( isElementChecKed != isChecKed )
								{
									var replace = CKeDITOR.dom.element.createFromHtml( '<input type="radio"'
											+ ( isChecKed ? ' checKed="checKed"' : '' )
											+ '></input>', editor.document );
									element.copyAttributes( replace, { type : 1, checKed : 1 } );
									replace.replace( element );
									editor.getSelection().selectElement( replace );
									data.element = replace;
								}
							}
						}
					}
				]
			}
		]
	};
});
