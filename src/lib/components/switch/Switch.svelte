<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface SwitchProps extends HTMLButtonAttributes {
		children?: Snippet;
	}
</script>

<script lang="ts">
	let { children, ...rest }: SwitchProps = $props();

	let checked = $state(false);

	const buttonProps = $derived({
		'aria-haspopup': 'dialog',
		type: 'button',
		role: 'switch',
		get 'data-checked'() {
			return checked;
		},
		get 'aria-checked'() {
			return checked;
		},
		onclick: () => {
			checked = !checked;
		}
	} as const);

	const inputProps = $derived({
		type: 'checkbox',
		hidden: true,
		'aria-hidden': true,
		get checked() {
			return checked;
		}
	} as const);
</script>

<button {...buttonProps} {...rest} class="bg-green-300 p-4">
	{@render children?.()}
</button>

<input name="test" {...inputProps} />
