<script lang="ts" context="module">
	export interface RootProps {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DialogState } from './state.svelte';

	let { children }: RootProps = $props();

	DialogState.provide();
</script>

{@render children?.()}
