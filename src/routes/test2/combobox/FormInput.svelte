<script lang="ts">
	import { getContext } from 'svelte';
	import { Combobox } from './combobox.svelte';

	let { name }: { name: string } = $props();
	const combobox = getContext<Combobox>(Combobox);
</script>

<input type="hidden" value={combobox.value} {name} />
