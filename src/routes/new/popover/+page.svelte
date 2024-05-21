<script lang="ts" context="module">
	type Getter<T> = () => T;
	type Setter<T> = (value: T) => void;
	type ReadableProp<T> = T | Getter<T> | { get: Getter<T> };
	type WritableProp<T> = T | { get: Getter<T>; set: Setter<T> };

	type ReadableBox<T> = { readonly value: T };
	type WritableBox<T> = { value: T };

	class Box<T> {
		constructor(
			private readonly get: () => T,
			private readonly set?: (value: T) => void
		) {}

		get value() {
			return this.get();
		}

		set value(value: T) {
			if (typeof this.set !== 'function') {
				throw new Error('Cannot set readonly value');
			}
			this.set(value);
		}

		static readable<T>(
			value: ReadableProp<T>,
			{ proxy = false }: { proxy?: boolean } = {}
		): ReadableBox<T> {
			if (typeof value === 'function') {
				return new Box(value as Getter<T>);
			}
			if (value !== null && typeof value === 'object' && 'get' in value) {
				return new Box(value.get.bind(value) as Getter<T>);
			}
			if (proxy) {
				const boxed = $state({ value });
				return boxed;
			}
			return {
				value
			};
		}

		static writable<T>(value: WritableProp<T>): WritableBox<T> {
			if (value !== null && typeof value === 'object' && 'get' in value && 'set' in value) {
				return new Box(value.get.bind(value), value.set.bind(value));
			}
			const boxed = $state({ value });
			return boxed;
		}
	}
</script>

<script lang="ts">
	import { clickOutside, listen } from '$lib/utils/events';

	import { useFloating, type FloatingConfig } from '$lib/utils/floating';
	import { generateId } from '$lib/utils/id';
	import { usePortal } from '$lib/utils/portal';
	import type { Action } from 'svelte/action';

	interface PopoverRootProps {
		open?: WritableProp<boolean>;
		positioning?: ReadableProp<FloatingConfig>;
		triggerId?: ReadableProp<string>;
		contentId?: ReadableProp<string>;
	}

	class PopoverState {
		open: WritableBox<boolean>;
		positioning: ReadableBox<FloatingConfig>;
		triggerId: ReadableBox<string>;
		contentId: ReadableBox<string>;

		constructor({
			open = false,
			positioning = { placement: 'bottom' },
			triggerId = generateId(),
			contentId = generateId()
		}: PopoverRootProps = {}) {
			this.open = Box.writable(open);
			this.positioning = Box.readable(positioning);
			this.triggerId = Box.readable(triggerId);
			this.contentId = Box.readable(contentId);
		}
	}

	class PopoverRoot {
		#open: WritableBox<boolean>;
		#positioning: ReadableBox<FloatingConfig>;
		trigger = $state<PopoverTrigger>();
		content = $state<PopoverContent>();

		constructor({ open = false, positioning = { placement: 'bottom' } }: PopoverRootProps = {}) {
			this.#open = Box.writable(open);
			this.#positioning = Box.readable(positioning);
		}

		get open() {
			return this.#open.value;
		}

		set open(v) {
			this.#open.value = v;
		}

		get positioning() {
			return this.#positioning.value;
		}
	}

	interface PopoverTriggerProps {
		id?: ReadableProp<string>;
	}

	function createAction<
		T extends HTMLElement,
		Attributes extends Record<string, any> = Record<never, any>
	>(...actions: Array<(node: T) => (() => void) | void>): Action<T, undefined, Attributes> {
		return (node: T) => {
			const cleanups = actions.map((fn) => fn(node));

			return {
				destroy() {
					cleanups.forEach((fn) => fn?.());
				}
			};
		};
	}

	class PopoverTrigger {
		#id: ReadableBox<string>;
		element = $state<HTMLElement>();

		constructor(
			readonly root: PopoverRoot,
			{ id = generateId() }: PopoverTriggerProps = {}
		) {
			this.#id = Box.readable(id);
		}

		get id() {
			return this.#id.value;
		}

		get action() {
			return createAction(
				(node) => {
					this.element = node;
					this.root.trigger = this;
					return () => {
						this.root.trigger = undefined;
						this.element = undefined;
					};
				},
				(node) =>
					listen(node, 'click', () => {
						this.root.open = !this.root.open;
					})
			);
		}

		get props() {
			const that = this;
			return {
				get id() {
					return that.id;
				},
				get 'aria-expanded'() {
					return that.root.open;
				}
			};
		}
	}

	class PopoverContent {
		#id: ReadableBox<string>;
		element = $state<HTMLElement>();

		constructor(
			readonly root: PopoverRoot,
			{ id = generateId() }: PopoverTriggerProps = {}
		) {
			this.#id = Box.readable(id);
		}

		get id() {
			return this.#id.value;
		}

		get action() {
			return createAction(
				(node) => {
					this.element = node;
					this.root.content = this;
					return () => {
						this.root.content = undefined;
						this.element = undefined;
					};
				},
				(node) =>
					clickOutside(node, (e) => {
						if (
							e.target instanceof HTMLElement &&
							!this.root.trigger?.element?.contains(e.target)
						) {
							this.root.open = false;
						}
					}),
				(node) =>
					$effect.root(() => {
						if (!this.root.trigger?.element) return;

						return useFloating({
							floating: node,
							reference: this.root.trigger.element,
							...this.root.positioning
						});
					}),
				(node) => $effect.root(() => usePortal(node))
			);
		}

		get props() {
			const that = this;
			return {
				get id() {
					return that.id;
				}
			};
		}
	}

	const root = new PopoverRoot({
		positioning: {
			placement: 'bottom'
		}
	});
	const trigger = new PopoverTrigger(root);
	const content = new PopoverContent(root);
</script>

<div>
	<button {...trigger.props} use:trigger.action>Popover</button>

	{#if root.open}
		<div class="rounded-lg border bg-white p-2" {...content.props} use:content.action>
			Hello world
		</div>
	{/if}
</div>
