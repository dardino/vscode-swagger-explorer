/* eslint-disable eqeqeq */
export function sortBy<T>(array: T[], f: (a: T) => T[keyof T]): T[] {
	return array.sort((a, b) => {
		const valueOfA = f(a);
		const valueOfB = f(b);
		if (valueOfA == valueOfB) {
			return 0;
		}
		if (a == null) {
			return -1;
		}
		if (b == null) {
			return 1;
		}
		if (typeof valueOfA === "string") {
			return valueOfA.localeCompare(valueOfB as string);
		}
		if (typeof valueOfA === "number") {
			return valueOfA - (valueOfB as number);
		}
		if (valueOfA instanceof Date) {
			return valueOfA.valueOf() - (valueOfB as Date).valueOf();
		}
		return 0;
	});
}
