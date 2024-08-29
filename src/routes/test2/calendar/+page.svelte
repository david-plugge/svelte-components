<script lang="ts">
	import {
		DateFormatter,
		getLocalTimeZone,
		isSameDay,
		isSameMonth,
		today,
		type DateValue
	} from '@internationalized/date';
	import { getDaysInMonth, toDate, getWeekdays } from './calendar';
	import { cn } from '$lib/utils/helpers';

	const locale = 'de';
	const timezone = getLocalTimeZone();

	let currentDay = $state(today(timezone));
	let focusDate = $state(currentDay);

	let selected = $state<DateValue | null>(null);

	const fullDateFormatter = $derived(new DateFormatter(locale, { dateStyle: 'full' }));
	const monthYearFormatter = $derived(
		new DateFormatter(locale, { month: 'long', year: 'numeric' })
	);
</script>

<div class="w-fit">
	<div class="flex items-center justify-between">
		<button
			onclick={() => (focusDate = focusDate.subtract({ months: 1 }))}
			class="flex size-8 items-center justify-center rounded-md border"
		>
			&leftarrow;
		</button>

		{monthYearFormatter.format(toDate(focusDate, timezone))}

		<button
			onclick={() => (focusDate = focusDate.add({ months: 1 }))}
			class="flex size-8 items-center justify-center rounded-md border"
		>
			&rightarrow;
		</button>
	</div>

	<div class="grid grid-cols-7 gap-y-1">
		{#each getWeekdays(locale, timezone) as day}
			<div class="flex size-8 items-center justify-center rounded-md text-center">
				{day}
			</div>
		{/each}

		{#each getDaysInMonth(focusDate, locale, timezone) as day}
			{@const isToday = isSameDay(day, currentDay)}
			{@const isCurrentMonth = isSameMonth(day, focusDate)}
			{@const isSelected = selected && isSameDay(day, selected)}

			<!-- svelte-ignore a11y_interactive_supports_focus -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				role={isCurrentMonth ? 'button' : undefined}
				aria-label={fullDateFormatter.format(toDate(day, timezone))}
				data-value={day.toString()}
				class={cn(
					'flex size-8 items-center justify-center rounded-md text-center transition-colors',
					isSelected
						? isCurrentMonth
							? 'bg-neutral-800 text-white'
							: 'bg-neutral-200 text-neutral-500'
						: isCurrentMonth
							? `${isToday ? 'text-red-500' : 'text-neutral-900'} hover:bg-neutral-100`
							: 'text-neutral-400'
				)}
				onclick={() => {
					if (!isCurrentMonth) return;
					selected = day;
				}}
			>
				{day.day}
			</div>
		{/each}
	</div>
</div>
