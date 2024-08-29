import {
	CalendarDate,
	DateFormatter,
	endOfMonth,
	endOfWeek,
	startOfMonth,
	startOfWeek,
	toZoned,
	type DateValue
} from '@internationalized/date';

type DateLike = string | Date | DateValue;

export function toDateValue(date: DateLike): DateValue {
	if (date instanceof Date) {
		return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
	}
	if (typeof date === 'string') {
		return toDateValue(new Date(date));
	}
	return date;
}

export function toDate(date: DateLike | DateValue, timezone: string): Date {
	if (date instanceof Date) {
		return date;
	}
	if (typeof date === 'string') {
		return new Date(date);
	}
	return date.toDate(timezone);
}

export function getDaysBetweenInclusive(start: DateValue, end: DateValue, fixed = false) {
	const days: DateValue[] = [];
	let dCurrent = start;
	const dEnd = end;

	while (dCurrent.compare(dEnd) <= 0) {
		days.push(dCurrent);
		dCurrent = dCurrent.add({ days: 1 });
	}

	if (fixed) {
		for (let i = days.length; i < 42; i++) {
			days.push(dCurrent);
			dCurrent = dCurrent.add({ days: 1 });
		}
	}

	return days;
}

export function getDaysInMonth(date: DateLike, locale: string, timezone: string, fixed = false) {
	const calendarDate = toDateValue(date);

	const firstDay = startOfWeek(startOfMonth(calendarDate), locale);
	const lastDay = endOfWeek(toZoned(endOfMonth(calendarDate), timezone), locale);

	return getDaysBetweenInclusive(firstDay, lastDay, fixed);
}

export function getWeekdays(locale: string, timezone: string) {
	const date = toDateValue(new Date());
	const firstDay = startOfWeek(date, locale);
	const formatter = new DateFormatter(locale, { weekday: 'short' });

	return Array.from({ length: 7 }, (_, i) => {
		const date = firstDay.add({ days: i });
		return formatter.format(toDate(date, timezone)).slice(0, 2);
	});
}
