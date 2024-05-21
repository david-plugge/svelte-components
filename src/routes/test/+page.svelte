<script lang="ts">
	import { enhance } from '$app/forms';
	import { createAction } from '$lib/utils/actions';
	import { clickOutside, isOutside, listen } from '$lib/utils/events';
	import { useFloating } from '$lib/utils/floating';
	import { generateId } from '$lib/utils/id';
	import { usePortal } from '$lib/utils/portal';
	import { Set } from 'svelte/reactivity';
	import { fly } from 'svelte/transition';
	import * as KBD from '$lib/utils/kbd';
	import { tick } from 'svelte';
	import { back, first, forward, last, next, prev } from '$lib/utils/array';

	class Select<T> {
		id = generateId();
		name = $state<string>();
		disabled = $state(false);
		#selected = new Set<T>();
		#open = $state(false);
		#multiple = $state(false);

		#triggerEl: HTMLElement | null = null;
		#highlightedEl = $state<HTMLElement | null>(null);

		#ids = {
			trigger: generateId(),
			menu: generateId()
		};

		constructor(name: string) {
			this.name = name;
		}

		get selected() {
			const v = [...this.#selected];
			return this.#multiple ? v : v[0];
		}
		set selected(selected: T | T[]) {
			this.#selected.clear();

			const v = Array.isArray(selected) ? selected : [selected];

			for (const item of v) {
				this.#selected.add(item);
			}
		}

		get open() {
			return this.#open;
		}
		set open(open) {
			this.#open = open;

			if (open) {
				tick().then(() => {
					const selected = document
						.getElementById(this.#ids.menu)
						?.querySelector<HTMLElement>('[aria-selected="true"]');
					if (selected) {
						this.#highlightedEl = selected;
					}
				});
			} else {
				// this.#triggerEl?.focus();
				// this.#triggerEl = null;
				this.#highlightedEl = null;
			}
		}

		select(item: T) {
			if (!this.#multiple) {
				this.#selected.clear();
				this.#selected.add(item);
				this.open = false;
			}
			this.#selected.add(item);
		}
		unselect(item: T) {
			this.#selected.delete(item);
		}
		toggle(item: T) {
			if (this.#selected.has(item)) {
				this.unselect(item);
			} else {
				this.select(item);
			}
		}

		trigger() {
			const that = this;

			return {
				get props() {
					return {
						get id() {
							return that.#ids.trigger;
						},
						type: 'button',
						get disabled() {
							return that.disabled;
						}
					} as const;
				},

				action: (node: HTMLElement) => {
					return createAction(
						listen(node, 'click', () => {
							node.focus();
							this.#triggerEl = node;
							this.open = !this.open;
						}),
						listen(node, 'keydown', (e) => {
							const candidates = [
								...(document
									.getElementById(this.#ids.menu)
									?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
							];

							const currentIndex = this.#highlightedEl
								? candidates.indexOf(this.#highlightedEl)
								: -1;

							switch (e.key) {
								case KBD.TAB:
								case KBD.ESCAPE:
									this.open = false;
									break;
								case KBD.ENTER:
								case KBD.SPACE: {
									if (!this.open) break;
									this.open = false;
									e.preventDefault();
									break;
								}
								case KBD.ARROW_DOWN: {
									this.#highlightedEl = next(candidates, currentIndex, true);
									break;
								}
								case KBD.ARROW_UP: {
									this.#highlightedEl = prev(candidates, currentIndex, true);
									break;
								}
								case KBD.PAGE_DOWN: {
									this.#highlightedEl = forward(candidates, currentIndex, 10, true);
									break;
								}
								case KBD.PAGE_UP: {
									this.#highlightedEl = back(candidates, currentIndex, 10, true);
									break;
								}
								case KBD.HOME: {
									this.#highlightedEl = first(candidates);
									break;
								}
								case KBD.END: {
									this.#highlightedEl = last(candidates);
									break;
								}
							}
						})
					);
				}
			};
		}

		menu() {
			const that = this;
			return {
				get props() {
					return {
						get id() {
							return that.#ids.menu;
						}
					} as const;
				},

				action: (node: HTMLElement) => {
					return createAction(
						usePortal(node),
						useFloating({
							floating: node,
							reference: document.getElementById(this.#ids.trigger)!,
							placement: 'bottom'
						}),
						clickOutside(node, (e) => {
							const trigger = document.getElementById(this.#ids.trigger);
							if (!trigger || isOutside(e, trigger)) {
								this.open = false;
							}
						})
					);
				}
			};
		}

		option({
			value,
			disabled = false,
			id = generateId()
		}: {
			value: T;
			disabled?: boolean;
			id?: string;
		}) {
			const that = this;
			return {
				get value() {
					return value;
				},
				get selected() {
					return that.#selected.has(value);
				},
				select() {
					that.select(value);
				},
				unselect() {
					that.unselect(value);
				},
				get props() {
					return {
						get id() {
							return id;
						},
						get disabled() {
							return disabled;
						},
						role: 'option',
						get 'aria-selected'() {
							return that.#selected.has(value);
						},
						get 'data-highlight'() {
							return that.#highlightedEl?.id === id ? true : undefined;
						}
					} as const;
				},

				action: (node: HTMLElement) => {
					return createAction(listen(node, 'click', () => this.toggle(value)));
				}
			};
		}
	}

	const select = new Select('select');

	select.selected = [1, 5];

	const trigger = select.trigger();
	const menu = select.menu();
	const options = [
		select.option({ value: 1 }),
		select.option({ value: 2 }),
		select.option({ value: 3 }),
		select.option({ value: 4 }),
		select.option({ value: 5 }),
		select.option({ value: 6 })
	];

	function setA() {
		select.selected = [1, 2, 3];
	}
	function setB() {
		select.selected = [4, 5, 6];
	}
</script>

<button onclick={setA}>set A</button>
<button onclick={setB}>set B</button>

<form method="post" use:enhance>
	<button {...trigger.props} use:trigger.action>Choose</button>

	{#if select.open}
		<div
			transition:fly={{ y: 15 }}
			class="flex flex-col gap-4 border bg-neutral-100 shadow"
			{...menu.props}
			use:menu.action
		>
			{#each options as option}
				<div
					class="px-4 py-2 data-[highlight]:outline"
					class:bg-blue-200={option.selected}
					{...option.props}
					use:option.action
				>
					{option.value}
				</div>
			{/each}
		</div>
	{/if}

	<!-- {#each select.selected as value}
		<input name={select.name} type="hidden" {value} />
	{/each} -->

	<button type="submit">submit</button>
</form>

<pre>{JSON.stringify(select.selected, null, 2)}</pre>
