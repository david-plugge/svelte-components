<script lang="ts" context="module">
	export interface RootProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DropdownState } from './state.svelte';

	let { children }: RootProps = $props();

	DropdownState.provide();
</script>

{@render children?.()}
