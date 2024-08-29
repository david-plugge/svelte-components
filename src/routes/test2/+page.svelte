<script lang="ts">
	import * as Select from './select';
	import * as Combobox from './combobox';
	import * as Popover from './popover';
	import * as Dialog from './dialog';
	import * as Accordion from './accordion';
	import * as Collapsible from './collapsible';
	import * as Tabs from './tabs';
</script>

<div class="flex flex-col gap-6">
	<div class="rounded-lg border p-6">
		<div class="mb-4 text-xl">Select</div>

		<Select.Root>
			<Select.Trigger placeholder="Select..."></Select.Trigger>

			<Select.Content>
				<Select.Item value="one"></Select.Item>
				<Select.Item value="two"></Select.Item>
				<Select.Item value="three"></Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="rounded-lg border p-6">
		<div class="mb-4 text-xl">Combobox</div>

		<Combobox.Root>
			<Combobox.Input placeholder="Combobox..."></Combobox.Input>

			<Combobox.Content>
				<Combobox.Item value="one"></Combobox.Item>
				<Combobox.Item value="two"></Combobox.Item>
				<Combobox.Item value="three"></Combobox.Item>
			</Combobox.Content>
		</Combobox.Root>
	</div>

	<div class="rounded-lg border p-6">
		<div class="mb-4 text-xl">Popover</div>

		<Popover.Root>
			<Popover.Trigger>Open</Popover.Trigger>

			<Popover.Content>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia accusantium voluptates
				recusandae reiciendis eaque consequatur placeat modi facere. Quia veniam saepe optio facilis
				consequuntur facere dolorem molestiae officia ut vitae.
			</Popover.Content>
		</Popover.Root>
	</div>

	<div class="rounded-lg border p-6">
		<div class="mb-4 text-xl">Dialog</div>

		<Dialog.Root>
			<Dialog.Trigger>Open</Dialog.Trigger>

			<Dialog.Content>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia accusantium voluptates
				recusandae reiciendis eaque consequatur placeat modi facere. Quia veniam saepe optio facilis
				consequuntur facere dolorem molestiae officia ut vitae.
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<div class="rounded-lg border p-6">
		<div class="mb-4 text-xl">Collapsible</div>

		<Collapsible.Root>
			<Collapsible.Trigger>Open</Collapsible.Trigger>

			<Collapsible.Content>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia accusantium voluptates
				recusandae reiciendis eaque consequatur placeat modi facere. Quia veniam saepe optio facilis
				consequuntur facere dolorem molestiae officia ut vitae.
			</Collapsible.Content>
		</Collapsible.Root>
	</div>

	<div class="rounded-lg border p-6">
		<div class="mb-4 text-xl">Accordion</div>

		<Accordion.Root>
			<Accordion.Item id="one">
				<Accordion.Trigger>One</Accordion.Trigger>
				<Accordion.Content>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste temporibus, maxime
					necessitatibus ad, officiis, placeat ratione dolore voluptate in aperiam eveniet
					cupiditate nostrum? Beatae, incidunt voluptatum fuga libero ipsam eos?
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item id="two">
				<Accordion.Trigger>Two</Accordion.Trigger>
				<Accordion.Content>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste temporibus, maxime
					necessitatibus ad, officiis, placeat ratione dolore voluptate in aperiam eveniet
					cupiditate nostrum? Beatae, incidunt voluptatum fuga libero ipsam eos?
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item id="three">
				<Accordion.Trigger>Three</Accordion.Trigger>
				<Accordion.Content>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste temporibus, maxime
					necessitatibus ad, officiis, placeat ratione dolore voluptate in aperiam eveniet
					cupiditate nostrum? Beatae, incidunt voluptatum fuga libero ipsam eos?
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>

	<div class="rounded-lg border p-6">
		<div class="mb-4 text-xl">Tabs</div>

		<Tabs.Root active="a">
			<Tabs.Trigger id="a">Open</Tabs.Trigger>
			<Tabs.Trigger id="b">Open</Tabs.Trigger>
			<Tabs.Trigger id="c">Open</Tabs.Trigger>

			<Tabs.Content id="a">This is content A</Tabs.Content>
			<Tabs.Content id="b">This is content B</Tabs.Content>
			<Tabs.Content id="c">This is content C</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
