import { listen, type EventModifiers } from '../events';

export function event<K extends keyof HTMLElementEventMap>(
	type: K,
	fn: (
		event: HTMLElementEventMap[K] & {
			currentTarget: HTMLElement;
		}
	) => void,
	options?: AddEventListenerOptions & EventModifiers
) {
	return (node: EventTarget) => {
		return listen(node, type, fn, options);
	};
}
