<script lang="ts">
	import { useActions } from '$lib/utils/actions';
	import { listen } from '$lib/utils/events';
	import { generateId } from '$lib/utils/id';
	import { getContext, setContext } from 'svelte';
	import { Set } from 'svelte/reactivity';

	class Listbox<Value> {
		loop = $state(false);
		multiple = $state(false);
		autoSelect = $state(!this.multiple);
		items = new Map<string, ListboxItem<Value>>();
		highlightedItem = $state<ListboxItem<Value>>();
		selectedItems = new Set<ListboxItem<Value>>();

		readonly id = generateId();
		#element: HTMLElement | null = null;
		get element() {
			if (!this.#element) {
				throw new Error(`Element not not mounted yet`);
			}
			return this.#element;
		}

		constructor() {
			setContext('listbox', this);
		}

		#getItems() {
			return Array.from(this.element.querySelectorAll<HTMLElement>('[role="option"]'))
				.map((item) => this.items.get(item.id)!)
				.filter((item) => !item.disabled);
		}

		#handleCursor(item?: ListboxItem<Value>) {
			if (!item) return;
			item.highlight();
			this.autoSelect && !this.multiple && item.select();
		}

		highlightFirstItem() {
			const items = this.#getItems();
			if (!items.length) return;
			this.#handleCursor(items[0]);
		}

		highlightLastItem() {
			const items = this.#getItems();
			if (!items.length) return;
			this.#handleCursor(items[items.length - 1]);
		}

		highlightNextItem() {
			const items = this.#getItems();
			if (!items.length) return;
			const focusIndex = items.findIndex((item) => item.highlighted);

			if (focusIndex === -1 || (this.loop && focusIndex === items.length - 1)) {
				this.#handleCursor(items[0]);
			} else {
				this.#handleCursor(items[focusIndex + 1]);
			}
		}

		highlightPrevItem() {
			const items = this.#getItems();
			if (!items.length) return;
			const focusIndex = items.findIndex((item) => item.highlighted);

			if (focusIndex === -1 || (this.loop && focusIndex === 0)) {
				this.#handleCursor(items[items.length - 1]);
			} else {
				this.#handleCursor(items[focusIndex - 1]);
			}
		}

		select(item: ListboxItem<Value>) {
			if (!this.multiple && this.selectedItems.size) {
				this.selectedItems.clear();
			}
			this.selectedItems.add(item);
		}

		unselect(item: ListboxItem<Value>) {
			this.selectedItems.delete(item);
		}

		handleFocus() {
			const items = this.#getItems();
			if (!items.length) return;
			items.find((item) => item.selected)?.highlight();
		}

		handleBlur() {
			this.highlightedItem = undefined;
		}

		get props() {
			const that = this;
			return {
				tabindex: 0,
				get id() {
					return that.id;
				}
			};
		}

		action(node: HTMLElement) {
			this.#element = node;
			return {
				destroy: useActions(() => (this.#element = null))
			};
		}
	}

	class ListboxFocus {
		listbox = getContext<Listbox<unknown>>('listbox');

		readonly id = generateId();
		#element: HTMLElement | null = null;
		get element() {
			if (!this.#element) {
				throw new Error(`Element not not mounted yet`);
			}
			return this.#element;
		}

		get props() {
			const that = this;
			return {
				tabindex: 0,
				get id() {
					return that.id;
				}
			};
		}

		action(node: HTMLElement) {
			this.#element = node;
			return {
				destroy: useActions(
					() => (this.#element = null),
					listen(node, 'keydown', (e) => {
						switch (e.key) {
							case 'ArrowDown': {
								this.listbox.highlightNextItem();

								break;
							}
							case 'ArrowUp': {
								this.listbox.highlightPrevItem();
								break;
							}
							case 'Home': {
								this.listbox.highlightFirstItem();
								break;
							}
							case 'End': {
								this.listbox.highlightLastItem();
								break;
							}

							case 'Enter':
							case ' ': {
								this.listbox.highlightedItem?.toggle();
								break;
							}
						}
					}),
					listen(node, 'focus', () => this.listbox.handleFocus()),
					listen(node, 'blur', () => this.listbox.handleBlur())
				)
			};
		}
	}

	class ListboxItem<Value> {
		readonly id = generateId();
		listbox = getContext<Listbox<Value>>('listbox');
		#disabled = $state(false);

		#element: HTMLElement | null = null;
		get element() {
			if (!this.#element) {
				throw new Error(`Element not not mounted yet`);
			}
			return this.#element;
		}

		constructor(readonly value: Value) {
			this.listbox.items.set(this.id, this);

			$effect(() => () => {
				this.listbox.items.delete(this.id);
			});
		}

		get disabled() {
			return this.#disabled;
		}

		set disabled(v) {
			this.unselect();
			this.#disabled = v;
		}

		get selected() {
			return this.listbox.selectedItems.has(this);
		}

		get highlighted() {
			return this.listbox.highlightedItem === this;
		}

		highlight() {
			this.listbox.highlightedItem = this;
		}

		select() {
			if (this.disabled) return;
			this.listbox.select(this);
		}

		unselect() {
			if (this.disabled) return;
			this.listbox.unselect(this);
		}

		toggle() {
			if (this.selected) {
				this.unselect();
			} else {
				this.select();
			}
		}

		get props() {
			const that = this;
			return {
				get role() {
					return 'option';
				},
				get id() {
					return that.id;
				},
				get 'aria-disabled'() {
					return that.disabled ? 'true' : undefined;
				},
				get 'aria-selected'() {
					return that.selected;
				}
			};
		}

		action(node: HTMLElement) {
			this.#element = node;
			return {
				destroy: useActions(
					() => (this.#element = null),
					listen(node, 'click', () => {
						if (this.disabled) return;

						this.highlight();
						if (this.listbox.multiple) {
							this.toggle();
						} else {
							this.select();
						}
					})
				)
			};
		}
	}

	const listbox = new Listbox();
	const listboxFocus = new ListboxFocus();

	const items = [
		//
		new ListboxItem(1),
		new ListboxItem(2),
		new ListboxItem(3),
		new ListboxItem(4)
	];

	items[2].disabled = true;

	let show = $state([true, true, true, true]);
</script>

<input type="checkbox" bind:checked={listbox.multiple} />
<input type="checkbox" bind:checked={listbox.autoSelect} />

{#each show as _, i}
	<input type="checkbox" bind:checked={show[i]} />
{/each}

<div
	{...listbox.props}
	use:listbox.action
	{...listboxFocus.props}
	use:listboxFocus.action
	class="flex flex-col gap-1 p-4"
>
	{#each items as item, i}
		{#if show[i]}
			<div
				class="p-1"
				class:bg-green-200={item.selected}
				class:ring-2={item.highlighted}
				class:bg-neutral-100={item.disabled}
				{...item.props}
				use:item.action
			>
				{item.value}
			</div>
		{/if}
	{/each}
</div>
