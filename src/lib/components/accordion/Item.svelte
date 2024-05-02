<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import { AccordionItemState } from './state.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}
</script>

<script lang="ts">
	let { children, ...attributes }: ItemProps = $props();

	const state = AccordionItemState.context.provide();

	$effect(() => () => state.close());
</script>

<div {...attributes}>
	{@render children()}
</div>
