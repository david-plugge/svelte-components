<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SelectContent } from './select.svelte';

	interface ContentProps {
		children: Snippet;
	}

	let { children }: ContentProps = $props();

	const content = new SelectContent();
</script>

{#if content.open}
	<div {...content.props} use:content.action class="border bg-neutral-50 p-1">
		{@render children()}
	</div>
{/if}
