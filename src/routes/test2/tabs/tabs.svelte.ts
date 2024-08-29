import { on } from 'svelte/events';

export interface TabsState {
	active: string;
}

export class Tabs {
	static defaults() {
		return {} satisfies Partial<TabsState>;
	}

	state = $state() as TabsState;

	constructor(state: TabsState) {
		this.state = state;
	}

	get active() {
		return this.state.active;
	}
	set active(v) {
		this.state.active = v;
	}

	trigger(id: string) {
		const state = this.state;
		return {
			get props() {
				return {};
			},
			action(node: HTMLElement) {
				function handleClick() {
					state.active = id;
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

	content(id: string) {
		const state = this.state;

		return {
			get active() {
				return state.active === id;
			},

			get props() {
				return {
					'aria-hidden': !state.active
				};
			},

			action(node: HTMLElement) {}
		};
	}
}
