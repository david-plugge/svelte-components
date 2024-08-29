<!-- <script lang="ts" context="module">
	type Props<T extends HTMLElement> = HTMLAttributes<T>;
	type Behavior<T extends HTMLElement> = (node: T) => (() => void) | void;

	type Builder<T extends HTMLElement> = {
		props: Props<T>;
		behavior: Behavior<T>;
	};

	function mergeBuilders<T extends HTMLElement>(...builders: Builder<T>[]): Builder<T> {
		return {
			behavior: (node) => {
				const fns = builders.map((b) => b.behavior(node));
				return () => {
					fns.forEach((fn) => fn?.());
				};
			},
			get props() {
				const props = {};
				for (const builder of builders) {
					Object.assign(props, builder.props);
				}
				return props;
			}
		};
	}

	interface ReadableBox<T> {
		readonly value: T;
	}
	interface WritableBox<T> {
		value: T;
	}
</script> -->

<script lang="ts">
	import { useActions } from '$lib/utils/actions';
	import { listen } from '$lib/utils/events';
	import { generateId } from '$lib/utils/id';

	class Listbox {
		#id = generateId();

		get props() {
			return {
				role: 'listbox',
				id: this.#id
			} as const;
		}

		action(node: HTMLElement) {
			return {
				destroy() {}
			};
		}
	}

	class ListboxItem<T> {
		#id = generateId();
		#value: T;
		#label: string;

		constructor(options: { value: T; label: string }) {
			this.#value = options.value;
			this.#label = options.label;
		}

		get props() {
			return {
				id: this.#id,
				role: 'option'
			} as const;
		}

		action(node: HTMLElement) {
			return {
				destroy: useActions(
					listen(node, 'click', () => {
						console.log(this.#value);
					})
				)
			};
		}

		get value() {
			return this.#value;
		}
		get label() {
			return this.#label;
		}
	}

	const lb = new Listbox();

	const items = [
		new ListboxItem({ value: 1, label: '1' }),
		new ListboxItem({ value: 2, label: '2' }),
		new ListboxItem({ value: 3, label: '3' }),
		new ListboxItem({ value: 4, label: '4' }),
		new ListboxItem({ value: 5, label: '5' })
	];
</script>

<div {...lb.props} use:lb.action>
	{#each items as item}
		<div {...item.props} use:item.action>{item.value}</div>
	{/each}
</div>
