export function useActions(...actions: (() => void)[]) {
	return () => {
		actions.forEach((fn) => fn());
	};
}

export function createAction(...actions: (() => void)[]) {
	return {
		destroy: useActions(...actions)
	};
}
