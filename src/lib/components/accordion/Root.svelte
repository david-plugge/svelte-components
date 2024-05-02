<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import { AccordionState } from './state.svelte';

	export interface RootProps {
		children?: Snippet;
		multiple?: boolean;
	}
</script>

<script lang="ts">
	let { children, multiple = false }: RootProps = $props();

	const state = AccordionState.context.provide({
		multiple
	});
</script>

{@render children?.()}
