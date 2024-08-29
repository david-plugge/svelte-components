export interface CalendarState {
	date: Date | null;
}

export class Calendar {
	static defaults() {
		return {
			date: null
		} satisfies Partial<CalendarState>;
	}

	state = $state() as CalendarState;

	constructor(state: CalendarState = Calendar.defaults()) {
		this.state = state;
	}

	get date() {
		return this.state.date;
	}
	set date(v) {
		this.state.date = v;
	}
}
