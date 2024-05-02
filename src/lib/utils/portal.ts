export function portal(node: HTMLElement, target?: HTMLElement | string) {
	function update(target: HTMLElement | string = document.body) {
		const el = typeof target === 'string' ? document.querySelector(target) : target;
		if (!(el instanceof HTMLElement)) {
			throw new Error('Portal target not found');
		}

		el.appendChild(node);
		el.hidden = false;
	}

	function destroy() {
		node.remove();
	}

	update(target);

	return {
		update,
		destroy
	};
}
