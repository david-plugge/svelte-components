<script lang="ts">
	import { listen } from '$lib/utils/events';
	import { getContext, setContext } from 'svelte';
	import { Set } from 'svelte/reactivity';

	class ListboxState {
		multiple = $state(false);
		autoSelect = $state(!this.multiple);
		open = $state(false);
		selected = new Set<ListboxItem>();
		focused = $state<ListboxItem | null>(null);

		listbox = $state<Listbox>();
		items = new Map<string, ListboxItem>();

		constructor() {
			setContext('listbox-state', this);
		}

		static use() {
			const state = getContext<ListboxState>('listbox-state');
			if (!state) {
				throw new Error('Listbox state not available');
			}
			return state;
		}

		select(item: any) {
			if (this.selected.has(item)) return;

			if (!this.multiple && this.selected.size !== 0) this.selected.clear();
			this.selected.add(item);
		}

		unselect(item: any) {
			this.selected.delete(item);
		}
	}

	class Listbox {
		#state = ListboxState.use();
		#node: HTMLElement | null = null;
		readonly id = crypto.randomUUID();

		constructor() {
			this.#state.listbox = this;
			$effect(() => () => (this.#state.listbox = undefined));
		}

		get open() {
			return this.#state.open;
		}

		#getNode() {
			if (!this.#node) throw new Error('Element not mounted');
			return this.#node;
		}

		#getSelectionInfo() {
			const options = Array.from(
				this.#getNode().querySelectorAll<HTMLElement>('[role="option"]')
			).map((item) => this.#state.items.get(item.id)!);
			const focusIndex = options.findIndex((item) => item.focused);

			return {
				options,
				focusIndex
			};
		}

		#handleCursor(item?: ListboxItem) {
			if (!item) return;

			item.focus();
			this.#state.autoSelect && !this.#state.multiple && item.select();
		}

		next() {
			const { options, focusIndex } = this.#getSelectionInfo();
			const newIndex = (focusIndex + 1) % options.length;
			this.#handleCursor(options[newIndex]);
		}

		prev() {
			const { options, focusIndex } = this.#getSelectionInfo();
			const newIndex = (options.length + focusIndex - 1) % options.length;
			this.#handleCursor(options[newIndex]);
		}

		first() {
			const { options } = this.#getSelectionInfo();
			this.#handleCursor(options[0]);
		}

		last() {
			const { options } = this.#getSelectionInfo();
			this.#handleCursor(options[options.length - 1]);
		}

		get action() {
			return (node: HTMLElement) => {
				this.#node = node;

				const handleFocus = () => {
					const { options } = this.#getSelectionInfo();
					options.find((item) => item.selected)?.focus();
				};

				const handleBlur = () => {
					this.#state.focused = null;
				};

				const handleKeydown = (e: KeyboardEvent) => {
					switch (e.key) {
						case 'ArrowDown': {
							this.next();

							break;
						}
						case 'ArrowUp': {
							this.prev();
							break;
						}
						case 'Home': {
							this.first();
							break;
						}
						case 'End': {
							this.last();
							break;
						}

						case 'Enter':
						case ' ':
							this.#state.focused?.toggle();
							break;
					}
				};

				node.addEventListener('focus', handleFocus);
				node.addEventListener('blur', handleBlur);
				node.addEventListener('keydown', handleKeydown);

				return {
					destroy: () => {
						this.#node = null;
						node.removeEventListener('blur', handleBlur);
						node.removeEventListener('keydown', handleKeydown);
					}
				};
			};
		}

		get props() {
			const that = this;
			return {
				id: this.#state.listbox!.id,
				tabindex: 0,
				role: 'menu',
				get 'aria-expanded'() {
					return that.#state.open;
				}
			} as const;
		}
	}

	class ListboxItem {
		#state = ListboxState.use();
		#value = $state<any>();
		readonly id = crypto.randomUUID();

		constructor(value: any) {
			this.#value = value;
			this.#state.items.set(this.id, this);
			$effect(() => () => this.#state.items.delete(this.id));
		}

		get value() {
			return this.#value;
		}

		get selected() {
			return this.#state.selected.has(this);
		}

		get focused() {
			return this.#state.focused === this;
		}

		select() {
			this.#state.select(this);
		}

		focus() {
			this.#state.focused = this;
		}

		unselect() {
			this.#state.unselect(this);
		}

		toggle() {
			if (this.selected) {
				this.unselect();
			} else {
				this.select();
			}
		}

		get action() {
			return (node: HTMLElement) => {
				this.#state.items.set(this.id, this);

				const handleClick = () => {
					this.focus();
					this.toggle();
				};

				const unsub = [listen(node, 'click', handleClick)];

				return {
					destroy: () => {
						this.#state.unselect(this);
						this.#state.items.delete(this.id);
						unsub.forEach((fn) => fn());
					}
				};
			};
		}

		get props() {
			const that = this;
			return {
				id: this.id,
				role: 'option',
				get 'aria-selected'() {
					return that.selected;
				}
			} as const;
		}
	}

	const _state = new ListboxState();
	const listbox = new Listbox();

	const items = [
		//
		new ListboxItem(1),
		new ListboxItem(2),
		new ListboxItem(3),
		new ListboxItem(4)
	];

	let show = $state([true, true, true, true]);

	$inspect(_state);
</script>

<input type="checkbox" bind:checked={_state.multiple} />
<input type="checkbox" bind:checked={_state.autoSelect} />

{#each show as item, i}
	<input type="checkbox" bind:checked={show[i]} />
{/each}

<div {...listbox.props} use:listbox.action class="p-4">
	{#each items as item, i}
		{#if show[i]}
			<div
				class:bg-green-200={item.selected}
				class:ring-2={item.focused}
				{...item.props}
				use:item.action
			>
				{item.value}
			</div>
		{/if}
	{/each}
</div>
