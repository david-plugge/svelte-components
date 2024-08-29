<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Popover } from './popover.svelte';
	import { fly } from 'svelte/transition';

	type RootProps = { children: Snippet };

	let { children }: RootProps = $props();

	const popover = getContext<Popover>(Popover);

	const content = popover.content();
</script>

{#if popover.open}
	<div
		class="z-20 rounded bg-white p-2 shadow"
		transition:fly={{ y: 4, duration: 150 }}
		{...content.props}
		use:content.action
	>
		{@render children()}
	</div>
{/if}
