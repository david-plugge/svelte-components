<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { Tabs, type TabsState } from './tabs.svelte';

	type RootProps = {
		children: Snippet<[Tabs]>;
		active: TabsState['active'];
	};

	let { children, active = $bindable() }: RootProps = $props();

	const tabs = new Tabs({
		...Tabs.defaults(),
		get active() {
			return active;
		},
		set active(v) {
			active = v;
		}
	});

	setContext(Tabs, tabs);
</script>

{@render children(tabs)}
