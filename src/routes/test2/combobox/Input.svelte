<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Combobox } from './combobox.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type RootProps = HTMLInputAttributes;

	let { ...restProps }: RootProps = $props();

	const combobox = getContext<Combobox>(Combobox);

	const input = combobox.input();
</script>

<input
	{...restProps}
	{...input.props}
	use:input.action
	class="w-48 rounded-lg border px-4 py-2 text-left"
/>
