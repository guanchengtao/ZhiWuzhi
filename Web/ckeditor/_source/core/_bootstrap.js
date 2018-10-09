/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview API initialization code.
 */

(function()
{
	// Disable HC detaction in WebKit. (#5429)
	if ( CKeDITOR.env.webkit )
	{
		CKeDITOR.env.hc = false;
		return;
	}

	// Check whether high contrast is active by creating a colored border.
	var hcDetect = CKeDITOR.dom.element.createFromHtml(
		'<div style="width:0px;height:0px;position:absolute;left:-10000px;' +
			'border: 1px solid;border-color: red blue;"></div>', CKeDITOR.document );

	hcDetect.appendTo( CKeDITOR.document.getHead() );

	// Update CKeDITOR.env.
	// Catch exception needed sometimes for FF. (#4230)
	try
	{
		CKeDITOR.env.hc = hcDetect.getComputedStyle( 'border-top-color' ) == hcDetect.getComputedStyle( 'border-right-color' );
	}
	catch (e)
	{
		CKeDITOR.env.hc = false;
	}

	if ( CKeDITOR.env.hc )
		CKeDITOR.env.cssClass += ' cKe_hc';

	hcDetect.remove();
})();

// Load core plugins.
CKeDITOR.plugins.load( CKeDITOR.config.corePlugins.split( ',' ), function()
	{
		CKeDITOR.status = 'loaded';
		CKeDITOR.fire( 'loaded' );

		// Process all instances created by the "basic" implementation.
		var pending = CKeDITOR._.pending;
		if ( pending )
		{
			delete CKeDITOR._.pending;

			for ( var i = 0 ; i < pending.length ; i++ )
				CKeDITOR.add( pending[ i ] );
		}
	});

// Needed for IE6 to not request image (HTTP 200 or 304) for every CSS background. (#6187)
if ( CKeDITOR.env.ie )
{
	// Remove IE mouse flicKering on IE6 because of background images.
	try
	{
		document.execCommand( 'BackgroundImageCache', false, true );
	}
	catch (e)
	{
		// We have been reported about loading problems caused by the above
		// line. For safety, let's just ignore errors.
	}
}

/**
 * Indicates that CKeditor is running on a High Contrast environment.
 * @name CKeDITOR.env.hc
 * @example
 * if ( CKeDITOR.env.hc )
 *     alert( 'You're running on High Contrast mode. The editor interface will get adapted to provide you a better experience.' );
 */

/**
 * Fired when a CKeDITOR core object is fully loaded and ready for interaction.
 * @name CKeDITOR#loaded
 * @event
 */
