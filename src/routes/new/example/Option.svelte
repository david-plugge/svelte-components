<script lang="ts" context="module">
	import { Box, type WritableBox, type WritableProp } from '$lib/headless/box.svelte';
	import { Root } from './Root.svelte';

	interface OptionProps {
		disabled?: WritableProp<boolean>;
	}

	class Option {
		#disabled: WritableBox<boolean>;
		#root: Root;

		constructor(root: Root, { disabled = false }: OptionProps = {}) {
			this.#disabled = Box.writable(disabled);
			this.#root = root;
		}

		get disabled() {
			return this.#disabled.value;
		}
		set disabled(v) {
			this.#disabled.value = v;
		}

		get selected() {
			return this.#root.selected === this;
		}
		set selected(v) {
			if (v) {
				this.#root.selected = this;
			} else {
				this.#root.selected = null;
			}
		}
	}
</script>

<script lang="ts">
	import { getContext, type Snippet } from 'svelte';

	let {
		children,
		asChild = false,
		disabled = false
	}: {
		children: Snippet<[Option]>;
		asChild?: boolean;
		disabled?: boolean;
		selected?: boolean;
	} = $props();

	const root = getContext<Root>('root');

	const option = new Option(root, {
		get disabled() {
			return disabled;
		},
		set disabled(v) {
			disabled = v;
		}
	});
</script>

{#if asChild}
	{@render children(option)}
{:else}
	<div>
		{@render children(option)}
	</div>
{/if}
