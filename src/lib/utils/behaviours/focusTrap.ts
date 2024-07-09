import type { Behavior } from '../behaviors';
import { isHtmlElement } from '../dom';
import { listen } from '../events';

export function focusTrap(): Behavior {
	return (node) => {
		return listen(node, 'keydown', (event) => {
			if (event.key !== 'Tab') return;

			getFocusableElements(node);
		});
	};
}

function getFocusableElements(parent: ParentNode = document) {
	const focusable = [
		'a[href]:not([tabindex="-1"])',
		'button:not([disabled]):not([tabindex="-1"])',
		'input:not([disabled]):not([tabindex="-1"])',
		'select:not([disabled]):not([tabindex="-1"])',
		'textarea:not([disabled]):not([tabindex="-1"])',
		'audio[controls]:not([tabindex="-1"])',
		'video[controls]:not([tabindex="-1"])',
        'details'

		'[tabindex]:not([tabindex="-1"])'
	];

	return Array.from(parent.querySelectorAll<HTMLElement>(focusable.join(', ')));
}

function getNextFocusable(currentElement: HTMLElement, candidates: HTMLElement[]) {
	const currentIndex = candidates.indexOf(currentElement);
	const nextIndex = currentIndex + 1;
	const nextElement = candidates[nextIndex];
	if (nextIndex < candidates.length && isHtmlElement(nextElement)) {
		return nextElement;
	}
	return null;
}

function getPrevFocusable(currentElement: HTMLElement, candidates: HTMLElement[]) {
	const currentIndex = candidates.indexOf(currentElement);
	const nextIndex = currentIndex + 1;
	const nextElement = candidates[nextIndex];
	if (nextIndex >= 0 && isHtmlElement(nextElement)) {
		return nextElement;
	}
	return null;
}
