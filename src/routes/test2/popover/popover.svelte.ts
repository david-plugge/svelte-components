import { clickOutside } from '$lib/utils/events';
import { useFloating } from '$lib/utils/floating';
import { generateId } from '$lib/utils/id';
import { usePortal } from '$lib/utils/portal';
import { on } from 'svelte/events';

export interface PopoverState {
	open: boolean;

	triggerId: string;
	contentId: string;
}

export class Popover {
	static defaults(): PopoverState {
		return {
			open: false,
			triggerId: generateId(),
			contentId: generateId()
		};
	}

	state = $state() as PopoverState;

	constructor(state: PopoverState = Popover.defaults()) {
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
					clickOutside(node, (e) => {
						if (e.target instanceof HTMLElement && !trigger?.contains(e.target)) {
							state.open = false;
						}
					}),

					useFloating({
						floating: node,
						reference: trigger,
						placement: 'bottom'
					}),

					usePortal(node)
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
