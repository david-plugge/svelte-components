<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { Dialog, type DialogState } from './dialog.svelte';

	type RootProps = {
		children: Snippet<[Dialog]>;
		open?: DialogState['open'];
	};

	let { children, open = $bindable(false) }: RootProps = $props();

	const dialog = new Dialog({
		...Dialog.defaults(),
		get open() {
			return open;
		},
		set open(v) {
			open = v;
		}
	});

	setContext(Dialog, dialog);
</script>

{@render children(dialog)}
