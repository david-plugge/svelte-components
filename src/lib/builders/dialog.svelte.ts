export class Dialog {
	#open = $state(false);

	constructor() {}

	get open() {
		return this.#open;
	}
	set open(value) {
		this.#open = value;
	}

	trigger() {
		return {};
	}

	portalled() {
		return {};
	}

	overlay() {
		return {};
	}

	content() {
		return {};
	}
}

interface Trigger {
	id: 'trigger-id';
	type: 'button';
	'aria-haspopup': 'dialog';
	'aria-expanded': boolean;
}

interface Overlay {
	id: 'overlay-id';
	'aria-hidden': true;
	'tab-index': -1;
}

interface Content {
	id: 'content-id';
	'aria-labelledby': 'title-id';
	'aria-describedby': 'description-id';
	'tab-index': -1;
	'aria-modal': true;
	role: 'dialog';
}

interface Title {
	id: 'title-id';
}

interface Description {
	id: 'description-id';
}

interface Close {
	type: 'button';
	'aria-label': 'close';
}
