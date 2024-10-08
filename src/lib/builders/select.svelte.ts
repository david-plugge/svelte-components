import { createAction } from '$lib/utils/behaviors';
import { event } from '$lib/utils/behaviours/event';
import { clickOutside } from '$lib/utils/events';
import { useFloating } from '$lib/utils/floating';
import { generateId } from '$lib/utils/id';
import { Set } from 'svelte/reactivity';

interface SelectItem<T> {
	value: T;
	label?: string;
}

export class Select<T> {
	#open = $state(false);
	#multiple = $state(false);
	#selected = $state<SelectItem<T>[]>([]);

	#ids = {
		trigger: generateId(),
		content: generateId()
	};

	get open() {
		return this.#open;
	}
	set open(open) {
		this.#open = open;
	}

	get selected() {
		return [...this.#selected].map((v) => v.value);
	}

	trigger() {
		const that = this;
		return {
			get props() {
				return {
					id: that.#ids.trigger,
					type: 'button',
					tabindex: 0,
					get 'aria-expanded'() {
						return that.#open;
					}
				} as const;
			},
			action: createAction(
				event('click', () => {
					this.open = !this.open;
				}),
				event('keydown', (e) => {
					const content = document.getElementById(this.#ids.content);
					if (!content) return;
					const candidates = Array.from(content.querySelectorAll<HTMLElement>('[role="option"]'));
					const current = content.querySelector<HTMLElement>('[data-highlighted]');
					const currentIndex = current ? candidates.indexOf(current) : -1;

					switch (e.key) {
						case 'ArrowDown':
							if (currentIndex === -1) {
								candidates[0].dataset.highlighted = '';
							} else {
								delete current?.dataset.highlighted;
								candidates[(currentIndex + 1) % candidates.length].dataset.highlighted = '';
							}
							break;
						case 'ArrowUp':
							if (currentIndex === -1) {
								candidates[candidates.length - 1].dataset.highlighted = '';
							} else {
								delete current?.dataset.highlighted;
								candidates[
									(currentIndex - 1 + candidates.length) % candidates.length
								].dataset.highlighted = '';
							}
							break;
						case 'Home':
							delete current?.dataset.highlighted;
							candidates[0].dataset.highlighted = '';
							break;
						case 'End':
							delete current?.dataset.highlighted;
							candidates[candidates.length - 1].dataset.highlighted = '';
							break;
						case 'Escape':
							this.open = false;
							break;
					}
				})
			)
		};
	}

	content() {
		const that = this;
		return {
			get props() {
				return {
					id: that.#ids.content,
					role: 'listbox'
				} as const;
			},
			action: createAction(
				(node) =>
					useFloating({
						floating: node,
						reference: document.getElementById(this.#ids.trigger)!
					}),
				(node) =>
					clickOutside(node, (e) => {
						if (
							e.target instanceof HTMLElement &&
							!document.getElementById(this.#ids.trigger)?.contains(e.target)
						) {
							this.open = false;
						}
					})
			)
		};
	}

	group() {
		const id = generateId();

		return {
			get props() {
				return {
					id
				} as const;
			},
			action(node: HTMLElement) {}
		};
	}

	item(options: SelectItem<T> & { disabled?: boolean }) {
		const id = generateId();
		const selected = $derived(false);

		// $effect(() => {
		// 	console.log('START', options);

		// 	return () => {
		// 		console.log('END');
		// 	};
		// });

		return {
			id,
			role: 'option',
			get 'aria-selected'() {
				return selected;
			},
			get 'aria-disabled'() {
				return options.disabled ? 'true' : undefined;
			}
		} as const;

		// acton: createAction(
		// 	event('click', () => {}),
		// 	event('pointerenter', (e) => {
		// 		e.currentTarget.dataset.highlight = 'true';
		// 	})
		// )
	}
}
