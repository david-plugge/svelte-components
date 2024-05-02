<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { ListboxItemState } from './state.svelte';

	export interface ItemProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
	}
</script>

<script lang="ts">
	let { children, ...attributes }: ItemProps = $props();

	const state = new ListboxItemState();
</script>

<div
	id={state.id}
	role="option"
	aria-selected={state.selected}
	{...attributes}
	onclick={() => {
		state.toggle();
	}}
>
	{@render children?.()}
</div>
