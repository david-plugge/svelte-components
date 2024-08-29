import { clickOutside } from '$lib/utils/events';
import { useFloating } from '$lib/utils/floating';
import { usePortal } from '$lib/utils/portal';
import { generateId } from '$lib/utils/id';
import { on } from 'svelte/events';

export interface SelectState {
	open: boolean;
	selected: (string | null) | string[];

	triggerId: string;
	contentId: string;
}

export class Select {
	static defaults(): SelectState {
		return {
			open: false,
			selected: null,
			triggerId: generateId(),
			contentId: generateId()
		};
	}

	state = $state() as SelectState;

	constructor(state: SelectState = Select.defaults()) {
		this.state = state;
	}

	get open() {
		return this.state.open;
	}
	set open(v) {
		this.state.open = v;
	}
	get multiple() {
		return Array.isArray(this.state.selected);
	}
	get selected() {
		return this.state.selected;
	}
	set selected(v) {
		this.state.selected = v;
	}

	isSelected(value: string) {
		const { selected } = this;
		if (Array.isArray(selected)) {
			return selected.includes(value);
		}
		return selected === value;
	}

	select(value: string) {
		if (this.isSelected(value)) return;

		if (Array.isArray(this.selected)) {
			this.selected = [...this.selected, value];
		} else {
			this.selected = value;
		}
	}
	unselect(value: string) {
		if (!this.isSelected(value)) return;

		if (Array.isArray(this.selected)) {
			this.selected = this.selected.filter((v) => v !== value);
		} else {
			this.selected = null;
		}
	}
	toggle(value: string) {
		if (this.isSelected(value)) {
			this.unselect(value);
		} else {
			this.select(value);
		}
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
					'aria-hidden': !state.open,
					role: 'menu'
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

	item(value: string, label: string) {
		const that = this;

		return {
			get label() {
				return label;
			},
			get value() {
				return value;
			},
			get selected() {
				return that.isSelected(value);
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
						that.toggle(value);
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
