<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Select } from './select.svelte';

	type RootProps = { children?: Snippet; placeholder?: string };

	let { children, placeholder }: RootProps = $props();

	const select = getContext<Select>(Select);

	const trigger = select.trigger();
</script>

<button {...trigger.props} use:trigger.action class="w-48 rounded-lg border px-4 py-2 text-left">
	{#if children}
		{@render children()}
	{:else if Array.isArray(select.selected)}
		{select.selected.join(', ')}
	{:else if select.selected}
		{select.selected}
	{:else}
		{placeholder}
	{/if}
</button>
