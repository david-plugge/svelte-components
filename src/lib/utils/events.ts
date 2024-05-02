interface EventModifiers {
	self?: boolean;
	stopPropagation?: boolean;
	stopImmediatePropagation?: boolean;
	preventDefault?: boolean;
}

export function modifiers<T extends Event>(
	modifiers: EventModifiers,
	handler: (event: T) => void
): (event: T) => void {
	return function (this: Element, event: T) {
		if (modifiers.self && this !== event.target) return;

		if (modifiers.stopPropagation) event.stopPropagation();
		if (modifiers.stopImmediatePropagation) event.stopImmediatePropagation();
		if (modifiers.preventDefault) event.preventDefault();

		handler.call(this, event);
	};
}

export function listen<E extends EventTarget, K extends keyof HTMLElementEventMap>(
	element: E,
	type: K,
	fn: (event: HTMLElementEventMap[K]) => void,
	options?: AddEventListenerOptions & EventModifiers
) {
	const cb: any = options ? modifiers(options, fn) : fn;
	element.addEventListener(type, cb, options);
	return () => element.removeEventListener(type, cb, options);
}

export function clickOutside(node: HTMLElement, fn: (event: MouseEvent) => void) {
	return listen(window, 'click', (event) => {
		if (event.target instanceof HTMLElement && !node.contains(event.target)) {
			fn(event);
		}
	});
}
