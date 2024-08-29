interface ToastOptions<T> {
	autoDismiss?:
		| false
		| {
				duration: number;
		  };
	data: T;
}

export class Toaster<ToastData> {
	#toasts = $state<Toast<ToastData>[]>([]);

	addToast(toast: Toast<ToastData>) {
		this.#toasts.push(toast);

		return () => {
			this.#toasts = this.#toasts.filter((t) => t !== toast);
		};
	}
}

class Toast<T> {
	readonly data: T;
	readonly autoDismiss: false | number;

	constructor(data: T, autoDismiss: false | number = false) {
		this.data = data;
		this.autoDismiss = autoDismiss;
	}
}
