import { clickOutside } from '$lib/utils/events';
import { useFloating } from '$lib/utils/floating';
import { usePortal } from '$lib/utils/portal';
import { generateId } from '$lib/utils/id';
import { on } from 'svelte/events';

export interface ComboboxState {
	open: boolean;
	value: string;
	inputId: string;
	contentId: string;
}

export class Combobox {
	static defaults(): ComboboxState {
		return {
			open: false,
			value: '',
			inputId: generateId(),
			contentId: generateId()
		};
	}

	state = $state() as ComboboxState;

	constructor(state: ComboboxState = Combobox.defaults()) {
		this.state = state;
	}

	get open() {
		return this.state.open;
	}
	set open(v) {
		this.state.open = v;
	}
	get value() {
		return this.state.value;
	}
	set value(v) {
		this.state.value = v;
	}

	input() {
		const state = this.state;
		return {
			get props() {
				return {
					id: state.inputId,
					'aria-expanded': state.open,
					value: state.value
				};
			},
			action(node: HTMLInputElement) {
				const cleanups = [
					on(node, 'focus', () => {
						state.open = true;
					}),
					on(node, 'input', () => {
						state.value = node.value;
					})
				];

				return {
					destroy() {
						cleanups.forEach((fn) => fn());
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
				const trigger = document.getElementById(state.inputId);

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
						placement: 'bottom',
						sameWidth: true
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

	static itemDefaults() {
		return {
			id: generateId()
		};
	}

	item(value: string) {
		const that = this;

		return {
			get value() {
				return value;
			},
			get selected() {
				return that.value === value;
			},
			get props() {
				return {
					'aria-selected': this.selected,
					'aria-role': 'option'
				} as const;
			},
			action(node: HTMLElement) {
				const cleanups = [
					on(node, 'click', () => {
						that.value = value;
						that.open = false;
					})
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
