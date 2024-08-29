import { generateId } from '$lib/utils/id';
import { on } from 'svelte/events';

export interface CollapsibleState {
	open: boolean;

	triggerId: string;
	contentId: string;
}

export class Collapsible {
	static defaults(): CollapsibleState {
		return {
			open: false,
			triggerId: generateId(),
			contentId: generateId()
		};
	}

	state = $state() as CollapsibleState;

	constructor(state: CollapsibleState = Collapsible.defaults()) {
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

			action(node: HTMLElement) {}
		};
	}
}
