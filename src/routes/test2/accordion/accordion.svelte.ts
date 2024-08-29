import { generateId } from '$lib/utils/id';
import type { Action } from 'svelte/action';
import type { HTMLAttributes } from 'svelte/elements';
import { on } from 'svelte/events';

export interface AccordionState {
	open: boolean;
	active: (string | null) | string[];
}

export interface AccordionItem {
	readonly active: boolean;
	trigger(): { props: HTMLAttributes<HTMLElement>; action: Action };
	content(): { props: HTMLAttributes<HTMLElement>; action: Action };
}

export class Accordion {
	static defaults(): AccordionState {
		return {
			open: false,
			active: null
		};
	}

	state = $state() as AccordionState;

	constructor(state: AccordionState = Accordion.defaults()) {
		this.state = state;
	}

	get open() {
		return this.state.open;
	}
	set open(v) {
		this.state.open = v;
	}

	get active() {
		return this.state.active;
	}
	set active(v) {
		this.state.active = v;
	}

	isActive(id: string) {
		return this.active?.includes(id) ?? false;
	}

	activate(id: string) {
		if (Array.isArray(this.active)) {
			this.active = [...this.active, id];
		} else {
			this.active = id;
		}
	}
	deactivate(id: string) {
		if (Array.isArray(this.active)) {
			this.active = this.active.filter((item) => item !== id);
		} else if (this.active === id) {
			this.active = null;
		}
	}
	toggle(id: string) {
		if (this.isActive(id)) {
			this.deactivate(id);
		} else {
			this.activate(id);
		}
	}

	item(id: string): AccordionItem {
		const that = this;

		const itemState = {
			triggerId: generateId(),
			contentId: generateId()
		};

		return {
			get active() {
				return that.isActive(id);
			},
			trigger() {
				return {
					get props() {
						return {
							id: itemState.triggerId,
							'aria-expanded': that.isActive(id)
						};
					},
					action(node: HTMLElement) {
						function handleClick() {
							that.toggle(id);
						}

						const cleanups = on(node, 'click', handleClick);

						return {
							destroy() {
								cleanups();
							}
						};
					}
				};
			},
			content() {
				return {
					get props() {
						return {
							id: itemState.contentId
						};
					},
					action(node: HTMLElement) {}
				};
			}
		};
	}
}
