<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { Calendar, type CalendarState } from './calendar.svelte';

	type RootProps = {
		children: Snippet<[Calendar]>;
		date?: CalendarState['date'];
	};

	let { children, date = $bindable(null) }: RootProps = $props();

	const calendar = new Calendar({
		...Calendar.defaults(),
		get date() {
			return date;
		},
		set date(v) {
			date = v;
		}
	});

	setContext(Calendar, calendar);
</script>

{@render children(calendar)}
