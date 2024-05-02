export function useActions(...actions: (() => void)[]) {
	return () => {
		actions.forEach((fn) => fn());
	};
}
