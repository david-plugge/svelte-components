import { createFocusTrap } from 'focus-trap';

export function useFocusTrap(node: HTMLElement) {
	const trap = createFocusTrap(node, {
		escapeDeactivates: false
	});

	trap.activate();

	return () => {
		trap.deactivate();
	};
}
