<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SelectLabel } from './select.svelte';

	interface LabelProps {
		children: Snippet;
	}

	let { children }: LabelProps = $props();

	const label = new SelectLabel();
</script>

<div {...label.props} use:label.action class="p-1">
	{@render children()}
</div>
