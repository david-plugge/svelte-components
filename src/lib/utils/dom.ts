export function getElement(id: string) {
	const element = document.getElementById(id);
	return element;
}

export function isHtmlElement(value: unknown): value is HTMLElement {
	return value instanceof HTMLElement;
}
