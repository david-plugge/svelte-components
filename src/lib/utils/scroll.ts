const LOCK_ATTRIBUTE_NAME = 'data-scroll-lock';

let refs = 0;

export function removeScroll(doc = document) {
	refs++;
	const body = doc.body;

	if (body.hasAttribute(LOCK_ATTRIBUTE_NAME)) {
		return cleanup;
	}

	const prevCss = doc.body.style.cssText;

	const prevWidth = body.clientWidth;
	body.style.overflow = 'hidden';
	const padding = body.clientWidth - prevWidth;

	if (padding !== 0) {
		const prevPadding = window.getComputedStyle(body).paddingRight;
		body.style.paddingRight = `calc(${prevPadding} + ${padding}px)`;
	}

	function cleanup() {
		if (--refs === 0) {
			body.style.cssText = prevCss;
		}
	}

	return cleanup;
}
