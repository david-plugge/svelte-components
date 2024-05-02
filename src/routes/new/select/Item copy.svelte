<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SelectItem } from './select.svelte';

	interface ContentProps {
		children: Snippet;
		value: any;
	}

	let { children, value }: ContentProps = $props();

	const item = new SelectItem(value);
</script>

<div
	{...item.props}
	use:item.action
	class="p-1"
	class:bg-green-200={item.selected}
	class:ring-2={item.focused}
>
	{@render children()}
</div>
