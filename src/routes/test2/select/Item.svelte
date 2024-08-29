<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Select } from './select.svelte';

	type RootProps = { children?: Snippet; value: string; label?: string };

	let { children, value, label = value }: RootProps = $props();

	const select = getContext<Select>(Select);

	const item = select.item(value, label);
</script>

<div
	{...item.props}
	use:item.action
	class="w-full px-2 {item.selected ? 'bg-blue-200' : 'hover:bg-neutral-100'}"
>
	{#if children}
		{@render children()}
	{:else}
		{label}
	{/if}
</div>
