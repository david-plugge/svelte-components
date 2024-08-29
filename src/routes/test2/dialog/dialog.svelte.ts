import { clickOutside } from '$lib/utils/events';
import { usePortal } from '$lib/utils/portal';
import { generateId } from '$lib/utils/id';
import { on } from 'svelte/events';
import { useFocusTrap } from '$lib/utils/trap';

export interface DialogState {
	open: boolean;

	triggerId: string;
	contentId: string;
}

export class Dialog {
	static defaults(): DialogState {
		return {
			open: false,
			triggerId: generateId(),
			contentId: generateId()
		};
	}

	state = $state() as DialogState;

	constructor(state: DialogState = Dialog.defaults()) {
		this.state = state;
	}

	get open() {
		return this.state.open;
	}
	set open(v) {
		this.state.open = v;
	}

	trigger() {
		const state = this.state;
		return {
			get props() {
				return {
					id: state.triggerId,
					'aria-expanded': state.open
				};
			},
			action(node: HTMLElement) {
				function handleClick() {
					state.open = !state.open;
				}

				const cleanups = on(node, 'click', handleClick);

				return {
					destroy() {
						cleanups();
					}
				};
			}
		};
	}

	content() {
		const state = this.state;

		return {
			get props() {
				return {
					id: state.contentId,
					'aria-hidden': !state.open
				};
			},

			action(node: HTMLElement) {
				const trigger = document.getElementById(state.triggerId);

				if (!trigger) return;

				const cleanups = [
					on(node, 'click', (e) => {
						if (e.target === node) {
							state.open = false;
						}
					}),

					usePortal(node),

					useFocusTrap(node)
				];

				return {
					destroy() {
						cleanups.forEach((fn) => fn());
					}
				};
			}
		};
	}
}
