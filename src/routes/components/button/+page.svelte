<script lang="ts">
	import { Button } from '$lib/components/button';
</script>

<div class="mx-auto max-w-xl rounded-lg border p-16">
	<Button
		onclick={() => {
			console.log('click');
		}}
	>
		Click me
	</Button>
</div>
