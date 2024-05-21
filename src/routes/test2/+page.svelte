<script lang="ts">
	import { enhance } from '$app/forms';
	import { createAction } from '$lib/utils/actions';
	import { listen } from '$lib/utils/events';
	import { generateId } from '$lib/utils/id';
	import { Set } from 'svelte/reactivity';

	class Select<T> {
		id = generateId();
		name = $state<string>();
		disabled = $state(false);
		#selected = new Set<T>();

		constructor(name: string) {
			this.name = name;
		}

		get selected() {
			return [...this.#selected];
		}
		set selected(selected: T[]) {
			this.#selected.clear();
			for (const item of selected) {
				this.#selected.add(item);
			}
		}

		select(item: T) {
			this.#selected.add(item);
		}
		unselect(item: T) {
			this.#selected.delete(item);
		}

		get props() {
			const that = this;
			return {
				get id() {
					return that.id;
				},
				get name() {
					return that.name;
				},
				get disabled() {
					return that.disabled;
				}
			} as const;
		}

		get action() {
			return (node: HTMLElement) => {
				return createAction();
			};
		}
	}

	class SelectOption<T> {
		id = generateId();
		#select: Select<T>;
		#value = $state() as T;
		disabled = $state(false);

		constructor(select: Select<T>, value: T) {
			this.#select = select;
			this.#value = value;
		}

		get value() {
			return this.#value;
		}

		get selected() {
			return this.#select.selected.includes(this.#value);
		}
		set selected(selected) {
			if (selected) {
				this.select();
			} else {
				this.unselect();
			}
		}

		select() {
			this.#select.select(this.#value);
		}

		unselect() {
			this.#select.unselect(this.#value);
		}

		toggle() {
			this.selected = !this.selected;
		}

		get props() {
			const that = this;
			return {
				get id() {
					return that.id;
				},
				type: 'button',
				role: 'option',
				tabindex: -1,
				get disabled() {
					return that.disabled;
				}
			} as const;
		}

		get action() {
			return (node: HTMLElement) => {
				return createAction(
					listen(node, 'click', () => {
						this.toggle();
					})
				);
			};
		}
	}

	const select = new Select('select');
	select.selected = [1, 5];

	const options = [
		new SelectOption(select, 1),
		new SelectOption(select, 2),
		new SelectOption(select, 3),
		new SelectOption(select, 4),
		new SelectOption(select, 5),
		new SelectOption(select, 6)
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
	<div class="flex gap-4" {...select.props}>
		{#each options as option}
			<div class="p-2" class:bg-neutral-100={option.selected} {...option.props} use:option.action>
				{option.value}
			</div>
		{/each}

		{#each select.selected as value}
			<input name={select.name} type="hidden" {value} />
		{/each}
	</div>

	<button type="submit">submit</button>
</form>

<pre>{JSON.stringify(select.selected, null, 2)}</pre>
