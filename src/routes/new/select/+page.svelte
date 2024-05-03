<script lang="ts">
	import Content from './Content.svelte';
	import Group from './Group.svelte';
	import Item from './Item.svelte';
	import Label from './Label.svelte';
	import Root from './Root.svelte';
	import Trigger from './Trigger.svelte';
</script>

<Root>
	<Trigger>Select something</Trigger>

	<Content>
		<Group>
			<Label>Text</Label>
			<Item value={1}>1</Item>
			<Item value={2}>2</Item>
			<Item value={3}>3</Item>
			<Item value={4}>4</Item>
		</Group>
	</Content>
</Root>
