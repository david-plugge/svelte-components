<script lang="ts">
	import { portal } from '$lib/utils/portal';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	interface Toast {
		id: number;
		title: string;
		description: string;
		duration: number;
	}

	let id = 0;
	let toasts = $state<Toast[]>([]);

	const duration = 500;
</script>

<button
	onclick={() => {
		const _id = id++;
		toasts.push({
			id: _id,
			title: 'Event has been created',
			description: 'Sunday, December 03, 2023 at 9:00 AM.',
			duration: 3000
		});

		setTimeout(() => {
			const index = toasts.findIndex((t) => t.id === _id);
			toasts.splice(index, 1);
		}, 3000);
	}}
>
	Add
</button>

<div class="fixed bottom-6 right-6 isolate flex flex-col gap-4" use:portal>
	{#each toasts as toast, index (toast.id)}
		<div
			animate:flip={{ duration }}
			transition:fly={{ y: '100%', duration }}
			class="w-80 rounded-lg border bg-neutral-50 p-4 shadow"
			style:z-index={index}
		>
			<div>{toast.title}</div>
			<div class="text-sm text-neutral-700">{toast.description}</div>
		</div>
	{/each}
</div>
