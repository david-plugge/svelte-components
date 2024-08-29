<script lang="ts">
	import { getContext } from 'svelte';
	import { Select } from './select.svelte';

	let { name }: { name: string } = $props();
	const select = getContext<Select>(Select);
</script>

{#if Array.isArray(select.selected)}
	{#each select.selected as item}
		<input type="hidden" value={item} {name} />
	{/each}
{:else if select.selected}
	<input type="hidden" value={select.selected} {name} />
{/if}
