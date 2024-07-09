<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex">
	<aside class="sticky top-0 h-screen border-r">
		<nav class="flex flex-col gap-2 p-2">
			<a href="/">Home</a>
			<a href="/components/accordion">Accordion</a>
			<a href="/components/button">Button</a>
			<a href="/components/dialog">Dialog</a>
			<a href="/components/dropdown">Dropdown</a>
			<a href="/components/listbox">Listbox</a>
			<a href="/components/select">Select</a>
			<a href="/components/switch">Switch</a>
		</nav>
	</aside>

	<div class="overflow-auto px-4 py-2">
		{@render children()}
	</div>
</div>
