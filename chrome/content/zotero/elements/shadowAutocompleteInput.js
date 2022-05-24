/*
	***** BEGIN LICENSE BLOCK *****
	
	Copyright © 2022 Corporation for Digital Scholarship
					 Vienna, Virginia, USA
					 https://www.zotero.org
	
	This file is part of Zotero.
	
	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	
	You should have received a copy of the GNU Affero General Public License
	along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
	
	***** END LICENSE BLOCK *****
*/

"use strict";

{
	var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

	// Load specific element because customElements.js loads on element creation only
	Services.scriptloader.loadSubScript("chrome://global/content/elements/autocomplete-input.js", this);

	/**
	 * Extends AutocompleteInput to fix document.activeElement checks that
	 * don't work in a shadow DOM context.
	 */
	class ShadowAutocompleteInput extends customElements.get('autocomplete-input') {
		get focused() {
			// document.activeElement by itself doesn't traverse shadow DOMs; see
			// https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
			function activeElement(root) {
				let activeHere = root.activeElement;

				if (activeHere?.shadowRoot) {
					return activeElement(activeHere.shadowRoot);
				}
				else {
					return activeHere;
				}
			}

			return this === activeElement(document);
		}
	}

	customElements.define("shadow-autocomplete-input", ShadowAutocompleteInput, {
		extends: "input",
	});
}
