<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		asChild = false
	}: {
		children: Snippet;
		asChild?: boolean;
	} = $props();
</script>

{#if asChild}
	{@render children()}
{:else}
	<div>
		{@render children()}
	</div>
{/if}
