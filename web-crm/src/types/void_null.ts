export type VOID_NULL = undefined | null;

/**
 * Проверка значения переменной на null или undefined
 * @param value 
 * @returns {boolean}
 */
export function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}
