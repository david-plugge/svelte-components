<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SelectGroup } from './select.svelte';

	interface ContentProps {
		children: Snippet;
	}

	let { children }: ContentProps = $props();

	const group = new SelectGroup();
</script>

<div {...group.props} use:group.action>
	{@render children()}
</div>
