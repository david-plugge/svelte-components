<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { slide } from 'svelte/transition';

	export interface ContentProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { AccordionItemState } from './state.svelte';

	let { children, ...attributes }: ContentProps = $props();

	const state = AccordionItemState.context.use();
</script>

{#if state.isOpen}
	<div {...attributes} transition:slide={{ axis: 'y' }}>
		{@render children?.()}
	</div>
{/if}
