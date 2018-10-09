/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKeDITOR.themes} object, which is used to
 *		manage themes registration and loading.
 */

/**
 * Manages themes registration and loading.
 * @namespace
 * @augments CKeDITOR.resourceManager
 * @example
 */
CKeDITOR.themes = new CKeDITOR.resourceManager(
	'_source/'+		// @Packager.RemoveLine
	'themes/', 'theme' );
