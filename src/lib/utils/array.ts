export function first<T>(list: T[]) {
	return list[0];
}

export function last<T>(list: T[]) {
	return list[list.length - 1];
}

export function next<T>(list: T[], currentIndex: number, loop = false) {
	if (currentIndex < 0) return first(list);
	if (currentIndex >= list.length - 1) {
		return loop ? first(list) : list[currentIndex];
	}
	return list[currentIndex + 1];
}

export function prev<T>(list: T[], currentIndex: number, loop = false) {
	if (currentIndex < 0) return last(list);
	if (currentIndex === 0) {
		return loop ? last(list) : first(list);
	}
	return list[currentIndex - 1];
}

export function forward<T>(list: T[], currentIndex: number, step: number, loop = false) {
	const nextIndex = currentIndex + step;
	if (nextIndex >= list.length) {
		return currentIndex === list.length - 1 && loop ? first(list) : last(list);
	}
	return list[nextIndex];
}

export function back<T>(list: T[], currentIndex: number, step: number, loop = false) {
	const nextIndex = currentIndex - step;
	if (nextIndex < 0) {
		return currentIndex === 0 && loop ? last(list) : first(list);
	}
	return list[nextIndex];
}
