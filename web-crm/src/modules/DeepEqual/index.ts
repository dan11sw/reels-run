
/**
 * Глубокое сравнение двух объектов
 * @param a Объект a
 * @param b Объект b
 * @returns Результат сравнения двух объектов
 */
export function deepEqual<T>(a: T, b: T): boolean {
    if (a === b) {
        return true;
    }

    if (a && b && (typeof a === "object") && (typeof b === "object")) {
        if (a.constructor !== b.constructor) {
            return false;
        }

        let length: number, i: any;
        let keys: string[] = [];

        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }

            length = a.length;
            if (length !== b.length) {
                return false;
            }

            for (i = length; i-- !== 0;) {
                if (!deepEqual(a[i], b[i])) {
                    return false;
                }
            }

            return true;
        }

        if ((a instanceof Map) && (b instanceof Map)) {
            if (a.size !== b.size) {
                return false;
            }

            for (i of a.entries()) {
                if (!b.has(i[0])) {
                    return false;
                }
            }

            for (i of a.entries()) {
                if (!deepEqual(i[1], b.get(i[0]))) {
                    return false;
                }
            }

            return true;
        }

        if ((a instanceof Set) && (b instanceof Set)) {
            if (a.size !== b.size) {
                return false;
            }

            for (i of a.entries()) {
                if (!b.has(i[0])) {
                    return false;
                }
            }

            return true;
        }

        if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
            length = (a as any).length;

            if (length !== (b as any).length) {
                return false;
            }

            for (i = length; i-- !== 0;) {
                if ((a as any)[i] !== (b as any)[i]) {
                    return false;
                }
            }

            return true;
        }

        if (a instanceof RegExp || a.constructor === RegExp) {
            return (
                a.source === (b as any as RegExp).source &&
                a.flags === (b as any as RegExp).flags
            );
        }

        if (a?.valueOf !== Object.prototype.valueOf) {
            return a?.valueOf() === (b as any).valueOf();
        }

        if (a?.toString !== Object.prototype.toString) {
            return a.toString() === (b as any).toString();
        }

        keys = Object.keys(a);
        length = keys.length;

        if (length !== Object.keys(b).length) {
            return false;
        }

        for (i = length; i-- !== 0;) {
            if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
                return false;
            }
        }

        for (i = length; i-- !== 0;) {
            const key = keys[i];

            if (key === '_owner' && (a as any).$$typeof) {
                continue;
            }

            if (!deepEqual((a as any)[key], (b as any)[key])) {
                return false;
            }
        }

        return true;
    }

    return (a !== a) && (b !== b);
}