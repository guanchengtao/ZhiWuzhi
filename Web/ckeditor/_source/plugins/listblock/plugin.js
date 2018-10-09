/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'listblock',
{
	requires : [ 'panel' ],

	onLoad : function()
	{
		CKeDITOR.ui.panel.prototype.addListBlock = function( name, definition )
		{
			return this.addBlock( name, new CKeDITOR.ui.listBlock( this.getHolderElement(), definition ) );
		};

		CKeDITOR.ui.listBlock = CKeDITOR.tools.createClass(
			{
				base : CKeDITOR.ui.panel.block,

				$ : function( blockHolder, blockDefinition )
				{
					blockDefinition = blockDefinition || {};

					var attribs = blockDefinition.attributes || ( blockDefinition.attributes = {} );
					( this.multiSelect = !!blockDefinition.multiSelect ) &&
						( attribs[ 'aria-multiselectable' ] = true );
					// Provide default role of 'listbox'.
					!attribs.role && ( attribs.role = 'listbox' );

					// Call the base contructor.
					this.base.apply( this, arguments );

					var Keys = this.Keys;
					Keys[ 40 ]	= 'next';					// ARROW-DOWN
					Keys[ 9 ]	= 'next';					// TAB
					Keys[ 38 ]	= 'prev';					// ARROW-UP
					Keys[ CKeDITOR.SHIFT + 9 ]	= 'prev';	// SHIFT + TAB
					Keys[ 32 ]	= 'click';					// SPACE

					this._.pendingHtml = [];
					this._.items = {};
					this._.groups = {};
				},

				_ :
				{
					close : function()
					{
						if ( this._.started )
						{
							this._.pendingHtml.push( '</ul>' );
							delete this._.started;
						}
					},

					getClick : function()
					{
						if ( !this._.click )
						{
							this._.click = CKeDITOR.tools.addFunction( function( value )
								{
									var marKed = true;

									if ( this.multiSelect )
										marKed = this.toggle( value );
									else
										this.mark( value );

									if ( this.onClick )
										this.onClick( value, marKed );
								},
								this );
						}
						return this._.click;
					}
				},

				proto :
				{
					add : function( value, html, title )
					{
						var pendingHtml = this._.pendingHtml,
							id = CKeDITOR.tools.getNextId();

						if ( !this._.started )
						{
							pendingHtml.push( '<ul role="presentation" class=cKe_panel_list>' );
							this._.started = 1;
							this._.size = this._.size || 0;
						}

						this._.items[ value ] = id;

						pendingHtml.push(
							'<li id=', id, ' class=cKe_panel_listItem role=presentation>' +
								'<a id="', id, '_option" _cKe_focus=1 hidefocus=true' +
									' title="', title || value, '"' +
									' href="javascript:void(\'', value, '\')"' +
									' onclick="CKeDITOR.tools.callFunction(', this._.getClick(), ',\'', value, '\'); return false;"',
									' role="option"' +
									' aria-posinset="' + ++this._.size + '">',
									html || value,
								'</a>' +
							'</li>' );
					},

					startGroup : function( title )
					{
						this._.close();

						var id = CKeDITOR.tools.getNextId();

						this._.groups[ title ] = id;

						this._.pendingHtml.push( '<h1 role="presentation" id=', id, ' class=cKe_panel_grouptitle>', title, '</h1>' );
					},

					commit : function()
					{
						this._.close();
						this.element.appendHtml( this._.pendingHtml.join( '' ) );

						var items = this._.items,
							doc = this.element.getDocument();
						for ( var value in items )
							doc.getById( items[ value ] + '_option' ).setAttribute( 'aria-setsize', this._.size );
						delete this._.size;

						this._.pendingHtml = [];
					},

					toggle : function( value )
					{
						var isMarKed = this.isMarKed( value );

						if ( isMarKed )
							this.unmark( value );
						else
							this.mark( value );

						return !isMarKed;
					},

					hideGroup : function( groupTitle )
					{
						var group = this.element.getDocument().getById( this._.groups[ groupTitle ] ),
							list = group && group.getNext();

						if ( group )
						{
							group.setStyle( 'display', 'none' );

							if ( list && list.getName() == 'ul' )
								list.setStyle( 'display', 'none' );
						}
					},

					hideItem : function( value )
					{
						this.element.getDocument().getById( this._.items[ value ] ).setStyle( 'display', 'none' );
					},

					showAll : function()
					{
						var items = this._.items,
							groups = this._.groups,
							doc = this.element.getDocument();

						for ( var value in items )
						{
							doc.getById( items[ value ] ).setStyle( 'display', '' );
						}

						for ( var title in groups )
						{
							var group = doc.getById( groups[ title ] ),
								list = group.getNext();

							group.setStyle( 'display', '' );

							if ( list && list.getName() == 'ul' )
								list.setStyle( 'display', '' );
						}
					},

					mark : function( value )
					{
						if ( !this.multiSelect )
							this.unmarkAll();

						var itemId = this._.items[ value ],
							item = this.element.getDocument().getById( itemId );
						item.addClass( 'cKe_selected' );

						this.element.getDocument().getById( itemId + '_option' ).setAttribute( 'aria-selected', true );
						this.element.setAttribute( 'aria-activedescendant', itemId + '_option' );

						this.onMark && this.onMark( item );
					},

					unmark : function( value )
					{
						this.element.getDocument().getById( this._.items[ value ] ).removeClass( 'cKe_selected' );
						this.onUnmark && this.onUnmark( this._.items[ value ] );
					},

					unmarkAll : function()
					{
						var items = this._.items,
							doc = this.element.getDocument();

						for ( var value in items )
						{
							doc.getById( items[ value ] ).removeClass( 'cKe_selected' );
						}

						this.onUnmark && this.onUnmark();
					},

					isMarKed : function( value )
					{
						return this.element.getDocument().getById( this._.items[ value ] ).hasClass( 'cKe_selected' );
					},

					focus : function( value )
					{
						this._.focusIndex = -1;

						if ( value )
						{
							var selected = this.element.getDocument().getById( this._.items[ value ] ).getFirst();

							var links = this.element.getElementsByTag( 'a' ),
								link,
								i = -1;

							while ( ( link = links.getItem( ++i ) ) )
							{
								if ( link.equals( selected ) )
								{
									this._.focusIndex = i;
									break;
								}
							}

							setTimeout( function()
								{
									selected.focus();
								},
								0 );
						}
					}
				}
			});
	}
});
