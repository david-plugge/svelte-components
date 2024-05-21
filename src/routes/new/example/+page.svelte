<script lang="ts">
	import Menu from './Menu.svelte';
	import Option from './Option.svelte';
	import Root from './Root.svelte';
	import Trigger from './Trigger.svelte';
</script>

<Root>
	<Trigger>Hello</Trigger>

	<Menu>
		<Option>
			{#snippet children(option)}
				Hello {option.disabled}
			{/snippet}
		</Option>
	</Menu>
</Root>
