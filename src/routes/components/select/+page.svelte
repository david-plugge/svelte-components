<script lang="ts">
	import { Select } from '$lib/builders/select.svelte';
	import { fly } from 'svelte/transition';

	const select = new Select();

	const trigger = select.trigger();
	const content = select.content();

	const items = [select.item(), select.item(), select.item()];
</script>

<button {...trigger.props} use:trigger.action>Select</button>

{#if select.open}
	<div {...content.props} use:content.action transition:fly={{ y: 10 }}>
		{#each items as item, i}
			<div {...item.props} use:item.action class="data-[highlighted]:bg-orange-200">
				item {i}
			</div>
		{/each}
	</div>
{/if}
