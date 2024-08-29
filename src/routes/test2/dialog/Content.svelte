<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Dialog } from './dialog.svelte';
	import { fade, fly } from 'svelte/transition';

	type RootProps = { children: Snippet };

	let { children }: RootProps = $props();

	const dialog = getContext<Dialog>(Dialog);

	const content = dialog.content();
</script>

{#if dialog.open}
	<div
		class="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center overflow-hidden rounded bg-black/25 p-4"
		transition:fade={{ duration: 150 }}
		{...content.props}
		use:content.action
	>
		<div
			transition:fly={{ y: 10, duration: 150 }}
			class="max-h-full max-w-full overflow-auto rounded-lg bg-white p-4 shadow"
		>
			{@render children()}
		</div>
	</div>
{/if}
