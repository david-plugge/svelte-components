<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SelectState } from './select.svelte';

	interface RootProps {
		children: Snippet;
	}

	let { children }: RootProps = $props();

	new SelectState();
</script>

{@render children()}
