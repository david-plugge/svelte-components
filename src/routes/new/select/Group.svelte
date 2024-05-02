<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ContentProps {
		children: Snippet;
	}

	let { children }: ContentProps = $props();
</script>

<div role="group">
	{@render children()}
</div>
